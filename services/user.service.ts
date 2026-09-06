import { apiClient } from "@/lib/apiClients";
import { AppUserDto, UpdateAppUserConfigReq, UserDto } from "@/types/auth.dto";

export const userService = {
  async getUserDetails(accessToken: string | null): Promise<UserDto> {
    return await apiClient<UserDto>(`/users/me`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  },

  async getUserPreferences() {
    return await apiClient<UserDto>(`/users/me`);
  },

  async getUserPreferencesV2() {
    return await apiClient<AppUserDto>(`/users/me`, { headers: { 'X-API-Version': '2' } });
  },

  async updatePreferences(payload: Partial<UserDto>) {
    return await apiClient<UserDto>('/users/me/config', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async updatePreferencesV2(payload: Partial<UpdateAppUserConfigReq>) {
    return await apiClient<AppUserDto>('/users/me/config', {
      method: 'PUT',
      body: JSON.stringify(payload),
      headers: { 'X-API-Version': '2' }
    });
  },
};