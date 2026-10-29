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
import LiveGpsMapWidget from '../components/map/LiveGpsMapWidget';

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
      api.get('/dashboard/kpis').catch(() => ({ success: false })),
      api.get('/dashboard/activity-feed').catch(() => ({ success: false })),
      api.get('/alerts/active').catch(() => ({ success: false })),
      api.get('/incidents?limit=6').catch(() => ({ success: false })),
    ])
      .then(([kpiRes, feedRes, alertRes, incidentRes]) => {
        if (kpiRes?.success && kpiRes.data) setKpis(kpiRes.data);
        if (feedRes?.success) {
          setFeed(Array.isArray(feedRes.data) ? feedRes.data : []);
        }
        if (alertRes?.success) {
          setActiveAlerts(Array.isArray(alertRes.data) ? alertRes.data : []);
        }
        if (incidentRes?.success) {
          const incs = Array.isArray(incidentRes.data)
            ? incidentRes.data
            : Array.isArray(incidentRes.data?.incidents)
            ? incidentRes.data.incidents
            : [];
          setRecentIncidents(incs);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch dashboard data:', err);
      })
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

  // Format live current time for header like reference "8:40 pm"
  const currentTimeStr = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).toLowerCase();

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Welcome & Tactical Status Bar (matching reference 8:40pm Good evening layout) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-cream-200/80">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-ink-900 tracking-tight">
              {currentTimeStr}
            </h1>
            <span className="w-2.5 h-2.5 rounded-full bg-warm-accent animate-ping" />
          </div>
          <p className="text-base text-ink-600 mt-1.5 font-medium">
            Good day, <strong className="text-ink-900 font-bold">{user?.full_name || 'Emergency Controller'}</strong>
          </p>
          <div className="flex items-center space-x-2 mt-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-semibold text-emerald-700 tracking-wide">
              {kpis?.active_incidents ? `${kpis.active_incidents} incidents in active response` : 'All sectors secure'}
            </span>
          </div>
        </div>

        {/* Action Pills */}
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="p-3 rounded-full bg-white hover:bg-cream-100 text-ink-600 border border-ink-100 shadow-pill transition"
            title="Refresh KPIs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {isAtLeast('Volunteer') && (
            <Link
              to="/incidents/new"
              className="flex items-center space-x-2 px-5 py-3 rounded-full bg-ink-900 hover:bg-ink-800 text-white font-bold text-xs shadow-pill transition"
            >
              <PlusCircle className="w-4 h-4 text-cream-100" />
              <span>Report Incident</span>
            </Link>
          )}

          {isAtLeast('District Admin') && (
            <Link
              to="/alerts"
              className="flex items-center space-x-2 px-5 py-3 rounded-full bg-white hover:bg-cream-100 text-ink-900 border border-ink-100 font-bold text-xs shadow-pill transition"
            >
              <BellRing className="w-4 h-4 text-warm-accent" />
              <span>Broadcast Alert</span>
            </Link>
          )}
        </div>
      </div>

      {/* Primary KPI Grid (Reference style 840 / 360 card layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Active Disasters"
          value={kpis?.active_incidents ?? '0'}
          subtitle={`${kpis?.critical_incidents ?? 0} Critical / High hazards`}
          icon={Flame}
          trend={kpis?.critical_incidents > 0 ? 'High' : 'Normal'}
          badge="Live Response"
        />
        <StatCard
          title="Population Affected"
          value={kpis?.total_affected ? kpis.total_affected.toLocaleString() : '0'}
          subtitle={`${kpis?.total_evacuated ? kpis.total_evacuated.toLocaleString() : '0'} Evacuated`}
          icon={Users}
          trend="+5%"
        />
        <StatCard
          title="Deployed Teams"
          value={kpis?.active_response_teams ?? '0'}
          subtitle={`${kpis?.total_response_teams ?? 0} Total strike forces`}
          icon={ShieldCheck}
          badge="NDRF / SDRF"
        />
        <StatCard
          title="Shelter Occupancy"
          value={`${kpis?.shelter_occupancy_pct ?? 0}%`}
          subtitle={`${kpis?.shelter_occupancy?.toLocaleString() ?? 0} / ${kpis?.shelter_capacity?.toLocaleString() ?? 0} Capacity`}
          icon={Home}
          trend={kpis?.shelter_occupancy_pct > 80 ? 'Heavy' : 'Available'}
        />
      </div>

      {/* Secondary KPI Bar (Warm Minimalist Pills) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-ink-100/80 rounded-2xl shadow-soft flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold text-ink-400 font-mono tracking-wider">Casualties / Injured</p>
            <p className="text-xl font-extrabold text-ink-900 mt-0.5">
              {kpis?.total_casualties ?? 0} <span className="text-xs text-ink-400 font-normal">/ {kpis?.total_injured ?? 0}</span>
            </p>
          </div>
          <HeartPulse className="w-5 h-5 text-rose-500" />
        </div>

        <div className="p-4 bg-white border border-ink-100/80 rounded-2xl shadow-soft flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold text-ink-400 font-mono tracking-wider">Available Assets</p>
            <p className="text-xl font-extrabold text-ink-900 mt-0.5">
              {kpis?.available_resources?.toLocaleString() ?? 0}
            </p>
          </div>
          <Truck className="w-5 h-5 text-ink-600" />
        </div>

        <div className="p-4 bg-white border border-ink-100/80 rounded-2xl shadow-soft flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold text-ink-400 font-mono tracking-wider">Pending Requests</p>
            <p className="text-xl font-extrabold text-ink-900 mt-0.5">{kpis?.pending_requests ?? 0}</p>
          </div>
          <AlertTriangle className="w-5 h-5 text-warm-ochre" />
        </div>

        <div className="p-4 bg-white border border-ink-100/80 rounded-2xl shadow-soft flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold text-ink-400 font-mono tracking-wider">Drill Reach</p>
            <p className="text-xl font-extrabold text-ink-900 mt-0.5">
              {kpis?.trained_people ? kpis.trained_people.toLocaleString() : '0'}
            </p>
          </div>
          <Activity className="w-5 h-5 text-indigo-600" />
        </div>
      </div>

      {/* Main Grid: Active Incidents List & GPS Map + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 spans): Active Emergencies & Live Map */}
        <div className="lg:col-span-2 space-y-8">
          {/* Active Incidents Card */}
          <div className="bg-white rounded-3xl border border-ink-100/80 p-6 shadow-soft">
            <div className="flex items-center justify-between pb-4 border-b border-cream-100">
              <div className="flex items-center space-x-2.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <h3 className="font-bold text-ink-900 text-sm">Active Disaster Incidents</h3>
              </div>
              <Link to="/incidents" className="text-xs font-semibold text-ink-600 hover:text-ink-900 flex items-center space-x-1">
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-cream-100 mt-2">
              {!Array.isArray(recentIncidents) || recentIncidents.length === 0 ? (
                <p className="text-xs text-ink-400 py-8 text-center">No active disaster incidents reported.</p>
              ) : (
                (recentIncidents || []).map((inc) => (
                  <Link
                    key={inc.id}
                    to={`/incidents/${inc.id}`}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-cream-50/60 px-3 rounded-2xl transition gap-3 group"
                  >
                    <div className="flex items-start space-x-3.5">
                      <div className="text-2xl pt-0.5">{inc.disaster_icon || DISASTER_ICONS[inc.disaster_type] || '⚠️'}</div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-bold text-ink-400">{inc.incident_id}</span>
                          <h4 className="text-xs font-bold text-ink-900 group-hover:text-warm-accent transition">{inc.title}</h4>
                        </div>
                        <div className="flex items-center space-x-3 text-[11px] text-ink-400 mt-1">
                          <span className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3 text-ink-300" />
                            <span>{inc.location_name || 'Sector HQ'}</span>
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

          {/* Real Live GPS Operations Map Section */}
          <LiveGpsMapWidget className="h-96" />
        </div>

        {/* Right Column (1 span): Live Activity Feed Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-ink-100/80 p-6 shadow-soft flex flex-col h-full max-h-[640px]">
            <div className="flex items-center justify-between pb-4 border-b border-cream-100 shrink-0">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <h3 className="font-bold text-ink-900 text-sm">Live EOC Feed</h3>
              </div>
              <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-cream-100 text-ink-600 border border-ink-100">
                REAL-TIME
              </span>
            </div>

            <div className="overflow-y-auto space-y-3 mt-3 pr-1 divide-y divide-cream-100">
              {!Array.isArray(feed) || feed.length === 0 ? (
                <p className="text-xs text-ink-400 py-8 text-center">No recent activity logged.</p>
              ) : (
                (feed || []).map((item) => (
                  <div key={item.id} className="pt-3.5 first:pt-0">
                    <div className="flex items-center justify-between text-[11px] text-ink-400">
                      <span className="font-semibold text-ink-800">{item.title}</span>
                      <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-xs text-ink-700 mt-1 font-medium">{item.description}</p>
                    <div className="flex items-center space-x-2 mt-2 text-[10px] text-ink-400">
                      <span>By {item.author}</span>
                      {item.severity && (
                        <>
                          <span>•</span>
                          <span className={`capitalize font-bold ${
                            item.severity === 'critical' ? 'text-rose-600' :
                            item.severity === 'high' ? 'text-amber-600' : 'text-ink-500'
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
