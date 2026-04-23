import React, { useState, useEffect, createContext, useContext } from 'react';
import { ActivityIndicator, View, TouchableOpacity, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StorageService } from './src/services/StorageService';
import { User } from './src/types';

import WelcomeScreen from './src/screens/WelcomeScreen';
import AboutUsScreen from './src/screens/AboutUsScreen';
import SignInScreen from './src/screens/SignInScreen';
import HotelsScreen from './src/screens/HotelsScreen';
import RestaurantsScreen from './src/screens/RestaurantsScreen';
import EventsScreen from './src/screens/EventsScreen';
import DetailScreen from './src/screens/DetailScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import TripsScreen from './src/screens/TripsScreen';
import TripDetailScreen from './src/screens/TripDetailScreen';

export const AuthContext = createContext<{
  isAuthenticated: boolean;
  currentUser: User | null;
  signIn: (u: User) => Promise<void>;
  signOut: () => Promise<void>;
}>({
  isAuthenticated: false,
  currentUser: null,
  signIn: async () => {},
  signOut: async () => {}
});

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HeaderLogoutButton() {
  const { signOut, currentUser } = useContext(AuthContext);
  return (
    <TouchableOpacity style={{ marginRight: 15 }} onPress={signOut}>
      <Text style={{ color: '#F0F4F7', fontWeight: 'bold', fontSize: 13 }}>Déconnexion</Text>
    </TouchableOpacity>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName: any = 'bed';
        if (route.name === 'Hôtels') iconName = 'bed';
        if (route.name === 'Restaurants') iconName = 'restaurant';
        if (route.name === 'Événements') iconName = 'calendar';
        if (route.name === 'Favoris') iconName = 'heart';
        if (route.name === 'Voyages') iconName = 'map';
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#1A5276',
      tabBarInactiveTintColor: '#94a3b8',
      headerStyle: { backgroundColor: '#2980B9' },
      headerTintColor: '#F0F4F7',
      headerTitleAlign: 'center',
      tabBarStyle: { paddingBottom: 5, height: 60, backgroundColor: '#F0F4F7', borderTopColor: '#cbd5e1' },
      headerRight: () => <HeaderLogoutButton />
    })}>
      <Tab.Screen name="Hôtels" component={HotelsScreen} />
      <Tab.Screen name="Restaurants" component={RestaurantsScreen} />
      <Tab.Screen name="Événements" component={EventsScreen} />
      <Tab.Screen name="Favoris" component={FavoritesScreen} />
      <Tab.Screen name="Voyages" component={TripsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => { checkUser(); }, []);

  const checkUser = async () => {
    const user = await StorageService.getUser();
    setCurrentUser(user);
    setIsLoading(false);
  };

  const authContext = {
    isAuthenticated: !!currentUser,
    currentUser,
    signIn: async (user: User) => {
      await StorageService.saveUser(user);
      setCurrentUser(user);
    },
    signOut: async () => {
      await StorageService.logoutUser();
      setCurrentUser(null);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#F0F4F7', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2980B9" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {currentUser ? (
          <Stack.Navigator>
            <Stack.Screen name="MainTabs" component={TabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="Detail" component={DetailScreen}
              options={({ route }: any) => ({
                title: route.params.item.name,
                headerStyle: { backgroundColor: '#2980B9' },
                headerTintColor: '#F0F4F7'
              })} />
            <Stack.Screen name="TripDetail" component={TripDetailScreen}
              options={{ title: "Détail du voyage", headerStyle: { backgroundColor: '#2980B9' }, headerTintColor: '#F0F4F7' }} />
          </Stack.Navigator>
        ) : (
          <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Welcome">
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="AboutUs" component={AboutUsScreen} />
            <Stack.Screen name="SignIn" component={SignInScreen} />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
