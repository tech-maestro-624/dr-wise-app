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
import { getTransactions } from '../api/transactions';

// Custom Icon Components
const ReceivedIcon = ({ color }) => (
  <Image 
    source={require('../../assets/Icons/recieved.png')} 
    style={[styles.customIcon, { tintColor: color }]}
    resizeMode="contain"
  />
);

const RedeemedIcon = ({ color }) => (
  <Image 
    source={require('../../assets/Icons/redeemed.png')} 
    style={[styles.customIcon, { tintColor: color }]}
    resizeMode="contain"
  />
);

// Transaction type mapping for UI display
const getTransactionDisplayInfo = (transaction) => {
  let displayText = '';
  let iconType = '';

  switch (transaction.type) {
    case 'credit':
      displayText = 'Received';
      iconType = 'received';
      break;
    case 'JOINING_BONUS':
      displayText = 'Joining Bonus';
      iconType = 'received';
      break;
    case 'UNLOCK_REFERRAL_BONUS':
      displayText = 'Referral Bonus';
      iconType = 'received';
      break;
    case 'LOCKED_REFERRAL_BONUS':
      displayText = 'Locked Referral Bonus';
      iconType = 'locked';
      break;
    case 'debit':
      displayText = transaction.status === 'approved' ? 'Redeemed' : 'Pending Redemption';
      iconType = 'redeemed';
      break;
    default:
      displayText = transaction.type || 'Transaction';
      iconType = 'received';
  }

  return { displayText, iconType };
};

