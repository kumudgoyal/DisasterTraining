"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MAP_LOCATIONS } from "@/services/mockData";
import { Badge } from "@/components/ui/badge";
import { fetchNasaEvents, NasaEvent } from "@/services/nasaEonet";

// Fix for default marker icons in Next.js/Leaflet
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const NasaIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function DashboardMapInner() {
  const [events, setEvents] = useState<NasaEvent[]>([]);

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await fetchNasaEvents(50);
        setEvents(data.events);
      } catch (err) {
        console.error("Failed to load NASA events for map:", err);
      }
    }
    loadEvents();
  }, []);

  return (
    <MapContainer center={[22.9010, 79.8573]} zoom={5} scrollWheelZoom={false} style={{ height: "100%", width: "100%", zIndex: 0 }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Mock NDRF/SDRF Training Data */}
      {MAP_LOCATIONS.map((loc) => (
        <Marker key={loc.id} position={[loc.lat, loc.lng]}>
          <Popup className="rounded-lg shadow-md border-0">
            <div className="min-w-[200px] p-1">
              <h4 className="font-bold text-sm mb-1">{loc.title}</h4>
              <p className="text-xs text-slate-500 mb-2">District: {loc.district} • Organizer: {loc.organizer}</p>
              
              <div className="grid grid-cols-2 gap-2 mb-2 text-xs">
                <div className="bg-slate-50 p-1.5 rounded">
                  <span className="block text-slate-500">Participants</span>
                  <span className="font-semibold">{loc.participants}</span>
                </div>
                <div className="bg-slate-50 p-1.5 rounded">
                  <span className="block text-slate-500">Attendance</span>
                  <span className="font-semibold">{loc.attendance}%</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-100">
                <span className="text-xs text-slate-400">{loc.date}</span>
                <Badge variant="outline" className="text-[10px] h-4 py-0 text-blue-600 border-blue-200 bg-blue-50">
                  {loc.status}
                </Badge>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Live NASA EONET Events */}
      {events.map((event) => {
        const geo = event.geometry[0];
        if (!geo || !geo.coordinates) return null;
        // GeoJSON coordinates are [longitude, latitude]
        const lat = geo.coordinates[1];
        const lng = geo.coordinates[0];

        return (
          <Marker key={event.id} position={[lat, lng]} icon={NasaIcon}>
            <Popup className="rounded-lg shadow-md border-0">
              <div className="min-w-[200px] p-1">
                <h4 className="font-bold text-sm mb-1 text-red-600">{event.title}</h4>
                <p className="text-xs text-slate-500 mb-2">Category: {event.categories[0]?.title || "Unknown"}</p>
                <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-100">
                  <span className="text-xs text-slate-400">{new Date(geo.date).toLocaleDateString()}</span>
                  <Badge variant="outline" className="text-[10px] h-4 py-0 text-red-600 border-red-200 bg-red-50">
                    Active Alert
                  </Badge>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
