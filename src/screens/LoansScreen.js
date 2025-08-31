import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, StatusBar, SafeAreaView, Platform, Dimensions, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import CategoryModal from '../components/CategoryModal';
import { getCategories } from '../api/categorys';
import { getSubCategories } from '../api/subCategories';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import global from '../Utils/global';

// --- Data for the Loan Categories ---
const loanCategories = [
  { name: 'Home Loan', icon: require('../../assets/Icons/propertyLoans.png') },
  { name: 'Personal Loans', icon: require('../../assets/Icons/personalLoans.png') },
  { name: 'Mortgage Loans', icon: require('../../assets/Icons/loansSection.png') },
  { name: 'Business Loans', icon: require('../../assets/Icons/businessLoans.png') },
];

const LoansScreen = () => {
  const navigation = useNavigation();
  const { width: screenWidth } = Dimensions.get('window');

  // State for category modal
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategoryData, setSelectedSubCategoryData] = useState(null);
  const [selectedSubCategoryImage, setSelectedSubCategoryImage] = useState(null);

  // Dynamic data state
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Calculate responsive card width
  const cardWidth = Math.min(156.61, (screenWidth - 60) / 2); // 60 = padding + gap
  const gap = 19.78;

  // Fetch categories and subcategories
  const fetchAllCategories = useCallback(async () => {
    try {
      const resp = await getCategories();
      console.log('LoansScreen - Categories full response:', resp);
      console.log('LoansScreen - Categories data:', resp.data);
      console.log('LoansScreen - Categories data type:', typeof resp.data);
      console.log('LoansScreen - Categories data keys:', resp.data ? Object.keys(resp.data) : 'null');

      let categoriesData = [];
      if (resp.data?.data && Array.isArray(resp.data.data)) {
        categoriesData = resp.data.data;
      } else if (resp.data && Array.isArray(resp.data)) {
        categoriesData = resp.data;
      } else if (resp.data?.categories && Array.isArray(resp.data.categories)) {
        categoriesData = resp.data.categories;
      }

      console.log('LoansScreen - Final categories data:', categoriesData);

      // Check if categories contain subcategories
      categoriesData.forEach(cat => {
        console.log(`LoansScreen - Category ${cat.name}:`, cat);
        if (cat.subcategories || cat.subCategories) {
          console.log(`LoansScreen - Category ${cat.name} has subcategories:`, cat.subcategories || cat.subCategories);
        }
      });

      setCategories(categoriesData);
    } catch (error) {
      console.error('LoansScreen - Error fetching categories:', error);
      Toast.show({
        type: 'error',
        text1: 'Error fetching categories',
        text2: error?.response?.data?.message || 'Please try again',
        position: 'bottom',
      });
    }
  }, []);

  const fetchAllSubCategories = useCallback(async () => {
    try {
      console.log('LoansScreen - Calling getSubCategories with different approaches');

      // Check if token exists
      const token = await AsyncStorage.getItem('token');
      console.log('LoansScreen - Token exists:', !!token);
      console.log('LoansScreen - Token value:', token ? token.substring(0, 20) + '...' : 'null');

      // First try without parameters
      console.log('LoansScreen - Attempt 1: No parameters');
      console.log('LoansScreen - Base URL from global:', global.baseURL);
      console.log('LoansScreen - Full URL would be:', `${global.baseURL}/subcategory`);
      const resp1 = await getSubCategories();
      console.log('LoansScreen - Response 1:', resp1);
      console.log('LoansScreen - Response 1 status:', resp1.status);
      console.log('LoansScreen - Response 1 data:', resp1.data);

      // Check if we got data
      if (resp1.data && (Array.isArray(resp1.data) || resp1.data.data)) {
        let subCategoriesData = [];
        if (resp1.data?.data && Array.isArray(resp1.data.data)) {
          subCategoriesData = resp1.data.data;
        } else if (resp1.data && Array.isArray(resp1.data)) {
          subCategoriesData = resp1.data;
        }

        console.log('LoansScreen - Found data in attempt 1:', subCategoriesData);
        if (subCategoriesData.length > 0) {
          setSubCategories(subCategoriesData);
          return;
        }
      }

      // Try with different pagination parameters
      console.log('LoansScreen - Attempt 2: With pagination');
      const resp2 = await getSubCategories({ page: 1, limit: 1000 });
      console.log('LoansScreen - Response 2:', resp2);
      console.log('LoansScreen - Response 2 data:', resp2.data);

      // Try different response structures for second attempt
      let subCategoriesData = [];
      if (resp2.data?.data && Array.isArray(resp2.data.data)) {
        subCategoriesData = resp2.data.data;
      } else if (resp2.data && Array.isArray(resp2.data)) {
        subCategoriesData = resp2.data;
      }

      console.log('LoansScreen - Final subcategories data:', subCategoriesData);
      console.log('LoansScreen - Final subcategories length:', subCategoriesData.length);
      setSubCategories(subCategoriesData);

    } catch (error) {
      console.error('LoansScreen - Error fetching subcategories:', error);
      console.error('LoansScreen - Error response:', error.response);
      console.error('LoansScreen - Error status:', error.response?.status);
      console.error('LoansScreen - Error message:', error.message);

      // Check if it's an auth error
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.error('LoansScreen - Authentication error detected');
        Toast.show({
          type: 'error',
          text1: 'Authentication Error',
          text2: 'Please log in again',
          position: 'bottom',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error fetching subcategories',
          text2: error?.response?.data?.message || 'Please try again',
          position: 'bottom',
        });
      }
    }
  }, []);

  // Get loan subcategories dynamically
  const getLoanSubCategories = () => {
    console.log('LoansScreen - getLoanSubCategories called');
    console.log('LoansScreen - categories:', categories);
    console.log('LoansScreen - subCategories:', subCategories);

    const loanCategory = categories.find(cat => cat.name.toLowerCase().includes('loan'));
    console.log('LoansScreen - loanCategory found:', loanCategory);

    if (!loanCategory) {
      console.log('LoansScreen - No loan category found');
      return [];
    }

    const filteredSubs = subCategories.filter(
      sub => sub.parentCategory?._id === loanCategory._id
    );
    console.log('LoansScreen - filtered subcategories:', filteredSubs);

    return filteredSubs.sort((a, b) => {
      const orderMap = {
        'Home Loan': 1,
        'Personal Loans': 2,
        'Mortgage Loans': 3,
        'Business Loans': 4
      };

      const orderA = orderMap[a.name] || 99;
      const orderB = orderMap[b.name] || 99;
      return orderA - orderB;
    });
  };

  // Get image URI for subcategory
  const getSubCategoryImageUri = (base64) => {
    if (!base64) return null;
    return base64.startsWith('data:') ? base64 : `data:image/png;base64,${base64}`;
  };

  // Category modal functions
  const handleCategoryPress = (subCategory) => {
    console.log('LoansScreen - handleCategoryPress called with:', subCategory);
    setSelectedCategory(subCategory.name);
    setSelectedSubCategoryData(subCategory);
    setSelectedSubCategoryImage(getSubCategoryImageUri(subCategory.image));
    setShowCategoryModal(true);
  };

  const closeCategoryModal = () => {
    setShowCategoryModal(false);
    setSelectedCategory('');
    setSelectedSubCategoryData(null);
    setSelectedSubCategoryImage(null);
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchAllCategories(), fetchAllSubCategories()]);
      setLoading(false);
    };
    loadData();
  }, [fetchAllCategories, fetchAllSubCategories]);

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchAllCategories();
      fetchAllSubCategories();
    }, [fetchAllCategories, fetchAllSubCategories])
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <SafeAreaView style={styles.safeArea}>

        {/* --- Header Section with Pink Gradient --- */}
        <LinearGradient
          colors={['#A5236A', '#D03A8C', '#952261']}
          locations={[0.0306, 0.3616, 0.9764]} // Exact Figma color stops
          start={{ x: 0.1, y: 0.1 }}   // Approximates 123.58deg angle
          end={{ x: 0.9, y: 0.9 }}     // Approximates 123.58deg angle
          style={styles.header}
        >
          {/* Decorative Background Vector - Vector 5.png */}
          <View style={styles.headerVector}>
            <Image 
              source={require('../../assets/Icons/Vector 5.png')} 
              style={styles.vectorImage}
              resizeMode="stretch"
            />
          </View>

          {/* Top Navigation */}
          <View style={styles.topNav}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="chevron-back-outline" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Loans</Text>
            <View style={{ width: 40 }} /> 
          </View>
          
          {/* Promo Card */}
          <View style={styles.promoCard}>
            <View style={styles.promoTextContainer}>
              <View style={styles.promoBadge}><Text style={styles.promoBadgeText}>Popular</Text></View>
              <Text style={styles.promoTitle}>Earn While You Refer</Text>
              <Text style={styles.promoSubtitle}>Share services you trust and {'\n'}get paid for every referral</Text>
              <TouchableOpacity style={styles.referButton}><Text style={styles.referButtonText}>Refer Now</Text></TouchableOpacity>
            </View>
            <Image 
              source={require('../../assets/Icons/young-man.png')} 
              style={styles.promoImage}
            />
          </View>
        </LinearGradient>

        {/* --- Main Content --- */}
        <View style={styles.contentContainer}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.contentHeaderTitle}>Earn While You Refer</Text>
            <Text style={styles.contentHeaderSubtitle}>Share services you trust and get paid for every referral</Text>
            
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#C75B7A" />
                <Text style={styles.loadingText}>Loading loan categories...</Text>
              </View>
            ) : (
              <View style={[styles.gridContainer, { gap }]}>
                {(() => {
                  const subCategories = getLoanSubCategories();
                  console.log('LoansScreen - Rendering subcategories:', subCategories);
                  return subCategories.map((subCategory, index) => {
                    console.log('LoansScreen - Rendering subcategory:', subCategory.name, subCategory._id);
                    const imageUri = getSubCategoryImageUri(subCategory.image);

                    return (
                      <TouchableOpacity
                        key={subCategory._id || index}
                        style={[styles.gridItemWrapper, { width: cardWidth }]}
                        onPress={() => handleCategoryPress(subCategory)}
                        activeOpacity={0.8}
                      >
                          <LinearGradient
                              colors={['#FBFBFB', '#F6DCDD']}
                              style={styles.gridItem}
                          >
                              <Text style={styles.gridItemText}>{subCategory.name}</Text>
                              {imageUri ? (
                                <Image source={{ uri: imageUri }} style={styles.gridItemIcon} />
                              ) : (
                                <Image source={require('../../assets/Icons/propertyLoans.png')} style={styles.gridItemIcon} />
                              )}
                          </LinearGradient>
                      </TouchableOpacity>
                    );
                  });
                })()}
              </View>
            )}
          </ScrollView>
        </View>

        {/* --- Floating Action Button --- */}
        <TouchableOpacity style={styles.fab}>
          <Ionicons name="calculator-outline" size={18} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Category Modal */}
        <CategoryModal
          visible={showCategoryModal}
          onClose={closeCategoryModal}
          category={selectedCategory}
          subCategory={selectedSubCategoryData}
          subCategoryImage={selectedSubCategoryImage}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6DCDD', // Match content container background
  },
  safeArea: {
    flex: 1,
  },
  header: {
    height: 300,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    overflow: 'hidden',
    zIndex: 10,
  },
  headerVector: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  vectorImage: {
    width: '100%',
    opacity: 0.9,
    marginTop: 80,
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 56, // Standard header height
    zIndex: 11,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 26,
    height: 26,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 24,
    color: '#FBFBFB',
  },
  promoCard: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 10,
    zIndex: 12,
  },
  promoTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  promoBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 100,
    alignSelf: 'flex-start',
  },
  promoBadgeText: {
    fontFamily: 'Rubik-Regular',
    fontSize: 11,
    color: '#FBFBFB',
  },
  promoTitle: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 18,
    color: '#FBFBFB',
    marginTop: 12,
  },
  promoSubtitle: {
    fontFamily: 'Rubik-Regular',
    fontSize: 12,
    color: '#F6F6FE',
    marginVertical: 4,
    lineHeight: 14,
  },
  referButton: {
    backgroundColor: '#1A1B20',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  referButtonText: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 12,
    color: '#FBFBFB',
  },
  promoImage: {
    position: 'absolute',
    right: -30,
    bottom: -2,
    width: 194,
    height: 220,
    resizeMode: 'contain',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#F6DCDD',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 0,
    paddingTop: 20,
    zIndex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Space for FAB and nav bar
  },
  contentHeaderTitle: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 18,
    color: '#1A1B20',
  },
  contentHeaderSubtitle: {
    fontFamily: 'Rubik-Regular',
    fontSize: 12,
    color: '#7D7D7D',
    marginTop: 4,
    marginBottom: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    alignContent: 'flex-start',
    justifyContent: 'space-between',
    padding: 0,
    width: '100%',
    minHeight: 712.16,
  },
  gridItemWrapper: {
    height: 163.2,
    borderRadius: 16.4851,
    shadowColor: 'rgba(143, 49, 249, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 16.4851,
    elevation: 5,
    marginBottom: 0,
  },
  gridItem: {
    flex: 1,
    borderRadius: 16.4851,
    padding: 16,
    justifyContent: 'space-between',
    borderWidth: 1.64851,
    borderColor: '#FFFFFF',
  },
  gridItemText: {
    fontFamily: 'Rubik',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 16.4851,
    lineHeight: 20,
    color: '#1A1B20',
  },
  gridItemIcon: {
    width: 98.91,
    height: 80,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  fab: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1187FE',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(17, 135, 254, 0.5)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#7D7D7D',
    fontFamily: 'Rubik-Regular',
  },
});

export default LoansScreen;


