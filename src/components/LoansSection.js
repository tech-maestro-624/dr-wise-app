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

const LoansSection = () => {
  const [isLoansExpanded, setIsLoansExpanded] = useState(false);
  
  // Animation values for loans items
  const loansHeightAnimated = useRef(new Animated.Value(0)).current;
  const homeLoanAnimatedValue = useRef(new Animated.Value(0)).current;

  const toggleLoansExpansion = () => {
    if (isLoansExpanded) {
      // Collapse animation
      Animated.parallel([
        Animated.timing(loansHeightAnimated, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.timing(homeLoanAnimatedValue, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start(() => {
        setIsLoansExpanded(false);
      });
    } else {
      // Expand animation
      setIsLoansExpanded(true);
      Animated.parallel([
        Animated.timing(loansHeightAnimated, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.timing(homeLoanAnimatedValue, {
          toValue: 1,
          duration: 400,
          delay: 150,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: false,
        }),
      ]).start();
    }
  };

  return (
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
          <TouchableOpacity style={styles.sectionArrow}>
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
          {/* Always visible first row (3 items) */}
          {/* Business Loan Card */}
          <LinearGradient
            colors={['#FBFBFB', '#FCE4EC']}
            style={styles.loanItem}
          >
            <Text style={styles.itemTitle}>Business Loan</Text>
            <View style={styles.loanIconContainer}>
              <Image 
                source={require('../../assets/Icons/businessLoans.png')} 
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

          {/* Animated additional item - only visible when expanded */}
          {isLoansExpanded && (
            /* Home Loan Card */
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
              <Text style={styles.itemTitle}>Home Loan</Text>
              <View style={styles.loanIconContainer}>
                <Image 
                  source={require('../../assets/Icons/propertyLoans.png')} 
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
  loansGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  loanItem: {
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
  loanIconContainer: {
    alignSelf: 'flex-end',
    marginTop: 'auto',
  },
  loanIcon: {
    width: 32,
    height: 32,
  },
  loansDownArrow: {
    alignSelf: 'center',
    padding: 8,
    marginTop: 10,
  },
});

export default LoansSection;
