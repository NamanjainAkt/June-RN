import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeSettings } from '../types';

interface ThemeState {
  theme: ThemeSettings;
  setTheme: (theme: Partial<ThemeSettings>) => void;
  initializeTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: {
        mode: 'system',
        fontSize: 'medium',
      },
      setTheme: (newTheme) => {
        const current = get().theme;
        set({ theme: { ...current, ...newTheme } });
      },
      initializeTheme: () => {
        const stored = get().theme;
        set({ theme: stored });
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
