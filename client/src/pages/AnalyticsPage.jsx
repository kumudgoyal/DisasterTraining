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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            <span>Disaster Intelligence & SITREP Reporting</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Aggregated metrics on response speed, cross-district casualty trends, logistical bottlenecks, and official SITREPs.
          </p>
        </div>

        <button
          onClick={printSitrep}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition self-start sm:self-auto"
        >
          <Printer className="w-4 h-4" />
          <span>Export State SITREP</span>
        </button>
      </div>

      {/* Top 4 Impact Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <p className="text-[10px] uppercase font-bold text-slate-400">Evacuated to Safety</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">
            {sitrep?.overview?.total_evacuated?.toLocaleString() || 0}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">Persons relocated</p>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <p className="text-[10px] uppercase font-bold text-slate-400">Active Alert Coverage</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">
            {sitrep?.overview?.active_alerts_count || 0}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">High-priority warnings</p>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <p className="text-[10px] uppercase font-bold text-slate-400">Response Forces</p>
          <p className="text-2xl font-bold text-blue-400 mt-1">
            {sitrep?.overview?.deployed_teams_count || 0}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">Battalions engaged</p>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <p className="text-[10px] uppercase font-bold text-slate-400">Casualty Count</p>
          <p className="text-2xl font-bold text-red-400 mt-1">
            {sitrep?.overview?.total_casualties || 0}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">{sitrep?.overview?.total_injured || 0} Injured in care</p>
        </div>
      </div>

      {/* Primary Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Incidents by Type */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-slate-100">Disaster Frequency by Hazard Type</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incidentAnalytics?.by_type || []} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="disaster_type" stroke="#64748b" fontSize={11} angle={-25} textAnchor="end" />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Severity Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-slate-100">Severity Distribution</h3>
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
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: 8, fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Infrastructure Damage Loss */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-slate-100">Economic Loss by Infrastructure Sector (in ₹ Crores)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={(impactAnalytics?.damage_by_infra || []).map((d) => ({
                  ...d,
                  lossCr: (d.loss / 10000000).toFixed(1),
                }))}
                margin={{ top: 10, right: 10, left: -10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="infrastructure_type" stroke="#64748b" fontSize={11} angle={-25} textAnchor="end" />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="lossCr" name="Loss (₹ Cr)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Strike Team Readiness */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-slate-100">Response Team Deployment Status</h3>
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
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: 8, fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Official Situation Report (SITREP) Printable Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <span className="text-[10px] uppercase font-bold text-blue-400 font-mono tracking-wider">
              OFFICIAL SITUATION REPORT (SITREP-HARYANA-2026)
            </span>
            <h2 className="text-lg font-bold text-slate-100 mt-0.5">State Emergency Operations Bulletin</h2>
          </div>
          <span className="text-xs text-slate-400">
            Generated: {new Date(sitrep?.generated_at).toLocaleString()}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 space-y-2">
            <p className="font-bold text-slate-200 uppercase tracking-wider text-[11px] border-b border-slate-800 pb-1">
              Active Hazard Operations
            </p>
            {sitrep?.incidents?.slice(0, 4).map((inc) => (
              <div key={inc.id} className="flex justify-between py-1">
                <span>{inc.incident_id}: {inc.title}</span>
                <span className="font-bold text-red-400">{inc.severity}</span>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 space-y-2">
            <p className="font-bold text-slate-200 uppercase tracking-wider text-[11px] border-b border-slate-800 pb-1">
              Relief Shelters Status
            </p>
            {sitrep?.shelters?.slice(0, 4).map((sh) => (
              <div key={sh.id} className="flex justify-between py-1">
                <span>{sh.name} ({sh.district})</span>
                <span className="font-bold text-emerald-400">{sh.current_occupancy}/{sh.capacity} ({sh.occupancy_rate}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
