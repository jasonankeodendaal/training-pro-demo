import React, { useState } from 'react';
import MissionSettings from './components/MissionSettings';
import VisionSettings from './components/VisionSettings';
import TeamSettings from './components/TeamSettings';

const TabButton = ({ active, onClick, children }: { active: boolean, onClick: () => void, children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
      active
        ? 'bg-white text-slate-900 border-slate-200 border-b-0'
        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
    }`}
  >
    {children}
  </button>
);

export default function AboutPageSettings() {
  const [activeTab, setActiveTab] = useState('mission');

  return (
    <div>
      <div className="border-b border-slate-200">
        <div className="-mb-px flex space-x-2">
          <TabButton active={activeTab === 'mission'} onClick={() => setActiveTab('mission')}>Our Mission</TabButton>
          <TabButton active={activeTab === 'vision'} onClick={() => setActiveTab('vision')}>Our Vision</TabButton>
          <TabButton active={activeTab === 'team'} onClick={() => setActiveTab('team')}>Our Team</TabButton>
        </div>
      </div>
      <div className="p-4 bg-white mt-2 rounded-b-lg">
        {activeTab === 'mission' && <MissionSettings />}
        {activeTab === 'vision' && <VisionSettings />}
        {activeTab === 'team' && <TeamSettings />}
      </div>
    </div>
  );
}

