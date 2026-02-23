import React, { useState } from 'react';
import FileUpload from './FileUpload';

export default function AboutEditor() {
  const [aboutContent, setAboutContent] = useState({
    mission: 'Our mission is to provide top-tier training solutions.',
    vision: 'Our vision is to be the leading safety and operational training provider.',
  });
  const [heroImage, setHeroImage] = useState<File[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAboutContent(prev => ({ ...prev, [name]: value }));
  };

  const handleFileAccepted = (files: File[]) => {
    setHeroImage(files);
    console.log('Accepted hero image:', files);
  };

  return (
    <div className="space-y-8">
      <div className="p-6 bg-white rounded-lg shadow-sm border border-slate-200">
        <h3 className="text-xl font-semibold mb-4 border-b pb-2">About Page Content</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label htmlFor="mission" className="block text-sm font-medium text-slate-700 mb-1">Mission Statement</label>
              <textarea
                name="mission"
                id="mission"
                rows={5}
                value={aboutContent.mission}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>
            <div>
              <label htmlFor="vision" className="block text-sm font-medium text-slate-700 mb-1">Vision Statement</label>
              <textarea
                name="vision"
                id="vision"
                rows={5}
                value={aboutContent.vision}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Hero Image</label>
            <FileUpload onFilesAccepted={handleFileAccepted} />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="bg-slate-800 text-white font-bold py-2 px-6 rounded-md hover:bg-slate-700 transition-colors">
          Save About Page
        </button>
      </div>
    </div>
  );
}
