import React, { useState } from 'react';

const initialFields = [
  { type: 'text', label: 'Full Name', required: true },
  { type: 'email', label: 'Email Address', required: true },
  { type: 'textarea', label: 'Message', required: true },
];

export default function ContactFormSettings() {
  const [fields, setFields] = useState(initialFields);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Contact Form Settings</h2>
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={index} className="p-4 border border-slate-200 rounded-md grid grid-cols-1 md:grid-cols-3 gap-4">
            <select value={field.type} className="md:col-span-1 mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm">
              <option>text</option>
              <option>email</option>
              <option>textarea</option>
            </select>
            <input type="text" value={field.label} placeholder="Field Label" className="md:col-span-2 mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm" />
            <div className="md:col-span-3 flex items-center">
              <input type="checkbox" checked={field.required} className="h-4 w-4 text-yellow-600 border-slate-300 rounded" />
              <label className="ml-2 block text-sm text-slate-900">Required</label>
            </div>
            <div className="md:col-span-3 flex justify-end">
              <button className="text-sm text-red-600 hover:text-red-800">Remove Field</button>
            </div>
          </div>
        ))}
        <button className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-md text-sm font-medium hover:bg-slate-700">Add Field</button>
      </div>
    </div>
  );
}

