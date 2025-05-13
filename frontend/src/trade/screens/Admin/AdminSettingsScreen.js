import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const AdminSettingsScreen = () => {
 const { user, logout } = useAuth();
     console.log(user);
 
     const handleLogout = async () => {
         await logout();
     };
 
     if (!user) {
         return (
             <View style={[styles.container]}>
                 <Text style={[styles.message]}>You are not logged in.</Text>
             </View>
         );
     }
 
     return (
         <SafeAreaProvider>
             <SafeAreaView style={{ flex: 1 }}>
                 <View style={[styles.container]}>
                     <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                         <Text style={styles.logoutButtonText}>Logout</Text>
                     </TouchableOpacity>
                 </View>
             </SafeAreaView>
         </SafeAreaProvider>
     )
};

export default AdminSettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold'
  }
});
