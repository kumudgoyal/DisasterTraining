import React from 'react';

export function SeverityBadge({ severity }) {
  const s = severity?.toLowerCase() || 'moderate';

  const styles = {
    critical: 'bg-rose-50 text-rose-700 border-rose-200/60 dot-rose',
    high: 'bg-amber-50 text-amber-700 border-amber-200/60 dot-amber',
    moderate: 'bg-amber-50/70 text-amber-800 border-amber-200/40 dot-yellow',
    low: 'bg-emerald-50 text-emerald-700 border-emerald-200/60 dot-emerald',
  };

  const dots = {
    critical: 'bg-rose-500',
    high: 'bg-amber-500',
    moderate: 'bg-amber-400',
    low: 'bg-emerald-500',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${styles[s] || styles.moderate}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dots[s] || 'bg-amber-400'} ${s === 'critical' ? 'animate-pulse' : ''}`} />
      <span className="capitalize">{severity}</span>
    </span>
  );
}

export function StatusBadge({ status }) {
  const s = status?.toLowerCase() || 'reported';

  const statusStyles = {
    active: 'bg-rose-50 text-rose-700 border-rose-200/60',
    responding: 'bg-amber-50 text-amber-700 border-amber-200/60',
    contained: 'bg-blue-50 text-blue-700 border-blue-200/60',
    resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    monitoring: 'bg-slate-100 text-slate-700 border-slate-200',
    reported: 'bg-warm-ochreSoft text-amber-800 border-amber-200/60',
    verified: 'bg-sky-50 text-blue-700 border-blue-200/60',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border capitalize ${statusStyles[s] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
      {status?.replace('_', ' ')}
    </span>
  );
}
