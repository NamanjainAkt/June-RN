import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Text, useTheme, ActivityIndicator } from 'react-native-paper';

interface LoginScreenProps {
  onLogin: () => void;
  isLoading: boolean;
}

export function LoginScreen({ onLogin, isLoading }: LoginScreenProps) {
  const theme = useTheme();

  const handleGoogleLogin = async () => {
    onLogin();
  };

  const handleDemoLogin = () => {
    onLogin();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.primary }]} variant="displayMedium">
          June AI
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]} variant="bodyLarge">
          Your Multi-Agent AI Assistant
        </Text>

        <View style={styles.spacer} />

        <Button
          mode="contained"
          onPress={handleGoogleLogin}
          loading={isLoading}
          disabled={isLoading}
          style={styles.button}
          contentStyle={styles.buttonContent}
          icon="google"
        >
          {isLoading ? 'Signing in...' : 'Continue with Google'}
        </Button>

        <View style={styles.divider}>
          <Text style={{ color: theme.colors.onSurfaceVariant }} variant="bodyMedium">
            or
          </Text>
        </View>

        <Button
          mode="outlined"
          onPress={handleDemoLogin}
          disabled={isLoading}
          style={styles.button}
          contentStyle={styles.buttonContent}
          icon="account"
        >
          Try Demo Mode
        </Button>

        <Text style={[styles.disclaimer, { color: theme.colors.onSurfaceVariant }]} variant="bodySmall">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
  },
  spacer: {
    height: 24,
  },
  button: {
    width: '100%',
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 24,
  },
  disclaimer: {
    marginTop: 32,
    textAlign: 'center',
  },
});
