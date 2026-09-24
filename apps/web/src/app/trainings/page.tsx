"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { useTrainings } from "@/hooks/use-trainings";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Search, Plus, Filter, SlidersHorizontal, ChevronLeft, ChevronRight, FileDown } from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function TrainingsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const limit = 10;
  
  const { data, isLoading } = useTrainings({ page, limit, search });
  const allTrainings = data?.data || [];
  
  // Local filtering for demonstration (assuming API doesn't support state/status filter directly if not in useTrainings hook)
  const trainings = allTrainings.filter((t: any) => {
    let match = true;
    if (statusFilter && t.status !== statusFilter) match = false;
    if (stateFilter && t.state !== stateFilter) match = false;
    return match;
  });

  const totalPages = data?.totalPages || 1;

  const canManage = true; // All authenticated users can create trainings

  const states = Array.from(new Set(allTrainings.map((t: any) => t.state).filter(Boolean)));
  const statuses = ['COMPLETED', 'ACTIVE', 'UPCOMING', 'PENDING'];

  return (
    <ProtectedLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Trainings Directory</h1>
            <p className="text-gray-500 mt-1">Manage and monitor all disaster management training programs</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="text-gray-600">
              <FileDown className="mr-2 h-4 w-4" /> Export
            </Button>
            {canManage && (
              <Button onClick={() => router.push('/trainings/new')} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" /> New Training
              </Button>
            )}
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search trainings by title..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-gray-50 border-gray-200 focus-visible:ring-blue-500"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-10 w-full sm:w-40 appearance-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Statuses</option>
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <SlidersHorizontal className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={stateFilter}
                  onChange={(e) => setStateFilter(e.target.value)}
                  className="h-10 w-full sm:w-40 appearance-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All States</option>
                  {states.map(s => <option key={s as string} value={s as string}>{s as string}</option>)}
                </select>
                <MapPinIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              {(statusFilter || stateFilter) && (
                <Button 
                  variant="ghost" 
                  onClick={() => { setStatusFilter(""); setStateFilter(""); }}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="p-8 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-50 animate-pulse rounded-lg border border-gray-100" />
              ))}
            </div>
          ) : trainings.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-50/80">
                    <TableRow className="border-b-gray-200 hover:bg-transparent">
                      <TableHead className="py-4 font-semibold text-gray-900">Training Title</TableHead>
                      <TableHead className="py-4 font-semibold text-gray-900">Organization</TableHead>
                      <TableHead className="py-4 font-semibold text-gray-900">Location</TableHead>
                      <TableHead className="py-4 font-semibold text-gray-900">Schedule</TableHead>
                      <TableHead className="py-4 font-semibold text-gray-900">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trainings.map((t: any) => (
                      <TableRow 
                        key={t.id} 
                        className="cursor-pointer border-b-gray-100 hover:bg-blue-50/50 transition-colors"
                        onClick={() => router.push(`/trainings/${t.id}`)}
                      >
                        <TableCell className="py-4 font-medium text-gray-900">
                          {t.title}
                        </TableCell>
                        <TableCell className="py-4 text-gray-600">
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-md bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                              {t.organization?.name?.charAt(0) || '-'}
                            </div>
                            {t.organization?.name || 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell className="py-4 text-gray-600">
                          <div className="flex flex-col">
                            <span>{t.district}</span>
                            <span className="text-xs text-gray-400">{t.state}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 text-gray-600">
                          {t.startDate ? format(new Date(t.startDate), 'MMM dd, yyyy') : 'N/A'}
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge 
                            variant="outline"
                            className={
                              t.status === 'COMPLETED' ? 'bg-green-50 text-green-700 border-green-200' : 
                              t.status === 'UPCOMING' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                              t.status === 'ACTIVE' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                              'bg-gray-50 text-gray-700 border-gray-200'
                            }
                          >
                            <span className={`mr-1.5 h-1.5 w-1.5 rounded-full inline-block ${
                              t.status === 'COMPLETED' ? 'bg-green-500' : 
                              t.status === 'UPCOMING' ? 'bg-amber-500' : 
                              t.status === 'ACTIVE' ? 'bg-blue-500' : 'bg-gray-500'
                            }`}></span>
                            {t.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50/50">
                <span className="text-sm text-gray-500 font-medium">
                  Showing page {page} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="bg-white h-8 px-3 text-xs font-medium"
                  >
                    <ChevronLeft className="mr-1 h-3 w-3" /> Prev
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="bg-white h-8 px-3 text-xs font-medium"
                  >
                    Next <ChevronRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-16 flex flex-col items-center justify-center text-center">
              <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No trainings found</h3>
              <p className="text-gray-500 mb-4 max-w-sm">We couldn't find any trainings matching your current search and filter criteria.</p>
              
              {canManage && !search && !statusFilter && !stateFilter ? (
                <Button onClick={() => router.push('/trainings/new')} className="bg-blue-600">
                  <Plus className="mr-2 h-4 w-4" /> Create your first training
                </Button>
              ) : (
                <Button variant="outline" onClick={() => { setSearch(""); setStatusFilter(""); setStateFilter(""); }}>
                  Clear all filters
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedLayout>
  );
}

function MapPinIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

