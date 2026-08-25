import { apiClient } from "@/lib/apiClients";
import { LanguagePreferenceDto } from "@/types/onboarding.dto";

export const onboardingService = {
  async getUserDetails(): Promise<LanguagePreferenceDto>{
    return  await apiClient<LanguagePreferenceDto>(`/dashboard/language-preferences`);
  }
}