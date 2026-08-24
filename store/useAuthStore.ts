// store/useAuthStore.ts
import { AuthResponseDto, UserDto } from '@/types/auth.dto';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
    }
  )
);