import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Home from '../screens/Home';
import Certificates from '../screens/Cerificates'
import Profile from '../screens/Profile'

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: '#757575',
        tabBarStyle: {
          paddingBottom: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
        },
      }}
    >
      <Tab.Screen 
        name="Courses" 
        component={Home} 
        options={{
          tabBarLabel: 'Courses',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="book" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen 
        name="Certificates" 
        component={Certificates} 
        options={{
          tabBarLabel: 'Certificates',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="certificate" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={Profile} 
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;