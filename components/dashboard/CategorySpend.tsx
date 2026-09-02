"use client";

import { dashboardService } from "@/services/dashboard.service";
import { CategoryBreakdownDto } from "@/types/dashboard.dto";
import { useDashboardStore } from "@/store/useDashboardStore";
import { Utensils, ShoppingCart, Home, Film, Car, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { categoryMetadataMap } from "./category.icons";

export default function CategorySpend() {
  const [categories, setCategories] = useState<CategoryBreakdownDto[]>([]);
  const refreshTrigger = useDashboardStore((state) => state.refreshTrigger);

  useEffect(() => {
    dashboardService
      .getCategoryBreakdown()
      .then((data) => setCategories(data || []))
      .catch(() => { });
  }, [refreshTrigger]);

  const totalSpent = categories.reduce((acc, c) => acc + c.totalAmount, 0);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">Category Spend</h2>
          <p className="text-xs text-zinc-400">Total: {formatCurrency(totalSpent)}</p>
        </div>
      </div>

      <div className="space-y-3.5">
        {categories.map((cat) => {
          console.log('category: ' + cat.categoryName)

          const Icon = cat.categoryName !== 'Uncategorized' ? categoryMetadataMap[cat.categoryName].icon : TriangleAlert;
          const iconColor = cat.categoryName !== 'Uncategorized' ? categoryMetadataMap[cat.categoryName].color : 'bg-amber-900/20 text-amber-600';

          return (
            <div key={cat.categoryName} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg border ${iconColor}`}>
                    <Icon className={`h-3.5 w-3.5 ${iconColor}`} />
                  </div>
                  <span className="font-semibold text-zinc-200">{cat.categoryName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400 text-[11px]">{cat.percentage.toFixed(2)}%</span>
                  <span className="font-bold text-white">{formatCurrency(cat.totalAmount)}</span>
                </div>
              </div>

              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">

                <div className={`h-full ${iconColor.split(' ')[0].replace('900/20', '500')} rounded-full transition-all`} style={{ width: `${cat.percentage}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

