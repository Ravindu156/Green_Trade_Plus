import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
    ActivityIndicator,
    Alert,
    Modal,
    KeyboardAvoidingView,
    Platform,
    RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../../constants/colors';
import { debounce } from 'lodash';

const AdminPriceSettingScreen = ({ navigation }) => {
    // State for price settings
    const [priceSettings, setPriceSettings] = useState([]);
    const [originalSettings, setOriginalSettings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [saving, setSaving] = useState({});
    const [savingAll, setSavingAll] = useState(false);

    // Filter and search state
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [categories, setCategories] = useState([]);

    // Modal state
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Timer display state
    const [timeRemaining, setTimeRemaining] = useState('');
    const [resetTime, setResetTime] = useState(null);

    // Fetch all price settings from the backend
    const fetchPriceSettings = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('token');

            // Fetch all added items
            const response = await axios.get('http://localhost:8080/api/trade-items', {
                headers: { Authorization: `Bearer ${token}` }
            });

            const items = response.data;

            // Merge duplicate items by name and sum their quantities
            const itemMap = new Map();

            items.forEach(item => {
                if (itemMap.has(item.name)) {
                    const existingItem = itemMap.get(item.name);
                    existingItem.quantity += item.quantity; // Sum quantities
                } else {
                    // Clone the item to avoid modifying the original
                    itemMap.set(item.name, { ...item });
                }
            });

            // Convert map back to array
            const mergedItems = Array.from(itemMap.values());

            // Log the merged items
            console.log('Merged Items (no duplicates):', mergedItems);

            // Extract unique categories from merged items
            const categoriesResponse = [...new Set(mergedItems.map(item => item.category))];

            // Calculate next reset time at midnight (00:00)
            const now = new Date();
            const nextMidnight = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + 1, // Next day
                0, 0, 0, 0 // Midnight
            );

            // Set the reset time to next midnight
            setResetTime(nextMidnight);

            // Set state with merged items
            setPriceSettings(mergedItems);
            setOriginalSettings(mergedItems);
            setCategories(categoriesResponse);
        } catch (error) {
            console.error('Failed to fetch price settings:', error);
            Alert.alert('Error', 'Failed to load price settings. Please try again.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };


    // Check if reset time has passed and reset if needed
    const checkResetTime = useCallback(async () => {
        if (resetTime) {
            const now = new Date();

            if (now >= resetTime) {
                // Time to reset
                await resetPriceSettings();
            } else {
                // Update countdown timer
                const diff = resetTime - now;
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                setTimeRemaining(`${hours}h ${minutes}m`);
            }
        }
    }, [resetTime]);

    // Reset price settings after 24 hours
    const resetPriceSettings = async () => {
        try {
            const token = await AsyncStorage.getItem('token');

            // Call backend to reset prices or simply fetch fresh data
            await fetchPriceSettings();

            // Set new reset time
            const newResetTime = new Date();
            newResetTime.setHours(newResetTime.getHours() + 24);
            setResetTime(newResetTime);
            await AsyncStorage.setItem('priceSettingsResetTime', JSON.stringify(newResetTime));

            Alert.alert('Price Settings Reset', 'Price settings have been reset for the new 24-hour period.');
        } catch (error) {
            console.error('Failed to reset price settings:', error);
        }
    };

    // Initial data load
    useEffect(() => {
        fetchPriceSettings();
    }, []);

    // Set up timer for countdown
    useEffect(() => {
        checkResetTime();
        const timer = setInterval(checkResetTime, 60000); // Update every minute

        return () => clearInterval(timer);
    }, [checkResetTime]);

    // Handle refresh
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchPriceSettings();
    }, []);

    // Filter settings based on category and search query
    useEffect(() => {
        let filtered = [...originalSettings];

        // Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(item => item.category === selectedCategory);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const lowercaseQuery = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(lowercaseQuery) ||
                item.category.toLowerCase().includes(lowercaseQuery)
            );
        }

        setPriceSettings(filtered);
    }, [selectedCategory, searchQuery, originalSettings]);

    // Handle price change
    const handlePriceChange = (itemName, price) => {
        const updatedSettings = priceSettings.map(item => {
            if (item.name === itemName) {
                return { ...item, pricePerUnit: price };
            }
            return item;
        });
        setPriceSettings(updatedSettings);
    };

    // Save all price settings at once
    const saveAllPriceSettings = async () => {
        try {
            setSavingAll(true);
            const token = await AsyncStorage.getItem('token');

            // Validate all prices
            const invalidItems = priceSettings.filter(item =>
                !item.pricePerUnit ||
                isNaN(parseFloat(item.pricePerUnit)) ||
                parseFloat(item.pricePerUnit) <= 0
            );

            if (invalidItems.length > 0) {
                Alert.alert('Error', `Please enter valid prices for all items (${invalidItems.length} items have invalid prices)`);
                setSavingAll(false);
                return;
            }

            // Step 1: Fetch all existing items from the server
            const response = await axios.get('http://localhost:8080/api/admin/price-settings', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const existingItems = response.data;
            console.log("Existing Items", existingItems);

            // Step 2: Create promises based on name matching
            const updatePromises = priceSettings.map(item => {
                const priceToSave = typeof item.pricePerUnit === 'string'
                    ? parseFloat(item.pricePerUnit)
                    : item.pricePerUnit;



                // Match by name
                const matchedItem = existingItems.find(existing => existing.itemName === item.name);
                console.log("matcheditem id", item.id);
                
                const data = {
                    itemId: item.id, // only if it exists
                    category: item.category,
                    itemName: item.name, // assuming "name" in frontend == itemName in backend
                    pricePerUnit: priceToSave,
                    unit: item.unit || null
                };

                if (matchedItem) {
                    // Perform PUT if same name exists
                    return axios.put(
                        `http://localhost:8080/api/admin/price-settings/${matchedItem.id}`,
                        data,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                } else {
                    // Otherwise, perform POST
                    return axios.post(
                        `http://localhost:8080/api/admin/price-settings`,
                        data,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                }
            });

            // Step 3: Execute all requests
            await Promise.all(updatePromises);

            // Update original settings
            setOriginalSettings([...priceSettings]);

            setSuccessMessage('All prices updated successfully!');
            setSuccessModalVisible(true);
        } catch (error) {
            console.error('Failed to update all price settings:', error);
            Alert.alert('Error', 'Failed to update prices. Please try again.');
        } finally {
            setSavingAll(false);
        }
    };


    // Debounce search to improve performance
    const debouncedSearch = useCallback(
        debounce((text) => {
            setSearchQuery(text);
        }, 300),
        []
    );

    // Render header for each category group
    const renderSectionHeader = ({ category }) => (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' & ')}</Text>
        </View>
    );

    // Group items by category for better visualization
    const groupedSettings = () => {
        const grouped = {};

        priceSettings.forEach(item => {
            if (!grouped[item.category]) {
                grouped[item.category] = [];
            }
            grouped[item.category].push(item);
        });

        return Object.keys(grouped).map(category => ({
            category,
            data: grouped[category]
        }));
    };

    // Render item row
    const renderItem = ({ item }) => (
        <View style={styles.itemRow}>
            <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemUnit}>({item.unit})</Text>
            </View>
            <View style={styles.quantityColumn}>
                <Text style={styles.quantityText}>{item.quantity}</Text>
            </View>
            <View style={styles.priceInputContainer}>
                <Text style={styles.currencyLabel}>LKR</Text>
                <TextInput
                    style={styles.priceInput}
                    value={item.pricePerUnit ? item.pricePerUnit.toString() : ''}
                    onChangeText={(text) => handlePriceChange(item.name, text)}
                    keyboardType="numeric"
                    placeholder="0.00"
                />
            </View>
        </View>
    );

    // Render section
    const renderSection = ({ item }) => (
        <View style={styles.section}>
            {renderSectionHeader(item)}
            {item.data.map(setting => (
                <View key={setting.id}>
                    {renderItem({ item: setting })}
                </View>
            ))}
        </View>
    );

    if (loading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Loading price settings...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingContainer}
            >
                {/* Success Modal */}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={successModalVisible}
                    onRequestClose={() => setSuccessModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Ionicons name="checkmark-circle" size={50} color={COLORS.primary} />
                                <Text style={styles.modalTitle}>Success</Text>
                            </View>
                            <Text style={styles.modalMessage}>{successMessage}</Text>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.okButton]}
                                onPress={() => setSuccessModalVisible(false)}
                            >
                                <Text style={styles.okButtonText}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color={COLORS.textDark} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Admin Price Settings</Text>
                    <View style={{ width: 24 }} />
                </View>

                {/* Timer Section */}
                <View style={styles.timerSection}>
                    <Ionicons name="timer-outline" size={20} color={COLORS.primary} />
                    <Text style={styles.timerText}>
                        Prices reset in: <Text style={styles.timerValue}>{timeRemaining}</Text>
                    </Text>
                </View>

                {/* Search and Filter */}
                <View style={styles.searchFilterContainer}>
                    <View style={styles.searchContainer}>
                        <Ionicons name="search" size={20} color={COLORS.textLight} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search items..."
                            onChangeText={(text) => debouncedSearch(text)}
                            clearButtonMode="while-editing"
                        />
                    </View>

                    <View style={styles.filterContainer}>
                        <Text style={styles.filterLabel}>Category:</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={selectedCategory}
                                onValueChange={(value) => setSelectedCategory(value)}
                                style={styles.picker}
                            >
                                <Picker.Item label="All Categories" value="all" />
                                {categories.map((category) => (
                                    <Picker.Item
                                        key={category}
                                        label={category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' & ')}
                                        value={category}
                                    />
                                ))}
                            </Picker>
                        </View>
                    </View>
                </View>

                {/* Table Header */}
                <View style={styles.tableHeader}>
                    <Text style={[styles.columnHeader, styles.categoryHeader]}>Item</Text>
                    <Text style={[styles.columnHeader, styles.quantityHeader]}>Quantity</Text>
                    <Text style={[styles.columnHeader, styles.priceHeader]}>Price (LKR)</Text>
                </View>

                {/* Price Settings List */}
                <FlatList
                    data={groupedSettings()}
                    renderItem={renderSection}
                    keyExtractor={(item) => item.category}
                    contentContainerStyle={styles.listContainer}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="alert-circle-outline" size={50} color={COLORS.textLight} />
                            <Text style={styles.emptyText}>No items found</Text>
                            <Text style={styles.emptySubText}>Try adjusting your search or filter</Text>
                        </View>
                    }
                />

                {/* Save All Button */}
                {priceSettings.length > 0 && (
                    <TouchableOpacity
                        style={[styles.saveAllButton, savingAll && styles.disabledButton]}
                        onPress={saveAllPriceSettings}
                        disabled={savingAll}
                    >
                        {savingAll ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text style={styles.saveAllButtonText}>Save All Prices</Text>
                        )}
                    </TouchableOpacity>
                )}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    keyboardAvoidingContainer: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: COLORS.textDark,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textDark,
    },
    timerSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        backgroundColor: '#f0f8ff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    timerText: {
        marginLeft: 5,
        fontSize: 14,
        color: COLORS.textDark,
    },
    timerValue: {
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    searchFilterContainer: {
        padding: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    searchInput: {
        flex: 1,
        height: 40,
        paddingHorizontal: 10,
        fontSize: 16,
    },
    filterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    filterLabel: {
        fontSize: 16,
        fontWeight: '500',
        marginRight: 10,
        color: COLORS.textDark,
    },
    pickerContainer: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        overflow: 'hidden',
    },
    picker: {
        height: 40,
        width: '100%',
    },
    tableHeader: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 12,
        backgroundColor: COLORS.primary,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    columnHeader: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#fff',
    },
    categoryHeader: {
        flex: 2,
    },
    quantityHeader: {
        flex: 1,
        textAlign: 'center',
    },
    priceHeader: {
        flex: 1.5,
        textAlign: 'center',
    },
    actionHeader: {
        flex: 1,
        textAlign: 'center',
    },
    listContainer: {
        paddingBottom: 80,
    },
    section: {
        marginBottom: 10,
    },
    sectionHeader: {
        backgroundColor: '#e0f2f1',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#cfd8dc',
    },
    sectionHeaderText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textDark,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    itemInfo: {
        flex: 2,
    },
    itemName: {
        fontSize: 15,
        fontWeight: '500',
        color: COLORS.textDark,
    },
    itemUnit: {
        fontSize: 12,
        color: COLORS.textLight,
        marginTop: 2,
    },
    quantityColumn: {
        flex: 1,
        alignItems: 'center',
    },
    quantityText: {
        fontSize: 14,
        color: COLORS.textDark,
    },
    priceInputContainer: {
        flex: 1.5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    currencyLabel: {
        fontSize: 14,
        marginRight: 4,
        color: COLORS.textDark,
    },
    priceInput: {
        width: 80,
        height: 36,
        backgroundColor: '#f5f5f5',
        borderRadius: 4,
        paddingHorizontal: 8,
        fontSize: 14,
        textAlign: 'right',
    },
    confirmButton: {
        flex: 1,
        backgroundColor: COLORS.primary,
        paddingVertical: 8,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
    },
    disabledButton: {
        backgroundColor: '#b0bec5',
    },
    saveAllButton: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: COLORS.primary,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    saveAllButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textDark,
        marginTop: 10,
    },
    emptySubText: {
        fontSize: 14,
        color: COLORS.textLight,
        marginTop: 5,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        width: '80%',
        alignItems: 'center',
    },
    modalHeader: {
        alignItems: 'center',
        marginBottom: 15,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.textDark,
        marginTop: 10,
    },
    modalMessage: {
        fontSize: 16,
        textAlign: 'center',
        color: COLORS.textDark,
        marginBottom: 20,
    },
    modalButton: {
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 6,
        minWidth: 120,
        alignItems: 'center',
    },
    okButton: {
        backgroundColor: COLORS.primary,
    },
    okButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
});

export default AdminPriceSettingScreen;