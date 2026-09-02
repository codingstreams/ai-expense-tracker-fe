import { apiClient } from "@/lib/apiClients";
import { CategoryBreakdownDto, MonthlyTrendDto, SummaryDto } from "@/types/dashboard.dto";

export const dashboardService = {
  async getDashboardSummary() {
    return await apiClient<SummaryDto>('/dashboard/summary');
  },

  async getMonthlyTrend() {
    return await apiClient<MonthlyTrendDto[]>('/dashboard/monthly-trend');
  },

  async getCategoryBreakdown() {
    return await apiClient<CategoryBreakdownDto[]>('/dashboard/category-breakdown');
  }
};