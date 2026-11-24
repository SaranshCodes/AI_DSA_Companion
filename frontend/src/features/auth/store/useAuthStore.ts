import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  email: string | null;
  setAuth: (token: string, email?: string) => void;
  setEmail: (email: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      email: null,
      setAuth: (token: string, email?: string) =>
        set((state) => ({ token, email: email ?? state.email })),
      setEmail: (email: string) => set({ email }),
      logout: () => set({ token: null, email: null }),
    }),
    {
      name: 'ai_dsa_auth',
    }
  )
);
