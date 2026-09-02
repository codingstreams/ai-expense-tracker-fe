import { TransactionResponseDto } from "@/types/dashboard.dto";
import { apiClient } from "./apiClient";
import { CategoryDto, PaymentModeDto } from "@/types/transaction.dto";

export const transactionService = {
  async getRecentTransactions() {
    return await apiClient<TransactionResponseDto[]>('/transactions/recent');
  },

  async deleteTransaction(transactionId: string) {
    return await apiClient<void>(`/transactions/${transactionId}`, { method: 'DELETE' });
  },

  async getCategories() {
    return await apiClient<CategoryDto[]>('/system-categories');
  },

  async getSupportedPaymentModes() {
    return await apiClient<PaymentModeDto[]>('/payment-modes');
  },

  async createTransaction(payload: any) {
    return await apiClient<TransactionResponseDto>('/transactions', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

}