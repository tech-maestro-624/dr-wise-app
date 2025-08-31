import apiClient from "./https";

// Fetch referral data from the API
const getReferral = async () => {
  try {
    const response = await apiClient.get('/referral');
    return response;
  } catch (error) {
    throw error;
  }
}

export { getReferral };