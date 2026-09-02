import { BankDto } from "./onboarding.dto";

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

export interface PaymentModeDto {
  id: string;
  name: string;
}
