import React from 'react';

export default function AdminHeader() {
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
