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

  // Validation function based on current step
  const validateCurrentStep = () => {
    let stepErrors = {};
    let isValid = true;

    switch (currentStep) {
      case 1: // UserType validation
        if (!formData.role) {
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
        if (!formData.userName) {
          stepErrors.userName = 'Username is required';
          isValid = false;
        } else if (formData.userName.length < 4) {
          stepErrors.userName = 'Username must be at least 4 characters';
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
        if (!formData.addressLineOne) {
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
  
    if (isSubmitting) {
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      showToast('info', 'Processing', 'Creating your account...');
  
      const submitData = new FormData();
  
      for (const key in formData) {
        if (formData.hasOwnProperty(key)) {
          console.log("KEYS", key);
  
          if (key === 'profilePhoto' && formData[key]) {
            const photo = formData[key];
            console.log("PHOTO", photo);
  
            const fileUri = photo.uri;
            const fileType = photo.mimeType || 'image/jpeg';
            const fileName = photo.fileName || 'profilePhoto.jpg';
  
            // Check if the URI is a data URL (base64)
            if (fileUri.startsWith('data:')) {
              const base64String = fileUri.split(',')[1];
              const byteCharacters = atob(base64String);
              const byteNumbers = new Array(byteCharacters.length);
              for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
              }
              const byteArray = new Uint8Array(byteNumbers);
              const blob = new Blob([byteArray], { type: fileType });
              submitData.append('profilePhoto', blob, fileName); // Append Blob with filename
              console.log("Appended Blob for profilePhoto");
            } else {
              // If the URI is a file path (common in React Native), fetch it as a Blob
              try {
                const response = await fetch(fileUri);
                if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
                }
                const blob = await response.blob();
                submitData.append('profilePhoto', blob, fileName);
                console.log("Appended Blob from URI for profilePhoto");
              } catch (error) {
                console.error("Error fetching image:", error);
                showToast('error', 'Upload Error', 'Failed to upload profile photo.');
                setIsSubmitting(false);
                return; // Exit handleSubmit on fetch error
              }
            }
          } else {
            const value = typeof formData[key] === 'boolean'
              ? formData[key].toString()
              : formData[key];
            submitData.append(key, value);
          }
        }
      }
  
      // Debug log: Use for development only
      console.log('Submitting data:', JSON.stringify(Array.from(submitData.entries())));
  
      const response = await fetch(`http://${API_URL}:8080/api/auth/register`, { //ip address  should be replace with you IPV4 address(ipconfig)
        method: 'POST',
        body: submitData,
        // Note: Do NOT set Content-Type here, let FormData handle it
      });
  
      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Response text:', responseText);
  
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Error parsing response:', e);
        showToast('error', 'Response Error', 'Invalid response from server');
        setIsSubmitting(false);
        return;
      }
  
      if (response.status === 201) {
        showToast('success', 'Success', 'Account created successfully!');
        setCurrentStep(5);
      } else {
        showToast('error', 'Registration Failed', data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Registration Error:', error);
      showToast('error', 'Network Error', 'Failed to connect to server');
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
            handleSubmit={handleSubmit} // Pass handleSubmit function
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
      
      {/* This is the problem line - we'll remove the ref */}
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