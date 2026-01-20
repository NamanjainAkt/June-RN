import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Markdown from 'react-native-markdown-display';
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
        style={{
          heading1: {
            color: colors.textPrimary,
            fontSize: baseFontSize * 1.5,
            fontWeight: 'bold',
          },
          heading2: {
            color: colors.textPrimary,
            fontSize: baseFontSize * 1.25,
            fontWeight: 'bold',
          },
          heading3: {
            color: colors.textPrimary,
            fontSize: baseFontSize * 1.125,
            fontWeight: '600',
          },
          heading4: {
            color: colors.textPrimary,
            fontSize: baseFontSize,
            fontWeight: '600',
          },
          body: {
            color: colors.textPrimary,
            fontSize: baseFontSize,
          },
          blockquote: {
            backgroundColor: colors.surface,
            borderLeftColor: colors.accent,
            borderLeftWidth: 4,
            paddingLeft: 12,
          },
          link: {
            color: colors.accent,
            textDecorationLine: 'underline',
          },
          list_item: {
            color: colors.textPrimary,
            fontSize: baseFontSize,
          },
          code_inline: {
            backgroundColor: colors.surfaceActive,
            color: colors.accent,
            paddingHorizontal: 4,
            borderRadius: 4,
            fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
          },
          code_block: {
            backgroundColor: colors.surfaceActive,
            color: colors.textPrimary,
            padding: 12,
            borderRadius: 8,
            fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
            fontSize: baseFontSize * 0.9,
            marginVertical: 8,
          },
          fence: {
            backgroundColor: colors.surfaceActive,
            color: colors.textPrimary,
            padding: 12,
            borderRadius: 8,
            fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
            fontSize: baseFontSize * 0.9,
            marginVertical: 8,
          },
        }}
        rules={{
          fence: (node, children, parent, styles) => {
            const content = node.content;
            const language = (node as any).info || 'code';

            const handleCopy = async () => {
              await Clipboard.setStringAsync(content);
            };

            return (
              <View key={node.key} style={[styles.fence, { padding: 0, overflow: 'hidden' }]}>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  backgroundColor: colors.border,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.surface,
                }}>
                  <Text style={{
                    color: colors.textSecondary,
                    fontSize: 12,
                    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
                    textTransform: 'lowercase'
                  }}>
                    {language}
                  </Text>
                  <TouchableOpacity onPress={handleCopy} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MaterialCommunityIcons name="content-copy" size={14} color={colors.accent} />
                    <Text style={{ color: colors.accent, fontSize: 12, marginLeft: 4 }}>Copy</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ padding: 12 }}>
                  <Text style={{
                    color: colors.textPrimary,
                    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
                    fontSize: baseFontSize * 0.9,
                  }}>
                    {content}
                  </Text>
                </View>
              </View>
            );
          }
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
