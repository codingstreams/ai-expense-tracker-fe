import { AuthResponseDto, UserDto } from '@/types/auth.dto';
import { create } from 'zustand';
import { persist, StateStorage, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';

const cookieStorage: StateStorage = {
  getItem: (name) => Cookies.get(name) || null,
  setItem: (name, value) => Cookies.set(name, value, { expires: 7 }), // expires in 7 days
  removeItem: (name) => Cookies.remove(name),
};

interface AuthState {
  auth: AuthResponseDto | null;
  user: UserDto | null;
  setAuth: (auth: AuthResponseDto, user: UserDto) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      auth: null,
      user: null,
      setAuth: (auth, user) => set({ auth, user }),
      logout: () => set({ auth: null, user: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => cookieStorage),
    }
  )
);