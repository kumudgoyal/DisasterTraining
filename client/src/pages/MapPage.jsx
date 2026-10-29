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
import { createGpsPin } from '../utils/mapPins';

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
  const [mapStyle, setMapStyle] = useState('osm'); // 'osm' | 'satellite' | 'topo'

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
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      {/* Control Toolbar */}
      <div className="bg-white border border-ink-100/80 p-4 rounded-3xl shadow-soft flex flex-wrap items-center justify-between gap-4 text-xs">
        {/* Layer Toggles */}
        <div className="flex items-center space-x-2 sm:space-x-4 overflow-x-auto py-1">
          <span className="font-mono text-[10px] font-bold text-ink-400 uppercase tracking-wider flex items-center space-x-1 shrink-0">
            <Layers className="w-3.5 h-3.5 text-ink-600" />
            <span>LAYERS:</span>
          </span>

          <label className="flex items-center space-x-2 cursor-pointer shrink-0 px-3 py-1.5 rounded-full bg-cream-50 hover:bg-cream-100 border border-ink-100/60 transition">
            <input
              type="checkbox"
              checked={layers.incidents}
              onChange={(e) => setLayers({ ...layers, incidents: e.target.checked })}
              className="rounded text-rose-600 focus:ring-0"
            />
            <span className="text-ink-800 font-semibold">Hazards ({filteredIncidents.length})</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer shrink-0 px-3 py-1.5 rounded-full bg-cream-50 hover:bg-cream-100 border border-ink-100/60 transition">
            <input
              type="checkbox"
              checked={layers.shelters}
              onChange={(e) => setLayers({ ...layers, shelters: e.target.checked })}
              className="rounded text-emerald-600 focus:ring-0"
            />
            <span className="text-ink-800 font-semibold">Shelters ({gisData.shelters.length})</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer shrink-0 px-3 py-1.5 rounded-full bg-cream-50 hover:bg-cream-100 border border-ink-100/60 transition">
            <input
              type="checkbox"
              checked={layers.teams}
              onChange={(e) => setLayers({ ...layers, teams: e.target.checked })}
              className="rounded text-blue-600 focus:ring-0"
            />
            <span className="text-ink-800 font-semibold">Teams ({gisData.teams.length})</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer shrink-0 px-3 py-1.5 rounded-full bg-cream-50 hover:bg-cream-100 border border-ink-100/60 transition">
            <input
              type="checkbox"
              checked={layers.resources}
              onChange={(e) => setLayers({ ...layers, resources: e.target.checked })}
              className="rounded text-purple-600 focus:ring-0"
            />
            <span className="text-ink-800 font-semibold">Assets ({gisData.resources.length})</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer shrink-0 px-3 py-1.5 rounded-full bg-cream-50 hover:bg-cream-100 border border-ink-100/60 transition">
            <input
              type="checkbox"
              checked={layers.alerts}
              onChange={(e) => setLayers({ ...layers, alerts: e.target.checked })}
              className="rounded text-amber-600 focus:ring-0"
            />
            <span className="text-ink-800 font-semibold">Alerts ({gisData.alerts.length})</span>
          </label>
        </div>

        {/* Filters & Search */}
        <div className="flex items-center space-x-2.5 shrink-0">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-cream-50 border border-ink-100 text-ink-800 font-semibold rounded-full px-3.5 py-2 text-xs focus:outline-none"
          >
            <option value="all">All Severities</option>
            <option value="critical">🔴 Critical</option>
            <option value="high">🟠 High</option>
            <option value="moderate">🟡 Moderate</option>
            <option value="low">🟢 Low</option>
          </select>

          <select
            value={mapStyle}
            onChange={(e) => setMapStyle(e.target.value)}
            className="bg-cream-50 border border-ink-100 text-ink-800 font-semibold rounded-full px-3.5 py-2 text-xs focus:outline-none"
            title="Base Map Provider"
          >
            <option value="osm">🗺️ OpenStreetMap (Free)</option>
            <option value="satellite">🛰️ ESRI Satellite (Free)</option>
            <option value="topo">⛰️ OpenTopoMap (Free)</option>
          </select>

          <form onSubmit={handleSearch} className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-ink-400 absolute left-3" />
            <input
              type="text"
              placeholder="Search district / incident..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-cream-50 border border-ink-100 text-ink-900 rounded-full pl-9 pr-3 py-2 text-xs w-44 sm:w-56 focus:outline-none focus:bg-white focus:border-ink-400"
            />
          </form>

          <button
            onClick={fetchGisLayers}
            disabled={loading}
            className="p-2 rounded-full bg-cream-50 hover:bg-cream-100 text-ink-600 border border-ink-100 shadow-sm"
            title="Refresh map layers"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Map Body & Side Detail Panel */}
      <div className="flex-1 rounded-3xl overflow-hidden border border-ink-100/80 relative shadow-soft flex bg-white">
        <MapContainer
          center={defaultCenter}
          zoom={8}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          {flyTarget && <FlyToLocation target={flyTarget} />}

          {/* 100% Free Tile Providers (No API Key Required) */}
          {mapStyle === 'osm' && (
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
            />
          )}

          {mapStyle === 'satellite' && (
            <TileLayer
              attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxZoom={18}
            />
          )}

          {mapStyle === 'topo' && (
            <TileLayer
              attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
              url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
              maxZoom={17}
            />
          )}

          {/* 1. Incident Markers */}
          {layers.incidents &&
            (filteredIncidents || []).map((inc) => {
              const isCrit = inc.severity === 'critical';
              const colorHex = SEVERITY_COLORS[inc.severity]?.hex || '#ef4444';
              const icon = createGpsPin({
                type: inc.disaster_type || 'Warning',
                color: colorHex,
                isCritical: isCrit,
                size: isCrit ? 42 : 36,
              });

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
              const icon = createGpsPin({
                type: 'Shelter',
                color: colorHex,
                badgeText: `${occRate}%`,
                size: 36,
              });

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
              const icon = createGpsPin({
                type: 'Team',
                color: '#0284c7',
                size: 36,
              });

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
              const icon = createGpsPin({
                type: 'Resource',
                color: '#a855f7',
                size: 34,
              });

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
              const icon = createGpsPin({
                type: 'Training',
                color: '#6366f1',
                size: 34,
              });
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
        <div className="absolute bottom-4 left-4 z-[1000] bg-slate-900/95 backdrop-blur-md p-3.5 rounded-xl border border-slate-700/80 text-[11px] text-slate-300 shadow-2xl pointer-events-auto space-y-2 hidden md:block max-w-[280px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <p className="font-bold text-slate-100 text-xs tracking-wide">EOC Operations Legend</p>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">GPS PINS</span>
          </div>
          <div className="flex items-center space-x-2.5">
            <span className="w-3.5 h-3.5 rounded-full bg-red-600 ring-2 ring-red-400 animate-pulse shrink-0"></span>
            <span>Critical Hazard (Flood, Fire, Collapse)</span>
          </div>
          <div className="flex items-center space-x-2.5">
            <span className="w-3.5 h-3.5 rounded-full bg-orange-500 ring-1 ring-orange-300 shrink-0"></span>
            <span>High Severity Disaster</span>
          </div>
          <div className="flex items-center space-x-2.5">
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 ring-1 ring-emerald-300 shrink-0"></span>
            <span>Emergency Relief Shelter (Occupancy %)</span>
          </div>
          <div className="flex items-center space-x-2.5">
            <span className="w-3.5 h-3.5 rounded-full bg-sky-500 ring-1 ring-sky-300 shrink-0"></span>
            <span>NDRF / SDRF Strike Teams</span>
          </div>
          <div className="flex items-center space-x-2.5">
            <span className="w-3.5 h-3.5 rounded-full bg-purple-500 ring-1 ring-purple-300 shrink-0"></span>
            <span>Mobilized Disaster Relief Assets</span>
          </div>
        </div>
      </div>
    </div>
  );
}
