import { SummaryDto } from "@/types/dashboard.dto";
import { create } from "zustand";

export interface DashboardState{
  summary: SummaryDto | null;
  setState: (summary: SummaryDto)=>void;
}

export const useDashboardStore  = create<DashboardState>((set)=>(
  {
    summary: null,
    setState: (s)=>set({summary: s})
  }
))