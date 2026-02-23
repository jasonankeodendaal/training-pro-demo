import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminNav from './components/AdminNav';

export default function AdminLayout() {
  return (
    <div className="w-full bg-slate-100 min-h-screen">
      <AdminNav />
      <main className="p-8">
        <Outlet />
      </main>
    </div>
  );
}
