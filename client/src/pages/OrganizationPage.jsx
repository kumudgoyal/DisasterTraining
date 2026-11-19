import React, { useState, useEffect, useMemo } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
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
  RefreshCw,
  PlusCircle,
  Download,
  ExternalLink,
  Edit3,
  Trash2,
  Eye,
  UserCheck,
  GraduationCap,
  Radio,
  AlertTriangle,
  Layers,
  X,
  Globe,
  FileText,
  Activity,
  HeartPulse,
  Flame,
  ShieldAlert,
  ArrowUpDown,
  LayoutGrid,
  Table as TableIcon,
  Clock,
  Sparkles
} from 'lucide-react';

export default function OrganizationPage() {
  const { user, isAtLeast } = useAuth();

  // State
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Filters & Search
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('name'); // 'name' | 'teams' | 'resources' | 'trainings'

  // Modals
  const [selectedOrg, setSelectedOrg] = useState(null); // for Dossier Modal
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailTab, setDetailTab] = useState('overview'); // 'overview' | 'teams' | 'resources' | 'trainings'

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    name: '',
    type: 'ngo',
    operating_region: 'Haryana',
    nodal_officer: '',
    contact_phone: '',
    contact_email: '',
    address: '',
    website: '',
    specializations: 'Disaster Relief, First Aid, Community Preparedness',
    established_year: 2020,
    teams_count: 1,
    resources_count: 2,
    training_count: 0,
    status: 'accredited',
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editForm, setEditForm] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [orgToDelete, setOrgToDelete] = useState(null);

  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Fetch Organizations
  const fetchOrgs = (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    api.get('/organizations')
      .then((res) => {
        if (res?.success) {
          setOrgs(Array.isArray(res.data) ? res.data : []);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch organizations:', err);
        setOrgs([]);
        showToast('Failed to load response agencies directory', 'error');
      })
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    fetchOrgs();
  }, []);

  // Open Dossier Detail
  const handleOpenDossier = (org) => {
    setSelectedOrg(org);
    setShowDetailModal(true);
    setDetailTab('overview');
    setDetailLoading(true);

    api.get(`/organizations/${org.id}`)
      .then((res) => {
        if (res?.success && res.data) {
          setDetailData(res.data);
        } else {
          setDetailData(org);
        }
      })
      .catch(() => {
        setDetailData(org);
      })
      .finally(() => {
        setDetailLoading(false);
      });
  };

  // Create Organization
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!registerForm.name.trim()) {
      showToast('Organization Name is required', 'error');
      return;
    }
    setRegisterLoading(true);
    try {
      const res = await api.post('/organizations', {
        ...registerForm,
        teams_count: parseInt(registerForm.teams_count) || 0,
        resources_count: parseInt(registerForm.resources_count) || 0,
        training_count: parseInt(registerForm.training_count) || 0,
        established_year: parseInt(registerForm.established_year) || new Date().getFullYear(),
      });
      if (res?.success) {
        showToast(`Agency "${registerForm.name}" registered successfully`);
        setShowRegisterModal(false);
        setRegisterForm({
          name: '',
          type: 'ngo',
          operating_region: 'Haryana',
          nodal_officer: '',
          contact_phone: '',
          contact_email: '',
          address: '',
          website: '',
          specializations: 'Disaster Relief, First Aid, Community Preparedness',
          established_year: 2020,
          teams_count: 1,
          resources_count: 2,
          training_count: 0,
          status: 'accredited',
        });
        fetchOrgs();
      } else {
        showToast(res?.error || 'Registration failed', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast(err?.message || 'Server error while registering agency', 'error');
    } finally {
      setRegisterLoading(false);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (org, e) => {
    e?.stopPropagation();
    setEditForm({ ...org });
    setShowEditModal(true);
  };

  // Update Organization
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editForm || !editForm.name.trim()) return;
    setEditLoading(true);
    try {
      const res = await api.put(`/organizations/${editForm.id}`, {
        ...editForm,
        teams_count: parseInt(editForm.teams_count) || 0,
        resources_count: parseInt(editForm.resources_count) || 0,
        training_count: parseInt(editForm.training_count) || 0,
      });
      if (res?.success) {
        showToast(`Updated agency "${editForm.name}"`);
        setShowEditModal(false);
        fetchOrgs();
        if (selectedOrg?.id === editForm.id) {
          setSelectedOrg(res.data);
          setDetailData((prev) => ({ ...prev, ...res.data }));
        }
      } else {
        showToast(res?.error || 'Update failed', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast(err?.message || 'Error updating organization', 'error');
    } finally {
      setEditLoading(false);
    }
  };

  // Delete Organization
  const handleConfirmDelete = async () => {
    if (!orgToDelete) return;
    setDeleteLoading(true);
    try {
      const res = await api.delete(`/organizations/${orgToDelete.id}`);
      if (res?.success) {
        showToast(`Agency "${orgToDelete.name}" unlinked from roster`);
        setShowDeleteModal(false);
        setOrgToDelete(null);
        if (selectedOrg?.id === orgToDelete.id) {
          setShowDetailModal(false);
        }
        fetchOrgs();
      } else {
        showToast(res?.error || 'Delete failed', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast(err?.message || 'Failed to unlink agency', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (!filteredOrgs.length) {
      showToast('No organizations to export', 'error');
      return;
    }
    const headers = [
      'ID',
      'Agency Name',
      'Type',
      'Nodal Officer',
      'Operating Region',
      'Contact Phone',
      'Contact Email',
      'Address',
      'Website',
      'Specializations',
      'Active Teams',
      'Committed Assets',
      'Preparedness Drills',
      'Status'
    ];
    const rows = filteredOrgs.map((o) => [
      o.id,
      `"${(o.name || '').replace(/"/g, '""')}"`,
      `"${o.type || ''}"`,
      `"${(o.nodal_officer || '').replace(/"/g, '""')}"`,
      `"${(o.operating_region || '').replace(/"/g, '""')}"`,
      `"${o.contact_phone || ''}"`,
      `"${o.contact_email || ''}"`,
      `"${(o.address || '').replace(/"/g, '""')}"`,
      `"${o.website || ''}"`,
      `"${(o.specializations || '').replace(/"/g, '""')}"`,
      o.teams_count || 0,
      o.resources_count || 0,
      o.training_count || 0,
      `"${o.status || 'accredited'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Disaster_Response_Agencies_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported Agencies Directory to CSV');
  };

  // KPI calculations
  const kpiStats = useMemo(() => {
    const total = orgs.length;
    const militaryCount = orgs.filter((o) => o.type === 'military' || o.type === 'police').length;
    const ngoCount = orgs.filter((o) => o.type === 'ngo').length;
    const medicalCount = orgs.filter((o) => o.type === 'medical' || o.type === 'fire').length;
    const totalTeams = orgs.reduce((acc, o) => acc + (parseInt(o.teams_count) || 0), 0);
    const totalAssets = orgs.reduce((acc, o) => acc + (parseInt(o.resources_count) || 0), 0);
    return { total, militaryCount, ngoCount, medicalCount, totalTeams, totalAssets };
  }, [orgs]);

  // Unique regions for filter
  const uniqueRegions = useMemo(() => {
    const set = new Set();
    orgs.forEach((o) => {
      if (o.operating_region) set.add(o.operating_region.trim());
    });
    return Array.from(set);
  }, [orgs]);

  // Filtered & Sorted
  const filteredOrgs = useMemo(() => {
    return orgs
      .filter((org) => {
        if (typeFilter && org.type !== typeFilter) return false;
        if (regionFilter && org.operating_region !== regionFilter) return false;
        if (statusFilter && (org.status || 'accredited') !== statusFilter) return false;
        if (search) {
          const q = search.toLowerCase();
          const matchName = org.name?.toLowerCase().includes(q);
          const matchRegion = org.operating_region?.toLowerCase().includes(q);
          const matchSpec = org.specializations?.toLowerCase().includes(q);
          const matchOfficer = org.nodal_officer?.toLowerCase().includes(q);
          const matchType = org.type?.toLowerCase().includes(q);
          if (!matchName && !matchRegion && !matchSpec && !matchOfficer && !matchType) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
        if (sortBy === 'teams') return (b.teams_count || 0) - (a.teams_count || 0);
        if (sortBy === 'resources') return (b.resources_count || 0) - (a.resources_count || 0);
        if (sortBy === 'trainings') return (b.training_count || 0) - (a.training_count || 0);
        return 0;
      });
  }, [orgs, typeFilter, regionFilter, statusFilter, search, sortBy]);

  // Visual helper for type styling
  const getTypeBadge = (type) => {
    switch (type) {
      case 'military':
        return {
          label: 'Armed / NDRF Unit',
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
          icon: ShieldAlert,
        };
      case 'government':
        return {
          label: 'State Authority / SDMA',
          bg: 'bg-slate-100 text-slate-800 border-slate-300',
          icon: Building2,
        };
      case 'ngo':
        return {
          label: 'Humanitarian NGO',
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
          icon: HeartPulse,
        };
      case 'medical':
        return {
          label: 'Emergency Medical',
          bg: 'bg-rose-50 text-rose-700 border-rose-200/80',
          icon: Activity,
        };
      case 'fire':
        return {
          label: 'Fire & Rescue',
          bg: 'bg-amber-50 text-amber-700 border-amber-200/80',
          icon: Flame,
        };
      case 'police':
        return {
          label: 'Police Disaster Cell',
          bg: 'bg-purple-50 text-purple-700 border-purple-200/80',
          icon: Shield,
        };
      default:
        return {
          label: type || 'Agency',
          bg: 'bg-slate-50 text-slate-700 border-slate-200',
          icon: Building2,
        };
    }
  };

  return (
    <div className="space-y-7 animate-fadeIn">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div
            className={`px-4 py-3 rounded-2xl shadow-float text-xs font-semibold flex items-center space-x-2.5 border ${
              toastMessage.type === 'error'
                ? 'bg-red-50 text-red-800 border-red-200'
                : 'bg-slate-900 text-white border-slate-800'
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 ${toastMessage.type === 'error' ? 'text-red-500' : 'text-emerald-400'}`} />
            <span>{toastMessage.msg}</span>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center space-x-2.5">
            <span className="p-2.5 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
              <Building2 className="w-5 h-5" />
            </span>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Response Agencies & NGO Directory
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 font-mono">
                EOC ACTIVE
              </span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 font-medium pl-1">
            Centralized inter-agency operational command: State authorities, NDRF battalions, humanitarian relief NGOs, trauma health centers, and certified responder units.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
          <button
            onClick={() => fetchOrgs(true)}
            disabled={refreshing}
            className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-semibold text-xs border border-slate-200 transition"
            title="Refresh Directory"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-blue-600' : ''}`} />
            <span className="hidden sm:inline">Sync</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-semibold text-xs border border-slate-200 transition"
            title="Export Directory as CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setShowRegisterModal(true)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition"
          >
            <PlusCircle className="w-4 h-4 text-blue-400" />
            <span>Register Agency</span>
          </button>
        </div>
      </div>

      {/* KPI Tactical Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">
            Total Agencies
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">{kpiStats.total}</span>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-md">100% Verified</span>
          </div>
          <p className="text-[10px] text-slate-500">Accredited partners</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">
            Disaster Forces
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-indigo-700">{kpiStats.militaryCount}</span>
            <ShieldAlert className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-[10px] text-slate-500">NDRF / Police units</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">
            Relief NGOs
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-700">{kpiStats.ngoCount}</span>
            <HeartPulse className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-[10px] text-slate-500">Red Cross, SEEDS, Goonj</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">
            Medical & Fire
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-rose-700">{kpiStats.medicalCount}</span>
            <Activity className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-[10px] text-slate-500">Trauma & Fire rescue</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">
            Response Teams
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-blue-700">{kpiStats.totalTeams}</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-[10px] text-slate-500">Deployable field units</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">
            Committed Assets
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-700">{kpiStats.totalAssets}</span>
            <Truck className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-[10px] text-slate-500">Boats, ambulances, pumps</p>
        </div>
      </div>

      {/* Filter, Search & View Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-3.5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search agency name, jurisdiction, nodal officer, or specialization..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-blue-500 text-slate-900 placeholder-slate-400 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-medium focus:outline-none transition shadow-inner"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* View Toggles & Clear */}
          <div className="flex items-center space-x-2 shrink-0">
            <div className="bg-slate-100 p-1 rounded-2xl border border-slate-200 flex items-center space-x-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1 transition ${
                  viewMode === 'grid'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Grid Cards View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="text-[11px] px-1 hidden sm:inline">Cards</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1 transition ${
                  viewMode === 'table'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Enterprise Table View"
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span className="text-[11px] px-1 hidden sm:inline">Table</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono block mb-1">
              Agency Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:border-blue-500"
            >
              <option value="">All Categories ({orgs.length})</option>
              <option value="government">Government / SDMA / DDMA</option>
              <option value="military">NDRF / SDRF Military</option>
              <option value="ngo">Humanitarian NGOs</option>
              <option value="medical">Medical / Health Centers</option>
              <option value="fire">Fire & Rescue Services</option>
              <option value="police">Police Disaster Cells</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono block mb-1">
              Jurisdiction / Region
            </label>
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:border-blue-500"
            >
              <option value="">All Regions</option>
              {uniqueRegions.map((reg) => (
                <option key={reg} value={reg}>
                  {reg}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono block mb-1">
              Accreditation Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="accredited">Accredited Agency</option>
              <option value="verified">Verified Responder</option>
              <option value="under_review">Under Review</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono block mb-1">
              Sort Order
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:border-blue-500"
            >
              <option value="name">Agency Name (A - Z)</option>
              <option value="teams">Most Active Teams</option>
              <option value="resources">Most Committed Assets</option>
              <option value="trainings">Most Drills Conducted</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="bg-white p-16 rounded-3xl border border-slate-200 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-600 uppercase tracking-wider font-mono">
            Loading Response Agencies Directory...
          </p>
        </div>
      ) : filteredOrgs.length === 0 ? (
        <div className="bg-white p-16 rounded-3xl border border-slate-200 text-center space-y-4">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">No organizations match filter criteria</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Try adjusting your search terms or clear the filters to view all accredited response partners.
            </p>
          </div>
          <button
            onClick={() => {
              setSearch('');
              setTypeFilter('');
              setRegionFilter('');
              setStatusFilter('');
            }}
            className="px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition"
          >
            Clear All Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* ================= CARDS GRID VIEW ================= */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOrgs.map((org) => {
            const badge = getTypeBadge(org.type);
            const IconComponent = badge.icon;
            const specializationsList = (org.specializations || '')
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean);

            return (
              <div
                key={org.id}
                onClick={() => handleOpenDossier(org)}
                className="group bg-white rounded-3xl border border-slate-200/90 hover:border-blue-400/80 p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer relative"
              >
                <div className="space-y-4">
                  {/* Card Header: Type Badge & Status */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-xl text-[10px] font-bold border ${badge.bg}`}
                    >
                      <IconComponent className="w-3 h-3 shrink-0" />
                      <span>{badge.label}</span>
                    </span>

                    <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Accredited</span>
                    </span>
                  </div>

                  {/* Title & Region */}
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 group-hover:text-blue-600 transition leading-snug">
                      {org.name}
                    </h3>
                    <div className="flex items-center space-x-1.5 text-xs text-slate-500 mt-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{org.operating_region || 'Jurisdiction: State Wide'}</span>
                      {org.established_year && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span className="text-[11px] text-slate-400 font-mono">Est. {org.established_year}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Nodal Officer Banner */}
                  {org.nodal_officer && (
                    <div className="flex items-center space-x-2 p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <div className="truncate">
                        <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block leading-none">
                          Nodal Officer
                        </span>
                        <span className="text-xs font-semibold text-slate-800 truncate block mt-0.5">
                          {org.nodal_officer}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Capabilities / Specializations */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono block mb-1.5">
                      Core Capabilities
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {specializationsList.slice(0, 3).map((spec, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200/60"
                        >
                          {spec}
                        </span>
                      ))}
                      {specializationsList.length > 3 && (
                        <span className="px-1.5 py-0.5 rounded-lg bg-slate-50 text-slate-400 text-[10px] font-bold">
                          +{specializationsList.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Operational Metrics Sub-card */}
                  <div className="grid grid-cols-3 gap-2 p-2.5 rounded-2xl bg-slate-50 border border-slate-200/70 text-center">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 font-mono block">
                        Teams
                      </span>
                      <span className="text-sm font-extrabold text-blue-700 font-mono">
                        {org.teams_count || 0}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 font-mono block">
                        Assets
                      </span>
                      <span className="text-sm font-extrabold text-amber-700 font-mono">
                        {org.resources_count || 0}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 font-mono block">
                        Drills
                      </span>
                      <span className="text-sm font-extrabold text-purple-700 font-mono">
                        {org.training_count || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Contacts & Action */}
                <div className="pt-4 mt-4 border-t border-slate-100 space-y-2">
                  <div className="space-y-1 text-xs text-slate-600">
                    {org.contact_phone && (
                      <div className="flex items-center space-x-2 truncate">
                        <Phone className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <a
                          href={`tel:${org.contact_phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="hover:text-blue-600 font-medium truncate"
                        >
                          {org.contact_phone}
                        </a>
                      </div>
                    )}
                    {org.contact_email && (
                      <div className="flex items-center space-x-2 truncate">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <a
                          href={`mailto:${org.contact_email}`}
                          onClick={(e) => e.stopPropagation()}
                          className="hover:text-blue-600 truncate"
                        >
                          {org.contact_email}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDossier(org);
                      }}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1 group-hover:translate-x-0.5 transition"
                    >
                      <span>Agency Dossier</span>
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={(e) => handleOpenEdit(org, e)}
                        className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition"
                        title="Edit Agency Profile"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOrgToDelete(org);
                          setShowDeleteModal(true);
                        }}
                        className="p-1.5 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600 transition"
                        title="Unlink Agency"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ================= ENTERPRISE TABLE VIEW ================= */
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[10px] uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Agency Details</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Nodal Officer</th>
                  <th className="py-3.5 px-4">24x7 Dispatch Hotline</th>
                  <th className="py-3.5 px-4 text-center">Teams</th>
                  <th className="py-3.5 px-4 text-center">Assets</th>
                  <th className="py-3.5 px-4 text-center">Drills</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredOrgs.map((org) => {
                  const badge = getTypeBadge(org.type);
                  return (
                    <tr
                      key={org.id}
                      onClick={() => handleOpenDossier(org)}
                      className="hover:bg-blue-50/40 transition cursor-pointer group"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 group-hover:text-blue-600 transition text-sm">
                          {org.name}
                        </div>
                        <div className="flex items-center space-x-1 text-slate-400 text-[11px] mt-0.5 font-medium">
                          <MapPin className="w-3 h-3 shrink-0" />
                          <span>{org.operating_region}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg text-[10px] font-bold border ${badge.bg}`}
                        >
                          <span>{badge.label}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-800 block">
                          {org.nodal_officer || 'Duty Officer'}
                        </span>
                        <span className="text-[10px] text-slate-400 truncate block">
                          {org.contact_email || '—'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-800">
                        {org.contact_phone ? (
                          <a
                            href={`tel:${org.contact_phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="hover:text-blue-600 flex items-center space-x-1"
                          >
                            <Phone className="w-3 h-3 text-blue-500" />
                            <span>{org.contact_phone}</span>
                          </a>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-blue-700">
                        {org.teams_count || 0}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-amber-700">
                        {org.resources_count || 0}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-purple-700">
                        {org.training_count || 0}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>Accredited</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDossier(org);
                            }}
                            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-blue-600 transition"
                            title="View Dossier"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => handleOpenEdit(org, e)}
                            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition"
                            title="Edit Agency"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOrgToDelete(org);
                              setShowDeleteModal(true);
                            }}
                            className="p-1.5 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600 transition"
                            title="Unlink"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= MODAL: IN-DEPTH AGENCY DOSSIER ================= */}
      {showDetailModal && selectedOrg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-float w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-scaleUp">
            {/* Modal Header Banner */}
            <div className="p-6 bg-slate-900 text-white flex items-start justify-between relative overflow-hidden">
              <div className="space-y-1.5 relative z-10">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 uppercase tracking-wider font-mono">
                    {selectedOrg.type}
                  </span>
                  <span className="flex items-center space-x-1 text-[11px] text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Accredited Response Partner</span>
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {selectedOrg.name}
                </h2>
                <p className="text-xs text-slate-300 flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>{selectedOrg.operating_region}</span>
                  {selectedOrg.established_year && (
                    <span>• Est. {selectedOrg.established_year}</span>
                  )}
                </p>
              </div>

              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition z-10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center space-x-1 px-6 pt-3 border-b border-slate-200 bg-slate-50 text-xs font-semibold">
              <button
                onClick={() => setDetailTab('overview')}
                className={`px-3.5 py-2.5 rounded-t-xl transition border-b-2 flex items-center space-x-1.5 ${
                  detailTab === 'overview'
                    ? 'border-blue-600 text-blue-700 bg-white font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Overview & Mandate</span>
              </button>
              <button
                onClick={() => setDetailTab('teams')}
                className={`px-3.5 py-2.5 rounded-t-xl transition border-b-2 flex items-center space-x-1.5 ${
                  detailTab === 'teams'
                    ? 'border-blue-600 text-blue-700 bg-white font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Response Units ({detailData?.teams?.length || selectedOrg.teams_count || 0})</span>
              </button>
              <button
                onClick={() => setDetailTab('resources')}
                className={`px-3.5 py-2.5 rounded-t-xl transition border-b-2 flex items-center space-x-1.5 ${
                  detailTab === 'resources'
                    ? 'border-blue-600 text-blue-700 bg-white font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Committed Logistics ({detailData?.resources?.length || selectedOrg.resources_count || 0})</span>
              </button>
              <button
                onClick={() => setDetailTab('trainings')}
                className={`px-3.5 py-2.5 rounded-t-xl transition border-b-2 flex items-center space-x-1.5 ${
                  detailTab === 'trainings'
                    ? 'border-blue-600 text-blue-700 bg-white font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Drills & Training ({detailData?.trainings?.length || selectedOrg.training_count || 0})</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs text-slate-700">
              {detailLoading ? (
                <div className="py-12 text-center">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-slate-500">Querying agency dossier...</p>
                </div>
              ) : detailTab === 'overview' ? (
                <div className="space-y-6">
                  {/* Quick Contact & Dispatch Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80">
                      <span className="text-[10px] uppercase font-bold text-blue-700 font-mono block">
                        24x7 Control Room
                      </span>
                      <p className="text-sm font-extrabold text-slate-900 mt-1 font-mono">
                        {selectedOrg.contact_phone || 'N/A'}
                      </p>
                      {selectedOrg.contact_phone && (
                        <a
                          href={`tel:${selectedOrg.contact_phone}`}
                          className="text-[11px] text-blue-700 font-bold hover:underline mt-1 inline-block"
                        >
                          Dial Hotline →
                        </a>
                      )}
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">
                        Official Dispatch
                      </span>
                      <p className="text-sm font-bold text-slate-900 mt-1 truncate">
                        {selectedOrg.contact_email || 'N/A'}
                      </p>
                      {selectedOrg.contact_email && (
                        <a
                          href={`mailto:${selectedOrg.contact_email}`}
                          className="text-[11px] text-slate-600 font-semibold hover:underline mt-1 inline-block"
                        >
                          Send SITREP →
                        </a>
                      )}
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">
                        Nodal Commander
                      </span>
                      <p className="text-sm font-bold text-slate-900 mt-1 truncate">
                        {selectedOrg.nodal_officer || 'Liaison Officer'}
                      </p>
                      <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-block">
                        Active on Duty
                      </span>
                    </div>
                  </div>

                  {/* Mandate & Specializations */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                      Operational Capabilities & Relief Scope
                    </h4>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 text-slate-700 space-y-2">
                      <p className="text-xs leading-relaxed">
                        Authorized by NDMA/SDMA under the Disaster Management Framework. Committed to emergency mobilization, rapid damage assessment, relief logistics, and community resilience drills.
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {(selectedOrg.specializations || '')
                          .split(',')
                          .map((s, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-xl bg-white text-slate-800 text-xs font-semibold border border-slate-200 shadow-sm"
                            >
                              {s.trim()}
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>

                  {/* Headquarters & Online Portals */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl border border-slate-200 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">
                        Headquarters Address
                      </span>
                      <p className="text-xs font-medium text-slate-800">
                        {selectedOrg.address || 'Civil Defense Compound, Regional Sector HQ'}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-200 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">
                        Web & Digital Portal
                      </span>
                      {selectedOrg.website ? (
                        <a
                          href={selectedOrg.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-semibold text-blue-600 hover:underline flex items-center space-x-1"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span className="truncate">{selectedOrg.website}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      ) : (
                        <p className="text-xs text-slate-400">Not provided</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : detailTab === 'teams' ? (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                    Associated Rapid Response Units
                  </h4>
                  {Array.isArray(detailData?.teams) && detailData.teams.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {detailData.teams.map((t) => (
                        <div
                          key={t.id}
                          className="p-3.5 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 text-sm">{t.name}</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                              {t.status || 'Available'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">
                            Specialization: <strong>{t.specialization || 'Rapid Rescue'}</strong>
                          </p>
                          <p className="text-xs text-slate-600">
                            Personnel Strength: <strong>{t.members_count || 10} certified members</strong>
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
                      <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="font-semibold text-slate-700">
                        {selectedOrg.teams_count || 0} teams currently registered on standby
                      </p>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        Units ready for deployment upon EOC incident dispatch request.
                      </p>
                    </div>
                  )}
                </div>
              ) : detailTab === 'resources' ? (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                    Committed Fleet & Emergency Assets
                  </h4>
                  {Array.isArray(detailData?.resources) && detailData.resources.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {detailData.resources.map((r) => (
                        <div
                          key={r.id}
                          className="p-3.5 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 text-sm">{r.name}</span>
                            <span className="text-xs font-mono font-bold text-blue-700">
                              Qty: {r.quantity || 1}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">
                            Type: <strong className="capitalize">{r.type}</strong> • Base: {r.location}
                          </p>
                          <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                            Status: {r.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
                      <Truck className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="font-semibold text-slate-700">
                        {selectedOrg.resources_count || 0} dedicated disaster response assets committed
                      </p>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        Includes inflatable rescue boats, emergency ambulances, and satellite communication units.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                    Disaster Preparedness & Mock Drills Track Record
                  </h4>
                  {Array.isArray(detailData?.trainings) && detailData.trainings.length > 0 ? (
                    <div className="space-y-2.5">
                      {detailData.trainings.map((t) => (
                        <div
                          key={t.id}
                          className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 text-sm">{t.title}</span>
                            <span className="text-xs font-mono font-bold text-purple-700">
                              {t.participants_count} Trained
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">
                            Conducted by <strong>{t.trainer_name}</strong> in {t.district}, {t.state} on {t.training_date}
                          </p>
                          <p className="text-xs text-slate-700 bg-purple-50/50 p-2 rounded-xl border border-purple-100">
                            <strong>Outcome:</strong> {t.outcome}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
                      <GraduationCap className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="font-semibold text-slate-700">
                        {selectedOrg.training_count || 0} certified drills logged in the system
                      </p>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        Training records can be logged directly from the Preparedness Drills module.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleOpenEdit(selectedOrg)}
                  className="px-4 py-2 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs border border-slate-200 transition flex items-center space-x-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              </div>

              <div className="flex items-center space-x-2">
                {selectedOrg.contact_phone && (
                  <a
                    href={`tel:${selectedOrg.contact_phone}`}
                    className="px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center space-x-1.5 shadow-sm"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Hotline</span>
                  </a>
                )}
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: REGISTER NEW AGENCY ================= */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-float w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-scaleUp">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2.5">
                <span className="p-2 rounded-xl bg-blue-100 text-blue-700">
                  <PlusCircle className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Register Response Agency / Partner NGO
                  </h3>
                  <p className="text-xs text-slate-500">
                    Accredit a new disaster response body into the state emergency network.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Agency Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NDRF 8th Battalion or Doctors Without Borders"
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Agency Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={registerForm.type}
                    onChange={(e) => setRegisterForm({ ...registerForm, type: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="government">Government / SDMA / DDMA</option>
                    <option value="military">NDRF / SDRF Armed Force</option>
                    <option value="ngo">Humanitarian Relief NGO</option>
                    <option value="medical">Medical / Hospital Network</option>
                    <option value="fire">Fire & Rescue Service</option>
                    <option value="police">Police Disaster Cell</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Nodal Officer Name & Rank
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Commandant R.K. Varma"
                    value={registerForm.nodal_officer}
                    onChange={(e) => setRegisterForm({ ...registerForm, nodal_officer: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Operating Jurisdiction / Region
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Haryana State, Rohtak, or North Zone"
                    value={registerForm.operating_region}
                    onChange={(e) => setRegisterForm({ ...registerForm, operating_region: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    24x7 Control Room Phone
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 0172-2560144 or 1070"
                    value={registerForm.contact_phone}
                    onChange={(e) => setRegisterForm({ ...registerForm, contact_phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Official Dispatch Email
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. response@agency.gov.in"
                    value={registerForm.contact_email}
                    onChange={(e) => setRegisterForm({ ...registerForm, contact_email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">
                    Headquarters Physical Address
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sector 6, Civil Secretariat, Panchkula"
                    value={registerForm.address}
                    onChange={(e) => setRegisterForm({ ...registerForm, address: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Official Website URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://agency.org"
                    value={registerForm.website}
                    onChange={(e) => setRegisterForm({ ...registerForm, website: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Established Year
                  </label>
                  <input
                    type="number"
                    value={registerForm.established_year}
                    onChange={(e) => setRegisterForm({ ...registerForm, established_year: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">
                    Core Specializations & Capabilities (comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Flood Evacuation, Urban SAR, First Aid, Food Packets, Dewatering"
                    value={registerForm.specializations}
                    onChange={(e) => setRegisterForm({ ...registerForm, specializations: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Initial Deployable Teams
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={registerForm.teams_count}
                    onChange={(e) => setRegisterForm({ ...registerForm, teams_count: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Initial Committed Assets
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={registerForm.resources_count}
                    onChange={(e) => setRegisterForm({ ...registerForm, resources_count: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={registerLoading}
                  className="px-5 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md flex items-center space-x-1.5"
                >
                  {registerLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Accredit & Register Agency</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT AGENCY ================= */}
      {showEditModal && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-float w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-scaleUp">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2">
                <Edit3 className="w-5 h-5 text-blue-600" />
                <h3 className="font-extrabold text-base text-slate-900">
                  Update Agency Record: {editForm.name}
                </h3>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
              <div className="space-y-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Agency Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Nodal Officer</label>
                    <input
                      type="text"
                      value={editForm.nodal_officer || ''}
                      onChange={(e) => setEditForm({ ...editForm, nodal_officer: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Operating Region</label>
                    <input
                      type="text"
                      value={editForm.operating_region || ''}
                      onChange={(e) => setEditForm({ ...editForm, operating_region: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">24x7 Hotline</label>
                    <input
                      type="text"
                      value={editForm.contact_phone || ''}
                      onChange={(e) => setEditForm({ ...editForm, contact_phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Dispatch Email</label>
                    <input
                      type="email"
                      value={editForm.contact_email || ''}
                      onChange={(e) => setEditForm({ ...editForm, contact_email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Headquarters Address</label>
                  <input
                    type="text"
                    value={editForm.address || ''}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Capabilities / Specializations</label>
                  <input
                    type="text"
                    value={editForm.specializations || ''}
                    onChange={(e) => setEditForm({ ...editForm, specializations: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Teams</label>
                    <input
                      type="number"
                      min="0"
                      value={editForm.teams_count || 0}
                      onChange={(e) => setEditForm({ ...editForm, teams_count: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Assets</label>
                    <input
                      type="number"
                      min="0"
                      value={editForm.resources_count || 0}
                      onChange={(e) => setEditForm({ ...editForm, resources_count: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Drills</label>
                    <input
                      type="number"
                      min="0"
                      value={editForm.training_count || 0}
                      onChange={(e) => setEditForm({ ...editForm, training_count: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-5 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md flex items-center space-x-1.5"
                >
                  {editLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: DELETE CONFIRMATION ================= */}
      {showDeleteModal && orgToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-float w-full max-w-md p-6 space-y-4 animate-scaleUp text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Unlink {orgToDelete.name}?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to remove this agency from the active coordination directory? Its associated records will be decoupled.
              </p>
            </div>
            <div className="flex items-center justify-center space-x-2.5 pt-2">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setOrgToDelete(null);
                }}
                className="px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleteLoading}
                className="px-5 py-2 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition flex items-center space-x-1.5"
              >
                {deleteLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>Confirm Unlink</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
