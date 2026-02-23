import React, { useState, useEffect } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, Send, Plus, Trash2 } from 'lucide-react';

export default function ServiceDetail() {
  const { id } = useParams();
  const { settings } = useOutletContext<{ settings: any }>();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);
  const [employees, setEmployees] = useState<any[]>([{ name: '', age: '', jobTitle: '' }]);
  const [formData, setFormData] = useState<any>({});
  const [submitted, setSubmitted] = useState(false);

  // Default fields if no config provided
  const defaultFields = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'surname', label: 'Surname', type: 'text', required: true },
    { name: 'companyName', label: 'Company', type: 'text', required: true },
    { name: 'tel', label: 'Telephone', type: 'tel', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'notes', label: 'Notes', type: 'textarea', required: false }
  ];

  const fields = settings?.courseForm && settings.courseForm.length > 0 ? settings.courseForm : defaultFields;

  useEffect(() => {
    const initialData: any = {};
    fields.forEach(f => initialData[f.name] = '');
    setFormData(initialData);
  }, [settings?.courseForm]);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/services/${id}`)
      .then(res => res.json())
      .then(data => {
        setService(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch service", err);
        setLoading(false);
      });
  }, [id]);

  const handleChecklistChange = (option: string) => {
    setSelectedNeeds(prev => 
      prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEmployeeChange = (index: number, field: string, value: string) => {
    const newEmployees = [...employees];
    newEmployees[index][field] = value;
    setEmployees(newEmployees);
  };

  const addEmployee = () => {
    setEmployees([...employees, { name: '', age: '', jobTitle: '' }]);
  };

  const removeEmployee = (index: number) => {
    if (employees.length > 1) {
      setEmployees(employees.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validEmployees = employees.filter(emp => emp.name.trim() !== '');
      const payload = {
        ...formData,
        serviceId: id,
        checklist: selectedNeeds,
        employees: validEmployees
      };

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        // Build WhatsApp Message
        let message = `*New Training Inquiry: ${service.title}*\n\n`;
        message += `*Contact Details:*\n`;
        fields.forEach(f => {
          if (formData[f.name]) {
            message += `${f.label}: ${formData[f.name]}\n`;
          }
        });
        message += `\n`;

        if (selectedNeeds.length > 0) {
          message += `*Training Required:*\n`;
          selectedNeeds.forEach(need => message += `- ${need}\n`);
          message += `\n`;
        }

        if (validEmployees.length > 0) {
          message += `*Employee Details:*\n`;
          validEmployees.forEach((emp, i) => {
            message += `${i + 1}. ${emp.name} (Age: ${emp.age}, Role: ${emp.jobTitle}, WA: ${emp.whatsapp || 'N/A'})\n`;
          });
          message += `\n`;
        }

        if (formData.notes) {
          message += `*Additional Notes:*\n${formData.notes}`;
        }

        const encodedMessage = encodeURIComponent(message);
        const targetWA = service.whatsappNumber || "441234567890";
        const whatsappUrl = `https://wa.me/${targetWA.replace(/\+/g, '')}?text=${encodedMessage}`;

        setSubmitted(true);
        const resetData: any = {};
        fields.forEach(f => resetData[f.name] = '');
        setFormData(resetData);
        setSelectedNeeds([]);
        setEmployees([{ name: '', age: '', jobTitle: '', whatsapp: '' }]);

        // Redirect to WhatsApp
        window.open(whatsappUrl, '_blank');
      }
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (!service) return <div className="flex justify-center items-center h-screen">Service not found</div>;

  const images = JSON.parse(service.images || '[]');
  const howItWorks = JSON.parse(service.howItWorks || '[]');
  const checklistOptions = JSON.parse(service.checklistOptions || '[]');
  const benefits = JSON.parse(service.benefits || '[]');
  const modules = JSON.parse(service.modules || '[]');

  return (
    <div className="flex flex-col w-full bg-white">
      {/* Header */}
      <section className="bg-secondary py-12 md:py-24 px-4 md:px-16 text-center">
        <h1 className="text-2xl md:text-7xl font-bold text-white tracking-tight mb-4 md:mb-6">{service.title}</h1>
        <div className="w-16 md:w-32 h-1 md:h-2 bg-primary mx-auto mt-4 rounded-full"></div>
      </section>

      {/* Media & Description */}
      <section className="py-8 md:py-32 max-w-[1600px] mx-auto px-4 md:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-20 items-stretch">
          <div className="space-y-3 md:space-y-10">
            <div className="aspect-video bg-slate-100 rounded-xl md:rounded-3xl overflow-hidden shadow-md md:shadow-2xl border border-slate-200">
              <video src={service.videoUrl} controls className="w-full h-full object-cover" />
            </div>
            <div className="grid grid-cols-2 gap-2 md:gap-6">
              {images.slice(0, 2).map((img: string, idx: number) => (
                <div key={idx} className="aspect-square bg-slate-100 rounded-xl md:rounded-3xl overflow-hidden shadow-sm md:shadow-lg border border-slate-100">
                  <img src={img} alt={`Service ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col bg-slate-50 p-6 md:p-16 rounded-xl md:rounded-[3rem] border border-slate-100 shadow-sm">
            <h2 className="text-xs md:text-4xl font-bold text-secondary mb-2 md:mb-8 uppercase tracking-widest">Overview</h2>
            <p className="text-slate-600 text-sm md:text-2xl leading-relaxed mb-4 md:mb-12">
              {service.description}
            </p>
            
            <div className="mt-auto pt-3 md:pt-10 border-t border-slate-200">
              <h3 className="text-xs md:text-2xl font-bold text-secondary mb-2 md:mb-10 uppercase tracking-widest">Process Steps</h3>
              <div className="space-y-2 md:space-y-8">
                {howItWorks.map((step: string, idx: number) => (
                  <div key={idx} className="flex gap-2 md:gap-6 items-center">
                    <div className="flex-shrink-0 w-4 h-4 md:w-12 md:h-12 bg-primary rounded-full flex items-center justify-center font-bold text-secondary text-[8px] md:text-xl shadow-sm">
                      {idx + 1}
                    </div>
                    <p className="text-slate-700 font-bold text-[10px] md:text-xl">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits & Course Modules - Side by Side */}
      <section className="py-12 md:py-32 bg-secondary text-white">
        <div className="max-w-[1600px] mx-auto px-4 md:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20">
            <div>
              <h2 className="text-2xl md:text-4xl font-bold mb-8 md:mb-12 tracking-tight">Key Benefits</h2>
              <div className="grid grid-cols-1 gap-4 md:gap-8">
                {benefits.map((b: any, i: number) => (
                  <div key={i} className="flex gap-3 md:gap-6">
                    <div className="w-4 h-4 md:w-10 md:h-10 bg-primary rounded-sm md:rounded-xl flex-shrink-0 shadow-sm"></div>
                    <div>
                      <h4 className="font-bold text-sm md:text-xl mb-1">{b.title}</h4>
                      <p className="text-slate-400 text-xs md:text-lg leading-tight">{b.description}</p>
                    </div>
                  </div>
                ))}
                {benefits.length === 0 && <p className="text-slate-400 italic">No benefits listed.</p>}
              </div>
            </div>
            <div>
              <h2 className="text-2xl md:text-4xl font-bold mb-8 md:mb-12 tracking-tight">Course Modules</h2>
              <div className="space-y-3 md:space-y-4">
                {modules.map((m: any, i: number) => (
                  <div key={i} className="bg-slate-800 p-4 md:p-6 rounded-lg md:rounded-2xl border-l-2 md:border-l-4 border-primary">
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-sm md:text-xl font-bold">{m.title}</span>
                       <span className="text-primary text-[10px] md:text-sm uppercase tracking-widest font-mono">M{i+1}</span>
                    </div>
                    <p className="text-slate-400 text-xs md:text-base">{m.text}</p>
                  </div>
                ))}
                {modules.length === 0 && <p className="text-slate-400 italic">No modules listed.</p>}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certification Section */}
      <section className="py-8 md:py-32 bg-white">
        <div className="max-w-[1600px] mx-auto px-4 md:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-20 items-center bg-secondary rounded-2xl md:rounded-[4rem] overflow-hidden p-6 md:p-20 shadow-2xl">
            <div className="relative">
              {service.accreditationLogo ? (
                <img src={service.accreditationLogo} className="rounded-xl md:rounded-3xl shadow-xl border border-white/10 bg-white p-4" referrerPolicy="no-referrer" />
              ) : (
                <img src="https://picsum.photos/seed/cert/800/600" className="rounded-xl md:rounded-3xl shadow-xl border border-white/10" referrerPolicy="no-referrer" />
              )}
              <div className="absolute -bottom-2 -right-2 md:-bottom-10 md:-right-10 bg-primary text-secondary p-3 md:p-8 rounded-lg md:rounded-3xl shadow-2xl rotate-3">
                <div className="text-xs md:text-4xl font-black leading-none uppercase">Certified</div>
              </div>
            </div>
            <div className="space-y-4 md:space-y-8">
              <h2 className="text-2xl md:text-5xl font-bold text-white tracking-tight uppercase">Accreditation</h2>
              <div className="w-12 md:w-24 h-1 md:h-2 bg-primary rounded-full"></div>
              <p className="text-slate-400 text-sm md:text-2xl leading-relaxed whitespace-pre-wrap">
                {service.accreditation || "Nationally recognized certificate of competence, valid for 3-5 years. Industry approved standards."}
              </p>
              <div className="flex flex-wrap gap-2 md:gap-4">
                {['Industry Approved', 'Accredited'].map((tag, i) => (
                  <span key={i} className="bg-white/5 text-white border border-white/10 px-2 py-1 md:px-4 md:py-2 rounded-md md:rounded-xl text-[10px] md:text-sm font-bold uppercase tracking-widest">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Customization & Lead Form */}
      <section className="py-12 md:py-32 bg-slate-50 border-t border-slate-200">
        <div className="max-w-[1600px] mx-auto px-4 md:px-16">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl md:text-6xl font-bold text-secondary tracking-tight">Enroll in {service.title}</h2>
            <p className="text-slate-600 mt-2 md:mt-4 text-xs md:text-xl">Secure your spot for this {service.title.toLowerCase()} training module.</p>
            <div className="w-16 md:w-32 h-1 md:h-2 bg-primary mx-auto mt-4 md:mt-6 rounded-full"></div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-3 md:p-20 rounded-2xl md:rounded-3xl shadow-2xl border border-slate-200">
            {submitted ? (
              <div className="text-center py-8 md:py-20">
                <div className="w-10 h-10 md:w-24 md:h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-8">
                  <CheckCircle2 className="w-6 h-6 md:w-16 md:h-16" />
                </div>
                <h3 className="text-lg md:text-3xl font-bold text-secondary mb-1 md:mb-4">Enrollment Submitted!</h3>
                <p className="text-slate-600 text-[10px] md:text-xl">Our team will confirm your enrollment shortly.</p>
                <button 
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-4 md:mt-10 text-yellow-600 font-bold text-xs md:text-lg hover:underline"
                >
                  Enroll another group
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 md:gap-16">
                {/* Left Side: Checklist */}
                <div className="space-y-3 md:space-y-8">
                  <h3 className="text-[8px] md:text-xl font-bold text-secondary uppercase tracking-widest">Training Needs</h3>
                  <div className="grid grid-cols-1 gap-1.5 md:gap-6">
                    {checklistOptions.map((option: string) => (
                      <label 
                        key={option} 
                        className={`flex items-center p-1.5 md:p-6 border rounded-xl md:rounded-2xl cursor-pointer transition-all ${
                          selectedNeeds.includes(option) 
                            ? 'border-primary bg-primary/10 text-secondary' 
                            : 'border-slate-200 hover:border-slate-300 text-slate-600'
                        }`}
                      >
                        <input 
                          type="checkbox" 
                          className="hidden" 
                          checked={selectedNeeds.includes(option)}
                          onChange={() => handleChecklistChange(option)}
                        />
                        <div className={`w-2.5 h-2.5 md:w-6 md:h-6 rounded-md border mr-1.5 md:mr-4 flex items-center justify-center transition-colors ${
                          selectedNeeds.includes(option) ? 'bg-primary border-primary' : 'border-slate-300 bg-white'
                        }`}>
                          {selectedNeeds.includes(option) && <CheckCircle2 className="w-1.5 h-1.5 md:w-5 md:h-5 text-secondary" />}
                        </div>
                        <span className="font-bold text-[8px] md:text-lg">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Right Side: Dynamic Form Fields */}
                <div className="space-y-3 md:space-y-10">
                  <h3 className="text-[8px] md:text-xl font-bold text-secondary uppercase tracking-widest">Contact Info</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 md:gap-8">
                    {fields.map((field) => (
                      <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                        <label className="block text-[6px] md:text-base font-bold text-slate-700 mb-0.5 md:mb-3">{field.label}</label>
                        {field.type === 'textarea' ? (
                          <textarea 
                            name={field.name} 
                            required={field.required} 
                            value={formData[field.name] || ''} 
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full px-1.5 py-1 md:px-6 md:py-4 border border-slate-200 rounded-lg md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-[8px] md:text-lg"
                          />
                        ) : (
                          <input 
                            type={field.type} 
                            name={field.name} 
                            required={field.required} 
                            value={formData[field.name] || ''} 
                            onChange={handleInputChange}
                            className="w-full px-1.5 py-1 md:px-6 md:py-4 border border-slate-200 rounded-lg md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-[8px] md:text-lg"
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Employee Section */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[8px] md:text-xl font-bold text-secondary uppercase tracking-widest">Employees</h3>
                      <button 
                        type="button"
                        onClick={addEmployee}
                        className="flex items-center gap-0.5 text-yellow-600 hover:text-yellow-700 font-bold text-[6px] md:text-sm uppercase tracking-widest"
                      >
                        <Plus className="w-2 h-2 md:w-4 md:h-4" />
                        Add
                      </button>
                    </div>
                    
                    <div className="space-y-1.5">
                      {employees.map((emp, idx) => (
                        <div key={idx} className="grid grid-cols-2 md:grid-cols-12 gap-1.5 p-1.5 md:p-3 bg-slate-50 rounded-lg md:rounded-2xl border border-slate-100 relative shadow-sm">
                          <div className="col-span-2 md:col-span-5">
                            <label className="block text-[5px] md:text-[8px] font-bold text-slate-600 mb-0.5">Name</label>
                            <input 
                              type="text" value={emp.name} onChange={(e) => handleEmployeeChange(idx, 'name', e.target.value)}
                              className="w-full px-1 py-0.5 border border-slate-200 rounded-md md:rounded-xl text-[7px] md:text-[10px]"
                              placeholder="Full Name"
                            />
                          </div>
                          <div className="col-span-1 md:col-span-2">
                            <label className="block text-[5px] md:text-[8px] font-bold text-slate-600 mb-0.5">Age</label>
                            <input 
                              type="number" value={emp.age} onChange={(e) => handleEmployeeChange(idx, 'age', e.target.value)}
                              className="w-full px-1 py-0.5 border border-slate-200 rounded-md md:rounded-xl text-[7px] md:text-[10px]"
                              placeholder="Age"
                            />
                          </div>
                          <div className="col-span-1 md:col-span-3">
                            <label className="block text-[5px] md:text-[8px] font-bold text-slate-600 mb-0.5">Title</label>
                            <input 
                              type="text" value={emp.jobTitle} onChange={(e) => handleEmployeeChange(idx, 'jobTitle', e.target.value)}
                              className="w-full px-1 py-0.5 border border-slate-200 rounded-md md:rounded-xl text-[7px] md:text-[10px]"
                              placeholder="Job Title"
                            />
                          </div>
                          <div className="col-span-1 md:col-span-2">
                            <label className="block text-[5px] md:text-[8px] font-bold text-slate-600 mb-0.5">WhatsApp</label>
                            <input 
                              type="text" value={emp.whatsapp || ''} onChange={(e) => handleEmployeeChange(idx, 'whatsapp', e.target.value)}
                              className="w-full px-1 py-0.5 border border-slate-200 rounded-md md:rounded-xl text-[7px] md:text-[10px]"
                              placeholder="WA Number"
                            />
                          </div>
                          <div className="col-span-2 md:col-span-1 flex items-end justify-center">
                            <button 
                              type="button"
                              onClick={() => removeEmployee(idx)}
                              className="p-0.5 text-slate-400 hover:text-red-500 transition-colors"
                              disabled={employees.length === 1}
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-secondary text-white py-1.5 md:py-6 rounded-lg md:rounded-2xl font-bold uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-1 md:gap-3 text-[8px] md:text-xl shadow-xl"
                  >
                    <Send className="w-2.5 h-2.5 md:w-6 md:h-6" />
                    Submit
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}
