import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Animated
} from 'react-native';
import { COLORS } from '../../constants/colors';

const RadioGroup = ({ options, selected, onSelect }) => {
  return (
    <View style={styles.container}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={styles.radioOption}
          onPress={() => onSelect(option.value)}
          activeOpacity={0.7}
        >
          <View style={styles.radioButtonContainer}>
            <View style={styles.radioButtonOuter}>
              {selected === option.value && (
                <Animated.View style={styles.radioButtonInner} />
              )}
            </View>
          </View>
          <Text style={[
            styles.radioLabel,
            selected === option.value && styles.selectedRadioLabel
          ]}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 10,
    paddingVertical: 6,
  },
  radioButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonOuter: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  radioLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: COLORS.text,
  },
  selectedRadioLabel: {
    fontWeight: '600',
    color: COLORS.primary,
  }
});

export default RadioGroup;