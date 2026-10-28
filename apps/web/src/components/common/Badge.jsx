import React from 'react';
import { SEVERITY_COLORS, STATUS_COLORS } from '../../utils/constants';

export function SeverityBadge({ severity }) {
  const s = severity?.toLowerCase() || 'moderate';
  const cfg = SEVERITY_COLORS[s] || SEVERITY_COLORS.moderate;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border ${cfg.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${s === 'critical' ? 'bg-red-400 animate-pulse' : 'bg-current'}`} />
      {severity}
    </span>
  );
}

export function StatusBadge({ status }) {
  const s = status?.toLowerCase() || 'reported';
  const colorClass = STATUS_COLORS[s] || 'bg-slate-700 text-slate-300 border-slate-600';

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border capitalize ${colorClass}`}>
      {status?.replace('_', ' ')}
    </span>
  );
}
