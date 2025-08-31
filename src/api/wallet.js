import apiClient from "./https";

// Fetch wallet data from the API
const getWallet = async () => {
  try {
    const response = await apiClient.get('/wallet');
    return response;
  } catch (error) {
    throw error;
  }
};

// Update the wallet balance (debit operation)
const updateWallet = async (data) => {
  try {
    const response = await apiClient.put('/wallet/debit', data);
    return response;
  } catch (error) {
    throw error;
  }
};

export { getWallet, updateWallet };
