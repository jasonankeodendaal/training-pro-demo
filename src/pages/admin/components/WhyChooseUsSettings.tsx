import React, { useState } from 'react';

const initialPoints = [
  { icon: 'IconA', title: 'Expert Instructors', description: 'Learn from the best in the industry.' },
  { icon: 'IconB', title: 'Flexible Scheduling', description: 'Courses that fit your busy life.' },
  { icon: 'IconC', title: 'Certified Courses', description: 'Recognized certifications to advance your career.' },
];

export default function WhyChooseUsSettings() {
  const [title, setTitle] = useState('Why Choose Us');
  const [points, setPoints] = useState(initialPoints);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium leading-6 text-slate-900">\'Why Choose Us\' Section</h3>
        <p className="mt-1 text-sm text-slate-600">Update the title and the main image for this section.</p>
        <div className="mt-6 space-y-6">
          <div>
            <label htmlFor="why-title" className="block text-sm font-medium text-slate-700">Title</label>
            <input type="text" id="why-title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm" />
          </div>
          <div>
            <label htmlFor="why-image" className="block text-sm font-medium text-slate-700">Image</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <div className="flex text-sm text-slate-600"><label htmlFor="file-upload-why" className="relative cursor-pointer bg-white rounded-md font-medium text-yellow-600 hover:text-yellow-500"><span>Upload a file</span><input id="file-upload-why" name="file-upload-why" type="file" className="sr-only" /></label><p className="pl-1">or drag and drop</p></div>
                <p className="text-xs text-slate-500">PNG, JPG up to 10MB</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium leading-6 text-slate-900">Key Points</h3>
        <p className="mt-1 text-sm text-slate-600">Manage the key points displayed in this section.</p>
        <div className="mt-6 space-y-4">
          {points.map((point, index) => (
            <div key={index} className="p-4 border border-slate-200 rounded-md grid grid-cols-1 md:grid-cols-3 gap-4">
              <input type="text" value={point.icon} placeholder="Icon" className="md:col-span-1 mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm" />
              <input type="text" value={point.title} placeholder="Point Title" className="md:col-span-2 mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm" />
              <textarea value={point.description} placeholder="Point Description" rows={2} className="md:col-span-3 mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm"></textarea>
              <div className="md:col-span-3 flex justify-end">
                <button className="text-sm text-red-600 hover:text-red-800">Remove</button>
              </div>
            </div>
          ))}
          <button className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-md text-sm font-medium hover:bg-slate-700">Add Point</button>
        </div>
      </div>
    </div>
  );
}

