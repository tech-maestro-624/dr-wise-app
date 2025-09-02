import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { getUserData } from '../api/auth';
import { getWallet } from '../api/wallet';
import { getTransactions } from '../api/transactions';

const CreditsScreen = () => {
  const navigation = useNavigation();
  const { user: authUser } = useAuth();

  // State for user data
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({ received: 0, redeemed: 0 });
  const [loading, setLoading] = useState(false);
  const [walletLoading, setWalletLoading] = useState(false);
  const [transactionsLoading, setTransactionsLoading] = useState(false);

  // Calculate received and redeemed amounts from transactions (based on credit.tsx logic)
  const calculateStats = (transactionList) => {
    const totalReceived = transactionList
      .filter(
        (transaction) =>
          transaction.type === 'credit' ||
          transaction.type === 'JOINING_BONUS' ||
          transaction.type === 'UNLOCK_REFERRAL_BONUS'
      )
      .reduce((acc, curr) => acc + (curr.amount || 0), 0);

    const totalRedeemed = transactionList
      .filter(
        (transaction) =>
          transaction.type === 'debit' && transaction.status === 'approved'
      )
      .reduce((acc, curr) => acc + Math.abs(curr.amount || 0), 0);

    return { received: totalReceived, redeemed: totalRedeemed };
  };

  // Fetch user data
  const fetchUserData = async () => {
    try {
      const response = await getUserData();
      if (response && response.data && response.data.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Don't show alert for user data error as it's not critical for credits screen
    }
  };

  // Fetch wallet data
  const fetchWalletData = async () => {
    setWalletLoading(true);
    try {
      const response = await getWallet();
      if (response && response.data) {
        setWallet(response.data);
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      Alert.alert('Error', 'Failed to load wallet balance. Please try again.');
    } finally {
      setWalletLoading(false);
    }
  };

  // Fetch transactions data
  const fetchTransactionsData = async () => {
    setTransactionsLoading(true);
    try {
      const response = await getTransactions();
      if (response && response.data) {
        // Handle different possible response structures
        let transactionList = [];
        if (Array.isArray(response.data)) {
          transactionList = response.data;
        } else if (response.data.transactions && Array.isArray(response.data.transactions)) {
          transactionList = response.data.transactions;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          transactionList = response.data.data;
        }

        console.log('Transaction list:', transactionList);

        // Calculate received and redeemed amounts
        const calculatedStats = calculateStats(transactionList);
        setStats(calculatedStats);

        console.log('Calculated stats:', calculatedStats);

        // Transform transactions to match UI structure
        const transformedTransactions = transactionList.slice(0, 5).map((transaction, index) => ({
          id: transaction._id || index.toString(),
          title: transaction.type || 'Transaction',
          date: transaction.date ? new Date(transaction.date).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }).replace(',', ',') : 'N/A',
          description: transaction.description || transaction.type || 'Transaction',
          amount: `₹${Math.abs(transaction.amount || 0).toFixed(2)}`,
          type: transaction.type,
          isLocked: transaction.type === 'LOCKED_REFERRAL_BONUS'
        }));

        setTransactions(transformedTransactions);
      }
    } catch (error) {
      console.error('Error fetching transactions data:', error);
      Alert.alert('Error', 'Failed to load transaction history. Please try again.');
    } finally {
      setTransactionsLoading(false);
    }
  };

  // Fetch all data
  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchUserData(),
        fetchWalletData(),
        fetchTransactionsData()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchAllData();
  }, []);

  // Re-fetch on screen focus
  useFocusEffect(
    useCallback(() => {
      fetchAllData();
    }, [])
  );

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
          <Text style={styles.headerTitle}>Credits</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* --- Balance Card --- */}
          <View style={styles.balanceCard}>
            {walletLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#8F31F9" />
                <Text style={styles.loadingText}>Loading balance...</Text>
              </View>
            ) : (
              <>
                <Text style={styles.helloText}>
                  Hello {user?.name || authUser?.name || 'User'}
                </Text>
                <Text style={styles.balanceAmount}>
                  ₹{wallet?.balance ? wallet.balance.toFixed(2) : '0.00'}
                </Text>
                <Text style={styles.balanceLabel}>Your Balance</Text>
                <View style={styles.divider} />
                <View style={styles.statsContainer}>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Received</Text>
                    <Text style={styles.statAmount}>
                      ₹{stats.received.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Redeemed</Text>
                    <Text style={styles.statAmount}>
                      ₹{stats.redeemed.toFixed(2)}
                    </Text>
                  </View>
                </View>
                {wallet?.lockedRefBonus && wallet.lockedRefBonus > 0 && (
                  <View style={styles.lockedBonusContainer}>
                    <Text style={styles.lockedBonusLabel}>Locked Referral Bonus</Text>
                    <View style={styles.lockedBonusContent}>
                      <Text style={styles.lockedBonusAmount}>
                        ₹{wallet.lockedRefBonus.toFixed(2)}
                      </Text>
                      <Ionicons name="lock-closed" size={18} color="#1A1B20" />
                    </View>
                  </View>
                )}
              </>
            )}
            <TouchableOpacity 
              style={styles.redeemButton}
              onPress={() => navigation.navigate('Redeem')}
            >
              <Text style={styles.redeemButtonText}>Redeem</Text>
            </TouchableOpacity>
          </View>

          {/* --- Transactions History --- */}
          <View style={styles.historyContainer}>
            <View style={styles.historyHeader}>
              <Text style={styles.historyTitle}>Transactions History</Text>
              <TouchableOpacity 
                style={styles.viewAllButton}
                onPress={() => navigation.navigate('TransactionsHistory')}
              >
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            {/* Transaction List */}
            {transactionsLoading ? (
              <View style={styles.transactionLoadingContainer}>
                <ActivityIndicator size="small" color="#8F31F9" />
                <Text style={styles.transactionLoadingText}>Loading transactions...</Text>
              </View>
            ) : transactions.length > 0 ? (
              transactions.map((item) => (
                <View key={item.id} style={styles.transactionItem}>
                  <View style={styles.transactionIconContainer}>
                    <Image
                      source={
                        item.isLocked
                          ? require('../../assets/Icons/locked.png')
                          : require('../../assets/Icons/tickmark.png')
                      }
                      style={styles.checkmarkIcon}
                      resizeMode="cover"
                    />
                  </View>
                  <View style={styles.transactionDetails}>
                    <Text style={styles.transactionTitle}>{item.title}</Text>
                    <Text style={styles.transactionDate}>{item.date}</Text>
                    <Text style={styles.transactionDescription}>{item.description}</Text>
                  </View>
                  <Text style={styles.transactionAmount}>{item.amount}</Text>
                </View>
              ))
            ) : (
              <View style={styles.emptyTransactionsContainer}>
                <Ionicons name="receipt-outline" size={48} color="#7D7D7D" />
                <Text style={styles.emptyTransactionsText}>No transactions found</Text>
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
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  headerTitle: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 24,
    color: '#1A1B20',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Space for bottom nav bar
  },
  balanceCard: {
    backgroundColor: '#FBFBFB',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: 'rgba(143, 49, 249, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#FBFBFB',
    marginTop: 12,
  },
  helloText: {
    fontFamily: 'Rubik-Medium',
    fontSize: 14,
    color: '#1A1B20',
    textAlign: 'center',
  },
  balanceAmount: {
    fontFamily: 'Rubik-Medium',
    fontSize: 32,
    color: '#1A1B20',
    marginVertical: 10,
  },
  balanceLabel: {
    fontFamily: 'Rubik-Regular',
    fontSize: 14,
    color: '#7D7D7D',
    letterSpacing: 0.2,
  },
  divider: {
    height: 1.5,
    backgroundColor: 'rgba(125, 125, 125, 0.1)',
    width: '100%',
    marginVertical: 20,
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
    fontSize: 14,
    color: '#7D7D7D',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  statAmount: {
    fontFamily: 'Rubik-Medium',
    fontSize: 18,
    color: '#1A1B20',
    marginTop: 8,
    textAlign: 'center',
  },
  lockedBonusContainer: {
    backgroundColor: 'rgba(125, 125, 125, 0.05)',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 25,
    alignItems: 'center',
    width: '100%',
  },
  lockedBonusLabel: {
    fontFamily: 'Rubik-Regular',
    fontSize: 14,
    color: '#7D7D7D',
    textAlign: 'center',
    letterSpacing: 0.2,
    marginBottom: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontFamily: 'Rubik-Regular',
    fontSize: 14,
    color: '#7D7D7D',
    marginTop: 10,
    textAlign: 'center',
  },
  lockedBonusContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  lockedBonusAmount: {
    fontFamily: 'Rubik-Medium',
    fontSize: 18,
    color: '#1A1B20',
    textAlign: 'center',
  },
  redeemButton: {
    backgroundColor: '#8F31F9',
    borderRadius: 8,
    height: 47,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  redeemButtonText: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 16,
    color: '#FBFBFB',
    letterSpacing: 0.2,
  },
  historyContainer: {
    marginTop: 30,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  historyTitle: {
    fontFamily: 'Rubik-Medium',
    fontSize: 18,
    color: '#1A1B20',
  },
  viewAllButton: {
    padding: 10,
  },
  viewAllText: {
    fontFamily: 'Rubik-Regular',
    fontSize: 18,
    color: '#8F31F9',
    textDecorationLine: 'underline',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(125, 125, 125, 0.1)',
  },
  transactionIconContainer: {
    width: 60,
    height: 60,
    // borderRadius: 8,
    backgroundColor: 'rgba(150, 61, 251, 0.00)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkmarkIcon: {
    width: 60,
    height: 60,
    
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 16,
    color: '#1A1B20',
  },
  transactionDate: {
    fontFamily: 'Rubik-Regular',
    fontSize: 12,
    color: '#7D7D7D',
    marginVertical: 2,
    letterSpacing: 0.2,
  },
  transactionDescription: {
    fontFamily: 'Rubik-Regular',
    fontSize: 12,
    color: '#7D7D7D',
    letterSpacing: 0.2,
  },
  transactionAmount: {
    fontFamily: 'Rubik-Regular',
    fontSize: 16,
    color: '#1A1B20',
    textAlign: 'right',
  },
  transactionLoadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  transactionLoadingText: {
    fontFamily: 'Rubik-Regular',
    fontSize: 14,
    color: '#7D7D7D',
    marginTop: 10,
    textAlign: 'center',
  },
  emptyTransactionsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyTransactionsText: {
    fontFamily: 'Rubik-Regular',
    fontSize: 14,
    color: '#7D7D7D',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default CreditsScreen;