import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
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

  if (!product) return <ActivityIndicator size="large" style={styles.loader} />;

  const handleBuyNow = () => {
    console.log('Buy Now clicked for:', product.itemName);
  };

  const handleAddToCart = () => {
    console.log('Add to Cart clicked for:', product.itemName);
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.name}>{product.itemName}</Text>
        <Image source={{ uri: product.productPhotoUrls[0] }} style={styles.image} />
        <Text style={styles.price}>Rs.{product.price}</Text>
        <Text style={styles.stock}>Stock: {product.stock}</Text>
        <Text style={styles.color}>Color: {product.color}</Text>
        <Text style={styles.size}>Size: {product.size}</Text>
        <Text style={styles.description}>{product.description}</Text>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cartButton} onPress={handleAddToCart}>
          <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyButton} onPress={handleBuyNow}>
          <Text style={styles.buttonText}>Buy Now</Text>
        </TouchableOpacity>
        <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Cart')}
        >
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: 20,
    paddingBottom: 100,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  price: {
    fontSize: 18,
    color: 'green',
    marginVertical: 5,
  },
  stock: {
    fontSize: 16,
    marginVertical: 2,
  },
  color: {
    fontSize: 16,
    marginVertical: 2,
  },
  size: {
    fontSize: 16,
    marginVertical: 2,
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginTop: 10,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'space-between',
  },
  cartButton: {
    flex: 1,
    backgroundColor: '#ffc107',
    padding: 12,
    borderRadius: 5,
    marginRight: 5,
    alignItems: 'center',
  },
  buyButton: {
    flex: 1,
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 5,
    marginLeft: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
