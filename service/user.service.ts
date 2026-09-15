import { UserDetailsDto } from "@/types/auth.dto";
import { getCurrentUserDetails, updateUserConfig } from "@/api/generated/app-user-controller/app-user-controller";

export const userService = {
  async getUserDetails(accessToken: string | null): Promise<UserDetailsDto> {
    const res = await getCurrentUserDetails({
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const u = res.data as any;
    return {
      email: u?.email || "",
      name: u?.name || "",
      isOnboardingComplete: u?.isOnboardingComplete ?? u?.onboardingComplete ?? null,
      languagePreference: (typeof u?.languagePreference === "string" ? u?.languagePreference : u?.appUserConfig?.languagePreference) || "EN",
      spendLimit: u?.spendLimit ?? u?.appUserConfig?.spendLimit ?? null,
      currency: (typeof u?.currency === "string" ? u?.currency : u?.appUserConfig?.currency) || "INR",
      paymentMode: (typeof u?.paymentMode === "string" ? u?.paymentMode : u?.appUserConfig?.paymentMode?.name) || "",
    };
  },

  async getUserPreferences(): Promise<UserDetailsDto> {
    return await this.getUserDetails(null);
  },

  async updatePreferences(payload: Partial<UserDetailsDto>): Promise<UserDetailsDto> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await updateUserConfig(payload as any);
    return await this.getUserPreferences();
  },
};