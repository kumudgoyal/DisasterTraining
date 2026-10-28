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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <Truck className="w-5 h-5 text-indigo-400" />
            <span>Resource & Asset Coordination</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time logistical visibility: rescue boats, emergency food, ambulances, power generators, and medical packs.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center p-1 rounded-xl bg-slate-800 border border-slate-700/60 self-start sm:self-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'inventory' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Asset Registry ({resources.length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'requests' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pending Requests ({requests.filter((r) => r.status === 'pending').length})
          </button>
        </div>
      </div>

      {/* Inventory View */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex-1 min-w-[240px] relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search resource item, organization or depot location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none capitalize"
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
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <div className="col-span-full py-12 text-center text-xs text-slate-400">Loading resources...</div>
            ) : !Array.isArray(filteredResources) || filteredResources.length === 0 ? (
              <div className="col-span-full py-12 text-center text-xs text-slate-400">No resources found.</div>
            ) : (
              (filteredResources || []).map((res) => (
                <div
                  key={res.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition shadow-lg flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                          {res.type?.replace('_', ' ')}
                        </span>
                        <h3 className="font-bold text-sm text-slate-100 mt-0.5">{res.name}</h3>
                      </div>
                      <StatusBadge status={res.status} />
                    </div>

                    <div className="mt-3 space-y-2 text-xs text-slate-300">
                      <p className="text-[11px] text-slate-400 font-medium">
                        Depot: <span className="text-slate-200">{res.location}</span>
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium">
                        Owner: <span className="text-indigo-400">{res.organization_name || 'State Depot'}</span>
                      </p>

                      <div className="grid grid-cols-2 gap-2 p-2 rounded-lg bg-slate-850 border border-slate-800 text-center mt-3">
                        <div>
                          <p className="text-[10px] text-slate-400">Total Stock</p>
                          <p className="text-base font-bold text-slate-200">{res.quantity}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400">Available</p>
                          <p className={`text-base font-bold ${res.available_quantity > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {res.available_quantity}
                          </p>
                        </div>
                      </div>

                      {res.assigned_incident_title && (
                        <p className="text-[11px] text-amber-400 mt-2">
                          Deployed to: <span className="font-semibold">{res.assigned_incident_code} ({res.assigned_incident_title})</span>
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
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-100">Emergency Requisition Pipeline</h3>
              <p className="text-xs text-slate-400">Field requisitions requiring EOC allocation and fulfillment.</p>
            </div>
          </div>

          {!Array.isArray(requests) || requests.length === 0 ? (
            <p className="text-xs text-slate-400 py-8 text-center">No active resource requests.</p>
          ) : (
            <div className="divide-y divide-slate-800">
              {(requests || []).map((req) => (
                <div key={req.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-blue-400 font-bold">{req.incident_code}</span>
                      <span className="text-slate-400">•</span>
                      <span className="font-bold text-slate-200">{req.incident_title}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        req.urgency === 'critical' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'
                      }`}>
                        {req.urgency}
                      </span>
                    </div>

                    <p className="text-slate-300 font-semibold text-sm capitalize">
                      Requires: {req.quantity}x {req.resource_type.replace('_', ' ')}
                    </p>
                    <p className="text-[11px] text-slate-400">{req.description}</p>
                    <p className="text-[10px] text-slate-500">
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
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition flex items-center space-x-1"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-100">Fulfill Resource Requisition</h3>
            <div className="p-3 bg-slate-850 rounded-lg text-xs space-y-1">
              <p className="font-bold text-slate-200">{selectedRequest.incident_code}: {selectedRequest.incident_title}</p>
              <p className="text-blue-400">Requirement: {selectedRequest.quantity}x {selectedRequest.resource_type}</p>
              <p className="text-slate-400 text-[11px]">{selectedRequest.description}</p>
            </div>

            <form onSubmit={handleAssignResource} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Select Matching Stock in Inventory
                </label>
                {matchingAvailableResources.length === 0 ? (
                  <p className="text-xs text-red-400 py-2">
                    No available {selectedRequest.resource_type} items with stock &gt; 0 currently in registry.
                  </p>
                ) : (
                  <select
                    value={allocatingResourceId}
                    onChange={(e) => setAllocatingResourceId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-xs text-slate-100 rounded-lg p-2.5 focus:outline-none"
                  >
                    {matchingAvailableResources.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} ({r.available_quantity} available at {r.location})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedRequest(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={matchingAvailableResources.length === 0}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold disabled:opacity-50"
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
