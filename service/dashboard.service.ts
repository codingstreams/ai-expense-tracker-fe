import { CategoryBreakdownDto } from "@/types/dashboard.dto";
import { apiClient } from "./apiClient";

export const dashboardService = {
  async getCategoryBreakdown() {
    return await apiClient<CategoryBreakdownDto[]>('/dashboard/category-breakdown');
  }
}