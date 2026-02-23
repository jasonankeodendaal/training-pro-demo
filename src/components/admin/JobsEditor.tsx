import React, { useState } from 'react';
import FileUpload from './FileUpload';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface Job {
  id: number;
  title: string;
  description: string;
  gallery: File[];
}

export default function JobsEditor() {
  const [jobs, setJobs] = useState<Job[]>([
    { id: 1, title: 'Major Project A', description: 'A brief description of this landmark project.', gallery: [] },
    { id: 2, title: 'Service Overhaul B', description: 'Details about the comprehensive service overhaul.', gallery: [] },
  ]);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  const handleAddNew = () => {
    const newId = jobs.length > 0 ? Math.max(...jobs.map(j => j.id)) + 1 : 1;
    setEditingJob({ id: newId, title: '', description: '', gallery: [] });
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
  };

  const handleDelete = (id: number) => {
    setJobs(jobs.filter(j => j.id !== id));
  };

  const handleSave = () => {
    if (!editingJob) return;
    const exists = jobs.some(j => j.id === editingJob.id);
    if (exists) {
      setJobs(jobs.map(j => j.id === editingJob.id ? editingJob : j));
    } else {
      setJobs([...jobs, editingJob]);
    }
    setEditingJob(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editingJob) return;
    const { name, value } = e.target;
    setEditingJob({ ...editingJob, [name]: value });
  };

  const handleFilesAccepted = (files: File[]) => {
    if (!editingJob) return;
    setEditingJob({ ...editingJob, gallery: files });
    console.log('Accepted gallery files:', files);
  };

  if (editingJob) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm border border-slate-200 space-y-6">
        <h3 className="text-xl font-semibold">{editingJob.id ? 'Edit' : 'Add'} Job</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
            <input
              type="text"
              name="title"
              id="title"
              value={editingJob.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              name="description"
              id="description"
              rows={4}
              value={editingJob.description}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Image/Video Gallery</label>
            <FileUpload onFilesAccepted={handleFilesAccepted} />
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <button onClick={() => setEditingJob(null)} className="text-slate-600 font-bold py-2 px-4 rounded-md hover:bg-slate-100 transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} className="bg-slate-800 text-white font-bold py-2 px-6 rounded-md hover:bg-slate-700 transition-colors">
            Save Job
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Past Jobs</h2>
        <button onClick={handleAddNew} className="flex items-center gap-2 bg-yellow-400 text-slate-900 font-bold py-2 px-4 rounded-md hover:bg-yellow-500 transition-colors">
          <Plus className="w-5 h-5" />
          Add New Job
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <ul className="divide-y divide-slate-200">
          {jobs.map(job => (
            <li key={job.id} className="p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold">{job.title}</p>
                <p className="text-sm text-slate-500">{job.description}</p>
              </div>
              <div className="flex gap-4">
                <button onClick={() => handleEdit(job)} className="text-slate-500 hover:text-yellow-500"><Edit className="w-5 h-5" /></button>
                <button onClick={() => handleDelete(job.id)} className="text-slate-500 hover:text-red-500"><Trash2 className="w-5 h-5" /></button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
