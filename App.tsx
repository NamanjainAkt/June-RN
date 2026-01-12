import React from 'react';
import { StatusBar } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
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
import { ClerkProvider } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TAB_ICON = {
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
          const iconName = TAB_ICON[route.name as keyof typeof TAB_ICON];
          return <MaterialCommunityIcons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const { isDarkMode } = useAppTheme();
  const { isSignedIn, setSignedIn, setUser, setLoading } = useAuthStore();

  const handleLogin = async () => {
    setLoading(true);
    setSignedIn(true);
    setUser({
      id: 'user',
      email: 'user@example.com',
      name: 'User',
    });
  };

  return (
    <ClerkProvider
      publishableKey={process.env.CLERK_PUBLISHABLE_KEY || ''}
      tokenCache={{
        getToken: async () => {
          try {
            const token = await SecureStore.getItemAsync('clerkToken');
            return token;
          } catch {
            return null;
          }
        },
        saveToken: async (token) => {
          try {
            await SecureStore.setItemAsync('clerkToken', token);
          } catch {}
        },
        clearToken: async () => {
          try {
            await SecureStore.deleteItemAsync('clerkToken');
          } catch {}
        },
      }}
    >
      <PaperProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
          >
            {isSignedIn ? (
              <>
                <Stack.Screen name="Main" component={MainTabs} />
                <Stack.Screen name="Chat" component={ChatScreen} />
                <Stack.Screen name="CustomAgent" component={CreateAgentScreen} />
              </>
            ) : (
              <Stack.Screen
                name="Login"
                options={{ headerShown: false }}
              >
                {(props: any) => <LoginScreen {...props} onLogin={handleLogin} isLoading={false} />}
              </Stack.Screen>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </ClerkProvider>
  );
}
