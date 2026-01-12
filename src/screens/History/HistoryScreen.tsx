import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text, useTheme, Surface, IconButton, ActivityIndicator, Avatar } from 'react-native-paper';
import { useAuthStore } from '../../store/useAuthStore';
import { useChatStore } from '../../store/useChatStore';
import { ChatSession } from '../../types';
import { format, formatDistanceToNow } from 'date-fns';
import { useDynamicFontSize } from '../../hooks';

export function HistoryScreen() {
  const navigation = useNavigation<any>();
  const theme = useTheme();
  const { user } = useAuthStore();
  const { sessions, loadSessions, deleteSession, isLoading } = useChatStore();
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const headerFontSize = useDynamicFontSize(24);
  const titleFontSize = useDynamicFontSize(16);
  const subtitleFontSize = useDynamicFontSize(12);
  const bodyFontSize = useDynamicFontSize(14);

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

  const getSessionIcon = (agentName: string) => {
    const name = agentName.toLowerCase();
    if (name.includes('writing')) return 'pencil';
    if (name.includes('coding')) return 'code';
    if (name.includes('image')) return 'image';
    if (name.includes('caption')) return 'text';
    if (name.includes('general')) return 'assistant';
    return 'chat';
  };

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
        <Surface
          style={[
            styles.sessionCard,
            { backgroundColor: theme.colors.surfaceVariant },
            isDeleting && { opacity: 0.5 },
          ]}
        >
          <View style={styles.sessionLeft}>
            <Avatar.Text
              size={48}
              label={item.agentName.charAt(0)}
              style={{ backgroundColor: theme.colors.primaryContainer }}
              labelStyle={{ color: theme.colors.primary }}
            />
          </View>

          <View style={styles.sessionInfo}>
            <View style={styles.sessionHeader}>
              <Text
                style={{ color: theme.colors.onSurface, fontSize: titleFontSize }}
                variant="titleMedium"
                numberOfLines={1}
              >
                {item.agentName}
              </Text>
              <Text
                style={{ color: theme.colors.onSurfaceVariant, fontSize: subtitleFontSize }}
                variant="bodySmall"
              >
                {timeAgo}
              </Text>
            </View>

            <Text
              style={{ color: theme.colors.onSurfaceVariant, fontSize: bodyFontSize }}
              variant="bodyMedium"
              numberOfLines={2}
            >
              {preview}
            </Text>

            <View style={styles.sessionMeta}>
              <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: subtitleFontSize }} variant="bodySmall">
                {item.messages.length} message{item.messages.length !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>

          <IconButton
            icon="trash-can-outline"
            size={20}
            onPress={() => handleDeleteSession(item.id)}
            iconColor={theme.colors.error}
            disabled={isDeleting}
          />
        </Surface>
      </TouchableOpacity>
    );
  }, [theme, handleSessionPress, handleDeleteSession, deletingId, titleFontSize, subtitleFontSize, bodyFontSize]);

  const keyExtractor = useCallback((item: ChatSession) => item.id, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Surface style={styles.header} elevation={0}>
        <Text
          style={{ color: theme.colors.onSurface, fontSize: headerFontSize }}
          variant="headlineMedium"
        >
          History
        </Text>
      </Surface>

      {isLoading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{ color: theme.colors.onSurfaceVariant, marginTop: 16 }} variant="bodyMedium">
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
              <Surface style={[styles.emptyIcon, { backgroundColor: theme.colors.surfaceVariant }]}>
                <IconButton icon="history" size={48} iconColor={theme.colors.onSurfaceVariant} />
              </Surface>
              <Text
                style={{ color: theme.colors.onSurface, fontSize: bodyFontSize * 1.25 }}
                variant="headlineSmall"
              >
                No Chat History
              </Text>
              <Text
                style={{ color: theme.colors.onSurfaceVariant, fontSize: bodyFontSize, marginTop: 8 }}
                variant="bodyMedium"
              >
                Start a conversation to see it here
              </Text>
              <TouchableOpacity
                style={[styles.exploreButton, { backgroundColor: theme.colors.primary }]}
                onPress={() => navigation.navigate('Explore')}
              >
                <Text style={{ color: theme.colors.onPrimary, fontSize: bodyFontSize }} variant="bodyMedium">
                  Explore Agents
                </Text>
              </TouchableOpacity>
            </View>
          }
          ListHeaderComponent={
            sessions.length > 0 ? (
              <Text style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8 }} variant="bodySmall">
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
    padding: 16,
    paddingTop: 48,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sessionsList: {
    padding: 16,
    paddingTop: 8,
  },
  sessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  sessionLeft: {
    marginRight: 12,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sessionMeta: {
    flexDirection: 'row',
    marginTop: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    marginTop: 100,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  exploreButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
});
