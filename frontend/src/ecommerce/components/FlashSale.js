import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

export default function FlashSale() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to fetch items from backend
    const fetchItems = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch('http://localhost:8080/api/items');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            setItems(data);
        } catch (err) {
            console.error('Error fetching items:', err);
            setError(err.message);
            Alert.alert(
                'Error',
                'Failed to load items. Please check your connection and try again.',
                [
                    { text: 'Retry', onPress: fetchItems },
                    { text: 'Cancel', style: 'cancel' }
                ]
            );
        } finally {
            setLoading(false);
        }
    };

    // Fetch items on component mount
    useEffect(() => {
        fetchItems();
    }, []);

    // Function to get display image for item
    const getItemImage = (item) => {
        if (item.productPhotoUrls && item.productPhotoUrls.length > 0) {
            return { uri: item.productPhotoUrls[0] };
        }
        // Fallback placeholder image
        return { uri: `https://via.placeholder.com/100x100.png?text=${encodeURIComponent(item.itemName.substring(0, 10))}` };
    };

    // Function to format price
    const formatPrice = (price) => {
        return `Rs.${price.toFixed(2)}`;
    };

    // Render loading state
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text style={styles.loadingText}>Loading flash sale items...</Text>
            </View>
        );
    }

    // Render error state
    if (error && items.length === 0) {
        return (
            <View style={styles.errorContainer}>
                <MaterialIcons name="error-outline" size={48} color="#ff6b6b" />
                <Text style={styles.errorText}>Unable to load items</Text>
                <TouchableOpacity style={styles.retryButton} onPress={fetchItems}>
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.sectionTitle}>Flash Sale</Text>
                <TouchableOpacity onPress={fetchItems}>
                    <Ionicons name="refresh" size={20} color="#007bff" />
                </TouchableOpacity>
            </View>
            
            {items.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <FontAwesome5 name="shopping-bag" size={48} color="#ccc" />
                    <Text style={styles.emptyText}>No items available</Text>
                </View>
            ) : (
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false} 
                    style={styles.productScroll}
                    contentContainerStyle={styles.productScrollContent}
                >
                    {items.map((item) => (
                        <TouchableOpacity key={item.item_id} style={styles.productCard}>
                            <View style={styles.imageContainer}>
                                <Image
                                    source={getItemImage(item)}
                                    style={styles.productImage}
                                    resizeMode="cover"
                                />
                                {item.stock < 10 && (
                                    <View style={styles.lowStockBadge}>
                                        <Text style={styles.lowStockText}>Low Stock</Text>
                                    </View>
                                )}
                            </View>
                            
                            <View style={styles.productInfo}>
                                <Text style={styles.productName} numberOfLines={2}>
                                    {item.itemName}
                                </Text>
                                
                                <View style={styles.productDetails}>
                                    <Text style={styles.category}>{item.category}</Text>
                                    <Text style={styles.sizeColor}>
                                        {item.size} • {item.color}
                                    </Text>
                                </View>
                                
                                <View style={styles.priceContainer}>
                                    <Text style={styles.price}>{formatPrice(item.price)}</Text>
                                    <Text style={styles.stock}>Stock: {item.stock}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 15,
        paddingHorizontal: 5,
    },
    sectionTitle: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    productScroll: {
        flexDirection: 'row',
    },
    productScrollContent: {
        paddingRight: 10,
    },
    productCard: {
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        marginRight: 12,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        width: 160,
    },
    imageContainer: {
        position: 'relative',
    },
    productImage: {
        width: '100%',
        height: 120,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    lowStockBadge: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: '#ff6b6b',
        borderRadius: 8,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    lowStockText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    productInfo: {
        padding: 10,
    },
    productName: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 5,
        color: '#333',
    },
    productDetails: {
        marginBottom: 8,
    },
    category: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
    },
    sizeColor: {
        fontSize: 11,
        color: '#888',
    },
    priceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        color: '#e74c3c',
        fontWeight: 'bold',
        fontSize: 14,
    },
    stock: {
        fontSize: 10,
        color: '#27ae60',
        fontWeight: '500',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
    },
    loadingText: {
        marginTop: 10,
        color: '#666',
        fontSize: 16,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
    },
    errorText: {
        marginTop: 10,
        marginBottom: 20,
        color: '#ff6b6b',
        fontSize: 16,
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: '#007bff',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    retryButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    emptyContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
    },
    emptyText: {
        marginTop: 10,
        color: '#999',
        fontSize: 16,
    },
    icon: {
        marginHorizontal: 5,
    },
});