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
  ScrollView,
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
  const [bidModalVisible, setBidModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [bids, setBids] = useState([]);
  const [loadingBids, setLoadingBids] = useState(false);
  const [closingAuction, setClosingAuction] = useState(false);
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

  const fetchBids = async (itemId) => {
    try {
      setLoadingBids(true);
      const response = await axios.get(`http://localhost:8080/api/item-bids/${itemId}`);
      // Sort bids in descending order by bid amount
      const sortedBids = response.data.sort((a, b) => b.bid - a.bid);
      setBids(sortedBids);
      setLoadingBids(false);
    } catch (error) {
      console.error('Error fetching bids:', error);
      Alert.alert('Error', 'Failed to load bids. Please try again.');
      setLoadingBids(false);
    }
  };

  const handleItemPress = (item) => {
    setSelectedItem(item);
    setBidModalVisible(true);
    fetchBids(item.id);
  };

  const handleCloseAuction = async () => {
    const result = await Swal.fire({
      title: 'Close Auction',
      text: 'Are you sure you want to close this auction? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Close Auction',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        setClosingAuction(true);
        // You might want to update this endpoint based on your backend API
        await axios.patch(`http://localhost:8080/api/trade-items/${selectedItem.id}/close-auction`);

        // Update the item status locally
        setItems(prevItems =>
          prevItems.map(item =>
            item.id === selectedItem.id
              ? { ...item, auctionClosed: true }
              : item
          )
        );

        setBidModalVisible(false);
        setClosingAuction(false);

        Swal.fire({
          title: 'Auction Closed!',
          text: 'The auction has been successfully closed.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error('Error closing auction:', error);
        setClosingAuction(false);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to close auction. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
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

  const formatDateTime = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleString(undefined, options);
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
    <TouchableOpacity onPress={() => handleItemPress(item)}>
      <View style={[
        styles.tableRow,
        { backgroundColor: item.isBidActive ? '#E6FFE6' : '#FFE6E6' }
      ]}>

        <View style={[styles.cell, { flex: 2.5, flexDirection: 'row', alignItems: 'center' }]}>
          <Text style={styles.cellText} numberOfLines={1}>{item.name}</Text>

          {!item.isBidActive && (
            <View style={styles.closedLabel}>
              <Text style={styles.closedLabelText}>Closed</Text>
            </View>
          )}
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
            { backgroundColor: item.isOrganic ? '#DEFFED' : '#FFF3DC' }
          ]}>
            <Text style={[
              styles.statusText,
              { color: item.isOrganic ? '#0CA85C' : '#FFA113' }
            ]}>
              {item.isOrganic ? 'Organic' : 'Inorganic'}
            </Text>
          </View>
        </View>

        <View style={[styles.cell, { flex: 2 }]}>
          <Text style={styles.cellText}>{formatDate(item.dateAdded)}</Text>
        </View>

        <TouchableOpacity
          style={[styles.cell, { flex: 1 }]}
          onPress={(e) => {
            e.stopPropagation();
            handleDeleteItem(item.id);
          }}
        >
          <View style={styles.deleteButton}>
            <Ionicons name="trash-outline" size={16} color="white" />
          </View>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );


  const renderBidItem = ({ item: bid, index }) => (
    <View style={[styles.bidRow, index === 0 && styles.topBid]}>
      <View style={styles.bidRank}>
        <Text style={[styles.bidRankText, index === 0 && styles.topBidText]}>
          #{index + 1}
        </Text>
      </View>
      <View style={styles.bidDetails}>
        <View style={styles.bidAmountContainer}>
          <Text style={[styles.bidAmount, index === 0 && styles.topBidAmount]}>
            ${bid.bid.toFixed(2)}
          </Text>
          {index === 0 && (
            <View style={styles.topBidBadge}>
              <Text style={styles.topBidBadgeText}>TOP BID</Text>
            </View>
          )}
        </View>
        <Text style={styles.bidTime}>{formatDateTime(bid.bidTime)}</Text>
        <Text style={styles.bidUserId}>User ID: {bid.userId}</Text>
      </View>
    </View>
  );

  const renderBidModal = () => (
    <Modal
      visible={bidModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setBidModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.bidModalContent}>
          <View style={styles.bidModalHeader}>
            <View style={styles.bidModalTitleContainer}>
              <Text style={styles.bidModalTitle}>{selectedItem?.name}</Text>
              <Text style={styles.bidModalSubtitle}>Auction Bids</Text>
            </View>
            <TouchableOpacity onPress={() => setBidModalVisible(false)}>
              <Ionicons name="close" size={24} color={COLORS.textDark} />
            </TouchableOpacity>
          </View>

          {loadingBids ? (
            <View style={styles.bidLoadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Loading bids...</Text>
            </View>
          ) : bids.length === 0 ? (
            <View style={styles.noBidsContainer}>
              <AntDesign name="inbox" size={60} color={COLORS.lightGray} />
              <Text style={styles.noBidsText}>No bids yet</Text>
              <Text style={styles.noBidsSubText}>
                Your item is waiting for the first bid
              </Text>
            </View>
          ) : (
            <View style={styles.bidsContainer}>
              <View style={styles.bidsHeader}>
                <Text style={styles.bidsCount}>{bids.length} Bid{bids.length !== 1 ? 's' : ''}</Text>
                <Text style={styles.highestBid}>
                  Highest: ${Math.max(...bids.map(b => b.bid)).toFixed(2)}
                </Text>
              </View>

              <FlatList
                data={bids}
                renderItem={renderBidItem}
                keyExtractor={(bid) => bid.id.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.bidsList}
              />
            </View>
          )}

          <View style={styles.bidModalActions}>
            <TouchableOpacity
              style={styles.closeAuctionButton}
              onPress={handleCloseAuction}
              disabled={closingAuction || bids.length === 0}
            >
              {closingAuction ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.closeAuctionButtonText}>
                  Close Auction
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
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
            {filteredItems.filter(item => item.isOrganic == true).length}
          </Text>
          <Text style={styles.statLabel}>Organic</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {filteredItems.filter(item => item.isOrganic == false).length}
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

      {/* Bid Details Modal */}
      {renderBidModal()}
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
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  closedLabel: {
    backgroundColor: '#FF4C4C',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 6,
    alignSelf: 'center',
  },
  closedLabelText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  searchFilterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    marginRight: 10,
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
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeFiltersContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F9F9F9',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  activeFiltersTitle: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 6,
  },
  filtersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  activeFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF8FF',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 8,
    marginBottom: 5,
  },
  activeFilterText: {
    fontSize: 12,
    color: COLORS.primary,
    marginRight: 5,
  },
  clearAllButton: {
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  clearAllText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 15,
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  tableContainer: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerCell: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textDark,
    marginRight: 4,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    alignItems: 'center',
  },
  cell: {
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  cellText: {
    fontSize: 12,
    color: COLORS.textDark,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'center',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
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
    paddingHorizontal: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textDark,
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 8,
    textAlign: 'center',
    maxWidth: '80%',
  },
  addFirstButton: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addFirstButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterSectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textDark,
    marginBottom: 10,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterOption: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 8,
    marginBottom: 8,
  },
  filterOptionActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterOptionText: {
    fontSize: 12,
    color: COLORS.textDark,
  },
  filterOptionTextActive: {
    color: 'white',
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  resetButtonText: {
    color: COLORS.textDark,
    fontWeight: '500',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  bidModalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 12,
    maxHeight: '80%',
  },
  bidModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  bidModalTitleContainer: {
    flex: 1,
    marginRight: 10,
  },
  bidModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  bidModalSubtitle: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  bidLoadingContainer: {
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: COLORS.textLight,
  },
  noBidsContainer: {
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noBidsText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textDark,
    marginTop: 10,
  },
  noBidsSubText: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 5,
    textAlign: 'center',
  },
  bidsContainer: {
    paddingHorizontal: 16,
  },
  bidsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  bidsCount: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  highestBid: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  bidsList: {
    paddingBottom: 16,
  },
  bidRow: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  topBid: {
    backgroundColor: '#F0F7FF',
    borderColor: COLORS.primary,
  },
  bidRank: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bidRankText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  topBidText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  bidDetails: {
    flex: 1,
  },
  bidAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  bidAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textDark,
    marginRight: 8,
  },
  topBidAmount: {
    color: COLORS.primary,
  },
  topBidBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  topBidBadgeText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  bidTime: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 2,
  },
  bidUserId: {
    fontSize: 12,
    color: COLORS.textDark,
  },
  bidModalActions: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  closeAuctionButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeAuctionButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  // Additional styles for better visual hierarchy
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: COLORS.textDark,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: COLORS.textDark,
  },
  pickerContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    overflow: 'hidden',
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  secondaryButtonText: {
    color: COLORS.textDark,
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 4,
  },
  successText: {
    fontSize: 12,
    color: '#34C759',
    marginTop: 4,
  },
  infoText: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 4,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkboxLabel: {
    fontSize: 14,
    color: COLORS.textDark,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  radioChecked: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  radioLabel: {
    fontSize: 14,
    color: COLORS.textDark,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 14,
    color: COLORS.textDark,
  },
  imagePicker: {
    width: 100,
    height: 100,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 8,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  imagePickerText: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 4,
    textAlign: 'center',
  },
  imagePickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#F5F5F5',
    borderRadius: 3,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 8,
    borderRadius: 4,
    zIndex: 100,
  },
  tooltipText: {
    color: 'white',
    fontSize: 12,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textDark,
  },
  tabTextActive: {
    color: COLORS.primary,
  },
  dropdownContainer: {
    position: 'relative',
  },
  dropdownButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownButtonText: {
    fontSize: 14,
    color: COLORS.textDark,
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 8,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    zIndex: 10,
    elevation: 5,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownItemText: {
    fontSize: 14,
    color: COLORS.textDark,
  },
  stepperContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  stepperStep: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperStepActive: {
    backgroundColor: COLORS.primary,
  },
  stepperStepText: {
    fontSize: 14,
    color: COLORS.textDark,
  },
  stepperStepTextActive: {
    color: 'white',
  },
  stepperLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#F0F0F0',
  },
  stepperLineActive: {
    backgroundColor: COLORS.primary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingStar: {
    marginRight: 4,
  },
  ratingText: {
    fontSize: 14,
    color: COLORS.textDark,
    marginLeft: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF3B30',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  carousel: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  carouselImage: {
    width: '100%',
    height: '100%',
  },
  carouselPagination: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  carouselDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 4,
  },
  carouselDotActive: {
    backgroundColor: 'white',
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: COLORS.textDark,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  counterButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  counterValue: {
    width: 40,
    textAlign: 'center',
    fontSize: 16,
    color: COLORS.textDark,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    overflow: 'hidden',
  },
  segmentedButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  segmentedButtonActive: {
    backgroundColor: COLORS.primary,
  },
  segmentedButtonText: {
    fontSize: 14,
    color: COLORS.textDark,
  },
  segmentedButtonTextActive: {
    color: 'white',
  },
  actionSheetContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 16,
  },
  actionSheetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 16,
    textAlign: 'center',
  },
  actionSheetButton: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    alignItems: 'center',
  },
  actionSheetButtonText: {
    fontSize: 16,
    color: COLORS.textDark,
  },
  actionSheetCancelButton: {
    paddingVertical: 16,
    marginTop: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    alignItems: 'center',
  },
  actionSheetCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  skeleton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
  },
  shimmerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  shimmer: {
    width: '100%',
    height: '100%',
  },
  toastContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1000,
  },
  toastText: {
    flex: 1,
    color: 'white',
    fontSize: 14,
    marginLeft: 12,
  },
  toastIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomTabBar: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  bottomTab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomTabIcon: {
    marginBottom: 4,
  },
  bottomTabLabel: {
    fontSize: 10,
    color: COLORS.textLight,
  },
  bottomTabLabelActive: {
    color: COLORS.primary,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  parallaxHeader: {
    height: 250,
    justifyContent: 'flex-end',
  },
  parallaxBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  parallaxContent: {
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  parallaxTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  parallaxSubtitle: {
    fontSize: 16,
    color: 'white',
  },
  collapsibleHeader: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  collapsibleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  collapsibleContent: {
    padding: 16,
    backgroundColor: '#FAFAFA',
  },
  swipeableAction: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
  },
  swipeableDelete: {
    backgroundColor: '#FF3B30',
  },
  swipeableArchive: {
    backgroundColor: '#FF9500',
  },
  swipeableText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  watermark: {
    position: 'absolute',
    opacity: 0.1,
    zIndex: -1,
  },
  watermarkText: {
    fontSize: 100,
    color: COLORS.textDark,
    fontWeight: 'bold',
  }
});
export default FarmerYourListings;