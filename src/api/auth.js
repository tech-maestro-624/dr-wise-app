import apiClient from "./https";

const sendOtp = async (data) => {
  try {
    const response = await apiClient.post('/auth/send-otp', data);
    return response;
  } catch (error) {
    throw error;
  }
}

const verifyOtp = async (data) => {
  try {
    const response = await apiClient.post('/auth/login', data);
    return response;
  } catch (error) {
    throw error;
  }
}

const customerLogout = async () => {
  try {
    const response = await apiClient.post('/auth/logout');
    return response;
  } catch (error) {
    throw error;
  }
}

const getUserData = async () => {
  try {
    const response = await apiClient.get('/auth/get-user');
    return response;
  } catch (error) {
    throw error;
  }
}

const customerLogin = async (data = {}) => {
  try {
    const response = await apiClient.post('/customer-login', data);
    return response;
  } catch (error) {
    throw error;
  }
}

const register = async(data = {}) => {
  try {
    const response = await apiClient.post('/auth/register', data)
    return response;
  } catch (error) {
    throw error;
  }
}

const getUserByPhoneNumber = async (phoneNumber) => {
  try {
    const response = await apiClient.get(`/auth/${phoneNumber}`);
    console.log('getUserByPhoneNumber response', response);
    return response;
  } catch (error) {
    throw error;
  }
};

export { sendOtp, verifyOtp, customerLogout, getUserData, customerLogin, register, getUserByPhoneNumber };



