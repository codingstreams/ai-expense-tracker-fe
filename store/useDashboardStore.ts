import { SummaryDto } from "@/types/dashboard.dto";
import { create } from "zustand";

export interface DashboardState {
  summary: SummaryDto | null;
  refreshTrigger: number;
  setState: (summary: SummaryDto) => void;
  triggerRefresh: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  summary: null,
  refreshTrigger: 0,
  setState: (s) => set({ summary: s }),
  triggerRefresh: () => set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })),
}));