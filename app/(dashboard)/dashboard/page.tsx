"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import UserGreetings from "@/components/dashboard/UserGreetings";
import QuickActionCommandBar from "@/components/dashboard/QuickActionCommandBar";
import Summary from "@/components/dashboard/Summary";
import MonthlyTrend from "@/components/dashboard/MonthlyTrend";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import CategorySpend from "@/components/dashboard/CategorySpend";
import AiChatWidget from "@/components/dashboard/AiChatWidget";
import { dashboardService } from "@/services/dashboard.service";
import { useAppStore } from "@/store/useAppStore";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";

export default function DashboardPage() {
  const isOnboarded = useAuthStore((state) => state.auth?.onboarded);

  const { data: dashboardOverview, isLoading, isError, error } = useQuery({
    queryKey: ['dashboardOverview'],
    queryFn: dashboardService.getDashboardOverview,
    staleTime: 1000 * 60 * 5,
    enabled: isOnboarded
  });


  return (

    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <UserGreetings />
        <div className="w-full lg:w-auto lg:min-w-[540px]">
          <QuickActionCommandBar />
        </div>
      </header>

      <Summary data={dashboardOverview?.userSummary} isLoading={isLoading} isError={isError} error={error?.message ?? ""} />

      <MonthlyTrend data={dashboardOverview?.monthlyTrend ?? []} isLoading={isLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <RecentTransactions data={dashboardOverview?.recentTransactions ?? []} isLoading={isLoading} />
        </div>
        <div className="lg:col-span-2">
          <CategorySpend data={dashboardOverview?.categoryBreakdown ?? []} isLoading={isLoading} />
        </div>
      </div>

      <AiChatWidget />
    </div>
  );
}
