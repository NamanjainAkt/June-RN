import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';
import { useAppTheme } from '../../hooks';
import { VERCEL_BORDER_RADIUS, VERCEL_TYPOGRAPHY, VERCEL_SPACING } from '../../constants/vercel-theme';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'solid' | 'outlined';
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'error';
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export function Badge({
  children,
  variant = 'solid',
  color = 'primary',
  size = 'md',
  style
}: BadgeProps) {
  const { colors, typography, borderRadius, spacing } = useAppTheme();

  const getColorStyles = () => {
    switch (color) {
      case 'primary':
        return {
          backgroundColor: variant === 'solid' ? colors.textPrimary : 'transparent',
          borderColor: colors.textPrimary,
          color: variant === 'solid' ? colors.background : colors.textPrimary,
        };
      case 'secondary':
        return {
          backgroundColor: variant === 'solid' ? colors.textSecondary : 'transparent',
          borderColor: colors.textSecondary,
          color: variant === 'solid' ? colors.background : colors.textSecondary,
        };
      case 'accent':
        return {
          backgroundColor: variant === 'solid' ? colors.accent : 'transparent',
          borderColor: colors.accent,
          color: variant === 'solid' ? colors.textPrimary : colors.accent,
        };
      case 'success':
        return {
          backgroundColor: variant === 'solid' ? colors.success : 'transparent',
          borderColor: colors.success,
          color: variant === 'solid' ? colors.textPrimary : colors.success,
        };
      case 'error':
        return {
          backgroundColor: variant === 'solid' ? colors.error : 'transparent',
          borderColor: colors.error,
          color: variant === 'solid' ? colors.textPrimary : colors.error,
        };
      default:
        return {};
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          paddingHorizontal: spacing.sm,
          paddingVertical: spacing.xs,
          fontSize: typography.sizes.xs,
        };
      case 'md':
        return {
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.xs,
          fontSize: typography.sizes.sm,
        };
      default:
        return {};
    }
  };

  const colorStyles = getColorStyles();
  const sizeStyles = getSizeStyles();

  return (
    <View
      style={[
        {
          borderRadius: borderRadius.full,
          borderWidth: variant === 'outlined' ? 1 : 0,
          backgroundColor: colorStyles.backgroundColor,
          borderColor: colorStyles.borderColor,
          paddingHorizontal: sizeStyles.paddingHorizontal,
          paddingVertical: sizeStyles.paddingVertical,
        },
        style,
      ]}
    >
      <Text
        style={{
          color: colorStyles.color,
          fontSize: sizeStyles.fontSize,
          fontFamily: typography.fontFamily.medium,
          textAlign: 'center',
        }}
      >
        {children}
      </Text>
    </View>
  );
}
