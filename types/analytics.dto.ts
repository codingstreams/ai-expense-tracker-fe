export interface AiInsightDto {
  period: string;
  generatedAt: string; // Typically serialized as an ISO 8601 string in JSON (e.g., "2026-06-06T12:00:00")
  summary: string;
  topSpendingCategory: TopCategory | null;
  anomalies: string[];
  actionableTips: string[];
}

export interface TopCategory {
  category: string;
  percentage: number | null;
  insight: string;
}