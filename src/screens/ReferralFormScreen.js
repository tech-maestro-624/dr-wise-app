import React, { useState, useEffect } from 'react';
import { Animated } from 'react-native';
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
import { getCategories, getProductByCategory } from '../api/categorys';
import { useAuth } from '../context/AuthContext';
import Toast from 'react-native-toast-message';

// Product Selection Modal Component
const ProductSelectionModal = ({
  visible,
  onClose,
  categories,
  products,
  selectedCategoryId,
  onCategorySelect,
  selectedProducts,
  onProductToggle
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.productModalContainer}>
          {/* Header */}
          <View style={styles.productModalHeader}>
            <Text style={styles.productModalTitle}>Select Category & Products</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#1A1B20" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.productModalScroll}>
            {/* Categories Section */}
            <Text style={styles.modalSectionTitle}>Categories</Text>
            {categories.map((category) => (
              <TouchableOpacity
                key={category._id}
                style={[
                  styles.categoryItem,
                  selectedCategoryId === category._id && styles.categoryItemSelected
                ]}
                onPress={() => onCategorySelect(category._id)}
              >
                <Text style={[
                  styles.categoryItemText,
                  selectedCategoryId === category._id && styles.categoryItemTextSelected
                ]}>
                  {category.name}
                </Text>
                {selectedCategoryId === category._id && (
                  <Ionicons name="checkmark" size={20} color="#8F31F9" />
                )}
              </TouchableOpacity>
            ))}

            {/* Products Section */}
            {selectedCategoryId && products.length > 0 && (
              <>
                <Text style={styles.modalSectionTitle}>Products</Text>
                <Text style={styles.modalSectionSubtitle}>Select one or more products</Text>
                {products.map((product) => {
                  const isSelected = selectedProducts.includes(product._id);
                  return (
                    <TouchableOpacity
                      key={product._id}
                      style={[
                        styles.productItem,
                        isSelected && styles.productItemSelected
                      ]}
                      onPress={() => onProductToggle(product._id)}
                    >
                      <View style={styles.productItemContent}>
                        <Text style={[
                          styles.productItemText,
                          isSelected && styles.productItemTextSelected
                        ]}>
                          {product.name}
                        </Text>
                        <View style={[
                          styles.checkbox,
                          isSelected && styles.checkboxSelected
                        ]}>
                          {isSelected && (
                            <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                          )}
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </>
            )}

            {selectedCategoryId && products.length === 0 && (
              <Text style={styles.noProductsText}>No products available in this category</Text>
            )}
          </ScrollView>

          {/* Done Button */}
          <TouchableOpacity
            style={styles.doneButton}
            onPress={onClose}
          >
            <LinearGradient
              colors={['#8F31F9', '#A855F7', '#C084FC']}
              locations={[0, 0.6, 1]}
              style={styles.doneButtonGradient}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// Success Modal Component
const SuccessModal = ({ visible, onClose, referralCount, onNewReferral }) => {
  const [animationValue] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.spring(animationValue, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(animationValue, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const scale = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  const opacity = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View style={styles.successModalOverlay}>
        <Animated.View
          style={[
            styles.successModalContainer,
            {
              transform: [{ scale }],
              opacity,
            },
          ]}
        >
          {/* Success Animation */}
          <View style={styles.successAnimationContainer}>
            <View style={styles.successIconWrapper}>
              <View style={styles.successIconBackground}>
                <Ionicons name="checkmark" size={40} color="#FFFFFF" />
              </View>
            </View>
            <View style={styles.confettiContainer}>
              <Ionicons name="sparkles" size={20} color="#FFD700" style={styles.confetti1} />
              <Ionicons name="sparkles" size={16} color="#FF69B4" style={styles.confetti2} />
              <Ionicons name="sparkles" size={18} color="#32CD32" style={styles.confetti3} />
            </View>
          </View>

          {/* Content */}
          <View style={styles.successContent}>
            <Text style={styles.successTitle}>🎉 Referral Submitted!</Text>
            <Text style={styles.successSubtitle}>
              Great job! You've successfully submitted {referralCount} referral{referralCount > 1 ? 's' : ''}.
            </Text>

            <View style={styles.successDetails}>
              <View style={styles.detailItem}>
                <Ionicons name="people-outline" size={20} color="#8F31F9" />
                <Text style={styles.detailText}>Your friend will be contacted within 24 hours</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="gift-outline" size={20} color="#8F31F9" />
                <Text style={styles.detailText}>You'll earn coins when they convert</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="notifications-outline" size={20} color="#8F31F9" />
                <Text style={styles.detailText}>Get notified about progress updates</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.successActions}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={onNewReferral}
            >
              <Text style={styles.secondaryButtonText}>Make Another Referral</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={onClose}
            >
              <LinearGradient
                colors={['#8F31F9', '#A855F7', '#C084FC']}
                locations={[0, 0.6, 1]}
                style={styles.primaryButtonGradient}
              >
                <Text style={styles.primaryButtonText}>Continue</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>
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
  const { user, isAuthenticated } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    productIds: [] // Changed to array for multiple products
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [contactsPermission, setContactsPermission] = useState(null);
  const [autoFilledFields, setAutoFilledFields] = useState({
    name: false,
    email: false,
    phone: false
  });


  // Categories and products state
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        if (response.data) {
          setCategories(response.data);

          // If category is passed via route params, set it as selected
          if (category && response.data) {
            // Try to find category by name first, then by _id
            const categoryObj = response.data.find(cat =>
              cat.name === category || cat._id === category
            );
            if (categoryObj) {
              setSelectedCategoryId(categoryObj._id);
            }
          }

          // If product is passed via route params, set it in form data
          if (product) {
            const productObj = response.data.find(cat =>
              cat.products && cat.products.find(p =>
                p.name === product || p._id === product
              )
            );
            if (productObj) {
              const prod = productObj.products.find(p =>
                p.name === product || p._id === product
              );
              if (prod) {
                setFormData(prev => ({
                  ...prev,
                  productIds: [prod._id]
                }));
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to load categories',
          position: 'top'
        });
      }
    };

    fetchCategories();
  }, [category]);

  // Fetch products when category is selected
  useEffect(() => {
    const fetchProducts = async () => {
      if (selectedCategoryId) {
        try {
          console.log('Fetching products for category:', selectedCategoryId);
          const response = await getProductByCategory(selectedCategoryId);
          if (response.data) {
            setProducts(response.data);
            console.log('Products loaded:', response.data);
          }
        } catch (error) {
          console.error('Error fetching products:', error);
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Failed to load products',
            position: 'top'
          });
        }
      } else {
        setProducts([]);
      }
    };

    fetchProducts();
  }, [selectedCategoryId]);

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

  // Handle product selection
  const handleProductToggle = (productId) => {
    setFormData(prev => {
      const isSelected = prev.productIds.includes(productId);
      if (isSelected) {
        // Remove product if already selected
        return {
          ...prev,
          productIds: prev.productIds.filter(id => id !== productId)
        };
      } else {
        // Add product if not selected
        return {
          ...prev,
          productIds: [...prev.productIds, productId]
        };
      }
    });

    // Clear productIds error when user selects products
    if (errors.productIds) {
      setErrors(prev => ({
        ...prev,
        productIds: ''
      }));
    }
  };

  // Get selected product names for display
  const getSelectedProductNames = () => {
    return products
      .filter(product => formData.productIds.includes(product._id))
      .map(product => product.name)
      .join(', ');
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

    // Email is now optional, but if provided, validate format
    if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Validate that category is selected
    if (!selectedCategoryId) {
      newErrors.category = 'Please select a category';
    }

    // Validate that at least one product is selected
    if (!formData.productIds || formData.productIds.length === 0) {
      newErrors.productIds = 'Please select at least one product';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      Toast.show({
        type: 'error',
        text1: 'Authentication Required',
        text2: 'Please login to submit a referral.',
        position: 'top'
      });
      return;
    }

    // Check if category is selected
    if (!selectedCategoryId) {
      Toast.show({
        type: 'error',
        text1: 'Category Required',
        text2: 'Please select a category before submitting.',
        position: 'top'
      });
      return;
    }

    setLoading(true);

    try {
      // Get the selected category object from the categories array
      const selectedCategoryObj = categories.find(cat => cat._id === selectedCategoryId);

      console.log('Debug - Selected category ID:', selectedCategoryId);
      console.log('Debug - Selected category object:', selectedCategoryObj);
      console.log('Debug - User object:', user);
      console.log('Debug - Form data:', formData);

      // Fallback: if no category object found and selectedCategoryId looks like a name, try to find by name
      let finalCategoryId = selectedCategoryObj?._id || selectedCategoryId;
      if (!selectedCategoryObj && selectedCategoryId) {
        const categoryByName = categories.find(cat => cat.name === selectedCategoryId);
        if (categoryByName) {
          finalCategoryId = categoryByName._id;
          console.log('Debug - Found category by name:', categoryByName);
        }
      }

      // Create single lead with multiple products
      const leadData = {
        name: formData.name.trim(),
        phoneNumber: formData.phone.trim(),
        email: formData.email.trim() || undefined, // Optional field
        message: formData.message.trim() || undefined, // Optional field
        referrer: user?._id, // Authenticated user's ID
        categoryId: finalCategoryId, // Use the resolved category ID
        productIds: formData.productIds, // Send array of product IDs
        source: 'product_referral',
        status: 'New' // Match backend status
      };

      // Remove undefined fields
      Object.keys(leadData).forEach(key => {
        if (leadData[key] === undefined) {
          delete leadData[key];
        }
      });

      console.log('Lead data with multiple products:', leadData);

      // Validate that we have all required data before proceeding
      if (!leadData.name || !leadData.phoneNumber || !leadData.referrer || !leadData.categoryId || !leadData.productIds || leadData.productIds.length === 0) {
        console.error('Missing required fields:', {
          name: leadData.name,
          phoneNumber: leadData.phoneNumber,
          referrer: leadData.referrer,
          categoryId: leadData.categoryId,
          productIds: leadData.productIds
        });
        throw new Error('Missing required fields for lead creation');
      }

      const response = await createLead(leadData);

      console.log('Lead creation response:', response);

      // Check if response was successful
      const isSuccessful = response.data && (response.data.success || response.status === 200 || response.status === 201);

      if (isSuccessful) {
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
          productIds: []
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

            {/* Category Selection */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Select Category</Text>
              <TouchableOpacity
                style={[styles.dropdownButton, errors.category && styles.inputError]}
                onPress={() => setShowProductModal(true)}
              >
                <Text style={styles.dropdownButtonText}>
                  {selectedCategoryId
                    ? categories.find(cat => cat._id === selectedCategoryId)?.name || 'Select Category'
                    : 'Select Category'
                  }
                </Text>
                <Ionicons name="chevron-down" size={20} color="#8F31F9" />
              </TouchableOpacity>
              {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
            </View>

            {/* Product Selection */}
            {selectedCategoryId && (
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Select Products (Multiple)</Text>
                <TouchableOpacity
                  style={[styles.dropdownButton, errors.productIds && styles.inputError]}
                  onPress={() => setShowProductModal(true)}
                >
                  <Text style={styles.dropdownButtonText}>
                    {formData.productIds.length > 0
                      ? `${formData.productIds.length} product${formData.productIds.length > 1 ? 's' : ''} selected`
                      : 'Select Products'
                    }
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#8F31F9" />
                </TouchableOpacity>
                {formData.productIds.length > 0 && (
                  <Text style={styles.selectedProductsText}>
                    {getSelectedProductNames()}
                  </Text>
                )}
                {errors.productIds && <Text style={styles.errorText}>{errors.productIds}</Text>}
              </View>
            )}

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

            {/* Message Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Message (Optional)</Text>
              <TextInput
                style={[styles.textInput, errors.message && styles.inputError]}
                placeholder="Enter your message"
                value={formData.message}
                onChangeText={(value) => handleInputChange('message', value)}
                multiline={true}
                numberOfLines={3}
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

      {/* Product Selection Modal */}
      <ProductSelectionModal
        visible={showProductModal}
        onClose={() => setShowProductModal(false)}
        categories={categories}
        products={products}
        selectedCategoryId={selectedCategoryId}
        onCategorySelect={(categoryId) => {
          setSelectedCategoryId(categoryId);
          // Clear selected products when category changes
          setFormData(prev => ({ ...prev, productIds: [] }));
          // Clear category error
          if (errors.category) {
            setErrors(prev => ({ ...prev, category: '' }));
          }
        }}
        selectedProducts={formData.productIds}
        onProductToggle={handleProductToggle}
            />

      {/* Success Modal */}
      <SuccessModal
        visible={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          navigation.goBack();
        }}
        referralCount={formData.productIds.length}
        onNewReferral={() => {
          setShowSuccessModal(false);
          // Reset form for new referral
          setFormData({
            name: '',
            email: '',
            phone: '',
            message: '',
            productIds: []
          });
          setSelectedCategoryId(null);
          setErrors({});
        }}
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


  // Dropdown Button Styles
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1A1B20',
    fontFamily: 'Rubik-Regular',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#1A1B20',
    fontFamily: 'Rubik-Regular',
  },
  selectedProductsText: {
    fontSize: 14,
    color: '#7D7D7D',
    fontFamily: 'Rubik-Regular',
    marginTop: 8,
    lineHeight: 18,
  },

  // Product Modal Styles
  productModalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
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
  productModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  productModalTitle: {
    fontFamily: 'Rubik-Bold',
    fontSize: 20,
    color: '#1A1B20',
  },
  closeButton: {
    padding: 8,
  },
  productModalScroll: {
    maxHeight: 400,
  },
  modalSectionTitle: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 18,
    color: '#1A1B20',
    marginTop: 20,
    marginBottom: 15,
  },
  modalSectionSubtitle: {
    fontFamily: 'Rubik-Regular',
    fontSize: 14,
    color: '#7D7D7D',
    marginBottom: 15,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#F8F6FF',
  },
  categoryItemSelected: {
    backgroundColor: '#F0E6FF',
    borderWidth: 1,
    borderColor: '#8F31F9',
  },
  categoryItemText: {
    fontFamily: 'Rubik-Medium',
    fontSize: 16,
    color: '#1A1B20',
  },
  categoryItemTextSelected: {
    color: '#8F31F9',
    fontFamily: 'Rubik-SemiBold',
  },
  productItem: {
    marginBottom: 8,
  },
  productItemSelected: {
    backgroundColor: '#F0E6FF',
  },
  productItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 12,
    backgroundColor: '#F8F6FF',
  },
  productItemText: {
    fontFamily: 'Rubik-Medium',
    fontSize: 16,
    color: '#1A1B20',
    flex: 1,
  },
  productItemTextSelected: {
    color: '#8F31F9',
    fontFamily: 'Rubik-SemiBold',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#8F31F9',
    borderColor: '#8F31F9',
  },
  noProductsText: {
    fontFamily: 'Rubik-Regular',
    fontSize: 14,
    color: '#7D7D7D',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  doneButton: {
    marginTop: 20,
    borderRadius: 16,
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
  doneButtonGradient: {
    width: '100%',
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneButtonText: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },

  // Success Modal Styles
  successModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successModalContainer: {
    width: '90%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 25,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  successAnimationContainer: {
    alignItems: 'center',
    marginBottom: 25,
    position: 'relative',
  },
  successIconWrapper: {
    position: 'relative',
    zIndex: 2,
  },
  successIconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confetti1: {
    position: 'absolute',
    top: -10,
    right: -10,
  },
  confetti2: {
    position: 'absolute',
    top: 10,
    left: -8,
  },
  confetti3: {
    position: 'absolute',
    bottom: -8,
    left: -5,
  },
  successContent: {
    alignItems: 'center',
    marginBottom: 30,
  },
  successTitle: {
    fontFamily: 'Rubik-Bold',
    fontSize: 26,
    color: '#1A1B20',
    marginBottom: 12,
    textAlign: 'center',
  },
  successSubtitle: {
    fontFamily: 'Rubik-Medium',
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 24,
  },
  successDetails: {
    width: '100%',
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  detailText: {
    fontFamily: 'Rubik-Regular',
    fontSize: 14,
    color: '#1A1B20',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  successActions: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#F8F6FF',
    borderWidth: 1,
    borderColor: '#8F31F9',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#8F31F9',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  secondaryButtonText: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 14,
    color: '#8F31F9',
  },
  primaryButton: {
    flex: 1,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#8F31F9',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
    overflow: 'hidden',
  },
  primaryButtonGradient: {
    width: '100%',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
});

export default ReferralFormScreen;
