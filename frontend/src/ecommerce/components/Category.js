import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export default function Category(){
    return(
        <View>
              <Text style={styles.sectionTitle}>Categories</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
                {['Plastic Boxes', 'Steel Boxes', 'Wooden Boxes'].map((category, index) => (
                  <TouchableOpacity key={index} style={styles.categoryBox}>
                    <FontAwesome5 name="box" size={24} color="black" />
                    <Text style={styles.categoryText}>{category}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              </View>
    );
};
const styles = StyleSheet.create({
    categoryContainer: {
      flexDirection: 'row',
      marginVertical: 10,
    },
    categoryBox: {
      alignItems: 'center',
      marginRight: 15,
    },
    categoryText: {
      marginTop: 5,
    },
    sectionTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 10,
      },
  });
  