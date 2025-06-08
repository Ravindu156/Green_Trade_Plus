import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProductDetailsScreens from './src/ecommerce/screens/ProductDetailsScreen';
import CartScreen from './src/ecommerce/screens/CartScreen';

const Stack = createNativeStackNavigator();

export default function CartStackNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Cart">
        <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
