import { BankDto } from "./onboarding.dto";

export interface TransactionDto {
  id: string;
  type: string;
  amount: number;
  transactionDate: string;
  description: string;
  accountId: string;
  paymentModeId: string;
  categoryId: string;
  transferId: string;
}

export interface TransactionRequestDto {
  id: string;
  type: string;
  amount: number;
  transactionDate: string;
  description: string;
  accountId: string;
  cardId: string;
  toAccountId: string;
  paymentModeId: string;
  categoryId: string;
  transferId: string;
}

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


export interface PagedTransactionsDto {
  content: TransactionResponseDto[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  isLast: boolean;
}

export interface CategoryDto {
  id: string;
  name: string;
}

export interface CardDto {
  id: string;
  lastFourDigits?: string;
  cardType?: string;
  name?: string;
  limit?: number;
  accountId?: string;
  bank?: BankDto;
}