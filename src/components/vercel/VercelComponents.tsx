// Vercel-Style Component Architecture
// Clean, Minimal, Production-Ready Components

import React from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { getVercelColors, VERCEL_BORDER_RADIUS, VERCEL_LAYOUT, VERCEL_SPACING, VERCEL_TYPOGRAPHY } from '../../constants/vercel-theme';
import { Agent } from '../../types';

// Base Component Props
interface BaseComponentProps {
  isDarkMode: boolean;
  style?: ViewStyle;
  children?: React.ReactNode;
}

// Vercel Button Component
interface VercelButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'solid' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  text?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const VercelButton: React.FC<VercelButtonProps> = ({
  isDarkMode,
  variant = 'primary',
  size = 'md',
  onPress,
  disabled = false,
  loading = false,
  fullWidth = false,
  text,
  leftIcon,
  rightIcon,
  style,
  children,
}) => {
  const colors = getVercelColors(isDarkMode);

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: disabled ? colors.surfaceActive : colors.accent,
          borderWidth: 0,
        };
      case 'solid':
        return {
          backgroundColor: disabled ? colors.surfaceActive : colors.accent,
          borderWidth: 0,
        };
      case 'secondary':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.border,
        };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.border,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderWidth: 0,
        };
      case 'danger':
        return {
          backgroundColor: colors.error,
          borderWidth: 0,
        };
      default:
        return {};
    }
  };

  const getSizeStyles = (): ViewStyle => {
    const height = VERCEL_LAYOUT.components.buttonHeight[size];
    return {
      height,
      paddingHorizontal: size === 'sm' ? VERCEL_SPACING.md : VERCEL_SPACING.lg,
    };
  };

  const getTextStyles = (): TextStyle => {
    const color = variant === 'primary' || variant === 'danger'
      ? colors.textPrimary
      : colors.textPrimary;

    return {
      color: disabled ? colors.textTertiary : color,
      fontSize: VERCEL_TYPOGRAPHY.sizes[size === 'sm' ? 'sm' : 'base'],
      fontFamily: VERCEL_TYPOGRAPHY.fontFamily.medium,
    };
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        getVariantStyles(),
        getSizeStyles(),
        {
          opacity: disabled ? 0.5 : 1,
          width: fullWidth ? '100%' : undefined,
        },
        style,
      ]}
      activeOpacity={0.8}
    >
      {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}

      <Text style={getTextStyles()}>
        {loading ? 'Loading...' : (text || children)}
      </Text>

      {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
    </TouchableOpacity>
  );
};

// Vercel Card Component
interface VercelCardProps extends BaseComponentProps {
  variant?: 'default' | 'bordered' | 'elevated';
  padding?: 'xs' | 'sm' | 'md' | 'lg';
  onPress?: () => void;
  hoverable?: boolean;
}

export const VercelCard: React.FC<VercelCardProps> = ({
  isDarkMode,
  variant = 'default',
  padding = 'md',
  onPress,
  hoverable = false,
  style,
  children,
}) => {
  const colors = getVercelColors(isDarkMode);

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'default':
        return {
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
        };
      case 'bordered':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.borderLight,
        };
      case 'elevated':
        return {
          backgroundColor: colors.surface,
          borderWidth: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 4,
        };
      default:
        return {};
    }
  };

  const getPadding = (): number => {
    switch (padding) {
      case 'xs': return VERCEL_SPACING.sm;
      case 'sm': return VERCEL_SPACING.md;
      case 'md': return VERCEL_SPACING.lg;
      case 'lg': return VERCEL_SPACING.xl;
      default: return VERCEL_SPACING.lg;
    }
  };

  const CardComponent = (
    <View
      style={[
        styles.card,
        getVariantStyles(),
        {
          padding: getPadding(),
        },
        style,
      ]}
    >
      {children}
    </View>
  );

  if (onPress || hoverable) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={!onPress}
        activeOpacity={0.8}
        style={styles.cardTouchable}
      >
        {CardComponent}
      </TouchableOpacity>
    );
  }

  return CardComponent;
};

// Vercel Input Component
interface VercelInputProps extends BaseComponentProps {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  error?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const VercelInput: React.FC<VercelInputProps> = ({
  isDarkMode,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  error = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
}) => {
  const colors = getVercelColors(isDarkMode);

  return (
    <View style={[styles.inputContainer, style]}>
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: error ? colors.error : colors.border,
            minHeight: VERCEL_LAYOUT.components.inputHeight,
          },
        ]}
      >
        {leftIcon && <View style={styles.inputIconLeft}>{leftIcon}</View>}

        <Text
          style={[
            styles.input,
            {
              color: colors.textPrimary,
              fontSize: VERCEL_TYPOGRAPHY.sizes.base,
              fontFamily: VERCEL_TYPOGRAPHY.fontFamily.regular,
            },
          ]}
        >
          {value || placeholder}
        </Text>

        {rightIcon && <View style={styles.inputIconRight}>{rightIcon}</View>}
      </View>

      {error && (
        <Text style={[styles.errorText, { color: colors.error }]}>
          Error message
        </Text>
      )}
    </View>
  );
};

