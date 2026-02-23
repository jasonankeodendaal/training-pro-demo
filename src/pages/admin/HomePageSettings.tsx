import React, { useState } from 'react';
import HeroSettings from './components/HeroSettings';
import ServicesSettings from './components/ServicesSettings';
import WhyChooseUsSettings from './components/WhyChooseUsSettings';
import PastJobsSettings from './components/PastJobsSettings';

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

export default function HomePageSettings() {
  const [activeTab, setActiveTab] = useState('hero');

  return (
    <div>
      <div className="border-b border-slate-200">
        <div className="-mb-px flex space-x-2">
          <TabButton active={activeTab === 'hero'} onClick={() => setActiveTab('hero')}>Hero Section</TabButton>
          <TabButton active={activeTab === 'services'} onClick={() => setActiveTab('services')}>Services Section</TabButton>
          <TabButton active={activeTab === 'why-choose-us'} onClick={() => setActiveTab('why-choose-us')}>Why Choose Us</TabButton>
          <TabButton active={activeTab === 'jobs'} onClick={() => setActiveTab('jobs')}>Past Jobs</TabButton>
        </div>
      </div>
      <div className="p-4 bg-white mt-2 rounded-b-lg">
        {activeTab === 'hero' && <HeroSettings />}
        {activeTab === 'services' && <ServicesSettings />}
        {activeTab === 'why-choose-us' && <WhyChooseUsSettings />}
        {activeTab === 'jobs' && <PastJobsSettings />}
      </div>
    </div>
  );
}
