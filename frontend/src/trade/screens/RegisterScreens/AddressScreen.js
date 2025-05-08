// AddressScreen.js - Third step of registration

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { COLORS } from '../../constants/colors';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import FormInput from './FormInput';
import Dropdown from './Dropdown';

const AddressScreen = ({ 
  formData, 
  updateFormData, 
  goToNextStep, 
  goToPreviousStep,
  errors 
}) => {
  // Mock data for Sri Lanka provinces, districts, and cities
  const provinces = [
    { label: 'Western Province', value: 'western' },
    { label: 'Central Province', value: 'central' },
    { label: 'Southern Province', value: 'southern' },
    { label: 'Northern Province', value: 'northern' },
    { label: 'Eastern Province', value: 'eastern' },
    { label: 'North Western Province', value: 'north_western' },
    { label: 'North Central Province', value: 'north_central' },
    { label: 'Uva Province', value: 'uva' },
    { label: 'Sabaragamuwa Province', value: 'sabaragamuwa' },
  ];

  // Districts by province (simplified)
  const districtsByProvince = {
    western: [
      { label: 'Colombo', value: 'colombo' },
      { label: 'Gampaha', value: 'gampaha' },
      { label: 'Kalutara', value: 'kalutara' },
    ],
    central: [
      { label: 'Kandy', value: 'kandy' },
      { label: 'Matale', value: 'matale' },
      { label: 'Nuwara Eliya', value: 'nuwara_eliya' },
    ],
    southern: [
      { label: 'Galle', value: 'galle' },
      { label: 'Matara', value: 'matara' },
      { label: 'Hambantota', value: 'hambantota' },
    ],
    northern: [
      { label: 'Jaffna', value: 'jaffna' },
      { label: 'Kilinochchi', value: 'kilinochchi' },
      { label: 'Mannar', value: 'mannar' },
      { label: 'Vavuniya', value: 'vavuniya' },
      { label: 'Mullaitivu', value: 'mullaitivu' },
    ],
    eastern: [
      { label: 'Batticaloa', value: 'batticaloa' },
      { label: 'Ampara', value: 'ampara' },
      { label: 'Trincomalee', value: 'trincomalee' },
    ],
    north_western: [
      { label: 'Kurunegala', value: 'kurunegala' },
      { label: 'Puttalam', value: 'puttalam' },
    ],
    north_central: [
      { label: 'Anuradhapura', value: 'anuradhapura' },
      { label: 'Polonnaruwa', value: 'polonnaruwa' },
    ],
    uva: [
      { label: 'Badulla', value: 'badulla' },
      { label: 'Monaragala', value: 'monaragala' },
    ],
    sabaragamuwa: [
      { label: 'Ratnapura', value: 'ratnapura' },
      { label: 'Kegalle', value: 'kegalle' },
    ],
  };

  // Cities by district (simplified - just a few examples)
  const citiesByDistrict = {
    colombo: [
      { label: 'Colombo', value: 'colombo_city' },
      { label: 'Dehiwala', value: 'dehiwala' },
      { label: 'Moratuwa', value: 'moratuwa' },
    ],
    gampaha: [
      { label: 'Negombo', value: 'negombo' },
      { label: 'Wattala', value: 'wattala' },
      { label: 'Ja-Ela', value: 'ja_ela' },
    ],
    kandy: [
      { label: 'Kandy City', value: 'kandy_city' },
      { label: 'Peradeniya', value: 'peradeniya' },
      { label: 'Katugastota', value: 'katugastota' },
    ],
    galle: [
      { label: 'Galle City', value: 'galle_city' },
      { label: 'Ambalangoda', value: 'ambalangoda' },
      { label: 'Hikkaduwa', value: 'hikkaduwa' },
    ],
    // Add more cities for other districts as needed
  };

  // State for available options
  const [availableDistricts, setAvailableDistricts] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);

  // Update districts when province changes
  useEffect(() => {
    if (formData.province) {
      setAvailableDistricts(districtsByProvince[formData.province] || []);
      
      // Reset district and city if province changes
      if (!districtsByProvince[formData.province]?.find(d => d.value === formData.district)) {
        updateFormData({ district: '', city: '' });
      }
    } else {
      setAvailableDistricts([]);
      updateFormData({ district: '', city: '' });
    }
  }, [formData.province]);

  // Update cities when district changes
  useEffect(() => {
    if (formData.district) {
      setAvailableCities(citiesByDistrict[formData.district] || []);
      
      // Reset city if district changes
      if (!citiesByDistrict[formData.district]?.find(c => c.value === formData.city)) {
        updateFormData({ city: '' });
      }
    } else {
      setAvailableCities([]);
      updateFormData({ city: '' });
    }
  }, [formData.district]);

  const handleInputChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={goToPreviousStep}
          >
            <AntDesign name="arrowleft" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>Your Address</Text>
        </View>
        
        <View style={styles.formContainer}>
          <FormInput
            label="Address Line 1"
            placeholder="Enter your street address"
            value={formData.addressLineOne}
            onChangeText={(text) => handleInputChange('addressLineOne', text)}
            error={errors.addressLineOne}
            leftIcon={<Ionicons name="location-outline" size={20} color={COLORS.textSecondary} />}
          />
          
          <FormInput
            label="Address Line 2 (Optional)"
            placeholder="Apartment, suite, unit, etc."
            value={formData.addressLineTwo}
            onChangeText={(text) => handleInputChange('addressLineTwo', text)}
            error={errors.addressLineTwo}
          />
          
          <Dropdown
            label="Province"
            placeholder="Select your province"
            options={provinces}
            value={formData.province}
            onChange={(value) => handleInputChange('province', value)}
            error={errors.province}
          />
          
          <Dropdown
            label="District"
            placeholder="Select your district"
            options={availableDistricts}
            value={formData.district}
            onChange={(value) => handleInputChange('district', value)}
            error={errors.district}
            disabled={!formData.province}
          />
          
          <Dropdown
            label="City"
            placeholder="Select your city"
            options={availableCities}
            value={formData.city}
            onChange={(value) => handleInputChange('city', value)}
            error={errors.city}
            disabled={!formData.district}
          />
          
          <FormInput
            label="Phone Number"
            placeholder="Enter your phone number"
            value={formData.phoneNumber}
            onChangeText={(text) => handleInputChange('phoneNumber', text)}
            error={errors.phoneNumber}
            leftIcon={<Ionicons name="call-outline" size={20} color={COLORS.textSecondary} />}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.spacer} />
      </ScrollView>
      
      <TouchableOpacity 
        style={styles.nextButton} 
        onPress={goToNextStep}
      >
        <AntDesign name="arrowright" size={24} color="white" />
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 10,
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginLeft: 15,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  nextButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    right: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  spacer: {
    height: 80,
  },
});

export default AddressScreen;