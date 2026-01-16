import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { formatDistanceToNow } from 'date-fns';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { VercelButton } from '../../components/vercel/VercelComponents';
import { getVercelColors, VERCEL_BORDER_RADIUS, VERCEL_SPACING, VERCEL_TYPOGRAPHY } from '../../constants/vercel-theme';
import { useAppTheme } from '../../hooks';
import { useAuthStore } from '../../store/useAuthStore';
import { useChatStore } from '../../store/useChatStore';
import { ChatSession } from '../../types';

export function HistoryScreen() {
  const navigation = useNavigation<any>();
  const { user } = useAuthStore();
  const { sessions, loadSessions, deleteSession, clearAllSessions, isLoading } = useChatStore();
  const { isDarkMode } = useAppTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const colors = getVercelColors(isDarkMode);

  useEffect(() => {
    if (user?.id) {
      loadSessions(user.id);
    }
  }, [user?.id]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    if (user?.id) {
      await loadSessions(user.id);
    }
    setRefreshing(false);
  }, [user?.id, loadSessions]);

  const handleSessionPress = useCallback((session: ChatSession) => {
    navigation.navigate('Chat', { agentId: session.agentId, sessionId: session.id });
  }, [navigation]);

  const handleDeleteSession = useCallback(async (sessionId: string) => {
    if (!user?.id) return;

    Alert.alert(
      'Delete Chat',
      'Are you sure you want to delete this conversation?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeletingId(sessionId);
            try {
              await deleteSession(sessionId, user.id);
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]
    );
  }, [user?.id, deleteSession]);

  const renderSessionItem = useCallback(({ item }: { item: ChatSession }) => {
    const isDeleting = deletingId === item.id;
    const lastMessage = item.messages[item.messages.length - 1];
    const preview = lastMessage?.content || 'New conversation';
    const timeAgo = formatDistanceToNow(item.updatedAt, { addSuffix: true });

    return (
      <TouchableOpacity
        onPress={() => handleSessionPress(item)}
        disabled={isDeleting}
        activeOpacity={0.7}
      >
        <View style={[styles.sessionCard, {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        }]}>
          {/* Line 1: Name + Time */}
          <View style={styles.sessionHeader}>
            <Text style={[styles.sessionTitle, { color: colors.textPrimary }]} numberOfLines={1}>
              {item.agentName}
            </Text>
            <Text style={[styles.sessionTime, { color: colors.textTertiary }]}>
              {timeAgo}
            </Text>
          </View>

          {/* Line 2: Preview */}
          <Text
            style={[styles.sessionPreview, { color: colors.textSecondary }]}
            numberOfLines={1}
          >
            {preview}
          </Text>

          {/* Line 3: Message Count + Delete */}
          <View style={styles.sessionFooter}>
            <Text style={[styles.messageCount, { color: colors.textTertiary }]}>
              {item.messages.length} message{item.messages.length !== 1 ? 's' : ''}
            </Text>

            <TouchableOpacity
              onPress={() => handleDeleteSession(item.id)}
              disabled={isDeleting}
              style={styles.deleteButton}
            >
              <MaterialCommunityIcons name="delete-outline" size={20} color={colors.error} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  }, [colors, handleSessionPress, handleDeleteSession, deletingId]);

  const keyExtractor = useCallback((item: ChatSession) => item.id, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <View style={styles.headerTop}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Chat History
          </Text>
          {sessions.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  'Clear All History',
                  'Are you sure you want to delete all conversations? This cannot be undone.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Clear All',
                      style: 'destructive',
                      onPress: () => user?.id && clearAllSessions(user.id)
                    }
                  ]
                );
              }}
            >
              <Text style={{ color: colors.error, fontFamily: VERCEL_TYPOGRAPHY.fontFamily.medium }}>
                Clear All
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {isLoading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading conversations...
          </Text>
        </View>
      ) : (
        <FlatList
          data={sessions}
          renderItem={renderSessionItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.sessionsList}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="book-open-variant" size={64} color={colors.textTertiary} style={{ marginBottom: VERCEL_SPACING.lg }} />
              <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
                No Chat History
              </Text>
              <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                Start a conversation to see it here
              </Text>
              <VercelButton
                variant="primary"
                size="md"
                onPress={() => navigation.navigate('Explore')}
                style={styles.startButton}
                isDarkMode={isDarkMode}
                text="Start Chatting"
              />
            </View>
          }
        />
      )}
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: VERCEL_TYPOGRAPHY.sizes['3xl'],
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.bold,
    letterSpacing: -0.5,
    marginBottom: VERCEL_SPACING.xs,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.base,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.medium,
  },
  sessionsList: {
    padding: VERCEL_SPACING.lg,
    flexGrow: 1,
  },
  sessionCard: {
    padding: VERCEL_SPACING.md,
    marginBottom: VERCEL_SPACING.sm,
    borderRadius: VERCEL_BORDER_RADIUS.md,
    borderWidth: 1,
    minHeight: 100,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sessionTitle: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.base,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.semibold,
    flex: 1,
  },
  sessionTime: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.sm,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.regular,
    marginLeft: VERCEL_SPACING.sm,
  },
  sessionPreview: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.sm,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.regular,
    marginBottom: 12,
  },
  sessionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  messageCount: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.sm,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.regular,
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -4,
    marginBottom: -4,
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
    marginBottom: VERCEL_SPACING.lg,
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
    marginBottom: VERCEL_SPACING.lg,
  },
  startButton: {
    marginTop: VERCEL_SPACING.md,
  },
  exploreButtonText: {
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.medium,
  },
});