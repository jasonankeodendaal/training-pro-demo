import React, { useState } from 'react';
import FileUpload from './FileUpload';
import { Plus, Edit, Trash2, ArrowRight } from 'lucide-react';

interface FormField {
  id: number;
  label: string;
  type: 'text' | 'email' | 'textarea';
}

interface Service {
  id: number;
  title: string;
  description: string;
  icon?: File;
  formFields: FormField[];
  whatsappNumber: string;
}

export default function ServicesEditor() {
  const [services, setServices] = useState<Service[]>([
    { id: 1, title: 'Plant Training', description: 'Comprehensive training for heavy machinery.', formFields: [], whatsappNumber: '' },
    { id: 2, title: 'Safety Courses', description: 'Certified safety courses for various industries.', formFields: [], whatsappNumber: '' },
  ]);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const handleAddNew = () => {
    const newId = services.length > 0 ? Math.max(...services.map(s => s.id)) + 1 : 1;
    setEditingService({ id: newId, title: '', description: '', formFields: [], whatsappNumber: '' });
  };

  const handleSave = () => {
    if (!editingService) return;
    const exists = services.some(s => s.id === editingService.id);
    if (exists) {
      setServices(services.map(s => s.id === editingService.id ? editingService : s));
    } else {
      setServices([...services, editingService]);
    }
    setEditingService(null);
  };
  
  const handleFormFieldChange = (fieldId: number, value: string) => {
    if (!editingService) return;
    const updatedFields = editingService.formFields.map(f => f.id === fieldId ? { ...f, label: value } : f);
    setEditingService({ ...editingService, formFields: updatedFields });
  };

  const addFormField = () => {
    if (!editingService) return;
    const newId = editingService.formFields.length > 0 ? Math.max(...editingService.formFields.map(f => f.id)) + 1 : 1;
    const newField: FormField = { id: newId, label: '', type: 'text' };
    setEditingService({ ...editingService, formFields: [...editingService.formFields, newField] });
  };

  if (editingService) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm border border-slate-200 space-y-6">
        <h3 className="text-xl font-semibold">{editingService.id ? 'Edit' : 'Add'} Service</h3>
        {/* ... form fields for title, description, icon, etc. ... */}
        <div className="space-y-4">
          <label className="block text-sm font-bold text-slate-700">Custom Form Fields</label>
          {editingService.formFields.map(field => (
            <div key={field.id} className="flex items-center gap-2">
              <input 
                type="text"
                value={field.label}
                onChange={(e) => handleFormFieldChange(field.id, e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md"
              />
              {/* ... type selector and remove button ... */}
            </div>
          ))}
          <button onClick={addFormField} className="text-sm text-blue-600">+ Add field</button>
        </div>
        <div className="flex justify-end gap-4">
          <button onClick={() => setEditingService(null)} className="text-slate-600 font-bold py-2 px-4">Cancel</button>
          <button onClick={handleSave} className="bg-slate-800 text-white font-bold py-2 px-6 rounded-md">Save Service</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Training Services</h2>
        <button onClick={handleAddNew} className="flex items-center gap-2 bg-yellow-400 text-slate-900 font-bold py-2 px-4 rounded-md">
          <Plus className="w-5 h-5" />
          Add New Service
        </button>
      </div>
      {/* ... list of services ... */}
    </div>
  );
}
