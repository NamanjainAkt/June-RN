// Vercel-Style Chat Components
// Clean, Professional Chat Interface

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions, TextInput as RNTextInput, Animated, Clipboard } from 'react-native';
import { MarkdownView } from '../MarkdownView';
import { VERCEL_TYPOGRAPHY, VERCEL_BORDER_RADIUS, VERCEL_SPACING, VERCEL_LAYOUT } from '../../constants/vercel-theme';
import { Message } from '../../types';
import { useAppTheme } from '../../hooks';

// Vercel Message Bubble Component
interface VercelMessageBubbleProps {
  message: Message;
  isDarkMode: boolean;
  agentName?: string;
  isUser?: boolean;
  onRetry?: (message: Message) => void;
  onDelete?: (messageId: string) => void;
  sendStatus?: 'sending' | 'sent' | 'error';
  containerWidth?: `${number}%`;
  breakpoint?: {
    isSm: boolean;
    isMd: boolean;
    isLg: boolean;
    isXl: boolean;
  };
}

export const VercelMessageBubble: React.FC<VercelMessageBubbleProps> = ({
  message,
  isDarkMode,
  agentName,
  isUser = false,
  onRetry,
  onDelete,
  sendStatus,
  containerWidth = '75%',
  breakpoint = { isSm: false, isMd: false, isLg: false, isXl: false },
}) => {
  const { colors } = useAppTheme();
  const { width } = Dimensions.get('window');
  const { isSm, isMd, isLg, isXl } = breakpoint;
  
  // Dynamic avatar sizing across breakpoints
  const getAvatarSize = () => {
    if (isXl) return VERCEL_LAYOUT.components.avatarSize.xl;
    if (isLg) return VERCEL_LAYOUT.components.avatarSize.lg;
    if (isMd) return VERCEL_LAYOUT.components.avatarSize.md;
    return VERCEL_LAYOUT.components.avatarSize.sm;
  };
  
  const avatarSize = getAvatarSize();
  
  // Responsive message bubble width
  const getMessageWidth = (): `${number}%` => {
    if (isXl) return '90%';
    if (isLg) return '85%';
    if (isMd) return '80%';
    return '75%';
  };
  
  const messageWidth = containerWidth || getMessageWidth();
  
  // Responsive font sizing
  const getAvatarFontSize = () => {
    if (isXl) return VERCEL_TYPOGRAPHY.sizes.lg;
    if (isLg) return VERCEL_TYPOGRAPHY.sizes.base;
    if (isMd) return VERCEL_TYPOGRAPHY.sizes.sm;
    return VERCEL_TYPOGRAPHY.sizes.xs;
  };
  
  const [showActions, setShowActions] = useState(false);
  const actionButtonsOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(actionButtonsOpacity, {
      toValue: showActions ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [showActions]);

  const handleCopy = () => {
    Clipboard.setString(message.content);
    setShowActions(false);
  };

  const handleRetry = () => {
    if (onRetry) {
      onRetry(message);
      setShowActions(false);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(message.id);
      setShowActions(false);
    }
  };

  const toggleActions = () => {
    setShowActions(!showActions);
  };

  const renderStatusIndicator = () => {
    switch (sendStatus) {
      case 'sending':
        return (
          <View style={styles.statusIndicator}>
            <View style={[styles.sendingDot, { backgroundColor: colors.textTertiary }]} />
            <View style={[styles.sendingDot, { backgroundColor: colors.textTertiary }]} />
            <View style={[styles.sendingDot, { backgroundColor: colors.textTertiary }]} />
          </View>
        );
      case 'sent':
        return (
          <View style={styles.statusIndicator}>
            <Text style={[styles.statusIcon, { color: colors.accent }]}>✓</Text>
          </View>
        );
      case 'error':
        return (
          <View style={styles.statusIndicator}>
            <Text style={[styles.statusIcon, { color: colors.error }]}>⚠</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.messageContainer,
        isUser ? styles.userMessage : styles.assistantMessage,
      ]}
      onLongPress={toggleActions}
      activeOpacity={0.8}
    >
      {/* Action Buttons */}
      {isUser && (
        <Animated.View style={[
          styles.actionButtonsContainer,
          { 
            opacity: actionButtonsOpacity,
            backgroundColor: colors.surface,
            shadowColor: colors.textPrimary,
          },
        ]}>
          <TouchableOpacity style={styles.actionButton} onPress={handleCopy}>
            <Text style={[styles.actionIcon, { color: colors.textSecondary }]}>📋</Text>
          </TouchableOpacity>
          {sendStatus === 'error' && onRetry && (
            <TouchableOpacity style={styles.actionButton} onPress={handleRetry}>
              <Text style={[styles.actionIcon, { color: colors.textSecondary }]}>🔄</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
            <Text style={[styles.actionIcon, { color: colors.error }]}>🗑</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
      
      {/* Avatar */}
      {!isUser && (
        <View style={styles.avatarContainer}>
          <View style={[
            styles.avatar,
            { 
              backgroundColor: colors.surfaceActive,
              width: avatarSize,
              height: avatarSize,
              borderRadius: avatarSize / 2,
            },
          ]}>
            <Text style={[
              styles.avatarText,
              { 
                color: colors.textPrimary,
                fontSize: getAvatarFontSize(),
              },
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
          maxWidth: messageWidth,
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
        {!isUser ? (
          <MarkdownView content={message.content} />
        ) : (
          <Text style={[
            styles.messageText,
            {
              color: colors.textPrimary,
            },
          ]}>
            {message.content}
          </Text>
        )}
        
        {/* Message Footer with Timestamp and Status */}
        <View style={styles.messageFooter}>
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
          {renderStatusIndicator()}
        </View>
      </View>
      
      {/* User Avatar (right-aligned) */}
      {isUser && (
        <View style={styles.avatarContainer}>
          <View style={[
            styles.avatar,
            { 
              backgroundColor: colors.surfaceActive,
              width: avatarSize,
              height: avatarSize,
              borderRadius: avatarSize / 2,
            },
          ]}>
            <Text style={[
              styles.avatarText,
              { 
                color: colors.textPrimary,
                fontSize: getAvatarFontSize(),
              },
            ]}>
              Y
            </Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
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
  const { colors } = useAppTheme();
  const textInputRef = React.useRef<RNTextInput>(null);
  const [inputHeight, setInputHeight] = React.useState(VERCEL_LAYOUT.components.inputHeight - VERCEL_SPACING.xs * 2);
  
  const handleContentSizeChange = (event: any) => {
    const { height } = event.nativeEvent.contentSize;
    const minHeight = VERCEL_LAYOUT.components.inputHeight - VERCEL_SPACING.xs * 2;
    const maxHeight = VERCEL_LAYOUT.components.inputHeight * 3; // Max 3 lines
    const newHeight = Math.max(minHeight, Math.min(height, maxHeight));
    setInputHeight(newHeight);
  };
  
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
        <RNTextInput
          ref={textInputRef}
          style={[
            styles.textInput,
            {
              color: colors.textPrimary,
              height: inputHeight,
            },
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          multiline={true}
          onContentSizeChange={handleContentSizeChange}
          textAlignVertical="top"
        />
        
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
  breakpoint?: {
    isSm: boolean;
    isMd: boolean;
    isLg: boolean;
    isXl: boolean;
  };
}

export const VercelTypingIndicator: React.FC<VercelTypingIndicatorProps> = ({
  isDarkMode,
  agentName,
  breakpoint = { isSm: false, isMd: false, isLg: false, isXl: false },
}) => {
  const { colors } = useAppTheme();
  const { isSm, isMd, isLg, isXl } = breakpoint;
  
  // Dynamic avatar sizing across breakpoints
  const getAvatarSize = () => {
    if (isXl) return VERCEL_LAYOUT.components.avatarSize.xl;
    if (isLg) return VERCEL_LAYOUT.components.avatarSize.lg;
    if (isMd) return VERCEL_LAYOUT.components.avatarSize.md;
    return VERCEL_LAYOUT.components.avatarSize.sm;
  };
  
  const avatarSize = getAvatarSize();
  
  // Responsive font sizing
  const getAvatarFontSize = () => {
    if (isXl) return VERCEL_TYPOGRAPHY.sizes.lg;
    if (isLg) return VERCEL_TYPOGRAPHY.sizes.base;
    if (isMd) return VERCEL_TYPOGRAPHY.sizes.sm;
    return VERCEL_TYPOGRAPHY.sizes.xs;
  };
  
  return (
    <View style={styles.typingContainer}>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
          <View style={[
            styles.avatar,
            { backgroundColor: colors.surfaceActive, width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 },
          ]}>
          <Text style={[
            styles.avatarText,
            { 
              color: colors.textPrimary,
              fontSize: getAvatarFontSize(),
            },
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
  const { colors } = useAppTheme();
  
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
  const { colors } = useAppTheme();
  
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

// Helper function to create theme-aware styles
const createThemeAwareStyles = (isDarkMode: boolean, colors: any) => {
  const shadowColor = isDarkMode ? '#000000' : '#000000';
  
  return {
    actionButtonsContainer: {
      position: 'absolute',
      right: VERCEL_SPACING.xs,
      top: -VERCEL_SPACING.md,
      flexDirection: 'row',
      borderRadius: VERCEL_BORDER_RADIUS.md,
      padding: VERCEL_SPACING.xs,
      gap: VERCEL_SPACING.xs,
      shadowColor: shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      zIndex: 1,
    },
  };
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
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
    minHeight: 24, // Minimum height for single line
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
  
  // Message Status Indicators
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: VERCEL_SPACING.xs,
    marginTop: VERCEL_SPACING.xs,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  sendingDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  statusIcon: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.xs,
  },
  
  // Message Action Buttons - Note: shadowColor set dynamically based on theme
  actionButtonsContainer: {
    position: 'absolute',
    right: VERCEL_SPACING.xs,
    top: -VERCEL_SPACING.md,
    flexDirection: 'row',
    borderRadius: VERCEL_BORDER_RADIUS.md,
    padding: VERCEL_SPACING.xs,
    gap: VERCEL_SPACING.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1,
  },
  actionButton: {
    padding: VERCEL_SPACING.xs,
    borderRadius: VERCEL_BORDER_RADIUS.sm,
  },
  actionIcon: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.sm,
  },
});