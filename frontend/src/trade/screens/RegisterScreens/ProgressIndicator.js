// ProgressIndicator.js - Component for showing step progress

import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../../constants/colors';

const ProgressIndicator = ({ currentStep, totalSteps }) => {
  // Calculate progress percentage
  const progressPercentage = (currentStep / totalSteps) * 100;
  
  // Create step array
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <View style={styles.container}>
      <View style={styles.stepTextContainer}>
        <Text style={styles.stepText}>Step {currentStep} of {totalSteps}</Text>
      </View>
      
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground} />
        <Animated.View 
          style={[
            styles.progressBarFill,
            { width: `${progressPercentage}%` }
          ]}
        />
        
        {steps.map((step) => (
          <View 
            key={step}
            style={[
              styles.stepDot,
              { left: `${((step - 1) / (totalSteps - 1)) * 100}%` },
              currentStep >= step ? styles.completedStepDot : {}
            ]}
          >
            {currentStep === step && (
              <View style={styles.currentStepIndicator} />
            )}
            <Text style={[
              styles.stepNumber,
              currentStep >= step ? styles.completedStepNumber : {}
            ]}>
              {step}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  stepTextContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  stepText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  progressBarContainer: {
    height: 40,
    width: '100%',
    position: 'relative',
    marginBottom: 10,
  },
  progressBarBackground: {
    position: 'absolute',
    top: 17,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
  },
  progressBarFill: {
    position: 'absolute',
    top: 17,
    left: 0,
    height: 4,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  stepDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 4,
    marginLeft: -15,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    zIndex: 2,
  },
  completedStepDot: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  currentStepIndicator: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#999',
  },
  completedStepNumber: {
    color: 'white',
  },
});

export default ProgressIndicator;