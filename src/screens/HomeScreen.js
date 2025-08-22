import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, StatusBar, TextInput, Dimensions, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth } = Dimensions.get('window');

// --- Mock Data for UI elements ---
const filterButtons = [
  { id: 'all', name: 'All', icon: 'checkmark-circle' },
  { id: 'insurance', name: 'Insureces', icon: 'shield-checkmark' },
  { id: 'investments', name: 'Investments', icon: 'trending-up' },
  { id: 'loans', name: 'Loans', icon: 'home' },
  { id: 'tax', name: 'Tax', icon: 'calculator' },
  { id: 'travel', name: 'Travel', icon: 'airplane' },
];

const insuranceSubCategories = ['Life', 'Health', 'Motor', 'General', 'Travel'];
const investmentsSubCategories = ['Trading', 'NPS', 'LAS', 'Gold', 'BOND', 'Fixed', 'Mutual Fund'];
const loansSubCategories = ['Business Loan', 'Mortgage Loan', 'Personal Loans', 'Home Loan'];

// --- Reusable Component for Category Cards (Unchanged from your code) ---
const CategoryCard = ({ title, description, subcategories, cardColor, accentColor, children, isGrid }) => (
  <View style={[styles.categoryCard, { backgroundColor: cardColor }]}>
    <View style={styles.categoryCardHeader}>
      <View>
        <Text style={styles.categoryCardTitle}>{title}</Text>
        <Text style={styles.categoryCardSubtitle}>{description}</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <TouchableOpacity style={[styles.categoryUpArrow, { backgroundColor: accentColor }]}>
          <Ionicons name="arrow-up" size={18} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="arrow-forward" size={20} color="#7D7D7D" />
        </TouchableOpacity>
      </View>
    </View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={isGrid && { flexWrap: 'wrap' }}>
      <View style={styles.subcategoryContainer}>
        {subcategories.map(item => (
          <TouchableOpacity key={item} style={styles.subcategoryItem}>
            <View style={styles.subcategoryIcon} />
            <Text style={styles.subcategoryText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
    {children}
  </View>
);

const HomeScreen = () => {
  const navigation = useNavigation();
  const [activeFilter, setActiveFilter] = useState('all');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8D45F1" translucent={true} />
      <ScrollView style={styles.mainScroll} showsVerticalScrollIndicator={false}>

        {/* --- STICKY HEADER - EXACTLY LIKE FIRST IMAGE --- */}
        <View style={styles.stickyHeaderContainer}>
          <LinearGradient
            colors={['#8D45F1', '#9142F9']}
            locations={[0.0509, 0.9815]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.headerGradient}
          >
            {/* Status Bar - Let React Native handle this natively */}
            <View style={styles.statusBarSpacer} />

            {/* Logo Section */}
            <View style={styles.logoSection}>
              <Image 
                source={require('/Users/bhoomika/Desktop/drwise_b_a/drwise-app/assets/background_image.png')}
                style={styles.logoIcon} 
              />
              <View style={styles.logoTextContainer}>
                <Text style={styles.logoText}>Dr WISE</Text>
                <Text style={styles.logoTagline}>Your Future, Engineered Wisely</Text>
              </View>
            </View>

            {/* Notification Button */}
            <TouchableOpacity style={styles.notificationButtonContainer}>
              <View style={styles.notificationButtonBg}>
                <Ionicons name="notifications-outline" size={19} color="#FFFFFF" />
                <View style={styles.notificationDot} />
              </View>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* --- HERO SECTION - EXACTLY LIKE CSS STRUCTURE --- */}
        <LinearGradient
          colors={['#8638EE', '#9553F5', '#8D30FC']}
          locations={[-0.0382, 0.1464, 0.6594]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroGradientContainer}
        >
          {/* MAIN PURPLE CARD */}
          <View style={styles.mainPurpleCard}>
            {/* Search Bar */}
            <View style={styles.searchBar}>
              <Ionicons name="search" size={22} color="#7D7D7D" style={{ marginRight: 10 }} />
              <TextInput placeholder="Search.." placeholderTextColor="#7D7D7D" style={styles.searchInput} />
            </View>
            
            {/* Filter Buttons */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContainer}>
              {filterButtons.map(filter => (
                <TouchableOpacity
                  key={filter.id}
                  style={[styles.filterButton, activeFilter === filter.id && styles.filterButtonActive]}
                  onPress={() => setActiveFilter(filter.id)}
                >
                  <Ionicons 
                    name={filter.icon} 
                    size={15} 
                    color={activeFilter === filter.id ? '#8F31F9' : '#F6F6FE'} 
                  />
                  <Text style={[styles.filterText, activeFilter === filter.id && styles.filterTextActive]}>
                    {filter.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* PROMO CAROUSEL */}
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.promoCarousel}>
            {/* Card 1 - Green */}
            <LinearGradient colors={['#38D552', '#1D6F2B']} style={styles.promoCard}>
              <View style={styles.promoBadge}><Text style={styles.promoBadgeText}>Popular</Text></View>
              <View style={styles.promoTextContainer}>
                <Text style={styles.promoTitle}>Earn While You Refer</Text>
                <Text style={styles.promoDescription}>Share services you trust and get paid for every referral</Text>
                <TouchableOpacity style={styles.promoButton}><Text style={styles.promoButtonText}>Start Now</Text></TouchableOpacity>
              </View>
              <Image 
                source={require('/Users/bhoomika/Desktop/drwise_b_a/drwise-app/assets/background_image.png')}
                style={styles.promoImage} 
              />
            </LinearGradient>

            {/* Card 2 - Purple */}
            <LinearGradient colors={['#9D4BFA', '#AF6CFA', '#8F31F9']} locations={[0.0192, 0.3094, 0.9479]} style={styles.promoCard}>
              <View style={styles.promoBadge}><Text style={styles.promoBadgeText}>Popular</Text></View>
              <View style={styles.promoTextContainer}>
                <Text style={styles.promoTitle}>Earn While You Refer</Text>
                <Text style={styles.promoDescription}>Share services you trust and get paid for every referral</Text>
                <TouchableOpacity style={styles.promoButton}><Text style={styles.promoButtonText}>Start Now</Text></TouchableOpacity>
              </View>
              <Image 
                source={require('/Users/bhoomika/Desktop/drwise_b_a/drwise-app/assets/background_image.png')}
                style={styles.promoImage} 
              />
            </LinearGradient>

            {/* Card 3 - Orange/Yellow */}
            <LinearGradient colors={['#FAB91D', '#946E11']} style={styles.promoCard}>
              <View style={styles.promoBadge}><Text style={styles.promoBadgeText}>Popular</Text></View>
              <View style={styles.promoTextContainer}>
                <Text style={styles.promoTitle}>Earn While You Refer</Text>
                <Text style={styles.promoDescription}>Share services you trust and get paid for every referral</Text>
                <TouchableOpacity style={styles.promoButton}><Text style={styles.promoButtonText}>Start Now</Text></TouchableOpacity>
              </View>
              <Image 
                source={require('/Users/bhoomika/Desktop/drwise_b_a/drwise-app/assets/background_image.png')}
                style={styles.promoImage} 
              />
            </LinearGradient>
          </ScrollView>
          
          {/* Page Indicator */}
          <View style={styles.pageIndicatorContainer}>
            <View style={styles.pageIndicatorActive} />
            <View style={styles.pageIndicator} />
            <View style={styles.pageIndicator} />
          </View>
        </LinearGradient>

        {/* --- Main Content Section (Unchanged from your code) --- */}
        <View style={styles.contentSection}>
          <CategoryCard
            title="Insurance"
            description="Pick an insurance plan and share it to earn rewards on every signup."
            subcategories={insuranceSubCategories}
            cardColor="#C9EBE9"
            accentColor="#1D8C7C"
          />
          
          <View style={styles.taxCard}>
            <Image source={require('/Users/bhoomika/Desktop/drwise_b_a/drwise-app/assets/background_image.png')} style={styles.taxCardIcon} />
            <View style={styles.taxCardTextContainer}>
              <Text style={styles.categoryCardTitle}>Tax</Text>
              <Text style={styles.categoryCardSubtitle}>Get expert help to file your taxes on time and save more.</Text>
            </View>
            <TouchableOpacity style={styles.taxCardArrow}><Ionicons name="arrow-up" size={18} color="#1A1B20" /></TouchableOpacity>
          </View>

          <CategoryCard
            title="Investments"
            description="Explore top investment options and share them to earn with every new join."
            subcategories={investmentsSubCategories}
            cardColor="#FEE9CF"
            accentColor="#F6AC11"
            isGrid={true}
          />

          <CategoryCard
            title="Loans"
            description="Select the right loan offers and share them to earn when someone applies."
            subcategories={loansSubCategories}
            cardColor="#F6DCDD"
            accentColor="#A5236A"
          />

          <View style={styles.travelCardContainer}>
            <Image source={require('/Users/bhoomika/Desktop/drwise_b_a/drwise-app/assets/background_image.png')} style={styles.travelBgImage} />
            <View style={styles.categoryCardHeader}>
              <View>
                <Text style={[styles.categoryCardTitle, { color: '#FFFFFF' }]}>Travel</Text>
                <Text style={[styles.categoryCardSubtitle, { color: '#FFFFFF' }]}>Share the best travel deals and earn when someone books.</Text>
              </View>
            </View>
            <View style={styles.travelSubCards}>
              <TouchableOpacity style={styles.travelSubCard}>
                <TouchableOpacity style={styles.travelCardArrow}><Ionicons name="arrow-up" size={12} color="#1A1B20" /></TouchableOpacity>
                <Text style={styles.travelSubCardText}>International Travel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.travelSubCard}>
                <TouchableOpacity style={styles.travelCardArrow}><Ionicons name="arrow-up" size={12} color="#1A1B20" /></TouchableOpacity>
                <Text style={styles.travelSubCardText}>Domestic Travel</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.trustCard}>
            <Text style={styles.trustTitle}>Built on Trust, Growing with You</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}><Ionicons name="people-outline" size={30} color="#3CAAFD" /><Text style={styles.statNumber}>10K+</Text><Text style={styles.statLabel}>Users exploring</Text></View>
              <View style={styles.statItem}><Ionicons name="star-outline" size={30} color="#FFD541" /><Text style={styles.statNumber}>1K+</Text><Text style={styles.statLabel}>Verified Affiliates</Text></View>
              <View style={styles.statItem}><Ionicons name="shield-checkmark-outline" size={30} color="#28a745" /><Text style={styles.statNumber}>20+</Text><Text style={styles.statLabel}>Trusted Partners</Text></View>
            </View>
          </View>
        </View>
      </ScrollView>
      
      {/* --- Floating Bottom Navigation Bar (Unchanged from your code) --- */}
      <View style={styles.bottomNavContainer}>
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem}><Ionicons name="home" size={24} color="#1A1B20" /><Text style={styles.navTextActive}>Home</Text></TouchableOpacity>
          <TouchableOpacity style={styles.navItem}><Ionicons name="wallet-outline" size={24} color="#7D7D7D" /><Text style={styles.navText}>Credits</Text></TouchableOpacity>
          <View style={styles.navItem} /> 
          <TouchableOpacity style={styles.navItem}><Ionicons name="people-outline" size={24} color="#7D7D7D" /><Text style={styles.navText}>My Referral</Text></TouchableOpacity>
          <TouchableOpacity style={styles.navItem}><Ionicons name="person-outline" size={24} color="#7D7D7D" /><Text style={styles.navText}>Profile</Text></TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.addButton}><Ionicons name="add" size={30} color="#FFFFFF" /></TouchableOpacity>
        <View style={styles.homeIndicator}><View style={styles.homeIndicatorLine} /></View>
      </View>
    </SafeAreaView>
  );
};

