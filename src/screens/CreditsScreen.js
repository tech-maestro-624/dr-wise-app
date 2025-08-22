import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const TransactionItem = ({ transaction }) => (
  <View style={styles.transactionItemContainer}>
    <View style={styles.transactionIconContainer}>
        <Ionicons name="checkmark-done-circle" size={30} color="green" />
    </View>
    <View style={styles.transactionDetails}>
      <Text style={styles.transactionTitle}>{transaction.title}</Text>
      <Text style={styles.transactionDate}>{transaction.date}</Text>
      <Text style={styles.transactionDescription}>{transaction.description}</Text>
    </View>
    <Text style={styles.transactionAmount}>{transaction.amount}</Text>
  </View>
);

const CreditsScreen = () => {
  const transactions = [
    {
      id: '1',
      title: 'Individual Plan',
      date: '25-03-2025, 10:43 PM',
      description: 'Welcome Bonus of 100 Coins',
      amount: '₹100.00',
    },
    {
      id: '2',
      title: 'Individual Plan',
      date: '25-03-2025, 10:43 PM',
      description: 'Welcome Bonus of 100 Coins',
      amount: '₹100.00',
    },
    {
      id: '3',
      title: 'Individual Plan',
      date: '25-03-2025, 10:43 PM',
      description: 'Welcome Bonus of 100 Coins',
      amount: '₹100.00',
    },
  ];

  return (
    <LinearGradient colors={['#F2EBFE', '#fff']} style={{flex: 1}}>
        <SafeAreaView style={styles.safeArea}>
        <Text style={styles.headerText}>Credits</Text>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.balanceCard}>
                <Text style={styles.greeting}>Hello Punith</Text>
                <Text style={styles.balanceAmount}>₹1,200</Text>
                <Text style={styles.balanceLabel}>Your Balance</Text>
                <View style={styles.separator} />
                <View style={styles.statsContainer}>
                    <View style={styles.stat}>
                    <Text style={styles.statLabel}>Received</Text>
                    <Text style={styles.statValue}>₹100.00</Text>
                    </View>
                    <View style={styles.stat}>
                    <Text style={styles.statLabel}>Redeemed</Text>
                    <Text style={styles.statValue}>₹0.00</Text>
                    </View>
                </View>
                <View style={styles.lockedBonusContainer}>
                    <Text style={styles.statLabel}>Locked Referral Bouns</Text>
                    <View style={styles.lockedAmountContainer}>
                        <Ionicons name="lock-closed" size={18} color="#1A1B20" style={{marginRight: 5}}/>
                        <Text style={styles.statValue}>₹100.00</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.redeemButton}>
                    <Text style={styles.redeemButtonText}>Redeem</Text>
                </TouchableOpacity>
                </View>

                <View style={styles.transactionsContainer}>
                <View style={styles.transactionsHeader}>
                    <Text style={styles.transactionsTitle}>Transactions History</Text>
                    <TouchableOpacity>
                    <Text style={styles.viewAllText}>View All</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    {transactions.map((item) => (
                    <TransactionItem key={item.id} transaction={item} />
                    ))}
                </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerText: {
    color: '#1A1B20',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    fontFamily: 'Rubik',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  balanceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: 'rgba(143, 49, 249, 0.1)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    marginBottom: 20,
  },
  greeting: {
    fontFamily: 'Rubik',
    fontWeight: 'bold',
    fontSize: 14,
    color: '#1A1B20',
  },
  balanceAmount: {
    fontFamily: 'Rubik',
    fontWeight: 'bold',
    fontSize: 32,
    color: '#1A1B20',
    marginTop: 8,
  },
  balanceLabel: {
    fontFamily: 'Rubik',
    fontWeight: '400',
    fontSize: 14,
    color: '#7D7D7D',
    letterSpacing: 0.2,
    marginTop: 4,
  },
  separator: {
    width: '100%',
    height: 1.5,
    backgroundColor: 'rgba(125, 125, 125, 0.1)',
    marginVertical: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontFamily: 'Rubik',
    fontWeight: '500',
    fontSize: 14,
    color: '#7D7D7D',
    letterSpacing: 0.2,
  },
  statValue: {
    fontFamily: 'Rubik',
    fontWeight: 'bold',
    fontSize: 18,
    color: '#1A1B20',
    marginTop: 8,
  },
  lockedBonusContainer: {
    width: '100%',
    backgroundColor: 'rgba(125, 125, 125, 0.05)',
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  lockedAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  redeemButton: {
    backgroundColor: '#8F31F9',
    borderRadius: 8,
    paddingVertical: 14,
    width: '100%',
    marginTop: 20,
  },
  redeemButtonText: {
    color: '#FBFBFB',
    fontFamily: 'Rubik',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  transactionsContainer: {
    marginTop: 20,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  transactionsTitle: {
    fontFamily: 'Rubik',
    fontWeight: 'bold',
    fontSize: 18,
    color: '#1A1B20',
  },
  viewAllText: {
    fontFamily: 'Rubik',
    fontWeight: '500',
    fontSize: 18,
    color: '#8F31F9',
    textDecorationLine: 'underline',
  },
  transactionItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(125, 125, 125, 0.1)',
  },
  transactionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: 'rgba(208, 245, 208, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontFamily: 'Rubik',
    fontWeight: 'bold',
    fontSize: 16,
    color: '#1A1B20',
  },
  transactionDate: {
    fontFamily: 'Rubik',
    fontWeight: '400',
    fontSize: 12,
    color: '#7D7D7D',
    letterSpacing: 0.2,
    marginTop: 4,
  },
  transactionDescription: {
    fontFamily: 'Rubik',
    fontWeight: '400',
    fontSize: 12,
    color: '#7D7D7D',
    letterSpacing: 0.2,
    marginTop: 4,
  },
  transactionAmount: {
    fontFamily: 'Rubik',
    fontWeight: '500',
    fontSize: 16,
    color: '#1A1B20',
    textAlign: 'right',
  },
});

export default CreditsScreen;
