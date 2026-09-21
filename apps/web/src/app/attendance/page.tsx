"use client";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { Card, CardContent } from "@/components/ui/card";

export default function AttendancePage() {
  return (
    <ProtectedLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Attendance Management</h1>
          <p className="text-gray-500">Track participant attendance for active sessions</p>
        </div>
        <Card>
          <CardContent className="p-12 text-center text-gray-500">
            <p>Select a training from the active trainings list to manage attendance.</p>
          </CardContent>
        </Card>
      </div>
    </ProtectedLayout>
  );
}
