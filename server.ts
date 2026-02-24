import express from "express";
import { createServer as createViteServer } from "vite";
import { getServices, getServiceById, getJobs, getJobById } from './src/lib/api';

  app.get("/api/services", async (req, res) => {
    try {
      const services = await getServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.get("/api/services/:id", async (req, res) => {
    try {
      const service = await getServiceById(parseInt(req.params.id));
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }
      res.json(service);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  

  app.get("/api/jobs", async (req, res) => {
    try {
      const jobs = await getJobs();
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const job = await getJobById(parseInt(req.params.id));
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }
      res.json(job);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  

  

  

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve static files from dist
    const distPath = path.resolve(process.cwd(), "dist");
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get("*", (req, res, next) => {
        if (req.path.startsWith("/api")) return next();
        res.sendFile(path.resolve(distPath, "index.html"));
      });
    }
  }

  
}

setupServer();

if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
