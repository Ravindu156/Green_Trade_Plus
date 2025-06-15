// RegistrationProcess.js - Main component that manages all registration steps

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { COLORS } from '../../constants/colors';
import Toast from 'react-native-toast-message';
import Constants from 'expo-constants';

// Import all step screens
import UserTypeScreen from './UserTypeScreen';
import PersonalInfoScreen from './PersonalInfoScreen';
import AddressScreen from './AddressScreen';
import ProfilePhotoScreen from './ProfilePhotoScreen';
import RegistrationSuccess from './RegistrationSuccess';

// Progress indicator component
import ProgressIndicator from './ProgressIndicator';
import axios from 'axios';

const RegistrationProcess = ({ navigation }) => {
  // States for all form data
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    role: '',
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    gender: '',
    password: '',
    confirmPassword: '',
    addressLineOne: '',
    addressLineTwo: '',
    province: '',
    district: '',
    city: '',
    phoneNumber: '',
    profilePhoto: null,
    acceptedTerms: false
  });

  // State for validation errors
  const [errors, setErrors] = useState({});
  // State for submission status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { API_URL } = Constants.expoConfig.extra;

  // Function to update form data
  const updateFormData = (data) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  // Function to show toast messages
  const showToast = (type, title, message) => {
    Toast.show({
      type: type,
      text1: title,
      text2: message,
      position: 'top',
      visibilityTime: 3000,
    });
  };

  // Function to go to next step with validation
  const goToNextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => prev + 1);
      setErrors({});
    }
  };

  // Function to go to previous step
  const goToPreviousStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
    setErrors({});
  };

  // Email validation helper
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation helper
  const isValidPassword = (password) => {
    // At least 8 characters, contains at least one letter and one number
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(password);
  };

  // Validation function based on current step
  const validateCurrentStep = () => {
    let stepErrors = {};
    let isValid = true;

    switch (currentStep) {
      case 1: // UserType validation
        if (!formData.role) {
          stepErrors.role = 'Please select a user type';
          isValid = false;
        }
        break;

      case 2: // Personal info validation
        if (!formData.firstName.trim()) {
          stepErrors.firstName = 'First name is required';
          isValid = false;
        } else if (formData.firstName.trim().length < 2) {
          stepErrors.firstName = 'First name must be at least 2 characters';
          isValid = false;
        }

        if (!formData.lastName.trim()) {
          stepErrors.lastName = 'Last name is required';
          isValid = false;
        } else if (formData.lastName.trim().length < 2) {
          stepErrors.lastName = 'Last name must be at least 2 characters';
          isValid = false;
        }

        if (!formData.userName.trim()) {
          stepErrors.userName = 'Username is required';
          isValid = false;
        } else if (formData.userName.trim().length < 4) {
          stepErrors.userName = 'Username must be at least 4 characters';
          isValid = false;
        }

        if (!formData.email.trim()) {
          stepErrors.email = 'Email is required';
          isValid = false;
        } else if (!isValidEmail(formData.email)) {
          stepErrors.email = 'Please enter a valid email address';
          isValid = false;
        }

        if (!formData.gender) {
          stepErrors.gender = 'Please select your gender';
          isValid = false;
        }

        if (!formData.password) {
          stepErrors.password = 'Password is required';
          isValid = false;
        } else if (!isValidPassword(formData.password)) {
          stepErrors.password = 'Password must be at least 8 characters with letters and numbers';
          isValid = false;
        }

        if (!formData.confirmPassword) {
          stepErrors.confirmPassword = 'Please confirm your password';
          isValid = false;
        } else if (formData.password !== formData.confirmPassword) {
          stepErrors.confirmPassword = 'Passwords do not match';
          isValid = false;
        }
        break;

      case 3: // Address validation
        if (!formData.addressLineOne.trim()) {
          stepErrors.addressLineOne = 'Address Line 1 is required';
          isValid = false;
        }

        if (!formData.province) {
          stepErrors.province = 'Province is required';
          isValid = false;
        }

        if (!formData.district) {
          stepErrors.district = 'District is required';
          isValid = false;
        }

        if (!formData.city.trim()) {
          stepErrors.city = 'City is required';
          isValid = false;
        }

        if (!formData.phoneNumber.trim()) {
          stepErrors.phoneNumber = 'Phone number is required';
          isValid = false;
        } else if (!/^[0-9]{10}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
          stepErrors.phoneNumber = 'Enter a valid 10-digit phone number';
          isValid = false;
        }
        break;

      case 4: // Final step validation
        if (!formData.acceptedTerms) {
          stepErrors.acceptedTerms = 'You must accept the terms and conditions';
          isValid = false;
        }
        break;
    }

    setErrors(stepErrors);
    
    if (!isValid) {
      // Show first error message
      const firstError = Object.values(stepErrors)[0];
      showToast('error', 'Validation Error', firstError);
    }
    
    return isValid;
  };

  // Handle final submission
  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      showToast('info', 'Processing', 'Creating your account...');

      // Prepare FormData for multipart/form-data
      const submitData = new FormData();

      // Append all text fields
      submitData.append('role', formData.role);
      submitData.append('firstName', formData.firstName.trim());
      submitData.append('lastName', formData.lastName.trim());
      submitData.append('userName', formData.userName.trim());
      submitData.append('email', formData.email.trim().toLowerCase());
      submitData.append('gender', formData.gender);
      submitData.append('password', formData.password);
      submitData.append('addressLineOne', formData.addressLineOne.trim());
      submitData.append('addressLineTwo', formData.addressLineTwo.trim());
      submitData.append('province', formData.province);
      submitData.append('district', formData.district);
      submitData.append('city', formData.city.trim());
      submitData.append('phoneNumber', formData.phoneNumber.replace(/\s/g, ''));
      submitData.append('acceptedTerms', formData.acceptedTerms.toString());

      // Handle profile photo if exists
      if (formData.profilePhoto) {
        const photoUri = formData.profilePhoto.uri;
        const filename = `profile_${Date.now()}.jpg`;
        
        submitData.append('profilePhoto', {
          uri: photoUri,
          name: filename,
          type: 'image/jpeg'
        });
      }

      // Make the API request
      const response = await axios.post(
        `http://${API_URL}:8080/api/auth/register`,
        submitData,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000, // 30 second timeout
        }
      );

      // Handle successful registration
      if (response.status === 200 || response.status === 201) {
        showToast('success', 'Success!', 'Account created successfully');
        
        // Move to success screen
        setCurrentStep(5);
        
        // Optional: Store user data or token
        if (response.data.token) {
          // Store token if needed
          console.log('Registration successful:', response.data);
        }
      }

    } catch (error) {
      console.error('Registration error:', error);
      
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const data = error.response.data;
        
        switch (status) {
          case 400:
            errorMessage = data.message || 'Invalid input data. Please check your information.';
            break;
          case 401:
            errorMessage = 'Authentication failed. Please try again.';
            break;
          case 403:
            errorMessage = 'Access denied. Please contact support.';
            break;
          case 409:
            errorMessage = 'Username or email already exists. Please choose different ones.';
            break;
          case 422:
            errorMessage = 'Validation error. Please check your input.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          default:
            errorMessage = data.message || `Registration failed (${status})`;
        }
        
        // Handle specific field errors
        if (data.errors && typeof data.errors === 'object') {
          setErrors(data.errors);
        }
        
      } else if (error.request) {
        // Network error
        errorMessage = 'Network error. Please check your internet connection.';
      } else {
        // Other error
        errorMessage = 'An unexpected error occurred. Please try again.';
      }
      
      showToast('error', 'Registration Failed', errorMessage);
      
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <UserTypeScreen
            formData={formData}
            updateFormData={updateFormData}
            goToNextStep={goToNextStep}
            errors={errors}
          />
        );
      case 2:
        return (
          <PersonalInfoScreen
            formData={formData}
            updateFormData={updateFormData}
            goToNextStep={goToNextStep}
            goToPreviousStep={goToPreviousStep}
            errors={errors}
          />
        );
      case 3:
        return (
          <AddressScreen
            formData={formData}
            updateFormData={updateFormData}
            goToNextStep={goToNextStep}
            goToPreviousStep={goToPreviousStep}
            errors={errors}
          />
        );
      case 4:
        return (
          <ProfilePhotoScreen
            formData={formData}
            updateFormData={updateFormData}
            handleSubmit={handleSubmit}
            goToPreviousStep={goToPreviousStep}
            errors={errors}
            isSubmitting={isSubmitting}
          />
        );
      case 5:
        return (
          <RegistrationSuccess
            formData={formData}
            navigation={navigation}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      {currentStep < 5 && (
        <ProgressIndicator
          currentStep={currentStep}
          totalSteps={4}
        />
      )}

      <View style={styles.contentContainer}>
        {renderStep()}
      </View>

      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  }
});

export default RegistrationProcess;