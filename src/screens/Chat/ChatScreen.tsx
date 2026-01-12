import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Keyboard, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Text, useTheme, Surface, IconButton, Avatar, Icon } from 'react-native-paper';
import { useChatStore } from '../../store/useChatStore';
import { useAuthStore } from '../../store/useAuthStore';
import { ChatInput, MessageBubble } from '../../components';
import { generateResponse } from '../../services/gemini';
import { Message } from '../../types';
import * as ImagePicker from 'expo-image-picker';
import { useDynamicFontSize } from '../../hooks';

type ChatRouteParams = {
  agentId: string;
  sessionId?: string;
};

export function ChatScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<{ Chat: ChatRouteParams }, 'Chat'>>();
  const theme = useTheme();
  const { user } = useAuthStore();
  const {
    agents,
    currentSession,
    createSession,
    setCurrentSession,
    addMessage,
    sessions,
  } = useChatStore();

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const agentId = route.params?.agentId;
  const sessionId = route.params?.sessionId;

  const agent = agents.find((a) => a.id === agentId);
  const fontSize = useDynamicFontSize(16);

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
            <Avatar.Text
              size={36}
              label={agent.name.charAt(0)}
              style={{ backgroundColor: theme.colors.primaryContainer }}
              labelStyle={{ color: theme.colors.primary }}
            />
            <View style={styles.headerText}>
              <Text style={{ color: theme.colors.onSurface, fontSize: 16 }} numberOfLines={1}>
                {agent.name}
              </Text>
              <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 12 }} numberOfLines={1}>
                Gemini 2.5 Flash Lite
              </Text>
            </View>
          </View>
        ),
        headerRight: () => (
          <IconButton
            icon="plus"
            size={24}
            onPress={() => {
              const newAgent = agents.find((a) => a.id === agentId);
              if (newAgent) {
                createSession(newAgent);
                setMessage('');
                setSelectedImage(null);
              }
            }}
            iconColor={theme.colors.onSurface}
          />
        ),
      });
    }
  }, [agentId, sessionId, agents, agent]);

  const handleSend = useCallback(async () => {
    if (!message.trim() && !selectedImage) return;
    if (!currentSession || !agent) return;

    const userMessage: Message = {
      id: `${Date.now()}-user`,
      role: 'user',
      content: message.trim(),
      timestamp: Date.now(),
      imageUrl: selectedImage || undefined,
    };

    addMessage(userMessage);
    setMessage('');
    setSelectedImage(null);
    Keyboard.dismiss();

    setIsLoading(true);
    setIsTyping(true);

    try {
      let response = '';
      if (selectedImage) {
        response = await generateResponse(
          message.trim(),
          agent.systemPrompt,
          selectedImage
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
  }, [message, selectedImage, currentSession, agent, addMessage]);

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].base64 || null);
    }
  };

  const clearSelectedImage = () => {
    setSelectedImage(null);
  };

  const messages = currentSession?.messages || [];

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {messages.length === 0 ? (
        <View style={styles.emptyState}>
          <Surface style={[styles.emptyIcon, { backgroundColor: theme.colors.primaryContainer }]}>
            <Text style={{ color: theme.colors.primary, fontSize: 48 }}>{agent?.name?.charAt(0) || 'A'}</Text>
          </Surface>
          <Text style={{ color: theme.colors.onSurface, fontSize: fontSize * 1.25 }} variant="headlineSmall">
            Chat with {agent?.name}
          </Text>
          <Text style={{ color: theme.colors.onSurfaceVariant, fontSize }} variant="bodyMedium">
            {agent?.description}
          </Text>
          <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: fontSize * 0.875, marginTop: 8 }} variant="bodySmall">
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
                <Surface style={[styles.typingBubble, { backgroundColor: theme.colors.surfaceVariant }]}>
                  <View style={styles.typingDots}>
                    <View style={[styles.dot, { backgroundColor: theme.colors.onSurfaceVariant }]} />
                    <View style={[styles.dot, { backgroundColor: theme.colors.onSurfaceVariant }]} />
                    <View style={[styles.dot, { backgroundColor: theme.colors.onSurfaceVariant }]} />
                  </View>
                </Surface>
              </View>
            ) : null
          }
        />
      )}

      {selectedImage && (
        <Surface style={[styles.imagePreview, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Text style={{ color: theme.colors.onSurface, fontSize: 12 }} variant="bodySmall">
            Image attached
          </Text>
          <TouchableOpacity onPress={clearSelectedImage}>
            <IconButton icon="close" size={20} iconColor={theme.colors.error} />
          </TouchableOpacity>
        </Surface>
      )}

      {(isLoading || isTyping) && (
        <Surface style={styles.loadingIndicator} elevation={0}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
          <Text style={{ color: theme.colors.onSurfaceVariant, marginLeft: 8, fontSize: 12 }} variant="bodySmall">
            {isTyping ? 'Thinking...' : 'Loading...'}
          </Text>
        </Surface>
      )}

      <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface }]}>
        <ChatInput
          value={message}
          onChangeText={setMessage}
          onSend={handleSend}
          onImagePick={handleImagePick}
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
    marginLeft: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  messagesList: {
    padding: 16,
    paddingBottom: 8,
  },
  typingIndicator: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  typingBubble: {
    padding: 12,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  typingDots: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  imagePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
  },
  loadingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 16,
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
});
