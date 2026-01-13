import React, { useState, useMemo } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AgentCard } from '../../components';
import { VercelInput, VercelButton } from '../../components/vercel/VercelComponents';
import { VercelAgentCard } from '../../components/vercel/VercelHomeComponents';
import { useChatStore } from '../../store/useChatStore';
import { useAppTheme } from '../../hooks';
import { Agent, AgentCategory } from '../../types';
import { CATEGORIES } from '../../constants/agents';
import { getVercelColors, VERCEL_TYPOGRAPHY, VERCEL_SPACING, VERCEL_BORDER_RADIUS, VERCEL_LAYOUT } from '../../constants/vercel-theme';
import { Dimensions } from 'react-native';

export function ExploreScreen() {
  const navigation = useNavigation<any>();
  const { agents } = useChatStore();
  const { isDarkMode } = useAppTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AgentCategory | 'all'>('all');
  const [refreshing, setRefreshing] = useState(false);

  const colors = getVercelColors(isDarkMode);
  const screenWidth = Dimensions.get('window').width;
  
  // Responsive grid configuration
  const getResponsiveGrid = () => {
    if (screenWidth >= VERCEL_LAYOUT.breakpoints.lg) {
      return { numColumns: 3, cardWidth: (screenWidth - VERCEL_SPACING.xl * 2 - VERCEL_SPACING.md * 2) / 3 };
    } else if (screenWidth >= VERCEL_LAYOUT.breakpoints.md) {
      return { numColumns: 2, cardWidth: (screenWidth - VERCEL_SPACING.lg * 2 - VERCEL_SPACING.sm) / 2 };
    } else {
      return { numColumns: 2, cardWidth: (screenWidth - VERCEL_SPACING.md * 2 - VERCEL_SPACING.xs) / 2 };
    }
  };

  const { numColumns } = getResponsiveGrid();

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
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Explore Agents
        </Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <VercelInput
            isDarkMode={isDarkMode}
            placeholder="Search agents..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
          {searchQuery ? (
            <TouchableOpacity
              style={[styles.clearButton, { backgroundColor: colors.surfaceActive }]}
              onPress={clearSearch}
            >
              <Text style={{ color: colors.textPrimary, fontSize: 16 }}>✕</Text>
            </TouchableOpacity>
          ) : (
            <View style={[styles.searchIcon, { backgroundColor: colors.surfaceActive }]}>
              <Text style={{ color: colors.textSecondary, fontSize: 16 }}>🔍</Text>
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
                <View style={[
                  styles.categoryChip,
                  selectedCategory === item.value 
                    ? { backgroundColor: colors.accent } 
                    : { backgroundColor: 'transparent', borderColor: colors.border, borderWidth: 1 }
                ]}>
                  <Text style={[
                    styles.categoryChipText,
                    { 
                      color: selectedCategory === item.value 
                        ? colors.textPrimary 
                        : colors.textSecondary 
                    }
                  ]}>
                    {item.label}
                  </Text>
                </View>
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
        <Text style={[styles.resultsText, { color: colors.textSecondary }]}>
          {filteredAgents.length} agent{filteredAgents.length !== 1 ? 's' : ''} found
        </Text>
      </View>

      {/* Agent Grid */}
      <FlatList
        data={filteredAgents}
        renderItem={({ item }) => (
          <View style={[styles.agentItem, { width: getResponsiveGrid().cardWidth }]}>
            <VercelAgentCard
              isDarkMode={isDarkMode}
              agent={item}
              onPress={handleAgentPress}
            />
          </View>
        )}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        columnWrapperStyle={numColumns === 3 ? styles.agentsGrid3 : styles.agentsGrid}
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
            <Text style={[styles.emptyIcon, { color: colors.textTertiary }]}>
              🔍
            </Text>
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
              No agents found
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
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
    paddingHorizontal: VERCEL_SPACING.lg,
    paddingBottom: VERCEL_SPACING.md,
  },
  title: {
    fontSize: VERCEL_TYPOGRAPHY.sizes['2xl'],
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.bold,
    marginBottom: VERCEL_SPACING.lg,
  },
  searchContainer: {
    position: 'relative',
    marginBottom: VERCEL_SPACING.md,
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
    marginBottom: VERCEL_SPACING.md,
  },
  categoriesList: {
    gap: VERCEL_SPACING.sm,
  },
  chipWrapper: {
    marginRight: VERCEL_SPACING.sm,
  },
  categoryChip: {
    paddingHorizontal: VERCEL_SPACING.md,
    paddingVertical: VERCEL_SPACING.sm,
    borderRadius: VERCEL_BORDER_RADIUS.full,
  },
  categoryChipText: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.sm,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.medium,
  },
  resultsContainer: {
    paddingHorizontal: VERCEL_SPACING.lg,
    paddingVertical: VERCEL_SPACING.sm,
  },
  resultsText: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.sm,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.medium,
  },
  agentsGrid: {
    justifyContent: 'space-between',
    paddingHorizontal: VERCEL_SPACING.lg,
  },
  agentsGrid3: {
    justifyContent: 'space-between',
    paddingHorizontal: VERCEL_SPACING.xl,
  },
  agentsList: {
    paddingBottom: VERCEL_SPACING.xl,
    flexGrow: 1,
  },
  agentItem: {
    flex: 1,
    margin: VERCEL_SPACING.xs,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: VERCEL_SPACING['3xl'],
    marginTop: 100,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: VERCEL_SPACING.md,
  },
  emptyTitle: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.xl,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.bold,
    marginBottom: VERCEL_SPACING.xs,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.base,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.regular,
    textAlign: 'center',
  },
});