import { LanguagePreferenceDto, OnboardingDto } from "@/types/onboarding.dto";
import { PaymentModeDto } from "@/types/transaction.dto";
import {
  getLanguagePreferences as getLanguagePreferencesApi,
  onboardUser as onboardUserApi,
} from "@/api/generated/dashboard-controller/dashboard-controller";
import { getPaymentModes as getPaymentModesApi } from "@/api/generated/payment-mode-controller/payment-mode-controller";

export const onboardingService = {
  async getSupportedLanguagePreferences(): Promise<LanguagePreferenceDto> {
    const res = await getLanguagePreferencesApi();
    return res.data as unknown as LanguagePreferenceDto;
  },

  async onboardUser(requestBody: OnboardingDto): Promise<OnboardingDto> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await onboardUserApi(requestBody as any);
    return res.data as unknown as OnboardingDto;
  },

  async getSupportedPaymentModes(): Promise<PaymentModeDto[]> {
    const res = await getPaymentModesApi();
    return (res.data || []) as unknown as PaymentModeDto[];
  },
};