import React, { Fragment } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDown, Settings, LogOut, LayoutGrid, Newspaper, Briefcase, Info, MapPin, MessageSquare, PlusCircle } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

const navigation = {
  general: [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Header/Footer', href: '/admin/settings' },
  ],
  pages: [
    { name: 'Home', href: '/admin/pages/home' },
    { name: 'About', href: '/admin/pages/about' },
    { name: 'Locations', href: '/admin/pages/locations' },
  ],
  content: [
    { name: 'Services', href: '/admin/content/services' },
    { name: 'Past Jobs', href: '/admin/content/jobs' },
  ],
  forms: [
    { name: 'Contact Form', href: '/admin/forms/contact' },
  ]
}

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top row: Main nav and User menu */}
          <div className="flex justify-between items-center h-16 border-b border-slate-200">
            <div className="flex items-baseline space-x-8">
              <Link to="/" className="text-2xl font-bold tracking-tight text-slate-900 hover:text-yellow-500 transition-colors">
                TrainingPro <span className="text-yellow-400">Admin</span>
              </Link>
              <div className="hidden md:flex items-baseline space-x-6">
                {navigation.general.map((item) => (
                  <Link key={item.name} to={item.href} className="text-sm font-medium text-slate-500 hover:text-slate-900">
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
                  <span>Admin User</span>
                  <ChevronDown className="w-4 h-4" />
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <a href="#" className={`${active ? 'bg-slate-100' : ''} group flex items-center px-4 py-2 text-sm text-slate-700`}>
                          <Settings className="mr-3 h-5 w-5 text-slate-400 group-hover:text-slate-500" />
                          Account settings
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a href="#" className={`${active ? 'bg-slate-100' : ''} group flex items-center px-4 py-2 text-sm text-slate-700`}>
                          <LogOut className="mr-3 h-5 w-5 text-slate-400 group-hover:text-slate-500" />
                          Sign out
                        </a>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>

          {/* Bottom row: Content type navigation */}
          <div className="flex items-center h-16 space-x-8">
            <div className="flex items-center space-x-2">
              <LayoutGrid className="w-5 h-5 text-slate-400" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Pages</h2>
            </div>
            {navigation.pages.map((item) => (
              <Link key={item.name} to={item.href} className="text-sm font-medium text-slate-500 hover:text-slate-900">
                {item.name}
              </Link>
            ))}
            <div className="w-px h-6 bg-slate-200"></div>
            <div className="flex items-center space-x-2">
              <Newspaper className="w-5 h-5 text-slate-400" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Content</h2>
            </div>
            {navigation.content.map((item) => (
              <Link key={item.name} to={item.href} className="text-sm font-medium text-slate-500 hover:text-slate-900">
                {item.name}
              </Link>
            ))}
             <div className="w-px h-6 bg-slate-200"></div>
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-slate-400" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Forms</h2>
            </div>
            {navigation.forms.map((item) => (
              <Link key={item.name} to={item.href} className="text-sm font-medium text-slate-500 hover:text-slate-900">
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Outlet />
      </main>
      <Toaster position="bottom-right" />
    </div>
  );
}
