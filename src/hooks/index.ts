import { useCallback } from 'react';
import { useThemeStore } from '../store/useThemeStore';
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';
import { useEffect, useState } from 'react';
import { Appearance, ColorSchemeName, Platform } from 'react-native';
import Constants from 'expo-constants';



export function useAppTheme() {
  const { theme, setTheme, initializeTheme, colors, typography, spacing, borderRadius, shadows, animation, layout } = useThemeStore();
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>(Appearance.getColorScheme());

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setColorScheme(colorScheme);
    });
    return () => subscription.remove();
  }, []);

  const isDarkMode =
    theme.mode === 'dark' ||
    (theme.mode === 'system' && colorScheme === 'dark');

  const toggleTheme = useCallback(() => {
    setTheme({ mode: theme.mode === 'dark' ? 'light' : 'dark' });
  }, [theme.mode, setTheme]);

  // Get current theme colors based on mode
  const getCurrentColors = () => {
    return isDarkMode ? colors.dark : colors.light;
  };

  return {
    isDarkMode,
    theme,
    setTheme,
    toggleTheme,
    // Vercel theme system
    colors: getCurrentColors(),
    typography,
    spacing,
    borderRadius,
    shadows,
    animation,
    layout,
  };
}

export function useFontSize() {
  const { theme, setFontSize } = useThemeStore();

  const increaseFontSize = useCallback(() => {
    const sizes: Array<'small' | 'medium' | 'large' | 'xlarge'> = ['small', 'medium', 'large', 'xlarge'];
    const currentIndex = sizes.indexOf(theme.fontSize);
    if (currentIndex < sizes.length - 1) {
      setFontSize(sizes[currentIndex + 1]);
    }
  }, [theme.fontSize, setFontSize]);

  const decreaseFontSize = useCallback(() => {
    const sizes: Array<'small' | 'medium' | 'large' | 'xlarge'> = ['small', 'medium', 'large', 'xlarge'];
    const currentIndex = sizes.indexOf(theme.fontSize);
    if (currentIndex > 0) {
      setFontSize(sizes[currentIndex - 1]);
    }
  }, [theme.fontSize, setFontSize]);

  return {
    fontSize: theme.fontSize,
    increaseFontSize,
    decreaseFontSize,
  };
}

export function useDynamicFontSize(baseSize: number = 16) {
  const { fontSize } = useFontSize();

  const multipliers: Record<string, number> = {
    small: 0.875,
    medium: 1,
    large: 1.125,
    xlarge: 1.25,
  };

  return Math.round(baseSize * multipliers[fontSize]);
}
