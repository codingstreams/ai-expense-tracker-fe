import { LoginRequestDto, AuthResponseDto, UserDetailsDto } from "@/types/auth.dto";
import { apiClient } from "./apiClient";
import { userService } from "./user.service";

export const authService = {
  async login(credentials: LoginRequestDto): Promise<{ auth: AuthResponseDto, user: UserDetailsDto }> {
    const auth = await apiClient<AuthResponseDto>('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    auth.expireAt = Date.now() + (auth.expiresInSeconds * 1000);
    const user = await userService.getUserDetails(auth.accessToken);

    return { auth, user };
  },
}