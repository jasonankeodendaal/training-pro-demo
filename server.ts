import express from "express";
import { createServer as createViteServer } from "vite";
import db from "./src/db.ts";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadDir = process.env.VERCEL ? path.join("/tmp", "uploads") : path.resolve(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|mp4/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Error: File upload only supports the following filetypes - " + filetypes));
  }
});

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/uploads", express.static(uploadDir));

async function setupServer() {
  // API Routes
  app.post("/api/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    res.json({ filePath: `/uploads/${req.file.filename}` });
  });

  app.post("/api/services", (upload.single("file") as any), (req: any, res: any) => {
    try {
      const { title, description, icon, images, videoUrl, howItWorks, checklistOptions, benefits, modules, accreditation, accreditationLogo, whatsappNumber } = req.body;
      const stmt = db.prepare(`
        INSERT INTO services (title, description, icon, images, videoUrl, howItWorks, checklistOptions, benefits, modules, accreditation, accreditationLogo, whatsappNumber)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const info = stmt.run(title, description, icon, images, videoUrl, howItWorks, checklistOptions, benefits, modules, accreditation, accreditationLogo, whatsappNumber);
      res.status(201).json({ id: info.lastInsertRowid, message: "Service created successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to create service" });
    }
  });

  app.get("/api/services", (req, res) => {
    try {
      const services = db.prepare("SELECT * FROM services").all();
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  app.get("/api/services/:id", (req, res) => {
    try {
      const service = db.prepare("SELECT * FROM services WHERE id = ?").get(req.params.id);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }
      res.json(service);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch service" });
    }
  });

  app.put("/api/services/:id", (req, res) => {
    try {
      const { title, description, icon, images, videoUrl, howItWorks, checklistOptions, benefits, modules, accreditation, accreditationLogo, whatsappNumber } = req.body;
      const stmt = db.prepare(`
        UPDATE services 
        SET title = ?, description = ?, icon = ?, images = ?, videoUrl = ?, howItWorks = ?, checklistOptions = ?, benefits = ?, modules = ?, accreditation = ?, accreditationLogo = ?, whatsappNumber = ?
        WHERE id = ?
      `);
      stmt.run(title, description, icon, images, videoUrl, howItWorks, checklistOptions, benefits, modules, accreditation, accreditationLogo, whatsappNumber, req.params.id);
      res.json({ message: "Service updated successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to update service" });
    }
  });

  app.get("/api/settings/:key", (req, res) => {
    try {
      const row = db.prepare("SELECT value FROM settings WHERE key = ?").get(req.params.key) as { value: string };
      if (!row) {
        return res.status(404).json({ error: "Setting not found" });
      }
      res.json(JSON.parse(row.value));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.put("/api/settings/:key", (req, res) => {
    try {
      const value = JSON.stringify(req.body);
      const stmt = db.prepare("UPDATE settings SET value = ? WHERE key = ?");
      stmt.run(value, req.params.key);
      res.json({ message: "Settings updated successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  app.post("/api/leads", (req, res) => {
    try {
      const { name, surname, companyName, tel, email, address, notes, serviceId, checklist, employees } = req.body;
      
      const stmt = db.prepare(`
        INSERT INTO leads (name, surname, companyName, tel, email, address, notes, serviceId, checklist, employees)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run(name, surname, companyName, tel, email, address, notes, serviceId, JSON.stringify(checklist), JSON.stringify(employees));
      res.status(201).json({ message: "Lead submitted successfully" });
    } catch (error) {
      console.error("Error submitting lead:", error);
      res.status(500).json({ error: "Failed to submit lead" });
    }
  });

  app.get("/api/admin/leads", (req, res) => {
    try {
      const leads = db.prepare(`
        SELECT leads.*, services.title as serviceTitle 
        FROM leads 
        LEFT JOIN services ON leads.serviceId = services.id
        ORDER BY leads.createdAt DESC
      `).all();
      res.json(leads);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch leads" });
    }
  });

  app.get("/api/admin/job-cards", (req, res) => {
    try {
      const cards = db.prepare(`
        SELECT 
          job_cards.*,
          leads.name as leadContactName,
          leads.surname as leadContactSurname,
          leads.email as leadEmail,
          leads.tel as leadTel,
          leads.address as leadAddress,
          leads.notes as leadNotes,
          leads.checklist as leadChecklist,
          leads.employees as leadEmployees
        FROM job_cards 
        LEFT JOIN leads ON job_cards.leadId = leads.id
        ORDER BY job_cards.createdAt DESC
      `).all();
      res.json(cards);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch job cards" });
    }
  });

  app.post("/api/admin/job-cards", (req, res) => {
    try {
      const { leadId, clientName, serviceTitle, date, items, trainees, courses, totalCost } = req.body;
      const stmt = db.prepare(`
        INSERT INTO job_cards (leadId, clientName, serviceTitle, date, items, trainees, courses, totalCost)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(leadId, clientName, serviceTitle, date, JSON.stringify(items), JSON.stringify(trainees), JSON.stringify(courses), totalCost || 0);
      res.status(201).json({ message: "Job card created successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to create job card" });
    }
  });

  app.put("/api/admin/job-cards/:id", (req, res) => {
    try {
      const { status } = req.body;
      const stmt = db.prepare("UPDATE job_cards SET status = ? WHERE id = ?");
      stmt.run(status, req.params.id);
      res.json({ message: "Job card updated successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to update job card" });
    }
  });

  app.get("/api/jobs", (req, res) => {
    try {
      const jobs = db.prepare("SELECT * FROM past_jobs").all();
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch jobs" });
    }
  });

  app.get("/api/jobs/:id", (req, res) => {
    try {
      const job = db.prepare("SELECT * FROM past_jobs WHERE id = ?").get(req.params.id);
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }
      res.json(job);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch job" });
    }
  });

  app.post("/api/jobs", (req, res) => {
    try {
      const { title, description, images, videoUrl, bulletPoints } = req.body;
      const stmt = db.prepare(`
        INSERT INTO past_jobs (title, description, images, videoUrl, bulletPoints)
        VALUES (?, ?, ?, ?, ?)
      `);
      const info = stmt.run(title, description, images, videoUrl, bulletPoints);
      res.status(201).json({ id: info.lastInsertRowid, message: "Job created successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to create job" });
    }
  });

  app.put("/api/jobs/:id", (req, res) => {
    try {
      const { title, description, images, videoUrl, bulletPoints } = req.body;
      const stmt = db.prepare(`
        UPDATE past_jobs 
        SET title = ?, description = ?, images = ?, videoUrl = ?, bulletPoints = ?
        WHERE id = ?
      `);
      stmt.run(title, description, images, videoUrl, bulletPoints, req.params.id);
      res.json({ message: "Job updated successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to update job" });
    }
  });

  app.delete("/api/jobs/:id", (req, res) => {
    try {
      const stmt = db.prepare("DELETE FROM past_jobs WHERE id = ?");
      stmt.run(req.params.id);
      res.json({ message: "Job deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete job" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  const defaultContactForm = [
    { name: 'name', label: 'First Name', type: 'text', required: true },
    { name: 'surname', label: 'Last Name', type: 'text', required: true },
    { name: 'email', label: 'Email Address', type: 'email', required: true },
    { name: 'tel', label: 'Phone Number', type: 'tel', required: true },
    { name: 'message', label: 'Message', type: 'textarea', required: true }
  ];

  const defaultCourseForm = [
    { name: 'name', label: 'Company/Individual Name', type: 'text', required: true },
    { name: 'email', label: 'Email Address', type: 'email', required: true },
    { name: 'tel', label: 'Phone Number', type: 'tel', required: true },
    { name: 'employees_count', label: 'Number of Employees', type: 'number', required: false },
    { name: 'notes', label: 'Special Requirements', type: 'textarea', required: false }
  ];

  const initSettings = () => {
    const contactForm = db.prepare("SELECT value FROM settings WHERE key = 'contact_form'").get();
    if (!contactForm) {
      db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)").run('contact_form', JSON.stringify(defaultContactForm));
    }
    const courseForm = db.prepare("SELECT value FROM settings WHERE key = 'course_form'").get();
    if (!courseForm) {
      db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)").run('course_form', JSON.stringify(defaultCourseForm));
    }
  };
  initSettings();
}

setupServer();

if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
