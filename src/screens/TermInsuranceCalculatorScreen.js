import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const TermInsuranceCalculatorScreen = ({ navigation, route }) => {
  const [numberOfReferrals, setNumberOfReferrals] = useState(0);
  const [coins, setCoins] = useState(0);

  const incrementReferrals = () => {
    setNumberOfReferrals(prev => prev + 1);
  };

  const decrementReferrals = () => {
    if (numberOfReferrals > 0) {
      setNumberOfReferrals(prev => prev - 1);
    }
  };

  const handleRedeem = () => {
    // Handle redeem functionality
    console.log('Redeem coins:', coins);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FBFBFB" />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={['rgba(243, 236, 254, 1)', 'rgba(246, 246, 254, 1)']}
        style={styles.backgroundGradient}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#1A1B20" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Calculator</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* 3D Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.calendarIcon}>
            <View style={styles.calendarRings}>
              <View style={styles.ring1} />
              <View style={styles.ring2} />
            </View>
            <View style={styles.calendarBody}>
              <View style={styles.calendarLines}>
                <View style={styles.line1} />
                <View style={styles.line2} />
                <View style={styles.line3} />
              </View>
            </View>
            <View style={styles.addButton}>
              <Ionicons name="add" size={20} color="#FFFFFF" />
            </View>
          </View>
        </View>

        {/* Service Title */}
        <Text style={styles.serviceTitle}>Term Insurance</Text>
        
        {/* Description */}
        <Text style={styles.description}>
          Great You've selected Term Insurance Now add the members you want to include
        </Text>

        {/* Number of Referrals Section */}
        <View style={styles.referralsSection}>
          <Text style={styles.sectionLabel}>Number of referrals</Text>
          <View style={styles.referralsControl}>
            <TouchableOpacity 
              style={styles.controlButton} 
              onPress={decrementReferrals}
            >
              <Ionicons name="remove" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.numberDisplay}>
              <Text style={styles.numberText}>
                {numberOfReferrals.toString().padStart(2, '0')}
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.controlButton} 
              onPress={incrementReferrals}
            >
              <Ionicons name="add" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Your Coins Section */}
        <View style={styles.coinsSection}>
          <Text style={styles.sectionLabel}>Your Coins</Text>
          <Text style={styles.coinsAmount}>
            {coins.toString().padStart(2, '0')}
          </Text>
          <TouchableOpacity style={styles.redeemButton} onPress={handleRedeem}>
            <Text style={styles.redeemButtonText}>Redeem</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <View style={styles.navItem}>
          <Ionicons name="home" size={24} color="#8F31F9" />
          <Text style={[styles.navText, { color: '#8F31F9' }]}>Home</Text>
        </View>
        <View style={styles.navItem}>
          <Ionicons name="card" size={24} color="#7D7D7D" />
          <Text style={styles.navText}>Credits</Text>
        </View>
        <View style={styles.navItem}>
          <View style={styles.plusButton}>
            <Ionicons name="add" size={24} color="#FBFBFB" />
          </View>
        </View>
        <View style={styles.navItem}>
          <Ionicons name="people" size={24} color="#7D7D7D" />
          <Text style={styles.navText}>My Referral</Text>
        </View>
        <View style={styles.navItem}>
          <Ionicons name="person" size={24} color="#7D7D7D" />
          <Text style={styles.navText}>Profile</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingTop: 44,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1A1B20',
    fontFamily: 'Rubik',
  },
  headerSpacer: {
    width: 32,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  iconContainer: {
    marginBottom: 30,
  },
  calendarIcon: {
    width: 120,
    height: 120,
    backgroundColor: '#8F31F9',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#8F31F9',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  calendarRings: {
    position: 'absolute',
    top: -8,
    left: '50%',
    transform: [{ translateX: -15 }],
  },
  ring1: {
    width: 30,
    height: 8,
    backgroundColor: '#C0C0C0',
    borderRadius: 4,
    marginBottom: 2,
  },
  ring2: {
    width: 30,
    height: 8,
    backgroundColor: '#C0C0C0',
    borderRadius: 4,
  },
  calendarBody: {
    width: 80,
    height: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarLines: {
    width: 60,
    gap: 4,
  },
  line1: {
    width: '100%',
    height: 2,
    backgroundColor: '#E0E0E0',
  },
  line2: {
    width: '80%',
    height: 2,
    backgroundColor: '#E0E0E0',
  },
  line3: {
    width: '60%',
    height: 2,
    backgroundColor: '#E0E0E0',
  },
  addButton: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    width: 30,
    height: 30,
    backgroundColor: '#4CAF50',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  serviceTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1B20',
    fontFamily: 'Rubik',
    marginBottom: 15,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#7D7D7D',
    fontFamily: 'Rubik',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  referralsSection: {
    width: '100%',
    marginBottom: 30,
  },
  sectionLabel: {
    fontSize: 16,
    color: '#7D7D7D',
    fontFamily: 'Rubik',
    marginBottom: 15,
    textAlign: 'center',
  },
  referralsControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
  },
  controlButton: {
    width: 50,
    height: 50,
    backgroundColor: '#8F31F9',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8F31F9',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  numberDisplay: {
    width: 120,
    height: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  numberText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1A1B20',
    fontFamily: 'Rubik',
  },
  coinsSection: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#8F31F9',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  coinsAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1A1B20',
    fontFamily: 'Rubik',
    marginBottom: 20,
  },
  redeemButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#8F31F9',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8F31F9',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  redeemButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Rubik',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FBFBFB',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    shadowColor: '#8F31F9',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  navItem: {
    alignItems: 'center',
    gap: 6,
  },
  navText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#7D7D7D',
    fontFamily: 'Rubik',
  },
  plusButton: {
    backgroundColor: '#8F31F9',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8F31F9',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
});

export default TermInsuranceCalculatorScreen;




