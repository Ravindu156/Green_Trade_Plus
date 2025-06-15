import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../constants/colors';
import Constants from 'expo-constants';

const FarmerProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState();
  const [loading, setLoading] = useState(true);
  const [bidsCount, setBidsCount] = useState(0);
  const [tradeItemsCount, setTradeItemsCount] = useState(0);
  const { API_URL } = Constants.expoConfig.extra;
  console.log("Hello User Data", userData);
  console.log("All User ID", userId);
  console.log("All User ID", tradeItemsCount);

  useEffect(() => {
    // Fetch user data when component mounts
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // In a real app, you would fetch more comprehensive user data
      const user = await AsyncStorage.getItem('user');
      const userData = JSON.parse(user);
      const userId = userData.id;
      setUserId(userId)
      // Sample data - in a real app, this would come from an API
      console.log("All User Data", userData);
      console.log("All User ID", userId);
      console.log("All item ID", tradeItemsCount);

      setUserData({
        name: userData.userName,
        role: userData.role,
        profilePhoto: userData.profilePhotoPath,
        listings: 5,
        classes: 2,
        earnings: 1250.75,
        notifications: [
          { id: 1, message: "Your tomatoes listing has received 3 new inquiries", time: "2h ago" },
          { id: 2, message: "Price alert: Corn prices are up 5% today", time: "5h ago" },
          { id: 3, message: "Reminder: Update your inventory by Friday", time: "1d ago" }
        ]
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  const fetchCounts = async () => {
    if (!userId) return; // Ensure userId is available before making requests

    try {
      // Fetch bids count
      const bidsResponse = await fetch(`http://${API_URL}:8080/api/item-bids/user/${userId}`);
      if (bidsResponse.ok) {
        const bidsData = await bidsResponse.json();
        setBidsCount(bidsData.length);
      }

      // Fetch trade items count
      const tradeItemsResponse = await fetch(`http://${API_URL}:8080/api/trade-items/user/${userId}`);
      if (tradeItemsResponse.ok) {
        const tradeItemsData = await tradeItemsResponse.json();
        setTradeItemsCount(tradeItemsData.length);
      }
    } catch (error) {
      console.error('Error fetching counts:', error);
      setBidsCount(0);
      setTradeItemsCount(0);
    }
  };

  fetchCounts();
}, [userId]);


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Farmer Profile</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Ionicons name="settings-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: userData.profilePhoto }}
              style={styles.profileImage}
            />
          </View>
          <Text style={styles.userName}>Hello, {userData?.name}</Text>
          <Text style={styles.userRole}>{userData?.role}</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('FarmerYourListingsScreen')}
            >
              <Ionicons name="list" size={20} color={COLORS.textDark} />
              <Text style={styles.actionText}>Your Listings</Text>
              <Text style={styles.actionCount}>{tradeItemsCount}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('AddNewItemScreen')}
            >
              <Ionicons name="add-circle" size={20} color={COLORS.textDark} />
              <Text style={styles.actionText}>Add New Item</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('YourClasses')}
            >
              <Ionicons name="checkbox" size={20} color={COLORS.textDark} />
              <Text style={styles.actionText}>Your Classes</Text>
              <Text style={styles.actionCount}>{userData?.classes}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Earnings')}
            >
              <Ionicons name="cash" size={20} color={COLORS.textDark} />
              <Text style={styles.actionText}>Your Earnings</Text>
              <Text style={styles.actionAmount}>${userData?.earnings.toFixed(2)}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('YourBids')}
            >
              <Ionicons name="pricetag" size={20} color={COLORS.textDark} />
              <Text style={styles.actionText}>Your Bids</Text>
              <Text style={styles.actionAmount}>{bidsCount}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.notificationsContainer}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          {userData?.notifications.map(notification => (
            <View key={notification.id} style={styles.notificationItem}>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationText}>{notification.message}</Text>
                <Text style={styles.notificationTime}>{notification.time}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Market Summary */}
        <View style={styles.marketContainer}>
          <View style={styles.marketHeader}>
            <Text style={styles.sectionTitle}>Today's Market</Text>
            <TouchableOpacity onPress={() => navigation.navigate('TodayMarketScreen')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.marketSummaryBox}>
            <Text style={styles.marketInfoText}>Current top crops: Tomatoes, Corn, Apples</Text>
            <Text style={styles.marketInfoText}>Market is active with 15% more buyers today</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  profileSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e1e1e1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  userRole: {
    fontSize: 16,
    color: COLORS.textLight,
    marginTop: 5,
  },
  quickActionsContainer: {
    backgroundColor: '#c1f2a5',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  actionButton: {
    backgroundColor: '#e8f9df',
    borderRadius: 10,
    padding: 12,
    width: '48%',
    alignItems: 'flex-start',
  },
  actionText: {
    color: COLORS.textDark,
    fontWeight: '600',
    marginTop: 5,
  },
  actionCount: {
    color: COLORS.textDark,
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 5,
  },
  actionAmount: {
    color: COLORS.success,
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 5,
  },
  notificationsContainer: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 10,
  },
  notificationItem: {
    backgroundColor: '#e8f9df',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  notificationContent: {
    flex: 1,
  },
  notificationText: {
    fontSize: 14,
    color: COLORS.textDark,
  },
  notificationTime: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 5,
  },
  marketContainer: {
    marginTop: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  marketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewAllText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  marketSummaryBox: {
    backgroundColor: '#e8f9df',
    borderRadius: 10,
    padding: 15,
  },
  marketInfoText: {
    fontSize: 14,
    color: COLORS.textDark,
    marginBottom: 5,
  },
});

export default FarmerProfileScreen;