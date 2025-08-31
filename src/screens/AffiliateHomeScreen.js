import React, { useRef, useState, useEffect } from 'react';
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
  FlatList,
  Easing,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, type } from '../theme/tokens';
import BottomBar from '../components/BottomBar';
import CategoryModal from '../components/CategoryModal';
import { getAffiliates } from '../api/affiliate';
import { useAuth } from '../context/AuthContext';

const { width: W } = Dimensions.get('window');
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

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
    title: 'Earn While You Refer',
    subtitle: 'Share services you trust and\nget paid for every referral',
    buttonText: 'Start Now',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/5ee1f76dd94b467d35cd958b74224a628b637374?width=284',
    badge: 'Popular'
  },
  {
    id: 3,
    backgroundColor: ['#F6AC11', '#FFB84D'],
    title: 'Earn While You Refer',
    subtitle: 'Share services you trust and\nget paid for every referral',
    buttonText: 'Start Now',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/5ee1f76dd94b467d35cd958b74224a628b637374?width=284',
    badge: 'Popular'
  }
];

// Affiliates data
const affiliatesData = [
  { id: 1, name: 'Suhas', phone: '9736377448', date: '25-03-2025' },
  { id: 2, name: 'Punith', phone: '9736377448', date: '25-03-2025' },
  { id: 3, name: 'Murali', phone: '9736377448', date: '25-03-2025' },
  { id: 4, name: 'Satish', phone: '9736377448', date: '25-03-2025' },
  { id: 5, name: 'Dhananjaya', phone: '9736377448', date: '25-03-2025' },
];

const AffiliateHomeScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [affiliates, setAffiliates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;
  const sliderRef = useRef(null);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const onSliderViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentSlide(viewableItems[0].index);
    }
  }).current;

  // Fetch affiliates data
  const fetchAffiliates = async () => {
    try {
      setLoading(true);
      const response = await getAffiliates();
      if (response.data && response.data.affiliates) {
        setAffiliates(response.data.affiliates);
      }
    } catch (error) {
      console.error('Error fetching affiliates:', error);
      Alert.alert('Error', 'Failed to load affiliates data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Handle refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAffiliates();
  };

  useEffect(() => {
    fetchAffiliates();
  }, []);

  const renderSliderCard = ({ item, index }) => (
    <View style={styles.heroCard}>
      <LinearGradient
        colors={item.backgroundColor}
        style={styles.heroGradient}
      >
        <Image 
          source={require('../../assets/Icons/vectorForHero.png')}
          style={styles.heroBackgroundVector}
        />
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

  const renderAffiliateItem = (affiliate, index) => (
    <TouchableOpacity
      key={affiliate._id || affiliate.id}
      style={styles.affiliateItem}
      onPress={() => navigation.navigate('Leads', {
        affiliateId: affiliate._id || affiliate.id,
        affiliateName: affiliate.name
      })}
      activeOpacity={0.7}
    >
      <View style={styles.affiliateContent}>
        <View style={styles.affiliateAvatar}>
          <Image
            source={require('../../assets/Icons/profile-avatar.png')}
            style={styles.avatarImage}
            resizeMode="contain"
          />
        </View>
        <View style={styles.affiliateInfo}>
          <Text style={styles.affiliateName}>{affiliate.name}</Text>
          <Text style={styles.affiliatePhone}>{affiliate.phoneNumber || affiliate.phone || 'N/A'}</Text>
        </View>
        <View style={styles.affiliateRight}>
          <Text style={styles.affiliateDate}>
            {affiliate.createdAt ? new Date(affiliate.createdAt).toLocaleDateString() : 'N/A'}
          </Text>
          <Ionicons name="chevron-forward" size={16} color="#1A1B20" />
        </View>
      </View>
      {index < affiliates.length - 1 && <View style={styles.separator} />}
    </TouchableOpacity>
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
        {/* Header Section with Hero Slider Only */}
        <LinearGradient
          colors={['#8638EE', '#9553F5', '#8D30FC']}
          style={styles.headerSection}
        >
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

        {/* Your Affiliates Section */}
        <View style={styles.affiliatesSection}>
          <Text style={styles.affiliatesTitle}>Your Affiliates</Text>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#8F31F9" />
              <Text style={styles.loadingText}>Loading affiliates...</Text>
            </View>
          ) : affiliates.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No affiliates found</Text>
            </View>
          ) : (
            <View style={styles.affiliatesList}>
              {affiliates.map((a, i) => renderAffiliateItem(a, i))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFBFB',
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
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
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
    justifyContent: 'flex-start',
  },
  treeIcon: {
    width: 49,
    height: 47,
    resizeMode: 'contain',
    marginRight: 1,
  },
  brandTextImage: {
    width: 88,
    height: 29,
    resizeMode: 'contain',
    marginTop: 20,
  },
  notifBtn: {
    width: 31,
    height: 31,
    marginTop: 15,
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
  heroSliderContainer: {
    height: 220,
    marginTop: 5,
    marginBottom: 10,
    paddingTop: 0,
  },
  sliderContent: {
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  heroCard: {
    marginHorizontal: 8,
    borderRadius: 20,
    overflow: 'hidden',
    height: 200,
    width: W - 50,
  },
  heroGradient: {
    flex: 1,
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 20,
  },
  heroContent: {
    flex: 1,
    paddingRight: 10,
    justifyContent: 'space-between',
    paddingBottom: 10,
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
    fontFamily: 'Rubik-Regular',
  },
  heroTitle: {
    color: '#FBFBFB',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    fontFamily: 'Rubik-SemiBold',
  },
  heroSubtitle: {
    color: '#F6F6FE',
    fontSize: 12,
    fontWeight: '400',
    marginTop: 8,
    lineHeight: 16,
    fontFamily: 'Rubik-Regular',
  },
  startButton: {
    backgroundColor: '#FBFBFB',
    paddingHorizontal: 30,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  startButtonText: {
    color: '#8F31F9',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Rubik-SemiBold',
  },
  heroImage: {
    width: 160,
    height: 180,
    position: 'absolute',
    right: 5,
    bottom: 0,
  },
  heroBackgroundVector: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '115%',
    height: '100%',
    opacity: 1,
    resizeMode: 'cover',
    tintColor: 'rgba(255, 255, 255, 1 )',
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
  // Your Affiliates Section Styles
  affiliatesSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  affiliatesTitle: {
    fontSize: 24,
    fontWeight: '500',
    lineHeight: 28,
    color: '#1A1B20',
    fontFamily: 'Rubik',
    marginBottom: 20,
  },
  affiliatesList: {
    width: '100%',
  },
  affiliateItem: {
    width: '100%',
    height: 67,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(125, 125, 125, 0.1)',
  },
  affiliateContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  affiliateAvatar: {
    width: 46,
    height: 46,
    borderRadius: 8,
    backgroundColor: 'rgba(150, 61, 251, 0.0)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarImage: {
    width: 46,
    height: 46,
    resizeMode: 'contain',
  },
  affiliateInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  affiliateName: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 19,
    color: '#1A1B20',
    fontFamily: 'Rubik',
    marginBottom: 2,
  },
  affiliatePhone: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 14,
    letterSpacing: 0.2,
    color: '#7D7D7D',
    fontFamily: 'Rubik',
  },
  affiliateRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  affiliateDate: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 14,
    color: '#1A1B20',
    fontFamily: 'Rubik',
    textAlign: 'right',
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(125, 125, 125, 0.1)',
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#7D7D7D',
    fontFamily: 'Rubik-Regular',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#7D7D7D',
    fontFamily: 'Rubik-Regular',
  },
});

export default AffiliateHomeScreen;
