import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';



const HomeScreen = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation();

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={[styles.container]}>
                    <Text style={[styles.title]}>My Tasks</Text>

                    <TouchableOpacity
                        /* style={styles.fabs} */
                        onPress={() => setModalVisible(true)}
                    >
                        <Text>Today Market</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        /* style={styles.fab} */
                        onPress={() => setModalVisible(true)}
                    >
                        <Text>Cources</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                       /*  style={styles.fab} */
                        onPress={() => navigation.navigate('ProductsTabs')}
                    >
                        <Text>Products</Text>
                    </TouchableOpacity>
                    
                     <TouchableOpacity
                        /* style={styles.fab} */
                        onPress={() => setModalVisible(true)}
                    >
                        <Text>Transpotation</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        marginTop: 20,
        textAlign: 'center',
    },
    listContainer: {
        paddingBottom: 80,
    },
    fab: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
});

export default HomeScreen;