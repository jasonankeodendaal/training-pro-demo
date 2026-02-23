import React, { useState } from 'react';

const initialJobs = [
  { image: 'job1.jpg', title: 'Major Construction Site', category: 'Construction' },
  { image: 'job2.jpg', title: 'Warehouse Logistics', category: 'Logistics' },
  { image: 'job3.jpg', title: 'Roadworks Safety', category: 'Infrastructure' },
];

export default function PastJobsSettings() {
  const [title, setTitle] = useState('Our Past Jobs');
  const [description, setDescription] = useState('We have a proven track record of success across a variety of industries. Here are some of our recent projects.');
  const [jobs, setJobs] = useState(initialJobs);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium leading-6 text-slate-900">Past Jobs Section</h3>
        <p className="mt-1 text-sm text-slate-600">Update the title and description for this section.</p>
        <div className="mt-6 space-y-6">
          <div>
            <label htmlFor="jobs-title" className="block text-sm font-medium text-slate-700">Title</label>
            <input type="text" id="jobs-title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm" />
          </div>
          <div>
            <label htmlFor="jobs-description" className="block text-sm font-medium text-slate-700">Description</label>
            <textarea id="jobs-description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm"></textarea>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium leading-6 text-slate-900">Jobs Gallery</h3>
        <p className="mt-1 text-sm text-slate-600">Manage the jobs displayed in the gallery.</p>
        <div className="mt-6 space-y-4">
          {jobs.map((job, index) => (
            <div key={index} className="p-4 border border-slate-200 rounded-md grid grid-cols-1 md:grid-cols-3 gap-4">
              <input type="text" value={job.title} placeholder="Job Title" className="md:col-span-2 mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm" />
              <input type="text" value={job.category} placeholder="Category" className="md:col-span-1 mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm" />
              <div className="md:col-span-3">
                <label htmlFor={`job-image-${index}`} className="block text-sm font-medium text-slate-700">Image</label>
                <div className="mt-1 flex items-center">
                  <span className="inline-block h-12 w-12 rounded-md overflow-hidden bg-slate-100">
                    {/* Placeholder for image preview */}
                  </span>
                  <input type="file" id={`job-image-${index}`} className="ml-4" />
                </div>
              </div>
              <div className="md:col-span-3 flex justify-end">
                <button className="text-sm text-red-600 hover:text-red-800">Remove</button>
              </div>
            </div>
          ))}
          <button className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-md text-sm font-medium hover:bg-slate-700">Add Job</button>
        </div>
      </div>
    </div>
  );
}

