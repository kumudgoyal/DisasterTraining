import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'blue', trend, badge }) {
  return (
    <div className="group relative bg-white rounded-3xl p-6 border border-ink-100/70 shadow-soft hover:shadow-float transition-all duration-300 flex flex-col justify-between min-h-[170px]">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold tracking-wider uppercase text-ink-400 font-mono">
          {title}
        </span>
        {badge && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cream-100 text-ink-700 border border-ink-100">
            {badge}
          </span>
        )}
      </div>

      {/* Hero Number (Reference 840 / 360 / 72° style) */}
      <div className="my-2">
        <div className="flex items-baseline space-x-2">
          <h3 className="text-4xl font-extrabold text-ink-900 tracking-tight">
            {value}
          </h3>
          {trend && (
            <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-warm-sageSoft text-warm-sage">
              {trend}
            </span>
          )}
        </div>
      </div>

      {/* Subtitle / Footer detail */}
      <div className="pt-2 border-t border-cream-100/80 flex items-center justify-between text-xs text-ink-400">
        <span className="truncate">{subtitle}</span>
        {Icon && (
          <Icon className="w-4 h-4 text-ink-300 group-hover:text-ink-600 transition-colors shrink-0 ml-2" />
        )}
      </div>
    </div>
  );
}
