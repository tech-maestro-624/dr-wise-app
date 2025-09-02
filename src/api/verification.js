import apiClient from './https';

const API_URL = '/auth';

// Store verification data temporarily
let verificationData = {
  aadharFile: null,
  selfieFile: null,
  bankDetails: {},
  userId: null
};

/**
 * Store Aadhar file data
 * @param {Object} fileData - File data from image picker
 */
export const storeAadharFile = (fileData) => {
  verificationData.aadharFile = fileData;
};

/**
 * Store selfie file data
 * @param {Object} fileData - File data from image picker
 */
export const storeSelfieFile = (fileData) => {
  verificationData.selfieFile = fileData;
};

/**
 * Store bank details
 * @param {Object} bankData - Bank details form data
 */
export const storeBankDetails = (bankData) => {
  verificationData.bankDetails = bankData;
};

/**
 * Set user ID for verification
 * @param {string} userId - User ID
 */
export const setVerificationUserId = (userId) => {
  verificationData.userId = userId;
};

/**
 * Get current verification data
 * @returns {Object} - Current verification data
 */
export const getVerificationData = () => {
  return verificationData;
};

/**
 * Complete registration with verification data
 * @param {Object} registrationData - Basic registration data
 * @returns {Promise} - API response
 */
export const completeRegistrationWithVerification = async (registrationData) => {
  try {
    const formData = new FormData();

    // Add basic registration data
    Object.keys(registrationData).forEach(key => {
      formData.append(key, registrationData[key]);
    });

    // Add bank details
    Object.keys(verificationData.bankDetails).forEach(key => {
      formData.append(key, verificationData.bankDetails[key]);
    });

    // Add files
    if (verificationData.aadharFile) {
      const aadharFile = {
        uri: verificationData.aadharFile.uri,
        type: verificationData.aadharFile.type || 'image/jpeg',
        name: verificationData.aadharFile.fileName || 'aadhar.jpg'
      };
      formData.append('aadharFile', aadharFile);
    }

    if (verificationData.selfieFile) {
      const selfieFile = {
        uri: verificationData.selfieFile.uri,
        type: verificationData.selfieFile.type || 'image/jpeg',
        name: verificationData.selfieFile.fileName || 'selfie.jpg'
      };
      formData.append('selfieFile', selfieFile);
    }

    const response = await apiClient.post(`${API_URL}/register`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Clear verification data after successful registration
    verificationData = {
      aadharFile: null,
      selfieFile: null,
      bankDetails: {},
      userId: null
    };

    return response;
  } catch (error) {
    console.error('Registration with verification error:', error);
    throw error;
  }
};

/**
 * Update user documents after registration
 * @param {string} userId - User ID
 * @param {Object} updateData - Data to update
 * @returns {Promise} - API response
 */
export const updateUserDocuments = async (userId, updateData) => {
  try {
    const formData = new FormData();

    // Add basic data
    Object.keys(updateData).forEach(key => {
      if (key !== 'files') {
        formData.append(key, updateData[key]);
      }
    });

    // Add files if provided
    if (updateData.files) {
      if (updateData.files.aadharFile) {
        const aadharFile = {
          uri: updateData.files.aadharFile.uri,
          type: updateData.files.aadharFile.type || 'image/jpeg',
          name: updateData.files.aadharFile.fileName || 'aadhar.jpg'
        };
        formData.append('aadharFile', aadharFile);
      }

      if (updateData.files.selfieFile) {
        const selfieFile = {
          uri: updateData.files.selfieFile.uri,
          type: updateData.files.selfieFile.type || 'image/jpeg',
          name: updateData.files.selfieFile.fileName || 'selfie.jpg'
        };
        formData.append('selfieFile', selfieFile);
      }
    }

    const response = await apiClient.put(`${API_URL}/update-documents/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response;
  } catch (error) {
    console.error('Update user documents error:', error);
    throw error;
  }
};

/**
 * Clear verification data
 */
export const clearVerificationData = () => {
  verificationData = {
    aadharFile: null,
    selfieFile: null,
    bankDetails: {},
    userId: null
  };
};
