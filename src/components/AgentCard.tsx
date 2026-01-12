import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Icon, Text, useTheme } from 'react-native-paper';
import { Agent } from '../types';

interface AgentCardProps {
  agent: Agent;
  onPress: (agent: Agent) => void;
}

export function AgentCard({ agent, onPress }: AgentCardProps) {
  const theme = useTheme();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.colors.surfaceVariant }]}
      onPress={() => onPress(agent)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryContainer }]}>
        <Icon source={agent.icon as any} size={28} color={theme.colors.primary} />
      </View>
      <Text style={[styles.name, { color: theme.colors.onSurface }]} numberOfLines={1}>
        {agent.name}
      </Text>
      <Text style={[styles.description, { color: theme.colors.onSurfaceVariant }]} numberOfLines={2}>
        {agent.description}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    width: 140,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  description: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
});
