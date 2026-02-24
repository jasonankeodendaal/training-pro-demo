import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Home as HomeIcon, 
  BookOpen, 
  Users, 
  Settings, 
  ChevronRight,
  Mail,
  Phone,
  Building,
  Calendar,
  CheckSquare,
  Trash2,
  Plus,
  Save,
  Printer
} from 'lucide-react';

function JobCardForm({ lead, services, onComplete }: { lead: any, services: any[], onComplete: () => void }) {
  const [items, setItems] = useState<any[]>([]);
  const [trainees, setTrainees] = useState<any[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<any[]>([]);
  const [newTrainee, setNewTrainee] = useState({ name: '', age: '', jobTitle: '', whatsapp: '', checklist: [] as string[] });
  const [newItem, setNewItem] = useState({ description: '', status: 'Pending', notes: '' });
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [saving, setSaving] = useState(false);

  // Initialize selected courses from lead if available
  useEffect(() => {
    if (lead && lead.serviceTitle) {
      const initialService = services.find(s => s.title === lead.serviceTitle);
      if (initialService) {
        setSelectedCourses([initialService]);
      }
    }
    if (lead && lead.employees) {
      try {
        const leadEmps = JSON.parse(lead.employees);
        setTrainees(leadEmps.map((e: any) => ({ ...e, checklist: [] })));
      } catch (e) {}
    }
  }, [lead, services]);

  const addTrainee = () => {
    if (!newTrainee.name) return;
    setTrainees([...trainees, { ...newTrainee, checklist: [] }]);
    setNewTrainee({ name: '', age: '', jobTitle: '', whatsapp: '', checklist: [] });
  };

  const removeTrainee = (idx: number) => {
    setTrainees(trainees.filter((_, i) => i !== idx));
  };

  const toggleTraineeChecklist = (traineeIdx: number, item: string) => {
    const updated = [...trainees];
    const currentChecklist = updated[traineeIdx].checklist || [];
    if (currentChecklist.includes(item)) {
      updated[traineeIdx].checklist = currentChecklist.filter((i: string) => i !== item);
    } else {
      updated[traineeIdx].checklist = [...currentChecklist, item];
    }
    setTrainees(updated);
  };

  const toggleCourse = (course: any) => {
    if (selectedCourses.find(c => c.id === course.id)) {
      setSelectedCourses(selectedCourses.filter(c => c.id !== course.id));
    } else {
      setSelectedCourses([...selectedCourses, course]);
    }
  };

  const addItem = () => {
    if (!newItem.description) return;
    setItems([...items, newItem]);
    setNewItem({ description: '', status: 'Pending', notes: '' });
  };

  const removeItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    if (selectedCourses.length === 0) {
      alert('Please select at least one course.');
      return;
    }
    setSaving(true);
    try {
      await fetch('/api/admin/job-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: lead.id,
          clientName: lead.companyName,
          serviceTitle: selectedCourses.map(c => c.title).join(', '),
          date,
          items,
          trainees,
          courses: selectedCourses.map(c => ({ id: c.id, title: c.title })),
          totalCost: 0
        })
      });
      alert('Job card created successfully!');
      onComplete();
    } catch (error) {
      alert('Failed to create job card');
    } finally {
      setSaving(false);
    }
  };

  const allChecklistItems = Array.from(new Set(selectedCourses.flatMap(c => {
    try {
      return JSON.parse(c.checklistOptions || '[]');
    } catch (e) {
      return [];
    }
  })));

  return (
    <div className="space-y-8 bg-slate-50 p-8 rounded-sm border border-slate-200">
      <div className="grid grid-cols-2 gap-4 md:gap-8">
        <div className="space-y-4">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Job Date</label>
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 border border-slate-200 rounded-sm focus:ring-2 focus:ring-slate-900 outline-none transition-all"
          />
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Select Courses / Services</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {services.map(service => (
            <button
              key={service.id}
              onClick={() => toggleCourse(service)}
              className={`p-3 text-left border rounded-sm transition-all flex items-center gap-3 ${
                selectedCourses.find(c => c.id === service.id)
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'
              }`}
            >
              <div className={`w-4 h-4 rounded-sm border flex items-center justify-center ${
                selectedCourses.find(c => c.id === service.id) ? 'bg-white border-white' : 'border-slate-300'
              }`}>
                {selectedCourses.find(c => c.id === service.id) && <div className="w-2 h-2 bg-slate-900 rounded-sm" />}
              </div>
              <span className="text-sm font-bold truncate">{service.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center border-b border-slate-200 pb-2">
          <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Trainees / Employees</h4>
          <span className="text-[10px] font-bold text-slate-400 uppercase">{trainees.length} Added</span>
        </div>
        
        <div className="space-y-4">
          {trainees.map((trainee, tIdx) => (
            <div key={tIdx} className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-lg font-black text-slate-900 uppercase tracking-tighter">{trainee.name}</p>
                  <p className="text-xs text-slate-500 font-bold uppercase">{trainee.jobTitle} • Age: {trainee.age}</p>
                </div>
                <button onClick={() => removeTrainee(tIdx)} className="text-slate-300 hover:text-red-500 transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {allChecklistItems.length > 0 && (
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Training Progress / Requirements</p>
                  <div className="grid grid-cols-2 gap-2">
                    {allChecklistItems.map((item: any, i: number) => (
                      <button
                        key={i}
                        onClick={() => toggleTraineeChecklist(tIdx, item)}
                        className={`flex items-center gap-3 p-2 rounded-sm border text-left transition-all ${
                          (trainee.checklist || []).includes(item)
                            ? 'bg-green-50 border-green-200 text-green-700'
                            : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-200'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-sm border flex items-center justify-center ${
                          (trainee.checklist || []).includes(item) ? 'bg-green-500 border-green-500' : 'bg-white border-slate-200'
                        }`}>
                          {(trainee.checklist || []).includes(item) && <div className="w-2 h-2 bg-white rounded-sm" />}
                        </div>
                        <span className="text-xs font-bold truncate">{item}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-sm border-2 border-dashed border-slate-200 space-y-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Add New Trainee</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input 
              type="text" 
              placeholder="Full Name" 
              value={newTrainee.name}
              onChange={(e) => setNewTrainee({...newTrainee, name: e.target.value})}
              className="w-full px-4 py-2 border border-slate-200 rounded-sm text-sm"
            />
            <input 
              type="text" 
              placeholder="Age" 
              value={newTrainee.age}
              onChange={(e) => setNewTrainee({...newTrainee, age: e.target.value})}
              className="w-full px-4 py-2 border border-slate-200 rounded-sm text-sm"
            />
            <input 
              type="text" 
              placeholder="Job Title" 
              value={newTrainee.jobTitle}
              onChange={(e) => setNewTrainee({...newTrainee, jobTitle: e.target.value})}
              className="w-full px-4 py-2 border border-slate-200 rounded-sm text-sm"
            />
            <input 
              type="text" 
              placeholder="WhatsApp (Optional)" 
              value={newTrainee.whatsapp}
              onChange={(e) => setNewTrainee({...newTrainee, whatsapp: e.target.value})}
              className="w-full px-4 py-2 border border-slate-200 rounded-sm text-sm"
            />
          </div>
          <button 
            onClick={addTrainee}
            className="w-full py-3 bg-slate-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-slate-800 rounded-sm flex items-center justify-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Trainee to List
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center border-b border-slate-200 pb-2">
          <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Additional Job Tasks</h4>
          <span className="text-[10px] font-bold text-slate-400 uppercase">{items.length} Tasks</span>
        </div>
        
        <div className="space-y-3">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-start gap-4 bg-white p-4 rounded-sm border border-slate-200 shadow-sm">
              <div className="flex-grow">
                <p className="font-bold text-slate-900">{item.description}</p>
                <p className="text-xs text-slate-500 mt-1">{item.notes}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-sm ${
                  item.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {item.status}
                </span>
                <button onClick={() => removeItem(idx)} className="text-slate-300 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-sm border border-slate-200 space-y-4 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <input 
                type="text" 
                placeholder="Task description (e.g. Equipment setup, Site safety check)" 
                value={newItem.description}
                onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                className="w-full px-4 py-2 border border-slate-200 rounded-sm text-sm"
              />
            </div>
            <select 
              value={newItem.status}
              onChange={(e) => setNewItem({...newItem, status: e.target.value})}
              className="w-full px-4 py-2 border border-slate-200 rounded-sm text-sm font-bold"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <textarea 
            placeholder="Additional notes for this task..." 
            value={newItem.notes}
            onChange={(e) => setNewItem({...newItem, notes: e.target.value})}
            className="w-full px-4 py-2 border border-slate-200 rounded-sm text-sm"
            rows={2}
          />
          <button 
            onClick={addItem}
            className="w-full py-2 bg-slate-100 text-slate-600 font-bold text-xs uppercase tracking-widest hover:bg-slate-200 rounded-sm border border-slate-200 flex items-center justify-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Task
          </button>
        </div>
      </div>

      <div className="pt-8 border-t border-slate-200">
        <button 
          onClick={handleSubmit}
          disabled={saving}
          className="w-full py-4 bg-slate-900 text-white font-black rounded-sm uppercase tracking-widest hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center gap-3 text-lg transition-all shadow-xl hover:shadow-2xl active:scale-[0.98]"
        >
          <Save className="w-6 h-6" /> {saving ? 'Creating Job Card...' : 'Generate Final Job Card'}
        </button>
      </div>
    </div>
  );
}

function FormsManager({ settings, setSettings }: { settings: any, setSettings: (s: any) => void }) {
  const [activeForm, setActiveForm] = useState<'contact' | 'course'>('contact');
  
  const addField = (formKey: 'contact_form' | 'course_form') => {
    const newField = { name: `field_${Date.now()}`, label: 'New Field', type: 'text', required: false };
    const updated = [...(settings[formKey] || []), newField];
    setSettings({ ...settings, [formKey]: updated });
  };

  const removeField = (formKey: 'contact_form' | 'course_form', idx: number) => {
    const updated = [...(settings[formKey] || [])];
    updated.splice(idx, 1);
    setSettings({ ...settings, [formKey]: updated });
  };

  const updateField = (formKey: 'contact_form' | 'course_form', idx: number, key: string, value: any) => {
    const updated = [...(settings[formKey] || [])];
    updated[idx] = { ...updated[idx], [key]: value };
    setSettings({ ...settings, [formKey]: updated });
  };

  const saveForms = async () => {
    try {
      await Promise.all([
        fetch('/api/settings/contact_form', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(settings.contact_form)
        }),
        fetch('/api/settings/course_form', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(settings.course_form)
        })
      ]);
      alert('Forms updated successfully!');
    } catch (e) {
      alert('Failed to update forms');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex gap-4">
          <button 
            onClick={() => setActiveForm('contact')}
            className={`px-6 py-2 rounded-xl font-bold transition-all ${activeForm === 'contact' ? 'bg-primary text-secondary shadow-md' : 'bg-slate-100 text-slate-500'}`}
          >
            Contact Form
          </button>
          <button 
            onClick={() => setActiveForm('course')}
            className={`px-6 py-2 rounded-xl font-bold transition-all ${activeForm === 'course' ? 'bg-primary text-secondary shadow-md' : 'bg-slate-100 text-slate-500'}`}
          >
            Course Enrollment
          </button>
        </div>
        <button 
          onClick={saveForms}
          className="bg-secondary text-white px-8 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all"
        >
          <Save className="w-4 h-4" /> Save All
        </button>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-bold text-secondary">
            {activeForm === 'contact' ? 'Contact Us Form Fields' : 'Course Enrollment Form Fields'}
          </h3>
          <button 
            onClick={() => addField(activeForm === 'contact' ? 'contact_form' : 'course_form')}
            className="text-primary font-bold flex items-center gap-1 hover:underline"
          >
            <Plus className="w-4 h-4" /> Add Field
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(settings[activeForm === 'contact' ? 'contact_form' : 'course_form'] || []).map((field: any, idx: number) => (
            <div key={idx} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 group relative">
              <button 
                onClick={() => removeField(activeForm === 'contact' ? 'contact_form' : 'course_form', idx)}
                className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Label</label>
                  <input 
                    type="text" 
                    value={field.label} 
                    onChange={(e) => updateField(activeForm === 'contact' ? 'contact_form' : 'course_form', idx, 'label', e.target.value)}
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Name (ID)</label>
                  <input 
                    type="text" 
                    value={field.name} 
                    onChange={(e) => updateField(activeForm === 'contact' ? 'contact_form' : 'course_form', idx, 'name', e.target.value)}
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Type</label>
                  <select 
                    value={field.type} 
                    onChange={(e) => updateField(activeForm === 'contact' ? 'contact_form' : 'course_form', idx, 'type', e.target.value)}
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                  >
                    <option value="text">Text</option>
                    <option value="email">Email</option>
                    <option value="tel">Phone</option>
                    <option value="number">Number</option>
                    <option value="textarea">Textarea</option>
                  </select>
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={field.required} 
                      onChange={(e) => updateField(activeForm === 'contact' ? 'contact_form' : 'course_form', idx, 'required', e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-bold text-slate-700">Required</span>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import Dashboard from './admin/components/Dashboard';
import ContentManager from './admin/components/ContentManager';
import Settings from './admin/components/Settings';

function AdminHeader() {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-30 flex justify-between items-center">
      <h1 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Admin <span className="text-yellow-500">Pro</span></h1>
      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            localStorage.removeItem('isAuthenticated');
            window.location.href = '/login';
          }}
          className="bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700"
        >
          Logout
        </button>
        <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white text-xs font-bold">JD</div>
      </div>
    </header>
  );
}

function JobsManager({ jobs, onEdit, onDelete }: { jobs: any[], onEdit: (j: any) => void, onDelete: (id: number) => void }) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
        <h2 className="text-3xl font-bold text-secondary tracking-tight">Past Jobs Gallery</h2>
        <button 
          onClick={() => onEdit({ title: '', description: '', images: '[]', videoUrl: '', howItWorks: '[]' })}
          className="bg-primary text-secondary px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" /> Add New Job
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden group hover:shadow-xl transition-all">
            <div className="aspect-video relative overflow-hidden">
              {job.images && JSON.parse(job.images).length > 0 ? (
                <img src={JSON.parse(job.images)[0]} alt={job.title} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" />
              ) : (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">No Image</div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent opacity-0 group-hover:opacity-100 transition-all flex items-end p-6">
                <div className="flex gap-2 w-full">
                  <button onClick={() => onEdit(job)} className="flex-1 bg-white text-secondary py-2 rounded-xl font-bold text-sm">Edit</button>
                  <button onClick={() => onDelete(job.id)} className="flex-1 bg-red-500 text-white py-2 rounded-xl font-bold text-sm">Delete</button>
                </div>
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-xl font-bold text-secondary mb-2 line-clamp-1">{job.title}</h3>
              <p className="text-slate-500 text-sm line-clamp-2 mb-4 font-medium">{job.description}</p>
              <div className="flex items-center gap-2 text-primary">
                <CheckSquare className="w-4 h-4" />
                <span className="text-xs font-black uppercase tracking-widest">{JSON.parse(job.howItWorks || '[]').length} Milestones</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import AdminLayout from './admin/AdminLayout';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [leads, setLeads] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [jobCards, setJobCards] = useState<any[]>([]);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [selectedJobCard, setSelectedJobCard] = useState<any>(null);
  const [confirmProcessed, setConfirmProcessed] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [editingJob, setEditingJob] = useState<any>(null);
  const [settings, setSettings] = useState<any>({
    header: null,
    footer: null,
    home: null,
    about: null,
    company_details: null,
    theme_settings: null,
    locations: null
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [leadsRes, servicesRes, jobsRes, cardsRes, headerRes, footerRes, homeRes, aboutRes, companyRes, themeRes, locationsRes, contactFormRes, courseFormRes] = await Promise.all([
      fetch('/api/admin/leads').then(r => r.json()),
      fetch('/api/services').then(r => r.json()),
      fetch('/api/jobs').then(r => r.json()),
      fetch('/api/admin/job-cards').then(r => r.json()),
      fetch('/api/settings/header').then(r => r.json()),
      fetch('/api/settings/footer').then(r => r.json()),
      fetch('/api/settings/home').then(r => r.json()),
      fetch('/api/settings/about').then(r => r.json()),
      fetch('/api/settings/company_details').then(r => r.json().catch(() => null)),
      fetch('/api/settings/theme_settings').then(r => r.json().catch(() => null)),
      fetch('/api/settings/locations').then(r => r.json().catch(() => null)),
      fetch('/api/settings/contact_form').then(r => r.json().catch(() => [])),
      fetch('/api/settings/course_form').then(r => r.json().catch(() => []))
    ]);

    setLeads(leadsRes);
    setServices(servicesRes);
    setJobs(jobsRes);
    setJobCards(cardsRes);
    setSettings({
      header: headerRes,
      footer: footerRes,
      home: homeRes,
      about: aboutRes,
      company_details: companyRes,
      theme_settings: themeRes,
      locations: locationsRes,
      contact_form: contactFormRes,
      course_form: courseFormRes
    });

    // Ensure socialLinks is an array for Admin compatibility
    if (footerRes && footerRes.socialLinks && !Array.isArray(footerRes.socialLinks)) {
      footerRes.socialLinks = [
        { id: "1", platform: "Facebook", url: footerRes.socialLinks.facebook || "#", icon: "" },
        { id: "2", platform: "Twitter", url: footerRes.socialLinks.twitter || "#", icon: "" },
        { id: "3", platform: "Instagram", url: footerRes.socialLinks.instagram || "#", icon: "" },
        { id: "4", platform: "LinkedIn", url: footerRes.socialLinks.linkedin || "#", icon: "" }
      ];
    }

    // Normalize About settings
    if (aboutRes) {
      if (!aboutRes.heroImages) {
        aboutRes.heroImages = aboutRes.heroImage ? [aboutRes.heroImage] : [];
      }
      if (!aboutRes.fullStory) {
        aboutRes.fullStory = "";
      }
    }

    // Normalize Home settings
    if (homeRes) {
      if (!homeRes.heroImages) homeRes.heroImages = [];
      if (!homeRes.heroTitle) homeRes.heroTitle = "Safety Excellence Without Compromise.";
      if (!homeRes.heroSubtitle) homeRes.heroSubtitle = "Delivering industry-leading safety and operational training since 2010.";
      if (!homeRes.ctaButtons) {
        homeRes.ctaButtons = [
          { text: "Read More", url: "/about", primary: true },
          { text: "Contact", url: "#contact", primary: false }
        ];
      }
    }

    setSettings({
      header: headerRes,
      footer: footerRes,
      home: homeRes,
      about: aboutRes,
      company_details: companyRes || {
        name: "", address: "", phone: "", email: "", openHours: "", mapUrl: "", logo: ""
      },
      theme_settings: themeRes || {
        primaryColor: "#facc15", secondaryColor: "#0f172a", fontFamily: "Inter"
      },
      locations: locationsRes || {
        heroImage: ""
      }
    });
  };

  const handleHomeHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = [...(settings.home.heroImages || [])];
      for (let i = 0; i < e.target.files.length; i++) {
        const url = await handleFileUpload(e.target.files[i]);
        if (url) newImages.push(url);
      }
      setSettings({ ...settings, home: { ...settings.home, heroImages: newImages } });
    }
  };

  const removeHomeHeroImage = (index: number) => {
    const newImages = [...settings.home.heroImages];
    newImages.splice(index, 1);
    setSettings({ ...settings, home: { ...settings.home, heroImages: newImages } });
  };

  const addCtaButton = () => {
    const newButtons = [...(settings.home.ctaButtons || [])];
    newButtons.push({ text: "New Button", url: "/", primary: true });
    setSettings({ ...settings, home: { ...settings.home, ctaButtons: newButtons } });
  };

  const removeCtaButton = (index: number) => {
    const newButtons = [...settings.home.ctaButtons];
    newButtons.splice(index, 1);
    setSettings({ ...settings, home: { ...settings.home, ctaButtons: newButtons } });
  };

  const updateCtaButton = (index: number, field: string, value: any) => {
    const newButtons = [...settings.home.ctaButtons];
    newButtons[index] = { ...newButtons[index], [field]: value };
    setSettings({ ...settings, home: { ...settings.home, ctaButtons: newButtons } });
  };

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      if (res.ok) {
        const data = await res.json();
        return data.filePath;
      }
      return null;
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const filePath = await handleFileUpload(e.target.files[0]);
    if (filePath) {
      setSettings({
        ...settings, 
        company_details: { ...settings.company_details, logo: filePath }
      });
    } else {
      alert('Failed to upload logo');
    }
  };

  const handleLocationsHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const filePath = await handleFileUpload(e.target.files[0]);
    if (filePath) {
      setSettings({
        ...settings, 
        locations: { ...settings.locations, heroImage: filePath }
      });
    } else {
      alert('Failed to upload hero image');
    }
  };

  const handleSocialIconUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const filePath = await handleFileUpload(e.target.files[0]);
    if (filePath) {
      const updatedLinks = settings.footer.socialLinks.map((link: any) => 
        link.id === id ? { ...link, icon: filePath } : link
      );
      setSettings({
        ...settings,
        footer: { ...settings.footer, socialLinks: updatedLinks }
      });
    } else {
      alert('Failed to upload icon');
    }
  };

  const addSocialLink = () => {
    const newLink = { id: Date.now().toString(), platform: "New Platform", url: "#", icon: "" };
    setSettings({
      ...settings,
      footer: { ...settings.footer, socialLinks: [...settings.footer.socialLinks, newLink] }
    });
  };

  const removeSocialLink = (id: string) => {
    const updatedLinks = settings.footer.socialLinks.filter((link: any) => link.id !== id);
    setSettings({
      ...settings,
      footer: { ...settings.footer, socialLinks: updatedLinks }
    });
  };

  const updateSocialLink = (id: string, field: string, value: string) => {
    const updatedLinks = settings.footer.socialLinks.map((link: any) => 
      link.id === id ? { ...link, [field]: value } : link
    );
    setSettings({
      ...settings,
      footer: { ...settings.footer, socialLinks: updatedLinks }
    });
  };

  const handleSaveSettings = async (key: string) => {
    setSaving(true);
    try {
      await fetch(`/api/settings/${key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings[key])
      });
      alert('Settings saved successfully');
    } catch (error) {
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAllLocationSettings = async () => {
    setSaving(true);
    try {
      await Promise.all([
        fetch('/api/settings/locations', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(settings.locations)
        }),
        fetch('/api/settings/company_details', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(settings.company_details)
        })
      ]);
      alert('All location and contact settings saved successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleServiceVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const filePath = await handleFileUpload(e.target.files[0]);
    if (filePath) {
      setEditingService({ ...editingService, videoUrl: filePath });
    } else {
      alert('Failed to upload video');
    }
  };

  const handleAccreditationLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const filePath = await handleFileUpload(e.target.files[0]);
    if (filePath) {
      setEditingService({ ...editingService, accreditationLogo: filePath });
    } else {
      alert('Failed to upload logo');
    }
  };

  const handleMarkAsProcessed = async (id: number) => {
    if (!window.confirm("Are you sure you want to mark this job card as processed? This will move it to the processed section.")) return;
    try {
      await fetch(`/api/admin/job-cards/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Processed' })
      });
      fetchData();
    } catch (error) {
      alert('Failed to update job card');
    }
  };

  const handleSaveService = async () => {
    setSaving(true);
    try {
      const url = editingService.id ? `/api/services/${editingService.id}` : '/api/services';
      const method = editingService.id ? 'PUT' : 'POST';
      
      const payload = {
        ...editingService,
        images: Array.isArray(editingService.images) ? JSON.stringify(editingService.images) : editingService.images,
        howItWorks: Array.isArray(editingService.howItWorks) ? JSON.stringify(editingService.howItWorks) : editingService.howItWorks,
        checklistOptions: Array.isArray(editingService.checklistOptions) ? JSON.stringify(editingService.checklistOptions) : editingService.checklistOptions,
        benefits: Array.isArray(editingService.benefits) ? JSON.stringify(editingService.benefits) : editingService.benefits,
        modules: Array.isArray(editingService.modules) ? JSON.stringify(editingService.modules) : editingService.modules
      };

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      setEditingService(null);
      fetchData();
      alert(`Service ${editingService.id ? 'updated' : 'created'} successfully`);
    } catch (error) {
      alert('Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  const handleServiceImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const newImages = [];
    for (let i = 0; i < e.target.files.length; i++) {
      const filePath = await handleFileUpload(e.target.files[i]);
      if (filePath) newImages.push(filePath);
    }

    if (newImages.length > 0) {
      let currentImages = [];
      try {
        currentImages = typeof editingService.images === 'string' ? JSON.parse(editingService.images) : (editingService.images || []);
      } catch (e) {
        currentImages = [];
      }

      setEditingService({
        ...editingService,
        images: [...currentImages, ...newImages]
      });
    }
  };

  const removeServiceImage = (index: number) => {
    let currentImages = typeof editingService.images === 'string' ? JSON.parse(editingService.images) : (editingService.images || []);
    const updatedImages = currentImages.filter((_: any, i: number) => i !== index);
    setEditingService({
      ...editingService,
      images: updatedImages
    });
  };

  // --- About Tab Handlers ---

  const handleAboutHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const newImages = [];
    for (let i = 0; i < e.target.files.length; i++) {
      const filePath = await handleFileUpload(e.target.files[i]);
      if (filePath) newImages.push(filePath);
    }

    if (newImages.length > 0) {
      setSettings({
        ...settings,
        about: { 
          ...settings.about, 
          heroImages: [...(settings.about.heroImages || []), ...newImages] 
        }
      });
    }
  };

  const removeAboutHeroImage = (index: number) => {
    const updatedImages = settings.about.heroImages.filter((_: any, i: number) => i !== index);
    setSettings({
      ...settings,
      about: { ...settings.about, heroImages: updatedImages }
    });
  };

  const addMilestone = () => {
    const newMilestone = { year: new Date().getFullYear().toString(), title: "New Milestone", desc: "Description" };
    setSettings({
      ...settings,
      about: { ...settings.about, milestones: [...(settings.about.milestones || []), newMilestone] }
    });
  };

  const updateMilestone = (index: number, field: string, value: string) => {
    const updatedMilestones = settings.about.milestones.map((m: any, i: number) => 
      i === index ? { ...m, [field]: value } : m
    );
    setSettings({
      ...settings,
      about: { ...settings.about, milestones: updatedMilestones }
    });
  };

  const removeMilestone = (index: number) => {
    const updatedMilestones = settings.about.milestones.filter((_: any, i: number) => i !== index);
    setSettings({
      ...settings,
      about: { ...settings.about, milestones: updatedMilestones }
    });
  };

  // --- Jobs / Facilities Handlers ---

  const handleSaveJob = async () => {
    setSaving(true);
    try {
      const url = editingJob.id ? `/api/jobs/${editingJob.id}` : '/api/jobs';
      const method = editingJob.id ? 'PUT' : 'POST';
      
      // Ensure images is a JSON string if it's an array
      const payload = {
        ...editingJob,
        images: Array.isArray(editingJob.images) ? JSON.stringify(editingJob.images) : editingJob.images,
        bulletPoints: Array.isArray(editingJob.bulletPoints) ? JSON.stringify(editingJob.bulletPoints) : editingJob.bulletPoints
      };

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      setEditingJob(null);
      fetchData();
      alert('Facility/Training updated successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to update facility/training');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteJob = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (error) {
      alert('Failed to delete item');
    }
  };

  const handleJobImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const newImages = [];
    for (let i = 0; i < e.target.files.length; i++) {
      const filePath = await handleFileUpload(e.target.files[i]);
      if (filePath) newImages.push(filePath);
    }

    if (newImages.length > 0) {
      // Parse current images if string, or use as array
      let currentImages = [];
      try {
        currentImages = typeof editingJob.images === 'string' ? JSON.parse(editingJob.images) : (editingJob.images || []);
      } catch (e) {
        currentImages = [];
      }

      setEditingJob({
        ...editingJob,
        images: [...currentImages, ...newImages]
      });
    }
  };

  const removeJobImage = (index: number) => {
    let currentImages = typeof editingJob.images === 'string' ? JSON.parse(editingJob.images) : (editingJob.images || []);
    const updatedImages = currentImages.filter((_: any, i: number) => i !== index);
    setEditingJob({
      ...editingJob,
      images: updatedImages
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-100 pb-24">
      {/* Unified Bottom Tab Bar (App Feeling) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 text-white flex justify-around items-center h-20 z-[100] px-4 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.3)] border-t border-white/5">
        {/* Dashboard Button */}
        <div className="relative flex-1 flex justify-center">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all ${activeTab === 'dashboard' ? 'text-primary scale-110' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <LayoutDashboard className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-widest">Dashboard</span>
          </button>
        </div>

        {/* CRM Button */}
        <div className="relative flex-1 flex justify-center">
          <button 
            onClick={() => setActiveTab('leads')}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all ${['leads', 'job-cards'].includes(activeTab) ? 'text-primary scale-110' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Users className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-widest">CRM</span>
          </button>
        </div>

        {/* Content Management Button */}
        <div className="relative flex-1 flex justify-center">
          <button 
            onClick={() => setActiveTab('content')}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all ${activeTab === 'content' ? 'text-primary scale-110' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <BookOpen className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-widest">Content</span>
          </button>
        </div>

        {/* Settings Button */}
        <div className="relative flex-1 flex justify-center">
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all ${activeTab === 'settings' ? 'text-primary scale-110' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Settings className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-widest">Setup</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow p-4 md:p-12 max-w-[1600px] mx-auto w-full">
        {activeTab === 'dashboard' && <Dashboard leads={leads} jobCards={jobCards} />}
        {activeTab === 'content' && <ContentManager services={services} jobs={jobs} about={settings.about} onEditService={setEditingService} onEditJob={setEditingJob} onSaveAbout={() => setActiveTab('about')} />}
        {activeTab === 'settings' && <Settings settings={settings} onSettingsChange={setSettings} onSave={() => handleSaveAllLocationSettings()} />}
        {activeTab === 'forms' && <FormsManager settings={settings} setSettings={setSettings} />}
        {activeTab === 'jobs' && <JobsManager jobs={jobs} onEdit={setEditingJob} onDelete={handleDeleteJob} />}
        {activeTab === 'leads' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Leads List */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-3xl font-bold text-secondary tracking-tight">Service Leads</h2>
                <span className="bg-primary/10 text-secondary px-4 py-1 rounded-full text-sm font-bold">{leads.length} Total</span>
              </div>
              <div className="divide-y divide-slate-100">
                {leads.map((lead) => (
                  <button 
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className={`w-full text-left p-8 hover:bg-slate-50 transition-all flex justify-between items-center group ${selectedLead?.id === lead.id ? 'bg-slate-50 border-l-4 border-primary' : ''}`}
                  >
                    <div className="space-y-1">
                      <h3 className="font-bold text-xl text-secondary">{lead.name} {lead.surname}</h3>
                      <p className="text-slate-500 font-medium">{lead.companyName || 'Individual'}</p>
                      <div className="flex gap-4 text-sm text-slate-400 font-bold uppercase tracking-widest pt-2">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(lead.createdAt).toLocaleDateString()}</span>
                        <span className="text-primary">{lead.serviceTitle || 'General'}</span>
                      </div>
                    </div>
                    <ChevronRight className={`w-6 h-6 text-slate-300 group-hover:text-primary transition-all ${selectedLead?.id === lead.id ? 'translate-x-2 text-primary' : ''}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Lead Detail / Action Area */}
            <div className="space-y-8">
              {selectedLead ? (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200 overflow-hidden"
                >
                  <div className="p-8 bg-secondary text-white flex justify-between items-center">
                    <div>
                      <h2 className="text-3xl font-bold tracking-tight">{selectedLead.name} {selectedLead.surname}</h2>
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-sm mt-1">{selectedLead.companyName}</p>
                    </div>
                    <button onClick={() => setSelectedLead(null)} className="text-slate-400 hover:text-white transition-colors">
                      <X className="w-8 h-8" />
                    </button>
                  </div>
                  
                  <div className="p-8 space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Contact</label>
                        <p className="font-bold text-secondary flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> {selectedLead.email}</p>
                        <p className="font-bold text-secondary flex items-center gap-2 mt-2"><Phone className="w-4 h-4 text-primary" /> {selectedLead.tel}</p>
                      </div>
                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Location</label>
                        <p className="font-bold text-secondary flex items-center gap-2"><Building className="w-4 h-4 text-primary" /> {selectedLead.address || 'N/A'}</p>
                      </div>
                    </div>

                    {selectedLead.checklist && JSON.parse(selectedLead.checklist).length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-bold text-secondary uppercase tracking-widest border-b border-slate-100 pb-2">Training Required</h3>
                        <div className="flex flex-wrap gap-3">
                          {JSON.parse(selectedLead.checklist).map((item: string) => (
                            <span key={item} className="bg-primary text-secondary px-4 py-2 rounded-xl font-bold text-sm shadow-sm">{item}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedLead.employees && JSON.parse(selectedLead.employees).length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-bold text-secondary uppercase tracking-widest border-b border-slate-100 pb-2">Employee Details</h3>
                        <div className="grid grid-cols-1 gap-3">
                          {JSON.parse(selectedLead.employees).map((emp: any, i: number) => (
                            <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                              <div>
                                <p className="font-bold text-secondary">{emp.name}</p>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{emp.jobTitle} • Age: {emp.age}</p>
                              </div>
                              {emp.whatsapp && <span className="text-green-600 font-bold text-xs">WA: {emp.whatsapp}</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-8 border-t border-slate-100 flex gap-4">
                      <button 
                        onClick={() => setConfirmProcessed(true)}
                        className="flex-1 bg-primary text-secondary py-4 rounded-2xl font-bold uppercase tracking-widest shadow-lg hover:scale-[1.02] transition-all"
                      >
                        Create Job Card
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 text-slate-400">
                  <Users className="w-20 h-20 mb-6 opacity-20" />
                  <h3 className="text-2xl font-bold mb-2">No Lead Selected</h3>
                  <p className="max-w-xs font-medium">Select a lead from the list to view details and generate job cards.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'job-cards' && (
          <div className="space-y-12">
            {selectedJobCard ? (
              <div className="bg-white p-12 rounded-sm shadow-lg border border-slate-200 max-w-4xl mx-auto print:shadow-none print:border-none print:p-0">
                {/* ... existing job card detail view ... */}
                <div className="flex justify-between items-start border-b-4 border-slate-900 pb-8 mb-8">
                  <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900">Job Card</h1>
                    <p className="text-slate-500 font-mono mt-1">REF: #{selectedJobCard.id.toString().padStart(6, '0')}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-xl">{settings.company_details?.name || 'TrainingPro Inc.'}</p>
                    <p className="text-slate-500 text-sm">{settings.company_details?.address}</p>
                    <p className="text-slate-500 text-sm">{settings.company_details?.phone}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-12 mb-12">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Client Details</h4>
                    <p className="text-2xl font-bold text-slate-900">{selectedJobCard.clientName}</p>
                    
                    <div className="mt-4 space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Selected Courses</p>
                      {selectedJobCard.courses ? (
                        JSON.parse(selectedJobCard.courses).map((course: any, i: number) => (
                          <div key={i} className="flex items-center gap-2 text-sm font-bold text-slate-700">
                            <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                            {course.title}
                          </div>
                        ))
                      ) : (
                        <p className="font-bold text-slate-700">{selectedJobCard.serviceTitle}</p>
                      )}
                    </div>
                    
                    {selectedJobCard.leadContactName && (
                      <div className="mt-6 p-4 bg-slate-50 rounded-sm border border-slate-200 space-y-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact Information</p>
                        <p className="text-sm font-bold text-slate-900">{selectedJobCard.leadContactName} {selectedJobCard.leadContactSurname}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-600">
                          <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {selectedJobCard.leadEmail}</span>
                          <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {selectedJobCard.leadTel}</span>
                        </div>
                        <p className="text-xs text-slate-600 flex items-start gap-1 mt-1">
                          <Building className="w-3 h-3 mt-0.5" /> {selectedJobCard.leadAddress}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Job Information</h4>
                    <p className="text-lg font-bold">Date: {new Date(selectedJobCard.date).toLocaleDateString()}</p>
                    <p className="text-slate-600 mt-1">Status: <span className={`uppercase font-bold ${selectedJobCard.status === 'Processed' ? 'text-green-600' : 'text-yellow-600'}`}>{selectedJobCard.status}</span></p>
                    
                    {selectedJobCard.leadNotes && (
                      <div className="mt-6 text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Lead Notes</p>
                        <p className="text-xs text-slate-600 italic">"{selectedJobCard.leadNotes}"</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Trainees Section */}
                {selectedJobCard.trainees && JSON.parse(selectedJobCard.trainees).length > 0 && (
                  <div className="mb-12">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Trainees & Progress</h4>
                    <div className="space-y-4">
                      {JSON.parse(selectedJobCard.trainees).map((trainee: any, i: number) => (
                        <div key={i} className="bg-slate-50 p-6 rounded-sm border border-slate-200">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <p className="text-lg font-black text-slate-900 uppercase tracking-tighter">{trainee.name}</p>
                              <p className="text-xs text-slate-500 font-bold uppercase">{trainee.jobTitle} • Age: {trainee.age}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] font-bold uppercase px-2 py-1 bg-white border border-slate-200 rounded-sm">
                                {trainee.checklist?.length || 0} Requirements Met
                              </span>
                            </div>
                          </div>
                          
                          {trainee.checklist && trainee.checklist.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {trainee.checklist.map((item: string, j: number) => (
                                <span key={j} className="flex items-center gap-1 bg-green-100 text-green-700 text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border border-green-200">
                                  <CheckSquare className="w-2.5 h-2.5" /> {item}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Lead Specific Details (Legacy) */}
                {!selectedJobCard.trainees && selectedJobCard.leadEmployees && JSON.parse(selectedJobCard.leadEmployees).length > 0 && (
                  <div className="mb-12">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Employees / Trainees</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {JSON.parse(selectedJobCard.leadEmployees).map((emp: any, i: number) => (
                        <div key={i} className="bg-slate-50 p-4 rounded-sm border border-slate-200 flex justify-between items-center">
                          <div>
                            <p className="font-bold text-slate-900">{emp.name}</p>
                            <p className="text-[10px] text-slate-500 uppercase font-bold">{emp.jobTitle}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-slate-600">Age: {emp.age}</p>
                            {emp.whatsapp && <p className="text-[10px] text-slate-400">WA: {emp.whatsapp}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedJobCard.leadChecklist && JSON.parse(selectedJobCard.leadChecklist).length > 0 && (
                  <div className="mb-12">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Training Requirements</h4>
                    <div className="flex flex-wrap gap-2">
                      {JSON.parse(selectedJobCard.leadChecklist).map((item: string, i: number) => (
                        <span key={i} className="bg-slate-100 text-slate-700 text-[10px] font-bold uppercase px-3 py-1 rounded-full border border-slate-200">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-12">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Job Items & Tasks</h4>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-900 text-white">
                        <th className="text-left p-4 text-xs uppercase tracking-widest">Description</th>
                        <th className="text-center p-4 text-xs uppercase tracking-widest w-32">Status</th>
                        <th className="text-left p-4 text-xs uppercase tracking-widest">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {JSON.parse(selectedJobCard.items).map((item: any, i: number) => (
                        <tr key={i} className="border-b border-slate-200">
                          <td className="p-4 font-bold text-slate-900">{item.description}</td>
                          <td className="p-4 text-center">
                            <span className="text-[10px] font-bold uppercase px-2 py-1 bg-slate-100 rounded-sm">
                              {item.status}
                            </span>
                          </td>
                          <td className="p-4 text-slate-600 text-sm italic">{item.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between items-end border-t-2 border-slate-100 pt-8">
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold mb-8">Client Signature</p>
                    <div className="w-64 h-px bg-slate-300"></div>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-500 uppercase text-xs font-bold">Job Confirmation</p>
                    <p className="text-xl font-bold text-slate-900">Verified & Approved</p>
                  </div>
                </div>

                <div className="mt-12 flex gap-4 print:hidden">
                  <button 
                    onClick={() => window.print()}
                    className="flex-grow bg-slate-900 text-white py-4 rounded-sm font-bold uppercase tracking-widest hover:bg-slate-800 flex items-center justify-center gap-3"
                  >
                    <Printer className="w-6 h-6" /> Print Job Card
                  </button>
                  {selectedJobCard.status !== 'Processed' && (
                    <div className="flex-grow flex flex-col gap-2">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          checked={confirmProcessed}
                          onChange={(e) => setConfirmProcessed(e.target.checked)}
                          className="w-4 h-4 rounded border-slate-300 text-green-600 focus:ring-green-500"
                        />
                        <span className="text-[10px] font-bold uppercase text-slate-400 group-hover:text-slate-600 transition-colors">
                          I confirm this job is complete and ready to be processed
                        </span>
                      </label>
                      <button 
                        onClick={() => {
                          if (confirmProcessed) {
                            handleMarkAsProcessed(selectedJobCard.id);
                            setConfirmProcessed(false);
                          }
                        }}
                        disabled={!confirmProcessed}
                        className="w-full bg-green-600 text-white py-4 rounded-sm font-bold uppercase tracking-widest hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all"
                      >
                        <CheckSquare className="w-6 h-6" /> Mark as Processed
                      </button>
                    </div>
                  )}
                  <button 
                    onClick={() => setSelectedJobCard(null)}
                    className="px-8 bg-slate-100 text-slate-600 py-4 rounded-sm font-bold uppercase tracking-widest hover:bg-slate-200 border border-slate-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-16">
                {jobCards.length === 0 ? (
                  <div className="bg-white p-20 text-center rounded-sm shadow-sm border border-slate-200">
                    <CheckSquare className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-500 font-bold uppercase tracking-widest">No job cards found</p>
                  </div>
                ) : (
                  <>
                    {/* Pending Section */}
                    <div className="space-y-8">
                      <h3 className="text-xl font-black uppercase tracking-widest text-slate-400 border-b pb-2">Pending Job Cards</h3>
                      {Object.entries(
                        jobCards.filter(c => c.status !== 'Processed').reduce((acc: any, card: any) => {
                          if (!acc[card.clientName]) acc[card.clientName] = [];
                          acc[card.clientName].push(card);
                          return acc;
                        }, {})
                      ).map(([clientName, cards]: [string, any]) => (
                        <section key={clientName} className="space-y-6">
                          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-slate-900 text-white rounded-sm flex items-center justify-center font-black">
                                {clientName.charAt(0)}
                              </div>
                              <div>
                                <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900">{clientName}</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Client Account</p>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {cards.map((card: any) => (
                              <div 
                                key={card.id} 
                                onClick={() => setSelectedJobCard(card)}
                                className="p-6 rounded-sm shadow-sm border bg-white border-slate-200 hover:border-yellow-400 transition-all cursor-pointer group relative overflow-hidden"
                              >
                                <div className="flex justify-between items-start mb-4">
                                  <span className="text-[10px] font-mono text-slate-400">
                                    #{card.id.toString().padStart(6, '0')}
                                  </span>
                                  <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-sm bg-yellow-100 text-yellow-700">
                                    {card.status}
                                  </span>
                                </div>
                                <h4 className="text-lg font-bold text-slate-900 mb-1">{card.serviceTitle}</h4>
                                <p className="text-xs text-slate-500 mb-6 flex items-center gap-1">
                                  <Calendar className="w-3 h-3" /> {new Date(card.date).toLocaleDateString()}
                                </p>
                                
                                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                                  <div className="flex -space-x-2">
                                    {[1, 2, 3].map(i => (
                                      <div key={i} className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold bg-slate-200 text-slate-600">
                                        {i}
                                      </div>
                                    ))}
                                  </div>
                                  <button className="text-[10px] font-bold uppercase text-yellow-600">
                                    View Details
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </section>
                      ))}
                    </div>

                    {/* Processed Section */}
                    <div className="space-y-8 pt-12 border-t border-slate-200">
                      <h3 className="text-xl font-black uppercase tracking-widest text-green-600 border-b border-green-200 pb-2">Processed Job Cards</h3>
                      {Object.entries(
                        jobCards.filter(c => c.status === 'Processed').reduce((acc: any, card: any) => {
                          if (!acc[card.clientName]) acc[card.clientName] = [];
                          acc[card.clientName].push(card);
                          return acc;
                        }, {})
                      ).map(([clientName, cards]: [string, any]) => (
                        <section key={clientName} className="space-y-6">
                          <div className="flex items-center justify-between border-b border-green-100 pb-2">
                            <h4 className="text-sm font-bold text-green-700 uppercase tracking-widest">{clientName}</h4>
                            <span className="text-[10px] font-bold text-green-500 uppercase">{cards.length} Processed</span>
                          </div>
                          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 opacity-80">
                            {cards.map((card: any) => (
                              <div 
                                key={card.id} 
                                onClick={() => setSelectedJobCard(card)}
                                className="p-6 rounded-sm shadow-sm border bg-green-50 border-green-200 hover:border-green-400 transition-all cursor-pointer group relative overflow-hidden"
                              >
                                <div className="absolute top-0 right-0 bg-green-500 text-white text-[8px] font-black uppercase px-2 py-1 transform rotate-45 translate-x-4 -translate-y-1 w-20 text-center">
                                  Done
                                </div>
                                <div className="flex justify-between items-start mb-4">
                                  <span className="text-[10px] font-mono text-green-600/50">
                                    #{card.id.toString().padStart(6, '0')}
                                  </span>
                                  <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-sm bg-green-100 text-green-700">
                                    {card.status}
                                  </span>
                                </div>
                                <h4 className="text-lg font-bold text-slate-900 mb-1">{card.serviceTitle}</h4>
                                <p className="text-xs text-slate-500 mb-6 flex items-center gap-1">
                                  <Calendar className="w-3 h-3" /> {new Date(card.date).toLocaleDateString()}
                                </p>
                              </div>
                            ))}
                          </div>
                        </section>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">Courses & Services</h3>
              {!editingService && (
                <button 
                  onClick={() => setEditingService({ 
                    title: "", description: "", icon: "BookOpen", images: [], videoUrl: "", 
                    howItWorks: [], checklistOptions: [], benefits: [], modules: [], 
                    accreditation: "", accreditationLogo: "", whatsappNumber: "" 
                  })}
                  className="bg-slate-900 text-white px-4 py-2 rounded-sm font-bold text-sm uppercase tracking-wider hover:bg-slate-800"
                >
                  + Add New Course
                </button>
              )}
            </div>

            {editingService ? (
              <div className="bg-white p-8 rounded-sm shadow-sm border border-slate-200 space-y-8">
                <div className="flex justify-between items-center border-b pb-4">
                  <h3 className="text-xl font-bold">{editingService.id ? 'Edit Course' : 'Create New Course'}</h3>
                  <button onClick={() => setEditingService(null)} className="text-slate-400 hover:text-slate-600">Cancel</button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-slate-700">Course Name</label>
                    <input 
                      type="text" 
                      value={editingService.title} 
                      onChange={(e) => setEditingService({...editingService, title: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-sm"
                      placeholder="e.g. Health & Safety Level 1"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-slate-700">Icon Name (Lucide)</label>
                    <input 
                      type="text" 
                      value={editingService.icon} 
                      onChange={(e) => setEditingService({...editingService, icon: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-sm"
                      placeholder="ShieldAlert, Tractor, Forklift, etc."
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700">Description</label>
                  <textarea 
                    value={editingService.description} 
                    onChange={(e) => setEditingService({...editingService, description: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-2 border border-slate-200 rounded-sm"
                    placeholder="Provide a detailed overview of the course..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-slate-700">Course Video (MP4)</label>
                    <div className="flex items-center gap-4">
                      {editingService.videoUrl && (
                        <div className="w-32 aspect-video bg-slate-100 rounded-sm overflow-hidden border border-slate-200">
                          <video src={editingService.videoUrl} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <label className="flex-grow border-2 border-dashed border-slate-300 rounded-sm flex flex-col items-center justify-center h-24 cursor-pointer hover:bg-slate-50">
                        <span className="text-xs text-slate-500 font-bold">{editingService.videoUrl ? 'Change Video' : '+ Upload Video'}</span>
                        <input 
                          type="file" 
                          accept="video/mp4"
                          onChange={handleServiceVideoUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-slate-700">WhatsApp Number for Redirect</label>
                    <input 
                      type="text" 
                      value={editingService.whatsappNumber} 
                      onChange={(e) => setEditingService({...editingService, whatsappNumber: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-sm"
                      placeholder="+441234567890"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700">Course Images</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {(typeof editingService.images === 'string' ? JSON.parse(editingService.images || '[]') : (editingService.images || [])).map((img: string, idx: number) => (
                      <div key={idx} className="relative group">
                        <img src={img} alt={`Service ${idx}`} className="w-full h-24 object-cover rounded-sm border border-slate-200" />
                        <button 
                          onClick={() => removeServiceImage(idx)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <label className="border-2 border-dashed border-slate-300 rounded-sm flex flex-col items-center justify-center h-24 cursor-pointer hover:bg-slate-50">
                      <span className="text-xs text-slate-500 font-bold">+ Add Image</span>
                      <input 
                        type="file" 
                        multiple 
                        accept=".jpg,.jpeg,.png"
                        onChange={handleServiceImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Process Steps */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="block text-sm font-bold text-slate-700">Process Steps</label>
                      <button 
                        onClick={() => {
                          const steps = Array.isArray(editingService.howItWorks) ? editingService.howItWorks : JSON.parse(editingService.howItWorks || '[]');
                          setEditingService({...editingService, howItWorks: [...steps, ""]});
                        }}
                        className="text-xs text-yellow-600 font-bold uppercase"
                      >
                        + Add Step
                      </button>
                    </div>
                    <div className="space-y-2">
                      {(Array.isArray(editingService.howItWorks) ? editingService.howItWorks : JSON.parse(editingService.howItWorks || '[]')).map((step: string, idx: number) => (
                        <div key={idx} className="flex gap-2">
                          <input 
                            type="text" 
                            value={step} 
                            onChange={(e) => {
                              const steps = [...(Array.isArray(editingService.howItWorks) ? editingService.howItWorks : JSON.parse(editingService.howItWorks || '[]'))];
                              steps[idx] = e.target.value;
                              setEditingService({...editingService, howItWorks: steps});
                            }}
                            className="flex-grow px-3 py-1 border border-slate-200 rounded-sm text-sm"
                          />
                          <button 
                            onClick={() => {
                              const steps = (Array.isArray(editingService.howItWorks) ? editingService.howItWorks : JSON.parse(editingService.howItWorks || '[]')).filter((_: any, i: number) => i !== idx);
                              setEditingService({...editingService, howItWorks: steps});
                            }}
                            className="text-slate-400 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Training Needs */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="block text-sm font-bold text-slate-700">Training Needs (Tick-box list)</label>
                      <button 
                        onClick={() => {
                          const options = Array.isArray(editingService.checklistOptions) ? editingService.checklistOptions : JSON.parse(editingService.checklistOptions || '[]');
                          setEditingService({...editingService, checklistOptions: [...options, ""]});
                        }}
                        className="text-xs text-yellow-600 font-bold uppercase"
                      >
                        + Add Option
                      </button>
                    </div>
                    <div className="space-y-2">
                      {(Array.isArray(editingService.checklistOptions) ? editingService.checklistOptions : JSON.parse(editingService.checklistOptions || '[]')).map((option: string, idx: number) => (
                        <div key={idx} className="flex gap-2">
                          <input 
                            type="text" 
                            value={option} 
                            onChange={(e) => {
                              const options = [...(Array.isArray(editingService.checklistOptions) ? editingService.checklistOptions : JSON.parse(editingService.checklistOptions || '[]'))];
                              options[idx] = e.target.value;
                              setEditingService({...editingService, checklistOptions: options});
                            }}
                            className="flex-grow px-3 py-1 border border-slate-200 rounded-sm text-sm"
                          />
                          <button 
                            onClick={() => {
                              const options = (Array.isArray(editingService.checklistOptions) ? editingService.checklistOptions : JSON.parse(editingService.checklistOptions || '[]')).filter((_: any, i: number) => i !== idx);
                              setEditingService({...editingService, checklistOptions: options});
                            }}
                            className="text-slate-400 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Key Benefits */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="block text-sm font-bold text-slate-700">Key Benefits</label>
                      <button 
                        onClick={() => {
                          const benefits = Array.isArray(editingService.benefits) ? editingService.benefits : JSON.parse(editingService.benefits || '[]');
                          setEditingService({...editingService, benefits: [...benefits, { title: "", description: "" }]});
                        }}
                        className="text-xs text-yellow-600 font-bold uppercase"
                      >
                        + Add Benefit
                      </button>
                    </div>
                    <div className="space-y-4">
                      {(Array.isArray(editingService.benefits) ? editingService.benefits : JSON.parse(editingService.benefits || '[]')).map((benefit: any, idx: number) => (
                        <div key={idx} className="p-4 bg-slate-50 rounded-sm border border-slate-200 space-y-2 relative">
                          <input 
                            type="text" 
                            value={benefit.title} 
                            onChange={(e) => {
                              const benefits = [...(Array.isArray(editingService.benefits) ? editingService.benefits : JSON.parse(editingService.benefits || '[]'))];
                              benefits[idx].title = e.target.value;
                              setEditingService({...editingService, benefits});
                            }}
                            className="w-full px-3 py-1 border border-slate-200 rounded-sm text-sm font-bold"
                            placeholder="Benefit Title"
                          />
                          <textarea 
                            value={benefit.description} 
                            onChange={(e) => {
                              const benefits = [...(Array.isArray(editingService.benefits) ? editingService.benefits : JSON.parse(editingService.benefits || '[]'))];
                              benefits[idx].description = e.target.value;
                              setEditingService({...editingService, benefits});
                            }}
                            className="w-full px-3 py-1 border border-slate-200 rounded-sm text-sm"
                            placeholder="Short description..."
                            rows={2}
                          />
                          <button 
                            onClick={() => {
                              const benefits = (Array.isArray(editingService.benefits) ? editingService.benefits : JSON.parse(editingService.benefits || '[]')).filter((_: any, i: number) => i !== idx);
                              setEditingService({...editingService, benefits});
                            }}
                            className="absolute top-2 right-2 text-slate-400 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Modules */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="block text-sm font-bold text-slate-700">Course Modules</label>
                      <button 
                        onClick={() => {
                          const modules = Array.isArray(editingService.modules) ? editingService.modules : JSON.parse(editingService.modules || '[]');
                          setEditingService({...editingService, modules: [...modules, { title: "", text: "" }]});
                        }}
                        className="text-xs text-yellow-600 font-bold uppercase"
                      >
                        + Add Module
                      </button>
                    </div>
                    <div className="space-y-4">
                      {(Array.isArray(editingService.modules) ? editingService.modules : JSON.parse(editingService.modules || '[]')).map((mod: any, idx: number) => (
                        <div key={idx} className="p-4 bg-slate-50 rounded-sm border border-slate-200 space-y-2 relative">
                          <input 
                            type="text" 
                            value={mod.title} 
                            onChange={(e) => {
                              const modules = [...(Array.isArray(editingService.modules) ? editingService.modules : JSON.parse(editingService.modules || '[]'))];
                              modules[idx].title = e.target.value;
                              setEditingService({...editingService, modules});
                            }}
                            className="w-full px-3 py-1 border border-slate-200 rounded-sm text-sm font-bold"
                            placeholder="Module Title"
                          />
                          <textarea 
                            value={mod.text} 
                            onChange={(e) => {
                              const modules = [...(Array.isArray(editingService.modules) ? editingService.modules : JSON.parse(editingService.modules || '[]'))];
                              modules[idx].text = e.target.value;
                              setEditingService({...editingService, modules});
                            }}
                            className="w-full px-3 py-1 border border-slate-200 rounded-sm text-sm"
                            placeholder="Text explanation..."
                            rows={2}
                          />
                          <button 
                            onClick={() => {
                              const modules = (Array.isArray(editingService.modules) ? editingService.modules : JSON.parse(editingService.modules || '[]')).filter((_: any, i: number) => i !== idx);
                              setEditingService({...editingService, modules});
                            }}
                            className="absolute top-2 right-2 text-slate-400 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700">Accreditation</label>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                    <div className="md:col-span-3">
                      <label className="block text-xs font-bold text-slate-500 mb-2">Logo</label>
                      <div className="relative group">
                        {editingService.accreditationLogo ? (
                          <img src={editingService.accreditationLogo} alt="Accreditation Logo" className="w-full h-24 object-contain rounded-sm border border-slate-200" />
                        ) : (
                          <div className="w-full h-24 bg-slate-50 rounded-sm border border-slate-200 flex items-center justify-center text-slate-300 text-xs">No Logo</div>
                        )}
                        <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-sm">
                          <span className="text-[10px] font-bold uppercase">Upload</span>
                          <input type="file" accept="image/*" onChange={handleAccreditationLogoUpload} className="hidden" />
                        </label>
                      </div>
                    </div>
                    <div className="md:col-span-9">
                      <label className="block text-xs font-bold text-slate-500 mb-2">Details / Description</label>
                      <textarea 
                        value={editingService.accreditation} 
                        onChange={(e) => setEditingService({...editingService, accreditation: e.target.value})}
                        rows={4}
                        className="w-full px-4 py-2 border border-slate-200 rounded-sm text-sm"
                        placeholder="e.g. ISO 45001 Certified. Nationally recognized certificate of competence, valid for 3-5 years."
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={handleSaveService}
                    disabled={saving}
                    className="bg-slate-900 text-white px-8 py-3 rounded-sm font-bold uppercase tracking-wider hover:bg-slate-800 disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Course'}
                  </button>
                  <button 
                    onClick={() => setEditingService(null)}
                    className="bg-slate-200 text-slate-700 px-8 py-3 rounded-sm font-bold uppercase tracking-wider hover:bg-slate-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {services.map((service) => (
                  <div key={service.id} className="bg-white p-6 rounded-sm shadow-sm border border-slate-200 hover:border-yellow-400 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-sm flex items-center justify-center text-slate-400 group-hover:bg-yellow-400 group-hover:text-slate-900 transition-colors">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setEditingService(service)}
                          className="text-slate-400 hover:text-yellow-500 transition-colors"
                        >
                          <Settings className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => setEditingService(service)}
                          className="text-slate-400 hover:text-yellow-500 transition-colors"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">{service.title}</h3>
                    <p className="text-slate-500 text-sm line-clamp-3 mb-4">{service.description}</p>
                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                      <span className="text-[10px] font-bold uppercase text-slate-400">Course ID: #{service.id}</span>
                      <span className="text-[10px] font-bold uppercase text-yellow-600">Active</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'about' && settings.about && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="bg-white p-8 rounded-sm shadow-sm border border-slate-200 space-y-6">
              <h3 className="text-lg font-bold border-b pb-2">Hero Section</h3>
              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-700">Hero Images (JPG/PNG)</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(settings.about.heroImages || []).map((img: string, idx: number) => (
                    <div key={idx} className="relative group">
                      <img src={img} alt={`Hero ${idx}`} className="w-full h-24 object-cover rounded-sm border border-slate-200" />
                      <button 
                        onClick={() => removeAboutHeroImage(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <label className="border-2 border-dashed border-slate-300 rounded-sm flex flex-col items-center justify-center h-24 cursor-pointer hover:bg-slate-50">
                    <span className="text-xs text-slate-500 font-bold">+ Add Image</span>
                    <input 
                      type="file" 
                      multiple 
                      accept=".jpg,.jpeg,.png"
                      onChange={handleAboutHeroUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Mission & Vision */}
            <div className="bg-white p-8 rounded-sm shadow-sm border border-slate-200 space-y-6">
              <h3 className="text-lg font-bold border-b pb-2">Mission, Vision & Story</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700">Mission Statement</label>
                  <textarea 
                    value={settings.about.mission} 
                    onChange={(e) => setSettings({...settings, about: {...settings.about, mission: e.target.value}})}
                    rows={4}
                    className="w-full px-4 py-2 border border-slate-200 rounded-sm"
                  />
                </div>
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700">Vision Statement</label>
                  <textarea 
                    value={settings.about.vision} 
                    onChange={(e) => setSettings({...settings, about: {...settings.about, vision: e.target.value}})}
                    rows={4}
                    className="w-full px-4 py-2 border border-slate-200 rounded-sm"
                  />
                </div>
                <div className="md:col-span-2 space-y-4">
                  <label className="block text-sm font-bold text-slate-700">Full Story</label>
                  <textarea 
                    value={settings.about.fullStory} 
                    onChange={(e) => setSettings({...settings, about: {...settings.about, fullStory: e.target.value}})}
                    rows={6}
                    className="w-full px-4 py-2 border border-slate-200 rounded-sm"
                    placeholder="Tell the full story of your company..."
                  />
                </div>
              </div>
            </div>

            {/* Roadmap / Milestones */}
            <div className="bg-white p-8 rounded-sm shadow-sm border border-slate-200 space-y-6">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-lg font-bold">Roadmap / Milestones</h3>
                <button 
                  onClick={addMilestone}
                  className="text-xs bg-slate-900 text-white px-3 py-1 rounded-sm font-bold uppercase tracking-wider hover:bg-slate-800"
                >
                  + Add Milestone
                </button>
              </div>
              
              <div className="space-y-4">
                {(settings.about.milestones || []).map((milestone: any, idx: number) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start bg-slate-50 p-4 rounded-sm border border-slate-100">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 mb-1">Year</label>
                      <input 
                        type="text" 
                        value={milestone.year} 
                        onChange={(e) => updateMilestone(idx, 'year', e.target.value)}
                        className="w-full px-2 py-1 border border-slate-200 rounded-sm text-sm"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-xs font-bold text-slate-500 mb-1">Title</label>
                      <input 
                        type="text" 
                        value={milestone.title} 
                        onChange={(e) => updateMilestone(idx, 'title', e.target.value)}
                        className="w-full px-2 py-1 border border-slate-200 rounded-sm text-sm"
                      />
                    </div>
                    <div className="md:col-span-6">
                      <label className="block text-xs font-bold text-slate-500 mb-1">Description</label>
                      <textarea 
                        value={milestone.desc} 
                        onChange={(e) => updateMilestone(idx, 'desc', e.target.value)}
                        rows={2}
                        className="w-full px-2 py-1 border border-slate-200 rounded-sm text-sm"
                      />
                    </div>
                    <div className="md:col-span-1 flex justify-end mt-6">
                      <button 
                        onClick={() => removeMilestone(idx)}
                        className="text-slate-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {(settings.about.milestones || []).length === 0 && (
                  <p className="text-slate-500 italic text-sm">No milestones added yet.</p>
                )}
              </div>
            </div>

            {/* Live Training & Facilities (Jobs) */}
            <div className="bg-white p-8 rounded-sm shadow-sm border border-slate-200 space-y-6">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-lg font-bold">Live Training & Facilities</h3>
                <button 
                  onClick={() => setEditingJob({ title: "", description: "", images: [], videoUrl: "", bulletPoints: [] })}
                  className="text-xs bg-slate-900 text-white px-3 py-1 rounded-sm font-bold uppercase tracking-wider hover:bg-slate-800"
                >
                  + Add Facility/Training
                </button>
              </div>

              {editingJob ? (
                <div className="bg-slate-50 p-6 rounded-sm border border-slate-200 space-y-6">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-slate-800">{editingJob.id ? 'Edit Item' : 'New Item'}</h4>
                    <button onClick={() => setEditingJob(null)} className="text-slate-400 hover:text-slate-600 text-sm">Cancel</button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-4">
                      <label className="block text-sm font-bold text-slate-700">Title</label>
                      <input 
                        type="text" 
                        value={editingJob.title} 
                        onChange={(e) => setEditingJob({...editingJob, title: e.target.value})}
                        className="w-full px-4 py-2 border border-slate-200 rounded-sm"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="block text-sm font-bold text-slate-700">Video URL (Optional)</label>
                      <input 
                        type="text" 
                        value={editingJob.videoUrl || ''} 
                        onChange={(e) => setEditingJob({...editingJob, videoUrl: e.target.value})}
                        className="w-full px-4 py-2 border border-slate-200 rounded-sm"
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-slate-700">Description</label>
                    <textarea 
                      value={editingJob.description} 
                      onChange={(e) => setEditingJob({...editingJob, description: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-2 border border-slate-200 rounded-sm"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-slate-700">Images (JPG/PNG)</label>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                      {(typeof editingJob.images === 'string' ? JSON.parse(editingJob.images) : (editingJob.images || [])).map((img: string, idx: number) => (
                        <div key={idx} className="relative group">
                          <img src={img} alt={`Job ${idx}`} className="w-full h-20 object-cover rounded-sm border border-slate-200" />
                          <button 
                            onClick={() => removeJobImage(idx)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      <label className="border-2 border-dashed border-slate-300 rounded-sm flex flex-col items-center justify-center h-20 cursor-pointer hover:bg-slate-100">
                        <span className="text-xs text-slate-500 font-bold">+ Add</span>
                        <input 
                          type="file" 
                          multiple 
                          accept=".jpg,.jpeg,.png"
                          onChange={handleJobImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <button 
                    onClick={handleSaveJob}
                    disabled={saving}
                    className="bg-slate-900 text-white px-6 py-2 rounded-sm font-bold uppercase tracking-wider hover:bg-slate-800 disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Item'}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {jobs.map((job) => (
                    <div key={job.id} className="bg-slate-50 p-4 rounded-sm border border-slate-100 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900">{job.title}</h4>
                        <p className="text-slate-500 text-xs truncate max-w-md">{job.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setEditingJob(job)}
                          className="text-slate-400 hover:text-blue-600 p-1"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteJob(job.id)}
                          className="text-slate-400 hover:text-red-600 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {jobs.length === 0 && <p className="text-slate-500 italic text-sm">No items found.</p>}
                </div>
              )}
            </div>

            <button 
              onClick={() => handleSaveSettings('about')}
              disabled={saving}
              className="bg-slate-900 text-white px-8 py-3 rounded-sm font-bold uppercase tracking-wider hover:bg-slate-800 disabled:opacity-50 sticky bottom-4 shadow-lg"
            >
              {saving ? 'Saving...' : 'Save About Sections'}
            </button>
          </div>
        )}

        {activeTab === 'company' && settings.company_details && settings.theme_settings && settings.header && settings.footer && settings.locations && settings.home && (
          <div className="bg-white p-8 rounded-sm shadow-sm border border-slate-200 space-y-12">
            
            {/* Home Hero Settings Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold border-b pb-2">Home Hero Settings</h3>
              
              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-700">Hero Images / Videos (JPG/PNG/MP4)</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(settings.home.heroImages || []).map((media: string, idx: number) => (
                    <div key={idx} className="relative group">
                      {media.endsWith('.mp4') ? (
                        <video src={media} className="w-full h-24 object-cover rounded-sm border border-slate-200" />
                      ) : (
                        <img src={media} alt={`Hero ${idx}`} className="w-full h-24 object-cover rounded-sm border border-slate-200" />
                      )}
                      <button 
                        onClick={() => removeHomeHeroImage(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <label className="border-2 border-dashed border-slate-300 rounded-sm flex flex-col items-center justify-center h-24 cursor-pointer hover:bg-slate-50">
                    <span className="text-xs text-slate-500 font-bold">+ Add Media</span>
                    <input 
                      type="file" 
                      multiple 
                      accept=".jpg,.jpeg,.png,.mp4"
                      onChange={handleHomeHeroUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-700">Hero Title</label>
                <input 
                  type="text" 
                  value={settings.home.heroTitle} 
                  onChange={(e) => setSettings({...settings, home: {...settings.home, heroTitle: e.target.value}})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-sm"
                />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-700">Hero Subtitle</label>
                <textarea 
                  value={settings.home.heroSubtitle} 
                  onChange={(e) => setSettings({...settings, home: {...settings.home, heroSubtitle: e.target.value}})}
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-200 rounded-sm"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-bold text-slate-700">Call to Action Buttons</label>
                  <button 
                    onClick={addCtaButton}
                    className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded font-bold uppercase"
                  >
                    + Add Button
                  </button>
                </div>
                <div className="space-y-2">
                  {(settings.home.ctaButtons || []).map((btn: any, idx: number) => (
                    <div key={idx} className="flex gap-2 items-center bg-slate-50 p-2 rounded-sm border border-slate-200">
                      <input 
                        type="text" 
                        value={btn.text} 
                        onChange={(e) => updateCtaButton(idx, 'text', e.target.value)}
                        placeholder="Button Text"
                        className="flex-1 px-2 py-1 border border-slate-200 rounded-sm text-sm"
                      />
                      <input 
                        type="text" 
                        value={btn.url} 
                        onChange={(e) => updateCtaButton(idx, 'url', e.target.value)}
                        placeholder="URL (e.g. /about)"
                        className="flex-1 px-2 py-1 border border-slate-200 rounded-sm text-sm"
                      />
                      <label className="flex items-center gap-2 text-xs text-slate-600">
                        <input 
                          type="checkbox" 
                          checked={btn.primary} 
                          onChange={(e) => updateCtaButton(idx, 'primary', e.target.checked)}
                        />
                        Primary
                      </label>
                      <button 
                        onClick={() => removeCtaButton(idx)}
                        className="text-slate-400 hover:text-red-500 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => handleSaveSettings('home')}
                disabled={saving}
                className="bg-slate-900 text-white px-6 py-2 rounded-sm font-bold uppercase tracking-wider hover:bg-slate-800 disabled:opacity-50"
              >
                Save Home Hero
              </button>
            </div>
            <div className="space-y-6">
              <h3 className="text-lg font-bold border-b pb-2">Header Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700">Company Logo (JPG/PNG)</label>
                  <div className="flex items-center gap-4">
                    {settings.company_details.logo && (
                      <img src={settings.company_details.logo} alt="Company Logo" className="h-14 w-auto object-contain border border-slate-200 p-1" />
                    )}
                    <input 
                      type="file" 
                      accept=".jpg,.jpeg,.png"
                      onChange={handleLogoUpload}
                      className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700">Site Name</label>
                  <input 
                    type="text" 
                    value={settings.header.siteName} 
                    onChange={(e) => setSettings({...settings, header: {...settings.header, siteName: e.target.value}})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-sm"
                  />
                </div>
              </div>
              <button 
                onClick={() => handleSaveSettings('header')}
                disabled={saving}
                className="bg-slate-900 text-white px-6 py-2 rounded-sm font-bold uppercase tracking-wider hover:bg-slate-800 disabled:opacity-50"
              >
                Save Header
              </button>
            </div>

            {/* Footer Settings Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold border-b pb-2">Footer Settings</h3>
              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-700">Copyright Text</label>
                <input 
                  type="text" 
                  value={settings.footer.copyright} 
                  onChange={(e) => setSettings({...settings, footer: {...settings.footer, copyright: e.target.value}})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-sm"
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-bold text-slate-700">Social Media Icons</label>
                  <button 
                    onClick={addSocialLink}
                    className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded font-bold uppercase"
                  >
                    + Add Icon
                  </button>
                </div>
                
                <div className="space-y-3">
                  {settings.footer.socialLinks.map((link: any) => (
                    <div key={link.id} className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-sm">
                      <div className="flex-shrink-0">
                        {link.icon ? (
                          <img src={link.icon} alt={link.platform} className="w-10 h-10 object-contain bg-white border border-slate-200 p-1" />
                        ) : (
                          <div className="w-10 h-10 bg-slate-200 flex items-center justify-center text-slate-400 text-xs">No Icon</div>
                        )}
                        <div className="mt-1">
                          <input 
                            type="file" 
                            id={`icon-${link.id}`}
                            accept=".jpg,.jpeg,.png"
                            className="hidden"
                            onChange={(e) => handleSocialIconUpload(e, link.id)}
                          />
                          <label 
                            htmlFor={`icon-${link.id}`}
                            className="text-[10px] text-blue-600 hover:underline cursor-pointer block text-center"
                          >
                            Upload
                          </label>
                        </div>
                      </div>
                      
                      <div className="flex-grow grid grid-cols-2 gap-2">
                        <input 
                          type="text" 
                          placeholder="Platform Name"
                          value={link.platform} 
                          onChange={(e) => updateSocialLink(link.id, 'platform', e.target.value)}
                          className="w-full px-2 py-1 border border-slate-200 rounded-sm text-sm"
                        />
                        <input 
                          type="text" 
                          placeholder="URL"
                          value={link.url} 
                          onChange={(e) => updateSocialLink(link.id, 'url', e.target.value)}
                          className="w-full px-2 py-1 border border-slate-200 rounded-sm text-sm"
                        />
                      </div>
                      
                      <button 
                        onClick={() => removeSocialLink(link.id)}
                        className="text-slate-400 hover:text-red-500 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {settings.footer.socialLinks.length === 0 && (
                    <p className="text-sm text-slate-500 italic">No social icons added.</p>
                  )}
                </div>
              </div>

              <button 
                onClick={() => handleSaveSettings('footer')}
                disabled={saving}
                className="bg-slate-900 text-white px-6 py-2 rounded-sm font-bold uppercase tracking-wider hover:bg-slate-800 disabled:opacity-50"
              >
                Save Footer
              </button>
            </div>

            {/* Locations & Contact Details Section */}
            <div className="space-y-8">
              <h3 className="text-lg font-bold border-b pb-2">Locations & Contact Details</h3>
              
              {/* Hero Image Subsection */}
              <div className="space-y-4 bg-slate-50 p-6 rounded-sm border border-slate-200">
                <h4 className="font-bold text-slate-800">Locations Page Hero Image</h4>
                <p className="text-sm text-slate-500 mb-2">This image appears at the top of your Locations page.</p>
                <div className="flex items-center gap-4">
                  {settings.locations.heroImage && (
                    <img src={settings.locations.heroImage} alt="Locations Hero" className="h-24 w-auto object-cover border border-slate-200 p-1 bg-white" />
                  )}
                  <div className="flex-grow">
                    <input 
                      type="file" 
                      accept=".jpg,.jpeg,.png"
                      onChange={handleLocationsHeroUpload}
                      className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-semibold file:bg-slate-200 file:text-slate-700 hover:file:bg-slate-300 cursor-pointer"
                    />
                    <p className="text-xs text-slate-400 mt-1">Recommended size: 1920x1080px (JPG or PNG)</p>
                  </div>
                </div>
              </div>

              {/* Contact Information Subsection */}
              <div className="space-y-6 bg-slate-50 p-6 rounded-sm border border-slate-200">
                <h4 className="font-bold text-slate-800">Contact Information</h4>
                <p className="text-sm text-slate-500 mb-4">These details are displayed on your Locations page and in the site Footer.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-slate-700">Company Name</label>
                    <input 
                      type="text" 
                      value={settings.company_details.name} 
                      onChange={(e) => setSettings({...settings, company_details: {...settings.company_details, name: e.target.value}})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-sm focus:ring-2 focus:ring-slate-400 outline-none"
                      placeholder="e.g. TrainingPro Inc."
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-slate-700">Phone Number(s)</label>
                    <textarea 
                      value={settings.company_details.phone} 
                      onChange={(e) => setSettings({...settings, company_details: {...settings.company_details, phone: e.target.value}})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-sm h-24 focus:ring-2 focus:ring-slate-400 outline-none"
                      placeholder="e.g. +44 (0) 123 456 7890"
                    />
                    <p className="text-xs text-slate-400">Supports multiple lines.</p>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-slate-700">Email Address(es)</label>
                    <textarea 
                      value={settings.company_details.email} 
                      onChange={(e) => setSettings({...settings, company_details: {...settings.company_details, email: e.target.value}})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-sm h-24 focus:ring-2 focus:ring-slate-400 outline-none"
                      placeholder="e.g. info@example.com"
                    />
                    <p className="text-xs text-slate-400">Supports multiple lines.</p>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-slate-700">Physical Address</label>
                    <textarea 
                      value={settings.company_details.address} 
                      onChange={(e) => setSettings({...settings, company_details: {...settings.company_details, address: e.target.value}})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-sm h-24 focus:ring-2 focus:ring-slate-400 outline-none"
                      placeholder="e.g. 123 Business Rd, London, UK"
                    />
                    <p className="text-xs text-slate-400">Supports multiple lines.</p>
                  </div>

                  <div className="space-y-4 md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700">Operating Hours</label>
                    <textarea 
                      value={settings.company_details.openHours} 
                      onChange={(e) => setSettings({...settings, company_details: {...settings.company_details, openHours: e.target.value}})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-sm h-24 focus:ring-2 focus:ring-slate-400 outline-none"
                      placeholder="e.g. Mon-Fri: 9am - 5pm"
                    />
                    <p className="text-xs text-slate-400">Supports multiple lines.</p>
                  </div>
                </div>
              </div>

              {/* Map Settings Subsection */}
              <div className="space-y-4 bg-slate-50 p-6 rounded-sm border border-slate-200">
                <h4 className="font-bold text-slate-800">Map Integration</h4>
                <p className="text-sm text-slate-500 mb-2">Embed a Google Map on your Locations page.</p>
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700">Google Maps Embed URL</label>
                  <input 
                    type="text" 
                    value={settings.company_details.mapUrl} 
                    onChange={(e) => setSettings({...settings, company_details: {...settings.company_details, mapUrl: e.target.value}})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-sm font-mono text-xs focus:ring-2 focus:ring-slate-400 outline-none"
                    placeholder="https://www.google.com/maps/embed?..."
                  />
                  <p className="text-xs text-slate-400">
                    Go to Google Maps -&gt; Share -&gt; Embed a map -&gt; Copy HTML -&gt; Extract the <code>src</code> URL.
                  </p>
                </div>
              </div>

              <button 
                onClick={handleSaveAllLocationSettings}
                disabled={saving}
                className="bg-slate-900 text-white px-6 py-3 rounded-sm font-bold uppercase tracking-wider hover:bg-slate-800 disabled:opacity-50 w-full md:w-auto"
              >
                Save All Location & Contact Settings
              </button>
            </div>

            {/* Form Builder Section */}
            <div className="space-y-8 pt-12 border-t border-slate-200">
              <h3 className="text-lg font-bold border-b pb-2">Form Builders</h3>
              <p className="text-sm text-slate-500">Customize the fields for your contact and course enrollment forms.</p>
              
              <div className="grid grid-cols-2 gap-4 md:gap-8">
                {/* Contact Us Form Builder */}
                <div className="space-y-4 p-6 bg-slate-50 rounded-sm border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-slate-800 uppercase tracking-widest text-xs">Main Contact Form</h4>
                    <button 
                      onClick={() => {
                        const updated = [...(settings.contact_form || [])];
                        updated.push({ name: `field_${Date.now()}`, label: 'New Field', type: 'text', required: false });
                        setSettings({ ...settings, contact_form: updated });
                      }}
                      className="text-[10px] bg-slate-900 text-white px-2 py-1 rounded font-bold uppercase"
                    >
                      + Add Field
                    </button>
                  </div>
                  <div className="space-y-3">
                    {(settings.contact_form || []).map((field: any, idx: number) => (
                      <div key={idx} className="bg-white p-3 rounded-sm border border-slate-200 space-y-2">
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={field.label} 
                            onChange={(e) => {
                              const updated = [...settings.contact_form];
                              updated[idx].label = e.target.value;
                              setSettings({ ...settings, contact_form: updated });
                            }}
                            placeholder="Field Label"
                            className="flex-1 px-2 py-1 border border-slate-200 rounded-sm text-sm"
                          />
                          <select 
                            value={field.type}
                            onChange={(e) => {
                              const updated = [...settings.contact_form];
                              updated[idx].type = e.target.value;
                              setSettings({ ...settings, contact_form: updated });
                            }}
                            className="px-2 py-1 border border-slate-200 rounded-sm text-sm"
                          >
                            <option value="text">Text</option>
                            <option value="email">Email</option>
                            <option value="tel">Phone</option>
                            <option value="number">Number</option>
                            <option value="textarea">Textarea</option>
                          </select>
                          <button 
                            onClick={() => {
                              const updated = settings.contact_form.filter((_: any, i: number) => i !== idx);
                              setSettings({ ...settings, contact_form: updated });
                            }}
                            className="text-slate-400 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
                          <input 
                            type="checkbox" 
                            checked={field.required} 
                            onChange={(e) => {
                              const updated = [...settings.contact_form];
                              updated[idx].required = e.target.checked;
                              setSettings({ ...settings, contact_form: updated });
                            }}
                          />
                          Required Field
                        </label>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => handleSaveSettings('contact_form')}
                    disabled={saving}
                    className="w-full bg-slate-900 text-white py-2 rounded-sm font-bold uppercase text-xs tracking-widest hover:bg-slate-800"
                  >
                    Save Contact Form Config
                  </button>
                </div>

                {/* Course Enrollment Form Builder */}
                <div className="space-y-4 p-6 bg-slate-50 rounded-sm border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-slate-800 uppercase tracking-widest text-xs">Course Enrollment Form</h4>
                    <button 
                      onClick={() => {
                        const updated = [...(settings.course_form || [])];
                        updated.push({ name: `field_${Date.now()}`, label: 'New Field', type: 'text', required: false });
                        setSettings({ ...settings, course_form: updated });
                      }}
                      className="text-[10px] bg-slate-900 text-white px-2 py-1 rounded font-bold uppercase"
                    >
                      + Add Field
                    </button>
                  </div>
                  <div className="space-y-3">
                    {(settings.course_form || []).map((field: any, idx: number) => (
                      <div key={idx} className="bg-white p-3 rounded-sm border border-slate-200 space-y-2">
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={field.label} 
                            onChange={(e) => {
                              const updated = [...settings.course_form];
                              updated[idx].label = e.target.value;
                              setSettings({ ...settings, course_form: updated });
                            }}
                            placeholder="Field Label"
                            className="flex-1 px-2 py-1 border border-slate-200 rounded-sm text-sm"
                          />
                          <select 
                            value={field.type}
                            onChange={(e) => {
                              const updated = [...settings.course_form];
                              updated[idx].type = e.target.value;
                              setSettings({ ...settings, course_form: updated });
                            }}
                            className="px-2 py-1 border border-slate-200 rounded-sm text-sm"
                          >
                            <option value="text">Text</option>
                            <option value="email">Email</option>
                            <option value="tel">Phone</option>
                            <option value="number">Number</option>
                            <option value="textarea">Textarea</option>
                          </select>
                          <button 
                            onClick={() => {
                              const updated = settings.course_form.filter((_: any, i: number) => i !== idx);
                              setSettings({ ...settings, course_form: updated });
                            }}
                            className="text-slate-400 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
                          <input 
                            type="checkbox" 
                            checked={field.required} 
                            onChange={(e) => {
                              const updated = [...settings.course_form];
                              updated[idx].required = e.target.checked;
                              setSettings({ ...settings, course_form: updated });
                            }}
                          />
                          Required Field
                        </label>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => handleSaveSettings('course_form')}
                    disabled={saving}
                    className="w-full bg-slate-900 text-white py-2 rounded-sm font-bold uppercase text-xs tracking-widest hover:bg-slate-800"
                  >
                    Save Course Form Config
                  </button>
                </div>
              </div>
            </div>

            {/* Theme Settings Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold border-b pb-2">Theme Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700">Primary Color</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      value={settings.theme_settings.primaryColor} 
                      onChange={(e) => setSettings({...settings, theme_settings: {...settings.theme_settings, primaryColor: e.target.value}})}
                      className="h-10 w-20 p-1 rounded-sm border border-slate-200 cursor-pointer"
                    />
                    <span className="text-sm font-mono text-slate-500">{settings.theme_settings.primaryColor}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700">Secondary Color</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      value={settings.theme_settings.secondaryColor} 
                      onChange={(e) => setSettings({...settings, theme_settings: {...settings.theme_settings, secondaryColor: e.target.value}})}
                      className="h-10 w-20 p-1 rounded-sm border border-slate-200 cursor-pointer"
                    />
                    <span className="text-sm font-mono text-slate-500">{settings.theme_settings.secondaryColor}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700">Font Family</label>
                  <select 
                    value={settings.theme_settings.fontFamily} 
                    onChange={(e) => setSettings({...settings, theme_settings: {...settings.theme_settings, fontFamily: e.target.value}})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-sm"
                  >
                    <option value="Inter">Inter (Sans-serif)</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Lato">Lato</option>
                    <option value="Montserrat">Montserrat</option>
                  </select>
                </div>
              </div>

              <button 
                onClick={() => handleSaveSettings('theme_settings')}
                disabled={saving}
                className="bg-slate-900 text-white px-6 py-2 rounded-sm font-bold uppercase tracking-wider hover:bg-slate-800 disabled:opacity-50"
              >
                Save Theme Settings
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
