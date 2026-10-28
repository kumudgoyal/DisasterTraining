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
        if (res.success) setShelters(res.data);
      })
      .catch(console.error)
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <Home className="w-5 h-5 text-blue-500" />
            <span>Shelter & Relief Center Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time occupancy tracking, capacity management, and provision of essential life-support facilities.
          </p>
        </div>

        {isAtLeast('District Admin') && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Register New Shelter</span>
          </button>
        )}
      </div>

      {/* Aggregate Capacity KPI Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <p className="text-[10px] uppercase font-bold text-slate-400">Total Shelter Capacity</p>
          <p className="text-2xl font-bold text-slate-100 mt-1">{totalCapacity.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-0.5">{shelters.length} Facilities State-wide</p>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <p className="text-[10px] uppercase font-bold text-slate-400">Current Inmates / Occupied</p>
          <p className="text-2xl font-bold text-orange-400 mt-1">{totalOccupied.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-0.5">{globalOccupancyRate}% Total Load</p>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <p className="text-[10px] uppercase font-bold text-slate-400">Available Vacancies</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{totalAvailable.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-0.5">Ready for Evacuees</p>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <p className="text-[10px] uppercase font-bold text-slate-400">Active Facilities</p>
          <p className="text-2xl font-bold text-blue-400 mt-1">
            {shelters.filter((s) => s.status === 'active').length}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">{shelters.filter((s) => s.status === 'full').length} at Full Capacity</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search shelter name or district..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none"
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
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Shelters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full py-12 text-center text-xs text-slate-400">Loading shelter facilities...</div>
        ) : filteredShelters.length === 0 ? (
          <div className="col-span-full py-12 text-center text-xs text-slate-400">No shelters match the search criteria.</div>
        ) : (
          filteredShelters.map((s) => {
            const occRate = s.capacity > 0 ? Math.round((s.current_occupancy / s.capacity) * 100) : 0;
            const available = Math.max(0, s.capacity - s.current_occupancy);

            return (
              <div
                key={s.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition shadow-lg flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="font-bold text-sm text-slate-100">{s.name}</h3>
                    <StatusBadge status={s.status} />
                  </div>

                  <p className="text-xs text-slate-400 mt-2 flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{s.location_name || s.district}, {s.state || 'Haryana'}</span>
                  </p>

                  {/* Visual Capacity Bar */}
                  <div className="mt-4 p-3 rounded-lg bg-slate-850 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-semibold">Capacity: <span className="text-slate-200 font-bold">{s.capacity}</span></span>
                      <span className="text-slate-400 font-semibold">Occupied: <span className="text-orange-400 font-bold">{s.current_occupancy}</span></span>
                      <span className="text-slate-400 font-semibold">Available: <span className="text-emerald-400 font-bold">{available}</span></span>
                    </div>

                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          occRate >= 90 ? 'bg-red-500' : occRate >= 70 ? 'bg-orange-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, occRate)}%` }}
                      />
                    </div>
                  </div>

                  {/* Facilities Check icons */}
                  <div className="grid grid-cols-4 gap-1.5 mt-3 text-[11px] text-center">
                    <div className={`p-1.5 rounded-lg border flex flex-col items-center ${s.food_available ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-slate-800/40 border-slate-800 text-slate-500'}`}>
                      <Utensils className="w-3.5 h-3.5 mb-0.5" />
                      <span>Food</span>
                    </div>
                    <div className={`p-1.5 rounded-lg border flex flex-col items-center ${s.water_available ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-slate-800/40 border-slate-800 text-slate-500'}`}>
                      <Droplet className="w-3.5 h-3.5 mb-0.5" />
                      <span>Water</span>
                    </div>
                    <div className={`p-1.5 rounded-lg border flex flex-col items-center ${s.medical_facility ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-slate-800/40 border-slate-800 text-slate-500'}`}>
                      <HeartPulse className="w-3.5 h-3.5 mb-0.5" />
                      <span>Medical</span>
                    </div>
                    <div className={`p-1.5 rounded-lg border flex flex-col items-center ${s.electricity ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-slate-800/40 border-slate-800 text-slate-500'}`}>
                      <Zap className="w-3.5 h-3.5 mb-0.5" />
                      <span>Power</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <div className="text-[11px] text-slate-400 flex items-center space-x-1">
                    <Phone className="w-3 h-3 text-slate-500" />
                    <span>{s.contact_person}: {s.contact_phone}</span>
                  </div>

                  {isAtLeast('Field Officer') && (
                    <button
                      onClick={() => {
                        setEditShelter(s);
                        setNewOccupancy(s.current_occupancy);
                      }}
                      className="flex items-center space-x-1 px-2.5 py-1 rounded bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-[11px] font-semibold transition"
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-100">Update Shelter Headcount</h3>
            <p className="text-xs text-slate-400">
              {editShelter.name} (Max Capacity: {editShelter.capacity})
            </p>

            <form onSubmit={handleUpdateOccupancy} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Current Occupant Count
                </label>
                <input
                  type="number"
                  min="0"
                  max={editShelter.capacity * 2}
                  required
                  value={newOccupancy}
                  onChange={(e) => setNewOccupancy(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-sm text-slate-100 rounded-lg p-2.5 focus:outline-none font-bold text-center"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditShelter(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 my-8">
            <h3 className="text-base font-bold text-slate-100">Register Emergency Shelter</h3>
            <form onSubmit={handleCreateShelter} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Shelter Facility Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Community Hall Sector 14"
                  value={newShelter.name}
                  onChange={(e) => setNewShelter({ ...newShelter, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg p-2 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">District</label>
                  <input
                    type="text"
                    value={newShelter.district}
                    onChange={(e) => setNewShelter({ ...newShelter, district: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg p-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Maximum Capacity *</label>
                  <input
                    type="number"
                    required
                    min="10"
                    value={newShelter.capacity}
                    onChange={(e) => setNewShelter({ ...newShelter, capacity: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg p-2 focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">In-charge Name</label>
                  <input
                    type="text"
                    placeholder="Officer name"
                    value={newShelter.contact_person}
                    onChange={(e) => setNewShelter({ ...newShelter, contact_person: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg p-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Helpline Contact Phone</label>
                  <input
                    type="text"
                    placeholder="Phone number"
                    value={newShelter.contact_phone}
                    onChange={(e) => setNewShelter({ ...newShelter, contact_phone: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg p-2 focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-850 rounded-lg border border-slate-800 grid grid-cols-2 gap-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newShelter.food_available}
                    onChange={(e) => setNewShelter({ ...newShelter, food_available: e.target.checked })}
                    className="rounded bg-slate-800 border-slate-700 text-blue-600"
                  />
                  <span>Food Kitchen Available</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newShelter.water_available}
                    onChange={(e) => setNewShelter({ ...newShelter, water_available: e.target.checked })}
                    className="rounded bg-slate-800 border-slate-700 text-blue-600"
                  />
                  <span>Drinking Water Supply</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newShelter.medical_facility}
                    onChange={(e) => setNewShelter({ ...newShelter, medical_facility: e.target.checked })}
                    className="rounded bg-slate-800 border-slate-700 text-blue-600"
                  />
                  <span>Medical First Aid Post</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newShelter.electricity}
                    onChange={(e) => setNewShelter({ ...newShelter, electricity: e.target.checked })}
                    className="rounded bg-slate-800 border-slate-700 text-blue-600"
                  />
                  <span>Generator / Electricity</span>
                </label>
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
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold"
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
