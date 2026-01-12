import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  Text,
  useTheme,
  Surface,
  TextInput,
  Button,
  IconButton,
} from 'react-native-paper';
import { useChatStore } from '../../store/useChatStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Agent, AgentCategory } from '../../types';
import { CATEGORIES } from '../../constants/agents';
import { db } from '../../services/firebase';
import { doc, setDoc } from 'firebase/firestore';

export function CreateAgentScreen() {
  const navigation = useNavigation<any>();
  const theme = useTheme();
  const { user } = useAuthStore();
  const { addCustomAgent } = useChatStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<AgentCategory>('custom');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim() || !description.trim() || !systemPrompt.trim()) return;

    setIsLoading(true);

    try {
      const newAgent: Agent = {
        id: `custom-${Date.now()}`,
        name: name.trim(),
        description: description.trim(),
        category,
        icon: 'star',
        systemPrompt: systemPrompt.trim(),
        isCustom: true,
        createdAt: Date.now(),
      };

      addCustomAgent(newAgent);

      if (user?.id) {
        await setDoc(doc(db, 'users', user.id, 'customAgents', newAgent.id), newAgent);
      }

      navigation.goBack();
    } catch (error) {
      console.error('Error creating agent:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = name.trim() && description.trim() && systemPrompt.trim();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Surface style={styles.header} elevation={0}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
          iconColor={theme.colors.onSurface}
        />
        <Text style={{ color: theme.colors.onSurface }} variant="headlineMedium">
          Create Custom Agent
        </Text>
      </Surface>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={{ color: theme.colors.onSurfaceVariant }} variant="bodyMedium">
          Create a personalized AI agent tailored to your specific needs
        </Text>

        <View style={styles.form}>
          <TextInput
            label="Agent Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
            mode="outlined"
            placeholder="e.g., Legal Document Assistant"
            placeholderTextColor={theme.colors.onSurfaceVariant}
          />

          <TextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            style={styles.input}
            mode="outlined"
            placeholder="What does this agent do?"
            placeholderTextColor={theme.colors.onSurfaceVariant}
            multiline
            numberOfLines={2}
          />

          <Text style={[styles.label, { color: theme.colors.onSurface }]} variant="bodyMedium">
            Category
          </Text>
          <View style={styles.categories}>
            {CATEGORIES.filter((c) => c.value !== 'custom').map((cat) => (
              <Surface
                key={cat.value}
                style={[
                  styles.categoryOption,
                  { backgroundColor: theme.colors.surfaceVariant },
                  category === cat.value && { backgroundColor: theme.colors.primaryContainer },
                ]}
                onTouchEnd={() => setCategory(cat.value)}
              >
                <Text
                  style={[
                    { color: theme.colors.onSurface },
                    category === cat.value && { color: theme.colors.primary },
                  ]}
                  variant="bodyMedium"
                >
                  {cat.label}
                </Text>
              </Surface>
            ))}
          </View>

          <TextInput
            label="System Prompt"
            value={systemPrompt}
            onChangeText={setSystemPrompt}
            style={[styles.input, styles.promptInput]}
            mode="outlined"
            placeholder="Define how this agent should behave..."
            placeholderTextColor={theme.colors.onSurfaceVariant}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />

          <Text style={[styles.hint, { color: theme.colors.onSurfaceVariant }]} variant="bodySmall">
            Be specific about the agent's role, expertise, and communication style
          </Text>

          <Button
            mode="contained"
            onPress={handleCreate}
            disabled={!isFormValid || isLoading}
            loading={isLoading}
            style={styles.createButton}
          >
            Create Agent
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 48,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 8,
  },
  form: {
    marginTop: 16,
  },
  input: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontWeight: '500',
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  categoryOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  promptInput: {
    minHeight: 150,
  },
  hint: {
    marginBottom: 16,
  },
  createButton: {
    marginTop: 8,
    paddingVertical: 8,
  },
});
