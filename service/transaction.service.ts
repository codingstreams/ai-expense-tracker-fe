import { customInstance } from "./custom-instance";
import { AiInputDto, AiParseTask, CategoryDto, PagedTransactionsDto, PaymentModeDto, TransactionResponseDto } from "@/types/transaction.dto";
import {
  createTransaction as createTxApi,
  deleteTransaction as deleteTxApi,
  getRecentTransactions as getRecentTransactionsApi,
} from "@/api/generated/transaction-controller/transaction-controller";
import { getSystemCategories } from "@/api/generated/sys-category-controller/sys-category-controller";
import { getPaymentModes } from "@/api/generated/payment-mode-controller/payment-mode-controller";
import { parseRawText } from "@/api/generated/ai-controller/ai-controller";
import { CreateTransactionRequest } from "@/api/generated/model";

export interface TransactionFilterParams {
  page?: number;
  size?: number;
  type?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

export const transactionService = {
  async getRecentTransactions(): Promise<TransactionResponseDto[]> {
    const res = await getRecentTransactionsApi();
    return (res.data || []) as unknown as TransactionResponseDto[];
  },

  async deleteTransaction(transactionId: string): Promise<void> {
    await deleteTxApi(transactionId);
  },

  async getCategories(): Promise<CategoryDto[]> {
    const res = await getSystemCategories();
    return (res.data || []) as unknown as CategoryDto[];
  },

  async getSupportedPaymentModes(): Promise<PaymentModeDto[]> {
    const res = await getPaymentModes();
    return (res.data || []) as unknown as PaymentModeDto[];
  },

  async createTransaction(payload: CreateTransactionRequest): Promise<TransactionResponseDto> {
    const res = await createTxApi(payload);
    return res.data as unknown as TransactionResponseDto;
  },

  async getAllTransactions(params?: TransactionFilterParams): Promise<PagedTransactionsDto> {
    const query = new URLSearchParams();
    if (params?.page !== undefined) query.set("page", String(params.page));
    if (params?.size !== undefined) query.set("size", String(params.size));
    if (params?.type) query.set("type", params.type);
    if (params?.category) query.set("category", params.category);
    if (params?.startDate) query.set("startDate", params.startDate);
    if (params?.endDate) query.set("endDate", params.endDate);
    if (params?.minAmount !== undefined) query.set("minAmount", String(params.minAmount));
    if (params?.maxAmount !== undefined) query.set("maxAmount", String(params.maxAmount));

    const queryString = query.toString();
    const endpoint = queryString ? `/api/transactions?${queryString}` : "/api/transactions";
    const res = await customInstance<{ data: PagedTransactionsDto }>(endpoint);
    return res.data as unknown as PagedTransactionsDto;
  },

  async addTransactionUsingAi(input: AiInputDto): Promise<AiParseTask> {
    const res = await parseRawText(input);
    return res.data as unknown as AiParseTask;
  },
};