import { AuthResponseDto, UserDetailsDto, LoginRequestDto, RegisterRequestDto } from "@/types/auth.dto";
import { login as loginApi, registerUser as registerApi, logout as logoutApi } from "@/api/generated/auth-controller/auth-controller";
import { getCurrentUserDetails } from "@/api/generated/app-user-controller/app-user-controller";

export const authService = {
  async login(credentials: LoginRequestDto): Promise<{ auth: AuthResponseDto; user: UserDetailsDto }> {
    const res = await loginApi(credentials);
    const authData = res.data;

    const expiresInSeconds = authData.expiresInSeconds || 3600;
    const auth: AuthResponseDto = {
      accessToken: authData.accessToken || "",
      tokenType: authData.tokenType || "Bearer",
      expiresInSeconds,
      onboarded: authData.onboarded ?? false,
      expireAt: Date.now() + (expiresInSeconds * 1000),
    };

    const userRes = await getCurrentUserDetails({
      headers: {
        Authorization: `${auth.tokenType} ${auth.accessToken}`,
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const u = userRes.data as any;

    const user: UserDetailsDto = {
      email: u?.email || "",
      name: u?.name || "",
      isOnboardingComplete: u?.isOnboardingComplete ?? u?.onboardingComplete ?? null,
      languagePreference: (typeof u?.languagePreference === 'string' ? u?.languagePreference : u?.appUserConfig?.languagePreference) || "EN",
      spendLimit: u?.spendLimit ?? u?.appUserConfig?.spendLimit ?? null,
      currency: (typeof u?.currency === 'string' ? u?.currency : u?.appUserConfig?.currency) || "INR",
      paymentMode: (typeof u?.paymentMode === 'string' ? u?.paymentMode : u?.appUserConfig?.paymentMode?.name) || "",
    };

    return { auth, user };
  },

  async register(data: RegisterRequestDto): Promise<{ auth: AuthResponseDto; user: UserDetailsDto }> {
    const res = await registerApi(data);
    const authData = res.data;

    const expiresInSeconds = authData.expiresInSeconds || 3600;
    const auth: AuthResponseDto = {
      accessToken: authData.accessToken || "",
      tokenType: authData.tokenType || "Bearer",
      expiresInSeconds,
      onboarded: authData.onboarded ?? false,
      expireAt: Date.now() + (expiresInSeconds * 1000),
    };

    const userRes = await getCurrentUserDetails({
      headers: {
        Authorization: `${auth.tokenType} ${auth.accessToken}`,
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const u = userRes.data as any;

    const user: UserDetailsDto = {
      email: u?.email || "",
      name: u?.name || "",
      isOnboardingComplete: u?.isOnboardingComplete ?? u?.onboardingComplete ?? null,
      languagePreference: (typeof u?.languagePreference === 'string' ? u?.languagePreference : u?.appUserConfig?.languagePreference) || "EN",
      spendLimit: u?.spendLimit ?? u?.appUserConfig?.spendLimit ?? null,
      currency: (typeof u?.currency === 'string' ? u?.currency : u?.appUserConfig?.currency) || "INR",
      paymentMode: (typeof u?.paymentMode === 'string' ? u?.paymentMode : u?.appUserConfig?.paymentMode?.name) || "",
    };

    return { auth, user };
  },

  async logout() {
    return await logoutApi();
  },
};