"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { useNotifications } from "@/hooks/use-notifications";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function NotificationsPage() {
  const { data, isLoading } = useNotifications();
  const notifications = data?.data || [];

  return (
    <ProtectedLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Notifications</h1>
            <p className="text-gray-500">System alerts and updates</p>
          </div>
          <button className="text-sm text-blue-600 font-medium hover:underline">
            Mark all as read
          </button>
        </div>

        <Card>
          <CardContent className="p-0 divide-y divide-gray-100">
            {isLoading ? (
              <div className="p-8 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-50 animate-pulse rounded" />
                ))}
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((n: any) => (
                <div key={n.id} className={`p-4 flex gap-4 ${n.read ? 'bg-white' : 'bg-blue-50/50'}`}>
                  <div className={`mt-1 p-2 rounded-full h-fit ${
                    n.type === 'ALERT' ? 'bg-red-100 text-red-600' :
                    n.type === 'SUCCESS' ? 'bg-green-100 text-green-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {n.type === 'ALERT' ? <AlertTriangle className="h-4 w-4" /> :
                     n.type === 'SUCCESS' ? <CheckCircle className="h-4 w-4" /> :
                     <Info className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className={`text-sm font-medium ${n.read ? 'text-gray-900' : 'text-blue-900'}`}>
                      {n.title}
                    </p>
                    <p className="text-sm text-gray-500">{n.message}</p>
                    <p className="text-xs text-gray-400">
                      {n.createdAt ? formatDistanceToNow(new Date(n.createdAt), { addSuffix: true }) : 'Recently'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                <Bell className="h-8 w-8 text-gray-300 mb-2" />
                <p>No new notifications</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedLayout>
  );
}
