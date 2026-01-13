import React, { useEffect, useCallback, useState } from 'react';
import { StatusBar } from 'react-native';
import { Provider as PaperProvider, configureFonts } from 'react-native-paper';
import { NavigationIndependentTree } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';

import { useAppTheme } from './src/hooks';
import { VERCEL_COLORS, VERCEL_TYPOGRAPHY, VERCEL_BORDER_RADIUS, VERCEL_LAYOUT, VERCEL_SHADOWS } from './src/constants/vercel-theme';
import { LoginScreen } from './src/screens/Auth/LoginScreen';
import { HomeScreen } from './src/screens/Home/HomeScreen';
import { ExploreScreen } from './src/screens/Explore/ExploreScreen';
import { HistoryScreen } from './src/screens/History/HistoryScreen';
import { SettingsScreen } from './src/screens/Settings/SettingsScreen';
import { ChatScreen } from './src/screens/Chat/ChatScreen';
import { CreateAgentScreen } from './src/screens/CustomAgent/CreateAgentScreen';
import { useAuthStore } from './src/store/useAuthStore';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TAB_ICON: Record<string, any> = {
  Home: 'home',
  Explore: 'compass',
  History: 'history',
  Settings: 'cog',
};

function MainTabs() {
  const { colors, shadows } = useAppTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const iconName = TAB_ICON[route.name] || 'help-circle';
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textTertiary,
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: colors.border,
          backgroundColor: colors.surface,
          elevation: shadows.medium.elevation,
          shadowColor: shadows.medium.shadowColor,
          shadowOffset: shadows.medium.shadowOffset,
          shadowOpacity: shadows.medium.shadowOpacity,
          shadowRadius: shadows.medium.shadowRadius,
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Home', headerShown: false }}
      />
      <Tab.Screen 
        name="Explore" 
        component={ExploreScreen}
        options={{ title: 'Explore', headerShown: false }}
      />
      <Tab.Screen 
        name="History" 
        component={HistoryScreen}
        options={{ title: 'History', headerShown: false }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ title: 'Settings', headerShown: false }}
      />
    </Tab.Navigator>
  );
}

