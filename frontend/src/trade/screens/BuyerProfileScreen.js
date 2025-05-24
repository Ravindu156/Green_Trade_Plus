import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';

const BuyerProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{
            uri: user?.photoUrl || 'https://www.w3schools.com/howto/img_avatar.png',
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user?.name || 'Buyer Name'}</Text>
        <Text style={styles.email}>{user?.email || 'buyer@email.com'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Actions</Text>

        <TouchableOpacity style={styles.button}>
          <Ionicons name="cart" size={20} color={COLORS.white} />
          <Text style={styles.buttonText}>Your Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Ionicons name="heart" size={20} color={COLORS.white} />
          <Text style={styles.buttonText}>Wishlist</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Ionicons name="chatbubble" size={20} color={COLORS.white} />
          <Text style={styles.buttonText}>Messages</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Ionicons name="settings" size={20} color={COLORS.white} />
          <Text style={styles.buttonText}>Account Settings</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>

        <TouchableOpacity style={styles.buttonOutline}>
          <Ionicons name="help-circle-outline" size={20} color={COLORS.primary} />
          <Text style={styles.buttonOutlineText}>Help Center</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonOutline}>
          <Ionicons name="call-outline" size={20} color={COLORS.primary} />
          <Text style={styles.buttonOutlineText}>Contact Support</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginVertical: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  email: {
    fontSize: 16,
    color: '#555',
  },
  section: {
    marginHorizontal: 20,
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: COLORS.primary,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    marginLeft: 10,
  },
  buttonOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: COLORS.primary,
    borderWidth: 1,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonOutlineText: {
    color: COLORS.primary,
    fontSize: 16,
    marginLeft: 10,
  },
});

export default BuyerProfileScreen;
