import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  Users, 
  Briefcase,
  ChevronUp,
  Home,
  Layers,
  Phone,
  BookOpen
} from 'lucide-react';

export default function AdminLayout() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const location = useLocation();

  const menuGroups = [
    {
      id: 'dashboard',
      label: 'Main',
      icon: <LayoutDashboard className="w-5 h-5" />,
      path: '/admin/dashboard'
    },
    {
      id: 'content',
      label: 'Pages',
      icon: <Layers className="w-5 h-5" />,
      items: [
        { name: 'Home', path: '/admin/home', icon: <Home className="w-4 h-4" /> },
        { name: 'About', path: '/admin/about', icon: <Users className="w-4 h-4" /> },
        { name: 'Locations', path: '/admin/locations', icon: <Phone className="w-4 h-4" /> },
        { name: 'Footer', path: '/admin/footer', icon: <Settings className="w-4 h-4" /> },
      ]
    },
    {
      id: 'services',
      label: 'Courses',
      icon: <BookOpen className="w-5 h-5" />,
      items: [
        { name: 'Catalog', path: '/admin/services', icon: <BookOpen className="w-4 h-4" /> },
        { name: 'Job Cards', path: '/admin/dashboard', icon: <FileText className="w-4 h-4" /> },
        { name: 'Past Jobs', path: '/admin/jobs', icon: <Briefcase className="w-4 h-4" /> },
      ]
    },
    {
      id: 'forms',
      label: 'Forms',
      icon: <FileText className="w-5 h-5" />,
      items: [
        { name: 'Contact Form', path: '/admin/contact', icon: <Phone className="w-4 h-4" /> },
        { name: 'Enrollment', path: '/admin/contact', icon: <FileText className="w-4 h-4" /> },
      ]
    }
  ];

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-24">
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-30 flex justify-between items-center">
        <h1 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Admin <span className="text-yellow-500">Pro</span></h1>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white text-xs font-bold">JD</div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <Outlet />
      </main>

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 px-2 pb-safe">
        <div className="max-w-md mx-auto flex justify-around items-center h-16 relative">
          {menuGroups.map((group) => (
            <div key={group.id} className="relative flex-1">
              {group.items ? (
                <>
                  <button
                    onClick={() => setActiveMenu(activeMenu === group.id ? null : group.id)}
                    className={`w-full flex flex-col items-center justify-center gap-1 transition-colors ${
                      activeMenu === group.id ? 'text-yellow-600' : 'text-slate-400'
                    }`}
                  >
                    {group.icon}
                    <span className="text-[10px] font-bold uppercase tracking-tighter">{group.label}</span>
                    <ChevronUp className={`w-3 h-3 transition-transform ${activeMenu === group.id ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Drop-up Menu */}
                  {activeMenu === group.id && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-2 duration-200">
                      <div className="p-2 space-y-1">
                        {group.items.map((item) => (
                          <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => setActiveMenu(null)}
                            className={({ isActive }) =>
                              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                                isActive 
                                  ? 'bg-yellow-50 text-yellow-700' 
                                  : 'text-slate-600 hover:bg-slate-50'
                              }`
                            }
                          >
                            {item.icon}
                            {item.name}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <NavLink
                  to={group.path!}
                  onClick={() => setActiveMenu(null)}
                  className={({ isActive }) =>
                    `flex flex-col items-center justify-center gap-1 transition-colors ${
                      isActive ? 'text-yellow-600' : 'text-slate-400'
                    }`
                  }
                >
                  {group.icon}
                  <span className="text-[10px] font-bold uppercase tracking-tighter">{group.label}</span>
                </NavLink>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Backdrop for drop-ups */}
      {activeMenu && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
          onClick={() => setActiveMenu(null)}
        />
      )}
    </div>
  );
}