function RootNavigation() {
  const { isSignedIn, setSignedIn, setUser, setLoading } = useAuthStore();
  const { isLoaded, isSignedIn: clerkSignedIn, userId } = useAuth();
  const { isDarkMode, colors } = useAppTheme();

  useEffect(() => {
    if (isLoaded) {
      if (clerkSignedIn && userId) {
        setSignedIn(true);
        setUser({
          id: userId,
          email: 'user@example.com',
          name: 'User',
        });
        setLoading(false);
      } else {
        const storedState = useAuthStore.getState();
        if (storedState.isSignedIn && storedState.user) {
          setSignedIn(true);
          setUser(storedState.user);
        } else {
          setLoading(false);
        }
      }
    }
  }, [isLoaded, clerkSignedIn, userId]);

  const handleGoogleLogin = useCallback(async () => {
    setLoading(true);
  }, [setLoading]);

  const handleDemoLogin = useCallback(() => {
    setLoading(true);
    setSignedIn(true);
    setUser({
      id: 'demo-user',
      email: 'demo@june.ai',
      name: 'Demo User',
    });
    setLoading(false);
  }, [setSignedIn, setUser, setLoading]);

  const effectiveIsSignedIn = clerkSignedIn || isSignedIn;

  if (!isLoaded) {
    return null;
  }

  return (
    <NavigationIndependentTree>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          gestureEnabled: true,
        }}
      >
        {effectiveIsSignedIn ? (
          <>
            <Stack.Screen 
              name="Main" 
              component={MainTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Chat" 
              component={ChatScreen}
              options={{ 
                headerShown: true,
                headerTitleAlign: 'center',
                headerStyle: {
                  backgroundColor: colors.background,
                },
                headerTintColor: colors.textPrimary,
              }}
            />
            <Stack.Screen 
              name="CustomAgent" 
              component={CreateAgentScreen}
              options={{ 
                headerShown: true,
                headerTitleAlign: 'center',
                headerTitle: 'Create Custom Agent',
                headerStyle: {
                  backgroundColor: colors.background,
                },
                headerTintColor: colors.textPrimary,
              }}
            />
          </>
        ) : (
          <Stack.Screen
            name="Login"
            options={{ 
              headerShown: false,
              animation: 'fade_from_bottom',
            }}
          >
            {() => (
              <LoginScreen 
                onGoogleLogin={handleGoogleLogin}
                onDemoLogin={handleDemoLogin}
                isLoading={useAuthStore.getState().isLoading} 
              />
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationIndependentTree>
  );
}

// Create custom font configuration for react-native-paper v5+
// Map typography hierarchy to proper React Native font weights:
// - regular → fontWeight: '400'
// - medium → fontWeight: '500'
// - light → fontWeight: '300'
// - thin → fontWeight: '200'

type FontWeight = '400' | '500' | '600' | '700' | '800' | '900';

interface CustomFontConfig {
  fontFamily: string;
  fontWeight: FontWeight;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
}

const createFontConfig = (weight: FontWeight, size: number, lineHeight: number, letterSpacing: number = 0): CustomFontConfig => ({
  fontFamily: weight === '500' ? VERCEL_TYPOGRAPHY.fontFamily.medium :
             weight === '600' ? VERCEL_TYPOGRAPHY.fontFamily.semibold :
             weight === '700' ? VERCEL_TYPOGRAPHY.fontFamily.bold :
             VERCEL_TYPOGRAPHY.fontFamily.regular,
  fontWeight: weight,
  fontSize: size,
  lineHeight: lineHeight,
  letterSpacing: letterSpacing,
});

const fonts = configureFonts({
  isV3: true,
  config: {
    // Display variants
    displayLarge: { ...createFontConfig('700', 57, 64, -0.25) },
    displayMedium: { ...createFontConfig('700', 45, 52, 0) },
    displaySmall: { ...createFontConfig('700', 36, 44, 0) },
    
    // Headline variants
    headlineLarge: { ...createFontConfig('600', 32, 40, 0) },
    headlineMedium: { ...createFontConfig('600', 28, 36, 0) },
    headlineSmall: { ...createFontConfig('600', 24, 32, 0) },
    
    // Title variants
    titleLarge: { ...createFontConfig('500', 22, 28, 0) },
    titleMedium: { ...createFontConfig('500', 16, 24, 0.15) },
    titleSmall: { ...createFontConfig('500', 14, 20, 0.1) },
    
    // Body variants
    bodyLarge: { ...createFontConfig('400', 16, 24, 0.5) },
    bodyMedium: { ...createFontConfig('400', 14, 20, 0.25) },
    bodySmall: { ...createFontConfig('400', 12, 16, 0.4) },
    
    // Label variants
    labelLarge: { ...createFontConfig('500', 14, 20, 0.1) },
    labelMedium: { ...createFontConfig('500', 12, 16, 0.5) },
    labelSmall: { ...createFontConfig('500', 11, 16, 0.5) },
  },
});

export default function App() {
  const { isDarkMode } = useAppTheme();
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const paperTheme = {
    colors: {
      ...(isDarkMode ? VERCEL_COLORS.dark : VERCEL_COLORS.light),
      // Map React Native Paper color names to Vercel equivalents
      primary: (isDarkMode ? VERCEL_COLORS.dark : VERCEL_COLORS.light).accent,
      onSurface: (isDarkMode ? VERCEL_COLORS.dark : VERCEL_COLORS.light).textPrimary,
      onSurfaceVariant: (isDarkMode ? VERCEL_COLORS.dark : VERCEL_COLORS.light).textSecondary,
      surfaceVariant: (isDarkMode ? VERCEL_COLORS.dark : VERCEL_COLORS.light).surface,
      primaryContainer: (isDarkMode ? VERCEL_COLORS.dark : VERCEL_COLORS.light).surfaceActive,
      error: (isDarkMode ? VERCEL_COLORS.dark : VERCEL_COLORS.light).error,
    },
    fonts,
    roundness: VERCEL_BORDER_RADIUS.sm,
  };

  if (!fontsLoaded) {
    return null; // Show nothing while fonts load
  }

  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || ''}
      tokenCache={{
        getToken: async () => {
          try {
            const token = await SecureStore.getItemAsync('clerkToken');
            return token || null;
          } catch {
            return null;
          }
        },
        saveToken: async (token: string) => {
          try {
            await SecureStore.setItemAsync('clerkToken', token);
          } catch (error) {
            console.error('Error saving token:', error);
          }
        },
        clearToken: async () => {
          try {
            await SecureStore.deleteItemAsync('clerkToken');
          } catch (error) {
            console.error('Error clearing token:', error);
          }
        },
      }}
    >
      <PaperProvider theme={paperTheme}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={isDarkMode ? VERCEL_COLORS.dark.background : VERCEL_COLORS.light.background}
        />
        <RootNavigation />
      </PaperProvider>
    </ClerkProvider>
  );
}
