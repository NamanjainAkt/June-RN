// Design System - Vercel Inspired Theme
export const COLORS = {
  // Light Mode (Vercel-inspired)
  light: {
    background: '#FFFFFF',
    surface: '#FAFAFA',
    surfaceElevated: '#F5F5F5',
    surfaceVariant: '#F0F0F0',
    border: '#E5E5E5',
    borderLight: '#F0F0F0',
    primary: '#000000',
    primaryVariant: '#1A1A1A',
    primaryContainer: '#F5F5F5',
    secondary: '#666666',
    secondaryVariant: '#999999',
    tertiary: '#CCCCCC',
    accent: '#0070F3', // Vercel Blue
    accentHover: '#0052CC',
    error: '#DC2626',
    success: '#16A34A',
    warning: '#D97706',
    onBackground: '#000000',
    onSurface: '#000000',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onError: '#FFFFFF',
  },
  // Dark Mode
  dark: {
    background: '#000000',
    surface: '#0A0A0A',
    surfaceElevated: '#111111',
    surfaceVariant: '#1A1A1A',
    border: '#222222',
    borderLight: '#333333',
    primary: '#FFFFFF',
    primaryVariant: '#F0F0F0',
    primaryContainer: '#1A1A1A',
    secondary: '#A0A0A0',
    secondaryVariant: '#666666',
    tertiary: '#404040',
    accent: '#3B82F6', // Blue 500
    accentHover: '#2563EB',
    error: '#EF4444',
    success: '#22C55E',
    warning: '#F59E0B',
    onBackground: '#FFFFFF',
    onSurface: '#FFFFFF',
    onPrimary: '#000000',
    onSecondary: '#000000',
    onError: '#000000',
  },
};

export const TYPOGRAPHY = {
  fontFamily: {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semibold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
  },
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  lineHeights: {
    xs: 16,
    sm: 20,
    base: 24,
    lg: 28,
    xl: 32,
    '2xl': 36,
    '3xl': 42,
    '4xl': 48,
    '5xl': 60,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

export const BORDER_RADIUS = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const SHADOWS = {
  light: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  large: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
};

export const ANIMATION = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    linear: 'linear',
    in: 'ease-in',
    out: 'ease-out',
    inOut: 'ease-in-out',
  },
};
