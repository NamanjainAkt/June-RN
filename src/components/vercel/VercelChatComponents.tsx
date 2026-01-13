// Vercel-Style Chat Components
// Clean, Professional Chat Interface

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { getVercelColors, VERCEL_TYPOGRAPHY, VERCEL_BORDER_RADIUS, VERCEL_SPACING, VERCEL_LAYOUT } from '../../constants/vercel-theme';
import { Message } from '../../types';

// Vercel Message Bubble Component
interface VercelMessageBubbleProps {
  message: Message;
  isDarkMode: boolean;
  agentName?: string;
  isUser?: boolean;
}

export const VercelMessageBubble: React.FC<VercelMessageBubbleProps> = ({
  message,
  isDarkMode,
  agentName,
  isUser = false,
}) => {
  const colors = getVercelColors(isDarkMode);
  
  return (
    <View style={[
      styles.messageContainer,
      isUser ? styles.userMessage : styles.assistantMessage,
    ]}>
      {/* Avatar */}
      {!isUser && (
        <View style={styles.avatarContainer}>
          <View style={[
            styles.avatar,
            { backgroundColor: colors.surfaceActive },
          ]}>
            <Text style={[
              styles.avatarText,
              { color: colors.textPrimary },
            ]}>
              {agentName?.charAt(0) || 'AI'}
            </Text>
          </View>
        </View>
      )}
      
      {/* Message Content */}
      <View style={[
        styles.messageContent,
        {
          backgroundColor: isUser ? colors.accent : colors.surface,
          borderWidth: isUser ? 0 : 1,
          borderColor: colors.border,
        },
      ]}>
        {/* Agent Name (for assistant messages) */}
        {!isUser && agentName && (
          <Text style={[
            styles.messageAgentName,
            { color: colors.textTertiary },
          ]}>
            {agentName}
          </Text>
        )}
        
        {/* Message Text */}
        <Text style={[
          styles.messageText,
          {
            color: isUser ? colors.textPrimary : colors.textPrimary,
          },
        ]}>
          {message.content}
        </Text>
        
        {/* Timestamp */}
        <Text style={[
          styles.timestamp,
          {
            color: isUser ? colors.textSecondary : colors.textTertiary,
          },
        ]}>
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
      
      {/* User Avatar (right-aligned) */}
      {isUser && (
        <View style={styles.avatarContainer}>
          <View style={[
            styles.avatar,
            { backgroundColor: colors.surfaceActive },
          ]}>
            <Text style={[
              styles.avatarText,
              { color: colors.textPrimary },
            ]}>
              Y
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

// Vercel Chat Input Component
interface VercelChatInputProps {
  isDarkMode: boolean;
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onAttachImage: () => void;
  isLoading?: boolean;
  placeholder?: string;
}

export const VercelChatInput: React.FC<VercelChatInputProps> = ({
  isDarkMode,
  value,
  onChangeText,
  onSend,
  onAttachImage,
  isLoading = false,
  placeholder = "Ask anything...",
}) => {
  const colors = getVercelColors(isDarkMode);
  
  return (
    <View style={[
      styles.inputContainer,
      {
        backgroundColor: colors.background,
        borderTopColor: colors.border,
      },
    ]}>
      {/* Input Wrapper */}
      <View style={[
        styles.inputWrapper,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}>
        {/* Attach Button */}
        <TouchableOpacity
          style={styles.attachButton}
          onPress={onAttachImage}
          disabled={isLoading}
        >
          <Text style={[styles.attachIcon, { color: colors.textSecondary }]}>
            📎
          </Text>
        </TouchableOpacity>
        
        {/* Text Input */}
        <Text
          style={[
            styles.textInput,
            {
              color: colors.textPrimary,
            },
          ]}
        >
          {value || placeholder}
        </Text>
        
        {/* Send Button */}
        <TouchableOpacity
          style={[
            styles.sendButton,
            {
              backgroundColor: value.trim() && !isLoading ? colors.accent : colors.surfaceActive,
            },
          ]}
          onPress={onSend}
          disabled={!value.trim() || isLoading}
        >
          <Text style={[
            styles.sendIcon,
            { color: value.trim() && !isLoading ? colors.textPrimary : colors.textTertiary },
          ]}>
            {isLoading ? '⏳' : '→'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Input Hint */}
      <Text style={[
        styles.inputHint,
        { color: colors.textTertiary },
      ]}>
        Press Enter to send, Shift+Enter for new line
      </Text>
    </View>
  );
};

// Vercel Typing Indicator Component
interface VercelTypingIndicatorProps {
  isDarkMode: boolean;
  agentName?: string;
}

export const VercelTypingIndicator: React.FC<VercelTypingIndicatorProps> = ({
  isDarkMode,
  agentName,
}) => {
  const colors = getVercelColors(isDarkMode);
  
  return (
    <View style={styles.typingContainer}>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <View style={[
          styles.avatar,
          { backgroundColor: colors.surfaceActive },
        ]}>
          <Text style={[
            styles.avatarText,
            { color: colors.textPrimary },
          ]}>
            {agentName?.charAt(0) || 'AI'}
          </Text>
        </View>
      </View>
      
      {/* Typing Bubble */}
      <View style={[
        styles.typingBubble,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}>
        <Text style={[
          styles.typingText,
          { color: colors.textTertiary },
        ]}>
          {agentName || 'AI'} is typing
        </Text>
        
        {/* Typing Dots */}
        <View style={styles.typingDots}>
          <View style={[
            styles.dot,
            { backgroundColor: colors.textTertiary },
          ]} />
          <View style={[
            styles.dot,
            { backgroundColor: colors.textTertiary },
          ]} />
          <View style={[
            styles.dot,
            { backgroundColor: colors.textTertiary },
          ]} />
        </View>
      </View>
    </View>
  );
};

// Vercel Chat Header Component
interface VercelChatHeaderProps {
  isDarkMode: boolean;
  agentName: string;
  agentDescription: string;
  onBack: () => void;
  onNewChat: () => void;
}

export const VercelChatHeader: React.FC<VercelChatHeaderProps> = ({
  isDarkMode,
  agentName,
  agentDescription,
  onBack,
  onNewChat,
}) => {
  const colors = getVercelColors(isDarkMode);
  
  return (
    <View style={[
      styles.headerContainer,
      {
        backgroundColor: colors.background,
        borderBottomColor: colors.border,
      },
    ]}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={[styles.backIcon, { color: colors.textPrimary }]}>
          ←
        </Text>
      </TouchableOpacity>
      
      {/* Agent Info */}
      <View style={styles.agentInfo}>
        <Text style={[
          styles.agentName,
          { color: colors.textPrimary },
        ]}>
          {agentName}
        </Text>
        <Text style={[
          styles.agentDescription,
          { color: colors.textSecondary },
        ]}>
          {agentDescription}
        </Text>
      </View>
      
      {/* New Chat Button */}
      <TouchableOpacity style={styles.newChatButton} onPress={onNewChat}>
        <Text style={[styles.newChatIcon, { color: colors.textSecondary }]}>
          +
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Vercel Empty State Component
interface VercelEmptyStateProps {
  isDarkMode: boolean;
  agentName: string;
  agentDescription: string;
}

export const VercelEmptyState: React.FC<VercelEmptyStateProps> = ({
  isDarkMode,
  agentName,
  agentDescription,
}) => {
  const colors = getVercelColors(isDarkMode);
  
  return (
    <View style={[
      styles.emptyStateContainer,
      { backgroundColor: colors.background },
    ]}>
      {/* Agent Avatar */}
      <View style={[
        styles.emptyAvatar,
        { backgroundColor: colors.surfaceActive },
      ]}>
        <Text style={[
          styles.emptyAvatarText,
          { color: colors.textPrimary },
        ]}>
          {agentName.charAt(0)}
        </Text>
      </View>
      
      {/* Welcome Text */}
      <Text style={[
        styles.emptyTitle,
        { color: colors.textPrimary },
      ]}>
        Welcome to {agentName}
      </Text>
      
      <Text style={[
        styles.emptyDescription,
        { color: colors.textSecondary },
      ]}>
        {agentDescription}
      </Text>
      
      {/* Start Conversation Hint */}
      <View style={[
        styles.startHint,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}>
        <Text style={[
          styles.hintText,
          { color: colors.textTertiary },
        ]}>
          Type a message below to start the conversation
        </Text>
      </View>
    </View>
  );
};

// Complete Styles
const styles = StyleSheet.create({
  // Message Container
  messageContainer: {
    flexDirection: 'row',
    paddingVertical: VERCEL_SPACING.sm,
    paddingHorizontal: VERCEL_SPACING.lg,
    gap: VERCEL_SPACING.sm,
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  assistantMessage: {
    justifyContent: 'flex-start',
  },
  
  // Avatar
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: VERCEL_SPACING.xs,
  },
  avatar: {
    width: VERCEL_LAYOUT.components.avatarSize.sm,
    height: VERCEL_LAYOUT.components.avatarSize.sm,
    borderRadius: VERCEL_LAYOUT.components.avatarSize.sm / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.sm,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.medium,
  },
  
  // Message Content
  messageContent: {
    maxWidth: '75%',
    padding: VERCEL_SPACING.md,
    borderRadius: VERCEL_BORDER_RADIUS.md,
    gap: VERCEL_SPACING.xs,
  },
  messageAgentName: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.xs,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.medium,
    marginBottom: -VERCEL_SPACING.xs,
  },
  messageText: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.base,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.regular,
    lineHeight: VERCEL_TYPOGRAPHY.lineHeights.base,
  },
  timestamp: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.xs,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.regular,
    alignSelf: 'flex-end',
  },
  
  // Chat Input
  inputContainer: {
    padding: VERCEL_SPACING.lg,
    borderTopWidth: 1,
    gap: VERCEL_SPACING.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: VERCEL_BORDER_RADIUS.md,
    padding: VERCEL_SPACING.xs,
    gap: VERCEL_SPACING.sm,
  },
  attachButton: {
    padding: VERCEL_SPACING.sm,
  },
  attachIcon: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.lg,
  },
  textInput: {
    flex: 1,
    fontSize: VERCEL_TYPOGRAPHY.sizes.base,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.regular,
    paddingVertical: VERCEL_SPACING.sm,
    minHeight: VERCEL_LAYOUT.components.inputHeight - VERCEL_SPACING.xs * 2,
  },
  sendButton: {
    padding: VERCEL_SPACING.sm,
    paddingHorizontal: VERCEL_SPACING.md,
    borderRadius: VERCEL_BORDER_RADIUS.sm,
  },
  sendIcon: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.base,
    fontWeight: '600',
  },
  inputHint: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.xs,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.regular,
    textAlign: 'center',
  },
  
  // Typing Indicator
  typingContainer: {
    flexDirection: 'row',
    paddingVertical: VERCEL_SPACING.sm,
    paddingHorizontal: VERCEL_SPACING.lg,
    gap: VERCEL_SPACING.sm,
  },
  typingBubble: {
    padding: VERCEL_SPACING.md,
    borderRadius: VERCEL_BORDER_RADIUS.md,
    borderWidth: 1,
    gap: VERCEL_SPACING.sm,
  },
  typingText: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.sm,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.medium,
  },
  typingDots: {
    flexDirection: 'row',
    gap: VERCEL_SPACING.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  
  // Chat Header
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: VERCEL_SPACING.md,
    paddingHorizontal: VERCEL_SPACING.lg,
    borderBottomWidth: 1,
    gap: VERCEL_SPACING.md,
  },
  backButton: {
    padding: VERCEL_SPACING.sm,
  },
  backIcon: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.xl,
    fontWeight: '600',
  },
  agentInfo: {
    flex: 1,
    gap: VERCEL_SPACING.xs,
  },
  agentName: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.lg,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.bold,
  },
  agentDescription: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.sm,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.medium,
  },
  newChatButton: {
    padding: VERCEL_SPACING.sm,
  },
  newChatIcon: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.lg,
    fontWeight: '600',
  },
  
  // Empty State
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: VERCEL_SPACING.xl,
    gap: VERCEL_SPACING.lg,
  },
  emptyAvatar: {
    width: VERCEL_LAYOUT.components.avatarSize.xl,
    height: VERCEL_LAYOUT.components.avatarSize.xl,
    borderRadius: VERCEL_LAYOUT.components.avatarSize.xl / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: VERCEL_SPACING.lg,
  },
  emptyAvatarText: {
    fontSize: VERCEL_LAYOUT.components.avatarSize.xl / 2.5,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.medium,
  },
  emptyTitle: {
    fontSize: VERCEL_TYPOGRAPHY.sizes['2xl'],
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.bold,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.base,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.regular,
    textAlign: 'center',
    lineHeight: VERCEL_TYPOGRAPHY.lineHeights.base,
  },
  startHint: {
    padding: VERCEL_SPACING.md,
    borderRadius: VERCEL_BORDER_RADIUS.md,
    borderWidth: 1,
    marginTop: VERCEL_SPACING.md,
  },
  hintText: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.sm,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.medium,
    textAlign: 'center',
  },
});