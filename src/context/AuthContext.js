// context/AuthContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserData } from '../api/auth';
import { getconfig } from '../api/configuration';

const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  isAmbassador: false,
  verificationStatus: 'pending',
  login: () => {},
  logout: () => {},
});

export { AuthContext };
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAmbassador, setIsAmbassador] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('pending');

  const checkUserRole = async (userData) => {
    try {
      console.log('Checking user role for:', userData?.name);
      console.log('User roles:', userData?.roles);

      // First, check for ambassador role by name (most reliable method)
      if (userData.roles && userData.roles.some(role =>
        role.name && role.name.toLowerCase() === 'ambassador'
      )) {
        console.log('Ambassador role found by name');
        setIsAmbassador(true);
        return true;
      }

      // Check for ambassador role by ID directly (fallback if config API fails)
      if (userData.roles && userData.roles.some((role) => role._id === '673998264fcfab01f5dd61d6')) {
        console.log('Ambassador role found by ID');
        setIsAmbassador(true);
        return true;
      }

      // Try to get ambassador role ID from config API (as backup)
      try {
        // Add a small delay to ensure token is stored
        await new Promise(resolve => setTimeout(resolve, 300));

        // Check if token exists before making API call
        const storedToken = await AsyncStorage.getItem('token');
        if (!storedToken) {
          console.log('No token found for role check');
          return false;
        }

        console.log('Making config API call for role check...');
        const configResponse = await getconfig();
        console.log('Config response received:', configResponse.data);

        const ambassadorRoleConfig = configResponse.data.find(
          (item) => item.key === 'AMBASSADOR_ROLE_ID'
        );

        if (ambassadorRoleConfig && userData.roles) {
          const ambassadorId = ambassadorRoleConfig.value;
          const userIsAmbassador = userData.roles.some((role) => role._id === ambassadorId);
          console.log('User is ambassador:', userIsAmbassador, 'Ambassador ID:', ambassadorId, 'User roles:', userData.roles);
          setIsAmbassador(userIsAmbassador);
          return userIsAmbassador;
        }
      } catch (configError) {
        console.log('Config API failed, but continuing with other checks:', configError.message);
        console.log('Config error details:', configError.response?.data || configError.message);
      }

      return false;
    } catch (error) {
      console.error('Error checking user role:', error);
      return false;
    }
  };

  const login = async (userData, token) => {
    try {
      console.log('AuthContext - Login called with user:', userData?.name);
      console.log('AuthContext - User data:', JSON.stringify(userData, null, 2));

      // Store token first
      if (token) {
        await AsyncStorage.setItem('token', token);
        console.log('AuthContext - Token stored');
      }

      setUser(userData);
      setIsAuthenticated(true);

      // Set verification status
      setVerificationStatus(userData.verificationStatus || 'pending');

      // Check if user is ambassador
      const userIsAmbassador = await checkUserRole(userData);
      setIsAmbassador(userIsAmbassador);

      console.log('AuthContext - Login completed. IsAmbassador:', userIsAmbassador, 'VerificationStatus:', userData.verificationStatus);
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const logout = async () => {
    try {
      console.log('AuthContext - Logout called');
      setIsAuthenticated(false);
      setUser(null);
      setIsAmbassador(false);
      setVerificationStatus('pending');
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

        // Set verification status
        setVerificationStatus(userData.verificationStatus || 'pending');

        // Check if user is ambassador
        const userIsAmbassador = await checkUserRole(userData);
        setIsAmbassador(userIsAmbassador);

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
    <AuthContext.Provider value={{ isAuthenticated, user, isAmbassador, verificationStatus, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};



