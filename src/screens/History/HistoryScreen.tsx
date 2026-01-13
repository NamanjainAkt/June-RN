import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../store/useAuthStore';
import { useChatStore } from '../../store/useChatStore';
import { useAppTheme } from '../../hooks';
import { ChatSession } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { Card, Avatar } from '../../components';
import { VercelCard, VercelAvatar, VercelButton } from '../../components/vercel/VercelComponents';
import { getVercelColors, VERCEL_TYPOGRAPHY, VERCEL_SPACING, VERCEL_BORDER_RADIUS } from '../../constants/vercel-theme';

export function HistoryScreen() {
  const navigation = useNavigation<any>();
  const { user } = useAuthStore();
  const { sessions, loadSessions, deleteSession, isLoading } = useChatStore();
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
        activeOpacity={0.8}
      >
        <VercelCard variant="bordered" isDarkMode={isDarkMode} style={styles.sessionCard}>
          <View style={styles.sessionLeft}>
            <VercelAvatar name={item.agentName} size="lg" isDarkMode={isDarkMode} />
          </View>

          <View style={styles.sessionInfo}>
            <View style={styles.sessionHeader}>
              <Text style={[styles.sessionTitle, { color: colors.textPrimary }]}>
                {item.agentName}
              </Text>
              <Text style={[styles.sessionTime, { color: colors.textTertiary }]}>
                {timeAgo}
              </Text>
            </View>

            <Text
              style={[styles.sessionPreview, { color: colors.textSecondary }]}
              numberOfLines={2}
            >
              {preview}
            </Text>

            <View style={styles.sessionMeta}>
              <Text style={[styles.messageCount, { color: colors.textTertiary }]}>
                {item.messages.length} message{item.messages.length !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => handleDeleteSession(item.id)}
            disabled={isDeleting}
            style={styles.deleteButton}
          >
            <Text style={{ color: colors.error, fontSize: 16 }}>🗑️</Text>
          </TouchableOpacity>
        </VercelCard>
      </TouchableOpacity>
    );
  }, [colors, handleSessionPress, handleDeleteSession, deletingId]);

  const keyExtractor = useCallback((item: ChatSession) => item.id, []);

return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Chat History
        </Text>
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
              <Text style={[styles.emptyIcon, { color: colors.textTertiary }]}>
                📚
              </Text>
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
    paddingTop: 48,
    paddingHorizontal: VERCEL_SPACING.lg,
    paddingBottom: VERCEL_SPACING.md,
  },
  title: {
    fontSize: VERCEL_TYPOGRAPHY.sizes['2xl'],
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.bold,
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: VERCEL_SPACING.md,
    marginBottom: VERCEL_SPACING.sm,
    gap: VERCEL_SPACING.md,
  },
  sessionLeft: {
    marginRight: VERCEL_SPACING.sm,
  },
  sessionInfo: {
    flex: 1,
    gap: VERCEL_SPACING.xs,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: VERCEL_SPACING.xs,
  },
  sessionTitle: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.lg,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.semibold,
    flex: 1,
  },
  sessionTime: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.sm,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.medium,
  },
  sessionPreview: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.base,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.regular,
    lineHeight: VERCEL_TYPOGRAPHY.lineHeights.base,
    marginBottom: VERCEL_SPACING.xs,
  },
  sessionMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messageCount: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.sm,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.medium,
  },
  deleteButton: {
    padding: VERCEL_SPACING.sm,
    marginLeft: VERCEL_SPACING.sm,
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