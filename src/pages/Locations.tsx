import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function Locations() {
  const { settings } = useOutletContext<{ settings: any }>();

  if (!settings) return null;

  return (
    <div className="flex flex-col w-full bg-white">
      {/* Hero Image of Headquarters */}
      <section className="relative w-full h-[60vh] overflow-hidden">
        <img 
          src={settings.locations?.heroImage || "https://picsum.photos/seed/hq/1920/1080"} 
          alt="Headquarters" 
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
          <div className="text-center px-6">
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6">Our Locations</h1>
            <div className="w-32 h-2 bg-primary mx-auto"></div>
          </div>
        </div>
      </section>

      {/* Contact Hub */}
      <section className="py-12 md:py-32 max-w-[1600px] mx-auto px-4 md:px-16 w-full">
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 md:gap-24">
          {/* Contact Details */}
          <div>
            <h2 className="text-xl md:text-4xl font-bold text-slate-900 mb-6 md:mb-12 tracking-tight">Get in Touch</h2>
            <div className="space-y-6 md:space-y-12">
              <div className="flex items-start gap-2 md:gap-8">
                <div className="w-8 h-8 md:w-16 md:h-16 bg-primary rounded-lg md:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <MapPin className="text-secondary w-4 h-4 md:w-8 md:h-8" />
                </div>
                <div>
                  <h3 className="text-[10px] md:text-2xl font-bold text-slate-900 mb-0.5 md:mb-2">Training Center</h3>
                  <p className="text-slate-600 leading-tight text-[8px] md:text-xl whitespace-pre-line">
                    {settings.company_details.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 md:gap-8">
                <div className="w-8 h-8 md:w-16 md:h-16 bg-primary rounded-lg md:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <Phone className="text-secondary w-4 h-4 md:w-8 md:h-8" />
                </div>
                <div>
                  <h3 className="text-[10px] md:text-2xl font-bold text-slate-900 mb-0.5 md:mb-2">Direct Lines</h3>
                  <p className="text-slate-600 leading-tight text-[8px] md:text-xl whitespace-pre-line">
                    {settings.company_details.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 md:gap-8">
                <div className="w-8 h-8 md:w-16 md:h-16 bg-primary rounded-lg md:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <Mail className="text-secondary w-4 h-4 md:w-8 md:h-8" />
                </div>
                <div>
                  <h3 className="text-[10px] md:text-2xl font-bold text-slate-900 mb-0.5 md:mb-2">Email Support</h3>
                  <p className="text-slate-600 leading-tight text-[8px] md:text-xl whitespace-pre-line">
                    {settings.company_details.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 md:gap-8">
                <div className="w-8 h-8 md:w-16 md:h-16 bg-primary rounded-lg md:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <Clock className="text-secondary w-4 h-4 md:w-8 md:h-8" />
                </div>
                <div>
                  <h3 className="text-[10px] md:text-2xl font-bold text-slate-900 mb-0.5 md:mb-2">Operating Hours</h3>
                  <p className="text-slate-600 leading-tight text-[8px] md:text-xl whitespace-pre-line">
                    {settings.company_details.openHours}
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('open-contact-modal'))}
                  className="bg-secondary text-white px-4 py-2 md:px-12 md:py-6 rounded-lg md:rounded-2xl font-bold uppercase tracking-widest hover:opacity-90 transition-all text-[8px] md:text-xl shadow-xl"
                >
                  Message Us
                </button>
              </div>
            </div>
          </div>

          {/* Live Map */}
          <div className="bg-slate-100 rounded-2xl md:rounded-[3rem] overflow-hidden shadow-inner border border-slate-200 min-h-[200px] md:min-h-[500px] relative">
            <iframe 
              src={settings.company_details.mapUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2482.819243221662!2d-0.1309115233760142!3d51.51658197181585!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48761b2d386f4475%3A0xbc45104e2907d8af!2sThe%20British%20Museum!5e0!3m2!1sen!2suk!4v1708510000000!5m2!1sen!2suk"}
              className="absolute inset-0 w-full h-full border-0 grayscale contrast-125"
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}
