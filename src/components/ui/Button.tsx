import React from 'react';
import { TouchableOpacity, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { Text } from 'react-native-paper';
import { useAppTheme } from '../../hooks';
import { getVercelColors, VERCEL_BORDER_RADIUS, VERCEL_TYPOGRAPHY, VERCEL_SPACING, VERCEL_LAYOUT } from '../../constants/vercel-theme';

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
  const { colors, typography, borderRadius, spacing, layout } = useAppTheme();

  const getSizeStyles = () => {
    const height = layout.components.buttonHeight[size];
    return {
      height,
      paddingHorizontal: size === 'sm' ? spacing.md : spacing.lg,
      paddingVertical: spacing.sm,
    };
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'solid':
        return {
          backgroundColor: disabled ? colors.surfaceActive : colors.accent,
          borderWidth: 0,
        };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: disabled ? colors.surfaceActive : colors.border,
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
    if (disabled) return colors.textTertiary;

    switch (variant) {
      case 'solid':
        return colors.textPrimary;
      case 'outlined':
      case 'ghost':
        return colors.textPrimary;
      default:
        return colors.textPrimary;
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm':
        return typography.sizes.sm;
      case 'md':
        return typography.sizes.base;
      case 'lg':
        return typography.sizes.lg;
      default:
        return typography.sizes.base;
    }
  };

  return (
    <TouchableOpacity
      onPress={loading || disabled ? undefined : onPress}
      disabled={loading || disabled}
      style={[
        {
          borderRadius: borderRadius.md,
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
            fontFamily: typography.fontFamily.medium,
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
