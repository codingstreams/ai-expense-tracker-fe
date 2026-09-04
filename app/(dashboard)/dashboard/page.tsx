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
import { useDashboardStore } from "@/store/useDashboardStore";
import { dashboardService } from "@/services/dashboard.service";

export default function DashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const isOnboarded = useAuthStore((state) => state.auth?.onboarded);
  const { triggerRefresh, setDashboardOverview } = useDashboardStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    console.log("Loading Dashboard...")

    if (!mounted) return;

    if (!isOnboarded) {
      router.replace("/onboarding");
      return;
    }

    dashboardService
      .getDashboardOverview()
      .then(setDashboardOverview)
      .then(() => triggerRefresh())
      .catch(() => { });
  }, [mounted, isOnboarded, router]);

  if (!mounted || !isOnboarded) {
    return null;
  }

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <UserGreetings />
        <div className="w-full lg:w-auto lg:min-w-[540px]">
          <QuickActionCommandBar />
        </div>
      </header>

      <Summary />

      <MonthlyTrend />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <RecentTransactions />
        </div>
        <div className="lg:col-span-2">
          <CategorySpend />
        </div>
      </div>

      <AiChatWidget />
    </div>
  );
}
