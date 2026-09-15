"use client";

import { useState } from "react";
import { CreditCard, Plus, Trash2, X, AlertCircle, Loader2 } from "lucide-react";
import { CardDto } from "@/types/transaction.dto";
import { BankDto, AccountDto } from "@/types/onboarding.dto";
import { customInstance } from "@/service/custom-instance";
import {
  useGetUserCards,
  useAddCards,
  getGetUserCardsQueryKey,
} from "@/api/generated/card-controller/card-controller";
import { useGetUserAccounts } from "@/api/generated/account-controller/account-controller";
import { useGetBanks } from "@/api/generated/bank-controller/bank-controller";
import { useQueryClient } from "@tanstack/react-query";

export default function CardsSection() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { data: debitCardsData, isLoading: debitLoading } = useGetUserCards({ type: "DEBIT_CARD" });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const debitCards: CardDto[] = (debitCardsData?.data?.cards || []) as any[];

  const { data: creditCardsData, isLoading: creditLoading } = useGetUserCards({ type: "CREDIT_CARD" });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const creditCards: CardDto[] = (creditCardsData?.data?.cards || []) as any[];

  const { data: accountsData } = useGetUserAccounts();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const accounts: AccountDto[] = ((accountsData?.data || []) as any[]).filter((a) => a.accountType !== "CASH");

  const { data: banksData } = useGetBanks();
  const banks: BankDto[] = (banksData?.data || []) as BankDto[];

  const loading = debitLoading || creditLoading;

  const [cardForm, setCardForm] = useState({
    cardType: "DEBIT" as "DEBIT" | "CREDIT",
    lastFourDigits: "",
    accountId: "",
    bankId: "",
    limit: "",
  });

  const openModal = () => {
    setErrorMsg("");
    const initialType = accounts.length > 0 ? "DEBIT" : "CREDIT";
    setCardForm({
      cardType: initialType,
      lastFourDigits: "",
      accountId: accounts[0]?.id || "",
      bankId: banks[0]?.id || "",
      limit: "",
    });
    setModalOpen(true);
  };

  const { mutateAsync: addCardsMutate, isPending: saving } = useAddCards({
    mutation: {
      onSuccess: () => {
        setModalOpen(false);
        queryClient.invalidateQueries({ queryKey: getGetUserCardsQueryKey() });
        queryClient.invalidateQueries({ queryKey: ["cards"] });
      },
      onError: (err: unknown) => {
        const msg = err instanceof Error ? err.message : "Failed to add card";
        setErrorMsg(msg);
      },
    },
  });

  const handleDeleteCard = async (cardId: string) => {
    try {
      await customInstance<void>(`/api/cards/${cardId}`, { method: "DELETE" });
      queryClient.invalidateQueries({ queryKey: getGetUserCardsQueryKey() });
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardForm.lastFourDigits || cardForm.lastFourDigits.length !== 4) {
      setErrorMsg("Last 4 digits must be exactly 4 numbers");
      return;
    }

    try {
      setErrorMsg("");

      if (cardForm.cardType === "DEBIT") {
        if (!cardForm.accountId) {
          setErrorMsg("Please select an account for debit card");
          return;
        }

        await addCardsMutate({
          data: {
            cards: [
              {
                cardType: "DEBIT_CARD",
                lastFourDigits: cardForm.lastFourDigits,
                accountId: cardForm.accountId,
              },
            ],
          },
        });
      } else {
        if (!cardForm.bankId) {
          setErrorMsg("Please select a bank for credit card");
          return;
        }
        if (!cardForm.limit || Number(cardForm.limit) <= 0) {
          setErrorMsg("Please enter a valid credit limit");
          return;
        }

        const selectedBank = banks.find((b) => b.id === cardForm.bankId);
        if (!selectedBank) {
          setErrorMsg("Selected bank not found");
          return;
        }

        await addCardsMutate({
          data: {
            cards: [
              {
                cardType: "CREDIT_CARD",
                lastFourDigits: cardForm.lastFourDigits,
                limit: Number(cardForm.limit),
                bank: {
                  id: selectedBank.id,
                  name: selectedBank.name,
                },
              },
            ],
          },
        });
      }
    } catch {
      // Handled in onError
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Cards</h2>
          <p className="text-xs text-zinc-400">Manage your debit and credit cards.</p>
        </div>
        <button
          type="button"
          onClick={openModal}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-900/30 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Add Card</span>
        </button>
      </div>

      {loading ? (
        <div className="py-8 text-center text-xs text-zinc-500 flex justify-center items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
          <span>Loading cards...</span>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Debit Cards</h3>
            {debitCards.length === 0 ? (
              <p className="text-xs text-zinc-500 italic">No debit cards added.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {debitCards.map((card) => (
                  <div
                    key={card.id || card.lastFourDigits}
                    className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-950 transition-colors flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2.5 rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 shrink-0">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-white truncate">
                          {card.bank?.name || "Debit Card"}
                        </div>
                        <div className="text-[11px] text-zinc-400">
                          •••• {card.lastFourDigits}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteCard(card.id)}
                      title="Remove card"
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 opacity-70 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3 pt-4 border-t border-zinc-800/60">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Credit Cards</h3>
            {creditCards.length === 0 ? (
              <p className="text-xs text-zinc-500 italic">No credit cards added.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {creditCards.map((card) => (
                  <div
                    key={card.id || card.lastFourDigits}
                    className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-950 transition-colors flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400 shrink-0">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-white truncate">
                          {card.bank?.name || "Credit Card"}
                        </div>
                        <div className="text-[11px] text-zinc-400">
                          •••• {card.lastFourDigits}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {card.limit !== undefined && card.limit !== null && (
                        <div className="text-right">
                          <div className="text-sm font-bold text-white">
                            {formatCurrency(card.limit)}
                          </div>
                          <div className="text-[10px] text-zinc-500 uppercase">Limit</div>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteCard(card.id)}
                        title="Remove card"
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 opacity-70 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-white tracking-tight">Add New Card</h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-zinc-400 hover:text-white p-1 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleAddCard} className="space-y-4 text-xs">
              <div className="flex rounded-xl bg-zinc-950 p-1 border border-zinc-800">
                <button
                  type="button"
                  onClick={() => setCardForm({ ...cardForm, cardType: "DEBIT" })}
                  disabled={accounts.length === 0}
                  className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
                    cardForm.cardType === "DEBIT"
                      ? "bg-purple-600 text-white shadow-sm"
                      : "text-zinc-400 hover:text-white"
                  } disabled:opacity-30`}
                >
                  Debit Card
                </button>
                <button
                  type="button"
                  onClick={() => setCardForm({ ...cardForm, cardType: "CREDIT" })}
                  className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
                    cardForm.cardType === "CREDIT"
                      ? "bg-purple-600 text-white shadow-sm"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Credit Card
                </button>
              </div>

              {cardForm.cardType === "DEBIT" ? (
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
                    Linked Bank Account
                  </label>
                  <select
                    value={cardForm.accountId}
                    onChange={(e) => setCardForm({ ...cardForm, accountId: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2.5 px-3 text-zinc-100 focus:border-purple-500 focus:outline-none"
                  >
                    <option value="">Select Account</option>
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.bank?.name || "Bank Account"} (•••• {acc.lastFourDigits})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
                      Card Issuer Bank
                    </label>
                    <select
                      value={cardForm.bankId}
                      onChange={(e) => setCardForm({ ...cardForm, bankId: e.target.value })}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2.5 px-3 text-zinc-100 focus:border-purple-500 focus:outline-none"
                    >
                      <option value="">Select Bank</option>
                      {banks.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
                      Credit Limit (₹)
                    </label>
                    <input
                      type="number"
                      value={cardForm.limit}
                      onChange={(e) => setCardForm({ ...cardForm, limit: e.target.value })}
                      placeholder="e.g. 100000"
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2.5 px-3 text-zinc-100 focus:border-purple-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
                  Last 4 Digits
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={cardForm.lastFourDigits}
                  onChange={(e) =>
                    setCardForm({ ...cardForm, lastFourDigits: e.target.value.replace(/[^0-9]/g, "") })
                  }
                  placeholder="1234"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2.5 px-3 text-zinc-100 focus:border-purple-500 focus:outline-none font-mono"
                />
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
                  {saving ? "Saving..." : "Save Card"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
