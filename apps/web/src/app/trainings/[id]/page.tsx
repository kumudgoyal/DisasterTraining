"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { useParams, useRouter } from "next/navigation";
import { useTraining } from "@/hooks/use-trainings";
import { useParticipants, useAttendance, useAssessments, useMarkAttendance } from "@/hooks/use-participants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { useState } from "react";

export default function TrainingDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  
  const { data: training, isLoading } = useTraining(id);
  const { data: participants, isLoading: loadingParticipants } = useParticipants(id);
  const { data: attendance, isLoading: loadingAttendance } = useAttendance(id);
  const { data: assessments, isLoading: loadingAssessments } = useAssessments(id);
  const { mutateAsync: markAttendance } = useMarkAttendance();

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

  const tabs = ["overview", "participants", "attendance", "assessment", "impact", "documents", "activity"];

  // Helper calculation for attendance
  const presentCount = attendance?.filter((a: any) => a.status === 'PRESENT').length || 0;
  const totalCount = participants?.length || 0;
  const attendanceRate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

  // Helper for assessments
  const preScore = assessments?.pre?.avgScore || 0;
  const postScore = assessments?.post?.avgScore || 0;
  const improvement = postScore > 0 && preScore > 0 ? postScore - preScore : 0;

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
            <p className="text-gray-500 mt-1">{training.organizationName?.name || 'Unknown Organization'} • {training.districtName}, {training.stateName}</p>
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

        {activeTab === 'participants' && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Participants</CardTitle>
                <CardDescription>Manage and view training participants.</CardDescription>
              </div>
              <Button>Add Participant</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingParticipants ? (
                    <TableRow><TableCell colSpan={5} className="text-center">Loading participants...</TableCell></TableRow>
                  ) : participants?.length > 0 ? (
                    participants.map((p: any) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell>{p.gender}</TableCell>
                        <TableCell>{p.age}</TableCell>
                        <TableCell>{p.email}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">Edit</Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow><TableCell colSpan={5} className="text-center text-gray-500">No participants enrolled.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {activeTab === 'attendance' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Overall Attendance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{presentCount}/{totalCount} Present</div>
                  <p className="text-xs text-gray-500 mt-1">{attendanceRate}% attendance rate</p>
                  <Progress value={attendanceRate} className="mt-3 h-2" />
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Mark Attendance</CardTitle>
                <CardDescription>Manage daily participant attendance.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Participant Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Current Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadingParticipants || loadingAttendance ? (
                       <TableRow><TableCell colSpan={4} className="text-center">Loading attendance data...</TableCell></TableRow>
                    ) : participants?.length > 0 ? (
                      participants.map((p: any) => {
                        const rec = attendance?.find((a: any) => a.participantId === p.id);
                        const status = rec ? rec.status : 'PENDING';
                        return (
                        <TableRow key={p.id}>
                          <TableCell className="font-medium">{p.name}</TableCell>
                          <TableCell>{p.email}</TableCell>
                          <TableCell>
                            <Badge variant={status === "PRESENT" ? "default" : status === "ABSENT" ? "destructive" : "secondary"}>
                              {status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="outline" size="sm" className="mr-2"
                              onClick={() => markAttendance({ trainingId: id, participantId: p.id, status: 'PRESENT' })}
                            >
                              Mark Present
                            </Button>
                            <Button 
                              variant="outline" size="sm"
                              onClick={() => markAttendance({ trainingId: id, participantId: p.id, status: 'ABSENT' })}
                            >
                              Mark Absent
                            </Button>
                          </TableCell>
                        </TableRow>
                      )})
                    ) : (
                       <TableRow><TableCell colSpan={4} className="text-center text-gray-500">No participants to mark.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'assessment' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Pre-training Assessment</CardTitle>
                <CardDescription>Average scores before the training</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingAssessments ? <div className="animate-pulse h-12 bg-gray-100 rounded w-1/2" /> : (
                  <>
                    <div className="text-4xl font-bold text-gray-700">{Math.round(preScore)}%</div>
                    <Progress value={Math.round(preScore)} className="mt-4 h-3" />
                  </>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Post-training Assessment</CardTitle>
                <CardDescription>Average scores after the training</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingAssessments ? <div className="animate-pulse h-12 bg-gray-100 rounded w-1/2" /> : (
                  <>
                    <div className="text-4xl font-bold text-green-600">{Math.round(postScore)}%</div>
                    <Progress value={Math.round(postScore)} className="mt-4 h-3 [&>div]:bg-green-600" />
                    {improvement > 0 && <p className="mt-4 text-sm text-green-600 font-medium">Improvement: +{Math.round(improvement)} points</p>}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'impact' && (
          <Card>
            <CardHeader>
              <CardTitle>Training Impact</CardTitle>
              <CardDescription>Long term assessment of knowledge retention</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <p>Impact assessment data will be available 3 months post-training.</p>
                <Button variant="outline" className="mt-4">Schedule Impact Survey</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'documents' && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Training Documents</CardTitle>
                <CardDescription>Materials, presentations, and resources.</CardDescription>
              </div>
              <Button variant="outline">Upload Document</Button>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                No documents have been uploaded yet.
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'activity' && (
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>Recent actions and changes to this training.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Training scheduled</p>
                    <p className="text-xs text-gray-500">Oct 24, 2026 by Admin</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </ProtectedLayout>
  );
}
