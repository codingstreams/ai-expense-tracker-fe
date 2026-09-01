export interface AuthResponseDto {
  accessToken: string;
  tokenType: string;
  expiresInSeconds: number;
  onboarded: boolean;
}

export interface UserDetailsDto {
  email: string;
  name: string;
  isOnboardingComplete: boolean | null;
  languagePreference: string;
  spendLimit: number | null;
  currency: string;
}