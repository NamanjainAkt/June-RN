export const APP_CONFIG = {
  NAME: 'June AI',
  VERSION: '1.0.0',
  MODEL: 'Llama 3.3 70B',
  API_TIMEOUT: 30000,
  MAX_MESSAGE_LENGTH: 2000,
  MAX_AGENTS_DISPLAY: 50,
} as const;

export const STORAGE_KEYS = {
  THEME: 'theme-storage',
  AUTH: 'auth-storage',
  CHAT: 'chat-storage',
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Please check your internet connection.',
  RATE_LIMIT: 'Rate limit exceeded. Please wait a moment and try again.',
  AUTH_ERROR: 'Authentication failed. Please try again.',
  API_ERROR: 'An error occurred. Please try again.',
  EMPTY_RESPONSE: 'No response generated. Please try again.',
  SAFETY_BLOCK: 'This request was blocked due to safety guidelines.',
} as const;
