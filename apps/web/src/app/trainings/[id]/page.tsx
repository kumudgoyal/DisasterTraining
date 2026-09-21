"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { useParams, useRouter } from "next/navigation";
import { useTraining } from "@/hooks/use-trainings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useState } from "react";

export default function TrainingDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { data: training, isLoading } = useTraining(id);
  const [activeTab, setActiveTab] = useState("overview");

  if (isLoading) {
    return (
      <ProtectedLayout>
        <div className="p-8 space-y-4">
          <div className="h-20 bg-gray-100 animate-pulse rounded" />
          <div className="h-64 bg-gray-100 animate-pulse rounded" />
        </div>
      </ProtectedLayout>
    );
  }

  if (!training) {
    return (
      <ProtectedLayout>
        <div className="p-12 text-center text-gray-500">Training not found.</div>
      </ProtectedLayout>
    );
  }

  const tabs = ["overview", "participants", "sessions", "attendance", "assessments", "materials", "feedback"];

  return (
    <ProtectedLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">{training.title}</h1>
              <Badge variant={
                training.status === 'COMPLETED' ? 'default' : 
                training.status === 'UPCOMING' ? 'secondary' : 
                training.status === 'ACTIVE' ? 'destructive' : 'outline'
              }>
                {training.status}
              </Badge>
            </div>
            <p className="text-gray-500 mt-1">{training.organizationName.name} • {training.districtName}, {training.stateName}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push('/trainings')}>Back</Button>
            <Button className="bg-blue-600 hover:bg-blue-700">Edit Training</Button>
          </div>
        </div>

        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-wrap">{training.description || 'No description provided.'}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Objectives</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-wrap">{training.objectives || 'No objectives listed.'}</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div>
                    <p className="text-gray-500 font-medium">Dates</p>
                    <p>{training.startDate ? format(new Date(training.startDate), 'MMM d, yyyy') : 'N/A'} - {training.endDate ? format(new Date(training.endDate), 'MMM d, yyyy') : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">Venue</p>
                    <p>{training.venue}</p>
                    <p className="text-gray-600">{training.address}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">Capacity</p>
                    <p>{training.capacity} participants</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">Trainer</p>
                    <p>{training.trainerName || 'Not assigned'}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab !== 'overview' && (
          <Card>
            <CardContent className="p-12 text-center text-gray-500">
              <p className="capitalize">{activeTab} management coming soon.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </ProtectedLayout>
  );
}
