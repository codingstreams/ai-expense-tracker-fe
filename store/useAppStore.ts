import { create } from "zustand";
import { createDashboardSlice, DashboardState } from "./useDashboardStore";
import { createTransactionsSlice, TransactionsStoreState } from "./useTransactions";


type AppStore = DashboardState & TransactionsStoreState;

export const useAppStore = create<AppStore>()((...a) => ({
  ...createDashboardSlice(...a),
  ...createTransactionsSlice(...a),
}));