import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text, useTheme, Surface, IconButton, ActivityIndicator } from 'react-native-paper';
import { useAuthStore } from '../../store/useAuthStore';
import { useChatStore } from '../../store/useChatStore';
import { ChatSession } from '../../types';
import { format } from 'date-fns';

export function HistoryScreen() {
  const navigation = useNavigation<any>();
  const theme = useTheme();
  const { user } = useAuthStore();
  const { sessions, loadSessions, deleteSession, isLoading } = useChatStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadSessions(user.id);
    }
  }, [user?.id]);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (user?.id) {
      await loadSessions(user.id);
    }
    setRefreshing(false);
  };

  const handleSessionPress = (session: ChatSession) => {
    const agent = { id: session.agentId, name: session.agentName } as any;
    navigation.navigate('Chat', { agentId: session.agentId, sessionId: session.id });
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (user?.id) {
      await deleteSession(sessionId, user.id);
    }
  };

  const renderSessionItem = ({ item }: { item: ChatSession }) => (
    <TouchableOpacity onPress={() => handleSessionPress(item)}>
      <Surface style={[styles.sessionCard, { backgroundColor: theme.colors.surfaceVariant }]}>
        <View style={styles.sessionInfo}>
          <Text style={{ color: theme.colors.onSurface }} variant="titleMedium">
            {item.agentName}
          </Text>
          <Text style={{ color: theme.colors.onSurfaceVariant }} variant="bodySmall">
            {item.messages.length} messages • {format(item.updatedAt, 'MMM d, h:mm a')}
          </Text>
          <Text
            style={{ color: theme.colors.onSurfaceVariant }}
            variant="bodyMedium"
            numberOfLines={2}
          >
            {item.messages[item.messages.length - 1]?.content || 'New conversation'}
          </Text>
        </View>
        <IconButton
          icon="trash-can-outline"
          size={20}
          onPress={() => handleDeleteSession(item.id)}
          iconColor={theme.colors.error}
        />
      </Surface>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Surface style={styles.header} elevation={0}>
        <Text style={{ color: theme.colors.onSurface }} variant="headlineMedium">
          History
        </Text>
      </Surface>

      {isLoading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={sessions}
          renderItem={renderSessionItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.sessionsList}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={{ color: theme.colors.onSurfaceVariant }} variant="bodyLarge">
                No chat history yet
              </Text>
              <Text style={{ color: theme.colors.onSurfaceVariant }} variant="bodyMedium">
                Start a conversation to see it here
              </Text>
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
  sessionInfo: {
    flex: 1,
    marginRight: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
});
