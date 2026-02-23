import React from 'react';

export default function HeroSettings() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h3 className="text-lg font-medium leading-6 text-slate-900">Hero Content</h3>
        <p className="mt-1 text-sm text-slate-600">Update the main heading and subheading for the hero section.</p>
        <div className="mt-6 space-y-6">
          <div>
            <label htmlFor="hero-heading" className="block text-sm font-medium text-slate-700">Heading</label>
            <input type="text" id="hero-heading" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm" />
          </div>
          <div>
            <label htmlFor="hero-subheading" className="block text-sm font-medium text-slate-700">Subheading</label>
            <textarea id="hero-subheading" rows={3} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm"></textarea>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-medium leading-6 text-slate-900">Hero Images</h3>
        <p className="mt-1 text-sm text-slate-600">Upload the background images for the hero carousel.</p>
        <div className="mt-6">
          <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="flex text-sm text-slate-600">
                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-yellow-600 hover:text-yellow-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-yellow-500">
                  <span>Upload files</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple accept="image/jpeg,image/png" />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-slate-500">PNG, JPG up to 10MB</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
