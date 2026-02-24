import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle2, PlayCircle } from 'lucide-react';

export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState<any>(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`/api/jobs/${id}`);
        const data = await response.json();
        setJob(data);
      } catch (error) {
        console.error("Failed to fetch job details", error);
      }
    };

    fetchJob();
  }, [id]);

  if (!job) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
    </div>
  );

  const images = JSON.parse(job.images || '[]');
  const bulletPoints = JSON.parse(job.bulletPoints || '[]');

  return (
    <div className="flex flex-col w-full bg-white">
      {/* Header */}
      <section className="bg-slate-900 py-12 md:py-24 px-4 md:px-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src={images[0]} alt="Background" className="w-full h-full object-cover blur-sm" referrerPolicy="no-referrer" />
        </div>
        <div className="relative z-10 max-w-[1600px] mx-auto text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors mb-8 font-bold uppercase tracking-widest text-xs md:text-base">
            <ArrowLeft className="w-4 h-4 md:w-6 md:h-6" />
            Back to Home
          </Link>
          <h1 className="text-3xl md:text-7xl font-bold text-white tracking-tight mb-4 md:mb-6">{job.title}</h1>
          <div className="w-16 md:w-32 h-1 md:h-2 bg-yellow-400 mx-auto rounded-full"></div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-32 max-w-[1600px] mx-auto px-4 md:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-20 items-start">
          {/* Media Gallery */}
          <div className="space-y-4 md:space-y-10">
            <div className="aspect-video bg-slate-100 rounded-[2.5rem] overflow-hidden shadow-2xl relative group">
              <video src={job.videoUrl} controls className="w-full h-full object-cover" />
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <PlayCircle className="w-20 h-20 text-white/50" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 md:gap-6">
              {images.map((img: string, idx: number) => (
                <motion.div 
                  key={idx} 
                  className="aspect-square bg-slate-100 rounded-[2rem] overflow-hidden shadow-lg"
                  whileHover={{ scale: 1.02 }}
                >
                  <img src={img} alt={`Job detail ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Text Content */}
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mb-4 md:mb-8">Project Overview</h2>
            <p className="text-slate-600 text-sm md:text-2xl leading-relaxed mb-8 md:mb-12">
              {job.description}
            </p>

            <div className="bg-slate-50 p-6 md:p-16 rounded-3xl border border-slate-100">
              <h3 className="text-lg md:text-2xl font-bold text-slate-900 mb-6 md:mb-10 uppercase tracking-widest">Key Outcomes & Details</h3>
              <ul className="space-y-4 md:space-y-8">
                {bulletPoints.map((point: string, idx: number) => (
                  <li key={idx} className="flex gap-3 md:gap-6 items-start">
                    <div className="flex-shrink-0 mt-1">
                      <CheckCircle2 className="w-5 h-5 md:w-8 md:h-8 text-yellow-500" />
                    </div>
                    <p className="text-slate-700 font-bold text-xs md:text-xl leading-tight">{point}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-12 md:mt-20">
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('open-contact-modal'))}
                className="inline-block bg-slate-900 text-white px-8 py-4 md:px-12 md:py-6 rounded-2xl font-bold uppercase tracking-widest hover:bg-slate-800 transition-all text-sm md:text-xl shadow-xl"
              >
                Contact Us for Similar Projects
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 md:py-24 bg-yellow-400">
        <div className="max-w-[1600px] mx-auto px-4 md:px-16 text-center">
          <h2 className="text-2xl md:text-5xl font-bold text-slate-900 mb-6 md:mb-10 tracking-tight">Ready to upgrade your safety standards?</h2>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('open-contact-modal'))}
            className="inline-block bg-slate-900 text-white px-8 py-4 md:px-12 md:py-6 rounded-2xl font-bold uppercase tracking-widest hover:bg-slate-800 transition-all text-sm md:text-xl shadow-xl"
          >
            Get a Free Quote
          </button>
        </div>
      </section>
    </div>
  );
}
