import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Alert,
  Platform,
  Modal,
  Image,
  Dimensions
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Contacts from 'expo-contacts';
import { createLead } from '../api/lead';
import Toast from 'react-native-toast-message';

// Success Modal Component
const SuccessModal = ({ visible, onClose, product }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.successModalContainer}>
          {/* Success Icon */}
          <View style={styles.successIconContainer}>
            <View style={styles.successIconBackground}>
              <Ionicons name="checkmark" size={40} color="#FFFFFF" />
            </View>
            <View style={styles.successRing}>
              <View style={styles.successRingInner} />
            </View>
          </View>

          {/* Content */}
          <View style={styles.successContent}>
            <Text style={styles.successTitle}>🎉 Referral Submitted!</Text>
            <Text style={styles.successSubtitle}>
              Thank you for referring your friend to
            </Text>
            <Text style={styles.productName}>
              {product?.name || 'this product'}
            </Text>

            <View style={styles.successDetails}>
              <Text style={styles.successDetailText}>
                We'll contact your friend within 24 hours and keep you updated on the progress.
              </Text>
            </View>

            {/* Benefits */}
            <View style={styles.benefitsContainer}>
              <View style={styles.benefitItem}>
                <Ionicons name="gift-outline" size={20} color="#8F31F9" />
                <Text style={styles.benefitText}>You'll earn coins when your referral converts</Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="notifications-outline" size={20} color="#8F31F9" />
                <Text style={styles.benefitText}>Get notified about the progress</Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="trophy-outline" size={20} color="#8F31F9" />
                <Text style={styles.benefitText}>Help your friend save money</Text>
              </View>
            </View>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            style={styles.successButton}
            onPress={onClose}
          >
            <LinearGradient
              colors={['#8F31F9', '#A855F7', '#C084FC']}
              locations={[0, 0.6, 1]}
              style={styles.successButtonGradient}
            >
              <Text style={styles.successButtonText}>Continue Exploring</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// Get screen dimensions for styles
const { width: screenWidth } = Dimensions.get('window');

const ReferralFormScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { product, category } = route.params || {};

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [contactsPermission, setContactsPermission] = useState(null);
  const [autoFilledFields, setAutoFilledFields] = useState({
    name: false,
    email: false,
    phone: false
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }

    // Reset auto-filled status when user manually edits
    if (autoFilledFields[field]) {
      setAutoFilledFields(prev => ({
        ...prev,
        [field]: false
      }));
    }
  };

  // Request contacts permission
  const requestContactsPermission = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      setContactsPermission(status);

      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Contacts permission is required to pick contacts from your phone book.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Settings', onPress: () => Contacts.requestPermissionsAsync() }
          ]
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error requesting contacts permission:', error);
      Toast.show({
        type: 'error',
        text1: 'Permission Error',
        text2: 'Failed to request contacts permission.',
        position: 'top'
      });
      return false;
    }
  };

  // Pick contact from device
  const pickContact = async () => {
    try {
      // Request permission if not already granted
      const hasPermission = contactsPermission === 'granted' || await requestContactsPermission();

      if (!hasPermission) {
        return;
      }

      // Open contact picker
      const contact = await Contacts.presentContactPickerAsync();

      console.log('Selected contact:', contact);

      if (contact) {
        // Extract contact information
        const contactName = contact.name || '';
        const contactPhone = contact.phoneNumbers && contact.phoneNumbers.length > 0
          ? contact.phoneNumbers[0].number || ''
          : '';
        const contactEmail = contact.emails && contact.emails.length > 0
          ? contact.emails[0].email || ''
          : '';

        // Auto-fill form with contact information
        setFormData(prev => ({
          ...prev,
          name: contactName,
          phone: contactPhone,
          email: contactEmail
        }));

        // Set auto-filled status
        setAutoFilledFields({
          name: !!contactName,
          phone: !!contactPhone,
          email: !!contactEmail
        });

        // Clear any existing errors
        setErrors({});

        Toast.show({
          type: 'success',
          text1: 'Contact Selected',
          text2: 'Contact information has been filled automatically.',
          position: 'top'
        });
      }
    } catch (error) {
      console.error('Error picking contact:', error);
      if (error.message !== 'User canceled the operation') {
        Toast.show({
          type: 'error',
          text1: 'Contact Error',
          text2: 'Failed to pick contact. Please try again.',
          position: 'top'
        });
      }
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Prepare lead data
      const leadData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        message: formData.message.trim(),
        productId: product?._id,
        productName: product?.name,
        category: category,
        source: 'product_referral',
        status: 'new'
      };

      console.log('Submitting lead data:', leadData);

      const response = await createLead(leadData);

      console.log('Lead creation response:', response);

      if (response.data && (response.data.success || response.status === 200 || response.status === 201)) {
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: ''
        });

        // Reset auto-filled indicators
        setAutoFilledFields({
          name: false,
          email: false,
          phone: false
        });

        // Show success modal
        setShowSuccessModal(true);
      } else {
        throw new Error('Failed to submit referral');
      }
    } catch (error) {
      console.error('Error submitting referral:', error);
      Toast.show({
        type: 'error',
        text1: 'Submission Failed',
        text2: error.response?.data?.message || 'Failed to submit referral. Please try again.',
        position: 'top'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F6FF" />
      <SafeAreaView style={styles.safeArea}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#1A1B20" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Categories</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Top Card with Illustration and Pick from Contacts */}
        <View style={styles.topCard}>
          <Image
            source={require('../../assets/Icons/referal.png')}
            style={styles.illustrationImage}
            resizeMode="contain"
          />

          {/* Pick from Contacts Button */}
          <TouchableOpacity
            style={styles.pickContactsButton}
            onPress={pickContact}
          >
            <Ionicons name="people-outline" size={18} color="#8F31F9" />
            <Text style={styles.pickContactsButtonText}>Pick from contacts</Text>
          </TouchableOpacity>
        </View>

        {/* Form Content */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.contentContainer}>

            <Text style={styles.sectionTitle}>Enter Details</Text>
            <Text style={styles.sectionSubtitle}>
              Fill the details for referral
            </Text>

            {/* Name Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={[styles.textInput, errors.name && styles.inputError]}
                placeholder="Enter your name"
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                placeholderTextColor="#7D7D7D"
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            {/* Phone Number Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={[styles.textInput, errors.phone && styles.inputError]}
                placeholder="Enter your Number"
                value={formData.phone}
                onChangeText={(value) => handleInputChange('phone', value)}
                keyboardType="phone-pad"
                maxLength={10}
                placeholderTextColor="#7D7D7D"
              />
              {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={[styles.textInput, errors.email && styles.inputError]}
                placeholder="Enter your email"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#7D7D7D"
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={[styles.textInput, errors.message && styles.inputError]}
                placeholder="Enter your password"
                value={formData.message}
                onChangeText={(value) => handleInputChange('message', value)}
                secureTextEntry={true}
                placeholderTextColor="#7D7D7D"
              />
              {errors.message && <Text style={styles.errorText}>{errors.message}</Text>}
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={loading}
              >
                <Text style={styles.submitButtonText}>
                  {loading ? 'Submitting...' : 'Submit'}
                </Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>

      </SafeAreaView>

      {/* Success Modal */}
      <SuccessModal
        visible={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          navigation.goBack();
        }}
        product={product}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F6FF',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F8F6FF',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1B20',
    fontFamily: 'Rubik-SemiBold',
  },
  headerSpacer: {
    width: 40,
  },

  // Top Card with Illustration and Pick from Contacts
  topCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    margin: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  illustrationImage: {
    width: screenWidth * 0.5,
    height: 160,
    marginBottom: 20,
  },
  pickContactsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F6FF',
    borderWidth: 1,
    borderColor: '#8F31F9',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    gap: 8,
  },
  pickContactsButtonText: {
    fontFamily: 'Rubik-Medium',
    fontSize: 16,
    color: '#8F31F9',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1A1B20',
    marginBottom: 8,
    fontFamily: 'Rubik-SemiBold',
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#7D7D7D',
    marginBottom: 24,
    fontFamily: 'Rubik-Regular',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1B20',
    marginBottom: 8,
    fontFamily: 'Rubik-Medium',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1A1B20',
    fontFamily: 'Rubik-Regular',
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: '#FF6B6B',
  },
  errorText: {
    fontSize: 14,
    color: '#FF6B6B',
    fontFamily: 'Rubik-Regular',
    marginTop: 4,
  },

  // Action Buttons
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
    gap: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F8F6FF',
    borderWidth: 1,
    borderColor: '#8F31F9',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontFamily: 'Rubik-Medium',
    fontSize: 16,
    color: '#8F31F9',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#8F31F9',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#8F31F9',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },

  // Success Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successModalContainer: {
    width: '85%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 15,
    },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  successIconContainer: {
    alignItems: 'center',
    marginBottom: 25,
    position: 'relative',
  },
  successIconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  successRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#4CAF50',
    opacity: 0.3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successRingInner: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: '#4CAF50',
    opacity: 0.2,
  },
  successContent: {
    alignItems: 'center',
    marginBottom: 30,
  },
  successTitle: {
    fontFamily: 'Rubik-Bold',
    fontSize: 24,
    color: '#1A1B20',
    marginBottom: 8,
    textAlign: 'center',
  },
  successSubtitle: {
    fontFamily: 'Rubik-Regular',
    fontSize: 14,
    color: '#7D7D7D',
    marginBottom: 4,
  },
  productName: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 16,
    color: '#1A1B20',
    textAlign: 'center',
    marginBottom: 16,
  },
  successDetails: {
    marginBottom: 20,
  },
  successDetailText: {
    fontFamily: 'Rubik-Regular',
    fontSize: 14,
    color: '#1A1B20',
    textAlign: 'center',
    lineHeight: 20,
  },
  benefitsContainer: {
    width: '100%',
    marginTop: 15,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  benefitText: {
    fontFamily: 'Rubik-Regular',
    fontSize: 14,
    color: '#1A1B20',
    marginLeft: 12,
    flex: 1,
    lineHeight: 18,
  },
  successButton: {
    width: '100%',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#8F31F9',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
    overflow: 'hidden',
  },
  successButtonGradient: {
    width: '100%',
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successButtonText: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default ReferralFormScreen;
