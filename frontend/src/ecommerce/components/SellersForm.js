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
  ActivityIndicator,
  Modal
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';

export default function SellersForm() {
  const [productName, setProductName] = useState('');
  const [productPhotos, setProductPhotos] = useState([]);
  const [sizeChart, setSizeChart] = useState(null);
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [color, setColor] = useState('Red');
  const [category, setCategory] = useState('Clothing');
  const [size, setSize] = useState('M');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { API_URL } = Constants.expoConfig.extra;

  const handleImagePick = async (setter) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access media library is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setter(result.assets[0]);
    }
  };

  const getPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access media library is required!');
      return false;
    }
    return true;
  };

  const handleProductPhotoPick = async () => {
    const granted = await getPermission();
    if (!granted) return;

    if (productPhotos.length >= 5) {
      alert('Maximum 5 photos allowed');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProductPhotos(prev => [...prev, result.assets[0]]);
    }
  };

  const removeProductPhoto = (indexToRemove) => {
    setProductPhotos(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setUploadProgress(0);

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

      productPhotos.forEach((photo) => {
        formData.append('productPhotos', {
          uri: photo.uri,
          name: `product_${Date.now()}.${photo.uri.split('.').pop()}`,
          type: `image/${photo.uri.split('.').pop() === 'png' ? 'png' : 'jpeg'}`
        });
      });

      if (sizeChart) {
        formData.append('sizeChart', {
          uri: sizeChart.uri,
          name: `size_chart_${Date.now()}.${sizeChart.uri.split('.').pop()}`,
          type: `image/${sizeChart.uri.split('.').pop() === 'png' ? 'png' : 'jpeg'}`
        });
      }

      const response = await axios.post(
        `http://${API_URL}:8080/api/items`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
          timeout: 30000,
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          },
        }
      );

      console.log('Response:', response.data);
      alert('Product submitted successfully!');
      
      // Reset form
      // setProductName('');
      // setProductPhotos([]);
      // setSizeChart(null);
      // setDescription('');
      // setStock('');
      // setUnitPrice('');
      // setColor('Red');
      // setCategory('Clothing');
      // setSize('M');

    } catch (error) {
      console.error('Error:', error);
      alert(`Submission failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
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
        editable={!isSubmitting}
      />

      <Text style={styles.label}>Category</Text>
      <Picker
        selectedValue={category}
        style={styles.input}
        onValueChange={(itemValue) => setCategory(itemValue)}
        enabled={!isSubmitting}
      >
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
        editable={!isSubmitting}
      />

      <Text style={styles.label}>Unit Price</Text>
      <TextInput
        style={styles.input}
        value={unitPrice}
        onChangeText={setUnitPrice}
        placeholder="Enter unit price"
        keyboardType="numeric"
        editable={!isSubmitting}
      />

      <Text style={styles.label}>Color</Text>
      <Picker
        selectedValue={color}
        style={styles.input}
        onValueChange={(itemValue) => setColor(itemValue)}
        enabled={!isSubmitting}
      >
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
        onValueChange={(itemValue) => setSize(itemValue)}
        enabled={!isSubmitting}
      >
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
        disabled={productPhotos.length >= 5 || isSubmitting}
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
        editable={!isSubmitting}
      />

      <Text style={styles.label}>Upload Size Chart</Text>
      <Button 
        title="Choose Size Chart Image" 
        onPress={() => handleImagePick(setSizeChart)} 
        disabled={isSubmitting}
      />
      {sizeChart && <Image source={{ uri: sizeChart.uri }} style={styles.image} />}

      <TouchableOpacity 
        style={[
          styles.submitButton, 
          isSubmitting && styles.submitButtonDisabled
        ]} 
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Submit Product</Text>
        )}
      </TouchableOpacity>

      {/* Upload Progress Modal */}
      <Modal
        transparent={true}
        visible={isSubmitting}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ActivityIndicator size="large" color="#28a745" />
            <Text style={styles.modalText}>Uploading your product...</Text>
            <Text style={styles.progressText}>{uploadProgress}%</Text>
            <View style={styles.progressBarBackground}>
              <View 
                style={[
                  styles.progressBar, 
                  { width: `${uploadProgress}%` }
                ]} 
              />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    padding: 16, 
    backgroundColor: '#fff' 
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  label: { 
    fontWeight: 'bold', 
    marginTop: 16, 
    marginBottom: 4 
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#fff',
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
    marginBottom: 20,
    alignItems: 'center',
    borderRadius: 10,
  },
  submitButtonDisabled: {
    backgroundColor: '#6c757d',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  modalText: {
    marginTop: 15,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressText: {
    marginBottom: 10,
    fontSize: 14,
    color: '#28a745',
  },
  progressBarBackground: {
    height: 10,
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#28a745',
  },
});