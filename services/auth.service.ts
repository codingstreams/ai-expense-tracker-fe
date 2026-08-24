import {
  LoginRequestDto,
  RegisterRequestDto,
  AuthResponseDto,
  UserDto
} from '@/types/auth.dto';
import { userService } from './user.service';
import { apiClient } from '@/lib/apiClients';

export const authService = {
  async login(credentials: LoginRequestDto): Promise<{ auth: AuthResponseDto, user: UserDto }> {
    const auth = await apiClient<AuthResponseDto>('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    auth.expireAt = Date.now() + (auth.expiresInSeconds * 1000);
    const user = await userService.getUserDetails(auth.accessToken);

    return { auth, user };
  },

  async register(data: RegisterRequestDto): Promise<{ auth: AuthResponseDto, user: UserDto }> {
    const auth = await apiClient<AuthResponseDto>('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    auth.expireAt = Date.now() + (auth.expiresInSeconds * 1000);

    const user = await userService.getUserDetails(auth.accessToken);

    return { auth, user };
  },
};