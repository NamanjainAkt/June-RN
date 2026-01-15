import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo, useState } from 'react';
import { Dimensions, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';

import { VercelAgentCard, VercelInput } from '../../components/vercel/VercelComponents';
import { CATEGORIES } from '../../constants/agents';
import { GRADIENT_PRESETS, MOBILE_RADIUS } from '../../constants/mobile-design-tokens';
import { getVercelColors, VERCEL_BORDER_RADIUS, VERCEL_LAYOUT, VERCEL_SPACING, VERCEL_TYPOGRAPHY } from '../../constants/vercel-theme';
import { useAppTheme } from '../../hooks';
import { useChatStore } from '../../store/useChatStore';
import { Agent, AgentCategory } from '../../types';

export function ExploreScreen() {
  const navigation = useNavigation<any>();
  const { agents } = useChatStore();
  const { isDarkMode } = useAppTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AgentCategory | 'all'>('all');
  const [refreshing, setRefreshing] = useState(false);

  const colors = getVercelColors(isDarkMode);

  // Animation for the Create Agent button border
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    rotation.value = withRepeat(withTiming(360, { duration: 3000 }), -1, false);
  }, []);

  const animatedBorderStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  // Responsive configuration using all breakpoints
  const screenWidth = Dimensions.get('window').width;
  const isSm = screenWidth < VERCEL_LAYOUT.breakpoints.md;
  const isMd = screenWidth >= VERCEL_LAYOUT.breakpoints.md && screenWidth < VERCEL_LAYOUT.breakpoints.lg;
  const isLg = screenWidth >= VERCEL_LAYOUT.breakpoints.lg && screenWidth < VERCEL_LAYOUT.breakpoints.xl;
  const isXl = screenWidth >= VERCEL_LAYOUT.breakpoints.xl;

  // Force single column for mobile-first experience
  const numColumns = 1;

  // Responsive padding values
  const getHeaderPadding = () => {
    if (isSm) return VERCEL_SPACING.md;
    if (isMd) return VERCEL_SPACING.lg;
    if (isLg) return VERCEL_SPACING.xl;
    return VERCEL_SPACING['2xl'];
  };

  // Dynamic font sizes
  const getTitleSize = () => {
    if (isXl) return VERCEL_TYPOGRAPHY.sizes['3xl'];
    if (isLg) return VERCEL_TYPOGRAPHY.sizes['2xl'];
    if (isMd) return VERCEL_TYPOGRAPHY.sizes.xl;
    return VERCEL_TYPOGRAPHY.sizes.lg;
  };

  const filteredAgents = useMemo(() => {
    return agents
      .filter((agent) => {
        const matchesSearch =
          agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          agent.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || agent.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .map((agent, index) => ({
        ...agent,
        gradientColors: agent.gradientColors || GRADIENT_PRESETS[index % GRADIENT_PRESETS.length],
      }));
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
      <View style={[styles.header, {
        backgroundColor: colors.surface,
        paddingHorizontal: getHeaderPadding(),
      }]}>
        <Text style={[styles.title, {
          color: colors.textPrimary,
          fontSize: getTitleSize(),
        }]}>
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
        ListHeaderComponent={
          <View style={styles.createButtonContainer}>
            <TouchableOpacity
              style={styles.animatedButtonWrapper}
              onPress={() => navigation.navigate('CreateAgent')}
              activeOpacity={0.8}
            >
              <View style={[styles.createButtonContent, { backgroundColor: colors.surface }]}>
                <View style={styles.borderAnimationWrapper}>
                  <Animated.View style={[styles.animatedBorder, animatedBorderStyle]}>
                    <LinearGradient
                      colors={[colors.accent, '#FF0080', colors.accent]}
                      style={styles.fullSize}
                    />
                  </Animated.View>
                </View>
                <Text style={[styles.createButtonText, { color: colors.textPrimary }]}>
                  ✨ Create New Agent
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.agentItem}>
            <VercelAgentCard
              isDarkMode={isDarkMode}
              agent={item}
              onPress={handleAgentPress}
            />
          </View>
        )}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
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
    paddingTop: '6%',
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
    paddingRight: '10%',
  },
  clearButton: {
    position: 'absolute',
    right: '3%',
    top: '3%',
    width: '6%',
    height: '6%',
    borderRadius: '3%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIcon: {
    position: 'absolute',
    right: '3%',
    top: '3%',
    width: '6%',
    height: '6%',
    borderRadius: '3%',
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
  agentsList: {
    paddingBottom: VERCEL_SPACING.xl,
    paddingHorizontal: VERCEL_SPACING.lg,
    flexGrow: 1,
  },
  agentItem: {
    width: '100%',
    marginBottom: VERCEL_SPACING.md,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: VERCEL_SPACING['3xl'],
    marginTop: '15%',
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
  createButtonContainer: {
    paddingVertical: VERCEL_SPACING.lg,
    marginBottom: VERCEL_SPACING.sm,
  },
  animatedButtonWrapper: {
    width: '100%',
    height: 64,
    borderRadius: MOBILE_RADIUS.md,
    overflow: 'hidden',
    position: 'relative',
  },
  createButtonContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: MOBILE_RADIUS.md,
    margin: 2, // Border thickness
    overflow: 'hidden',
    zIndex: 1,
  },
  borderAnimationWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedBorder: {
    width: '200%',
    height: '200%',
  },
  fullSize: {
    flex: 1,
  },
  createButtonText: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.lg,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.bold,
  },
});