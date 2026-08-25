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