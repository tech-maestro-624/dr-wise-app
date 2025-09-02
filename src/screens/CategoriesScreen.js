import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { getProductsBySubCategory, getProductsByCategory } from '../api/product';
import { getCategoryByName } from '../api/categorys';
import { getSubCategoryByName } from '../api/subCategories';
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get('window');

// --- Responsive Scaling Utilities ---
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const scale = (size) => (width / guidelineBaseWidth) * size;
const verticalScale = (size) => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;
// --- End of Responsive Utilities ---

const CategoriesScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { category, subCategory, categoryName } = route.params || {};

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to determine category type for styling
  const getCategoryTypeDetails = () => {
    let type = 'insurance'; // Default
    const name = (subCategory?.name || categoryName || category || '').toLowerCase();

    if (name.includes('investment') || name.includes('mutual') || name.includes('gold')) {
      type = 'investment';
    } else if (name.includes('loan')) {
      type = 'loan';
    } else if (name.includes('tax')) {
      type = 'tax';
    } else if (name.includes('travel')) {
      type = 'travel';
    }

    switch (type) {
      case 'investment':
        return {
          color: '#F6AC11',
          bgColor: '#FEE9CF',
          icon: require('../../assets/Icons/3d-star-symbol-illustration-vector-gold-star-icon-symbol-medel 1 (3).png'),
        };
      case 'loan':
        return {
          color: '#C75B7A',
          bgColor: '#F6DCDD',
          icon: require('../../assets/Icons/3d-star-symbol-illustration-vector-gold-star-icon-symbol-medel 2.png'),
        };
      case 'tax':
        return {
          color: '#8F31F9',
          bgColor: 'rgba(143, 49, 249, 0.2)',
          icon: require('../../assets/Icons/3d-star-symbol-illustration-vector-gold-star-icon-symbol-medel 1 (4).png'),
        };
      case 'travel':
        return {
          color: '#4CAF50',
          bgColor: '#C9EBE9',
          icon: require('../../assets/Icons/3d-star-symbol-illustration-vector-gold-star-icon-symbol-medel 1 (2).png'),
        };
      case 'insurance':
      default:
        return {
          color: '#4CAF50',
          bgColor: '#C9EBE9',
          icon: require('../../assets/Icons/3d-star-symbol-illustration-vector-gold-star-icon-symbol-medel 1 (2).png'),
        };
    }
  };

  useEffect(() => {
    console.log('CategoriesScreen - Received params:', { category, subCategory, categoryName });

    const fetchProducts = async () => {
      // If we have a subcategory object with _id, fetch by subcategory ID
      if (subCategory?._id) {
        try {
          setLoading(true);
          const response = await getProductsBySubCategory(subCategory._id);
          const productsData = response.data?.data || response.data || [];
          setProducts(Array.isArray(productsData) ? productsData : []);
        } catch (error) {
          console.error('Error fetching products by subcategory:', error);
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Failed to load products.',
          });
          setProducts([]);
        } finally {
          setLoading(false);
        }
        return;
      }

      // If we have a subcategory object with name but no _id, find the subcategory first
      if (subCategory && typeof subCategory === 'object' && subCategory.name && !subCategory._id) {
        try {
          setLoading(true);
          console.log('Looking up subcategory by name:', subCategory.name);
          // Find subcategory by name
          const subCategoryResponse = await getSubCategoryByName(subCategory.name);
          console.log('Subcategory lookup response:', subCategoryResponse);
          console.log('Subcategory response.data:', subCategoryResponse.data);
          console.log('Subcategory response.data.data:', subCategoryResponse.data?.data);

          const subCategoriesData = subCategoryResponse.data?.data ||
                                   subCategoryResponse.data ||
                                   [];

          console.log('Subcategories data:', subCategoriesData);

          if (Array.isArray(subCategoriesData) && subCategoriesData.length > 0) {
            const foundSubCategory = subCategoriesData[0]; // Use the first matching subcategory
            console.log('Found subcategory:', foundSubCategory);
            console.log('Subcategory ID:', foundSubCategory._id);
            const response = await getProductsBySubCategory(foundSubCategory._id);
            console.log('Products response:', response);
            const productsData = response.data?.data || response.data || [];
            console.log('Products data:', productsData);
            setProducts(Array.isArray(productsData) ? productsData : []);
          } else {
            console.error('Subcategory not found:', subCategory.name);
            setProducts([]);
          }
        } catch (error) {
          console.error('Error fetching products by subcategory name:', error);
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Failed to load products.',
          });
          setProducts([]);
        } finally {
          setLoading(false);
        }
        return;
      }

      // If we have a subcategory name as a string (fallback case)
      if (subCategory && typeof subCategory === 'string') {
        try {
          setLoading(true);
          // Find subcategory by name
          const subCategoryResponse = await getSubCategoryByName(subCategory);
          const subCategoriesData = subCategoryResponse.data?.data ||
                                   subCategoryResponse.data ||
                                   [];

          if (Array.isArray(subCategoriesData) && subCategoriesData.length > 0) {
            const foundSubCategory = subCategoriesData[0]; // Use the first matching subcategory
            const response = await getProductsBySubCategory(foundSubCategory._id);
            const productsData = response.data?.data || response.data || [];
            setProducts(Array.isArray(productsData) ? productsData : []);
          } else {
            console.error('Subcategory not found:', subCategory);
            setProducts([]);
          }
        } catch (error) {
          console.error('Error fetching products by subcategory name:', error);
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Failed to load products.',
          });
          setProducts([]);
        } finally {
          setLoading(false);
        }
        return;
      }

      // If we have a category (but no subcategory), we need to get the category ID
      if (category) {
        try {
          setLoading(true);
          let categoryId = category;

          // If category is a string (like "Tax"), we need to find the category by name
          if (typeof category === 'string' && !category.match(/^[0-9a-fA-F]{24}$/)) {
            // This looks like a category name, not an ObjectId
            const categoryResponse = await getCategoryByName(category);
            const categoriesData = categoryResponse.data?.data || categoryResponse.data || [];

            if (Array.isArray(categoriesData) && categoriesData.length > 0) {
              categoryId = categoriesData[0]._id; // Use the first matching category
            } else {
              console.error('Category not found:', category);
              setProducts([]);
              setLoading(false);
              return;
            }
          }

          const response = await getProductsByCategory(categoryId);
          const productsData = response.data?.data || response.data || [];
          setProducts(Array.isArray(productsData) ? productsData : []);
        } catch (error) {
          console.error('Error fetching products by category:', error);
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Failed to load products.',
          });
          setProducts([]);
        } finally {
          setLoading(false);
        }
        return;
      }

      // If neither subcategory nor category is available
      setProducts([]);
      setLoading(false);
    };
    fetchProducts();
  }, [subCategory, category]);

  const categoryDetails = getCategoryTypeDetails();
  const displayTitle = subCategory?.name || categoryName || 'Category';

  return (
    <LinearGradient colors={['#F3ECFE', '#F6F6FE']} style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.safeArea} edges={['right', 'left', 'bottom']}>
        {/* Header with dynamic padding for notch */}
        <View style={[styles.header, { paddingTop: insets.top, paddingBottom: verticalScale(16) }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={moderateScale(24)} color="#1A1B20" />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>{displayTitle}</Text>
          <View style={{ width: moderateScale(26) }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
          {loading ? (
            <View style={styles.centeredContainer}>
              <ActivityIndicator size="large" color="#8F31F9" />
              <Text style={styles.infoText}>Loading products...</Text>
            </View>
          ) : products.length > 0 ? (
            products.map((product) => (
              <TouchableOpacity
                key={product._id}
                style={styles.listItem}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('CategoryDetail', { product, category: categoryName, subCategory })}
              >
                <View style={styles.itemContent}>
                  <View style={[styles.starIcon, { backgroundColor: categoryDetails.bgColor }]}>
                    <Image source={categoryDetails.icon} style={styles.starImage} />
                  </View>
                  <View style={styles.textSection}>
                    <Text style={styles.itemTitle} numberOfLines={1}>{product.name}</Text>
                    <Text style={styles.itemSubtitle} numberOfLines={1}>
                      {product.description || 'View details'}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={moderateScale(20)} color="#1A1B20" />
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.centeredContainer}>
              <Text style={styles.emptyText}>No Products Available</Text>
              <Text style={styles.infoText}>Products for this category will be available soon.</Text>
            </View>
          )}
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
    paddingHorizontal: moderateScale(20),
    // paddingTop and paddingBottom are now dynamic
  },
  backButton: {
    width: moderateScale(26),
    height: moderateScale(26),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(150, 61, 251, 0.05)',
    borderRadius: moderateScale(4),
  },
  headerTitle: {
    fontFamily: 'Rubik-SemiBold', // Ensure you have this font linked
    fontSize: moderateScale(20),
    textAlign: 'center',
    color: '#1A1B20',
    flex: 1,
    marginHorizontal: moderateScale(10),
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: moderateScale(20),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(40),
  },
  listItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(10),
    marginBottom: verticalScale(14),
    shadowColor: 'rgba(143, 49, 249, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: moderateScale(10),
    elevation: 4,
    minHeight: verticalScale(72),
    justifyContent: 'center',
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: moderateScale(6),
  },
  starIcon: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(8),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: moderateScale(12),
  },
  starImage: {
    width: '75%',
    height: '75%',
    resizeMode: 'contain',
  },
  textSection: {
    flex: 1,
    justifyContent: 'center',
  },
  itemTitle: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: moderateScale(16),
    color: '#1A1B20',
    marginBottom: verticalScale(4),
  },
  itemSubtitle: {
    fontFamily: 'Rubik-Regular',
    fontSize: moderateScale(12),
    color: '#7D7D7D',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: moderateScale(20),
  },
  infoText: {
    marginTop: verticalScale(10),
    fontFamily: 'Rubik-Regular',
    fontSize: moderateScale(14),
    color: '#7D7D7D',
    textAlign: 'center',
  },
  emptyText: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: moderateScale(18),
    color: '#1A1B20',
    textAlign: 'center',
  },
});

export default CategoriesScreen;