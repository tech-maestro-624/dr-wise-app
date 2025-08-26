import React, { useRef, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar, 
  TextInput, 
  Dimensions, 
  Image, 
  Animated, 
  Platform,
  FlatList 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, radii, type } from '../theme/tokens';
import BottomBar from '../components/BottomBar';

const { width: W } = Dimensions.get('window');

const filters = [
  { id: 'all', label: 'All', icon: 'checkmark-circle', active: true },
  { id: 'ins', label: 'Insurances', icon: 'shield-checkmark', active: false },
  { id: 'inv', label: 'Investments', icon: 'trending-up', active: false },
  { id: 'loans', label: 'Loans', icon: 'card', active: false },
  { id: 'tax', label: 'Tax', icon: 'receipt', active: false },
  { id: 'travel', label: 'Travel', icon: 'airplane', active: false },
];

const insuranceItems = [
  { title: 'Life', icon: '🏛️' },
  { title: 'Health', icon: '❤️' },
  { title: 'Motor', icon: '🚗' },
  { title: 'General', icon: '🛡️' },
];

const investmentItems = [
  { title: 'Trading' },
  { title: 'NPS' },
  { title: 'LAS' },
  { title: 'Gold' },
  { title: 'BOND' },
  { title: 'Fixed' },
  { title: 'Mutual Fund' },
];

const loanItems = [
  { title: 'Business Loan' },
  { title: 'Mortgage Loan' },
  { title: 'Personal Loans' },
  { title: 'Home Loan' },
];

// Slider cards data
const sliderCards = [
  {
    id: 1,
    backgroundColor: ['#4CAF50', '#66BB6A'],
    title: 'Earn While You Refer',
    subtitle: 'Share services you trust and\nget paid for every referral',
    buttonText: 'Start Now',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/5ee1f76dd94b467d35cd958b74224a628b637374?width=284',
    badge: 'Popular'
  },
  {
    id: 2,
    backgroundColor: ['#9D4BFA', '#AF6CFA'],
    title: 'Invest Smart Today',
    subtitle: 'Discover investment opportunities\nand grow your wealth',
    buttonText: 'Explore',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/5ee1f76dd94b467d35cd958b74224a628b637374?width=284',
    badge: 'Trending'
  },
  {
    id: 3,
    backgroundColor: ['#F6AC11', '#FFB84D'],
    title: 'Secure Your Future',
    subtitle: 'Get the best insurance plans\nfor complete protection',
    buttonText: 'Get Started',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/5ee1f76dd94b467d35cd958b74224a628b637374?width=284',
    badge: 'Featured'
  }
];

