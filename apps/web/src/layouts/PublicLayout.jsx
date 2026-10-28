import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ShieldAlert, PhoneCall, AlertTriangle, ArrowLeft } from 'lucide-react';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-red-600 flex items-center justify-center shadow-lg shadow-red-500/20">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-slate-100 text-lg">Citizen Emergency Portal</span>
              <p className="text-[10px] text-red-400 font-semibold uppercase tracking-wider">State Disaster Management Authority</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <a
              href="tel:112"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call 112 (National Helpline)</span>
            </a>
            <Link
              to="/login"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            >
              Official Login
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>

      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        <p>© State Disaster Management Authority & National Emergency Relief System. For life-threatening emergencies, dial 112 or 1070.</p>
      </footer>
    </div>
  );
}
