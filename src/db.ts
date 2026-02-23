import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dbPath = path.resolve(process.cwd(), "database.sqlite");
const db = new Database(dbPath);

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    images TEXT,
    videoUrl TEXT,
    howItWorks TEXT,
    checklistOptions TEXT,
    benefits TEXT,
    modules TEXT,
    accreditation TEXT,
    accreditationLogo TEXT,
    whatsappNumber TEXT
  );

  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    serviceId INTEGER,
    name TEXT,
    surname TEXT,
    companyName TEXT,
    tel TEXT,
    email TEXT,
    address TEXT,
    notes TEXT,
    checklist TEXT,
    employees TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (serviceId) REFERENCES services(id)
  );

  CREATE TABLE IF NOT EXISTS job_cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    leadId INTEGER,
    clientName TEXT,
    serviceTitle TEXT,
    date TEXT,
    status TEXT DEFAULT 'Pending',
    items TEXT,
    trainees TEXT,
    courses TEXT,
    totalCost REAL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (leadId) REFERENCES leads(id)
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );

  CREATE TABLE IF NOT EXISTS past_jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    images TEXT,
    videoUrl TEXT,
    bulletPoints TEXT
  );
`);

// Seed initial past jobs if empty
const jobCount = db.prepare("SELECT COUNT(*) as count FROM past_jobs").get() as { count: number };
if (jobCount.count === 0) {
  const insertJob = db.prepare(`
    INSERT INTO past_jobs (title, description, images, videoUrl, bulletPoints)
    VALUES (?, ?, ?, ?, ?)
  `);

  const defaultJobs = [
    {
      title: "Logistics Hub Forklift Certification",
      description: "Conducted a mass certification program for a major regional distribution center. Over 45 operators were trained and certified on Counterbalance and Reach trucks within a 2-week window, ensuring zero downtime for the client.",
      images: JSON.stringify([
        "https://picsum.photos/seed/job1/1200/800",
        "https://picsum.photos/seed/job1b/1200/800",
        "https://picsum.photos/seed/job1c/1200/800"
      ]),
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      howItWorks: JSON.stringify([
        "Certified 45+ operators in 14 days",
        "Implemented new pre-shift inspection protocols",
        "Reduced equipment damage reports by 30%",
        "On-site theory and practical assessments"
      ])
    },
    {
      title: "Construction Site Height Safety Audit",
      description: "Provided specialized height safety training and equipment audits for a high-rise residential development. Our team certified 15 scaffolding supervisors and implemented a new harness inspection regime.",
      images: JSON.stringify([
        "https://picsum.photos/seed/job2/1200/800",
        "https://picsum.photos/seed/job2b/1200/800"
      ]),
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      howItWorks: JSON.stringify([
        "Zero fall incidents recorded during build",
        "Advanced rescue-from-height protocols",
        "Harness and lanyard inspection training",
        "Daily safety briefing integration"
      ])
    },
    {
      title: "Agricultural Cooperative Tractor Safety",
      description: "A large-scale training initiative for a farming cooperative, focusing on safe tractor operation and implement handling for seasonal workers. Training was delivered in multiple languages to ensure full comprehension.",
      images: JSON.stringify([
        "https://picsum.photos/seed/job3/1200/800",
        "https://picsum.photos/seed/job3b/1200/800"
      ]),
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      howItWorks: JSON.stringify([
        "Multi-lingual training delivery",
        "Focus on PTO and trailer safety",
        "Field-based practical assessments",
        "Maintenance and daily check routines"
      ])
    }
  ];

  for (const job of defaultJobs) {
    insertJob.run(job.title, job.description, job.images, job.videoUrl, job.bulletPoints);
  }
}

// Seed initial services if empty
const count = db.prepare("SELECT COUNT(*) as count FROM services").get() as { count: number };
if (count.count === 0) {
  const insertService = db.prepare(`
    INSERT INTO services (title, description, icon, images, videoUrl, howItWorks, checklistOptions, benefits, modules, accreditation, whatsappNumber)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const defaultServices = [
    {
      title: "Counterbalance Forklift (Novice)",
      description: "Comprehensive 5-day training for beginners on counterbalance forklift trucks. Covers pre-use inspections, load handling, and safe maneuvering in tight spaces.",
      icon: "Forklift",
      images: JSON.stringify(["https://picsum.photos/seed/fl1/800/600", "https://picsum.photos/seed/fl2/800/600"]),
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      howItWorks: JSON.stringify(["Theory & Safety Legislation", "Pre-Shift Inspections", "Basic Steering & Maneuvering", "Stacking & De-stacking", "Practical & Theory Testing"]),
      checklistOptions: JSON.stringify(["B1 (Up to 5t)", "B2 (5t to 15t)", "B3 (Over 15t)", "Refresher Course"]),
      benefits: JSON.stringify([{ title: "RTITB Accredited", description: "Nationally recognized certification." }, { title: "Safety First", description: "Drastically reduce workplace accidents." }]),
      modules: JSON.stringify([{ title: "Health & Safety", text: "HASWA 1974 and PUWER 98 regulations." }, { title: "Stability", text: "Understanding the stability triangle and center of gravity." }]),
      accreditation: "RTITB Accredited Certificate",
      whatsappNumber: "+44123456789"
    },
    {
      title: "Agricultural Tractor (Lantra)",
      description: "Professional tractor operation and maintenance training for agricultural and industrial use. Includes trailer hitching and PTO safety.",
      icon: "Tractor",
      images: JSON.stringify(["https://picsum.photos/seed/tr1/800/600", "https://picsum.photos/seed/tr2/800/600"]),
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      howItWorks: JSON.stringify(["Daily Maintenance Checks", "Safe Driving Techniques", "Implement Attachment (3-point linkage)", "PTO Safety & Operation", "Reversing with Trailers"]),
      checklistOptions: JSON.stringify(["Basic Operation", "Advanced Implements", "Road Safety", "PTO Specialization"]),
      benefits: JSON.stringify([{ title: "Lantra Awards", description: "Industry standard for land-based sectors." }]),
      modules: JSON.stringify([{ title: "Daily Checks", text: "Oil, water, tires, and safety guards." }]),
      accreditation: "Lantra Awards Certification",
      whatsappNumber: "+44123456789"
    },
    {
      title: "Emergency First Aid at Work",
      description: "A 1-day course designed for low-risk work environments. Learn life-saving skills including CPR, choking, and wound management.",
      icon: "HeartPulse",
      images: JSON.stringify(["https://picsum.photos/seed/fa1/800/600", "https://picsum.photos/seed/fa2/800/600"]),
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      howItWorks: JSON.stringify(["Primary Survey (DRABC)", "CPR & AED Usage", "Managing Unconscious Casualties", "Choking & Bleeding Control", "Shock & Minor Injuries"]),
      checklistOptions: JSON.stringify(["1-Day EFAW", "3-Day FAW", "AED Training", "Paediatric First Aid"]),
      benefits: JSON.stringify([{ title: "HSE Compliant", description: "Meets Health and Safety Executive requirements." }]),
      modules: JSON.stringify([{ title: "Resuscitation", text: "Adult CPR and use of an Automated External Defibrillator." }]),
      accreditation: "Qualsafe Awards Approved",
      whatsappNumber: "+44123456789"
    },
    {
      title: "Working at Heights (IPAF)",
      description: "Essential training for the safe use of Mobile Elevating Work Platforms (MEWPs). Covers Scissor Lifts (3a) and Cherry Pickers (3b).",
      icon: "Mountain",
      images: JSON.stringify(["https://picsum.photos/seed/wh1/800/600", "https://picsum.photos/seed/wh2/800/600"]),
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      howItWorks: JSON.stringify(["Pre-use Inspection", "Emergency Lowering Procedures", "Safe Positioning", "Harness & Lanyard Usage", "Practical Assessment"]),
      checklistOptions: JSON.stringify(["3a (Scissor Lift)", "3b (Cherry Picker)", "1b (Static Boom)", "Harness Awareness"]),
      benefits: JSON.stringify([{ title: "PAL Card", description: "Recognized worldwide for height safety." }]),
      modules: JSON.stringify([{ title: "Site Safety", text: "Identifying overhead hazards and ground conditions." }]),
      accreditation: "IPAF PAL Card",
      whatsappNumber: "+44123456789"
    },
    {
      title: "Health & Safety Awareness",
      description: "A foundational course for construction workers and site visitors. Covers the basics of site safety, risk assessment, and personal protective equipment.",
      icon: "ShieldAlert",
      images: JSON.stringify(["https://picsum.photos/seed/hs1/800/600", "https://picsum.photos/seed/hs2/800/600"]),
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      howItWorks: JSON.stringify(["Legal Responsibilities", "Risk Assessment Basics", "Manual Handling", "Fire Safety & COSHH", "Accident Reporting"]),
      checklistOptions: JSON.stringify(["CSCS Green Card Prep", "Site Safety Plus", "Risk Assessment Workshop", "COSHH Awareness"]),
      benefits: JSON.stringify([{ title: "CSCS Path", description: "Required for the Green Laborer Card." }]),
      modules: JSON.stringify([{ title: "PPE", text: "Correct selection and use of safety equipment." }]),
      accreditation: "CITB Site Safety Plus",
      whatsappNumber: "+44123456789"
    }
  ];

  for (const service of defaultServices) {
    insertService.run(
      service.title,
      service.description,
      service.icon,
      service.images,
      service.videoUrl,
      service.howItWorks,
      service.checklistOptions,
      service.benefits,
      service.modules,
      service.accreditation,
      service.whatsappNumber
    );
  }
}

