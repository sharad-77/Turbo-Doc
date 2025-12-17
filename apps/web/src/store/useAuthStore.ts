import { authClient } from '@/lib/auth-client';
import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name?: string; // Optional name field
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  checkAuth: async () => {
    try {
      set({ isLoading: true });
      const { data } = await authClient.getSession();

      if (data?.user) {
        set({
          user: data.user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error(error);
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
  logout: async () => {
    await authClient.signOut();
    set({ user: null, isAuthenticated: false });
  },
}));
