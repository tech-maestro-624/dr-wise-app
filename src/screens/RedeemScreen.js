import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar, Image, Dimensions, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import CircularSlider from '../components/CircularSlider';
import { getWallet } from '../api/wallet';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const RedeemScreen = () => {
  const navigation = useNavigation();
  const [balance, setBalance] = useState(0);
  const [selectedAmount, setSelectedAmount] = useState(0);
  
  // Responsive dimensions based on screen size
  const scale = Math.min(screenWidth / 375, screenHeight / 812);
  const imageSize = 226 * scale;

  // Fetch wallet balance from backend
  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const response = await getWallet();
        console.log('Wallet API response:', response);
        
        if (response.data) {
          // Try different possible response structures
          let walletBalance = 0;
          
          if (response.data.data) {
            // Structure: { data: { data: { balance: 1000 } } }
            const walletData = response.data.data;
            walletBalance = walletData.balance || walletData.coins || walletData.amount || walletData.total || 0;
          } else if (response.data.balance !== undefined) {
            // Structure: { data: { balance: 1000 } }
            walletBalance = response.data.balance;
          } else if (response.data.coins !== undefined) {
            // Structure: { data: { coins: 1000 } }
            walletBalance = response.data.coins;
          } else if (response.data.amount !== undefined) {
            // Structure: { data: { amount: 1000 } }
            walletBalance = response.data.amount;
          }
          
          console.log('Extracted wallet balance:', walletBalance);
          setBalance(walletBalance);
          setSelectedAmount(walletBalance); // Initialize selectedAmount with the fetched balance
        }
      } catch (error) {
        console.error('Error fetching wallet balance:', error);
        // Don't change balance on error, keep it as is
      }
    };

    fetchWalletBalance();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={['#F3ECFE', '#F6F6FE']}
        locations={[0, 0.49]}
        style={styles.background}
      >
        {/* --- Header --- */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <View style={styles.backButtonBackground}>
              <Ionicons name="chevron-back" size={20} color="#1A1B20" />
            </View>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Redeem</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.content}>
          {/* --- Title Section --- */}
          <View style={styles.titleContainer}>
            <Text style={styles.mainTitle}>Redeem Your Coins</Text>
            <Text style={styles.subtitle}>Redeem tour coins into cash 1 Coin = 1 Rupee</Text>
          </View>

          {/* --- Circular Slider --- */}
          <View style={styles.sliderContainer}>
            <CircularSlider
              size={imageSize}
              strokeWidth={20}
              minValue={0}
              maxValue={balance}
              initialValue={selectedAmount}
              onValueChange={setSelectedAmount}
              step={Math.max(1, Math.floor(balance / 360))} // Dynamic step based on balance/360
            />
          </View>
          
          <Text style={[styles.availableCoinsText, { fontSize: 16 * scale, lineHeight: 19 * scale }]}>
            Available Coins : ₹{balance.toLocaleString()}
          </Text>

        </View>

        {/* --- Redeem Button --- */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.redeemButton, { 
              width: 335 * scale, 
              height: 47 * scale, 
              borderRadius: 8 * scale,
              backgroundColor: selectedAmount > 0 ? '#8F31F9' : '#D1D5DB',
            }]}
            disabled={selectedAmount === 0}
          >
            <Text style={[styles.redeemButtonText, { 
              fontSize: 16 * scale, 
              lineHeight: 19 * scale,
              color: selectedAmount > 0 ? '#FBFBFB' : '#9CA3AF',
            }]}>
              {selectedAmount > 0 ? `Redeem ₹${selectedAmount.toLocaleString()}` : 'Redeem Now'}
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3ECFE',
  },
  background: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 80,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  backButton: {
    width: 46,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonBackground: {
    width: 26,
    height: 26,
    backgroundColor: 'rgba(150, 61, 251, 0.05)',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 24,
    color: '#1A1B20',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingTop: 20,
  },
  titleContainer: {
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 60,
  },
  mainTitle: {
    fontFamily: 'Rubik-Medium',
    fontSize: 24,
    color: '#1A1B20',
    lineHeight: 28,
  },
  subtitle: {
    fontFamily: 'Rubik-Regular',
    fontSize: 14,
    color: '#7D7D7D',
    marginTop: 8,
    lineHeight: 17,
    letterSpacing: 0.2,
  },
  sliderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  availableCoinsText: {
    fontFamily: 'Rubik-Medium',
    color: '#1A1B20',
    marginTop: 20,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  redeemButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  redeemButtonText: {
    fontFamily: 'Rubik-SemiBold',
    color: '#FBFBFB',
    letterSpacing: 0.2,
  },

});

export default RedeemScreen;

