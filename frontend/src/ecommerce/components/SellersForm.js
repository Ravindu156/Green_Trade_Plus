import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Button,
  FlatList,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function SellersForm() {
  const [productName, setProductName] = useState('');
  const [productPhotos, setProductPhotos] = useState([]); // Changed to array
  const [sizeChart, setSizeChart] = useState(null);
  const [sizeDetails, setSizeDetails] = useState({});
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [color, setColor] = useState('Red');
  const [category, setCategory] = useState('Clothing');
  const [size, setSize] = useState('M');

  const handleImagePick = (setter) => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.assets && response.assets.length > 0) {
        setter(response.assets[0]);
      }
    });
  };

  const handleProductPhotoPick = () => {
    if (productPhotos.length >= 5) {
      alert('Maximum 5 photos allowed');
      return;
    }

    ImagePicker.launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.assets && response.assets.length > 0) {
        setProductPhotos(prev => [...prev, response.assets[0]]);
      }
    });
  };

  const removeProductPhoto = (indexToRemove) => {
    setProductPhotos(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      const token = await AsyncStorage.getItem('token');
      const user = JSON.parse(userData);
      const userId = user.id;

      const formData = new FormData();
      formData.append('seller', userId);
      formData.append('itemName', productName);
      formData.append('category', category);
      formData.append('stock', stock);
      formData.append('size', size);
      formData.append('color', color);
      formData.append('price', unitPrice);
      formData.append('description', description);

      // Enhanced logging for debugging
      console.log('=== FormData Debug ===');
      console.log('ProductPhotos array length:', productPhotos.length);
      console.log('SizeChart exists:', !!sizeChart);

      // Log each photo being added
      productPhotos.forEach((photo, index) => {
        console.log(`Photo ${index} details:`, {
          uri: photo.uri,
          fileName: photo.fileName,
          type: photo.type,
          hasUri: !!photo.uri
        });
      });

      // FIXED: Handle file uploads for React Native Web
      // Convert data URIs to Files for web, or use objects for native
      const processFile = async (fileData, defaultName) => {
        if (fileData.uri && fileData.uri.startsWith('data:')) {
          // For React Native Web - convert data URI to File
          const response = await fetch(fileData.uri);
          const blob = await response.blob();
          return new File([blob], fileData.fileName || defaultName, {
            type: fileData.type || 'image/jpeg'
          });
        } else {
          // For React Native mobile - use object format
          return {
            uri: fileData.uri,
            name: fileData.fileName || defaultName,
            type: fileData.type || 'image/jpeg',
          };
        }
      };

      // Process product photos
      for (let i = 0; i < productPhotos.length; i++) {
        const photo = productPhotos[i];
        console.log(`Processing productPhoto[${i}]:`, photo.uri);

        try {
          const processedFile = await processFile(photo, `photo${i}.jpg`);
          formData.append('productPhotos', processedFile);
          console.log(`Added productPhoto[${i}] to FormData`);
        } catch (error) {
          console.error(`Error processing photo ${i}:`, error);
        }
      }

      // Process size chart
      if (sizeChart) {
        console.log('Processing sizeChart:', sizeChart.uri);
        try {
          const processedSizeChart = await processFile(sizeChart, 'size_chart.jpg');
          formData.append('sizeChart', processedSizeChart);
          console.log('Added sizeChart to FormData');
        } catch (error) {
          console.error('Error processing size chart:', error);
        }
      }

      console.log('Sending request to backend...');
      const response = await axios.post('http://localhost:8080/api/items', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Product submitted:', response.data);
      alert('Product submitted successfully!');

      // Reset form after successful submission
      setProductName('');
      setProductPhotos([]);
      setSizeChart(null);
      setDescription('');
      setStock('');
      setUnitPrice('');
      setColor('Red');
      setCategory('Clothing');
      setSize('M');

    } catch (error) {
      console.error('Error submitting product:', error.response?.data || error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      }
      alert('Failed to submit product. Check console for details.');
    }
  };



  const renderProductPhoto = ({ item, index }) => (
    <View style={styles.photoContainer}>
      <Image source={{ uri: item.uri }} style={styles.image} />
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeProductPhoto(index)}
      >
        <Text style={styles.removeButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Product Details</Text>

      <Text style={styles.label}>Product Name</Text>
      <TextInput
        style={styles.input}
        value={productName}
        onChangeText={setProductName}
        placeholder="Enter product name"
      />

      <Text style={styles.label}>Category</Text>
      <Picker
        selectedValue={category}
        style={styles.input}
        onValueChange={(itemValue) => setCategory(itemValue)}>
        <Picker.Item label="Plastic Boxes" value="Plastic Boxes" />
        <Picker.Item label="Steel Boxes" value="Steel Boxes" />
        <Picker.Item label="Wooden Boxes" value="Wooden Boxes" />
      </Picker>

      <Text style={styles.label}>No of Stocks</Text>
      <TextInput
        style={styles.input}
        value={stock}
        onChangeText={setStock}
        placeholder="Enter total stocks"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Unit Price</Text>
      <TextInput
        style={styles.input}
        value={unitPrice}
        onChangeText={setUnitPrice}
        placeholder="Enter unit price"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Color</Text>
      <Picker
        selectedValue={color}
        style={styles.input}
        onValueChange={(itemValue) => setColor(itemValue)}>
        <Picker.Item label="Red" value="Red" />
        <Picker.Item label="Blue" value="Blue" />
        <Picker.Item label="Green" value="Green" />
        <Picker.Item label="Black" value="Black" />
        <Picker.Item label="White" value="White" />
      </Picker>

      <Text style={styles.label}>Size</Text>
      <Picker
        selectedValue={size}
        style={styles.input}
        onValueChange={(itemValue) => setSize(itemValue)}>
        <Picker.Item label="XS" value="XS" />
        <Picker.Item label="S" value="S" />
        <Picker.Item label="M" value="M" />
        <Picker.Item label="L" value="L" />
        <Picker.Item label="XL" value="XL" />
      </Picker>

      <Text style={styles.label}>Upload Product Photos ({productPhotos.length}/5)</Text>
      <Button
        title="Add Product Photo"
        onPress={handleProductPhotoPick}
        disabled={productPhotos.length >= 5}
      />

      {productPhotos.length > 0 && (
        <FlatList
          data={productPhotos}
          renderItem={renderProductPhoto}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.photoList}
        />
      )}

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        multiline
        value={description}
        onChangeText={setDescription}
        placeholder="Enter product description"
      />

      <Text style={styles.label}>Upload Size Chart</Text>
      <Button title="Choose Size Chart Image" onPress={() => handleImagePick(setSizeChart)} />
      {sizeChart && <Image source={{ uri: sizeChart.uri }} style={styles.image} />}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit Product</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  label: { fontWeight: 'bold', marginTop: 16, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
  },
  image: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 8,
  },
  photoContainer: {
    position: 'relative',
    marginRight: 10,
  },
  photoList: {
    marginTop: 10,
    marginBottom: 10,
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 14,
    marginTop: 30,
    alignItems: 'center',
    borderRadius: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});