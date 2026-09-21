"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText } from "lucide-react";
import { useState } from "react";

export default function ReportsPage() {
  const [generating, setGenerating] = useState(false);

  const handleGenerate = (type: string) => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      alert(`Report ${type} generated successfully!`);
    }, 1500);
  };

  return (
    <ProtectedLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Reports</h1>
          <p className="text-gray-500">Generate and download official training reports</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ReportCard 
            title="Summary Report" 
            description="Overview of all trainings, participant counts, and status for the selected period."
            onGenerate={() => handleGenerate('Summary')}
            generating={generating}
          />
          <ReportCard 
            title="Coverage Report" 
            description="Detailed geographic analysis of training coverage across states and districts."
            onGenerate={() => handleGenerate('Coverage')}
            generating={generating}
          />
          <ReportCard 
            title="Impact Assessment" 
            description="Analysis of pre and post assessment scores to measure training effectiveness."
            onGenerate={() => handleGenerate('Impact')}
            generating={generating}
          />
        </div>
      </div>
    </ProtectedLayout>
  );
}

function ReportCard({ title, description, onGenerate, generating }: any) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-500 h-10">{description}</p>
        <Button onClick={onGenerate} disabled={generating} className="w-full">
          {generating ? 'Generating...' : (
            <>
              <Download className="mr-2 h-4 w-4" /> Generate PDF
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
