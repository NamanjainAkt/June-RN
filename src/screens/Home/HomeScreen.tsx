import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text, useTheme, Surface, IconButton, FAB, Divider } from 'react-native-paper';
import { AgentCard } from '../../components';
import { useAuthStore } from '../../store/useAuthStore';
import { useChatStore } from '../../store/useChatStore';
import { Agent } from '../../types';

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const theme = useTheme();
  const { user } = useAuthStore();
  const { agents } = useChatStore();

  const featuredAgents = agents.slice(0, 3);

  const handleAgentPress = (agent: Agent) => {
    navigation.navigate('Chat', { agentId: agent.id });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Surface style={styles.header} elevation={0}>
        <View style={styles.headerContent}>
          <View>
            <Text style={{ color: theme.colors.onSurfaceVariant }} variant="bodyMedium">
              Welcome back,
            </Text>
            <Text style={{ color: theme.colors.onSurface }} variant="headlineMedium">
              {user?.name || 'Guest'}
            </Text>
          </View>
          <IconButton
            icon="cog"
            size={24}
            onPress={() => navigation.navigate('Settings')}
            iconColor={theme.colors.onSurfaceVariant}
          />
        </View>
      </Surface>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]} variant="titleLarge">
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

        <View style={styles.createAgentSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]} variant="titleLarge">
            Create Your Own
          </Text>
          <Text style={{ color: theme.colors.onSurfaceVariant }} variant="bodyMedium">
            Build custom AI agents tailored to your specific needs
          </Text>

          <FAB
            icon="plus"
            label="Create Custom Agent"
            onPress={() => navigation.navigate('CustomAgent')}
            style={[styles.fab, { backgroundColor: theme.colors.primary }]}
            color={theme.colors.onPrimary}
          />
        </View>

        <Divider style={styles.divider} />

        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]} variant="titleLarge">
          Quick Actions
        </Text>

        <View style={styles.quickActions}>
          <Surface style={[styles.actionCard, { backgroundColor: theme.colors.surfaceVariant }]}>
            <IconButton
              icon="chat-outline"
              size={28}
              onPress={() => navigation.navigate('Explore')}
              iconColor={theme.colors.primary}
            />
            <Text style={{ color: theme.colors.onSurface }} variant="bodyMedium">
              Start Chat
            </Text>
          </Surface>

          <Surface style={[styles.actionCard, { backgroundColor: theme.colors.surfaceVariant }]}>
            <IconButton
              icon="history"
              size={28}
              onPress={() => navigation.navigate('History')}
              iconColor={theme.colors.secondary}
            />
            <Text style={{ color: theme.colors.onSurface }} variant="bodyMedium">
              View History
            </Text>
          </Surface>
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
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 12,
  },
  featuredAgents: {
    paddingRight: 16,
  },
  divider: {
    marginVertical: 16,
  },
  createAgentSection: {
    marginBottom: 16,
  },
  fab: {
    marginTop: 16,
    alignSelf: 'flex-start',
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
});
