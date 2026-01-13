// Vercel-Style Home Screen Components
// Clean, Minimal, Professional Interface

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { getVercelColors, VERCEL_TYPOGRAPHY, VERCEL_BORDER_RADIUS, VERCEL_SPACING, VERCEL_LAYOUT } from '../../constants/vercel-theme';
import { Agent } from '../../types';

// Vercel Home Header Component
interface VercelHomeHeaderProps {
  isDarkMode: boolean;
  userName: string;
  onSettingsPress: () => void;
}

export const VercelHomeHeader: React.FC<VercelHomeHeaderProps> = ({
  isDarkMode,
  userName,
  onSettingsPress,
}) => {
  const colors = getVercelColors(isDarkMode);
  
  return (
    <View style={[
      styles.headerContainer,
      { backgroundColor: colors.background },
    ]}>
      <View style={styles.headerContent}>
        {/* User Info */}
        <View style={styles.userInfo}>
          <View style={[
            styles.userAvatar,
            { backgroundColor: colors.surfaceActive },
          ]}>
            <Text style={[
              styles.userAvatarText,
              { color: colors.textPrimary },
            ]}>
              {userName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.userText}>
            <Text style={[
              styles.greeting,
              { color: colors.textSecondary },
            ]}>
              Welcome back,
            </Text>
            <Text style={[
              styles.userName,
              { color: colors.textPrimary },
            ]}>
              {userName}
            </Text>
          </View>
        </View>
        
        {/* Settings Button */}
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={onSettingsPress}
        >
          <Text style={[styles.settingsIcon, { color: colors.textSecondary }]}>
            ⚙️
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Vercel Agent Card Component
interface VercelAgentCardProps {
  isDarkMode: boolean;
  agent: Agent;
  onPress: (agent: Agent) => void;
}

export const VercelAgentCard: React.FC<VercelAgentCardProps> = ({
  isDarkMode,
  agent,
  onPress,
}) => {
  const colors = getVercelColors(isDarkMode);
  
  return (
    <TouchableOpacity
      style={[
        styles.agentCard,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
      onPress={() => onPress(agent)}
      activeOpacity={0.8}
    >
      {/* Agent Icon */}
      <View style={[
        styles.agentIcon,
        { backgroundColor: colors.surfaceActive },
      ]}>
        <Text style={[styles.agentIconText, { color: colors.textPrimary }]}>
          {agent.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      
      {/* Agent Info */}
      <View style={styles.agentInfo}>
        <Text style={[
          styles.agentName,
          { color: colors.textPrimary },
        ]}>
          {agent.name}
        </Text>
        <Text style={[
          styles.agentDescription,
          { color: colors.textSecondary },
        ]}>
          {agent.description}
        </Text>
      </View>
      
      {/* Arrow Indicator */}
      <Text style={[styles.arrowIcon, { color: colors.textTertiary }]}>
        →
      </Text>
    </TouchableOpacity>
  );
};

// Vercel Quick Action Card Component
interface VercelQuickActionCardProps {
  isDarkMode: boolean;
  title: string;
  description: string;
  icon: string;
  onPress: () => void;
}

export const VercelQuickActionCard: React.FC<VercelQuickActionCardProps> = ({
  isDarkMode,
  title,
  description,
  icon,
  onPress,
}) => {
  const colors = getVercelColors(isDarkMode);
  
  return (
    <TouchableOpacity
      style={[
        styles.quickActionCard,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.quickActionContent}>
        <Text style={[styles.quickActionIcon, { color: colors.textPrimary }]}>
          {icon}
        </Text>
        <Text style={[
          styles.quickActionTitle,
          { color: colors.textPrimary },
        ]}>
          {title}
        </Text>
        <Text style={[
          styles.quickActionDescription,
          { color: colors.textSecondary },
        ]}>
          {description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// Vercel Section Header Component
interface VercelSectionHeaderProps {
  isDarkMode: boolean;
  title: string;
  subtitle?: string;
}

export const VercelSectionHeader: React.FC<VercelSectionHeaderProps> = ({
  isDarkMode,
  title,
  subtitle,
}) => {
  const colors = getVercelColors(isDarkMode);
  
  return (
    <View style={styles.sectionHeader}>
      <Text style={[
        styles.sectionTitle,
        { color: colors.textPrimary },
      ]}>
        {title}
      </Text>
      {subtitle && (
        <Text style={[
          styles.sectionSubtitle,
          { color: colors.textSecondary },
        ]}>
          {subtitle}
        </Text>
      )}
    </View>
  );
};

// Vercel Featured Agents List Component
interface VercelFeaturedAgentsProps {
  isDarkMode: boolean;
  agents: Agent[];
  onAgentPress: (agent: Agent) => void;
}

export const VercelFeaturedAgents: React.FC<VercelFeaturedAgentsProps> = ({
  isDarkMode,
  agents,
  onAgentPress,
}) => {
  const colors = getVercelColors(isDarkMode);
  
  const renderAgent = ({ item }: { item: Agent }) => (
    <View style={styles.agentCardWrapper}>
      <VercelAgentCard
        isDarkMode={isDarkMode}
        agent={item}
        onPress={onAgentPress}
      />
    </View>
  );
  
  return (
    <View style={styles.featuredAgentsContainer}>
      <FlatList
        data={agents}
        renderItem={renderAgent}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.featuredAgentsList}
      />
    </View>
  );
};

// Vercel Quick Actions Grid Component
interface VercelQuickActionsProps {
  isDarkMode: boolean;
  actions: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    onPress: () => void;
  }>;
}

export const VercelQuickActions: React.FC<VercelQuickActionsProps> = ({
  isDarkMode,
  actions,
}) => {
  return (
    <View style={styles.quickActionsGrid}>
      {actions.map((action) => (
        <View key={action.id} style={styles.quickActionWrapper}>
          <VercelQuickActionCard
            isDarkMode={isDarkMode}
            title={action.title}
            description={action.description}
            icon={action.icon}
            onPress={action.onPress}
          />
        </View>
      ))}
    </View>
  );
};

// Vercel Create Agent CTA Component
interface VercelCreateAgentCTAProps {
  isDarkMode: boolean;
  onPress: () => void;
}

export const VercelCreateAgentCTA: React.FC<VercelCreateAgentCTAProps> = ({
  isDarkMode,
  onPress,
}) => {
  const colors = getVercelColors(isDarkMode);
  
  return (
    <TouchableOpacity
      style={[
        styles.createAgentCTA,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.createAgentContent}>
        <View style={styles.createAgentText}>
          <Text style={[
            styles.createAgentTitle,
            { color: colors.textPrimary },
          ]}>
            Create Your Own Agent
          </Text>
          <Text style={[
            styles.createAgentDescription,
            { color: colors.textSecondary },
          ]}>
            Build custom AI agents tailored to your specific needs
          </Text>
        </View>
        
        <View style={[
          styles.createAgentButton,
          { backgroundColor: colors.accent },
        ]}>
          <Text style={[
            styles.createAgentButtonText,
            { color: colors.textPrimary },
          ]}>
            Create
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Vercel Footer Component
interface VercelFooterProps {
  isDarkMode: boolean;
  version: string;
}

export const VercelFooter: React.FC<VercelFooterProps> = ({
  isDarkMode,
  version,
}) => {
  const colors = getVercelColors(isDarkMode);
  
  return (
    <View style={styles.footer}>
      <Text style={[
        styles.footerText,
        { color: colors.textTertiary },
      ]}>
        June AI {version} • Powered by Gemini 2.5 Flash Lite
      </Text>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  // Header
  headerContainer: {
    paddingTop: VERCEL_LAYOUT.safeArea.top + VERCEL_SPACING.lg,
    paddingHorizontal: VERCEL_SPACING.lg,
    paddingBottom: VERCEL_SPACING.md,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: VERCEL_SPACING.md,
  },
  userAvatar: {
    width: VERCEL_LAYOUT.components.avatarSize.md,
    height: VERCEL_LAYOUT.components.avatarSize.md,
    borderRadius: VERCEL_LAYOUT.components.avatarSize.md / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarText: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.lg,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.medium,
  },
  userText: {
    gap: VERCEL_SPACING.xs,
  },
  greeting: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.sm,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.medium,
  },
  userName: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.lg,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.bold,
  },
  settingsButton: {
    padding: VERCEL_SPACING.sm,
  },
  settingsIcon: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.lg,
  },
  
  // Section Header
  sectionHeader: {
    marginBottom: VERCEL_SPACING.md,
  },
  sectionTitle: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.xl,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.bold,
  },
  sectionSubtitle: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.sm,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.regular,
    marginTop: VERCEL_SPACING.xs,
  },
  
  // Agent Card
  agentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: VERCEL_SPACING.md,
    borderRadius: VERCEL_BORDER_RADIUS.md,
    borderWidth: 1,
    gap: VERCEL_SPACING.md,
    minWidth: 280,
  },
  agentIcon: {
    width: VERCEL_LAYOUT.components.avatarSize.md,
    height: VERCEL_LAYOUT.components.avatarSize.md,
    borderRadius: VERCEL_BORDER_RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  agentIconText: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.lg,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.medium,
  },
  agentInfo: {
    flex: 1,
    gap: VERCEL_SPACING.xs,
  },
  agentName: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.base,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.semibold,
  },
  agentDescription: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.sm,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.regular,
    lineHeight: VERCEL_TYPOGRAPHY.lineHeights.sm,
  },
  arrowIcon: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.lg,
    fontWeight: '600',
  },
  
  // Featured Agents
  featuredAgentsContainer: {
    marginBottom: VERCEL_SPACING.xl,
  },
  featuredAgentsList: {
    paddingRight: VERCEL_SPACING.lg,
    gap: VERCEL_SPACING.sm,
  },
  agentCardWrapper: {
    marginRight: VERCEL_SPACING.sm,
  },
  
  // Quick Actions
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: VERCEL_SPACING.md,
    marginBottom: VERCEL_SPACING.xl,
  },
  quickActionWrapper: {
    flex: 1,
    minWidth: '45%',
  },
  quickActionCard: {
    padding: VERCEL_SPACING.md,
    borderRadius: VERCEL_BORDER_RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
    gap: VERCEL_SPACING.sm,
  },
  quickActionContent: {
    alignItems: 'center',
    gap: VERCEL_SPACING.sm,
  },
  quickActionIcon: {
    fontSize: VERCEL_TYPOGRAPHY.sizes['3xl'],
  },
  quickActionTitle: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.base,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.semibold,
    textAlign: 'center',
  },
  quickActionDescription: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.sm,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.regular,
    textAlign: 'center',
    lineHeight: VERCEL_TYPOGRAPHY.lineHeights.sm,
  },
  
  // Create Agent CTA
  createAgentCTA: {
    padding: VERCEL_SPACING.lg,
    borderRadius: VERCEL_BORDER_RADIUS.md,
    borderWidth: 1,
    marginBottom: VERCEL_SPACING.xl,
  },
  createAgentContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: VERCEL_SPACING.lg,
  },
  createAgentText: {
    flex: 1,
    gap: VERCEL_SPACING.sm,
  },
  createAgentTitle: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.lg,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.bold,
  },
  createAgentDescription: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.base,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.regular,
    lineHeight: VERCEL_TYPOGRAPHY.lineHeights.base,
  },
  createAgentButton: {
    paddingHorizontal: VERCEL_SPACING.lg,
    paddingVertical: VERCEL_SPACING.md,
    borderRadius: VERCEL_BORDER_RADIUS.sm,
  },
  createAgentButtonText: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.sm,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.medium,
  },
  
  // Footer
  footer: {
    alignItems: 'center',
    paddingVertical: VERCEL_SPACING.lg,
    marginTop: 'auto',
  },
  footerText: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.xs,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.medium,
    textAlign: 'center',
  },
});