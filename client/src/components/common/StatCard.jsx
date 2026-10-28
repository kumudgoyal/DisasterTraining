import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'blue', trend, badge }) {
  const colorMap = {
    blue: 'border-blue-500/20 bg-gradient-to-br from-blue-950/40 to-slate-900 text-blue-400',
    red: 'border-red-500/20 bg-gradient-to-br from-red-950/40 to-slate-900 text-red-400',
    orange: 'border-orange-500/20 bg-gradient-to-br from-orange-950/40 to-slate-900 text-orange-400',
    amber: 'border-amber-500/20 bg-gradient-to-br from-amber-950/40 to-slate-900 text-amber-400',
    emerald: 'border-emerald-500/20 bg-gradient-to-br from-emerald-950/40 to-slate-900 text-emerald-400',
    purple: 'border-purple-500/20 bg-gradient-to-br from-purple-950/40 to-slate-900 text-purple-400',
  };

  return (
    <div className={`p-4 rounded-xl border backdrop-blur-md transition-all duration-200 hover:border-slate-600/60 shadow-lg ${colorMap[color] || colorMap.blue}`}>
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wider font-semibold text-slate-400">{title}</p>
        {Icon && (
          <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/50">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="mt-2 flex items-baseline justify-between">
        <h3 className="text-2xl font-bold text-slate-100 tracking-tight">{value}</h3>
        {badge && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            {badge}
          </span>
        )}
      </div>
      {(subtitle || trend) && (
        <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
          <span>{subtitle}</span>
          {trend && <span className="font-medium text-emerald-400">{trend}</span>}
        </div>
      )}
    </div>
  );
}
