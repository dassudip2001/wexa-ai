"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface RecentActivityTableProps {
  data?: {
    event_name: string;
    created_at: string;
  }[]
}

export function RecentActivityTable({ data = [] }: RecentActivityTableProps) {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Latest events recorded in the system.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            No recent activity to display.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Name</TableHead>
                <TableHead className="text-right">Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, i) => {
                const date = new Date(item.created_at);
                return (
                  <TableRow key={i}>
                    <TableCell className="font-medium">
                      <Badge variant="outline" className="capitalize">
                        {item.event_name.replace(/_/g, ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {date.toLocaleString()}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
