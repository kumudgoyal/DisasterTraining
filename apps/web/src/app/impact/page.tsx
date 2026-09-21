"use client";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { Card, CardContent } from "@/components/ui/card";

export default function ImpactPage() {
  return (
    <ProtectedLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Impact Assessment</h1>
          <p className="text-gray-500">Analyze the effectiveness of training programs</p>
        </div>
        <Card>
          <CardContent className="p-12 text-center text-gray-500">
            <p>Impact assessment data is being calculated. Please check back later.</p>
          </CardContent>
        </Card>
      </div>
    </ProtectedLayout>
  );
}
