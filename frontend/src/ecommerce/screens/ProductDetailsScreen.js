import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import ProductDetails from '../components/ProductDetails';


export default function ProductDetailsScreen({ route }) {
  return (
    <ScrollView style={styles.container}>
      <ProductDetails route={route} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
