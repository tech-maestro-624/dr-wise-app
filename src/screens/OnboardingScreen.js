import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Image,
  Animated,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// ========================================================================
// DATA FOR THE ENTIRE ONBOARDING FLOW (with corrected paths)
// ========================================================================
const ONBOARDING_SCREENS = [
  { image: null, title: 'All-in-One Financial Hub', subtitle: 'From insurance to travel — access 10+ services in one app.' },
  { image: require('/Users/bhoomika/Desktop/drwise_b_a/drwise-app/assets/Icons/financial_hub.png'), title: 'All-in-One Financial Hub', subtitle: 'From insurance to travel — access 10+ services in one app.' },
  { image: null, title: 'Refer People, Earn Cash', subtitle: 'Invite others and earn every time they use a service.' },
  { image: require('/Users/bhoomika/Desktop/drwise_b_a/drwise-app/assets/Icons/cash.png'), title: 'Refer People, Earn Cash', subtitle: 'Invite others and earn every time they use a service.' },
  { image: null, title: 'Start Earning Your Way', subtitle: 'Become an affiliate or ambassador and grow your income.' },
  { image: require('/Users/bhoomika/Desktop/drwise_b_a/drwise-app/assets/Icons/earning.png'), title: 'Start Earning Your Way', subtitle: 'Become an affiliate or ambassador and grow your income.' },
];

// ========================================================================
// 1. SPLASH SCREEN COMPONENT & ASSETS (Updated to match Figma design)
// ========================================================================

// *** THIS IS THE UPDATED SPLASH SCREEN ***
const SplashScreen = () => (
  <View style={styles.container}>
    <StatusBar barStyle="light-content" />
    <LinearGradient colors={['#8F31F9', '#521B90']} style={styles.gradient}>
      {/* Background Image - positioned as per Figma design */}
      <Image
       source={require('/Users/bhoomika/Desktop/drwise_b_a/drwise-app/assets/background_image.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      
      {/* Vector Pattern with gradient background - positioned exactly like CSS */}
      <View style={styles.vectorPatternContainer}>
        <LinearGradient
          colors={['rgba(150, 61, 251, 0)', 'rgba(150, 61, 251, 0.05)']}
          locations={[0.334, 0.7699]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.vectorGradient}
        >
          <Image
            source={require('/Users/bhoomika/Desktop/drwise_b_a/drwise-app/assets/vector_pattern.svg')}
            style={styles.vectorPattern}
            resizeMode="cover"
          />
        </LinearGradient>
      </View>
      
      <SafeAreaView style={styles.splashSafeArea}>
        {/* Empty container - logo and tagline removed */}
      </SafeAreaView>
    </LinearGradient>
  </View>
);

const FaintTrianglePattern = () => {
  const patternHeight = screenHeight;
  const triangleSize = 40;
  const hSpacing = triangleSize * 2;
  const vSpacing = triangleSize * 1.732;
  const numCols = Math.ceil(screenWidth / hSpacing) + 1;
  const numRows = Math.ceil(patternHeight / vSpacing);
  const triangles = [];

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      const xOffset = row % 2 === 0 ? 0 : hSpacing / 2;
      const x = col * hSpacing - hSpacing + xOffset;
      const y = row * vSpacing;
      const pathData = `M${x} ${y + triangleSize} L${x + triangleSize / 2} ${y} L${x + triangleSize} ${y + triangleSize} Z`;
      triangles.push(<Path key={`${row}-${col}`} d={pathData} fill="rgba(150, 61, 251, 0.05)" />);
    }
  }
  return <View style={StyleSheet.absoluteFill}><Svg height="100%" width="100%">{triangles}</Svg></View>;
};

// ========================================================================
// 2. ANIMATED ONBOARDING CONTENT COMPONENT (No changes needed)
// ========================================================================
const OnboardingContentScreen = ({ onNext, onBack, currentIndex, isLastScreen }) => {
    // ... code for this component remains the same
    return null; // Abridged for clarity, the full code from previous step is correct
};

// ========================================================================
// 3. PARENT COMPONENT: Controls the flow state (No changes needed)
// ========================================================================
const OnboardingFlow = ({ navigation }) => {
    // ... code for this component remains the same
    return null; // Abridged for clarity, the full code from previous step is correct
};


// The full code with all components integrated:
// ... (The rest of your OnboardingScreen.js file goes here, but with updated styles)

// ========================================================================
// 4. FULL INTEGRATED CODE
// ========================================================================

const OnboardingFlowWithAllComponents = ({ navigation }) => {
  const [showSplash, setShowSplash] = useState(true);
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    if (currentScreenIndex < ONBOARDING_SCREENS.length - 1) {
      setCurrentScreenIndex(currentScreenIndex + 1);
    } else {
      navigation.navigate('Login');
    }
  };

  const handleBack = () => {
    if (currentScreenIndex > 0) {
      setCurrentScreenIndex(currentScreenIndex - 1);
    }
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <OnboardingContentScreenComponent
      currentIndex={currentScreenIndex}
      onNext={handleNext}
      onBack={handleBack}
      isLastScreen={currentScreenIndex === ONBOARDING_SCREENS.length - 1}
    />
  );
};


