import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';
import { useAppTheme } from '../../hooks';
import { COLORS, BORDER_RADIUS, TYPOGRAPHY } from '../../constants/theme';

interface AvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  source?: string;
  name?: string;
  style?: ViewStyle;
}

export function Avatar({ size = 'md', source, name, style }: AvatarProps) {
  const { isDarkMode } = useAppTheme();

  const getSize = () => {
    switch (size) {
      case 'sm': return 32;
      case 'md': return 40;
      case 'lg': return 56;
      case 'xl': return 72;
      default: return 40;
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm': return TYPOGRAPHY.sizes.sm;
      case 'md': return TYPOGRAPHY.sizes.base;
      case 'lg': return TYPOGRAPHY.sizes.lg;
      case 'xl': return TYPOGRAPHY.sizes.xl;
      default: return TYPOGRAPHY.sizes.base;
    }
  };

  const colors = isDarkMode ? COLORS.dark : COLORS.light;
  const avatarSize = getSize();

  const initials = name
    ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <View
      style={[
        {
          width: avatarSize,
          height: avatarSize,
          borderRadius: BORDER_RADIUS.full,
          backgroundColor: colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <Text
        style={{
          color: colors.onPrimary,
          fontSize: getTextSize(),
          fontFamily: TYPOGRAPHY.fontFamily.semibold,
          textAlign: 'center',
        }}
      >
        {initials}
      </Text>
    </View>
  );
}
