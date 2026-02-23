import React from 'react';

export default function Card({ title, children, footer }) {
  return (
    <div className="bg-white shadow-sm border border-slate-200 rounded-2xl">
      <div className="px-6 py-5 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      </div>
      <div className="p-6">
        {children}
      </div>
      {footer && (
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 rounded-b-2xl">
          {footer}
        </div>
      )}
    </div>
  );
}
