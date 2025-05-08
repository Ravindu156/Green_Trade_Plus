// RegistrationSuccess.js - Final screen after successful registration

import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  Animated
} from 'react-native';
import { COLORS } from '../../constants/colors';
import { AntDesign } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';

const RegistrationSuccess = ({ formData, navigation }) => {
  const scaleAnim = new Animated.Value(0);
  const lottieRef = useRef(null);
  
  useEffect(() => {
    // Animation when component mounts
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true
    }).start();
    
    // Set a timer to automatically redirect to login after 5 seconds
    const redirectTimer = setTimeout(() => {
      navigateToLogin();
    }, 5000);
    
    // Clean up the timer if component unmounts
    return () => clearTimeout(redirectTimer);
  }, []);

  const navigateToLogin = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.successCard,
          { transform: [{ scale: scaleAnim }] }
        ]}
      >
        <View style={styles.successIconContainer}>
          {/* Replace with your actual animation file path */}
          <LottieView
            ref={lottieRef}
            source={require('../../../../assets/animations/complete.gif')} 
            autoPlay
            loop={false}
            style={styles.animation}
          />
        </View>
        
        <Text style={styles.title}>Registration Successful!</Text>
        <Text style={styles.message}>
          Congratulations, {formData.firstName}! Your account has been created successfully.
        </Text>
        
        <View style={styles.userInfoContainer}>
          <View style={styles.userInfoRow}>
            <Text style={styles.userInfoLabel}>Username:</Text>
            <Text style={styles.userInfoValue}>{formData.userName}</Text>
          </View>
          
          <View style={styles.userInfoRow}>
            <Text style={styles.userInfoLabel}>Account Type:</Text>
            <Text style={styles.userInfoValue}>
              {formData.role === 'farmer' && 'Farmer'}
              {formData.role === 'buyer' && 'Buyer'}
              {formData.role === 'tutor' && 'Tutor'}
              {formData.role === 'seller' && 'Seller'}
            </Text>
          </View>
        </View>
        
        <Text style={styles.redirectText}>
          Redirecting to login screen automatically...
        </Text>
        
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={navigateToLogin}
        >
          <Text style={styles.loginButtonText}>Proceed to Login</Text>
          <AntDesign name="login" size={20} color="white" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  successCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    width: '100%',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  successIconContainer: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  animation: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 15,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  userInfoContainer: {
    backgroundColor: '#F8F8F8',
    width: '100%',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  userInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  userInfoLabel: {
    fontSize: 15,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  userInfoValue: {
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  redirectText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginBottom: 15,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
});

export default RegistrationSuccess;