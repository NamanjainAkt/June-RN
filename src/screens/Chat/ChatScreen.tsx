import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Keyboard, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useChatStore } from '../../store/useChatStore';
import { useAuthStore } from '../../store/useAuthStore';
import { ChatInput, Avatar } from '../../components';
import { VercelMessageBubble } from '../../components/vercel/VercelChatComponents';
import { VercelAvatar, VercelButton } from '../../components/vercel/VercelComponents';
import { generateResponse } from '../../services/gemini';
import { useAppTheme } from '../../hooks';
import { Message } from '../../types';
import * as ImagePicker from 'expo-image-picker';
import { getVercelColors, VERCEL_SPACING, VERCEL_BORDER_RADIUS, VERCEL_TYPOGRAPHY, VERCEL_LAYOUT } from '../../constants/vercel-theme';
import { Dimensions } from 'react-native';

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

  const colors = getVercelColors(isDarkMode);
  const agentId = route.params?.agentId;
  const sessionId = route.params?.sessionId;
  const agent = agents.find((a) => a.id === agentId);
  
  // Responsive configuration
  const screenWidth = Dimensions.get('window').width;
  const isLargeScreen = screenWidth >= VERCEL_LAYOUT.breakpoints.lg;
  
  const getResponsivePadding = () => {
    if (isLargeScreen) return VERCEL_SPACING.xl;
    return VERCEL_SPACING.lg;
  };

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
        headerTitle: agent.name,
        headerRight: () => (
          <TouchableOpacity
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
            <Text style={{ color: colors.textSecondary, fontSize: 16 }}>➕</Text>
          </TouchableOpacity>
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
          <View style={[styles.emptyIcon, { backgroundColor: colors.surfaceActive }]}>
            <Text style={{ color: colors.textPrimary, fontSize: 48 }}>
              {agent?.name?.charAt(0) || 'A'}
            </Text>
          </View>
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
            Chat with {agent?.name}
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            {agent?.description}
          </Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={({ item }) => (
            <VercelMessageBubble 
              message={item} 
              isDarkMode={isDarkMode}
              agentName={agent?.name}
              isUser={item.role === 'user'}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          ListFooterComponent={
            isTyping ? (
              <View style={styles.typingIndicator}>
                <View style={[styles.typingBubble, { backgroundColor: colors.surfaceActive }]}>
                  <View style={styles.typingDots}>
                    <View style={[styles.dot, { backgroundColor: colors.textTertiary }]} />
                    <View style={[styles.dot, { backgroundColor: colors.textTertiary }]} />
                    <View style={[styles.dot, { backgroundColor: colors.textTertiary }]} />
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
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
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

  newChatButton: {
    width: 40,
    height: 40,
    padding: VERCEL_SPACING.sm,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: VERCEL_SPACING.xl,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: VERCEL_BORDER_RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: VERCEL_SPACING.lg,
  },
  emptyTitle: {
    fontSize: VERCEL_TYPOGRAPHY.sizes['2xl'],
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.bold,
    marginBottom: VERCEL_SPACING.xs,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.base,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.regular,
    textAlign: 'center',
    marginBottom: VERCEL_SPACING.md,
  },

  messagesList: {
    padding: VERCEL_SPACING.lg,
    paddingBottom: VERCEL_SPACING.md,
    maxWidth: VERCEL_LAYOUT.breakpoints.lg,
    alignSelf: 'center',
    width: '100%',
  },
  typingIndicator: {
    paddingVertical: VERCEL_SPACING.sm,
    paddingHorizontal: VERCEL_SPACING.lg,
  },
  typingBubble: {
    padding: VERCEL_SPACING.md,
    borderRadius: VERCEL_BORDER_RADIUS.md,
    alignSelf: 'flex-start',
  },
  typingDots: {
    flexDirection: 'row',
    gap: VERCEL_SPACING.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: VERCEL_BORDER_RADIUS.full,
  },
  loadingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: VERCEL_SPACING.md,
    paddingHorizontal: VERCEL_SPACING.lg,
  },
  loadingText: {
    marginLeft: VERCEL_SPACING.sm,
    fontSize: VERCEL_TYPOGRAPHY.sizes.sm,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.medium,
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
});