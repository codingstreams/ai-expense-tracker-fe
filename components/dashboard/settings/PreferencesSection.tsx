"use client";

import { useGetLanguagePreferences } from "@/api/generated/dashboard-controller/dashboard-controller";
import {
  useGetCurrentUserDetails,
  useUpdateUserConfig,
  getGetCurrentUserDetailsQueryKey,
} from "@/api/generated/app-user-controller/app-user-controller";
import { useGetPaymentModes } from "@/api/generated/payment-mode-controller/payment-mode-controller";
import { useAuthStore } from "@/store/useAuthStore";
import { useDashboardStore } from "@/store/useDashboardStore";
import { Check, AlertCircle, Save, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function PreferencesSection() {
  const queryClient = useQueryClient();
  const authUser = useAuthStore((state) => state.user);

  const { data: langData, isLoading: langLoading } = useGetLanguagePreferences();
  const { data: userData, isLoading: userLoading } = useGetCurrentUserDetails();
  const { data: paymentModesData, isLoading: modesLoading } = useGetPaymentModes();

  const loading = langLoading || userLoading || modesLoading;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = (userData?.data as any) || authUser;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const languages: string[] = (langData?.data as any)?.options || ["EN", "HI", "ES", "FR"];
  const paymentModes = paymentModesData?.data || [];

  const [formData, setFormData] = useState({
    languagePreference: "EN",
    currency: "INR",
    spendLimit: 5000,
    paymentMode: "UPI",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        languagePreference: user.languagePreference || user.appUserConfig?.languagePreference || "EN",
        currency: user.currency || user.appUserConfig?.currency || "INR",
        spendLimit: user.spendLimit ?? user.appUserConfig?.spendLimit ?? 5000,
        paymentMode: user.paymentMode || user.appUserConfig?.paymentMode?.name || "UPI",
      });
    }
  }, [user]);

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const { mutateAsync: updateConfigMutate, isPending: saving } = useUpdateUserConfig({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetCurrentUserDetailsQueryKey() });
        useDashboardStore.getState().triggerRefresh();
        setSuccessMsg("Preferences saved successfully!");
        setTimeout(() => setSuccessMsg(""), 3500);
      },
    },
  });

  const handleSave = async (e: React.SubmitEvent) => {
    e.preventDefault();
    try {
      setErrorMsg("");
      setSuccessMsg("");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await updateConfigMutate({
        data: {
          languagePreference: formData.languagePreference as any,
          currency: formData.currency as any,
          spendLimit: Number(formData.spendLimit),
        },
      });

      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        useAuthStore.setState({
          user: {
            ...currentUser,
            languagePreference: formData.languagePreference,
            currency: formData.currency,
            spendLimit: Number(formData.spendLimit),
            paymentMode: formData.paymentMode,
          },
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save preferences";
      setErrorMsg(msg);
    }
  };

  return (
    <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl space-y-5 h-full flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">App Preferences</h2>
          <p className="text-xs text-zinc-400">Configure language, currency, default budget & payment method.</p>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
          <Check className="h-4 w-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="py-8 text-center text-xs text-zinc-500 flex justify-center items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
          <span>Loading preferences...</span>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
                Preferred Language
              </label>
              <select
                value={formData.languagePreference}
                onChange={(e) => setFormData({ ...formData, languagePreference: e.target.value })}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2.5 px-3 text-zinc-100 focus:border-purple-500 focus:outline-none"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang === "EN" ? "English (EN)" : lang === "HI" ? "Hindi (HI)" : lang}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
                Display Currency
              </label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2.5 px-3 text-zinc-100 focus:border-purple-500 focus:outline-none"
              >
                <option value="INR">Indian Rupee (INR ₹)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
                Monthly Spend Limit (₹)
              </label>
              <input
                type="number"
                min={0}
                value={formData.spendLimit}
                onChange={(e) => setFormData({ ...formData, spendLimit: Number(e.target.value) })}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2.5 px-3 text-zinc-100 focus:border-purple-500 focus:outline-none font-mono"
              />
            </div>

            {paymentModes && paymentModes.length > 0 && (
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
                  Default Payment Mode
                </label>
                <select
                  value={formData.paymentMode}
                  onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2.5 px-3 text-zinc-100 focus:border-purple-500 focus:outline-none"
                >
                  {paymentModes.map((pm) => (
                    <option key={pm.id || pm.name} value={pm.name}>
                      {pm.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-lg shadow-purple-900/40 transition-all disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              <span>{saving ? "Saving..." : "Save Preferences"}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
