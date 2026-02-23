import React, { useState } from 'react';
import FileUpload from './FileUpload';

export default function HomeEditor() {
  const [heroContent, setHeroContent] = useState({
    heading: 'Default Hero Heading',
    subheading: 'Default hero subheading text.',
    ctaText: 'Call to Action',
  });
  const [heroImages, setHeroImages] = useState<File[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setHeroContent(prev => ({ ...prev, [name]: value }));
  };

  const handleFilesAccepted = (files: File[]) => {
    setHeroImages(files);
    console.log('Accepted hero images:', files);
  };

  return (
    <div className="space-y-8">
      {/* Hero Section Management */}
      <div className="p-6 bg-white rounded-lg shadow-sm border border-slate-200">
        <h3 className="text-xl font-semibold mb-4 border-b pb-2">Hero Section</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="heading" className="block text-sm font-medium text-slate-700 mb-1">Heading</label>
              <input
                type="text"
                name="heading"
                id="heading"
                value={heroContent.heading}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>
            <div>
              <label htmlFor="subheading" className="block text-sm font-medium text-slate-700 mb-1">Subheading</label>
              <textarea
                name="subheading"
                id="subheading"
                rows={3}
                value={heroContent.subheading}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>
            <div>
              <label htmlFor="ctaText" className="block text-sm font-medium text-slate-700 mb-1">CTA Button Text</label>
              <input
                type="text"
                name="ctaText"
                id="ctaText"
                value={heroContent.ctaText}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Hero Images</label>
            <FileUpload onFilesAccepted={handleFilesAccepted} />
          </div>
        </div>
      </div>

      {/* Placeholder for other homepage sections */}
      <div className="p-6 bg-white rounded-lg shadow-sm border border-slate-200">
        <h3 className="text-xl font-semibold mb-4 border-b pb-2">Other Sections</h3>
        <p className="text-slate-500">Management for other homepage sections will be added here.</p>
      </div>

      <div className="flex justify-end">
        <button className="bg-slate-800 text-white font-bold py-2 px-6 rounded-md hover:bg-slate-700 transition-colors">
          Save Homepage
        </button>
      </div>
    </div>
  );
}
