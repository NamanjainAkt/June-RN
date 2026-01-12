import { useCallback } from 'react';
import { useThemeStore } from '../store/useThemeStore';
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';
import { useEffect, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import Constants from 'expo-constants';

export function useClerkAuth() {
  const { setUser, setLoading, logout } = useAuthStore();
  const [isSignedIn, setIsSignedIn] = useState(false);

  const signIn = useCallback(async () => {
    setLoading(true);
    try {
      // Clerk sign-in logic will be implemented in the component
      // This is a placeholder for the hook structure
    } catch (error) {
      console.error('Sign in error:', error);
      setLoading(false);
    }
  }, [setLoading]);

  const signOut = useCallback(async () => {
    logout();
    setIsSignedIn(false);
  }, [logout]);

  return {
    signIn,
    signOut,
    isSignedIn,
    setIsSignedIn,
    setUser,
    setLoading,
  };
}

export function useAppTheme() {
  const { theme, setTheme, initializeTheme } = useThemeStore();
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

  return {
    isDarkMode,
    theme,
    setTheme,
  };
}

export function useFontSize() {
  const { theme, setTheme } = useThemeStore();

  const increaseFontSize = () => {
    const sizes: Array<'small' | 'medium' | 'large' | 'xlarge'> = ['small', 'medium', 'large', 'xlarge'];
    const currentIndex = sizes.indexOf(theme.fontSize);
    if (currentIndex < sizes.length - 1) {
      setTheme({ fontSize: sizes[currentIndex + 1] });
    }
  };

  const decreaseFontSize = () => {
    const sizes: Array<'small' | 'medium' | 'large' | 'xlarge'> = ['small', 'medium', 'large', 'xlarge'];
    const currentIndex = sizes.indexOf(theme.fontSize);
    if (currentIndex > 0) {
      setTheme({ fontSize: sizes[currentIndex - 1] });
    }
  };

  return {
    fontSize: theme.fontSize,
    increaseFontSize,
    decreaseFontSize,
  };
}
