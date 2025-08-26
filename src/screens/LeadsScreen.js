import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, StatusBar, Dimensions, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth } = Dimensions.get('window');

// Mock leads data
const leads = [
  {
    id: 1,
    name: 'Kumar',
    product: 'Individual Plan Insurence',
    date: '25-03-2025, 10:43 PM',
    status: 'Converted',
    icon: 'medical',
    iconColor: '#FF6B6B'
  },
  {
    id: 2,
    name: 'Kiran',
    product: 'Car-Private Vehicle Insurence',
    date: '25-03-2025, 10:43 PM',
    status: 'Converted',
    icon: 'car',
    iconColor: '#4ECDC4'
  },
  {
    id: 3,
    name: 'Kumar',
    product: 'Home Loan',
    date: '25-03-2025, 10:43 PM',
    status: 'Converted',
    icon: 'home',
    iconColor: '#45B7D1'
  },
  {
    id: 4,
    name: 'Kumar',
    product: 'GOld Investments',
    date: '25-03-2025, 10:43 PM',
    status: 'Converted',
    icon: 'cash',
    iconColor: '#FFD93D'
  },
  {
    id: 5,
    name: 'Kumar',
    product: 'Individual Plan Insurence',
    date: '25-03-2025, 10:43 PM',
    status: 'Converted',
    icon: 'medical',
    iconColor: '#FF6B6B'
  }
];

const LeadsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const affiliateName = route.params?.affiliateName || 'Dhananjaya J';

  const getIconName = (iconType) => {
    switch (iconType) {
      case 'medical':
        return 'medical-outline';
      case 'car':
        return 'car-outline';
      case 'home':
        return 'home-outline';
      case 'cash':
        return 'cash-outline';
      default:
        return 'document-outline';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#1A1B20" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Leads</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.mainScroll} showsVerticalScrollIndicator={false}>
        {/* Affiliate Name Section */}
        <View style={styles.affiliateSection}>
          <Text style={styles.affiliateName}>{affiliateName}</Text>
        </View>

        {/* Leads List */}
        <View style={styles.leadsContainer}>
          {leads.map((lead) => (
            <TouchableOpacity 
              key={lead.id} 
              style={styles.leadItem}
              onPress={() => navigation.navigate('Calculator', { leadName: lead.name })}
            >
              <View style={styles.leadIconContainer}>
                <View style={[styles.leadIcon, { backgroundColor: lead.iconColor }]}>
                  <Ionicons name={getIconName(lead.icon)} size={24} color="#FFFFFF" />
                </View>
              </View>
              
              <View style={styles.leadInfo}>
                <Text style={styles.leadName}>{lead.name}</Text>
                <Text style={styles.leadProduct}>{lead.product}</Text>
              </View>
              
              <View style={styles.leadStatusContainer}>
                <Text style={styles.leadDate}>{lead.date}</Text>
                <View style={styles.statusContainer}>
                  <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                  <Text style={styles.statusText}>{lead.status}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNavContainer}>
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="home" size={24} color="#1A1B20" />
            <Text style={styles.navTextActive}>Home</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="wallet-outline" size={24} color="#7D7D7D" />
            <Text style={styles.navText}>Credits</Text>
          </TouchableOpacity>
          
          <View style={styles.navItem} />
          
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="people-outline" size={24} color="#7D7D7D" />
            <Text style={styles.navText}>My Referral</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="person-outline" size={24} color="#7D7D7D" />
            <Text style={styles.navText}>Profile</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={30} color="#FFFFFF" />
        </TouchableOpacity>
        
        <View style={styles.homeIndicator}>
          <View style={styles.homeIndicatorLine} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6FE',
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  
  backButton: {
    padding: 5,
  },
  
  headerTitle: {
    fontFamily: 'Rubik',
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1B20',
  },
  
  headerSpacer: {
    width: 34, // Same width as back button for centering
  },
  
  mainScroll: {
    flex: 1,
  },
  
  affiliateSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  
  affiliateName: {
    fontFamily: 'Rubik',
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1B20',
    lineHeight: 28,
  },
  
  leadsContainer: {
    paddingHorizontal: 20,
  },
  
  leadItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  
  leadIconContainer: {
    marginRight: 16,
  },
  
  leadIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  leadInfo: {
    flex: 1,
  },
  
  leadName: {
    fontFamily: 'Rubik',
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1B20',
    lineHeight: 19,
    marginBottom: 4,
  },
  
  leadProduct: {
    fontFamily: 'Rubik',
    fontSize: 14,
    color: '#7D7D7D',
    lineHeight: 17,
  },
  
  leadStatusContainer: {
    alignItems: 'flex-end',
  },
  
  leadDate: {
    fontFamily: 'Rubik',
    fontSize: 12,
    color: '#7D7D7D',
    lineHeight: 14,
    marginBottom: 4,
  },
  
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  
  statusText: {
    fontFamily: 'Rubik',
    fontSize: 12,
    fontWeight: '500',
    color: '#10B981',
    lineHeight: 14,
  },
  
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  
  bottomNav: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#FBFBFB',
    borderTopWidth: 1,
    borderColor: '#F0F0F0',
    alignItems: 'center',
    paddingBottom: 20,
  },
  
  navItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  
  navText: {
    fontFamily: 'Rubik',
    fontSize: 12,
    color: '#7D7D7D',
    lineHeight: 16,
  },
  
  navTextActive: {
    fontFamily: 'Rubik',
    fontSize: 12,
    color: '#1A1B20',
    lineHeight: 16,
  },
  
  addButton: {
    position: 'absolute',
    alignSelf: 'center',
    top: -26,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#8F31F9',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8F31F9',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 8,
  },
  
  homeIndicator: {
    height: 34,
    backgroundColor: '#FBFBFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  homeIndicatorLine: {
    width: 135,
    height: 5,
    backgroundColor: '#1A1B20',
    borderRadius: 100,
  },
});

export default LeadsScreen;

