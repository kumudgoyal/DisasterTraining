"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { useState } from "react";
import { useGISMarkers } from "@/hooks/use-gis";
import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// Dynamically import map without SSR to avoid window is not defined error
const MapComponent = dynamic(
  () => import("@/components/map/MapViewer"),
  { ssr: false, loading: () => <div className="w-full h-full min-h-[500px] flex items-center justify-center bg-gray-100 animate-pulse text-gray-500">Loading Map...</div> }
);

export default function MapPage() {
  const [filters, setFilters] = useState({});
  const { data, isLoading } = useGISMarkers(filters);

  return (
    <ProtectedLayout>
      <div className="space-y-4 h-[calc(100vh-8rem)] flex flex-col">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">GIS Mapping</h1>
          <p className="text-gray-500">Geographic distribution of training programs</p>
        </div>

        <Card className="flex-1 flex flex-col overflow-hidden">
          <CardContent className="p-0 flex-1 relative">
            <MapComponent markers={data || []} />
          </CardContent>
        </Card>
      </div>
    </ProtectedLayout>
  );
}