// Seed settings if empty
const settingsCount = db.prepare("SELECT COUNT(*) as count FROM settings").get() as { count: number };
if (settingsCount.count === 0) {
  const insertSetting = db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)");
  
  const defaultSettings = {
    header: JSON.stringify({
      logoText: "TR",
      siteName: "TrainingPro",
      navLinks: [
        { label: "Home", path: "/" },
        { label: "Catalog", path: "/catalog" },
        { label: "About", path: "/about" },
        { label: "Locations", path: "/locations" }
      ]
    }),
    footer: JSON.stringify({
      copyright: "TrainingPro Inc. All rights reserved.",
      socialLinks: [
        { id: "1", platform: "Facebook", url: "#", icon: "" },
        { id: "2", platform: "Twitter", url: "#", icon: "" },
        { id: "3", platform: "Instagram", url: "#", icon: "" },
        { id: "4", platform: "LinkedIn", url: "#", icon: "" }
      ]
    }),
    locations: JSON.stringify({
      heroImage: "https://picsum.photos/seed/hq/1920/1080"
    }),
    home: JSON.stringify({
      heroImages: [
        "https://picsum.photos/seed/hero1/1920/1080",
        "https://picsum.photos/seed/hero2/1920/1080",
        "https://picsum.photos/seed/hero3/1920/1080"
      ],
      teaserText: "Delivering industry-leading safety and operational training since 2010. We equip your workforce with the skills they need to succeed safely.",
      pastJobsImages: [
        "https://picsum.photos/seed/job1/800/600",
        "https://picsum.photos/seed/job2/800/600",
        "https://picsum.photos/seed/job3/800/600",
        "https://picsum.photos/seed/job4/800/600",
        "https://picsum.photos/seed/job5/800/600"
      ]
    }),
    about: JSON.stringify({
      heroImage: "https://picsum.photos/seed/about/1920/1080",
      mission: "To empower workforces with the knowledge, skills, and confidence to operate safely and efficiently in demanding industrial environments. We believe that every worker deserves to return home safely.",
      vision: "To be the undisputed leader in industrial and safety training, setting the benchmark for educational excellence and practical application across the nation.",
      milestones: [
        { year: "2010", title: "Founded", desc: "Started as a small local training provider." },
        { year: "2015", title: "Expansion", desc: "Opened our second facility and expanded course offerings." },
        { year: "2018", title: "National Accreditation", desc: "Achieved national recognition for safety standards." },
        { year: "2023", title: "Digital Transformation", desc: "Launched online hybrid training programs." }
      ]
    }),
    company_details: JSON.stringify({
      name: "TrainingPro Inc.",
      address: "123 Safety Lane, Industrial Park, London, UK",
      phone: "+44 123 456 7890",
      email: "info@trainingpro.com",
      openHours: "Mon-Fri: 9am - 5pm",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.540423056448!2d-0.12775838422988!3d51.50735097963484!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487604c38c8cd1d9%3A0xb78f2474b9a45aa9!2sBig%20Ben!5e0!3m2!1sen!2suk!4v1629812345678!5m2!1sen!2suk",
      logo: ""
    }),
    theme_settings: JSON.stringify({
      primaryColor: "#facc15", // yellow-400
      secondaryColor: "#0f172a", // slate-900
      fontFamily: "Inter"
    })
  };

  for (const [key, value] of Object.entries(defaultSettings)) {
    insertSetting.run(key, value);
  }
}

