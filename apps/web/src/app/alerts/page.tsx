"use client";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export default function AlertsPage() {
  return (
    <ProtectedLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Active Alerts</h1>
          <p className="text-gray-500">Real-time disaster and training alerts</p>
        </div>
        <Card>
          <CardContent className="p-12 text-center text-gray-500 flex flex-col items-center">
            <AlertTriangle className="h-12 w-12 text-yellow-400 mb-4" />
            <p className="text-lg font-medium text-gray-900">No active alerts</p>
            <p>The system is currently operating normally with no critical alerts.</p>
          </CardContent>
        </Card>
      </div>
    </ProtectedLayout>
  );
}
