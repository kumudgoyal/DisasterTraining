import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Users,
  Calendar,
  MapPin,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  TrendingUp,
  Award,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export default function TrainingPage() {
  const [trainings, setTrainings] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [districtFilter, setDistrictFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { isAtLeast } = useAuth();

  const [form, setForm] = useState({
    title: '',
    trainer_name: '',
    location: '',
    district: 'Rohtak',
    state: 'Haryana',
    training_date: new Date().toISOString().split('T')[0],
    participants_count: 50,
    participant_categories: 'Volunteers, Local youth, Teachers',
    outcome: 'Completed evacuation simulation and emergency first aid drills.',
  });

  const fetchData = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (districtFilter) params.append('district', districtFilter);

    Promise.all([
      api.get(`/training?${params.toString()}`).catch(() => ({ success: false })),
      api.get('/training/analytics').catch(() => ({ success: false })),
    ])
      .then(([trainRes, analRes]) => {
        if (trainRes?.success) setTrainings(Array.isArray(trainRes.data) ? trainRes.data : []);
        if (analRes?.success && analRes.data) setAnalytics(analRes.data);
      })
      .catch((err) => {
        console.error('Failed to fetch training data:', err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [districtFilter]);

  const handleCreateTraining = async (e) => {
    e.preventDefault();
    try {
      await api.post('/training', {
        ...form,
        participants_count: parseInt(form.participants_count) || 0,
      });
      setShowCreateModal(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2.5">
            <span className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <GraduationCap className="w-5 h-5" />
            </span>
            <span>Disaster Preparedness, Mock Drills & Community Training</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1.5 font-medium">
            Tracking community readiness: first-aid skills, search-and-rescue drills, volunteer orientations, and gap analysis.
          </p>
        </div>

        {isAtLeast('Volunteer') && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4 text-purple-400" />
            <span>Log Preparedness Activity</span>
          </button>
        )}
      </div>

      {/* Analytics Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-slate-200/90 rounded-3xl shadow-sm">
          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Total Drills Conducted</p>
          <p className="text-2xl font-black text-purple-600 mt-1">
            {analytics?.total_programs ?? trainings.length}
          </p>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">Community workshops & mock drills</p>
        </div>

        <div className="p-5 bg-white border border-slate-200/90 rounded-3xl shadow-sm">
          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Trained Citizens & Responders</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            {analytics?.total_participants?.toLocaleString() ?? 0}
          </p>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">Certified first responders</p>
        </div>

        <div className="p-5 bg-white border border-slate-200/90 rounded-3xl shadow-sm">
          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Districts Covered</p>
          <p className="text-2xl font-black text-blue-600 mt-1">
            {analytics?.by_district?.length ?? 0}
          </p>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">Active geographic footprints</p>
        </div>

        <div className="p-5 bg-white border border-slate-200/90 rounded-3xl shadow-sm">
          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Leading Agency</p>
          <p className="text-base font-bold text-slate-900 mt-1 truncate">
            {analytics?.by_organization?.[0]?.org_name || 'NDRF / Red Cross'}
          </p>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">Top preparedness organizer</p>
        </div>
      </div>

      {/* Training Programs List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">Preparedness Activity Log</h3>
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="bg-white border border-slate-200 text-xs font-semibold text-slate-800 rounded-xl px-3.5 py-1.5 focus:outline-none shadow-sm"
          >
            <option value="">All Districts</option>
            <option value="Rohtak">Rohtak</option>
            <option value="Karnal">Karnal</option>
            <option value="Panipat">Panipat</option>
            <option value="Chandigarh">Chandigarh</option>
            <option value="Gurugram">Gurugram</option>
            <option value="Hisar">Hisar</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading ? (
            <div className="col-span-full py-12 text-center text-xs text-slate-400 font-medium">Loading training registry...</div>
          ) : !Array.isArray(trainings) || trainings.length === 0 ? (
            <div className="col-span-full py-12 text-center text-xs text-slate-500 bg-white rounded-3xl border border-slate-200/80 p-8">
              No training activities recorded.
            </div>
          ) : (
            (trainings || []).map((tr) => (
              <div
                key={tr.id}
                className="bg-white border border-slate-200/90 rounded-3xl p-5 hover:border-slate-300 hover:shadow-md transition shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 font-mono">
                      {tr.disaster_type_name || 'Multi-Hazard Emergency Preparedness'}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-0.5">{tr.title}</h4>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold shrink-0">
                    {tr.participants_count} Trained
                  </span>
                </div>

                <p className="text-xs text-slate-600 font-medium leading-relaxed">{tr.outcome}</p>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60 text-[11px] text-slate-600 space-y-1 font-medium">
                  <p><strong className="text-slate-900">Audience:</strong> {tr.participant_categories}</p>
                  <p><strong className="text-slate-900">Trainer:</strong> {tr.trainer_name} ({tr.organization_name})</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{tr.location || tr.district}</span>
                  </span>
                  <span className="flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{tr.training_date}</span>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal: Log Training */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 space-y-4 my-8 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Log Preparedness & Training Session</h3>
            <form onSubmit={handleCreateTraining} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Training Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Community Flood Rescue & Evacuation Workshop"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-2.5 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Lead Instructor / Trainer</label>
                  <input
                    type="text"
                    placeholder="Instructor Name"
                    value={form.trainer_name}
                    onChange={(e) => setForm({ ...form, trainer_name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-2.5 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">District</label>
                  <input
                    type="text"
                    value={form.district}
                    onChange={(e) => setForm({ ...form, district: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-2.5 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Date Conducted</label>
                  <input
                    type="date"
                    value={form.training_date}
                    onChange={(e) => setForm({ ...form, training_date: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-2.5 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Participant Count</label>
                  <input
                    type="number"
                    min="1"
                    value={form.participants_count}
                    onChange={(e) => setForm({ ...form, participants_count: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-2.5 focus:outline-none font-bold text-purple-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Participant Profile / Groups</label>
                <input
                  type="text"
                  placeholder="e.g., ASHA workers, College volunteers, Panchayat members"
                  value={form.participant_categories}
                  onChange={(e) => setForm({ ...form, participant_categories: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-2.5 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Training Outcomes & Drills Performed</label>
                <textarea
                  rows={3}
                  value={form.outcome}
                  onChange={(e) => setForm({ ...form, outcome: e.target.value })}
                  placeholder="Summary of skills imparted, simulations executed..."
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
                  Save Training Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
