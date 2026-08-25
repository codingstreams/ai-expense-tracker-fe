"use client";

import { apiClient } from "@/lib/apiClients";
import { OnboardingFormValues } from "@/lib/validations/onboarding";
import { BankDto } from "@/types/onboarding.dto";
import { useEffect, useRef, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

export default function AccountsStep() {
  const { control, register, setValue, watch } = useFormContext<OnboardingFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "accounts",
  });

  const [banks, setBanks] = useState<BankDto[]>([]);
  const [loadingBanks, setLoadingBanks] = useState(true);

  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    apiClient<BankDto[]>("/banks")
      .then((banksData) => setBanks(banksData))
      .catch((err) => console.error("Failed to fetch banks", err))
      .finally(() => setLoadingBanks(false));

    if (fields.length === 0) {
      append({
        lastFourDigits: "CASH",
        balance: 0,
        accountType: "CASH",
        bank: { id: "", name: "" },
      });
    }
  }, []);

  return (
    <div className="space-y-4 border border-gray-200 dark:border-gray-800 p-4 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <h3 className="text-lg font-semibold">Bank Accounts</h3>

      {fields.map((field, index) => {
        const selectedBankId = watch(`accounts.${index}.bank.id`);

        return (
          <div
            key={field.id}
            className="flex flex-col gap-3 p-3.5 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50/50 dark:bg-gray-800/50 transition-colors"
          >
            <div className="flex gap-2 items-center">
              <input
                {...register(`accounts.${index}.lastFourDigits`)}
                placeholder="Last 4 digits"
                maxLength={4}
                className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 w-28"
                disabled={field.accountType == 'CASH'}
              />

              <input
                type="number"
                {...register(`accounts.${index}.balance`, { valueAsNumber: true })}
                placeholder="Balance"
                className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 flex-1"
              />

              {!(field.accountType == 'CASH') ? (
               <>
                <select
                  {...register(`accounts.${index}.accountType`)}
                  className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="SAVINGS">Savings</option>
                  <option value="CREDIT">Credit</option>
                  <option value="CASH" disabled={['SAVINGS', 'CREDIT'].includes(field.accountType)}>Cash</option>
                </select>

                <select
                  disabled={loadingBanks}
                  value={selectedBankId}
                  onChange={(e) => {
                    const chosenBankId = e.target.value;
                    const foundBank = banks.find((b) => b.id === chosenBankId);

                    if (foundBank) {
                      setValue(`accounts.${index}.bank`, {
                        id: foundBank.id,
                        name: foundBank.name,
                      });
                    }
                  }}
                  className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 w-full disabled:opacity-50"
                >
                  <option value="">{loadingBanks ? "Loading banks..." : "-- Choose a Bank --"}</option>
                  {banks.map((bank) => (
                    <option key={bank.id} value={bank.id}>
                      {bank.name}
                    </option>
                  ))}
                </select>

 <button
                type="button"
                onClick={() => remove(index)}
                className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-2 rounded-md transition-colors"
                title="Remove account"
              >
                ✕
              </button>
               </>
              ) : null}



            </div>


          </div>
        );
      })}

      <button
        type="button"
        onClick={() =>
          append({
            lastFourDigits: "",
            balance: 0,
            accountType: "SAVINGS",
            bank: { id: "", name: "" },
          })
        }
        className="border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 px-4 py-2 rounded-md font-medium text-sm transition-colors"
      >
        + Add Bank Account
      </button>
    </div>
  );
}