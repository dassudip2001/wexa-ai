"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

interface InviteResponse {
  message?: string;
  token?: any;
}

export default function InvitesPage() {
  const { data, isLoading } = useQuery<InviteResponse>({
    queryKey: ["invites"],
    queryFn: async () => {
      const response = await api.get("/organizations/invite-link/");
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const hasInvite = !!data?.token;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">My Invites</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Invitations</CardTitle>
          <CardDescription>
            Invitations you have received to join organizations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invite Details</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hasInvite ? (
                <TableRow>
                  <TableCell className="font-medium">
                    {typeof data.token === 'string' ? "Pending Invite (Token)" : "Pending Invite"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">Pending</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Accept
                      </Button>
                      <Button size="sm" variant="outline" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                        <XCircle className="w-4 h-4 mr-2" />
                        Decline
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                    {data?.message || "No pending invites."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
