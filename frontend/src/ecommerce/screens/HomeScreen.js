import React from 'react';
import { View, Text,StyleSheet, ScrollView } from 'react-native';
import SearchBar from '../components/SearchBar';
import Category from '../components/Category';
import PromoBanner from '../components/PromoBanner';
import FlashSale from '../components/FlashSale';

export default function HomeScreen({navigation}) {
  return (
    <ScrollView style={styles.container}>
      <SearchBar />
      <PromoBanner />
      <Category />
      <FlashSale  navigation={navigation}/>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});

