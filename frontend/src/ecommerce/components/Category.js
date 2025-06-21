import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function Category() {
  const navigation = useNavigation();

  const handleCategoryPress = (category) => {
    navigation.navigate('CategoryItems', { category });
  };

  return (
    <View>
      <Text style={styles.title}>Categories</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
        {['Plastic Boxes', 'Steel Boxes', 'Wooden Boxes'].map((category, index) => (
          <TouchableOpacity key={index} style={styles.box} onPress={() => handleCategoryPress(category)}>
            <FontAwesome5 name="box" size={24} color="#333" />
            <Text style={styles.text}>{category}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 15,
    marginBottom: 10,
  },
  scroll: {
    paddingHorizontal: 10,
  },
  box: {
    backgroundColor: '#e0f7fa',
    borderRadius: 12,
    padding: 15,
    marginRight: 10,
    alignItems: 'center',
    width: 120,
  },
  text: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});
