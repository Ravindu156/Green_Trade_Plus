import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity,Image } from 'react-native';

export default function PromoBanner(){
    return(
        <View style={styles.bannerContainer}>
            <Image
                source={{ uri: 'https://via.placeholder.com/350x150.png?text=Promo+Banner' }}
                style={styles.bannerImage}
            />
        </View>
    );
}
const styles = StyleSheet.create({
    bannerContainer: {
      marginBottom: 10,
    },
    bannerImage: {
      width: '100%',
      height: 150,
      borderRadius: 10,
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
  