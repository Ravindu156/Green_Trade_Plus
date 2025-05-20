import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkLoginStatus = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        console.log("userdata: ",userData);
        
        if (userData && userData !== 'undefined') {
          setUser(JSON.parse(userData));
        } else {
          setUser(null); // clear user if invalid data
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      } finally {
        setLoading(false);
      }
    };    
    
    checkLoginStatus();
  }, []);

  const login = async (usernameOrPhone, password) => {
    try {
      const response = await fetch('http://192.168.8.162:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usernameOrPhone, password }),
      });
  
      const data = await response.json();
      
      if (response.status === 200) {
        const user = data;
        const token = data.token;
        console.log("user", user);
        console.log("token", token);
        
        // Save to AsyncStorage
        if (user && token) {
          await AsyncStorage.setItem('user', JSON.stringify(user));
          await AsyncStorage.setItem('token', token);
          setUser(user);
        }
      
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login Error:', error);
      return { success: false, message: 'Network error' };
    }
  };
  

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('token');
      setUser(null);
      return true;
    } catch (error) {
      console.error('Error logging out:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};