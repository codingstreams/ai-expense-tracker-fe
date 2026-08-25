"use client";

import { useState } from "react";
import { X, ArrowDownRight, ArrowUpRight, ArrowLeftRight } from "lucide-react";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: "EXPENSE" | "INCOME" | "TRANSFER";
}

export default function TransactionModal({ isOpen, onClose, initialType = "EXPENSE" }: TransactionModalProps) {
  const [type, setType] = useState<"EXPENSE" | "INCOME" | "TRANSFER">(initialType);

  if (!isOpen) return null;

  const tabs = [
    { key: "EXPENSE", label: "Expense", icon: ArrowDownRight, color: "text-rose-400 border-rose-500 bg-rose-500/10" },
    { key: "INCOME", label: "Income", icon: ArrowUpRight, color: "text-emerald-400 border-emerald-500 bg-emerald-500/10" },
    { key: "TRANSFER", label: "Transfer", icon: ArrowLeftRight, color: "text-indigo-400 border-indigo-500 bg-indigo-500/10" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h2 className="text-base font-bold text-white tracking-tight">Add Transaction</h2>
          <button type="button" onClick={onClose} className="text-zinc-400 hover:text-white p-1 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = type === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setType(tab.key as "EXPENSE" | "INCOME" | "TRANSFER")}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                  active ? tab.color : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">Amount</label>
            <input type="number" placeholder="0.00" className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500" />
          </div>

          <div>
            <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
              {type === "TRANSFER" ? "From / To Account" : "Category / Merchant"}
            </label>
            <input type="text" placeholder={type === "TRANSFER" ? "e.g. HDFC to Cash" : "e.g. Food, Blinkit, Salary"} className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500" />
          </div>

          <div>
            <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">Note (Optional)</label>
            <input type="text" placeholder="Add a note..." className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500" />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-zinc-800 bg-zinc-950 py-2.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors">
            Cancel
          </button>
          <button type="button" onClick={onClose} className="flex-1 rounded-xl bg-purple-600 hover:bg-purple-500 py-2.5 text-xs font-semibold text-white transition-colors shadow-lg shadow-purple-950/50">
            Save Transaction
          </button>
        </div>
      </div>
    </div>
  );
}

