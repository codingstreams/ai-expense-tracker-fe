export interface LanguagePreferenceDto {
  options: string[]
}

export interface OnboardingDto {
  userConfig: UserConfigDto;
  cashBalance: number;
  accounts: AccountDto[]
}

export interface AccountDto {
  id?: string;
  lastFourDigits: string;
  balance: number;
  accountType: string;
  bank: BankDto;
  isUpiEnabled: boolean;
  isNetBankingEnabled: boolean;
}

export interface UserConfigDto {
  languagePreference: string;
  spendLimit: number;
  currency: string;
  paymentMode: string;
  isOnboardingComplete: boolean;
}

export interface BankDto {
  id: string;
  name: string;
}