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
