import React from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  useTheme,
  Surface,
  Switch,
  IconButton,
  Avatar,
  Divider,
  Button,
} from 'react-native-paper';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';
import { useAppTheme, useFontSize } from '../../hooks';
import { FONT_SIZE_LABELS } from '../../constants/agents';

export function SettingsScreen() {
  const navigation = useNavigation<any>();
  const theme = useTheme();
  const { user, logout, isSignedIn } = useAuthStore();
  const { theme: themeSettings, setTheme } = useThemeStore();
  const { typography } = useAppTheme();
  const { fontSize, increaseFontSize, decreaseFontSize } = useFontSize();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
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
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Surface style={[styles.profileCard, { backgroundColor: theme.colors.surfaceVariant }]}>
          <View style={styles.profileInfo}>
            {user?.imageUrl ? (
              <Avatar.Image source={{ uri: user.imageUrl }} size={64} />
            ) : (
              <Avatar.Text
                size={64}
                label={user?.name?.charAt(0) || 'G'}
                style={{ backgroundColor: theme.colors.primaryContainer }}
                labelStyle={{ color: theme.colors.primary }}
              />
            )}
            <View style={styles.profileText}>
              <Text style={{ fontSize: typography.sizes.lg, fontFamily: typography.fontFamily.semibold, color: theme.colors.onSurface }}>
                {user?.name || 'Guest User'}
              </Text>
              <Text style={{ fontSize: typography.sizes.base, fontFamily: typography.fontFamily.regular, color: theme.colors.onSurfaceVariant }}>
                {user?.email || 'guest@example.com'}
              </Text>
            </View>
          </View>
        </Surface>

        <Text style={{ fontSize: typography.sizes.sm, fontFamily: typography.fontFamily.medium, color: theme.colors.onSurfaceVariant }}>
          Appearance
        </Text>

        <Surface style={[styles.settingCard, { backgroundColor: theme.colors.surfaceVariant }]}>
          <View style={styles.settingRow}>
            <Text style={{ fontSize: typography.sizes.base, fontFamily: typography.fontFamily.regular, color: theme.colors.onSurface }}>
              Dark Mode
            </Text>
            <Switch
              value={themeSettings.mode === 'dark'}
              onValueChange={toggleTheme}
              color={theme.colors.primary}
            />
          </View>

          <Divider style={styles.divider} />

          <View style={styles.settingRow}>
            <Text style={{ fontSize: typography.sizes.base, fontFamily: typography.fontFamily.regular, color: theme.colors.onSurface }}>
              Font Size
            </Text>
            <View style={styles.fontSizeControls}>
              <IconButton
                icon="minus"
                size={20}
                onPress={decreaseFontSize}
                disabled={fontSize === 'small'}
                iconColor={theme.colors.onSurface}
              />
              <Text style={{ fontSize: typography.sizes.base, fontFamily: typography.fontFamily.regular, color: theme.colors.onSurface }}>
                {FONT_SIZE_LABELS[fontSize]}
              </Text>
              <IconButton
                icon="plus"
                size={20}
                onPress={increaseFontSize}
                disabled={fontSize === 'xlarge'}
                iconColor={theme.colors.onSurface}
              />
            </View>
          </View>
        </Surface>

        <Text style={{ fontSize: typography.sizes.sm, fontFamily: typography.fontFamily.medium, color: theme.colors.onSurfaceVariant }}>
          Account
        </Text>

        <Surface style={[styles.settingCard, { backgroundColor: theme.colors.surfaceVariant }]}>
          <View style={styles.settingRow}>
            <Text style={{ fontSize: typography.sizes.base, fontFamily: typography.fontFamily.regular, color: theme.colors.onSurface }}>
              Sync Data
            </Text>
            <Text style={{ fontSize: typography.sizes.base, fontFamily: typography.fontFamily.regular, color: theme.colors.onSurfaceVariant }}>
              Enabled
            </Text>
          </View>
        </Surface>

        <View style={styles.logoutContainer}>
          <Button
            mode="outlined"
            onPress={handleLogout}
            icon="logout"
            style={styles.logoutButton}
            textColor={theme.colors.error}
          >
            Log Out
          </Button>
        </View>

        <Text style={{ fontSize: typography.sizes.sm, fontFamily: typography.fontFamily.regular, color: theme.colors.onSurfaceVariant }}>
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
    paddingTop: 48,
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