// --- Stylesheet - EXACTLY LIKE FIRST IMAGE ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F6FE' },
  mainScroll: { flex: 1 },
  
  // STICKY HEADER - EXACTLY LIKE FIRST IMAGE
  stickyHeaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    width: screenWidth,
    height: 100,
  },
  statusBarSpacer: {
    height: 44, // Standard status bar height
  },
  headerGradient: {
    width: '100%',
    height: '100%',
  },
  logoSection: {
    position: 'absolute',
    left: 23,
    top: 43,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    width: 49,
    height: 47,
    resizeMode: 'contain',
    marginRight: 10,
  },
  logoTextContainer: {
    flexDirection: 'column',
  },
  logoText: {
    fontFamily: 'Rubik',
    fontSize: 24,
    fontWeight: '600',
    color: '#FBFBFB',
    lineHeight: 28,
  },
  logoTagline: {
    fontFamily: 'Rubik',
    fontSize: 12,
    color: '#FBFBFB',
    opacity: 0.8,
    marginTop: 2,
  },
  notificationButtonContainer: {
    position: 'absolute',
    right: 20,
    bottom: 15,
  },
  notificationButtonBg: {
    width: 31,
    height: 31,
    backgroundColor: '#7830E2',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    backgroundColor: '#EE5855',
    borderRadius: 4,
  },

  // HERO GRADIENT CONTAINER - EXACTLY LIKE CSS Frame 9176
  heroGradientContainer: {
    width: screenWidth,
    height: 385,
    borderRadius: 30,
    paddingTop: 100, // Account for sticky header
    paddingBottom: 20,
  },
  // MAIN PURPLE CARD - EXACTLY LIKE CSS Rectangle 2375
  mainPurpleCard: {
    width: screenWidth - 40, // 335px equivalent
    height: 266,
    backgroundColor: '#7930E2',
    borderRadius: 20,
    marginHorizontal: 20,
    marginTop: 0,
    padding: 15,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
  },
  // HERO SECTION STYLES (for the content below sticky header)
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingTop: 50, // Adjust for status bar
    paddingBottom: 15 
  },
  logoImage: {
    width: 150,
    height: 40,
    resizeMode: 'contain',
  },
  notificationButton: { 
    position: 'relative',
    padding: 5,
  },
  notificationDot: { 
    position: 'absolute', 
    top: 3, 
    right: 3, 
    width: 8, 
    height: 8, 
    backgroundColor: '#EE5855', 
    borderRadius: 4,
  },
  searchBar: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FBFBFB', 
    borderRadius: 10, 
    paddingHorizontal: 15,
    height: 40,
    width: screenWidth - 64, // 311px equivalent
    alignSelf: 'center',
    marginTop: 14, // 114px - 100px (header)
    borderWidth: 1,
    borderColor: '#FFFFFF',
    shadowColor: 'rgba(143, 49, 249, 0.1)',
    shadowOffset: { width: 0, height: 0 }, 
    shadowRadius: 10, 
    elevation: 5 
  },
  searchInput: { 
    flex: 1, 
    fontFamily: 'Rubik', 
    fontSize: 13, 
    color: '#7D7D7D',
    lineHeight: 15,
    letterSpacing: 0.2,
  },
  filterContainer: { 
    paddingVertical: 15, 
    paddingHorizontal: 12, // 32px - 20px (card padding)
    gap: 10,
    marginTop: 10, // 164px - 154px (search bar bottom)
    height: 33,
  },
  filterButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
    paddingHorizontal: 10, 
    paddingVertical: 8, 
    borderRadius: 6, 
    gap: 6,
    height: 33,
    shadowColor: 'rgba(143, 49, 249, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    elevation: 5,
  },
  filterButtonActive: { 
    backgroundColor: '#FFFFFF',
    height: 33,
    shadowColor: 'rgba(143, 49, 249, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    elevation: 5,
  },
  filterText: { 
    fontFamily: 'Rubik', 
    fontSize: 14, 
    color: '#F6F6FE',
    lineHeight: 17,
    letterSpacing: 0.2,
  },
  filterTextActive: { 
    color: '#8F31F9',
    fontFamily: 'Rubik',
    lineHeight: 17,
    letterSpacing: 0.2,
  },
  promoCarousel: { 
    width: screenWidth - 40, // 335px equivalent
    height: 159,
    marginTop: 7, // 207px - 200px (card bottom)
    alignSelf: 'center',
    overflow: 'visible',
    position: 'absolute',
    top: 207,
  },
  promoCard: { 
    width: screenWidth - 40, // 335px equivalent
    height: 159,
    borderRadius: 20, 
    padding: 15, 
    marginRight: 10, 
    flexDirection: 'row', 
    overflow: 'hidden',
    position: 'relative',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
  },
  promoBadge: { 
    backgroundColor: 'rgba(255, 255, 255, 0.2)', 
    paddingHorizontal: 14, 
    paddingVertical: 6, 
    borderRadius: 100, 
    alignSelf: 'flex-start',
    position: 'absolute',
    top: 12,
    left: 12,
  },
  promoBadgeText: { 
    fontFamily: 'Rubik', 
    fontSize: 11, 
    color: '#FBFBFB',
    lineHeight: 15,
    letterSpacing: 0.2,
  },
  promoTextContainer: { 
    flex: 1, 
    justifyContent: 'center',
    paddingLeft: 12,
    paddingTop: 44,
  },
  promoTitle: { 
    fontFamily: 'Rubik', 
    fontSize: 18, 
    fontWeight: '600',
    color: '#FBFBFB', 
    marginTop: 8,
    lineHeight: 21,
  },
  promoDescription: { 
    fontFamily: 'Rubik', 
    fontSize: 12, 
    color: '#F6F6FE', 
    marginVertical: 4, 
    lineHeight: 14,
    letterSpacing: 0.2,
  },
  promoButton: { 
    backgroundColor: '#FBFBFB', 
    paddingHorizontal: 16, 
    paddingVertical: 14, 
    borderRadius: 8, 
    alignSelf: 'flex-start', 
    marginTop: 10,
    height: 26,
  },
  promoButtonText: { 
    fontFamily: 'Rubik', 
    fontSize: 12, 
    fontWeight: '600',
    color: '#8F31F9',
    lineHeight: 14,
    letterSpacing: 0.2,
  },
  promoImage: { 
    position: 'absolute', 
    right: 0, 
    top: 0, 
    width: 142, 
    height: 161,
    resizeMode: 'contain',
  },
  pageIndicatorContainer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: 5, 
    marginTop: 15,
    paddingBottom: 10,
    alignSelf: 'center',
    width: 37,
    height: 9,
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: [{ translateX: -18.5 }], // Half of 37px width
  },
  pageIndicatorActive: { 
    width: 16, 
    height: 3, 
    backgroundColor: '#FBFBFB', 
    borderRadius: 10,
    marginRight: 2,
  },
  pageIndicator: { 
    width: 3, 
    height: 3, 
    backgroundColor: '#FBFBFB', 
    borderRadius: 2, 
    opacity: 0.5 
  },
  // REBUILT STYLES END
  contentSection: { 
    padding: 20, 
    backgroundColor: '#F6F6FE', 
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20, 
    marginTop: -20,
  },
  categoryCard: { borderRadius: 10, padding: 14, marginBottom: 20, shadowColor: 'rgba(143, 49, 249, 0.1)', shadowOffset: { width: 0, height: 4 }, shadowRadius: 10, elevation: 5 },
  categoryCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  categoryCardTitle: { fontFamily: 'Rubik-Medium', fontSize: 18, color: '#1A1B20', marginBottom: 4 },
  categoryCardSubtitle: { fontFamily: 'Rubik-Regular', fontSize: 12, color: '#7D7D7D', lineHeight: 14, maxWidth: '80%' },
  categoryUpArrow: { borderRadius: 24, padding: 6 },
  subcategoryContainer: { flexDirection: 'row', gap: 12 },
  subcategoryItem: { backgroundColor: '#FFFFFF', borderRadius: 10, padding: 10, width: 95, height: 99, alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#FFFFFF', shadowColor: 'rgba(143, 49, 249, 0.1)', shadowOffset: { width: 0, height: 2 }, shadowRadius: 5, elevation: 3, marginBottom: 12 },
  subcategoryIcon: { width: 60, height: 60, backgroundColor: '#F0F0F0', borderRadius: 8 },
  subcategoryText: { fontFamily: 'Rubik-Medium', fontSize: 10, color: '#1A1B20', textAlign: 'center' },
  taxCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FBFBFB', borderRadius: 10, padding: 14, marginBottom: 20, shadowColor: 'rgba(143, 49, 249, 0.1)', shadowOffset: { width: 0, height: 4 }, shadowRadius: 10, elevation: 5 },
  taxCardIcon: { width: 68, height: 68, borderRadius: 8, marginRight: 16 },
  taxCardTextContainer: { flex: 1 },
  taxCardArrow: { backgroundColor: '#F0F0F0', borderRadius: 12, padding: 6, alignSelf: 'flex-start' },
  travelCardContainer: { borderRadius: 10, padding: 14, marginBottom: 20, backgroundColor: '#8F31F9', overflow: 'hidden' },
  travelBgImage: { position: 'absolute', top: 0, right: 0, width: '100%', height: '100%' },
  travelSubCards: { flexDirection: 'row', gap: 12, marginTop: 20 },
  travelSubCard: { flex: 1, height: 160, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 10, padding: 12, justifyContent: 'flex-end', alignItems: 'center' },
  travelCardArrow: { position: 'absolute', top: 12, right: 12, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 6 },
  travelSubCardText: { fontFamily: 'Rubik-Medium', fontSize: 11, color: '#FFFFFF' },
  trustCard: { backgroundColor: '#FFFFFF', borderRadius: 10, padding: 20, marginBottom: 100, alignItems: 'center' },
  trustTitle: { fontFamily: 'Rubik-Medium', fontSize: 18, color: '#1A1B20', marginBottom: 20, textAlign: 'center' },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
  statItem: { alignItems: 'center', flex: 1, gap: 4 },
  statNumber: { fontFamily: 'Rubik-Medium', fontSize: 20, color: '#1A1B20' },
  statLabel: { fontFamily: 'Rubik-Regular', fontSize: 10, color: '#7D7D7D', textAlign: 'center' },
  bottomNavContainer: { position: 'absolute', bottom: 0, left: 0, right: 0 },
  bottomNav: { flexDirection: 'row', height: 80, backgroundColor: '#FBFBFB', borderTopWidth: 1, borderColor: '#F0F0F0', alignItems: 'center', paddingBottom: 20 },
  navItem: { flex: 1, alignItems: 'center', gap: 4 },
  navText: { fontFamily: 'Rubik-Regular', fontSize: 12, color: '#7D7D7D' },
  navTextActive: { fontFamily: 'Rubik-Regular', fontSize: 12, color: '#1A1B20' },
  addButton: { position: 'absolute', alignSelf: 'center', top: -26, width: 52, height: 52, borderRadius: 26, backgroundColor: '#8F31F9', justifyContent: 'center', alignItems: 'center', shadowColor: '#8F31F9', shadowOffset: { width: 0, height: 4 }, shadowRadius: 10, elevation: 8 },
  homeIndicator: { height: 34, backgroundColor: '#FBFBFB', justifyContent: 'center', alignItems: 'center' },
  homeIndicatorLine: { width: 135, height: 5, backgroundColor: '#1A1B20', borderRadius: 100 },
});

export default HomeScreen;