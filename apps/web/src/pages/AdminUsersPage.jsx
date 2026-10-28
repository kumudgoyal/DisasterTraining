import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  Search,
  Filter,
  Shield,
  Building,
  CheckCircle,
  XCircle,
  RefreshCw,
  Edit2
} from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const { isAtLeast } = useAuth();

  const fetchUsers = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (roleFilter) params.append('role', roleFilter);
    if (search) params.append('search', search);

    api.get(`/admin/users?${params.toString()}`)
      .then((res) => {
        if (res?.success && res.data) {
          setUsers(Array.isArray(res.data) ? res.data : Array.isArray(res.data?.users) ? res.data.users : []);
          if (Array.isArray(res.data?.roles)) setRoles(res.data.roles);
          if (Array.isArray(res.data?.organizations)) setOrgs(res.data.organizations);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch users:', err);
        setUsers([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleRoleChange = async (userId, newRoleId) => {
    try {
      await api.put(`/admin/users/${userId}`, { role_id: parseInt(newRoleId) });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await api.put(`/admin/users/${userId}`, { is_active: !currentStatus });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-500" />
            <span>Role-Based Access Control & User Directory</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Authorize state personnel, assign field responder privileges, and manage agency affiliations.
          </p>
        </div>
      </div>

      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search responder name, email, district..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none"
          >
            <option value="">All Assigned Roles</option>
            {roles.map((r) => (
              <option key={r.id} value={r.name}>{r.name}</option>
            ))}
          </select>

          <button
            onClick={fetchUsers}
            disabled={loading}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-850 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Official / Responder</th>
                <th className="py-3.5 px-4">Assigned Role</th>
                <th className="py-3.5 px-4">Affiliated Agency</th>
                <th className="py-3.5 px-4">District / State</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4 text-right">Access Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">Loading user registry...</td>
                </tr>
              ) : !Array.isArray(users) || users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">No users found.</td>
                </tr>
              ) : (
                (users || []).map((u) => (
                  <tr key={u.id} className="hover:bg-slate-850/60 transition">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-100">{u.full_name}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{u.email}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      {isAtLeast('State Admin') ? (
                        <select
                          value={u.role_id}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded px-2 py-1 focus:outline-none"
                        >
                          {roles.map((r) => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="font-semibold text-blue-400">{u.role}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {u.organization_name || 'Civilian / General'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {u.district || 'Haryana'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        u.is_active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'
                      }`}>
                        {u.is_active ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {isAtLeast('State Admin') && (
                        <button
                          onClick={() => handleToggleStatus(u.id, u.is_active)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded transition ${
                            u.is_active 
                              ? 'text-red-400 hover:bg-red-500/10' 
                              : 'text-emerald-400 hover:bg-emerald-500/10'
                          }`}
                        >
                          {u.is_active ? 'Suspend' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
