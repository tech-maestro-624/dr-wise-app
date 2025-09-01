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
  Alert,
  RefreshControl
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, type } from '../theme/tokens';
import BottomBar from '../components/BottomBar';
import CategoryModal from '../components/CategoryModal';
import { getAffiliates } from '../api/affiliate';
import { getUsers } from '../api/user';
import { getUserData } from '../api/auth';
import { getconfig } from '../api/configuration';
import { useAuth } from '../context/AuthContext';

const { width: W } = Dimensions.get('window');
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

// AutoSwiper Component - Same as drwise-user
const AutoSwiper = ({ images }) => {
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const windowWidth = Dimensions.get('window').width;
  // Add margins for better visual spacing
  const marginHorizontal = 20; // 20px margin on each side
  const containerWidth = windowWidth - (marginHorizontal * 2);
  // Banner width should match container exactly for perfect snapping
  const bannerWidth = containerWidth;

  useEffect(() => {
    const timer = setInterval(() => {
      let nextIndex = currentIndex + 1;
      if (nextIndex >= images.length) {
        nextIndex = 0;
      }
      setCurrentIndex(nextIndex);
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ x: nextIndex * bannerWidth, animated: true });
      }
    }, 5000);

    // Store timer reference for cleanup
    if (scrollRef.current) {
      scrollRef.current.autoScrollTimer = timer;
    }

    return () => {
      clearInterval(timer);
      if (scrollRef.current && scrollRef.current.autoScrollTimer) {
        clearInterval(scrollRef.current.autoScrollTimer);
      }
    };
  }, [currentIndex, images.length, bannerWidth]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scrollRef.current && scrollRef.current.autoScrollTimer) {
        clearInterval(scrollRef.current.autoScrollTimer);
      }
    };
  }, []);

  if (images.length === 0) return null;

  return (
    <View style={{ marginBottom: 20 }}>
      <View style={{ height: 240, width: containerWidth, marginHorizontal: marginHorizontal }}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{}}
          decelerationRate="fast"
          snapToInterval={bannerWidth}
          snapToAlignment="start"
          onMomentumScrollEnd={(event) => {
            const slideSize = bannerWidth;
            const slideIndex = Math.round(event.nativeEvent.contentOffset.x / slideSize);
            setCurrentIndex(Math.min(Math.max(slideIndex, 0), images.length - 1));
          }}
          onScrollBeginDrag={() => {
            // Pause auto-scroll when user starts dragging
            if (scrollRef.current) {
              clearInterval(scrollRef.current.autoScrollTimer);
            }
          }}
          onScrollEndDrag={() => {
            // Resume auto-scroll after user stops dragging
            const timer = setInterval(() => {
              let nextIndex = currentIndex + 1;
              if (nextIndex >= images.length) {
                nextIndex = 0;
              }
              setCurrentIndex(nextIndex);
              if (scrollRef.current) {
                scrollRef.current.scrollTo({ x: nextIndex * bannerWidth, animated: true });
              }
            }, 5000);
            if (scrollRef.current) {
              scrollRef.current.autoScrollTimer = timer;
            }
          }}
        >
          {images.map((img, index) => (
            <View
              key={index}
              style={{
                width: bannerWidth, // Exact banner width for perfect fit
                height: 240,
                borderRadius: 20,
                overflow: 'hidden',
              }}
            >
              <Image source={{ uri: img }} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Slide Indicator Dots */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
        marginBottom: 10,
      }}>
        {images.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              setCurrentIndex(index);
              if (scrollRef.current) {
                scrollRef.current.scrollTo({ x: index * bannerWidth, animated: true });
              }
            }}
            style={{
              width: index === currentIndex ? 24 : 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: index === currentIndex ? '#FFFFFF' : '#FFFFFF80',
              marginHorizontal: 4,
              shadowColor: index === currentIndex ? '#FFFFFF' : 'transparent',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: index === currentIndex ? 0.5 : 0,
              shadowRadius: 6,
              elevation: index === currentIndex ? 4 : 0,
            }}
          />
        ))}
      </View>
    </View>
  );
};

const AffiliateHomeScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [affiliates, setAffiliates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [featuredImages, setFeaturedImages] = useState([]);
  const [ambassadorRoleId, setAmbassadorRoleId] = useState('');

  const scrollY = useRef(new Animated.Value(0)).current;

  // Fetch user data and affiliates
  const fetchUserData = async (page = 1) => {
    try {
      setLoading(true);
      const response = await getUserData();
      const userData = response.data.user;
      setUserName(userData.name);
      
      if (userData.image) {
        if (userData.image.startsWith('data:')) {
          setProfileImage(userData.image);
        } else {
          const imageUri = `data:image/jpeg;base64,${userData.image}`;
          setProfileImage(imageUri);
        }
      } else {
        setProfileImage(null);
      }

      const affiliatesResponse = await getUsers({
        condition: { ambassadorId: userData._id },
        page: page,
        limit: 10,
      });
      
      if (affiliatesResponse.data && affiliatesResponse.data.data) {
        setAffiliates(affiliatesResponse.data.data);
        setTotalPages(affiliatesResponse.data.totalPages);
        setCurrentPage(affiliatesResponse.data.currentPage);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', error?.response?.data?.message || error.message || 'Failed to load user data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Handle refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserData(currentPage);
  };

  // Handle pagination
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // ------------------------------------------------------------------
  // Fetch config
  const fetchConfig = async () => {
    try {
      const response = await getconfig();
      const configData = response.data;

      const ambassadorRoleConfig = configData.find(
        (item) => item.key === 'AMBASSADOR_ROLE_ID'
      );
      if (ambassadorRoleConfig) {
        setAmbassadorRoleId(ambassadorRoleConfig.value);
      }

      const featuredImagesConfig = configData.find(
        (item) => item.key === 'FEATURED_IMAGES'
      );
      if (featuredImagesConfig) {
        setFeaturedImages(featuredImagesConfig.value || []);
      }
    } catch (error) {
      console.error('Error fetching config:', error);
    }
  };

  useEffect(() => {
    fetchUserData(currentPage);
  }, [currentPage]);

  // Load config on component mount
  useEffect(() => {
    fetchConfig();
  }, []);

  // ------------------------------------------------------------------
  // Render swiper using the AutoSwiper component
  const renderSwiper = () => {
    return <AutoSwiper images={featuredImages} />;
  };

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
          {affiliate.image ? (
            <Image
              source={{ 
                uri: affiliate.image.startsWith('data:') 
                  ? affiliate.image 
                  : `data:image/jpeg;base64,${affiliate.image}` 
              }}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          ) : (
            <Image
              source={require('../../assets/Icons/profile-avatar.png')}
              style={styles.avatarImage}
              resizeMode="contain"
            />
          )}
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#8F31F9']}
            tintColor="#8F31F9"
          />
        }
      >
        {/* Header Section with AutoSwiper */}
        <LinearGradient
          colors={['#8638EE', '#9553F5', '#8D30FC']}
          style={styles.headerSection}
        >
          {/* Featured Images Swiper */}
          {renderSwiper()}
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <View style={styles.paginationContainer}>
              <TouchableOpacity
                style={[styles.paginationButton, currentPage === 1 && styles.paginationButtonDisabled]}
                onPress={handlePrevPage}
                disabled={currentPage === 1}
              >
                <Ionicons 
                  name="chevron-back" 
                  size={24} 
                  color={currentPage === 1 ? '#cccccc' : '#000000'} 
                />
              </TouchableOpacity>
              
              <Text style={styles.paginationText}>
                Page {currentPage} of {totalPages}
              </Text>
              
              <TouchableOpacity
                style={[styles.paginationButton, currentPage === totalPages && styles.paginationButtonDisabled]}
                onPress={handleNextPage}
                disabled={currentPage === totalPages}
              >
                <Ionicons 
                  name="chevron-forward" 
                  size={24} 
                  color={currentPage === totalPages ? '#cccccc' : '#000000'} 
                />
              </TouchableOpacity>
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
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
    gap: 20,
  },
  paginationButton: {
    padding: 10,
    backgroundColor: 'rgba(150, 61, 251, 0.1)',
    borderRadius: 8,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paginationButtonDisabled: {
    opacity: 0.5,
    backgroundColor: 'rgba(150, 61, 251, 0.05)',
  },
  paginationText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1B20',
    fontFamily: 'Rubik',
  },
});

export default AffiliateHomeScreen;
