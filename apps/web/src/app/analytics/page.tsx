"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { useDashboardStats, useTrainingTrends, useCategoryDistribution } from "@/hooks/use-analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function AnalyticsPage() {
  const { data: stats, isLoading: loadingStats } = useDashboardStats();
  const { data: trends, isLoading: loadingTrends } = useTrainingTrends();
  const { data: categories, isLoading: loadingCategories } = useCategoryDistribution();

  return (
    <ProtectedLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Analytics</h1>
          <p className="text-gray-500">Detailed insights into training performance and coverage</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Training Trends by Month</CardTitle>
            </CardHeader>
            <CardContent className="h-96">
              {loadingTrends ? <div className="h-full w-full animate-pulse bg-gray-100 rounded" /> : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trends || []}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Training Distribution by Category</CardTitle>
            </CardHeader>
            <CardContent className="h-96">
              {loadingCategories ? <div className="h-full w-full animate-pulse bg-gray-100 rounded" /> : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categories || []} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label>
                      {(categories || []).map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedLayout>
  );
}
