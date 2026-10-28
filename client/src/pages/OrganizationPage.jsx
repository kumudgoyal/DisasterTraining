import React, { useState, useEffect } from 'react';
import api from '../api/client';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Shield,
  Truck,
  Users,
  Search,
  Filter,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

export default function OrganizationPage() {
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const [search, setSearch] = useState('');

  const fetchOrgs = () => {
    setLoading(true);
    api.get('/organizations')
      .then((res) => {
        if (res.success) setOrgs(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrgs();
  }, []);

  const filteredOrgs = orgs.filter((org) => {
    if (typeFilter && org.type !== typeFilter) return false;
    if (search && !org.name.toLowerCase().includes(search.toLowerCase()) && !org.operating_region?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-blue-400" />
            <span>Response Agencies & NGO Coordination Directory</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Inter-agency operational directory: State authorities, NDRF battalions, humanitarian NGOs, and medical corps.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search agency name, region or specialization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none capitalize"
          >
            <option value="">All Organization Types</option>
            <option value="government">Government / SDMA / DDMA</option>
            <option value="military">NDRF / SDRF Military Units</option>
            <option value="ngo">Humanitarian NGOs</option>
            <option value="medical">Medical / Health Departments</option>
            <option value="fire">Fire & Rescue Services</option>
            <option value="police">Police Disaster Units</option>
          </select>

          <button
            onClick={fetchOrgs}
            disabled={loading}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full py-12 text-center text-xs text-slate-400">Loading organizations...</div>
        ) : filteredOrgs.length === 0 ? (
          <div className="col-span-full py-12 text-center text-xs text-slate-400">No organizations match filter.</div>
        ) : (
          filteredOrgs.map((org) => (
            <div
              key={org.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition shadow-lg flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 font-mono">
                    {org.type}
                  </span>
                  <span className="flex items-center space-x-1 text-[11px] text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Authorized</span>
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-100 mt-3">{org.name}</h3>
                <p className="text-xs text-slate-400 mt-1 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>{org.operating_region}</span>
                </p>

                <p className="text-xs text-slate-300 mt-2 line-clamp-2">
                  <strong className="text-slate-400">Specializations:</strong> {org.specializations || 'Disaster relief'}
                </p>

                <div className="grid grid-cols-2 gap-2 mt-4 p-2.5 rounded-lg bg-slate-850 border border-slate-800 text-center text-xs">
                  <div>
                    <p className="text-[10px] text-slate-400">Active Teams</p>
                    <p className="text-base font-bold text-blue-400">{org.teams_count}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">Committed Assets</p>
                    <p className="text-base font-bold text-indigo-400">{org.resources_count}</p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-1 text-[11px] text-slate-400">
                {org.contact_phone && (
                  <p className="flex items-center space-x-1.5 truncate">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>{org.contact_phone}</span>
                  </p>
                )}
                {org.contact_email && (
                  <p className="flex items-center space-x-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span>{org.contact_email}</span>
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