// Vercel Avatar Component
interface VercelAvatarProps extends BaseComponentProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  name?: string;
  imageUrl?: string;
  fallback?: string;
}

export const VercelAvatar: React.FC<VercelAvatarProps> = ({
  isDarkMode,
  size = 'md',
  name,
  imageUrl,
  fallback = '?',
  style,
}) => {
  const colors = getVercelColors(isDarkMode);
  const avatarSize = VERCEL_LAYOUT.components.avatarSize[size];

  return (
    <View
      style={[
        styles.avatar,
        {
          width: avatarSize,
          height: avatarSize,
          borderRadius: avatarSize / 2,
          backgroundColor: colors.surfaceActive,
        },
        style,
      ]}
    >
      {imageUrl ? (
        // Image component would go here
        <Text style={{ color: colors.textPrimary }}>IMG</Text>
      ) : (
        <Text
          style={[
            styles.avatarText,
            {
              color: colors.textPrimary,
              fontSize: avatarSize / 2.5,
            },
          ]}
        >
          {name?.charAt(0)?.toUpperCase() || fallback}
        </Text>
      )}
    </View>
  );
};

// Vercel Badge Component
interface VercelBadgeProps extends BaseComponentProps {
  variant?: 'default' | 'primary' | 'success' | 'error' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  text: string;
}

export const VercelBadge: React.FC<VercelBadgeProps> = ({
  isDarkMode,
  variant = 'default',
  size = 'md',
  text,
  style,
}) => {
  const colors = getVercelColors(isDarkMode);

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: colors.accent,
        };
      case 'success':
        return {
          backgroundColor: colors.success,
        };
      case 'error':
        return {
          backgroundColor: colors.error,
        };
      case 'warning':
        return {
          backgroundColor: colors.warning,
        };
      default:
        return {
          backgroundColor: colors.surfaceActive,
        };
    }
  };

  const getSizeStyles = (): ViewStyle & TextStyle => {
    switch (size) {
      case 'sm':
        return {
          paddingHorizontal: VERCEL_SPACING.sm,
          paddingVertical: VERCEL_SPACING.xs,
          fontSize: VERCEL_TYPOGRAPHY.sizes.xs,
        };
      case 'lg':
        return {
          paddingHorizontal: VERCEL_SPACING.lg,
          paddingVertical: VERCEL_SPACING.md,
          fontSize: VERCEL_TYPOGRAPHY.sizes.base,
        };
      default:
        return {
          paddingHorizontal: VERCEL_SPACING.md,
          paddingVertical: VERCEL_SPACING.xs,
          fontSize: VERCEL_TYPOGRAPHY.sizes.sm,
        };
    }
  };

  return (
    <View
      style={[
        styles.badge,
        getVariantStyles(),
        getSizeStyles(),
        style,
      ]}
    >
      <Text
        style={[
          styles.badgeText,
          {
            color: colors.textPrimary,
          },
        ]}
      >
        {text}
      </Text>
    </View>
  );
};

