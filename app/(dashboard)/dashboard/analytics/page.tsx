"use client";

import Summary from "@/components/dashboard/Summary";
import MonthlyTrend from "@/components/dashboard/MonthlyTrend";
import AiInsights from "@/components/dashboard/AiInsights";

export default function AnalyticsPage() {
  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">Analytics & Insights</h1>
        <p className="text-xs text-zinc-400">Financial overview, 6-month trends, and AI-powered recommendations</p>
      </div>

      <Summary />

      <MonthlyTrend variant="detailed" />

      <AiInsights />
    </div>
  );
}