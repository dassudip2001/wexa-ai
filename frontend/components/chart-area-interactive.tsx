"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "An interactive area chart"

const chartConfig = {
  count: {
    label: "Events",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

interface ChartAreaInteractiveProps {
  data?: {
    events_last_7_days: { day: string; count: number }[];
    top_events: { event_name: string; total: number }[];
  }
}

export function ChartAreaInteractive({ data }: ChartAreaInteractiveProps) {
  const areaData = React.useMemo(() => {
    return data?.events_last_7_days?.map(d => ({
      date: d.day,
      count: d.count
    })) || []
  }, [data]);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Events Overview</CardTitle>
        <CardDescription>
          Event counts for the last 7 days
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          {areaData.length > 0 ? (
            <AreaChart data={areaData}>
              <defs>
                <linearGradient id="fillCount" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-count)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-count)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="count"
                type="natural"
                fill="url(#fillCount)"
                stroke="var(--color-count)"
              />
            </AreaChart>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No data available for the last 7 days.
            </div>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
