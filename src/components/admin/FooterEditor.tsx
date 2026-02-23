import React, { useState } from 'react';
import FileUpload from './FileUpload';
import { Plus, Trash2 } from 'lucide-react';

interface SocialLink {
  id: number;
  url: string;
  icon?: File;
}

export default function FooterEditor() {
  const [copyright, setCopyright] = useState('Your Company Name. All Rights Reserved.');
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    { id: 1, url: 'https://facebook.com' },
    { id: 2, url: 'https://twitter.com' },
  ]);

  const handleAddLink = () => {
    const newId = socialLinks.length > 0 ? Math.max(...socialLinks.map(l => l.id)) + 1 : 1;
    setSocialLinks([...socialLinks, { id: newId, url: '' }]);
  };

  const handleRemoveLink = (id: number) => {
    setSocialLinks(socialLinks.filter(l => l.id !== id));
  };

  const handleLinkChange = (id: number, value: string) => {
    setSocialLinks(socialLinks.map(l => l.id === id ? { ...l, url: value } : l));
  };

  const handleFileAccepted = (id: number, files: File[]) => {
    if (files[0]) {
      setSocialLinks(socialLinks.map(l => l.id === id ? { ...l, icon: files[0] } : l));
      console.log(`Icon for link ${id}:`, files[0]);
    }
  };

  return (
    <div className="space-y-8">
      <div className="p-6 bg-white rounded-lg shadow-sm border border-slate-200">
        <h3 className="text-xl font-semibold mb-4 border-b pb-2">Footer Content</h3>
        <div>
          <label htmlFor="copyright" className="block text-sm font-medium text-slate-700 mb-1">Copyright Text</label>
          <input
            type="text"
            name="copyright"
            id="copyright"
            value={copyright}
            onChange={(e) => setCopyright(e.target.value)}
            className="w-full md:w-1/2 px-4 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
          />
        </div>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-sm border border-slate-200">
        <h3 className="text-xl font-semibold mb-4 border-b pb-2">Social Media Links</h3>
        <div className="space-y-4">
          {socialLinks.map(link => (
            <div key={link.id} className="flex items-center gap-4 p-4 border rounded-md">
              <div className="w-1/2">
                <label htmlFor={`url-${link.id}`} className="block text-sm font-medium text-slate-700 mb-1">URL</label>
                <input
                  type="text"
                  id={`url-${link.id}`}
                  value={link.url}
                  onChange={(e) => handleLinkChange(link.id, e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Icon</label>
                <FileUpload onFilesAccepted={(files) => handleFileAccepted(link.id, files)} />
              </div>
              <button onClick={() => handleRemoveLink(link.id)} className="text-slate-400 hover:text-red-500"><Trash2 /></button>
            </div>
          ))}
        </div>
        <button onClick={handleAddLink} className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800">
          <Plus className="w-4 h-4" />
          Add Social Link
        </button>
      </div>

      <div className="flex justify-end">
        <button className="bg-slate-800 text-white font-bold py-2 px-6 rounded-md hover:bg-slate-700 transition-colors">
          Save Footer
        </button>
      </div>
    </div>
  );
}
