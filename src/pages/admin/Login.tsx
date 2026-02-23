import React from 'react';

export default function Login() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="bg-white p-12 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-4xl font-bold text-slate-900 mb-2 text-center">Admin Access</h1>
        <p className="text-slate-500 mb-8 text-center">Enter password to manage content.</p>
        <form>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
