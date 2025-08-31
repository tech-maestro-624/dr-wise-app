import apiClient from "./https";

const createAffiliate = async (data = {}) => {
  try {
    const response = await apiClient.post('/affiliate/affiliate', data);
    return response;
  } catch (error) {
    throw error;
  }
}

const getAffiliates = async (params = {}) => {
  try {
    const response = await apiClient.get('/affiliate/affiliates', { params: params });
    return response;
  } catch (error) {
    throw error;
  }
}

const getAffiliateById = async (id) => {
  try {
    const response = await apiClient.get(`/affiliate/affiliate/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
}

const updateAffiliate = async (id, data = {}) => {
  try {
    const response = await apiClient.put(`/affiliate/affiliate/${id}`, data);
    return response;
  } catch (error) {
    throw error;
  }
}

const deleteAffiliate = async (id) => {
  try {
    const response = await apiClient.delete(`/affiliate/affiliate/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
}

export { createAffiliate, getAffiliates, getAffiliateById, updateAffiliate, deleteAffiliate };