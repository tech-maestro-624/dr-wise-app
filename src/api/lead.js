import apiClient from "./https";

// Create a new lead
const createLead = async (data) => {
  try {
    const response = await apiClient.post('/leads', data);
    return response;
  } catch (error) {
    throw error;
  }
}

// Get a list of leads with optional query parameters
const getLeads = async (params = {}) => {
  try {
    const response = await apiClient.get('/leads', { params });
    return response;
  } catch (error) {
    throw error;
  }
}

// Get lead by ID
const getLeadById = async (leadId) => {
  try {
    const response = await apiClient.get(`/leads/${leadId}`);
    return response;
  } catch (error) {
    throw error;
  }
}

// Update lead
const updateLead = async (leadId, data) => {
  try {
    const response = await apiClient.put(`/leads/${leadId}`, data);
    return response;
  } catch (error) {
    throw error;
  }
}

// Delete lead
const deleteLead = async (leadId) => {
  try {
    const response = await apiClient.delete(`/leads/${leadId}`);
    return response;
  } catch (error) {
    throw error;
  }
}

export { createLead, getLeads, getLeadById, updateLead, deleteLead };