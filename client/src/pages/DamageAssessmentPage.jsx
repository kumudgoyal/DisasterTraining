import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/common/Badge';
import {
  ClipboardCheck,
  Building,
  PlusCircle,
  Search,
  Filter,
  DollarSign,
  Users,
  CheckCircle,
  RefreshCw,
  MapPin,
  TrendingUp
} from 'lucide-react';

export default function DamageAssessmentPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [infraFilter, setInfraFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { isAtLeast } = useAuth();

  const [form, setForm] = useState({
    incident_id: '1',
    infrastructure_type: 'road',
    damage_level: 'major',
    location_name: '',
    district: 'Rohtak',
    affected_families: 100,
    estimated_loss: 5000000,
    description: '',
  });

  const fetchReports = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (infraFilter) params.append('infrastructure_type', infraFilter);
    if (statusFilter) params.append('status', statusFilter);

    api.get(`/damage-reports?${params.toString()}`)
      .then((res) => {
        if (res?.success) setReports(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error('Failed to fetch damage reports:', err);
        setReports([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReports();
  }, [infraFilter, statusFilter]);

  const handleCreateReport = async (e) => {
    e.preventDefault();
    try {
      await api.post('/damage-reports', {
        ...form,
        incident_id: parseInt(form.incident_id),
        affected_families: parseInt(form.affected_families) || 0,
        estimated_loss: parseFloat(form.estimated_loss) || 0,
      });
      setShowCreateModal(false);
      fetchReports();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/damage-reports/${id}/status`, { status });
      fetchReports();
    } catch (err) {
      console.error(err);
    }
  };

  const totalLoss = reports.reduce((sum, r) => sum + (r.estimated_loss || 0), 0);
  const totalFamilies = reports.reduce((sum, r) => sum + (r.affected_families || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2.5">
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <ClipboardCheck className="w-5 h-5" />
            </span>
            <span>Post-Disaster Damage & Needs Assessment</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1.5 font-medium">
            Rehabilitation pipeline: tracking structural destruction, displacement counts, and recovery fiscal projections.
          </p>
        </div>

        {isAtLeast('Volunteer') && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4 text-amber-400" />
            <span>Log Infrastructure Damage</span>
          </button>
        )}
      </div>

      {/* Aggregate Fiscal Impact Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-slate-200/90 rounded-3xl shadow-sm">
          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Total Estimated Loss</p>
          <p className="text-2xl font-black text-amber-600 mt-1">
            ₹{(totalLoss / 10000000).toFixed(2)} <span className="text-sm font-bold text-slate-500">Crores</span>
          </p>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">Across {reports.length} verified damage sites</p>
        </div>

        <div className="p-5 bg-white border border-slate-200/90 rounded-3xl shadow-sm">
          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Affected Families</p>
          <p className="text-2xl font-black text-rose-600 mt-1">{totalFamilies.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">Displaced / Shelter required</p>
        </div>

        <div className="p-5 bg-white border border-slate-200/90 rounded-3xl shadow-sm">
          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">In-Progress Repairs</p>
          <p className="text-2xl font-black text-blue-600 mt-1">
            {reports.filter((r) => r.status === 'in_progress').length}
          </p>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">Contractors / PWD active</p>
        </div>

        <div className="p-5 bg-white border border-slate-200/90 rounded-3xl shadow-sm">
          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Resolved / Restored</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            {reports.filter((r) => r.status === 'resolved').length}
          </p>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">Basic utility restored</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2 flex-wrap gap-2">
          <select
            value={infraFilter}
            onChange={(e) => setInfraFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 font-semibold rounded-xl px-3.5 py-2 text-xs focus:outline-none capitalize"
          >
            <option value="">All Infrastructure Types</option>
            <option value="road">Roads & Highways</option>
            <option value="bridge">Bridges</option>
            <option value="electricity">Power Grid / Electricity</option>
            <option value="water">Water Pipelines</option>
            <option value="residential">Residential Housing</option>
            <option value="commercial">Commercial / Industry</option>
            <option value="agricultural">Agricultural Crops</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 font-semibold rounded-xl px-3.5 py-2 text-xs focus:outline-none"
          >
            <option value="">All Recovery Stages</option>
            <option value="reported">Reported</option>
            <option value="verified">Verified</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>

          <button
            onClick={fetchReports}
            disabled={loading}
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-slate-900' : ''}`} />
          </button>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-5">Infrastructure Category</th>
                <th className="py-3.5 px-5">Damage Level</th>
                <th className="py-3.5 px-5">Location / Incident</th>
                <th className="py-3.5 px-5">Families Affected</th>
                <th className="py-3.5 px-5">Projected Loss (₹)</th>
                <th className="py-3.5 px-5">Status Pipeline</th>
                {isAtLeast('EOC Operator') && <th className="py-3.5 px-5 text-right">Workflow Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">Loading damage assessment entries...</td>
                </tr>
              ) : !Array.isArray(reports) || reports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">No damage reports recorded under this filter.</td>
                </tr>
              ) : (
                (reports || []).map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-5 font-bold text-slate-900 capitalize">
                      {r.infrastructure_type}
                    </td>
                    <td className="py-3.5 px-5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        r.damage_level === 'destroyed' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                        r.damage_level === 'major' ? 'bg-orange-50 text-orange-700 border border-orange-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {r.damage_level}
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <p className="font-semibold text-slate-900">{r.location_name || r.district}</p>
                      <p className="text-[11px] text-slate-500 font-mono">{r.incident_code || 'General'}</p>
                    </td>
                    <td className="py-3.5 px-5 font-medium text-slate-700">
                      {r.affected_families > 0 ? `${r.affected_families.toLocaleString()} families` : 'Infrastructure only'}
                    </td>
                    <td className="py-3.5 px-5 font-bold text-amber-700 font-mono">
                      ₹{(r.estimated_loss / 100000).toFixed(2)} Lakhs
                    </td>
                    <td className="py-3.5 px-5">
                      <StatusBadge status={r.status} />
                    </td>
                    {isAtLeast('EOC Operator') && (
                      <td className="py-3.5 px-5 text-right">
                        <select
                          value={r.status}
                          onChange={(e) => handleUpdateStatus(r.id, e.target.value)}
                          className="bg-slate-50 border border-slate-200 text-[11px] font-semibold text-slate-800 rounded-xl px-2.5 py-1.5 focus:outline-none"
                        >
                          <option value="reported">Reported</option>
                          <option value="verified">Verified</option>
                          <option value="assigned">Assigned</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Log Damage */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 space-y-4 my-8 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Log Infrastructure Damage Record</h3>
            <form onSubmit={handleCreateReport} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Infrastructure Type *</label>
                  <select
                    value={form.infrastructure_type}
                    onChange={(e) => setForm({ ...form, infrastructure_type: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-2.5 focus:outline-none capitalize"
                  >
                    <option value="road">Road / Highway</option>
                    <option value="bridge">Bridge</option>
                    <option value="school">School / College</option>
                    <option value="hospital">Hospital / Health Center</option>
                    <option value="electricity">Electrical Substation / Grid</option>
                    <option value="water">Water Pipelines</option>
                    <option value="residential">Residential Colony</option>
                    <option value="agricultural">Agricultural Farmland</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Destruction Severity *</label>
                  <select
                    value={form.damage_level}
                    onChange={(e) => setForm({ ...form, damage_level: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-2.5 focus:outline-none capitalize font-semibold"
                  >
                    <option value="destroyed">Completely Destroyed</option>
                    <option value="major">Major Structural Damage</option>
                    <option value="moderate">Moderate Damage</option>
                    <option value="minor">Minor Repairable</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Location / Specific Landmark *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Bridge over Yamuna Canal, Km 42"
                  value={form.location_name}
                  onChange={(e) => setForm({ ...form, location_name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-2.5 focus:outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Displaced / Affected Families</label>
                  <input
                    type="number"
                    min="0"
                    value={form.affected_families}
                    onChange={(e) => setForm({ ...form, affected_families: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-2.5 focus:outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Estimated Financial Loss (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="10000"
                    value={form.estimated_loss}
                    onChange={(e) => setForm({ ...form, estimated_loss: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-2.5 focus:outline-none font-bold text-amber-700 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Description of Damage</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe failure mechanism, foundation undermine, impassable vehicles..."
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-2.5 focus:outline-none leading-relaxed"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold transition shadow-sm"
                >
                  Save Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
