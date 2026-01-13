// Vercel Design System - React Native Implementation
// Minimal, Calm, Premium Design Language

export const VERCEL_COLORS = {
  // Dark Mode First (Vercel-style)
  dark: {
    // Core Palette
    background: '#000000',              // Pure black
    backgroundSecondary: '#0A0A0A',     // Very dark gray
    surface: '#111111',                 // Dark surface
    surfaceHover: '#1A1A1A',            // Hover state
    surfaceActive: '#222222',           // Active/pressed state
    
    // Text Hierarchy
    textPrimary: '#FFFFFF',             // Primary text
    textSecondary: '#A0A0A0',           // Secondary text
    textTertiary: '#666666',            // Tertiary/muted text
    textQuaternary: '#404040',          // Very muted text
    
    // Border System
    border: '#222222',                  // Standard border
    borderLight: '#333333',             // Light border
    borderStrong: '#1A1A1A',            // Strong border
    
    // Accent (Minimal)
    accent: '#3B82F6',                  // Vercel blue (subtle)
    accentHover: '#2563EB',            // Hover state
    accentActive: '#1D4ED8',            // Active state
    
    // Status Colors (Minimal)
    success: '#16A34A',                 // Green (subtle)
    warning: '#D97706',                 // Amber (subtle)
    error: '#DC2626',                   // Red (subtle)
    
    // Interactive States
    overlay: 'rgba(0, 0, 0, 0.8)',      // Dark overlay
    overlayLight: 'rgba(0, 0, 0, 0.4)', // Light overlay
  },
  
  // Light Mode (Minimal)
  light: {
    // Core Palette
    background: '#FFFFFF',              // Pure white
    backgroundSecondary: '#FAFAFA',     // Very light gray
    surface: '#F5F5F5',                 // Light surface
    surfaceHover: '#E5E5E5',            // Hover state
    surfaceActive: '#D4D4D4',           // Active/pressed state
    
    // Text Hierarchy
    textPrimary: '#000000',             // Primary text
    textSecondary: '#666666',           // Secondary text
    textTertiary: '#A0A0A0',            // Tertiary/muted text
    textQuaternary: '#CCCCCC',          // Very muted text
    
    // Border System
    border: '#E5E5E5',                  // Standard border
    borderLight: '#F0F0F0',             // Light border
    borderStrong: '#D4D4D4',            // Strong border
    
    // Accent (Minimal)
    accent: '#3B82F6',                  // Vercel blue (subtle)
    accentHover: '#2563EB',            // Hover state
    accentActive: '#1D4ED8',            // Active state
    
    // Status Colors (Minimal)
    success: '#16A34A',                 // Green (subtle)
    warning: '#D97706',                 // Amber (subtle)
    error: '#DC2626',                   // Red (subtle)
    
    // Interactive States
    overlay: 'rgba(0, 0, 0, 0.4)',      // Light overlay
    overlayLight: 'rgba(0, 0, 0, 0.2)', // Very light overlay
  },
};

export const VERCEL_TYPOGRAPHY = {
  // Inter Font Family (Already loaded)
  fontFamily: {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semibold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
  },
  
  // Type Scale (Vercel-inspired)
  sizes: {
    xs: 12,      // Caption, metadata
    sm: 14,      // Small text, helper text
    base: 16,    // Body text, standard
    lg: 18,      // Large body, subheadings
    xl: 20,      // Headings, titles
    '2xl': 24,   // Large headings
    '3xl': 30,   // Display headings
    '4xl': 36,   // Hero text
    '5xl': 48,   // Special display
  },
  
  // Line Heights (Optimized for readability)
  lineHeights: {
    xs: 16,      // Tight
    sm: 20,      // Standard
    base: 24,    // Comfortable
    lg: 28,      // Relaxed
    xl: 32,      // Spacious
    '2xl': 36,   // Very spacious
    '3xl': 42,   // Display
    '4xl': 48,   // Hero
    '5xl': 60,   // Special
  },
  
  // Font Weights
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  // Letter Spacing (Subtle)
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
  },
};

export const VERCEL_SPACING = {
  // Consistent 8px grid system
  xs: 4,        // 0.5rem
  sm: 8,        // 1rem
  md: 16,       // 2rem
  lg: 24,       // 3rem
  xl: 32,       // 4rem
  '2xl': 48,    // 6rem
  '3xl': 64,    // 8rem
  '4xl': 96,    // 12rem
};

export const VERCEL_BORDER_RADIUS = {
  // Consistent 8px system (Vercel standard)
  none: 0,
  sm: 4,        // Small elements
  md: 8,        // Standard (Vercel's default)
  lg: 12,       // Large elements
  xl: 16,       // Extra large
  '2xl': 20,    // Special cases
  full: 9999,   // Circles
};

export const VERCEL_SHADOWS = {
  // Minimal elevation system
  none: {},
  light: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

export const VERCEL_ANIMATION = {
  // Subtle, fast animations
  duration: {
    fast: 150,      // Quick transitions
    normal: 300,    // Standard animations
    slow: 500,      // Deliberate movements
  },
  easing: {
    linear: 'linear',
    in: 'ease-in',
    out: 'ease-out',
    inOut: 'ease-in-out',
  },
};

export const VERCEL_LAYOUT = {
  // Mobile-first breakpoints
  breakpoints: {
    sm: 375,    // iPhone SE
    md: 414,    // iPhone Pro
    lg: 768,    // iPad
    xl: 1024,   // iPad Pro
  },
  
  // Safe areas and spacing
  safeArea: {
    top: 44,     // Status bar
    bottom: 34,  // Home indicator
    sides: 16,   // Side margins
  },
  
  // Component dimensions
  components: {
    buttonHeight: {
      sm: 36,
      md: 44,
      lg: 52,
    },
    inputHeight: 44,
    avatarSize: {
      xs: 24,
      sm: 32,
      md: 40,
      lg: 48,
      xl: 64,
    },
    iconSize: {
      xs: 16,
      sm: 20,
      md: 24,
      lg: 32,
      xl: 40,
    },
  },
};

// Helper function to get theme colors
export const getVercelColors = (isDarkMode: boolean) => 
  isDarkMode ? VERCEL_COLORS.dark : VERCEL_COLORS.light;

// Helper function for responsive sizing
export const responsiveSize = (size: number, factor: number = 1) => 
  Math.round(size * factor);