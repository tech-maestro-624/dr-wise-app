import apiClient from "./https";

// Fetch categories
const getCategories = async (params={}) => {
  try {
    const response = await apiClient.get('/categories', {params:params});
    return response;
  } catch (error) {
    throw error;
  }
}

// Fetch category by name
const getCategoryByName = async (name) => {
  try {
    const response = await apiClient.get('/categories', {
      params: { name: name }
    });
    return response;
  } catch (error) {
    throw error;
  }
}

// Fetch products by category
const getProductByCategory = async (id) => {
  try {
    const response = await apiClient.get(`/products/category/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
}

// Fetch products by subcategory
const getProductsBySubCategory = async (subCategoryId) => {
  try {
    const response = await apiClient.get(`/products/product/${subCategoryId}`);
    return response;
  } catch (error) {
    throw error;
  }
}

export { getCategories, getCategoryByName, getProductByCategory, getProductsBySubCategory };


