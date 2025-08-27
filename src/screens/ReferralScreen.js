import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Share,
  Alert,
  ScrollView,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Responsive scaling
const scale = Math.min(screenWidth / 375, screenHeight / 812);

// Colors from Figma design
const Colors = {
  background: '#F3ECFE',
  textDark: '#1A1B20',
  textGray: '#7D7D7D',
  primaryPurple: '#8F31F9',
  textWhite: '#FBFBFB',
  cardBackground: '#FBFBFB',
  starBackground: '#F6AC11',
};

// Data for referred users list - Empty array to show empty state
const referredUsersData = [];

const ReferralScreen = () => {
  const referralCode = '9739993341';
  const [activeFilter, setActiveFilter] = useState('active');

  const handleShareReferralCode = async () => {
    try {
      await Share.share({
        message: `Join DrWise using my referral code: ${referralCode}`,
        title: 'Join me on DrWise!',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share referral code.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <LinearGradient
        colors={['#F3ECFE', '#F6F6FE']}
        locations={[0, 0.49]}
        style={styles.background}
      >
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <Text style={styles.header}>Referral</Text>

          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Refer & Earn</Text>
            <Text style={styles.subtitle}>
              Share your referral code with friends and earn rewards when they join DrWise!
            </Text>
          </View>

          {/* Reward Coins Card - Positioned BEFORE referral code */}
          <View style={styles.rewardCard}>
            <View style={styles.starIconContainer}>
              <Image 
                source={require('../../assets/Icons/star.png')} 
                style={styles.starIcon}
                resizeMode="contain"
              />
            </View>
            <View style={styles.rewardContent}>
              <Text style={styles.rewardText}>Reward coins per referral</Text>
              <Text style={styles.rewardCoins}>100 Coins</Text>
            </View>
          </View>

          {/* Referral Code Card */}
          <View style={styles.referralCard}>
            <Text style={styles.referralLabel}>Your Referral Code</Text>
            <Text style={styles.referralCode}>{referralCode}</Text>
            <TouchableOpacity
              style={styles.shareButton}
              onPress={handleShareReferralCode}>
              <Text style={styles.buttonText}>Share Referral Code</Text>
            </TouchableOpacity>
          </View>

          {/* Referred Users Section */}
          <Text style={styles.referredUsersTitle}>Referred Users</Text>

          {/* Empty State */}
          {referredUsersData.length === 0 && (
            <View style={styles.emptyStateContainer}>
              <Image 
                source={require('../../assets/Icons/noReferred.png')} 
                style={styles.emptyStateIcon}
                resizeMode="contain"
              />
             
            </View>
          )}

          {/* User List - Only show if there are users */}
          {referredUsersData.length > 0 && (
            <>
              {referredUsersData.map(user => (
                <View key={user.id} style={styles.userCard}>
                  <View style={styles.userIconContainer}>
                    <Image source={user.icon} style={styles.userIcon} resizeMode="contain" />
                  </View>
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userDate}>{user.date}</Text>
                  </View>
                  <Text style={styles.userCoins}>{user.coins} Coins</Text>
                </View>
              ))}
            </>
          )}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  background: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingBottom: 100,
  },
  header: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 24 * scale,
    lineHeight: 28 * scale,
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: 24 * scale,
    marginTop: 20 * scale,
  },
  titleSection: {
    marginBottom: 20 * scale,
  },
  title: {
    fontFamily: 'Rubik-Medium',
    fontSize: 24 * scale,
    lineHeight: 28 * scale,
    color: Colors.textDark,
    marginBottom: 8 * scale,
  },
  subtitle: {
    fontFamily: 'Rubik-Regular',
    fontSize: 14 * scale,
    lineHeight: 17 * scale,
    color: Colors.textGray,
    letterSpacing: 0.2,
  },
  rewardCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 10 * scale,
    padding: 16 * scale,
    marginBottom: 20 * scale,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    shadowColor: 'rgba(143, 49, 249, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },
  starIconContainer: {
    width: 60 * scale,
    height: 60 * scale,
    borderRadius: 8 * scale,
    backgroundColor: `${Colors.starBackground}33`, // 20% opacity
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16 * scale,
  },
  starIcon: {
    width: 46 * scale,
    height: 46 * scale,
  },
  rewardContent: {
    flex: 1,
  },
  rewardText: {
    fontFamily: 'Rubik-Regular',
    fontSize: 12 * scale,
    lineHeight: 14 * scale,
    color: Colors.textGray,
    letterSpacing: 0.2,
    marginBottom: 4 * scale,
  },
  rewardCoins: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 18 * scale,
    lineHeight: 21 * scale,
    color: Colors.textDark,
  },
  referralCard: {
    width: '100%',
    backgroundColor: Colors.cardBackground,
    borderRadius: 20 * scale,
    padding: 20 * scale,
    alignItems: 'center',
    marginBottom: 20 * scale,
    borderWidth: 1,
    borderColor: Colors.cardBackground,
    shadowColor: 'rgba(143, 49, 249, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },
  referralLabel: {
    fontFamily: 'Rubik-Regular',
    fontSize: 14 * scale,
    lineHeight: 17 * scale,
    color: Colors.textGray,
    letterSpacing: 0.2,
    marginBottom: 8 * scale,
  },
  referralCode: {
    fontFamily: 'Rubik-Medium',
    fontSize: 32 * scale,
    lineHeight: 38 * scale,
    color: Colors.textDark,
    marginBottom: 20 * scale,
  },
  shareButton: {
    width: '100%',
    backgroundColor: Colors.primaryPurple,
    paddingVertical: 14 * scale,
    borderRadius: 8 * scale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 16 * scale,
    lineHeight: 19 * scale,
    color: Colors.textWhite,
    letterSpacing: 0.2,
  },
  referredUsersTitle: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 24 * scale,
    lineHeight: 28 * scale,
    color: Colors.textDark,
    marginBottom: 16 * scale,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40 * scale,
    width: '100%',
  },
  emptyStateIcon: {
    width: 213 * scale, // Increased from 132 to 213 based on Figma Group 9196 width
    height: 171 * scale, // Increased from 132 to 171 based on Figma Group 9196 height
    marginBottom: 16 * scale,
  },
  emptyStateText: {
    fontFamily: 'Rubik-Regular',
    fontSize: 12 * scale,
    lineHeight: 14 * scale,
    color: Colors.textGray,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  userCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20 * scale,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(125, 125, 125, 0.1)',
  },
  userIconContainer: {
    width: 60 * scale,
    height: 60 * scale,
    borderRadius: 8 * scale,
    backgroundColor: 'rgba(150, 61, 251, 0.00)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12 * scale,
  },
  userIcon: {
    width: 60 * scale,
    height: 60 * scale,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 16 * scale,
    lineHeight: 19 * scale,
    color: Colors.textDark,
    marginBottom: 4 * scale,
  },
  userDate: {
    fontFamily: 'Rubik-Regular',
    fontSize: 12 * scale,
    lineHeight: 14 * scale,
    color: Colors.textGray,
    letterSpacing: 0.2,
  },
  userCoins: {
    fontFamily: 'Rubik-Regular',
    fontSize: 16 * scale,
    lineHeight: 19 * scale,
    color: Colors.textDark,
    textAlign: 'right',
  },
});

export default ReferralScreen;