const HomeScreen = () => {
  const navigation = useNavigation();
  const [active, setActive] = useState('all');
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollY = useRef(new Animated.Value(0)).current;
  const sliderRef = useRef(null);

  const onSliderViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentSlide(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderSliderCard = ({ item, index }) => (
    <View style={styles.heroCard}>
      <LinearGradient
        colors={item.backgroundColor}
        style={styles.heroGradient}
      >
        <View style={styles.heroContent}>
          <View style={styles.popularBadge}>
            <Text style={styles.popularText}>{item.badge}</Text>
          </View>
          <Text style={styles.heroTitle}>{item.title}</Text>
          <Text style={styles.heroSubtitle}>{item.subtitle}</Text>
          <TouchableOpacity style={styles.startButton}>
            <Text style={styles.startButtonText}>{item.buttonText}</Text>
          </TouchableOpacity>
        </View>
        <Image 
          source={{ uri: item.image }}
          style={styles.heroImage}
        />
      </LinearGradient>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8638EE" />
      
      {/* Simple Sticky Brand Row Only */}
      <LinearGradient
        colors={['#8638EE', '#9553F5', '#8D30FC']}
        style={styles.stickyBrand}
      >
        <View style={styles.brandRow}>
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
      
      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Header Section with Search and Filters */}
        <LinearGradient
          colors={['#8638EE', '#9553F5', '#8D30FC']}
          style={styles.headerSection}
        >
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={22} color="#1A1B20" />
            <TextInput 
              placeholder="Search.." 
              placeholderTextColor="#7D7D7D" 
              style={styles.searchInput} 
            />
          </View>

          {/* Filter Tabs */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filterContainer}
            contentContainerStyle={styles.filterContent}
          >
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterTab,
                  filter.active ? styles.filterTabActive : styles.filterTabInactive
                ]}
                onPress={() => setActive(filter.id)}
              >
                <Ionicons 
                  name={filter.icon} 
                  size={15} 
                  color={filter.active ? '#8F31F9' : '#F6F6FE'} 
                />
                <Text style={[
                  styles.filterText,
                  { color: filter.active ? '#8F31F9' : '#F6F6FE' }
                ]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Hero Referral Cards Slider */}
          <View style={styles.heroSliderContainer}>
            <FlatList
              ref={sliderRef}
              data={sliderCards}
              renderItem={renderSliderCard}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              pagingEnabled={false}
              showsHorizontalScrollIndicator={false}
              onViewableItemsChanged={onSliderViewableItemsChanged}
              viewabilityConfig={viewabilityConfig}
              contentContainerStyle={styles.sliderContent}
              snapToInterval={W - 20}
              snapToAlignment="start"
              decelerationRate="fast"
              scrollEventThrottle={16}
              bounces={false}
            />
          </View>

          {/* Page Dots */}
          <View style={styles.pageDots}>
            {sliderCards.map((_, index) => (
              <View 
                key={index}
                style={[
                  styles.pageDot, 
                  currentSlide === index && styles.pageDotActive
                ]} 
              />
            ))}
          </View>
        </LinearGradient>

        {/* Content Sections */}
        <View style={styles.contentContainer}>
          {/* Insurance Section */}
          <View style={styles.sectionCard}>
            <LinearGradient
              colors={['#C9EBE9', '#C9EBE9']}
              style={styles.sectionGradient}
            >
              <View style={styles.sectionHeader}>
                <View style={styles.sectionInfo}>
                  <Text style={styles.sectionTitle}>Insurances</Text>
                  <Text style={styles.sectionSubtitle}>Explore insurance plans tailored to your needs.</Text>
                </View>
                <TouchableOpacity 
                  style={styles.sectionArrow}
                  onPress={() => navigation.navigate('Insurances')}
                >
                  <View style={styles.arrowCircle}>
                    <Ionicons name="arrow-up-outline" size={20} color="#1D8C7C" style={{ transform: [{ rotate: '45deg' }] }} />
                  </View>
                </TouchableOpacity>
              </View>
              
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.itemsContainer}
              >
                {insuranceItems.map((item, index) => (
                  <View key={index} style={styles.insuranceItem}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.itemIcon}>{item.icon}</Text>
                  </View>
                ))}
              </ScrollView>

              <View style={styles.itemDots}>
                <View style={[styles.itemDot, styles.itemDotActive]} />
                <View style={styles.itemDot} />
              </View>

              <TouchableOpacity style={styles.expandButton}>
                <Ionicons name="chevron-down-outline" size={16} color="#7D7D7D" />
              </TouchableOpacity>
            </LinearGradient>
          </View>

          {/* Investment Section */}
          <View style={styles.sectionCard}>
            <LinearGradient
              colors={['#FEE9CF', '#FEE9CF']}
              style={styles.sectionGradient}
            >
              <View style={styles.sectionHeader}>
                <View style={styles.sectionInfo}>
                  <Text style={styles.sectionTitle}>Investments</Text>
                  <Text style={styles.sectionSubtitle}>Explore top investment options and share them to earn with every new join.</Text>
                </View>
                <TouchableOpacity 
                  style={styles.sectionArrow}
                  onPress={() => navigation.navigate('Investments')}
                >
                  <View style={[styles.arrowCircle, { backgroundColor: '#F6AC11' }]}>
                    <Ionicons name="arrow-up-outline" size={20} color="#FFFFFF" style={{ transform: [{ rotate: '45deg' }] }} />
                  </View>
                </TouchableOpacity>
              </View>
              
              <View style={styles.investmentGrid}>
                {investmentItems.map((item, index) => (
                  <View key={index} style={styles.investmentItem}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                  </View>
                ))}
              </View>
            </LinearGradient>
          </View>

          {/* Loans Section */}
          <View style={styles.sectionCard}>
            <LinearGradient
              colors={['#F6DCDD', '#F6DCDD']}
              style={styles.sectionGradient}
            >
              <View style={styles.sectionHeader}>
                <View style={styles.sectionInfo}>
                  <Text style={styles.sectionTitle}>Loans</Text>
                  <Text style={styles.sectionSubtitle}>Select the right loan offers and share them to earn when someone applies.</Text>
                </View>
                <TouchableOpacity 
                  style={styles.sectionArrow}
                  onPress={() => navigation.navigate('Loans')}
                >
                  <View style={[styles.arrowCircle, { backgroundColor: '#A5236A' }]}>
                    <Ionicons name="arrow-up-outline" size={20} color="#FFFFFF" style={{ transform: [{ rotate: '45deg' }] }} />
                  </View>
                </TouchableOpacity>
              </View>
              
              <View style={styles.loansGrid}>
                {loanItems.map((item, index) => (
                  <View key={index} style={styles.loanItem}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                  </View>
                ))}
              </View>
            </LinearGradient>
          </View>

          {/* Tax Section */}
          <View style={styles.taxCard}>
            <Text style={styles.sectionTitle}>Tax</Text>
            <Text style={styles.sectionSubtitle}>Get expert help to file your taxes on time and save more.</Text>
          </View>

          {/* Travel Section */}
          <View style={styles.travelCard}>
            <Text style={styles.sectionTitle}>Travel</Text>
            <Text style={styles.sectionSubtitle}>Share the best travel deals and earn when someone books through your link.</Text>
            
            <View style={styles.travelOptions}>
              <View style={styles.travelOption}>
                <LinearGradient
                  colors={['#FBFBFB', '#F0E2FF']}
                  style={styles.travelOptionGradient}
                >
                  <Text style={styles.travelOptionTitle}>International Travel</Text>
                </LinearGradient>
              </View>
              <View style={styles.travelOption}>
                <LinearGradient
                  colors={['#FBFBFB', '#F0E2FF']}
                  style={styles.travelOptionGradient}
                >
                  <Text style={styles.travelOptionTitle}>Domestic Travel</Text>
                </LinearGradient>
              </View>
            </View>
          </View>

          {/* Statistics Section */}
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>Built on Trust, Growing with You</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>10K+</Text>
                <Text style={styles.statLabel}>Users exploring services</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>1K+</Text>
                <Text style={styles.statLabel}>Verified Affiliates and Ambassadors</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>20+</Text>
                <Text style={styles.statLabel}>Trusted Financial Partners</Text>
              </View>
            </View>
          </View>

          {/* Bottom Image */}
          <Image
            source={require('../../assets/Icons/homepage_bottom.png')}
            style={styles.bottomImage}
          />

          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <View style={styles.fabIcon}>
          <Ionicons name="apps" size={18} color="#FBFBFB" />
        </View>
      </TouchableOpacity>

      {/* <BottomBar /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6FE',
  },
  stickyBrand: {
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 15,
    zIndex: 1000,
    elevation: 5,
  },
  scrollView: {
    flex: 1,
  },
  headerSection: {
    paddingTop: 30,
    paddingBottom: 13,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 23,
    paddingTop: 11,
    height: 20,
  },
  statusTime: {
    color: '#FBFBFB',
    fontSize: 16,
    fontWeight: '600',
  },
  statusRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signalBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
  },
  bar: {
    width: 4,
    backgroundColor: '#FBFBFB',
    borderRadius: 1,
  },
  battery: {
    width: 27,
    height: 13,
    borderWidth: 1,
    borderColor: '#FBFBFB',
    borderRadius: 2,
    marginLeft: 5,
    padding: 1,
  },
  batteryFill: {
    flex: 1,
    backgroundColor: '#FBFBFB',
    borderRadius: 1,
  },
  brandRow: {
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FBFBFB',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFF',
    paddingHorizontal: 11,
    paddingVertical: 9,
    marginHorizontal: 20,
    marginBottom: 14,
    shadowColor: '#8F31F9',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 11,
    fontSize: 13,
    color: '#7D7D7D',
  },
  filterContainer: {
    marginBottom: 10,
  },
  filterContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    gap: 6,
  },
  filterTabActive: {
    backgroundColor: '#FFF',
    shadowColor: '#8F31F9',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  filterTabInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
    shadowColor: '#8F31F9',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 1,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '400',
  },
  heroSliderContainer: {
    height: 180,
    marginTop: 0,
    marginBottom: 20,
    paddingTop: 20,
  },
  sliderContent: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  heroCard: {
    marginHorizontal: 10,
    borderRadius: 20,
    overflow: 'hidden',
    height: 159,
    width: W - 60,
  },
  heroGradient: {
    flex: 1,
    flexDirection: 'row',
    padding: 12,
  },
  heroContent: {
    flex: 1,
    paddingRight: 10,
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
    width: 142,
    height: 161,
    position: 'absolute',
    right: 0,
    top: 0,
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
  contentContainer: {
    padding: 8,
    gap: 30,
  },
  sectionCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#8F31F9',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionGradient: {
    padding: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sectionInfo: {
    flex: 1,
  },
  sectionTitle: {
    color: '#1A1B20',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 4,
  },
  sectionSubtitle: {
    color: '#7D7D7D',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
  sectionArrow: {
    marginLeft: 10,
  },
  arrowCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1D8C7C',
    opacity: 0.3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemsContainer: {
    marginBottom: 16,
  },
  insuranceItem: {
    width: 95,
    height: 99,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFF',
    padding: 10,
    marginRight: 12,
    justifyContent: 'space-between',
    shadowColor: '#8F31F9',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  itemTitle: {
    color: '#1A1B20',
    fontSize: 10,
    fontWeight: '500',
  },
  itemIcon: {
    fontSize: 40,
    textAlign: 'center',
  },
  itemDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    gap: 4,
  },
  itemDot: {
    width: 4,
    height: 4,
    borderRadius: 10,
    backgroundColor: '#7D7D7D',
    opacity: 0.5,
  },
  itemDotActive: {
    width: 21,
    backgroundColor: '#1A1B20',
    opacity: 1,
  },
  expandButton: {
    alignSelf: 'center',
    padding: 8,
  },
  investmentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  investmentItem: {
    width: '31%',
    height: 99,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFF',
    padding: 10,
    shadowColor: '#8F31F9',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  loansGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  loanItem: {
    width: '47%',
    height: 99,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFF',
    padding: 10,
    shadowColor: '#8F31F9',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  taxCard: {
    backgroundColor: '#FBFBFB',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFF',
    padding: 18,
    shadowColor: '#8F31F9',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  travelCard: {
    backgroundColor: '#FBFBFB',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFF',
    padding: 12,
    shadowColor: '#8F31F9',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  travelOptions: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 20,
  },
  travelOption: {
    flex: 1,
    height: 160,
    borderRadius: 10,
    overflow: 'hidden',
  },
  travelOptionGradient: {
    flex: 1,
    padding: 12,
    justifyContent: 'flex-end',
  },
  travelOptionTitle: {
    color: '#1A1B20',
    fontSize: 18,
    fontWeight: '500',
  },
  statsCard: {
    backgroundColor: '#FBFBFB',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFF',
    padding: 20,
    shadowColor: '#8F31F9',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  statsTitle: {
    color: '#1A1B20',
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'left',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 27,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    color: '#1A1B20',
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 2,
  },
  statLabel: {
    color: '#7D7D7D',
    fontSize: 10,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 12,
  },
  bottomImage: {
    width: '100%',
    height: 312,
    resizeMode: 'contain',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 120,
    width: 40,
    height: 40,
    borderRadius: 20,
    shadowColor: '#1187FE',
    shadowOffset: { width: 0, height: 3.077 },
    shadowOpacity: 0.5,
    shadowRadius: 7.692,
    elevation: 8,
  },
  fabIcon: {
    flex: 1,
    backgroundColor: '#1187FE',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeScreen;
