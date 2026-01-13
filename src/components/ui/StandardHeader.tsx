// Standardized Header Component for Navigation Consistency
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useAppTheme } from '../../hooks';
import { VERCEL_SPACING, VERCEL_BORDER_RADIUS, VERCEL_TYPOGRAPHY, VERCEL_LAYOUT } from '../../constants/vercel-theme';

interface StandardHeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
  backgroundColor?: string;
  titleColor?: string;
}

export function StandardHeader({
  title,
  showBackButton = false,
  onBackPress,
  rightComponent,
  backgroundColor,
  titleColor,
}: StandardHeaderProps) {
  const { colors, typography } = useAppTheme();

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: backgroundColor || colors.background,
        borderBottomColor: colors.border,
        paddingTop: VERCEL_LAYOUT.safeArea.top,
      }
    ]}>
      <View style={styles.content}>
        {/* Back Button */}
        {showBackButton && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBackPress}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={VERCEL_LAYOUT.components.iconSize.lg}
              color={titleColor || colors.textPrimary}
            />
          </TouchableOpacity>
        )}

        {/* Title */}
        {title && (
          <Text
            style={[
              styles.title,
              {
                color: titleColor || colors.textPrimary,
                fontFamily: typography.fontFamily.semibold,
                fontSize: typography.sizes.lg,
              },
            ]}
          >
            {title}
          </Text>
        )}

        {/* Right Component */}
        {rightComponent && (
          <View style={styles.rightComponent}>
            {rightComponent}
          </View>
        )}

        {/* Spacer for centering title when no right component */}
        {!rightComponent && (showBackButton || title) && (
          <View style={styles.spacer} />
        )}
      </View>
    </View>
  );
}

// Screen-specific header components
export function ChatHeader({ agentName, onBack }: { agentName: string; onBack: () => void }) {
  const { colors } = useAppTheme();
  
  return (
    <StandardHeader
      title={agentName}
      showBackButton
      onBackPress={onBack}
      rightComponent={
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: colors.surfaceActive }]}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name="cog-outline"
            size={VERCEL_LAYOUT.components.iconSize.md}
            color={colors.textPrimary}
          />
        </TouchableOpacity>
      }
    />
  );
}

export function CreateAgentHeader({ onBack }: { onBack: () => void }) {
  return (
    <StandardHeader
      title="Create Custom Agent"
      showBackButton
      onBackPress={onBack}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: VERCEL_SPACING.md,
    paddingVertical: VERCEL_SPACING.md,
    minHeight: VERCEL_LAYOUT.components.buttonHeight.lg,
  },
  backButton: {
    padding: VERCEL_SPACING.xs,
    marginRight: VERCEL_SPACING.sm,
    width: VERCEL_LAYOUT.components.buttonHeight.md,
    height: VERCEL_LAYOUT.components.buttonHeight.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: VERCEL_BORDER_RADIUS.md,
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
  rightComponent: {
    marginLeft: VERCEL_SPACING.md,
  },
  spacer: {
    width: VERCEL_LAYOUT.components.buttonHeight.md,
  },
  iconButton: {
    width: VERCEL_LAYOUT.components.buttonHeight.md,
    height: VERCEL_LAYOUT.components.buttonHeight.md,
    borderRadius: VERCEL_BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});