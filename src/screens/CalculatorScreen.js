import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getCategories, getProductsBySubCategory } from '../api/categorys';
import { getSubCategories } from '../api/subCategories';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const scale = Math.min(screenWidth / 375, screenHeight / 812);

const CalculatorScreen = ({ navigation, route }) => {
  const { leadName } = route.params || {};
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
      setCategories([]); // Set empty array on error
    }
  };

  // Fetch subcategories for a specific category
  const fetchSubCategories = async (categoryId) => {
    try {
      const condition = { parentCategory: categoryId };
      const response = await getSubCategories({
        condition: JSON.stringify(condition),
        limit: 100 // Fetch all subcategories for this category
      });

      if (response.data && response.data.success) {
        return response.data.data || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      return [];
    }
  };

  // Fetch products for a specific subcategory
  const fetchProducts = async (subCategoryId) => {
    try {
      const response = await getProductsBySubCategory(subCategoryId);

      if (response.data) {
        return response.data || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  };

  const handleCategorySelect = async (category) => {
    if (selectedCategory && selectedCategory._id === category._id) {
      setSelectedCategory(null);
      setShowSubCategory(null);
    } else {
      setSelectedCategory(category);
      setShowSubCategory(null);

      // Fetch subcategories if not already fetched
      if (!subCategoriesData[category._id]) {
        const subCategories = await fetchSubCategories(category._id);
        setSubCategoriesData(prev => ({
          ...prev,
          [category._id]: subCategories
        }));
      }
    }
  };

  const handleSubCategorySelect = async (subCategory) => {
    if (showSubCategory && showSubCategory._id === subCategory._id) {
      setShowSubCategory(null);
    } else {
      setShowSubCategory(subCategory);

      // Fetch products if not already fetched
      if (!productsData[subCategory._id]) {
        const products = await fetchProducts(subCategory._id);
        setProductsData(prev => ({
          ...prev,
          [subCategory._id]: products
        }));
      }
    }
  };

  // Fetch categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      await fetchCategories();
      setLoading(false);
    };
    loadCategories();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={['#F3ECFE', '#F6F6FE']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.5 }}
      />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calculator</Text>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.mainContainer} showsVerticalScrollIndicator={false}>
        {/* Loading Indicator */}
        {loading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading services...</Text>
          </View>
        )}

        {/* Service Selection Dropdown */}
        <View style={styles.serviceSelectionContainer}>
          <TouchableOpacity
            style={[styles.serviceDropdown, loading && styles.disabledDropdown]}
            onPress={() => !loading && setShowServiceDropdown(!showServiceDropdown)}
            disabled={loading}
          >
            <Text style={styles.serviceDropdownText}>Select Your Service</Text>
            <View style={styles.chevronIcon}>
              <Ionicons 
                name={showServiceDropdown ? "chevron-up" : "chevron-down"} 
                size={20} 
                color="#1A1B20" 
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* Main Categories - Only show when service dropdown is clicked */}
        {showServiceDropdown && (
          <View style={styles.categoriesContainer}>
            {categories.map((category, index) => (
              <View key={category._id || index} style={styles.categoryCard}>
                <TouchableOpacity
                  style={[
                    styles.categoryHeader,
                    selectedCategory && selectedCategory._id === category._id && styles.selectedCategoryHeader
                  ]}
                  onPress={() => handleCategorySelect(category)}
                >
                  <Text style={[
                    styles.categoryTitle,
                    selectedCategory && selectedCategory._id === category._id && styles.selectedCategoryTitle
                  ]}>
                    {category.name}
                  </Text>
                  <View style={styles.chevronIcon}>
                    <Ionicons
                      name={selectedCategory && selectedCategory._id === category._id ? "chevron-up" : "chevron-down"}
                      size={20}
                      color={selectedCategory && selectedCategory._id === category._id ? "#FBFBFB" : "#1A1B20"}
                    />
                  </View>
                </TouchableOpacity>

                {/* Sub Categories - Only show when category is selected */}
                {selectedCategory && selectedCategory._id === category._id && (
                  <View style={styles.subCategoriesContainer}>
                    {subCategoriesData[category._id]?.length > 0 ? (
                      subCategoriesData[category._id].map((subCategory, subIndex) => (
                      <View key={subCategory._id || subIndex} style={styles.subCategoryCard}>
                        <TouchableOpacity
                          style={[
                            styles.subCategoryHeader,
                            showSubCategory && showSubCategory._id === subCategory._id && styles.selectedSubCategoryHeader
                          ]}
                          onPress={() => handleSubCategorySelect(subCategory)}
                        >
                          <Text style={[
                            styles.subCategoryTitle,
                            showSubCategory && showSubCategory._id === subCategory._id && styles.selectedSubCategoryTitle
                          ]}>
                            {subCategory.name}
                          </Text>
                          <View style={styles.chevronIcon}>
                            <Ionicons
                              name={showSubCategory && showSubCategory._id === subCategory._id ? "chevron-up" : "chevron-down"}
                              size={20}
                              color={showSubCategory && showSubCategory._id === subCategory._id ? "#1A1B20" : "#1A1B20"}
                            />
                          </View>
                        </TouchableOpacity>

                        {/* Products - Show when subcategory is selected */}
                        {showSubCategory && showSubCategory._id === subCategory._id && (
                          <View style={styles.plansContainer}>
                            {productsData[subCategory._id]?.length > 0 ? (
                              productsData[subCategory._id].map((product, productIndex) => (
                                <TouchableOpacity
                                  key={product._id || productIndex}
                                  style={styles.planItem}
                                  onPress={() => {
                                    navigation.navigate('TermInsuranceCalculator', {
                                      serviceName: product.name,
                                      leadName: leadName,
                                      productId: product._id,
                                      productData: product
                                    });
                                  }}
                                >
                                  <Text style={styles.planText}>{product.name}</Text>
                                </TouchableOpacity>
                              ))
                            ) : (
                              <View style={styles.emptyProductsContainer}>
                                <Text style={styles.emptyProductsText}>No products available</Text>
                              </View>
                            )}
                          </View>
                        )}
                      </View>
                      ))
                    ) : (
                      <View style={styles.emptySubCategoriesContainer}>
                        <Text style={styles.emptySubCategoriesText}>No subcategories available</Text>
                      </View>
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    height: 80 * scale,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 44 : 0,
  },
  headerTitle: {
    fontSize: 24 * scale,
    fontWeight: '700',
    color: '#1A1B20',
    fontFamily: 'Rubik',
    lineHeight: 28 * scale,
    textAlign: 'center',
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: 20 * scale,
    paddingTop: 12 * scale,
  },
  serviceSelectionContainer: {
    marginBottom: 20 * scale,
  },
  serviceDropdown: {
    backgroundColor: '#FBFBFB',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 10 * scale,
    paddingHorizontal: 16 * scale,
    paddingVertical: 15 * scale,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#8F31F9',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10 * scale,
    elevation: 5,
  },
  serviceDropdownText: {
    fontSize: 14 * scale,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Rubik',
    lineHeight: 17 * scale,
    letterSpacing: 0.2 * scale,
  },
  chevronIcon: {
    transform: [{ rotate: '0deg' }],
  },
  categoriesContainer: {
    marginBottom: 20 * scale,
  },
  categoryCard: {
    backgroundColor: '#FBFBFB',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 10 * scale,
    marginBottom: 7 * scale,
    shadowColor: '#8F31F9',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10 * scale,
    elevation: 5,
    overflow: 'hidden',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12 * scale,
    paddingVertical: 8 * scale,
    height: 45 * scale,
    borderTopLeftRadius: 10 * scale,
    borderTopRightRadius: 10 * scale,
  },
  selectedCategoryHeader: {
    backgroundColor: '#8F31F9',
  },
  categoryTitle: {
    fontSize: 14 * scale,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Rubik',
    lineHeight: 17 * scale,
    letterSpacing: 0.195 * scale,
  },
  selectedCategoryTitle: {
    color: '#FBFBFB',
  },
  subCategoriesContainer: {
    backgroundColor: '#FBFBFB',
    paddingVertical: 6 * scale,
  },
  subCategoryCard: {
    backgroundColor: '#FBFBFB',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 10 * scale,
    marginBottom: 7 * scale,
    marginHorizontal: 7 * scale,
    shadowColor: '#8F31F9',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10 * scale,
    elevation: 5,
  },
  subCategoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12 * scale,
    paddingVertical: 8 * scale,
    height: 40 * scale,
  },
  selectedSubCategoryHeader: {
    backgroundColor: '#FBFBFB',
    borderRadius: 5 * scale,
    marginHorizontal: 7 * scale,
  },
  subCategoryTitle: {
    fontSize: 12.63 * scale,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Rubik',
    lineHeight: 15 * scale,
    letterSpacing: 0.176 * scale,
  },
  selectedSubCategoryTitle: {
    fontWeight: '600',
  },
  plansContainer: {
    backgroundColor: 'rgba(150, 61, 251, 0.05)',
    borderRadius: 10 * scale,
    marginHorizontal: 7 * scale,
    marginBottom: 6 * scale,
  },
  planItem: {
    paddingHorizontal: 10 * scale,
    paddingVertical: 6 * scale,
  },
  planText: {
    fontSize: 12.63 * scale,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Rubik',
    lineHeight: 15 * scale,
    letterSpacing: 0.176 * scale,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40 * scale,
  },
  loadingText: {
    fontSize: 16 * scale,
    fontWeight: '500',
    color: '#7D7D7D',
    fontFamily: 'Rubik',
  },
  disabledDropdown: {
    opacity: 0.6,
  },
  emptySubCategoriesContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20 * scale,
  },
  emptySubCategoriesText: {
    fontSize: 14 * scale,
    fontWeight: '400',
    color: '#7D7D7D',
    fontFamily: 'Rubik',
  },
  emptyProductsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20 * scale,
  },
  emptyProductsText: {
    fontSize: 14 * scale,
    fontWeight: '400',
    color: '#7D7D7D',
    fontFamily: 'Rubik',
  },

});

export default CalculatorScreen;
