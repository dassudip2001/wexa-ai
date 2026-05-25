"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/section-cards";
import { Loader2 } from "lucide-react";
import { RecentActivityTable } from "@/components/recent-activity-table";

export default function Page() {
  const {
    data: stats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      const response = await api.get("/dashboard/stats/");
      return response.data;
    },

    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 60000, // 1 minute
  });

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center text-destructive">
        You are not part of any organization. Please contact your administrator.
      </div>
    );
  }

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCards kpi={stats?.kpi} />
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive data={stats?.charts} />
        </div>
        <div className="px-4 lg:px-6">
          <RecentActivityTable data={stats?.recent_activity} />
        </div>
      </div>
    </div>
  );
}
