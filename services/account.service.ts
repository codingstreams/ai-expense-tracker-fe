import { apiClient } from "@/lib/apiClients";
import { AccountDto, BankDto } from "@/types/onboarding.dto";
import { CardDto } from "@/types/transaction.dto";

export const accountService = {
  async getCashAccount() {
    return await apiClient<AccountDto>('/accounts/cash');
  },

  async addAccount(account: AccountDto) {
    return await apiClient<AccountDto>('/accounts', {
      method: 'POST',
      body: JSON.stringify({ accounts: [account] }),
    });
  },

  async updateAccount(id: string, account: Partial<AccountDto>) {
    return await apiClient<AccountDto>(`/accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(account),
    });
  },

  async updateCashBalance(cashBalance: number) {
    return await apiClient<AccountDto>('/accounts/cash', { method: 'PUT', body: JSON.stringify({ cashBalance: cashBalance }) });
  },

  async deleteAccount(id: string) {
    return await apiClient<void>(`/accounts/${id}`, {
      method: 'DELETE',
    });
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
    return await apiClient<CardDto[]>('/cards?type=DEBIT_CARD');
  },

  async getCreditCards() {
    return await apiClient<CardDto[]>('/cards?type=CREDIT_CARD');
  },

  async addCard(payload: {
    cardType: "DEBIT_CARD" | "CREDIT_CARD";
    lastFourDigits: string;
    accountId?: string;
    limit?: number;
    bank?: BankDto;
  }) {
    return await apiClient<CardDto>('/cards', {
      method: 'POST',
      body: JSON.stringify({ cards: [payload] }),
    });
  },

  async deleteCard(cardId: string) {
    return await apiClient<void>(`/cards/${cardId}`, {
      method: 'DELETE',
    });
  },
};