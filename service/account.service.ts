import { AccountDto } from "@/types/onboarding.dto";
import { apiClient } from "./apiClient";
import { CardDto } from "@/types/transaction.dto";

export const accountService = {
  async getUserAccounts(paymentMode?: string) {
    console.log("getting user accounts")

    const query = paymentMode ? `?paymentMode=${encodeURIComponent(paymentMode)}` : '';
    return await apiClient<AccountDto[]>(`/accounts${query}`, {
      headers: {
        'X-API-Version': '2'
      }
    });
  },

  async getCashAccount() {
    return await apiClient<AccountDto>('/accounts/cash');
  },

  async getDebitCards() {
    return await apiClient<CardDto[]>('/cards?type=DEBIT_CARD');
  },

  async getCreditCards() {
    return await apiClient<CardDto[]>('/cards?type=CREDIT_CARD');
  },

}