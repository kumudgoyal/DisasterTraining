import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/client';
import {
  LifeBuoy,
  MapPin,
  Compass,
  ArrowLeft,
  CheckCircle2,
  PhoneCall,
  AlertTriangle
} from 'lucide-react';

export default function PublicReportPage() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);

  const [form, setForm] = useState({
    report_type: 'incident',
    category: 'Citizen Distress',
    severity: 'high',
    location_name: '',
    district: 'Rohtak',
    state: 'Haryana',
    latitude: '28.8955',
    longitude: '76.5796',
    description: '',
  });

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
        alert('Could not determine exact location. Please type landmark.');
      },
      { timeout: 8000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/field-reports', {
        ...form,
        latitude: parseFloat(form.latitude) || null,
        longitude: parseFloat(form.longitude) || null,
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert('Failed to transmit distress report. Please dial 112 directly.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto py-12 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Emergency Report Logged</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Your distress coordinates and situation details have been received by the District Emergency Operations Centre. 
            Verification officers and emergency responders are being alerted.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
          <p className="font-semibold text-slate-200">If immediate life-saving rescue is required:</p>
          <a
            href="tel:112"
            className="inline-flex items-center space-x-1.5 mt-2 font-bold text-red-400 text-sm hover:underline"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call 112 directly</span>
          </a>
        </div>

        <Link
          to="/public"
          className="inline-block px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
        >
          Return to Citizen Portal
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <Link
        to="/public"
        className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Portal</span>
      </Link>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-500 border border-red-500/30 flex items-center justify-center">
            <LifeBuoy className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Citizen Emergency & Distress Report</h1>
            <p className="text-xs text-slate-400">Submit on-ground emergencies directly to district response units.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">What emergency are you witnessing? *</label>
            <select
              value={form.report_type}
              onChange={(e) => setForm({ ...form, report_type: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg p-2.5 text-xs focus:outline-none focus:border-red-500 font-semibold"
            >
              <option value="incident">Rapid Flooding / Waterlogging</option>
              <option value="casualty">People Trapped / Require Rescue</option>
              <option value="road_blockage">Road Submerged or Blocked</option>
              <option value="damage">Building / Bridge Structural Collapse</option>
              <option value="missing_person">Missing Family Member</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Location / Landmark Description *</label>
            <input
              type="text"
              required
              placeholder="e.g., Near Bus Stand, Village Bohar, Rohtak"
              value={form.location_name}
              onChange={(e) => setForm({ ...form, location_name: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg p-2.5 text-xs focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-850 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-slate-300">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>GPS: {form.latitude}, {form.longitude}</span>
            </div>
            <button
              type="button"
              onClick={captureGPS}
              disabled={gpsLoading}
              className="px-2.5 py-1 bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 rounded text-[11px] font-semibold flex items-center space-x-1"
            >
              <Compass className={`w-3.5 h-3.5 ${gpsLoading ? 'animate-spin' : ''}`} />
              <span>{gpsLoading ? 'Capturing...' : 'Pin My Location'}</span>
            </button>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Situation Details & Assistance Needed *</label>
            <textarea
              required
              rows={4}
              placeholder="Number of persons stranded, water level height, medical injuries, contact phone number..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg p-2.5 text-xs focus:outline-none focus:border-red-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-xl shadow-red-600/30 transition flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <LifeBuoy className="w-4 h-4" />
            <span>{loading ? 'Transmitting Distress Report...' : 'Transmit Report to EOC'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
