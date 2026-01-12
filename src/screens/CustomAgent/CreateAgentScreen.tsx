import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  Text,
  useTheme,
  Surface,
  TextInput,
  Button,
  IconButton,
  HelperText,
  Chip,
} from 'react-native-paper';
import { useChatStore } from '../../store/useChatStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Agent, AgentCategory } from '../../types';
import { CATEGORIES } from '../../constants/agents';
import { db } from '../../services/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useDynamicFontSize } from '../../hooks';

const PROMPT_TEMPLATES = [
  {
    label: 'Writing Assistant',
    prompt: 'You are a professional writing assistant. Help users craft compelling content by focusing on clarity, structure, and engaging language. Provide specific suggestions for improvement and offer alternative phrasings when appropriate.',
  },
  {
    label: 'Coding Helper',
    prompt: 'You are an expert programmer. Write clean, efficient, and well-documented code. Explain complex concepts in simple terms. Always consider edge cases and error handling. Suggest best practices and optimization opportunities.',
  },
  {
    label: 'Creative Writer',
    prompt: 'You are a creative writing assistant. Help users develop compelling stories, characters, and narratives. Focus on emotional resonance, vivid descriptions, and engaging dialogue. Encourage creativity and offer imaginative suggestions.',
  },
  {
    label: 'Technical Explainer',
    prompt: 'You are a technical expert. Break down complex technical concepts into easy-to-understand explanations. Use analogies and real-world examples. Focus on clarity and accuracy while making technical information accessible.',
  },
];

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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const fontSize = useDynamicFontSize(16);
  const labelFontSize = useDynamicFontSize(14);
  const errorFontSize = useDynamicFontSize(12);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Agent name is required';
    } else if (name.trim().length < 3) {
      newErrors.name = 'Agent name must be at least 3 characters';
    } else if (name.trim().length > 50) {
      newErrors.name = 'Agent name must be less than 50 characters';
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    } else if (description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    } else if (description.trim().length > 200) {
      newErrors.description = 'Description must be less than 200 characters';
    }

    if (!systemPrompt.trim()) {
      newErrors.systemPrompt = 'System prompt is required';
    } else if (systemPrompt.trim().length < 20) {
      newErrors.systemPrompt = 'System prompt must be at least 20 characters';
    } else if (systemPrompt.trim().length > 2000) {
      newErrors.systemPrompt = 'System prompt must be less than 2000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validateForm()) {
      return;
    }

    if (!user?.id) {
      Alert.alert('Error', 'Please sign in to create custom agents');
      return;
    }

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

      if (db) {
        await setDoc(doc(db, 'users', user.id, 'customAgents', newAgent.id), newAgent);
      }

      Alert.alert('Success', 'Your custom agent has been created!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error('Error creating agent:', error);
      Alert.alert('Error', 'Failed to create agent. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const applyTemplate = (template: typeof PROMPT_TEMPLATES[0]) => {
    setSystemPrompt(template.prompt);
  };

  const isFormValid = name.trim() && description.trim() && systemPrompt.trim();
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior="padding"
      keyboardVerticalOffset={100}
    >
      <Surface style={styles.header} elevation={0}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
          iconColor={theme.colors.onSurface}
        />
        <Text style={{ color: theme.colors.onSurface, fontSize: fontSize }} variant="headlineMedium">
          Create Custom Agent
        </Text>
      </Surface>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ color: theme.colors.onSurfaceVariant, fontSize }} variant="bodyMedium">
          Create a personalized AI agent tailored to your specific needs
        </Text>

        <View style={styles.form}>
          <TextInput
            label="Agent Name"
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (errors.name) {
                setErrors({ ...errors, name: '' });
              }
            }}
            style={[styles.input, { fontSize }]}
            mode="outlined"
            placeholder="e.g., Legal Document Assistant"
            placeholderTextColor={theme.colors.onSurfaceVariant}
            error={!!errors.name}
          />
          {errors.name ? (
            <HelperText type="error" style={{ fontSize: errorFontSize }}>
              {errors.name}
            </HelperText>
          ) : null}

          <TextInput
            label="Description"
            value={description}
            onChangeText={(text) => {
              setDescription(text);
              if (errors.description) {
                setErrors({ ...errors, description: '' });
              }
            }}
            style={[styles.input, { fontSize }]}
            mode="outlined"
            placeholder="What does this agent do?"
            placeholderTextColor={theme.colors.onSurfaceVariant}
            multiline
            numberOfLines={2}
            error={!!errors.description}
          />
          {errors.description ? (
            <HelperText type="error" style={{ fontSize: errorFontSize }}>
              {errors.description}
            </HelperText>
          ) : null}

          <Text style={[styles.label, { color: theme.colors.onSurface, fontSize: labelFontSize }]} variant="bodyMedium">
            Category
          </Text>
          <View style={styles.categories}>
            {CATEGORIES.filter((c) => c.value !== 'custom').map((cat) => (
              <Chip
                key={cat.value}
                selected={category === cat.value}
                onPress={() => setCategory(cat.value)}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor:
                      category === cat.value
                        ? theme.colors.primaryContainer
                        : theme.colors.surfaceVariant,
                  },
                ]}
                textStyle={{
                  color:
                    category === cat.value
                      ? theme.colors.primary
                      : theme.colors.onSurfaceVariant,
                  fontSize: labelFontSize,
                }}
              >
                {cat.label}
              </Chip>
            ))}
          </View>

          <TextInput
            label="System Prompt"
            value={systemPrompt}
            onChangeText={(text) => {
              setSystemPrompt(text);
              if (errors.systemPrompt) {
                setErrors({ ...errors, systemPrompt: '' });
              }
            }}
            style={[styles.input, styles.promptInput, { fontSize }]}
            mode="outlined"
            placeholder="Define how this agent should behave..."
            placeholderTextColor={theme.colors.onSurfaceVariant}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            error={!!errors.systemPrompt}
          />
          {errors.systemPrompt ? (
            <HelperText type="error" style={{ fontSize: errorFontSize }}>
              {errors.systemPrompt}
            </HelperText>
          ) : null}

          <Text style={[styles.label, { color: theme.colors.onSurfaceVariant, fontSize: errorFontSize }]} variant="bodySmall">
            Prompt Templates
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.templatesRow}>
              {PROMPT_TEMPLATES.map((template, index) => (
                <Chip
                  key={index}
                  mode="outlined"
                  onPress={() => applyTemplate(template)}
                  style={styles.templateChip}
                  textStyle={{ fontSize: errorFontSize }}
                >
                  {template.label}
                </Chip>
              ))}
            </View>
          </ScrollView>

          <Text style={[styles.hint, { color: theme.colors.onSurfaceVariant, fontSize: errorFontSize }]} variant="bodySmall">
            Be specific about the agent's role, expertise, and communication style
          </Text>

          <Button
            mode="contained"
            onPress={handleCreate}
            disabled={!isFormValid || isLoading}
            loading={isLoading}
            style={styles.createButton}
            contentStyle={{ paddingVertical: 4 }}
          >
            Create Agent
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    marginBottom: 4,
  },
  label: {
    marginTop: 12,
    marginBottom: 8,
    fontWeight: '500',
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  categoryChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  promptInput: {
    minHeight: 150,
  },
  templatesRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  templateChip: {
    marginRight: 8,
  },
  hint: {
    marginTop: 4,
    marginBottom: 16,
  },
  createButton: {
    marginTop: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
});
