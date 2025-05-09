import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TodayMarketScreen from '../screens/TodayMarketScreen';
import { COLORS } from '../constants/colors';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();

// Create a stack navigator for the Home tab to include TodayMarketScreen
const HomeStackScreen = () => {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen name="TodayMarketScreen" component={TodayMarketScreen} />
    </HomeStack.Navigator>
  );
};

const AppTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: 'gray',
        headerShown: false
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackScreen} // Use the HomeStack instead of directly using HomeScreen
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? '';
          console.log("Route name is", routeName);
          
          // Only hide tab bar for ProductsTabs, keep it visible for TodayMarketScreen
          return {
            tabBarStyle: routeName === 'ProductsTabs' ? { display: 'none' } : undefined
          };
        }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default AppTabs;