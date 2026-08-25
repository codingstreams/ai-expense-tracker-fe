import { apiClient } from "@/lib/apiClients";
import { CategoryBreakdownDto, SummaryDto } from "@/types/dashboard.dto";

export const dashboardService = {
  async getDashboardSummary() {
    return await apiClient<SummaryDto>('/dashboard/summary');
  },

  async getCategoryBreakdown() {
    return await apiClient<CategoryBreakdownDto[]>('/dashboard/category-breakdown');
  }
};