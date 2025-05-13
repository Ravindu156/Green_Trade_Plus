import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AdminHomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the Admin Home</Text>
    </View>
  );
};

export default AdminHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold'
  }
});
