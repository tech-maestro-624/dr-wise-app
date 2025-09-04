// src/api/subscription.js
import api from './https';

export const getUserSubscriptions = async (userId) => {
  try {
    const response = await api.get('/subscription/status', {
      params: { userId }
    });
    return response;
  } catch (error) {
    console.error('Error fetching user subscriptions:', error);
    throw error;
  }
};

export const getSubscriptionById = async (subscriptionId) => {
  try {
    const response = await api.get(`/subscription/${subscriptionId}`);
    return response;
  } catch (error) {
    console.error('Error fetching subscription by ID:', error);
    throw error;
  }
};

export const createSubscription = async (subscriptionData) => {
  try {
    const response = await api.post('/subscription', subscriptionData);
    return response;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
};

export const updateSubscription = async (subscriptionId, updateData) => {
  try {
    const response = await api.put(`/subscription/${subscriptionId}`, updateData);
    return response;
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
};

export const cancelSubscription = async (subscriptionId, cancelData = {}) => {
  try {
    const response = await api.patch(`/subscription/${subscriptionId}/cancel`, cancelData);
    return response;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
};

export const getAllSubscriptions = async (params = {}) => {
  try {
    const response = await api.get('/subscription', { params });
    return response;
  } catch (error) {
    console.error('Error fetching all subscriptions:', error);
    throw error;
  }
};
