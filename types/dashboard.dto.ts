import { TransactionResponseDto } from "./transaction.dto";

export interface UserSummaryDto {
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

export interface MonthlyTrendDto {
  month: string;
  year: number;
  monthValue: number;
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
}

export interface DashboardOverviewResponseDto {
  userSummary: UserSummaryDto;
  monthlyTrend: MonthlyTrendDto[];
  recentTransactions: TransactionResponseDto[];
  categoryBreakdown: CategoryBreakdownDto[];
}