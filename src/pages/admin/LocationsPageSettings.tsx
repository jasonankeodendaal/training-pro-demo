import React, { useState } from 'react';

const initialLocations = [
  { name: 'Head Office', address: '123 Main St, Anytown, USA', phone: '555-1234', image: 'loc1.jpg' },
  { name: 'Training Center', address: '456 Oak Ave, Anytown, USA', phone: '555-5678', image: 'loc2.jpg' },
];

export default function LocationsPageSettings() {
  const [title, setTitle] = useState('Our Locations');
  const [locations, setLocations] = useState(initialLocations);

  return (
    <div className="space-y-8">
      <div>
        <label htmlFor="locations-title" className="block text-sm font-medium text-slate-700">Title</label>
        <input type="text" id="locations-title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm" />
      </div>

      <div>
        <h3 className="text-lg font-medium leading-6 text-slate-900">Locations List</h3>
        <div className="mt-6 space-y-4">
          {locations.map((location, index) => (
            <div key={index} className="p-4 border border-slate-200 rounded-md grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" value={location.name} placeholder="Location Name" className="md:col-span-1 mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm" />
              <input type="text" value={location.phone} placeholder="Phone Number" className="md:col-span-1 mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm" />
              <textarea value={location.address} placeholder="Address" rows={2} className="md:col-span-2 mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm"></textarea>
              <div className="md:col-span-2">
                <label htmlFor={`location-image-${index}`} className="block text-sm font-medium text-slate-700">Image</label>
                <div className="mt-1 flex items-center">
                  <span className="inline-block h-12 w-12 rounded-md overflow-hidden bg-slate-100">
                    {/* Placeholder for image preview */}
                  </span>
                  <input type="file" id={`location-image-${index}`} className="ml-4" />
                </div>
              </div>
              <div className="md:col-span-2 flex justify-end">
                <button className="text-sm text-red-600 hover:text-red-800">Remove</button>
              </div>
            </div>
          ))}
          <button className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-md text-sm font-medium hover:bg-slate-700">Add Location</button>
        </div>
      </div>
    </div>
  );
}

