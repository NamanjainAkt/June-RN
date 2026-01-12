import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Keyboard } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Text } from 'react-native-paper';
import { useChatStore } from '../../store/useChatStore';
import { useAuthStore } from '../../store/useAuthStore';
import { ChatInput, MessageBubble, Avatar, Button } from '../../components';
import { generateResponse } from '../../services/gemini';
import { useAppTheme } from '../../hooks';
import { Message } from '../../types';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../constants/theme';

type ChatRouteParams = {
  agentId: string;
  sessionId?: string;
};

export function ChatScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<{ Chat: ChatRouteParams }, 'Chat'>>();
  const { user } = useAuthStore();
  const {
    agents,
    currentSession,
    createSession,
    setCurrentSession,
    addMessage,
    sessions,
  } = useChatStore();
  const { isDarkMode } = useAppTheme();

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<Array<{ uri: string; base64: string }>>([]);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const colors = isDarkMode ? COLORS.dark : COLORS.light;
  const agentId = route.params?.agentId;
  const sessionId = route.params?.sessionId;
  const agent = agents.find((a) => a.id === agentId);

  useEffect(() => {
    if (agentId) {
      if (sessionId) {
        const existingSession = sessions.find((s) => s.id === sessionId);
        if (existingSession) {
          setCurrentSession(existingSession);
        }
      } else {
        const newAgent = agents.find((a) => a.id === agentId);
        if (newAgent) {
          createSession(newAgent);
        }
      }
    }

    if (agent) {
      navigation.setOptions({
        headerTitle: () => (
          <View style={styles.headerTitle}>
            <Avatar name={agent.name} size="md" />
            <View style={styles.headerText}>
              <Text style={[styles.headerName, { color: colors.primary }]}>
                {agent.name}
              </Text>
              <Text style={[styles.headerModel, { color: colors.secondaryVariant }]}>
                Gemini 2.5 Flash Lite
              </Text>
            </View>
          </View>
        ),
        headerRight: () => (
          <Button
            variant="ghost"
            size="sm"
            onPress={() => {
              const newAgent = agents.find((a) => a.id === agentId);
              if (newAgent) {
                createSession(newAgent);
                setMessage('');
                setSelectedImages([]);
              }
            }}
            style={styles.newChatButton}
          >
            <Text style={{ color: colors.secondary, fontSize: 16 }}>➕</Text>
          </Button>
        ),
      });
    }
  }, [agentId, sessionId, agents, agent, isDarkMode]);

  const handleSend = useCallback(async () => {
    if (!message.trim() && selectedImages.length === 0) return;
    if (!currentSession || !agent) return;

    const userMessage: Message = {
      id: `${Date.now()}-user`,
      role: 'user',
      content: message.trim(),
      timestamp: Date.now(),
      imageUrl: selectedImages.length > 0 ? selectedImages[0].base64 : undefined,
    };

    addMessage(userMessage);
    setMessage('');
    setSelectedImages([]);
    Keyboard.dismiss();

    setIsLoading(true);
    setIsTyping(true);

    try {
      let response = '';
      if (selectedImages.length > 0) {
        response = await generateResponse(
          message.trim(),
          agent.systemPrompt,
          selectedImages[0].base64
        );
      } else {
        response = await generateResponse(
          message.trim(),
          agent.systemPrompt
        );
      }

      const aiMessage: Message = {
        id: `${Date.now()}-ai`,
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      };

      addMessage(aiMessage);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage: Message = {
        id: `${Date.now()}-error`,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: Date.now(),
      };
      addMessage(errorMessage);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  }, [message, selectedImages, currentSession, agent, addMessage]);

  const handleImagesSelected = useCallback((images: Array<{ uri: string; base64: string }>) => {
    setSelectedImages(images);
  }, []);

  const messages = currentSession?.messages || [];

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {messages.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={[styles.emptyIcon, { backgroundColor: colors.primaryContainer }]}>
            <Text style={{ color: colors.primary, fontSize: 48 }}>
              {agent?.name?.charAt(0) || 'A'}
            </Text>
          </View>
          <Text style={[styles.emptyTitle, { color: colors.primary }]}>
            Chat with {agent?.name}
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.secondary }]}>
            {agent?.description}
          </Text>
          <Text style={[styles.emptyModel, { color: colors.secondaryVariant }]}>
            Powered by Gemini 2.5 Flash Lite
          </Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={({ item }) => <MessageBubble message={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          ListFooterComponent={
            isTyping ? (
              <View style={styles.typingIndicator}>
                <View style={[styles.typingBubble, { backgroundColor: colors.surfaceVariant }]}>
                  <View style={styles.typingDots}>
                    <View style={[styles.dot, { backgroundColor: colors.secondaryVariant }]} />
                    <View style={[styles.dot, { backgroundColor: colors.secondaryVariant }]} />
                    <View style={[styles.dot, { backgroundColor: colors.secondaryVariant }]} />
                  </View>
                </View>
              </View>
            ) : null
          }
        />
      )}

      {(isLoading || isTyping) && (
        <View style={styles.loadingIndicator}>
          <ActivityIndicator size="small" color={colors.accent} />
          <Text style={[styles.loadingText, { color: colors.secondaryVariant }]}>
            {isTyping ? 'Thinking...' : 'Loading...'}
          </Text>
        </View>
      )}

      <View style={[styles.inputContainer, { backgroundColor: colors.surface }]}>
        <ChatInput
          value={message}
          onChangeText={setMessage}
          onSend={handleSend}
          onImagesSelected={handleImagesSelected}
          selectedImages={selectedImages}
          isLoading={isLoading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: SPACING.md,
  },
  headerName: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
  },
  headerModel: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
  newChatButton: {
    width: 40,
    height: 40,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY.sizes['2xl'],
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  emptyModel: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    textAlign: 'center',
  },
  messagesList: {
    padding: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  typingIndicator: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
  typingBubble: {
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignSelf: 'flex-start',
  },
  typingDots: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: BORDER_RADIUS.full,
  },
  loadingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  loadingText: {
    marginLeft: SPACING.sm,
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
});