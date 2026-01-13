import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Icon, Text } from 'react-native-paper';
import { Agent } from '../types';
import { useAppTheme } from '../hooks';
import { VERCEL_SPACING, VERCEL_BORDER_RADIUS, VERCEL_LAYOUT } from '../constants/vercel-theme';

interface AgentCardProps {
  agent: Agent;
  onPress: (agent: Agent) => void;
}

export function AgentCard({ agent, onPress }: AgentCardProps) {
  const { colors, typography, spacing, borderRadius, layout } = useAppTheme();

  return (
    <TouchableOpacity
      style={[
        styles.card, 
        { 
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderWidth: 1,
          minHeight: VERCEL_LAYOUT.components.buttonHeight.md * 2, // Ensure minimum touch target
        }
      ]}
      onPress={() => onPress(agent)}
      activeOpacity={0.8}
    >
      <View style={[styles.iconContainer, { backgroundColor: colors.surfaceActive }]}>
        <Icon source={agent.icon as any} size={layout.components.iconSize.lg} color={colors.accent} />
      </View>
      <Text style={[styles.name, { 
        color: colors.textPrimary, 
        fontSize: typography.sizes.base,
        fontFamily: typography.fontFamily.semibold,
      }]} numberOfLines={1}>
        {agent.name}
      </Text>
      <Text style={[styles.description, { 
        color: colors.textSecondary, 
        fontSize: typography.sizes.sm,
        fontFamily: typography.fontFamily.regular,
        lineHeight: typography.lineHeights.sm,
      }]} numberOfLines={2}>
        {agent.description}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: VERCEL_SPACING.md,
    borderRadius: VERCEL_BORDER_RADIUS.lg,
    alignItems: 'center',
    width: 160, // Increased for better touch target
    marginHorizontal: VERCEL_SPACING.xs,
  },
  iconContainer: {
    width: VERCEL_LAYOUT.components.avatarSize.lg,
    height: VERCEL_LAYOUT.components.avatarSize.lg,
    borderRadius: VERCEL_LAYOUT.components.avatarSize.lg / 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: VERCEL_SPACING.md,
  },
  name: {
    marginBottom: VERCEL_SPACING.xs,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
  },
});
