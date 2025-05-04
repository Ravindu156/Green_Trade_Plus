import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons} from '@expo/vector-icons';

export default function searchBar() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.searchBarContainer}>
        <Ionicons name="menu" size={25} color="black" style={styles.icon} />
        <View style={styles.searchBar}>
          <Ionicons name="search" size={30} color="gray" />
          <TextInput
            placeholder="Search the Products"
            style={styles.input}
          />
          {/*<Ionicons name="mic" size={20} color="gray" style={{ marginHorizontal: 5 }} />
          <MaterialIcons name="qr-code-scanner" size={20} color="gray" />*/}
        </View>
        {/*<Ionicons name="cart" size={24} color="black" style={styles.icon} />*/}

        <TouchableOpacity style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
        </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 50,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
      },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    marginHorizontal: 5,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    marginHorizontal: 5,
  },
  searchButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginLeft: 5,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
