import { DashboardOverviewResponseDto, UserSummaryDto } from "@/types/dashboard.dto";
import { PaymentModeDto } from "@/types/onboarding.dto";
import { CategoryDto } from "@/types/transaction.dto";
import { create } from "zustand";

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

export const useDashboardStore = create<DashboardState>((set) => ({
  paymentModes: [],
  categories: [],
  refreshTrigger: 0,
  overview: null,
  setDashboardOverview: (d) => set({ overview: d }),
  setState: (s) => set({}),
  setPaymentModes: (pm) => set({ paymentModes: pm }),
  setCategories: (c) => set({ categories: c }),
  triggerRefresh: () => set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })),
}));