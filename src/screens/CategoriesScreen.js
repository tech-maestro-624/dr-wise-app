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
  const { category, subCategory, categoryName } = route.params || {};

  // State for products
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Determine the category type and star color
  const getCategoryType = () => {
    if (subCategory) {
      // Try to determine category type from subcategory name or parent category
      const subCatName = subCategory.name?.toLowerCase() || '';
      if (subCatName.includes('life') || subCatName.includes('health') || subCatName.includes('motor') || subCatName.includes('general')) {
        return 'insurance';
      } else if (subCatName.includes('mutual') || subCatName.includes('fixed') || subCatName.includes('gold') || subCatName.includes('trading')) {
        return 'investment';
      } else if (subCatName.includes('loan') || subCatName.includes('home') || subCatName.includes('personal') || subCatName.includes('business')) {
        return 'loan';
      } else if (subCatName.includes('tax')) {
        return 'tax';
      } else if (subCatName.includes('travel')) {
        return 'travel';
      }
    }

    // Fallback to category name
    const catName = categoryName || category || '';
    if (catName.toLowerCase().includes('insurance')) return 'insurance';
    if (catName.toLowerCase().includes('investment')) return 'investment';
    if (catName.toLowerCase().includes('loan')) return 'loan';
    if (catName.toLowerCase().includes('tax')) return 'tax';
    if (catName.toLowerCase().includes('travel')) return 'travel';
    return 'insurance'; // default
  };

  const getStarColor = (categoryType) => {
    switch (categoryType) {
      case 'insurance':
        return '#4CAF50'; // Green for Insurance
      case 'investment':
        return '#F6AC11'; // Yellow/Orange for Investments
      case 'loan':
        return '#C75B7A'; // Red for Loans
      case 'tax':
      case 'travel':
        return '#8F31F9'; // Purple for Tax & Travel
      default:
        return '#4CAF50'; // Default green
    }
  };

  // Fetch products when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        console.log('CategoriesScreen - SubCategory:', subCategory);
        console.log('CategoriesScreen - CategoryName:', categoryName);

        if (subCategory && subCategory._id) {
          console.log('Fetching products for subcategory:', subCategory._id);
          // Fetch products for subcategory
          const response = await getProductsBySubCategory(subCategory._id);
          console.log('Products API response:', response);
          console.log('Products response data:', response.data);

          // Handle backend response structure: { success: true, data: [...], pagination: {...} }
          let productsData = [];
          if (response.data) {
            // Primary structure from backend
            if (response.data.data && Array.isArray(response.data.data)) {
              productsData = response.data.data;
            } else if (Array.isArray(response.data)) {
              productsData = response.data;
            } else if (response.data.products && Array.isArray(response.data.products)) {
              productsData = response.data.products;
            } else if (typeof response.data === 'object' && Array.isArray(Object.values(response.data)[0])) {
              // Handle case where data is wrapped in an object
              productsData = Object.values(response.data)[0];
            }
          }

          console.log('Parsed products:', productsData);
          setProducts(productsData);
        } else {
          console.log('No subcategory provided, showing empty state');
          // Fallback: if no subcategory, show empty state
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to load products. Please try again.',
        });
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [subCategory]);

  const categoryType = getCategoryType();
  const starColor = getStarColor(categoryType);
  const displayTitle = subCategory?.name || categoryName || category || 'Categories';

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
          <Text style={styles.headerTitle}>{displayTitle}</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Content */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.contentContainer}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#8F31F9" />
                <Text style={styles.loadingText}>Loading products...</Text>
              </View>
            ) : products.length > 0 ? (
              products.map((product, index) => (
                <TouchableOpacity
                  key={product._id || index}
                  style={styles.listItem}
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate('CategoryDetail', {
                    product: product,
                    category: categoryName || category,
                    subCategory: subCategory
                  })}
                >
                  <View style={styles.itemContent}>
                    <View style={styles.leftSection}>
                      <View style={[styles.starIcon, {
                        backgroundColor: starColor === '#F6AC11' ? '#FEE9CF' :
                                     starColor === '#C75B7A' ? '#F6DCDD' :
                                     starColor === '#8F31F9' ? 'rgba(143, 49, 249, 0.2)' : '#C9EBE9'
                      }]}>
                        <Image
                          source={
                            starColor === '#F6AC11' ? require('../../assets/Icons/3d-star-symbol-illustration-vector-gold-star-icon-symbol-medel 1 (3).png') :
                            starColor === '#C75B7A' ? require('../../assets/Icons/3d-star-symbol-illustration-vector-gold-star-icon-symbol-medel 2.png') :
                            starColor === '#8F31F9' ? require('../../assets/Icons/3d-star-symbol-illustration-vector-gold-star-icon-symbol-medel 1 (4).png') :
                            require('../../assets/Icons/3d-star-symbol-illustration-vector-gold-star-icon-symbol-medel 1 (2).png')
                          }
                          style={[styles.starImage, {
                            width: starColor === '#C75B7A' ? 52 * scale :
                                   starColor === '#8F31F9' ? 60 * scale : 50 * scale,
                            height: starColor === '#C75B7A' ? 52 * scale :
                                    starColor === '#8F31F9' ? 60 * scale : 50 * scale
                          }]}
                        />
                      </View>
                      <View style={styles.textSection}>
                        <Text style={styles.itemTitle}>{product.name}</Text>
                        <Text style={styles.itemSubtitle}>
                          {product.description ? product.description.substring(0, 30) + '...' : 'Share services you trust and get paid'}
                        </Text>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#1A1B20" />
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No products available</Text>
                <Text style={styles.emptySubText}>Products will be available soon for this category.</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 16,
    fontFamily: 'Rubik-Regular',
    fontSize: 16 * scale,
    color: '#7D7D7D',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 18 * scale,
    color: '#1A1B20',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubText: {
    fontFamily: 'Rubik-Regular',
    fontSize: 14 * scale,
    color: '#7D7D7D',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default CategoriesScreen;
