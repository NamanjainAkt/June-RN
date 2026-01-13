import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Text } from 'react-native-paper';
import { Message } from '../types';
import { MarkdownView } from './MarkdownView';
import { useAppTheme } from '../hooks';
import { VERCEL_SPACING, VERCEL_BORDER_RADIUS, VERCEL_TYPOGRAPHY, VERCEL_LAYOUT } from '../constants/vercel-theme';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const { colors, typography, borderRadius, spacing, layout } = useAppTheme();
  const isUser = message.role === 'user';

  return (
    <View
      style={[
        styles.container,
        isUser
          ? [styles.userContainer, { backgroundColor: colors.accent }]
          : { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 },
      ]}
    >
      {!isUser && (
        <View style={[styles.avatar, { backgroundColor: colors.surfaceActive }]}>
          <Text style={{ 
            color: colors.textPrimary, 
            fontSize: typography.sizes.sm, 
            fontFamily: typography.fontFamily.bold 
          }}>
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
        <View style={[styles.avatar, { backgroundColor: colors.surfaceActive }]}>
          <Text style={{ 
            color: colors.textPrimary, 
            fontSize: typography.sizes.sm, 
            fontFamily: typography.fontFamily.bold 
          }}>
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
    padding: VERCEL_SPACING.md,
    marginVertical: VERCEL_SPACING.xs,
    borderRadius: VERCEL_BORDER_RADIUS.lg,
    maxWidth: '90%',
    alignSelf: 'flex-start',
  },
  userContainer: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  avatar: {
    width: VERCEL_LAYOUT.components.avatarSize.sm,
    height: VERCEL_LAYOUT.components.avatarSize.sm,
    borderRadius: VERCEL_LAYOUT.components.avatarSize.sm / 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: VERCEL_SPACING.sm,
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
    borderRadius: VERCEL_BORDER_RADIUS.md,
    marginBottom: VERCEL_SPACING.sm,
  },
});
