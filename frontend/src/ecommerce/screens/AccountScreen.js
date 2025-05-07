import React from 'react';
import { View, StyleSheet } from 'react-native';
import SellersForm from '../components/SellersForm';

export default function AccountScreen() {
  return (
    <View style={styles.container}>
        <SellersForm/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});
