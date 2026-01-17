import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, FlatList, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChatInput } from '../../components';
import { VercelMessageBubble, VercelTypingIndicator } from '../../components/vercel/VercelChatComponents';
import { getVercelColors, VERCEL_BORDER_RADIUS, VERCEL_LAYOUT, VERCEL_SPACING, VERCEL_TYPOGRAPHY } from '../../constants/vercel-theme';
import { useAppTheme } from '../../hooks';
import { generateResponse } from '../../services/gemini';
import { useAuthStore } from '../../store/useAuthStore';
import { useChatStore } from '../../store/useChatStore';
import { Message } from '../../types';

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
    deleteSession,
    sessions,
  } = useChatStore();
  const { isDarkMode } = useAppTheme();

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<Array<{ uri: string; base64: string }>>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [messageStatuses, setMessageStatuses] = useState<Record<string, 'sending' | 'sent' | 'error'>>({});
  const flatListRef = useRef<FlatList>(null);

  const colors = getVercelColors(isDarkMode);
  const agentId = route.params?.agentId;
  const sessionId = route.params?.sessionId;
  const agent = agents.find((a) => a.id === agentId);

  // Responsive configuration using all breakpoints
  const screenWidth = Dimensions.get('window').width;

  // Determine current breakpoint
  const isSm = screenWidth < VERCEL_LAYOUT.breakpoints.md; // < 414
  const isMd = screenWidth >= VERCEL_LAYOUT.breakpoints.md && screenWidth < VERCEL_LAYOUT.breakpoints.lg; // 414-767
  const isLg = screenWidth >= VERCEL_LAYOUT.breakpoints.lg && screenWidth < VERCEL_LAYOUT.breakpoints.xl; // 768-1023
  const isXl = screenWidth >= VERCEL_LAYOUT.breakpoints.xl; // >= 1024

  // Dynamic spacing based on breakpoint (more spacing on larger screens)
  const getResponsivePadding = () => {
    if (isSm) return VERCEL_SPACING.md;
    if (isMd) return VERCEL_SPACING.lg;
    if (isLg) return VERCEL_SPACING.xl;
    return VERCEL_SPACING['2xl'];
  };

  // Dynamic container width for messages (wider on larger screens)
  const getContainerWidth = () => {
    if (isSm) return '95%';
    if (isMd) return '92%';
    if (isLg) return '90%';
    return '88%';
  };

  // Responsive message list padding
  const getMessagesPadding = () => {
    if (isSm) return VERCEL_SPACING.xs;
    if (isMd) return VERCEL_SPACING.sm;
    if (isLg) return VERCEL_SPACING.md;
    return VERCEL_SPACING.lg;
  };

  // Handle session initialization
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
  }, [agentId, sessionId, agents]);

  // Handle header configuration
  // Handle Delete Session
  const handleDeleteSession = async () => {
    const sid = currentSession?.id;
    const uid = user?.id;
    if (!sid || !uid) return;

    Alert.alert(
      'Delete Chat',
      'Are you sure you want to delete this conversation?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteSession(sid, uid);
            navigation.navigate('Main', { screen: 'History' });
          }
        }
      ]
    );
  };

  const handleNewChat = () => {
    const newAgent = agents.find((a) => a.id === agentId);
    if (newAgent) {
      createSession(newAgent);
      setMessage('');
      setSelectedImages([]);
    }
  };

  const handleSend = useCallback(async () => {
    if (!message.trim() && selectedImages.length === 0) return;
    if (!currentSession || !agent) return;

    const userMessageId = `${Date.now()}-user`;
    const userMessage: Message = {
      id: userMessageId,
      role: 'user',
      content: message.trim(),
      timestamp: Date.now(),
      imageUrl: selectedImages.length > 0 ? selectedImages[0].base64 : undefined,
    };

    // Set message status to sending
    setMessageStatuses(prev => ({ ...prev, [userMessageId]: 'sending' }));

    addMessage(userMessage);
    setMessage('');
    setSelectedImages([]);
    Keyboard.dismiss();

    setIsLoading(true);
    setIsTyping(true);

    try {
      let response: { text: string; imageUrl?: string };
      const isImageGen = agent.category === 'image';

      if (selectedImages.length > 0) {
        response = await generateResponse(
          message.trim(),
          agent.systemPrompt,
          selectedImages[0].base64,
          isImageGen
        );
      } else {
        response = await generateResponse(
          message.trim(),
          agent.systemPrompt,
          undefined,
          isImageGen
        );
      }

      const aiMessage: Message = {
        id: `${Date.now()}-ai`,
        role: 'assistant',
        content: response.text,
        imageUrl: response.imageUrl,
        timestamp: Date.now(),
      };

      addMessage(aiMessage);

      // Mark user message as sent successfully
      setMessageStatuses(prev => ({ ...prev, [userMessageId]: 'sent' }));
    } catch (error) {
      console.error('Error generating response:', error);

      // Mark user message as failed
      setMessageStatuses(prev => ({ ...prev, [userMessageId]: 'error' }));

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

  const handleRetryMessage = useCallback((message: Message) => {
    // Retry logic would involve re-sending the message
    // For now, we can just clear the error status
    setMessageStatuses(prev => {
      const newStatuses = { ...prev };
      delete newStatuses[message.id];
      return newStatuses;
    });

    // Set the message content to the input and trigger send
    setMessage(message.content);
    // Note: Actual retry would require additional logic
  }, []);

  const handleDeleteMessage = useCallback((messageId: string) => {
    // Remove message from store and clear its status
    setMessageStatuses(prev => {
      const newStatuses = { ...prev };
      delete newStatuses[messageId];
      return newStatuses;
    });
    // Note: Actual deletion would require additional logic in the store
  }, []);

  const messages = currentSession?.messages || [];

  // Improved auto-scroll without setTimeout
  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages.length, messages]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      {/* Custom Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: VERCEL_SPACING.md,
        paddingVertical: VERCEL_SPACING.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.background,
      }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ padding: VERCEL_SPACING.xs, marginRight: VERCEL_SPACING.sm }}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text style={{
            fontSize: VERCEL_TYPOGRAPHY.sizes.lg,
            fontFamily: VERCEL_TYPOGRAPHY.fontFamily.bold,
            color: colors.textPrimary,
          }}>
            {agent?.name || 'Chat'}
          </Text>
          {agent?.description && (
            <Text style={{
              fontSize: VERCEL_TYPOGRAPHY.sizes.xs,
              fontFamily: VERCEL_TYPOGRAPHY.fontFamily.regular,
              color: colors.textSecondary,
            }} numberOfLines={1}>
              {agent.description}
            </Text>
          )}
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={handleDeleteSession}
            style={{ padding: VERCEL_SPACING.xs, marginRight: VERCEL_SPACING.xs }}
          >
            <MaterialCommunityIcons name="delete-outline" size={24} color={colors.error} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleNewChat}
            style={{ padding: VERCEL_SPACING.xs }}
          >
            <MaterialCommunityIcons name="plus" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {messages.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.surfaceActive }]}>
              <Text style={{ color: colors.textPrimary, fontSize: isXl ? 64 : isLg ? 56 : isMd ? 52 : 48 }}>
                {agent?.name?.charAt(0) || 'A'}
              </Text>
            </View>
            <Text style={[styles.emptyTitle, { color: colors.textPrimary, fontSize: isXl ? VERCEL_TYPOGRAPHY.sizes['3xl'] : isLg ? VERCEL_TYPOGRAPHY.sizes['2xl'] : VERCEL_TYPOGRAPHY.sizes.xl }]}>
              Chat with {agent?.name}
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary, fontSize: isSm ? VERCEL_TYPOGRAPHY.sizes.sm : VERCEL_TYPOGRAPHY.sizes.base }]}>
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
                sendStatus={item.role === 'user' ? messageStatuses[item.id] : undefined}
                onRetry={item.role === 'user' && messageStatuses[item.id] === 'error' ? handleRetryMessage : undefined}
                onDelete={item.role === 'user' ? handleDeleteMessage : undefined}
                containerWidth={getContainerWidth()}
                breakpoint={{ isSm, isMd, isLg, isXl }}
              />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[styles.messagesList, {
              padding: getMessagesPadding(),
              paddingBottom: isSm ? VERCEL_SPACING.xs : VERCEL_SPACING.sm,
              maxWidth: isXl ? VERCEL_LAYOUT.breakpoints.xl : isLg ? VERCEL_LAYOUT.breakpoints.lg : '100%',
            }]}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
            ListFooterComponent={
              isTyping ? (
                <VercelTypingIndicator
                  isDarkMode={isDarkMode}
                  agentName={agent?.name}
                  breakpoint={{ isSm, isMd, isLg, isXl }}
                />
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


        <View style={[
          styles.inputContainer,
          {
            borderTopColor: colors.border,
          }
        ]}>
          <ChatInput
            value={message}
            onChangeText={setMessage}
            onSend={handleSend}
            onImagesSelected={handleImagesSelected}
            selectedImages={selectedImages}
            isLoading={isLoading}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
  headerIconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: VERCEL_SPACING.lg,
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
    alignSelf: 'center',
    width: '100%',
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
    borderTopColor: 'rgba(0,0,0,0.05)', // Subtle border
    backgroundColor: 'transparent',
  },
});


