"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { useDashboardStats, useTrainingTrends, useCategoryDistribution } from "@/hooks/use-analytics";
import { useTrainings } from "@/hooks/use-trainings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Activity, Users, MapPin, CheckCircle, Clock, Building, UserCheck } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function Dashboard() {
  const { data: stats, isLoading: loadingStats } = useDashboardStats();
  const { data: trends, isLoading: loadingTrends } = useTrainingTrends();
  const { data: categories, isLoading: loadingCategories } = useCategoryDistribution();
  const { data: recentData, isLoading: loadingRecent } = useTrainings({ limit: 5, sortBy: 'createdAt', sortOrder: 'desc' });

  const recentTrainings = recentData?.data || [];

  return (
    <ProtectedLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Overview of disaster management training activities</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard title="Total Trainings" value={stats?.totalTrainings} icon={<Activity />} loading={loadingStats} />
          <KpiCard title="Completed" value={stats?.completedTrainings} icon={<CheckCircle />} loading={loadingStats} />
          <KpiCard title="Upcoming" value={stats?.upcomingTrainings} icon={<Clock />} loading={loadingStats} />
          <KpiCard title="Total Participants" value={stats?.totalParticipants} icon={<Users />} loading={loadingStats} />
          <KpiCard title="Active Orgs" value={stats?.activeOrganizations} icon={<Building />} loading={loadingStats} />
          <KpiCard title="Pending Approvals" value={stats?.pendingApprovals} icon={<UserCheck />} loading={loadingStats} />
          <KpiCard title="Districts Covered" value={stats?.districtsCovered} icon={<MapPin />} loading={loadingStats} />
          <KpiCard title="Avg Attendance" value={stats?.averageAttendance ? `${stats.averageAttendance}%` : null} icon={<Users />} loading={loadingStats} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Training Trends</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              {loadingTrends ? <Skeleton className="h-full w-full" /> : (
                trends?.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trends}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : <EmptyState message="No trend data available" />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Category Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              {loadingCategories ? <Skeleton className="h-full w-full" /> : (
                categories?.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={categories} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                        {categories.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : <EmptyState message="No category data available" />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Trainings Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Trainings</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingRecent ? <Skeleton className="h-40 w-full" /> : (
              recentTrainings.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Organization</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentTrainings.map((t: any) => (
                        <TableRow key={t.id}>
                          <TableCell className="font-medium">{t.title}</TableCell>
                          <TableCell>{t.organization?.name || 'N/A'}</TableCell>
                          <TableCell>{t.district}, {t.state}</TableCell>
                          <TableCell>{t.startDate ? format(new Date(t.startDate), 'MMM dd, yyyy') : 'N/A'}</TableCell>
                          <TableCell>
                            <Badge variant={t.status === 'COMPLETED' ? 'default' : t.status === 'UPCOMING' ? 'secondary' : 'outline'}>
                              {t.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : <EmptyState message="No recent trainings found." />
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedLayout>
  );
}

function KpiCard({ title, value, icon, loading }: { title: string, value: any, icon: React.ReactNode, loading: boolean }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-3xl font-bold">{value !== undefined && value !== null ? value : 0}</p>
            )}
          </div>
          <div className="rounded-full bg-blue-50 p-3 text-blue-600">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-gray-200 ${className}`} />;
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-full items-center justify-center text-gray-500">
      <p>{message}</p>
    </div>
  );
}
