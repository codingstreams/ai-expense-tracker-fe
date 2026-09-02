import { TransactionResponseDto } from "@/types/dashboard.dto";
import { apiClient } from "./apiClient";

export const transactionService = {
  async getRecentTransactions() {
    return await apiClient<TransactionResponseDto[]>('/transactions/recent');
  },

  async deleteTransaction(transactionId: string) {
    return await apiClient<void>(`/transactions/${transactionId}`, { method: 'DELETE' });
  },

}