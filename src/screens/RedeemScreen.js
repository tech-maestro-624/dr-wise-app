import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';

// --- PROGRESS CIRCLE CONFIGURATION (Moved outside the component) ---
// This makes these constants available to the StyleSheet below, fixing the error.
const radius = 95;
const strokeWidth = 20;
const circumference = 2 * Math.PI * radius;

const RedeemScreen = () => {
  const navigation = useNavigation();
  const balance = 1200;
  
  // Progress is now calculated inside the component
  const progress = 0.7; // 70% progress for demonstration
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={['#F3ECFE', '#F6F6FE']}
        locations={[0, 0.49]}
        style={styles.background}
      >
        {/* --- Custom Header --- */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#1A1B20" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Redeem</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text style={styles.mainTitle}>Redeem Your Coins</Text>
            <Text style={styles.subtitle}>Redeem tour coins into cash 1 Coin = 1 Rupee</Text>
          </View>

          {/* --- Progress Circle --- */}
          <View style={styles.progressContainer}>
            <Svg width={radius * 2} height={radius * 2}>
              <Defs>
                <SvgGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                  <Stop offset="0" stopColor="#8F31F9" />
                  <Stop offset="1" stopColor="#C697FA" />
                </SvgGradient>
              </Defs>
              <Circle
                cx={radius}
                cy={radius}
                r={radius - strokeWidth / 2}
                stroke="#F2EFF5"
                strokeWidth={strokeWidth}
                fill="none"
              />
              <Circle
                cx={radius}
                cy={radius}
                r={radius - strokeWidth / 2}
                stroke="url(#grad)"
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform={`rotate(-90 ${radius} ${radius})`}
              />
            </Svg>
            <View style={styles.circleCenter}>
              <Image 
                source={require('../../assets/Icons/coin.png')} 
                style={styles.coinImage} 
              />
              <Text style={styles.balanceAmount}>₹{balance.toLocaleString()}</Text>
              <Text style={styles.balanceLabel}>Your Money</Text>
            </View>
          </View>
          
          <Text style={styles.availableCoinsText}>Available Coins : ₹{balance.toLocaleString()}</Text>

        </View>

        {/* --- Redeem Button --- */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.redeemButton}>
            <Text style={styles.redeemButtonText}>Redeem Now</Text>
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
  },
  backButton: {
    backgroundColor: 'rgba(150, 61, 251, 0.05)',
    width: 26,
    height: 26,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 24,
    color: '#1A1B20',
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
  },
  subtitle: {
    fontFamily: 'Rubik-Regular',
    fontSize: 14,
    color: '#7D7D7D',
    marginTop: 8,
  },
  progressContainer: {
    width: radius * 2,
    height: radius * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleCenter: {
    position: 'absolute',
    width: radius * 2 - (strokeWidth * 2),
    height: radius * 2 - (strokeWidth * 2),
    borderRadius: radius - strokeWidth, // Dynamic radius for the inner circle
    backgroundColor: '#FBFBFB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 11,
    borderColor: '#FBFBFB',
  },
  coinImage: {
    width: 41,
    height: 41,
    marginBottom: 10,
  },
  balanceAmount: {
    fontFamily: 'Rubik-Medium',
    fontSize: 32,
    color: '#1A1B20',
  },
  balanceLabel: {
    fontFamily: 'Rubik-Regular',
    fontSize: 12,
    color: '#7D7D7D',
    marginTop: 4,
  },
  availableCoinsText: {
    fontFamily: 'Rubik-Medium',
    fontSize: 16,
    color: '#1A1B20',
    marginTop: 60,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  redeemButton: {
    backgroundColor: '#8F31F9',
    borderRadius: 8,
    height: 47,
    justifyContent: 'center',
    alignItems: 'center',
  },
  redeemButtonText: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 16,
    color: '#FBFBFB',
  },
});

export default RedeemScreen;