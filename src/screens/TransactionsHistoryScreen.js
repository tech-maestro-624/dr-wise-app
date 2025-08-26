import React, { useState } from 'react';
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

// Mock data for the transaction list
const transactions = [
  {
    id: 1,
    title: 'Individual Plan',
    date: '25-03-2025,10:43 PM',
    description: 'Welcome Bonus of 100 Coins',
    amount: '₹100.00',
    type: 'received'
  },
  {
    id: 2,
    title: 'Locked Referral Bonus',
    date: '24-03-2025,08:12 PM',
    description: 'Welcome Bonus of 100 Coins',
    amount: '₹100.00',
    type: 'locked'
  },
  {
    id: 3,
    title: 'Individual Plan',
    date: '23-03-2025,09:30 AM',
    description: 'Welcome Bonus of 100 Coins',
    amount: '₹100.00',
    type: 'received'
  },
  {
    id: 4,
    title: 'Individual Plan',
    date: '22-03-2025,02:15 PM',
    description: 'Referral Bonus',
    amount: '₹100.00',
    type: 'received'
  },
  {
    id: 5,
    title: 'Individual Plan',
    date: '21-03-2025,11:45 AM',
    description: 'Welcome Bonus of 100 Coins',
    amount: '₹100.00',
    type: 'received'
  },
  {
    id: 6,
    title: 'Individual Plan',
    date: '20-03-2025,03:20 PM',
    description: 'Referral Bonus',
    amount: '₹100.00',
    type: 'received'
  },
];

const filterOptions = [
  { id: 'all', label: 'All', icon: 'checkmark-circle', active: true },
  { id: 'received', label: 'Received', icon: 'custom', active: false },
  { id: 'redeemed', label: 'Redeemed', icon: 'custom', active: false },
];

const TransactionsHistoryScreen = () => {
  const navigation = useNavigation();
  const [activeFilter, setActiveFilter] = useState('all');

  const handleFilterPress = (filterId) => {
    setActiveFilter(filterId);
    // Update active states
    filterOptions.forEach(option => {
      option.active = option.id === filterId;
    });
  };

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
          {transactions.map((item) => (
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
              </View>
              <Text style={styles.transactionAmount}>{item.amount}</Text>
            </TouchableOpacity>
          ))}
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
});

export default TransactionsHistoryScreen;
