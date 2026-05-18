import { create } from 'zustand';
import type { User } from '@app-types/index';
import { authService } from '@lib/auth';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean; // true once sessionStorage has been read

  // Actions
  setUser: (user: User | null) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  initialize: () => void;
  logout: () => Promise<void>;
}

// ── Synchronous boot-time hydration ────────────────────────────────────────
// Read sessionStorage BEFORE the store is created so the very first render of
// ProtectedRoute already sees the correct isAuthenticated value.
const _storedUser = authService.getStoredUser();

export const useAuthStore = create<AuthState>((set) => ({
  // Hydrate synchronously — access token is managed via httpOnly cookies
  user: _storedUser ?? null,
  isLoading: false,
  error: null,
  isAuthenticated: !!(_storedUser),
  isInitialized: true,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  // Keep initialize() for explicit re-hydration (e.g. after token refresh)
  initialize: () => {
    const user = authService.getStoredUser();
    set({
      user: user ?? null,
      isAuthenticated: !!(user),
      isInitialized: true,
    });
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
      set({
        user: null,
        isAuthenticated: false,
        error: null,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Logout failed',
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));
