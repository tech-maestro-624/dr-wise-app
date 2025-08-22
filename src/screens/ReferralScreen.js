import React from 'react';
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
} from 'react-native';

// Placeholder for design system colors, replace with your actual design system if available
const Colors = {
  background: '#F7F2FE',
  textDark: '#1A1B20',
  textGray: '#7D7D7D',
  primaryPurple: '#8F31F9',
  textWhite: '#FBFBFB',
  cardBackground: '#FFFFFF',
};

// Data for referred users list
const referredUsersData = [
  {
    id: '1',
    name: 'Suhas',
    date: '25-03-2025,10:43 PM',
    coins: 100,
    // Using a placeholder for the icon, you can replace it with your own local/remote asset
    icon: require('../../assets/icon.png'),
  },
  {
    id: '2',
    name: 'Suhas',
    date: '25-03-2025,10:43 PM',
    coins: 100,
    icon: require('../../assets/icon.png'),
  },
];

const ReferralScreen = () => {
  const referralCode = '9739993341';

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
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Referral</Text>

        <Text style={styles.title}>Refer & Earn</Text>
        <Text style={styles.subtitle}>
          Share your referral code with friends and earn rewards when they join
          DrWise!
        </Text>

        <View style={styles.rewardCard}>
          {/* Placeholder for star icon, replace with your actual icon component or image */}
          <View style={styles.starIconContainer}>
            <Text>⭐</Text>
          </View>
          <View>
            <Text style={styles.rewardText}>Reward coins per referral</Text>
            <Text style={styles.rewardCoins}>100 Coins</Text>
          </View>
        </View>

        <View style={styles.referralCard}>
          <Text style={styles.referralLabel}>Your Referral Code</Text>
          <Text style={styles.referralCode}>{referralCode}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={handleShareReferralCode}>
            <Text style={styles.buttonText}>Share Referral Code</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.referredUsersTitle}>Referred Users</Text>

        {referredUsersData.map(user => (
          <View key={user.id} style={styles.userCard}>
            <Image source={user.icon} style={styles.userIcon} />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userDate}>{user.date}</Text>
            </View>
            <Text style={styles.userCoins}>{user.coins} Coins</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'center',
  },
  header: {
    fontFamily: 'Rubik-Bold',
    fontWeight: '700',
    fontSize: 24,
    color: Colors.textDark,
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Rubik-Medium',
    fontWeight: '600',
    fontSize: 20,
    color: Colors.textDark,
    alignSelf: 'flex-start',
  },
  subtitle: {
    fontFamily: 'Rubik-Regular',
    fontSize: 14,
    color: Colors.textGray,
    marginTop: 8,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  referralCard: {
    width: '100%',
    padding: 20,
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: 'rgba(143, 49, 249, 0.1)',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },
  referralLabel: {
    fontFamily: 'Rubik-Regular',
    fontSize: 14,
    color: Colors.textGray,
  },
  referralCode: {
    fontFamily: 'Rubik-Medium',
    fontWeight: '500',
    fontSize: 32,
    color: Colors.textDark,
    marginTop: 8,
    marginBottom: 20,
  },
  button: {
    width: '100%',
    backgroundColor: Colors.primaryPurple,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: 'Rubik-SemiBold',
    fontWeight: '600',
    fontSize: 16,
    color: Colors.textWhite,
  },
  rewardCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 30,
    shadowColor: 'rgba(143, 49, 249, 0.05)',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  starIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#FFF8E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  rewardText: {
    fontFamily: 'Rubik-Regular',
    fontSize: 14,
    color: Colors.textGray,
  },
  rewardCoins: {
    fontFamily: 'Rubik-Medium',
    fontWeight: '500',
    fontSize: 18,
    color: Colors.textDark,
    marginTop: 4,
  },
  referredUsersTitle: {
    fontFamily: 'Rubik-Medium',
    fontWeight: '600',
    fontSize: 20,
    color: Colors.textDark,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  userCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  userIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: 'Rubik-Medium',
    fontWeight: '500',
    fontSize: 16,
    color: Colors.textDark,
  },
  userDate: {
    fontFamily: 'Rubik-Regular',
    fontSize: 12,
    color: Colors.textGray,
    marginTop: 4,
  },
  userCoins: {
    fontFamily: 'Rubik-Medium',
    fontWeight: '500',
    fontSize: 16,
    color: Colors.primaryPurple,
  },
});

export default ReferralScreen;