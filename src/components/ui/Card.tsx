import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Surface } from 'react-native-paper';
import { useAppTheme } from '../../hooks';
import { COLORS, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

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
  const { isDarkMode } = useAppTheme();

  const getPadding = () => {
    switch (padding) {
      case 'xs': return 8;
      case 'sm': return 12;
      case 'md': return 16;
      case 'lg': return 24;
      case 'xl': return 32;
      default: return 16;
    }
  };

  const getMargin = () => {
    switch (margin) {
      case 'xs': return 4;
      case 'sm': return 8;
      case 'md': return 16;
      case 'lg': return 24;
      case 'xl': return 32;
      default: return 0;
    }
  };

  const getVariantStyle = () => {
    const colors = isDarkMode ? COLORS.dark : COLORS.light;

    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: colors.surface,
          ...SHADOWS.medium,
        };
      case 'outlined':
        return {
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
        };
      case 'filled':
        return {
          backgroundColor: colors.surfaceElevated,
        };
      default:
        return {};
    }
  };

  return (
    <Surface
      style={[
        {
          borderRadius: BORDER_RADIUS.md,
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
