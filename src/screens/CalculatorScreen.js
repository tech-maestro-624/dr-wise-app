import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { getCategories, getProductsBySubCategory } from '../api/categorys';
import { getSubCategories } from '../api/subCategories';

const { width, height } = Dimensions.get('window');

// --- Responsive Scaling Utilities ---
// Using the same consistent scaling functions as the home screen
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const scale = (size) => (width / guidelineBaseWidth) * size;
const verticalScale = (size) => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;
// --- End of Responsive Utilities ---

const CalculatorScreen = ({ navigation, route }) => {
  const { leadName } = route.params || {};
  const insets = useSafeAreaInsets(); // Hook for safe area values

  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showSubCategory, setShowSubCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subCategoriesData, setSubCategoriesData] = useState({});
  const [productsData, setProductsData] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      if (response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Fetch subcategories for a specific category
  const fetchSubCategories = async (categoryId) => {
    try {
      const condition = { parentCategory: categoryId };
      const response = await getSubCategories({
        condition: JSON.stringify(condition),
        limit: 100
      });
      return response.data?.data || [];
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      return [];
    }
  };

  // Fetch products for a specific subcategory
  const fetchProducts = async (subCategoryId) => {
    try {
      const response = await getProductsBySubCategory(subCategoryId);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  };

  const handleCategorySelect = async (category) => {
    if (selectedCategory?._id === category._id) {
      setSelectedCategory(null); // Toggle off if same is clicked
      setShowSubCategory(null);
    } else {
      setSelectedCategory(category);
      setShowSubCategory(null); // Close any open sub-category view
      if (!subCategoriesData[category._id]) {
        const subCategories = await fetchSubCategories(category._id);
        setSubCategoriesData(prev => ({ ...prev, [category._id]: subCategories }));
      }
    }
  };

  const handleSubCategorySelect = async (subCategory) => {
    if (showSubCategory?._id === subCategory._id) {
      setShowSubCategory(null); // Toggle off
    } else {
      setShowSubCategory(subCategory);
      if (!productsData[subCategory._id]) {
        const products = await fetchProducts(subCategory._id);
        setProductsData(prev => ({ ...prev, [subCategory._id]: products }));
      }
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchCategories();
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <LinearGradient
        colors={['#F3ECFE', '#F6F6FE']}
        style={styles.backgroundGradient}
      />

      {/* Header with dynamic padding top for notch */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Text style={styles.headerTitle}>Calculator</Text>
      </View>

      <ScrollView contentContainerStyle={styles.mainContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.serviceSelectionContainer}>
          <TouchableOpacity
            style={[styles.serviceDropdown, loading && styles.disabledDropdown]}
            onPress={() => !loading && setShowServiceDropdown(!showServiceDropdown)}
            disabled={loading}
          >
            <Text style={styles.serviceDropdownText}>Select Your Service</Text>
            <Ionicons
              name={showServiceDropdown ? "chevron-up" : "chevron-down"}
              size={moderateScale(20)}
              color="#1A1B20"
            />
          </TouchableOpacity>
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#8F31F9" />
            <Text style={styles.loadingText}>Loading services...</Text>
          </View>
        )}

        {showServiceDropdown && !loading && (
          <View>
            {categories.map((category) => (
              <View key={category._id} style={styles.categoryCard}>
                <TouchableOpacity
                  style={[
                    styles.categoryHeader,
                    selectedCategory?._id === category._id && styles.selectedCategoryHeader
                  ]}
                  onPress={() => handleCategorySelect(category)}
                >
                  <Text style={[
                    styles.categoryTitle,
                    selectedCategory?._id === category._id && styles.selectedCategoryTitle
                  ]}>
                    {category.name}
                  </Text>
                  <Ionicons
                    name={selectedCategory?._id === category._id ? "chevron-up" : "chevron-down"}
                    size={moderateScale(20)}
                    color={selectedCategory?._id === category._id ? "#FFF" : "#1A1B20"}
                  />
                </TouchableOpacity>

                {selectedCategory?._id === category._id && (
                  <View style={styles.subCategoriesContainer}>
                    {subCategoriesData[category._id]?.length > 0 ? (
                      subCategoriesData[category._id].map((subCategory) => (
                        <View key={subCategory._id} style={styles.subCategoryCard}>
                          <TouchableOpacity
                            style={[
                              styles.subCategoryHeader,
                              showSubCategory?._id === subCategory._id && styles.selectedSubCategoryHeader
                            ]}
                            onPress={() => handleSubCategorySelect(subCategory)}
                          >
                            <Text style={[
                              styles.subCategoryTitle,
                              showSubCategory?._id === subCategory._id && styles.selectedSubCategoryTitle
                            ]}>
                              {subCategory.name}
                            </Text>
                            <Ionicons
                              name={showSubCategory?._id === subCategory._id ? "chevron-up" : "chevron-down"}
                              size={moderateScale(20)}
                              color="#1A1B20"
                            />
                          </TouchableOpacity>

                          {showSubCategory?._id === subCategory._id && (
                            <View style={styles.plansContainer}>
                              {productsData[subCategory._id]?.length > 0 ? (
                                productsData[subCategory._id].map((product) => (
                                  <TouchableOpacity
                                    key={product._id}
                                    style={styles.planItem}
                                    onPress={() => navigation.navigate('TermInsuranceCalculator', {
                                      serviceName: product.name,
                                      leadName: leadName,
                                      productId: product._id,
                                      productData: product
                                    })}
                                  >
                                    <Text style={styles.planText}>{product.name}</Text>
                                  </TouchableOpacity>
                                ))
                              ) : (
                                <Text style={styles.emptyText}>No products available</Text>
                              )}
                            </View>
                          )}
                        </View>
                      ))
                    ) : (
                      <Text style={styles.emptyText}>No subcategories available</Text>
                    )}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3ECFE',
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    height: verticalScale(60),
    justifyContent: 'center',
    alignItems: 'center',
    // paddingTop is now dynamic
  },
  headerTitle: {
    fontSize: moderateScale(22),
    fontWeight: '700',
    color: '#1A1B20',
    fontFamily: 'Rubik',
  },
  mainContainer: {
    flexGrow: 1,
    paddingHorizontal: moderateScale(20),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(40),
  },
  serviceSelectionContainer: {
    marginBottom: verticalScale(20),
  },
  serviceDropdown: {
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(10),
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#8F31F9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(10),
    elevation: 5,
  },
  serviceDropdownText: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: '#1A1B20',
    fontFamily: 'Rubik',
  },
  disabledDropdown: {
    opacity: 0.6,
  },
  categoriesContainer: {
    marginBottom: verticalScale(20),
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(10),
    marginBottom: verticalScale(10),
    shadowColor: '#8F31F9',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(8),
    elevation: 4,
    overflow: 'hidden',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: moderateScale(14),
  },
  selectedCategoryHeader: {
    backgroundColor: '#8F31F9',
  },
  categoryTitle: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: '#1A1B20',
    fontFamily: 'Rubik',
  },
  selectedCategoryTitle: {
    color: '#FFFFFF',
  },
  subCategoriesContainer: {
    padding: moderateScale(8),
    backgroundColor: '#FFFFFF',
  },
  subCategoryCard: {
    backgroundColor: '#F8F4FF',
    borderRadius: moderateScale(8),
    marginBottom: verticalScale(8),
    borderWidth: 1,
    borderColor: '#E8D9FF'
  },
  subCategoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: moderateScale(12),
  },
  selectedSubCategoryHeader: {
    // Optional: Add specific style for selected subcategory header
  },
  subCategoryTitle: {
    fontSize: moderateScale(13),
    fontWeight: '600',
    color: '#1A1B20',
    fontFamily: 'Rubik',
  },
  selectedSubCategoryTitle: {
    // Optional: Add specific style for selected subcategory text
  },
  plansContainer: {
    backgroundColor: 'rgba(150, 61, 251, 0.05)',
    borderBottomLeftRadius: moderateScale(8),
    borderBottomRightRadius: moderateScale(8),
    padding: moderateScale(10),
    borderTopWidth: 1,
    borderColor: '#E8D9FF'
  },
  planItem: {
    paddingVertical: verticalScale(8),
  },
  planText: {
    fontSize: moderateScale(13),
    fontWeight: '500',
    color: '#1A1B20',
    fontFamily: 'Rubik',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(40),
  },
  loadingText: {
    fontSize: moderateScale(16),
    fontWeight: '500',
    color: '#7D7D7D',
    fontFamily: 'Rubik',
    marginTop: verticalScale(10)
  },
  emptyText: {
    fontSize: moderateScale(14),
    fontWeight: '400',
    color: '#7D7D7D',
    fontFamily: 'Rubik',
    textAlign: 'center',
    paddingVertical: verticalScale(20),
  },
});

export default CalculatorScreen;