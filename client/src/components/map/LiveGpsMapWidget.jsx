import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { DISASTER_ICONS, SEVERITY_COLORS } from '../../utils/constants';
import { SeverityBadge, StatusBadge } from '../common/Badge';
import { Maximize2, RefreshCw, Layers } from 'lucide-react';
import { createGpsPin } from '../../utils/mapPins';

export default function LiveGpsMapWidget({ className = "h-96" }) {
  const [gisData, setGisData] = useState({
    incidents: [],
    shelters: [],
    teams: [],
  });
  const [loading, setLoading] = useState(true);
  const [tileMode, setTileMode] = useState('osm'); // 'osm' or 'carto'

  const fetchLayers = () => {
    setLoading(true);
    api.get('/gis/layers')
      .then((res) => {
        if (res?.success && res.data) {
          setGisData({
            incidents: Array.isArray(res.data.incidents) ? res.data.incidents : [],
            shelters: Array.isArray(res.data.shelters) ? res.data.shelters : [],
            teams: Array.isArray(res.data.teams) ? res.data.teams : [],
          });
        }
      })
      .catch((err) => console.error('Live GPS map load error:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLayers();
  }, []);

  const defaultCenter = [29.0588, 76.0856]; // State center

  return (
    <div className="bg-white rounded-3xl border border-ink-100/80 shadow-soft overflow-hidden flex flex-col">
      {/* Header bar */}
      <div className="p-5 border-b border-cream-100 flex items-center justify-between bg-white z-10">
        <div className="flex items-center space-x-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="font-bold text-ink-900 text-sm">Live Operations Map</h3>
          <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-cream-100 text-ink-600 border border-ink-100">
            OpenStreetMap Free
          </span>
        </div>

        <div className="flex items-center space-x-2.5 text-xs">
          {/* Tile Toggle */}
          <button
            onClick={() => setTileMode(prev => prev === 'osm' ? 'satellite' : 'osm')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-cream-50 hover:bg-cream-100 text-ink-700 border border-ink-100 transition text-[11px] font-semibold"
            title="Toggle Map Style"
          >
            <Layers className="w-3.5 h-3.5 text-ink-500" />
            <span>{tileMode === 'osm' ? 'OpenStreetMap' : 'Satellite'}</span>
          </button>

          <button
            onClick={fetchLayers}
            disabled={loading}
            className="p-2 rounded-full bg-cream-50 hover:bg-cream-100 text-ink-600 border border-ink-100 transition"
            title="Refresh map points"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <Link
            to="/map"
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-ink-900 hover:bg-ink-800 text-white font-bold text-[11px] transition shadow-pill"
          >
            <Maximize2 className="w-3 h-3 text-cream-100" />
            <span>Full Map</span>
          </Link>
        </div>
      </div>

      {/* Real Map Canvas */}
      <div className={`relative w-full ${className}`}>
        <MapContainer
          center={defaultCenter}
          zoom={8}
          scrollWheelZoom={false}
          className="w-full h-full"
        >
          {tileMode === 'osm' ? (
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
            />
          ) : (
            <TileLayer
              attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxZoom={18}
            />
          )}

          {/* Active Incidents with pulsing critical indicators */}
          {gisData.incidents.map((inc) => {
            const isCrit = inc.severity === 'critical';
            const colorHex = SEVERITY_COLORS[inc.severity]?.hex || '#ef4444';
            const icon = createGpsPin({
              type: inc.disaster_type || 'Warning',
              color: colorHex,
              isCritical: isCrit,
              size: isCrit ? 38 : 32,
            });

            return (
              <React.Fragment key={`widget-inc-${inc.id}`}>
                <Marker position={[inc.latitude, inc.longitude]} icon={icon}>
                  <Popup>
                    <div className="p-1 space-y-1.5 text-xs text-slate-100 max-w-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold text-blue-400">{inc.incident_id}</span>
                        <SeverityBadge severity={inc.severity} />
                      </div>
                      <h4 className="font-bold text-sm text-slate-100">{inc.title}</h4>
                      <p className="text-[11px] text-slate-300">{inc.description}</p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-700">
                        <span>{inc.location_name}</span>
                        <span>{inc.estimated_affected ? `${inc.estimated_affected.toLocaleString()} affected` : 'Assessing'}</span>
                      </div>
                      <div className="pt-1">
                        <Link to={`/incidents/${inc.id}`} className="text-blue-400 hover:text-blue-300 font-bold text-[10px] underline">
                          Open Incident Console →
                        </Link>
                      </div>
                    </div>
                  </Popup>
                </Marker>

                {isCrit && (
                  <Circle
                    center={[inc.latitude, inc.longitude]}
                    radius={15000}
                    pathOptions={{
                      color: '#ef4444',
                      fillColor: '#ef4444',
                      fillOpacity: 0.12,
                      dashArray: '4, 4',
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}

          {/* Shelters */}
          {gisData.shelters.map((s) => {
            const occ = s.capacity ? Math.round(((s.current_occupancy || 0) / s.capacity) * 100) : 0;
            return (
              <Marker
                key={`widget-sh-${s.id}`}
                position={[s.latitude, s.longitude]}
                icon={createGpsPin({
                  type: 'Shelter',
                  color: '#10b981',
                  badgeText: `${occ}%`,
                  size: 32,
                })}
              >
                <Popup>
                  <div className="p-1 text-xs text-slate-100 space-y-1">
                    <span className="font-bold text-emerald-400 text-[10px] uppercase">Relief Shelter</span>
                    <h4 className="font-bold text-sm">{s.name}</h4>
                    <p className="text-[11px] text-slate-300">{s.location_name || s.district}</p>
                    <p className="text-[10px] text-emerald-400 font-semibold">
                      Capacity: {s.current_occupancy || 0} / {s.capacity} occupied
                    </p>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Response Teams */}
          {gisData.teams.map((tm) => (
            <Marker
              key={`widget-tm-${tm.id}`}
              position={[tm.latitude, tm.longitude]}
              icon={createGpsPin({
                type: 'Team',
                color: '#0284c7',
                size: 32,
              })}
            >
              <Popup>
                <div className="p-1 text-xs text-slate-100 space-y-1">
                  <span className="font-bold text-blue-400 text-[10px] uppercase">Strike Response Team</span>
                  <h4 className="font-bold text-sm">{tm.name}</h4>
                  <p className="text-[11px] text-slate-300">{tm.organization_name} • {tm.leader_name}</p>
                  <p className="text-[10px] text-slate-400">{tm.members_count} personnel deployed</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Floating Mini Overlay Legend */}
        <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl border border-ink-100 text-[11px] text-ink-700 space-y-1.5 pointer-events-auto shadow-float">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
            <span className="font-medium">Hazards ({gisData.incidents.length})</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="font-medium">Shelters ({gisData.shelters.length})</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span className="font-medium">Teams ({gisData.teams.length})</span>
          </div>
        </div>
      </div>
    </div>
  );
}
