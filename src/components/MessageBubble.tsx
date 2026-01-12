import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Text, useTheme, TouchableRipple } from 'react-native-paper';
import { Message } from '../types';
import { MarkdownView } from './MarkdownView';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const theme = useTheme();
  const isUser = message.role === 'user';

  return (
    <View
      style={[
        styles.container,
        isUser
          ? styles.userContainer
          : { backgroundColor: theme.colors.surfaceVariant },
      ]}
    >
      {!isUser && (
        <View style={[styles.avatar, { backgroundColor: theme.colors.primaryContainer }]}>
          <Text style={{ color: theme.colors.primary, fontSize: 14, fontWeight: 'bold' }}>
            AI
          </Text>
        </View>
      )}

      <View style={[styles.content, isUser && styles.userContent]}>
        {message.imageUrl && (
          <Image
            source={{ uri: message.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
        {message.content ? (
          <MarkdownView content={message.content} />
        ) : null}
      </View>

      {isUser && (
        <View style={[styles.avatar, { backgroundColor: theme.colors.secondaryContainer }]}>
          <Text style={{ color: theme.colors.secondary, fontSize: 14, fontWeight: 'bold' }}>
            You
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    marginVertical: 4,
    borderRadius: 16,
    maxWidth: '90%',
    alignSelf: 'flex-start',
  },
  userContainer: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  content: {
    flex: 1,
    maxWidth: '80%',
  },
  userContent: {
    alignItems: 'flex-end',
  },
  image: {
    width: 200,
    height: 150,
    borderRadius: 12,
    marginBottom: 8,
  },
});
