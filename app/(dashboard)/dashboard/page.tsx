import CategoryBreakdown from "@/components/dashboard/CategoryBreakdown";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import UserGreetings from "@/components/dashboard/UserGreetings";

export default function DashboardPage() {
  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <UserGreetings />
      </header>


      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <RecentTransactions />
        </div>
        <div className="lg:col-span-2">
          <CategoryBreakdown />
        </div>
      </div>

    </div>
  );
}