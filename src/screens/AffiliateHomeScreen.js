import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Image,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const AffiliateHomeScreen = () => {
  const navigation = useNavigation();
  const [currentSlide, setCurrentSlide] = useState(0);

  const affiliates = [
    { id: 1, name: 'Dhananjaya J', referrals: 12, earnings: '₹2,400' },
    { id: 2, name: 'Priya S', referrals: 8, earnings: '₹1,600' },
    { id: 3, name: 'Rahul M', referrals: 15, earnings: '₹3,000' },
    { id: 4, name: 'Anjali K', referrals: 6, earnings: '₹1,200' },
  ];

  const heroCards = [
    {
      id: 1,
      title: 'Earn While You Refer',
      subtitle: 'Share services you trust and get paid for every referral',
      buttonText: 'Start Now',
      backgroundColor: ['#4CAF50', '#66BB6A'],
      badge: 'Popular'
    },
    {
      id: 2,
      title: 'Invest Smart Today',
      subtitle: 'Discover investment opportunities and grow your wealth',
      buttonText: 'Explore',
      backgroundColor: ['#9D4BFA', '#AF6CFA'],
      badge: 'Trending'
    },
    {
      id: 3,
      title: 'Secure Your Future',
      subtitle: 'Get the best insurance plans for complete protection',
      buttonText: 'Get Started',
      backgroundColor: ['#F6AC11', '#FFB84D'],
      badge: 'Featured'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8638EE" />
      
      {/* Header */}
      <LinearGradient
        colors={['#8638EE', '#9553F5', '#8D30FC']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/Icons/tree.png')}
              style={styles.treeIcon}
            />
            <Image
              source={require('../../assets/Icons/drwise_text-removebg-preview.png')}
              style={styles.brandTextImage}
            />
          </View>
          <TouchableOpacity style={styles.notifBtn} activeOpacity={0.8}>
            <Ionicons name="notifications-outline" size={19} color="#FBFBFB" />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
              setCurrentSlide(slideIndex);
            }}
          >
            {heroCards.map((card, index) => (
              <View key={card.id} style={styles.heroCard}>
                <LinearGradient
                  colors={card.backgroundColor}
                  style={styles.heroGradient}
                >
                  <View style={styles.heroContent}>
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularText}>{card.badge}</Text>
                    </View>
                    <Text style={styles.heroTitle}>{card.title}</Text>
                    <Text style={styles.heroSubtitle}>{card.subtitle}</Text>
                    <TouchableOpacity style={styles.startButton}>
                      <Text style={styles.startButtonText}>{card.buttonText}</Text>
                    </TouchableOpacity>
                  </View>
                  <Image
                    source={require('../../assets/background_image.png')}
                    style={styles.heroImage}
                  />
                </LinearGradient>
              </View>
            ))}
          </ScrollView>
          
          {/* Page Dots */}
          <View style={styles.pageDots}>
            {heroCards.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.pageDot,
                  currentSlide === index && styles.pageDotActive
                ]}
              />
            ))}
          </View>
        </View>

        {/* Your Affiliates Section */}
        <View style={styles.affiliatesSection}>
          <Text style={styles.sectionTitle}>Your Affiliates</Text>
          <Text style={styles.sectionSubtitle}>Manage and track your affiliate network</Text>
          
          <View style={styles.affiliatesList}>
            {affiliates.map((affiliate) => (
              <TouchableOpacity 
                key={affiliate.id} 
                style={styles.affiliateItem}
                onPress={() => navigation.navigate('Leads', { affiliateName: affiliate.name })}
              >
                <View style={styles.affiliateAvatar}>
                  <Ionicons name="person" size={24} color="#8F31F9" />
                </View>
                <View style={styles.affiliateInfo}>
                  <Text style={styles.affiliateName}>{affiliate.name}</Text>
                  <Text style={styles.affiliateStats}>
                    {affiliate.referrals} referrals • {affiliate.earnings}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#7D7D7D" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <View style={styles.fabIcon}>
          <Ionicons name="add" size={24} color="#FBFBFB" />
        </View>
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <View style={styles.navItem}>
          <Ionicons name="home" size={24} color="#8F31F9" />
          <Text style={[styles.navText, { color: '#8F31F9' }]}>Home</Text>
        </View>
        <View style={styles.navItem}>
          <Ionicons name="card" size={24} color="#7D7D7D" />
          <Text style={styles.navText}>Credits</Text>
        </View>
        <View style={styles.navItem}>
          <View style={styles.plusButton}>
            <Ionicons name="add" size={24} color="#FBFBFB" />
          </View>
        </View>
        <View style={styles.navItem}>
          <Ionicons name="people" size={24} color="#7D7D7D" />
          <Text style={styles.navText}>My Referral</Text>
        </View>
        <View style={styles.navItem}>
          <Ionicons name="person" size={24} color="#7D7D7D" />
          <Text style={styles.navText}>Profile</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6FE',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 15,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  treeIcon: {
    width: 49,
    height: 47,
    resizeMode: 'contain',
    marginRight: 8,
  },
  brandTextImage: {
    width: 88,
    height: 29,
    resizeMode: 'contain',
  },
  notifBtn: {
    width: 31,
    height: 31,
    borderRadius: 4,
    backgroundColor: '#7830E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EE5855',
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    height: 200,
    marginBottom: 20,
  },
  heroCard: {
    width: width - 40,
    height: 180,
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  heroGradient: {
    flex: 1,
    flexDirection: 'row',
    padding: 20,
  },
  heroContent: {
    flex: 1,
    paddingRight: 20,
  },
  popularBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.20)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 100,
    alignSelf: 'flex-start',
  },
  popularText: {
    color: '#FBFBFB',
    fontSize: 11,
    fontWeight: '400',
  },
  heroTitle: {
    color: '#FBFBFB',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
  },
  heroSubtitle: {
    color: '#F6F6FE',
    fontSize: 12,
    fontWeight: '400',
    marginTop: 8,
    lineHeight: 16,
  },
  startButton: {
    backgroundColor: '#FBFBFB',
    paddingHorizontal: 30,
    paddingVertical: 5,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  startButtonText: {
    color: '#8F31F9',
    fontSize: 12,
    fontWeight: '600',
  },
  heroImage: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  pageDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    gap: 4,
  },
  pageDot: {
    width: 6,
    height: 6,
    borderRadius: 10,
    backgroundColor: '#FBFBFB',
    opacity: 0.5,
  },
  pageDotActive: {
    width: 20,
    opacity: 1,
  },
  affiliatesSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1B20',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#7D7D7D',
    marginBottom: 20,
  },
  affiliatesList: {
    gap: 12,
  },
  affiliateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#8F31F9',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  affiliateAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0E2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  affiliateInfo: {
    flex: 1,
  },
  affiliateName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1B20',
    marginBottom: 4,
  },
  affiliateStats: {
    fontSize: 14,
    color: '#7D7D7D',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 120,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#8F31F9',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8F31F9',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FBFBFB',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    shadowColor: '#8F31F9',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  navItem: {
    alignItems: 'center',
    gap: 6,
  },
  navText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#7D7D7D',
  },
  plusButton: {
    backgroundColor: '#8F31F9',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8F31F9',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
});

export default AffiliateHomeScreen;
