// UserTypeScreen.js - First step of registration

import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Animated,
  Dimensions
} from 'react-native';
import { COLORS } from '../../constants/colors';
import { AntDesign } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const UserTypeScreen = ({ formData, updateFormData, goToNextStep, errors }) => {
  const userTypes = [
    { id: 'farmer', label: 'A Farmer'/* , icon: require('../../assets/images/farmer.png') */ },
    { id: 'buyer', label: 'A Buyer'/* , icon: require('../../assets/images/buyer.png')  */},
    { id: 'tutor', label: 'A Tutor'/* , icon: require('../../assets/images/tutor.png') */ },
    { id: 'seller', label: 'A Seller'/* , icon: require('../../assets/images/seller.png') */ },
  ];

  const selectUserType = (type) => {
    updateFormData({ userType: type });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Who are you?</Text>
      <Text style={styles.subtitle}>Select the option that best describes you</Text>
      
      <View style={styles.userTypesContainer}>
        {userTypes.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[
              styles.userTypeCard,
              formData.userType === type.id && styles.selectedCard
            ]}
            onPress={() => selectUserType(type.id)}
          >
            <Image source={type.icon} style={styles.userTypeIcon} />
            <Text style={[
              styles.userTypeLabel,
              formData.userType === type.id && styles.selectedLabel
            ]}>
              {type.label}
            </Text>
            {formData.userType === type.id && (
              <View style={styles.checkmarkContainer}>
                <AntDesign name="checkcircle" size={20} color={COLORS.primary} />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
      
      {errors.userType && (
        <Text style={styles.errorText}>{errors.userType}</Text>
      )}
      
      <TouchableOpacity 
        style={[
          styles.nextButton,
          formData.userType ? styles.nextButtonActive : styles.nextButtonInactive
        ]} 
        onPress={goToNextStep}
        disabled={!formData.userType}
      >
        <AntDesign name="arrowright" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 40,
  },
  userTypesContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  userTypeCard: {
    width: width * 0.42,
    height: 140,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    position: 'relative',
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  userTypeIcon: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  userTypeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  selectedLabel: {
    color: COLORS.primary,
  },
  checkmarkContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  errorText: {
    color: COLORS.error,
    marginTop: 10,
    alignSelf: 'center',
  },
  nextButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 50,
    right: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  nextButtonActive: {
    backgroundColor: COLORS.primary,
  },
  nextButtonInactive: {
    backgroundColor: '#D1D1D1',
  },
});

export default UserTypeScreen;