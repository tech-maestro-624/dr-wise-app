import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Alert,
  Platform,
  Dimensions,
  Modal,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getUserData } from '../api/auth';
import { updateUser } from '../api/user';
import { useAuth } from '../context/AuthContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const scale = Math.min(screenWidth / 375, screenHeight / 812);

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user: authUser } = useAuth();
  const { userData: initialUserData } = route.params || {};

  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    accountNumber: '',
    ifscCode: '',
    upiId: '',
  });
  const [originalData, setOriginalData] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState(null);

  // Fetch user data from API
  const fetchUserData = async () => {
    try {
      setLoading(true);

      // Try to get user data from route params first, then fallback to API
      let userData = initialUserData;

      if (!userData) {
        const response = await getUserData();
        if (response.data && response.data.user) {
          userData = response.data.user;
        } else if (authUser) {
          userData = authUser;
        }
      }

      if (userData) {
        const formattedData = {
          name: userData.name || '',
          phoneNumber: userData.phoneNumber || '',
          email: userData.email || '',
          accountNumber: userData.accountNumber || '',
          ifscCode: userData.ifscCode || '',
          upiId: userData.upiId || '',
        };

        setFormData(formattedData);
        setOriginalData(formattedData);
        setUserId(userData._id || userData.id);

        console.log('User data loaded:', userData);
      } else {
        Alert.alert('Error', 'Failed to load user data. Please try again.');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      const errorMessage = error?.response?.data?.message || error.message || 'Failed to load user data';
      Alert.alert('Error', errorMessage);
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  // Load user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  const formatPhoneNumber = (text) => {
    // Remove all non-numeric characters
    const cleaned = text.replace(/\D/g, '');
    // Limit to 10 digits
    const limited = cleaned.slice(0, 10);
    return limited;
  };

  const formatIFSCCode = (text) => {
    // Convert to uppercase and limit to 11 characters
    return text.toUpperCase().slice(0, 11);
  };

  const formatAccountNumber = (text) => {
    // Remove all non-numeric characters
    const cleaned = text.replace(/\D/g, '');
    // Limit to 16 digits
    return cleaned.slice(0, 16);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone) => {
    return phone.length === 10;
  };

  const handleInputChange = (field, value) => {
    let formattedValue = value;

    // Apply formatting based on field type
    switch (field) {
      case 'phoneNumber':
        formattedValue = formatPhoneNumber(value);
        break;
      case 'ifscCode':
        formattedValue = formatIFSCCode(value);
        break;
      case 'accountNumber':
        formattedValue = formatAccountNumber(value);
        break;
      case 'email':
        formattedValue = value.toLowerCase();
        break;
      default:
        break;
    }

    setFormData(prev => ({
      ...prev,
      [field]: formattedValue
    }));
  };

  const handleSave = async () => {
    // Validate required fields
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    if (!formData.phoneNumber) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    if (!validatePhoneNumber(formData.phoneNumber)) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return;
    }

    if (!formData.email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    if (!validateEmail(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Check if data has actually changed
    const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);
    if (!hasChanges) {
      Alert.alert('Info', 'No changes detected. Please modify at least one field.');
      return;
    }

    if (!userId) {
      Alert.alert('Error', 'User ID not found. Please try again.');
      return;
    }

    try {
      setSaving(true);

      // Prepare data to send (only changed fields)
      const updateData = {};
      Object.keys(formData).forEach(key => {
        if (formData[key] !== originalData[key]) {
          updateData[key] = formData[key];
        }
      });

      console.log('Updating user profile:', { userId, updateData });

      const response = await updateUser(userId, updateData);

      if (response && (response.status === 200 || response.status === 201)) {
        console.log('Profile updated successfully:', response.data);

        // Update original data to reflect changes
        setOriginalData(formData);

        // Show success modal
        setShowSuccessModal(true);

        // Auto hide after 3 seconds and navigate back
        setTimeout(() => {
          setShowSuccessModal(false);
          navigation.goBack();
        }, 3000);
      } else {
        const errorMessage = response?.data?.message || 'Failed to update profile';
        Alert.alert('Error', errorMessage);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error?.response?.data?.message || error.message || 'Failed to update profile. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3ECFE" />
      <LinearGradient
        colors={['#F3ECFE', '#F6F6FE']}
        locations={[0, 0.4917]}
        style={styles.background}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <View style={styles.backButtonBackground}>
                <Ionicons name="chevron-back-outline" size={15 * scale} color="#1A1B20" />
              </View>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit profile</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Loading Indicator */}
            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#8F31F9" />
                <Text style={styles.loadingText}>Loading profile data...</Text>
              </View>
            )}

            {!loading && (
              <>
                {/* Section Title */}
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Edit profile details</Text>
                  <Text style={styles.sectionDescription}>
                    Update your information to keep your profile current.
                  </Text>
                </View>

            {/* Form Fields */}
            <View style={styles.formContainer}>
              {/* Name Field */}
              <View style={styles.inputField}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your name"
                  placeholderTextColor="#7D7D7D"
                  value={formData.name}
                  onChangeText={(value) => handleInputChange('name', value)}
                  autoCapitalize="words"
                />
              </View>

              {/* Phone Number Field */}
              <View style={styles.inputField}>
                <Text style={styles.inputLabel}>Phone number</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your number"
                  placeholderTextColor="#7D7D7D"
                  value={formData.phoneNumber}
                  onChangeText={(value) => handleInputChange('phoneNumber', value)}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>

              {/* Email Field */}
              <View style={styles.inputField}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your email"
                  placeholderTextColor="#7D7D7D"
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              {/* Account Number Field */}
              <View style={styles.inputField}>
                <Text style={styles.inputLabel}>Account Number</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter Account Number"
                  placeholderTextColor="#7D7D7D"
                  value={formData.accountNumber}
                  onChangeText={(value) => handleInputChange('accountNumber', value)}
                  keyboardType="numeric"
                  maxLength={16}
                />
              </View>

              {/* IFSC Code Field */}
              <View style={styles.inputField}>
                <Text style={styles.inputLabel}>IFSC Code</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter IFSC Code"
                  placeholderTextColor="#7D7D7D"
                  value={formData.ifscCode}
                  onChangeText={(value) => handleInputChange('ifscCode', value)}
                  autoCapitalize="characters"
                  maxLength={11}
                />
              </View>

              {/* UPI ID Field */}
              <View style={styles.inputField}>
                <Text style={styles.inputLabel}>UPI ID</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter UPI ID"
                  placeholderTextColor="#7D7D7D"
                  value={formData.upiId}
                  onChangeText={(value) => handleInputChange('upiId', value)}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>
              </>
            )}
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, saving && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={saving || loading}
            >
              {saving ? (
                <ActivityIndicator color="#FBFBFB" size="small" />
              ) : (
                <Text style={styles.saveButtonText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* Success Modal */}
        <Modal
          visible={showSuccessModal}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.successToast}>
              <View style={styles.successIconContainer}>
                <Image 
                  source={require('../../assets/Icons/tickmark.png')}
                  style={styles.successIcon}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.successTextContainer}>
                <Text style={styles.successTitle}>Profile updated successfully</Text>
                <Text style={styles.successSubtitle}>
                  Your details have been saved and updated as you changed.
                </Text>
              </View>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3ECFE',
  },
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20 * scale,
    paddingVertical: 12 * scale,
    height: 80 * scale,
  },
  backButton: {
    width: 26 * scale,
    height: 26 * scale,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonBackground: {
    width: 26 * scale,
    height: 26 * scale,
    borderRadius: 4 * scale,
    backgroundColor: 'rgba(150, 61, 251, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 24 * scale,
    color: '#1A1B20',
    lineHeight: 28 * scale,
    textAlign: 'center',
  },
  placeholder: {
    width: 26 * scale,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20 * scale,
    paddingBottom: 120 * scale,
  },
  sectionHeader: {
    marginBottom: 19 * scale,
  },
  sectionTitle: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 24 * scale,
    color: '#1A1B20',
    lineHeight: 28 * scale,
    marginBottom: 6 * scale,
  },
  sectionDescription: {
    fontFamily: 'Rubik',
    fontSize: 14 * scale,
    fontWeight: '400',
    color: '#7D7D7D',
    lineHeight: 17 * scale,
    letterSpacing: 0.2,
  },
  formContainer: {
    gap: 19 * scale,
  },
  inputField: {
    gap: 4 * scale,
  },
  inputLabel: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 16 * scale,
    color: '#1A1B20',
    lineHeight: 19 * scale,
    letterSpacing: 0.2,
  },
  textInput: {
    fontFamily: 'Rubik',
    fontSize: 16 * scale,
    fontWeight: '400',
    color: '#1A1B20',
    lineHeight: 19 * scale,
    letterSpacing: 0.2,
    borderWidth: 1,
    borderColor: '#1A1B20',
    borderRadius: 8 * scale,
    paddingHorizontal: 16 * scale,
    paddingVertical: 14 * scale,
    backgroundColor: 'transparent',
    height: 50 * scale,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20 * scale,
    paddingBottom: 34 * scale,
    gap: 18 * scale,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'rgba(150, 61, 251, 0.05)',
    borderRadius: 8 * scale,
    paddingVertical: 14 * scale,
    paddingHorizontal: 16 * scale,
    alignItems: 'center',
    justifyContent: 'center',
    height: 47 * scale,
  },
  cancelButtonText: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 16 * scale,
    color: '#8F31F9',
    lineHeight: 19 * scale,
    letterSpacing: 0.2,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#8F31F9',
    borderRadius: 8 * scale,
    paddingVertical: 14 * scale,
    paddingHorizontal: 16 * scale,
    alignItems: 'center',
    justifyContent: 'center',
    height: 47 * scale,
  },
  saveButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  saveButtonText: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 16 * scale,
    color: '#FBFBFB',
    lineHeight: 19 * scale,
    letterSpacing: 0.2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successToast: {
    backgroundColor: '#FBFBFB',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 10 * scale,
    width: 335 * scale,
    height: 72 * scale,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: 'rgba(143, 49, 249, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 3,
  },
  successIconContainer: {
    width: 60 * scale,
    height: 60 * scale,
    backgroundColor: 'rgba(150, 61, 251, 0.00)',
    borderRadius: 8 * scale,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6 * scale,
  },
  successIcon: {
    width: 60 * scale,
    height: 60 * scale,
  },
  successTextContainer: {
    flex: 1,
    marginLeft: 12 * scale,
    marginRight: 20 * scale,
  },
  successTitle: {
    fontFamily: 'Rubik',
    fontSize: 14 * scale,
    fontWeight: '600',
    color: '#1A1B20',
    lineHeight: 17 * scale,
    marginBottom: 4 * scale,
  },
  successSubtitle: {
    fontFamily: 'Rubik',
    fontSize: 11 * scale,
    fontWeight: '400',
    color: '#7D7D7D',
    lineHeight: 13 * scale,
    letterSpacing: 0.2,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60 * scale,
  },
  loadingText: {
    fontSize: 16 * scale,
    fontWeight: '500',
    color: '#7D7D7D',
    fontFamily: 'Rubik',
    marginTop: 16 * scale,
    textAlign: 'center',
  },
});

export default EditProfileScreen;