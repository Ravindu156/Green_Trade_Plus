import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../hooks/useAuth';
import AuthStack from './AuthStack';
import AppTabs from './AppTabs';
import ProductsTabs from '../../ecommerce/navigation/ProductsTabs';
import BottomTabNavigator from '../../academy/navigation/BottomTabNavigator ';
import AdminBottomTabs from './AdminBottomTabs'; // import your admin tab

const Stack = createStackNavigator();

const RootNavigator = () => {
  const { user, loading } = useAuth();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        const userObj = JSON.parse(userData);
        if (userObj && userObj.role) {
          setRole(userObj.role);
        }
      } catch (err) {
        console.error('Failed to fetch user info', err);
      }
    };

    if (user) {
      fetchUserInfo();
    }
  }, [user]);

  if (loading) {
    // You could return a splash screen here
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          {role === 'admin' ? (
            <Stack.Screen name="AdminBottomTabs" component={AdminBottomTabs} />
          ) : (
            <Stack.Screen name="App" component={AppTabs} />
          )}
          <Stack.Screen name="ProductsTabs" component={ProductsTabs} />
          <Stack.Screen name="BottomTabNavigator" component={BottomTabNavigator} />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
