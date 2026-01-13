import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';
import { Icon, ActivityIndicator } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useAppTheme } from '../hooks';
import { VERCEL_SPACING, VERCEL_BORDER_RADIUS, VERCEL_TYPOGRAPHY, VERCEL_LAYOUT } from '../constants/vercel-theme';
import { VercelButton } from './vercel/VercelComponents';

interface ChatInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onImagesSelected: (images: Array<{ uri: string; base64: string }>) => void;
  selectedImages: Array<{ uri: string; base64: string }>;
  isLoading?: boolean;
}

export function ChatInput({
  value,
  onChangeText,
  onSend,
  onImagesSelected,
  selectedImages,
  isLoading,
}: ChatInputProps) {
  const { colors, typography, borderRadius, spacing, layout, isDarkMode } = useAppTheme();

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission needed',
        'Please allow photo access in your device settings to send images.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => {
            // Note: You might want to use Linking.openSettings() here
          }}
        ]
      );
      return false;
    }
    return true;
  };

  const handlePickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        base64: true,
        selectionLimit: 5, // Limit to 5 images
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newImages = result.assets
          .filter(asset => asset.base64)
          .map(asset => ({
            uri: asset.uri,
            base64: asset.base64!,
          }));

        if (newImages.length > 0) {
          onImagesSelected([...selectedImages, ...newImages]);
        }
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to select images. Please try again.');
    }
  };

  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    onImagesSelected(newImages);
  };

  const canSend = (value.trim().length > 0 || selectedImages.length > 0) && !isLoading;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
      {/* Image Preview */}
      {selectedImages.length > 0 && (
        <View style={styles.imagePreviewContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.imageScroll}
          >
            {selectedImages.map((image, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image
                  source={{ uri: image.uri }}
                  style={styles.imagePreview}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  style={[styles.removeButton, { backgroundColor: colors.error }]}
                  onPress={() => removeImage(index)}
                >
                  <Icon source="close" size={16} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={[styles.attachButton, { borderColor: colors.border }]}
          onPress={handlePickImage}
          disabled={isLoading}
        >
          <Icon
            source="image-outline"
            size={layout.components.iconSize.md}
            color={colors.textSecondary}
          />
        </TouchableOpacity>

        <View style={[styles.textInputWrapper, { borderColor: colors.border }]}>
          <Icon
            source="message-outline"
            size={layout.components.iconSize.sm}
            color={colors.textTertiary}
          />
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder="Ask anything..."
            placeholderTextColor={colors.textTertiary}
            style={[styles.textInput, { color: colors.textPrimary }]}
            multiline
            maxLength={2000}
            editable={!isLoading}
            selectionColor={colors.accent}
          />
        </View>

        <VercelButton
          isDarkMode={isDarkMode}
          variant={canSend ? 'primary' : 'secondary'}
          size="md"
          onPress={onSend}
          disabled={!canSend}
          style={styles.sendButton}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.textPrimary} />
          ) : (
            <Icon source="send" size={layout.components.iconSize.sm} color={colors.textPrimary} />
          )}
        </VercelButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
  },
  imagePreviewContainer: {
    padding: VERCEL_SPACING.md,
    paddingBottom: VERCEL_SPACING.sm,
  },
  imageScroll: {
    gap: VERCEL_SPACING.sm,
  },
  imageWrapper: {
    position: 'relative',
  },
  imagePreview: {
    width: VERCEL_LAYOUT.components.avatarSize.lg * 2,
    height: VERCEL_LAYOUT.components.avatarSize.lg * 2,
    borderRadius: VERCEL_BORDER_RADIUS.md,
  },
  removeButton: {
    position: 'absolute',
    top: -VERCEL_SPACING.xs,
    right: -VERCEL_SPACING.xs,
    width: VERCEL_SPACING.lg,
    height: VERCEL_SPACING.lg,
    borderRadius: VERCEL_SPACING.lg / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: VERCEL_SPACING.md,
    gap: VERCEL_SPACING.sm,
  },
  attachButton: {
    width: VERCEL_LAYOUT.components.buttonHeight.md,
    height: VERCEL_LAYOUT.components.buttonHeight.md,
    borderRadius: VERCEL_BORDER_RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  textInputWrapper: {
    flex: 1,
    borderRadius: VERCEL_BORDER_RADIUS.md,
    borderWidth: 1,
    backgroundColor: 'transparent',
    position: 'relative',
    minHeight: VERCEL_LAYOUT.components.buttonHeight.md,
    maxHeight: VERCEL_LAYOUT.components.buttonHeight.lg * 3,
  },
  inputIcon: {
    position: 'absolute',
    left: VERCEL_SPACING.md,
    top: VERCEL_SPACING.sm,
    zIndex: 1,
  },
  textInput: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.base,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.regular,
    paddingLeft: VERCEL_LAYOUT.components.buttonHeight.md,
    paddingRight: VERCEL_SPACING.md,
    paddingVertical: VERCEL_SPACING.md,
    minHeight: VERCEL_LAYOUT.components.buttonHeight.md,
    maxHeight: VERCEL_LAYOUT.components.buttonHeight.lg * 3,
  },
  sendButton: {
    width: VERCEL_LAYOUT.components.buttonHeight.md,
    height: VERCEL_LAYOUT.components.buttonHeight.md,
    borderRadius: VERCEL_BORDER_RADIUS.md,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
});