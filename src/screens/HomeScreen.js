import React, { useRef, useState, useEffect, useCallback } from 'react';
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
  UIManager,
  LayoutAnimation,
  RefreshControl,
  Modal
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, type } from '../theme/tokens';
import BottomBar from '../components/BottomBar';
import CategoryModal from '../components/CategoryModal';
import Toast from 'react-native-toast-message';

// API calls
import { getUserData } from '../api/auth';
import { getconfig } from '../api/configuration';
import { getCategories } from '../api/categorys';
import { getSubCategories } from '../api/subCategories';
import { searchProducts } from '../api/product';

// Toast config
import toastConfig from '../toast/toastConfig';

const { width: W } = Dimensions.get('window');
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

// API data types (JavaScript objects)
// Category: { _id: string, name: string, description: string }
// SubCategory: { _id: string, name: string, description: string, image?: string, parentCategory?: object }

const filters = [
  { id: 'all', label: 'All', icon: 'checkmark-circle', active: true },
  { id: 'ins', label: 'Insurances', icon: 'shield-checkmark', active: false },
  { id: 'inv', label: 'Investments', icon: 'trending-up', active: false },
  { id: 'loans', label: 'Loans', icon: 'card', active: false },
  { id: 'tax', label: 'Tax', icon: 'receipt', active: false },
  { id: 'travel', label: 'Travel', icon: 'airplane', active: false },
];

