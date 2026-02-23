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
      title: "Major Warehouse Safety Overhaul",
      description: "We conducted a full-scale safety audit and training program for a 500,000 sq ft logistics hub. This involved certifying over 200 forklift operators and implementing new emergency protocols.",
      images: JSON.stringify([
        "https://picsum.photos/seed/job1/1200/800",
        "https://picsum.photos/seed/job1b/1200/800",
        "https://picsum.photos/seed/job1c/1200/800"
      ]),
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      bulletPoints: JSON.stringify([
        "Certified 200+ operators in 3 weeks",
        "Reduced workplace incidents by 45% in the first quarter",
        "Implemented digital tracking for equipment maintenance",
        "Conducted night-shift specific safety drills"
      ])
    },
    {
      title: "Offshore Rig Safety Training",
      description: "Our specialized team traveled to the North Sea to provide advanced working-at-heights and rescue training for offshore personnel. The environment required high-intensity practical simulations.",
      images: JSON.stringify([
        "https://picsum.photos/seed/job2/1200/800",
        "https://picsum.photos/seed/job2b/1200/800"
      ]),
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      bulletPoints: JSON.stringify([
        "Specialized rescue-at-sea protocols",
        "High-wind environment harness training",
        "Emergency evacuation coordination",
        "Multi-agency communication drills"
      ])
    },
    {
      title: "Agricultural Fleet Certification",
      description: "Working with a large farming cooperative, we certified a fleet of 50 tractor operators across multiple locations. The focus was on modern GPS-guided machinery and road safety.",
      images: JSON.stringify([
        "https://picsum.photos/seed/job3/1200/800",
        "https://picsum.photos/seed/job3b/1200/800"
      ]),
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      bulletPoints: JSON.stringify([
        "GPS and autonomous machinery training",
        "Public road transit safety compliance",
        "Attachment and implement handling",
        "Soil compaction prevention techniques"
      ])
    },
    {
      title: "Construction Site Height Safety",
      description: "Provided comprehensive scaffolding and MEWP training for a major city center development project. Our training ensured zero fall incidents during the 18-month build phase.",
      images: JSON.stringify([
        "https://picsum.photos/seed/job4/1200/800",
        "https://picsum.photos/seed/job4b/1200/800"
      ]),
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      bulletPoints: JSON.stringify([
        "Zero fall incidents recorded",
        "Daily equipment inspection training",
        "Advanced harness and lanyard systems",
        "Coordinated rescue plans for crane operators"
      ])
    },
    {
      title: "Corporate First Aid Rollout",
      description: "Implemented a company-wide first aid responder program for a multinational tech firm. We trained 10% of the workforce to ensure immediate response capability across all floors.",
      images: JSON.stringify([
        "https://picsum.photos/seed/job5/1200/800",
        "https://picsum.photos/seed/job5b/1200/800"
      ]),
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      bulletPoints: JSON.stringify([
        "Trained 150+ corporate responders",
        "AED installation and training across 5 sites",
        "Mental health first aid integration",
        "Customized emergency response mobile app"
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
    INSERT INTO services (title, description, icon, images, videoUrl, howItWorks, checklistOptions, benefits, modules, accreditation, accreditationLogo, whatsappNumber)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const defaultServices = [
    {
      title: "CPCS Plant Training",
      description: "Industry-standard certification for plant machinery operation. We provide comprehensive training for excavators, dumpers, and telehandlers with both theory and practical assessments.",
      icon: "Tractor",
      images: JSON.stringify(["https://picsum.photos/seed/cpcs1/800/600", "https://picsum.photos/seed/cpcs2/800/600"]),
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      howItWorks: JSON.stringify(["Equipment Familiarization", "Safe Operating Procedures", "Practical Maneuvers", "Technical Test"]),
      checklistOptions: JSON.stringify(["Excavator 360", "Forward Tipping Dumper", "Telehandler", "Ride on Roller"]),
      benefits: JSON.stringify([{ title: "Blue Competent Card", description: "Path to achieving your full blue card." }, { title: "High Demand", description: "Certified operators are in high demand across the UK." }]),
      modules: JSON.stringify([{ title: "Pre-start Checks", text: "Daily maintenance and safety inspections." }, { title: "Site Safety", text: "Navigating busy construction environments safely." }]),
      accreditation: "CPCS Accredited",
      accreditationLogo: "https://picsum.photos/seed/cpcslogo/200/100",
      whatsappNumber: "+447700900000"
    },
    {
      title: "NPORS Certification",
      description: "Flexible plant operator certification recognized across the construction and industrial sectors. Suitable for both experienced workers and novices.",
      icon: "Forklift",
      images: JSON.stringify(["https://picsum.photos/seed/npors1/800/600", "https://picsum.photos/seed/npors2/800/600"]),
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      howItWorks: JSON.stringify(["Registration", "Training Session", "Practical Assessment", "Card Issuance"]),
      checklistOptions: JSON.stringify(["Industrial Forklift", "Rough Terrain Forklift", "MEWP Boom", "Slinger Signaller"]),
      benefits: JSON.stringify([{ title: "Nationwide Recognition", description: "Accepted on major sites including HS2 and Hinkley Point." }]),
      modules: JSON.stringify([{ title: "Load Stability", text: "Understanding center of gravity and load charts." }]),
      accreditation: "NPORS Registered",
      accreditationLogo: "https://picsum.photos/seed/nporslogo/200/100",
      whatsappNumber: "+447700900000"
    },
    {
      title: "Health & Safety Level 1",
      description: "Essential for obtaining your CSCS Green Card. This course covers the fundamentals of site safety, personal protective equipment, and hazard awareness.",
      icon: "ShieldAlert",
      images: JSON.stringify(["https://picsum.photos/seed/hslevel1/800/600"]),
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      howItWorks: JSON.stringify(["Classroom Learning", "Interactive Workshops", "Mock Exams", "Final CITB Test"]),
      checklistOptions: JSON.stringify(["CSCS Green Card", "Manual Handling", "Asbestos Awareness", "Working at Heights"]),
      benefits: JSON.stringify([{ title: "Site Access", description: "Mandatory for entry-level work on most UK construction sites." }]),
      modules: JSON.stringify([{ title: "Risk Assessment", text: "How to identify and mitigate common site hazards." }]),
      accreditation: "CITB Approved",
      accreditationLogo: "https://picsum.photos/seed/citblogo/200/100",
      whatsappNumber: "+447700900000"
    },
    {
      title: "First Aid at Work (FAW)",
      description: "Qualify as a designated first aider in your workplace. This 3-day course provides comprehensive life-saving skills and emergency response training.",
      icon: "HeartPulse",
      images: JSON.stringify(["https://picsum.photos/seed/faw1/800/600"]),
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      howItWorks: JSON.stringify(["Theory Sessions", "Practical Scenarios", "CPR Practice", "Final Assessment"]),
      checklistOptions: JSON.stringify(["3-Day Full Course", "2-Day Refresher", "1-Day Emergency First Aid"]),
      benefits: JSON.stringify([{ title: "HSE Compliant", description: "Meets all Health and Safety Executive requirements for workplace first aid." }]),
      modules: JSON.stringify([{ title: "Resuscitation", text: "Adult CPR and AED (Defibrillator) usage." }]),
      accreditation: "Qualsafe Awards",
      accreditationLogo: "https://picsum.photos/seed/qualsafe/200/100",
      whatsappNumber: "+447700900000"
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
      service.accreditationLogo,
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
