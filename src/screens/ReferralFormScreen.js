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
import { searchProducts, getAllProducts } from '../api/product';
import { useAuth } from '../context/AuthContext';
import Toast from 'react-native-toast-message';

// Product Selection Modal Component
const ProductSelectionModal = ({
  visible,
  onClose,
  products,
  selectedProducts,
  onProductToggle,
  searchQuery,
  onSearchChange,
  isSearching
}) => {
  console.log('ProductSelectionModal render:', {
    visible,
    productsCount: products ? products.length : 0,
    selectedProductsCount: selectedProducts ? selectedProducts.length : 0,
    searchQuery,
    isSearching
  });
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
            <Text style={styles.productModalTitle}>Select Products</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#1A1B20" />
            </TouchableOpacity>
          </View>

          {/* Search Input */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Ionicons name="search" size={20} color="#7D7D7D" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search products..."
                value={searchQuery}
                onChangeText={onSearchChange}
                placeholderTextColor="#7D7D7D"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => onSearchChange('')}
                  style={styles.clearButton}
                >
                  <Ionicons name="close-circle" size={20} color="#7D7D7D" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <ScrollView style={styles.productModalScroll}>
            {/* Products Section */}
            {(products && products.length > 0) ? (
              <>
                <Text style={styles.modalSectionTitle}>
                  {(selectedProducts && selectedProducts.length > 0)
                    ? `Products (${selectedProducts.length} selected)`
                    : 'Products'
                  }
                </Text>
                <Text style={styles.modalSectionSubtitle}>Select one or more products</Text>

                {isSearching && (
                  <View style={styles.searchingIndicator}>
                    <Ionicons name="search" size={16} color="#8F31F9" />
                    <Text style={styles.searchingText}>Searching...</Text>
                  </View>
                )}

                {products.map((product) => {
                  console.log('Rendering product:', { id: product._id, name: product.name });
                  const isSelected = selectedProducts ? selectedProducts.includes(product._id) : false;
                  return (
                    <TouchableOpacity
                      key={product._id}
                      style={[
                        styles.productItem,
                        isSelected && styles.productItemSelected
                      ]}
                      onPress={() => {
                        console.log('Product pressed:', { id: product._id, name: product.name });
                        if (onProductToggle && product._id) {
                          onProductToggle(product._id);
                        } else {
                          console.error('onProductToggle or product._id is missing', { onProductToggle: !!onProductToggle, productId: product._id });
                        }
                      }}
                    >
                      <View style={styles.productItemContent}>
                        <View style={styles.productInfo}>
                          <Text style={[
                            styles.productItemText,
                            isSelected && styles.productItemTextSelected
                          ]}>
                            {product.name}
                          </Text>
                          {product.categoryId && (
                            <Text style={[
                              styles.productCategoryText,
                              isSelected && styles.productCategoryTextSelected
                            ]}>
                              {product.categoryId.name}
                            </Text>
                          )}
                        </View>
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
            ) : (
              <View style={styles.noProductsContainer}>
                <Ionicons name="search-outline" size={48} color="#7D7D7D" />
                <Text style={styles.noProductsText}>
                  {searchQuery && searchQuery.length > 0
                    ? 'No products found matching your search'
                    : 'No products available'
                  }
                </Text>
              </View>
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
              <Text style={styles.doneButtonText}>
                Done ({selectedProducts.length})
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// Success Modal Component
const SuccessModal = ({ visible, onClose }) => {
  const [animationValue] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.spring(animationValue, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true
      }).start();
    } else {
      Animated.spring(animationValue, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true
      }).start();
    }
  }, [visible]);

  const scale = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1]
  });

  const opacity = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1]
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
              opacity
            }
          ]}
        >
          <View style={styles.imageContainer}>
            <Image
              source={require('../../assets/3d_checkmark_2023_4 1.png')}
              style={styles.successImage}
            />
            <LinearGradient
              colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0)']}
              locations={[0, 0.3654, 0.6154, 0.9856]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.imageShadow}
            />
          </View>
          <Text style={styles.successTitle}>Congrats!</Text>
          <Text style={styles.successSubtitle}>
            Your referral has been sent successfully. Thanks for spreading the word!
          </Text>
          <TouchableOpacity style={styles.refreshButton} onPress={onClose}>
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
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
    productIds: [] // Changed to array for multiple products
  });

  // Ensure formData.productIds is always an array
  useEffect(() => {
    if (!Array.isArray(formData.productIds)) {
      console.warn('formData.productIds is not an array, resetting to empty array');
      setFormData(prev => ({
        ...prev,
        productIds: []
      }));
    }
  }, [formData.productIds]);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [contactsPermission, setContactsPermission] = useState(null);
  const [autoFilledFields, setAutoFilledFields] = useState({
    name: false,
    email: false,
    phone: false
  });


  // Products state
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Initialize filteredProducts with allProducts to avoid undefined errors
  useEffect(() => {
    if (allProducts.length > 0 && filteredProducts.length === 0) {
      setFilteredProducts(allProducts);
    }
  }, [allProducts, filteredProducts]);

  // Fetch all products on component mount
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        console.log('Fetching all products...');
        const response = await getAllProducts();
        console.log('Products response:', response);
        console.log('Response data type:', typeof response.data);
        console.log('Response data:', response.data);

        // Handle different response structures
        let productsData = [];
        if (response.data) {
          if (Array.isArray(response.data)) {
            productsData = response.data;
          } else if (response.data.data && Array.isArray(response.data.data)) {
            productsData = response.data.data;
          } else if (response.data.products && Array.isArray(response.data.products)) {
            productsData = response.data.products;
          }
        }

        console.log('Extracted products data:', productsData.length);

        if (productsData.length > 0) {
          // Populate category information for each product
          const productsWithCategories = productsData.map(prod => ({
            ...prod,
            categoryId: prod.categoryId || prod.category // Handle different field names
          }));

          console.log('Products loaded:', productsWithCategories.length);
          console.log('Sample product:', productsWithCategories[0]);
          setAllProducts(productsWithCategories);
          setFilteredProducts(productsWithCategories);

          // If product is passed via route params, set it in form data
          if (product && productsWithCategories.length > 0) {
            const productObj = productsWithCategories.find(p =>
              p.name === product || p._id === product
            );
            if (productObj) {
              setFormData(prev => ({
                ...prev,
                productIds: [productObj._id]
              }));
            }
          }
        } else {
          console.log('No products found in response, trying fallback...');

          // Fallback: try to get products from categories API
          try {
            const categoryResponse = await getCategories();
            console.log('Categories response:', categoryResponse);

            if (categoryResponse.data && Array.isArray(categoryResponse.data)) {
              const fallbackProducts = [];
              categoryResponse.data.forEach(cat => {
                if (cat.products && Array.isArray(cat.products)) {
                  cat.products.forEach(prod => {
                    fallbackProducts.push({
                      ...prod,
                      categoryId: { name: cat.name, _id: cat._id }
                    });
                  });
                }
              });

              console.log('Fallback products loaded:', fallbackProducts.length);
              if (fallbackProducts.length > 0) {
                setAllProducts(fallbackProducts);
                setFilteredProducts(fallbackProducts);
              } else {
                setAllProducts([]);
                setFilteredProducts([]);
              }
            } else {
              setAllProducts([]);
              setFilteredProducts([]);
            }
          } catch (fallbackError) {
            console.error('Fallback also failed:', fallbackError);
            setAllProducts([]);
            setFilteredProducts([]);
          }
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
    };

    fetchAllProducts();
  }, [product]);

  // Handle search functionality - local filtering by default
  useEffect(() => {
    console.log('Search useEffect triggered:', { searchQuery, allProductsLength: allProducts.length });

    if (allProducts.length === 0) {
      console.log('No products available for search');
      setFilteredProducts([]);
      return;
    }

    if (searchQuery.trim().length === 0) {
      console.log('No search query, showing all products');
      setFilteredProducts(allProducts);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    // Local filtering for better performance - only use API as fallback for complex searches
    const query = searchQuery.trim().toLowerCase();
    console.log('Searching for:', query);

    const filtered = allProducts.filter(product => {
      const matchesName = product.name && product.name.toLowerCase().includes(query);
      const matchesDescription = product.description && product.description.toLowerCase().includes(query);
      const matchesCategory = product.categoryId && product.categoryId.name && product.categoryId.name.toLowerCase().includes(query);

      const matches = matchesName || matchesDescription || matchesCategory;
      if (matches) {
        console.log('Product matched:', product.name, { matchesName, matchesDescription, matchesCategory });
      }

      return matches;
    });

    console.log('Local filtering results:', filtered.length, 'matches out of', allProducts.length);

    // If local filtering returns too few results and query is longer than 3 chars, try API search
    if (filtered.length < 3 && query.length > 3) {
      console.log('Using API search as fallback');
      const timeoutId = setTimeout(async () => {
        try {
          const response = await searchProducts(query, 20, 0.4);
          console.log('API search response:', response);
          if (response.data && response.data.results && response.data.results.length > filtered.length) {
            // Use API results if they provide more/better matches
            const searchResultsWithCategories = response.data.results.map(searchResult => {
              const fullProduct = allProducts.find(p => p._id === searchResult._id);
              return fullProduct || searchResult;
            });
            console.log('Using API results:', searchResultsWithCategories.length);
            setFilteredProducts(searchResultsWithCategories);
          } else {
            console.log('Keeping local results');
            setFilteredProducts(filtered);
          }
        } catch (error) {
          console.error('Error with API search:', error);
          // Keep local results
          setFilteredProducts(filtered);
        } finally {
          setIsSearching(false);
        }
      }, 500); // Longer debounce for API calls

      return () => clearTimeout(timeoutId);
    } else {
      // Use local filtering results
      console.log('Using local filtering results');
      setFilteredProducts(filtered);
      setIsSearching(false);
    }
  }, [searchQuery, allProducts]);

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
    console.log('handleProductToggle called with productId:', productId);

    // Defensive checks
    if (!productId) {
      console.error('handleProductToggle: productId is undefined or null');
      return;
    }

    setFormData(prev => {
      console.log('setFormData prev:', prev);

      // Ensure productIds is an array
      const currentProductIds = Array.isArray(prev.productIds) ? prev.productIds : [];
      const isSelected = currentProductIds.includes(productId);

      console.log('isSelected:', isSelected, 'currentProductIds:', currentProductIds);

      if (isSelected) {
        // Remove product if already selected
        const newProductIds = currentProductIds.filter(id => id !== productId);
        console.log('Removing product, newProductIds:', newProductIds);
        return {
          ...prev,
          productIds: newProductIds
        };
      } else {
        // Add product if not selected
        const newProductIds = [...currentProductIds, productId];
        console.log('Adding product, newProductIds:', newProductIds);
        return {
          ...prev,
          productIds: newProductIds
        };
      }
    });

    // Clear productIds error when user selects products
    if (errors && errors.productIds) {
      setErrors(prev => ({
        ...prev,
        productIds: ''
      }));
    }
  };

  // Get selected product names for display
  const getSelectedProductNames = () => {
    if (!filteredProducts || !Array.isArray(filteredProducts) || !formData.productIds || !Array.isArray(formData.productIds)) {
      return '';
    }

    return filteredProducts
      .filter(product => product && product._id && formData.productIds.includes(product._id))
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



    setLoading(true);

    try {
      console.log('Debug - User object:', user);
      console.log('Debug - Form data:', formData);

      // Get the first selected product's category as the primary category
      // This is a fallback in case the backend still requires categoryId
      let primaryCategoryId = null;
      if (formData.productIds.length > 0) {
        const firstProduct = allProducts.find(p => p._id === formData.productIds[0]);
        if (firstProduct && firstProduct.categoryId) {
          primaryCategoryId = firstProduct.categoryId._id;
        }
      }

      // Create single lead with multiple products
      const leadData = {
        name: formData.name.trim(),
        phoneNumber: formData.phone.trim(),
        email: formData.email.trim() || undefined, // Optional field
        message: formData.message?.trim() || undefined, // Optional field
        referrer: user?._id, // Authenticated user's ID
        categoryId: primaryCategoryId, // Use primary category from first selected product
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
    <LinearGradient
        colors={['#F3ECFE', '#F6F6FE']}
        style={styles.container}
      >
      <StatusBar barStyle="dark-content" backgroundColor="#F3ECFE" />
      <SafeAreaView style={styles.safeArea}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color="#1A1B20" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Categories</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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
                <Text style={styles.pickContactsButtonText}>Pick from contacts</Text>
            </TouchableOpacity>
            </View>

            {/* Form Content */}
            <View style={styles.contentContainer}>
            {/* Product Selection */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Select Products (Multiple)</Text>
              <TouchableOpacity
                style={[styles.dropdownButton, errors.productIds && styles.inputError]}
                onPress={() => setShowProductModal(true)}
              >
                <Text style={[styles.dropdownButtonText, { color: '#7D7D7D' }]}>
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

            <Text style={styles.sectionTitle}>Enter Details</Text>
            <Text style={styles.sectionSubtitle}>
              Fill the details for referral
            </Text>

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
        onClose={() => {
          setShowProductModal(false);
          setSearchQuery(''); // Clear search when closing modal
        }}
        products={filteredProducts}
        selectedProducts={formData.productIds}
        onProductToggle={handleProductToggle}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isSearching={isSearching}
      />

      {/* Success Modal */}
      <SuccessModal
        visible={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          navigation.goBack();
        }}
      />

    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16, // Adjust horizontal padding
    height: 60,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  backButton: {
    padding: 8,
    marginRight: 8, // Add some margin to space it from the title
  },
  headerTitle: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 24,
    lineHeight: 28,
    color: '#1A1B20',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  topCard: {
    width: screenWidth - 40, // 20px margin on each side
    height: 230,
    alignSelf: 'center',
    backgroundColor: '#FBFBFB',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    shadowColor: 'rgba(143, 49, 249, 0.1)',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  illustrationImage: {
    width: 139,
    height: 139,
    position: 'absolute',
    top: 16,
  },
  pickContactsButton: {
    width: '90%', // Use percentage for responsiveness
    height: 47,
    backgroundColor: 'rgba(150, 61, 251, 0.05)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 16, // Position from bottom for consistency
  },
  pickContactsButtonText: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 16,
    lineHeight: 19,
    letterSpacing: 0.2,
    color: '#8F31F9',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 30,
  },
  sectionTitle: {
    fontFamily: 'Rubik-Medium',
    fontSize: 24,
    lineHeight: 28,
    color: '#1A1B20',
  },
  sectionSubtitle: {
    fontFamily: 'Rubik-Regular',
    fontSize: 18,
    lineHeight: 28,
    letterSpacing: 0.2,
    color: '#7D7D7D',
    marginTop: 4,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 19,
  },
  inputLabel: {
    fontFamily: 'Rubik-Medium',
    fontSize: 16,
    lineHeight: 19,
    letterSpacing: 0.2,
    color: '#1A1B20',
    marginBottom: 4,
  },
  textInput: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#1A1B20',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontFamily: 'Rubik-Regular',
    fontSize: 16,
    lineHeight: 19,
    letterSpacing: 0.2,
    color: '#7D7D7D',
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
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
    gap: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'rgba(150, 61, 251, 0.05)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
  },
  cancelButtonText: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 16,
    lineHeight: 19,
    letterSpacing: 0.2,
    color: '#8F31F9',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#8F31F9',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 16,
    lineHeight: 19,
    letterSpacing: 0.2,
    color: '#FBFBFB',
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
    height: 50,
    borderWidth: 1,
    borderColor: '#1A1B20',
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownButtonText: {
    fontSize: 16,
    fontFamily: 'Rubik-Regular',
    flex: 1,
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  successModalContainer: {
    width: 324,
    height: 673,
    backgroundColor: '#FBFBFB',
    borderRadius: 20,
    alignItems: 'center',
    paddingTop: 134,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 20
    },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 25
  },
  imageContainer: {
    width: 135.21,
    height: 153,
    marginBottom: 129
  },
  successImage: {
    width: 130,
    height: 130,
    position: 'absolute',
    top: 0
  },
  imageShadow: {
    width: 96,
    height: 10,
    borderRadius: 5,
    position: 'absolute',
    bottom: 0,
    left: (135.21 - 96) / 2,
    opacity: 0.5
  },
  successTitle: {
    fontFamily: 'Rubik-Medium',
    fontWeight: '500',
    fontSize: 32,
    lineHeight: 38,
    color: '#1A1B20',
    textAlign: 'center',
    marginBottom: 30
  },
  successSubtitle: {
    fontFamily: 'Rubik-Regular',
    fontSize: 18,
    color: '#7D7D7D',
    textAlign: 'center',
    lineHeight: 28,
    letterSpacing: 0.2,
    width: 291,
    marginBottom: 20
  },
  refreshButton: {
    width: 261,
    height: 47,
    backgroundColor: '#8F31F9',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  refreshButtonText: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 16,
    color: '#FBFBFC',
    letterSpacing: 0.2
  },

  // Search Styles
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F6FF',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1A1B20',
    fontFamily: 'Rubik-Regular',
  },
  clearButton: {
    padding: 5,
  },

  // Product Item Enhancements
  productInfo: {
    flex: 1,
  },
  productCategoryText: {
    fontSize: 12,
    color: '#7D7D7D',
    fontFamily: 'Rubik-Regular',
    marginTop: 2,
  },
  productCategoryTextSelected: {
    color: '#8F31F9',
  },

  // Searching Indicator
  searchingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  searchingText: {
    fontSize: 14,
    color: '#8F31F9',
    fontFamily: 'Rubik-Medium',
    marginLeft: 8,
  },

  // No Products Container
  noProductsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
});

export default ReferralFormScreen;
