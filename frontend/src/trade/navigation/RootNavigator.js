import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../hooks/useAuth';
import AuthStack from './AuthStack';
import AppTabs from './AppTabs';

const Stack = createStackNavigator();

const RootNavigator = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    // You could return a splash screen here
    return null;
  }
  
  return (
    <Stack.Navigator screenOptions={{ headerShown:false }}>
      {user ? (
        <Stack.Screen name="App" component={AppTabs} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;