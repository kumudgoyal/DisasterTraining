import React, { useState, useEffect } from 'react';
import api from '../api/client';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  Layers,
  TrendingUp,
  FileText,
  Shield,
  Activity,
  DollarSign
} from 'lucide-react';

export default function AnalyticsPage() {
  const [incidentAnalytics, setIncidentAnalytics] = useState(null);
  const [responseAnalytics, setResponseAnalytics] = useState(null);
  const [impactAnalytics, setImpactAnalytics] = useState(null);
  const [sitrep, setSitrep] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get('/analytics/incidents'),
      api.get('/analytics/response'),
      api.get('/analytics/impact'),
      api.get('/reports/sitrep'),
    ])
      .then(([incRes, respRes, impRes, sitrepRes]) => {
        if (incRes.success) setIncidentAnalytics(incRes.data);
        if (respRes.success) setResponseAnalytics(respRes.data);
        if (impRes.success) setImpactAnalytics(impRes.data);
        if (sitrepRes.success) setSitrep(sitrepRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const SEVERITY_COLORS_CHART = {
    critical: '#ef4444',
    high: '#f97316',
    moderate: '#eab308',
    low: '#10b981',
  };

  const STATUS_COLORS_CHART = {
    available: '#10b981',
    deployed: '#ef4444',
    standby: '#f59e0b',
  };

  const printSitrep = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-xs text-slate-400">
        Compiling state-wide disaster intelligence analytics...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2.5">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <BarChart3 className="w-5 h-5" />
            </span>
            <span>Disaster Intelligence & SITREP Reporting</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1.5 font-medium">
            Aggregated metrics on response speed, cross-district casualty trends, logistical bottlenecks, and official SITREPs.
          </p>
        </div>

        <button
          onClick={printSitrep}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition self-start sm:self-auto"
        >
          <Printer className="w-4 h-4 text-blue-400" />
          <span>Export State SITREP</span>
        </button>
      </div>

      {/* Top 4 Impact Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-slate-200/90 rounded-3xl shadow-sm">
          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Evacuated to Safety</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            {sitrep?.overview?.total_evacuated?.toLocaleString() || 0}
          </p>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">Persons relocated</p>
        </div>

        <div className="p-5 bg-white border border-slate-200/90 rounded-3xl shadow-sm">
          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Active Alert Coverage</p>
          <p className="text-2xl font-black text-amber-600 mt-1">
            {sitrep?.overview?.active_alerts_count || 0}
          </p>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">High-priority warnings</p>
        </div>

        <div className="p-5 bg-white border border-slate-200/90 rounded-3xl shadow-sm">
          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Response Forces</p>
          <p className="text-2xl font-black text-blue-600 mt-1">
            {sitrep?.overview?.deployed_teams_count || 0}
          </p>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">Battalions engaged</p>
        </div>

        <div className="p-5 bg-white border border-slate-200/90 rounded-3xl shadow-sm">
          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Casualty Count</p>
          <p className="text-2xl font-black text-rose-600 mt-1">
            {sitrep?.overview?.total_casualties || 0}
          </p>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">{sitrep?.overview?.total_injured || 0} Injured in care</p>
        </div>
      </div>

      {/* Primary Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Incidents by Type */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Disaster Frequency by Hazard Type</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incidentAnalytics?.by_type || []} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="disaster_type" stroke="#94a3b8" fontSize={11} angle={-25} textAnchor="end" />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: 12, fontSize: 12, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#0f172a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Severity Breakdown */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Severity Distribution</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={incidentAnalytics?.by_severity || []}
                  dataKey="count"
                  nameKey="severity"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {(incidentAnalytics?.by_severity || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={SEVERITY_COLORS_CHART[entry.severity] || '#64748b'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: 12, fontSize: 12, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Infrastructure Damage Loss */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Economic Loss by Infrastructure Sector (in ₹ Crores)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={(impactAnalytics?.damage_by_infra || []).map((d) => ({
                  ...d,
                  lossCr: (d.loss / 10000000).toFixed(1),
                }))}
                margin={{ top: 10, right: 10, left: -10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="infrastructure_type" stroke="#94a3b8" fontSize={11} angle={-25} textAnchor="end" />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: 12, fontSize: 12, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="lossCr" name="Loss (₹ Cr)" fill="#d97706" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Strike Team Readiness */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Response Team Deployment Status</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={responseAnalytics?.teams_by_status || []}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {(responseAnalytics?.teams_by_status || []).map((entry, index) => (
                    <Cell key={`cell-tm-${index}`} fill={STATUS_COLORS_CHART[entry.status] || '#3b82f6'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: 12, fontSize: 12, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Official Situation Report (SITREP) Printable Section */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div>
            <span className="text-[10px] uppercase font-bold text-blue-600 font-mono tracking-wider">
              OFFICIAL SITUATION REPORT (SITREP-HARYANA-2026)
            </span>
            <h2 className="text-lg font-bold text-slate-900 mt-0.5">State Emergency Operations Bulletin</h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Generated: {new Date(sitrep?.generated_at).toLocaleString()}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2">
            <p className="font-bold text-slate-900 uppercase tracking-wider text-[11px] border-b border-slate-200/60 pb-1.5">
              Active Hazard Operations
            </p>
            {sitrep?.incidents?.slice(0, 4).map((inc) => (
              <div key={inc.id} className="flex justify-between py-1 font-medium">
                <span className="text-slate-800">{inc.incident_id}: {inc.title}</span>
                <span className="font-bold text-rose-600 uppercase text-[10px]">{inc.severity}</span>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2">
            <p className="font-bold text-slate-900 uppercase tracking-wider text-[11px] border-b border-slate-200/60 pb-1.5">
              Relief Shelters Status
            </p>
            {sitrep?.shelters?.slice(0, 4).map((sh) => (
              <div key={sh.id} className="flex justify-between py-1 font-medium">
                <span className="text-slate-800">{sh.name} ({sh.district})</span>
                <span className="font-bold text-emerald-600">{sh.current_occupancy}/{sh.capacity} ({sh.occupancy_rate}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
