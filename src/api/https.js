// src/api/apiClient.js

import axios from 'axios';
import global from '../Utils/global';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiClient = axios.create({
  baseURL: global.baseURL,
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('API Client - Adding auth header for:', config.url);
    } else {
      console.log('API Client - No token found for:', config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('API Client - Response error for:', error.config?.url);
    console.log('API Client - Status:', error.response?.status);
    console.log('API Client - Error data:', error.response?.data);
    return Promise.reject(error);
  }
);

export default apiClient;



