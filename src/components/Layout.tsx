import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Phone, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ContactModal from './ContactModal';

export default function Layout() {
  const [settings, setSettings] = useState<any>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [supabaseConnected, setSupabaseConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const [header, footer, company, theme, contactForm, courseForm, status] = await Promise.all([
          fetch('/api/settings/header').then(r => r.ok ? r.json() : Promise.reject('Failed')),
          fetch('/api/settings/footer').then(r => r.ok ? r.json() : Promise.reject('Failed')),
          fetch('/api/settings/company_details').then(r => r.json().catch(() => null)),
          fetch('/api/settings/theme_settings').then(r => r.json().catch(() => null)),
          fetch('/api/settings/contact_form').then(r => r.json().catch(() => [])),
          fetch('/api/settings/course_form').then(r => r.json().catch(() => [])),
          fetch('/api/status').then(r => r.json().catch(() => ({ supabaseConnected: false })))
        ]);
        setSupabaseConnected(status.supabaseConnected);
        setSettings({ 
          header, 
          footer, 
          company: company || { name: header.siteName, logo: "" },
          theme: theme || { primaryColor: "#facc15", secondaryColor: "#0f172a", fontFamily: "Inter" },
          contactForm,
          courseForm
        });
      } catch (error) {
        console.error("Failed to fetch settings, using defaults", error);
        setSettings({
          header: {
            logoText: "TR",
            siteName: "TrainingPro",
            navLinks: [
              { label: "Home", path: "/" },
              { label: "Catalog", path: "/catalog" },
              { label: "About", path: "/about" },
              { label: "Locations", path: "/locations" }
            ]
          },
          footer: {
            copyright: "TrainingPro Inc. All rights reserved.",
            socialLinks: []
          },
          company: { name: "TrainingPro Inc.", address: "", phone: "", email: "" },
          theme: { primaryColor: "#facc15", secondaryColor: "#0f172a", fontFamily: "Inter" },
          contactForm: [],
          courseForm: []
        });
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    const handleOpenModal = () => setIsContactModalOpen(true);
    window.addEventListener('open-contact-modal', handleOpenModal);
    return () => window.removeEventListener('open-contact-modal', handleOpenModal);
  }, []);

  if (!settings) return null;

  const primaryStyle = { color: settings.theme.primaryColor };
  const bgPrimaryStyle = { backgroundColor: settings.theme.primaryColor };
  const bgSecondaryStyle = { backgroundColor: settings.theme.secondaryColor };
  const fontStyle = { fontFamily: settings.theme.fontFamily };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 text-lg" style={fontStyle}>
      <style>{`
        :root {
          --color-primary: ${settings.theme.primaryColor};
          --color-secondary: ${settings.theme.secondaryColor};
          --font-family: ${settings.theme.fontFamily};
        }
        .text-primary { color: var(--color-primary) !important; }
        .bg-primary { background-color: var(--color-primary) !important; }
        .border-primary { border-color: var(--color-primary) !important; }
        .text-secondary { color: var(--color-secondary) !important; }
        .bg-secondary { background-color: var(--color-secondary) !important; }
        .border-secondary { border-color: var(--color-secondary) !important; }
        .font-theme { font-family: var(--font-family) !important; }
      `}</style>
      {/* Global Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex justify-between items-center h-24">
            {/* Logo Placeholder */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center gap-4">
                {settings.company.logo ? (
                  <img src={settings.company.logo} alt={settings.company.name} className="h-14 w-auto object-contain" />
                ) : (
                  <div className="w-14 h-14 rounded-sm flex items-center justify-center font-bold text-slate-900 text-2xl" style={bgPrimaryStyle}>
                    {(settings.company.name || settings.header.siteName || "TR").substring(0, 2).toUpperCase()}
                  </div>
                )}
                {!settings.company.logo && (
                  <span className="font-bold text-2xl tracking-tight text-slate-900">{settings.company.name || settings.header.siteName}</span>
                )}
              </Link>
            </div>

            {/* Center Nav */}
            <nav className="hidden md:flex items-center space-x-12">
              {settings.header.navLinks.map((link: any) => (
                <Link key={link.path} to={link.path} className="text-slate-600 hover:opacity-80 font-semibold transition-colors text-xl">
                  {link.label}
                </Link>
              ))}
              <button 
                onClick={() => setIsContactModalOpen(true)}
                className="text-white px-6 py-3 rounded-sm font-bold uppercase tracking-widest hover:opacity-90 transition-all text-sm flex items-center gap-2"
                style={bgSecondaryStyle}
              >
                <Phone className="w-4 h-4" />
                Contact Us
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
              <button 
                onClick={() => setIsContactModalOpen(true)}
                className="text-white p-2 rounded-sm"
                style={bgSecondaryStyle}
              >
                <Phone className="h-5 w-5" />
              </button>
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-slate-900 p-2 rounded-sm"
                style={bgPrimaryStyle}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
            >
              <div className="px-6 py-8 space-y-6">
                {settings.header.navLinks.map((link: any) => (
                  <Link 
                    key={link.path} 
                    to={link.path} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-slate-900 font-bold text-2xl"
                  >
                    {link.label}
                  </Link>
                ))}
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsContactModalOpen(true);
                  }}
                  className="w-full text-white py-4 rounded-sm font-bold uppercase tracking-widest"
                  style={bgSecondaryStyle}
                >
                  Contact Us
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col">
        <Outlet context={{ settings }} />
      </main>

      {/* Minimalist Footer */}
      <footer className="text-white py-12 md:py-20" style={bgSecondaryStyle}>
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-20">
            {/* Brand Column */}
            <div className="col-span-2 md:col-span-1 space-y-6">
              {settings.company.logo ? (
                <img src={settings.company.logo} alt={settings.company.name} className="h-16 w-auto object-contain bg-white p-1 rounded-sm" />
              ) : (
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-sm flex items-center justify-center font-bold text-slate-900 text-2xl md:text-3xl" style={bgPrimaryStyle}>
                  {(settings.company.name || settings.header.siteName || "TR").substring(0, 2).toUpperCase()}
                </div>
              )}
              <p className="text-slate-400 text-xs md:text-base leading-relaxed max-w-xs">
                {settings.company.name || settings.header.siteName} - Empowering the workforce with industry-leading safety and operational training.
              </p>
              <div className="text-slate-400 text-sm space-y-1">
                <p>{settings.company.address}</p>
                <p>{settings.company.phone}</p>
                <p>{settings.company.email}</p>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold uppercase tracking-widest text-[10px] md:text-sm mb-4 md:mb-8" style={primaryStyle}>Quick Links</h4>
              <ul className="space-y-2 md:space-y-4">
                {settings.header.navLinks.map((link: any) => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-slate-400 hover:text-white transition-colors text-xs md:text-lg">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Training */}
            <div>
              <h4 className="font-bold uppercase tracking-widest text-[10px] md:text-sm mb-4 md:mb-8" style={primaryStyle}>Training</h4>
              <ul className="space-y-2 md:space-y-4">
                <li><Link to="/services/1" className="text-slate-400 hover:text-white transition-colors text-xs md:text-lg">Plant Training</Link></li>
                <li><Link to="/services/2" className="text-slate-400 hover:text-white transition-colors text-xs md:text-lg">Safety Courses</Link></li>
                <li><Link to="/services/3" className="text-slate-400 hover:text-white transition-colors text-xs md:text-lg">First Aid</Link></li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className="font-bold uppercase tracking-widest text-[10px] md:text-sm mb-4 md:mb-8" style={primaryStyle}>Connect</h4>
              <div className="flex flex-wrap gap-4 md:gap-6">
                {Array.isArray(settings.footer.socialLinks) ? (
                  settings.footer.socialLinks.map((link: any) => (
                    <a key={link.id} href={link.url} className="text-slate-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                      {link.icon ? (
                        <img src={link.icon} alt={link.platform} className="h-5 w-5 md:h-8 md:w-8 object-contain" />
                      ) : (
                        <span className="text-xs font-bold">{link.platform}</span>
                      )}
                    </a>
                  ))
                ) : (
                  // Fallback for old data structure
                  <>
                    <a href={settings.footer.socialLinks.facebook} className="text-slate-400 hover:text-white transition-colors"><Facebook className="h-5 w-5 md:h-8 md:w-8" /></a>
                    <a href={settings.footer.socialLinks.twitter} className="text-slate-400 hover:text-white transition-colors"><Twitter className="h-5 w-5 md:h-8 md:w-8" /></a>
                    <a href={settings.footer.socialLinks.instagram} className="text-slate-400 hover:text-white transition-colors"><Instagram className="h-5 w-5 md:h-8 md:w-8" /></a>
                    <a href={settings.footer.socialLinks.linkedin} className="text-slate-400 hover:text-white transition-colors"><Linkedin className="h-5 w-5 md:h-8 md:w-8" /></a>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="pt-8 md:pt-12 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <p className="text-slate-500 text-[10px] md:text-lg text-center md:text-left">
                &copy; {new Date().getFullYear()} {settings.company.name || settings.footer.copyright}
              </p>
              {supabaseConnected !== null && (
                <div 
                  className={`w-2 h-2 rounded-full ${supabaseConnected ? 'bg-green-500' : 'bg-red-500'}`} 
                  title={supabaseConnected ? "Connected to Supabase" : "Using local mock data"}
                />
              )}
            </div>
            <div className="flex gap-6 text-[10px] md:text-sm text-slate-500 uppercase tracking-widest font-bold">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
        formConfig={settings.contactForm}
      />
    </div>
  );
}
