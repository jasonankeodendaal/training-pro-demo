import React, { useState } from 'react';

const initialServices = [
  { icon: 'Icon1', title: 'Plant Training', description: 'Comprehensive training for heavy machinery operation.' },
  { icon: 'Icon2', title: 'Safety Courses', description: 'Certified safety courses for a secure workplace.' },
  { icon: 'Icon3', title: 'First Aid', description: 'Essential first aid training for emergency situations.' },
];

export default function ServicesSettings() {
  const [title, setTitle] = useState('Our Core Services');
  const [description, setDescription] = useState('We provide a wide range of training services to meet the needs of your industry. Our expert trainers are here to help you and your team succeed.');
  const [services, setServices] = useState(initialServices);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium leading-6 text-slate-900">Services Section</h3>
        <p className="mt-1 text-sm text-slate-600">Update the title and description for the services section on the homepage.</p>
        <div className="mt-6 space-y-6">
          <div>
            <label htmlFor="services-title" className="block text-sm font-medium text-slate-700">Title</label>
            <input type="text" id="services-title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm" />
          </div>
          <div>
            <label htmlFor="services-description" className="block text-sm font-medium text-slate-700">Description</label>
            <textarea id="services-description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm"></textarea>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium leading-6 text-slate-900">Services List</h3>
        <p className="mt-1 text-sm text-slate-600">Manage the services displayed on the homepage.</p>
        <div className="mt-6 space-y-4">
          {services.map((service, index) => (
            <div key={index} className="p-4 border border-slate-200 rounded-md grid grid-cols-1 md:grid-cols-3 gap-4">
              <input type="text" value={service.icon} placeholder="Icon (e.g., 'Truck')" className="md:col-span-1 mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm" />
              <input type="text" value={service.title} placeholder="Service Title" className="md:col-span-1 mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm" />
              <textarea value={service.description} placeholder="Service Description" rows={2} className="md:col-span-3 mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm"></textarea>
              <div className="md:col-span-3 flex justify-end">
                <button className="text-sm text-red-600 hover:text-red-800">Remove</button>
              </div>
            </div>
          ))}
          <button className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-md text-sm font-medium hover:bg-slate-700">Add Service</button>
        </div>
      </div>
    </div>
  );
}

