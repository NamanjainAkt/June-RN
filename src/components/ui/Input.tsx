import React, { forwardRef } from 'react';
import { View, ViewStyle, TextInput as RNTextInput, TextInputProps as RNTextInputProps, TextStyle } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useAppTheme } from '../../hooks';
import { COLORS, BORDER_RADIUS, TYPOGRAPHY } from '../../constants/theme';

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
  const { isDarkMode } = useAppTheme();

  const colors = isDarkMode ? COLORS.dark : COLORS.light;

  return (
    <View style={[{ width: fullWidth ? '100%' : undefined }, containerStyle]}>
      {label && (
        <Text
          style={{
            fontSize: TYPOGRAPHY.sizes.sm,
            fontFamily: TYPOGRAPHY.fontFamily.medium,
            color: error ? colors.error : colors.secondary,
            marginBottom: 8,
          }}
        >
          {label}
        </Text>
      )}

      <View
        style={{
          borderWidth: 1,
          borderColor: error ? colors.error : colors.border,
          borderRadius: BORDER_RADIUS.sm,
          backgroundColor: colors.surface,
        }}
      >
        <RNTextInput
          ref={ref}
          style={[
            {
              paddingHorizontal: 16,
              paddingVertical: 12,
              fontSize: TYPOGRAPHY.sizes.base,
              fontFamily: TYPOGRAPHY.fontFamily.regular,
              color: colors.onSurface,
              minHeight: 44,
            },
            style,
          ]}
          placeholderTextColor={colors.secondaryVariant}
          selectionColor={colors.accent}
          {...textInputProps}
        />
      </View>

      {(error || helperText) && (
        <Text
          style={{
            fontSize: TYPOGRAPHY.sizes.xs,
            fontFamily: TYPOGRAPHY.fontFamily.regular,
            color: error ? colors.error : colors.secondaryVariant,
            marginTop: 4,
          }}
        >
          {error || helperText}
        </Text>
      )}
    </View>
  );
});

Input.displayName = 'Input';
