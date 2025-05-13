import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
  FlatList
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { COLORS } from '../constants/colors';

const AddNewItemScreen = ({ navigation }) => {
  // Form state
  const [category, setCategory] = useState('vegetables');
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('kg');
  const [isOrganic, setIsOrganic] = useState(true);
  const [description, setDescription] = useState('');
  
  // Dropdown state
  const [showItemDropdown, setShowItemDropdown] = useState(false);
  const [filteredItems, setFilteredItems] = useState([]);

  // Error states
  const [nameError, setNameError] = useState('');
  const [quantityError, setQuantityError] = useState('');

  // Modal state
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Food categories
  const categories = [
    { label: 'Vegetables', value: 'vegetables' },
    { label: 'Fruits', value: 'fruits' },
    { label: 'Grains', value: 'grains' },
    { label: 'Dairy', value: 'dairy' },
    { label: 'Herbs', value: 'herbs' },
    { label: 'Nuts & Seeds', value: 'nuts_seeds' },
  ];

  // Predefined items for each category
  const itemsByCategory = {
    vegetables: ['Carrot', 'Tomato', 'Potato', 'Onion', 'Spinach', 'Broccoli', 'Bell Pepper', 'Cucumber', 'Zucchini', 'Lettuce', 'Cabbage', 'Cauliflower', 'Eggplant', 'Radish', 'Green Beans', 'Asparagus'],
    fruits: ['Apple', 'Banana', 'Orange', 'Grapes', 'Strawberry', 'Mango', 'Pineapple', 'Watermelon', 'Blueberry', 'Kiwi', 'Peach', 'Pear', 'Cherry', 'Plum', 'Raspberry', 'Lemon'],
    grains: ['Rice', 'Wheat', 'Barley', 'Oats', 'Quinoa', 'Corn', 'Millet', 'Rye', 'Buckwheat', 'Amaranth', 'Bulgur', 'Farro'],
    dairy: ['Milk', 'Cheese', 'Yogurt', 'Butter', 'Cream', 'Cottage Cheese', 'Kefir', 'Buttermilk', 'Whey', 'Ghee', 'Paneer'],
    herbs: ['Basil', 'Parsley', 'Cilantro', 'Mint', 'Rosemary', 'Thyme', 'Oregano', 'Sage', 'Dill', 'Chives', 'Tarragon', 'Lemongrass'],
    nuts_seeds: ['Almonds', 'Walnuts', 'Cashews', 'Peanuts', 'Pistachios', 'Sunflower Seeds', 'Pumpkin Seeds', 'Chia Seeds', 'Flax Seeds', 'Sesame Seeds', 'Hazelnuts', 'Pine Nuts']
  };

  // Units for quantity
  const units = [
    { label: 'Kilogram (kg)', value: 'kg' },
    { label: 'Gram (g)', value: 'g' },
    { label: 'Pound (lb)', value: 'lb' },
    { label: 'Piece', value: 'piece' },
    { label: 'Dozen', value: 'dozen' },
    { label: 'Bunch', value: 'bunch' },
  ];

  // Update filtered items when category changes
  useEffect(() => {
    setName('');
    filterItems('');
  }, [category]);

  // Filter items based on user input
  const filterItems = (text) => {
    const categoryItems = itemsByCategory[category] || [];
    
    if (text === '') {
      setFilteredItems(categoryItems);
    } else {
      const filtered = categoryItems.filter(
        item => item.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredItems(filtered);
    }
    
    setShowItemDropdown(true);
  };

  // Handle item name change
  const handleNameChange = (text) => {
    setName(text);
    filterItems(text);
    setNameError('');
  };

  // Handle item selection from dropdown
  const handleItemSelect = (item) => {
    setName(item);
    setShowItemDropdown(false);
    setNameError('');
  };

  // Reset the form
  const resetForm = () => {
    setCategory('vegetables');
    setName('');
    setQuantity('');
    setUnit('kg');
    setIsOrganic(true);
    setDescription('');
    setNameError('');
    setQuantityError('');
    setShowItemDropdown(false);
  };

  // Validate form fields
  const validateForm = () => {
    let isValid = true;

    // Validate name
    if (!name.trim()) {
      setNameError('Item name is required');
      isValid = false;
    } else {
      setNameError('');
    }

    // Validate quantity
    if (!quantity.trim()) {
      setQuantityError('Quantity is required');
      isValid = false;
    } else if (isNaN(Number(quantity)) || Number(quantity) <= 0) {
      setQuantityError('Please enter a valid quantity');
      isValid = false;
    } else {
      setQuantityError('');
    }

    return isValid;
  };

  // Handle form submission
  const handleSubmit = async () => {
    const userData = await AsyncStorage.getItem('user');
    const user = JSON.parse(userData);
    const userId = user.id;
    if (validateForm()) {
      setIsSubmitting(true);
      const newItem = {
        userId:userId,
        category,
        name,
        quantity: Number(quantity),
        unit,
        isOrganic,
        description,
        dateAdded: new Date().toISOString(),
      };

      try {
        // Make POST request to backend
        const response = await axios.post('http://localhost:8080/api/trade-items', newItem);

        if (response.status === 201 || response.status === 200) {
          // Show success modal instead of Alert
          setSuccessModalVisible(true);
        } else {
          Alert.alert("Error", "Something went wrong. Please try again.");
        }
      } catch (error) {
        console.error('Failed to add item:', error.message);
        Alert.alert("Error", "Unable to connect to server. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Handle "Add Another One" button press
  const handleAddAnother = () => {
    resetForm();
    setSuccessModalVisible(false);
  };

  // Handle "OK" button press
  const handleOk = () => {
    setSuccessModalVisible(false);
    navigation.navigate('ProfileMain');
  };

  return (
    <SafeAreaView style={styles.container}>
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
            <Text style={styles.modalMessage}>You have successfully added new Item</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.addAnotherButton]}
                onPress={handleAddAnother}
              >
                <Text style={styles.addAnotherButtonText}>Add Another One</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.okButton]}
                onPress={handleOk}
              >
                <Text style={styles.okButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingContainer}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color={COLORS.textDark} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Add New Item</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Form Container */}
          <View style={styles.formContainer}>
            {/* Category Dropdown */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={category}
                  onValueChange={(itemValue) => setCategory(itemValue)}
                  style={styles.picker}
                >
                  {categories.map((cat) => (
                    <Picker.Item
                      key={cat.value}
                      label={cat.label}
                      value={cat.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Item Name with Dropdown */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Item Name</Text>
              <View style={styles.dropdownContainer}>
                <TextInput
                  style={[styles.input, nameError ? styles.inputError : null]}
                  placeholder={`Enter or select ${category}`}
                  value={name}
                  onChangeText={handleNameChange}
                  onFocus={() => filterItems(name)}
                  onBlur={() => {
                    // Delay hiding dropdown to allow for item selection
                    setTimeout(() => setShowItemDropdown(false), 200);
                  }}
                />
                <TouchableOpacity 
                  style={styles.dropdownIcon}
                  onPress={() => {
                    setShowItemDropdown(!showItemDropdown);
                    filterItems(name);
                  }}
                >
                  <Ionicons 
                    name={showItemDropdown ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color={COLORS.textDark} 
                  />
                </TouchableOpacity>
              </View>
              
              {/* Dropdown List */}
              {showItemDropdown && filteredItems.length > 0 && (
                <View style={styles.dropdown}>
                  <FlatList
                    data={filteredItems}
                    keyExtractor={(item, index) => index.toString()}
                    keyboardShouldPersistTaps="always"
                    nestedScrollEnabled={true}
                    style={styles.dropdownList}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.dropdownItem}
                        onPress={() => handleItemSelect(item)}
                      >
                        <Text style={styles.dropdownItemText}>{item}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              )}
              
              {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
            </View>

            {/* Quantity and Unit */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Quantity</Text>
              <View style={styles.quantityContainer}>
                <TextInput
                  style={[
                    styles.input,
                    styles.quantityInput,
                    quantityError ? styles.inputError : null
                  ]}
                  placeholder="Enter quantity"
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="numeric"
                />
                <View style={styles.unitPickerContainer}>
                  <Picker
                    selectedValue={unit}
                    onValueChange={(itemValue) => setUnit(itemValue)}
                    style={styles.unitPicker}
                  >
                    {units.map((u) => (
                      <Picker.Item
                        key={u.value}
                        label={u.label}
                        value={u.value}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
              {quantityError ? <Text style={styles.errorText}>{quantityError}</Text> : null}
            </View>

            {/* Organic Selection */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Product Type</Text>
              <View style={styles.radioContainer}>
                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => setIsOrganic(true)}
                >
                  <View style={styles.radioButton}>
                    {isOrganic && <View style={styles.radioButtonSelected} />}
                  </View>
                  <Text style={styles.radioLabel}>Organic</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => setIsOrganic(false)}
                >
                  <View style={styles.radioButton}>
                    {!isOrganic && <View style={styles.radioButtonSelected} />}
                  </View>
                  <Text style={styles.radioLabel}>Inorganic</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Description (Optional) */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Description (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter details about your product..."
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'Adding...' : 'Add Item'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  formContainer: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textDark,
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#DCDCDC',
    borderRadius: 8,
    backgroundColor: '#F9F9F9',
  },
  picker: {
    height: 50,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#DCDCDC',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
  },
  inputError: {
    borderColor: '#FF6B6B',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 14,
    marginTop: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityInput: {
    flex: 1,
    marginRight: 10,
  },
  unitPickerContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DCDCDC',
    borderRadius: 8,
    backgroundColor: '#F9F9F9',
  },
  unitPicker: {
    height: 50,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 25,
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioButtonSelected: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  radioLabel: {
    fontSize: 16,
    color: COLORS.textDark,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#A0A0A0',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 25,
    width: '80%',
    alignItems: 'center',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.textDark,
    marginTop: 10,
  },
  modalMessage: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 25,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  addAnotherButton: {
    backgroundColor: '#F5F5F5',
  },
  addAnotherButtonText: {
    color: COLORS.textDark,
    fontWeight: '500',
  },
  okButton: {
    backgroundColor: COLORS.primary,
  },
  okButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  // New styles for dropdown
  dropdownContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownIcon: {
    position: 'absolute',
    right: 12,
    height: 50,
    justifyContent: 'center',
  },
  dropdown: {
    position: 'relative',
    zIndex: 1000,
    width: '100%',
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#DCDCDC',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    marginTop: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dropdownList: {
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownItemText: {
    fontSize: 16,
    color: COLORS.textDark,
  }
});

export default AddNewItemScreen;