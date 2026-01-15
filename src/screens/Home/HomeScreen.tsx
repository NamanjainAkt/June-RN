import { useNavigation } from '@react-navigation/native';
import { formatDistanceToNow } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { VercelAgentCard, VercelButton } from '../../components/vercel/VercelComponents';
import {
  VercelFooter,
  VercelHomeHeader,
} from '../../components/vercel/VercelHomeComponents';
import { ACCENT_COLORS, GRADIENT_PRESETS, MOBILE_SPACING, MOBILE_TYPOGRAPHY } from '../../constants/mobile-design-tokens';
import { getVercelColors, VERCEL_BORDER_RADIUS, VERCEL_TYPOGRAPHY } from '../../constants/vercel-theme';
import { useAppTheme } from '../../hooks';
import { useAuthStore } from '../../store/useAuthStore';
import { useChatStore } from '../../store/useChatStore';

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const { user } = useAuthStore();
  const { sessions, loadSessions, loadAgents, agents } = useChatStore();
  const { isDarkMode } = useAppTheme();
  const [refreshing, setRefreshing] = useState(false);

  const colors = getVercelColors(isDarkMode);

  useEffect(() => {
    if (user?.id) {
      loadAgents(user.id);
      loadSessions(user.id);
    }
  }, [user?.id]);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (user?.id) {
      await loadSessions(user.id);
      await loadAgents(user.id);
    }
    setRefreshing(false);
  };

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Get last 3 recent chats
  const recentChats = sessions
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 3);

  // Get 6 featured agents
  const featuredAgents = agents.slice(0, 6).map((agent, index) => ({
    ...agent,
    gradientColors: agent.gradientColors || GRADIENT_PRESETS[index % GRADIENT_PRESETS.length],
  }));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <VercelHomeHeader
        isDarkMode={isDarkMode}
        userName={user?.name || 'Guest'}
        onSettingsPress={() => navigation.navigate('Settings')}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.accent}
          />
        }
      >
        {/* Greeting */}
        <Text style={[styles.greeting, { color: colors.textSecondary }]}>
          {getGreeting()}, {user?.name || 'Guest'}
        </Text>

        {/* Featured Agents */}
        {featuredAgents.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Featured Agents
            </Text>
            <View style={styles.featuredGrid}>
              {featuredAgents.map((agent) => (
                <View key={agent.id} style={styles.featuredAgentWrapper}>
                  <VercelAgentCard
                    isDarkMode={isDarkMode}
                    agent={agent}
                    onPress={(a) => navigation.navigate('Chat', { agentId: a.id })}
                  />
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Recent Chats */}
        {recentChats.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Recent Chats
            </Text>
            {recentChats.map((session) => {
              const lastMessage = session.messages[session.messages.length - 1];
              const timeAgo = formatDistanceToNow(session.updatedAt, { addSuffix: true });

              return (
                <TouchableOpacity
                  key={session.id}
                  style={[styles.recentChatCard, {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  }]}
                  onPress={() => navigation.navigate('Chat', {
                    agentId: session.agentId,
                    sessionId: session.id
                  })}
                  activeOpacity={0.7}
                >
                  <View style={styles.recentChatHeader}>
                    <Text style={[styles.recentChatAgent, { color: colors.textPrimary }]} numberOfLines={1}>
                      {session.agentName}
                    </Text>
                    <Text style={[styles.recentChatTime, { color: colors.textTertiary }]}>
                      {timeAgo}
                    </Text>
                  </View>
                  <Text style={[styles.recentChatPreview, { color: colors.textSecondary }]} numberOfLines={1}>
                    {lastMessage?.content || 'New conversation'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Primary CTA */}
        <View style={styles.ctaSection}>
          <VercelButton
            variant="primary"
            size="lg"
            text="Start New Chat"
            onPress={() => navigation.navigate('Explore')}
            isDarkMode={isDarkMode}
            fullWidth
            style={styles.primaryCta}
          />

          <VercelButton
            variant="secondary"
            size="md"
            text="Browse All Agents"
            onPress={() => navigation.navigate('Explore')}
            isDarkMode={isDarkMode}
            fullWidth
          />
        </View>

        {/* Footer */}
        <VercelFooter
          isDarkMode={isDarkMode}
          version="v1.0.0"
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: MOBILE_SPACING.lg,
    paddingHorizontal: MOBILE_SPACING.lg,
  },
  greeting: {
    fontSize: MOBILE_TYPOGRAPHY.sizes.caption,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.medium,
    marginBottom: MOBILE_SPACING.xl,
  },
  section: {
    marginBottom: MOBILE_SPACING.xl,
  },
  sectionTitle: {
    fontSize: MOBILE_TYPOGRAPHY.sizes.h2,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.semibold,
    marginBottom: MOBILE_SPACING.md,
  },
  featuredGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: MOBILE_SPACING.md,
    justifyContent: 'space-between',
  },
  featuredAgentWrapper: {
    width: '47.5%', // Slightly less than 50% to account for gap
    marginBottom: MOBILE_SPACING.sm,
  },
  recentChatCard: {
    padding: MOBILE_SPACING.md,
    borderRadius: VERCEL_BORDER_RADIUS.md,
    borderWidth: 1,
    marginBottom: MOBILE_SPACING.sm,
  },
  recentChatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  recentChatAgent: {
    fontSize: MOBILE_TYPOGRAPHY.sizes.body,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.semibold,
    flex: 1,
  },
  recentChatTime: {
    fontSize: MOBILE_TYPOGRAPHY.sizes.small,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.regular,
    marginLeft: MOBILE_SPACING.sm,
  },
  recentChatPreview: {
    fontSize: MOBILE_TYPOGRAPHY.sizes.caption,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.regular,
  },
  ctaSection: {
    gap: MOBILE_SPACING.md,
    marginBottom: MOBILE_SPACING.xxl,
  },
  primaryCta: {
    backgroundColor: ACCENT_COLORS.primary,
  },
});