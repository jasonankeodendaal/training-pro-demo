import React from 'react';

export default function ContentManager({ services, jobs, about, onEditService, onEditJob, onSaveAbout }) {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-black text-secondary tracking-tighter">Content Management</h1>
      
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-secondary mb-4">Services</h2>
        <p className="text-slate-500 mb-4">Manage the services and courses offered.</p>
        <button onClick={() => onEditService({ title: '', description: '', images: '[]', videoUrl: '', howItWorks: '[]' })} className="bg-primary text-secondary px-6 py-2 rounded-xl font-bold">Add New Service</button>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-secondary mb-4">Past Jobs / Facilities</h2>
        <p className="text-slate-500 mb-4">Showcase your past work and training facilities.</p>
        <button onClick={() => onEditJob({ title: '', description: '', images: '[]', videoUrl: '', bulletPoints: '[]' })} className="bg-primary text-secondary px-6 py-2 rounded-xl font-bold">Add New Job/Facility</button>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-secondary mb-4">About Page / Roadmap</h2>
        <p className="text-slate-500 mb-4">Edit the content of your company's about page and roadmap.</p>
        <button onClick={onSaveAbout} className="bg-primary text-secondary px-6 py-2 rounded-xl font-bold">Edit About Page</button>
      </div>
    </div>
  );
}
