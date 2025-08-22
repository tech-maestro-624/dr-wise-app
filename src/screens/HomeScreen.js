import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, StatusBar, TextInput, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius, CommonStyles, Shadows } from '../constants/designSystem';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
  const [activeFilter, setActiveFilter] = useState('all');

  const filterButtons = [
    { id: 'all', name: 'All' },
    { id: 'insurance', name: 'Insurance' },
    { id: 'investments', name: 'Investments' },
    { id: 'loans', name: 'Loans' },
    { id: 'tax', name: 'Tax' },
    { id: 'travel', name: 'Travel' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8638EE" />
      
      {/* Status Bar */}
      <View style={styles.statusBar}>
        <Text style={styles.time}>9:41</Text>
        <View style={styles.statusIcons}>
          <View style={styles.signalIcon} />
          <Ionicons name="wifi" size={15} color="#FBFBFB" />
          <View style={styles.batteryIcon} />
        </View>
      </View>

      {/* Header with User Info */}
      <LinearGradient
        colors={['#8D45F1', '#9142F9']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.headerContent}>
          <Text style={styles.userName}>Punith</Text>
          <TouchableOpacity style={styles.profileButton}>
            <View style={styles.profileIcon}>
              <Ionicons name="person-outline" size={16} color="#FBFBFB" />
            </View>
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Main Content Container */}
      <LinearGradient
        colors={['#8638EE', '#9553F5', '#8D30FC']}
        style={styles.mainContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={22} color="#7D7D7D" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search.."
              placeholderTextColor="#7D7D7D"
            />
          </View>
        </View>

        {/* Filter Buttons */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterScrollView}
          contentContainerStyle={styles.filterContainer}
        >
          {filterButtons.map((filter, index) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterButton,
                activeFilter === filter.id && styles.filterButtonActive
              ]}
              onPress={() => setActiveFilter(filter.id)}
            >
              {activeFilter === filter.id && (
                <Ionicons name="checkmark-circle" size={15} color="#8F31F9" />
              )}
              {filter.id === 'insurance' && <Ionicons name="shield-outline" size={15} color="#F6F6FE" />}
              {filter.id === 'investments' && <Ionicons name="trending-up-outline" size={15} color="#F6F6FE" />}
              {filter.id === 'loans' && <Ionicons name="home-outline" size={15} color="#F6F6FE" />}
              {filter.id === 'tax' && <Ionicons name="calculator-outline" size={15} color="#F6F6FE" />}
              {filter.id === 'travel' && <Ionicons name="airplane-outline" size={15} color="#F6F6FE" />}
              <Text style={[
                styles.filterText,
                activeFilter === filter.id && styles.filterTextActive
              ]}>
                {filter.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Promotional Cards */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.promoScrollView}
          contentContainerStyle={styles.promoContainer}
        >
          {/* Green Card */}
          <LinearGradient
            colors={['#38D552', '#1D6F2B']}
            style={styles.promoCard}
          >
            <View style={styles.popularBadge}>
              <Text style={styles.popularText}>Popular</Text>
            </View>
            <View style={styles.promoContent}>
              <Text style={styles.promoTitle}>Earn While You Refer</Text>
              <Text style={styles.promoDescription}>
                Share services you trust and get paid for every referral
              </Text>
              <TouchableOpacity style={styles.startButton}>
                <Text style={styles.startButtonText}>Start Now</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/* Purple Card */}
          <LinearGradient
            colors={['#9D4BFA', '#AF6CFA', '#8F31F9']}
            style={styles.promoCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.popularBadge}>
              <Text style={styles.popularText}>Popular</Text>
            </View>
            <View style={styles.promoContent}>
              <Text style={styles.promoTitle}>Earn While You Refer</Text>
              <Text style={styles.promoDescription}>
                Share services you trust and get paid for every referral
              </Text>
              <TouchableOpacity style={styles.startButton}>
                <Text style={styles.startButtonText}>Start Now</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/* Orange Card */}
          <LinearGradient
            colors={['#FAB91D', '#946E11']}
            style={styles.promoCard}
          >
            <View style={styles.popularBadge}>
              <Text style={styles.popularText}>Popular</Text>
            </View>
            <View style={styles.promoContent}>
              <Text style={styles.promoTitle}>Earn While You Refer</Text>
              <Text style={styles.promoDescription}>
                Share services you trust and get paid for every referral
              </Text>
              <TouchableOpacity style={styles.startButton}>
                <Text style={styles.startButtonText}>Start Now</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </ScrollView>

        {/* Page Indicator */}
        <View style={styles.pageIndicator}>
          <View style={styles.activeIndicator} />
          <View style={styles.inactiveIndicator} />
          <View style={styles.inactiveIndicator} />
        </View>
      </LinearGradient>

      {/* Content Section */}
      <LinearGradient
        colors={['#F6F6FE', '#F6F6FE', '#C697FB']}
        style={styles.contentSection}
        locations={[0, 0.7494, 1]}
      >
        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Insurance Section */}
          <View style={styles.categorySection}>
            <View style={styles.categoryHeader}>
              <TouchableOpacity style={styles.upArrow}>
                <Ionicons name="arrow-up-outline" size={18} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.forwardArrow}>
                <Ionicons name="arrow-forward-outline" size={20} color="#7D7D7D" />
              </TouchableOpacity>
            </View>
            <View style={styles.categoryContent}>
              <Text style={styles.categoryTitle}>Insurance</Text>
              <Text style={styles.categoryDescription}>
                Pick an insurance plan and share it to earn rewards on every signup.
              </Text>
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.subcategoryScrollView}
            >
              <View style={styles.subcategoryGrid}>
                <View style={styles.subcategoryItem}>
                  <Text style={styles.subcategoryText}>Life</Text>
                  <View style={styles.subcategoryIcon} />
                </View>
                <View style={styles.subcategoryItem}>
                  <Text style={styles.subcategoryText}>Health</Text>
                  <View style={styles.subcategoryIcon} />
                </View>
                <View style={styles.subcategoryItem}>
                  <Text style={styles.subcategoryText}>Motor</Text>
                  <View style={styles.subcategoryIcon} />
                </View>
                <View style={styles.subcategoryItem}>
                  <Text style={styles.subcategoryText}>General</Text>
                  <View style={styles.subcategoryIcon} />
                </View>
                <View style={styles.subcategoryItem}>
                  <Text style={styles.subcategoryText}>Travel</Text>
                  <View style={styles.subcategoryIcon} />
                </View>
              </View>
            </ScrollView>
          </View>

          {/* Tax Section */}
          <View style={styles.taxSection}>
            <TouchableOpacity style={styles.taxUpArrow}>
              <Ionicons name="arrow-up-outline" size={18} color="#1A1B20" />
            </TouchableOpacity>
            <View style={styles.taxIcon} />
            <View style={styles.taxContent}>
              <Text style={styles.taxTitle}>Tax</Text>
              <Text style={styles.taxDescription}>
                Get expert help to file your taxes on time and save more.
              </Text>
            </View>
          </View>

          {/* Investments Section */}
          <View style={styles.investmentsSection}>
            <View style={styles.categoryHeader}>
              <TouchableOpacity style={styles.upArrow}>
                <Ionicons name="arrow-up-outline" size={18} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.forwardArrow}>
                <Ionicons name="arrow-forward-outline" size={20} color="#7D7D7D" />
              </TouchableOpacity>
            </View>
            <View style={styles.categoryContent}>
              <Text style={styles.categoryTitle}>Investments</Text>
              <Text style={styles.categoryDescription}>
                Explore top investment options and share them to earn with every new join.
              </Text>
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.subcategoryScrollView}
            >
              <View style={styles.investmentGrid}>
                <View style={styles.subcategoryItem}>
                  <Text style={styles.subcategoryText}>Trading</Text>
                  <View style={styles.subcategoryIcon} />
                </View>
                <View style={styles.subcategoryItem}>
                  <Text style={styles.subcategoryText}>NPS</Text>
                  <View style={styles.subcategoryIcon} />
                </View>
                <View style={styles.subcategoryItem}>
                  <Text style={styles.subcategoryText}>LAS</Text>
                  <View style={styles.subcategoryIcon} />
                </View>
                <View style={styles.subcategoryItem}>
                  <Text style={styles.subcategoryText}>Gold</Text>
                  <View style={styles.subcategoryIcon} />
                </View>
                <View style={styles.subcategoryItem}>
                  <Text style={styles.subcategoryText}>BOND</Text>
                  <View style={styles.subcategoryIcon} />
                </View>
                <View style={styles.subcategoryItem}>
                  <Text style={styles.subcategoryText}>Fixed</Text>
                  <View style={styles.subcategoryIcon} />
                </View>
                <View style={styles.subcategoryItem}>
                  <Text style={styles.subcategoryText}>Mutual Fund</Text>
                  <View style={styles.subcategoryIcon} />
                </View>
              </View>
            </ScrollView>
          </View>

          {/* Travel Section */}
          <View style={styles.travelSection}>
            <View style={styles.travelContent}>
              <Text style={styles.travelTitle}>Travel</Text>
              <Text style={styles.travelDescription}>
                Share the best travel deals and earn when someone books through your link.
              </Text>
            </View>
            <View style={styles.travelCards}>
              <View style={styles.travelCard}>
                <TouchableOpacity style={styles.travelCardArrow}>
                  <Ionicons name="arrow-up-outline" size={12} color="#1A1B20" />
                </TouchableOpacity>
                <Text style={styles.travelCardText}>International Travel</Text>
              </View>
              <View style={styles.travelCard}>
                <TouchableOpacity style={styles.travelCardArrow}>
                  <Ionicons name="arrow-up-outline" size={12} color="#1A1B20" />
                </TouchableOpacity>
                <Text style={styles.travelCardText}>Domestic Travel</Text>
              </View>
            </View>
          </View>

          {/* Loans Section */}
          <View style={styles.loansSection}>
            <View style={styles.categoryHeader}>
              <TouchableOpacity style={styles.upArrow}>
                <Ionicons name="arrow-up-outline" size={18} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.forwardArrow}>
                <Ionicons name="arrow-forward-outline" size={20} color="#7D7D7D" />
              </TouchableOpacity>
            </View>
            <View style={styles.categoryContent}>
              <Text style={styles.categoryTitle}>Loans</Text>
              <Text style={styles.categoryDescription}>
                Select the right loan offers and share them to earn when someone applies.
              </Text>
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.subcategoryScrollView}
            >
              <View style={styles.subcategoryGrid}>
                <View style={styles.subcategoryItem}>
                  <Text style={styles.subcategoryText}>Business Loan</Text>
                  <View style={styles.subcategoryIcon} />
                </View>
                <View style={styles.subcategoryItem}>
                  <Text style={styles.subcategoryText}>Mortgage Loan</Text>
                  <View style={styles.subcategoryIcon} />
                </View>
                <View style={styles.subcategoryItem}>
                  <Text style={styles.subcategoryText}>Personal Loans</Text>
                  <View style={styles.subcategoryIcon} />
                </View>
                <View style={styles.subcategoryItem}>
                  <Text style={styles.subcategoryText}>Home Loan</Text>
                  <View style={styles.subcategoryIcon} />
                </View>
              </View>
            </ScrollView>
          </View>

          {/* Trust Section */}
          <View style={styles.trustSection}>
            <Text style={styles.trustTitle}>Built on Trust, Growing with You</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <View style={styles.statIcon}>
                  <Ionicons name="people-outline" size={24} color="#3CAAFD" />
                </View>
                <Text style={styles.statNumber}>10K+</Text>
                <Text style={styles.statLabel}>Users exploring services</Text>
              </View>
              <View style={styles.statItem}>
                <View style={styles.statIcon}>
                  <Ionicons name="star-outline" size={24} color="#FFD541" />
                </View>
                <Text style={styles.statNumber}>1K+</Text>
                <Text style={styles.statLabel}>Verified Affiliates and Ambassadors</Text>
              </View>
              <View style={styles.statItem}>
                <View style={styles.statIcon}>
                  <Ionicons name="shield-checkmark-outline" size={24} color="#28a745" />
                </View>
                <Text style={styles.statNumber}>20+</Text>
                <Text style={styles.statLabel}>Trusted Financial Partners</Text>
              </View>
            </View>
          </View>

        </ScrollView>
      </LinearGradient>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavigation}>
        <View style={styles.bottomNavBar}>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="home" size={24} color="#1A1B20" />
            <Text style={styles.navText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="card-outline" size={24} color="#7D7D7D" />
            <Text style={styles.navTextInactive}>Credits</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItemCenter}>
            <View style={styles.addButton}>
              <Ionicons name="add" size={24} color="#FBFBFB" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="person-outline" size={24} color="#7D7D7D" />
            <Text style={styles.navTextInactive}>My Referral</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="person-outline" size={24} color="#7D7D7D" />
            <Text style={styles.navTextInactive}>Profile</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.homeIndicator}>
          <View style={styles.homeIndicatorLine} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6FE',
    position: 'relative',
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 23,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  time: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FBFBFB',
    fontFamily: 'Rubik',
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  signalIcon: {
    width: 18,
    height: 10,
    backgroundColor: '#FBFBFB',
  },
  batteryIcon: {
    width: 25,
    height: 13,
    backgroundColor: '#FBFBFB',
    borderRadius: 2,
  },
  headerGradient: {
    height: 100,
    paddingTop: 54,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FBFBFB',
    fontFamily: 'Rubik',
  },
  profileButton: {
    position: 'relative',
  },
  profileIcon: {
    width: 31,
    height: 31,
    backgroundColor: '#7830E2',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    backgroundColor: '#EE5855',
    borderRadius: 4,
  },
  mainContainer: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  searchContainer: {
    marginBottom: 14,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FBFBFB',
    borderRadius: 10,
    paddingHorizontal: 11,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    shadowColor: '#8F31F9',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    color: '#1A1B20',
    fontFamily: 'Rubik',
  },
  filterScrollView: {
    marginBottom: 14,
  },
  filterContainer: {
    paddingHorizontal: 0,
    gap: 10,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 6,
    shadowColor: '#8F31F9',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  filterButtonActive: {
    backgroundColor: '#FFFFFF',
  },
  filterText: {
    fontSize: 14,
    color: '#F6F6FE',
    fontWeight: '400',
    fontFamily: 'Rubik',
  },
  filterTextActive: {
    color: '#8F31F9',
  },
  promoScrollView: {
    marginBottom: 20,
  },
  promoContainer: {
    paddingHorizontal: 0,
    gap: 10,
  },
  promoCard: {
    width: 335,
    height: 159,
    borderRadius: 20,
    padding: 12,
    position: 'relative',
  },
  popularBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 100,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  popularText: {
    fontSize: 11,
    color: '#FBFBFB',
    fontWeight: '400',
    fontFamily: 'Rubik',
  },
  promoContent: {
    flex: 1,
    maxWidth: '60%',
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FBFBFB',
    marginBottom: 4,
    fontFamily: 'Rubik',
  },
  promoDescription: {
    fontSize: 12,
    color: '#F6F6FE',
    marginBottom: 16,
    lineHeight: 14,
    fontFamily: 'Rubik',
  },
  startButton: {
    backgroundColor: '#FBFBFB',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  startButtonText: {
    fontSize: 12,
    color: '#8F31F9',
    fontWeight: '600',
    fontFamily: 'Rubik',
  },
  pageIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    marginTop: 10,
  },
  activeIndicator: {
    width: 16,
    height: 3,
    backgroundColor: '#FBFBFB',
    borderRadius: 10,
  },
  inactiveIndicator: {
    width: 3,
    height: 3,
    backgroundColor: '#FBFBFB',
    borderRadius: 10,
    opacity: 0.5,
  },
  contentSection: {
    flex: 1,
    paddingTop: 30,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  categorySection: {
    backgroundColor: '#C9EBE9',
    borderRadius: 10,
    padding: 14,
    marginBottom: 30,
    position: 'relative',
    shadowColor: '#8F31F9',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  categoryHeader: {
    position: 'absolute',
    right: 14,
    top: 14,
    flexDirection: 'row',
    gap: 10,
  },
  upArrow: {
    backgroundColor: '#1D8C7C',
    borderRadius: 24,
    padding: 8,
  },
  forwardArrow: {
    padding: 8,
  },
  categoryContent: {
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1A1B20',
    marginBottom: 4,
    fontFamily: 'Rubik',
  },
  categoryDescription: {
    fontSize: 12,
    color: '#7D7D7D',
    lineHeight: 14,
    fontFamily: 'Rubik',
  },
  subcategoryScrollView: {
    marginHorizontal: -14,
  },
  subcategoryGrid: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    gap: 12,
  },
  investmentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 14,
    gap: 12,
  },
  subcategoryItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    width: 95,
    height: 99,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    shadowColor: '#8F31F9',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  subcategoryText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#1A1B20',
    textAlign: 'center',
    fontFamily: 'Rubik',
  },
  subcategoryIcon: {
    width: 60,
    height: 60,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
  },
  taxSection: {
    backgroundColor: '#FBFBFB',
    borderRadius: 10,
    padding: 17,
    marginBottom: 30,
    minHeight: 85,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#8F31F9',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  taxUpArrow: {
    position: 'absolute',
    right: 17,
    top: 17,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 8,
  },
  taxIcon: {
    width: 68,
    height: 68,
    backgroundColor: '#8F31F9',
    borderRadius: 8,
    marginRight: 16,
  },
  taxContent: {
    flex: 1,
  },
  taxTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1A1B20',
    marginBottom: 4,
    fontFamily: 'Rubik',
  },
  taxDescription: {
    fontSize: 12,
    color: '#7D7D7D',
    lineHeight: 14,
    fontFamily: 'Rubik',
  },
  investmentsSection: {
    backgroundColor: '#FEE9CF',
    borderRadius: 10,
    padding: 14,
    marginBottom: 30,
    position: 'relative',
    shadowColor: '#8F31F9',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  travelSection: {
    backgroundColor: '#8F31F9',
    borderRadius: 10,
    padding: 12,
    marginBottom: 30,
    minHeight: 263,
    position: 'relative',
    shadowColor: '#8F31F9',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  travelContent: {
    marginBottom: 20,
  },
  travelTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 4,
    fontFamily: 'Rubik',
  },
  travelDescription: {
    fontSize: 12,
    color: '#FFFFFF',
    lineHeight: 14,
    fontFamily: 'Rubik',
  },
  travelCards: {
    flexDirection: 'row',
    gap: 12,
  },
  travelCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 12,
    width: 146,
    height: 160,
    position: 'relative',
    justifyContent: 'flex-end',
    shadowColor: '#8F31F9',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  travelCardArrow: {
    position: 'absolute',
    right: 12,
    top: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 6,
  },
  travelCardText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '500',
    textAlign: 'center',
    fontFamily: 'Rubik',
  },
  loansSection: {
    backgroundColor: '#F6DCDD',
    borderRadius: 10,
    padding: 14,
    marginBottom: 30,
    position: 'relative',
    shadowColor: '#8F31F9',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  trustSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    marginBottom: 50,
    alignItems: 'center',
    shadowColor: '#8F31F9',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  trustTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1A1B20',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Rubik',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '500',
    color: '#1A1B20',
    marginBottom: 4,
    fontFamily: 'Rubik',
  },
  statLabel: {
    fontSize: 10,
    color: '#7D7D7D',
    textAlign: 'center',
    paddingHorizontal: 8,
    fontFamily: 'Rubik',
  },
  bottomNavigation: {
    backgroundColor: '#FBFBFB',
    shadowColor: '#8F31F9',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  homeIndicator: {
    height: 30,
    backgroundColor: '#FBFBFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeIndicatorLine: {
    width: 135,
    height: 5,
    backgroundColor: '#1A1B20',
    borderRadius: 100,
  },
  bottomNavBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 20,
    backgroundColor: '#FBFBFB',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  navItemCenter: {
    flex: 1,
    alignItems: 'center',
  },
  addButton: {
    width: 52,
    height: 52,
    backgroundColor: '#8F31F9',
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8F31F9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  navText: {
    fontSize: 12,
    color: '#1A1B20',
    fontFamily: 'Rubik',
  },
  navTextInactive: {
    fontSize: 12,
    color: '#7D7D7D',
    fontFamily: 'Rubik',
  },
});

export default HomeScreen;