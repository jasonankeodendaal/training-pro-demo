import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Save, 
  Trash2, 
  Plus, 
  ArrowLeft,
  BookOpen,
  Image as ImageIcon,
  Video,
  CheckSquare,
  List,
  Award
} from 'lucide-react';

export default function CourseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(id ? true : false);
  const [course, setCourse] = useState<any>({
    title: '',
    description: '',
    icon: 'BookOpen',
    images: [],
    videoUrl: '',
    howItWorks: [],
    checklistOptions: [],
    benefits: [],
    modules: [],
    accreditation: '',
    accreditationLogo: '',
    whatsappNumber: ''
  });

  useEffect(() => {
    if (id) {
      fetchCourse();
    }
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await fetch(`/api/services/${id}`);
      const data = await response.json();
      
      // Normalize data
      setCourse({
        ...data,
        images: typeof data.images === 'string' ? JSON.parse(data.images || '[]') : (data.images || []),
        howItWorks: typeof data.howItWorks === 'string' ? JSON.parse(data.howItWorks || '[]') : (data.howItWorks || []),
        checklistOptions: typeof data.checklistOptions === 'string' ? JSON.parse(data.checklistOptions || '[]') : (data.checklistOptions || []),
        benefits: typeof data.benefits === 'string' ? JSON.parse(data.benefits || '[]') : (data.benefits || []),
        modules: typeof data.modules === 'string' ? JSON.parse(data.modules || '[]') : (data.modules || [])
      });
    } catch (error) {
      console.error('Failed to fetch course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = id ? `/api/services/${id}` : '/api/services';
      const method = id ? 'PUT' : 'POST';
      
      const payload = {
        ...course,
        images: JSON.stringify(course.images),
        howItWorks: JSON.stringify(course.howItWorks),
        checklistOptions: JSON.stringify(course.checklistOptions),
        benefits: JSON.stringify(course.benefits),
        modules: JSON.stringify(course.modules)
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert(`Course ${id ? 'updated' : 'created'} successfully`);
        navigate('/admin');
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      alert('Failed to save course');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      return data.filePath;
    } catch (error) {
      console.error('Upload failed:', error);
      return null;
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const uploadedPaths = await Promise.all(files.map(handleFileUpload));
    const validPaths = uploadedPaths.filter(path => path !== null);
    setCourse({ ...course, images: [...course.images, ...validPaths] });
  };

  if (loading) return <div className="p-8 text-center">Loading course data...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Admin
          </button>
          <h1 className="text-2xl font-bold text-slate-900">
            {id ? 'Edit Course' : 'Create New Course'}
          </h1>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-slate-200 space-y-8">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Course Title</label>
              <input 
                type="text" 
                value={course.title}
                onChange={(e) => setCourse({ ...course, title: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-sm focus:ring-2 focus:ring-slate-900 outline-none"
                placeholder="e.g. Plant Training"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Icon Name (Lucide)</label>
              <input 
                type="text" 
                value={course.icon}
                onChange={(e) => setCourse({ ...course, icon: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-sm focus:ring-2 focus:ring-slate-900 outline-none"
                placeholder="BookOpen, Shield, etc."
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Description</label>
            <textarea 
              value={course.description}
              onChange={(e) => setCourse({ ...course, description: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-sm focus:ring-2 focus:ring-slate-900 outline-none"
              rows={4}
              placeholder="Provide a detailed overview..."
            />
          </div>

          {/* Media */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <ImageIcon className="w-4 h-4" /> Course Images
              </label>
              <div className="grid grid-cols-3 gap-2">
                {course.images.map((img: string, idx: number) => (
                  <div key={idx} className="relative group aspect-video bg-slate-100 border rounded-sm overflow-hidden">
                    <img src={img} className="w-full h-full object-cover" />
                    <button 
                      onClick={() => setCourse({ ...course, images: course.images.filter((_: any, i: number) => i !== idx) })}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <label className="aspect-video border-2 border-dashed border-slate-200 rounded-sm flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors">
                  <Plus className="w-6 h-6 text-slate-300" />
                  <input type="file" multiple onChange={handleImageUpload} className="hidden" accept="image/*" />
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Video className="w-4 h-4" /> Video URL (MP4)
              </label>
              <input 
                type="text" 
                value={course.videoUrl}
                onChange={(e) => setCourse({ ...course, videoUrl: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-sm focus:ring-2 focus:ring-slate-900 outline-none"
                placeholder="https://example.com/video.mp4"
              />
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">WhatsApp Number</label>
                <input 
                  type="text" 
                  value={course.whatsappNumber}
                  onChange={(e) => setCourse({ ...course, whatsappNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-sm focus:ring-2 focus:ring-slate-900 outline-none"
                  placeholder="+44..."
                />
              </div>
            </div>
          </div>

          {/* Dynamic Lists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-100">
            {/* Checklist Options */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <CheckSquare className="w-4 h-4" /> Training Requirements
                </label>
                <button 
                  onClick={() => setCourse({ ...course, checklistOptions: [...course.checklistOptions, ''] })}
                  className="text-[10px] font-bold text-yellow-600 uppercase"
                >
                  + Add Option
                </button>
              </div>
              <div className="space-y-2">
                {course.checklistOptions.map((opt: string, idx: number) => (
                  <div key={idx} className="flex gap-2">
                    <input 
                      type="text" 
                      value={opt}
                      onChange={(e) => {
                        const updated = [...course.checklistOptions];
                        updated[idx] = e.target.value;
                        setCourse({ ...course, checklistOptions: updated });
                      }}
                      className="flex-grow px-3 py-1 border border-slate-200 rounded-sm text-sm"
                    />
                    <button onClick={() => setCourse({ ...course, checklistOptions: course.checklistOptions.filter((_: any, i: number) => i !== idx) })}>
                      <Trash2 className="w-4 h-4 text-slate-300 hover:text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* How It Works */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <List className="w-4 h-4" /> Process Steps
                </label>
                <button 
                  onClick={() => setCourse({ ...course, howItWorks: [...course.howItWorks, ''] })}
                  className="text-[10px] font-bold text-yellow-600 uppercase"
                >
                  + Add Step
                </button>
              </div>
              <div className="space-y-2">
                {course.howItWorks.map((step: string, idx: number) => (
                  <div key={idx} className="flex gap-2">
                    <input 
                      type="text" 
                      value={step}
                      onChange={(e) => {
                        const updated = [...course.howItWorks];
                        updated[idx] = e.target.value;
                        setCourse({ ...course, howItWorks: updated });
                      }}
                      className="flex-grow px-3 py-1 border border-slate-200 rounded-sm text-sm"
                    />
                    <button onClick={() => setCourse({ ...course, howItWorks: course.howItWorks.filter((_: any, i: number) => i !== idx) })}>
                      <Trash2 className="w-4 h-4 text-slate-300 hover:text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Accreditation */}
          <div className="pt-8 border-t border-slate-100 space-y-4">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Award className="w-4 h-4" /> Accreditation
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input 
                type="text" 
                value={course.accreditation}
                onChange={(e) => setCourse({ ...course, accreditation: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-sm focus:ring-2 focus:ring-slate-900 outline-none text-sm"
                placeholder="Accreditation Name"
              />
              <input 
                type="text" 
                value={course.accreditationLogo}
                onChange={(e) => setCourse({ ...course, accreditationLogo: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-sm focus:ring-2 focus:ring-slate-900 outline-none text-sm"
                placeholder="Accreditation Logo URL"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-8 border-t border-slate-100">
            <button 
              onClick={handleSave}
              disabled={saving}
              className="w-full py-4 bg-slate-900 text-white font-bold uppercase tracking-widest rounded-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <Save className="w-5 h-5" /> {saving ? 'Saving...' : 'Save Course Configuration'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
