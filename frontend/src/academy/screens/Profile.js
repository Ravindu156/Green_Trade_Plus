import React, { useState, useEffect } from 'react';
import {
  View,
  Text, // Using standard Text component
  StyleSheet,
  Image, // For profile photo
  ScrollView,
  TouchableOpacity, // For buttons and list items
  ActivityIndicator, // For loading indicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
// You might need to install react-native-vector-icons:
// npm install react-native-vector-icons
// or yarn add react-native-vector-icons
// And then link for iOS: npx react-native-vector-icons@latest install
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'; // Using FontAwesome5 for icons
import { createStackNavigator } from '@react-navigation/stack';
import MyCourses from './MyCourses/MyCourses';
import Certificates from './Certificates/Certificates';
import ChangePassword from './ChangePassword/ChangePassword';
import Settings from './Settings/Settings';
import ContactUs from './ContactUs/ContactUs';
import AddNewCourseScreen from './AddNewCourseScreen/AddNewCourseScreen';
import EditCourses from './EditCourses/EditCourses';
import AllCourses from './AllCourses/AllCourses';
import Earnings from './Earnings/Earnings';

const Stack = createStackNavigator();

const ProfileNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Profile" component={Profile} />
    <Stack.Screen name="MyCourses" component={MyCourses} />
    <Stack.Screen name="Certificates" component={Certificates} />
    <Stack.Screen name="ChangePassword" component={ChangePassword} />
    <Stack.Screen name="Settings" component={Settings} />
    <Stack.Screen name="ContactUs" component={ContactUs} />
    <Stack.Screen name="AddNewCourseScreen" component={AddNewCourseScreen} />
    <Stack.Screen name="EditCourses" component={EditCourses} />
    <Stack.Screen name="AllCourses" component={AllCourses} />
    <Stack.Screen name="Earnings" component={Earnings} />
  </Stack.Navigator>
);

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        console.log("UserRole", parsedUser?.profilePhotoPath); // Use optional chaining for safety
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
        <ActivityIndicator size="large" color="#1976d2" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  const isTutor = user?.role === 'tutor';

  // Helper function to render list items
  const renderListItem = (title, description, iconName, onPress, isLogout = false) => (
    <TouchableOpacity
      style={[styles.listItem, isLogout && styles.logoutItem]}
      onPress={onPress}
      activeOpacity={0.7} // Visual feedback on press
    >
      <View style={styles.listItemLeft}>
        <FontAwesome5 name={iconName} size={24} color={isLogout ? '#d32f2f' : '#1976d2'} style={styles.listIcon} />
      </View>
      <View style={styles.listItemContent}>
        <Text style={styles.listItemTitle}>{title}</Text>
        <Text style={styles.listItemDescription}>{description}</Text>
      </View>
      {!isLogout && (
        <View style={styles.listItemRight}>
          <FontAwesome5 name="chevron-right" size={16} color="#666" />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Profile Card (replaces Paper's Card) */}
      <View style={styles.profileCard}>
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
            // Replaces Paper's Avatar.Icon
            <View style={styles.defaultAvatar}>
              <FontAwesome5 name="user-alt" size={50} color="#fff" />
            </View>
          )}
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Hello,</Text>
            <Text style={styles.name}>{user?.userName || 'User'}</Text> {/* Replaces Paper's Title */}
            <Text style={styles.roleTag}>{isTutor ? 'Tutor' : user?.role || 'Farmer'}</Text> {/* Use optional chaining */}
          </View>
        </View>
      </View>

      {/* Divider (replaces Paper's Divider) */}
      <View style={styles.sectionDivider} />

      {isTutor ? (
        <View style={styles.tutorSection}>
          <Text style={styles.sectionTitle}>Tutor Dashboard</Text>
          <View style={styles.buttonGrid}>
            {/* Custom Button (replaces Paper's Button mode="contained") */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('AddNewCourseScreen')}
            >
              <FontAwesome5 name="plus-circle" size={20} color="#fff" style={styles.actionButtonIcon} />
              <Text style={styles.actionButtonText}>Add New Course</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('EditCourses')}
            >
              <FontAwesome5 name="pencil-alt" size={20} color="#fff" style={styles.actionButtonIcon} />
              <Text style={styles.actionButtonText}>Edit Courses</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('AllCourses')}
            >
              <FontAwesome5 name="list-alt" size={20} color="#fff" style={styles.actionButtonIcon} />
              <Text style={styles.actionButtonText}>View All Courses</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Earnings')}
            >
              <FontAwesome5 name="money-bill-alt" size={20} color="#fff" style={styles.actionButtonIcon} />
              <Text style={styles.actionButtonText}>Your Earnings</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}

      {/* List Section (replaces Paper's List.Section) */}
      <View style={styles.listSection}>
        <Text style={styles.sectionTitle}>My Account</Text>
        {renderListItem('My Courses', 'View enrolled or created courses', 'book', () => navigation.navigate('MyCourses'))}
        {renderListItem('Certificates', 'View your earned certificates', 'award', () => navigation.navigate('Certificates'))}
        {renderListItem('Change Password', 'Update your account password', 'lock', () => navigation.navigate('ChangePassword'))}
        {renderListItem('Settings', 'Manage your preferences', 'cog', () => navigation.navigate('Settings'))}
        {renderListItem('Contact Us', 'Get help or send feedback', 'envelope', () => navigation.navigate('ContactUs'))}
        {renderListItem('Logout', 'Sign out from your account', 'sign-out-alt', handleLogout, true)}
      </View>

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
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  profileCard: {
    margin: 16,
    elevation: 4,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
  defaultAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1976d2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    borderWidth: 3,
    borderColor: '#1976d2',
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
  sectionDivider: { // Replaces Paper's Divider
    marginVertical: 8,
    height: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 16, // Match card margins
  },
  tutorSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    paddingLeft: 0, // Adjusted as it's not a List.Section title anymore
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: { // Replaces Paper's Button
    width: '48%',
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#1976d2',
    flexDirection: 'row', // For icon and text
    alignItems: 'center',
    justifyContent: 'center',
    height: 50, // Matches original buttonContent height
    paddingHorizontal: 10, // Added padding
  },
  actionButtonIcon: {
    marginRight: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  listSection: { // Replaces Paper's List.Section
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  listItem: { // Replaces Paper's List.Item
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  listItemLeft: {
    marginRight: 15,
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  listItemDescription: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  listItemRight: {
    marginLeft: 10,
  },
  logoutItem: {
    borderBottomWidth: 0,
    backgroundColor: '#ffebee', // Light red background for logout
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

export default ProfileNavigator;
