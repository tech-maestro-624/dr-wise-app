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
  isLoading: true,
  login: () => {},
  logout: () => {},
  manualValidateToken: () => {},
});

export { AuthContext };
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAmbassador, setIsAmbassador] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('pending');
  const [loginTimestamp, setLoginTimestamp] = useState(null);

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
      // Store token first
      if (token) {
        await AsyncStorage.setItem('token', token);
      }

      // Set login timestamp to prevent validateToken from interfering
      setLoginTimestamp(Date.now());

      setUser(userData);
      setIsAuthenticated(true);

      // Set verification status
      setVerificationStatus(userData.verificationStatus || 'pending');

      // Check if user is ambassador
      const userIsAmbassador = await checkUserRole(userData);
      setIsAmbassador(userIsAmbassador);
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const logout = async () => {
    try {
      setIsAuthenticated(false);
      setUser(null);
      setIsAmbassador(false);
      setVerificationStatus('pending');
      setLoginTimestamp(null);
      await AsyncStorage.removeItem('token');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const validateToken = async () => {
    try {
      // Check if login was performed recently (within last 2 seconds)
      // If so, skip validation to avoid race condition
      if (loginTimestamp && (Date.now() - loginTimestamp) < 2000) {
        console.log('Skipping token validation due to recent login');
        setIsLoading(false);
        return;
      }

      const token = await AsyncStorage.getItem('token');
      console.log('Token found in storage:', !!token);

      if (!token) {
        console.log('No token found, user is not authenticated');
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      const response = await getUserData();

      if (response && response.data && response.data.user) {
        const userData = response.data.user;
        setUser(userData);
        setIsAuthenticated(true);

        // Set verification status
        setVerificationStatus(userData.verificationStatus || 'pending');

        // Check if user is ambassador - this will determine which screen to show
        const userIsAmbassador = await checkUserRole(userData);
        setIsAmbassador(userIsAmbassador);
      } else {
        // If API fails but we have a token, don't log out immediately
        // This handles temporary network issues or API downtime
        // For app reloads, if we have a token, trust it and set authenticated
        setIsAuthenticated(true);
      }
    } catch (error) {
      // If it's a 401 (token expired/invalid), then log out
      if (error.response?.status === 401) {
        await AsyncStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
        setIsAmbassador(false);
        setVerificationStatus('pending');
        setLoginTimestamp(null);
      } else {
        // For other errors (network issues, server errors), keep user logged in
        // For app reloads, if we have a token in storage, trust it
        const token = await AsyncStorage.getItem('token');
        if (token) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const manualValidateToken = async () => {
    setLoginTimestamp(null); // Reset timestamp to allow validation
    await validateToken();
  };

  useEffect(() => {
    validateToken();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      isAmbassador,
      verificationStatus,
      isLoading,
      login,
      logout,
      manualValidateToken
    }}>
      {children}
    </AuthContext.Provider>
  );
};



