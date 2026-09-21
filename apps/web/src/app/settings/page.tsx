"use client";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
  const { user } = useAuth();
  
  return (
    <ProtectedLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Settings</h1>
          <p className="text-gray-500">Manage your profile and preferences</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input defaultValue={user?.name || ''} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email (Read-only)</label>
              <Input defaultValue={user?.email || ''} readOnly className="bg-gray-50 text-gray-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Input defaultValue={user?.role || ''} readOnly className="bg-gray-50 text-gray-500" />
            </div>
            <Button className="mt-4">Save Profile</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Password</label>
              <Input type="password" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">New Password</label>
              <Input type="password" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Confirm New Password</label>
              <Input type="password" />
            </div>
            <Button className="mt-4">Update Password</Button>
          </CardContent>
        </Card>
      </div>
    </ProtectedLayout>
  );
}
