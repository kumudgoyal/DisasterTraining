import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { SeverityBadge, StatusBadge } from '../components/common/Badge';
import {
  AlertTriangle,
  Radio,
  PlusCircle,
  BellRing,
  Clock,
  MapPin,
  XCircle,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

export default function AlertPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { isAtLeast } = useAuth();

  const [form, setForm] = useState({
    alert_type: 'flood_warning',
    severity: 'critical',
    title: '',
    message: '',
    affected_area: 'Rohtak, Jhajjar',
    latitude: 28.8955,
    longitude: 76.5796,
    radius_km: 25,
    issuing_authority: 'Haryana State Disaster Management Authority',
    expiry_hours: '24',
  });

  const fetchAlerts = () => {
    setLoading(true);
    api.get('/alerts')
      .then((res) => {
        if (res.success) setAlerts(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleCreateAlert = async (e) => {
    e.preventDefault();
    try {
      const now = new Date();
      const expiry = new Date(now.getTime() + parseInt(form.expiry_hours) * 3600000).toISOString();

      await api.post('/alerts', {
        ...form,
        radius_km: parseFloat(form.radius_km),
        start_time: now.toISOString(),
        expiry_time: expiry,
      });

      setShowCreateModal(false);
      fetchAlerts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelAlert = async (id) => {
    if (!confirm('Cancel and revoke this public alert?')) return;
    try {
      await api.put(`/alerts/${id}/cancel`);
      fetchAlerts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <Radio className="w-5 h-5 text-red-500 animate-pulse" />
            <span>Early Warning & Emergency Broadcast System</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Issue real-time multi-hazard bulletins, mandatory evacuation orders, and weather advisories to field teams and citizens.
          </p>
        </div>

        {isAtLeast('District Admin') && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Issue Emergency Alert</span>
          </button>
        )}
      </div>

      {/* Active Alerts Grid */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading active broadcasts...</div>
        ) : alerts.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">No active alerts issued.</div>
        ) : (
          alerts.map((al) => {
            const isCritical = al.severity === 'critical';
            return (
              <div
                key={al.id}
                className={`p-5 rounded-2xl border transition shadow-lg ${
                  isCritical 
                    ? 'bg-red-950/20 border-red-500/40' 
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-800/80">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2.5 rounded-xl ${isCritical ? 'bg-red-600/20 text-red-400' : 'bg-amber-600/20 text-amber-400'}`}>
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">
                          {al.alert_type?.replace('_', ' ')}
                        </span>
                        <SeverityBadge severity={al.severity} />
                        <StatusBadge status={al.status} />
                      </div>
                      <h3 className="text-base font-bold text-slate-100 mt-1">{al.title}</h3>
                    </div>
                  </div>

                  {isAtLeast('District Admin') && al.status === 'active' && (
                    <button
                      onClick={() => handleCancelAlert(al.id)}
                      className="px-2.5 py-1 rounded bg-slate-850 hover:bg-red-950/40 text-slate-400 hover:text-red-400 border border-slate-700/60 text-xs font-semibold self-start transition"
                    >
                      Revoke Alert
                    </button>
                  )}
                </div>

                <p className="text-xs text-slate-200 mt-3 font-medium leading-relaxed">{al.message}</p>

                <div className="mt-4 pt-3 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>Area: <strong className="text-slate-300">{al.affected_area}</strong> (Radius: {al.radius_km || 25} km)</span>
                    </span>
                    <span>•</span>
                    <span>Authority: <strong className="text-slate-300">{al.issuing_authority}</strong></span>
                  </div>

                  <div className="flex items-center space-x-1 text-slate-400">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>Issued: {new Date(al.start_time || al.created_at).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Issue Alert */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 my-8">
            <h3 className="text-base font-bold text-slate-100">Broadcast Emergency Alert</h3>
            <form onSubmit={handleCreateAlert} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Alert Type *</label>
                  <select
                    value={form.alert_type}
                    onChange={(e) => setForm({ ...form, alert_type: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg p-2 focus:outline-none"
                  >
                    <option value="flood_warning">Flood Warning</option>
                    <option value="heavy_rainfall">Heavy Rainfall Warning</option>
                    <option value="cyclone_warning">Cyclone Warning</option>
                    <option value="heatwave">Heatwave Alert</option>
                    <option value="landslide_warning">Landslide Warning</option>
                    <option value="evacuation_order">Mandatory Evacuation Order</option>
                    <option value="road_closure">Road / Highway Closure</option>
                    <option value="shelter_notification">Shelter Activation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Severity Urgency *</label>
                  <select
                    value={form.severity}
                    onChange={(e) => setForm({ ...form, severity: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg p-2 focus:outline-none font-semibold text-red-400"
                  >
                    <option value="critical">🔴 Critical (Life Threatening)</option>
                    <option value="high">🟠 High (Urgent Warning)</option>
                    <option value="moderate">🟡 Moderate (Watch / Advisory)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Alert Headline / Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Immediate Evacuation Advisory for Rohtak Lowlands"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg p-2 focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Broadcast Message *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Clear instructions to public: seek high ground, report to nearest shelter, avoid flooded highways..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg p-2 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Target Districts / Region</label>
                  <input
                    type="text"
                    value={form.affected_area}
                    onChange={(e) => setForm({ ...form, affected_area: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg p-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Broadcast Radius (km)</label>
                  <input
                    type="number"
                    value={form.radius_km}
                    onChange={(e) => setForm({ ...form, radius_km: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg p-2 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Issuing Authority</label>
                  <input
                    type="text"
                    value={form.issuing_authority}
                    onChange={(e) => setForm({ ...form, issuing_authority: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg p-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Valid Duration (Hours)</label>
                  <input
                    type="number"
                    value={form.expiry_hours}
                    onChange={(e) => setForm({ ...form, expiry_hours: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg p-2 focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold"
                >
                  Broadcast Alert Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
