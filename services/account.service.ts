import { apiClient } from "@/lib/apiClients";
import { AccountDto } from "@/types/onboarding.dto";
import { CardDto } from "@/types/transaction.dto";

export const accountService = {
  async getCashAccount() {
    return await apiClient<AccountDto>('/accounts/cash');
  },

  async getUserAccounts(paymentMode?: string) {
    const query = paymentMode ? `?paymentMode=${encodeURIComponent(paymentMode)}` : '';
    return await apiClient<AccountDto[]>(`/accounts${query}`, {
      headers: {
        'X-API-Version': '2'
      }
    });
  },

  async getDebitCards() {
    return await apiClient<CardDto[]>('/cards/debit');
  },

  async getCreditCards() {
    return await apiClient<CardDto[]>('/cards/credit');
  },
};