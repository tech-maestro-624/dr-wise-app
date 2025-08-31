import apiClient from "./https";

// Update user information by id
const updateUser = async (id, data) => {
  try {
    const response = await apiClient.put(`/users/update/${id}`, data);
    return response;
  } catch (error) {
    throw error;
  }
}

const getUsers = async (params = {}) => {
  try {
    const response = await apiClient.get('/users/get-users', { params });
    return response;
  } catch (error) {
    throw error;
  }
}

const createUser = async (data = {}) => {
  try {
    const response = await apiClient.post('/user', data);
    return response;
  } catch (error) {
    throw error;
  }
}

export { updateUser, getUsers, createUser };