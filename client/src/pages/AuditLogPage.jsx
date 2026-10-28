import React, { useState, useEffect } from 'react';
import api from '../api/client';
import {
  ScrollText,
  Search,
  Filter,
  Shield,
  Clock,
  User,
  RefreshCw
} from 'lucide-react';

export default function AuditLogPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('');

  const fetchLogs = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (actionFilter) params.append('action', actionFilter);

    api.get(`/admin/audit-logs?${params.toString()}`)
      .then((res) => {
        if (res.success) setLogs(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogs();
  }, [actionFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <ScrollText className="w-5 h-5 text-indigo-400" />
            <span>Immutable Security Audit Log</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete provenance trail recording who modified operational status, deployed strike teams, or issued public alerts.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          disabled={loading}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-850 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Action Event</th>
                <th className="py-3.5 px-4">Actor / Official</th>
                <th className="py-3.5 px-4">Target Entity</th>
                <th className="py-3.5 px-4">Transaction Details</th>
                <th className="py-3.5 px-4">IP Address</th>
                <th className="py-3.5 px-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 font-sans">Loading audit trail...</td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 font-sans">No audit events recorded.</td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-850/60 transition">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-blue-400 uppercase text-[11px] font-sans">
                        {log.action?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-sans text-slate-200 font-semibold">
                      {log.user_name || 'System / Automated'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {log.entity_type} #{log.entity_id || '-'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-sans text-xs">
                      {log.details}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      {log.ip_address || '127.0.0.1'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {new Date(log.created_at).toLocaleString()}
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
