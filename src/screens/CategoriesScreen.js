import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, SafeAreaView, Dimensions, Image, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getProductsBySubCategory } from '../api/product';
import Toast from 'react-native-toast-message';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const scale = Math.min(screenWidth / 375, screenHeight / 812);

const CategoriesScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { subCatId, categoryId, name } = route.params || {};

  // Debug: Log received parameters
  console.log('CategoriesScreen - Received params:', { subCatId, categoryId, name });
  console.log('CategoriesScreen - All route params:', route.params);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define star colors for different categories
  const getStarColor = (categoryName) => {
    if (!categoryName) return '#4CAF50';

    const lowerName = categoryName.toLowerCase();
    if (lowerName.includes('life') || lowerName.includes('health') || lowerName.includes('motor') || lowerName.includes('general') || lowerName.includes('travel')) {
      return '#4CAF50'; // Green for Insurance
    }
    if (lowerName.includes('mutual') || lowerName.includes('fixed') || lowerName.includes('bond') || lowerName.includes('gold') || lowerName.includes('las') || lowerName.includes('nps') || lowerName.includes('trading')) {
      return '#F6AC11'; // Yellow/Orange for Investments
    }
    if (lowerName.includes('loan') || lowerName.includes('home') || lowerName.includes('personal') || lowerName.includes('mortgage') || lowerName.includes('business')) {
      return '#C75B7A'; // Red for Loans
    }
    if (lowerName.includes('tax')) {
      return '#8F31F9'; // Purple for Tax
    }
    return '#4CAF50'; // Default green
  };

  // Fetch products for the subcategory
  const fetchProducts = async () => {
    if (!subCatId) {
      setError('Invalid subcategory data');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Fetching products for subcategory ID:', subCatId);
      console.log('Full API URL would be:', `http://192.168.29.241:5001/products/product/${subCatId}`);

      const response = await getProductsBySubCategory(subCatId);
      console.log('Products response status:', response.status);
      console.log('Products response data:', response.data);
      console.log('Products response data type:', typeof response.data);
      console.log('Is response.data an array?', Array.isArray(response.data));

      // Handle different response formats
      let productsArray = [];
      if (response.data && response.data.products && Array.isArray(response.data.products)) {
        productsArray = response.data.products;
        console.log('Found products in response.data.products');
      } else if (response.data && Array.isArray(response.data)) {
        productsArray = response.data;
        console.log('Found products directly in response.data array');
      } else if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
        // Check if it's a single product object
        if (response.data._id) {
          productsArray = [response.data];
          console.log('Found single product object');
        } else {
          console.log('Response data is an object but not a product:', Object.keys(response.data));
          productsArray = [];
        }
      } else {
        console.log('No products found in response');
        productsArray = [];
      }

      console.log('Final products array length:', productsArray.length);
      setProducts(productsArray);
    } catch (error) {
      console.error('Error fetching products:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      setError('Failed to load products');
      Toast.show({
        type: 'error',
        text1: 'Failed to load products',
        text2: error?.response?.data?.message || error.message || 'Please try again',
        position: 'bottom',
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle product press - navigate to product details
  const handleProductPress = (product) => {
    navigation.navigate('DetailScreen', { product });
  };

  useEffect(() => {
    fetchProducts();
  }, [subCatId]);

  // Generate list items based on category
  const getListItems = (category) => {
    const insuranceItems = [
      'Individual Plan',
      'Family Plan',
      'Senior Citizen Plan',
      'Women Plan',
      'Children Plan',
      'Critical Illness Plan',
      'Term Life Plan'
    ];

    const investmentItems = [
      'Mutual Fund Plan',
      'Fixed Deposit Plan',
      'Bond Investment Plan',
      'Gold Investment Plan',
      'Loan Against Securities',
      'National Pension Scheme',
      'Trading Plan'
    ];

    const loanItems = [
      'Home Loan Plan',
      'Personal Loan Plan',
      'Mortgage Loan Plan',
      'Business Loan Plan',
      'Property Loan Plan',
      'Vehicle Loan Plan',
      'Education Loan Plan'
    ];

    const taxItems = [
      'Tax Planning',
      'Tax Planning',
      'Tax Planning'
    ];

    const travelItems = [
      'Travel Plan',
      'Travel Plan',
      'Travel Plan',
      'Travel Plan',
      'Travel Plan'
    ];

    switch (category) {
      case 'Mutual Fund':
      case 'Fixed':
      case 'BOND':
      case 'Gold':
      case 'LAS':
      case 'NPS':
      case 'Trading':
        return investmentItems; // 7 items for Investments
      case 'Home Loan':
      case 'Personal Loans':
      case 'Mortgage Loan':
      case 'Business Loan':
        return loanItems; // 7 items for Loans
      case 'Tax':
        return taxItems; // 3 items for Tax
      case 'Domestic Travel':
      case 'International Travel':
        return travelItems; // 5 items for Travel
      default:
        return insuranceItems; // 7 items for Insurance
    }
  };

  const starColor = getStarColor(name);

  // Loading state
  if (loading) {
    return (
      <LinearGradient
        colors={['#F3ECFE', '#F6F6FE']}
        locations={[0, 0.49]}
        style={styles.container}
      >
        <StatusBar barStyle="dark-content" backgroundColor="transparent" />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="chevron-back-outline" size={24} color="#1A1B20" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{name || 'Categories'}</Text>
            <View style={{ width: 40 }} />
          </View>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#8F31F9" />
            <Text style={styles.loadingText}>Loading products...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // Error state
  if (error) {
    return (
      <LinearGradient
        colors={['#F3ECFE', '#F6F6FE']}
        locations={[0, 0.49]}
        style={styles.container}
      >
        <StatusBar barStyle="dark-content" backgroundColor="transparent" />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="chevron-back-outline" size={24} color="#1A1B20" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{name || 'Categories'}</Text>
            <View style={{ width: 40 }} />
          </View>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchProducts}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#F3ECFE', '#F6F6FE']}
      locations={[0, 0.49]}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />
      <SafeAreaView style={styles.safeArea}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back-outline" size={24} color="#1A1B20" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{name || 'Categories'}</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Content */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.contentContainer}>
            {products.length > 0 ? (
              products.map((product, index) => (
                <TouchableOpacity
                  key={product._id || index}
                  style={styles.listItem}
                  activeOpacity={0.7}
                  onPress={() => handleProductPress(product)}
                >
                  <View style={styles.itemContent}>
                    <View style={styles.leftSection}>
                      <View style={[styles.starIcon, {
                        backgroundColor: starColor === '#F6AC11' ? '#FEE9CF' :
                                     starColor === '#C75B7A' ? '#F6DCDD' :
                                     starColor === '#8F31F9' ? 'rgba(143, 49, 249, 0.2)' : '#C9EBE9'
                      }]}>
                        <Ionicons
                          name="star"
                          size={16}
                          color={starColor}
                        />
                      </View>
                      <View style={styles.textSection}>
                        <Text style={styles.itemTitle} numberOfLines={1}>
                          {product.name || 'Unnamed Product'}
                        </Text>
                        <Text style={styles.itemSubtitle} numberOfLines={2}>
                          {product.description || 'Product description'}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.rightSection}>
                      <Ionicons name="chevron-forward" size={20} color="#7D7D7D" />
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="document-outline" size={48} color="#7D7D7D" />
                <Text style={styles.emptyText}>No products found</Text>
                <Text style={styles.emptySubtext}>This category doesn't have any products yet</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    height: 80,
  },
  backButton: {
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(150, 61, 251, 0.05)',
    borderRadius: 4,
  },
  headerTitle: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 24 * scale,
    lineHeight: 28 * scale,
    textAlign: 'center',
    color: '#1A1B20',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  listItem: {
    width: Math.min(335 * scale, screenWidth - 40), // Responsive width with max 335px
    height: 72 * scale,
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
    elevation: 3,
    borderRadius: 10 * scale,
    marginBottom: 14 * scale,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6 * scale,
    paddingVertical: 6 * scale,
    height: '100%',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  starIcon: {
    width: 60 * scale,
    height: 60 * scale,
    backgroundColor: '#C9EBE9',
    borderRadius: 8 * scale,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20 * scale,
  },
  textSection: {
    flex: 1,
  },
  itemTitle: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 18 * scale,
    lineHeight: 21 * scale,
    color: '#1A1B20',
    marginBottom: 4 * scale,
  },
  itemSubtitle: {
    fontFamily: 'Rubik-Regular',
    fontSize: 12 * scale,
    lineHeight: 14 * scale,
    letterSpacing: 0.2 * scale,
    color: '#7D7D7D',
  },
  starImage: {
    width: 50 * scale,
    height: 50 * scale,
    resizeMode: 'contain',
  },
  // Loading state styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#7D7D7D',
    fontFamily: 'Rubik-Regular',
  },
  // Error state styles
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#7D7D7D',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Rubik-Regular',
  },
  retryButton: {
    backgroundColor: '#8F31F9',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Rubik-SemiBold',
  },
  // Empty state styles
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#7D7D7D',
    textAlign: 'center',
    marginTop: 16,
    fontFamily: 'Rubik-Medium',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#7D7D7D',
    textAlign: 'center',
    marginTop: 8,
    fontFamily: 'Rubik-Regular',
  },
  // Right section for chevron
  rightSection: {
    marginLeft: 12,
  },
});

export default CategoriesScreen;
