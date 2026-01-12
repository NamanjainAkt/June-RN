import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';
import { useAppTheme } from '../../hooks';
import { COLORS, BORDER_RADIUS, TYPOGRAPHY } from '../../constants/theme';

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
  const { isDarkMode } = useAppTheme();

  const colors = isDarkMode ? COLORS.dark : COLORS.light;

  const getColorStyles = () => {
    switch (color) {
      case 'primary':
        return {
          backgroundColor: variant === 'solid' ? colors.primary : 'transparent',
          borderColor: colors.primary,
          color: variant === 'solid' ? colors.onPrimary : colors.primary,
        };
      case 'secondary':
        return {
          backgroundColor: variant === 'solid' ? colors.secondary : 'transparent',
          borderColor: colors.secondary,
          color: variant === 'solid' ? colors.onSecondary : colors.secondary,
        };
      case 'accent':
        return {
          backgroundColor: variant === 'solid' ? colors.accent : 'transparent',
          borderColor: colors.accent,
          color: variant === 'solid' ? colors.onPrimary : colors.accent,
        };
      case 'success':
        return {
          backgroundColor: variant === 'solid' ? colors.success : 'transparent',
          borderColor: colors.success,
          color: variant === 'solid' ? colors.onPrimary : colors.success,
        };
      case 'error':
        return {
          backgroundColor: variant === 'solid' ? colors.error : 'transparent',
          borderColor: colors.error,
          color: variant === 'solid' ? colors.onError : colors.error,
        };
      default:
        return {};
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          paddingHorizontal: 8,
          paddingVertical: 4,
          fontSize: TYPOGRAPHY.sizes.xs,
        };
      case 'md':
        return {
          paddingHorizontal: 12,
          paddingVertical: 6,
          fontSize: TYPOGRAPHY.sizes.sm,
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
          borderRadius: BORDER_RADIUS.full,
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
          fontFamily: TYPOGRAPHY.fontFamily.medium,
          textAlign: 'center',
        }}
      >
        {children}
      </Text>
    </View>
  );
}
