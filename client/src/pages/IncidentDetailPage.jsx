import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { SeverityBadge, StatusBadge } from '../components/common/Badge';
import { DISASTER_ICONS } from '../utils/constants';
import {
  Flame,
  MapPin,
  Clock,
  ShieldCheck,
  Truck,
  FileText,
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  PlusCircle,
  Users,
  HeartPulse,
  Send,
  Building,
  RefreshCw,
  Printer
} from 'lucide-react';

export default function IncidentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAtLeast } = useAuth();

  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // overview, teams, resources, field, damage

  // Update modal
  const [showLogModal, setShowLogModal] = useState(false);
  const [logText, setLogText] = useState('');
  const [logType, setLogType] = useState('info');

  // Assign team modal
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [availableTeams, setAvailableTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState('');

  // Request resource modal
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [resourceType, setResourceType] = useState('boat');
  const [resourceQuantity, setResourceQuantity] = useState('2');
  const [resourceUrgency, setResourceUrgency] = useState('high');
  const [resourceDesc, setResourceDesc] = useState('');

  const fetchIncidentDetail = () => {
    setLoading(true);
    api.get(`/incidents/${id}`)
      .then((res) => {
        if (res.success) setIncident(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchIncidentDetail();
  }, [id]);

  const handleAddLog = async (e) => {
    e.preventDefault();
    if (!logText.trim()) return;
    try {
      await api.post(`/incidents/${id}/updates`, {
        update_text: logText,
        update_type: logType,
      });
      setLogText('');
      setShowLogModal(false);
      fetchIncidentDetail();
    } catch (err) {
      console.error(err);
    }
  };

  const handleVerify = async (status) => {
    try {
      await api.put(`/incidents/${id}/verify`, { verification_status: status });
      fetchIncidentDetail();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await api.put(`/incidents/${id}`, { status: newStatus });
      fetchIncidentDetail();
    } catch (err) {
      console.error(err);
    }
  };

  const openTeamAssignModal = async () => {
    try {
      const res = await api.get('/response-teams?status=available');
      if (res.success) {
        setAvailableTeams(res.data);
        if (res.data.length > 0) setSelectedTeamId(res.data[0].id);
      }
      setShowTeamModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssignTeam = async (e) => {
    e.preventDefault();
    if (!selectedTeamId) return;
    try {
      await api.put(`/incidents/${id}/assign-team`, { team_id: parseInt(selectedTeamId) });
      setShowTeamModal(false);
      fetchIncidentDetail();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRequestResource = async (e) => {
    e.preventDefault();
    try {
      await api.post('/resources/requests', {
        incident_id: id,
        resource_type: resourceType,
        quantity: parseInt(resourceQuantity),
        urgency: resourceUrgency,
        description: resourceDesc,
      });
      setShowResourceModal(false);
      setResourceDesc('');
      fetchIncidentDetail();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-xs text-slate-400">
        Loading incident control console...
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="py-16 text-center text-xs text-slate-400">
        Incident not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <button
          onClick={() => navigate('/incidents')}
          className="flex items-center space-x-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Incidents</span>
        </button>

        <div className="flex items-center space-x-2">
          {isAtLeast('EOC Operator') && incident.verification_status !== 'verified' && (
            <button
              onClick={() => handleVerify('verified')}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Verify Incident</span>
            </button>
          )}

          {isAtLeast('Field Officer') && (
            <button
              onClick={() => setShowLogModal(true)}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add SITREP Update</span>
            </button>
          )}

          <button
            onClick={() => window.print()}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Incident Summary Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-3xl">
              {incident.disaster_icon || DISASTER_ICONS[incident.disaster_type] || '⚠️'}
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <span className="font-mono text-sm font-bold text-blue-400">{incident.incident_id}</span>
                <span className="text-slate-500">•</span>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{incident.disaster_type}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-100 mt-1">{incident.title}</h1>
              <div className="flex items-center space-x-3 text-xs text-slate-400 mt-2 flex-wrap gap-y-1">
                <span className="flex items-center space-x-1 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{incident.location_name || 'Rohtak'} ({incident.affected_districts})</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Detected: {new Date(incident.detected_at || incident.created_at).toLocaleString()}</span>
                </span>
                <span>•</span>
                <span>Reported By: {incident.reported_by_name || 'SEOC Staff'}</span>
              </div>
            </div>
          </div>

          <div className="flex md:flex-col items-center md:items-end justify-between gap-2 shrink-0">
            <div className="flex items-center space-x-2">
              <SeverityBadge severity={incident.severity} />
              <StatusBadge status={incident.status} />
            </div>

            {isAtLeast('EOC Operator') && (
              <div className="mt-2">
                <select
                  value={incident.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1 focus:outline-none"
                >
                  <option value="reported">Status: Reported</option>
                  <option value="verified">Status: Verified</option>
                  <option value="responding">Status: Responding</option>
                  <option value="contained">Status: Contained</option>
                  <option value="resolved">Status: Resolved</option>
                  <option value="closed">Status: Closed</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Casualty / Impact Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6">
          <div className="p-3 bg-slate-850 rounded-xl border border-slate-800 text-center">
            <p className="text-[10px] uppercase font-bold text-slate-400">Affected</p>
            <p className="text-lg font-bold text-slate-100 mt-0.5">{incident.estimated_affected?.toLocaleString() || 0}</p>
          </div>
          <div className="p-3 bg-slate-850 rounded-xl border border-slate-800 text-center">
            <p className="text-[10px] uppercase font-bold text-slate-400">Evacuated</p>
            <p className="text-lg font-bold text-emerald-400 mt-0.5">{incident.evacuated?.toLocaleString() || 0}</p>
          </div>
          <div className="p-3 bg-slate-850 rounded-xl border border-slate-800 text-center">
            <p className="text-[10px] uppercase font-bold text-slate-400">Casualties</p>
            <p className="text-lg font-bold text-red-400 mt-0.5">{incident.casualties || 0}</p>
          </div>
          <div className="p-3 bg-slate-850 rounded-xl border border-slate-800 text-center">
            <p className="text-[10px] uppercase font-bold text-slate-400">Injured</p>
            <p className="text-lg font-bold text-orange-400 mt-0.5">{incident.injured || 0}</p>
          </div>
          <div className="p-3 bg-slate-850 rounded-xl border border-slate-800 text-center">
            <p className="text-[10px] uppercase font-bold text-slate-400">Missing</p>
            <p className="text-lg font-bold text-amber-400 mt-0.5">{incident.missing_persons || 0}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 text-xs font-semibold space-x-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-2.5 px-3 border-b-2 transition ${
            activeTab === 'overview'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Timeline & Log ({incident.updates?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('teams')}
          className={`pb-2.5 px-3 border-b-2 transition ${
            activeTab === 'teams'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Deployed Strike Teams ({incident.teams?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('resources')}
          className={`pb-2.5 px-3 border-b-2 transition ${
            activeTab === 'resources'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Resource Allocation ({incident.resourceRequests?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('field')}
          className={`pb-2.5 px-3 border-b-2 transition ${
            activeTab === 'field'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Field Reports ({incident.fieldReports?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('damage')}
          className={`pb-2.5 px-3 border-b-2 transition ${
            activeTab === 'damage'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Damage Assessment ({incident.damageReports?.length || 0})
        </button>
      </div>

      {/* Tab Panels */}
      {/* 1. Timeline Tab */}
      {activeTab === 'overview' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-slate-100">Operational Log & Incident Chronology</h3>
            {isAtLeast('Volunteer') && (
              <button
                onClick={() => setShowLogModal(true)}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
              >
                + Add Entry
              </button>
            )}
          </div>

          <div className="relative border-l border-slate-800 ml-4 space-y-6 py-2">
            {incident.updates?.map((up) => (
              <div key={up.id} className="relative pl-6">
                <span className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-slate-900"></span>
                <div className="text-xs text-slate-400 flex items-center space-x-2">
                  <span className="font-semibold text-slate-200">{up.user_name || 'EOC Official'}</span>
                  <span>•</span>
                  <span>{new Date(up.created_at).toLocaleString()}</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-800 text-slate-400 uppercase font-mono">
                    {up.update_type}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-100 font-medium">{up.update_text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Teams Tab */}
      {activeTab === 'teams' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-slate-100">Assigned Response Teams</h3>
            {isAtLeast('EOC Operator') && (
              <button
                onClick={openTeamAssignModal}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Deploy Additional Team</span>
              </button>
            )}
          </div>

          {incident.teams?.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No response teams assigned to this incident yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {incident.teams.map((tm) => (
                <div key={tm.id} className="p-4 rounded-xl bg-slate-850 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-100">{tm.name}</span>
                    <StatusBadge status={tm.status} />
                  </div>
                  <p className="text-xs text-blue-400 font-semibold">{tm.organization_name} • {tm.members_count} Operatives</p>
                  <p className="text-xs text-slate-300">Specialization: {tm.specialization}</p>
                  <p className="text-[11px] text-slate-400">Lead Contact: {tm.contact_person} ({tm.contact_phone})</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. Resources Tab */}
      {activeTab === 'resources' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-slate-100">Resource Requests & Fulfillment</h3>
            {isAtLeast('Field Officer') && (
              <button
                onClick={() => setShowResourceModal(true)}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Request Asset / Supplies</span>
              </button>
            )}
          </div>

          {incident.resourceRequests?.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No resource requests filed.</p>
          ) : (
            <div className="divide-y divide-slate-800">
              {incident.resourceRequests.map((req) => (
                <div key={req.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-200 capitalize">
                      {req.quantity}x {req.resource_type.replace('_', ' ')}
                    </span>
                    <p className="text-slate-400 text-[11px] mt-0.5">{req.description || 'Emergency requirement on ground'}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      req.urgency === 'critical' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'
                    }`}>
                      {req.urgency}
                    </span>
                    <StatusBadge status={req.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. Field Reports Tab */}
      {activeTab === 'field' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-slate-100">Live Field Observations</h3>
            <Link
              to={`/field-report?incident_id=${id}`}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
            >
              + Submit Field Report
            </Link>
          </div>

          {incident.fieldReports?.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No field reports submitted for this incident.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {incident.fieldReports.map((fr) => (
                <div key={fr.id} className="p-4 rounded-xl bg-slate-850 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-blue-400">{fr.report_id}</span>
                    <SeverityBadge severity={fr.severity} />
                  </div>
                  <p className="text-xs font-bold text-slate-200 capitalize">{fr.report_type.replace('_', ' ')}</p>
                  <p className="text-xs text-slate-300">{fr.description}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-800">
                    <span>By: {fr.submitted_by_name || 'Field Officer'}</span>
                    <span>{new Date(fr.created_at).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. Damage Reports Tab */}
      {activeTab === 'damage' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-slate-100">Post-Disaster Damage & Loss Records</h3>
            <Link
              to={`/damage-assessment?incident_id=${id}`}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
            >
              + Log Damage
            </Link>
          </div>

          {incident.damageReports?.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No damage reports linked.</p>
          ) : (
            <div className="divide-y divide-slate-800">
              {incident.damageReports.map((dr) => (
                <div key={dr.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="font-bold text-slate-200 capitalize">
                      {dr.infrastructure_type} — {dr.damage_level}
                    </span>
                    <p className="text-slate-400 text-[11px] mt-0.5">{dr.description}</p>
                  </div>
                  <div className="flex items-center space-x-3 shrink-0">
                    <span className="font-bold text-amber-400">₹{(dr.estimated_loss / 10000000).toFixed(2)} Cr</span>
                    <StatusBadge status={dr.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal: Add Log Entry */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-100">Add Situation Log Update</h3>
            <form onSubmit={handleAddLog} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Update Type</label>
                <select
                  value={logType}
                  onChange={(e) => setLogType(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-xs text-slate-100 rounded-lg p-2 focus:outline-none"
                >
                  <option value="info">General Info</option>
                  <option value="casualty">Casualty / Medical Update</option>
                  <option value="resource">Resource Status</option>
                  <option value="team">Team Movement</option>
                  <option value="resolution">Containment / Resolution</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Log Message</label>
                <textarea
                  required
                  rows={3}
                  value={logText}
                  onChange={(e) => setLogText(e.target.value)}
                  placeholder="Enter verifiable on-ground situation update..."
                  className="w-full bg-slate-800 border border-slate-700 text-xs text-slate-100 rounded-lg p-2 focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30"
                >
                  Commit Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Assign Response Team */}
      {showTeamModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-100">Deploy Response Team</h3>
            <form onSubmit={handleAssignTeam} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Select Available Team</label>
                {availableTeams.length === 0 ? (
                  <p className="text-xs text-amber-400 py-2">No response teams currently available in reserve.</p>
                ) : (
                  <select
                    value={selectedTeamId}
                    onChange={(e) => setSelectedTeamId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-xs text-slate-100 rounded-lg p-2 focus:outline-none"
                  >
                    {availableTeams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.type?.toUpperCase()} - {t.members_count} pax, {t.specialization})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTeamModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={availableTeams.length === 0}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold disabled:opacity-50"
                >
                  Dispatch Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Request Resource */}
      {showResourceModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-100">File Resource Requisition</h3>
            <form onSubmit={handleRequestResource} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Resource Item Type</label>
                <select
                  value={resourceType}
                  onChange={(e) => setResourceType(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-xs text-slate-100 rounded-lg p-2 focus:outline-none"
                >
                  <option value="boat">Rescue Boats</option>
                  <option value="ambulance">Ambulances</option>
                  <option value="food">Emergency Food Packets</option>
                  <option value="water">Drinking Water Tankers</option>
                  <option value="generator">Power Generators</option>
                  <option value="medical_supplies">Trauma / Medical Kits</option>
                  <option value="rescue_equipment">Heavy Cutting & Rescue Gear</option>
                  <option value="tent">Shelter Tents</option>
                  <option value="blanket">Warm Blankets</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Quantity Needed</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={resourceQuantity}
                    onChange={(e) => setResourceQuantity(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-xs text-slate-100 rounded-lg p-2 focus:outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Urgency</label>
                  <select
                    value={resourceUrgency}
                    onChange={(e) => setResourceUrgency(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-xs text-slate-100 rounded-lg p-2 focus:outline-none font-bold text-red-400"
                  >
                    <option value="critical">Critical (Immediate)</option>
                    <option value="high">High (&lt; 4 hours)</option>
                    <option value="medium">Medium (&lt; 12 hours)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Specific Need / Notes</label>
                <textarea
                  rows={2}
                  value={resourceDesc}
                  onChange={(e) => setResourceDesc(e.target.value)}
                  placeholder="Specify delivery point or special operational requirement..."
                  className="w-full bg-slate-800 border border-slate-700 text-xs text-slate-100 rounded-lg p-2 focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResourceModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                >
                  Submit Requisition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
