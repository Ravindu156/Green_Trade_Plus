import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

// Enhanced green color palette with better visibility
const COLORS = {
    primary: '#1B5E20',      // Deep Green
    secondary: '#388E3C',    // Balanced Green
    accent: '#66BB6A',       // Softer Light Green
    lightBg: '#F1F8E9',      // Gentle Light Green Background
    white: '#FFFFFF',
    text: '#1C1C1C',         // Strong Dark Text
    subtext: '#4E6E58',      // Medium Contrast Text
    shadow: '#2E7D32',       // Accent Shadow
};

const HomeScreen = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [firstName, setFirstName] = useState();
    const [profilePhoto, setProfilePhoto] = useState();
    const navigation = useNavigation();


    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const userData = await AsyncStorage.getItem('user');
                const token = await AsyncStorage.getItem('token'); // or whatever key you store it under
    
                if (userData && token) {
                    const user = JSON.parse(userData);
                    const userId = user.id;
    
                    console.log("userid", userId);
    
                    const res = await fetch(`http://localhost:8080/api/auth/${userId}/basic-info`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`, // ✅ Add this header
                        }
                    });
    
                    if (!res.ok) {
                        throw new Error(`HTTP error! status: ${res.status}`);
                    }
    
                    const data = await res.json();
                    setFirstName(data.firstName);
                    setProfilePhoto(data.profilePhotoPath);
    
                    console.log("name", data.firstName); // also fix typo from "firsName"
                    console.log("photo", data.profilePhotoPath); // also fix typo from "firsName"
                }
            } catch (err) {
                console.error("Failed to fetch user info", err);
            }
        };
    
        fetchUserInfo();
    }, []);
    


    const menuItems = [
        {
            id: 'market',
            title: 'Today Market',
            icon: 'basket-outline',
            color: ['#43A047', '#66BB6A'],
            screen: 'TodayMarketScreen'
        },
        {
            id: 'courses',
            title: 'Courses',
            icon: 'book-outline',
            color: ['#558B2F', '#AED581'],
            screen: 'CoursesScreen'
        },
        {
            id: 'products',
            title: 'Products',
            icon: 'pricetags-outline',
            color: ['#2E7D32', '#81C784'],
            screen: 'ProductsTabs'
        },
        {
            id: 'transportation',
            title: 'Transportation',
            icon: 'car-outline',
            color: ['#33691E', '#A5D6A7'],
            screen: 'TransportationScreen'
        },
    ];

    const navigateTo = (screenName) => {
        if (screenName === 'ProductsTabs') {
            // Navigate to the stack screen (outside of the tab navigation)
            navigation.navigate(screenName);
        } else if (screenName === 'TodayMarketScreen') {
            // Navigate within the HomeStack
            navigation.navigate(screenName);
        } else {
            setModalVisible(true);
        }
    };

    return (
        <SafeAreaProvider>
            <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
            <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightBg }}>
                <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

                    {/* Header */}
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.greeting}>Welcome,</Text>
                            <Text style={styles.userName}>{firstName}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.profileContainer}
                            onPress={() => navigation.navigate('Profile')}
                        >
                            <Image
                               source={{ uri: `http://localhost:8080/api/auth/profile-photos/${profilePhoto}` }}
                                style={styles.profilePic}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Menu Grid */}
                    <Text style={styles.sectionTitle}>Quick Access</Text>
                    <View style={styles.menuGrid}>
                        {menuItems.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.menuItem}
                                onPress={() => navigateTo(item.screen)}
                            >
                                <LinearGradient
                                    colors={item.color}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.menuItemGradient}
                                >
                                    <View style={styles.iconContainer}>
                                        <Ionicons name={item.icon} size={28} color={COLORS.white} />
                                    </View>
                                    <Text style={styles.menuItemText}>{item.title}</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: COLORS.lightBg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingTop: 10,
    },
    greeting: {
        fontSize: 18,
        color: COLORS.subtext,
        fontWeight: '500',
    },
    userName: {
        fontSize: 26,
        fontWeight: '700',
        color: COLORS.text,
    },
    profileContainer: {
        height: 52,
        width: 52,
        borderRadius: 26,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    profilePic: {
        height: 48,
        width: 48,
        borderRadius: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 16,
        color: COLORS.text,
    },
    menuGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    menuItem: {
        width: '48%',
        marginBottom: 16,
        borderRadius: 18,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },
    menuItemGradient: {
        height: 130,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 18,
    },
    iconContainer: {
        height: 60,
        width: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.25)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    menuItemText: {
        color: COLORS.white,
        fontWeight: '600',
        fontSize: 15,
        textAlign: 'center',
    },
});

export default HomeScreen;
