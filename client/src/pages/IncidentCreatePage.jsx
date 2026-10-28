import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import {
  Flame,
  MapPin,
  Compass,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Users,
  HeartPulse
} from 'lucide-react';

export default function IncidentCreatePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [gpsLoading, setGpsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    disaster_type_id: '1', // Flood default
    severity: 'critical',
    location_name: '',
    affected_districts: 'Rohtak',
    state: 'Haryana',
    latitude: '28.8955',
    longitude: '76.5796',
    estimated_affected: '1000',
    evacuated: '200',
    casualties: '0',
    injured: '5',
    missing_persons: '0',
    description: '',
  });

  const captureGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported by this browser.');
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData((prev) => ({
          ...prev,
          latitude: pos.coords.latitude.toFixed(5),
          longitude: pos.coords.longitude.toFixed(5),
        }));
        setGpsLoading(false);
      },
      (err) => {
        console.warn('GPS capture failed, using default coords:', err);
        setGpsLoading(false);
        alert('Could not capture GPS. Please enter coordinates manually.');
      },
      { timeout: 8000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...formData,
        disaster_type_id: parseInt(formData.disaster_type_id),
        latitude: parseFloat(formData.latitude) || null,
        longitude: parseFloat(formData.longitude) || null,
        estimated_affected: parseInt(formData.estimated_affected) || 0,
        evacuated: parseInt(formData.evacuated) || 0,
        casualties: parseInt(formData.casualties) || 0,
        injured: parseInt(formData.injured) || 0,
        missing_persons: parseInt(formData.missing_persons) || 0,
      };

      const res = await api.post('/incidents', payload);
      if (res.success) {
        navigate(`/incidents/${res.data.id}`);
      }
    } catch (err) {
      setError(err.error || err.message || 'Failed to submit incident');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => navigate('/incidents')}
        className="flex items-center space-x-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Registry</span>
      </button>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center space-x-3 pb-6 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100">Log New Emergency Incident</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Submit disaster details to trigger real-time EOC notifications, GIS visualization, and resource dispatch.
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Disaster Type & Severity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Disaster Hazard Category *
              </label>
              <select
                value={formData.disaster_type_id}
                onChange={(e) => setFormData({ ...formData, disaster_type_id: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="1">🌊 Flood</option>
                <option value="2">🏚️ Earthquake</option>
                <option value="3">🌀 Cyclone</option>
                <option value="4">⛰️ Landslide</option>
                <option value="5">🔥 Fire</option>
                <option value="6">🌡️ Heatwave</option>
                <option value="7">⛈️ Cloudburst</option>
                <option value="8">🏭 Industrial Accident</option>
                <option value="9">🏗️ Building Collapse</option>
                <option value="10">🦠 Epidemic</option>
                <option value="11">🚗 Road/Transport</option>
                <option value="12">⚠️ Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Severity Level *
              </label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg p-2.5 text-sm focus:outline-none focus:border-red-500 font-semibold"
              >
                <option value="critical">🔴 Critical — Life Threatening / Major Loss</option>
                <option value="high">🟠 High — Severe Impact / Evacuation Needed</option>
                <option value="moderate">🟡 Moderate — Localized Impact</option>
                <option value="low">🟢 Low — Advisory / Monitoring</option>
              </select>
            </div>
          </div>

          {/* Title & Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Incident Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Severe Flash Flood in Northern Sector"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Detailed Description & Current Status
            </label>
            <textarea
              rows={3}
              placeholder="Describe situation on ground, water level, trapped persons, road conditions..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Location & GPS */}
          <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>Geographic Location</span>
              </span>
              <button
                type="button"
                onClick={captureGPS}
                disabled={gpsLoading}
                className="flex items-center space-x-1 text-xs text-blue-400 hover:text-blue-300 font-semibold bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/30"
              >
                <Compass className={`w-3.5 h-3.5 ${gpsLoading ? 'animate-spin' : ''}`} />
                <span>{gpsLoading ? 'Capturing GPS...' : 'Auto-Capture Device GPS'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Location / Landmark Name</label>
                <input
                  type="text"
                  placeholder="e.g., Asthal Bohar, NH-9 Bypass"
                  value={formData.location_name}
                  onChange={(e) => setFormData({ ...formData, location_name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg p-2 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Affected District(s)</label>
                <input
                  type="text"
                  placeholder="e.g., Rohtak, Jhajjar"
                  value={formData.affected_districts}
                  onChange={(e) => setFormData({ ...formData, affected_districts: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg p-2 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Latitude</label>
                <input
                  type="text"
                  placeholder="28.8955"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg p-2 text-xs focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Longitude</label>
                <input
                  type="text"
                  placeholder="76.5796"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg p-2 text-xs focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Impact Estimates */}
          <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>Initial Impact Assessment</span>
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Estimated Affected</label>
                <input
                  type="number"
                  value={formData.estimated_affected}
                  onChange={(e) => setFormData({ ...formData, estimated_affected: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg p-2 text-xs focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Evacuated</label>
                <input
                  type="number"
                  value={formData.evacuated}
                  onChange={(e) => setFormData({ ...formData, evacuated: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg p-2 text-xs focus:outline-none font-bold text-emerald-400"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Casualties</label>
                <input
                  type="number"
                  value={formData.casualties}
                  onChange={(e) => setFormData({ ...formData, casualties: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg p-2 text-xs focus:outline-none font-bold text-red-400"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Injured</label>
                <input
                  type="number"
                  value={formData.injured}
                  onChange={(e) => setFormData({ ...formData, injured: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg p-2 text-xs focus:outline-none font-bold text-orange-400"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Missing</label>
                <input
                  type="number"
                  value={formData.missing_persons}
                  onChange={(e) => setFormData({ ...formData, missing_persons: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg p-2 text-xs focus:outline-none font-bold text-amber-400"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => navigate('/incidents')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-lg shadow-lg shadow-red-600/30 transition flex items-center space-x-2 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{loading ? 'Submitting to EOC...' : 'Submit Emergency Incident'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
