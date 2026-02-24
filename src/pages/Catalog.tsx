import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShieldAlert, Tractor, Forklift, Mountain, HeartPulse, Search, Filter, ArrowRight } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  ShieldAlert: <ShieldAlert className="w-12 h-12" />,
  Tractor: <Tractor className="w-12 h-12" />,
  Forklift: <Forklift className="w-12 h-12" />,
  Mountain: <Mountain className="w-12 h-12" />,
  HeartPulse: <HeartPulse className="w-12 h-12" />
};

export default function Catalog() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredServices, setFilteredServices] = useState<any[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services');
        const data = await response.json();
        setServices(data);
        setFilteredServices(data);
      } catch (error) {
        console.error("Failed to fetch services", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    const results = services.filter(service =>
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredServices(results);
  }, [searchTerm, services]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-secondary py-16 md:py-24 px-4 md:px-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-6xl font-bold text-white tracking-tight mb-6"
          >
            Course Catalog
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10"
          >
            Browse our comprehensive list of safety and operational training modules designed to elevate your workforce.
          </motion.p>
          
          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative max-w-2xl mx-auto"
          >
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-lg"
              placeholder="Search for courses (e.g., Forklift, First Aid)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </motion.div>
        </div>
      </section>

      {/* Course Grid */}
      <section className="py-12 md:py-20 max-w-[1600px] mx-auto px-4 md:px-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-secondary">Available Modules ({filteredServices.length})</h2>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:border-primary transition-colors text-sm font-medium">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        {filteredServices.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
            <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-secondary mb-2">No courses found</h3>
            <p className="text-slate-500">Try adjusting your search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col h-full"
              >
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-secondary/10 group-hover:bg-secondary/0 transition-colors z-10"></div>
                  {/* Fallback image logic or use first image from array */}
                  <img 
                    src={JSON.parse(service.images || '[]')[0] || "https://picsum.photos/seed/default/800/600"} 
                    alt={service.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-sm p-2 rounded-xl shadow-lg text-primary">
                    {iconMap[service.icon] || <ShieldAlert className="w-6 h-6" />}
                  </div>
                </div>
                
                <div className="p-6 md:p-8 flex flex-col flex-grow">
                  <h3 className="text-xl md:text-2xl font-bold text-secondary mb-3 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-6 line-clamp-3 flex-grow">
                    {service.description}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100">
                    <div className="flex -space-x-2">
                      {[1,2,3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500">
                          {String.fromCharCode(64 + i)}
                        </div>
                      ))}
                    </div>
                    <Link 
                      to={`/services/${service.id}`}
                      className="flex items-center gap-2 text-secondary font-bold uppercase tracking-wider text-sm hover:gap-4 transition-all"
                    >
                      Enroll Now <ArrowRight className="w-4 h-4 text-primary" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
