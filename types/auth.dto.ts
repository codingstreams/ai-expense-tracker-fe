export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface RegisterRequestDto extends LoginRequestDto {
  name: string;
}

export interface UserDto {
  email: string;
  name: string;
  isOnboardingComplete: boolean;
  languagePreference: string;
  spendLimit: number;
  currency: string;
  paymentMode: string;
}

export interface AuthResponseDto {
  accessToken: string;
  tokenType: string;
  expiresInSeconds: number;
  expireAt: number;
  onboarded: boolean;
}

export interface ApiResponse {
  status: string;
  message: string;
  timestamp: string;
}

export interface PaymentModeSummaryDto {
  id: string;
  name: string;
}

export interface AppUserConfigDto {
  id: string;
  languagePreference: string;
  spendLimit: number;
  currency: string;
  paymentMode: PaymentModeSummaryDto | null;
}

export interface AppUserDto {
  id: string;
  name: string;
  email: string;
  isOnboardingComplete: boolean;
  appUserConfig: AppUserConfigDto | null;
}

export interface UpdateAppUserConfigReq {
  languagePreference?: string;
  spendLimit?: number;
  currency?: string;
  paymentModeId?: string;
}