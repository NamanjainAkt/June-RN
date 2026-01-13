import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Surface } from 'react-native-paper';
import { useAppTheme } from '../../hooks';
import { VERCEL_BORDER_RADIUS, VERCEL_SHADOWS, VERCEL_SPACING } from '../../constants/vercel-theme';

interface CardProps {
  children: React.ReactNode;
  variant?: 'elevated' | 'outlined' | 'filled';
  style?: ViewStyle;
  padding?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  margin?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export function Card({
  children,
  variant = 'elevated',
  style,
  padding = 'md',
  margin
}: CardProps) {
  const { colors, borderRadius, shadows, spacing } = useAppTheme();

  const getPadding = () => {
    switch (padding) {
      case 'xs': return spacing.sm;
      case 'sm': return spacing.md;
      case 'md': return spacing.lg;
      case 'lg': return spacing.xl;
      case 'xl': return spacing['2xl'];
      default: return spacing.lg;
    }
  };

  const getMargin = () => {
    switch (margin) {
      case 'xs': return spacing.xs;
      case 'sm': return spacing.sm;
      case 'md': return spacing.md;
      case 'lg': return spacing.lg;
      case 'xl': return spacing.xl;
      default: return 0;
    }
  };

  const getVariantStyle = () => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: colors.surface,
          ...shadows.medium,
        };
      case 'outlined':
        return {
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
        };
      case 'filled':
        return {
          backgroundColor: colors.surfaceHover,
        };
      default:
        return {};
    }
  };

  return (
    <Surface
      style={[
        {
          borderRadius: borderRadius.md,
          padding: getPadding(),
          margin: getMargin(),
        },
        getVariantStyle(),
        style,
      ]}
    >
      {children}
    </Surface>
  );
}
