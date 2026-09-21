"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTrainings } from "@/hooks/use-trainings";

const schema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  typeId: z.string().min(1, "Type is required"),
  themeId: z.string().min(1, "Theme is required"),
  organizationId: z.string().min(1, "Organization is required"),
  state: z.string().min(1, "State is required"),
  district: z.string().min(1, "District is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  venue: z.string().min(1, "Venue is required"),
  address: z.string().min(1, "Address is required"),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  capacity: z.string().min(1, "Capacity is required"),
  objectives: z.string().optional(),
  trainerName: z.string().min(1, "Trainer Name is required"),
});

export default function NewTrainingPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const { mutateAsync: createTraining } = useCreateTraining();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "", description: "", typeId: "", themeId: "", organizationId: "",
      state: "", district: "", startDate: "", endDate: "", venue: "",
      address: "", latitude: "", longitude: "", capacity: "", objectives: "", trainerName: ""
    }
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      setError("");
      await createTraining({
        ...values,
        capacity: parseInt(values.capacity),
        latitude: values.latitude ? parseFloat(values.latitude) : undefined,
        longitude: values.longitude ? parseFloat(values.longitude) : undefined
      });
      router.push("/trainings");
    } catch (err: any) {
      setError(err.message || "Failed to create training");
    }
  };

  return (
    <ProtectedLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Create New Training</h1>
          <p className="text-gray-500">Schedule a new disaster management training program</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Training Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {error && <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">{error}</div>}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 col-span-1 md:col-span-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input {...form.register("title")} placeholder="Training Title" />
                  {form.formState.errors.title && <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>}
                </div>

                <div className="space-y-2 col-span-1 md:col-span-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea 
                    {...form.register("description")} 
                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[100px]" 
                    placeholder="Training Description" 
                  />
                  {form.formState.errors.description && <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <Input type="date" {...form.register("startDate")} />
                  {form.formState.errors.startDate && <p className="text-sm text-red-500">{form.formState.errors.startDate.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date</label>
                  <Input type="date" {...form.register("endDate")} />
                  {form.formState.errors.endDate && <p className="text-sm text-red-500">{form.formState.errors.endDate.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">State</label>
                  <Input {...form.register("state")} placeholder="e.g. Maharashtra" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">District</label>
                  <Input {...form.register("district")} placeholder="e.g. Mumbai" />
                </div>
                
                <div className="space-y-2 col-span-1 md:col-span-2">
                  <label className="text-sm font-medium">Venue</label>
                  <Input {...form.register("venue")} placeholder="Venue Name" />
                </div>

                <div className="space-y-2 col-span-1 md:col-span-2">
                  <label className="text-sm font-medium">Address</label>
                  <Input {...form.register("address")} placeholder="Full Address" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Capacity</label>
                  <Input type="number" {...form.register("capacity")} placeholder="Number of participants" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Trainer Name</label>
                  <Input {...form.register("trainerName")} placeholder="Primary Trainer" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type ID (Mock)</label>
                  <Input {...form.register("typeId")} placeholder="Type ID" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Theme ID (Mock)</label>
                  <Input {...form.register("themeId")} placeholder="Theme ID" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Organization ID (Mock)</label>
                  <Input {...form.register("organizationId")} placeholder="Organization ID" />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => router.push('/trainings')}>Cancel</Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Creating..." : "Create Training"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </ProtectedLayout>
  );
}
