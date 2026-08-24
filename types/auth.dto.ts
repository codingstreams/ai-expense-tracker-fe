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