import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, StatusBar, SafeAreaView, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';




const CategoryDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { category, planName } = route.params || { category: 'General', planName: 'Individual Plan' };

  // Get hero section colors and background based on category
  const getHeroColors = (category) => {
    switch (category) {
      case 'Life':
      case 'Health':
      case 'Motor':
      case 'General':
        return ['#1D8C7C', '#2AA795', '#197366']; // Green gradient for Insurance
      case 'Mutual Fund':
      case 'Fixed':
      case 'BOND':
      case 'Gold':
      case 'LAS':
      case 'NPS':
      case 'Trading':
        return ['#F6AC11', '#F7C459', '#C4890E']; // Orange gradient for Investments (from InvestmentsScreen)
      case 'Home Loan':
      case 'Personal Loans':
      case 'Mortgage Loan':
      case 'Business Loan':
        return ['#A5236A', '#D03A8C', '#952261']; // Pink gradient for Loans (from LoansScreen)
      case 'Tax':
      case 'Domestic Travel':
      case 'International Travel':
        return ['#8F31F9', '#521B90']; // Purple gradient for Tax & Travel (from Figma)
      default:
        return ['#1D8C7C', '#2AA795', '#197366']; // Default green for Insurance
    }
  };

  // Get gradient locations based on category
  const getGradientLocations = (category) => {
    switch (category) {
      case 'Mutual Fund':
      case 'Fixed':
      case 'BOND':
      case 'Gold':
      case 'LAS':
      case 'NPS':
      case 'Trading':
        return [0.034, 0.319, 0.9839]; // Investments gradient locations
      case 'Home Loan':
      case 'Personal Loans':
      case 'Mortgage Loan':
      case 'Business Loan':
        return [0.0306, 0.3616, 0.9764]; // Loans gradient locations
      case 'Tax':
      case 'Domestic Travel':
      case 'International Travel':
        return [0, 1]; // Purple gradient locations (2 colors only)
      default:
        return [0.0415, 0.3387, 0.9769]; // Default Insurance gradient locations
    }
  };

  // Get background color based on category
  const getBackgroundColor = (category) => {
    return '#FFFFFF'; // White background for all categories
  };

  // Get back button background color based on category
  const getBackButtonColor = (category) => {
    switch (category) {
      case 'Mutual Fund':
      case 'Fixed':
      case 'BOND':
      case 'Gold':
      case 'LAS':
      case 'NPS':
      case 'Trading':
        return '#F6AC11'; // Orange for Investments (matches hero gradient)
      case 'Home Loan':
      case 'Personal Loans':
      case 'Mortgage Loan':
      case 'Business Loan':
        return '#A5236A'; // Pink for Loans (matches hero gradient)
      case 'Tax':
      case 'Domestic Travel':
      case 'International Travel':
        return '#8F31F9'; // Purple for Tax & Travel (matches hero gradient)
      default:
        return '#52B4A6'; // Default teal for Insurance
    }
  };

  const heroColors = getHeroColors(category);
  const backgroundColor = getBackgroundColor(category);
  const gradientLocations = getGradientLocations(category);
  const backButtonColor = getBackButtonColor(category);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>

        {/* --- Header Section --- */}
        <LinearGradient
          colors={heroColors}
          locations={gradientLocations} // Dynamic gradient locations based on category
          start={{ x: 0.1, y: 0.1 }}   // Approximates 115.06deg angle
          end={{ x: 0.9, y: 0.9 }}     // Approximates 115.06deg angle
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
            <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backButton, { backgroundColor: backButtonColor }]}>
              <Ionicons name="chevron-back-outline" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{planName}</Text>
            <View style={{ width: 40 }} /> 
          </View>
          
          {/* Promo Card */}
          <View style={styles.promoCard}>
            <View style={styles.promoTextContainer}>
              <View style={styles.promoBadge}><Text style={styles.promoBadgeText}>Popular</Text></View>
              <Text style={styles.promoTitle}>Earn While You Refer</Text>
              <Text style={styles.promoSubtitle}>Share services you trust and{'\n'}get paid for every referral</Text>
              <TouchableOpacity style={styles.referButton}><Text style={styles.referButtonText}>Refer Now</Text></TouchableOpacity>
            </View>
            <Image 
              source={require('../../assets/Icons/young-man.png')} 
              style={styles.promoImage}
            />
          </View>
        </LinearGradient>

        {/* --- Main Content --- */}
        <View style={[styles.contentContainer, { backgroundColor }]}>
          <ScrollView 
            contentContainerStyle={[styles.scrollContent, { backgroundColor }]} 
            showsVerticalScrollIndicator={false}
            style={{ backgroundColor }}
          >
            
            {/* Key Benefits Section */}
            <View style={styles.keyBenefitsSection}>
              <Text style={styles.keyBenefitsTitle}>Key Benefits</Text>
              <Text style={styles.keyBenefitsDescription}>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's s
              </Text>
            </View>

            {/* Benefits List with Shield Icon */}
            <View style={styles.benefitsContainer}>
              <View style={styles.benefitsList}>
                <View style={styles.benefitItem}>
                  <View style={styles.benefitDot} />
                  <Text style={styles.benefitText}>Lorem Ipsum is simply dummy text of printing</Text>
                </View>
                <View style={styles.benefitItem}>
                  <View style={styles.benefitDot} />
                  <Text style={styles.benefitText}>Lorem Ipsum is simply dummy</Text>
                </View>
                <View style={styles.benefitItem}>
                  <View style={styles.benefitDot} />
                  <Text style={styles.benefitText}>Lorem Ipsum is simply dummy text of printing</Text>
                </View>
                <View style={styles.benefitItem}>
                  <View style={styles.benefitDot} />
                  <Text style={styles.benefitText}>Lorem Ipsum is simply dummy text of printing</Text>
                </View>
              </View>
              
              {/* Group Icon */}
              <View style={styles.shieldIconContainer}>
                <Image source={require('../../assets/Icons/Group.png')} style={styles.groupIcon} />
              </View>
            </View>

            {/* Referral Card */}
            <View style={styles.referralCard}>
              <View style={styles.referralCardBackground} />
              <Image source={require('../../assets/Icons/Group.png')} style={styles.referralIcon} />
              <Text style={styles.referralText}>Earn upto $120.00 for your referral</Text>
            </View>

          </ScrollView>
        </View>

        {/* --- Floating Action Button --- */}
        <TouchableOpacity style={styles.fab}>
          <Ionicons name="calculator-outline" size={18} color="#FFFFFF" />
        </TouchableOpacity>


      </SafeAreaView>
    </View>
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
    width: '100%',
    height: 300,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    overflow: 'hidden',
  },
  headerVector: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  vectorImage: {
    width: '100%',
    // height: '100%',
    opacity: 0.9,
    marginTop: 80,
    // transform: [{ rotate: '1deg' }], // Subtle opacity for background decoration
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 56, // Standard header height for safe spacing
    zIndex: 11,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 0,
    paddingTop: 20,
    zIndex: 1,
    width: '100%',
    backgroundColor: 'transparent', // Ensure no default background
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  keyBenefitsSection: {
    marginBottom: 20,
  },
  keyBenefitsTitle: {
    fontFamily: 'Rubik-Medium',
    fontSize: 24,
    color: '#1A1B20',
    marginBottom: 12,
  },
  keyBenefitsDescription: {
    fontFamily: 'Rubik-Regular',
    fontSize: 14,
    lineHeight: 17,
    color: '#7D7D7D',
    letterSpacing: 0.2,
  },
  benefitsContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  benefitsList: {
    flex: 1,
    marginRight: 30,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 9,
  },
  benefitDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#8F31F9',
    marginTop: 6,
    marginRight: 9,
  },
  benefitText: {
    fontFamily: 'Rubik-Regular',
    fontSize: 14,
    lineHeight: 17,
    color: '#1A1B20',
    letterSpacing: 0.2,
    flex: 1,
  },
  shieldIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginLeft: 20,
  },
  groupIcon: {
    width: 80,
    height: 90,
    resizeMode: 'contain',
  },
  referralCard: {
    position: 'relative',
    width: '100%',
    height: 57,
    backgroundColor: '#F8F9FF',
    borderWidth: 1,
    borderColor: '#E8E9FF',
    borderRadius: 10,
    shadowColor: 'rgba(143, 49, 249, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    overflow: 'hidden',
  },
  referralCardBackground: {
    position: 'absolute',
    width: 107,
    height: 93,
    left: -13,
    top: -18,
    backgroundColor: 'rgba(150, 61, 251, 0.1)',
    borderRadius: 50,
  },
  referralIcon: {
    width: 52,
    height: 52,
    resizeMode: 'contain',
    marginRight: 15,
  },
  referralText: {
    fontFamily: 'Rubik-Medium',
    fontSize: 14,
    lineHeight: 17,
    color: '#1A1B20',
    flex: 1,
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
});

export default CategoryDetailScreen;