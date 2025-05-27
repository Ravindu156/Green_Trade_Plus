import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { Title, List, Avatar, Divider, Button, Card, Text } from 'react-native-paper';
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
        console.log("UserRole", parsedUser.profilePhotoPath);
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
      // Navigate to login screen
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
        <Text>Loading profile...</Text>
      </View>
    );
  }

  const isSeller = user?.role === 'seller';

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.profileCard}>
        <View style={styles.profileHeader}>
                    {user?.profilePhotoPath ? (
            <>
              {console.log(`Profile photo URI: http://localhost:8080/api/auth/profile-photos/${user.profilePhotoPath}`)}
              <Image
                source={{ uri: `http://localhost:8080/api/auth/profile-photos/${user.profilePhotoPath}` }}
                style={styles.profilePic}
              />
            </>
          ) : (
            <Avatar.Icon size={100} icon="account" style={styles.avatarIcon} />
          )}
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Hello,</Text>
            <Title style={styles.name}>{user?.userName || 'User'}</Title>
            <Text style={styles.roleTag}>{isSeller ? 'Seller' : user.role}</Text>
          </View>
        </View>
      </Card>

      <Divider style={styles.divider} />

      {isSeller ? (
        <View style={styles.tutorSection}>
          <Text style={styles.sectionTitle}>Seller Dashboard</Text>
          <View style={styles.buttonGrid}>
            <Button
              mode="contained"
              icon="plus-circle"
              style={styles.actionButton}
              contentStyle={styles.buttonContent}
              onPress={() => navigation.navigate('SellersForm')}
            >
              Add New Product
            </Button>
            
            <Button
              mode="contained"
              icon="pencil"
              style={styles.actionButton}
              contentStyle={styles.buttonContent}
              onPress={() => navigation.navigate('EditProducts')}
            >
              Edit Products
            </Button>

            <Button
              mode="contained"
              icon="view-list"
              style={styles.actionButton}
              contentStyle={styles.buttonContent}
              onPress={() => navigation.navigate('AllProducts')}
            >
              View All Products
            </Button>

            <Button
              mode="contained"
              icon="cash-multiple"
              style={styles.actionButton}
              contentStyle={styles.buttonContent}
              onPress={() => navigation.navigate('Earnings')}
            >
              Your Earnings
            </Button>
          </View>
        </View>
      ) : null}

      <List.Section style={styles.listSection}>
        <Text style={styles.sectionTitle}>My Account</Text>
        <List.Item
          title="My Courses"
          description="View enrolled or created courses"
          left={() => <List.Icon color="#1976d2" icon="book" />}
          right={() => <List.Icon color="#1976d2" icon="chevron-right" />}
          onPress={() => navigation.navigate('MyCourses')}
          style={styles.listItem}
        />
        <List.Item
          title="Certificates"
          description="View your earned certificates"
          left={() => <List.Icon color="#1976d2" icon="certificate" />}
          right={() => <List.Icon color="#1976d2" icon="chevron-right" />}
          onPress={() => navigation.navigate('Certificates')}
          style={styles.listItem}
        />
        <List.Item
          title="Change Password"
          description="Update your account password"
          left={() => <List.Icon color="#1976d2" icon="lock-reset" />}
          right={() => <List.Icon color="#1976d2" icon="chevron-right" />}
          onPress={() => navigation.navigate('ChangePassword')}
          style={styles.listItem}
        />
        <List.Item
          title="Settings"
          description="Manage your preferences"
          left={() => <List.Icon color="#1976d2" icon="cog" />}
          right={() => <List.Icon color="#1976d2" icon="chevron-right" />}
          onPress={() => navigation.navigate('Settings')}
          style={styles.listItem}
        />
        <List.Item
          title="Contact Us"
          description="Get help or send feedback"
          left={() => <List.Icon color="#1976d2" icon="message-text" />}
          right={() => <List.Icon color="#1976d2" icon="chevron-right" />}
          onPress={() => navigation.navigate('ContactUs')}
          style={styles.listItem}
        />
        <List.Item
          title="Logout"
          description="Sign out from your account"
          left={() => <List.Icon color="#d32f2f" icon="logout" />}
          onPress={handleLogout}
          style={[styles.listItem, styles.logoutItem]}
        />
      </List.Section>
      
      <View style={styles.footer}>
        <Text style={styles.versionText}>Green Trade Plus v1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f9ff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    margin: 16,
    elevation: 4,
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
    borderWidth: 3,
    borderColor: '#1976d2',
  },
  avatarIcon: {
    backgroundColor: '#1976d2',
    marginRight: 20,
  },
  welcomeContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  roleTag: {
    marginTop: 5,
    fontSize: 14,
    color: '#ffffff',
    backgroundColor: '#1976d2',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  divider: {
    marginVertical: 8,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  tutorSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    paddingLeft: 16,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#1976d2',
  },
  buttonContent: {
    height: 50,
  },
  listSection: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  listItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  versionText: {
    color: '#999',
    fontSize: 12,
  },
});

export default AccountScreen;