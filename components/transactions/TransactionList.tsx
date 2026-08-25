"use client";

import { ArrowDownRight, ArrowUpRight, ArrowLeftRight, ChevronLeft, ChevronRight, Inbox } from "lucide-react";
import { PagedTransactionsDto } from "@/types/transaction.dto";

interface TransactionListProps {
  pagedData: PagedTransactionsDto | null;
  loading: boolean;
  onPageChange: (page: number) => void;
}

export default function TransactionList({ pagedData, loading, onPageChange }: TransactionListProps) {
  const formatCurrency = (val: number, type: string) => {
    const formatted = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Math.abs(val));
    if (type === "INCOME") return `+${formatted}`;
    if (type === "EXPENSE") return `-${formatted}`;
    return formatted;
  };

  const getTypeBadge = (type: string) => {
    if (type === "INCOME") return { icon: ArrowUpRight, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
    if (type === "EXPENSE") return { icon: ArrowDownRight, color: "text-rose-400 bg-rose-500/10 border-rose-500/20" };
    return { icon: ArrowLeftRight, color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" };
  };

  const items = pagedData?.content || [];

  if (loading) {
    return (
      <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900 text-center space-y-3">
        <div className="h-6 w-32 bg-zinc-800 animate-pulse rounded-lg mx-auto" />
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-zinc-950/60 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="p-12 rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/50 text-center space-y-2">
        <Inbox className="h-8 w-8 text-zinc-600 mx-auto" />
        <h3 className="text-sm font-semibold text-zinc-300">No transactions found</h3>
        <p className="text-xs text-zinc-500">Try adjusting your filters or add a new transaction.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 shadow-xl overflow-hidden">
      <div className="divide-y divide-zinc-800/80">
        {items.map((tx) => {
          const badge = getTypeBadge(tx.type);
          const Icon = badge.icon;
          return (
            <div key={tx.id} className="p-4 flex items-center justify-between gap-3 hover:bg-zinc-950/40 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`p-2.5 rounded-xl border ${badge.color} shrink-0`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <div className="text-sm font-semibold text-white truncate">{tx.description || tx.category || "Transaction"}</div>
                  <div className="text-xs text-zinc-400 flex items-center gap-2 flex-wrap">
                    <span>{tx.account || "Account"}</span>
                    <span>•</span>
                    <span className="text-purple-400/80">{tx.category || "General"}</span>
                    <span>•</span>
                    <span className="text-zinc-500">{tx.transactionDate ? new Date(tx.transactionDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "—"}</span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className={`text-sm sm:text-base font-bold ${tx.type === "INCOME" ? "text-emerald-400" : tx.type === "TRANSFER" ? "text-indigo-300" : "text-white"}`}>
                  {formatCurrency(tx.amount, tx.type)}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-zinc-500">{tx.paymentMode || tx.type}</div>
              </div>
            </div>
          );
        })}
      </div>

      {pagedData && pagedData.totalPages > 1 && (
        <div className="p-3.5 border-t border-zinc-800/80 bg-zinc-950/50 flex items-center justify-between text-xs text-zinc-400">
          <span>Page {pagedData.pageNumber + 1} of {pagedData.totalPages} ({pagedData.totalElements} total)</span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={pagedData.pageNumber <= 0}
              onClick={() => onPageChange(pagedData.pageNumber - 1)}
              className="p-1.5 rounded-lg border border-zinc-800 hover:bg-zinc-800 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              disabled={pagedData.isLast}
              onClick={() => onPageChange(pagedData.pageNumber + 1)}
              className="p-1.5 rounded-lg border border-zinc-800 hover:bg-zinc-800 disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

