import { UserDetailsDto } from "@/types/auth.dto";
import { apiClient } from "./apiClient";

export const userService = {
  async getUserDetails(accessToken: string | null): Promise<UserDetailsDto> {
    return await apiClient<UserDetailsDto>(`/users/me`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  },

}