export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  category: string;
  image: string;
  price: string;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  images: string | string[];
  videoUrl?: string;
  howItWorks?: string | string[];
  checklistOptions?: string | string[];
  benefits?: string | any[];
  modules?: string | any[];
  accreditation?: string;
  accreditationLogo?: string;
  whatsappNumber?: string;
}
