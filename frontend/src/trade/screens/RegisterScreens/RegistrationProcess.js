// RegistrationProcess.js - Main component that manages all registration steps

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { COLORS } from '../../constants/colors';
import Toast from 'react-native-toast-message';

// Import all step screens
import UserTypeScreen from './UserTypeScreen';
import PersonalInfoScreen from './PersonalInfoScreen';
import AddressScreen from './AddressScreen';
import ProfilePhotoScreen from './ProfilePhotoScreen';
import RegistrationSuccess from './RegistrationSuccess';

// Progress indicator component
import ProgressIndicator from './ProgressIndicator';

const RegistrationProcess = ({ navigation }) => {
  // States for all form data
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    userType: '',
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    gender: '',
    password: '',
    confirmPassword: '',
    addressLine1: '',
    addressLine2: '',
    province: '',
    district: '',
    city: '',
    phoneNumber: '',
    profilePhoto: null,
    acceptedTerms: false
  });

  // State for validation errors
  const [errors, setErrors] = useState({});

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

  // Validation function based on current step
  const validateCurrentStep = () => {
    let stepErrors = {};
    let isValid = true;

    switch (currentStep) {
      case 1: // UserType validation
        if (!formData.userType) {
          stepErrors.userType = 'Please select a user type';
          isValid = false;
        }
        break;
      
      case 2: // Personal info validation
        if (!formData.firstName) {
          stepErrors.firstName = 'First name is required';
          isValid = false;
        }
        if (!formData.lastName) {
          stepErrors.lastName = 'Last name is required';
          isValid = false;
        }
        if (!formData.username) {
          stepErrors.username = 'Username is required';
          isValid = false;
        } else if (formData.username.length < 4) {
          stepErrors.username = 'Username must be at least 4 characters';
          isValid = false;
        }
        if (!formData.gender) {
          stepErrors.gender = 'Please select your gender';
          isValid = false;
        }
        if (!formData.password) {
          stepErrors.password = 'Password is required';
          isValid = false;
        } else if (formData.password.length < 8) {
          stepErrors.password = 'Password must be at least 8 characters';
          isValid = false;
        }
        if (formData.password !== formData.confirmPassword) {
          stepErrors.confirmPassword = 'Passwords do not match';
          isValid = false;
        }
        break;
      
      case 3: // Address validation
        if (!formData.addressLine1) {
          stepErrors.addressLine1 = 'Address Line 1 is required';
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
        if (!formData.city) {
          stepErrors.city = 'City is required';
          isValid = false;
        }
        if (!formData.phoneNumber) {
          stepErrors.phoneNumber = 'Phone number is required';
          isValid = false;
        } else if (!/^[0-9]{10}$/.test(formData.phoneNumber)) {
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
    return isValid;
  };

  // Handle final submission
  const handleSubmit = async () => {
    if (!validateCurrentStep()) {
      return;
    }

    try {
      // Show loading indication
      showToast('info', 'Processing', 'Creating your account...');
      
      // Create form data for image upload
      const submitData = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'profilePhoto' && formData[key]) {
          submitData.append('profilePhoto', {
            uri: formData.profilePhoto.uri,
            type: formData.profilePhoto.type,
            name: formData.profilePhoto.fileName || 'photo.jpg'
          });
        } else {
          submitData.append(key, formData[key]);
        }
      });

      // Make API call
      const response = await fetch('http://192.168.1.100:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: submitData,
      });

      const data = await response.json();

      if (response.status === 201) {
        showToast('success', 'Success', 'Account created successfully!');
        setCurrentStep(5); // Go to success screen
      } else {
        showToast('error', 'Registration Failed', data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Registration Error:', error);
      showToast('error', 'Network Error', 'Failed to connect to server');
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
      
      <Toast ref={(ref) => Toast.setRef(ref)} />
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