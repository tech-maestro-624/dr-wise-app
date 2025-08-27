import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, StatusBar, SafeAreaView, Platform, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import CategoryModal from '../components/CategoryModal';

// --- Data for the Investment Categories ---
const investmentCategories = [
  { name: 'Mutual Fund', icon: require('../../assets/Icons/mutualFund.png') },
  { name: 'Fixed', icon: require('../../assets/Icons/fixedInv.png') },
  { name: 'BOND', icon: require('../../assets/Icons/bondInv.png') },
  { name: 'Gold', icon: require('../../assets/Icons/goldInv.png') },
  { name: 'LAS', icon: require('../../assets/Icons/LASInvestments.png') },
  { name: 'NPS', icon: require('../../assets/Icons/npsInsurance.png') },
  { name: 'Trading', icon: require('../../assets/Icons/investmentsTrading.png') },
];

const InvestmentsScreen = () => {
  const navigation = useNavigation();
  const { width: screenWidth } = Dimensions.get('window');
  
  // State for category modal
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Calculate responsive card width
  const cardWidth = Math.min(156.61, (screenWidth - 60) / 2); // 60 = padding + gap
  const gap = 19.78;

  // Category modal functions
  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
    setShowCategoryModal(true);
  };

  const closeCategoryModal = () => {
    setShowCategoryModal(false);
    setSelectedCategory('');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <SafeAreaView style={styles.safeArea}>

        {/* --- Header Section with Orange Gradient --- */}
        <LinearGradient
          colors={['#F6AC11', '#F7C459', '#C4890E']}
          locations={[0.034, 0.319, 0.9839]} // Exact Figma color stops
          start={{ x: 0.1, y: 0.1 }}   // Approximates 123.31deg angle
          end={{ x: 0.9, y: 0.9 }}     // Approximates 123.31deg angle
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
            <Text style={styles.headerTitle}>Investments</Text>
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
        <View style={styles.contentContainer}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.contentHeaderTitle}>Earn While You Refer</Text>
            <Text style={styles.contentHeaderSubtitle}>Share services you trust and get paid for every referral</Text>
            
            <View style={[styles.gridContainer, { gap }]}>
              {investmentCategories.map((item, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={[styles.gridItemWrapper, { width: cardWidth }]}
                  onPress={() => handleCategoryPress(item.name)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#FFFFFF', '#FEE9CF']}
                    style={styles.gridItem}
                  >
                    <Text style={styles.gridItemText}>{item.name}</Text>
                    <Image source={item.icon} style={styles.gridItemIcon} />
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
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
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEE9CF', // Match content container background
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
    backgroundColor: '#FEE9CF',
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
    justifyContent: 'space-evenly',
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
});

export default InvestmentsScreen;


