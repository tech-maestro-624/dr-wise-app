import React, { useState, useEffect, useCallback } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { getUserData } from '../api/auth';
import { getWallet } from '../api/wallet';
import { getconfig } from '../api/configuration';
import { getAffiliates } from '../api/affiliate';


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

// Step Component for referral process
const Step = ({ number, title, description, isLastStep = false }) => (
  <View style={styles.stepContainer}>
    {/* Step Number and Connecting Line */}
    <View style={styles.stepIndicator}>
      {/* Step Number Circle */}
      <View style={styles.stepCircle}>
        <Text style={styles.stepNumber}>{number}</Text>
      </View>
      {/* Connecting Dotted Line */}
      {!isLastStep && <View style={styles.connectingLine} />}
    </View>

    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>{title}</Text>
      <Text style={styles.stepDescription}>
        {description}
      </Text>
    </View>
  </View>
);

const ReferralScreen = () => {
  const { user: authUser } = useAuth();
  
  // State for dynamic data
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState({ balance: 0 });
  const [config, setConfig] = useState([]);
  const [referredUsers, setReferredUsers] = useState([]);
  const [userRoles, setUserRoles] = useState([]);

  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('active');

  // Fetch user data
  const fetchUserData = async () => {
    try {
      const response = await getUserData();

      if (response && response.data) {
        let userData;
        if (response.data.user) {
          userData = response.data.user;
        } else {
          userData = response.data; // Fallback if no user wrapper
        }

        setUser(userData);
        const roles = userData.roles ? userData.roles.map((role) => role._id || role) : [];
        setUserRoles(roles);
      } else {
        console.error('No user data in response');
        // Fallback to auth user data if API fails
        if (authUser) {
          setUser(authUser);
          const roles = authUser.roles ? authUser.roles.map((role) => role._id || role) : [];
          setUserRoles(roles);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', error?.response?.data?.message || 'Error fetching user data');
    }
  };

  // Fetch wallet data
  const fetchWalletData = async () => {
    try {
      const response = await getWallet();
      if (response && response.data) {
        setWallet(response.data);
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      Alert.alert('Error', error?.response?.data?.message || 'Error fetching wallet data');
    }
  };

  // Fetch configuration data
  const fetchConfigData = async () => {
    try {
      const response = await getconfig();
      if (response && response.data) {
        setConfig(response.data);
      }
    } catch (error) {
      console.error('Error fetching config data:', error);
      Alert.alert('Error', error?.response?.data?.message || 'Error fetching configuration data');
    }
  };



  // Fetch referred users data
  const fetchReferredUsers = async () => {
    if (!user?._id) return;

    try {
      // Try the format used in rwise-user app
      const response = await getAffiliates({
        condition: { referredBy: user._id },
      });

      if (response && response.data) {
        const affiliates = response.data.affiliates || response.data || [];
        setReferredUsers(affiliates);
      }
    } catch (error) {
      console.error('Error fetching referred users:', error);
      Alert.alert('Error', error?.response?.data?.message || 'Error fetching referred users');
    }
  };

  // Initial data fetch
  useEffect(() => {
    // Set initial user data from auth context as fallback
    if (authUser && !user) {
      setUser(authUser);
      const roles = authUser.roles ? authUser.roles.map((role) => role._id || role) : [];
      setUserRoles(roles);
    }

    fetchConfigData();
    fetchUserData();
  }, []);

  // Fetch wallet and referred users when user is available
  useEffect(() => {
    if (user?._id) {
      fetchWalletData();
      fetchReferredUsers();
    }
  }, [user]);

  // Re-fetch on screen focus
  useFocusEffect(
    useCallback(() => {
      if (user?._id) {
        fetchWalletData();
        fetchReferredUsers();
      }
    }, [user])
  );

  // Ambassador role checking
  const ambassadorRoleId = config.find((item) => item.key === 'AMBASSADOR_ROLE_ID')?.value;
  const isAmbassador = ambassadorRoleId ? userRoles.includes(ambassadorRoleId) : false;

  // Get referral code from user data
  const referralCode = user?.refCode || user?.phoneNumber || authUser?.refCode || authUser?.phoneNumber || 'N/A';

  // Get reward coins from config
  const getRewardCoins = () => {
    const rewardConfig = config.find(item => item.key === 'REFERRAL_REWARD_COINS');
    return rewardConfig?.value || '100';
  };

  const handleShareReferralCode = async () => {
    try {
      await Share.share({
        message: `Join me on DrWise! Use my referral code: ${referralCode}`,
        title: 'Join me on DrWise!',
      });
    } catch (error) {
      console.error('Error sharing referral code:', error);
      Alert.alert('Error', 'Error sharing referral code');
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
              <Text style={styles.rewardCoins}>{getRewardCoins()} Coins</Text>
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

          {/* Loading State */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primaryPurple} />
              <Text style={styles.loadingText}>Loading referred users...</Text>
            </View>
          ) : referredUsers.length === 0 ? (
            /* Empty State */
            <View style={styles.emptyStateContainer}>
              <Image 
                source={require('../../assets/Icons/noReferred.png')} 
                style={styles.emptyStateIcon}
                resizeMode="contain"
              />
            </View>
          ) : (
            /* User List - Only show if there are users */
            <>
              {referredUsers.map((user, index) => (
                <View key={user._id || index} style={styles.userCard}>
                  <View style={styles.userIconContainer}>
                    <Image 
                      source={require('../../assets/Icons/profile-avatar.png')} 
                      style={styles.userIcon} 
                      resizeMode="contain" 
                    />
                  </View>
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{user.name || 'User'}</Text>
                    <Text style={styles.userDate}>
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </Text>
                  </View>
                  <Text style={styles.userCoins}>{getRewardCoins()} Coins</Text>
                </View>
              ))}
            </>
          )}

          {/* How It Works Section */}
          <View style={styles.howItWorksContainer}>
            <Text style={styles.howItWorksTitle}>How it works</Text>

            <View style={styles.stepsContainer}>
              {/* Step 1 */}
              <Step
                number={1}
                title="Step 1"
                description={
                  <>
                    Share your referral code on WhatsApp.
                    {user && (
                      <View style={styles.referralCodeContainer}>
                        <Text style={styles.referralCodeText}>
                          {referralCode}
                        </Text>
                        <TouchableOpacity
                          onPress={handleShareReferralCode}
                          style={styles.shareIconContainer}
                          accessible={true}
                          accessibilityLabel="Share Referral Code"
                        >
                          <Ionicons name="share-social" size={20} color={Colors.primaryPurple} />
                        </TouchableOpacity>
                      </View>
                    )}
                  </>
                }
              />

              {/* Step 2 */}
              <Step
                number={2}
                title="Step 2"
                description={`Your referral uses your code and will get ${getRewardCoins()} Coins as Joining Bonus.`}
              />

              {/* Step 3 */}
              <Step
                number={3}
                title="Step 3"
                description={`You will get ${getRewardCoins()} Coins for every Referral you make. You can redeem the coins once the respective referral is converted into Business.`}
                isLastStep={!isAmbassador}
              />

              {/* Conditional Step 4 for Ambassadors */}
              {isAmbassador && (
                <Step
                  number={4}
                  title="Step 4"
                  description="For each and every Affiliate's referral that is converted into Business, you shall receive additional coins for every converted business."
                  isLastStep
                />
              )}
            </View>

            {/* Refer an Affiliate Button for Ambassadors */}
            {isAmbassador && (
              <TouchableOpacity
                style={styles.referAffiliateButton}
                onPress={() => {
                  // TODO: Navigate to affiliate referral screen
                  console.log('Navigate to affiliate referral');
                }}
              >
                <Text style={styles.referAffiliateButtonText}>Refer an Affiliate</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

// Toast component needs to be imported and added to the main app, but for now we'll use Alert
// import Toast from 'react-native-toast-message';
// <Toast config={toastConfig} />

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
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40 * scale,
  },
  loadingText: {
    fontFamily: 'Rubik',
    fontSize: 14 * scale,
    color: Colors.textGray,
    marginTop: 10 * scale,
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

  // How It Works Section Styles
  howItWorksContainer: {
    marginTop: 30 * scale,
    marginBottom: 20 * scale,
  },
  howItWorksTitle: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 20 * scale,
    lineHeight: 24 * scale,
    color: Colors.textDark,
    marginBottom: 20 * scale,
  },
  stepsContainer: {
    marginBottom: 20 * scale,
  },

  // Step Component Styles
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 20 * scale,
  },
  stepIndicator: {
    alignItems: 'center',
    marginRight: 15 * scale,
  },
  stepCircle: {
    width: 40 * scale,
    height: 40 * scale,
    borderRadius: 20 * scale,
    backgroundColor: Colors.primaryPurple,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumber: {
    fontFamily: 'Rubik-Bold',
    fontSize: 16 * scale,
    color: Colors.textWhite,
  },
  connectingLine: {
    width: 2,
    flex: 1,
    borderLeftWidth: 2,
    borderStyle: 'dotted',
    borderColor: Colors.primaryPurple,
    marginTop: 5 * scale,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontFamily: 'Rubik-Bold',
    fontSize: 16 * scale,
    lineHeight: 19 * scale,
    color: Colors.starBackground,
    marginBottom: 8 * scale,
  },
  stepDescription: {
    fontFamily: 'Rubik-Regular',
    fontSize: 14 * scale,
    lineHeight: 17 * scale,
    color: Colors.textDark,
    flexWrap: 'wrap',
  },

  // Referral Code in Step Styles
  referralCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10 * scale,
  },
  referralCodeText: {
    fontFamily: 'Rubik-Bold',
    fontSize: 16 * scale,
    color: Colors.primaryPurple,
    marginRight: 10 * scale,
  },
  shareIconContainer: {
    padding: 5 * scale,
  },

  // Refer Affiliate Button Styles
  referAffiliateButton: {
    backgroundColor: Colors.primaryPurple,
    borderRadius: 10 * scale,
    paddingVertical: 12 * scale,
    paddingHorizontal: 20 * scale,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20 * scale,
  },
  referAffiliateButtonText: {
    fontFamily: 'Rubik-Bold',
    fontSize: 16 * scale,
    color: Colors.textWhite,
  },
});

export default ReferralScreen;