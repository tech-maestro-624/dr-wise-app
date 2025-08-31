import apiClient from './https';

// Search products with fuzzy search
export const searchProducts = async (query, limit = 10, threshold = 0.4) => {
  try {
    const response = await apiClient.get('/products/search', {
      params: {
        q: query,
        limit: limit,
        threshold: threshold
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

