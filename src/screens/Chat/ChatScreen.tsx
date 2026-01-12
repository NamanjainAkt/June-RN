import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Keyboard } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Text, useTheme, Surface, IconButton } from 'react-native-paper';
import { useChatStore } from '../../store/useChatStore';
import { useAuthStore } from '../../store/useAuthStore';
import { ChatInput, MessageBubble } from '../../components';
import { generateResponse } from '../../services/gemini';
import { Message } from '../../types';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

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
  const flatListRef = useRef<FlatList>(null);

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

    navigation.setOptions({
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
      headerTitle: agent?.name || 'Chat',
    });
  }, [agentId, sessionId, agents]);

  const handleSend = async () => {
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
    }
  };

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;

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

  const messages = currentSession?.messages || [];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {messages.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={{ color: theme.colors.onSurfaceVariant }} variant="bodyLarge">
            Start a conversation with {agent?.name}
          </Text>
          <Text style={{ color: theme.colors.onSurfaceVariant }} variant="bodyMedium">
            {agent?.description}
          </Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={({ item }) => <MessageBubble message={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      {isLoading && (
        <Surface style={styles.loadingIndicator} elevation={0}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
          <Text style={{ color: theme.colors.onSurfaceVariant, marginLeft: 8 }} variant="bodySmall">
            Thinking...
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  messagesList: {
    padding: 16,
    paddingBottom: 8,
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
