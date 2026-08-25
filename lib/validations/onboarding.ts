import { z } from "zod";

export const onboardingSchema = z.object({
  // General preferences
  languagePreference: z.string().length(2, { message: "Must be exactly 2 characters long" }),
  spendLimit: z.number().min(1, { message: "Must be greater than 1" }),
  currency: z.string().length(3, { message: "Must be exactly 3 characters long" }), // Fixed from 2
  paymentMode: z.string().min(1, { message: "Payment mode is required" }),

  // Bank Accounts
  accounts: z.array(
    z.object({
      lastFourDigits: z.string().length(4, { message: "Must be exactly 4 digits" }),
      balance: z.number().min(0, { message: "Balance cannot be negative" }),
      accountType: z.enum(["SAVINGS", "CREDIT", "CASH"], { message: "Select a valid account type" }),
      bank: z.object({
        id: z.string().uuid({ message: "Invalid bank ID" }),
        name: z.string().min(1, { message: "Bank name is required" }),
      }),
    })
  ).optional(),

  // // Cards
  // cards: z.array(
  //   z.object({
  //     cardType: z.enum(["DEBIT_CARD", "CREDIT_CARD"], { message: "Select a valid card type" }),
  //     lastFourDigits: z.string().length(4, { message: "Must be exactly 4 digits" }),
  //     accountId: z.string().uuid({ message: "Associated account ID is required" }),
  //   })
  // ).optional(),
});

export type OnboardingFormValues = z.infer<typeof onboardingSchema>;