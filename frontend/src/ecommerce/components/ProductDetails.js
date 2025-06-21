import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import Constants from 'expo-constants';

export default function ProductDetails({ route, navigation }) {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const { API_URL } = Constants.expoConfig.extra;

  useEffect(() => {
    axios.get(`http://${API_URL}:8080/api/items/${productId}`)
      .then(response => setProduct(response.data))
      .catch(error => console.error(error));
  }, [productId]);

  const handleBuyNow = () => {
    console.log('Buy Now clicked for:', product.itemName);
  };

  const handleAddToCart = () => {
    console.log('Add to Cart clicked for:', product.itemName);
  };

  if (!product) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading product details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.imageCard}>
          <Image source={{ uri: product.productPhotoUrls[0] }} style={styles.image} />
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.title}>{product.itemName}</Text>
          <Text style={styles.price}>Rs. {product.price.toFixed(2)}</Text>

          <View style={styles.specsRow}>
            <MaterialCommunityIcons name="warehouse" size={20} color="#666" />
            <Text style={styles.specText}>Stock: {product.stock}</Text>
          </View>
          <View style={styles.specsRow}>
            <MaterialCommunityIcons name="palette" size={20} color="#666" />
            <Text style={styles.specText}>Color: {product.color}</Text>
          </View>
          <View style={styles.specsRow}>
            <MaterialCommunityIcons name="ruler" size={20} color="#666" />
            <Text style={styles.specText}>Size: {product.size}</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{product.description || 'No description available.'}</Text>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.cartButton]} onPress={handleAddToCart}>
          <Ionicons name="cart-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.buyButton]} onPress={handleBuyNow}>
          <Ionicons name="flash" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f2f5f9',
  },
  scrollContainer: {
    paddingBottom: 140,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f5f9',
  },
  loadingText: {
    marginTop: 12,
    color: '#777',
    fontSize: 16,
  },

  imageCard: {
    borderRadius: 15,
    backgroundColor: '#fff',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    marginBottom: 20,
  },
  image: {
    width: screenWidth - 40,
    height: (screenWidth - 40) * 0.8,
    borderRadius: 15,
  },

  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#222',
    marginBottom: 8,
  },

  price: {
    fontSize: 22,
    fontWeight: '700',
    color: '#e63946',
    marginBottom: 18,
  },

  specsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  specText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  },

  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 18,
    borderRadius: 1,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },

  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#666',
  },

  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 20,
    paddingVertical: 15,
    justifyContent: 'space-between',
  },

  button: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  cartButton: {
    backgroundColor: '#f39c12',
    marginRight: 12,
  },

  buyButton: {
    backgroundColor: '#27ae60',
  },

  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
