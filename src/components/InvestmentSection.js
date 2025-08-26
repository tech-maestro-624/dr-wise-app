import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  StyleSheet,
  Easing
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const InvestmentSection = () => {
  const [isInvestmentExpanded, setIsInvestmentExpanded] = useState(false);
  
  // Animation values for investment items
  const investmentHeightAnimated = useRef(new Animated.Value(0)).current;
  const goldAnimatedValue = useRef(new Animated.Value(0)).current;
  const bondAnimatedValue = useRef(new Animated.Value(0)).current;
  const fixedAnimatedValue = useRef(new Animated.Value(0)).current;
  const mutualFundAnimatedValue = useRef(new Animated.Value(0)).current;

  const toggleInvestmentExpansion = () => {
    if (isInvestmentExpanded) {
      // Collapse animation
      Animated.parallel([
        Animated.timing(investmentHeightAnimated, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.timing(goldAnimatedValue, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(bondAnimatedValue, {
          toValue: 0,
          duration: 200,
          delay: 25,
          useNativeDriver: false,
        }),
        Animated.timing(fixedAnimatedValue, {
          toValue: 0,
          duration: 200,
          delay: 50,
          useNativeDriver: false,
        }),
        Animated.timing(mutualFundAnimatedValue, {
          toValue: 0,
          duration: 200,
          delay: 75,
          useNativeDriver: false,
        }),
      ]).start(() => {
        setIsInvestmentExpanded(false);
      });
    } else {
      // Expand animation
      setIsInvestmentExpanded(true);
      Animated.parallel([
        Animated.timing(investmentHeightAnimated, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.timing(goldAnimatedValue, {
          toValue: 1,
          duration: 400,
          delay: 150,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: false,
        }),
        Animated.timing(bondAnimatedValue, {
          toValue: 1,
          duration: 400,
          delay: 175,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: false,
        }),
        Animated.timing(fixedAnimatedValue, {
          toValue: 1,
          duration: 400,
          delay: 200,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: false,
        }),
        Animated.timing(mutualFundAnimatedValue, {
          toValue: 1,
          duration: 400,
          delay: 225,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: false,
        }),
      ]).start();
    }
  };

  return (
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
          {/* Always visible first row */}
          {/* Trading Card */}
          <LinearGradient
            colors={['#FBFBFB', '#FFF4E6']}
            style={styles.investmentItem}
          >
            <Text style={styles.itemTitle}>Trading</Text>
            <View style={styles.investmentIconContainer}>
              <Image 
                source={require('../../assets/Icons/investmentsTrading.png')} 
                style={styles.investmentIcon}
                resizeMode="contain"
              />
            </View>
          </LinearGradient>

          {/* NPS Card */}
          <LinearGradient
            colors={['#FBFBFB', '#FFF4E6']}
            style={styles.investmentItem}
          >
            <Text style={styles.itemTitle}>NPS</Text>
            <View style={styles.investmentIconContainer}>
              <Image 
                source={require('../../assets/Icons/npsInsurance.png')} 
                style={styles.investmentIcon}
                resizeMode="contain"
              />
            </View>
          </LinearGradient>

          {/* LAS Card */}
          <LinearGradient
            colors={['#FBFBFB', '#FFF4E6']}
            style={styles.investmentItem}
          >
            <Text style={styles.itemTitle}>LAS</Text>
            <View style={styles.investmentIconContainer}>
              <Image 
                source={require('../../assets/Icons/LASInvestments.png')} 
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

              {/* BOND Card */}
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
                <Text style={styles.itemTitle}>BOND</Text>
                <View style={styles.investmentIconContainer}>
                  <Image 
                    source={require('../../assets/Icons/bondInv.png')} 
                    style={styles.investmentIcon}
                    resizeMode="contain"
                  />
                </View>
              </AnimatedLinearGradient>

              {/* Fixed Card */}
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
                <Text style={styles.itemTitle}>Fixed</Text>
                <View style={styles.investmentIconContainer}>
                  <Image 
                    source={require('../../assets/Icons/fixedInv.png')} 
                    style={styles.investmentIcon}
                    resizeMode="contain"
                  />
                </View>
              </AnimatedLinearGradient>

              {/* Mutual Fund Card */}
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
                <Text style={styles.itemTitle}>Mutual Fund</Text>
                <View style={styles.investmentIconContainer}>
                  <Image 
                    source={require('../../assets/Icons/mutualFund.png')} 
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
  );
};

const styles = StyleSheet.create({
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
    marginRight: 15,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1B20',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#7D7D7D',
    lineHeight: 20,
  },
  sectionArrow: {
    padding: 5,
  },
  arrowOuterCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  investmentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  investmentItem: {
    width: '48%',
    height: 100,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1B20',
  },
  investmentIconContainer: {
    alignSelf: 'flex-end',
    marginTop: 'auto',
  },
  investmentIcon: {
    width: 32,
    height: 32,
  },
  investmentDownArrow: {
    alignSelf: 'center',
    padding: 8,
    marginTop: 10,
  },
});

export default InvestmentSection;
