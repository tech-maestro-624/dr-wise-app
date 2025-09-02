import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { getProductById } from '../api/product';
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get('window');

// --- Responsive Scaling Utilities ---
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const scale = (size) => (width / guidelineBaseWidth) * size;
const verticalScale = (size) => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;
// --- End of Responsive Utilities ---

const CategoryDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { category, product } = route.params || {};

  const [productData, setProductData] = useState(product || null);
  const [loading, setLoading] = useState(!product);

  // --- Dynamic Theming based on Category ---
  const getTheme = () => {
    const name = (productData?.categoryId?.name || category || '').toLowerCase();

    if (name.includes('investment')) {
      return {
        heroColors: ['#F6AC11', '#F7C459', '#C4890E'],
        locations: [0.034, 0.319, 0.9839],
        backButtonColor: '#F6AC11',
      };
    }
    if (name.includes('loan')) {
      return {
        heroColors: ['#A5236A', '#D03A8C', '#952261'],
        locations: [0.0306, 0.3616, 0.9764],
        backButtonColor: '#A5236A',
      };
    }
    if (name.includes('tax') || name.includes('travel')) {
      return {
        heroColors: ['#8F31F9', '#521B90'],
        locations: [0, 1],
        backButtonColor: '#8F31F9',
      };
    }
    // Default to Insurance
    return {
      heroColors: ['#1D8C7C', '#2AA795', '#197366'],
      locations: [0.0415, 0.3387, 0.9769],
      backButtonColor: '#52B4A6',
    };
  };

  useEffect(() => {
    const fetchProductData = async () => {
      if (productData) return; // Already have data
      if (!product?._id) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await getProductById(product._id);
        if (response.data) setProductData(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
        Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to load product details.' });
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [product, productData]);

  const theme = getTheme();
  const displayTitle = productData?.name || 'Product Details';

  return (
    <SafeAreaView style={styles.safeArea} edges={['right', 'left']}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ScrollView stickyHeaderIndices={[0]} showsVerticalScrollIndicator={false}>
        {/* --- Header Section --- */}
        <LinearGradient
          colors={theme.heroColors}
          locations={theme.locations}
          style={[styles.header, { paddingTop: insets.top, height: verticalScale(300) }]}
        >
          <Image source={require('../../assets/Icons/Vector 5.png')} style={styles.headerVector} />
          
          <View style={styles.topNav}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backButton, { backgroundColor: theme.backButtonColor }]}>
              <Ionicons name="chevron-back" size={moderateScale(20)} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle} numberOfLines={1}>{displayTitle}</Text>
            <View style={{ width: moderateScale(32) }} />
          </View>
          
          <View style={styles.promoCard}>
            <View style={styles.promoTextContainer}>
              <View style={styles.promoBadge}><Text style={styles.promoBadgeText}>Popular</Text></View>
              <Text style={styles.promoTitle}>Earn While You Refer</Text>
              <Text style={styles.promoSubtitle}>Share services you trust and get paid for every referral</Text>
              <TouchableOpacity style={styles.referButton} onPress={() => navigation.navigate('ReferralForm', { product: productData, category })}>
                <Text style={styles.referButtonText}>Refer Now</Text>
              </TouchableOpacity>
            </View>
            <Image source={require('../../assets/Icons/young-man.png')} style={styles.promoImage} />
          </View>
        </LinearGradient>

        {/* --- Main Content --- */}
        <View style={styles.contentContainer}>
          {loading ? (
            <View style={styles.centeredContainer}>
              <ActivityIndicator size="large" color="#8F31F9" />
              <Text style={styles.infoText}>Loading product details...</Text>
            </View>
          ) : productData ? (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Key Benefits</Text>
                <Text style={styles.sectionDescription}>{productData.description || 'No description available.'}</Text>
              </View>

              <View style={styles.benefitsContainer}>
                <View style={styles.benefitsList}>
                  {(productData.benefits && productData.benefits.length > 0 ? productData.benefits : [
                    'Earn rewards by referring this product',
                    'Build your referral network',
                    'Track your earnings in real-time',
                  ]).map((benefit, index) => (
                    <View key={index} style={styles.benefitItem}>
                      <View style={styles.benefitDot} />
                      <Text style={styles.benefitText}>{benefit}</Text>
                    </View>
                  ))}
                </View>
                <Image source={require('../../assets/Icons/Group.png')} style={styles.groupIcon} />
              </View>

              <View style={styles.referralCard}>
                <Image source={require('../../assets/Icons/vectorCategoryDetails.png')} style={styles.referralCardBackground} />
                <Image source={require('../../assets/Icons/money_2656371 1.png')} style={styles.referralIcon} />
                <Text style={styles.referralText}>
                  Earn up to ₹{productData?.estimatedPrice || 0} for your referral
                </Text>
              </View>

              <TouchableOpacity style={styles.referFriendButton} onPress={() => navigation.navigate('ReferralForm', { product: productData, category })}>
                <Text style={styles.referFriendButtonText}>Refer a Friend</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.centeredContainer}>
              <Text style={styles.emptyText}>Product Details Not Available</Text>
              <Text style={styles.infoText}>Unable to load product information. Please try again later.</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity style={[styles.fab, { bottom: insets.bottom > 0 ? insets.bottom : moderateScale(20) }]}>
        <Ionicons name="calculator-outline" size={moderateScale(18)} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F5FD',
  },
  header: {
    borderBottomLeftRadius: moderateScale(20),
    borderBottomRightRadius: moderateScale(20),
    overflow: 'hidden',
    // paddingTop and height are now dynamic
  },
  headerVector: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(20),
    height: verticalScale(56),
  },
  backButton: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: moderateScale(20),
    color: '#FFFFFF',
    textAlign: 'center',
    flex: 1,
    marginHorizontal: moderateScale(10),
  },
  promoCard: {
    flexDirection: 'row',
    marginHorizontal: moderateScale(20),
    marginTop: verticalScale(10),
    flex: 1,
  },
  promoTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  promoBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: moderateScale(14),
    paddingVertical: verticalScale(6),
    borderRadius: 100,
    alignSelf: 'flex-start',
  },
  promoBadgeText: {
    fontFamily: 'Rubik-Regular',
    fontSize: moderateScale(11),
    color: '#FFFFFF',
  },
  promoTitle: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: moderateScale(18),
    color: '#FFFFFF',
    marginTop: verticalScale(12),
  },
  promoSubtitle: {
    fontFamily: 'Rubik-Regular',
    fontSize: moderateScale(12),
    color: '#F6F6FE',
    marginVertical: verticalScale(4),
    lineHeight: verticalScale(16),
  },
  referButton: {
    backgroundColor: '#1A1B20',
    paddingVertical: verticalScale(10),
    paddingHorizontal: moderateScale(16),
    borderRadius: moderateScale(8),
    alignSelf: 'flex-start',
    marginTop: verticalScale(12),
  },
  referButtonText: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: moderateScale(12),
    color: '#FFFFFF',
  },
  promoImage: {
    position: 'absolute',
    right: moderateScale(-30),
    bottom: verticalScale(-2),
    width: moderateScale(194),
    height: verticalScale(220),
    resizeMode: 'contain',
  },
  contentContainer: {
    padding: moderateScale(20),
    backgroundColor: '#F6F5FD',
  },
  section: {
    marginBottom: verticalScale(20),
  },
  sectionTitle: {
    fontFamily: 'Rubik-Medium',
    fontSize: moderateScale(22),
    color: '#1A1B20',
    marginBottom: verticalScale(12),
  },
  sectionDescription: {
    fontFamily: 'Rubik-Regular',
    fontSize: moderateScale(14),
    lineHeight: verticalScale(20),
    color: '#7D7D7D',
  },
  benefitsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: verticalScale(30),
  },
  benefitsList: {
    flex: 1,
    marginRight: moderateScale(20),
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: verticalScale(10),
  },
  benefitDot: {
    width: moderateScale(5),
    height: moderateScale(5),
    borderRadius: moderateScale(2.5),
    backgroundColor: '#8F31F9',
    marginTop: verticalScale(6),
    marginRight: moderateScale(10),
  },
  benefitText: {
    fontFamily: 'Rubik-Regular',
    fontSize: moderateScale(14),
    lineHeight: verticalScale(20),
    color: '#1A1B20',
    flex: 1,
  },
  groupIcon: {
    width: moderateScale(90),
    height: verticalScale(100),
    resizeMode: 'contain',
  },
  referralCard: {
    height: verticalScale(70),
    borderRadius: moderateScale(12),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(15),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EAE6F1',
    backgroundColor: '#FFFFFF'
  },
  referralCardBackground: {
    position: 'absolute',
    width: moderateScale(120),
    height: verticalScale(100),
    left: moderateScale(-20),
    top: verticalScale(-15),
    resizeMode: 'contain',
    opacity: 0.5,
  },
  referralIcon: {
    width: moderateScale(40),
    height: moderateScale(40),
    resizeMode: 'contain',
    marginRight: moderateScale(15),
  },
  referralText: {
    fontFamily: 'Rubik-Medium',
    fontSize: moderateScale(14),
    lineHeight: verticalScale(18),
    color: '#1A1B20',
    flex: 1,
  },
  referFriendButton: {
    width: '100%',
    height: verticalScale(47),
    backgroundColor: '#8F31F9',
    borderRadius: moderateScale(8),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(30),
    marginBottom: verticalScale(20),
  },
  referFriendButtonText: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: moderateScale(16),
    color: '#FFFFFF',
  },
  fab: {
    position: 'absolute',
    right: moderateScale(20),
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: '#1187FE',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1187FE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  centeredContainer: {
    paddingVertical: verticalScale(80),
    alignItems: 'center',
  },
  infoText: {
    marginTop: verticalScale(16),
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

export default CategoryDetailScreen;