import { useAuth } from '@clerk/clerk-expo';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  Divider,
  Switch
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VercelAvatar, VercelButton, VercelCard } from '../../components/vercel/VercelComponents';
import { VERCEL_BORDER_RADIUS, VERCEL_LAYOUT, VERCEL_SPACING, VERCEL_TYPOGRAPHY } from '../../constants/vercel-theme';
import { useAppTheme, useFontSize } from '../../hooks';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';

interface SettingItemProps {
  icon: string;
  label: string;
  value?: string;
  onPress?: () => void;
  showSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (val: boolean) => void;
  color?: string;
  isDarkMode: boolean;
}

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  label,
  value,
  onPress,
  showSwitch,
  switchValue,
  onSwitchChange,
  color,
  isDarkMode
}) => {
  const { colors } = useAppTheme();

  return (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={onPress}
      disabled={showSwitch || !onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingLabelContainer}>
        <View style={[styles.settingIconContainer, { backgroundColor: color ? `${color}20` : colors.surfaceActive }]}>
          <MaterialCommunityIcons name={icon as any} size={20} color={color || colors.textPrimary} />
        </View>
        <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>{label}</Text>
      </View>

      <View style={styles.settingValueContainer}>
        {value && <Text style={[styles.settingValue, { color: colors.textSecondary }]}>{value}</Text>}
        {showSwitch && (
          <Switch
            value={switchValue}
            onValueChange={onSwitchChange}
            color={colors.accent}
          />
        )}
        {!showSwitch && onPress && (
          <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textTertiary} />
        )}
      </View>
    </TouchableOpacity>
  );
};

