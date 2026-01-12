import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text } from 'react-native-paper';
import { AgentCard, Card, Button, Avatar } from '../../components';
import { useAuthStore } from '../../store/useAuthStore';
import { useChatStore } from '../../store/useChatStore';
import { useAppTheme } from '../../hooks';
import { Agent } from '../../types';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants/theme';

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const { user } = useAuthStore();
  const { agents, loadSessions, loadAgents } = useChatStore();
  const { isDarkMode } = useAppTheme();
  const [refreshing, setRefreshing] = React.useState(false);

  const colors = isDarkMode ? COLORS.dark : COLORS.light;

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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <View style={styles.headerContent}>
          <View style={styles.userInfo}>
            <Avatar name={user?.name || 'User'} size="md" />
            <View style={styles.userText}>
              <Text style={[styles.greeting, { color: colors.secondary }]}>
                Welcome back,
              </Text>
              <Text style={[styles.userName, { color: colors.primary }]}>
                {user?.name || 'Guest'}
              </Text>
            </View>
          </View>
          <Button
            variant="ghost"
            size="sm"
            onPress={() => navigation.navigate('Settings')}
            style={styles.settingsButton}
          >
            <Text style={{ color: colors.secondary }}>⚙️</Text>
          </Button>
        </View>
      </View>

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
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>
            Featured Agents
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredAgents}
          >
            {featuredAgents.map((agent) => (
              <View key={agent.id} style={styles.agentWrapper}>
                <AgentCard agent={agent} onPress={handleAgentPress} />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>
            Quick Actions
          </Text>
          <View style={styles.quickActions}>
            <TouchableOpacity onPress={() => navigation.navigate('Explore')} activeOpacity={0.8}>
              <Card variant="outlined" style={styles.actionCard}>
                <View style={styles.actionContent}>
                  <Text style={styles.actionIcon}>💬</Text>
                  <Text style={[styles.actionText, { color: colors.primary }]}>
                    New Chat
                  </Text>
                </View>
              </Card>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('History')} activeOpacity={0.8}>
              <Card variant="outlined" style={styles.actionCard}>
                <View style={styles.actionContent}>
                  <Text style={styles.actionIcon}>📚</Text>
                  <Text style={[styles.actionText, { color: colors.primary }]}>
                    History
                  </Text>
                </View>
              </Card>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('CustomAgent')} activeOpacity={0.8}>
              <Card variant="outlined" style={styles.actionCard}>
                <View style={styles.actionContent}>
                  <Text style={styles.actionIcon}>✨</Text>
                  <Text style={[styles.actionText, { color: colors.primary }]}>
                    Create Agent
                  </Text>
                </View>
              </Card>
            </TouchableOpacity>
          </View>
        </View>

        {/* Create Agent CTA */}
        <View style={styles.section}>
          <Card variant="outlined" style={styles.createAgentCard}>
            <View style={styles.createAgentContent}>
              <View style={styles.createAgentText}>
                <Text style={[styles.createAgentTitle, { color: colors.primary }]}>
                  Create Your Own
                </Text>
                <Text style={[styles.createAgentSubtitle, { color: colors.secondary }]}>
                  Build custom AI agents tailored to your needs
                </Text>
              </View>
              <Button
                variant="solid"
                size="md"
                onPress={() => navigation.navigate('CustomAgent')}
                style={styles.createAgentButton}
              >
                Create Agent
              </Button>
            </View>
          </Card>
        </View>

        {/* Recent Agents */}
        {recentAgents.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>
              All Agents
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredAgents}
            >
              {recentAgents.map((agent) => (
                <View key={agent.id} style={styles.agentWrapper}>
                  <AgentCard agent={agent} onPress={handleAgentPress} />
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.secondaryVariant }]}>
            June AI v1.0.0 • Powered by Gemini 2.5 Flash Lite
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 48,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userText: {
    marginLeft: SPACING.md,
  },
  greeting: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },
  userName: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },
  settingsButton: {
    width: 40,
    height: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingTop: SPACING.md,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    marginBottom: SPACING.md,
  },
  featuredAgents: {
    paddingRight: SPACING.lg,
  },
  agentWrapper: {
    marginRight: SPACING.sm,
  },
  quickActions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  actionCard: {
    flex: 1,
    padding: SPACING.md,
  },
  actionContent: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
  actionIcon: {
    fontSize: 28,
  },
  actionText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    textAlign: 'center',
  },
  createAgentCard: {
    padding: SPACING.lg,
  },
  createAgentContent: {
    gap: SPACING.lg,
  },
  createAgentText: {
    gap: SPACING.xs,
  },
  createAgentTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },
  createAgentSubtitle: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
  createAgentButton: {
    alignSelf: 'flex-start',
  },
  footer: {
    marginTop: SPACING.xl,
    alignItems: 'center',
  },
  footerText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    textAlign: 'center',
  },
});