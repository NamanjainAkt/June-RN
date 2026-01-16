import { ClerkProvider, useAuth, useClerk, useOAuth } from '@clerk/clerk-expo';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, useFonts } from '@expo-google-fonts/inter';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationIndependentTree } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Linking from 'expo-linking';
import * as SecureStore from 'expo-secure-store';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useEffect } from 'react';
import { Provider as PaperProvider, configureFonts } from 'react-native-paper';
import { LoadingScreen } from './src/components/LoadingScreen';
import { VERCEL_BORDER_RADIUS, VERCEL_COLORS, VERCEL_TYPOGRAPHY } from './src/constants/vercel-theme';
import { useAppTheme } from './src/hooks';
import { LoginScreen } from './src/screens/Auth/LoginScreen';
import { ChatScreen } from './src/screens/Chat/ChatScreen';
import { CreateAgentScreen } from './src/screens/CustomAgent/CreateAgentScreen';
import { ExploreScreen } from './src/screens/Explore/ExploreScreen';
import { HistoryScreen } from './src/screens/History/HistoryScreen';
import { HomeScreen } from './src/screens/Home/HomeScreen';
import { SettingsScreen } from './src/screens/Settings/SettingsScreen';

import { useAuthStore } from './src/store/useAuthStore';
import { useChatStore } from './src/store/useChatStore';

// Browser warming for Clerk OAuth
WebBrowser.maybeCompleteAuthSession();

export const useWarmUpBrowser = () => {
  useEffect(() => {
    // Warm up the android browser to improve UX
    // https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};
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
  const loadAgents = useChatStore((state) => state.loadAgents);

  // Warm up the browser for Clerk OAuth
  useWarmUpBrowser();

  const { user: clerkUser } = useClerk();

  // Debug: Log auth state
  console.log('Auth State:', { isLoaded, clerkSignedIn, userId, clerkUser });

  useEffect(() => {
    if (isLoaded) {
      if (clerkSignedIn && userId) {
        setSignedIn(true);
        setUser({
          id: userId,
          email: clerkUser?.primaryEmailAddress?.emailAddress || 'user@example.com',
          name: clerkUser?.fullName || clerkUser?.username || 'User',
          imageUrl: clerkUser?.imageUrl,
        });
        setLoading(false);
        loadAgents(userId);
      } else {
        setSignedIn(false);
        setUser(null);
        setLoading(false);
      }
    }
  }, [isLoaded, clerkSignedIn, userId, clerkUser, setSignedIn, setUser, setLoading, loadAgents]);

  const handleGoogleLogin = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔐 Starting Google OAuth flow...');

      const result = await startOAuthFlow({
        redirectUrl: Linking.createURL('/', { scheme: 'june' }),
      });

      console.log('📱 OAuth result:', {
        createdSessionId: result.createdSessionId,
        hasSetActive: !!result.setActive,
        hasSignUp: !!result.signUp
      });

      if (result.createdSessionId && result.setActive) {
        console.log('✅ Setting active session:', result.createdSessionId);
        await result.setActive({ session: result.createdSessionId });

        // Wait a moment for Clerk to update auth state
        await new Promise(resolve => setTimeout(resolve, 500));
      } else if (result.signUp) {
        console.log('📝 Sign-up flow - user needs to complete signup');
        setLoading(false);
      } else {
        console.warn('⚠️ No session created, user might have cancelled');
        setLoading(false);
      }
    } catch (error: any) {
      console.error('❌ Google login error:', error);

      const clerkError = error as any;
      const isSignedOutError = clerkError?.clerkError === true &&
        clerkError?.errors?.[0]?.code === 'signed_out';

      if (isSignedOutError) {
        console.warn('⚠️ Clerk reported "signed_out" error during OAuth flow. This usually means the browser window was closed or the flow was interrupted.');
      }

      console.error('Error details:', JSON.stringify(error));
      setLoading(false);
    }
  }, [startOAuthFlow, setLoading]);



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
    <>

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
              name="CreateAgent"
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
                isLoading={useAuthStore.getState().isLoading}
              />
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </>
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
        getToken: (key: string) => SecureStore.getItemAsync(key),
        saveToken: (key: string, value: string) => SecureStore.setItemAsync(key, value),
      }}
    >
      <PaperProvider theme={paperTheme}>
        <StatusBar
          hidden={true}
        />
        <NavigationIndependentTree>
          <RootNavigation />
        </NavigationIndependentTree>
      </PaperProvider>
    </ClerkProvider>
  );
}
