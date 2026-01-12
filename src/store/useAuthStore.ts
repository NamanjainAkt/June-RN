import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isSignedIn: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setSignedIn: (signedIn: boolean) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isSignedIn: false,
      isLoading: true,
      setUser: (user) => set({ user }),
      setSignedIn: (signedIn) => set({ isSignedIn: signedIn, isLoading: false }),
      setLoading: (loading) => set({ isLoading: loading }),
      logout: () => set({ user: null, isSignedIn: false, isLoading: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ user: state.user, isSignedIn: state.isSignedIn }),
    }
  )
);
