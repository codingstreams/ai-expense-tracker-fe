"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import TransactionModal from "@/components/dashboard/TransactionModal";
import TransactionFilters, { FilterState } from "@/components/dashboard/transactions/TransactionFilters";
import TransactionList from "@/components/dashboard/transactions/TransactionList";
import { TransactionFilterParams, transactionService } from "@/service/transaction.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function TransactionsPage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    type: "",
    category: "",
    startDate: "",
    endDate: "",
    minAmount: "",
    maxAmount: "",
  });
  const [page, setPage] = useState(0);

  const queryParams: TransactionFilterParams = {
    page,
    size: 10,
    type: filters.type || undefined,
    category: filters.category || undefined,
    startDate: filters.startDate || undefined,
    endDate: filters.endDate || undefined,
    minAmount: filters.minAmount ? Number(filters.minAmount) : undefined,
    maxAmount: filters.maxAmount ? Number(filters.maxAmount) : undefined,
  };

  const { data: pagedData, isLoading: loading } = useQuery({
    queryKey: ["transactions", queryParams],
    queryFn: () => transactionService.getAllTransactions(queryParams),
  });

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(0);
  };

  const handleReset = () => {
    setFilters({ type: "", category: "", startDate: "", endDate: "", minAmount: "", maxAmount: "" });
    setPage(0);
  };

  const refreshData = () => {
    queryClient.invalidateQueries({ queryKey: ["transactions"] });
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Transactions</h1>
          <p className="text-xs text-zinc-400">View and filter all expenses, income, and transfers</p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-900/30 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Add Transaction</span>
        </button>
      </div>

      <TransactionFilters filters={filters} onChange={handleFilterChange} onReset={handleReset} />
      <TransactionList
        pagedData={pagedData || null}
        loading={loading}
        onPageChange={setPage}
        onDelete={refreshData}
      />
      <TransactionModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          refreshData();
        }}
      />
    </div>
  );
}