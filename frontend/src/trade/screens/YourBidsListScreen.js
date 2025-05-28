import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const YourBidsListScreen = ({ userId = 1, navigation }) => {
  const [bids, setBids] = useState([]);
  const [filteredBids, setFilteredBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [selectedBid, setSelectedBid] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [bidDetails, setBidDetails] = useState(null);
  const [farmerInfo, setFarmerInfo] = useState(null);

  const categories = ['all', 'vegetables', 'fruits', 'grains', 'dairy', 'meat'];
  const sortOptions = [
    { value: 'date', label: 'Date' },
    { value: 'price', label: 'Bid Price' },
    { value: 'name', label: 'Item Name' }
  ];

  useEffect(() => {
    fetchUserBids();
  }, []);

  useEffect(() => {
    filterAndSortBids();
  }, [bids, searchQuery, selectedCategory, sortBy]);

  const fetchUserBids = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/item-bids/user/${userId}`);
      const bidsData = await response.json();
      
      // Fetch item details for each bid
      const bidsWithDetails = await Promise.all(
        bidsData.map(async (bid) => {
          try {
            const itemResponse = await fetch(`http://localhost:8080/api/trade-items/${bid.itemId}`);
            const itemData = await itemResponse.json();
            return {
              ...bid,
              itemName: itemData.name,
              category: itemData.category,
              farmerId: itemData.user.id,
              itemDetails: itemData
            };
          } catch (error) {
            console.error('Error fetching item details:', error);
            return {
              ...bid,
              itemName: 'Unknown Item',
              category: 'unknown',
              farmerId: null,
              itemDetails: null
            };
          }
        })
      );
      
      setBids(bidsWithDetails);
    } catch (error) {
      console.error('Error fetching bids:', error);
      Alert.alert('Error', 'Failed to fetch your bids');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortBids = () => {
    let filtered = [...bids];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(bid =>
        bid.itemName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(bid => bid.category === selectedCategory);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.bidTime) - new Date(a.bidTime);
        case 'price':
          return b.bid - a.bid;
        case 'name':
          return a.itemName.localeCompare(b.itemName);
        default:
          return 0;
      }
    });

    setFilteredBids(filtered);
  };

  const handleRowPress = async (bid) => {
    try {
      setSelectedBid(bid);
      setBidDetails(bid.itemDetails);
      
      // Fetch farmer info
      if (bid.farmerId) {
        const farmerResponse = await fetch(`http://localhost:8080/api/auth/${bid.farmerId}/basic-info`);
        const farmerData = await farmerResponse.json();
        setFarmerInfo(farmerData);
      }
      
      setModalVisible(true);
    } catch (error) {
      console.error('Error fetching details:', error);
      Alert.alert('Error', 'Failed to load bid details');
    }
  };

  const handleDeleteBid = (bidId) => {
    Alert.alert(
      'Delete Bid',
      'Are you sure you want to delete this bid?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteBid(bidId)
        }
      ]
    );
  };

  const deleteBid = async (bidId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/item-bids/${bidId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setBids(prev => prev.filter(bid => bid.id !== bidId));
        Alert.alert('Success', 'Bid deleted successfully');
      } else {
        Alert.alert('Error', 'Failed to delete bid');
      }
    } catch (error) {
      console.error('Error deleting bid:', error);
      Alert.alert('Error', 'Failed to delete bid');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderBidItem = ({ item, index }) => (
    <TouchableOpacity
      style={[styles.tableRow, index % 2 === 0 ? styles.evenRow : styles.oddRow]}
      onPress={() => handleRowPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.tableCell}>
        <Text style={styles.cellText}>{index + 1}</Text>
      </View>
      <View style={[styles.tableCell, styles.itemNameCell]}>
        <Text style={styles.cellText} numberOfLines={2}>{item.itemName}</Text>
        <Text style={styles.categoryText}>{item.category}</Text>
      </View>
      <View style={styles.tableCell}>
        <Text style={styles.priceText}>LKR {item.bid.toFixed(2)}</Text>
      </View>
      <View style={styles.tableCell}>
        <Text style={styles.dateText}>{formatDate(item.bidTime)}</Text>
      </View>
      <View style={styles.tableCell}>
        <Text style={styles.maxBidText}>
          {item.maxBid ? `LKR ${item.maxBid.toFixed(2)}` : 'N/A'}
        </Text>
      </View>
      <View style={styles.tableCell}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteBid(item.id)}
        >
          <Ionicons name="trash-outline" size={18} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.tableHeader}>
      <View style={styles.tableCell}>
        <Text style={styles.headerText}>No.</Text>
      </View>
      <View style={[styles.tableCell, styles.itemNameCell]}>
        <Text style={styles.headerText}>Item Name</Text>
      </View>
      <View style={styles.tableCell}>
        <Text style={styles.headerText}>Your Bid (LKR)</Text>
      </View>
      <View style={styles.tableCell}>
        <Text style={styles.headerText}>Bid Date</Text>
      </View>
      <View style={styles.tableCell}>
        <Text style={styles.headerText}>Max. Bid (LKR)</Text>
      </View>
      <View style={styles.tableCell}>
        <Text style={styles.headerText}>Delete</Text>
      </View>
    </View>
  );

  const renderFilters = () => (
    <View style={styles.filtersContainer}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search items..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
        {categories.map((category) => (
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
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        {sortOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.sortButton,
              sortBy === option.value && styles.selectedSortButton
            ]}
            onPress={() => setSortBy(option.value)}
          >
            <Text style={[
              styles.sortButtonText,
              sortBy === option.value && styles.selectedSortText
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Bid Details</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            {bidDetails && (
              <>
                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Item Information</Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Name:</Text>
                    <Text style={styles.detailValue}>{bidDetails.name}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Category:</Text>
                    <Text style={styles.detailValue}>{bidDetails.category}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Quantity:</Text>
                    <Text style={styles.detailValue}>{bidDetails.quantity} {bidDetails.unit}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Organic:</Text>
                    <Text style={styles.detailValue}>{bidDetails.isOrganic ? 'Yes' : 'No'}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Description:</Text>
                    <Text style={styles.detailValue}>{bidDetails.description}</Text>
                  </View>
                </View>

                {farmerInfo && (
                  <View style={styles.detailSection}>
                    <Text style={styles.sectionTitle}>Farmer Information</Text>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Name:</Text>
                      <Text style={styles.detailValue}>{farmerInfo.firstName}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Username:</Text>
                      <Text style={styles.detailValue}>{farmerInfo.userName}</Text>
                    </View>
                  </View>
                )}

                {selectedBid && (
                  <View style={styles.detailSection}>
                    <Text style={styles.sectionTitle}>Bid Information</Text>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Your Bid:</Text>
                      <Text style={styles.bidPriceValue}>LKR {selectedBid.bid.toFixed(2)}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Maximum Bid:</Text>
                      <Text style={styles.maxBidValue}>
                        {selectedBid.maxBid ? `LKR ${selectedBid.maxBid.toFixed(2)}` : 'Not available'}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Bid Date:</Text>
                      <Text style={styles.detailValue}>{formatDate(selectedBid.bidTime)}</Text>
                    </View>
                  </View>
                )}
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading your bids...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Your Bids</Text>
          <Text style={styles.subtitle}>{filteredBids.length} bid(s) found</Text>
        </View>
      </View>

      {renderFilters()}

      <View style={styles.tableContainer}>
        {renderHeader()}
        <FlatList
          data={filteredBids}
          renderItem={renderBidItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchUserBids().finally(() => setRefreshing(false));
              }}
              colors={['#4CAF50']}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="document-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No bids found</Text>
              <Text style={styles.emptySubText}>Pull down to refresh</Text>
            </View>
          }
        />
      </View>

      {renderModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#4CAF50',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#e8f5e8',
    textAlign: 'center',
    marginTop: 4,
  },
  filtersContainer: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f3f4',
    borderRadius: 25,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  categoryContainer: {
    marginBottom: 12,
  },
  categoryButton: {
    backgroundColor: '#f1f3f4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  selectedCategoryButton: {
    backgroundColor: '#4CAF50',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  sortLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
    fontWeight: '500',
  },
  sortButton: {
    backgroundColor: '#f1f3f4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
  },
  selectedSortButton: {
    backgroundColor: '#2196F3',
  },
  sortButtonText: {
    fontSize: 12,
    color: '#666',
  },
  selectedSortText: {
    color: '#fff',
  },
  tableContainer: {
    flex: 1,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    paddingVertical: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  evenRow: {
    backgroundColor: '#fff',
  },
  oddRow: {
    backgroundColor: '#fafafa',
  },
  tableCell: {
    flex: 1,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemNameCell: {
    flex: 1.5,
    alignItems: 'flex-start',
  },
  headerText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  cellText: {
    fontSize: 13,
    color: '#333',
    textAlign: 'center',
  },
  categoryText: {
    fontSize: 10,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 2,
  },
  priceText: {
    fontSize: 13,
    color: '#4CAF50',
    fontWeight: '600',
  },
  dateText: {
    fontSize: 11,
    color: '#666',
  },
  maxBidText: {
    fontSize: 13,
    color: '#FF9800',
    fontWeight: '600',
  },
  deleteButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#ffebee',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    fontWeight: '500',
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    margin: 20,
    maxHeight: '80%',
    width: width - 40,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  detailSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#4CAF50',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    flex: 2,
    textAlign: 'right',
  },
  bidPriceValue: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
    flex: 2,
    textAlign: 'right',
  },
  maxBidValue: {
    fontSize: 16,
    color: '#FF9800',
    fontWeight: 'bold',
    flex: 2,
    textAlign: 'right',
  },
});

export default YourBidsListScreen;