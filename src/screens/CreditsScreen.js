import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Mock data for the transaction list
const transactions = [
  {
    id: 1,
    title: 'Individual Plan',
    date: '25-03-2025,10:43 PM',
    description: 'Welcome Bonus of 100 Coins',
    amount: '₹100.00',
  },
  {
    id: 2,
    title: 'Individual Plan',
    date: '24-03-2025,08:12 PM',
    description: 'Referral Bonus',
    amount: '₹100.00',
  },
  {
    id: 3,
    title: 'Individual Plan',
    date: '23-03-2025,09:30 AM',
    description: 'Welcome Bonus of 100 Coins',
    amount: '₹100.00',
  },
  {
    id: 4,
    title: 'Individual Plan',
    date: '22-03-2025,02:15 PM',
    description: 'Referral Bonus',
    amount: '₹100.00',
  },
  {
    id: 5,
    title: 'Individual Plan',
    date: '21-03-2025,11:45 AM',
    description: 'Welcome Bonus of 100 Coins',
    amount: '₹100.00',
  },
];

const CreditsScreen = () => {
  const navigation = useNavigation();

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
            <Text style={styles.helloText}>Hello Punith</Text>
            <Text style={styles.balanceAmount}>₹1,200</Text>
            <Text style={styles.balanceLabel}>Your Balance</Text>
            <View style={styles.divider} />
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Received</Text>
                <Text style={styles.statAmount}>₹100.00</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Redeemed</Text>
                <Text style={styles.statAmount}>₹0.00</Text>
              </View>
            </View>
            <View style={styles.lockedBonusContainer}>
              <Text style={styles.lockedBonusLabel}>Locked Referral Bouns</Text>
              <View style={styles.lockedBonusContent}>
                <Text style={styles.lockedBonusAmount}>₹100.00</Text>
                <Ionicons name="lock-closed" size={18} color="#1A1B20" />
              </View>
            </View>
            <TouchableOpacity style={styles.redeemButton}>
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
            {transactions.map((item) => (
              <View key={item.id} style={styles.transactionItem}>
                <View style={styles.transactionIconContainer}>
                  <Image 
                    source={require('../../assets/Icons/tickmark.png')} 
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
            ))}
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
});

export default CreditsScreen;