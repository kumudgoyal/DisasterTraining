"use client";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { useOrganizations } from "@/hooks/use-organizations";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

export default function OrganizationsPage() {
  const { data, isLoading } = useOrganizations({ limit: 50 });
  const orgs = data?.data || [];

  return (
    <ProtectedLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Organizations</h1>
          <p className="text-gray-500">Manage partnering organizations and institutes</p>
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
                      <TableHead>Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orgs.map((org: any) => (
                      <TableRow key={org.id}>
                        <TableCell className="font-medium">{org.name}</TableCell>
                        <TableCell>{org.type}</TableCell>
                        <TableCell>{org.district}, {org.state}</TableCell>
                        <TableCell>{org.status}</TableCell>
                      </TableRow>
                    ))}
                    {orgs.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">No organizations found.</TableCell>
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
