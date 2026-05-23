"use client";

import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import ApiKeyModel from "@/components/api-keys/api-keys-model";
import Loader from "@/components/common/Loader";
import DeleteApiKeyModel from "@/components/api-keys/delete-api-key-model";

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  is_active: boolean;
  created_at: string;
  organization: string;
}
export default function ApiKeyView() {
  const [openDialog, setOpenDialog] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleteId, setDeleteId] = useState<string | null>(null);
  const { data, isLoading } = useQuery<ApiKey[]>({
    queryKey: ["api-keys"],
    queryFn: async () => {
      const res = await api.get("/organizations/api-list");
      return res.data;
    },
  });

  console.log(data);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">My API Keys</h2>
          <Button onClick={() => setOpenDialog(true)}>
            <Plus className="mr-2 h-4 w-4" /> Create API Key
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pending API Keys</CardTitle>
            <CardDescription>
              API keys you have created and are pending approval.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data && data.length > 0 ? (
                  data.map((api) => (
                    <TableRow key={api.id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {api.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {api.key}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {api.is_active ? (
                          <Badge variant="outline" className="capitalize">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="capitalize">
                            Inactive
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground text-sm">
                        {new Date(api.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            (setDeleteDialogOpen(true), setDeleteId(api.id));
                          }}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No api key found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      {openDialog && (
        <ApiKeyModel open={openDialog} onOpenChange={setOpenDialog} />
      )}
      {isDeleteDialogOpen && (
        <DeleteApiKeyModel
          open={isDeleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          token={isDeleteId as string}
        />
      )}
    </>
  );
}
