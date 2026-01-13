// Centralized Typography System
// Maps React Native Paper variant names to React Native StyleSheet styles
// Ensures consistency with Vercel design system

import { VERCEL_TYPOGRAPHY } from '../constants/vercel-theme';

export const TYPOGRAPHY = {
  // Display variants
  displayLarge: {
    fontSize: VERCEL_TYPOGRAPHY.sizes['5xl'],
    fontWeight: '700' as const,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.bold,
    lineHeight: VERCEL_TYPOGRAPHY.lineHeights['5xl'],
  },
  displayMedium: {
    fontSize: VERCEL_TYPOGRAPHY.sizes['4xl'],
    fontWeight: '700' as const,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.bold,
    lineHeight: VERCEL_TYPOGRAPHY.lineHeights['4xl'],
  },
  displaySmall: {
    fontSize: VERCEL_TYPOGRAPHY.sizes['3xl'],
    fontWeight: '600' as const,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.semibold,
    lineHeight: VERCEL_TYPOGRAPHY.lineHeights['3xl'],
  },

  // Headline variants
  headlineLarge: {
    fontSize: VERCEL_TYPOGRAPHY.sizes['3xl'],
    fontWeight: '600' as const,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.semibold,
    lineHeight: VERCEL_TYPOGRAPHY.lineHeights['3xl'],
  },
  headlineMedium: {
    fontSize: VERCEL_TYPOGRAPHY.sizes['2xl'],
    fontWeight: '600' as const,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.semibold,
    lineHeight: VERCEL_TYPOGRAPHY.lineHeights['2xl'],
  },
  headlineSmall: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.xl,
    fontWeight: '600' as const,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.semibold,
    lineHeight: VERCEL_TYPOGRAPHY.lineHeights.xl,
  },

  // Title variants
  titleLarge: {
    fontSize: VERCEL_TYPOGRAPHY.sizes['2xl'],
    fontWeight: '600' as const,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.semibold,
    lineHeight: VERCEL_TYPOGRAPHY.lineHeights['2xl'],
  },
  titleMedium: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.xl,
    fontWeight: '500' as const,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.medium,
    lineHeight: VERCEL_TYPOGRAPHY.lineHeights.xl,
  },
  titleSmall: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.lg,
    fontWeight: '500' as const,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.medium,
    lineHeight: VERCEL_TYPOGRAPHY.lineHeights.lg,
  },

  // Body variants
  bodyLarge: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.base,
    fontWeight: '400' as const,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.regular,
    lineHeight: VERCEL_TYPOGRAPHY.lineHeights.base,
  },
  bodyMedium: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.sm,
    fontWeight: '400' as const,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.regular,
    lineHeight: VERCEL_TYPOGRAPHY.lineHeights.sm,
  },
  bodySmall: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.xs,
    fontWeight: '400' as const,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.regular,
    lineHeight: VERCEL_TYPOGRAPHY.lineHeights.xs,
  },

  // Label variants
  labelLarge: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.sm,
    fontWeight: '500' as const,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.medium,
    textTransform: 'uppercase' as const,
    letterSpacing: VERCEL_TYPOGRAPHY.letterSpacing.wide,
    lineHeight: VERCEL_TYPOGRAPHY.lineHeights.sm,
  },
  labelMedium: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.xs,
    fontWeight: '500' as const,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.medium,
    textTransform: 'uppercase' as const,
    letterSpacing: VERCEL_TYPOGRAPHY.letterSpacing.normal,
    lineHeight: VERCEL_TYPOGRAPHY.lineHeights.xs,
  },
  labelSmall: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.xs,
    fontWeight: '400' as const,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.regular,
    textTransform: 'uppercase' as const,
    letterSpacing: VERCEL_TYPOGRAPHY.letterSpacing.normal,
    lineHeight: VERCEL_TYPOGRAPHY.lineHeights.xs,
  },
} as const;

// Helper function to create styled text with variant
export const getTextStyle = (variant: keyof typeof TYPOGRAPHY) => TYPOGRAPHY[variant];

// Type for valid typography variants
export type TypographyVariant = keyof typeof TYPOGRAPHY;