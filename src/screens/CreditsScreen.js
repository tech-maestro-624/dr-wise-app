import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { getUserData } from '../api/auth';
import { getWallet } from '../api/wallet';
import { getTransactions } from '../api/transactions';

const { width, height } = Dimensions.get('window');

// --- Responsive Scaling Utilities ---
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const scale = (size) => (width / guidelineBaseWidth) * size;
const verticalScale = (size) => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;
// --- End of Responsive Utilities ---

const CreditsScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { user: authUser } = useAuth();

  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({ received: 0, redeemed: 0 });
  const [walletLoading, setWalletLoading] = useState(true);
  const [transactionsLoading, setTransactionsLoading] = useState(true);

  const calculateStats = (transactionList) => {
    const totalReceived = transactionList
      .filter(t => ['credit', 'JOINING_BONUS', 'UNLOCK_REFERRAL_BONUS'].includes(t.type))
      .reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const totalRedeemed = transactionList
      .filter(t => t.type === 'debit' && t.status === 'approved')
      .reduce((acc, curr) => acc + Math.abs(curr.amount || 0), 0);
    return { received: totalReceived, redeemed: totalRedeemed };
  };

  const fetchAllData = useCallback(async () => {
    try {
      // Parallel fetching
      const [userDataRes, walletRes, transactionsRes] = await Promise.all([
        getUserData(),
        getWallet(),
        getTransactions()
      ]);

      // Process User Data
      if (userDataRes?.data?.user) setUser(userDataRes.data.user);

      // Process Wallet Data
      if (walletRes?.data) setWallet(walletRes.data);
      setWalletLoading(false);
      
      // Process Transactions Data
      if (transactionsRes?.data) {
        const transactionList = transactionsRes.data?.data || transactionsRes.data?.transactions || transactionsRes.data || [];
        const calculatedStats = calculateStats(transactionList);
        setStats(calculatedStats);
        
        const transformed = transactionList.slice(0, 5).map(t => ({
          id: t._id,
          title: t.type || 'Transaction',
          date: t.date ? new Date(t.date).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }) : 'N/A',
          description: t.description || 'No description',
          amount: `₹${Math.abs(t.amount || 0).toFixed(2)}`,
          isLocked: t.type === 'LOCKED_REFERRAL_BONUS',
        }));
        setTransactions(transformed);
      }
      setTransactionsLoading(false);

    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to load your credits data. Please pull to refresh.');
      setWalletLoading(false);
      setTransactionsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAllData();
    }, [fetchAllData])
  );

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <LinearGradient colors={['#F3ECFE', '#F6F6FE']} style={styles.background}>
        
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <Text style={styles.headerTitle}>Credits</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.balanceCard}>
            {walletLoading ? (
              <View style={styles.centeredContainer}>
                <ActivityIndicator size="large" color="#8F31F9" />
                <Text style={styles.infoText}>Loading balance...</Text>
              </View>
            ) : (
              <>
                <Text style={styles.helloText}>Hello {user?.name || authUser?.name || 'User'}</Text>
                <Text style={styles.balanceAmount}>₹{wallet?.balance?.toFixed(2) || '0.00'}</Text>
                <Text style={styles.balanceLabel}>Your Balance</Text>
                <View style={styles.divider} />
                <View style={styles.statsContainer}>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Received</Text>
                    <Text style={styles.statAmount}>₹{stats.received.toFixed(2)}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Redeemed</Text>
                    <Text style={styles.statAmount}>₹{stats.redeemed.toFixed(2)}</Text>
                  </View>
                </View>
                {wallet?.lockedRefBonus > 0 && (
                  <View style={styles.lockedBonusContainer}>
                    <Text style={styles.lockedBonusLabel}>Locked Referral Bonus</Text>
                    <View style={styles.lockedBonusContent}>
                      <Text style={styles.lockedBonusAmount}>₹{wallet.lockedRefBonus.toFixed(2)}</Text>
                      <Ionicons name="lock-closed" size={moderateScale(18)} color="#1A1B20" />
                    </View>
                  </View>
                )}
                <TouchableOpacity style={styles.redeemButton} onPress={() => navigation.navigate('Redeem')}>
                  <Text style={styles.redeemButtonText}>Redeem</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          <View style={styles.historyContainer}>
            <View style={styles.historyHeader}>
              <Text style={styles.historyTitle}>Transactions History</Text>
              <TouchableOpacity onPress={() => navigation.navigate('TransactionsHistory')}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            {transactionsLoading ? (
              <View style={styles.centeredContainer}>
                <ActivityIndicator color="#8F31F9" />
                <Text style={styles.infoText}>Loading transactions...</Text>
              </View>
            ) : transactions.length > 0 ? (
              transactions.map((item) => (
                <View key={item.id} style={styles.transactionItem}>
                  <Image
                    source={item.isLocked ? require('../../assets/Icons/locked.png') : require('../../assets/Icons/tickmark.png')}
                    style={styles.transactionIcon}
                  />
                  <View style={styles.transactionDetails}>
                    <Text style={styles.transactionTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.transactionDate} numberOfLines={1}>{item.date}</Text>
                  </View>
                  <Text style={styles.transactionAmount}>{item.amount}</Text>
                </View>
              ))
            ) : (
              <View style={styles.centeredContainer}>
                <Ionicons name="receipt-outline" size={moderateScale(48)} color="#7D7D7D" />
                <Text style={styles.infoText}>No transactions found</Text>
              </View>
            )}
          </View>
        </ScrollView>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: verticalScale(10),
  },
  headerTitle: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: moderateScale(22),
    color: '#1A1B20',
  },
  scrollContent: {
    paddingHorizontal: moderateScale(20),
    paddingBottom: verticalScale(100),
  },
  balanceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(20),
    padding: moderateScale(20),
    alignItems: 'center',
    shadowColor: 'rgba(143, 49, 249, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: moderateScale(10),
    elevation: 5,
    marginTop: verticalScale(12),
  },
  helloText: {
    fontFamily: 'Rubik-Medium',
    fontSize: moderateScale(14),
    color: '#1A1B20',
  },
  balanceAmount: {
    fontFamily: 'Rubik-Medium',
    fontSize: moderateScale(32),
    color: '#1A1B20',
    marginVertical: verticalScale(10),
  },
  balanceLabel: {
    fontFamily: 'Rubik-Regular',
    fontSize: moderateScale(14),
    color: '#7D7D7D',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(125, 125, 125, 0.1)',
    width: '100%',
    marginVertical: verticalScale(20),
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontFamily: 'Rubik-Regular',
    fontSize: moderateScale(14),
    color: '#7D7D7D',
  },
  statAmount: {
    fontFamily: 'Rubik-Medium',
    fontSize: moderateScale(18),
    color: '#1A1B20',
    marginTop: verticalScale(8),
  },
  lockedBonusContainer: {
    backgroundColor: 'rgba(125, 125, 125, 0.05)',
    borderRadius: moderateScale(8),
    paddingVertical: verticalScale(10),
    paddingHorizontal: moderateScale(20),
    marginTop: verticalScale(25),
    alignItems: 'center',
    width: '100%',
  },
  lockedBonusLabel: {
    fontFamily: 'Rubik-Regular',
    fontSize: moderateScale(14),
    color: '#7D7D7D',
    marginBottom: verticalScale(8),
  },
  lockedBonusContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(8),
  },
  lockedBonusAmount: {
    fontFamily: 'Rubik-Medium',
    fontSize: moderateScale(18),
    color: '#1A1B20',
  },
  redeemButton: {
    backgroundColor: '#8F31F9',
    borderRadius: moderateScale(8),
    height: verticalScale(47),
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: verticalScale(20),
  },
  redeemButtonText: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: moderateScale(16),
    color: '#FFFFFF',
  },
  historyContainer: {
    marginTop: verticalScale(30),
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(15),
  },
  historyTitle: {
    fontFamily: 'Rubik-Medium',
    fontSize: moderateScale(18),
    color: '#1A1B20',
  },
  viewAllText: {
    fontFamily: 'Rubik-Regular',
    fontSize: moderateScale(16),
    color: '#8F31F9',
    textDecorationLine: 'underline',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(15),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(125, 125, 125, 0.1)',
  },
  transactionIcon: {
    width: moderateScale(50),
    height: moderateScale(50),
    marginRight: moderateScale(12),
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: moderateScale(15),
    color: '#1A1B20',
    marginBottom: verticalScale(2),
  },
  transactionDate: {
    fontFamily: 'Rubik-Regular',
    fontSize: moderateScale(12),
    color: '#7D7D7D',
  },
  transactionAmount: {
    fontFamily: 'Rubik-Medium',
    fontSize: moderateScale(16),
    color: '#1A1B20',
  },
  centeredContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(30),
  },
  infoText: {
    fontFamily: 'Rubik-Regular',
    fontSize: moderateScale(14),
    color: '#7D7D7D',
    marginTop: verticalScale(10),
    textAlign: 'center',
  },
});

export default CreditsScreen;