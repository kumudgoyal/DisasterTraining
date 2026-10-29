import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/common/Badge';
import {
  Home,
  Users,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  PlusCircle,
  Edit2,
  MapPin,
  Phone,
  Utensils,
  Droplet,
  HeartPulse,
  Zap,
  RefreshCw
} from 'lucide-react';

export default function ShelterPage() {
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [districtFilter, setDistrictFilter] = useState('');
  const [search, setSearch] = useState('');
  const { isAtLeast } = useAuth();

  // Occupancy modal
  const [editShelter, setEditShelter] = useState(null);
  const [newOccupancy, setNewOccupancy] = useState(0);

  // New shelter modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newShelter, setNewShelter] = useState({
    name: '',
    location_name: '',
    district: 'Rohtak',
    capacity: 400,
    current_occupancy: 0,
    food_available: true,
    water_available: true,
    medical_facility: false,
    electricity: true,
    toilets: 12,
    contact_person: '',
    contact_phone: '',
    latitude: 28.895,
    longitude: 76.58,
  });

  const fetchShelters = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (districtFilter) params.append('district', districtFilter);

    api.get(`/shelters?${params.toString()}`)
      .then((res) => {
        if (res?.success) setShelters(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error('Failed to fetch shelters:', err);
        setShelters([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchShelters();
  }, [districtFilter]);

  const handleUpdateOccupancy = async (e) => {
    e.preventDefault();
    if (!editShelter) return;
    try {
      await api.put(`/shelters/${editShelter.id}/occupancy`, {
        current_occupancy: parseInt(newOccupancy),
      });
      setEditShelter(null);
      fetchShelters();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateShelter = async (e) => {
    e.preventDefault();
    try {
      await api.post('/shelters', newShelter);
      setShowCreateModal(false);
      fetchShelters();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredShelters = shelters.filter((s) => {
    if (!search) return true;
    return (
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.district?.toLowerCase().includes(search.toLowerCase()) ||
      s.location_name?.toLowerCase().includes(search.toLowerCase())
    );
  });

  const totalCapacity = shelters.reduce((sum, s) => sum + (s.capacity || 0), 0);
  const totalOccupied = shelters.reduce((sum, s) => sum + (s.current_occupancy || 0), 0);
  const totalAvailable = Math.max(0, totalCapacity - totalOccupied);
  const globalOccupancyRate = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2.5">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Home className="w-5 h-5" />
            </span>
            <span>Shelter & Relief Center Management</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1.5 font-medium">
            Real-time occupancy tracking, capacity management, and provision of essential life-support facilities.
          </p>
        </div>

        {isAtLeast('District Admin') && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4 text-blue-400" />
            <span>Register New Shelter</span>
          </button>
        )}
      </div>

      {/* Aggregate Capacity KPI Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-slate-200/90 rounded-3xl shadow-sm">
          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Total Shelter Capacity</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{totalCapacity.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">{shelters.length} Facilities State-wide</p>
        </div>

        <div className="p-5 bg-white border border-slate-200/90 rounded-3xl shadow-sm">
          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Current Inmates / Occupied</p>
          <p className="text-2xl font-black text-amber-600 mt-1">{totalOccupied.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">{globalOccupancyRate}% Total Load</p>
        </div>

        <div className="p-5 bg-white border border-slate-200/90 rounded-3xl shadow-sm">
          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Available Vacancies</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{totalAvailable.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">Ready for Evacuees</p>
        </div>

        <div className="p-5 bg-white border border-slate-200/90 rounded-3xl shadow-sm">
          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Active Facilities</p>
          <p className="text-2xl font-black text-blue-600 mt-1">
            {shelters.filter((s) => s.status === 'active').length}
          </p>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">{shelters.filter((s) => s.status === 'full').length} at Full Capacity</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search shelter name or district..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl pl-9 pr-3.5 py-2 text-xs focus:outline-none focus:border-slate-400 transition"
          />
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 font-semibold rounded-xl px-3.5 py-2 text-xs focus:outline-none"
          >
            <option value="">All Districts</option>
            <option value="Rohtak">Rohtak</option>
            <option value="Karnal">Karnal</option>
            <option value="Panipat">Panipat</option>
            <option value="Hisar">Hisar</option>
            <option value="Sonipat">Sonipat</option>
            <option value="Faridabad">Faridabad</option>
            <option value="Gurugram">Gurugram</option>
            <option value="Ambala">Ambala</option>
          </select>

          <button
            onClick={fetchShelters}
            disabled={loading}
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-slate-900' : ''}`} />
          </button>
        </div>
      </div>

      {/* Shelters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full py-12 text-center text-xs text-slate-400 font-medium">Loading shelter facilities...</div>
        ) : !Array.isArray(filteredShelters) || filteredShelters.length === 0 ? (
          <div className="col-span-full py-12 text-center text-xs text-slate-500 bg-white rounded-3xl border border-slate-200/80 p-8">
            No shelters match the search criteria.
          </div>
        ) : (
          (filteredShelters || []).map((s) => {
            const occRate = s.capacity > 0 ? Math.round((s.current_occupancy / s.capacity) * 100) : 0;
            const available = Math.max(0, s.capacity - s.current_occupancy);

            return (
              <div
                key={s.id}
                className="bg-white border border-slate-200/90 rounded-3xl p-5 hover:border-slate-300 hover:shadow-md transition shadow-sm flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="font-bold text-sm text-slate-900">{s.name}</h3>
                    <StatusBadge status={s.status} />
                  </div>

                  <p className="text-xs text-slate-600 mt-2 flex items-center space-x-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{s.location_name || s.district}, {s.state || 'Haryana'}</span>
                  </p>

                  {/* Visual Capacity Bar */}
                  <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Capacity: <span className="text-slate-900 font-bold">{s.capacity}</span></span>
                      <span className="text-slate-500 font-medium">Occupied: <span className="text-amber-600 font-bold">{s.current_occupancy}</span></span>
                      <span className="text-slate-500 font-medium">Available: <span className="text-emerald-600 font-bold">{available}</span></span>
                    </div>

                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          occRate >= 90 ? 'bg-rose-500' : occRate >= 70 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, occRate)}%` }}
                      />
                    </div>
                  </div>

                  {/* Facilities Check icons */}
                  <div className="grid grid-cols-4 gap-1.5 mt-3 text-[11px] text-center font-medium">
                    <div className={`p-2 rounded-xl border flex flex-col items-center ${s.food_available ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                      <Utensils className="w-3.5 h-3.5 mb-1" />
                      <span>Food</span>
                    </div>
                    <div className={`p-2 rounded-xl border flex flex-col items-center ${s.water_available ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                      <Droplet className="w-3.5 h-3.5 mb-1" />
                      <span>Water</span>
                    </div>
                    <div className={`p-2 rounded-xl border flex flex-col items-center ${s.medical_facility ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                      <HeartPulse className="w-3.5 h-3.5 mb-1" />
                      <span>Medical</span>
                    </div>
                    <div className={`p-2 rounded-xl border flex flex-col items-center ${s.electricity ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                      <Zap className="w-3.5 h-3.5 mb-1" />
                      <span>Power</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="text-[11px] text-slate-600 font-medium flex items-center space-x-1.5">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{s.contact_person}: {s.contact_phone}</span>
                  </div>

                  {isAtLeast('Field Officer') && (
                    <button
                      onClick={() => {
                        setEditShelter(s);
                        setNewOccupancy(s.current_occupancy);
                      }}
                      className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-slate-50 hover:bg-slate-900 text-slate-700 hover:text-white border border-slate-200 text-[11px] font-semibold transition"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Update Count</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Update Occupancy */}
      {editShelter && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Update Shelter Headcount</h3>
            <p className="text-xs text-slate-600">
              {editShelter.name} (Max Capacity: {editShelter.capacity})
            </p>

            <form onSubmit={handleUpdateOccupancy} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current Occupant Count
                </label>
                <input
                  type="number"
                  min="0"
                  max={editShelter.capacity * 2}
                  required
                  value={newOccupancy}
                  onChange={(e) => setNewOccupancy(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-sm text-slate-900 rounded-xl p-2.5 focus:outline-none font-bold text-center"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditShelter(null)}
                  className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm"
                >
                  Save Count
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Register Shelter */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 space-y-4 my-8 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Register Emergency Shelter</h3>
            <form onSubmit={handleCreateShelter} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Shelter Facility Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Community Hall Sector 14"
                  value={newShelter.name}
                  onChange={(e) => setNewShelter({ ...newShelter, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-2.5 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">District</label>
                  <input
                    type="text"
                    value={newShelter.district}
                    onChange={(e) => setNewShelter({ ...newShelter, district: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-2.5 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Maximum Capacity *</label>
                  <input
                    type="number"
                    required
                    min="10"
                    value={newShelter.capacity}
                    onChange={(e) => setNewShelter({ ...newShelter, capacity: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-2.5 focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">In-charge Name</label>
                  <input
                    type="text"
                    placeholder="Officer name"
                    value={newShelter.contact_person}
                    onChange={(e) => setNewShelter({ ...newShelter, contact_person: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-2.5 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Helpline Contact Phone</label>
                  <input
                    type="text"
                    placeholder="Phone number"
                    value={newShelter.contact_phone}
                    onChange={(e) => setNewShelter({ ...newShelter, contact_phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-2.5 focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 grid grid-cols-2 gap-2.5 font-medium text-slate-700">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newShelter.food_available}
                    onChange={(e) => setNewShelter({ ...newShelter, food_available: e.target.checked })}
                    className="rounded border-slate-300 text-slate-900 focus:ring-0"
                  />
                  <span>Food Kitchen Available</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newShelter.water_available}
                    onChange={(e) => setNewShelter({ ...newShelter, water_available: e.target.checked })}
                    className="rounded border-slate-300 text-slate-900 focus:ring-0"
                  />
                  <span>Drinking Water Supply</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newShelter.medical_facility}
                    onChange={(e) => setNewShelter({ ...newShelter, medical_facility: e.target.checked })}
                    className="rounded border-slate-300 text-slate-900 focus:ring-0"
                  />
                  <span>Medical First Aid Post</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newShelter.electricity}
                    onChange={(e) => setNewShelter({ ...newShelter, electricity: e.target.checked })}
                    className="rounded border-slate-300 text-slate-900 focus:ring-0"
                  />
                  <span>Generator / Electricity</span>
                </label>
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
                  Register Shelter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
