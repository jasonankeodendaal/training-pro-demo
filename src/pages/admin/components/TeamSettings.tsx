import React, { useState } from 'react';

const initialTeamMembers = [
  { name: 'John Doe', role: 'Lead Instructor', image: 'team1.jpg' },
  { name: 'Jane Smith', role: 'Safety Specialist', image: 'team2.jpg' },
  { name: 'Peter Jones', role: 'Operations Manager', image: 'team3.jpg' },
];

export default function TeamSettings() {
  const [title, setTitle] = useState('Our Team');
  const [teamMembers, setTeamMembers] = useState(initialTeamMembers);

  return (
    <div className="space-y-8">
      <div>
        <label htmlFor="team-title" className="block text-sm font-medium text-slate-700">Title</label>
        <input type="text" id="team-title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm" />
      </div>

      <div>
        <h3 className="text-lg font-medium leading-6 text-slate-900">Team Members</h3>
        <div className="mt-6 space-y-4">
          {teamMembers.map((member, index) => (
            <div key={index} className="p-4 border border-slate-200 rounded-md grid grid-cols-1 md:grid-cols-3 gap-4">
              <input type="text" value={member.name} placeholder="Name" className="md:col-span-1 mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm" />
              <input type="text" value={member.role} placeholder="Role" className="md:col-span-2 mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm" />
              <div className="md:col-span-3">
                <label htmlFor={`member-image-${index}`} className="block text-sm font-medium text-slate-700">Image</label>
                <div className="mt-1 flex items-center">
                  <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-slate-100">
                    {/* Placeholder for image preview */}
                  </span>
                  <input type="file" id={`member-image-${index}`} className="ml-4" />
                </div>
              </div>
              <div className="md:col-span-3 flex justify-end">
                <button className="text-sm text-red-600 hover:text-red-800">Remove</button>
              </div>
            </div>
          ))}
          <button className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-md text-sm font-medium hover:bg-slate-700">Add Member</button>
        </div>
      </div>
    </div>
  );
}

