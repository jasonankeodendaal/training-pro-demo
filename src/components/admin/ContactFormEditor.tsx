import React, { useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';

interface FormField {
  id: number;
  label: string;
  type: 'text' | 'email' | 'textarea';
}

export default function ContactFormEditor() {
  const [fields, setFields] = useState<FormField[]>([
    { id: 1, label: 'Full Name', type: 'text' },
    { id: 2, label: 'Email Address', type: 'email' },
    { id: 3, label: 'Message', type: 'textarea' },
  ]);

  const addField = () => {
    const newId = fields.length > 0 ? Math.max(...fields.map(f => f.id)) + 1 : 1;
    setFields([...fields, { id: newId, label: '', type: 'text' }]);
  };

  const removeField = (id: number) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const updateField = (id: number, key: keyof FormField, value: string) => {
    setFields(fields.map(f => f.id === id ? { ...f, [key]: value } : f));
  };

  return (
    <div className="space-y-8">
      <div className="p-6 bg-white rounded-lg shadow-sm border border-slate-200">
        <h3 className="text-xl font-semibold mb-4 border-b pb-2">Contact Form Fields</h3>
        <div className="space-y-4">
          {fields.map(field => (
            <div key={field.id} className="flex items-center gap-4 p-4 border rounded-md bg-slate-50">
              <GripVertical className="text-slate-400 cursor-grab" />
              <div className="flex-grow grid grid-cols-2 gap-4">
                <input
                  type="text"
                  value={field.label}
                  onChange={(e) => updateField(field.id, 'label', e.target.value)}
                  placeholder="Field Label"
                  className="w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                />
                <select
                  value={field.type}
                  onChange={(e) => updateField(field.id, 'type', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 bg-white"
                >
                  <option value="text">Text</option>
                  <option value="email">Email</option>
                  <option value="textarea">Text Area</option>
                </select>
              </div>
              <button onClick={() => removeField(field.id)} className="text-slate-400 hover:text-red-500"><Trash2 /></button>
            </div>
          ))}
        </div>
        <button onClick={addField} className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800">
          <Plus className="w-4 h-4" />
          Add Field
        </button>
      </div>

      <div className="flex justify-end">
        <button className="bg-slate-800 text-white font-bold py-2 px-6 rounded-md hover:bg-slate-700 transition-colors">
          Save Contact Form
        </button>
      </div>
    </div>
  );
}
