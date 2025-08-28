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
  Platform,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const scale = Math.min(screenWidth / 375, screenHeight / 812);

// Lead data - you can replace this with actual data
const leadsData = [
  {
    id: 1,
    name: 'Kumar',
    type: 'Individual Plan Insurance',
    date: '25-03-2025, 10:43 PM',
    status: 'Converted',
    icon: require('../../assets/Icons/image.png'),
  },
  {
    id: 2,
    name: 'Kiran',
    type: 'Car-Private Vehicle Insurance',
    date: '25-03-2025, 10:43 PM',
    status: 'Converted',
    icon: require('../../assets/Icons/Group 9167.png'),
  },
  {
    id: 3,
    name: 'Rahul',
    type: 'Home Loan',
    date: '25-03-2025, 10:43 PM',
    status: 'Converted',
    icon: require('../../assets/Icons/Group 9167 (1).png'),
  },
  {
    id: 4,
    name: 'Priya',
    type: 'Gold Investments',
    date: '25-03-2025, 10:43 PM',
    status: 'Converted',
    icon: require('../../assets/Icons/Group 9167 (2).png'),
  },
  {
    id: 5,
    name: 'Amit',
    type: 'Individual Plan Insurance',
    date: '25-03-2025, 10:43 PM',
    status: 'Converted',
    icon: require('../../assets/Icons/image.png'),
  },
];

const LeadItem = ({ lead, onPress }) => (
  <TouchableOpacity style={styles.leadItem} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.leadIconContainer}>
      <Image 
        source={lead.icon}
        style={styles.leadIcon}
        resizeMode="contain"
      />
    </View>
    
    <View style={styles.leadInfo}>
      <Text style={styles.leadName}>{lead.name}</Text>
      <Text style={styles.leadType}>{lead.type}</Text>
    </View>
    
    <View style={styles.leadRight}>
      <Text style={styles.leadDate}>{lead.date}</Text>
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>{lead.status}</Text>
        <Ionicons name="checkmark-circle" size={16} color="#38D552" />
      </View>
    </View>
  </TouchableOpacity>
);

const LeadsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const affiliateName = route.params?.affiliateName || 'Dhananjaya J';

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
          {leadsData.map((lead, index) => (
            <View key={lead.id}>
              <LeadItem 
                lead={lead} 
                onPress={() => navigation.navigate('Main', { screen: 'Home', params: { screen: 'Calculator' } })}
              />
              {index < leadsData.length - 1 && <View style={styles.separator} />}
            </View>
          ))}
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
});

export default LeadsScreen;

