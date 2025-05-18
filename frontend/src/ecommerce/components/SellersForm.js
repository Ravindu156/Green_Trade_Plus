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
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import { Picker } from '@react-native-picker/picker';

export default function SellersForm() {
  const [productName, setProductName] = useState('');
  const [productPhoto, setProductPhoto] = useState(null);
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

  const handleSubmit = () => {
    const formData = {
      productName,
      productPhoto,
      sizeChart,
      sizeDetails,
      description,
      stock,
      unitPrice,
      color,
      category,
      size,
    };
    console.log('Submitted data:', formData);
    alert('Product submitted! Check console for data.');
  };

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

      <Text style={styles.label}>Upload Product Photo</Text>
      <Button title="Choose Product Image" onPress={() => handleImagePick(setProductPhoto)} />
      {productPhoto && <Image source={{ uri: productPhoto.uri }} style={styles.image} />}

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
