import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface Employee {
  name: string;
  age: string;
  jobTitle: string;
}

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  formConfig?: any[];
}

export default function ContactModal({ isOpen, onClose, formConfig }: ContactModalProps) {
  const [formData, setFormData] = useState<any>({});
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([{ name: '', age: '', jobTitle: '' }]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Default fields if no config provided
  const defaultFields = [
    { name: 'name', label: 'Full Name', type: 'text', required: true },
    { name: 'companyName', label: 'Company', type: 'text', required: true },
    { name: 'tel', label: 'Telephone', type: 'tel', required: true },
    { name: 'email', label: 'Email Address', type: 'email', required: true },
    { name: 'address', label: 'Address', type: 'textarea', required: false },
    { name: 'notes', label: 'Additional Notes', type: 'textarea', required: false }
  ];

  const fields = formConfig && formConfig.length > 0 ? formConfig : defaultFields;
  const checklistOptions = [
    "Plant Training",
    "Health & Safety",
    "First Aid",
    "Fire Safety",
    "Manual Handling",
    "Lifting Operations"
  ];

  useEffect(() => {
    if (isOpen) {
      const initialData: any = {};
      fields.forEach(f => initialData[f.name] = '');
      setFormData(initialData);
    }
  }, [isOpen, formConfig]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleChecklistChange = (option: string) => {
    setSelectedNeeds(prev => 
      prev.includes(option) ? prev.filter(i => i !== option) : [...prev, option]
    );
  };

  const handleEmployeeChange = (index: number, field: keyof Employee, value: string) => {
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
    setLoading(true);
    try {
      const payload = {
        ...formData,
        checklist: selectedNeeds,
        employees: employees.filter(emp => emp.name.trim() !== ''),
        serviceId: null // General contact
      };

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // Build WhatsApp Message
        let message = `*New Training Inquiry*\n\n`;
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

        const validEmployees = employees.filter(emp => emp.name.trim() !== '');
        if (validEmployees.length > 0) {
          message += `*Employee Details:*\n`;
          validEmployees.forEach((emp, i) => {
            message += `${i + 1}. ${emp.name} (Age: ${emp.age}, Role: ${emp.jobTitle})\n`;
          });
          message += `\n`;
        }

        if (formData.notes) {
          message += `*Additional Notes:*\n${formData.notes}`;
        }

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/441234567890?text=${encodedMessage}`;
        
        setSubmitted(true);
        setFormData({ name: '', companyName: '', tel: '', email: '', address: '', notes: '' });
        setSelectedNeeds([]);
        setEmployees([{ name: '', age: '', jobTitle: '' }]);

        // Redirect to WhatsApp
        window.open(whatsappUrl, '_blank');
      }
    } catch (error) {
      console.error("Error submitting lead:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[2rem] shadow-2xl border border-slate-200 scrollbar-edge"
        >
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-secondary transition-colors z-10"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          <div className="p-4 md:p-8">
            {submitted ? (
              <div className="text-center py-8 md:py-12">
                <div className="w-10 h-10 md:w-16 md:h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-6">
                  <CheckCircle2 className="w-6 h-6 md:w-10 md:h-10" />
                </div>
                <h3 className="text-lg md:text-2xl font-bold text-secondary mb-1 md:mb-2">Request Submitted!</h3>
                <p className="text-slate-600 text-xs md:text-base mb-3 md:mb-6">Our team will contact you shortly.</p>
                <button 
                  onClick={() => { setSubmitted(false); onClose(); }}
                  className="bg-secondary text-white px-4 py-2 md:px-8 md:py-3 rounded-lg md:rounded-xl font-bold uppercase tracking-widest hover:bg-slate-800 transition-all text-xs md:text-sm shadow-lg"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 md:space-y-6">
                <div className="text-center">
                  <h2 className="text-lg md:text-3xl font-bold text-secondary tracking-tight">Contact Us</h2>
                  <div className="w-8 md:w-16 h-0.5 md:h-1 bg-primary mx-auto mt-1 md:mt-2 rounded-full"></div>
                </div>

                {/* Dynamic Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
                  <div className="space-y-2 md:space-y-3">
                    <h3 className="text-[10px] md:text-xs font-bold text-secondary uppercase tracking-widest border-b border-slate-100 pb-1">Details</h3>
                    <div className="space-y-1.5 md:space-y-2">
                      {fields.map((field) => (
                        <div key={field.name}>
                          <label className="block text-[10px] md:text-xs font-bold text-slate-700 mb-0.5">{field.label}</label>
                          {field.type === 'textarea' ? (
                            <textarea 
                              name={field.name} 
                              required={field.required} 
                              value={formData[field.name] || ''} 
                              onChange={handleInputChange}
                              rows={2}
                              className="w-full px-2 py-1 md:px-3 md:py-2 border border-slate-200 rounded-md md:rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs md:text-sm"
                            />
                          ) : (
                            <input 
                              type={field.type} 
                              name={field.name} 
                              required={field.required} 
                              value={formData[field.name] || ''} 
                              onChange={handleInputChange}
                              className="w-full px-2 py-1 md:px-3 md:py-2 border border-slate-200 rounded-md md:rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs md:text-sm"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Training Needs */}
                  <div className="space-y-2 md:space-y-3">
                    <h3 className="text-[10px] md:text-xs font-bold text-secondary uppercase tracking-widest border-b border-slate-100 pb-1">Required</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-2">
                      {checklistOptions.map((option) => (
                        <label 
                          key={option} 
                          className={`flex items-center p-1 md:p-2 border rounded-md md:rounded-lg cursor-pointer transition-all ${
                            selectedNeeds.includes(option) 
                              ? 'border-primary bg-primary/10 text-secondary' 
                              : 'border-slate-100 hover:border-slate-200 text-slate-600'
                          }`}
                        >
                          <input 
                            type="checkbox" 
                            className="hidden" 
                            checked={selectedNeeds.includes(option)}
                            onChange={() => handleChecklistChange(option)}
                          />
                          <div className={`w-3 h-3 md:w-3.5 md:h-3.5 rounded border mr-1.5 md:mr-2 flex items-center justify-center transition-colors ${
                            selectedNeeds.includes(option) ? 'bg-primary border-primary' : 'border-slate-300 bg-white'
                          }`}>
                            {selectedNeeds.includes(option) && <CheckCircle2 className="w-2 h-2 md:w-2.5 md:h-2.5 text-secondary" />}
                          </div>
                          <span className="font-bold text-[10px] md:text-xs leading-tight">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Employee Section */}
                <div className="space-y-2 md:space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                    <h3 className="text-[10px] md:text-xs font-bold text-secondary uppercase tracking-widest">Employees</h3>
                    <button 
                      type="button"
                      onClick={addEmployee}
                      className="flex items-center gap-0.5 text-yellow-600 hover:text-yellow-700 font-bold text-[10px] md:text-xs uppercase tracking-widest"
                    >
                      <Plus className="w-3 h-3 md:w-3.5 md:h-3.5" />
                      Add
                    </button>
                  </div>
                  
                  <div className="space-y-1.5 md:space-y-2 max-h-[120px] overflow-y-auto scrollbar-edge pr-1">
                    {employees.map((emp, idx) => (
                      <div key={idx} className="grid grid-cols-12 gap-2 p-1.5 md:p-2 bg-slate-50 rounded-lg border border-slate-100 relative shadow-sm items-center">
                        <div className="col-span-5">
                          <input 
                            type="text" value={emp.name} onChange={(e) => handleEmployeeChange(idx, 'name', e.target.value)}
                            className="w-full px-2 py-1 border border-slate-200 rounded text-xs"
                            placeholder="Name"
                          />
                        </div>
                        <div className="col-span-2">
                          <input 
                            type="number" value={emp.age} onChange={(e) => handleEmployeeChange(idx, 'age', e.target.value)}
                            className="w-full px-2 py-1 border border-slate-200 rounded text-xs"
                            placeholder="Age"
                          />
                        </div>
                        <div className="col-span-4">
                          <input 
                            type="text" value={emp.jobTitle} onChange={(e) => handleEmployeeChange(idx, 'jobTitle', e.target.value)}
                            className="w-full px-2 py-1 border border-slate-200 rounded text-xs"
                            placeholder="Role"
                          />
                        </div>
                        <div className="col-span-1 flex justify-center">
                          <button 
                            type="button"
                            onClick={() => removeEmployee(idx)}
                            className="text-slate-400 hover:text-red-500 transition-colors"
                            disabled={employees.length === 1}
                          >
                            <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-secondary text-white py-2 md:py-3 rounded-lg md:rounded-xl font-bold uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2 text-xs md:text-sm disabled:opacity-50 shadow-lg"
                >
                  {loading ? 'Processing...' : <><Send className="w-3 h-3 md:w-4 md:h-4" /> Submit Request</>}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
