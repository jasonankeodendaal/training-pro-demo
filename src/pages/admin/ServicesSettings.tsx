import React, { useState } from 'react';

const initialServices = [
  { name: 'Plant Training', details: 'Details about plant training...', form: [], whatsapp: '1234567890' },
  { name: 'Safety Courses', details: 'Details about safety courses...', form: [], whatsapp: '1234567890' },
];

export default function ServicesSettings() {
  const [services, setServices] = useState(initialServices);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Manage Services</h2>
      {services.map((service, index) => (
        <div key={index} className="p-4 border border-slate-200 rounded-md">
          <input type="text" value={service.name} className="text-lg font-bold w-full mb-2" />
          <textarea value={service.details} rows={3} className="w-full mb-2 p-2 border rounded-md" />
          <input type="text" value={service.whatsapp} placeholder="WhatsApp Number" className="w-full mb-2 p-2 border rounded-md" />
          <h4 className="font-bold mt-4">Form Fields</h4>
          {/* Form builder UI will go here */}
          <div className="flex justify-end mt-4">
            <button className="text-sm text-red-600 hover:text-red-800">Remove Service</button>
          </div>
        </div>
      ))}
      <button className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-md text-sm font-medium hover:bg-slate-700">Add New Service</button>
    </div>
  );
}

