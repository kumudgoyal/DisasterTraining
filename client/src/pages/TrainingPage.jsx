import React, { useState, useEffect, useMemo } from 'react';
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
  AlertCircle,
  ExternalLink,
  Download,
  Database,
  Layers,
  Globe,
  ChevronLeft,
  ChevronRight,
  Shield,
  FileSpreadsheet
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

import {
  NATIONAL_TRAINING_RECORDS,
  NATIONAL_TRAINING_METRICS,
  CITATION_INFO,
} from '../data/nationalTrainingData';

const DISCIPLINE_COLORS = {
  'General Disaster Management': { bg: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500', hex: '#3b82f6' },
  'Flood': { bg: 'bg-cyan-50 text-cyan-700 border-cyan-200', dot: 'bg-cyan-500', hex: '#06b6d4' },
  'Earthquake': { bg: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500', hex: '#f59e0b' },
  'Landslide': { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', hex: '#10b981' },
  'Drought': { bg: 'bg-yellow-50 text-yellow-800 border-yellow-200', dot: 'bg-yellow-500', hex: '#eab308' },
  'Cyclone': { bg: 'bg-teal-50 text-teal-700 border-teal-200', dot: 'bg-teal-500', hex: '#14b8a6' },
  'Tsunami': { bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', dot: 'bg-indigo-500', hex: '#6366f1' },
  'Flood; Landslide': { bg: 'bg-sky-50 text-sky-700 border-sky-200', dot: 'bg-sky-500', hex: '#0284c7' },
};

export default function TrainingPage() {
  const [activeTab, setActiveTab] = useState('national'); // 'national' | 'drills'
  const { isAtLeast } = useAuth();

  // Local drills state
  const [trainings, setTrainings] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [districtFilter, setDistrictFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // National Dataset Filters & Pagination
  const [nationalSearch, setNationalSearch] = useState('');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [pageSize, setPageSize] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);

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

  // Filtered National Data
  const filteredNationalRecords = useMemo(() => {
    return NATIONAL_TRAINING_RECORDS.filter((r) => {
      const matchSearch =
        !nationalSearch ||
        r.state.toLowerCase().includes(nationalSearch.toLowerCase()) ||
        r.training_type.toLowerCase().includes(nationalSearch.toLowerCase());
      const matchState = selectedState === 'all' || r.state === selectedState;
      const matchType = selectedType === 'all' || r.training_type === selectedType;
      const matchYear = selectedYear === 'all' || String(r.year) === String(selectedYear);
      return matchSearch && matchState && matchType && matchYear;
    });
  }, [nationalSearch, selectedState, selectedType, selectedYear]);

  // Aggregates for the filtered national data
  const filteredTrainedCount = useMemo(() => {
    return filteredNationalRecords.reduce((sum, r) => sum + r.count, 0);
  }, [filteredNationalRecords]);

  // Pagination for National Table
  const totalPages = Math.ceil(filteredNationalRecords.length / pageSize) || 1;
  const paginatedNationalRecords = useMemo(() => {
    if (pageSize === 'all') return filteredNationalRecords;
    const start = (currentPage - 1) * pageSize;
    return filteredNationalRecords.slice(start, start + pageSize);
  }, [filteredNationalRecords, currentPage, pageSize]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [nationalSearch, selectedState, selectedType, selectedYear, pageSize]);

  // Export CSV
  const handleExportCsv = () => {
    const headers = ['Record ID', 'Location (State)', 'Training Type', 'Calendar Year', 'No. of People Trained', 'Source', 'Portal Link'];
    const rows = filteredNationalRecords.map((r) => [
      r.id,
      `"${r.state}"`,
      `"${r.training_type}"`,
      r.year,
      r.count,
      '"NPDRR / NIDM"',
      '"https://npdrr.nidm.gov.in/trainee?Length=7"'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NPDRR_NIDM_Trainee_Database_${selectedState !== 'all' ? selectedState : 'All_States'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-purple-50 text-purple-600">
                <GraduationCap className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200/60">
                National Disaster Management Framework
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight mt-2">
              Disaster Preparedness & Training Management System
            </h1>
            <p className="text-xs text-slate-600 mt-1 font-medium">
              Unified digital registry connecting national NIDM/NPDRR training cohorts with state and district mock drills.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {activeTab === 'drills' && isAtLeast('Volunteer') && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition"
              >
                <PlusCircle className="w-4 h-4 text-purple-400" />
                <span>Log Preparedness Activity</span>
              </button>
            )}
            {activeTab === 'national' && (
              <button
                onClick={handleExportCsv}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV Dataset</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-2 border-t border-slate-100 pt-3">
          <button
            onClick={() => setActiveTab('national')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'national'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>National Trainee Registry (NPDRR / NIDM)</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
              activeTab === 'national' ? 'bg-purple-500/20 text-purple-200' : 'bg-slate-200 text-slate-700'
            }`}>
              10,599 Trained
            </span>
          </button>

          <button
            onClick={() => setActiveTab('drills')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'drills'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>State & District Mock Drills</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
              activeTab === 'drills' ? 'bg-purple-500/20 text-purple-200' : 'bg-slate-200 text-slate-700'
            }`}>
              {trainings.length} Active
            </span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: NATIONAL TRAINEE REGISTRY (NPDRR / NIDM)          */}
      {/* ======================================================== */}
      {activeTab === 'national' && (
        <div className="space-y-6">
          {/* Government Source & Citation Banner */}
          <div className="p-5 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl shadow-md border border-purple-800/40 relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold border border-purple-400/30">
                    Official Portal Data Integration
                  </span>
                  <span className="text-[11px] text-slate-300 font-medium">
                    National Platform for Disaster Risk Reduction (NPDRR)
                  </span>
                </div>
                <h3 className="text-base font-extrabold tracking-tight">
                  National Institute of Disaster Management (NIDM) Trainee Registry (2010–2015)
                </h3>
                <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
                  Historical nationwide capacity-building repository capturing disaster response training across 35 States & UTs.
                  Cited in Chandigarh University research on multi-agency training visibility.
                </p>
                <p className="text-[11px] text-purple-200 font-mono pt-1">
                  Citation: <span className="text-white italic">{CITATION_INFO.citation}</span>
                </p>
              </div>

              <div className="flex sm:flex-col items-start gap-2 shrink-0">
                <a
                  href={CITATION_INFO.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs shadow-md transition"
                >
                  <span>Visit NIDM Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <span className="text-[10px] text-slate-300 font-mono">Length=7 Dataset Active</span>
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="p-5 bg-white border border-slate-200/90 rounded-3xl shadow-sm">
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Total People Trained</p>
              <p className="text-2xl font-black text-purple-600 mt-1">
                {NATIONAL_TRAINING_METRICS.total_trained.toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">Across all states (2010–15)</p>
            </div>

            <div className="p-5 bg-white border border-slate-200/90 rounded-3xl shadow-sm">
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">States & UTs Covered</p>
              <p className="text-2xl font-black text-indigo-600 mt-1">
                {NATIONAL_TRAINING_METRICS.total_states}
              </p>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">Pan-India coverage</p>
            </div>

            <div className="p-5 bg-white border border-slate-200/90 rounded-3xl shadow-sm">
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Verified Batches</p>
              <p className="text-2xl font-black text-emerald-600 mt-1">
                {NATIONAL_TRAINING_METRICS.total_records}
              </p>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">Disaster training cohorts</p>
            </div>

            <div className="p-5 bg-white border border-slate-200/90 rounded-3xl shadow-sm">
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Hazard Disciplines</p>
              <p className="text-2xl font-black text-amber-600 mt-1">
                {NATIONAL_TRAINING_METRICS.types_list.length}
              </p>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">Flood, Quake, Cyclone, etc.</p>
            </div>

            <div className="p-5 bg-white border border-slate-200/90 rounded-3xl shadow-sm col-span-2 md:col-span-1">
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Top Trained State</p>
              <p className="text-xl font-black text-rose-600 mt-1 truncate">
                {NATIONAL_TRAINING_METRICS.top_state?.state}
              </p>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                {NATIONAL_TRAINING_METRICS.top_state?.trained.toLocaleString()} responders
              </p>
            </div>
          </div>

          {/* Visual Analytics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top 10 States Bar Chart */}
            <div className="lg:col-span-2 p-6 bg-white border border-slate-200/90 rounded-3xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                    <span>Top 10 States by Trained Responders</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">Cumulative counts (2010–2015)</p>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-1 bg-purple-50 text-purple-700 rounded-lg border border-purple-100">
                  National Rankings
                </span>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={NATIONAL_TRAINING_METRICS.top_states} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="state"
                      tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }}
                      angle={-25}
                      textAnchor="end"
                      interval={0}
                    />
                    <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        border: 'none',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '11px',
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                      }}
                      formatter={(val) => [`${val.toLocaleString()} trained`, 'Personnel']}
                    />
                    <Bar dataKey="trained" fill="#6366f1" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Training by Hazard Discipline Pie Chart */}
            <div className="p-6 bg-white border border-slate-200/90 rounded-3xl shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    <span>Disaster Training Types</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">Breakdown by hazard area</p>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={NATIONAL_TRAINING_METRICS.by_type}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="48%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={3}
                    >
                      {NATIONAL_TRAINING_METRICS.by_type.map((entry, index) => {
                        const color = DISCIPLINE_COLORS[entry.name]?.hex || '#64748b';
                        return <Cell key={`cell-${index}`} fill={color} />;
                      })}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        border: 'none',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '11px'
                      }}
                      formatter={(val, name) => [`${val.toLocaleString()} (${((val / NATIONAL_TRAINING_METRICS.total_trained) * 100).toFixed(1)}%)`, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-1.5 pt-2 text-[10px]">
                {NATIONAL_TRAINING_METRICS.by_type.slice(0, 6).map((item) => (
                  <div key={item.name} className="flex items-center space-x-1.5 truncate">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: DISCIPLINE_COLORS[item.name]?.hex || '#64748b' }} />
                    <span className="text-slate-600 truncate">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="p-5 bg-white border border-slate-200/90 rounded-3xl shadow-sm space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by state or hazard type (e.g., Delhi, Flood, Cyclone)..."
                  value={nationalSearch}
                  onChange={(e) => setNationalSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>

              {/* State Filter */}
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 font-medium text-slate-700 focus:outline-none"
              >
                <option value="all">All States & UTs (35)</option>
                {NATIONAL_TRAINING_METRICS.states_list.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              {/* Type Filter */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 font-medium text-slate-700 focus:outline-none"
              >
                <option value="all">All Training Types</option>
                {NATIONAL_TRAINING_METRICS.types_list.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>

              {/* Year Filter */}
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 font-medium text-slate-700 focus:outline-none"
              >
                <option value="all">All Years (2010–2015)</option>
                {NATIONAL_TRAINING_METRICS.years_list.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>

              {/* Clear Filters Button */}
              {(nationalSearch || selectedState !== 'all' || selectedType !== 'all' || selectedYear !== 'all') && (
                <button
                  onClick={() => {
                    setNationalSearch('');
                    setSelectedState('all');
                    setSelectedType('all');
                    setSelectedYear('all');
                  }}
                  className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-2xl transition"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Results count indicator */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
              <span>
                Showing <strong className="text-slate-900">{filteredNationalRecords.length}</strong> matching cohorts
                {' · '}
                <strong className="text-purple-600">{filteredTrainedCount.toLocaleString()}</strong> people trained in this view
              </span>
              <div className="flex items-center space-x-2">
                <span>Rows per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-0.5 text-[11px] font-semibold text-slate-700"
                >
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value="all">All</option>
                </select>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white border border-slate-200/90 rounded-3xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[10px] font-mono uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-4 font-bold"># ID</th>
                    <th className="py-3 px-4 font-bold">Location (State / UT)</th>
                    <th className="py-3 px-4 font-bold">Disaster Training Type</th>
                    <th className="py-3 px-4 font-bold">Calendar Year</th>
                    <th className="py-3 px-4 font-bold">People Trained</th>
                    <th className="py-3 px-4 font-bold">Source Registry</th>
                    <th className="py-3 px-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {paginatedNationalRecords.length > 0 ? (
                    paginatedNationalRecords.map((record) => {
                      const colorInfo = DISCIPLINE_COLORS[record.training_type] || {
                        bg: 'bg-slate-100 text-slate-700 border-slate-200',
                        dot: 'bg-slate-500'
                      };
                      return (
                        <tr key={record.id} className="hover:bg-purple-50/30 transition-colors">
                          <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                            #{String(record.id).padStart(3, '0')}
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-900 flex items-center space-x-2">
                            <MapPin className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                            <span>{record.state}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${colorInfo.bg}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${colorInfo.dot}`} />
                              <span>{record.training_type}</span>
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 font-mono text-[11px] font-bold">
                              {record.year}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-black text-purple-700 text-sm">
                            <span className="flex items-center space-x-1.5">
                              <Users className="w-3.5 h-3.5 text-purple-400" />
                              <span>{record.count.toLocaleString()}</span>
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 border border-slate-200 font-mono text-[10px]">
                              NPDRR / NIDM
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <a
                              href="https://npdrr.nidm.gov.in/trainee?Length=7"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-600 hover:text-purple-900 font-semibold text-[11px] inline-flex items-center space-x-1"
                            >
                              <span>Verify</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="font-semibold text-slate-600">No training cohorts matched your filters</p>
                        <p className="text-xs text-slate-400 mt-1">Try clearing search terms or selecting 'All States'</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {pageSize !== 'all' && totalPages > 1 && (
              <div className="p-4 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  Page <strong className="text-slate-900">{currentPage}</strong> of <strong className="text-slate-900">{totalPages}</strong>
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="font-mono text-[11px] px-2 text-slate-600">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: STATE & DISTRICT MOCK DRILLS                      */}
      {/* ======================================================== */}
      {activeTab === 'drills' && (
        <div className="space-y-6">
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
              <p className="text-xs text-slate-500 mt-0.5 font-medium">Operational outreach zones</p>
            </div>

            <div className="p-5 bg-white border border-slate-200/90 rounded-3xl shadow-sm">
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Communities Reached</p>
              <p className="text-2xl font-black text-amber-600 mt-1">
                24+
              </p>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">ASHA, youth & panchayats</p>
            </div>
          </div>

          {/* District Filter & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-700">Filter by District:</span>
              <select
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none font-semibold text-slate-800"
              >
                <option value="">All Operational Districts</option>
                <option value="Rohtak">Rohtak</option>
                <option value="Panipat">Panipat</option>
                <option value="Chandigarh">Chandigarh</option>
                <option value="Faridabad">Faridabad</option>
              </select>
            </div>

            <button
              onClick={fetchData}
              className="flex items-center space-x-1.5 text-xs text-slate-600 hover:text-slate-900 font-semibold px-3 py-1.5 rounded-xl hover:bg-slate-100 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Drills</span>
            </button>
          </div>

          {/* Trainings Cards Grid */}
          {loading ? (
            <div className="text-center py-12 text-slate-400">Loading drills...</div>
          ) : trainings.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200/90 p-8">
              <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="font-bold text-slate-700">No mock drills or training sessions recorded</p>
              <p className="text-xs text-slate-500 mt-1">Log a new session above to update district readiness records.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {trainings.map((t) => (
                <div
                  key={t.id}
                  className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200/60 font-bold text-[10px] uppercase tracking-wider">
                        {t.disaster_type_name || 'Drill'}
                      </span>
                      <span className="flex items-center space-x-1 text-[11px] font-mono text-slate-500">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{t.training_date ? new Date(t.training_date).toLocaleDateString() : 'Recent'}</span>
                      </span>
                    </div>

                    <h3 className="font-extrabold text-sm text-slate-900 leading-snug">{t.title}</h3>

                    <div className="space-y-1.5 text-xs text-slate-600">
                      <p className="flex items-center space-x-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-semibold text-slate-800">{t.location}</span>
                        <span className="text-slate-400">({t.district}, {t.state})</span>
                      </p>
                      <p className="flex items-center space-x-1.5">
                        <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Lead: <strong className="text-slate-800">{t.trainer_name}</strong></span>
                      </p>
                      {t.participant_categories && (
                        <p className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-100">
                          <strong>Audience:</strong> {t.participant_categories}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-medium">Participants Trained</span>
                      <span className="text-sm font-black text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                        {t.participants_count} Responders
                      </span>
                    </div>
                    {t.outcome && (
                      <p className="text-[11px] text-slate-600 italic bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
                        "{t.outcome}"
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal for Creating Training */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-extrabold text-base text-slate-900">Log Preparedness & Training Session</h3>
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
