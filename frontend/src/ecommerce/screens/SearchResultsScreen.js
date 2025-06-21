import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Constants from 'expo-constants';

export default function SearchResultsScreen({ route, navigation }) {
  const { query } = route.params;
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const { API_URL } = Constants.expoConfig.extra;

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`http://${API_URL}:8080/api/items/search?query=${query}`);
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ProductDetails', { productId: item.item_id })}
    >
      <Image
        source={{ uri: item.productPhotoUrls[0] || 'https://via.placeholder.com/100' }}
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{item.itemName}</Text>
        <Text style={styles.price}>Rs.{item.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Search Results for "{query}"</Text>
      <FlatList
        data={results}
        keyExtractor={(item) => item.item_id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 10 },
  header: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  card: { flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderColor: '#eee' },
  image: { width: 80, height: 80, borderRadius: 10 },
  info: { marginLeft: 10, flex: 1, justifyContent: 'center' },
  name: { fontSize: 16, fontWeight: 'bold' },
  price: { color: 'green', marginTop: 5 },
});
