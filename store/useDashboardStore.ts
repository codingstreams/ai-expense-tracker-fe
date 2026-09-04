import { DashboardOverviewResponseDto, UserSummaryDto } from "@/types/dashboard.dto";
import { PaymentModeDto } from "@/types/onboarding.dto";
import { CategoryDto } from "@/types/transaction.dto";
import { create, StateCreator } from "zustand";
import { TransactionsStoreState } from "./useTransactions";
import { set } from "react-hook-form";


export interface DashboardState {
  paymentModes: PaymentModeDto[];
  categories: CategoryDto[];
  overview: DashboardOverviewResponseDto | null;
  refreshTrigger: number;
  setDashboardOverview: (data: DashboardOverviewResponseDto) => void;
  setPaymentModes: (pm: PaymentModeDto[]) => void;
  setCategories: (c: CategoryDto[]) => void;
  setState: (summary: UserSummaryDto) => void;
  triggerRefresh: () => void;
}

export const createDashboardSlice: StateCreator<DashboardState> = (set) => (
  {
    paymentModes: [],
    categories: [],
    refreshTrigger: 0,
    overview: null,
    setDashboardOverview: (d) => set({ overview: d }),
    setState: (s) => set({}),
    setPaymentModes: (pm) => set({ paymentModes: pm }),
    setCategories: (c) => set({ categories: c }),
    triggerRefresh: () => set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })),
  }
);

// export const useDashboardStore = create<DashboardState>((set) => ({
//   paymentModes: [],
//   categories: [],
//   refreshTrigger: 0,
//   overview: null,
//   setDashboardOverview: (d) => set({ overview: d }),
//   setState: (s) => set({}),
//   setPaymentModes: (pm) => set({ paymentModes: pm }),
//   setCategories: (c) => set({ categories: c }),
//   triggerRefresh: () => set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })),
// }));