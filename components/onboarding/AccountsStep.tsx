"use client";

import { BankDto } from "@/types/onboarding.dto";
import { OnboardingFormValues } from "@/validations/onboarding";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useGetBanks } from "@/api/generated/bank-controller/bank-controller";

export default function AccountsStep() {
  const { control, register, setValue, watch, formState: { errors } } = useFormContext<OnboardingFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "accounts" });

  const { data: banksResponse, isLoading: loading } = useGetBanks();
  const banks: BankDto[] = (banksResponse?.data || []) as BankDto[];

  const addAccount = () =>
    append({
      lastFourDigits: "",
      balance: 0,
      accountType: "SAVINGS",
      bank: { id: "", name: "" },
      isUpiEnabled: true,
      isNetBankingEnabled: true,
    });

  return (
    <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl space-y-5">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Bank Accounts</h2>
          <p className="text-xs text-zinc-400">Link your bank accounts and starting balances.</p>
        </div>
        <button
          type="button"
          onClick={addAccount}
          className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600/30 transition-colors"
        >
          + Add Account
        </button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-8 text-xs text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
          No bank accounts added yet. Click &quot;+ Add Account&quot; to add one.
        </div>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => {
            const accErrors = errors.accounts?.[index];
            return (
              <div key={field.id} className="p-4 border border-zinc-800/80 rounded-xl bg-zinc-950/70 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
                    Account #{index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-xs text-red-400 hover:text-red-300 font-medium transition-colors"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Bank</label>
                    <select
                      disabled={loading}
                      value={watch(`accounts.${index}.bank.id`) || ""}
                      onChange={(e) => {
                        const b = banks.find((item) => item.id === e.target.value);
                        setValue(
                          `accounts.${index}.bank`,
                          b ? { id: b.id, name: b.name } : { id: "", name: "" },
                          { shouldValidate: true }
                        );
                      }}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    >
                      <option value="">{loading ? "Loading..." : "Select Bank"}</option>
                      {banks.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                    {accErrors?.bank?.id && (
                      <p className="mt-1 text-[10px] text-red-400">{accErrors.bank.id.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Account Type</label>
                    <select
                      {...register(`accounts.${index}.accountType`)}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    >
                      <option value="SAVINGS">Savings</option>
                      <option value="CREDIT">Credit</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Last 4 Digits</label>
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="e.g. 1234"
                      {...register(`accounts.${index}.lastFourDigits`)}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono"
                    />
                    {accErrors?.lastFourDigits && (
                      <p className="mt-1 text-[10px] text-red-400">{accErrors.lastFourDigits.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Starting Balance</label>
                    <input
                      type="number"
                      placeholder="0"
                      {...register(`accounts.${index}.balance`, { valueAsNumber: true })}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono"
                    />
                    {accErrors?.balance && (
                      <p className="mt-1 text-[10px] text-red-400">{accErrors.balance.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-400">
                    <input
                      type="checkbox"
                      {...register(`accounts.${index}.isUpiEnabled`)}
                      className="rounded border-zinc-800 bg-zinc-900 text-purple-600 focus:ring-purple-500"
                    />
                    <span>UPI Enabled</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-400">
                    <input
                      type="checkbox"
                      {...register(`accounts.${index}.isNetBankingEnabled`)}
                      className="rounded border-zinc-800 bg-zinc-900 text-purple-600 focus:ring-purple-500"
                    />
                    <span>NetBanking Enabled</span>
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}