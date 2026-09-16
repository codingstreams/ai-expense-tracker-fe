import { create, StateCreator } from "zustand";

export interface DashboardState {
  refreshTrigger: number;
  triggerRefresh: () => void;
}

export const createDashboardSlice: StateCreator<DashboardState> = (set) => ({
  refreshTrigger: 0,
  triggerRefresh: () => set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })),
});

export const useDashboardStore = create<DashboardState>(createDashboardSlice);
