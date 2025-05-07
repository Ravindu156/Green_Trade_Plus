// ProfilePhotoScreen.js - Fourth step of registration

import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  ScrollView,
  Platform,
  Alert
} from 'react-native';
import { COLORS } from '../../constants/colors';
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import CheckBox from './CheckBox';

const ProfilePhotoScreen = ({ 
  formData, 
  updateFormData, 
  handleSubmit, 
  goToPreviousStep,
  errors 
}) => {
  const pickImage = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permission Denied',
        'Sorry, we need camera roll permissions to make this work!',
        [{ text: 'OK' }]
      );
      return;
    }
    
    // Launch image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      updateFormData({ profilePhoto: result.assets[0] });
    }
  };

  const takePhoto = async () => {
    // Request permission
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permission Denied',
        'Sorry, we need camera permissions to make this work!',
        [{ text: 'OK' }]
      );
      return;
    }
    
    // Launch camera
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      updateFormData({ profilePhoto: result.assets[0] });
    }
  };

  const toggleTermsAgreement = () => {
    updateFormData({ acceptedTerms: !formData.acceptedTerms });
  };

  return (
    <ScrollView 
      style={styles.scrollView}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={goToPreviousStep}
        >
          <AntDesign name="arrowleft" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Complete Your Profile</Text>
      </View>
      
      <View style={styles.photoContainer}>
        <Text style={styles.subtitle}>Add Profile Photo</Text>
        
        <View style={styles.profilePhotoWrapper}>
          {formData.profilePhoto ? (
            <Image 
              source={{ uri: formData.profilePhoto.uri }} 
              style={styles.profilePhoto} 
            />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Ionicons name="person" size={80} color={COLORS.textSecondary} />
            </View>
          )}
        </View>
        
        <View style={styles.photoButtons}>
          <TouchableOpacity 
            style={styles.photoButton} 
            onPress={takePhoto}
          >
            <Ionicons name="camera" size={22} color={COLORS.primary} />
            <Text style={styles.photoButtonText}>Take Photo</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.photoButton} 
            onPress={pickImage}
          >
            <MaterialIcons name="photo-library" size={22} color={COLORS.primary} />
            <Text style={styles.photoButtonText}>Gallery</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.userInfoContainer}>
        <Text style={styles.userInfoLabel}>Your Username</Text>
        <View style={styles.userInfoValue}>
          <MaterialIcons name="alternate-email" size={20} color={COLORS.primary} />
          <Text style={styles.userInfoText}>{formData.username}</Text>
        </View>
        
        <Text style={styles.userInfoLabel}>Your Phone Number</Text>
        <View style={styles.userInfoValue}>
          <Ionicons name="call-outline" size={20} color={COLORS.primary} />
          <Text style={styles.userInfoText}>{formData.phoneNumber}</Text>
        </View>
      </View>
      
      <View style={styles.termsContainer}>
        <CheckBox
          checked={formData.acceptedTerms}
          onToggle={toggleTermsAgreement}
          label="I have read and confirm the policies, terms, and conditions, and I declare that the above details are true and accurate to the best of my knowledge."
        />
        {errors.acceptedTerms && (
          <Text style={styles.errorText}>{errors.acceptedTerms}</Text>
        )}
      </View>
      
      <TouchableOpacity 
        style={[
          styles.registerButton,
          !formData.acceptedTerms && styles.disabledButton
        ]}
        onPress={handleSubmit}
        disabled={!formData.acceptedTerms}
      >
        <Text style={styles.registerButtonText}>Confirm and Proceed</Text>
        <AntDesign name="checkcircle" size={20} color="white" />
      </TouchableOpacity>
      
      <View style={styles.spacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 20,
  },
  photoContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  profilePhotoWrapper: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  profilePhoto: {
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  photoButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
  },
  photoButtonText: {
    marginLeft: 8,
    color: COLORS.primary,
    fontWeight: '500',
  },
  userInfoContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  userInfoLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 5,
  },
  userInfoValue: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    marginBottom: 15,
  },
  userInfoText: {
    marginLeft: 10,
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  termsContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  registerButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  registerButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  spacer: {
    height: 40,
  },
});

export default ProfilePhotoScreen;