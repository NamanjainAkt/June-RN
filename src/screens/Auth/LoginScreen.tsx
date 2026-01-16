import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { Button } from '../../components';
import { VERCEL_SPACING } from '../../constants/vercel-theme';
import { useAppTheme } from '../../hooks';

interface LoginScreenProps {
  onGoogleLogin: () => void;
  isLoading: boolean;
}

export function LoginScreen({ onGoogleLogin, isLoading }: LoginScreenProps) {
  const { colors, typography, spacing, isDarkMode } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* Logo/Brand */}
        <View style={styles.logoContainer}>
          <Text style={[styles.logo, { color: colors.accent, fontFamily: typography.fontFamily.bold }]}>
            J
          </Text>
        </View>

        <Text style={[styles.title, {
          color: colors.textPrimary,
          fontFamily: typography.fontFamily.bold,
          fontSize: typography.sizes['3xl'],
        }]}>
          June AI
        </Text>

        <Text style={[styles.subtitle, {
          color: colors.textSecondary,
          fontFamily: typography.fontFamily.regular,
          fontSize: typography.sizes.base,
        }]}>
          Your Multi-Agent AI Assistant
        </Text>

        {/* Auth Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            variant="solid"
            size="lg"
            onPress={onGoogleLogin}
            style={styles.googleButton}
            fullWidth
            isDarkMode={isDarkMode}
          >
            {isLoading ? 'Signing in...' : 'Continue with Google'}
          </Button>
        </View>

        {/* Footer */}
        <Text style={[styles.disclaimer, {
          color: colors.textTertiary,
          fontFamily: typography.fontFamily.regular,
          fontSize: typography.sizes.xs,
        }]}>
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
    paddingHorizontal: VERCEL_SPACING.lg,
  },
  content: {
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: VERCEL_SPACING.lg,
  },
  logo: {
    fontSize: 72,
    textAlign: 'center',
  },
  title: {
    marginBottom: VERCEL_SPACING.xs,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: VERCEL_SPACING['3xl'],
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: VERCEL_SPACING.md,
    marginBottom: VERCEL_SPACING['3xl'],
  },
  googleButton: {
    // Using default theme colors
  },
  demoButton: {
    // Using default theme colors
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: VERCEL_SPACING.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: VERCEL_SPACING.md,
  },
  disclaimer: {
    textAlign: 'center',
    lineHeight: 16,
  },
});
