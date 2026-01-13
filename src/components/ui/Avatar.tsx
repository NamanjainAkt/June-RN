import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';
import { useAppTheme } from '../../hooks';
import { VERCEL_BORDER_RADIUS, VERCEL_TYPOGRAPHY, VERCEL_LAYOUT } from '../../constants/vercel-theme';

interface AvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  source?: string;
  name?: string;
  style?: ViewStyle;
}

export function Avatar({ size = 'md', source, name, style }: AvatarProps) {
  const { colors, typography, borderRadius, layout } = useAppTheme();

  const avatarSize = layout.components.avatarSize[size];

  const getTextSize = () => {
    switch (size) {
      case 'sm': return typography.sizes.sm;
      case 'md': return typography.sizes.base;
      case 'lg': return typography.sizes.lg;
      case 'xl': return typography.sizes.xl;
      default: return typography.sizes.base;
    }
  };

  const initials = name
    ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <View
      style={[
        {
          width: avatarSize,
          height: avatarSize,
          borderRadius: avatarSize / 2,
          backgroundColor: colors.accent,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <Text
        style={{
          color: colors.textPrimary,
          fontSize: getTextSize(),
          fontFamily: typography.fontFamily.semibold,
          textAlign: 'center',
        }}
      >
        {initials}
      </Text>
    </View>
  );
}
