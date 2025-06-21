import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import SearchResultsScreen from '../screens/SearchResultsScreen';
import CategoryItemsScreen from '../screens/CategoryItemsScreen';

const HomeStack = createStackNavigator();

export default function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
      <HomeStack.Screen name="ProductDetails" component={ProductDetailsScreen} />
      <HomeStack.Screen name="SearchResults" component={SearchResultsScreen} />
      <HomeStack.Screen name="CategoryItems" component={CategoryItemsScreen} />
    </HomeStack.Navigator>
  );
}
