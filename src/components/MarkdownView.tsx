import * as Clipboard from 'expo-clipboard';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Markdown from 'react-native-easy-markdown';
import { useAppTheme, useDynamicFontSize } from '../hooks';

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
      <Markdown
        markdownStyles={{
          h1: {
            color: colors.textPrimary,
            fontSize: baseFontSize * 1.5,
            fontWeight: 'bold',
          },
          h2: {
            color: colors.textPrimary,
            fontSize: baseFontSize * 1.25,
            fontWeight: 'bold',
          },
          h3: {
            color: colors.textPrimary,
            fontSize: baseFontSize * 1.125,
            fontWeight: '600',
          },
          h4: {
            color: colors.textPrimary,
            fontSize: baseFontSize,
            fontWeight: '600',
          },
          text: {
            color: colors.textPrimary,
            fontSize: baseFontSize,
          },
          blockQuote: {
            backgroundColor: colors.surface,
            borderLeftColor: colors.accent,
            borderLeftWidth: 4,
            paddingLeft: 12,
          },
          link: {
            color: colors.accent,
            textDecorationLine: 'underline',
          },
          listItem: {
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
  },
});
