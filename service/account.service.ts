import { AccountDto, BankDto } from "@/types/onboarding.dto";
import { CardDto } from "@/types/transaction.dto";
import { customInstance } from "./custom-instance";
import {
  getUserAccounts as getUserAccountsApi,
  getUserCashAccountDetails as getCashAccountApi,
  deleteAccount as deleteAccountApi,
  addAccounts as addAccountsApi,
  updateCashBalance as updateCashBalanceApi,
} from "@/api/generated/account-controller/account-controller";
import {
  getUserCards as getUserCardsApi,
  addCards as addCardsApi,
} from "@/api/generated/card-controller/card-controller";

export const accountService = {
  async getUserAccounts(): Promise<AccountDto[]> {
    const res = await getUserAccountsApi();
    return (res.data || []) as unknown as AccountDto[];
  },

  async getCashAccount(): Promise<AccountDto> {
    const res = await getCashAccountApi();
    return res.data as unknown as AccountDto;
  },

  async getDebitCards(): Promise<CardDto[]> {
    const res = await getUserCardsApi({ type: "DEBIT_CARD" });
    return (res.data?.cards || []) as unknown as CardDto[];
  },

  async getCreditCards(): Promise<CardDto[]> {
    const res = await getUserCardsApi({ type: "CREDIT_CARD" });
    return (res.data?.cards || []) as unknown as CardDto[];
  },

  async addAccount(account: AccountDto): Promise<AccountDto> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await addAccountsApi({ accounts: [account as any] });
    return res.data as unknown as AccountDto;
  },

  async deleteAccount(id: string): Promise<void> {
    await deleteAccountApi(id);
  },

  async addCard(payload: {
    cardType: "DEBIT_CARD" | "CREDIT_CARD";
    lastFourDigits: string;
    accountId?: string;
    limit?: number;
    bank?: BankDto;
  }): Promise<CardDto> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await addCardsApi({ cards: [payload as any] });
    return res.data as unknown as CardDto;
  },

  async deleteCard(cardId: string): Promise<void> {
    await customInstance<void>(`/api/cards/${cardId}`, { method: "DELETE" });
  },

  async updateCashBalance(cashBalance: number): Promise<AccountDto> {
    const res = await updateCashBalanceApi({ cashBalance });
    return res.data as unknown as AccountDto;
  },
};