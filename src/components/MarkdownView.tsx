import React from 'react';
import { StyleSheet, View } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { Icon, TouchableRipple, useTheme, Text } from 'react-native-paper';
import * as Clipboard from 'expo-clipboard';

interface MarkdownViewProps {
  content: string;
}

export function MarkdownView({ content }: MarkdownViewProps) {
  const theme = useTheme();

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(content);
  };

  return (
    <View style={styles.container}>
      <TouchableRipple
        style={styles.copyButton}
        onPress={copyToClipboard}
        borderless
      >
        <Icon source="content-copy" size={18} color={theme.colors.onSurfaceVariant} />
      </TouchableRipple>
      <Markdown
        style={{
          body: {
            color: theme.colors.onSurface,
            fontSize: 16,
          },
          heading1: {
            color: theme.colors.primary,
            fontSize: 24,
            fontWeight: 'bold',
          },
          heading2: {
            color: theme.colors.primary,
            fontSize: 20,
            fontWeight: 'bold',
          },
          heading3: {
            color: theme.colors.primary,
            fontSize: 18,
            fontWeight: '600',
          },
          bullet_list: {
            color: theme.colors.onSurface,
          },
          ordered_list: {
            color: theme.colors.onSurface,
          },
          blockquote: {
            backgroundColor: theme.colors.surfaceVariant,
            borderLeftColor: theme.colors.primary,
            paddingLeft: 12,
          },
          code_inline: {
            backgroundColor: theme.colors.surfaceVariant,
            color: theme.colors.primary,
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 4,
          },
          code_block: {
            backgroundColor: theme.colors.surfaceVariant,
            padding: 12,
            borderRadius: 8,
            fontFamily: 'monospace',
          },
          link: {
            color: theme.colors.primary,
          },
        }}
      >
        {content}
      </Markdown>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    padding: 12,
  },
  copyButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    padding: 8,
    zIndex: 1,
  },
});
