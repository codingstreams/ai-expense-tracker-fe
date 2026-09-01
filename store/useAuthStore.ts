import { AuthResponseDto, UserDetailsDto } from "@/types/auth.dto";
import { create } from "zustand";
import { StateStorage, persist, createJSONStorage } from "zustand/middleware";
import Cookies from 'js-cookie';

const cookieStorage: StateStorage = {
  getItem: (name) => Cookies.get(name) || null,
  setItem: (name, value) => Cookies.set(name, value, { expires: 7 }), // expires in 7 days
  removeItem: (name) => Cookies.remove(name),
};


interface AuthState {
  auth: AuthResponseDto | null;
  user: UserDetailsDto | null;
  setAuth: (auth: AuthResponseDto, user: UserDetailsDto) => void;
  getToken: () => string | null;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(

  persist(
    (set, get) => ({
      auth: null,
      user: null,
      setAuth: (auth: AuthResponseDto, user: UserDetailsDto) => set({ auth, user }),
      getToken: () => {
        const authData = get().auth;

        if (!authData) return null;

        // const isExpired = Date.now() >= authData.expireAt;

        // if (isExpired) {
        //   console.warn("Token expired. Logging out user automatically.");
        //   get().logout();
        //   return null;
        // }

        return authData.accessToken;
      },
      logout: () => set({ auth: null, user: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => cookieStorage),
    }
  )
);