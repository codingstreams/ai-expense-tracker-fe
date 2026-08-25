export interface SummaryDto{
  netWorth: number,
  totalIncome: number,
  totalExpense: number,
  netSavings: number,
  dailyBurnRate: number
}

export interface CategoryBreakdownDto {
  categoryName: string;
  totalAmount: number;
  percentage: number;
  transactionCount: number;
}