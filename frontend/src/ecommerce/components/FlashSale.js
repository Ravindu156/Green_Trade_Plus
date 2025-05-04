import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

export default function FlashSale(){
    return(
        <ScrollView>
              <Text style={styles.sectionTitle}>Flash Sale</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productScroll}>
                {[1, 2, 3].map((Box, index) => (
                  <View key={index} style={styles.productCard}>
                    <Image
                      source={{ uri: 'https://via.placeholder.com/100x100.png?text=Item' + Box }}
                      style={styles.productImage}
                    />
                    <Text>Box {Box}</Text>
                    <Text style={styles.price}>Rs.450.00</Text>
                  </View>
                ))}
              </ScrollView>
              </ScrollView>
    );
}
    const styles = StyleSheet.create({
        icon: {
          marginHorizontal: 5,
        },
        sectionTitle: {
          fontWeight: 'bold',
          fontSize: 18,
          marginTop: 10,
        },
        productScroll: {
          flexDirection: 'row',
        },
        productCard: {
          alignItems: 'center',
          backgroundColor: '#f9f9f9',
          padding: 10,
          borderRadius: 10,
          marginRight: 10,
        },
        productImage: {
          width: 100,
          height: 100,
          borderRadius: 10,
        },
        price: {
          color: 'red',
        },
});