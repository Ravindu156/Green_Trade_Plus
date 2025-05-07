import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from "./src/trade/context/AuthContext";
import Toast from 'react-native-toast-message';
import RootNavigator from "./src/trade/navigation/RootNavigator";
import { PaperProvider } from 'react-native-paper';
import linking from "./src/linking";

export default function App() {
  return (
    <PaperProvider>
      <AuthProvider>
        <NavigationContainer linking={linking}>
          <StatusBar style="auto" />
            <RootNavigator />
          <Toast/>
        </NavigationContainer>
      </AuthProvider>
    </PaperProvider>
  );
}

