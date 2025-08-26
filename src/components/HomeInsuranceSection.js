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

const HomeInsuranceSection = () => {
  const [isInsuranceExpanded, setIsInsuranceExpanded] = useState(false);
  
  // Animation values for insurance items
  const insuranceHeightAnimated = useRef(new Animated.Value(0)).current;
  const generalAnimatedValue = useRef(new Animated.Value(0)).current;
  const travelAnimatedValue = useRef(new Animated.Value(0)).current;

  const toggleInsuranceExpansion = () => {
    if (isInsuranceExpanded) {
      // Collapse animation
      Animated.parallel([
        Animated.timing(insuranceHeightAnimated, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.timing(generalAnimatedValue, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(travelAnimatedValue, {
          toValue: 0,
          duration: 200,
          delay: 50,
          useNativeDriver: false,
        }),
      ]).start(() => {
        setIsInsuranceExpanded(false);
      });
    } else {
      // Expand animation
      setIsInsuranceExpanded(true);
      Animated.parallel([
        Animated.timing(insuranceHeightAnimated, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.timing(generalAnimatedValue, {
          toValue: 1,
          duration: 400,
          delay: 150,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: false,
        }),
        Animated.timing(travelAnimatedValue, {
          toValue: 1,
          duration: 400,
          delay: 200,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: false,
        }),
      ]).start();
    }
  };

  return (
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
  insuranceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  insuranceItem: {
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
  insuranceIconContainer: {
    alignSelf: 'flex-end',
    marginTop: 'auto',
  },
  insuranceIcon: {
    width: 32,
    height: 32,
  },
  insuranceDownArrow: {
    alignSelf: 'center',
    padding: 8,
    marginTop: 10,
  },
});

export default HomeInsuranceSection;
