import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export default function About() {
  const [settings, setSettings] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [currentHeroImage, setCurrentHeroImage] = useState(0);

  useEffect(() => {
    fetch('/api/settings/about')
      .then(res => res.ok ? res.json() : Promise.reject('Failed'))
      .then(data => {
        // Normalize heroImages
        if (!data.heroImages) {
          data.heroImages = data.heroImage ? [data.heroImage] : [];
        }
        setSettings(data);
      })
      .catch(err => {
        console.error("Failed to fetch about settings", err);
        setSettings({
          heroImages: ["https://picsum.photos/seed/about/1920/1080"],
          mission: "To empower workforces with the knowledge, skills, and confidence to operate safely and efficiently.",
          vision: "To be the undisputed leader in industrial and safety training.",
          milestones: [
            { year: "2010", title: "Founded", desc: "Started as a small local training provider." }
          ]
        });
      });

    fetch('/api/jobs')
      .then(res => res.ok ? res.json() : Promise.reject('Failed'))
      .then(data => setJobs(data))
      .catch(err => {
        console.error("Failed to fetch jobs", err);
        setJobs([]);
      });
  }, []);

  useEffect(() => {
    if (settings?.heroImages?.length > 1) {
      const interval = setInterval(() => {
        setCurrentHeroImage(prev => (prev + 1) % settings.heroImages.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [settings]);

  if (!settings) return null;

  return (
    <div className="flex flex-col w-full bg-white">
      {/* Split-Screen Hero */}
      <section className="grid grid-cols-2 md:flex-row min-h-[40vh] md:min-h-[80vh] w-full">
        {/* Image Side */}
        <div className="w-full h-full relative overflow-hidden bg-slate-900">
          {(settings.heroImages && settings.heroImages.length > 0 ? settings.heroImages : [settings.heroImage]).map((img: string, idx: number) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: idx === currentHeroImage ? 1 : 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 w-full h-full"
            >
              {img && img.endsWith('.mp4') ? (
                <video 
                  src={img} 
                  autoPlay 
                  loop 
                  muted 
                  className="w-full h-full object-cover"
                />
              ) : (
                <img 
                  src={img} 
                  alt={`Hero ${idx}`} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              )}
            </motion.div>
          ))}
          <div className="absolute inset-0 bg-slate-900/20 z-10"></div>
        </div>
        
        {/* Text Side */}
        <div className="w-full bg-slate-50 p-4 md:p-20 lg:p-32 flex flex-col justify-center">
          <h1 className="text-xl md:text-7xl font-bold text-slate-900 mb-2 md:mb-8 tracking-tight">Our Mission & Vision</h1>
          <div className="w-8 md:w-24 h-0.5 md:h-2 bg-yellow-400 mb-4 md:mb-12"></div>
          
          <div className="space-y-4 md:space-y-12">
            <div>
              <h2 className="text-xs md:text-3xl font-bold text-slate-800 mb-1 md:mb-4">Mission</h2>
              <p className="text-slate-600 leading-relaxed text-[8px] md:text-2xl">
                {settings.mission || ''}
              </p>
            </div>
            
            <div>
              <h2 className="text-xs md:text-3xl font-bold text-slate-800 mb-1 md:mb-4">Vision</h2>
              <p className="text-slate-600 leading-relaxed text-[8px] md:text-2xl">
                {settings.vision || ''}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Full Story Section */}
      {settings.fullStory && (
        <section className="py-12 md:py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
            <h2 className="text-2xl md:text-5xl font-bold text-slate-900 mb-8 tracking-tight">Our Full Story</h2>
            <div className="w-16 md:w-24 h-1 bg-yellow-400 mx-auto mb-8 rounded-full"></div>
            <p className="text-slate-600 text-sm md:text-xl leading-relaxed whitespace-pre-line">
              {settings.fullStory}
            </p>
          </div>
        </section>
      )}

      {/* Horizontal Roadmap - Upgraded to staggered layout */}
      <section className="py-12 md:py-32 bg-white overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-4 md:px-16">
          <div className="text-center mb-12 md:mb-24">
            <h2 className="text-2xl md:text-6xl font-bold text-slate-900 tracking-tight">Our Journey</h2>
            <div className="w-16 md:w-32 h-1 md:h-2 bg-yellow-400 mx-auto mt-2 md:mt-6 rounded-full"></div>
          </div>
          
          <div className="relative">
            {/* Connecting Line - Curved/Organic feel */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent -translate-y-1/2 hidden md:block"></div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-12 relative z-10">
              {(settings.milestones || []).map((milestone: any, index: number) => (
                <motion.div 
                  key={index}
                  className={`flex flex-col items-center text-center bg-slate-50 p-4 md:p-12 rounded-2xl md:rounded-[3rem] shadow-xl border border-white relative ${
                    index % 2 === 0 ? 'md:translate-y-8' : 'md:-translate-y-8'
                  }`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                >
                  <div className="w-10 h-10 md:w-20 md:h-20 bg-yellow-400 rounded-full flex items-center justify-center text-slate-900 font-bold text-xs md:text-2xl mb-2 md:mb-6 shadow-lg border-2 md:border-4 border-white">
                    {milestone.year}
                  </div>
                  <h3 className="text-[10px] md:text-xl font-bold text-slate-900 mb-1 md:mb-3">{milestone.title}</h3>
                  <p className="text-slate-600 text-[8px] md:text-lg leading-relaxed line-clamp-3 md:line-clamp-none">{milestone.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Media Grid - Live Training & Facilities */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-[1600px] mx-auto px-4 md:px-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-6xl font-bold tracking-tight text-white">Live Training & Facilities</h2>
            <div className="w-24 md:w-32 h-1 md:h-2 bg-yellow-400 mx-auto mt-4 md:mt-6 rounded-full"></div>
            <p className="text-slate-400 mt-4 md:mt-8 text-sm md:text-xl max-w-3xl mx-auto">
              Explore our state-of-the-art facilities and real-world training scenarios captured during our sessions.
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10">
            {jobs.map((job: any, idx: number) => {
              const images = JSON.parse(job.images || '[]');
              return (
                <motion.div 
                  key={job.id}
                  className="space-y-4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className="aspect-video bg-slate-800 rounded-[2rem] overflow-hidden shadow-2xl relative group">
                    {idx % 2 === 0 ? (
                      <img 
                        src={images[0]} 
                        alt={job.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" 
                        referrerPolicy="no-referrer" 
                      />
                    ) : (
                      <video 
                        src={job.videoUrl} 
                        className="w-full h-full object-cover"
                        controls
                        muted
                      />
                    )}
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6 pointer-events-none">
                      <h3 className="text-white font-bold text-[10px] md:text-lg">{job.title}</h3>
                    </div>
                  </div>
                  <p className="text-slate-400 text-[10px] md:text-base line-clamp-2 italic px-2">
                    {job.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
