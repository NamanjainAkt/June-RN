import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { 
  VercelHomeHeader, 
  VercelFeaturedAgents, 
  VercelQuickActions, 
  VercelCreateAgentCTA, 
  VercelFooter 
} from '../../components/vercel/VercelHomeComponents';
import { useAuthStore } from '../../store/useAuthStore';
import { useChatStore } from '../../store/useChatStore';
import { useAppTheme } from '../../hooks';
import { Agent } from '../../types';
import { getVercelColors, VERCEL_SPACING } from '../../constants/vercel-theme';

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const { user } = useAuthStore();
  const { agents, loadSessions, loadAgents } = useChatStore();
  const { isDarkMode } = useAppTheme();
  const [refreshing, setRefreshing] = React.useState(false);

  const colors = getVercelColors(isDarkMode);

  useEffect(() => {
    loadAgents();
  }, []);

  const handleAgentPress = (agent: Agent) => {
    navigation.navigate('Chat', { agentId: agent.id });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    if (user?.id) {
      await loadSessions(user.id);
    }
    loadAgents();
    setRefreshing(false);
  };

  const featuredAgents = agents.slice(0, 3);
  const recentAgents = agents.slice(3, 6);

  // Quick Actions Data
  const quickActions = [
    {
      id: 'new-chat',
      title: 'New Chat',
      description: 'Start a conversation',
      icon: '💬',
      onPress: () => navigation.navigate('Explore'),
    },
    {
      id: 'history',
      title: 'History',
      description: 'View past conversations',
      icon: '📚',
      onPress: () => navigation.navigate('History'),
    },
    {
      id: 'create-agent',
      title: 'Create Agent',
      description: 'Build custom AI',
      icon: '✨',
      onPress: () => navigation.navigate('CustomAgent'),
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Vercel Header */}
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
        {/* Featured Agents */}
        <View style={styles.section}>
          <VercelFeaturedAgents
            isDarkMode={isDarkMode}
            agents={featuredAgents}
            onAgentPress={handleAgentPress}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <VercelQuickActions
            isDarkMode={isDarkMode}
            actions={quickActions}
          />
        </View>

        {/* Create Agent CTA */}
        <View style={styles.section}>
          <VercelCreateAgentCTA
            isDarkMode={isDarkMode}
            onPress={() => navigation.navigate('CustomAgent')}
          />
        </View>

        {/* All Agents */}
        {recentAgents.length > 0 && (
          <View style={styles.section}>
            <VercelFeaturedAgents
              isDarkMode={isDarkMode}
              agents={recentAgents}
              onAgentPress={handleAgentPress}
            />
          </View>
        )}

        {/* Vercel Footer */}
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
    padding: VERCEL_SPACING.lg,
    paddingTop: VERCEL_SPACING.md,
  },
  section: {
    marginBottom: VERCEL_SPACING.xl,
  },
});