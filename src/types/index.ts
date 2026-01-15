export interface Agent {
  id: string;
  name: string;
  description: string;
  category: AgentCategory;
  icon: string;
  systemPrompt: string;
  isCustom?: boolean;
  createdAt?: number;
  gradientColors?: string[];
}

export type AgentCategory =
  | 'writing'
  | 'coding'
  | 'image'
  | 'caption'
  | 'general'
  | 'custom';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  imageUrl?: string;
}

export interface ChatSession {
  id: string;
  agentId: string;
  agentName: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  imageUrl?: string;
}

export interface ThemeSettings {
  mode: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
}

export interface Settings {
  theme: ThemeSettings;
  user?: User;
}
