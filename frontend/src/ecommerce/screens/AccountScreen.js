import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, ScrollView, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AccountScreen = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976d2" />
        <Text>Loading profile...</Text>
      </View>
    );
  }

  const isSeller = user?.role === 'seller';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileCard}>
        <View style={styles.profileHeader}>
          {user?.profilePhotoPath ? (
            <Image source={{ uri: user.profilePhotoPath }} style={styles.profilePic} />
          ) : (
            <View style={styles.defaultAvatar}>
              <Text style={styles.avatarText}>👤</Text>
            </View>
          )}
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Hello,</Text>
            <Text style={styles.name}>{user?.userName || 'User'}</Text>
            <Text style={styles.roleTag}>{isSeller ? 'Seller' : user.role}</Text>
          </View>
        </View>
      </View>

      {isSeller && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seller Dashboard</Text>
          <View style={styles.buttonGrid}>
            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('SellersForm')}>
              <Text style={styles.buttonText}>➕ Add New Product</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('EditProducts')}>
              <Text style={styles.buttonText}>✏️ Edit Products</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('AllProducts')}>
              <Text style={styles.buttonText}>📦 View All Products</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Earnings')}>
              <Text style={styles.buttonText}>💰 Your Earnings</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Account</Text>
        {[
          { title: 'My Courses', icon: '📚', screen: 'MyCourses' },
          { title: 'Certificates', icon: '🎓', screen: 'Certificates' },
          { title: 'Change Password', icon: '🔒', screen: 'ChangePassword' },
          { title: 'Settings', icon: '⚙️', screen: 'Settings' },
          { title: 'Contact Us', icon: '💬', screen: 'ContactUs' },
        ].map((item, index) => (
          <TouchableOpacity key={index} style={styles.listItem} onPress={() => navigation.navigate(item.screen)}>
            <Text style={styles.listItemText}>{item.icon} {item.title}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={[styles.listItem, styles.logoutItem]} onPress={handleLogout}>
          <Text style={[styles.listItemText, { color: '#d32f2f' }]}>🚪 Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.versionText}>Green Trade Plus v1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f9ff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  profileCard: { margin: 16, padding: 20, backgroundColor: '#fff', borderRadius: 12, elevation: 4 },
  profileHeader: { flexDirection: 'row', alignItems: 'center' },
  profilePic: { width: 100, height: 100, borderRadius: 50, marginRight: 20, borderWidth: 3, borderColor: '#1976d2' },
  defaultAvatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#1976d2', justifyContent: 'center', alignItems: 'center', marginRight: 20 },
  avatarText: { fontSize: 40, color: 'white' },
  welcomeContainer: { flex: 1 },
  welcomeText: { fontSize: 16, color: '#666' },
  name: { fontSize: 24, fontWeight: 'bold', color: '#1976d2' },
  roleTag: { marginTop: 5, fontSize: 14, color: '#fff', backgroundColor: '#1976d2', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 15, alignSelf: 'flex-start' },
  section: { marginHorizontal: 16, marginTop: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  buttonGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  actionButton: { width: '48%', backgroundColor: '#1976d2', padding: 12, borderRadius: 8, marginBottom: 15 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  listItem: { backgroundColor: '#fff', padding: 16, marginBottom: 1, borderBottomWidth: 1, borderBottomColor: '#eee' },
  listItemText: { fontSize: 16 },
  logoutItem: { backgroundColor: '#ffe5e5' },
  footer: { padding: 16, alignItems: 'center' },
  versionText: { color: '#999', fontSize: 12 },
});

export default AccountScreen;
