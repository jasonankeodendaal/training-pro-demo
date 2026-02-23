import React, { useState } from 'react';

const initialJobs = [
  { id: 1, title: 'Major Construction Site', content: 'Full page content for this job...', images: [] },
  { id: 2, title: 'Warehouse Logistics', content: 'Full page content for this job...', images: [] },
];

export default function JobsSettings() {
  const [jobs, setJobs] = useState(initialJobs);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Manage Jobs</h2>
      {jobs.map((job, index) => (
        <div key={index} className="p-4 border border-slate-200 rounded-md">
          <input type="text" value={job.title} className="text-lg font-bold w-full mb-2" />
          <textarea value={job.content} rows={5} className="w-full mb-2 p-2 border rounded-md" />
          <h4 className="font-bold mt-4">Images</h4>
          {/* Image upload UI will go here */}
          <div className="flex justify-end mt-4">
            <button className="text-sm text-red-600 hover:text-red-800">Remove Job</button>
          </div>
        </div>
      ))}
      <button className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-md text-sm font-medium hover:bg-slate-700">Add New Job</button>
    </div>
  );
}

