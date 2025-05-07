// Dropdown.js - Custom dropdown component for form selections
import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal,
  FlatList,
  Animated,
  Dimensions,
  TouchableWithoutFeedback
} from 'react-native';
import { COLORS } from '../../constants/colors';
import { AntDesign } from '@expo/vector-icons';

const windowHeight = Dimensions.get('window').height;

const Dropdown = ({ 
  label, 
  placeholder, 
  options, 
  value, 
  onChange, 
  error, 
  disabled = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(windowHeight)).current;

  const selectedOption = options?.find(option => option.value === value);

  const toggleDropdown = () => {
    if (disabled) return;
    
    if (!isOpen) {
      setIsOpen(true);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      closeDropdown();
    }
  };

  const closeDropdown = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: windowHeight,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start(() => {
      setIsOpen(false);
    });
  };

  const handleSelect = (option) => {
    onChange(option.value);
    closeDropdown();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.optionItem}
      onPress={() => handleSelect(item)}
    >
      <Text style={styles.optionText}>{item.label}</Text>
      {item.value === value && (
        <AntDesign name="check" size={16} color={COLORS.primary} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TouchableOpacity 
        style={[
          styles.dropdownButton,
          disabled && styles.disabledDropdown,
          error && styles.inputError
        ]}
        onPress={toggleDropdown}
        activeOpacity={disabled ? 1 : 0.7}
      >
        <Text 
          style={[
            styles.selectedText,
            !selectedOption && styles.placeholderText
          ]}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <AntDesign 
          name="caretdown" 
          size={12} 
          color={disabled ? COLORS.textTertiary : COLORS.textSecondary} 
        />
      </TouchableOpacity>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
      
      <Modal
        transparent={true}
        visible={isOpen}
        animationType="none"
        onRequestClose={closeDropdown}
      >
        <TouchableWithoutFeedback onPress={closeDropdown}>
          <Animated.View 
            style={[
              styles.modalOverlay,
              { opacity: fadeAnim }
            ]}
          >
            <TouchableWithoutFeedback>
              <Animated.View 
                style={[
                  styles.modalContent,
                  { transform: [{ translateY: slideAnim }] }
                ]}
              >
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{label || "Select an option"}</Text>
                  <TouchableOpacity onPress={closeDropdown}>
                    <AntDesign name="close" size={22} color={COLORS.textSecondary} />
                  </TouchableOpacity>
                </View>
                
                <FlatList
                  data={options || []}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.value}
                  contentContainerStyle={styles.optionsList}
                  showsVerticalScrollIndicator={false}
                />
              </Animated.View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
    fontWeight: '500',
  },
  dropdownButton: {
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  disabledDropdown: {
    backgroundColor: COLORS.backgroundDisabled,
    borderColor: COLORS.borderDisabled,
  },
  selectedText: {
    fontSize: 16,
    color: COLORS.text,
  },
  placeholderText: {
    color: COLORS.textTertiary,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 16,
    maxHeight: windowHeight * 0.7,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  optionsList: {
    paddingBottom: 30,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  optionText: {
    fontSize: 16,
    color: COLORS.text,
  },
});

export default Dropdown;