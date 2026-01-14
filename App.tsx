import React, { useEffect, useCallback, useState } from 'react';
import { View, Text } from 'react-native';
import { Provider as PaperProvider, configureFonts } from 'react-native-paper';
import { NavigationIndependentTree, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { ClerkProvider, useAuth, useOAuth, useClerk } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import { StatusBar } from 'expo-status-bar';
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
import { useChatStore } from './src/store/useChatStore';
import { LoadingScreen } from './src/components/LoadingScreen';
import * as Linking from 'expo-linking';

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
  const { setSignedIn, setUser, setLoading } = useAuthStore();
  const { isLoaded, isSignedIn: clerkSignedIn, userId } = useAuth();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  const { signOut: clerkSignOut } = useClerk();
  const { colors } = useAppTheme();
  const loadSessions = useChatStore((state) => state.loadSessions);

  // Debug: Log auth state
  console.log('Auth State:', { isLoaded, clerkSignedIn, userId });

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
        loadSessions(userId);
      } else {
        setLoading(false);
      }
    }
  }, [isLoaded, clerkSignedIn, userId, setSignedIn, setUser, setLoading, loadSessions]);

  const handleGoogleLogin = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔐 Starting Google OAuth flow...');

      const { createdSessionId, setActive, signUp } = await startOAuthFlow({
        redirectUrl: 'june://oauth-callback',
      });

      console.log('📱 OAuth result:', { createdSessionId, hasSetActive: !!setActive });

      if (createdSessionId && setActive) {
        console.log('✅ Setting active session:', createdSessionId);
        await setActive({ session: createdSessionId });

        // Wait a moment for Clerk to update auth state
        await new Promise(resolve => setTimeout(resolve, 500));

        // Update app state
        setSignedIn(true);
        setLoading(false);

        // Use the latest user ID from Clerk after session is set
        const { userId: newUserId } = useAuth();
        if (newUserId) {
          console.log('👤 User logged in:', newUserId);
          setUser({
            id: newUserId,
            email: 'user@example.com',
            name: 'User',
          });
          loadSessions(newUserId);
        }
      } else if (signUp) {
        console.log('📝 Sign-up flow - user needs to complete signup');
        // Handle sign-up flow if needed
        setLoading(false);
      } else {
        console.warn('⚠️ No session created, user might have cancelled');
        setLoading(false);
      }
    } catch (error) {
      console.error('❌ Google login error:', error);
      console.error('Error details:', JSON.stringify(error));
      setLoading(false);
    }
  }, [startOAuthFlow, setLoading, setSignedIn, setUser, userId, loadSessions, useAuth]);

  const handleDemoLogin = useCallback(() => {
    setLoading(true);
    setSignedIn(true);
    setUser({
      id: 'demo-user',
      email: 'demo@june.ai',
      name: 'Demo User',
    });
    loadSessions('demo-user');
    setLoading(false);
  }, [setSignedIn, setUser, setLoading, loadSessions]);

  // Debug: Force logout for development
  const handleForceLogout = useCallback(async () => {
    try {
      console.log('Force logout triggered');
      await clerkSignOut();
      setSignedIn(false);
      setUser(null);
      setLoading(false);
      console.log('Force logout successful');
    } catch (error) {
      console.error('Force logout error:', error);
    }
  }, [clerkSignOut, setSignedIn, setUser, setLoading]);

  return (
    <NavigationIndependentTree>
      {__DEV__ && (
        <View style={{ position: 'absolute', top: 50, left: 10, zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.8)', padding: 10, borderRadius: 8 }}>
          <Text style={{ color: 'white', fontSize: 10 }}>
            Auth: {isLoaded ? (clerkSignedIn ? 'Signed In' : 'Not Signed In') : 'Loading...'}
          </Text>
          <Text style={{ color: 'white', fontSize: 10 }}>
            User: {userId || 'None'}
          </Text>
        </View>
      )}
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          gestureEnabled: true,
        }}
      >
        {clerkSignedIn ? (
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

  // Configure deep linking for OAuth callbacks
  const linking = {
    prefixes: [Linking.createURL('/')],
    config: {
      screens: {
        Login: 'login',
      },
    },
  };

  // Development: Expose force logout globally for debugging
  (global as any).forceLogout = async () => {
    try {
      console.log('🔒 Force logout triggered');
      const clerk = require('@clerk/clerk-expo').useClerk();
      await clerk.useClerk().signOut?.();

      const { setSignedIn, setUser, setLoading } = require('./src/store/useAuthStore').useAuthStore.getState();
      setSignedIn(false);
      setUser(null);
      setLoading(false);

      console.log('✅ Force logout successful');
    } catch (error) {
      console.error('❌ Force logout error:', error);
    }
  };

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
    return <LoadingScreen />;
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
          hidden={true}
        />
        <NavigationContainer linking={linking}>
          <RootNavigation />
        </NavigationContainer>
      </PaperProvider>
    </ClerkProvider>
  );
}
