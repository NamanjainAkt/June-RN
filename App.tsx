import React, { useEffect, useCallback, useState } from 'react';
import { StatusBar, Platform } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { useAppTheme } from './src/hooks';
import { LoginScreen } from './src/screens/Auth/LoginScreen';
import { HomeScreen } from './src/screens/Home/HomeScreen';
import { ExploreScreen } from './src/screens/Explore/ExploreScreen';
import { HistoryScreen } from './src/screens/History/HistoryScreen';
import { SettingsScreen } from './src/screens/Settings/SettingsScreen';
import { ChatScreen } from './src/screens/Chat/ChatScreen';
import { CreateAgentScreen } from './src/screens/CustomAgent/CreateAgentScreen';
import { useAuthStore } from './src/store/useAuthStore';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TAB_ICON: Record<string, any> = {
  Home: 'home',
  Explore: 'compass',
  History: 'history',
  Settings: 'cog',
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const iconName = TAB_ICON[route.name] || 'help-circle';
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
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
  const { isSignedIn, setSignedIn, setUser, setLoading, logout } = useAuthStore();
  const { isLoaded } = useAuth();
  const { isDarkMode } = useAppTheme();
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    if (isLoaded && !authInitialized) {
      const storedState = useAuthStore.getState();
      if (storedState.isSignedIn && storedState.user) {
        setUser(storedState.user);
      } else {
        setLoading(false);
      }
      setAuthInitialized(true);
    }
  }, [isLoaded, authInitialized, setUser, setLoading]);

  const handleLogin = useCallback(() => {
    setLoading(true);
    setSignedIn(true);
    setUser({
      id: 'user',
      email: 'user@example.com',
      name: 'User',
    });
  }, [setSignedIn, setUser, setLoading]);

  if (!isLoaded) {
    return null;
  }

  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            gestureEnabled: true,
          }}
        >
          {isSignedIn ? (
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
                    backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
                  },
                  headerTintColor: isDarkMode ? '#ffffff' : '#000000',
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
                    backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
                  },
                  headerTintColor: isDarkMode ? '#ffffff' : '#000000',
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
                  onLogin={handleLogin} 
                  isLoading={useAuthStore.getState().isLoading} 
                />
              )}
            </Stack.Screen>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}

export default function App() {
  const { isDarkMode } = useAppTheme();

  return (
    <ClerkProvider
      publishableKey={process.env.CLERK_PUBLISHABLE_KEY || ''}
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
      <PaperProvider>
        <StatusBar 
          barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
          backgroundColor={isDarkMode ? '#1a1a1a' : '#ffffff'}
        />
        <RootNavigation />
      </PaperProvider>
    </ClerkProvider>
  );
}
