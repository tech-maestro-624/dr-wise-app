import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const scale = Math.min(screenWidth / 375, screenHeight / 812);

const TermInsuranceCalculatorScreen = ({ navigation, route }) => {
  const { serviceName, leadName, productId, productData } = route.params || {};
  const [referralCount, setReferralCount] = useState(1); // Start with 1 instead of 0

  // Get estimated price from product data, default to 0 if not available
  const estimatedPrice = productData?.estimatedPrice || 0;

  // Calculate total earnings
  const totalEarnings = estimatedPrice * referralCount;

  const incrementReferral = () => {
    setReferralCount(referralCount + 1);
  };

  const decrementReferral = () => {
    if (referralCount > 1) {
      setReferralCount(referralCount - 1);
    }
  };

  const handleProceed = () => {
    // Navigate to referral form with calculated data
    navigation.navigate('ReferralForm', {
      product: productData,
      serviceName: serviceName,
      referralCount: referralCount,
      estimatedPrice: estimatedPrice,
      totalEarnings: totalEarnings,
      leadName: leadName
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={['#F3ECFE', '#F6F6FE']}
        style={styles.backgroundGradient}
      />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Earnings Calculator</Text>
      </View>

      {/* Main Content */}
      <View style={styles.mainContainer}>
        {/* Earnings Calculator Icon */}
        <View style={styles.iconContainer}>
          <Image
            source={require('../../assets/Icons/TERM 1.png')}
            style={styles.termIcon}
            resizeMode="contain"
          />
        </View>

        {/* Service Title */}
        <Text style={styles.termInsuranceTitle}>{serviceName || 'Service Calculator'}</Text>

        {/* Description */}
        <Text style={styles.description}>
          Great! You've selected {serviceName || 'this service'}.{'\n'}Add the number of referrals to calculate your earnings.
        </Text>

        {/* Number of Referrals Section */}
        <View style={styles.referralsSection}>
          <Text style={styles.referralsLabel}>Number of referrals</Text>
          <View style={styles.counterContainer}>
            <TouchableOpacity
              style={[styles.counterButton, styles.leftButton]}
              onPress={decrementReferral}
              disabled={referralCount <= 1}
            >
              <Text style={[styles.counterButtonText, referralCount <= 1 && styles.disabledButtonText]}>-</Text>
            </TouchableOpacity>
            <View style={styles.counterDisplay}>
              <Text style={styles.counterValue}>{referralCount.toString().padStart(2, '0')}</Text>
              {estimatedPrice > 0 && (
                <Text style={styles.priceInfo}>
                  × ₹{estimatedPrice.toLocaleString()}
                </Text>
              )}
            </View>
            <TouchableOpacity style={[styles.counterButton, styles.rightButton]} onPress={incrementReferral}>
              <Text style={styles.counterButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Estimated Total Earnings Card */}
        <View style={styles.coinsCard}>
          <Text style={styles.coinsLabel}>Estimated Total Earnings</Text>
          <Text style={styles.coinsValue}>₹{totalEarnings.toLocaleString()}</Text>
          {estimatedPrice > 0 ? (
            <Text style={styles.earningsBreakdown}>
              ₹{estimatedPrice.toLocaleString()} × {referralCount} = ₹{totalEarnings.toLocaleString()}
            </Text>
          ) : (
            <Text style={styles.noPriceText}>
              Price not available for this service
            </Text>
          )}
          <TouchableOpacity
            style={[styles.redeemButton, (!estimatedPrice || referralCount <= 0) && styles.disabledButton]}
            onPress={handleProceed}
            disabled={!estimatedPrice || referralCount <= 0}
          >
            <Text style={styles.redeemButtonText}>Proceed to Referral</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFBFB',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15 * scale,
    paddingTop: 44 * scale,
  },
  headerTitle: {
    fontSize: 24 * scale,
    fontWeight: '700',
    color: '#1A1B20',
    fontFamily: 'Rubik',
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: 20 * scale,
    alignItems: 'center',
    paddingTop: 20 * scale,
  },
  iconContainer: {
    marginTop: 20 * scale,
    marginBottom: 20 * scale,
    alignItems: 'center',
  },
  termIcon: {
    width: 103 * scale,
    height: 109 * scale,
  },
  termInsuranceTitle: {
    fontSize: 24 * scale,
    fontWeight: '700',
    color: '#1A1B20',
    fontFamily: 'Rubik',
    lineHeight: 28 * scale,
    textAlign: 'center',
    marginBottom: 7 * scale,
  },
  description: {
    fontSize: 14 * scale,
    fontWeight: '400',
    color: '#7D7D7D',
    fontFamily: 'Rubik',
    lineHeight: 20 * scale,
    textAlign: 'center',
    letterSpacing: 0.2 * scale,
    marginBottom: 110 * scale,
    paddingHorizontal: 20 * scale,
  },
  referralsSection: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 30 * scale,
  },
  referralsLabel: {
    fontSize: 14 * scale,
    fontWeight: '400',
    color: '#7D7D7D',
    fontFamily: 'Rubik',
    lineHeight: 17 * scale,
    letterSpacing: 0.2 * scale,
    marginBottom: 12 * scale,
    marginLeft: 20 * scale,
  },
  counterContainer: {
    backgroundColor: '#FBFBFB',
    borderWidth:0,
    borderColor: '#FFFFFF',
    borderRadius: 15 * scale,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 335 * scale,
    height: 60 * scale,
    shadowColor: '#8F31F9',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10 * scale,
    elevation: 5,
    overflow: 'hidden',
  },
  counterButton: {
    width: 69 * scale,
    height: 60 * scale,
    backgroundColor: 'rgba(143, 49, 249, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftButton: {
    borderTopLeftRadius: 15 * scale,
    borderBottomLeftRadius: 15 * scale,
  },
  rightButton: {
    borderTopRightRadius: 15 * scale,
    borderBottomRightRadius: 15 * scale,
  },
  counterButtonText: {
    fontSize: 28 * scale,
    fontWeight: '700',
    color: '#8F31F9',
    fontFamily: 'Rubik',
  },
  counterValue: {
    fontSize: 22 * scale,
    fontWeight: '700',
    color: '#1A1B20',
    fontFamily: 'Rubik',
    lineHeight: 26 * scale,
    textAlign: 'center',
  },
  counterDisplay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceInfo: {
    fontSize: 12 * scale,
    fontWeight: '500',
    color: '#8F31F9',
    fontFamily: 'Rubik',
    marginTop: 4 * scale,
  },
  disabledButtonText: {
    color: '#CCCCCC',
  },
  coinsCard: {
    backgroundColor: '#FBFBFB',
    borderWidth: 1,
    borderColor: '#FBFBFB',
    borderRadius: 20 * scale,
    paddingVertical: 20 * scale,
    paddingHorizontal: 16 * scale,
    width: 335 * scale,
    height: 170 * scale,
    alignItems: 'center',
    shadowColor: '#8F31F9',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10 * scale,
    elevation: 5,
  },
  coinsLabel: {
    fontSize: 14 * scale,
    fontWeight: '400',
    color: '#7D7D7D',
    fontFamily: 'Rubik',
    lineHeight: 17 * scale,
    textAlign: 'center',
    letterSpacing: 0.2 * scale,
    marginBottom: 4 * scale,
  },
  coinsValue: {
    fontSize: 32 * scale,
    fontWeight: '700',
    color: '#1A1B20',
    fontFamily: 'Rubik',
    lineHeight: 38 * scale,
    textAlign: 'center',
    marginBottom: 8 * scale,
  },
  earningsBreakdown: {
    fontSize: 12 * scale,
    fontWeight: '500',
    color: '#7D7D7D',
    fontFamily: 'Rubik',
    textAlign: 'center',
    marginBottom: 16 * scale,
    lineHeight: 16 * scale,
  },
  noPriceText: {
    fontSize: 12 * scale,
    fontWeight: '400',
    color: '#FF6B6B',
    fontFamily: 'Rubik',
    textAlign: 'center',
    marginBottom: 16 * scale,
    fontStyle: 'italic',
  },
  redeemButton: {
    backgroundColor: '#8F31F9',
    borderRadius: 8 * scale,
    paddingVertical: 14 * scale,
    paddingHorizontal: 16 * scale,
    width: 303 * scale,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  redeemButtonText: {
    fontSize: 16 * scale,
    fontWeight: '600',
    color: '#FBFBFB',
    fontFamily: 'Rubik',
    lineHeight: 19 * scale,
    letterSpacing: 0.2 * scale,
  },
});

export default TermInsuranceCalculatorScreen;




