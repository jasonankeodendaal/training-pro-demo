import React, { useState, useEffect } from 'react';
import Card from '../../components/admin/Card';
import FileUpload from '../../components/admin/FileUpload';

export default function AdminHome() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/settings/home')
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setLoading(false);
      });
  }, []);

  const handleFileChange = (files) => {
    // Handle file uploads here
    console.log(files);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-slate-900">Manage Home Page</h1>
      
      <Card
        title="Hero Section"
        footer={<button className="bg-slate-900 text-white px-6 py-2 rounded-lg font-semibold hover:bg-slate-800">Save Hero Section</button>}
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Hero Images</label>
            <FileUpload onFilesAccepted={handleFileChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Teaser Text</label>
            <textarea 
              rows={4}
              className="w-full p-2 border border-slate-300 rounded-lg"
              defaultValue={settings.teaserText}
            />
          </div>
        </div>
      </Card>

      {/* Add more cards for other sections here */}
    </div>
  );
}
