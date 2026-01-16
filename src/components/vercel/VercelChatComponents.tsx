// Vercel-Style Chat Components
// Clean, Professional Chat Interface

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { cacheDirectory, downloadAsync, EncodingType, writeAsStringAsync } from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Animated, Clipboard, Dimensions, DimensionValue, Image, TextInput as RNTextInput, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { VERCEL_BORDER_RADIUS, VERCEL_LAYOUT, VERCEL_SPACING, VERCEL_TYPOGRAPHY } from '../../constants/vercel-theme';
import { useAppTheme } from '../../hooks';
import { Message } from '../../types';
import { MarkdownView } from '../MarkdownView';

// Vercel Message Bubble Component
interface VercelMessageBubbleProps {
  message: Message;
  isDarkMode: boolean;
  agentName?: string;
  isUser?: boolean;
  onRetry?: (message: Message) => void;
  onDelete?: (messageId: string) => void;
  sendStatus?: 'sending' | 'sent' | 'error';
  containerWidth?: DimensionValue;
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
  containerWidth = '92%',
  breakpoint = { isSm: false, isMd: false, isLg: false, isXl: false },
}: VercelMessageBubbleProps) => {
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
    if (isXl) return '85%';
    if (isLg) return '88%';
    if (isMd) return '90%';
    return '92%';
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

  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadImage = async () => {
    if (!message.imageUrl) return;

    try {
      setIsDownloading(true);

      // Request permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'I need permission to save images to your gallery.');
        setIsDownloading(false);
        return;
      }

      const imageUrl = message.imageUrl;
      let fileUri = '';

      if (imageUrl.startsWith('data:')) {
        // Handle Base64
        const base64Data = imageUrl.split('base64,')[1];
        const extension = imageUrl.split(';')[0].split('/')[1] || 'png';
        const filename = `june_image_${Date.now()}.${extension}`;
        fileUri = `${cacheDirectory}${filename}`;

        await writeAsStringAsync(fileUri, base64Data, {
          encoding: EncodingType.Base64,
        });
      } else {
        // Handle regular URL
        const extension = imageUrl.split('.').pop()?.split('?')[0] || 'jpg';
        const filename = `june_image_${Date.now()}.${extension}`;
        fileUri = `${cacheDirectory}${filename}`;

        await downloadAsync(imageUrl, fileUri);
      }

      // Save to library
      await MediaLibrary.saveToLibraryAsync(fileUri);

      Alert.alert('Success', 'Image saved to your gallery!');
    } catch (error) {
      console.error('Download error:', error);

      // Fallback to sharing if save fails
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        Alert.alert(
          'Save Failed',
          'Could not save to gallery directly. Would you like to share/save it manually?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Share',
              onPress: async () => {
                try {
                  const tempUri = `${cacheDirectory}shared_image.png`;
                  if (message.imageUrl?.startsWith('data:')) {
                    const base64Data = message.imageUrl.split('base64,')[1];
                    await writeAsStringAsync(tempUri, base64Data, {
                      encoding: EncodingType.Base64,
                    });
                  } else {
                    await downloadAsync(message.imageUrl!, tempUri);
                  }
                  await Sharing.shareAsync(tempUri);
                } catch (e) {
                  Alert.alert('Error', 'Could not share the image.');
                }
              }
            }
          ]
        );
      } else {
        Alert.alert('Error', 'Failed to save image.');
      }
    } finally {
      setIsDownloading(false);
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
            <MaterialCommunityIcons name="check" size={14} color={colors.accent} />
          </View>
        );
      case 'error':
        return (
          <View style={styles.statusIndicator}>
            <MaterialCommunityIcons name="alert-circle-outline" size={14} color={colors.error} />
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
            <MaterialCommunityIcons name="content-copy" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          {sendStatus === 'error' && onRetry && (
            <TouchableOpacity style={styles.actionButton} onPress={handleRetry}>
              <MaterialCommunityIcons name="refresh" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
            <MaterialCommunityIcons name="delete-outline" size={20} color={colors.error} />
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

        {/* Image content */}
        {message.imageUrl && (
          <View style={styles.messageImageContainer}>
            <Image
              source={{ uri: message.imageUrl.startsWith('data:') ? message.imageUrl : message.imageUrl }}
              style={styles.messageImage}
              resizeMode="cover"
            />

            {/* Download/Save Button Overlay */}
            {!isUser && (
              <TouchableOpacity
                style={[styles.downloadButton, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
                onPress={handleDownloadImage}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <MaterialCommunityIcons name="download" size={20} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Message Text */}
        {message.content ? (!isUser ? (
          <MarkdownView content={message.content} />
        ) : (
          <Text style={[
            styles.messageText,
            {
              color: isUser ? '#FFFFFF' : colors.textPrimary,
            },
          ]}>
            {message.content}
          </Text>
        )) : null}

        {/* Message Footer with Timestamp and Status */}
        <View style={styles.messageFooter}>
          {!isUser && (
            <TouchableOpacity
              onPress={handleCopy}
              style={{ marginRight: 'auto', paddingRight: 8 }}
            >
              <MaterialCommunityIcons name="content-copy" size={14} color={colors.textTertiary} />
            </TouchableOpacity>
          )}
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
}: VercelChatInputProps) => {
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
          <MaterialCommunityIcons name="paperclip" size={24} color={colors.textSecondary} />
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
          <MaterialCommunityIcons
            name={isLoading ? "sync" : "arrow-right"}
            size={24}
            color={value.trim() && !isLoading ? colors.textPrimary : colors.textTertiary}
          />
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
}: VercelTypingIndicatorProps) => {
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
}: VercelChatHeaderProps) => {
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
        <MaterialCommunityIcons name="arrow-left" size={24} color={colors.textPrimary} />
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
        <MaterialCommunityIcons name="plus" size={26} color={colors.textSecondary} />
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
}: VercelEmptyStateProps) => {
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
    paddingVertical: VERCEL_SPACING.xs,
    paddingHorizontal: VERCEL_SPACING.sm,
    gap: VERCEL_SPACING.xs,
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
    maxWidth: '100%',
    padding: VERCEL_SPACING.md - 4,
    borderRadius: VERCEL_BORDER_RADIUS.md,
    gap: VERCEL_SPACING.xs,
  },
  messageImageContainer: {
    width: '100%',
    aspectRatio: 1.5,
    borderRadius: VERCEL_BORDER_RADIUS.sm,
    overflow: 'hidden',
    marginVertical: VERCEL_SPACING.xs,
  },
  messageImage: {
    width: '100%',
    height: '100%',
  },
  downloadButton: {
    position: 'absolute',
    top: VERCEL_SPACING.xs,
    right: VERCEL_SPACING.xs,
    padding: VERCEL_SPACING.xs,
    borderRadius: VERCEL_BORDER_RADIUS.sm,
    backdropFilter: 'blur(10px)',
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
    padding: VERCEL_SPACING.md,
    borderTopWidth: 1,
    gap: VERCEL_SPACING.xs,
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
    paddingVertical: VERCEL_SPACING.xs,
    paddingHorizontal: VERCEL_SPACING.sm,
    gap: VERCEL_SPACING.xs,
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
    paddingVertical: VERCEL_SPACING.sm,
    paddingHorizontal: VERCEL_SPACING.md,
    borderBottomWidth: 1,
    gap: VERCEL_SPACING.sm,
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