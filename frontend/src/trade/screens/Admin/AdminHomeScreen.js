import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AdminHomeScreen = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Welcome to the Admin Home</Text>

            <TouchableOpacity
                style={styles.logoutButton}
                onPress={() => navigation.navigate('AdminPriceSetting')}
            >
                <Text style={styles.logoutButtonText}>Set Price</Text>
            </TouchableOpacity>
        </View>
    );
};

export default AdminHomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    logoutButton: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#007BFF',
        borderRadius: 5,
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
    }
});
