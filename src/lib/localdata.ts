export const mockServices = [
  {
    id: 1,
    title: 'Forklift Operator Training',
    description: 'Comprehensive training for forklift operation, covering safety, maintenance, and practical skills.',
    icon: 'Forklift',
    images: '["https://picsum.photos/seed/forklift1/800/600", "https://picsum.photos/seed/forklift2/800/600"]',
    videoUrl: 'https://videos.pexels.com/video-files/3209828/3209828-hd_1280_720_25fps.mp4',
    howItWorks: '["Theory session", "Practical training", "Assessment"]',
    checklistOptions: '["Novice training", "Refresher course"]',
    benefits: '[{"title": "Certified Operators", "description": "Fully certified and compliant operators"}]',
    modules: '[{"title": "Module 1: Safety", "text": "Understanding forklift safety regulations"}]',
    accreditation: 'National High-Risk Work Licence',
    accreditationLogo: 'https://picsum.photos/seed/accred/200/200',
    whatsappNumber: '1234567890',
  },
  {
    id: 2,
    title: 'Workplace First Aid',
    description: 'Essential first aid skills for the workplace, including CPR and emergency response.',
    icon: 'HeartPulse',
    images: '["https://picsum.photos/seed/firstaid1/800/600", "https://picsum.photos/seed/firstaid2/800/600"]',
    videoUrl: 'https://videos.pexels.com/video-files/3209828/3209828-hd_1280_720_25fps.mp4',
    howItWorks: '["Theory session", "Practical scenarios", "Assessment"]',
    checklistOptions: '["Basic First Aid", "Advanced First Aid"]',
    benefits: '[{"title": "Emergency Ready", "description": "Prepared for any workplace medical emergency"}]',
    modules: '[{"title": "Module 1: CPR", "text": "Cardiopulmonary resuscitation techniques"}]',
    accreditation: 'Nationally Recognised First Aid Certificate',
    accreditationLogo: 'https://picsum.photos/seed/accred2/200/200',
    whatsappNumber: '1234567890',
  },
];

export const mockJobs = [
  {
    id: 1,
    title: 'On-site Safety Consultation',
    description: 'A comprehensive safety consultation for a major construction project.',
    images: '["https://picsum.photos/seed/job1-1/800/600", "https://picsum.photos/seed/job1-2/800/600"]',
    videoUrl: 'https://videos.pexels.com/video-files/3209828/3209828-hd_1280_720_25fps.mp4',
    bulletPoints: '["Identified key safety risks", "Implemented new safety protocols", "Trained 50+ staff members"]',
  },
];

export const mockLeads = [
  {
    id: 1,
    name: 'John',
    surname: 'Doe',
    companyName: 'Construction Inc.',
    tel: '123-456-7890',
    email: 'john.doe@construction.com',
    address: '123 Main St, Anytown',
    notes: 'Interested in forklift training for 10 employees.',
    serviceId: 1,
    checklist: '["Novice training"]',
    employees: '[{"name": "Jane Doe", "age": "30", "jobTitle": "Operator"}]',
    serviceTitle: 'Forklift Operator Training',
  },
];

export const mockJobCards = [
  {
    id: 1,
    leadId: 1,
    clientName: 'Construction Inc.',
    serviceTitle: 'Forklift Operator Training',
    date: '2024-01-15',
    items: '[]',
    trainees: '[{"name": "Jane Doe", "age": "30", "jobTitle": "Operator"}]',
    courses: '[{"id": 1, "title": "Forklift Operator Training"}]',
    totalCost: 1500,
    status: 'Completed',
  },
];
