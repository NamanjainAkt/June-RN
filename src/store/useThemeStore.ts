import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeSettings } from '../types';
import { getVercelColors, VERCEL_COLORS, VERCEL_TYPOGRAPHY, VERCEL_SPACING, VERCEL_BORDER_RADIUS, VERCEL_SHADOWS, VERCEL_ANIMATION, VERCEL_LAYOUT } from '../constants/vercel-theme';

interface ThemeState {
  theme: ThemeSettings;
  setTheme: (theme: Partial<ThemeSettings>) => void;
  initializeTheme: () => void;
  toggleDarkMode: () => void;
  setFontSize: (fontSize: ThemeSettings['fontSize']) => void;
  // Vercel theme accessors
  colors: typeof VERCEL_COLORS;
  typography: typeof VERCEL_TYPOGRAPHY;
  spacing: typeof VERCEL_SPACING;
  borderRadius: typeof VERCEL_BORDER_RADIUS;
  shadows: typeof VERCEL_SHADOWS;
  animation: typeof VERCEL_ANIMATION;
  layout: typeof VERCEL_LAYOUT;
}

const DEFAULT_THEME: ThemeSettings = {
  mode: 'system',
  fontSize: 'medium',
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: DEFAULT_THEME,
      colors: VERCEL_COLORS,
      typography: VERCEL_TYPOGRAPHY,
      spacing: VERCEL_SPACING,
      borderRadius: VERCEL_BORDER_RADIUS,
      shadows: VERCEL_SHADOWS,
      animation: VERCEL_ANIMATION,
      layout: VERCEL_LAYOUT,
      
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
