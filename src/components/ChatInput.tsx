import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ActivityIndicator, Icon } from 'react-native-paper';
import { MOBILE_RADIUS } from '../constants/mobile-design-tokens';
import { VERCEL_SPACING, VERCEL_TYPOGRAPHY } from '../constants/vercel-theme';
import { useAppTheme } from '../hooks';
import { VercelButton } from './vercel/VercelComponents';

import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';

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

  // Animation for the input border
  const rotation = useSharedValue(0);
  const isFocusedValue = useSharedValue(0);

  React.useEffect(() => {
    rotation.value = withRepeat(withTiming(360, { duration: 4000 }), -1, false);
  }, []);

  const animatedBorderStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
      opacity: isFocusedValue.value,
    };
  });

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission needed',
        'Please allow photo access in your device settings to send images.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Open Settings', onPress: () => {
              // Note: You might want to use Linking.openSettings() here
            }
          }
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
    <View style={[styles.container, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
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
                  <Icon source="close" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={[styles.attachButton, { backgroundColor: colors.surface }]}
          onPress={handlePickImage}
          disabled={isLoading}
        >
          <Icon
            source="plus"
            size={24}
            color={colors.textSecondary}
          />
        </TouchableOpacity>

        <View style={styles.mainInputWrapper}>
          <View style={styles.borderAnimationWrapper}>
            <Animated.View style={[styles.animatedBorder, animatedBorderStyle]}>
              <LinearGradient
                colors={[colors.accent, '#FF0080', colors.accent]}
                style={styles.fullSize}
              />
            </Animated.View>
          </View>

          <View style={[styles.textInputWrapper, { backgroundColor: colors.surface }]}>
            <TextInput
              value={value}
              onChangeText={onChangeText}
              placeholder="Message your agent..."
              placeholderTextColor={colors.textTertiary}
              style={[styles.textInput, { color: colors.textPrimary }]}
              multiline
              maxLength={2000}
              editable={!isLoading}
              selectionColor={colors.accent}
              onFocus={() => {
                isFocusedValue.value = withTiming(1, { duration: 300 });
              }}
              onBlur={() => {
                isFocusedValue.value = withTiming(0, { duration: 300 });
              }}
            />

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
                <Icon source="arrow-up" size={20} color={canSend ? '#FFFFFF' : colors.textTertiary} />
              )}
            </VercelButton>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 0,
    paddingBottom: 10,
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
    width: 60,
    height: 60,
    borderRadius: MOBILE_RADIUS.md,
  },
  removeButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: VERCEL_SPACING.md,
    gap: VERCEL_SPACING.sm,
  },
  attachButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainInputWrapper: {
    flex: 1,
    minHeight: 44,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
  },
  borderAnimationWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedBorder: {
    width: '200%',
    height: '200%',
  },
  fullSize: {
    flex: 1,
  },
  textInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    margin: 2, // Border thickness
    paddingLeft: VERCEL_SPACING.md,
    paddingRight: 6,
    overflow: 'hidden',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.regular,
    paddingVertical: 10,
    minHeight: 40,
    maxHeight: 120,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    paddingHorizontal: 0,
    paddingVertical: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});