import {z} from 'zod';

export const transactionSchema = z.object({
  type: z.enum(["EXPENSE","INCOME"], { message: "Select a valid transaction type" }),
  amount: z.number().min(1, {message:"Must be greater than 1"}),
  transactionDate: z.string(),
  description: z.string(),
  accountId: z.uuidv4().optional(),
  toAccountId: z.uuidv4().optional(),
  cardId: z.uuidv4().optional(),
  paymentModeId: z.uuidv4().optional(),
  categoryId: z.uuidv4()
});

export type TransactionFormValues = z.infer<typeof transactionSchema>;