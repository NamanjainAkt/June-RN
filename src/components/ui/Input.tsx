import React, { forwardRef } from 'react';
import { View, ViewStyle, TextInput as RNTextInput, TextInputProps as RNTextInputProps, TextStyle } from 'react-native';
import { Text } from 'react-native-paper';
import { useAppTheme } from '../../hooks';
import { VERCEL_BORDER_RADIUS, VERCEL_TYPOGRAPHY, VERCEL_SPACING, VERCEL_LAYOUT } from '../../constants/vercel-theme';

interface InputProps extends Omit<RNTextInputProps, 'style'> {
  label?: string;
  error?: string;
  helperText?: string;
  style?: TextStyle;
  containerStyle?: ViewStyle;
  fullWidth?: boolean;
}

export const Input = forwardRef<RNTextInput, InputProps>(({
  label,
  error,
  helperText,
  style,
  containerStyle,
  fullWidth = false,
  ...textInputProps
}, ref) => {
  const { colors, typography, borderRadius, spacing, layout } = useAppTheme();

  return (
    <View style={[{ width: fullWidth ? '100%' : undefined }, containerStyle]}>
      {label && (
        <Text
          style={{
            fontSize: typography.sizes.sm,
            fontFamily: typography.fontFamily.medium,
            color: error ? colors.error : colors.textSecondary,
            marginBottom: spacing.xs,
          }}
        >
          {label}
        </Text>
      )}

      <View
        style={{
          borderWidth: 1,
          borderColor: error ? colors.error : colors.border,
          borderRadius: borderRadius.md,
          backgroundColor: colors.surface,
        }}
      >
        <RNTextInput
          ref={ref}
          style={[
            {
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.md,
              fontSize: typography.sizes.base,
              fontFamily: typography.fontFamily.regular,
              color: colors.textPrimary,
              minHeight: layout.components.inputHeight,
            },
            style,
          ]}
          placeholderTextColor={colors.textTertiary}
          selectionColor={colors.accent}
          {...textInputProps}
        />
      </View>

      {(error || helperText) && (
        <Text
          style={{
            fontSize: typography.sizes.xs,
            fontFamily: typography.fontFamily.regular,
            color: error ? colors.error : colors.textTertiary,
            marginTop: spacing.xs,
          }}
        >
          {error || helperText}
        </Text>
      )}
    </View>
  );
});

Input.displayName = 'Input';
