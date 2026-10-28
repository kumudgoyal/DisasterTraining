import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/client';
import {
  FileEdit,
  MapPin,
  Compass,
  Camera,
  Wifi,
  WifiOff,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  Upload,
  ArrowLeft
} from 'lucide-react';

export default function FieldReportPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const linkedIncidentId = searchParams.get('incident_id');

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineQueue, setOfflineQueue] = useState([]);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [form, setForm] = useState({
    report_type: 'situation_update',
    severity: 'high',
    category: 'Disaster Impact',
    description: '',
    location_name: '',
    district: 'Rohtak',
    state: 'Haryana',
    latitude: '28.8955',
    longitude: '76.5796',
    incident_id: linkedIncidentId || '',
    photos: '',
  });

  // Track online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Read cached queue
    const cached = localStorage.getItem('offline_field_reports');
    if (cached) {
      try {
        setOfflineQueue(JSON.parse(cached));
      } catch (e) {
        console.error(e);
      }
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const captureGPS = () => {
    if (!navigator.geolocation) {
      alert('GPS not supported');
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((prev) => ({
          ...prev,
          latitude: pos.coords.latitude.toFixed(5),
          longitude: pos.coords.longitude.toFixed(5),
        }));
        setGpsLoading(false);
      },
      () => {
        setGpsLoading(false);
        alert('Could not retrieve current GPS coordinates.');
      },
      { timeout: 7000 }
    );
  };

  const syncOfflineReports = async () => {
    if (offlineQueue.length === 0) return;
    setSubmitting(true);
    let successfulCount = 0;
    const remaining = [];

    for (const report of offlineQueue) {
      try {
        await api.post('/field-reports', report);
        successfulCount++;
      } catch (err) {
        console.error('Failed to sync report:', err);
        remaining.push(report);
      }
    }

    setOfflineQueue(remaining);
    localStorage.setItem('offline_field_reports', JSON.stringify(remaining));
    setSubmitting(false);
    setSuccessMsg(`Successfully synchronized ${successfulCount} offline reports with EOC!`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setSubmitting(true);

    const payload = {
      ...form,
      incident_id: form.incident_id ? parseInt(form.incident_id) : null,
      latitude: parseFloat(form.latitude) || null,
      longitude: parseFloat(form.longitude) || null,
      created_at: new Date().toISOString(),
    };

    if (!isOnline) {
      // Offline mode: queue in localStorage
      const updatedQueue = [...offlineQueue, payload];
      setOfflineQueue(updatedQueue);
      localStorage.setItem('offline_field_reports', JSON.stringify(updatedQueue));
      setSubmitting(false);
      setSuccessMsg('Report stored locally! It will automatically sync once connectivity returns.');
      setForm((prev) => ({ ...prev, description: '' }));
      return;
    }

    try {
      await api.post('/field-reports', payload);
      setSuccessMsg('Field report sent to EOC operations desk successfully!');
      setForm((prev) => ({ ...prev, description: '' }));
    } catch (err) {
      console.error(err);
      alert('Error submitting report. Queued locally instead.');
      const updatedQueue = [...offlineQueue, payload];
      setOfflineQueue(updatedQueue);
      localStorage.setItem('offline_field_reports', JSON.stringify(updatedQueue));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Connectivity & Offline Sync Bar */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
        <div className="flex items-center space-x-2">
          {isOnline ? (
            <span className="flex items-center space-x-1 text-emerald-400 font-semibold">
              <Wifi className="w-3.5 h-3.5" />
              <span>Online (Direct Sync to EOC)</span>
            </span>
          ) : (
            <span className="flex items-center space-x-1 text-amber-400 font-semibold">
              <WifiOff className="w-3.5 h-3.5" />
              <span>Offline Mode Active</span>
            </span>
          )}
        </div>

        {offlineQueue.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold text-amber-400">
              {offlineQueue.length} queued
            </span>
            {isOnline && (
              <button
                onClick={syncOfflineReports}
                disabled={submitting}
                className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white font-bold text-[10px] flex items-center space-x-1"
              >
                <RefreshCw className={`w-3 h-3 ${submitting ? 'animate-spin' : ''}`} />
                <span>Sync Now</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Field Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <FileEdit className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-100">Mobile Field Observation Form</h1>
            <p className="text-xs text-slate-400">Designed for on-ground disaster responders and volunteers.</p>
          </div>
        </div>

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] uppercase font-bold text-slate-400 mb-1">
                Report Nature *
              </label>
              <select
                value={form.report_type}
                onChange={(e) => setForm({ ...form, report_type: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg p-2.5 text-xs focus:outline-none focus:border-blue-500"
              >
                <option value="situation_update">Situation Update</option>
                <option value="incident">New Incident</option>
                <option value="damage">Damage Observation</option>
                <option value="casualty">Casualty / Medical Need</option>
                <option value="missing_person">Missing Person Notice</option>
                <option value="road_blockage">Road Blockage / Route Cut</option>
                <option value="shelter_update">Shelter Status</option>
                <option value="relief">Relief Supplies Need</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] uppercase font-bold text-slate-400 mb-1">
                Field Urgency *
              </label>
              <select
                value={form.severity}
                onChange={(e) => setForm({ ...form, severity: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg p-2.5 text-xs focus:outline-none focus:border-red-500 font-semibold"
              >
                <option value="critical">🔴 Critical (Immediate Action)</option>
                <option value="high">🟠 High (Urgent)</option>
                <option value="moderate">🟡 Moderate (Routine)</option>
                <option value="low">🟢 Low (Information)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase font-bold text-slate-400 mb-1">
              Location Description / Landmark
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Near Primary School, Sector 12"
              value={form.location_name}
              onChange={(e) => setForm({ ...form, location_name: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg p-2 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase font-bold text-slate-400 mb-1">
              Field Observations & Key Details *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Describe exact conditions on ground, people stranded, route accessibility, required rescue gear..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg p-2.5 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* GPS Coordinates Bar */}
          <div className="p-3 bg-slate-850 rounded-xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span className="font-mono text-slate-300">
                Lat: {form.latitude}, Lng: {form.longitude}
              </span>
            </div>
            <button
              type="button"
              onClick={captureGPS}
              disabled={gpsLoading}
              className="px-2.5 py-1 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 rounded text-xs font-semibold flex items-center space-x-1"
            >
              <Compass className={`w-3.5 h-3.5 ${gpsLoading ? 'animate-spin' : ''}`} />
              <span>Update GPS</span>
            </button>
          </div>

          {/* Photo upload mock */}
          <div className="p-3 bg-slate-850 rounded-xl border border-slate-800 border-dashed text-center">
            <Camera className="w-6 h-6 text-slate-400 mx-auto mb-1" />
            <p className="text-xs text-slate-300 font-semibold">Attach Photographic Evidence</p>
            <p className="text-[10px] text-slate-500">Camera capture supported on mobile devices</p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{submitting ? 'Transmitting to EOC...' : 'Transmit Field Report'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
