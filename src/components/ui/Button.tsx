import React from 'react';
import { TouchableOpacity, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { Text } from 'react-native-paper';
import { useAppTheme } from '../../hooks';
import { COLORS, BORDER_RADIUS, TYPOGRAPHY } from '../../constants/theme';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'solid' | 'outlined' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = 'solid',
  size = 'md',
  onPress,
  disabled = false,
  loading = false,
  style,
  textStyle,
  fullWidth = false,
}: ButtonProps) {
  const { isDarkMode } = useAppTheme();

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          paddingHorizontal: 12,
          paddingVertical: 8,
          minHeight: 36,
        };
      case 'md':
        return {
          paddingHorizontal: 16,
          paddingVertical: 12,
          minHeight: 44,
        };
      case 'lg':
        return {
          paddingHorizontal: 24,
          paddingVertical: 16,
          minHeight: 52,
        };
      default:
        return {};
    }
  };

  const getVariantStyles = () => {
    const colors = isDarkMode ? COLORS.dark : COLORS.light;

    switch (variant) {
      case 'solid':
        return {
          backgroundColor: disabled ? colors.tertiary : colors.primary,
          borderWidth: 0,
        };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: disabled ? colors.tertiary : colors.border,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderWidth: 0,
        };
      default:
        return {};
    }
  };

  const getTextColor = () => {
    const colors = isDarkMode ? COLORS.dark : COLORS.light;

    if (disabled) return colors.tertiary;

    switch (variant) {
      case 'solid':
        return colors.onPrimary;
      case 'outlined':
      case 'ghost':
        return colors.primary;
      default:
        return colors.primary;
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm':
        return TYPOGRAPHY.sizes.sm;
      case 'md':
        return TYPOGRAPHY.sizes.base;
      case 'lg':
        return TYPOGRAPHY.sizes.lg;
      default:
        return TYPOGRAPHY.sizes.base;
    }
  };

  return (
    <TouchableOpacity
      onPress={loading || disabled ? undefined : onPress}
      disabled={loading || disabled}
      style={[
        {
          borderRadius: BORDER_RADIUS.sm,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: disabled ? 0.5 : 1,
          width: fullWidth ? '100%' : undefined,
        },
        getSizeStyles(),
        getVariantStyles(),
        style,
      ]}
      activeOpacity={0.8}
    >
      <Text
        style={[
          {
            color: getTextColor(),
            fontSize: getTextSize(),
            fontFamily: TYPOGRAPHY.fontFamily.medium,
            textAlign: 'center',
          },
          textStyle,
        ]}
      >
        {loading ? 'Loading...' : children}
      </Text>
    </TouchableOpacity>
  );
}
