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
        if (res.success) setIncidents(res.data);
      })
      .catch(console.error)
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <Flame className="w-5 h-5 text-red-500" />
            <span>Incident Registry & Emergency Tracking</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multi-hazard log across all districts with severity categorization and response status.
          </p>
        </div>

        {isAtLeast('Volunteer') && (
          <Link
            to="/incidents/new"
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report New Incident</span>
          </Link>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search incident ID, title, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-blue-500"
          />
        </form>

        <div className="flex items-center space-x-2 flex-wrap gap-2">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none"
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
            className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none"
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
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Incident Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full py-12 text-center text-xs text-slate-400">Loading incident data...</div>
        ) : incidents.length === 0 ? (
          <div className="col-span-full py-12 text-center text-xs text-slate-400">No incidents match the filters.</div>
        ) : (
          incidents.map((inc) => (
            <div
              key={inc.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition shadow-lg flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{inc.disaster_icon || DISASTER_ICONS[inc.disaster_type] || '⚠️'}</span>
                    <div>
                      <span className="font-mono text-xs font-bold text-blue-400">{inc.incident_id}</span>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">{inc.disaster_type}</p>
                    </div>
                  </div>
                  <SeverityBadge severity={inc.severity} />
                </div>

                <h3 className="font-bold text-sm text-slate-100 mt-3 line-clamp-1">{inc.title}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{inc.description}</p>

                <div className="mt-4 space-y-2 text-xs text-slate-300">
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{inc.location_name || 'Rohtak'}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{new Date(inc.created_at).toLocaleDateString()}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 p-2 rounded-lg bg-slate-800/60 border border-slate-800 text-center">
                    <div>
                      <p className="text-[10px] text-slate-400">Affected</p>
                      <p className="font-bold text-slate-200">{inc.estimated_affected?.toLocaleString() || 0}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400">Evacuated</p>
                      <p className="font-bold text-emerald-400">{inc.evacuated?.toLocaleString() || 0}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400">Casualties</p>
                      <p className="font-bold text-red-400">{inc.casualties || 0}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <StatusBadge status={inc.status} />
                <Link
                  to={`/incidents/${inc.id}`}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-semibold transition"
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
