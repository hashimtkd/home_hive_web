import { create } from 'zustand';
import type { User as FirebaseUser } from 'firebase/auth';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../services/firebase';

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL as string;

interface AuthState {
  user: FirebaseUser | null;
  isAdmin: boolean;
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
  logout: () => Promise<void>;
  initAuthListener: () => () => void; // returns the unsubscribe function
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAdmin: false,
  isLoading: true,

  setLoading: (isLoading) => set({ isLoading }),

  logout: async () => {
    try {
      await firebaseSignOut(auth);
      // State is cleared by the onAuthStateChanged listener in initAuthListener
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  initAuthListener: () => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const isAdmin = ADMIN_EMAIL ? user?.email === ADMIN_EMAIL : false;
      set({ user, isAdmin, isLoading: false });
    });
    return unsubscribe;
  },
}));
