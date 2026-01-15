import { useAuth } from '@clerk/clerk-expo';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Alert, Dimensions, StyleSheet, Text, View } from 'react-native';
import {
  Switch
} from 'react-native-paper';
import { VercelAvatar, VercelButton, VercelCard } from '../../components/vercel/VercelComponents';
import { MOBILE_SPACING } from '../../constants/mobile-design-tokens';
import { VERCEL_LAYOUT, VERCEL_SPACING, VERCEL_TYPOGRAPHY } from '../../constants/vercel-theme';
import { useAppTheme, useFontSize } from '../../hooks';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';

export function SettingsScreen() {
  const navigation = useNavigation<any>();
  const { signOut } = useAuth();
  const { user, logout } = useAuthStore();
  const { theme: themeSettings, setTheme } = useThemeStore();
  const { colors, typography } = useAppTheme();
  const { fontSize, increaseFontSize, decreaseFontSize } = useFontSize();

  // Responsive configuration using all breakpoints
  const screenWidth = Dimensions.get('window').width;
  const isSm = screenWidth < VERCEL_LAYOUT.breakpoints.md;
  const isMd = screenWidth >= VERCEL_LAYOUT.breakpoints.md && screenWidth < VERCEL_LAYOUT.breakpoints.lg;
  const isLg = screenWidth >= VERCEL_LAYOUT.breakpoints.lg && screenWidth < VERCEL_LAYOUT.breakpoints.xl;
  const isXl = screenWidth >= VERCEL_LAYOUT.breakpoints.xl;

  // Dynamic avatar size
  const getAvatarSize = () => {
    if (isXl) return 80;
    if (isLg) return 72;
    if (isMd) return 68;
    return 64;
  };

  // Responsive padding
  const getContentPadding = () => {
    if (isSm) return VERCEL_SPACING.md;
    if (isMd) return VERCEL_SPACING.lg;
    if (isLg) return VERCEL_SPACING.xl;
    return VERCEL_SPACING['2xl'];
  };

  // Dynamic font sizes
  const getTitleSize = () => {
    if (isXl) return VERCEL_TYPOGRAPHY.sizes.xl;
    if (isLg) return VERCEL_TYPOGRAPHY.sizes.lg;
    return VERCEL_TYPOGRAPHY.sizes.base;
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear Clerk session first
              await signOut();
              // Clear Zustand store
              logout();
              // Navigation will automatically update based on auth state change
            } catch (error) {
              console.error('Logout error:', error);
              // Fallback: still try to clear store on error
              logout();
            }
          },
        },
      ]
    );
  };

  const toggleTheme = () => {
    setTheme({
      mode: themeSettings.mode === 'dark' ? 'light' : 'dark',
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.content, { padding: getContentPadding() }]}>
        <VercelCard isDarkMode={themeSettings.mode === 'dark'} style={styles.profileCard} variant='elevated'>
          <View style={styles.profileInfo}>
            <VercelAvatar
              name={user?.name || 'Guest'}
              imageUrl={user?.imageUrl}
              size="lg"
              isDarkMode={themeSettings.mode === 'dark'}
            />
            <View style={styles.profileText}>
              <Text style={{ fontSize: getTitleSize(), fontFamily: typography.fontFamily.bold, color: colors.textPrimary }}>
                {user?.name || 'Guest User'}
              </Text>
              <Text style={{ fontSize: isSm ? typography.sizes.sm : typography.sizes.base, fontFamily: typography.fontFamily.regular, color: colors.textSecondary }}>
                {user?.email || 'guest@example.com'}
              </Text>
            </View>
          </View>
        </VercelCard>

        <Text style={{ fontSize: typography.sizes.sm, fontFamily: typography.fontFamily.medium, color: colors.textSecondary }}>
          Appearance
        </Text>

        <VercelCard isDarkMode={themeSettings.mode === 'dark'} style={styles.settingCard}>
          <View style={styles.settingRow}>
            <Text style={{ fontSize: typography.sizes.base, fontFamily: typography.fontFamily.regular, color: colors.textPrimary }}>
              Dark Mode
            </Text>
            <Switch
              value={themeSettings.mode === 'dark'}
              onValueChange={toggleTheme}
              color={colors.accent}
            />
          </View>
        </VercelCard>

        <Text style={{ fontSize: typography.sizes.sm, fontFamily: typography.fontFamily.medium, color: colors.textSecondary, marginTop: MOBILE_SPACING.md }}>
          Account
        </Text>



        <View style={styles.logoutContainer}>
          <VercelButton
            variant="danger"
            size="lg"
            onPress={handleLogout}
            text="Log Out"
            isDarkMode={themeSettings.mode === 'dark'}
            fullWidth
          />
        </View>

        <Text style={{ fontSize: typography.sizes.sm, fontFamily: typography.fontFamily.regular, color: colors.textSecondary }}>
          June AI v1.0.0
        </Text>
      </View>
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
    paddingTop: '6%',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileText: {
    marginLeft: 16,
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 8,
  },
  settingCard: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  divider: {
    marginHorizontal: 16,
  },
  fontSizeControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutContainer: {
    marginTop: 24,
  },
  logoutButton: {
    borderColor: 'transparent',
  },
  version: {
    textAlign: 'center',
    marginTop: 24,
  },
});
