"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useCreateTraining } from "@/hooks/use-trainings";

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
  outcomes: z.string().optional(),
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
      address: "", latitude: "", longitude: "", capacity: "", objectives: "", outcomes: "", trainerName: ""
    }
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      setError("");
      const { outcomes, ...rest } = values; // Exclude outcomes if it's not in the API
      await createTraining({
        ...rest,
        capacity: parseInt(values.capacity),
        latitude: values.latitude ? parseFloat(values.latitude) : undefined,
        longitude: values.longitude ? parseFloat(values.longitude) : undefined
      } as any);
      router.push("/trainings");
    } catch (err: any) {
      setError(err.message || "Failed to create training");
    }
  };

  return (
    <ProtectedLayout>
      <div className="space-y-6 max-w-4xl mx-auto pb-12">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Create New Training</h1>
          <p className="text-gray-500">Schedule a new disaster management training program</p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {error && <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">{error}</div>}

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Provide the core details of the training.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input {...form.register("title")} placeholder="Training Title" />
                  {form.formState.errors.title && <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea 
                    {...form.register("description")} 
                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[100px]" 
                    placeholder="Training Description" 
                  />
                  {form.formState.errors.description && <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Type ID</label>
                    <Input {...form.register("typeId")} placeholder="Type ID" />
                    {form.formState.errors.typeId && <p className="text-sm text-red-500">{form.formState.errors.typeId.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Theme ID</label>
                    <Input {...form.register("themeId")} placeholder="Theme ID" />
                    {form.formState.errors.themeId && <p className="text-sm text-red-500">{form.formState.errors.themeId.message}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Organization</CardTitle>
                <CardDescription>Who is organizing and conducting this training.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Organization ID</label>
                  <Input {...form.register("organizationId")} placeholder="Organization ID" />
                  {form.formState.errors.organizationId && <p className="text-sm text-red-500">{form.formState.errors.organizationId.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Trainer Name</label>
                  <Input {...form.register("trainerName")} placeholder="Primary Trainer" />
                  {form.formState.errors.trainerName && <p className="text-sm text-red-500">{form.formState.errors.trainerName.message}</p>}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
                <CardDescription>Where will the training take place.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">State</label>
                    <Input {...form.register("state")} placeholder="e.g. Maharashtra" />
                    {form.formState.errors.state && <p className="text-sm text-red-500">{form.formState.errors.state.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">District</label>
                    <Input {...form.register("district")} placeholder="e.g. Mumbai" />
                    {form.formState.errors.district && <p className="text-sm text-red-500">{form.formState.errors.district.message}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Venue</label>
                  <Input {...form.register("venue")} placeholder="Venue Name" />
                  {form.formState.errors.venue && <p className="text-sm text-red-500">{form.formState.errors.venue.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Address</label>
                  <Input {...form.register("address")} placeholder="Full Address" />
                  {form.formState.errors.address && <p className="text-sm text-red-500">{form.formState.errors.address.message}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Latitude (Optional)</label>
                    <Input {...form.register("latitude")} placeholder="Latitude" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Longitude (Optional)</label>
                    <Input {...form.register("longitude")} placeholder="Longitude" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Schedule & Participants</CardTitle>
                <CardDescription>When is it happening and for how many people.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <label className="text-sm font-medium">Capacity</label>
                  <Input type="number" {...form.register("capacity")} placeholder="Max participants" />
                  {form.formState.errors.capacity && <p className="text-sm text-red-500">{form.formState.errors.capacity.message}</p>}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Objectives & Outcomes</CardTitle>
                <CardDescription>Define the goals and expected results of the training.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Objectives</label>
                  <textarea 
                    {...form.register("objectives")} 
                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[100px]" 
                    placeholder="What are the main objectives?" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Expected Outcomes</label>
                  <textarea 
                    {...form.register("outcomes")} 
                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[100px]" 
                    placeholder="What are the expected outcomes?" 
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={() => router.push('/trainings')}>Cancel</Button>
            <Button type="submit" disabled={form.formState.isSubmitting} className="bg-blue-600 hover:bg-blue-700">
              {form.formState.isSubmitting ? "Creating..." : "Create Training"}
            </Button>
          </div>
        </form>
      </div>
    </ProtectedLayout>
  );
}
