"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Loader from "@/components/common/Loader";

interface EventProperty {
  [key: string]: string | number | boolean;
}

interface EventData {
  id: string;
  event_name: string;
  properties: EventProperty;
  created_at: string;
}

export default function EventsPage() {
  const {
    data: events,
    isLoading,
    error,
  } = useQuery<EventData[]>({
    queryKey: ["events"],
    queryFn: async () => {
      const response = await api.get("/events/");
      return response.data;
    },
  });

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center text-destructive">
        Failed to load events data.
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Events</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Event Logs</CardTitle>
          <CardDescription>
            A detailed timeline of events tracked across the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event ID</TableHead>
                <TableHead>Event Name</TableHead>
                <TableHead>Properties</TableHead>
                <TableHead className="text-right">Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events && events.length > 0 ? (
                events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {event.id.split("-")[0]}...
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {event.event_name.replace(/_/g, " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {Object.keys(event.properties || {}).length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(event.properties).map(
                            ([key, value]) => (
                              <Badge
                                key={key}
                                variant="outline"
                                className="text-xs font-normal"
                              >
                                <span className="font-medium mr-1">{key}:</span>{" "}
                                {String(value)}
                              </Badge>
                            ),
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground text-sm">
                      {new Date(event.created_at).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No events found.
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
