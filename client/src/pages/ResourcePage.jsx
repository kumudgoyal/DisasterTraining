import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/common/Badge';
import {
  Truck,
  PlusCircle,
  Search,
  Filter,
  CheckCircle,
  Package,
  Layers,
  ArrowRight,
  Shield,
  RefreshCw,
  SlidersHorizontal
} from 'lucide-react';

export default function ResourcePage() {
  const [resources, setResources] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('inventory'); // inventory | requests
  const [typeFilter, setTypeFilter] = useState('');
  const [search, setSearch] = useState('');
  const { isAtLeast } = useAuth();

  // Allocation modal
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [allocatingResourceId, setAllocatingResourceId] = useState('');

  const fetchData = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (typeFilter) params.append('type', typeFilter);

    Promise.all([
      api.get(`/resources?${params.toString()}`).catch(() => ({ success: false })),
      api.get('/resources/requests/all').catch(() => ({ success: false })),
    ])
      .then(([resRes, reqRes]) => {
        if (resRes?.success) setResources(Array.isArray(resRes.data) ? resRes.data : []);
        if (reqRes?.success) setRequests(Array.isArray(reqRes.data) ? reqRes.data : []);
      })
      .catch((err) => {
        console.error('Failed to fetch resource data:', err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [typeFilter]);

  const handleAssignResource = async (e) => {
    e.preventDefault();
    if (!selectedRequest || !allocatingResourceId) return;
    try {
      await api.put(`/resources/requests/${selectedRequest.id}/assign`, {
        resource_id: parseInt(allocatingResourceId),
      });
      setSelectedRequest(null);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredResources = resources.filter((r) => {
    if (!search) return true;
    return (
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.type.toLowerCase().includes(search.toLowerCase()) ||
      r.location?.toLowerCase().includes(search.toLowerCase())
    );
  });

  const matchingAvailableResources = selectedRequest
    ? resources.filter((r) => r.type === selectedRequest.resource_type && r.available_quantity > 0)
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2.5">
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Truck className="w-5 h-5" />
            </span>
            <span>Resource & Asset Coordination</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1.5 font-medium">
            Real-time logistical visibility: rescue boats, emergency food, ambulances, power generators, and medical packs.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center p-1 rounded-full bg-slate-100 border border-slate-200 self-start sm:self-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-1.5 rounded-full transition ${
              activeTab === 'inventory' ? 'bg-slate-900 text-white font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Asset Registry ({resources.length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-1.5 rounded-full transition ${
              activeTab === 'requests' ? 'bg-slate-900 text-white font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pending Requests ({requests.filter((r) => r.status === 'pending').length})
          </button>
        </div>
      </div>

      {/* Inventory View */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex-1 min-w-[240px] relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search resource item, organization or depot location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl pl-9 pr-3.5 py-2 text-xs focus:outline-none focus:border-slate-400 transition"
              />
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-800 font-semibold rounded-xl px-3.5 py-2 text-xs focus:outline-none capitalize"
              >
                <option value="">All Categories</option>
                <option value="boat">Rescue Boats</option>
                <option value="ambulance">Ambulances</option>
                <option value="rescue_vehicle">Rescue Vehicles</option>
                <option value="medical_supplies">Medical Supplies</option>
                <option value="food">Food Packets</option>
                <option value="water">Water Tankers</option>
                <option value="generator">Generators</option>
                <option value="tent">Shelter Tents</option>
                <option value="blanket">Warm Blankets</option>
              </select>

              <button
                onClick={fetchData}
                disabled={loading}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-slate-900' : ''}`} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <div className="col-span-full py-12 text-center text-xs text-slate-400 font-medium">Loading resources...</div>
            ) : !Array.isArray(filteredResources) || filteredResources.length === 0 ? (
              <div className="col-span-full py-12 text-center text-xs text-slate-500 bg-white rounded-3xl border border-slate-200/80 p-8">
                No resources found.
              </div>
            ) : (
              (filteredResources || []).map((res) => (
                <div
                  key={res.id}
                  className="bg-white border border-slate-200/90 rounded-3xl p-5 hover:border-slate-300 hover:shadow-md transition shadow-sm flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                          {res.type?.replace('_', ' ')}
                        </span>
                        <h3 className="font-bold text-sm text-slate-900 mt-0.5">{res.name}</h3>
                      </div>
                      <StatusBadge status={res.status} />
                    </div>

                    <div className="mt-3.5 space-y-2 text-xs text-slate-600">
                      <p className="text-[11px] font-medium">
                        Depot: <span className="text-slate-900 font-semibold">{res.location}</span>
                      </p>
                      <p className="text-[11px] font-medium">
                        Owner: <span className="text-indigo-600 font-semibold">{res.organization_name || 'State Depot'}</span>
                      </p>

                      <div className="grid grid-cols-2 gap-2 p-2.5 rounded-2xl bg-slate-50 border border-slate-200/60 text-center mt-3">
                        <div>
                          <p className="text-[10px] text-slate-500 font-semibold">Total Stock</p>
                          <p className="text-base font-bold text-slate-900">{res.quantity}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 font-semibold">Available</p>
                          <p className={`text-base font-bold ${res.available_quantity > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {res.available_quantity}
                          </p>
                        </div>
                      </div>

                      {res.assigned_incident_title && (
                        <p className="text-[11px] text-amber-700 font-medium mt-2 p-2 rounded-xl bg-amber-50 border border-amber-200/60">
                          Deployed to: <span className="font-bold">{res.assigned_incident_code} ({res.assigned_incident_title})</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Requests View */}
      {activeTab === 'requests' && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Emergency Requisition Pipeline</h3>
              <p className="text-xs text-slate-500 font-medium">Field requisitions requiring EOC allocation and fulfillment.</p>
            </div>
          </div>

          {!Array.isArray(requests) || requests.length === 0 ? (
            <p className="text-xs text-slate-400 py-8 text-center font-medium">No active resource requests.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {(requests || []).map((req) => (
                <div key={req.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-slate-900 font-bold">{req.incident_code}</span>
                      <span className="text-slate-300">•</span>
                      <span className="font-bold text-slate-900">{req.incident_title}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        req.urgency === 'critical' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {req.urgency}
                      </span>
                    </div>

                    <p className="text-slate-900 font-bold text-sm capitalize">
                      Requires: {req.quantity}x {req.resource_type.replace('_', ' ')}
                    </p>
                    <p className="text-[11px] text-slate-600 font-medium">{req.description}</p>
                    <p className="text-[10px] text-slate-400">
                      Filed by: {req.requested_by_name || 'Field Officer'} on {new Date(req.created_at).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <StatusBadge status={req.status} />

                    {isAtLeast('EOC Operator') && req.status === 'pending' && (
                      <button
                        onClick={() => {
                          setSelectedRequest(req);
                          const matching = resources.find((r) => r.type === req.resource_type && r.available_quantity > 0);
                          if (matching) setAllocatingResourceId(matching.id);
                        }}
                        className="px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition flex items-center space-x-1.5"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Allocate Asset</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Allocation Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Fulfill Resource Requisition</h3>
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/60 text-xs space-y-1">
              <p className="font-bold text-slate-900">{selectedRequest.incident_code}: {selectedRequest.incident_title}</p>
              <p className="text-indigo-600 font-semibold">Requirement: {selectedRequest.quantity}x {selectedRequest.resource_type}</p>
              <p className="text-slate-600 text-[11px]">{selectedRequest.description}</p>
            </div>

            <form onSubmit={handleAssignResource} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Matching Stock in Inventory
                </label>
                {matchingAvailableResources.length === 0 ? (
                  <p className="text-xs text-rose-600 py-2 font-medium">
                    No available {selectedRequest.resource_type} items with stock &gt; 0 currently in registry.
                  </p>
                ) : (
                  <select
                    value={allocatingResourceId}
                    onChange={(e) => setAllocatingResourceId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-xl p-2.5 focus:outline-none font-medium"
                  >
                    {matchingAvailableResources.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} ({r.available_quantity} available at {r.location})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedRequest(null)}
                  className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={matchingAvailableResources.length === 0}
                  className="px-5 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm disabled:opacity-40"
                >
                  Confirm Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