export function SettingsScreen() {
  const navigation = useNavigation<any>();
  const { signOut } = useAuth();
  const { user, logout } = useAuthStore();
  const { colors, typography, isDarkMode } = useAppTheme();
  const { fontSize, increaseFontSize, decreaseFontSize } = useFontSize();

  // Mock states for additional settings
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  // Responsive configuration using all breakpoints
  const screenWidth = Dimensions.get('window').width;
  const isSm = screenWidth < VERCEL_LAYOUT.breakpoints.md; // < 414
  const isMd = screenWidth >= VERCEL_LAYOUT.breakpoints.md && screenWidth < VERCEL_LAYOUT.breakpoints.lg; // 414-767
  const isLg = screenWidth >= VERCEL_LAYOUT.breakpoints.lg && screenWidth < VERCEL_LAYOUT.breakpoints.xl; // 768-1023
  const isXl = screenWidth >= VERCEL_LAYOUT.breakpoints.xl; // >= 1024

  // Dynamic spacing based on breakpoint
  const getContentPadding = () => {
    if (isSm) return VERCEL_SPACING.lg;
    if (isMd) return VERCEL_SPACING.xl;
    if (isLg) return VERCEL_SPACING['2xl'];
    return VERCEL_SPACING['3xl'];
  };

  // Dynamic avatar size
  const getAvatarSize = (): 'sm' | 'md' | 'lg' | 'xl' => {
    if (isXl) return 'xl';
    if (isLg) return 'lg';
    return 'lg';
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
              await signOut();
              logout();
            } catch (error) {
              console.error('Logout error:', error);
              logout();
            }
          },
        },
      ]
    );
  };

  const toggleTheme = () => {
    setTheme({
      mode: isDarkMode ? 'light' : 'dark',
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { padding: getContentPadding(), paddingBottom: getContentPadding() * 1.5 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <VercelCard isDarkMode={isDarkMode} style={styles.profileCard} variant='elevated'>
          <View style={styles.profileInfo}>
            <VercelAvatar
              name={user?.name || 'Guest'}
              size={getAvatarSize()}
              isDarkMode={isDarkMode}
            />
            <View style={styles.profileText}>
              <Text style={[styles.profileName, { color: colors.textPrimary }]}>
                {user?.name || 'Guest User'}
              </Text>
              <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>
                {user?.email || 'guest@example.com'}
              </Text>
              <View style={[styles.planBadge, { backgroundColor: colors.accent + '20' }]}>
                <Text style={[styles.planText, { color: colors.accent }]}>Free Plan</Text>
              </View>
            </View>
          </View>
        </VercelCard>

        {/* Appearance Section */}
        <Text style={[styles.sectionHeader, { color: colors.textTertiary }]}>Appearance</Text>
        <VercelCard isDarkMode={isDarkMode} style={styles.settingCard}>
          <SettingItem
            icon="brightness-4"
            label="Dark Mode"
            showSwitch
            switchValue={isDarkMode}
            onSwitchChange={toggleTheme}
            isDarkMode={isDarkMode}
            color="#9333ea"
          />
          <Divider style={{ backgroundColor: colors.border }} />
          <SettingItem
            icon="format-size"
            label="Font Size"
            value={fontSize.toString()}
            onPress={() => {
              Alert.alert(
                'Font Size',
                'Adjust the text size for better readability.',
                [
                  { text: 'Smaller', onPress: decreaseFontSize },
                  { text: 'Reset', onPress: () => { } },
                  { text: 'Larger', onPress: increaseFontSize },
                ]
              );
            }}
            isDarkMode={isDarkMode}
            color="#3b82f6"
          />
        </VercelCard>

        {/* AI Preferences Section */}
        <Text style={[styles.sectionHeader, { color: colors.textTertiary }]}>AI Preferences</Text>
        <VercelCard isDarkMode={isDarkMode} style={styles.settingCard}>
          <SettingItem
            icon="history"
            label="Auto-save History"
            showSwitch
            switchValue={autoSave}
            onSwitchChange={setAutoSave}
            isDarkMode={isDarkMode}
            color="#f59e0b"
          />

        </VercelCard>

        {/* General Section */}
        <Text style={[styles.sectionHeader, { color: colors.textTertiary }]}>General</Text>
        <VercelCard isDarkMode={isDarkMode} style={styles.settingCard}>
          <SettingItem
            icon="vibrate"
            label="Haptic Feedback"
            showSwitch
            switchValue={hapticsEnabled}
            onSwitchChange={setHapticsEnabled}
            isDarkMode={isDarkMode}
            color="#ec4899"
          />
          <Divider style={{ backgroundColor: colors.border }} />
          <SettingItem
            icon="database-outline"
            label="Clear Cache"
            onPress={() => Alert.alert('Clear Cache', 'Cache cleared successfully!')}
            isDarkMode={isDarkMode}
            color="#ef4444"
          />
        </VercelCard>


        {/* Logout */}
        <View style={styles.logoutContainer}>
          <VercelButton
            variant="danger"
            size="lg"
            onPress={handleLogout}
            text="Log Out"
            isDarkMode={isDarkMode}
            fullWidth
          />
        </View>

        {/* Footer Credit */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textTertiary }]}>
            Made with <MaterialCommunityIcons name="heart" size={14} color="#ef4444" /> by June Team
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    // Padding is now dynamic via inline styles
  },
  profileCard: {
    padding: VERCEL_SPACING.xl,
    borderRadius: VERCEL_BORDER_RADIUS.xl,
    marginBottom: VERCEL_SPACING['2xl'],
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileText: {
    marginLeft: VERCEL_SPACING.lg,
    flex: 1,
  },
  profileName: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.xl,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.bold,
  },
  profileEmail: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.sm,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.regular,
    marginTop: 2,
  },
  planBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 8,
  },
  planText: {
    fontSize: 10,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.bold,
    textTransform: 'uppercase',
  },
  sectionHeader: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.xs,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.bold,
    // Color is now dynamic via inline styles
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: VERCEL_SPACING.md,
    marginTop: VERCEL_SPACING.sm,
    marginLeft: 4,
  },
  settingCard: {
    borderRadius: VERCEL_BORDER_RADIUS.xl,
    marginBottom: VERCEL_SPACING['2xl'],
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: VERCEL_SPACING.lg,
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: VERCEL_SPACING.md,
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingLabel: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.base,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.medium,
  },
  settingValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: VERCEL_SPACING.xs,
  },
  settingValue: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.sm,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.regular,
  },
  logoutContainer: {
    marginTop: VERCEL_SPACING.md,
    marginBottom: VERCEL_SPACING.lg,
  },
  footer: {
    marginTop: VERCEL_SPACING['2xl'],
    alignItems: 'center',
    paddingBottom: VERCEL_SPACING.lg,
  },
  footerText: {
    fontSize: VERCEL_TYPOGRAPHY.sizes.xs,
    fontFamily: VERCEL_TYPOGRAPHY.fontFamily.medium,
  },
});
