import React from 'react';
import { Users, FileText, CheckSquare } from 'lucide-react';

export default function Dashboard({ leads, jobCards }) {
  const pendingJobCards = jobCards.filter(card => card.status !== 'Processed');
  const processedJobCards = jobCards.filter(card => card.status === 'Processed');

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-black text-secondary tracking-tighter">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-3xl font-bold text-secondary">{leads.length}</p>
              <p className="text-sm font-bold text-slate-500">Total Leads</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-400/10 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-3xl font-bold text-secondary">{pendingJobCards.length}</p>
              <p className="text-sm font-bold text-slate-500">Pending Job Cards</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
              <CheckSquare className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-secondary">{processedJobCards.length}</p>
              <p className="text-sm font-bold text-slate-500">Processed Job Cards</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-secondary mb-4">Recent Activity</h2>
        <p className="text-slate-500">This section will show a feed of recent leads and job card updates.</p>
      </div>
    </div>
  );
}
