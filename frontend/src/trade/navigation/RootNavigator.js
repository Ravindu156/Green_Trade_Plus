import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../hooks/useAuth';
import AuthStack from './AuthStack';
import AppTabs from './AppTabs';
import ProductsTabs from '../../ecommerce/navigation/ProductsTabs';
import BottomTabNavigator from '../../academy/navigation/BottomTabNavigator ';

const Stack = createStackNavigator();

const RootNavigator = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    // You could return a splash screen here
    return null;
  }
  
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="App" component={AppTabs} />
          <Stack.Screen name="ProductsTabs" component={ProductsTabs} />
          <Stack.Screen name='BottomTabNavigator' component={BottomTabNavigator}/>
          {/* Remove TodayMarketScreen from here since it's now in the HomeStack */}
        </>
      ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;