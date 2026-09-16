"use client";

import { useState } from "react";
import { Building2, Plus, Trash2, X, AlertCircle, Check, Loader2 } from "lucide-react";
import { AccountDto } from "@/types/onboarding.dto";
import { useDashboardStore } from "@/store/useDashboardStore";
import {
  useGetUserAccounts,
  useAddAccounts,
  useDeleteAccount,
  getGetUserAccountsQueryKey,
} from "@/api/generated/account-controller/account-controller";
import { useGetBanks } from "@/api/generated/bank-controller/bank-controller";
import { getGetSummaryQueryKey } from "@/api/generated/dashboard-controller/dashboard-controller";
import { useQueryClient } from "@tanstack/react-query";

export default function AccountsSection() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const { data: accountsData, isLoading: loading } = useGetUserAccounts();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const accounts: AccountDto[] = ((accountsData?.data || []) as any[]).filter((a) => a.accountType !== "CASH");

  const { data: banksData } = useGetBanks();
  const banks = banksData?.data || [];

  const [form, setForm] = useState({
    bankId: "",
    bankName: "",
    accountType: "SAVINGS" as "SAVINGS" | "CREDIT",
    lastFourDigits: "",
    balance: 0,
    isUpiEnabled: true,
    isNetBankingEnabled: true,
  });

  const { mutateAsync: deleteAccountMutate } = useDeleteAccount({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetUserAccountsQueryKey() });
        queryClient.invalidateQueries({ queryKey: ["accounts"] });
        queryClient.invalidateQueries({ queryKey: getGetSummaryQueryKey() });
        useDashboardStore.getState().triggerRefresh();
        setSuccessMsg("Account removed successfully!");
        setTimeout(() => setSuccessMsg(""), 3500);
      },
      onError: (err) => {
        console.error("Failed to delete account", err);
        setErrorMsg("Failed to remove account");
        setTimeout(() => setErrorMsg(""), 3500);
      },
    },
  });

  const { mutateAsync: addAccountsMutate, isPending: saving } = useAddAccounts({
    mutation: {
      onSuccess: () => {
        setForm({
          bankId: "",
          bankName: "",
          accountType: "SAVINGS",
          lastFourDigits: "",
          balance: 0,
          isUpiEnabled: true,
          isNetBankingEnabled: true,
        });
        setModalOpen(false);
        queryClient.invalidateQueries({ queryKey: getGetUserAccountsQueryKey() });
        queryClient.invalidateQueries({ queryKey: ["accounts"] });
        queryClient.invalidateQueries({ queryKey: getGetSummaryQueryKey() });
        useDashboardStore.getState().triggerRefresh();
        setSuccessMsg("Bank account added successfully!");
        setTimeout(() => setSuccessMsg(""), 3500);
      },
      onError: (err: unknown) => {
        const msg = err instanceof Error ? err.message : "Failed to add account";
        setErrorMsg(msg);
      },
    },
  });

  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      await deleteAccountMutate({ accountId: id });
    } catch {
      // Error handled in onError
    }
  };

  const handleAdd = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!form.bankId) {
      setErrorMsg("Please select a bank");
      return;
    }
    if (!form.lastFourDigits || form.lastFourDigits.length !== 4) {
      setErrorMsg("Last 4 digits must be exactly 4 numbers");
      return;
    }

    try {
      setErrorMsg("");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await addAccountsMutate({
        data: {
          accounts: [
            {
              bank: { id: form.bankId, name: form.bankName },
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              accountType: form.accountType as any,
              lastFourDigits: form.lastFourDigits,
              balance: Number(form.balance),
              upiEnabled: form.isUpiEnabled,
              netBankingEnabled: form.isNetBankingEnabled,
            },
          ],
        },
      });
    } catch {
      // Error handled in onError
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl space-y-5">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Bank Accounts</h2>
          <p className="text-xs text-zinc-400">Manage your linked savings and credit bank accounts.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setErrorMsg("");
            setModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-900/30 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Add Account</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
          <Check className="h-4 w-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="py-8 text-center text-xs text-zinc-500 flex justify-center items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
          <span>Loading accounts...</span>
        </div>
      ) : accounts.length === 0 ? (
        <div className="p-6 text-center border border-dashed border-zinc-800 rounded-xl space-y-2">
          <Building2 className="h-8 w-8 text-zinc-600 mx-auto" />
          <p className="text-xs text-zinc-400">No bank accounts linked yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {accounts.map((acc) => (
            <div
              key={acc.id || acc.lastFourDigits}
              className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-950 transition-colors flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 rounded-xl border border-purple-500/20 bg-purple-500/10 text-purple-400 shrink-0">
                  <Building2 className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-white truncate">
                    {acc.bank?.name || "Bank Account"}
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    •••• {acc.lastFourDigits} • <span className="uppercase">{acc.accountType}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    {acc.isUpiEnabled && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-medium">
                        UPI
                      </span>
                    )}
                    {acc.isNetBankingEnabled && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-medium">
                        NetBanking
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <div className="text-sm font-bold text-white">
                    {formatCurrency(acc.balance || 0)}
                  </div>
                  <div className="text-[10px] text-zinc-500 uppercase">Balance</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(acc.id)}
                  title="Remove account"
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 opacity-70 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-white tracking-tight">Add Bank Account</h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-zinc-400 hover:text-white p-1 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
                  Select Bank
                </label>
                <select
                  value={form.bankId}
                  onChange={(e) => {
                    const selected = banks.find((b) => b.id === e.target.value);
                    setForm({ ...form, bankId: e.target.value, bankName: selected?.name || "" });
                  }}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2.5 px-3 text-zinc-100 focus:border-purple-500 focus:outline-none"
                >
                  <option value="">Select a Bank</option>
                  {banks.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
                    Account Type
                  </label>
                  <select
                    value={form.accountType}
                    onChange={(e) =>
                      setForm({ ...form, accountType: e.target.value as "SAVINGS" | "CREDIT" })
                    }
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2.5 px-3 text-zinc-100 focus:border-purple-500 focus:outline-none"
                  >
                    <option value="SAVINGS">Savings</option>
                    <option value="CREDIT">Credit</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
                    Last 4 Digits
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={form.lastFourDigits}
                    onChange={(e) =>
                      setForm({ ...form, lastFourDigits: e.target.value.replace(/[^0-9]/g, "") })
                    }
                    placeholder="1234"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2.5 px-3 text-zinc-100 focus:border-purple-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
                  Starting Balance (₹)
                </label>
                <input
                  type="number"
                  value={form.balance || ""}
                  onChange={(e) => setForm({ ...form, balance: Number(e.target.value) })}
                  placeholder="0"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2.5 px-3 text-zinc-100 focus:border-purple-500 focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-2 pt-1 border-t border-zinc-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isUpiEnabled}
                    onChange={(e) => setForm({ ...form, isUpiEnabled: e.target.checked })}
                    className="rounded border-zinc-800 bg-zinc-950 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-zinc-300">Enable UPI for this account</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isNetBankingEnabled}
                    onChange={(e) => setForm({ ...form, isNetBankingEnabled: e.target.checked })}
                    className="rounded border-zinc-800 bg-zinc-950 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-zinc-300">Enable Net Banking</span>
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-lg shadow-purple-900/40 transition-all disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
