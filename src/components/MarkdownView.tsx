import React from 'react';
import { StyleSheet, View } from 'react-native';
import Markdown from 'react-native-easy-markdown';
import { Icon, TouchableRipple, Text } from 'react-native-paper';
import * as Clipboard from 'expo-clipboard';
import { useDynamicFontSize, useAppTheme } from '../hooks';

interface MarkdownViewProps {
  content: string;
}

export function MarkdownView({ content }: MarkdownViewProps) {
  const { colors } = useAppTheme();
  const baseFontSize = useDynamicFontSize(16);

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
        <Icon source="content-copy" size={18} color={colors.textSecondary} />
      </TouchableRipple>
      <Markdown
        style={{
          body: {
            color: colors.textPrimary,
            fontSize: baseFontSize,
          },
          heading1: {
            color: colors.accent,
            fontSize: baseFontSize * 1.5,
            fontWeight: 'bold',
          },
          heading2: {
            color: colors.accent,
            fontSize: baseFontSize * 1.25,
            fontWeight: 'bold',
          },
          heading3: {
            color: colors.accent,
            fontSize: baseFontSize * 1.125,
            fontWeight: '600',
          },
          heading4: {
            color: colors.accent,
            fontSize: baseFontSize,
            fontWeight: '600',
          },
          bullet_list: {
            color: colors.textPrimary,
            fontSize: baseFontSize,
          },
          ordered_list: {
            color: colors.textPrimary,
            fontSize: baseFontSize,
          },
          blockquote: {
            backgroundColor: colors.surface,
            borderLeftColor: colors.accent,
            paddingLeft: 12,
          },
          code_inline: {
            backgroundColor: colors.surface,
            color: colors.accent,
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 4,
            fontSize: baseFontSize * 0.875,
          },
          code_block: {
            backgroundColor: colors.surface,
            padding: 12,
            borderRadius: 8,
            fontFamily: 'monospace',
            fontSize: baseFontSize * 0.875,
          },
          link: {
            color: colors.accent,
          },
          paragraph: {
            color: colors.textPrimary,
            fontSize: baseFontSize,
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
