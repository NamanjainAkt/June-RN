import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text, useTheme, Searchbar, Chip, Surface } from 'react-native-paper';
import { AgentCard } from '../../components';
import { useChatStore } from '../../store/useChatStore';
import { Agent, AgentCategory } from '../../types';
import { CATEGORIES } from '../../constants/agents';

export function ExploreScreen() {
  const navigation = useNavigation<any>();
  const theme = useTheme();
  const { agents } = useChatStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AgentCategory | 'all'>('all');

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || agent.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAgentPress = (agent: Agent) => {
    navigation.navigate('Chat', { agentId: agent.id });
  };

  const renderCategoryChip = ({ item }: { item: { label: string; value: AgentCategory | 'all' } }) => (
    <Chip
      selected={selectedCategory === item.value}
      onPress={() => setSelectedCategory(item.value)}
      style={styles.categoryChip}
      mode="flat"
    >
      {item.label}
    </Chip>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Surface style={styles.header} elevation={0}>
        <Text style={{ color: theme.colors.onSurface }} variant="headlineMedium">
          Explore Agents
        </Text>

        <Searchbar
          placeholder="Search agents..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchbar}
          inputStyle={{ color: theme.colors.onSurface }}
          placeholderTextColor={theme.colors.onSurfaceVariant}
        />

        <FlatList
          horizontal
          data={[{ label: 'All', value: 'all' }, ...CATEGORIES]}
          renderItem={renderCategoryChip}
          keyExtractor={(item) => item.value}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </Surface>

      <FlatList
        data={filteredAgents}
        renderItem={({ item }) => (
          <AgentCard agent={item} onPress={handleAgentPress} />
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.agentsGrid}
        contentContainerStyle={styles.agentsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={{ color: theme.colors.onSurfaceVariant }} variant="bodyLarge">
              No agents found
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: 48,
  },
  searchbar: {
    marginVertical: 12,
    elevation: 0,
  },
  categoriesList: {
    gap: 8,
  },
  categoryChip: {
    marginRight: 8,
  },
  agentsGrid: {
    justifyContent: 'space-between',
  },
  agentsList: {
    padding: 16,
    paddingTop: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
});
