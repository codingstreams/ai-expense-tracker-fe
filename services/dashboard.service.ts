import { apiClient } from "@/lib/apiClients";
import { CategoryBreakdownDto, DashboardOverviewResponseDto, MonthlyTrendDto, UserSummaryDto } from "@/types/dashboard.dto";

export const dashboardService = {
  async getDashboardSummary() {
    return await apiClient<UserSummaryDto>('/dashboard/summary');
  },

  async getMonthlyTrend() {
    return await apiClient<MonthlyTrendDto[]>('/dashboard/monthly-trend');
  },

  async getCategoryBreakdown() {
    return await apiClient<CategoryBreakdownDto[]>('/dashboard/category-breakdown');
  },
  async getDashboardOverview() {
    return await apiClient<DashboardOverviewResponseDto>('/dashboard/overview', { headers: { 'X-API-Version': '2' } })
  }
};