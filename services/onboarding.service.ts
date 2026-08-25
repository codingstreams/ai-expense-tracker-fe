import { apiClient } from "@/lib/apiClients";
import { LanguagePreferenceDto, OnboardingDto, PaymentModeDto } from "@/types/onboarding.dto";

export const onboardingService = {
  async getSupportedLanguagePreferences() {
    return await apiClient<LanguagePreferenceDto>('/dashboard/language-preferences');
  },

  async getSupportedPaymentModes() {
    return await apiClient<PaymentModeDto[]>('/payment-modes');
  },

  async onboardUser(requestBody: OnboardingDto) {
    return await apiClient<OnboardingDto>('/dashboard/onboard-user', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });
  },
};