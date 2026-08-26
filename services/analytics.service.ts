import { apiClient } from "@/lib/apiClients";
import { AiInsightDto } from "@/types/analytics.dto";

export const analyticsService = {
  async getAiInsights() {
    return await apiClient<AiInsightDto>('/ai/insights');
  },

  async generateAiInsights() {
    return await apiClient<AiInsightDto>('/ai/insights/generate', { method: 'POST' });
  },
};