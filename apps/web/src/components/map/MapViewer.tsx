"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

// Fix leaflet default icons issue in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

export default function MapViewer({ markers = [] }: { markers: any[] }) {
  // Default center on India
  const center: [number, number] = [22.9, 79.8];
  
  return (
    <MapContainer center={center} zoom={5} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {markers.map((marker: any) => {
        if (!marker.latitude || !marker.longitude) return null;
        
        return (
          <Marker 
            key={marker.id} 
            position={[marker.latitude, marker.longitude]}
          >
            <Popup>
              <div className="p-1 space-y-2 max-w-[250px]">
                <h3 className="font-bold text-sm">{marker.title}</h3>
                <p className="text-xs text-gray-600">{marker.organization?.name}</p>
                <p className="text-xs">
                  {marker.startDate ? format(new Date(marker.startDate), 'MMM d, yyyy') : 'N/A'}
                </p>
                <span className={`inline-block px-2 py-1 text-[10px] font-semibold rounded-full ${
                  marker.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                  marker.status === 'ACTIVE' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {marker.status}
                </span>
                <div className="pt-2">
                  <Link href={`/trainings/${marker.id}`} passHref>
                    <Button size="sm" className="w-full h-7 text-xs">View Details</Button>
                  </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
