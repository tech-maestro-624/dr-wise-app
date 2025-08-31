import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Platform,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { getUserData } from '../api/auth';
import { getLeads } from '../api/lead';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const scale = Math.min(screenWidth / 375, screenHeight / 812);

// Reusable component for each row in the status card
const InfoRow = ({ label, value, isStatus = false }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    {isStatus ? (
      <View style={styles.statusContainer}>
        <Ionicons name="time-outline" size={16 * scale} color="#F6AC11" />
        <Text style={styles.statusText}>{value}</Text>
      </View>
    ) : (
      <Text style={styles.value}>{value}</Text>
    )}
  </View>
);

const ReferralStatusScreen = () => {
  const [activeTab, setActiveTab] = useState('Pending');
  const [referralData, setReferralData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const { user: authUser } = useAuth();

  // Fetch user data
  const fetchUserData = async () => {
    try {
      const response = await getUserData();
      if (response && response.data && response.data.user) {
        setUser(response.data.user);
      } else {
        console.error('Invalid user data response format');
        Alert.alert('Error', 'Failed to load user data. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      const errorMessage = error?.response?.data?.message || error.message || 'Failed to load user data';
      Alert.alert('Error', errorMessage);
    }
  };

  // Fetch referral data
  const fetchReferralData = async () => {
    if (!user?._id) return;

    setLoading(true);
    try {
      const response = await getLeads({
        condition: { referrer: user._id },
        page: 1,
        limit: 50, // Fetch more items to show all referrals
      });

      if (response && response.data) {
        console.log('Referral API response:', response.data);

        // Handle different possible response structures
        let leads = [];
        if (response.data.leads && Array.isArray(response.data.leads)) {
          leads = response.data.leads;
        } else if (Array.isArray(response.data)) {
          leads = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          leads = response.data.data;
        } else {
          console.error('Unexpected response structure:', response.data);
          Alert.alert('Error', 'Unexpected data format from server. Please try again.');
          return;
        }

        console.log('Leads array:', leads);

        // Transform the data to match the UI structure
        const transformedData = leads.map((lead, index) => ({
          id: lead._id || index.toString(),
          statusTitle: `Status ${index + 1}`,
          name: lead.name || 'N/A',
          phone: lead.phoneNumber || lead.phone || 'N/A',
          category: lead.categoryId?.name || 'N/A',
          product: lead.productId?.name || 'N/A',
          status: lead.status || 'Pending',
          createdAt: lead.createdAt,
          updatedAt: lead.updatedAt,
        }));

        setReferralData(transformedData);
        setFilteredData(transformedData);
      } else {
        console.error('Invalid referral data response format');
        Alert.alert('Error', 'Failed to fetch referral data. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching referral data:', error);
      const errorMessage = error?.response?.data?.message || error.message || 'Failed to fetch referral data. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchUserData();
  }, []);

  // Fetch referral data when user is available
  useEffect(() => {
    if (user?._id) {
      fetchReferralData();
    }
  }, [user]);

  // Re-fetch on screen focus
  useFocusEffect(
    useCallback(() => {
      if (user?._id) {
        fetchReferralData();
      }
    }, [user])
  );

  // Filter data based on the active tab and search term
  useEffect(() => {
    let filtered = referralData.filter(item => {
      const statusMatch = item.status === activeTab;
      const searchMatch = searchTerm === '' || 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.phone.includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.product.toLowerCase().includes(searchTerm.toLowerCase());
      
      return statusMatch && searchMatch;
    });
    
    setFilteredData(filtered);
  }, [activeTab, searchTerm, referralData]);

  // Handle search input
  const handleSearch = (text) => {
    setSearchTerm(text);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3ECFE" />
      <LinearGradient
        colors={['#F3ECFE', '#F6F6FE']}
        locations={[0, 0.4917]}
        style={styles.background}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Referral Status</Text>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterWrapper}>
          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={[styles.filterTab, activeTab === 'Pending' && styles.activeFilterTab]}
              onPress={() => setActiveTab('Pending')}
            >
              <Ionicons name="time" size={15 * scale} color={activeTab === 'Pending' ? '#FBFBFB' : '#7D7D7D'} />
              <Text style={[styles.filterText, activeTab === 'Pending' && styles.activeFilterText]}>Pending</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterTab, activeTab === 'Approved' && styles.activeFilterTab]}
              onPress={() => setActiveTab('Approved')}
            >
              <Ionicons name="checkmark-circle" size={15 * scale} color={activeTab === 'Approved' ? '#FBFBFB' : '#7D7D7D'} />
              <Text style={[styles.filterText, activeTab === 'Approved' && styles.activeFilterText]}>Approved</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={22 * scale} color="#1A1B20" />
          <TextInput
            placeholder="Search.."
            placeholderTextColor="#7D7D7D"
            style={styles.searchInput}
            value={searchTerm}
            onChangeText={handleSearch}
          />
        </View>

        {/* Status Cards */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#8F31F9" />
              <Text style={styles.loadingText}>Loading referrals...</Text>
            </View>
          ) : filteredData.length > 0 ? (
            filteredData.map(item => (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{item.statusTitle}</Text>
                </View>
                <View style={styles.cardBody}>
                  <InfoRow label="Name" value={item.name} />
                  <InfoRow label="Phone" value={item.phone} />
                  <InfoRow label="Category" value={item.category} />
                  <InfoRow label="Product" value={item.product} />
                  <InfoRow label="Status" value={item.status} isStatus={true} />
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text-outline" size={48 * scale} color="#7D7D7D" />
              <Text style={styles.emptyText}>
                {searchTerm ? 'No referrals found matching your search.' : `No ${activeTab.toLowerCase()} referrals found.`}
              </Text>
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F3ECFE',
    borderRadius: 40 * scale,
    overflow: 'hidden',
  },
  background: { 
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    height: 80 * scale,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 28 * scale,
  },
  headerTitle: {
    fontFamily: 'Rubik',
    fontSize: 24 * scale,
    fontWeight: '600',
    color: '#1A1B20',
    lineHeight: 28 * scale,
    textAlign: 'center',
  },
  filterWrapper: {
    paddingHorizontal: 20 * scale,
    marginBottom: 10 * scale,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#FBFBFB',
    borderRadius: 10 * scale,
    padding: 4 * scale,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    shadowColor: 'rgba(143, 49, 249, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 3,
  },
  filterTab: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8 * scale,
    paddingHorizontal: 14 * scale,
    borderRadius: 6 * scale,
    gap: 6 * scale,
  },
  activeFilterTab: {
    backgroundColor: '#8F31F9',
  },
  filterText: {
    fontFamily: 'Rubik',
    fontSize: 14 * scale,
    fontWeight: '400',
    color: '#7D7D7D',
    lineHeight: 17 * scale,
    letterSpacing: 0.2,
  },
  activeFilterText: {
    color: '#FBFBFB',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FBFBFB',
    borderRadius: 10 * scale,
    paddingHorizontal: 12 * scale,
    marginHorizontal: 20 * scale,
    marginBottom: 10 * scale,
    height: 40 * scale,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    shadowColor: 'rgba(143, 49, 249, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10 * scale,
    fontFamily: 'Rubik',
    fontSize: 13 * scale,
    color: '#1A1B20',
    lineHeight: 15 * scale,
    letterSpacing: 0.2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20 * scale,
    paddingTop: 10 * scale,
    paddingBottom: 20 * scale,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40 * scale,
  },
  loadingText: {
    fontFamily: 'Rubik',
    fontSize: 14 * scale,
    color: '#7D7D7D',
    marginTop: 10 * scale,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40 * scale,
  },
  emptyText: {
    fontFamily: 'Rubik',
    fontSize: 14 * scale,
    color: '#7D7D7D',
    textAlign: 'center',
    marginTop: 10 * scale,
  },
  card: {
    backgroundColor: '#FBFBFB',
    borderRadius: 10 * scale,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    shadowColor: 'rgba(143, 49, 249, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 10 * scale,
    overflow: 'hidden',
  },
  cardHeader: {
    backgroundColor: 'rgba(125, 125, 125, 0.05)',
    paddingVertical: 10 * scale,
    paddingHorizontal: 12 * scale,
  },
  cardTitle: {
    fontFamily: 'Rubik',
    fontSize: 16 * scale,
    fontWeight: '500',
    color: '#1A1B20',
    lineHeight: 19 * scale,
  },
  cardBody: {
    paddingHorizontal: 12 * scale,
    paddingVertical: 20 * scale,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10 * scale,
  },
  label: {
    fontFamily: 'Rubik',
    fontSize: 14 * scale,
    fontWeight: '400',
    color: '#1A1B20',
    lineHeight: 17 * scale,
  },
  value: {
    fontFamily: 'Rubik',
    fontSize: 14 * scale,
    fontWeight: '400',
    color: '#7D7D7D',
    lineHeight: 17 * scale,
    letterSpacing: 0.2,
    textAlign: 'right',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6 * scale,
  },
  statusText: {
    fontFamily: 'Rubik',
    fontSize: 14 * scale,
    fontWeight: '400',
    color: '#F6AC11',
    lineHeight: 17 * scale,
    letterSpacing: 0.2,
  },
});

export default ReferralStatusScreen;