const insuranceItems = [
  { title: 'Life' },
  { title: 'Health' },
  { title: 'Motor' },
  { title: 'General' },
  { title: 'Travel' },
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
              <Image source={{ uri: img }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
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

const HomeScreen = () => {
  const navigation = useNavigation();
  const [activeFilter, setActiveFilter] = useState('all');
  const [isInsuranceExpanded, setIsInsuranceExpanded] = useState(false);
  const [isInvestmentExpanded, setIsInvestmentExpanded] = useState(false);
  const [isLoansExpanded, setIsLoansExpanded] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategoryData, setSelectedSubCategoryData] = useState(null);
  const [selectedSubCategoryImage, setSelectedSubCategoryImage] = useState(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const searchTimeout = useRef(null);

  // Filter state and logic
  const handleFilterPress = (filterId) => {
    setActiveFilter(filterId);
    // Reset expansion states when switching filters
    setIsInsuranceExpanded(false);
    setIsInvestmentExpanded(false);
    setIsLoansExpanded(false);
  };

  // Dynamic filters based on active state
  const getFilters = () => [
    { id: 'all', label: 'All', icon: 'checkmark-circle', active: activeFilter === 'all' },
    { id: 'ins', label: 'Insurances', icon: 'shield-checkmark', active: activeFilter === 'ins' },
    { id: 'inv', label: 'Investments', icon: 'trending-up', active: activeFilter === 'inv' },
    { id: 'loans', label: 'Loans', icon: 'card', active: activeFilter === 'loans' },
    { id: 'tax', label: 'Tax', icon: 'receipt', active: activeFilter === 'tax' },
    { id: 'travel', label: 'Travel', icon: 'airplane', active: activeFilter === 'travel' },
  ];

  // Filter sections based on active filter
  const shouldShowSection = (sectionType) => {
    if (activeFilter === 'all') return true;
    return activeFilter === sectionType;
  };

  // Get filtered categories based on active filter
  const getFilteredCategories = () => {
    if (activeFilter === 'all') return categories;

    return categories.filter(category => {
      const categoryName = category.name.toLowerCase();
      switch (activeFilter) {
        case 'ins':
          return categoryName.includes('insurance');
        case 'inv':
          return categoryName.includes('investment');
        case 'loans':
          return categoryName.includes('loan');
        case 'tax':
          return categoryName.includes('tax');
        case 'travel':
          return categoryName.includes('travel');
        default:
          return true;
      }
    });
  };

  // API-related state
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // User Info
  const [userName, setUserName] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
  const [ambassadorRoleId, setAmbassadorRoleId] = useState('');
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);

  // Profile & Config
  const [profileImage, setProfileImage] = useState(null);
  const [featuredImages, setFeaturedImages] = useState([]);

  // Categories & Subcategories
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  // Bottom Sheet
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

  // Search functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  // Enable layout animations for iOS
  useEffect(() => {
    if (Platform.OS === 'ios') {
      UIManager.setLayoutAnimationEnabledExperimental && 
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);
  
  // Animation values for insurance items
  const generalAnimatedValue = useRef(new Animated.Value(0)).current;
  const travelAnimatedValue = useRef(new Animated.Value(0)).current;
  
  // Animation values for investment items (4th, 5th, 6th, 7th items)
  const goldAnimatedValue = useRef(new Animated.Value(0)).current;
  const bondAnimatedValue = useRef(new Animated.Value(0)).current;
  const fixedAnimatedValue = useRef(new Animated.Value(0)).current;
  const mutualFundAnimatedValue = useRef(new Animated.Value(0)).current;
  
  // Animation values for loan items (4th item only)
  const homeLoanAnimatedValue = useRef(new Animated.Value(0)).current;
  
  // Animation values for container heights
  const insuranceHeightAnimated = useRef(new Animated.Value(0)).current;
  const investmentHeightAnimated = useRef(new Animated.Value(0)).current;
  const loansHeightAnimated = useRef(new Animated.Value(0)).current;

  const toggleInsuranceExpansion = () => {
    // Configure layout animation for smoother transitions on iOS
    if (Platform.OS === 'ios') {
      LayoutAnimation.configureNext({
        duration: 600,
        create: {
          type: LayoutAnimation.Types.easeOut,
          property: LayoutAnimation.Properties.opacity,
        },
        update: {
          type: LayoutAnimation.Types.easeOut,
        },
      });
    }
    
    if (!isInsuranceExpanded) {
      // Expand animation
      setIsInsuranceExpanded(true);
      
      // Animate container height with platform-specific timing
      Animated.timing(insuranceHeightAnimated, {
        toValue: 1,
        duration: Platform.OS === 'ios' ? 650 : 600,
        easing: Platform.OS === 'ios' ? Easing.out(Easing.ease) : Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
      
      // Animate General item with improved iOS compatibility
      Animated.timing(generalAnimatedValue, {
        toValue: 1,
        duration: Platform.OS === 'ios' ? 650 : 600,
        easing: Platform.OS === 'ios' ? Easing.out(Easing.ease) : Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
      
      // Animate Travel item with platform-specific delay
      Animated.timing(travelAnimatedValue, {
        toValue: 1,
        duration: Platform.OS === 'ios' ? 650 : 600,
        delay: Platform.OS === 'ios' ? 75 : 50,
        easing: Platform.OS === 'ios' ? Easing.out(Easing.ease) : Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      // Collapse animation
      Animated.parallel([
        Animated.timing(insuranceHeightAnimated, {
          toValue: 0,
          duration: Platform.OS === 'ios' ? 450 : 400,
          easing: Platform.OS === 'ios' ? Easing.in(Easing.ease) : Easing.in(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.timing(generalAnimatedValue, {
          toValue: 0,
          duration: Platform.OS === 'ios' ? 450 : 400,
          easing: Platform.OS === 'ios' ? Easing.in(Easing.ease) : Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(travelAnimatedValue, {
          toValue: 0,
          duration: Platform.OS === 'ios' ? 450 : 400,
          delay: Platform.OS === 'ios' ? 75 : 50,
          easing: Platform.OS === 'ios' ? Easing.in(Easing.ease) : Easing.in(Easing.cubic),
          useNativeDriver: true,
        })
      ]).start(() => {
        setIsInsuranceExpanded(false);
      });
    }
  };

  const toggleInvestmentExpansion = () => {
    // Configure layout animation for iOS
    if (Platform.OS === 'ios') {
      LayoutAnimation.configureNext({
        duration: 700,
        create: {
          type: LayoutAnimation.Types.easeOut,
          property: LayoutAnimation.Properties.opacity,
        },
        update: {
          type: LayoutAnimation.Types.easeOut,
        },
      });
    }
    
    if (!isInvestmentExpanded) {
      // Expand animation
      setIsInvestmentExpanded(true);
      
      // Animate container height with platform optimization
      Animated.timing(investmentHeightAnimated, {
        toValue: 1,
        duration: Platform.OS === 'ios' ? 700 : 600,
        easing: Platform.OS === 'ios' ? Easing.out(Easing.ease) : Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
      
      // Animate items with platform-specific timing
      const animationDuration = Platform.OS === 'ios' ? 700 : 600;
      const easing = Platform.OS === 'ios' ? Easing.out(Easing.ease) : Easing.out(Easing.cubic);
      
      Animated.timing(goldAnimatedValue, {
        toValue: 1,
        duration: animationDuration,
        easing,
        useNativeDriver: true,
      }).start();
      
      Animated.timing(bondAnimatedValue, {
        toValue: 1,
        duration: animationDuration,
        delay: Platform.OS === 'ios' ? 120 : 100,
        easing,
        useNativeDriver: true,
      }).start();
      
      Animated.timing(fixedAnimatedValue, {
        toValue: 1,
        duration: animationDuration,
        delay: Platform.OS === 'ios' ? 240 : 200,
        easing,
        useNativeDriver: true,
      }).start();
      
      Animated.timing(mutualFundAnimatedValue, {
        toValue: 1,
        duration: animationDuration,
        delay: Platform.OS === 'ios' ? 360 : 300,
        easing,
        useNativeDriver: true,
      }).start();
    } else {
      // Collapse animation
      const collapseEasing = Platform.OS === 'ios' ? Easing.in(Easing.ease) : Easing.in(Easing.cubic);
      const collapseDuration = Platform.OS === 'ios' ? 450 : 400;
      
      Animated.parallel([
        Animated.timing(investmentHeightAnimated, {
          toValue: 0,
          duration: collapseDuration,
          easing: collapseEasing,
          useNativeDriver: false,
        }),
        Animated.timing(goldAnimatedValue, {
          toValue: 0,
          duration: collapseDuration,
          easing: collapseEasing,
          useNativeDriver: true,
        }),
        Animated.timing(bondAnimatedValue, {
          toValue: 0,
          duration: collapseDuration,
          delay: Platform.OS === 'ios' ? 60 : 50,
          easing: collapseEasing,
          useNativeDriver: true,
        }),
        Animated.timing(fixedAnimatedValue, {
          toValue: 0,
          duration: collapseDuration,
          delay: Platform.OS === 'ios' ? 120 : 100,
          easing: collapseEasing,
          useNativeDriver: true,
        }),
        Animated.timing(mutualFundAnimatedValue, {
          toValue: 0,
          duration: collapseDuration,
          delay: Platform.OS === 'ios' ? 180 : 150,
          easing: collapseEasing,
          useNativeDriver: true,
        })
      ]).start(() => {
        setIsInvestmentExpanded(false);
      });
    }
  };

  const toggleLoansExpansion = () => {
    // Configure layout animation for iOS
    if (Platform.OS === 'ios') {
      LayoutAnimation.configureNext({
        duration: 600,
        create: {
          type: LayoutAnimation.Types.easeOut,
          property: LayoutAnimation.Properties.opacity,
        },
        update: {
          type: LayoutAnimation.Types.easeOut,
        },
      });
    }
    
    if (!isLoansExpanded) {
      // Expand animation
      setIsLoansExpanded(true);
      
      // Animate container height with platform optimization
      Animated.timing(loansHeightAnimated, {
        toValue: 1,
        duration: Platform.OS === 'ios' ? 650 : 600,
        easing: Platform.OS === 'ios' ? Easing.out(Easing.ease) : Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
      
      // Animate Business Loan item
      Animated.timing(homeLoanAnimatedValue, {
        toValue: 1,
        duration: Platform.OS === 'ios' ? 650 : 600,
        easing: Platform.OS === 'ios' ? Easing.out(Easing.ease) : Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      // Collapse animation
      const collapseEasing = Platform.OS === 'ios' ? Easing.in(Easing.ease) : Easing.in(Easing.cubic);
      const collapseDuration = Platform.OS === 'ios' ? 450 : 400;
      
      Animated.parallel([
        Animated.timing(loansHeightAnimated, {
          toValue: 0,
          duration: collapseDuration,
          easing: collapseEasing,
          useNativeDriver: false,
        }),
        Animated.timing(homeLoanAnimatedValue, {
          toValue: 0,
          duration: collapseDuration,
          easing: collapseEasing,
          useNativeDriver: true,
        })
      ]).start(() => {
        setIsLoansExpanded(false);
      });
    }
  };

  const handleCategoryPress = (category, subCategory = null, subCategoryImage = null) => {
    setSelectedCategory(category);
    setSelectedSubCategoryData(subCategory);
    setSelectedSubCategoryImage(subCategoryImage);
    setShowCategoryModal(true);
  };

  const closeCategoryModal = () => {
    setShowCategoryModal(false);
    setSelectedCategory('');
    setSelectedSubCategoryData(null);
    setSelectedSubCategoryImage(null);
  };

  const navigateToInsurances = () => {
    navigation.navigate('Insurances');
  };

  const navigateToInvestments = () => {
    navigation.navigate('Investments');
  };

  const navigateToLoans = () => {
    navigation.navigate('Loans');
  };

  // ------------------------------------------------------------------
  // Search functionality
  const handleSearch = async (query) => {
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await searchProducts(query.trim(), 20, 0.4);
      setSearchResults(response.data.results || []);
      setShowSearchResults(true);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Search failed',
        text2: error?.response?.data?.message || 'Failed to search products',
        position: 'bottom',
      });
      setSearchResults([]);
      setShowSearchResults(false);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchInputChange = (text) => {
    setSearchQuery(text);
    // Debounce search to avoid too many API calls
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    searchTimeout.current = setTimeout(() => {
      handleSearch(text);
    }, 500);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
  };

  // ------------------------------------------------------------------
  // Helper functions to map API data to static structure
  const getSubCategoryImageUri = (base64) => {
    if (!base64) return null;
    return base64.startsWith('data:') ? base64 : `data:image/png;base64,${base64}`;
  };

  const getInsuranceItems = () => {
    const insuranceCategory = categories.find(cat => cat.name.toLowerCase().includes('insurance'));
    if (!insuranceCategory) return insuranceItems; // fallback to static

    const insuranceSubs = subCategories.filter(
      sub => sub.parentCategory?._id === insuranceCategory._id
    ).slice(0, 5); // limit to 5 items

    return insuranceSubs.length > 0
      ? insuranceSubs.map(sub => ({ title: sub.name, id: sub._id, description: sub.description, image: sub.image }))
      : insuranceItems;
  };

  const getInvestmentItems = () => {
    const investmentCategory = categories.find(cat => cat.name.toLowerCase().includes('investment'));
    if (!investmentCategory) return investmentItems; // fallback to static

    const investmentSubs = subCategories.filter(
      sub => sub.parentCategory?._id === investmentCategory._id
    ).slice(0, 7); // limit to 7 items

    return investmentSubs.length > 0
      ? investmentSubs.map(sub => ({ title: sub.name, id: sub._id, description: sub.description, image: sub.image }))
      : investmentItems;
  };

  const getLoanItems = () => {
    const loanCategory = categories.find(cat => cat.name.toLowerCase().includes('loan'));
    if (!loanCategory) return loanItems; // fallback to static

    const loanSubs = subCategories.filter(
      sub => sub.parentCategory?._id === loanCategory._id
    ).slice(0, 4); // limit to 4 items

    return loanSubs.length > 0
      ? loanSubs.map(sub => ({ title: sub.name, id: sub._id, description: sub.description, image: sub.image }))
      : loanItems;
  };

  // ------------------------------------------------------------------
  // Fetch user data
  const fetchUserData = async () => {
    try {
      const response = await getUserData();
      const userData = response.data.user;

      setUserName(userData.name);
      setUserRoles(userData.roles);

      if (userData.image && !userData.image.startsWith('data:')) {
        const imageUri = `data:image/jpeg;base64,${userData.image}`;
        setProfileImage(imageUri);
      } else {
        setProfileImage(userData.image);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error?.response?.data?.message || error.message || 'Unexpected Error',
        position: 'bottom',
      });
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
      Toast.show({
        type: 'error',
        text1: error?.response?.data?.message || error.message || 'Unexpected Error',
        position: 'bottom',
      });
    }
  };

  // ------------------------------------------------------------------
  // Fetch categories
  const fetchAllCategories = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await getCategories();
      setCategories(resp.data);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error?.response?.data?.message || 'Error fetching categories',
        position: 'bottom',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Fetch subcategories
  const fetchAllSubCategories = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await getSubCategories({ page: 1, limit: 100 });
      setSubCategories(resp.data.data);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error?.response?.data?.message || 'Error fetching subcategories',
        position: 'bottom',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // ------------------------------------------------------------------
  // On mount, load config
  useEffect(() => {
    fetchConfig();
  }, []);

  // Load user data and avoid flicker
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const loadUser = async () => {
        try {
          await fetchUserData();
        } finally {
          if (isActive) {
            setIsLoadingUserData(false);
          }
        }
      };
      loadUser();
      return () => {
        isActive = false;
      };
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      fetchAllCategories();
      fetchAllSubCategories();
      setBottomSheetVisible(false);
      setSelectedSubCategory(null);
    }, [fetchAllCategories, fetchAllSubCategories])
  );

  // Pull-to-refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAllCategories();
    fetchAllSubCategories();
  }, [fetchAllCategories, fetchAllSubCategories]);

  // Loading check
  if (isLoadingUserData) {
    return null;
  }

  // ------------------------------------------------------------------
  // Bottom Sheet Modal Component
  const renderBottomSheet = () => (
    <Modal
      visible={bottomSheetVisible}
      animationType="slide"
      transparent
      onRequestClose={() => setBottomSheetVisible(false)}
    >
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <TouchableOpacity
          onPress={() => setBottomSheetVisible(false)}
          activeOpacity={1}
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }}
        />
        <View
          style={{
            backgroundColor: '#FFF',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#6B21A8',
              marginBottom: 10,
            }}
          >
            {selectedSubCategory?.name}
          </Text>
          <Text style={{ fontSize: 14, color: '#333' }}>
            {selectedSubCategory?.description}
          </Text>

          <TouchableOpacity
            onPress={() => setBottomSheetVisible(false)}
            style={{ marginTop: 15, alignSelf: 'center' }}
          >
            <Text style={{ color: 'red', fontSize: 16 }}>Close</Text>
          </TouchableOpacity>
        </View>
    </View>
    </Modal>
  );

  // ------------------------------------------------------------------
  // Render swiper using the AutoSwiper component
  const renderSwiper = () => {
    return <AutoSwiper images={featuredImages} />;
  };

  return (
    <LinearGradient
      colors={['#FBFBFB', '#FBFBFB', '#F0E2FF']}
      locations={[0, 0.7, 1]}
      style={styles.container}
    >
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#8638EE"
          />
        }
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
                    {/* Search Bar with Dropdown */}
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={22} color="#1A1B20" />
            <TextInput 
              placeholder="Search products..."
              placeholderTextColor="#7D7D7D" 
              style={styles.searchInput} 
              value={searchQuery}
              onChangeText={handleSearchInputChange}
              returnKeyType="search"
              onSubmitEditing={() => handleSearch(searchQuery)}
              onBlur={() => {
                // Hide dropdown after a short delay to allow for item selection
                setTimeout(() => {
                  if (!searchQuery) {
                    setShowSearchResults(false);
                  }
                }, 150);
              }}
              onFocus={() => {
                if (searchResults.length > 0 && searchQuery) {
                  setShowSearchResults(true);
                }
              }}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                <Ionicons name="close-circle" size={20} color="#7D7D7D" />
              </TouchableOpacity>
            )}
            {isSearching && (
              <View style={styles.searchingIndicator}>
                <Ionicons name="ellipsis-horizontal" size={20} color="#8F31F9" />
              </View>
            )}

            {/* Search Results Dropdown */}
            {showSearchResults && (
              <>
                {/* Backdrop to dim background */}
                <TouchableOpacity
                  style={styles.dropdownBackdrop}
                  activeOpacity={1}
                  onPress={() => setShowSearchResults(false)}
                />
                <View style={styles.searchDropdown}>
                  {searchResults.length > 0 ? (
                    <ScrollView style={styles.dropdownScrollView} showsVerticalScrollIndicator={false}>
                      {searchResults.map((product, index) => (
                        <TouchableOpacity
                          key={product._id || index}
                          style={styles.dropdownItem}
                          onPress={() => {
                            // Handle product selection - you can navigate to product details
                            Toast.show({
                              type: 'info',
                              text1: 'Product selected',
                              text2: product.name,
                              position: 'bottom',
                            });
                            setShowSearchResults(false);
                            setSearchQuery('');
                          }}
                        >
                          <View style={styles.dropdownItemContent}>
                            <View style={styles.dropdownItemInfo}>
                              <Text style={styles.dropdownItemName} numberOfLines={1}>
                                {product.name}
                              </Text>
                              {product.categoryId && (
                                <Text style={styles.dropdownItemCategory}>
                                  {product.categoryId.name}
                                </Text>
                              )}
                            </View>
                            <View style={styles.dropdownItemArrow}>
                              <Ionicons name="chevron-forward" size={16} color="#8F31F9" />
                            </View>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  ) : (
                    <View style={styles.dropdownNoResults}>
                      <Ionicons name="search-outline" size={24} color="#7D7D7D" />
                      <Text style={styles.dropdownNoResultsText}>No products found</Text>
                    </View>
                  )}
                </View>
              </>
            )}
          </View>

          {/* Filter Tabs */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filterContainer}
            contentContainerStyle={styles.filterContent}
          >
            {getFilters().map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterTab,
                  filter.active ? styles.filterTabActive : styles.filterTabInactive
                ]}
                onPress={() => handleFilterPress(filter.id)}
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

          {/* Spacer between filters and banner */}
          <View style={{ height: 25, marginVertical: 5 }} />

          {/* Featured Images Swiper - Same as drwise-user */}
          {renderSwiper()}
        </LinearGradient>

        

        {/* Content Sections */}
        <View style={styles.contentContainer}>
          {/* Insurance Section */}
          {shouldShowSection('ins') && (
          <View style={styles.sectionCard}>
            <Image 
              source={require('../../assets/Icons/insurancesBack.png')} 
              style={styles.sectionBackgroundImage}
            />
            <View style={styles.sectionGradient}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionInfo}>
                  <Text style={styles.sectionTitle}>Insurances</Text>
                  <Text style={styles.sectionSubtitle}>Explore insurance plans tailored to your needs.</Text>
                </View>
                <TouchableOpacity style={styles.sectionArrow} onPress={navigateToInsurances} activeOpacity={0.7}>
                  <View style={[styles.arrowOuterCircle, { backgroundColor: 'rgba(29, 140, 124, 0.3)' }]}>
                    <View style={[styles.arrowCircle, { backgroundColor: '#1D8C7C' }]}>
                      <Ionicons name="arrow-up-outline" size={20} color="#FFFFFF" style={{ transform: [{ rotate: '45deg' }] }} />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
              
              
              <Animated.View 
                style={[
                  styles.insuranceGrid,
                  {
                    height: insuranceHeightAnimated.interpolate({
                      inputRange: [0, 1],
                      outputRange: [120, 270], // 2 rows + gap + arrow space
                    }),
                  }
                ]}
              >
                {/* Always visible first row - dynamically rendered from API */}
                {getInsuranceItems().slice(0, 3).map((item, index) => {
                  const subCat = subCategories.find(sub => sub.name === item.title);
                  const imageUri = getSubCategoryImageUri(item.image);

                  return (
                    <React.Fragment key={item.title}>
                {/* Invisible touch overlays for category cards */}
                <TouchableOpacity
                        onPress={() => {
                          if (subCat) {
                            handleCategoryPress('Insurances', subCat, imageUri);
                          } else {
                            handleCategoryPress(item.title);
                          }
                        }}
                        style={[styles.categoryOverlay, {
                          top: 0,
                          left: `${index * 33.33}%`,
                          width: '33.33%',
                          height: 120
                        }]}
                  activeOpacity={1}
                />
                <LinearGradient
                  colors={['#FBFBFB', '#E6FFF1']}
                  style={styles.insuranceItem}
                >
                        <Text style={styles.itemTitle}>{item.title}</Text>
                  <View style={styles.insuranceIconContainer}>
                          {imageUri ? (
                    <Image 
                              source={{ uri: imageUri }}
                      style={styles.insuranceIcon}
                      resizeMode="contain"
                    />
                          ) : (
                    <Image 
                              source={
                                item.title === 'Life' ? require('../../assets/Icons/umbrella.png') :
                                item.title === 'Health' ? require('../../assets/Icons/heartInsurance.png') :
                                require('../../assets/Icons/steeringwheel.png')
                              }
                      style={styles.insuranceIcon}
                      resizeMode="contain"
                    />
                          )}
                  </View>
                </LinearGradient>
                    </React.Fragment>
                  );
                })}

                {/* Animated second row - only visible when expanded */}
                {isInsuranceExpanded && getInsuranceItems().slice(3, 5).map((item, index) => {
                  const subCat = subCategories.find(sub => sub.name === item.title);
                  const imageUri = getSubCategoryImageUri(item.image);
                  const animatedValue = index === 0 ? generalAnimatedValue : travelAnimatedValue;

                  return (
                    <React.Fragment key={`expanded-${item.title}`}>
                {/* Invisible touch overlays for expanded insurance cards */}
                    <TouchableOpacity
                        onPress={() => {
                          if (subCat) {
                            handleCategoryPress('Insurances', subCat, imageUri);
                          } else {
                            handleCategoryPress(item.title);
                          }
                        }}
                        style={[styles.categoryOverlay, {
                          top: 120,
                          left: `${index * 33.33}%`,
                          width: '33.33%',
                          height: 120
                        }]}
                      activeOpacity={1}
                    />
                    <Animated.View
                      style={[
                        styles.insuranceItem,
                        {
                          transform: [
                            {
                                translateX: animatedValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: Platform.OS === 'ios' ? [150, 0] : [200, 0],
                                extrapolate: 'clamp',
                              }),
                            },
                            {
                                translateY: animatedValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: Platform.OS === 'ios' ? [-80, 0] : [-100, 0],
                                extrapolate: 'clamp',
                              }),
                            },
                            {
                                scale: animatedValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: Platform.OS === 'ios' ? [0.5, 1] : [0.3, 1],
                                extrapolate: 'clamp',
                              }),
                            },
                          ],
                            opacity: animatedValue.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 1],
                            extrapolate: 'clamp',
                          }),
                        }
                      ]}
                    >
                      <LinearGradient
                        colors={['#FBFBFB', '#E6FFF1']}
                        style={StyleSheet.absoluteFillObject}
                      />
                        <Text style={styles.itemTitle}>{item.title}</Text>
                      <View style={styles.insuranceIconContainer}>
                          {imageUri ? (
                        <Image 
                              source={{ uri: imageUri }}
                          style={styles.insuranceIcon}
                          resizeMode="contain"
                        />
                          ) : (
                        <Image 
                              source={
                                item.title === 'General' ? require('../../assets/Icons/generalInsurance.png') :
                                require('../../assets/Icons/planeInsurance.png')
                              }
                          style={styles.insuranceIcon}
                          resizeMode="contain"
                        />
                          )}
                      </View>
                    </Animated.View>
                    </React.Fragment>
                  );
                })}
              </Animated.View>

              {/* Down Arrow Navigation */}
              <TouchableOpacity 
                style={styles.insuranceDownArrow}
                onPress={toggleInsuranceExpansion}
                activeOpacity={0.7}
              >
                <Animated.View
                  style={{
                    transform: [{
                      rotate: isInsuranceExpanded ? '180deg' : '0deg'
                    }]
                  }}
                >
                  <Ionicons 
                    name="chevron-down-outline" 
                    size={24} 
                    color="#7D7D7D" 
                  />
                </Animated.View>
              </TouchableOpacity>
            </View>
          </View>
          )}

          {/* Tax Section */}
          {shouldShowSection('tax') && (
          <View style={styles.taxCard}>
            {/* Invisible touch overlay for tax section */}
            <TouchableOpacity 
              onPress={() => handleCategoryPress('Tax')} 
              style={[styles.categoryOverlay, { top: 0, left: 0, width: '100%', height: '100%' }]}
              activeOpacity={1}
            />
            <View style={styles.taxContent}>
              <View style={styles.taxTextSection}>
                <Text style={styles.taxTitle}>Tax</Text>
                <Text style={styles.taxSubtitle}>Get expert help to file your taxes on time and save more.</Text>
              </View>
              
              <View style={styles.taxImageSection}>
                <View style={styles.taxImageBackground}>
                  <View style={styles.taxIconContainer}>
                    {/* Vector Tax as Background Pattern */}
                    <Image 
                      source={require('../../assets/Icons/vector_tax.png')} 
                      style={styles.taxVectorBackground}
                      resizeMode="cover"
                    />
                    
                    {/* Tax PNG Icon - Main foreground element */}
                    <Image 
                      source={require('../../assets/Icons/tax.png')} 
                      style={styles.taxMainIcon}
                      resizeMode="contain"
                    />
                    
                    {/* Arrow */}
                    <View style={styles.taxArrow}>
                      <Ionicons name="arrow-forward" size={16} color="#6B7280" />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
          )}

          {/* Investment Section */}
          {shouldShowSection('inv') && (
          <View style={styles.sectionCard}>
            <Image 
              source={require('../../assets/Icons/investmentsBack.png')} 
              style={styles.sectionBackgroundImage}
            />
            <View style={styles.sectionGradient}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionInfo}>
                  <Text style={styles.sectionTitle}>Investments</Text>
                  <Text style={styles.sectionSubtitle}>Explore top investment options and share them to earn with every new join.</Text>
                </View>
                <TouchableOpacity style={styles.sectionArrow} onPress={navigateToInvestments} activeOpacity={0.7}>
                  <View style={[styles.arrowOuterCircle, { backgroundColor: 'rgba(246, 172, 17, 0.3)' }]}>
                    <View style={[styles.arrowCircle, { backgroundColor: '#F6AC11' }]}>
                      <Ionicons name="arrow-up-outline" size={20} color="#FFFFFF" style={{ transform: [{ rotate: '45deg' }] }} />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
              
              <Animated.View 
                style={[
                  styles.investmentGrid,
                  {
                    height: investmentHeightAnimated.interpolate({
                      inputRange: [0, 1],
                      outputRange: [120, 390], // 3 rows + gaps + arrow space for 7 items
                    }),
                  }
                ]}
              >
                {/* Always visible first row - dynamically rendered from API */}
                {getInvestmentItems().slice(0, 3).map((item, index) => {
                  const subCat = subCategories.find(sub => sub.name === item.title);
                  const imageUri = getSubCategoryImageUri(item.image);

                  return (
                    <React.Fragment key={item.title}>
                {/* Invisible touch overlays for investment category cards */}
                <TouchableOpacity
                        onPress={() => {
                          if (subCat) {
                            handleCategoryPress('Investments', subCat, imageUri);
                          } else {
                            handleCategoryPress(item.title);
                          }
                        }}
                        style={[styles.categoryOverlay, {
                          top: 0,
                          left: `${index * 33.33}%`,
                          width: '33.33%',
                          height: 120
                        }]}
                  activeOpacity={1}
                />
                <LinearGradient
                  colors={['#FBFBFB', '#FFF4E6']}
                  style={styles.investmentItem}
                >
                        <Text style={styles.itemTitle}>{item.title}</Text>
                  <View style={styles.investmentIconContainer}>
                          {imageUri ? (
                    <Image 
                              source={{ uri: imageUri }}
                      style={styles.investmentIcon}
                      resizeMode="contain"
                    />
                          ) : (
                    <Image 
                              source={
                                item.title === 'Mutual Fund' ? require('../../assets/Icons/mutualFund.png') :
                                item.title === 'Fixed' ? require('../../assets/Icons/fixedInv.png') :
                                require('../../assets/Icons/bondInv.png')
                              }
                      style={styles.investmentIcon}
                      resizeMode="contain"
                    />
                          )}
                  </View>
                </LinearGradient>
                    </React.Fragment>
                  );
                })}

                {/* Animated additional items - only visible when expanded */}
                {isInvestmentExpanded && getInvestmentItems().slice(3, 7).map((item, index) => {
                  const subCat = subCategories.find(sub => sub.name === item.title);
                  const imageUri = getSubCategoryImageUri(item.image);
                  const animatedValues = [goldAnimatedValue, bondAnimatedValue, fixedAnimatedValue, mutualFundAnimatedValue];
                  const animatedValue = animatedValues[index] || goldAnimatedValue;
                  const topPosition = index < 3 ? 120 : 240;
                  const leftPosition = `${(index % 3) * 33.33}%`;

                  return (
                    <React.Fragment key={`expanded-${item.title}`}>
                      {/* Invisible touch overlays for expanded investment cards */}
                    <TouchableOpacity
                        onPress={() => {
                          if (subCat) {
                            handleCategoryPress('Investments', subCat, imageUri);
                          } else {
                            handleCategoryPress(item.title);
                          }
                        }}
                        style={[styles.categoryOverlay, {
                          top: topPosition,
                          left: leftPosition,
                          width: '33.33%',
                          height: 120
                        }]}
                      activeOpacity={1}
                    />
                    <Animated.View
                      style={[
                        styles.investmentItem,
                        {
                          transform: [
                            {
                                translateX: animatedValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: Platform.OS === 'ios' ? [150, 0] : [200, 0],
                                extrapolate: 'clamp',
                              }),
                            },
                            {
                                translateY: animatedValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: Platform.OS === 'ios' ? [-80, 0] : [-100, 0],
                                extrapolate: 'clamp',
                              }),
                            },
                            {
                                scale: animatedValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: Platform.OS === 'ios' ? [0.5, 1] : [0.3, 1],
                                extrapolate: 'clamp',
                              }),
                            },
                          ],
                            opacity: animatedValue.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 1],
                            extrapolate: 'clamp',
                          }),
                        }
                      ]}
                    >
                      <LinearGradient
                        colors={['#FBFBFB', '#FFF4E6']}
                        style={StyleSheet.absoluteFillObject}
                      />
                        <Text style={styles.itemTitle}>{item.title}</Text>
                      <View style={styles.investmentIconContainer}>
                          {imageUri ? (
                        <Image 
                              source={{ uri: imageUri }}
                          style={styles.investmentIcon}
                          resizeMode="contain"
                        />
                          ) : (
                        <Image 
                              source={
                                item.title === 'Gold' ? require('../../assets/Icons/goldInv.png') :
                                item.title === 'LAS' ? require('../../assets/Icons/LASInvestments.png') :
                                item.title === 'NPS' ? require('../../assets/Icons/npsInsurance.png') :
                                require('../../assets/Icons/investmentsTrading.png')
                              }
                          style={styles.investmentIcon}
                          resizeMode="contain"
                        />
                          )}
                      </View>
                    </Animated.View>
                    </React.Fragment>
                  );
                })}
              </Animated.View>

              {/* Down Arrow Navigation */}
              <TouchableOpacity 
                style={styles.investmentDownArrow}
                onPress={toggleInvestmentExpansion}
                activeOpacity={0.7}
              >
                <Animated.View
                  style={{
                    transform: [{
                      rotate: isInvestmentExpanded ? '180deg' : '0deg'
                    }]
                  }}
                >
                  <Ionicons 
                    name="chevron-down-outline" 
                    size={24} 
                    color="#7D7D7D" 
                  />
                </Animated.View>
              </TouchableOpacity>
            </View>
          </View>
          )}

          {/* Loans Section */}
          {shouldShowSection('loans') && (
          <View style={styles.sectionCard}>
            <Image 
              source={require('../../assets/Icons/loansBack.png')} 
              style={styles.sectionBackgroundImage}
            />
            <View style={styles.sectionGradient}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionInfo}>
                  <Text style={styles.sectionTitle}>Loans</Text>
                  <Text style={styles.sectionSubtitle}>Select the right loan offers and share them to earn when someone applies.</Text>
                </View>
                <TouchableOpacity style={styles.sectionArrow} onPress={navigateToLoans} activeOpacity={0.7}>
                  <View style={[styles.arrowOuterCircle, { backgroundColor: 'rgba(199, 91, 122, 0.3)' }]}>
                    <View style={[styles.arrowCircle, { backgroundColor: '#C75B7A' }]}>
                      <Ionicons name="arrow-up-outline" size={20} color="#FFFFFF" style={{ transform: [{ rotate: '45deg' }] }} />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
              
              <Animated.View 
                style={[
                  styles.loansGrid,
                  {
                    height: loansHeightAnimated.interpolate({
                      inputRange: [0, 1],
                      outputRange: [120, 270], // 2 rows + gap + arrow space
                    }),
                  }
                ]}
              >
                {/* Always visible first row - dynamically rendered from API */}
                {getLoanItems().slice(0, 3).map((item, index) => {
                  const subCat = subCategories.find(sub => sub.name === item.title);
                  const imageUri = getSubCategoryImageUri(item.image);

                  return (
                    <React.Fragment key={item.title}>
                {/* Invisible touch overlays for loan category cards */}
                <TouchableOpacity
                        onPress={() => {
                          if (subCat) {
                            handleCategoryPress('Loans', subCat, imageUri);
                          } else {
                            handleCategoryPress(item.title);
                          }
                        }}
                        style={[styles.categoryOverlay, {
                          top: 0,
                          left: `${index * 33.33}%`,
                          width: '33.33%',
                          height: 120
                        }]}
                  activeOpacity={1}
                />
                <LinearGradient
                  colors={['#FBFBFB', '#FCE4EC']}
                  style={styles.loanItem}
                >
                        <Text style={styles.itemTitle}>{item.title}</Text>
                  <View style={styles.loanIconContainer}>
                          {imageUri ? (
                    <Image 
                              source={{ uri: imageUri }}
                      style={styles.loanIcon}
                      resizeMode="contain"
                    />
                          ) : (
                    <Image 
                              source={
                                item.title === 'Home Loan' ? require('../../assets/Icons/propertyLoans.png') :
                                item.title === 'Personal Loans' ? require('../../assets/Icons/personalLoans.png') :
                                require('../../assets/Icons/loansSection.png')
                              }
                      style={styles.loanIcon}
                      resizeMode="contain"
                    />
                          )}
                  </View>
                </LinearGradient>
                    </React.Fragment>
                  );
                })}

                {/* Animated additional item - only visible when expanded */}
                {isLoansExpanded && getLoanItems().slice(3, 4).map((item, index) => {
                  const subCat = subCategories.find(sub => sub.name === item.title);
                  const imageUri = getSubCategoryImageUri(item.image);

                  return (
                    <React.Fragment key={`expanded-${item.title}`}>
                {/* Invisible touch overlay for expanded loan card */}
                  <TouchableOpacity
                        onPress={() => {
                          if (subCat) {
                            handleCategoryPress('Loans', subCat, imageUri);
                          } else {
                            handleCategoryPress(item.title);
                          }
                        }}
                        style={[styles.categoryOverlay, {
                          top: 120,
                          left: 0,
                          width: '33.33%',
                          height: 120
                        }]}
                    activeOpacity={1}
                  />
                  <Animated.View
                    style={[
                      styles.loanItem,
                      {
                        transform: [
                          {
                            translateX: homeLoanAnimatedValue.interpolate({
                              inputRange: [0, 1],
                              outputRange: Platform.OS === 'ios' ? [150, 0] : [200, 0],
                              extrapolate: 'clamp',
                            }),
                          },
                          {
                            translateY: homeLoanAnimatedValue.interpolate({
                              inputRange: [0, 1],
                              outputRange: Platform.OS === 'ios' ? [-80, 0] : [-100, 0],
                              extrapolate: 'clamp',
                            }),
                          },
                          {
                            scale: homeLoanAnimatedValue.interpolate({
                              inputRange: [0, 1],
                              outputRange: Platform.OS === 'ios' ? [0.5, 1] : [0.3, 1],
                              extrapolate: 'clamp',
                            }),
                          },
                        ],
                        opacity: homeLoanAnimatedValue.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 1],
                          extrapolate: 'clamp',
                        }),
                      }
                    ]}
                  >
                    <LinearGradient
                      colors={['#FBFBFB', '#FCE4EC']}
                      style={StyleSheet.absoluteFillObject}
                    />
                        <Text style={styles.itemTitle}>{item.title}</Text>
                    <View style={styles.loanIconContainer}>
                          {imageUri ? (
                            <Image
                              source={{ uri: imageUri }}
                              style={styles.loanIcon}
                              resizeMode="contain"
                            />
                          ) : (
                      <Image 
                        source={require('../../assets/Icons/businessLoans.png')} 
                        style={styles.loanIcon}
                        resizeMode="contain"
                      />
                          )}
                    </View>
                  </Animated.View>
                    </React.Fragment>
                  );
                })}
              </Animated.View>

              {/* Down Arrow Navigation */}
              <TouchableOpacity 
                style={styles.loansDownArrow}
                onPress={toggleLoansExpansion}
                activeOpacity={0.7}
              >
                <Animated.View
                  style={{
                    transform: [{
                      rotate: isLoansExpanded ? '180deg' : '0deg'
                    }]
                  }}
                >
                  <Ionicons 
                    name="chevron-down-outline" 
                    size={24} 
                    color="#7D7D7D" 
                  />
                </Animated.View>
              </TouchableOpacity>
            </View>
          </View>
          )}

          {/* Travel Section */}
          {shouldShowSection('travel') && (
          <View style={styles.travelCard}>
            <Text style={styles.sectionTitle}>Travel</Text>
            <Text style={styles.sectionSubtitle}>Share the best travel deals and earn when someone books through your link.</Text>
            
            <View style={styles.travelOptions}>
              {/* Invisible touch overlays for travel options */}
              <TouchableOpacity 
                onPress={() => handleCategoryPress('Domestic Travel')} 
                style={[styles.categoryOverlay, { top: 0, left: 0, width: '50%', height: 120 }]}
                activeOpacity={1}
              />
              <TouchableOpacity 
                onPress={() => handleCategoryPress('International Travel')} 
                style={[styles.categoryOverlay, { top: 0, left: '50%', width: '50%', height: 120 }]}
                activeOpacity={1}
              />
              {/* Domestic Travel */}
              <TouchableOpacity style={styles.travelOption} activeOpacity={0.8}>
                <LinearGradient
                  colors={['#FBFBFB', '#FBFBFB', '#F0E2FF']}
                  locations={[0, 0.7, 1]}
                  style={styles.travelOptionGradient}
                >
                  <View style={styles.travelArrow}>
                    <Ionicons name="arrow-forward" size={16} color="#1A1B20" />
                  </View>
                  
                  <View style={styles.travelIconContainer}>
                    <Image 
                      source={require('../../assets/Icons/domesticTravel.png')} 
                      style={styles.travelIcon}
                      resizeMode="contain"
                    />
                  </View>
                  
                  <Text style={styles.travelOptionTitle}>Domestic{'\n'}Travel</Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* International Travel */}
              <TouchableOpacity style={styles.travelOption} activeOpacity={0.8}>
                <LinearGradient
                  colors={['#FBFBFB', '#FBFBFB', '#F0E2FF']}
                  locations={[0, 0.7, 1]}
                  style={styles.travelOptionGradient}
                >
                  <View style={styles.travelArrow}>
                    <Ionicons name="arrow-forward" size={16} color="#1A1B20" />
                  </View>
                  
                  <View style={styles.travelIconContainer}>
                    <Image 
                      source={require('../../assets/Icons/internationalTravel.png')} 
                      style={styles.travelIcon}
                      resizeMode="contain"
                    />
                  </View>
                  
                  <Text style={styles.travelOptionTitle}>International{'\n'}Travel</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
          )}

          {/* Statistics Section - Show only when 'all' is selected */}
          {activeFilter === 'all' && (
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>Built on Trust, Growing with You</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <View style={styles.statIconContainer}>
                  <Image 
                    source={require('../../assets/Icons/10k_plus.png')} 
                    style={styles.statIcon}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.statNumber}>10K+</Text>
                <Text style={styles.statLabel}>Users exploring{'\n'}services</Text>
              </View>
              
              <View style={styles.statItem}>
                <View style={styles.statIconContainer}>
                  <Image 
                    source={require('../../assets/Icons/1k_plus.png')} 
                    style={styles.statIcon}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.statNumber}>1K+</Text>
                <Text style={styles.statLabel}>Verified Affiliates{'\n'}and Ambassadors</Text>
              </View>
              
              <View style={styles.statItem}>
                <View style={styles.statIconContainer}>
                  <Image 
                    source={require('../../assets/Icons/20_plus.png')} 
                    style={styles.statIcon}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.statNumber}>20+</Text>
                <Text style={styles.statLabel}>Trusted Financial{'\n'}Partners</Text>
              </View>
            </View>
          </View>
          )}

          {/* Bottom Image */}
          <Image
            source={require('../../assets/Icons/homepage_bottom.png')}
            style={styles.bottomImage}
          />

          {/* <View style={{ height: 120 }} /> */}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <View style={styles.fabIcon}>
          <Image 
            source={require('../../assets/Icons/hoveringVector.png')} 
            style={styles.fabImage}
          />
        </View>
      </TouchableOpacity>

      {/* Category Modal */}
      <CategoryModal
        visible={showCategoryModal}
        onClose={closeCategoryModal}
        category={selectedCategory}
        subCategory={selectedSubCategoryData}
        subCategoryImage={selectedSubCategoryImage}
      />

      {/* Bottom Sheet */}
      {renderBottomSheet()}

      {/* Toast Messages */}
      <Toast config={toastConfig} />

      {/* <BottomBar /> */}
    </LinearGradient>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontFamily: 'Rubik-SemiBold',
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FBFBFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFF',
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginHorizontal: 25,
    marginBottom: 20,
    shadowColor: '#8F31F9',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    position: 'relative',
    zIndex: 100,
  },
  searchInput: {
    flex: 1,
    marginLeft: 11,
    fontSize: 13,
    color: '#7D7D7D',
    fontFamily: 'Rubik-Regular',
  },
  filterContainer: {
    marginBottom: 5,
  },
  filterContent: {
    paddingHorizontal: 25,
    gap: 12,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
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
    fontFamily: 'Rubik-Regular',
  },

  contentContainer: {
    padding: 20,
    gap: 20,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  sectionCard: {
    overflow: 'hidden',
    shadowColor: '#8F31F9',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    backgroundColor: 'transparent',
    marginBottom: 20,
  },
  sectionGradient: {
    padding: 20,
    zIndex: 2,
    position: 'relative',
  },
  sectionBackgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
    resizeMode: 'stretch',
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
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 6,
    fontFamily: 'Rubik-SemiBold',
  },
  sectionSubtitle: {
    color: '#7D7D7D',
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
    fontFamily: 'Rubik-Regular',
  },
  sectionArrow: {
    marginLeft: 10,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  arrowOuterCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1D8C7C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  insuranceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
    justifyContent: 'flex-start',
  },
  insuranceItem: {
    width: '30%',
    height: 110,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    padding: 12,
    shadowColor: 'rgba(143, 49, 249, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 2,
    justifyContent: 'flex-start',
  },
  insuranceDownArrow: {
    alignSelf: 'center',
    top: 7,
    padding: 8,
  },
  insuranceIconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  insuranceIcon: {
    width: 70,
    height: 70,
  },
  itemTitle: {
    color: '#1A1B20',
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Rubik-SemiBold',
  },
  investmentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  investmentItem: {
    width: '30%',
    height: 110,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    padding: 12,
    shadowColor: 'rgba(143, 49, 249, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 2,
    justifyContent: 'space-between',
  },
  investmentIconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  investmentIcon: {
    width: 70,
    height: 70,
  },
  investmentDownArrow: {
    alignSelf: 'center',
    top:16,
    padding: 8,
  },
  loansGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
    justifyContent: 'flex-start',
  },
  loanItem: {
    width: '30%',
    height: 110,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFF',
    padding: 12,
    shadowColor: '#8F31F9',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
    justifyContent: 'space-between',
  },
  loanIconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  loanIcon: {
    width: 70,
    height: 70,
  },
  loansDownArrow: {
    alignSelf: 'center',
    top: 16,
    padding: 8,
  },
  taxCard: {
    backgroundColor: '#FBFBFB',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFF',
    padding: 0,
    shadowColor: '#8F31F9',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    overflow: 'hidden',
    width: '100%',
    maxWidth: 450,
    alignSelf: 'center',
    marginBottom: 20,
  },
  taxContent: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 110,
  },
  taxTextSection: {
    flex: 1,
    padding: 20,
  },
  taxTitle: {
    color: '#1A1B20',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 6,
    fontFamily: 'Rubik-SemiBold',
  },
  taxSubtitle: {
    color: '#7D7D7D',
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
    paddingRight: 10,
    fontFamily: 'Rubik-Regular',
  },
  taxImageSection: {
    width: 120,
    height: 100,
  },
  taxImageBackground: {
    flex: 1,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  taxIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  taxVectorBackground: {
    width: 150,
    height: 120,
    position: 'absolute',
    opacity: 0.6,
    left: -25,
    top: -10,
    bottom: -10,
  },
  taxMainIcon: {
    width: 80,
    height: 80,
    position: 'absolute',
    zIndex: 2,
    right:30
  },
  taxArrow: {
    position: 'absolute',
    top: -5,
    right: 10,
    // backgroundColor: 'rgba(255, 255, 255, 0.9)',
    // borderRadius: 12,
    padding: 4,
    // elevation: 1,
    zIndex: 3,
  },
  travelCard: {
    backgroundColor: '#FBFBFB',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFF',
    padding: 20,
    shadowColor: '#8F31F9',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    marginBottom: 20,
  },
  travelOptions: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 20,
  },
  travelOption: {
    flex: 1,
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: 'rgba(143, 49, 249, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 3,
  },
  travelOptionGradient: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 10,
  },
  travelArrow: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    padding: 4,
    marginBottom: 8,
  },
  travelIconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 15,
  },
  travelIcon: {
    width: 90,
    height: 90,
  },
  internationalTravelIcon: {
    position: 'relative',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  globe: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  globeGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  globePattern: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    top: 8,
    left: 8,
  },
  airplane: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 28,
    height: 28,
    borderRadius: 14,
    overflow: 'hidden',
  },
  airplaneGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '45deg' }],
  },
  domesticTravelIcon: {
    width: 50,
    height: 50,
    borderRadius: 8,
    overflow: 'hidden',
  },
  suitcaseGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    padding: 8,
  },
  suitcaseBody: {
    width: 30,
    height: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 3,
    marginBottom: 2,
  },
  suitcaseHandle: {
    width: 12,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 3,
    position: 'absolute',
    top: 6,
    alignSelf: 'center',
  },
  suitcaseLines: {
    position: 'absolute',
    top: 14,
    left: 13,
    gap: 2,
  },
  suitcaseLine: {
    width: 16,
    height: 1,
    backgroundColor: 'rgba(245, 158, 11, 0.6)',
  },
  travelOptionTitle: {
    color: '#1A1B20',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
    textAlign: 'left',
    marginTop: 5,
    fontFamily: 'Rubik-SemiBold',
  },
  statsCard: {
    backgroundColor: '#FBFBFB',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFF',
    padding: 20,
    shadowColor: '#8F31F9',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    marginBottom: 20,
  },
  statsTitle: {
    color: '#1A1B20',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'left',
    marginBottom: 20,
    fontFamily: 'Rubik-SemiBold',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 27,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIconContainer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIcon: {
    width: 50,
    height: 50,
  },
  usersIcon: {
    width: 45,
    height: 32,
    position: 'relative',
  },
  userCircleBlue1: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  userCircleBlue2: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  userCircleYellow: {
    position: 'absolute',
    top: 0,
    left: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    overflow: 'hidden',
    zIndex: 2,
  },
  userCircleOrange: {
    position: 'absolute',
    top: 0,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    overflow: 'hidden',
    zIndex: 1,
  },
  userGradient: {
    flex: 1,
    borderRadius: 8,
  },
  trophyIcon: {
    width: 32,
    height: 36,
    borderRadius: 8,
    overflow: 'hidden',
  },
  trophyGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  trophyBody: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
    marginBottom: 2,
    paddingVertical: 4,
    width: '80%',
  },
  trophyStar: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    padding: 3,
  },
  trophyBase: {
    width: 20,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 2,
    marginBottom: 1,
  },
  trophyStand: {
    width: 12,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 1,
  },
  handshakeIcon: {
    width: 32,
    height: 20,
    flexDirection: 'row',
    borderRadius: 4,
    overflow: 'hidden',
  },
  handGradient1: {
    flex: 1,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  handGradient2: {
    flex: 1,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  statNumber: {
    color: '#1A1B20',
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 4,
    fontFamily: 'Rubik-Medium',
  },
  statLabel: {
    color: '#7D7D7D',
    fontSize: 10,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 12,
    fontFamily: 'Rubik-Regular',
  },
  bottomImage: {
    width: '100%',
    height: 312,
    resizeMode: 'contain',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 40,
    width: 60,
    height: 60,
    borderRadius: 30,
    shadowColor: '#1187FE',
    shadowOffset: { width: 0, height: 3.077 },
    shadowOpacity: 0.5,
    shadowRadius: 7.692,
    elevation: 8,
  },
  fabIcon: {
    flex: 1,
    backgroundColor: '#1187FE',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabImage: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
    marginTop: 5
  },
  categoryOverlay: {
    position: 'absolute',
    backgroundColor: 'transparent',
    zIndex: 10,
  },

  // Search styles
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  searchingIndicator: {
    padding: 4,
    marginLeft: 8,
  },
  searchDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    maxHeight: 300,
    zIndex: 9999,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  dropdownScrollView: {
    maxHeight: 280,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F8F8',
  },
  dropdownItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownItemInfo: {
    flex: 1,
    marginRight: 12,
  },
  dropdownItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1B20',
    fontFamily: 'Rubik-SemiBold',
  },
  dropdownItemCategory: {
    fontSize: 12,
    color: '#8F31F9',
    fontWeight: '500',
    fontFamily: 'Rubik-Medium',
    marginTop: 2,
  },
  dropdownItemArrow: {
    marginLeft: 8,
  },
  dropdownNoResults: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  dropdownNoResultsText: {
    fontSize: 14,
    color: '#7D7D7D',
    marginLeft: 8,
    fontFamily: 'Rubik-Regular',
  },
  dropdownBackdrop: {
    position: 'absolute',
    top: '100%',
    left: -25,
    right: -25,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 9998,
  },
  categoryTouchable: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
  },
});

export default HomeScreen;
