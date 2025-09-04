// src/api/payment.js
import api from './https';

export const createRenewalOrder = async (orderData) => {
  try {
    const response = await api.post('/payments/create-order', orderData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const processPayment = async (paymentData) => {
  try {
    const response = await api.post('/payments/process-payment', paymentData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const checkRenewalEligibility = async (params) => {
  try {
    const response = await api.get('/payments/renewal-eligibility', { params });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getPaymentHistory = async (params) => {
  try {
    const response = await api.get('/payments/payment-history', { params });
    return response;
  } catch (error) {
    throw error;
  }
};
