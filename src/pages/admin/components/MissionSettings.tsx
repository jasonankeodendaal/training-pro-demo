import React, { useState } from 'react';

export default function MissionSettings() {
  const [title, setTitle] = useState('Our Mission');
  const [content, setContent] = useState('To provide the highest quality safety and operational training to empower the workforce and create safer, more productive work environments.');

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="mission-title" className="block text-sm font-medium text-slate-700">Title</label>
        <input type="text" id="mission-title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm" />
      </div>
      <div>
        <label htmlFor="mission-content" className="block text-sm font-medium text-slate-700">Content</label>
        <textarea id="mission-content" value={content} onChange={(e) => setContent(e.target.value)} rows={5} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm"></textarea>
      </div>
      <div>
        <label htmlFor="mission-image" className="block text-sm font-medium text-slate-700">Image</label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <div className="flex text-sm text-slate-600"><label htmlFor="file-upload-mission" className="relative cursor-pointer bg-white rounded-md font-medium text-yellow-600 hover:text-yellow-500"><span>Upload a file</span><input id="file-upload-mission" name="file-upload-mission" type="file" className="sr-only" /></label><p className="pl-1">or drag and drop</p></div>
            <p className="text-xs text-slate-500">PNG, JPG up to 10MB</p>
          </div>
        </div>
      </div>
    </div>
  );
}

