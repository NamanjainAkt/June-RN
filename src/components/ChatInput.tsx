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
import { Icon, useTheme, ActivityIndicator } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useAppTheme } from '../hooks';
import { COLORS, BORDER_RADIUS, TYPOGRAPHY } from '../constants/theme';
import { Button } from './ui/Button';

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
  const { isDarkMode } = useAppTheme();
  const theme = useTheme();

  const colors = isDarkMode ? COLORS.dark : COLORS.light;

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
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
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
                  <Icon source="close" size={16} color={colors.onError} />
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
            size={24}
            color={colors.secondary}
          />
        </TouchableOpacity>

        <View style={[styles.textInputWrapper, { borderColor: colors.border }]}>
          <Icon
            source="message-outline"
            size={20}
            color={colors.secondaryVariant}
          />
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder="Ask anything..."
            placeholderTextColor={colors.secondaryVariant}
            style={[styles.textInput, { color: colors.onSurface }]}
            multiline
            maxLength={2000}
            editable={!isLoading}
            selectionColor={colors.accent}
          />
        </View>

        <Button
          variant={canSend ? 'solid' : 'outlined'}
          size="md"
          onPress={onSend}
          disabled={!canSend}
          style={styles.sendButton}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={canSend ? colors.onPrimary : colors.secondary} />
          ) : (
            <Icon source="send" size={20} color={canSend ? colors.onPrimary : colors.secondary} />
          )}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  imagePreviewContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  imageScroll: {
    gap: 8,
  },
  imageWrapper: {
    position: 'relative',
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.md,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    gap: 8,
  },
  attachButton: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  textInputWrapper: {
    flex: 1,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    backgroundColor: 'transparent',
    position: 'relative',
    minHeight: 44,
    maxHeight: 120,
  },
  inputIcon: {
    position: 'absolute',
    left: 12,
    top: 10,
    zIndex: 1,
  },
  textInput: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    paddingLeft: 44,
    paddingRight: 12,
    paddingVertical: 12,
    minHeight: 44,
    maxHeight: 120,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
});