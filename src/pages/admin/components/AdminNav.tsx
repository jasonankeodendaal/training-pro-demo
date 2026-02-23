import React from 'react';
import { NavLink } from 'react-router-dom';

const navLinks = [
  { name: 'Dashboard', path: '/admin/dashboard' },
  { name: 'Home Page', path: '/admin/home' },
  { name: 'About Page', path: '/admin/about' },
  { name: 'Locations Page', path: '/admin/locations' },
  { name: 'Services', path: '/admin/services' },
  { name: 'Jobs', path: '/admin/jobs' },
  { name: 'Footer', path: '/admin/footer' },
  { name: 'Contact Form', path: '/admin/contact' },
];

export default function AdminNav() {
  return (
    <nav className="bg-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-white font-bold">TrainingPro Admin</h1>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md text-sm font-medium ${
                        isActive
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
