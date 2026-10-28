import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import StatCard from '../components/common/StatCard';
import { SeverityBadge, StatusBadge } from '../components/common/Badge';
import { DISASTER_ICONS } from '../utils/constants';
import {
  Flame,
  AlertTriangle,
  Users,
  ShieldCheck,
  Truck,
  Home,
  HeartPulse,
  Activity,
  PlusCircle,
  Radio,
  MapPin,
  ArrowRight,
  RefreshCw,
  BellRing
} from 'lucide-react';

export default function DashboardPage() {
  const { liveEvents } = useSocket();
  const { user, isAtLeast } = useAuth();

  const [kpis, setKpis] = useState(null);
  const [feed, setFeed] = useState([]);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [recentIncidents, setRecentIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = () => {
    setLoading(true);
    Promise.all([
      api.get('/dashboard/kpis'),
      api.get('/dashboard/activity-feed'),
      api.get('/alerts/active'),
      api.get('/incidents?limit=6'),
    ])
      .then(([kpiRes, feedRes, alertRes, incidentRes]) => {
        if (kpiRes.success) setKpis(kpiRes.data);
        if (feedRes.success) setFeed(feedRes.data);
        if (alertRes.success) setActiveAlerts(alertRes.data);
        if (incidentRes.success) setRecentIncidents(incidentRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Auto-refresh when socket events arrive
  useEffect(() => {
    if (liveEvents.length > 0) {
      // Refresh KPIs softly
      api.get('/dashboard/kpis').then((res) => res.success && setKpis(res.data));
    }
  }, [liveEvents]);

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
            <h1 className="text-xl font-bold text-slate-100 tracking-tight">State Emergency Operations Center (SEOC)</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time unified operational picture across preparedness, emergency response, and recovery.
          </p>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title="Refresh KPIs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {isAtLeast('Volunteer') && (
            <Link
              to="/incidents/new"
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Incident</span>
            </Link>
          )}

          {isAtLeast('District Admin') && (
            <Link
              to="/alerts"
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-600/30 transition"
            >
              <BellRing className="w-4 h-4" />
              <span>Broadcast Alert</span>
            </Link>
          )}
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Active Disasters"
          value={kpis?.active_incidents ?? '...'}
          subtitle={`${kpis?.critical_incidents ?? 0} High / Critical hazards`}
          icon={Flame}
          color="red"
          badge="Live Response"
        />
        <StatCard
          title="Population Affected"
          value={kpis?.total_affected ? kpis.total_affected.toLocaleString() : '0'}
          subtitle={`${kpis?.total_evacuated ? kpis.total_evacuated.toLocaleString() : '0'} Evacuated`}
          icon={Users}
          color="orange"
        />
        <StatCard
          title="Deployed Teams"
          value={kpis?.active_response_teams ?? '...'}
          subtitle={`${kpis?.total_response_teams ?? 0} Total strike forces`}
          icon={ShieldCheck}
          color="emerald"
          badge="NDRF/SDRF"
        />
        <StatCard
          title="Shelter Occupancy"
          value={`${kpis?.shelter_occupancy_pct ?? 0}%`}
          subtitle={`${kpis?.shelter_occupancy?.toLocaleString() ?? 0} / ${kpis?.shelter_capacity?.toLocaleString() ?? 0} Capacity`}
          icon={Home}
          color={kpis?.shelter_occupancy_pct > 80 ? 'amber' : 'blue'}
        />
      </div>

      {/* Secondary KPI Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Casualties / Injured</p>
            <p className="text-lg font-bold text-red-400 mt-0.5">
              {kpis?.total_casualties ?? 0} <span className="text-xs text-slate-400 font-normal">/ {kpis?.total_injured ?? 0}</span>
            </p>
          </div>
          <HeartPulse className="w-5 h-5 text-red-500/80" />
        </div>

        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Available Assets</p>
            <p className="text-lg font-bold text-blue-400 mt-0.5">
              {kpis?.available_resources?.toLocaleString() ?? 0}
            </p>
          </div>
          <Truck className="w-5 h-5 text-blue-500/80" />
        </div>

        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Pending Requests</p>
            <p className="text-lg font-bold text-amber-400 mt-0.5">{kpis?.pending_requests ?? 0}</p>
          </div>
          <AlertTriangle className="w-5 h-5 text-amber-500/80" />
        </div>

        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Preparedness Drill Reach</p>
            <p className="text-lg font-bold text-purple-400 mt-0.5">
              {kpis?.trained_people ? kpis.trained_people.toLocaleString() : '0'}
            </p>
          </div>
          <Activity className="w-5 h-5 text-purple-500/80" />
        </div>
      </div>

      {/* Main Grid: Live Incidents & Interactive GIS Preview + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Active Emergencies Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Flame className="w-4 h-4 text-red-400" />
                <h3 className="font-bold text-slate-100 text-sm">Active Disaster Incidents</h3>
              </div>
              <Link to="/incidents" className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center space-x-1">
                <span>All Incidents</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-800 mt-2">
              {recentIncidents.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No active disaster incidents reported.</p>
              ) : (
                recentIncidents.map((inc) => (
                  <Link
                    key={inc.id}
                    to={`/incidents/${inc.id}`}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-850 px-2 rounded-lg transition gap-2 group"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="text-xl pt-0.5">{inc.disaster_icon || DISASTER_ICONS[inc.disaster_type] || '⚠️'}</div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-bold text-blue-400">{inc.incident_id}</span>
                          <h4 className="text-xs font-bold text-slate-200 group-hover:text-blue-400 transition">{inc.title}</h4>
                        </div>
                        <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-1">
                          <span className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3 text-slate-500" />
                            <span>{inc.location_name || 'Haryana'}</span>
                          </span>
                          <span>•</span>
                          <span>{inc.estimated_affected ? `${inc.estimated_affected.toLocaleString()} affected` : 'Assessing'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0 sm:self-center">
                      <SeverityBadge severity={inc.severity} />
                      <StatusBadge status={inc.status} />
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Quick GIS Map Teaser */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-slate-100 text-sm">Interactive GIS Operations Map</h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Visualise active incidents, shelter capacities, mobile rescue units, and evacuation zones in high-precision Leaflet GIS.
              </p>
            </div>
            <Link
              to="/map"
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition text-center shrink-0"
            >
              Launch GIS Operations View
            </Link>
          </div>
        </div>

        {/* Right Column (1 span): Live Activity Feed */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col h-full max-h-[600px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-blue-400" />
                <h3 className="font-bold text-slate-100 text-sm">Live EOC Activity Feed</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                REAL-TIME
              </span>
            </div>

            <div className="overflow-y-auto space-y-3 mt-3 pr-1 divide-y divide-slate-800/60">
              {feed.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No recent activity logged.</p>
              ) : (
                feed.map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-semibold text-slate-300">{item.title}</span>
                      <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-xs text-slate-200 mt-1 font-medium">{item.description}</p>
                    <div className="flex items-center space-x-2 mt-1.5 text-[10px] text-slate-500">
                      <span>By {item.author}</span>
                      {item.severity && (
                        <>
                          <span>•</span>
                          <span className={`capitalize font-semibold ${
                            item.severity === 'critical' ? 'text-red-400' :
                            item.severity === 'high' ? 'text-orange-400' : 'text-slate-400'
                          }`}>
                            {item.severity}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
