import React, { useState, useMemo } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text } from 'react-native-paper';
import { AgentCard, Badge, Input } from '../../components';
import { useChatStore } from '../../store/useChatStore';
import { useAppTheme } from '../../hooks';
import { Agent, AgentCategory } from '../../types';
import { CATEGORIES } from '../../constants/agents';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants/theme';

export function ExploreScreen() {
  const navigation = useNavigation<any>();
  const { agents } = useChatStore();
  const { isDarkMode } = useAppTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AgentCategory | 'all'>('all');
  const [refreshing, setRefreshing] = useState(false);

  const colors = isDarkMode ? COLORS.dark : COLORS.light;

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

  const getCategoryCount = (category: AgentCategory | 'all') => {
    if (category === 'all') return agents.length;
    return agents.filter((a) => a.category === category).length;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.title, { color: colors.primary }]}>
          Explore Agents
        </Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Input
            placeholder="Search agents..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            fullWidth
          />
          {searchQuery ? (
            <View style={[styles.clearButton, { backgroundColor: colors.secondaryVariant }]}>
              <Text style={{ color: colors.onSecondary, fontSize: 16 }} onPress={clearSearch}>
                ✕
              </Text>
            </View>
          ) : (
            <View style={[styles.searchIcon, { backgroundColor: colors.secondaryVariant }]}>
              <Text style={{ color: colors.onSecondary, fontSize: 16 }}>🔍</Text>
            </View>
          )}
        </View>

        {/* Category Filters */}
        <View style={styles.categoriesContainer}>
          <FlatList
            horizontal
            data={[{ label: `All (${getCategoryCount('all')})`, value: 'all' }, ...CATEGORIES.map(c => ({ label: `${c.label} (${getCategoryCount(c.value)})`, value: c.value }))]}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.chipWrapper}
                onPress={() => setSelectedCategory(item.value as AgentCategory | 'all')}
                activeOpacity={0.8}
              >
                <Badge
                  variant={selectedCategory === item.value ? 'solid' : 'outlined'}
                  color={selectedCategory === item.value ? 'accent' : 'secondary'}
                  size="md"
                  style={styles.categoryChip}
                >
                  {item.label}
                </Badge>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.value}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>
      </View>

      {/* Results Count */}
      <View style={styles.resultsContainer}>
        <Text style={[styles.resultsText, { color: colors.secondaryVariant }]}>
          {filteredAgents.length} agent{filteredAgents.length !== 1 ? 's' : ''} found
        </Text>
      </View>

      {/* Agent Grid */}
      <FlatList
        data={filteredAgents}
        renderItem={({ item }) => (
          <View style={styles.agentItem}>
            <AgentCard agent={item} onPress={handleAgentPress} />
          </View>
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.agentsGrid}
        contentContainerStyle={styles.agentsList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.accent}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyIcon, { color: colors.secondaryVariant }]}>
              🔍
            </Text>
            <Text style={[styles.emptyTitle, { color: colors.primary }]}>
              No agents found
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.secondary }]}>
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
    paddingTop: 48,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes['2xl'],
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    marginBottom: SPACING.lg,
  },
  searchContainer: {
    position: 'relative',
    marginBottom: SPACING.md,
  },
  searchInput: {
    paddingRight: 50,
  },
  clearButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIcon: {
    position: 'absolute',
    right: 12,
    top: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoriesContainer: {
    marginBottom: SPACING.md,
  },
  categoriesList: {
    gap: SPACING.sm,
  },
  chipWrapper: {
    marginRight: SPACING.sm,
  },
  categoryChip: {
    cursor: 'pointer',
  },
  resultsContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  resultsText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },
  agentsGrid: {
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
  },
  agentsList: {
    paddingBottom: SPACING.xl,
    flexGrow: 1,
  },
  agentItem: {
    flex: 1,
    margin: SPACING.xs,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING['3xl'],
    marginTop: 100,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    textAlign: 'center',
  },
});