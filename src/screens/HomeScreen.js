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
  FlatList,
  Easing
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, radii, type } from '../theme/tokens';
import BottomBar from '../components/BottomBar';

const { width: W } = Dimensions.get('window');
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

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

const HomeScreen = () => {
  const navigation = useNavigation();
  const [active, setActive] = useState('all');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isInsuranceExpanded, setIsInsuranceExpanded] = useState(false);
  const [isInvestmentExpanded, setIsInvestmentExpanded] = useState(false);
  const [isLoansExpanded, setIsLoansExpanded] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const sliderRef = useRef(null);
  
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

  const onSliderViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentSlide(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const toggleInsuranceExpansion = () => {
    if (!isInsuranceExpanded) {
      // Expand animation
      setIsInsuranceExpanded(true);
      
      // Animate container height
      Animated.timing(insuranceHeightAnimated, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
      
      // Animate General item from top-right
      Animated.timing(generalAnimatedValue, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
      
      // Animate Travel item from top-right with slight delay
      Animated.timing(travelAnimatedValue, {
        toValue: 1,
        duration: 600,
        delay: 50,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      // Collapse animation
      Animated.parallel([
        Animated.timing(insuranceHeightAnimated, {
          toValue: 0,
          duration: 400,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.timing(generalAnimatedValue, {
          toValue: 0,
          duration: 400,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(travelAnimatedValue, {
          toValue: 0,
          duration: 400,
          delay: 50,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        })
      ]).start(() => {
        setIsInsuranceExpanded(false);
      });
    }
  };

  const toggleInvestmentExpansion = () => {
    if (!isInvestmentExpanded) {
      // Expand animation
      setIsInvestmentExpanded(true);
      
      // Animate container height
      Animated.timing(investmentHeightAnimated, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
      
      // Animate items from top-right with staggered delays
      Animated.timing(goldAnimatedValue, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
      
      Animated.timing(bondAnimatedValue, {
        toValue: 1,
        duration: 600,
        delay: 100,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
      
      Animated.timing(fixedAnimatedValue, {
        toValue: 1,
        duration: 600,
        delay: 200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
      
      Animated.timing(mutualFundAnimatedValue, {
        toValue: 1,
        duration: 600,
        delay: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      // Collapse animation
      Animated.parallel([
        Animated.timing(investmentHeightAnimated, {
          toValue: 0,
          duration: 400,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.timing(goldAnimatedValue, {
          toValue: 0,
          duration: 400,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(bondAnimatedValue, {
          toValue: 0,
          duration: 400,
          delay: 50,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(fixedAnimatedValue, {
          toValue: 0,
          duration: 400,
          delay: 100,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(mutualFundAnimatedValue, {
          toValue: 0,
          duration: 400,
          delay: 150,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        })
      ]).start(() => {
        setIsInvestmentExpanded(false);
      });
    }
  };

  const toggleLoansExpansion = () => {
    if (!isLoansExpanded) {
      // Expand animation
      setIsLoansExpanded(true);
      
      // Animate container height
      Animated.timing(loansHeightAnimated, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
      
      // Animate only Home Loan from top-right
      Animated.timing(homeLoanAnimatedValue, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      // Collapse animation
      Animated.parallel([
        Animated.timing(loansHeightAnimated, {
          toValue: 0,
          duration: 400,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.timing(homeLoanAnimatedValue, {
          toValue: 0,
          duration: 400,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        })
      ]).start(() => {
        setIsLoansExpanded(false);
      });
    }
  };

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
                <TouchableOpacity style={styles.sectionArrow}>
                  <View style={styles.arrowCircle}>
                    <Ionicons name="arrow-up-outline" size={20} color="#1D8C7C" style={{ transform: [{ rotate: '45deg' }] }} />
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
                {/* Always visible first row */}
                {/* Life Card */}
                <LinearGradient
                  colors={['#FBFBFB', '#E6FFF1']}
                  style={styles.insuranceItem}
                >
                  <Text style={styles.itemTitle}>Life</Text>
                  <View style={styles.insuranceIconContainer}>
                    <Image 
                      source={require('../../assets/Icons/umbrella.png')} 
                      style={styles.insuranceIcon}
                      resizeMode="contain"
                    />
                  </View>
                </LinearGradient>

                {/* Health Card */}
                <LinearGradient
                  colors={['#FBFBFB', '#E6FFF1']}
                  style={styles.insuranceItem}
                >
                  <Text style={styles.itemTitle}>Health</Text>
                  <View style={styles.insuranceIconContainer}>
                    <Image 
                      source={require('../../assets/Icons/heartInsurance.png')} 
                      style={styles.insuranceIcon}
                      resizeMode="contain"
                    />
                  </View>
                </LinearGradient>

                {/* Motor Card */}
                <LinearGradient
                  colors={['#FBFBFB', '#E6FFF1']}
                  style={styles.insuranceItem}
                >
                  <Text style={styles.itemTitle}>Motor</Text>
                  <View style={styles.insuranceIconContainer}>
                    <Image 
                      source={require('../../assets/Icons/steeringwheel.png')} 
                      style={styles.insuranceIcon}
                      resizeMode="contain"
                    />
                  </View>
                </LinearGradient>

                {/* Animated second row - only visible when expanded */}
                {isInsuranceExpanded && (
                  <>
                    {/* General Card */}
                    <AnimatedLinearGradient
                      colors={['#FBFBFB', '#E6FFF1']}
                      style={[
                        styles.insuranceItem,
                        {
                          transform: [
                            {
                              translateX: generalAnimatedValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [200, 0], // Start from right
                              }),
                            },
                            {
                              translateY: generalAnimatedValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [-100, 0], // Start from top
                              }),
                            },
                            {
                              scale: generalAnimatedValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.3, 1], // Scale up
                              }),
                            },
                          ],
                          opacity: generalAnimatedValue,
                        }
                      ]}
                    >
                      <Text style={styles.itemTitle}>General</Text>
                      <View style={styles.insuranceIconContainer}>
                        <Image 
                          source={require('../../assets/Icons/generalInsurance.png')} 
                          style={styles.insuranceIcon}
                          resizeMode="contain"
                        />
                      </View>
                    </AnimatedLinearGradient>

                    {/* Travel Card */}
                    <AnimatedLinearGradient
                      colors={['#FBFBFB', '#E6FFF1']}
                      style={[
                        styles.insuranceItem,
                        {
                          transform: [
                            {
                              translateX: travelAnimatedValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [200, 0], // Start from right
                              }),
                            },
                            {
                              translateY: travelAnimatedValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [-100, 0], // Start from top
                              }),
                            },
                            {
                              scale: travelAnimatedValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.3, 1], // Scale up
                              }),
                            },
                          ],
                          opacity: travelAnimatedValue,
                        }
                      ]}
                    >
                      <Text style={styles.itemTitle}>Travel</Text>
                      <View style={styles.insuranceIconContainer}>
                        <Image 
                          source={require('../../assets/Icons/planeInsurance.png')} 
                          style={styles.insuranceIcon}
                          resizeMode="contain"
                        />
                      </View>
                    </AnimatedLinearGradient>
                  </>
                )}
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

          {/* Tax Section */}
          <View style={styles.taxCard}>
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

          {/* Investment Section */}
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
                <TouchableOpacity style={styles.sectionArrow}>
                  <View style={[styles.arrowCircle, { backgroundColor: '#F6AC11' }]}>
                    <Ionicons name="arrow-up-outline" size={20} color="#FFFFFF" style={{ transform: [{ rotate: '45deg' }] }} />
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
                {/* Always visible first row */}
                {/* Mutual Fund Card */}
                <LinearGradient
                  colors={['#FBFBFB', '#FFF4E6']}
                  style={styles.investmentItem}
                >
                  <Text style={styles.itemTitle}>Mutual Fund</Text>
                  <View style={styles.investmentIconContainer}>
                    <Image 
                      source={require('../../assets/Icons/mutualFund.png')} 
                      style={styles.investmentIcon}
                      resizeMode="contain"
                    />
                  </View>
                </LinearGradient>

                {/* Fixed Card */}
                <LinearGradient
                  colors={['#FBFBFB', '#FFF4E6']}
                  style={styles.investmentItem}
                >
                  <Text style={styles.itemTitle}>Fixed</Text>
                  <View style={styles.investmentIconContainer}>
                    <Image 
                      source={require('../../assets/Icons/fixedInv.png')} 
                      style={styles.investmentIcon}
                      resizeMode="contain"
                    />
                  </View>
                </LinearGradient>

                {/* BOND Card */}
                <LinearGradient
                  colors={['#FBFBFB', '#FFF4E6']}
                  style={styles.investmentItem}
                >
                  <Text style={styles.itemTitle}>BOND</Text>
                  <View style={styles.investmentIconContainer}>
                    <Image 
                      source={require('../../assets/Icons/bondInv.png')} 
                      style={styles.investmentIcon}
                      resizeMode="contain"
                    />
                  </View>
                </LinearGradient>

                {/* Animated additional items - only visible when expanded */}
                {isInvestmentExpanded && (
                  <>
                    {/* Gold Card */}
                    <AnimatedLinearGradient
                      colors={['#FBFBFB', '#FFF4E6']}
                      style={[
                        styles.investmentItem,
                        {
                          transform: [
                            {
                              translateX: goldAnimatedValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [200, 0],
                              }),
                            },
                            {
                              translateY: goldAnimatedValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [-100, 0],
                              }),
                            },
                            {
                              scale: goldAnimatedValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.3, 1],
                              }),
                            },
                          ],
                          opacity: goldAnimatedValue,
                        }
                      ]}
                    >
                      <Text style={styles.itemTitle}>Gold</Text>
                      <View style={styles.investmentIconContainer}>
                        <Image 
                          source={require('../../assets/Icons/goldInv.png')} 
                          style={styles.investmentIcon}
                          resizeMode="contain"
                        />
                      </View>
                    </AnimatedLinearGradient>

                    {/* LAS Card */}
                    <AnimatedLinearGradient
                      colors={['#FBFBFB', '#FFF4E6']}
                      style={[
                        styles.investmentItem,
                        {
                          transform: [
                            {
                              translateX: bondAnimatedValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [200, 0],
                              }),
                            },
                            {
                              translateY: bondAnimatedValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [-100, 0],
                              }),
                            },
                            {
                              scale: bondAnimatedValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.3, 1],
                              }),
                            },
                          ],
                          opacity: bondAnimatedValue,
                        }
                      ]}
                    >
                      <Text style={styles.itemTitle}>LAS</Text>
                      <View style={styles.investmentIconContainer}>
                        <Image 
                          source={require('../../assets/Icons/LASInvestments.png')} 
                          style={styles.investmentIcon}
                          resizeMode="contain"
                        />
                      </View>
                    </AnimatedLinearGradient>

                    {/* NPS Card */}
                    <AnimatedLinearGradient
                      colors={['#FBFBFB', '#FFF4E6']}
                      style={[
                        styles.investmentItem,
                        {
                          transform: [
                            {
                              translateX: fixedAnimatedValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [200, 0],
                              }),
                            },
                            {
                              translateY: fixedAnimatedValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [-100, 0],
                              }),
                            },
                            {
                              scale: fixedAnimatedValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.3, 1],
                              }),
                            },
                          ],
                          opacity: fixedAnimatedValue,
                        }
                      ]}
                    >
                      <Text style={styles.itemTitle}>NPS</Text>
                      <View style={styles.investmentIconContainer}>
                        <Image 
                          source={require('../../assets/Icons/npsInsurance.png')} 
                          style={styles.investmentIcon}
                          resizeMode="contain"
                        />
                      </View>
                    </AnimatedLinearGradient>

                    {/* Trading Card */}
                    <AnimatedLinearGradient
                      colors={['#FBFBFB', '#FFF4E6']}
                      style={[
                        styles.investmentItem,
                        {
                          transform: [
                            {
                              translateX: mutualFundAnimatedValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [200, 0],
                              }),
                            },
                            {
                              translateY: mutualFundAnimatedValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [-100, 0],
                              }),
                            },
                            {
                              scale: mutualFundAnimatedValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.3, 1],
                              }),
                            },
                          ],
                          opacity: mutualFundAnimatedValue,
                        }
                      ]}
                    >
                      <Text style={styles.itemTitle}>Trading</Text>
                      <View style={styles.investmentIconContainer}>
                        <Image 
                          source={require('../../assets/Icons/investmentsTrading.png')} 
                          style={styles.investmentIcon}
                          resizeMode="contain"
                        />
                      </View>
                    </AnimatedLinearGradient>
                  </>
                )}
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

          {/* Loans Section */}
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
                {/* Always visible first row (3 items) */}
                {/* Home Loan Card */}
                <LinearGradient
                  colors={['#FBFBFB', '#FCE4EC']}
                  style={styles.loanItem}
                >
                  <Text style={styles.itemTitle}>Home Loan</Text>
                  <View style={styles.loanIconContainer}>
                    <Image 
                      source={require('../../assets/Icons/propertyLoans.png')} 
                      style={styles.loanIcon}
                      resizeMode="contain"
                    />
                  </View>
                </LinearGradient>

                {/* Personal Loans Card */}
                <LinearGradient
                  colors={['#FBFBFB', '#FCE4EC']}
                  style={styles.loanItem}
                >
                  <Text style={styles.itemTitle}>Personal Loans</Text>
                  <View style={styles.loanIconContainer}>
                    <Image 
                      source={require('../../assets/Icons/personalLoans.png')} 
                      style={styles.loanIcon}
                      resizeMode="contain"
                    />
                  </View>
                </LinearGradient>

                {/* Mortgage Loan Card */}
                <LinearGradient
                  colors={['#FBFBFB', '#FCE4EC']}
                  style={styles.loanItem}
                >
                  <Text style={styles.itemTitle}>Mortgage Loan</Text>
                  <View style={styles.loanIconContainer}>
                    <Image 
                      source={require('../../assets/Icons/loansSection.png')} 
                      style={styles.loanIcon}
                      resizeMode="contain"
                    />
                  </View>
                </LinearGradient>

                {/* Animated additional item - only visible when expanded */}
                {isLoansExpanded && (
                  /* Business Loan Card */
                  <AnimatedLinearGradient
                    colors={['#FBFBFB', '#FCE4EC']}
                    style={[
                      styles.loanItem,
                      {
                        transform: [
                          {
                            translateX: homeLoanAnimatedValue.interpolate({
                              inputRange: [0, 1],
                              outputRange: [200, 0],
                            }),
                          },
                          {
                            translateY: homeLoanAnimatedValue.interpolate({
                              inputRange: [0, 1],
                              outputRange: [-100, 0],
                            }),
                          },
                          {
                            scale: homeLoanAnimatedValue.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0.3, 1],
                            }),
                          },
                        ],
                        opacity: homeLoanAnimatedValue,
                      }
                    ]}
                  >
                    <Text style={styles.itemTitle}>Business Loan</Text>
                    <View style={styles.loanIconContainer}>
                      <Image 
                        source={require('../../assets/Icons/businessLoans.png')} 
                        style={styles.loanIcon}
                        resizeMode="contain"
                      />
                    </View>
                  </AnimatedLinearGradient>
                )}
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

          {/* Travel Section */}
          <View style={styles.travelCard}>
            <Text style={styles.sectionTitle}>Travel</Text>
            <Text style={styles.sectionSubtitle}>Share the best travel deals and earn when someone books through your link.</Text>
            
            <View style={styles.travelOptions}>
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

          {/* Statistics Section */}
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
});

export default HomeScreen;
