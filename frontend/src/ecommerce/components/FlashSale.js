import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  FlatList,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import Constants from 'expo-constants';

const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 30) / 2;

export default function FlashSale({ navigation }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { API_URL } = Constants.expoConfig.extra;

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`http://${API_URL}:8080/api/items`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setItems(data);
    } catch (err) {
      setError(err.message);
      Alert.alert('Error', 'Failed to load items.', [
        { text: 'Retry', onPress: fetchItems },
        { text: 'Cancel', style: 'cancel' },
      ]);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchItems();
  }, []);

  const getItemImage = useCallback((item) => {
    if (item.productPhotoUrls && item.productPhotoUrls.length > 0) {
      return { uri: item.productPhotoUrls[0] };
    }
    return {
      uri: `https://via.placeholder.com/100x100.png?text=${encodeURIComponent(item.itemName.substring(0, 10))}`,
    };
  }, []);

  const formatPrice = useCallback((price) => `Rs.${price.toFixed(2)}`, []);

  const renderItem = useCallback(({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ProductDetails', { productId: item.item_id })}
    >
      <Image source={getItemImage(item)} style={styles.image} />
      {item.stock < 10 && (
        <View style={styles.lowStockBadge}>
          <Text style={styles.lowStockText}>Low Stock</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>{item.itemName}</Text>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.details}>{item.size} • {item.color}</Text>
        <Text style={styles.price}>{formatPrice(item.price)}</Text>
      </View>
    </TouchableOpacity>
  ), [navigation, getItemImage, formatPrice]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading flash sale items...</Text>
      </View>
    );
  }

  if (error && items.length === 0) {
    return (
      <View style={styles.center}>
        <MaterialIcons name="error-outline" size={48} color="#ff6b6b" />
        <Text style={styles.errorText}>Unable to load items</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchItems}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (latestItems.length === 0) {
    return (
      <View style={styles.center}>
        <FontAwesome5 name="shopping-bag" size={48} color="#ccc" />
        <Text style={styles.emptyText}>No items available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}> Flash Sale</Text>
        <TouchableOpacity onPress={fetchItems}>
          <Ionicons name="refresh" size={20} color="#007bff" />
        </TouchableOpacity>
      </View>
      {/* <FlatList
        data={latestItems}
        renderItem={renderItem}
        keyExtractor={(item, index) => `flashsale-${item.item_id}-${index}`}
        numColumns={2}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    width: cardWidth,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 12,
    marginHorizontal: 5,
    overflow: 'hidden',
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 120,
  },
  info: {
    padding: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
    color: '#333',
  },
  category: {
    fontSize: 12,
    color: '#666',
  },
  details: {
    fontSize: 11,
    color: '#888',
    marginBottom: 4,
  },
  price: {
    color: '#e74c3c',
    fontWeight: 'bold',
    fontSize: 14,
  },
  lowStockBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#ff6b6b',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 1,
  },
  lowStockText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  errorText: {
    marginTop: 10,
    color: '#ff6b6b',
    fontSize: 16,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 10,
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyText: {
    marginTop: 10,
    color: '#999',
    fontSize: 16,
  },
});
