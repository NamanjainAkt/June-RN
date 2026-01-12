import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useAppTheme } from '../../hooks';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants/theme';
import { Button } from '../../components';

interface LoginScreenProps {
  onGoogleLogin: () => void;
  onDemoLogin: () => void;
  isLoading: boolean;
}

export function LoginScreen({ onGoogleLogin, onDemoLogin, isLoading }: LoginScreenProps) {
  const { isDarkMode } = useAppTheme();
  const colors = isDarkMode ? COLORS.dark : COLORS.light;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* Logo/Brand */}
        <View style={styles.logoContainer}>
          <Text style={[styles.logo, { color: colors.primary }]}>
            J
          </Text>
        </View>

        <Text style={[styles.title, { color: colors.primary }]}>
          June AI
        </Text>

        <Text style={[styles.subtitle, { color: colors.secondary }]}>
          Your Multi-Agent AI Assistant
        </Text>

        {/* Auth Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            variant="solid"
            size="lg"
            onPress={onGoogleLogin}
            style={styles.googleButton}
            textStyle={{ fontSize: TYPOGRAPHY.sizes.base }}
            fullWidth
          >
            {isLoading ? 'Signing in...' : 'Continue with Google'}
          </Button>

          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.secondaryVariant }]}>
              or
            </Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          </View>

          <Button
            variant="outlined"
            size="lg"
            onPress={onDemoLogin}
            style={styles.demoButton}
            textStyle={{ fontSize: TYPOGRAPHY.sizes.base }}
            fullWidth
          >
            Try Demo Mode
          </Button>
        </View>

        {/* Footer */}
        <Text style={[styles.disclaimer, { color: colors.secondaryVariant }]}>
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
    paddingHorizontal: SPACING.lg,
  },
  content: {
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: SPACING.lg,
  },
  logo: {
    fontSize: 72,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    textAlign: 'center',
  },
  title: {
    fontSize: TYPOGRAPHY.sizes['3xl'],
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    textAlign: 'center',
    marginBottom: SPACING['3xl'],
  },
  buttonContainer: {
    width: '100%',
    gap: SPACING.md,
    marginBottom: SPACING['3xl'],
  },
  googleButton: {
    backgroundColor: COLORS.light.primary,
  },
  demoButton: {
    borderColor: COLORS.light.border,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: SPACING.md,
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },
  disclaimer: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    textAlign: 'center',
    lineHeight: 16,
  },
});
