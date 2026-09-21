"use client";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { useUsers } from "@/hooks/use-users";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function UsersPage() {
  const { data, isLoading } = useUsers({ limit: 50 });
  const users = data?.data || [];

  return (
    <ProtectedLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Users & Roles</h1>
          <p className="text-gray-500">Manage system users, access roles, and permissions</p>
        </div>
        
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8"><div className="h-40 bg-gray-100 animate-pulse rounded" /></div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Organization</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((u: any) => (
                      <TableRow key={u.id}>
                        <TableCell className="font-medium">{u.name}</TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{u.role}</Badge>
                        </TableCell>
                        <TableCell>{u.organization?.name || 'N/A'}</TableCell>
                        <TableCell>{u.isActive ? 'Active' : 'Inactive'}</TableCell>
                      </TableRow>
                    ))}
                    {users.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">No users found.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedLayout>
  );
}
