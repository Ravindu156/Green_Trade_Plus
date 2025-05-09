import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather, Ionicons } from '@expo/vector-icons'; // Make sure to install expo icons

const TodayMarketScreen = ({ route }) => {
  const navigation = useNavigation();
  // State for current date
  const [currentDate, setCurrentDate] = useState('');
  const [currentDay, setCurrentDay] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data for vegetable items
  const marketItems = [
    {
      id: '1',
      name: 'Cabbage',
      price: 120,
      // Using a placeholder image until real image assets are available
      image: { uri: 'https://via.placeholder.com/150/008000/FFFFFF?text=Cabbage' },
      lastUpdated: '2025-03-29T09:22:30',
    },
    {
      id: '2',
      name: 'Cabbage',
      price: 120,
      image: { uri: 'https://via.placeholder.com/150/008000/FFFFFF?text=Cabbage' },
      lastUpdated: '2025-03-29T09:22:30',
    },
    {
      id: '3',
      name: 'Cabbage',
      price: 120,
      image: { uri: 'https://via.placeholder.com/150/008000/FFFFFF?text=Cabbage' },
      lastUpdated: '2025-03-29T09:22:30',
    },
    {
      id: '4',
      name: 'Cabbage',
      price: 120,
      image: { uri: 'https://via.placeholder.com/150/008000/FFFFFF?text=Cabbage' },
      lastUpdated: '2025-03-29T09:22:30',
    },
    // Add more items as needed
  ];

  // Set the current date when component mounts
  useEffect(() => {
    const date = new Date();
    
    // Format date as DD/MM/YYYY
    const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    
    // Get day name
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[date.getDay()];
    
    setCurrentDate(formattedDate);
    setCurrentDay(dayName);
  }, []);

  // Format the last updated time
  const formatLastUpdated = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  // Render each market item
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemCard}>
      <Image source={item.image} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>RS.{item.price}/-</Text>
        <Text style={styles.perKg}>per 1 kg</Text>
        <Text style={styles.lastUpdated}>
          last updated at {formatLastUpdated(item.lastUpdated)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor="#d3f8a3" barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
      
      {/* Header with Back Button */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <View>
            <Text style={styles.dateText}>{currentDate}</Text>
            <Text style={styles.dayText}>{currentDay}</Text>
          </View>
        </View>
      </View>
      
      {/* Today Market Title */}
      <Text style={styles.title}>Today Market</Text>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search your item here..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.searchIcon}>
          <Feather name="search" size={20} color="#555" />
        </TouchableOpacity>
      </View>
      
      {/* Market Items Grid */}
      <FlatList
        data={marketItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
      />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F8E9', // Light green background color matching HomeScreen's COLORS.lightBg
    padding: 16,
  },
  header: {
    marginTop: 10,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  dayText: {
    fontSize: 16,
    color: '#000',
    marginTop: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginVertical: 20,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 20,
    alignItems: 'center',
    height: 44,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 14,
  },
  searchIcon: {
    padding: 5,
  },
  listContainer: {
    paddingBottom: 20,
  },
  itemCard: {
    flex: 1,
    margin: 8,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#1c1c1c', // Dark background for cards
    maxWidth: '45%',
  },
  itemImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  itemInfo: {
    padding: 12,
  },
  itemName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemPrice: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  perKg: {
    color: '#fff',
    fontSize: 12,
    marginTop: 2,
  },
  lastUpdated: {
    color: '#aaa',
    fontSize: 10,
    marginTop: 8,
  },
});

export default TodayMarketScreen;