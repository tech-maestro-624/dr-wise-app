import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons'; // Assuming you are using Expo for icons

// Placeholder for design system colors
const Colors = {
  background: '#F7F2FE',
  textDark: '#1A1B20',
  textGray: '#7D7D7D',
  primaryPurple: '#8F31F9',
  cardBackground: '#FFFFFF',
  pendingText: '#FFA500', // Orange color for pending status
  borderColor: '#EAEAEA',
};

// Mock data for demonstration purposes
const referralData = [
  {
    id: '1',
    statusTitle: 'Status 1',
    name: 'Punith',
    phone: '8293742728',
    category: 'Travel',
    product: 'Goa',
    status: 'Pending',
  },
  {
    id: '2',
    statusTitle: 'Status 2',
    name: 'Punith',
    phone: '8293742728',
    category: 'Travel',
    product: 'Goa',
    status: 'Pending',
  },
  {
    id: '3',
    statusTitle: 'Status 3',
    name: 'Jane Doe',
    phone: '9876543210',
    category: 'Electronics',
    product: 'Laptop',
    status: 'Approved',
  },
];

const StatusCard = ({data}) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{data.statusTitle}</Text>
    <View style={styles.divider} />
    <View style={styles.row}>
      <Text style={styles.label}>Name</Text>
      <Text style={styles.value}>{data.name}</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.label}>Phone</Text>
      <Text style={styles.value}>{data.phone}</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.label}>Category</Text>
      <Text style={styles.value}>{data.category}</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.label}>Product</Text>
      <Text style={styles.value}>{data.product}</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.label}>Status</Text>
      <View style={styles.statusContainer}>
        <Ionicons name="time-outline" size={16} color={Colors.pendingText} />
        <Text style={[styles.value, {color: Colors.pendingText}]}>
          {data.status}
        </Text>
      </View>
    </View>
  </View>
);

const ReferralStatusScreen = () => {
  const [activeTab, setActiveTab] = useState('Pending'); // 'Pending' or 'Approved'

  const filteredData = referralData.filter(item => item.status === activeTab);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Referral Status</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.textGray} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search.."
          placeholderTextColor={Colors.textGray}
        />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Pending' && styles.activeTab]}
          onPress={() => setActiveTab('Pending')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'Pending' && styles.activeTabText,
            ]}>
            Pending
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Approved' && styles.activeTab]}
          onPress={() => setActiveTab('Approved')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'Approved' && styles.activeTabText,
            ]}>
            Approved
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {filteredData.map(item => (
          <StatusCard key={item.id} data={item} />
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
  header: {
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.textDark,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 10,
    fontSize: 16,
    color: Colors.textDark,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#E8DAFA',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: Colors.primaryPurple,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textDark,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  container: {
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderColor,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  label: {
    fontSize: 14,
    color: Colors.textGray,
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textDark,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});

export default ReferralStatusScreen;