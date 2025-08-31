import apiClient from "./https";

// Fetch wallet transactions from the API
const getTransactions = async () => {
  try {
    const response = await apiClient.get('/wallet/transactions');
    return response;
  } catch (error) {
    throw error;
  }
};

export { getTransactions };
