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

const sizes = ['XS', 'S', 'M', 'L', 'XL'];
const colors = ['red', 'green', 'blue', 'black', 'white','yellow'];

export default function SellersForm() {
  const [productName, setProductName] = useState('');
  const [productPhoto, setProductPhoto] = useState(null);
  const [sizeChart, setSizeChart] = useState(null);
  const [sizeDetails, setSizeDetails] = useState({});
  const [description, setDescription] = useState('');

  const handleImagePick = (setter) => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.assets && response.assets.length > 0) {
        setter(response.assets[0]);
      }
    });
  };

  const toggleSize = (size) => {
    setSizeDetails((prev) => {
      const updated = { ...prev };
      if (updated[size]) {
        delete updated[size]; // remove if already selected
      } else {
        updated[size] = { stock: '', price: '', colors: [] };
      }
      return updated;
    });
  };

  const updateSizeField = (size, field, value) => {
    setSizeDetails((prev) => ({
      ...prev,
      [size]: { ...prev[size], [field]: value },
    }));
  };

  const toggleColorForSize = (size, color) => {
    setSizeDetails((prev) => {
      const currentColors = prev[size].colors;
      const newColors = currentColors.includes(color)
        ? currentColors.filter((c) => c !== color)
        : [...currentColors, color];

      return {
        ...prev,
        [size]: { ...prev[size], colors: newColors },
      };
    });
  };

  const handleSubmit = () => {
    const formData = {
      productName,
      productPhoto,
      sizeChart,
      sizeDetails,
      description,
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

      <Text style={styles.label}>Upload Product Photo</Text>
      <Button title="Choose Product Image" onPress={() => handleImagePick(setProductPhoto)} />
      {productPhoto && <Image source={{ uri: productPhoto.uri }} style={styles.image} />}

      <Text style={styles.label}>Available Sizes</Text>
      <View style={styles.sizeContainer}>
        {sizes.map((size) => (
          <TouchableOpacity
            key={size}
            style={[
              styles.sizeBox,
              sizeDetails[size] && styles.selectedSizeBox,
            ]}
            onPress={() => toggleSize(size)}
          >
            <Text style={styles.sizeText}>{size}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {Object.keys(sizeDetails).map((size) => (
        <View key={size} style={styles.sizeInputBlock}>
          <Text style={styles.subTitle}>Details for size {size}</Text>
          <View style={styles.sizeInputRow}>
            <TextInput
              placeholder="Stock"
              keyboardType="numeric"
              style={styles.smallInput}
              value={sizeDetails[size].stock}
              onChangeText={(text) => updateSizeField(size, 'stock', text)}
            />
            <TextInput
              placeholder="Price"
              keyboardType="numeric"
              style={styles.smallInput}
              value={sizeDetails[size].price}
              onChangeText={(text) => updateSizeField(size, 'price', text)}
            />
          </View>
          <Text style={{ marginTop: 5 }}>Select Colors:</Text>
          <View style={styles.colorContainer}>
            {colors.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorBox,
                  { backgroundColor: color },
                  sizeDetails[size].colors.includes(color) && styles.selectedColorBox,
                ]}
                onPress={() => toggleColorForSize(size, color)}
              />
            ))}
          </View>
        </View>
      ))}

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
  sizeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  sizeBox: {
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 6,
    padding: 10,
    margin: 5,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedSizeBox: {
    backgroundColor: '#d0e8ff',
    borderColor: '#007aff',
  },
  sizeText: { fontWeight: '600' },
  sizeInputBlock: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  subTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  sizeInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 5,
  },
  smallInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 6,
    width: 70,
    marginRight: 10,
    borderRadius: 4,
  },
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  colorBox: {
    width: 40,
    height: 40,
    margin: 5,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColorBox: {
    borderColor: '#000',
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
