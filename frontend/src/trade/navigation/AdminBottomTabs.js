import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AdminHomeScreen from '../screens/Admin/AdminHomeScreen';
import AdminProfileScreen from '../screens/Admin/AdminProfileScreen';
import AdminSettingsScreen from '../screens/Admin/AdminSettingsScreen';

const Tab = createBottomTabNavigator();

// Dummy screen components
const HomeScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Admin Home</Text>
  </View>
);

const ProfileScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Admin Profile</Text>
  </View>
);

const SettingsScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Admin Settings</Text>
  </View>
);

const AdminBottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') iconName = 'home-outline';
          else if (route.name === 'Profile') iconName = 'person-outline';
          else if (route.name === 'Settings') iconName = 'settings-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={AdminHomeScreen} />
      <Tab.Screen name="Profile" component={AdminProfileScreen} />
      <Tab.Screen name="Settings" component={AdminSettingsScreen} />
    </Tab.Navigator>
  );
};

export default AdminBottomTabs;
