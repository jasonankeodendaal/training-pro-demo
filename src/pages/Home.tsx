import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Tractor, Forklift, Mountain, HeartPulse, CheckCircle2 } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  ShieldAlert: <ShieldAlert className="w-12 h-12" />,
  Tractor: <Tractor className="w-12 h-12" />,
  Forklift: <Forklift className="w-12 h-12" />,
  Mountain: <Mountain className="w-12 h-12" />,
  HeartPulse: <HeartPulse className="w-12 h-12" />
};

export default function Home() {
  const [currentHero, setCurrentHero] = useState(0);
  const [services, setServices] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.ok ? res.json() : Promise.reject('Failed'))
      .then(data => setServices(data))
      .catch(err => {
        console.error("Failed to fetch services", err);
        setServices([]);
      });

    fetch('/api/jobs')
      .then(res => res.ok ? res.json() : Promise.reject('Failed'))
      .then(data => setJobs(data))
      .catch(err => {
        console.error("Failed to fetch jobs", err);
        setJobs([]);
      });

    fetch('/api/settings/home')
      .then(res => res.ok ? res.json() : Promise.reject('Failed'))
      .then(data => setSettings(data))
      .catch(err => {
        console.error("Failed to fetch home settings", err);
        setSettings({
          heroImages: ["https://picsum.photos/seed/hero1/1920/1080"],
          heroTitle: "Safety Excellence Without Compromise.",
          heroSubtitle: "Delivering industry-leading safety and operational training since 2010.",
          ctaButtons: [{ text: "Read More", url: "/about", primary: true }]
        });
      });
  }, []);

  useEffect(() => {
    if (!settings) return;
    const heroTimer = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % settings.heroImages.length);
    }, 5000);
    return () => clearInterval(heroTimer);
  }, [settings]);

  if (!settings) return null;

  return (
    <div className="flex flex-col w-full bg-white">
      {/* New Wow 3D Hero Section */}
      <section className="relative min-h-[50vh] md:min-h-[90vh] flex items-center overflow-hidden bg-secondary">
        {/* Background Carousel */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentHero}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              {settings.heroImages[currentHero]?.endsWith('.mp4') ? (
                <video 
                  src={settings.heroImages[currentHero]} 
                  autoPlay 
                  loop 
                  muted 
                  className="w-full h-full object-cover"
                />
              ) : (
                <img 
                  src={settings.heroImages[currentHero]} 
                  alt="Background" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              )}
              {/* Dark Overlay for readability */}
              <div className="absolute inset-0 bg-secondary/70 backdrop-blur-[2px]"></div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Background Layered Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-1">
          <motion.div 
            animate={{ 
              rotate: [0, 10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-[120px]"
          />
          <motion.div 
            animate={{ 
              rotate: [0, -15, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-[100px]"
          />
        </div>

        <div className="max-w-[1600px] mx-auto px-4 md:px-16 w-full relative z-20 flex flex-col items-center justify-center text-center py-20 md:py-32">
          {/* Hero Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 md:space-y-12 max-w-4xl mx-auto flex flex-col items-center"
          >
            <div className="space-y-2 md:space-y-6">
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block bg-primary text-secondary px-3 py-1 md:px-6 md:py-2 rounded-full text-xs md:text-sm font-bold uppercase tracking-[0.2em]"
              >
                Leaders Since 2010
              </motion.span>
              <h1 className="text-4xl md:text-8xl font-bold text-white tracking-tighter leading-[0.9] whitespace-pre-line">
                {settings.heroTitle || "Safety Excellence\nWithout Compromise."}
              </h1>
            </div>
            
            <p className="text-slate-300 text-sm md:text-2xl leading-relaxed max-w-2xl font-light whitespace-pre-line">
              {settings.heroSubtitle || "Delivering industry-leading safety and operational training since 2010. We equip your workforce with the skills they need to succeed safely."}
            </p>

            <div className="flex flex-wrap justify-center gap-4 md:gap-6 pt-4">
              {(settings.ctaButtons || []).map((btn: any, idx: number) => (
                btn.url === '#contact' ? (
                  <button 
                    key={idx}
                    onClick={() => window.dispatchEvent(new CustomEvent('open-contact-modal'))}
                    className={`${btn.primary ? 'bg-primary text-secondary hover:bg-white hover:scale-105 shadow-lg' : 'bg-white/10 text-white backdrop-blur-md border border-white/20 hover:bg-white/20'} px-6 py-3 md:px-10 md:py-4 rounded-full font-bold uppercase tracking-widest transition-all text-xs md:text-base`}
                  >
                    {btn.text}
                  </button>
                ) : (
                  <Link 
                    key={idx}
                    to={btn.url} 
                    className={`${btn.primary ? 'bg-primary text-secondary hover:bg-white hover:scale-105 shadow-lg' : 'bg-white/10 text-white backdrop-blur-md border border-white/20 hover:bg-white/20'} px-6 py-3 md:px-10 md:py-4 rounded-full font-bold uppercase tracking-widest transition-all text-xs md:text-base`}
                  >
                    {btn.text}
                  </Link>
                )
              ))}
              {(!settings.ctaButtons || settings.ctaButtons.length === 0) && (
                 <Link 
                 to="/about" 
                 className="bg-primary text-secondary px-6 py-3 md:px-10 md:py-4 rounded-full font-bold uppercase tracking-widest hover:bg-white hover:scale-105 transition-all shadow-lg text-xs md:text-base"
               >
                 Read More
               </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Service Showcase Row - 5 Columns on Mobile */}
      <section className="py-8 md:py-32 bg-slate-50">
        <div className="max-w-[1600px] mx-auto px-2 md:px-16">
          <div className="text-center mb-6 md:mb-20">
            <h2 className="text-lg md:text-6xl font-bold text-secondary tracking-tight">Our Training Services</h2>
            <div className="w-10 md:w-32 h-0.5 md:h-2 bg-primary mx-auto mt-2 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-5 lg:grid-cols-5 gap-1 md:gap-8">
            {services.map((service) => (
              <Link 
                key={service.id} 
                to={`/services/${service.id}`}
                className="group flex flex-col items-center justify-center bg-white p-1 md:p-10 rounded-lg md:rounded-3xl shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)] hover:shadow-[0_30px_60px_-15px_rgba(var(--color-primary),0.2)] hover:-translate-y-1 md:hover:-translate-y-3 transition-all duration-500 border border-slate-100 hover:border-primary aspect-square text-center relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="text-slate-400 group-hover:text-primary transition-colors mb-0.5 md:mb-6 scale-[0.35] md:scale-125 relative z-10 group-hover:scale-[0.4] md:group-hover:scale-150 transition-transform duration-500">
                  {iconMap[service.icon] || <ShieldAlert className="w-12 h-12" />}
                </div>
                <h3 className="font-bold text-[5px] md:text-xl text-slate-600 group-hover:text-secondary leading-tight px-0.5 h-3 md:h-12 flex items-center justify-center relative z-10">
                  {service.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Enhanced Side by Side on Mobile */}
      <section className="py-12 md:py-32 bg-white">
        <div className="max-w-[1600px] mx-auto px-4 md:px-16">
          <div className="grid grid-cols-2 gap-4 md:gap-16 items-center">
            <div className="space-y-3 md:space-y-8">
              <h2 className="text-xl md:text-6xl font-bold text-secondary tracking-tight">Why <br className="md:hidden" /> TrainingPro?</h2>
              <div className="w-12 md:w-32 h-1 md:h-2 bg-primary"></div>
              <p className="text-slate-600 text-[8px] md:text-2xl leading-relaxed line-clamp-3 md:line-clamp-none">
                Industry-standard certifications with practical, hands-on experience from veteran instructors.
              </p>
              <div className="grid grid-cols-1 gap-1.5 md:gap-4">
                {['Accredited', 'Flexible', 'On-site', 'Modern'].map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5 md:gap-4 text-[8px] md:text-xl font-bold text-slate-800">
                    <div className="w-3 h-3 md:w-8 md:h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                      <CheckCircle2 className="w-1.5 h-1.5 md:w-5 md:h-5 text-secondary" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-1.5 md:gap-4">
                <img src="https://picsum.photos/seed/why1/400/400" className="rounded-xl md:rounded-3xl shadow-md" referrerPolicy="no-referrer" />
                <img src="https://picsum.photos/seed/why2/400/400" className="rounded-xl md:rounded-3xl shadow-md mt-2 md:mt-4" referrerPolicy="no-referrer" />
                <img src="https://picsum.photos/seed/why3/400/400" className="rounded-xl md:rounded-3xl shadow-md -mt-2 md:-mt-4" referrerPolicy="no-referrer" />
                <img src="https://picsum.photos/seed/why4/400/400" className="rounded-xl md:rounded-3xl shadow-md" referrerPolicy="no-referrer" />
              </div>
              {/* Floating Badge for Mobile */}
              <div className="absolute -bottom-2 -right-2 md:hidden bg-secondary text-primary p-2 rounded-lg shadow-xl border border-primary/20">
                <div className="text-[10px] font-bold leading-none">14+</div>
                <div className="text-[5px] uppercase tracking-widest">Years</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Past Jobs Relayout - Horizontal Scroll/Grid */}
      <section className="py-16 md:py-32 bg-secondary text-white overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-4 md:px-16 mb-12 md:mb-20">
          <div className="flex flex-row items-end justify-between">
            <div>
              <h2 className="text-2xl md:text-6xl font-bold tracking-tight">Past Jobs Gallery</h2>
              <div className="w-16 md:w-32 h-1 md:h-2 bg-primary mt-4"></div>
            </div>
            <div className="text-slate-400 text-[10px] md:text-xl font-mono uppercase tracking-widest">
              Project Archive 2024
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4 px-2 md:px-4">
          {jobs.map((job: any) => {
            const images = JSON.parse(job.images || '[]');
            return (
              <Link 
                key={job.id}
                to={`/jobs/${job.id}`}
                className="aspect-square relative group overflow-hidden rounded-3xl block"
              >
                <motion.div 
                  className="w-full h-full"
                  whileHover={{ scale: 1.05 }}
                >
                  <img 
                    src={images[0]} 
                    alt={job.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-secondary/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                    <h3 className="text-white font-bold text-[10px] md:text-lg leading-tight mb-2">{job.title}</h3>
                    <span className="text-primary text-[8px] md:text-sm font-bold uppercase tracking-widest">View Project</span>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
