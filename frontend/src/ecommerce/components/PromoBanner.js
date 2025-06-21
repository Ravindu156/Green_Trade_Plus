import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function PromoBanner() {
  const banners = [
    require('../../../assets/EcommerceItems/1.jpg'),
    require('../../../assets/EcommerceItems/2.jpg'),
    require('../../../assets/EcommerceItems/3.png'),
    require('../../../assets/EcommerceItems/4.jpg'),
    require('../../../assets/EcommerceItems/5.jpg'),
    require('../../../assets/EcommerceItems/6.jpg'),
  ];

  const scrollRef = useRef(null);
  const indexRef = useRef(0); // Keeps track of current index without triggering re-render

  useEffect(() => {
    const interval = setInterval(() => {
      indexRef.current = (indexRef.current + 1) % banners.length;
      scrollRef.current?.scrollTo({
        x: width * indexRef.current,
        animated: true,
      });
    }, 3000); // 3 seconds per image

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false} // disable manual scroll
      >
        {banners.map((img, index) => (
          <Image key={index} source={img} style={styles.image} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 160,
    marginVertical: 10,
  },
  image: {
    width: width,
    height: 150,
    borderRadius: 12,
    resizeMode: 'cover',
  },
});
