import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const navigation = useNavigation();

  const handleSearch = () => {
    if (query.trim()) {
      navigation.navigate('SearchResults', { query });
    }
  };

  return (
    <View style={styles.searchContainer}>
      <Ionicons name="search" size={24} color="#777" />
      <TextInput
        style={styles.input}
        placeholder="Search the Products"
        value={query}
        onChangeText={setQuery}
        returnKeyType="search"
        onSubmitEditing={handleSearch}
      />
      <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 10,
    elevation: 3,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#1976d2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
