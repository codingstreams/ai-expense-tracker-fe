export interface TransactionResponseDto {
  id: string;
  type: string;
  amount: number;
  transactionDate: string;
  description: string;
  account: string;
  paymentMode: string;
  category: string;
}

export interface CategoryBreakdownDto {
  categoryName: string;
  totalAmount: number;
  percentage: number;
  transactionCount: number;
}

export interface SummaryDto {
  netWorth: number,
  totalIncome: number,
  totalExpense: number,
  netSavings: number,
  dailyBurnRate: number
}