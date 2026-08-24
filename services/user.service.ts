import { apiClient } from "@/lib/apiClients";
import { UserDto } from "@/types/auth.dto";

export const userService = {
  async getUserDetails(accessToken:string | null): Promise<UserDto>{
    return  await apiClient<UserDto>(`/users/me`, {headers: {
        Authorization: `Bearer ${accessToken}` 
      }});
  }
}