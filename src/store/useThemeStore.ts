import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeSettings } from '../types';

interface ThemeState {
  theme: ThemeSettings;
  setTheme: (theme: Partial<ThemeSettings>) => void;
  initializeTheme: () => void;
  toggleDarkMode: () => void;
  setFontSize: (fontSize: ThemeSettings['fontSize']) => void;
}

const DEFAULT_THEME: ThemeSettings = {
  mode: 'system',
  fontSize: 'medium',
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: DEFAULT_THEME,
      setTheme: (newTheme) => {
        const current = get().theme;
        set({ theme: { ...current, ...newTheme } });
      },
      initializeTheme: () => {
        const stored = get().theme;
        if (stored && stored.fontSize) {
          set({ theme: stored });
        } else {
          set({ theme: DEFAULT_THEME });
        }
      },
      toggleDarkMode: () => {
        const current = get().theme;
        set({
          theme: {
            ...current,
            mode: current.mode === 'dark' ? 'light' : 'dark',
          },
        });
      },
      setFontSize: (fontSize) => {
        const current = get().theme;
        set({ theme: { ...current, fontSize } });
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
