import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import api from '../api/client';
import { SeverityBadge, StatusBadge } from '../components/common/Badge';
import { DISASTER_ICONS, SEVERITY_COLORS } from '../utils/constants';
import {
  Layers,
  Filter,
  Flame,
  Home,
  ShieldAlert,
  Truck,
  Users,
  AlertTriangle,
  GraduationCap,
  RefreshCw,
  Search,
  ExternalLink,
  Info
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Custom DivIcons for Leaflet
function createCustomIcon(emoji, bgHex, isCritical = false) {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background-color: ${bgHex};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.5);
        border: 2px solid #ffffff;
        ${isCritical ? 'animation: pulse-ring 1.5s infinite;' : ''}
      ">
        ${emoji}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
  });
}

function FlyToLocation({ target }) {
  const map = useMap();
  useEffect(() => {
    if (target) {
      map.flyTo([target.lat, target.lng], 12, { duration: 1.5 });
    }
  }, [target, map]);
  return null;
}

export default function MapPage() {
  const [layers, setLayers] = useState({
    incidents: true,
    shelters: true,
    teams: true,
    resources: false,
    alerts: true,
    trainings: false,
  });

  const [gisData, setGisData] = useState({
    incidents: [],
    shelters: [],
    teams: [],
    resources: [],
    alerts: [],
    trainings: [],
  });

  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [flyTarget, setFlyTarget] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchGisLayers = () => {
    setLoading(true);
    api.get('/gis/layers')
      .then((res) => {
        if (res?.success && res.data) {
          setGisData({
            incidents: Array.isArray(res.data.incidents) ? res.data.incidents : [],
            shelters: Array.isArray(res.data.shelters) ? res.data.shelters : [],
            resources: Array.isArray(res.data.resources) ? res.data.resources : [],
            teams: Array.isArray(res.data.teams) ? res.data.teams : [],
            alerts: Array.isArray(res.data.alerts) ? res.data.alerts : [],
            damage_reports: Array.isArray(res.data.damage_reports) ? res.data.damage_reports : [],
            trainings: Array.isArray(res.data.trainings) ? res.data.trainings : [],
          });
        }
      })
      .catch((err) => {
        console.error('GIS layer fetch error:', err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchGisLayers();
  }, []);

  // Filtered incidents
  const filteredIncidents = (Array.isArray(gisData?.incidents) ? gisData.incidents : []).filter((inc) => {
    if (severityFilter !== 'all' && inc.severity !== severityFilter) return false;
    if (typeFilter !== 'all' && inc.disaster_type !== typeFilter) return false;
    return true;
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Search across incidents and shelters
    const match =
      gisData.incidents.find((i) => i.title.toLowerCase().includes(searchQuery.toLowerCase()) || i.location_name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      gisData.shelters.find((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.district?.toLowerCase().includes(searchQuery.toLowerCase()));

    if (match && match.latitude && match.longitude) {
      setFlyTarget({ lat: match.latitude, lng: match.longitude });
      setSelectedItem(match);
    }
  };

  // Center on Haryana / North India
  const defaultCenter = [29.0588, 76.0856];

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col space-y-3">
      {/* Control Toolbar */}
      <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Layer Toggles */}
        <div className="flex items-center space-x-2 sm:space-x-4 overflow-x-auto py-1">
          <span className="font-bold text-slate-400 flex items-center space-x-1 shrink-0">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>LAYERS:</span>
          </span>

          <label className="flex items-center space-x-1.5 cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={layers.incidents}
              onChange={(e) => setLayers({ ...layers, incidents: e.target.checked })}
              className="rounded bg-slate-800 border-slate-700 text-red-600 focus:ring-0"
            />
            <span className="text-slate-200">Disasters ({filteredIncidents.length})</span>
          </label>

          <label className="flex items-center space-x-1.5 cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={layers.shelters}
              onChange={(e) => setLayers({ ...layers, shelters: e.target.checked })}
              className="rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-0"
            />
            <span className="text-slate-200">Shelters ({gisData.shelters.length})</span>
          </label>

          <label className="flex items-center space-x-1.5 cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={layers.teams}
              onChange={(e) => setLayers({ ...layers, teams: e.target.checked })}
              className="rounded bg-slate-800 border-slate-700 text-emerald-600 focus:ring-0"
            />
            <span className="text-slate-200">Response Teams ({gisData.teams.length})</span>
          </label>

          <label className="flex items-center space-x-1.5 cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={layers.resources}
              onChange={(e) => setLayers({ ...layers, resources: e.target.checked })}
              className="rounded bg-slate-800 border-slate-700 text-purple-600 focus:ring-0"
            />
            <span className="text-slate-200">Assets ({gisData.resources.length})</span>
          </label>

          <label className="flex items-center space-x-1.5 cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={layers.alerts}
              onChange={(e) => setLayers({ ...layers, alerts: e.target.checked })}
              className="rounded bg-slate-800 border-slate-700 text-amber-600 focus:ring-0"
            />
            <span className="text-slate-200">Alert Zones ({gisData.alerts.length})</span>
          </label>

          <label className="flex items-center space-x-1.5 cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={layers.trainings}
              onChange={(e) => setLayers({ ...layers, trainings: e.target.checked })}
              className="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-0"
            />
            <span className="text-slate-200">Drills ({gisData.trainings.length})</span>
          </label>
        </div>

        {/* Filters & Search */}
        <div className="flex items-center space-x-2 shrink-0">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
          >
            <option value="all">All Severities</option>
            <option value="critical">🔴 Critical</option>
            <option value="high">🟠 High</option>
            <option value="moderate">🟡 Moderate</option>
            <option value="low">🟢 Low</option>
          </select>

          <form onSubmit={handleSearch} className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5" />
            <input
              type="text"
              placeholder="Search district / incident..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg pl-8 pr-2 py-1.5 text-xs w-44 sm:w-56 focus:outline-none focus:border-blue-500"
            />
          </form>

          <button
            onClick={fetchGisLayers}
            disabled={loading}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            title="Refresh map layers"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Map Body & Side Detail Panel */}
      <div className="flex-1 rounded-2xl overflow-hidden border border-slate-800 relative shadow-2xl flex">
        <MapContainer
          center={defaultCenter}
          zoom={8}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          {flyTarget && <FlyToLocation target={flyTarget} />}

          {/* CartoDB Dark Matter Tiles for Emergency Operations Room Feel */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          {/* 1. Incident Markers */}
          {layers.incidents &&
            (filteredIncidents || []).map((inc) => {
              const isCrit = inc.severity === 'critical';
              const icon = createCustomIcon(
                inc.disaster_icon || DISASTER_ICONS[inc.disaster_type] || '⚠️',
                SEVERITY_COLORS[inc.severity]?.hex || '#ef4444',
                isCrit
              );

              return (
                <Marker
                  key={`inc-${inc.id}`}
                  position={[inc.latitude, inc.longitude]}
                  icon={icon}
                  eventHandlers={{
                    click: () => setSelectedItem({ ...inc, type_entity: 'incident' }),
                  }}
                >
                  <Popup>
                    <div className="p-1 space-y-1.5 max-w-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold text-blue-400">{inc.incident_id}</span>
                        <SeverityBadge severity={inc.severity} />
                      </div>
                      <h4 className="font-bold text-xs text-white leading-tight">{inc.title}</h4>
                      <p className="text-[11px] text-slate-300">{inc.location_name}</p>
                      <div className="flex justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-700">
                        <span>Affected: {inc.estimated_affected?.toLocaleString() || 0}</span>
                        <span>Evacuated: {inc.evacuated?.toLocaleString() || 0}</span>
                      </div>
                      <Link
                        to={`/incidents/${inc.id}`}
                        className="block mt-2 text-center py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-[11px] font-bold"
                      >
                        Open Incident Console
                      </Link>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

          {/* 2. Shelter Markers */}
          {layers.shelters &&
            (gisData?.shelters || []).map((s) => {
              const occRate = s.occupancy_pct || 0;
              const colorHex = occRate >= 90 ? '#ef4444' : occRate >= 70 ? '#f97316' : '#10b981';
              const icon = createCustomIcon('🏠', colorHex);

              return (
                <Marker
                  key={`sh-${s.id}`}
                  position={[s.latitude, s.longitude]}
                  icon={icon}
                  eventHandlers={{
                    click: () => setSelectedItem({ ...s, type_entity: 'shelter' }),
                  }}
                >
                  <Popup>
                    <div className="p-1 space-y-1.5 max-w-xs">
                      <h4 className="font-bold text-xs text-white">{s.name}</h4>
                      <p className="text-[11px] text-slate-300">{s.location_name || s.district}</p>
                      <div className="space-y-1 text-[11px] text-slate-300">
                        <div className="flex justify-between">
                          <span>Capacity:</span>
                          <span className="font-bold">{s.current_occupancy} / {s.capacity} ({occRate}%)</span>
                        </div>
                        <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${occRate >= 90 ? 'bg-red-500' : occRate >= 70 ? 'bg-orange-500' : 'bg-emerald-500'}`}
                            style={{ width: `${Math.min(100, occRate)}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-[10px] text-slate-400 pt-1 border-t border-slate-700">
                        <span>Food: {s.food_available ? '✅' : '❌'}</span>
                        <span>Water: {s.water_available ? '✅' : '❌'}</span>
                        <span>Med: {s.medical_facility ? '✅' : '❌'}</span>
                      </div>
                      <p className="text-[10px] text-slate-400">Contact: {s.contact_person} ({s.contact_phone})</p>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

          {/* 3. Response Teams */}
          {layers.teams &&
            (gisData?.teams || []).map((t) => {
              const icon = createCustomIcon('🛡️', '#0284c7');
              return (
                <Marker
                  key={`tm-${t.id}`}
                  position={[t.latitude, t.longitude]}
                  icon={icon}
                >
                  <Popup>
                    <div className="p-1 text-xs text-white space-y-1">
                      <h4 className="font-bold">{t.name}</h4>
                      <p className="text-[11px] text-blue-400">{t.organization_name} • {t.members_count} members</p>
                      <p className="text-[11px] text-slate-300">Spec: {t.specialization}</p>
                      <StatusBadge status={t.status} />
                    </div>
                  </Popup>
                </Marker>
              );
            })}

          {/* 4. Resources */}
          {layers.resources &&
            (gisData?.resources || []).map((r) => {
              const icon = createCustomIcon('📦', '#a855f7');
              return (
                <Marker
                  key={`rc-${r.id}`}
                  position={[r.latitude, r.longitude]}
                  icon={icon}
                >
                  <Popup>
                    <div className="p-1 text-xs text-white space-y-1">
                      <h4 className="font-bold">{r.name}</h4>
                      <p className="text-[11px] text-purple-400">{r.type} (Qty: {r.available_quantity}/{r.quantity})</p>
                      <p className="text-[11px] text-slate-300">{r.location}</p>
                      <StatusBadge status={r.status} />
                    </div>
                  </Popup>
                </Marker>
              );
            })}

          {/* 5. Alerts Radius Circles */}
          {layers.alerts &&
            (gisData?.alerts || []).map((al) => {
              const radiusMeters = (al.radius_km || 25) * 1000;
              const isCrit = al.severity === 'critical';
              return (
                <Circle
                  key={`al-${al.id}`}
                  center={[al.latitude, al.longitude]}
                  radius={radiusMeters}
                  pathOptions={{
                    color: isCrit ? '#ef4444' : '#f59e0b',
                    fillColor: isCrit ? '#ef4444' : '#f59e0b',
                    fillOpacity: 0.15,
                    dashArray: '6, 6',
                  }}
                >
                  <Popup>
                    <div className="p-1 text-xs text-white space-y-1">
                      <span className="font-bold text-red-400 uppercase text-[10px]">ALERT BROADCAST</span>
                      <h4 className="font-bold">{al.title}</h4>
                      <p className="text-[11px] text-slate-300">{al.message}</p>
                      <p className="text-[10px] text-slate-400">Radius: {al.radius_km} km • Area: {al.affected_area}</p>
                    </div>
                  </Popup>
                </Circle>
              );
            })}

          {/* 6. Training Activities */}
          {layers.trainings &&
            (gisData?.trainings || []).map((tr) => {
              const icon = createCustomIcon('🎓', '#6366f1');
              return (
                <Marker
                  key={`tr-${tr.id}`}
                  position={[tr.latitude, tr.longitude]}
                  icon={icon}
                >
                  <Popup>
                    <div className="p-1 text-xs text-white space-y-1">
                      <h4 className="font-bold">{tr.title}</h4>
                      <p className="text-[11px] text-indigo-400">{tr.district} • {tr.participants_count} Trained</p>
                      <p className="text-[10px] text-slate-400">Trainer: {tr.trainer_name}</p>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
        </MapContainer>

        {/* Legend Overlay */}
        <div className="absolute bottom-4 left-4 z-[1000] bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 shadow-xl pointer-events-auto space-y-1.5 hidden md:block">
          <p className="font-bold text-slate-200 text-xs border-b border-slate-800 pb-1">GIS Map Legend</p>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-red-600 animate-pulse"></span>
            <span>Critical Incident (Flood, Fire, Collapse)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-orange-500"></span>
            <span>High Severity Disaster</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span>Safe Emergency Shelter</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            <span>NDRF/SDRF Response Team</span>
          </div>
        </div>
      </div>
    </div>
  );
}
