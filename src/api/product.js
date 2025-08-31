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

// Get products by subcategory ID
export const getProductsBySubCategory = async (subCategoryId) => {
  try {
    console.log('API Call - Fetching products for subcategory:', subCategoryId);
    console.log('API Call - Full URL:', `${apiClient.defaults.baseURL}/products/product/${subCategoryId}`);

    const response = await apiClient.get(`/products/product/${subCategoryId}`);

    console.log('API Call - Response status:', response.status);
    console.log('API Call - Response data:', response.data);

    return response;
  } catch (error) {
    console.error('API Call - Error fetching products:', error);
    console.error('API Call - Error response:', error.response?.data);
    console.error('API Call - Error status:', error.response?.status);
    throw error;
  }
};

// Get single product by ID
export const getProductById = async (productId) => {
  try {
    const response = await apiClient.get(`/products/${productId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

