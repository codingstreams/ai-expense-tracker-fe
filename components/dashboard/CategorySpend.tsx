"use client";

import { dashboardService } from "@/services/dashboard.service";
import { CategoryBreakdownDto } from "@/types/dashboard.dto";
import { Utensils, ShoppingCart, Home, Film, Car } from "lucide-react";
import { useEffect, useState } from "react";
import { categoryMetadataMap } from "./category.icons";

export default function CategorySpend() {
  // const categories = [
  //   { name: "Food & Dining", spent: 8400, percent: 35, icon: Utensils, barColor: "bg-rose-500", badgeColor: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
  //   { name: "Groceries", spent: 5600, percent: 24, icon: ShoppingCart, barColor: "bg-amber-500", badgeColor: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  //   { name: "Housing & Utilities", spent: 4200, percent: 18, icon: Home, barColor: "bg-purple-500", badgeColor: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
  //   { name: "Transportation", spent: 3100, percent: 13, icon: Car, barColor: "bg-indigo-500", badgeColor: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" },
  //   { name: "Entertainment", spent: 2400, percent: 10, icon: Film, barColor: "bg-emerald-500", badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  // ];

  const [categories, setCategories] = useState<CategoryBreakdownDto[]>([]);

  useEffect(() => {
    if (categories.length == 0) {
      dashboardService.getCategoryBreakdown()
        .then(categories => setCategories(categories))
        .catch(() => { })
    }
  });

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
          const Icon = categoryMetadataMap[cat.categoryName].icon;
          const iconColor = categoryMetadataMap[cat.categoryName].color;

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
                  <span className="text-zinc-400 text-[11px]">{cat.percentage}%</span>
                  <span className="font-bold text-white">{formatCurrency(cat.totalAmount)}</span>
                </div>
              </div>

              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                
                <div className={`h-full ${iconColor.split(' ')[0].replace('900/20','500')} rounded-full transition-all`} style={{ width: `${cat.percentage}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

