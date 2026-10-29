import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { SeverityBadge, StatusBadge } from '../components/common/Badge';
import { DISASTER_ICONS } from '../utils/constants';
import {
  Flame,
  Search,
  Filter,
  PlusCircle,
  MapPin,
  Calendar,
  Users,
  HeartPulse,
  Eye,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function IncidentListPage() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const { isAtLeast } = useAuth();

  const fetchIncidents = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (severityFilter) params.append('severity', severityFilter);
    if (statusFilter) params.append('status', statusFilter);
    if (typeFilter) params.append('disaster_type_id', typeFilter);

    api.get(`/incidents?${params.toString()}`)
      .then((res) => {
        if (res?.success) {
          const list = Array.isArray(res.data)
            ? res.data
            : Array.isArray(res.data?.incidents)
            ? res.data.incidents
            : [];
          setIncidents(list);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch incidents:', err);
        setIncidents([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchIncidents();
  }, [severityFilter, statusFilter, typeFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchIncidents();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2.5">
            <span className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <Flame className="w-5 h-5" />
            </span>
            <span>Incident Registry & Emergency Tracking</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1.5 font-medium">
            Real-time multi-hazard log across all districts with severity categorization and response status.
          </p>
        </div>

        {isAtLeast('Volunteer') && (
          <Link
            to="/incidents/new"
            className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4 text-rose-400" />
            <span>Report New Incident</span>
          </Link>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search incident ID, title, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl pl-9 pr-3.5 py-2 text-xs focus:outline-none focus:border-slate-400 transition"
          />
        </form>

        <div className="flex items-center space-x-2 flex-wrap gap-2">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 font-semibold rounded-xl px-3.5 py-2 text-xs focus:outline-none"
          >
            <option value="">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="moderate">Moderate</option>
            <option value="low">Low</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 font-semibold rounded-xl px-3.5 py-2 text-xs focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="reported">Reported</option>
            <option value="verified">Verified</option>
            <option value="responding">Responding</option>
            <option value="contained">Contained</option>
            <option value="resolved">Resolved</option>
          </select>

          <button
            onClick={fetchIncidents}
            disabled={loading}
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-slate-900' : ''}`} />
          </button>
        </div>
      </div>

      {/* Incident Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full py-12 text-center text-xs text-slate-400 font-medium">Loading incident data...</div>
        ) : !Array.isArray(incidents) || incidents.length === 0 ? (
          <div className="col-span-full py-12 text-center text-xs text-slate-500 bg-white rounded-3xl border border-slate-200/80 p-8">
            No incidents match the filters.
          </div>
        ) : (
          (incidents || []).map((inc) => (
            <div
              key={inc.id}
              className="bg-white border border-slate-200/90 rounded-3xl p-5 hover:border-slate-300 hover:shadow-md transition shadow-sm flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-xl p-1.5 rounded-xl bg-slate-50 border border-slate-100">{inc.disaster_icon || DISASTER_ICONS[inc.disaster_type] || '⚠️'}</span>
                    <div>
                      <span className="font-mono text-xs font-bold text-slate-900">{inc.incident_id}</span>
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{inc.disaster_type}</p>
                    </div>
                  </div>
                  <SeverityBadge severity={inc.severity} />
                </div>

                <h3 className="font-bold text-sm text-slate-900 mt-3 line-clamp-1">{inc.title}</h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">{inc.description}</p>

                <div className="mt-4 space-y-2.5 text-xs text-slate-700">
                  <div className="flex items-center justify-between text-slate-500 text-[11px] font-medium">
                    <span className="flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold text-slate-700">{inc.location_name || 'Rohtak'}</span>
                    </span>
                    <span className="flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{new Date(inc.created_at).toLocaleDateString()}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 p-2.5 rounded-2xl bg-slate-50 border border-slate-200/60 text-center">
                    <div>
                      <p className="text-[10px] text-slate-500 font-semibold">Affected</p>
                      <p className="font-bold text-slate-900">{inc.estimated_affected?.toLocaleString() || 0}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-semibold">Evacuated</p>
                      <p className="font-bold text-emerald-600">{inc.evacuated?.toLocaleString() || 0}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-semibold">Casualties</p>
                      <p className="font-bold text-rose-600">{inc.casualties || 0}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <StatusBadge status={inc.status} />
                <Link
                  to={`/incidents/${inc.id}`}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-slate-50 hover:bg-slate-900 text-slate-700 hover:text-white border border-slate-200 text-xs font-semibold transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Console</span>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
