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
import { Search, Plus, Filter } from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function TrainingsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 10;
  
  const { data, isLoading } = useTrainings({ page, limit, search });
  const trainings = data?.data || [];
  const totalPages = data?.totalPages || 1;

  const canManage = user?.role === 'ADMIN' || user?.role === 'ORGANIZATION_ADMIN' || user?.permissions?.includes('manage_trainings');

  return (
    <ProtectedLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Trainings</h1>
            <p className="text-gray-500">Manage and monitor all disaster management trainings</p>
          </div>
          {canManage && (
            <Button onClick={() => router.push('/trainings/new')} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" /> New Training
            </Button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg shadow-sm border">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search trainings by title..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline" className="sm:w-auto w-full">
            <Filter className="mr-2 h-4 w-4" /> Filters
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {isLoading ? (
            <div className="p-8 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 animate-pulse rounded" />
              ))}
            </div>
          ) : trainings.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Organization</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trainings.map((t: any) => (
                      <TableRow 
                        key={t.id} 
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => router.push(`/trainings/${t.id}`)}
                      >
                        <TableCell className="font-medium">{t.title}</TableCell>
                        <TableCell>{t.organization?.name || 'N/A'}</TableCell>
                        <TableCell>{t.district}, {t.state}</TableCell>
                        <TableCell>{t.startDate ? format(new Date(t.startDate), 'MMM dd, yyyy') : 'N/A'}</TableCell>
                        <TableCell>
                          <Badge variant={
                            t.status === 'COMPLETED' ? 'default' : 
                            t.status === 'UPCOMING' ? 'secondary' : 
                            t.status === 'ACTIVE' ? 'destructive' : 'outline'
                          }>
                            {t.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex items-center justify-between p-4 border-t">
                <span className="text-sm text-gray-500">
                  Showing page {page} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-gray-500">
              <p>No trainings found.</p>
              {canManage && (
                <Button onClick={() => router.push('/trainings/new')} variant="link" className="mt-2 text-blue-600">
                  Create your first training
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedLayout>
  );
}
