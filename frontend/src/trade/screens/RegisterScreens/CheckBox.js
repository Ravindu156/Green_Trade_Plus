// CheckBox.js - Custom checkbox component with label
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Animated
} from 'react-native';
import { COLORS } from '../../constants/colors';
import { AntDesign } from '@expo/vector-icons';

const CheckBox = ({ 
  checked, 
  onToggle, 
  label, 
  disabled = false,
  size = 22,
  labelStyle = {}
}) => {
  // Scale animation for the check mark
  const scaleValue = React.useRef(new Animated.Value(checked ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(scaleValue, {
      toValue: checked ? 1 : 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [checked, scaleValue]);

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onToggle}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={[
        styles.checkboxOuter, 
        { width: size, height: size },
        checked && styles.checkboxOuterActive,
        disabled && styles.checkboxDisabled
      ]}>
        <Animated.View style={{
          transform: [{ scale: scaleValue }],
          opacity: scaleValue,
        }}>
          <AntDesign 
            name="check" 
            size={size * 0.7} 
            color="#FFF" 
          />
        </Animated.View>
      </View>
      
      {label && (
        <Text style={[
          styles.label, 
          disabled && styles.labelDisabled,
          labelStyle
        ]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 6,
  },
  checkboxOuter: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  checkboxOuterActive: {
    backgroundColor: COLORS.primary,
  },
  checkboxDisabled: {
    borderColor: COLORS.textTertiary,
    backgroundColor: COLORS.backgroundDisabled,
  },
  label: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  labelDisabled: {
    color: COLORS.textTertiary,
  }
});

export default CheckBox;