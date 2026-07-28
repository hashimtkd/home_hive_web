import { create } from 'zustand';
import api, { setAccessToken } from '../services/api';

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'customer';
  name?: string;
}

interface AuthState {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  accessToken: string | null;
  setLoading: (isLoading: boolean) => void;
  setAccessToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  initAuthListener: () => () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAdmin: false,
  isLoading: true,
  accessToken: null,

  setLoading: (isLoading) => set({ isLoading }),

  setAccessToken: (token) => {
    setAccessToken(token);
    set({ accessToken: token });
  },

  setUser: (user) => {
    set({ user, isAdmin: user?.role === 'admin' });
  },

  logout: async () => {
    try {
      await api.post('/api/v1/auth/logout');
    } catch (error) {
      console.error('API logout error:', error);
    } finally {
      get().setAccessToken(null);
      get().setUser(null);
      set({ isLoading: false });
    }
  },

  initAuthListener: () => {
    let active = true;
    const checkCurrentUser = async () => {
      // First try to refresh access token silently
      try {
        const refreshRes = await api.post('/api/v1/auth/refresh');
        const token = refreshRes.data.accessToken;
        get().setAccessToken(token);

        // Fetch current user details
        const userRes = await api.get('/api/v1/auth/me');
        if (active) {
          const user = userRes.data.user || userRes.data;
          get().setUser(user);
        }
      } catch (err) {
        console.warn('Silent auth check / refresh failed:', err);
        if (active) {
          get().setAccessToken(null);
          get().setUser(null);
        }
      } finally {
        if (active) {
          set({ isLoading: false });
        }
      }
    };

    checkCurrentUser();

    // Returns a dummy unsubscribe function to match previous Firebase API expectations
    return () => {
      active = false;
    };
  },
}));
