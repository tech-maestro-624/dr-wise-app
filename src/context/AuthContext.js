// context/AuthContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserData } from '../api/auth';

const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
});

export { AuthContext };
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (userData, token) => {
    try {
      console.log('AuthContext - Login called with user:', userData?.name);
      setUser(userData);
      setIsAuthenticated(true);
      if (token) {
        await AsyncStorage.setItem('token', token);
        console.log('AuthContext - Token stored');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const logout = async () => {
    try {
      console.log('AuthContext - Logout called');
      setIsAuthenticated(false);
      setUser(null);
      await AsyncStorage.removeItem('token');
      console.log('AuthContext - Token removed');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const validateToken = async () => {
    try {
      console.log('Validating token...');
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        console.log('No token found');
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      console.log('Token found, validating with API...');
      const response = await getUserData();

      if (response && response.data) {
        const userData = response.data.user || response.data;
        console.log('Token valid, user data:', userData);
        setUser(userData);
        setIsAuthenticated(true);
        console.log('AuthContext - Setting authenticated to true');
      } else {
        console.log('Token validation failed - no user data');
        await AsyncStorage.removeItem('token');
        setIsAuthenticated(false);
        console.log('AuthContext - Setting authenticated to false');
      }
    } catch (error) {
      console.error('Token validation failed:', error);
      await AsyncStorage.removeItem('token');
      setIsAuthenticated(false);
      console.log('AuthContext - Setting authenticated to false due to error');
    } finally {
      setIsLoading(false);
      console.log('AuthContext - Loading complete');
    }
  };

  useEffect(() => {
    validateToken();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};