const OnboardingContentScreenComponent = ({ onNext, onBack, currentIndex, isLastScreen }) => {
  const [content, setContent] = useState(ONBOARDING_SCREENS[currentIndex]);
  const [displayedImage, setDisplayedImage] = useState(ONBOARDING_SCREENS[currentIndex].image);

  // Memoize the current screen data to prevent unnecessary re-renders
  const currentScreenData = useMemo(() => ONBOARDING_SCREENS[currentIndex], [currentIndex]);

  const imageAnim = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(1)).current;

  const animateTransition = useCallback((newScreenData, newImage) => {
    const animateOut = Animated.timing(imageAnim, {
      toValue: -screenHeight * 0.5,
      duration: 300,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    });

    const animateIn = Animated.timing(imageAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    });

    const fadeOutText = Animated.timing(contentOpacity, { toValue: 0, duration: 150, useNativeDriver: true });
    const fadeInText = Animated.timing(contentOpacity, { toValue: 1, duration: 250, useNativeDriver: true });
    
    if (displayedImage) {
      animateOut.start(() => {
        setDisplayedImage(newImage);
        if (newImage) {
          imageAnim.setValue(screenHeight * 0.5);
          animateIn.start();
        }
        fadeOutText.start(() => {
          setContent(newScreenData);
          fadeInText.start();
        });
      });
    } else {
      setDisplayedImage(newImage);
      if (newImage) {
        imageAnim.setValue(screenHeight * 0.5);
        animateIn.start();
      }
      fadeOutText.start(() => {
        setContent(newScreenData);
        fadeInText.start();
      });
    }
  }, [displayedImage, imageAnim, contentOpacity]);

  useEffect(() => {
    const newImage = currentScreenData.image;
    animateTransition(currentScreenData, newImage);
  }, [currentIndex, animateTransition, currentScreenData]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={['#F3ECFE', '#F6F6FE']} locations={[0, 0.49]} style={styles.gradient}>
        <FaintTrianglePattern />
        <SafeAreaView style={styles.mainSafeArea}>
          <View style={styles.topNav}>
            <TouchableOpacity onPress={onBack} style={styles.navButton}><Ionicons name="chevron-back" size={24} color="#1A1B20" /></TouchableOpacity>
            <TouchableOpacity><Text style={styles.skipText}>Skip &gt;</Text></TouchableOpacity>
          </View>

          {displayedImage && (
            <Animated.View style={[styles.imageContainer, { transform: [{ translateY: imageAnim }] }]}>
              <Image source={displayedImage} style={styles.image} resizeMode="contain" />
            </Animated.View>
          )}

          <View style={styles.card}>
            <Animated.View style={{ opacity: contentOpacity }}>
              <Text style={styles.cardTitle}>{content.title}</Text>
              <Text style={styles.cardSubtitle}>{content.subtitle}</Text>
            </Animated.View>
            <View style={styles.cardFooter}>
              <View style={styles.pagination}>
                {ONBOARDING_SCREENS.map((_, index) => (
                  <View key={index} style={[styles.dot, index === currentIndex && styles.dotActive]} />
                ))}
              </View>
              {isLastScreen ? (
                <TouchableOpacity onPress={onNext} style={styles.getStartedButton}><Text style={styles.getStartedButtonText}>Get Started</Text></TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={onNext} style={styles.nextButton}><Ionicons name="arrow-forward" size={24} color="#FBFBFB" /></TouchableOpacity>
              )}
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

export default OnboardingFlowWithAllComponents;


// ========================================================================
// 5. STYLES (Updated with new logo styles)
// ========================================================================
const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  splashSafeArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  // Styles for the splash screen - matching Figma design exactly
  backgroundImage: {
    position: 'absolute',
    width: 297,
    height: 297,
    left: 39,
    top: 188,
  },
  vectorPatternContainer: {
    position: 'absolute',
    width: 811,
    height: 659,
    left: (screenWidth - 811) / 2, // calc(50% - 811px/2)
    bottom: 313,
    // background: linear-gradient(216.27deg, rgba(150, 61, 251, 0) 33.4%, rgba(150, 61, 251, 0.05) 76.99%);
  },
  vectorGradient: {
    width: '100%',
    height: '100%',
  },
  vectorPattern: {
    width: '100%',
    height: '100%',
    opacity: 1, // Full opacity since gradient handles transparency
  },
  mainSafeArea: { flex: 1 },
  topNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 10, height: 44, zIndex: 10 },
  navButton: { padding: 5 },
  skipText: { fontFamily: 'Rubik-Medium', fontSize: 16, color: '#1A1B20' },
  imageContainer: { position: 'absolute', top: 130, left: 0, right: 0, alignItems: 'center', justifyContent: 'center', height: 280, zIndex: 0 },
  image: { width: '90%', height: '100%' },
  card: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#FBFBFB',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
    shadowColor: 'rgba(143, 49, 249, 0.1)',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 1,
  },
  cardTitle: { fontFamily: 'Rubik-Medium', fontSize: 24, lineHeight: 28, textAlign: 'center', color: '#1A1B20', marginBottom: 8 },
  cardSubtitle: { fontFamily: 'Rubik-Regular', fontSize: 18, lineHeight: 28, textAlign: 'center', color: '#7D7D7D', letterSpacing: 0.2, marginBottom: 38 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pagination: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#1A1B20', opacity: 0.1, marginHorizontal: 3 },
  dotActive: { width: 31.5, backgroundColor: '#8F31F9', opacity: 1 },
  nextButton: { width: 47, height: 47, borderRadius: 8, backgroundColor: '#8F31F9', justifyContent: 'center', alignItems: 'center' },
  getStartedButton: { backgroundColor: '#8F31F9', borderRadius: 8, paddingVertical: 14, paddingHorizontal: 35, justifyContent: 'center', alignItems: 'center' },
  getStartedButtonText: { color: '#FBFBFB', fontFamily: 'Rubik-SemiBold', fontSize: 16, letterSpacing: 0.2 },
});
