import { TransactionResponseDto } from "@/types/transaction.dto";
import { StateCreator } from "zustand";

export interface TransactionsStoreState {
  transactions: TransactionResponseDto[];
  recentTransactions: TransactionResponseDto[];
  setTransactions: (data: TransactionResponseDto[]) => void;
  setRecentTransactions: (data: TransactionResponseDto[]) => void;
}

export const createTransactionsSlice: StateCreator<TransactionsStoreState> = (set) => ({
  transactions: [],
  recentTransactions: [],
  setTransactions: (d) => set({ transactions: d }),
  setRecentTransactions: (d) => set({ recentTransactions: d })
});

// export const useTransactionsStore = create<TransactionsStoreState>((set) => ({
//   transactions: [],
//   recentTransactions: [],
//   setTransactions: (d) => set({ transactions: d }),
//   setRecentTransactions: (d) => set({ recentTransactions: d })
// }));