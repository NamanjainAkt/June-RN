import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text, useTheme, Surface, IconButton, FAB, Divider, ActivityIndicator } from 'react-native-paper';
import { AgentCard } from '../../components';
import { useAuthStore } from '../../store/useAuthStore';
import { useChatStore } from '../../store/useChatStore';
import { Agent } from '../../types';
import { useDynamicFontSize } from '../../hooks';

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const theme = useTheme();
  const { user } = useAuthStore();
  const { agents, loadSessions, loadAgents } = useChatStore();
  const [refreshing, setRefreshing] = React.useState(false);

  const headerFontSize = useDynamicFontSize(28);
  const subtitleFontSize = useDynamicFontSize(14);
  const sectionTitleFontSize = useDynamicFontSize(20);

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
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Surface style={styles.header} elevation={0}>
        <View style={styles.headerContent}>
          <View>
            <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: subtitleFontSize }} variant="bodyMedium">
              Welcome back,
            </Text>
            <Text style={{ color: theme.colors.onSurface, fontSize: headerFontSize }} variant="headlineMedium">
              {user?.name || 'Guest'}
            </Text>
          </View>
          <IconButton
            icon="cog"
            size={24}
            onPress={() => navigation.navigate('Settings')}
            iconColor={theme.colors.onSurfaceVariant}
            style={{ backgroundColor: theme.colors.surfaceVariant }}
          />
        </View>
      </Surface>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface, fontSize: sectionTitleFontSize }]} variant="titleLarge">
          Featured Agents
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredAgents}
        >
          {featuredAgents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onPress={handleAgentPress}
            />
          ))}
        </ScrollView>

        <Divider style={styles.divider} />

        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface, fontSize: sectionTitleFontSize }]} variant="titleLarge">
          Quick Access
        </Text>

        <View style={styles.quickActions}>
          <Surface 
            style={[styles.actionCard, { backgroundColor: theme.colors.surfaceVariant }]}
            onTouchEnd={() => navigation.navigate('Explore')}
          >
            <View style={[styles.actionIcon, { backgroundColor: theme.colors.primaryContainer }]}>
              <IconButton
                icon="chat-outline"
                size={28}
                iconColor={theme.colors.primary}
              />
            </View>
            <Text style={{ color: theme.colors.onSurface }} variant="bodyMedium">
              New Chat
            </Text>
          </Surface>

          <Surface 
            style={[styles.actionCard, { backgroundColor: theme.colors.surfaceVariant }]}
            onTouchEnd={() => navigation.navigate('History')}
          >
            <View style={[styles.actionIcon, { backgroundColor: theme.colors.secondaryContainer }]}>
              <IconButton
                icon="history"
                size={28}
                iconColor={theme.colors.secondary}
              />
            </View>
            <Text style={{ color: theme.colors.onSurface }} variant="bodyMedium">
              History
            </Text>
          </Surface>

          <Surface 
            style={[styles.actionCard, { backgroundColor: theme.colors.surfaceVariant }]}
            onTouchEnd={() => navigation.navigate('CustomAgent')}
          >
            <View style={[styles.actionIcon, { backgroundColor: theme.colors.tertiaryContainer }]}>
              <IconButton
                icon="plus-circle-outline"
                size={28}
                iconColor={theme.colors.tertiary}
              />
            </View>
            <Text style={{ color: theme.colors.onSurface }} variant="bodyMedium">
              Create Agent
            </Text>
          </Surface>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.createAgentSection}>
          <View style={styles.createAgentHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: theme.colors.onSurface, fontSize: sectionTitleFontSize }]} variant="titleLarge">
                Create Your Own
              </Text>
              <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: subtitleFontSize }} variant="bodyMedium">
                Build custom AI agents tailored to your needs
              </Text>
            </View>
          </View>

          <FAB
            icon="plus"
            label="Create Custom Agent"
            onPress={() => navigation.navigate('CustomAgent')}
            style={[styles.fab, { backgroundColor: theme.colors.primary }]}
            color={theme.colors.onPrimary}
          />
        </View>

        <Divider style={styles.divider} />

        {recentAgents.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface, fontSize: sectionTitleFontSize }]} variant="titleLarge">
              All Agents
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredAgents}
            >
              {recentAgents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  onPress={handleAgentPress}
                />
              ))}
            </ScrollView>
          </>
        )}

        <View style={styles.footer}>
          <Text style={{ color: theme.colors.onSurfaceVariant }} variant="bodySmall">
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
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 48,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 12,
  },
  featuredAgents: {
    paddingRight: 16,
    gap: 12,
  },
  divider: {
    marginVertical: 16,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  createAgentSection: {
    marginBottom: 8,
  },
  createAgentHeader: {
    marginBottom: 12,
  },
  fab: {
    alignSelf: 'flex-start',
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
});
