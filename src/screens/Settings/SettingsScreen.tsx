import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  Text,
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
import { useFontSize } from '../../hooks';
import { FONT_SIZE_LABELS } from '../../constants/agents';

export function SettingsScreen() {
  const navigation = useNavigation<any>();
  const theme = useTheme();
  const { user, logout, isSignedIn } = useAuthStore();
  const { theme: themeSettings, setTheme } = useThemeStore();
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
            navigation.dispatch(
              (state: any) => {
                const routes = [{ name: 'Login' }];
                return {
                  ...state,
                  routes,
                  index: 0,
                };
              }
            );
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
      <Surface style={styles.header} elevation={0}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
          iconColor={theme.colors.onSurface}
        />
        <Text style={{ color: theme.colors.onSurface }} variant="headlineMedium">
          Settings
        </Text>
      </Surface>

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
              <Text style={{ color: theme.colors.onSurface }} variant="titleLarge">
                {user?.name || 'Guest User'}
              </Text>
              <Text style={{ color: theme.colors.onSurfaceVariant }} variant="bodyMedium">
                {user?.email || 'guest@example.com'}
              </Text>
            </View>
          </View>
        </Surface>

        <Text style={[styles.sectionTitle, { color: theme.colors.onSurfaceVariant }]} variant="labelLarge">
          Appearance
        </Text>

        <Surface style={[styles.settingCard, { backgroundColor: theme.colors.surfaceVariant }]}>
          <View style={styles.settingRow}>
            <Text style={{ color: theme.colors.onSurface }} variant="bodyLarge">
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
            <Text style={{ color: theme.colors.onSurface }} variant="bodyLarge">
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
              <Text style={{ color: theme.colors.onSurface }} variant="bodyMedium">
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

        <Text style={[styles.sectionTitle, { color: theme.colors.onSurfaceVariant }]} variant="labelLarge">
          Account
        </Text>

        <Surface style={[styles.settingCard, { backgroundColor: theme.colors.surfaceVariant }]}>
          <View style={styles.settingRow}>
            <Text style={{ color: theme.colors.onSurface }} variant="bodyLarge">
              Sync Data
            </Text>
            <Text style={{ color: theme.colors.onSurfaceVariant }} variant="bodyMedium">
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

        <Text style={[styles.version, { color: theme.colors.onSurfaceVariant }]} variant="bodySmall">
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
    textTransform: 'uppercase',
    letterSpacing: 1,
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
