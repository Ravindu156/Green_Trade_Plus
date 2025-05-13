import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FarmerProfileScreen from '../screens/FarmerProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TodayMarketScreen from '../screens/TodayMarketScreen';
import AddNewItemScreen from '../screens/AddNewItemScreen';
// import YourClassesScreen from '../screens/YourClassesScreen';
// import EarningsScreen from '../screens/EarningsScreen';
import { COLORS } from '../constants/colors';
import FarmerYourListingsScreen from '../screens/FarmerYourListingsScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const ProfileStack = createStackNavigator();

// Create a stack navigator for the Home tab to include TodayMarketScreen
const HomeStackScreen = () => {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen name="TodayMarketScreen" component={TodayMarketScreen} />
    </HomeStack.Navigator>
  );
};

// Create a stack navigator for the Profile tab to include farmer-specific screens
const ProfileStackScreen = () => {
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch user role from AsyncStorage
    const getUserRole = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        const user = JSON.parse(userData);
        setUserRole(user.role);
      } catch (error) {
        console.error('Error fetching user role:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getUserRole();
  }, []);

  if (isLoading) {
    // You could return a loading component here if needed
    return (
      <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
        <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
      </ProfileStack.Navigator>
    );
  }

  // Use FarmerProfileScreen if user role is "farmer", otherwise use regular ProfileScreen
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      {userRole === 'farmer' && (
        <>
          <ProfileStack.Screen name="FarmerProfile" component={FarmerProfileScreen} />
          <ProfileStack.Screen name="FarmerYourListingsScreen" component={FarmerYourListingsScreen} />
          <ProfileStack.Screen name="AddNewItemScreen" component={AddNewItemScreen} />
          <ProfileStack.Screen name="TodayMarketScreen" component={TodayMarketScreen} />
        </>
      )}

      {userRole === 'seller' && (
        <>
          {/* <ProfileStack.Screen name="SellerProfile" component={ProfileScreen} /> */}
          {/* Add seller-specific screens here */}
        </>
      )}

      {userRole === 'admin' && (
        <>
          {/* <ProfileStack.Screen name="AdminProfile" component={ProfileScreen} /> */}
          {/* Add admin-specific screens here */}
        </>
      )}

      {!['farmer', 'seller', 'admin'].includes(userRole) && (
        <ProfileStack.Screen name="DefaultProfile" component={ProfileScreen} />
      )}
    </ProfileStack.Navigator>
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
          } else if (route.name === 'Market') {
            iconName = focused ? 'basket' : 'basket-outline';
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
        component={HomeStackScreen}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? '';

          // Only hide tab bar for specific screens
          return {
            tabBarStyle: routeName === 'ProductsTabs' ? { display: 'none' } : undefined
          };
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackScreen}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? '';

          // Hide tab bar for screens that should be full screen
          const screensToHideTabBar = [
            /* 'YourListings',
            'AddNewItemScreen',
            'YourClasses',
            'Earnings',
            'TodayMarketScreen' */
          ];

          return {
            tabBarStyle: screensToHideTabBar.includes(routeName)
              ? { display: 'none' }
              : undefined
          };
        }}
      />
      <Tab.Screen
        name="Market"
        component={TodayMarketScreen}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
      />
    </Tab.Navigator>
  );
};

export default AppTabs;