import React, { useState, useMemo } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text, useTheme, Searchbar, Chip, Surface, IconButton } from 'react-native-paper';
import { AgentCard } from '../../components';
import { useChatStore } from '../../store/useChatStore';
import { Agent, AgentCategory } from '../../types';
import { CATEGORIES } from '../../constants/agents';
import { useDynamicFontSize } from '../../hooks';

export function ExploreScreen() {
  const navigation = useNavigation<any>();
  const theme = useTheme();
  const { agents } = useChatStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AgentCategory | 'all'>('all');
  const [refreshing, setRefreshing] = useState(false);

  const headerFontSize = useDynamicFontSize(24);
  const searchFontSize = useDynamicFontSize(16);
  const chipFontSize = useDynamicFontSize(12);

  const filteredAgents = useMemo(() => {
    return agents.filter((agent) => {
      const matchesSearch =
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || agent.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [agents, searchQuery, selectedCategory]);

  const handleAgentPress = (agent: Agent) => {
    navigation.navigate('Chat', { agentId: agent.id });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const renderCategoryChip = ({ item }: { item: { label: string; value: AgentCategory | 'all' } }) => (
    <Chip
      selected={selectedCategory === item.value}
      onPress={() => setSelectedCategory(item.value)}
      style={[styles.categoryChip, { backgroundColor: selectedCategory === item.value ? theme.colors.primaryContainer : theme.colors.surfaceVariant }]}
      mode="flat"
      textStyle={{ 
        color: selectedCategory === item.value ? theme.colors.primary : theme.colors.onSurfaceVariant,
        fontSize: chipFontSize 
      }}
    >
      {item.label}
    </Chip>
  );

  const renderAgent = ({ item }: { item: Agent }) => (
    <View style={styles.agentItem}>
      <AgentCard agent={item} onPress={handleAgentPress} />
    </View>
  );

  const getCategoryCount = (category: AgentCategory | 'all') => {
    if (category === 'all') return agents.length;
    return agents.filter((a) => a.category === category).length;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Surface style={styles.header} elevation={0}>
        <Text style={{ color: theme.colors.onSurface, fontSize: headerFontSize }} variant="headlineMedium">
          Explore Agents
        </Text>

        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Search agents..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.searchbar, { backgroundColor: theme.colors.surfaceVariant }]}
            inputStyle={{ color: theme.colors.onSurface, fontSize: searchFontSize }}
            placeholderTextColor={theme.colors.onSurfaceVariant}
            icon={searchQuery ? 'close' : 'magnify'}
            onIconPress={searchQuery ? clearSearch : undefined}
          />
        </View>

        <View style={styles.categoriesContainer}>
          <FlatList
            horizontal
            data={[{ label: `All (${getCategoryCount('all')})`, value: 'all' }, ...CATEGORIES.map(c => ({ label: `${c.label} (${getCategoryCount(c.value)})`, value: c.value }))]}
            renderItem={renderCategoryChip}
            keyExtractor={(item) => item.value}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
            ListFooterComponent={<View style={styles.chipSpacer} />}
          />
        </View>
      </Surface>

      <View style={styles.resultsContainer}>
        <Text style={{ color: theme.colors.onSurfaceVariant }} variant="bodySmall">
          {filteredAgents.length} agent{filteredAgents.length !== 1 ? 's' : ''} found
        </Text>
      </View>

      <FlatList
        data={filteredAgents}
        renderItem={renderAgent}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.agentsGrid}
        contentContainerStyle={styles.agentsList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <IconButton
              icon="search-off"
              size={64}
              iconColor={theme.colors.onSurfaceVariant}
            />
            <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: searchFontSize }} variant="bodyLarge">
              No agents found
            </Text>
            <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: searchFontSize * 0.875 }} variant="bodyMedium">
              Try adjusting your search or filters
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
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 8,
  },
  searchContainer: {
    marginVertical: 12,
  },
  searchbar: {
    elevation: 0,
    borderRadius: 12,
  },
  categoriesContainer: {
    marginBottom: 8,
  },
  categoriesList: {
    gap: 8,
  },
  categoryChip: {
    marginRight: 8,
  },
  chipSpacer: {
    width: 8,
  },
  resultsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  agentsGrid: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  agentsList: {
    paddingBottom: 16,
    flexGrow: 1,
  },
  agentItem: {
    flex: 1,
    margin: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    marginTop: 100,
  },
});