// Vercel Agent Card Component
interface VercelAgentCardProps {
  isDarkMode: boolean;
  agent: Agent;
  onPress: (agent: Agent) => void;
  style?: any;
  variant?: 'standard' | 'featured';
}

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export const VercelAgentCard: React.FC<VercelAgentCardProps> = ({
  isDarkMode,
  agent,
  onPress,
  style,
  variant = 'standard',
}) => {
  const colors = getVercelColors(isDarkMode);
  const hasGradient = agent.gradientColors && agent.gradientColors.length >= 2;
  const isFeatured = variant === 'featured';

  const CardContent = (
    <View style={[
      styles.agentCardInner,
      isFeatured && styles.agentCardInnerFeatured
    ]}>
      {/* Left side: Icon + Name + Description */}
      <View style={[
        styles.agentCardLeft,
        isFeatured && styles.agentCardLeftFeatured
      ]}>
        <View style={[
          styles.agentIconCompact,
          isFeatured && styles.agentIconFeatured,
          { backgroundColor: hasGradient ? 'rgba(255,255,255,0.2)' : colors.surfaceActive },
        ]}>
          <Text style={[
            styles.agentIconTextCompact,
            isFeatured && styles.agentIconTextFeatured,
            { color: hasGradient ? '#FFFFFF' : colors.accent }
          ]}>
            {agent.name.charAt(0).toUpperCase()}
          </Text>
        </View>

        <View style={[
          styles.agentCardContent,
          isFeatured && styles.agentCardContentFeatured
        ]}>
          <Text style={[
            styles.agentNameCompact,
            isFeatured && styles.agentNameFeatured,
            { color: hasGradient ? '#FFFFFF' : colors.textPrimary },
            hasGradient && styles.textShadow,
          ]}
            numberOfLines={1}
          >
            {agent.name}
          </Text>
          <Text style={[
            styles.agentDescriptionCompact,
            isFeatured && styles.agentDescriptionFeatured,
            { color: hasGradient ? 'rgba(255,255,255,0.9)' : colors.textSecondary },
            hasGradient && styles.textShadow,
          ]}
            numberOfLines={isFeatured ? 2 : 1}
            ellipsizeMode="tail"
          >
            {agent.description}
          </Text>
        </View>
      </View>

      {/* Right side: Arrow Icon */}
      <View style={isFeatured ? styles.arrowIconFeaturedContainer : null}>
        <MaterialCommunityIcons
          name="chevron-right"
          size={isFeatured ? 20 : 24}
          color={hasGradient ? '#FFFFFF' : colors.textTertiary}
        />
      </View>
    </View>
  );

  return (
    <TouchableOpacity
      style={[
        styles.agentCard,
        isFeatured && styles.agentCardFeatured,
        !hasGradient && {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
        style,
      ]}
      onPress={() => onPress(agent)}
      activeOpacity={0.7}
    >
      {hasGradient ? (
        <LinearGradient
          colors={agent.gradientColors as unknown as readonly [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.gradientContainer,
            isFeatured && styles.gradientContainerFeatured
          ]}
        >
          {CardContent}
        </LinearGradient>
      ) : (
        CardContent
      )}
    </TouchableOpacity>
  );
};

// Styles
const styles = StyleSheet.create({
  // Button Styles
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: VERCEL_BORDER_RADIUS.md,
    gap: VERCEL_SPACING.xs,
  },
  iconLeft: {
    marginRight: -VERCEL_SPACING.xs,
  },
  iconRight: {
    marginLeft: -VERCEL_SPACING.xs,
  },

  // Card Styles
  card: {
    borderRadius: VERCEL_BORDER_RADIUS.md,
  },
  cardTouchable: {
    borderRadius: VERCEL_BORDER_RADIUS.md,
  },

  // Input Styles
  inputContainer: {
    gap: VERCEL_SPACING.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: VERCEL_BORDER_RADIUS.md,
    paddingHorizontal: VERCEL_SPACING.md,
  },
  input: {
    flex: 1,
    paddingVertical: VERCEL_SPACING.md,
  },
  inputIconLeft: {
    marginRight: VERCEL_SPACING.sm,
  },
  inputIconRight: {
    marginLeft: VERCEL_SPACING.sm,
  },
  errorText: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.xs,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.regular,
  },

  // Avatar Styles
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarText: {
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.medium,
  },

  // Badge Styles
  badge: {
    borderRadius: VERCEL_BORDER_RADIUS.sm,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.medium,
    textAlign: 'center',
  },

  // Agent Card Styles (Compact Horizontal)
  agentCard: {
    borderRadius: VERCEL_BORDER_RADIUS.md,
    borderWidth: 1,
    width: '100%',
    overflow: 'hidden',
    height: 80,
  },
  agentCardFeatured: {
    height: 120,
  },
  gradientContainer: {
    padding: VERCEL_SPACING.md,
    width: '100%',
    height: 80,
    justifyContent: 'center',
  },
  gradientContainerFeatured: {
    height: 120,
  },
  agentCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: VERCEL_SPACING.md,
    height: 80,
  },
  agentCardInnerFeatured: {
    height: 120,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: VERCEL_SPACING.sm,
  },
  agentCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: VERCEL_SPACING.md,
    flex: 1,
  },
  agentCardLeftFeatured: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 6,
    flex: 1,
    width: '100%',
  },
  agentIconCompact: {
    width: 48,
    height: 48,
    borderRadius: VERCEL_BORDER_RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  agentIconFeatured: {
    width: 40, // Smaller icon for vertical layout to fit better
    height: 40,
    borderRadius: VERCEL_BORDER_RADIUS.sm,
  },
  agentIconTextCompact: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.xl,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.bold,
  },
  agentIconTextFeatured: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.lg,
  },
  agentCardContent: {
    flex: 1,
    gap: 2,
  },
  agentCardContentFeatured: {
    width: '100%',
    gap: 1,
  },
  agentNameCompact: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.base,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.semibold,
  },
  agentNameFeatured: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.sm, // Slightly smaller to fit width
  },
  agentDescriptionCompact: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.sm,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.regular,
  },
  agentDescriptionFeatured: {
    fontSize: 11, // Tiny but readable for the grid
    lineHeight: 14,
  },
  arrowIconCompact: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: VERCEL_SPACING.sm,
  },
  arrowIconFeaturedContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  textShadow: {
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});