// Seed initial leads if empty
const leadCount = db.prepare("SELECT COUNT(*) as count FROM leads").get() as { count: number };
if (leadCount.count === 0) {
  const insertLead = db.prepare(`
    INSERT INTO leads (serviceId, name, surname, companyName, tel, email, address, notes, checklist, employees)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const mockLeads = [
    {
      serviceId: 1,
      name: "John",
      surname: "Doe",
      companyName: "Acme Corp",
      tel: "+44 7700 900000",
      email: "john.doe@acmecorp.com",
      address: "123 Industrial Way, London",
      notes: "Looking for group training for 5 people.",
      checklist: JSON.stringify(["First Aid", "Fire Safety"]),
      employees: JSON.stringify([
        { name: "Alice Smith", age: "28", jobTitle: "Safety Officer", whatsapp: "+44 7700 900001" },
        { name: "Bob Jones", age: "35", jobTitle: "Warehouse Manager", whatsapp: "+44 7700 900002" }
      ])
    },
    {
      serviceId: 2,
      name: "Sarah",
      surname: "Connor",
      companyName: "Cyberdyne Systems",
      tel: "+44 7700 900111",
      email: "s.connor@cyberdyne.com",
      address: "Tech Plaza, Manchester",
      notes: "Urgent training needed for new recruits.",
      checklist: JSON.stringify(["Basic Operation"]),
      employees: JSON.stringify([
        { name: "Kyle Reese", age: "30", jobTitle: "Technician", whatsapp: "+44 7700 900112" }
      ])
    },
    {
      serviceId: 1,
      name: "Mike",
      surname: "Ross",
      companyName: "Pearson Specter",
      tel: "+44 7700 900222",
      email: "m.ross@ps.com",
      address: "Legal Heights, London",
      notes: "Interested in the advanced module.",
      checklist: JSON.stringify(["Risk Assessment"]),
      employees: JSON.stringify([])
    }
  ];

  for (const lead of mockLeads) {
    insertLead.run(
      lead.serviceId,
      lead.name,
      lead.surname,
      lead.companyName,
      lead.tel,
      lead.email,
      lead.address,
      lead.notes,
      lead.checklist,
      lead.employees
    );
  }
}

export default db;
