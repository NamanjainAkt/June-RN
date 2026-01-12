import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text } from 'react-native-paper';
import { useAuthStore } from '../../store/useAuthStore';
import { useChatStore } from '../../store/useChatStore';
import { useAppTheme } from '../../hooks';
import { ChatSession } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { Card, Avatar, Button } from '../../components';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants/theme';

export function HistoryScreen() {
  const navigation = useNavigation<any>();
  const { user } = useAuthStore();
  const { sessions, loadSessions, deleteSession, isLoading } = useChatStore();
  const { isDarkMode } = useAppTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const colors = isDarkMode ? COLORS.dark : COLORS.light;

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
        <Card variant="outlined" style={styles.sessionCard}>
          <View style={styles.sessionLeft}>
            <Avatar name={item.agentName} size="lg" />
          </View>

          <View style={styles.sessionInfo}>
            <View style={styles.sessionHeader}>
              <Text style={[styles.sessionTitle, { color: colors.primary }]}>
                {item.agentName}
              </Text>
              <Text style={[styles.sessionTime, { color: colors.secondaryVariant }]}>
                {timeAgo}
              </Text>
            </View>

            <Text
              style={[styles.sessionPreview, { color: colors.secondary }]}
              numberOfLines={2}
            >
              {preview}
            </Text>

            <View style={styles.sessionMeta}>
              <Text style={[styles.messageCount, { color: colors.secondaryVariant }]}>
                {item.messages.length} message{item.messages.length !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>

          <Button
            variant="ghost"
            size="sm"
            onPress={() => handleDeleteSession(item.id)}
            disabled={isDeleting}
            style={styles.deleteButton}
          >
            <Text style={{ color: colors.error, fontSize: 16 }}>🗑️</Text>
          </Button>
        </Card>
      </TouchableOpacity>
    );
  }, [colors, handleSessionPress, handleDeleteSession, deletingId]);

  const keyExtractor = useCallback((item: ChatSession) => item.id, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.title, { color: colors.primary }]}>
          Chat History
        </Text>
      </View>

      {isLoading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.secondary }]}>
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
              <Text style={[styles.emptyIcon, { color: colors.secondaryVariant }]}>
                📚
              </Text>
              <Text style={[styles.emptyTitle, { color: colors.primary }]}>
                No Chat History
              </Text>
              <Text style={[styles.emptySubtitle, { color: colors.secondary }]}>
                Start a conversation to see it here
              </Text>
              <TouchableOpacity
                style={[styles.exploreButton, { backgroundColor: colors.primary }]}
                onPress={() => navigation.navigate('Explore')}
                activeOpacity={0.8}
              >
                <Text style={[styles.exploreButtonText, { color: colors.onPrimary }]}>
                  Explore Agents
                </Text>
              </TouchableOpacity>
            </View>
          }
          ListHeaderComponent={
            sessions.length > 0 ? (
              <Text style={[styles.resultsText, { color: colors.secondaryVariant }]}>
                {sessions.length} conversation{sessions.length !== 1 ? 's' : ''}
              </Text>
            ) : null
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
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes['2xl'],
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },
  sessionsList: {
    padding: SPACING.lg,
    paddingTop: SPACING.md,
  },
  resultsText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    marginBottom: SPACING.sm,
  },
  sessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  deletingCard: {
    opacity: 0.5,
  },
  sessionLeft: {
    marginRight: SPACING.md,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  sessionTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
  },
  sessionTime: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },
  sessionPreview: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    lineHeight: 20,
    marginBottom: SPACING.sm,
  },
  sessionMeta: {
    flexDirection: 'row',
  },
  messageCount: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },
  deleteButton: {
    width: 40,
    height: 40,
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
    marginBottom: SPACING.xl,
  },
  exploreButton: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: 24,
  },
  exploreButtonText: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },
});