import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    ScrollView,
    Alert,
    TextInput,
    Modal,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const SelectedItemDetailsScreen = ({ route }) => {
    const navigation = useNavigation();
    const { item } = route.params;

    const [tradeItems, setTradeItems] = useState([]);
    const [farmers, setFarmers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    // Bid modal state
    const [showBidModal, setShowBidModal] = useState(false);
    const [selectedTradeItem, setSelectedTradeItem] = useState(null);
    const [bidAmount, setBidAmount] = useState("");
    const [currentUserId, setCurrentUserId] = useState(1); // Assuming logged in user ID is 1
    const { API_URL } = Constants.expoConfig.extra;
    

  const fallbackImage = require('../../../assets/TradeItems/Vegetables.jpg');

    useEffect(() => {
        fetchTradeItems();
    }, []);

    const fetchTradeItems = async () => {
        const userData = await AsyncStorage.getItem('user');
        const user = JSON.parse(userData);
        const UserId = user.id;
        console.log("UserIDENTITY",UserId);
        
        setCurrentUserId(UserId)
        setLoading(true);
        setError(null);
        try {
            // 1. Fetch trade items for this particular item
            const response = await fetch(`http://${API_URL}:8080/api/trade-items`);

            if (!response.ok) {
                throw new Error('Failed to fetch trade items');
            }

            const data = await response.json();
            console.log("dataa",data);
            
            // Filter the items by name to match the selected item
            const filteredItems = data.filter(tradeItem => tradeItem.name === item.name);
            setTradeItems(filteredItems);

            // 2. Fetch farmer details for each trade item
            const farmerPromises = filteredItems.map(tradeItem => fetchFarmerInfo(tradeItem.user.id));
            await Promise.all(farmerPromises);

            // 3. Fetch max bids for each trade item
            const bidPromises = filteredItems.map(tradeItem => fetchMaxBid(tradeItem.id));
            await Promise.all(bidPromises);

        } catch (err) {
            console.error('Error fetching trade items:', err);
            setError(err.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const fetchFarmerInfo = async (userId) => {
        try {
            const response = await fetch(`http://${API_URL}:8080/api/auth/${userId}/basic-info`);
            console.log(`http://${API_URL}:8080/api/auth/${userId}/basic-info`);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch farmer info for user ${userId}`);
            }

            const data = await response.json();

            // Update farmers state with the new farmer info
            setFarmers(prevFarmers => ({
                ...prevFarmers,
                [userId]: data
            }));

        } catch (err) {
            console.error(`Error fetching farmer info for user ${userId}:`, err);
            // Set a placeholder for this farmer
            setFarmers(prevFarmers => ({
                ...prevFarmers,
                [userId]: { userName: "Unknown", firstName: "Unknown", role: "farmer" }
            }));
        }
    };

    const fetchMaxBid = async (itemId) => {
        try {
            const response = await fetch(`http://${API_URL}:8080/api/item-bids/${itemId}/max`);

            if (!response.ok) {
                throw new Error(`Failed to fetch max bid for item ${itemId}`);
            }

            const maxBid = await response.json();

            // Update the trade items with the max bid
            setTradeItems(prevItems =>
                prevItems.map(item =>
                    item.id === itemId ? { ...item, maxBid } : item
                )
            );

        } catch (err) {
            console.error(`Error fetching max bid for item ${itemId}:`, err);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchTradeItems();
    };

    const openBidModal = (tradeItem) => {
        setSelectedTradeItem(tradeItem);
        setBidAmount(tradeItem.maxBid ? (tradeItem.maxBid + 1).toString() : "1");
        setShowBidModal(true);
    };

    const placeBid = async () => {
        if (!selectedTradeItem || !bidAmount) return;

        const bid = parseFloat(bidAmount);
        if (isNaN(bid) || bid <= 0) {
            Alert.alert("Invalid Bid", "Please enter a valid bid amount");
            return;
        }

        try {
            const response = await fetch(`http://${API_URL}:8080/api/item-bids`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    itemId: selectedTradeItem.id,
                    userId: currentUserId,
                    bid: bid
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to place bid');
            }

            // Close modal and refresh data
            setShowBidModal(false);
            fetchTradeItems();
            Alert.alert("Success", "Your bid has been placed successfully");

        } catch (err) {
            console.error('Error placing bid:', err);
            Alert.alert("Error", "Failed to place bid. Please try again.");
        }
    };

    const renderTradeItem = ({ item: tradeItem, index }) => {
        const farmer = farmers[tradeItem.user.id] || { userName: "Loading...", firstName: "Loading..." };

        return (
            <View style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.numberCell]}>{index + 1}</Text>
                <Text style={[styles.tableCell, styles.farmerCell]}>{farmer.userName}</Text>
                <Text style={[styles.tableCell, styles.quantityCell]}>
                    {tradeItem.quantity} {tradeItem.unit}
                </Text>
                <View style={[styles.tableCell, styles.bidCell]}>
                    <Text style={styles.bidText}>
                        {tradeItem.maxBid ? `RS.${tradeItem.maxBid.toFixed(2)}` : 'No bids'}
                    </Text>
                    <TouchableOpacity
                        style={styles.bidButton}
                        onPress={() => openBidModal(tradeItem)}
                    >
                        <Text style={styles.bidButtonText}>Bid</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const renderBidModal = () => (
        <Modal
            visible={showBidModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowBidModal(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Place Your Bid</Text>
                        <TouchableOpacity onPress={() => setShowBidModal(false)}>
                            <Ionicons name="close" size={24} color="#000" />
                        </TouchableOpacity>
                    </View>

                    {selectedTradeItem && (
                        <View style={styles.bidItemInfo}>
                            <Text style={styles.bidItemName}>{item.name}</Text>
                            <Text style={styles.bidItemDetails}>
                                Farmer: {farmers[selectedTradeItem.userId]?.userName || 'Unknown'}
                            </Text>
                            <Text style={styles.bidItemDetails}>
                                Available: {selectedTradeItem.quantity} {selectedTradeItem.unit}
                            </Text>
                            <Text style={styles.bidItemDetails}>
                                Current Highest Bid: {selectedTradeItem.maxBid ? `RS.${selectedTradeItem.maxBid.toFixed(2)}` : 'No bids yet'}
                            </Text>

                            <View style={styles.bidInputContainer}>
                                <Text style={styles.bidInputLabel}>Your Bid (RS):</Text>
                                <TextInput
                                    style={styles.bidInput}
                                    value={bidAmount}
                                    onChangeText={setBidAmount}
                                    keyboardType="decimal-pad"
                                    autoFocus
                                />
                            </View>

                            <TouchableOpacity
                                style={styles.placeBidButton}
                                onPress={placeBid}
                            >
                                <Text style={styles.placeBidButtonText}>Place Bid</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                {/* Header with Back Button */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{item.name} Details</Text>
                </View>

                {/* Item Details */}
                <View style={styles.itemDetails}>
                    <Image
                        source={require('../../../assets/TradeItems/Vegetables.jpg')}
                        style={styles.itemImage}
                    />
                    <View style={styles.itemInfo}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemCategory}>Category: {item.category}</Text>
                        <Text style={styles.itemPrice}>Price: RS.{item.price.toFixed(2)}/- per {item.unit}</Text>
                    </View>
                </View>

                {/* Table Header */}
                <View style={styles.tableHeader}>
                    <Text style={styles.tableHeaderText}>Available Farmers</Text>
                </View>

                {/* Table Column Headers */}
                <View style={[styles.tableRow, styles.tableHeaderRow]}>
                    <Text style={[styles.tableCell, styles.tableCellHeader, styles.numberCell]}>#</Text>
                    <Text style={[styles.tableCell, styles.tableCellHeader, styles.farmerCell]}>Farmer</Text>
                    <Text style={[styles.tableCell, styles.tableCellHeader, styles.quantityCell]}>Available</Text>
                    <Text style={[styles.tableCell, styles.tableCellHeader, styles.bidCell]}>Max Bid</Text>
                </View>

                {/* Table Content */}
                {loading ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color="#4CAF50" />
                        <Text style={styles.loaderText}>Loading farmers...</Text>
                    </View>
                ) : error ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>Error: {error}</Text>
                        <TouchableOpacity
                            style={styles.retryButton}
                            onPress={fetchTradeItems}
                        >
                            <Text style={styles.retryButtonText}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <FlatList
                        data={tradeItems}
                        renderItem={renderTradeItem}
                        keyExtractor={item => item.id.toString()}
                        contentContainerStyle={styles.tableContainer}
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No farmers available for this item</Text>
                            </View>
                        }
                    />
                )}

                {/* Bid Modal */}
                {renderBidModal()}
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
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#d3f8a3',
    },
    backButton: {
        marginRight: 15,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    itemDetails: {
        flexDirection: 'row',
        padding: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    itemImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
    },
    itemInfo: {
        marginLeft: 15,
        justifyContent: 'center',
    },
    itemName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    itemCategory: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
        textTransform: 'capitalize',
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: '500',
        color: '#4CAF50',
    },
    tableHeader: {
        padding: 15,
        backgroundColor: '#f0f0f0',
    },
    tableHeaderText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    tableContainer: {
        paddingBottom: 20,
    },
    tableHeaderRow: {
        backgroundColor: '#e0e0e0',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingVertical: 12,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
    },
    tableCell: {
        justifyContent: 'center',
    },
    tableCellHeader: {
        fontWeight: 'bold',
    },
    numberCell: {
        width: '10%',
    },
    farmerCell: {
        width: '30%',
    },
    quantityCell: {
        width: '25%',
    },
    bidCell: {
        width: '35%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    bidText: {
        color: '#F57C00',
        fontWeight: '500',
    },
    bidButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 5,
        paddingHorizontal: 12,
        borderRadius: 5,
    },
    bidButtonText: {
        color: '#fff',
        fontWeight: '500',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
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
    emptyContainer: {
        padding: 30,
        alignItems: 'center',
    },
    emptyText: {
        color: '#666',
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
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
    bidItemInfo: {
        marginBottom: 20,
    },
    bidItemName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    bidItemDetails: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    bidInputContainer: {
        marginTop: 15,
        marginBottom: 20,
    },
    bidInputLabel: {
        fontSize: 16,
        marginBottom: 5,
    },
    bidInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 8,
        fontSize: 16,
    },
    placeBidButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        borderRadius: 5,
        alignItems: 'center',
    },
    placeBidButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
});

export default SelectedItemDetailsScreen;