import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  RefreshControl,
  TextInput,
  Modal,
} from 'react-native';
import Swal from 'sweetalert2';
import { Ionicons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const FarmerYourListings = ({ navigation }) => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    dateFilter: 'all', // all, today, week, month
    organicStatus: 'all', // all, organic, inorganic
    category: 'all',
  });
  const [sortBy, setSortBy] = useState({ field: 'dateAdded', ascending: false });

  // List of categories fetched from items
  const [categories, setCategories] = useState([]);
  const { API_URL } = Constants.expoConfig.extra;

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    // Apply filters and search whenever items, filterOptions, or searchQuery changes
    applyFiltersAndSearch();
  }, [items, filterOptions, searchQuery, sortBy]);

  const fetchItems = async () => {
    const userData = await AsyncStorage.getItem('user');
     const user = JSON.parse(userData);
     const userId = user.id;
    try {
      setLoading(true);
      const response = await axios.get(`http://${API_URL}:8080/api/trade-items/user/${userId}`);
      setItems(response.data);

      // Extract unique categories
      const uniqueCategories = [...new Set(response.data.map(item => item.category))];
      setCategories(uniqueCategories);

      // Initial filtered items same as all items
      setFilteredItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching items:', error);
      Alert.alert('Error', 'Failed to load your listings. Please try again.');
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchItems();
    setRefreshing(false);
  };

  const handleDeleteItem = async (id) => {
    const result = await Swal.fire({
      title: 'Confirm Delete',
      text: 'Are you sure you want to delete this item?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8080/api/trade-items/${id}`);
        setItems(prevItems => prevItems.filter(item => item.id !== id));

        Swal.fire({
          title: 'Deleted!',
          text: 'Item deleted successfully.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error('Error deleting item:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete item. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    }
  };

  const applyFiltersAndSearch = () => {
    let filtered = [...items];

    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply organic status filter
    if (filterOptions.organicStatus !== 'all') {
      filtered = filtered.filter(item =>
        item.isOrganic === (filterOptions.organicStatus === 'organic' ? true : false)
      );
    }

    // Apply category filter
    if (filterOptions.category !== 'all') {
      filtered = filtered.filter(item =>
        item.category === filterOptions.category
      );
    }

    // Apply date filter
    if (filterOptions.dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const oneDay = 24 * 60 * 60 * 1000;

      filtered = filtered.filter(item => {
        const itemDate = new Date(item.dateAdded);

        switch (filterOptions.dateFilter) {
          case 'today':
            return itemDate >= today;
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * oneDay);
            return itemDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
            return itemDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    filtered = filtered.sort((a, b) => {
      const fieldA = a[sortBy.field];
      const fieldB = b[sortBy.field];

      if (typeof fieldA === 'string' && typeof fieldB === 'string') {
        return sortBy.ascending
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA);
      } else {
        return sortBy.ascending
          ? fieldA - fieldB
          : fieldB - fieldA;
      }
    });

    setFilteredItems(filtered);
  };

  const resetFilters = () => {
    setFilterOptions({
      dateFilter: 'all',
      organicStatus: 'all',
      category: 'all',
    });
    setSearchQuery('');
  };

  const toggleSortDirection = (field) => {
    if (sortBy.field === field) {
      setSortBy({ field, ascending: !sortBy.ascending });
    } else {
      setSortBy({ field, ascending: true });
    }
  };

  const getSortIcon = (field) => {
    if (sortBy.field !== field) return "remove-outline";
    return sortBy.ascending ? "caret-up" : "caret-down";
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderTableHeader = () => (
    <View style={styles.tableHeader}>
      <TouchableOpacity
        style={[styles.headerCell, { flex: 2.5 }]}
        onPress={() => toggleSortDirection('name')}
      >
        <Text style={styles.headerText}>Item Name</Text>
        <Ionicons name={getSortIcon('name')} size={14} color={COLORS.textDark} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.headerCell, { flex: 1.5 }]}
        onPress={() => toggleSortDirection('category')}
      >
        <Text style={styles.headerText}>Category</Text>
        <Ionicons name={getSortIcon('category')} size={14} color={COLORS.textDark} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.headerCell, { flex: 1 }]}
        onPress={() => toggleSortDirection('quantity')}
      >
        <Text style={styles.headerText}>Qty</Text>
        <Ionicons name={getSortIcon('quantity')} size={14} color={COLORS.textDark} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.headerCell, { flex: 1.5 }]}
        onPress={() => toggleSortDirection('organic')}
      >
        <Text style={styles.headerText}>Type</Text>
        <Ionicons name={getSortIcon('organic')} size={14} color={COLORS.textDark} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.headerCell, { flex: 2 }]}
        onPress={() => toggleSortDirection('dateAdded')}
      >
        <Text style={styles.headerText}>Date Added</Text>
        <Ionicons name={getSortIcon('dateAdded')} size={14} color={COLORS.textDark} />
      </TouchableOpacity>

      <View style={[styles.headerCell, { flex: 1 }]}>
        <Text style={styles.headerText}>Action</Text>
      </View>
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.tableRow}>
      <View style={[styles.cell, { flex: 2.5 }]}>
        <Text style={styles.cellText} numberOfLines={1}>{item.name}</Text>
      </View>

      <View style={[styles.cell, { flex: 1.5 }]}>
        <Text style={styles.cellText} numberOfLines={1}>{item.category}</Text>
      </View>

      <View style={[styles.cell, { flex: 1 }]}>
        <Text style={styles.cellText}>{item.quantity}</Text>
      </View>

      <View style={[styles.cell, { flex: 1.5 }]}>
        <View style={[
          styles.statusBadge,
          { backgroundColor: item.isOrganic == true ? '#DEFFED' : '#FFF3DC' }
        ]}>
          <Text style={[
            styles.statusText,
            { color: item.isOrganic == true ? '#0CA85C' : '#FFA113' }
          ]}>
            {item.organic == 1 ? 'Organic' : 'Inorganic'}
          </Text>
        </View>
      </View>

      <View style={[styles.cell, { flex: 2 }]}>
        <Text style={styles.cellText}>{formatDate(item.dateAdded)}</Text>
      </View>

      <TouchableOpacity
        style={[styles.cell, { flex: 1 }]}
        onPress={() => handleDeleteItem(item.id)}
      >
        <View style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={16} color="white" />
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderFilterModal = () => (
    <Modal
      visible={filterModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setFilterModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter Options</Text>
            <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
              <Ionicons name="close" size={24} color={COLORS.textDark} />
            </TouchableOpacity>
          </View>

          {/* Date Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Date Added</Text>
            <View style={styles.filterOptions}>
              {['all', 'today', 'week', 'month'].map(option => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.filterOption,
                    filterOptions.dateFilter === option && styles.filterOptionActive
                  ]}
                  onPress={() => setFilterOptions({
                    ...filterOptions,
                    dateFilter: option
                  })}
                >
                  <Text style={[
                    styles.filterOptionText,
                    filterOptions.dateFilter === option && styles.filterOptionTextActive
                  ]}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Organic Status Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Product Type</Text>
            <View style={styles.filterOptions}>
              {['all', 'organic', 'inorganic'].map(option => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.filterOption,
                    filterOptions.organicStatus === option && styles.filterOptionActive
                  ]}
                  onPress={() => setFilterOptions({
                    ...filterOptions,
                    organicStatus: option
                  })}
                >
                  <Text style={[
                    styles.filterOptionText,
                    filterOptions.organicStatus === option && styles.filterOptionTextActive
                  ]}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Category Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Category</Text>
            <View style={styles.filterOptions}>
              <TouchableOpacity
                style={[
                  styles.filterOption,
                  filterOptions.category === 'all' && styles.filterOptionActive
                ]}
                onPress={() => setFilterOptions({
                  ...filterOptions,
                  category: 'all'
                })}
              >
                <Text style={[
                  styles.filterOptionText,
                  filterOptions.category === 'all' && styles.filterOptionTextActive
                ]}>
                  All
                </Text>
              </TouchableOpacity>

              {categories.map(category => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.filterOption,
                    filterOptions.category === category && styles.filterOptionActive
                  ]}
                  onPress={() => setFilterOptions({
                    ...filterOptions,
                    category: category
                  })}
                >
                  <Text style={[
                    styles.filterOptionText,
                    filterOptions.category === category && styles.filterOptionTextActive
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.filterActions}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={resetFilters}
            >
              <Text style={styles.resetButtonText}>Reset All</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => setFilterModalVisible(false)}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Listings</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddNewItemScreen')}>
          <View style={styles.addButton}>
            <Ionicons name="add" size={20} color="white" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Search & Filter Bar */}
      <View style={styles.searchFilterContainer}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={COLORS.textLight} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search items..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={COLORS.textLight}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <MaterialCommunityIcons name="filter-variant" size={22} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Active Filters Display */}
      {(filterOptions.dateFilter !== 'all' ||
        filterOptions.organicStatus !== 'all' ||
        filterOptions.category !== 'all') && (
          <View style={styles.activeFiltersContainer}>
            <Text style={styles.activeFiltersTitle}>Active Filters:</Text>
            <View style={styles.filtersRow}>
              {filterOptions.dateFilter !== 'all' && (
                <View style={styles.activeFilter}>
                  <Text style={styles.activeFilterText}>
                    Date: {filterOptions.dateFilter.charAt(0).toUpperCase() + filterOptions.dateFilter.slice(1)}
                  </Text>
                  <TouchableOpacity onPress={() => setFilterOptions({ ...filterOptions, dateFilter: 'all' })}>
                    <Ionicons name="close-circle" size={16} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
              )}

              {filterOptions.organicStatus !== 'all' && (
                <View style={styles.activeFilter}>
                  <Text style={styles.activeFilterText}>
                    Type: {filterOptions.organicStatus.charAt(0).toUpperCase() + filterOptions.organicStatus.slice(1)}
                  </Text>
                  <TouchableOpacity onPress={() => setFilterOptions({ ...filterOptions, organicStatus: 'all' })}>
                    <Ionicons name="close-circle" size={16} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
              )}

              {filterOptions.category !== 'all' && (
                <View style={styles.activeFilter}>
                  <Text style={styles.activeFilterText}>
                    Category: {filterOptions.category}
                  </Text>
                  <TouchableOpacity onPress={() => setFilterOptions({ ...filterOptions, category: 'all' })}>
                    <Ionicons name="close-circle" size={16} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
              )}

              <TouchableOpacity
                style={styles.clearAllButton}
                onPress={resetFilters}
              >
                <Text style={styles.clearAllText}>Clear All</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

      {/* Summary Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{filteredItems.length}</Text>
          <Text style={styles.statLabel}>Total Items</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {filteredItems.filter(item => item.isOrganic  == true).length}
          </Text>
          <Text style={styles.statLabel}>Organic</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {filteredItems.filter(item => item.isOrganic  == false).length}
          </Text>
          <Text style={styles.statLabel}>Inorganic</Text>
        </View>
      </View>

      {/* Table / List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : filteredItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <AntDesign name="inbox" size={60} color={COLORS.lightGray} />
          <Text style={styles.emptyText}>No items found</Text>
          <Text style={styles.emptySubText}>
            {searchQuery || filterOptions.dateFilter !== 'all' ||
              filterOptions.organicStatus !== 'all' || filterOptions.category !== 'all' ?
              'Try adjusting your filters' : 'Add your first listing'}
          </Text>
          {!(searchQuery || filterOptions.dateFilter !== 'all' ||
            filterOptions.organicStatus !== 'all' || filterOptions.category !== 'all') && (
              <TouchableOpacity
                style={styles.addFirstButton}
                onPress={() => navigation.navigate('AddNewItemScreen')}
              >
                <Text style={styles.addFirstButtonText}>Add New Item</Text>
              </TouchableOpacity>
            )}
        </View>
      ) : (
        <View style={styles.tableContainer}>
          {renderTableHeader()}
          <FlatList
            data={filteredItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[COLORS.primary]}
              />
            }
          />
        </View>
      )}

      {/* Filter Modal */}
      {renderFilterModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchFilterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textDark,
  },
  filterButton: {
    marginLeft: 12,
    backgroundColor: '#F0F7FF',
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E6F0FF',
  },
  activeFiltersContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  activeFiltersTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textLight,
    marginBottom: 8,
  },
  filtersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  activeFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F7FF',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  activeFilterText: {
    fontSize: 12,
    color: COLORS.primary,
    marginRight: 6,
  },
  clearAllButton: {
    paddingVertical: 6,
  },
  clearAllText: {
    fontSize: 12,
    color: COLORS.textLight,
    textDecorationLine: 'underline',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 16,
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#F0F0F0',
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 4,
  },
  tableContainer: {
    flex: 1,
    marginTop: 12,
    paddingHorizontal: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F6F9FE',
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 8,
  },
  headerCell: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 8,
  },
  headerText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textDark,
    marginRight: 4,
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginBottom: 8,
    borderRadius: 8,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cell: {
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  cellText: {
    fontSize: 13,
    color: COLORS.textDark,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: '#FF4D4F',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textDark,
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 8,
  },
  addFirstButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  addFirstButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingBottom: 32,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  filterSection: {
    marginTop: 16,
  },
  filterSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
    marginBottom: 8,
  },
  filterOptionActive: {
    backgroundColor: '#E6F0FF',
  },
  filterOptionText: {
    fontSize: 13,
    color: COLORS.textDark,
  },
  filterOptionTextActive: {
    color: COLORS.primary,
    fontWeight: '500',
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  resetButtonText: {
    color: COLORS.textDark,
    fontWeight: '500',
  },
  applyButton: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  applyButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default FarmerYourListings;