const TransactionsHistoryScreen = () => {
  const navigation = useNavigation();
  const { user: authUser } = useAuth();

  // State management
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Filter options with state
  const filterOptions = [
    { id: 'all', label: 'All', icon: 'checkmark-circle', active: activeFilter === 'all' },
    { id: 'received', label: 'Received', icon: 'custom', active: activeFilter === 'received' },
    { id: 'redeemed', label: 'Redeemed', icon: 'custom', active: activeFilter === 'redeemed' },
  ];

  // Fetch user data
  const fetchUserData = async () => {
    try {
      const response = await getUserData();
      if (response && response.data && response.data.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Fetch transactions data
  const fetchTransactionsData = async () => {
    setLoading(true);
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

        console.log('Transactions fetched:', transactionList);

        // Transform transactions to match UI structure
        const transformedTransactions = transactionList.map((transaction) => {
          const { displayText, iconType } = getTransactionDisplayInfo(transaction);

          return {
            id: transaction._id || Math.random().toString(),
            title: displayText,
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
            type: iconType,
            originalType: transaction.type,
            status: transaction.status,
            transactionId: transaction.transactionId,
          };
        });

        setTransactions(transformedTransactions);
        setFilteredTransactions(transformedTransactions);
      } else {
        console.error('Invalid transactions response format');
        Alert.alert('Error', 'Failed to load transactions. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching transactions data:', error);
      const errorMessage = error?.response?.data?.message || error.message || 'Failed to load transactions. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all data
  const fetchAllData = async () => {
    await Promise.all([
      fetchUserData(),
      fetchTransactionsData()
    ]);
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

  // Handle filter press
  const handleFilterPress = (filterId) => {
    setActiveFilter(filterId);

    if (filterId === 'all') {
      setFilteredTransactions(transactions);
    } else if (filterId === 'received') {
      const receivedTransactions = transactions.filter(transaction =>
        transaction.originalType === 'credit' ||
        transaction.originalType === 'JOINING_BONUS' ||
        transaction.originalType === 'UNLOCK_REFERRAL_BONUS'
      );
      setFilteredTransactions(receivedTransactions);
    } else if (filterId === 'redeemed') {
      const redeemedTransactions = transactions.filter(transaction =>
        transaction.originalType === 'debit' && transaction.status === 'approved'
      );
      setFilteredTransactions(redeemedTransactions);
    }
  };

  // Render icon for filter options
  const renderIcon = (option) => {
    const color = option.active ? "#FBFBFB" : "#7D7D7D";

    if (option.id === 'received') {
      return <ReceivedIcon color={color} />;
    } else if (option.id === 'redeemed') {
      return <RedeemedIcon color={color} />;
    } else {
      return <Ionicons name={option.icon} size={15} color={color} />;
    }
  };

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
          <Text style={styles.headerTitle}>Transactions History</Text>
          <View style={{ width: 46 }} /> {/* Spacer for centering */}
        </View>

        {/* --- Filter Tabs --- */}
        <View style={styles.filterContainer}>
          <View style={styles.filterTabs}>
            {filterOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.filterTab,
                  option.active && styles.filterTabActive
                ]}
                onPress={() => handleFilterPress(option.id)}
              >
                {renderIcon(option)}
                <Text style={[
                  styles.filterTabText,
                  option.active && styles.filterTabTextActive
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* --- Transaction List --- */}
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#8F31F9" />
              <Text style={styles.loadingText}>Loading transactions...</Text>
            </View>
          ) : filteredTransactions.length > 0 ? (
            filteredTransactions.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.transactionItem}
                onPress={() => {
                  if (item.type === 'received') {
                    navigation.navigate('Redeem');
                  }
                }}
              >
                <View style={styles.transactionIconContainer}>
                  {item.type === 'locked' ? (
                    <Image
                      source={require('../../assets/Icons/locked.png')}
                      style={styles.transactionIcon}
                      resizeMode="contain"
                    />
                  ) : item.type === 'redeemed' ? (
                    <Image
                      source={require('../../assets/Icons/redeemed.png')}
                      style={styles.transactionIcon}
                      resizeMode="contain"
                    />
                  ) : (
                    <Image
                      source={require('../../assets/Icons/tickmark.png')}
                      style={styles.transactionIcon}
                      resizeMode="contain"
                    />
                  )}
                </View>
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionTitle}>{item.title}</Text>
                  <Text style={styles.transactionDate}>{item.date}</Text>
                  <Text style={styles.transactionDescription}>{item.description}</Text>
                  {item.transactionId && (
                    <Text style={styles.transactionId}>ID: {item.transactionId}</Text>
                  )}
                  {item.status === 'pending' && (
                    <Text style={styles.transactionStatus}>Status: Pending</Text>
                  )}
                </View>
                <Text style={[
                  styles.transactionAmount,
                  item.originalType === 'debit' ? styles.amountDebit : styles.amountCredit
                ]}>
                  {item.originalType === 'debit' ? '-' : '+'}{item.amount}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="receipt-outline" size={64} color="#7D7D7D" />
              <Text style={styles.emptyText}>
                {activeFilter === 'all'
                  ? 'No transactions found'
                  : `No ${activeFilter} transactions found`
                }
              </Text>
            </View>
          )}
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
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 20,
  },
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: '#FBFBFB',
    borderRadius: 10,
    padding: 4,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    shadowColor: 'rgba(143, 49, 249, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
    width: 312,
    height: 41,
    alignSelf: 'center',
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    gap: 6,
    flex: 1,
    height: 33,
  },
  filterTabActive: {
    backgroundColor: '#8F31F9',
  },
  filterTabText: {
    fontFamily: 'Rubik-Regular',
    fontSize: 14,
    color: '#7D7D7D',
    letterSpacing: 0.2,
    lineHeight: 17,
  },
  filterTabTextActive: {
    color: '#FBFBFB',
  },
  customIcon: {
    width: 15,
    height: 15,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
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
  transactionIcon: {
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
  amountCredit: {
    color: '#4CAF50', // Green for received/credit
  },
  amountDebit: {
    color: '#F44336', // Red for redeemed/debit
  },
  transactionId: {
    fontFamily: 'Rubik-Regular',
    fontSize: 10,
    color: '#7D7D7D',
    marginTop: 2,
  },
  transactionStatus: {
    fontFamily: 'Rubik-Regular',
    fontSize: 10,
    color: '#F6AC11', // Orange for pending
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontFamily: 'Rubik-Regular',
    fontSize: 16,
    color: '#7D7D7D',
    marginTop: 10,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontFamily: 'Rubik-Regular',
    fontSize: 16,
    color: '#7D7D7D',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default TransactionsHistoryScreen;
