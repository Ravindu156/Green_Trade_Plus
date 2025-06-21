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
  ActivityIndicator,
  Modal,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons'; // Make sure to install expo icons
import Constants from 'expo-constants';

const TodayMarketScreen = ({ route }) => {
  const navigation = useNavigation();
  // State for current date
  const [currentDate, setCurrentDate] = useState('');
  const [currentDay, setCurrentDay] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [marketItems, setMarketItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [showFilterModal, setShowFilterModal] = useState(false);
  const { API_URL } = Constants.expoConfig.extra;

  const imageMap = {
    Apple: require('../../../assets/TradeItems/Apple.jpg'),
    Orange: require('../../../assets/TradeItems/Orange.jpg'),
    // Add all your item images
  };

  const fallbackImage = require('../../../assets/TradeItems/Vegetables.jpg');

  // Available categories from the API response
  const [categories, setCategories] = useState(['All']);

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

    // Fetch market items
    fetchMarketItems();
  }, []);

  // Fetch market items from the API
  const fetchMarketItems = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://${API_URL}:8080/api/admin/price-settings`);

      if (!response.ok) {
        throw new Error('Failed to fetch market items');
      }

      const data = await response.json();

      // Transform the data to match our component needs
      const transformedData = data.map(item => ({
        id: item.id.toString(),
        name: item.itemName,
        price: item.pricePerUnit,
        category: item.category,
        unit: item.unit,
        // Using placeholder images based on category
        image: imageMap[item.itemName] || fallbackImage,
        lastUpdated: item.lastUpdated
      }));

      setMarketItems(transformedData);
      setFilteredItems(transformedData);

      // Extract unique categories
      const uniqueCategories = ['All', ...new Set(data.map(item =>
        item.category.charAt(0).toUpperCase() + item.category.slice(1)
      ))];
      setCategories(uniqueCategories);

    } catch (err) {
      setError(err.message);
      console.error('Error fetching market items:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get color code for placeholder images based on category
  const getCategoryColor = (category) => {
    switch (category.toLowerCase()) {
      case 'fruits': return 'FF9800';
      case 'vegetables': return '4CAF50';
      case 'dairy': return 'FFEB3B';
      case 'grains': return 'A52A2A';
      case 'herbs': return '008000';
      default: return '607D8B';
    }
  };

  const isToday = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();

    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Apply filters whenever filter criteria change
  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedCategory, priceRange, marketItems]);

  // Apply filters based on search, category, and price range
  const applyFilters = () => {
    let filtered = [...marketItems];

    // First filter: only items updated today
    filtered = filtered.filter(item => isToday(item.lastUpdated));

    // Then apply other filters
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item =>
        item.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    filtered = filtered.filter(item =>
      item.price >= priceRange.min && item.price <= priceRange.max
    );

    setFilteredItems(filtered);
  };

  // Format the last updated time
  const formatLastUpdated = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  // Render each market item
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemCard}
      onPress={() => navigation.navigate('SelectedItemDetailsScreen', { item })}
    >
      <Image source={item.image} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>RS.{item.price.toFixed(2)}/-</Text>
        <Text style={styles.perKg}>per 1 {item.unit}</Text>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.lastUpdated}>
          last updated at {formatLastUpdated(item.lastUpdated)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Reset filters to default values
  const resetFilters = () => {
    setSelectedCategory('All');
    setPriceRange({ min: 0, max: 1000 });
  };

  // Render the filter modal
  const renderFilterModal = () => (
    <Modal
      visible={showFilterModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowFilterModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter Items</Text>
            <TouchableOpacity onPress={() => setShowFilterModal(false)}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Category Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Category</Text>
            <View style={styles.categoryContainer}>
              {categories.map(category => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category && styles.selectedCategoryButton
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text style={[
                    styles.categoryButtonText,
                    selectedCategory === category && styles.selectedCategoryText
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Price Range Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Price Range (RS.)</Text>
            <View style={styles.priceRangeContainer}>
              <View style={styles.priceInputContainer}>
                <Text>Min:</Text>
                <TextInput
                  style={styles.priceInput}
                  keyboardType="numeric"
                  value={priceRange.min.toString()}
                  onChangeText={(text) => setPriceRange({ ...priceRange, min: parseFloat(text) || 0 })}
                />
              </View>
              <View style={styles.priceInputContainer}>
                <Text>Max:</Text>
                <TextInput
                  style={styles.priceInput}
                  keyboardType="numeric"
                  value={priceRange.max.toString()}
                  onChangeText={(text) => setPriceRange({ ...priceRange, max: parseFloat(text) || 1000 })}
                />
              </View>
            </View>
          </View>

          {/* Filter Action Buttons */}
          <View style={styles.filterActions}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={resetFilters}
            >
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => {
                applyFilters();
                setShowFilterModal(false);
              }}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
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

        {/* Filter Button */}
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <MaterialIcons name="filter-list" size={20} color="#fff" />
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>

        {/* Active Filters Display */}
        {(selectedCategory !== 'All' || priceRange.min > 0 || priceRange.max < 1000) && (
          <View style={styles.activeFiltersContainer}>
            <Text style={styles.activeFiltersTitle}>Active Filters:</Text>
            <View style={styles.activeFilterTags}>
              {selectedCategory !== 'All' && (
                <View style={styles.filterTag}>
                  <Text style={styles.filterTagText}>Category: {selectedCategory}</Text>
                </View>
              )}
              {(priceRange.min > 0 || priceRange.max < 1000) && (
                <View style={styles.filterTag}>
                  <Text style={styles.filterTagText}>
                    Price: RS.{priceRange.min} - RS.{priceRange.max}
                  </Text>
                </View>
              )}
              <TouchableOpacity
                style={styles.clearFiltersButton}
                onPress={resetFilters}
              >
                <Text style={styles.clearFiltersText}>Clear All</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Loading Indicator */}
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loaderText}>Loading market items...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error: {error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={fetchMarketItems}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* No results message */}
            {filteredItems.length === 0 ? (
              <View style={styles.noResultsContainer}>
                <Feather name="info" size={50} color="#888" />
                <Text style={styles.noResultsText}>No items found</Text>
                <Text style={styles.noResultsSubText}>Try adjusting your filters</Text>
              </View>
            ) : (
              /* Market Items Grid */
              <FlatList
                data={filteredItems}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                numColumns={2}
                contentContainerStyle={styles.listContainer}
              />
            )}
          </>
        )}

        {/* Filter Modal */}
        {renderFilterModal()}

      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#d3f8a3',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '500',
  },
  dayText: {
    fontSize: 12,
    color: '#555',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  searchInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  searchIcon: {
    padding: 10,
  },
  listContainer: {
    padding: 8,
  },
  itemCard: {
    flex: 1,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  itemInfo: {
    padding: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  perKg: {
    fontSize: 12,
    color: '#888',
    marginBottom: 5,
  },
  category: {
    fontSize: 12,
    color: '#555',
    marginBottom: 5,
    textTransform: 'capitalize',
  },
  lastUpdated: {
    fontSize: 10,
    color: '#999',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: 'flex-end',
    marginRight: 15,
    marginBottom: 10,
  },
  filterButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  filterSection: {
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
    marginBottom: 10,
  },
  selectedCategoryButton: {
    backgroundColor: '#4CAF50',
  },
  categoryButtonText: {
    color: '#333',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  priceRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: 100,
    marginLeft: 10,
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  resetButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 10,
  },
  resetButtonText: {
    color: '#666',
  },
  applyButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  activeFiltersContainer: {
    marginHorizontal: 15,
    marginBottom: 10,
  },
  activeFiltersTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
  },
  activeFilterTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  filterTag: {
    backgroundColor: '#e1f5fe',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    marginBottom: 5,
  },
  filterTagText: {
    color: '#0288d1',
    fontSize: 12,
  },
  clearFiltersButton: {
    marginBottom: 5,
  },
  clearFiltersText: {
    color: '#f44336',
    fontSize: 12,
    fontWeight: '500',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 10,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#f44336',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#666',
    marginTop: 10,
  },
  noResultsSubText: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
});

export default TodayMarketScreen;