"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/section-cards";
import { RecentActivityTable } from "@/components/recent-activity-table";
import Loader from "@/components/common/Loader";

export default function Page() {
  const {
    data: stats,
    isLoading,
    isError,
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
    return <Loader />;
  }

  if (isError) {
    const errorMessage = (error as any)?.response?.data?.detail;

    return (
      <div className="flex h-[60vh] items-center justify-center px-4">
        <div className="max-w-md rounded-2xl border bg-background p-8 text-center shadow-sm">
          <h2 className="mb-2 text-xl font-semibold">No Organization Found</h2>

          <p className="text-muted-foreground">{errorMessage}</p>
        </div>
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
