import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar, Image, Dimensions, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const RedeemScreen = () => {
  const navigation = useNavigation();
  const balance = 1200;
  
  // Responsive dimensions based on screen size
  const scale = Math.min(screenWidth / 375, screenHeight / 812);
  const imageSize = 226 * scale;

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

          {/* --- Circular Progress Image --- */}
          <View style={styles.imageContainer}>
            <Image 
              source={require('../../assets/Icons/coin.png')} 
              style={[styles.circularImage, { width: imageSize, height: imageSize }]} 
              resizeMode="contain"
            />
          </View>
          
          <Text style={[styles.availableCoinsText, { fontSize: 16 * scale, lineHeight: 19 * scale }]}>
            Available Coins : ₹{balance.toLocaleString()}
          </Text>

        </View>

        {/* --- Redeem Button --- */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.redeemButton, { 
            width: 335 * scale, 
            height: 47 * scale, 
            borderRadius: 8 * scale 
          }]}>
            <Text style={[styles.redeemButtonText, { fontSize: 16 * scale, lineHeight: 19 * scale }]}>
              Redeem Now
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
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  circularImage: {
    // The image will contain the complete circular design
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
    backgroundColor: '#8F31F9',
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

