import React, { useState, useEffect } from 'react';
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
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getLeads } from '../api/lead';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const scale = Math.min(screenWidth / 375, screenHeight / 812);

const LeadItem = ({ lead, onPress }) => {
  // Get status color and icon
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'converted':
        return { color: '#38D552', icon: 'checkmark-circle' };
      case 'pending':
        return { color: '#FFA500', icon: 'time-outline' };
      case 'rejected':
        return { color: '#FF4444', icon: 'close-circle' };
      default:
        return { color: '#666666', icon: 'help-circle-outline' };
    }
  };

  const statusStyle = getStatusStyle(lead.status);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ', ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    } catch {
      return dateString;
    }
  };

  return (
    <TouchableOpacity style={styles.leadItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.leadIconContainer}>
        <Image
          source={require('../../assets/Icons/image.png')} // Default icon
          style={styles.leadIcon}
          resizeMode="contain"
        />
      </View>

      <View style={styles.leadInfo}>
        <Text style={styles.leadName}>{lead.name || 'Unknown'}</Text>
        <Text style={styles.leadType}>
          {lead.productId?.name || lead.categoryId?.name || lead.type || 'General Lead'}
        </Text>
      </View>

      <View style={styles.leadRight}>
        <Text style={styles.leadDate}>{formatDate(lead.createdAt || lead.updatedAt || lead.date)}</Text>
        <View style={styles.statusContainer}>
          <Text style={[styles.statusText, { color: statusStyle.color }]}>
            {lead.status || 'Unknown'}
          </Text>
          <Ionicons name={statusStyle.icon} size={16} color={statusStyle.color} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const LeadsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { affiliateId, affiliateName } = route.params || {};
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch leads for the specific affiliate
  const fetchAffiliateLeads = async () => {
    if (!affiliateId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await getLeads({
        condition: { referrer: affiliateId },
        page: 1,
        limit: 50
      });

      if (response.data && response.data.leads) {
        setLeads(response.data.leads);
      } else if (response.data && response.data.data) {
        setLeads(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
      Alert.alert('Error', error?.response?.data?.message || error.message || 'Failed to load leads data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAffiliateLeads();
  }, [affiliateId]);

  return (
    <LinearGradient
      colors={['#F3ECFE', '#F6F6FE']}
      locations={[0, 0.4917]}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FBFBFB" />
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back-outline" size={24} color="#1A1B20" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Leads</Text>
          
          <View style={styles.placeholder} />
        </View>

        {/* Affiliate Name */}
        <Text style={styles.affiliateName}>{affiliateName}</Text>

        {/* Leads List */}
        <ScrollView
          style={styles.leadsContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.leadsContent}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#8F31F9" />
              <Text style={styles.loadingText}>Loading leads...</Text>
            </View>
          ) : leads.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {affiliateId ? 'No leads found for this affiliate' : 'No affiliate selected'}
              </Text>
            </View>
          ) : (
            leads.map((lead, index) => (
              <View key={lead._id || lead.id}>
                <LeadItem
                  lead={lead}
                  onPress={() => navigation.navigate('Calculator')}
                />
                {index < leads.length - 1 && <View style={styles.separator} />}
              </View>
            ))
          )}
        </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20 * scale,
    paddingTop: Platform.OS === 'ios' ? 50 * scale : 20 * scale,
    paddingBottom: 20 * scale,
  },
  backButton: {
    width: 26 * scale,
    height: 26 * scale,
    borderRadius: 4 * scale,
    backgroundColor: 'rgba(150, 61, 251, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24 * scale,
    fontWeight: '600',
    color: '#1A1B20',
    fontFamily: 'Rubik-SemiBold',
  },
  placeholder: {
    width: 26 * scale,
  },
  affiliateName: {
    fontSize: 24 * scale,
    fontWeight: '500',
    color: '#1A1B20',
    fontFamily: 'Rubik-Medium',
    paddingHorizontal: 20 * scale,
    marginBottom: 20 * scale,
  },
  leadsContainer: {
    flex: 1,
  },
  leadsContent: {
    paddingBottom: 100 * scale,
  },
  leadItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15 * scale,
    paddingHorizontal: 20 * scale,
    height: 67 * scale,
  },
  leadIconContainer: {
    width: 46 * scale,
    height: 46 * scale,
    borderRadius: 8 * scale,
    backgroundColor: 'rgba(150, 61, 251, 0.00)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16 * scale,
    flexShrink: 0,
  },
  leadIcon: {
    width: 46 * scale,
    height: 46 * scale,
  },
  leadInfo: {
    flex: 1,
    marginRight: 16 * scale,
    minWidth: 0,
  },
  leadName: {
    fontSize: 16 * scale,
    fontWeight: '600',
    color: '#1A1B20',
    fontFamily: 'Rubik-SemiBold',
    marginBottom: 4 * scale,
  },
  leadType: {
    fontSize: 12 * scale,
    fontWeight: '400',
    color: '#7D7D7D',
    fontFamily: 'Rubik-Regular',
    letterSpacing: 0.2,
  },
  leadRight: {
    alignItems: 'flex-end',
    flexShrink: 0,
    minWidth: 120 * scale,
  },
  leadDate: {
    fontSize: 12 * scale,
    fontWeight: '400',
    color: '#1A1B20',
    fontFamily: 'Rubik-Regular',
    marginBottom: 4 * scale,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4 * scale,
  },
  statusText: {
    fontSize: 12 * scale,
    fontWeight: '400',
    color: '#38D552',
    fontFamily: 'Rubik-Regular',
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(125, 125, 125, 0.1)',
    marginLeft: 58 * scale,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40 * scale,
  },
  loadingText: {
    marginTop: 10 * scale,
    fontSize: 16 * scale,
    color: '#7D7D7D',
    fontFamily: 'Rubik-Regular',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40 * scale,
  },
  emptyText: {
    fontSize: 16 * scale,
    color: '#7D7D7D',
    fontFamily: 'Rubik-Regular',
    textAlign: 'center',
  },
});

export default LeadsScreen;

