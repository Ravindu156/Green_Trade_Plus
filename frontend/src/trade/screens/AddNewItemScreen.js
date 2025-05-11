import React, { useState } from 'react';
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
  Modal
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

  // Units for quantity
  const units = [
    { label: 'Kilogram (kg)', value: 'kg' },
    { label: 'Gram (g)', value: 'g' },
    { label: 'Pound (lb)', value: 'lb' },
    { label: 'Piece', value: 'piece' },
    { label: 'Dozen', value: 'dozen' },
    { label: 'Bunch', value: 'bunch' },
  ];

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

            {/* Item Name */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Item Name</Text>
              <TextInput
                style={[styles.input, nameError ? styles.inputError : null]}
                placeholder="Enter item name"
                value={name}
                onChangeText={setName}
              />
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
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
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
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 16,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 5,
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  quantityContainer: {
    flexDirection: 'row',
  },
  quantityInput: {
    flex: 2,
    marginRight: 10,
  },
  unitPickerContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  unitPicker: {
    height: 50,
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 30,
  },
  radioButton: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
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
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '90%',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginTop: 10,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    color: COLORS.textDark,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'column',
    width: '100%',
  },
  modalButton: {
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginVertical: 6,
  },
  okButton: {
    backgroundColor: COLORS.primary,
  },
  okButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addAnotherButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  addAnotherButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddNewItemScreen;