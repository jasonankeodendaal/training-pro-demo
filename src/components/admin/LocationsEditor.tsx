import React, { useState } from 'react';
import FileUpload from './FileUpload';
import { Plus, Trash2 } from 'lucide-react';

interface Location {
  id: number;
  name: string;
  address: string;
  image?: File;
}

export default function LocationsEditor() {
  const [heading, setHeading] = useState('Our Locations');
  const [locations, setLocations] = useState<Location[]>([
    { id: 1, name: 'Main Office', address: '123 Business Rd, Suite 100' },
  ]);

  const handleAddLocation = () => {
    const newId = locations.length > 0 ? Math.max(...locations.map(l => l.id)) + 1 : 1;
    setLocations([...locations, { id: newId, name: '', address: '' }]);
  };

  const handleRemoveLocation = (id: number) => {
    setLocations(locations.filter(l => l.id !== id));
  };

  const handleLocationChange = (id: number, field: string, value: string) => {
    setLocations(locations.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const handleFileAccepted = (id: number, files: File[]) => {
    if (files[0]) {
      setLocations(locations.map(l => l.id === id ? { ...l, image: files[0] } : l));
      console.log(`Image for location ${id}:`, files[0]);
    }
  };

  return (
    <div className="space-y-8">
      <div className="p-6 bg-white rounded-lg shadow-sm border border-slate-200">
        <h3 className="text-xl font-semibold mb-4 border-b pb-2">Locations Page Content</h3>
        <div>
          <label htmlFor="heading" className="block text-sm font-medium text-slate-700 mb-1">Main Heading</label>
          <input
            type="text"
            name="heading"
            id="heading"
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            className="w-full md:w-1/2 px-4 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
          />
        </div>
      </div>

      {locations.map(location => (
        <div key={location.id} className="p-6 bg-white rounded-lg shadow-sm border border-slate-200 relative">
          <button 
            onClick={() => handleRemoveLocation(location.id)}
            className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label htmlFor={`name-${location.id}`} className="block text-sm font-medium text-slate-700 mb-1">Location Name</label>
                <input
                  type="text"
                  id={`name-${location.id}`}
                  value={location.name}
                  onChange={(e) => handleLocationChange(location.id, 'name', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>
              <div>
                <label htmlFor={`address-${location.id}`} className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                <textarea
                  id={`address-${location.id}`}
                  rows={3}
                  value={location.address}
                  onChange={(e) => handleLocationChange(location.id, 'address', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Location Image</label>
              <FileUpload onFilesAccepted={(files) => handleFileAccepted(location.id, files)} />
            </div>
          </div>
        </div>
      ))}

      <div className="flex justify-between items-center">
        <button 
          onClick={handleAddLocation}
          className="flex items-center gap-2 bg-yellow-400 text-slate-900 font-bold py-2 px-4 rounded-md hover:bg-yellow-500 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Location
        </button>
        <button className="bg-slate-800 text-white font-bold py-2 px-6 rounded-md hover:bg-slate-700 transition-colors">
          Save Locations Page
        </button>
      </div>
    </div>
  );
}
