"use client";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { Card, CardContent } from "@/components/ui/card";

export default function ParticipantsPage() {
  return (
    <ProtectedLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Participants Directory</h1>
          <p className="text-gray-500">Search and view participants across all trainings</p>
        </div>
        <Card>
          <CardContent className="p-12 text-center text-gray-500">
            <p>Participant directory is being loaded...</p>
          </CardContent>
        </Card>
      </div>
    </ProtectedLayout>
  );
}
