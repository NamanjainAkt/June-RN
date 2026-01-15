import React from 'react';
import { StyleSheet, View } from 'react-native';
import Markdown from 'react-native-easy-markdown';
import { Icon, TouchableRipple } from 'react-native-paper';
import * as Clipboard from 'expo-clipboard';
import { useDynamicFontSize, useAppTheme } from '../hooks';
import { VERCEL_SPACING } from '../constants/vercel-theme';

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
    padding: VERCEL_SPACING.md,
  },
  copyButton: {
    position: 'absolute',
    top: VERCEL_SPACING.xs,
    right: VERCEL_SPACING.xs,
    padding: VERCEL_SPACING.sm,
    zIndex: 1,
  },
});
