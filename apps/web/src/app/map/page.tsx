"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { useState } from "react";
import { useTrainingMarkers } from "@/hooks/use-gis";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Filter, Map as MapIcon, SlidersHorizontal, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

// Dynamically import map without SSR to avoid window is not defined error
const MapComponent = dynamic(
  () => import("@/components/map/MapViewer"),
  { ssr: false, loading: () => <div className="w-full h-full min-h-[500px] flex items-center justify-center bg-gray-100 animate-pulse text-gray-500">Loading Map...</div> }
);

export default function MapPage() {
  const [filters, setFilters] = useState<{ status?: string, search?: string }>({});
  const { data, isLoading } = useTrainingMarkers(filters);
  const [showFilters, setShowFilters] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const applyFilters = () => {
    const newFilters: any = {};
    if (search) newFilters.search = search;
    if (status) newFilters.status = status;
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setFilters({});
  };

  return (
    <ProtectedLayout>
      <div className="space-y-4 h-[calc(100vh-8rem)] flex flex-col">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
              <MapIcon className="h-8 w-8 text-blue-600" /> GIS Mapping
            </h1>
            <p className="text-gray-500 mt-1">Geographic distribution of training programs</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden"
          >
            <Filter className="mr-2 h-4 w-4" /> Filters
          </Button>
        </div>

        <div className="flex-1 flex flex-col md:flex-row gap-4 overflow-hidden relative">
          {/* Map Filters Overlay / Sidebar */}
          <Card className={`
            md:w-80 flex-shrink-0 shadow-sm border-gray-200 h-full flex flex-col z-10
            absolute md:relative left-0 top-0 transition-transform duration-300
            ${showFilters ? 'translate-x-0' : '-translate-x-[110%] md:translate-x-0 md:hidden'}
          `}>
            <CardHeader className="pb-4 border-b border-gray-100">
              <CardTitle className="text-lg flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" /> Map Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4 overflow-y-auto">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search location or title..." 
                    className="pl-9"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full h-10 appearance-none rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="ACTIVE">Active</option>
                  <option value="UPCOMING">Upcoming</option>
                  <option value="PENDING">Pending</option>
                </select>
              </div>

              <div className="pt-4 flex flex-col gap-2">
                <Button onClick={applyFilters} className="w-full bg-blue-600 hover:bg-blue-700">
                  Apply Filters
                </Button>
                <Button variant="outline" onClick={clearFilters} className="w-full">
                  Clear
                </Button>
              </div>

              <div className="mt-8">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Map Legend</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-blue-500"></span>
                    <span>Active Training</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-green-500"></span>
                    <span>Completed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
                    <span>Upcoming</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Map Container */}
          <Card className="flex-1 flex flex-col overflow-hidden shadow-sm border-gray-200 relative z-0">
            <CardContent className="p-0 flex-1 relative">
              {isLoading && (
                <div className="absolute inset-0 z-[400] flex items-center justify-center bg-white/50 backdrop-blur-sm">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              )}
              
              {/* Optional: Results counter overlay */}
              <div className="absolute top-4 right-4 z-[400] bg-white px-3 py-1.5 rounded-full shadow-md text-sm font-medium text-gray-700 flex items-center gap-2 pointer-events-none">
                <MapPin className="h-4 w-4 text-blue-500" />
                {data?.length || 0} locations found
              </div>
              
              <MapComponent markers={data || []} />
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedLayout>
  );
}
