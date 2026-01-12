import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { Icon, useTheme, ActivityIndicator, Text } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useDynamicFontSize } from '../hooks';

interface ChatInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onImagePick: () => void;
  isLoading?: boolean;
}

export function ChatInput({
  value,
  onChangeText,
  onSend,
  onImagePick,
  isLoading,
}: ChatInputProps) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);
  const fontSize = useDynamicFontSize(16);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      onImagePick();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <TouchableOpacity
        style={[styles.imageButton, { backgroundColor: theme.colors.surfaceVariant }]}
        onPress={handlePickImage}
        disabled={isLoading}
      >
        <Icon source="image-outline" size={24} color={theme.colors.onSurfaceVariant} />
      </TouchableOpacity>

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: theme.colors.surfaceVariant,
            borderColor: focused ? theme.colors.primary : 'transparent',
            borderWidth: focused ? 2 : 0,
          },
        ]}
      >
        <TextInput
          style={[styles.input, { color: theme.colors.onSurface, fontSize }]}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Ask anything..."
          placeholderTextColor={theme.colors.onSurfaceVariant}
          multiline
          maxLength={2000}
          editable={!isLoading}
        />
      </View>

      <TouchableOpacity
        style={[
          styles.sendButton,
          {
            backgroundColor: value.trim() || isLoading ? theme.colors.primary : theme.colors.surfaceVariant,
          },
        ]}
        onPress={onSend}
        disabled={!value.trim() || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color={theme.colors.onPrimary} />
        ) : (
          <Icon
            source="send"
            size={24}
            color={value.trim() ? theme.colors.onPrimary : theme.colors.onSurfaceVariant}
          />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    paddingBottom: 8,
  },
  imageButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  inputContainer: {
    flex: 1,
    borderRadius: 24,
    maxHeight: 120,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});
