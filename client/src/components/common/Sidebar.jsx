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
  ScrollText,
  FileText
} from 'lucide-react';

export default function Sidebar() {
  const { isAtLeast } = useAuth();

  const navItems = [
    { label: 'EOC Command', path: '/', icon: LayoutDashboard },
    { label: 'Live GIS Map', path: '/map', icon: MapPin },
    { label: 'Incidents', path: '/incidents', icon: Flame },
    { label: 'Mobile Field Report', path: '/field-report', icon: FileEdit },
    { label: 'Shelters & Relief', path: '/shelters', icon: Home },
    { label: 'Resources & Assets', path: '/resources', icon: Truck },
    { label: 'Alerts & Warnings', path: '/alerts', icon: AlertTriangle },
    { label: 'Damage Assessment', path: '/damage-assessment', icon: ClipboardCheck },
    { label: 'Preparedness & Drills', path: '/training', icon: GraduationCap },
    { label: 'Analytics & SITREP', path: '/analytics', icon: BarChart3 },
    { label: 'Organizations Hub', path: '/organizations', icon: Building2 },
    ...(isAtLeast('District Admin') ? [
      { label: 'User Directory', path: '/admin/users', icon: Users },
      { label: 'Audit Trail', path: '/admin/audit-log', icon: ScrollText },
    ] : []),
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
      <div className="p-4 space-y-1">
        <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-3 pb-2">
          Operations Core
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) => `
                flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150
                ${isActive 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold' 
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80'}
              `}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="mt-auto p-4 border-t border-slate-800/80">
        <div className="p-3 rounded-lg bg-slate-850 border border-slate-800 text-[11px] text-slate-400">
          <p className="font-semibold text-slate-300">SEOC Control Desk</p>
          <p className="mt-0.5">Emergency Helpline: <span className="text-red-400 font-bold">1070 / 112</span></p>
        </div>
      </div>
    </aside>
  );
}
