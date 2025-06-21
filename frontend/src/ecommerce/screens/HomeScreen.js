import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PromoBanner from '../components/PromoBanner';
import FlashSale from '../components/FlashSale';

const categories = ['Plastic Boxes', 'Steel Boxes', 'Wooden Boxes'];

export default function HomeScreen({ navigation }) {
  const [searchText, setSearchText] = useState('');

  const handleSearch = () => {
    navigation.navigate('SearchResults', { query: searchText });
  };

  const handleCategoryPress = (category) => {
    navigation.navigate('CategoryItems', { category });
  };

  return (
    <ScrollView style={styles.container}>

      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <Ionicons name="menu" size={25} color="black" style={styles.icon} />
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="gray" />
          <TextInput
            placeholder="Search the Products"
            style={styles.input}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Promo Banners */}
      <PromoBanner />

      {/* Categories */}
      <Text style={styles.sectionTitle}>Categories</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
        {categories.map((category, index) => (
          <TouchableOpacity key={index} style={styles.categoryBox} onPress={() => handleCategoryPress(category)}>
            <Ionicons name="cube" size={24} color="white" />
            <Text style={styles.categoryText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Flash Sale */}
      <FlashSale navigation={navigation} />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    elevation: 2,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#eee',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginLeft: 10,
  },
  input: {
    flex: 1,
    marginLeft: 5,
    fontSize: 16,
  },
  searchButton: {
    marginLeft: 10,
    backgroundColor: '#28a745',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
    marginTop: 15,
    marginBottom: 5,
  },
  categoryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  categoryBox: {
    backgroundColor: '#1976d2',
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
    width: 120,
  },
  categoryText: {
    color: '#fff',
    marginTop: 5,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
