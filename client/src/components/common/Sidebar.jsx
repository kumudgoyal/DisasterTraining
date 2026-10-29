import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  MapPin,
  Flame,
  FileEdit,
  Home,
  Truck,
  AlertTriangle,
  ClipboardCheck,
  GraduationCap,
  BarChart3,
  Building2,
  Users,
  ScrollText
} from 'lucide-react';

export default function Sidebar() {
  const { isAtLeast } = useAuth();

  const navItems = [
    { label: 'Overview', path: '/', icon: LayoutDashboard },
    { label: 'Live GIS Map', path: '/map', icon: MapPin },
    { label: 'Incidents', path: '/incidents', icon: Flame },
    { label: 'Field Report', path: '/field-report', icon: FileEdit },
    { label: 'Shelters & Relief', path: '/shelters', icon: Home },
    { label: 'Resources', path: '/resources', icon: Truck },
    { label: 'Alerts & Broadcast', path: '/alerts', icon: AlertTriangle },
    { label: 'Damage Assessment', path: '/damage-assessment', icon: ClipboardCheck },
    { label: 'Preparedness Drills', path: '/training', icon: GraduationCap },
    { label: 'Analytics & SITREP', path: '/analytics', icon: BarChart3 },
    { label: 'Agencies Hub', path: '/organizations', icon: Building2 },
    ...(isAtLeast('District Admin') ? [
      { label: 'User Directory', path: '/admin/users', icon: Users },
      { label: 'Audit Trail', path: '/admin/audit-log', icon: ScrollText },
    ] : []),
  ];

  return (
    <aside className="w-64 bg-cream-50 border-r border-cream-200/80 flex flex-col shrink-0 p-4 transition-all">
      {/* Navigation Label */}
      <div className="px-3 pt-2 pb-3">
        <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-ink-400">
          Navigation
        </span>
      </div>

      <nav className="space-y-1 overflow-y-auto flex-1 pr-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) => `
                flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-150
                ${isActive 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'text-slate-700 hover:text-slate-950 hover:bg-white/80'}
              `}
            >
              <Icon className={`w-4 h-4 shrink-0 transition-opacity ${item.path === '/' ? '' : 'opacity-80'}`} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Control Desk Badge */}
      <div className="pt-4 border-t border-cream-200/60 mt-auto">
        <div className="p-3.5 rounded-2xl bg-white border border-ink-100 shadow-soft text-[11px] text-ink-600 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-ink-900">EOC Hotline</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <p className="text-[10px] text-ink-400">Dial 1070 / 112 for priority disaster triage</p>
        </div>
      </div>
    </aside>
  );
}
