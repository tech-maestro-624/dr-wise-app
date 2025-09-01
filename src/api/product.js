import apiClient from './https';

// Get all products
export const getAllProducts = async () => {
  try {
    const response = await apiClient.get('/products');
    return response;
  } catch (error) {
    throw error;
  }
};

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
    const response = await apiClient.get(`/products/product/${subCategoryId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Get product by ID
export const getProductById = async (productId) => {
  try {
    const response = await apiClient.get(`/products/${productId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

