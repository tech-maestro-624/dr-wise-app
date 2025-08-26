import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const CalculatorScreen = ({ navigation, route }) => {
  const { leadName } = route.params || {};
  const [selectedService, setSelectedService] = useState('Select Your Service');
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);

  const insuranceServices = [
    {
      id: 1,
      title: 'INSURANCE',
      subServices: [
        'Term Insurance',
        'ULIPs',
        'Children Plan',
        'Retirement Plan',
        'Savings Plan',
        'Investment Plan',
        'Endowment / Guranteed Plan',
        'Income / Money back Plan',
        'Whole Life Plan'
      ]
    },
    {
      id: 2,
      title: 'INSURANCE',
      subServices: [
        'Term Insurance',
        'ULIPs',
        'Children Plan',
        'Retirement Plan',
        'Savings Plan',
        'Investment Plan',
        'Endowment / Guranteed Plan',
        'Income / Money back Plan',
        'Whole Life Plan'
      ]
    },
    {
      id: 3,
      title: 'INSURANCE',
      subServices: [
        'Term Insurance',
        'ULIPs',
        'Children Plan',
        'Retirement Plan',
        'Savings Plan',
        'Investment Plan',
        'Endowment / Guranteed Plan',
        'Income / Money back Plan',
        'Whole Life Plan'
      ]
    },
    {
      id: 4,
      title: 'INSURANCE',
      subServices: [
        'Term Insurance',
        'ULIPs',
        'Children Plan',
        'Retirement Plan',
        'Savings Plan',
        'Investment Plan',
        'Endowment / Guranteed Plan',
        'Income / Money back Plan',
        'Whole Life Plan'
      ]
    },
    {
      id: 5,
      title: 'INSURANCE',
      subServices: [
        'Term Insurance',
        'ULIPs',
        'Children Plan',
        'Retirement Plan',
        'Savings Plan',
        'Investment Plan',
        'Endowment / Guranteed Plan',
        'Income / Money back Plan',
        'Whole Life Plan'
      ]
    }
  ];

  const renderInsuranceCard = (service, index) => (
    <View key={service.id} style={styles.insuranceCard}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleContainer}>
          <Text style={styles.cardTitle}>{service.title}</Text>
        </View>
        <TouchableOpacity style={styles.arrowButton}>
          <Ionicons name="chevron-down" size={20} color="#1A1B20" />
        </TouchableOpacity>
      </View>
      <View style={styles.subServicesContainer}>
        <View style={styles.subServicesList}>
          {service.subServices.map((subService, subIndex) => (
            <TouchableOpacity 
              key={subIndex} 
              style={styles.subServiceItem}
              onPress={() => {
                if (subService === 'Term Insurance') {
                  navigation.navigate('TermInsuranceCalculator', { 
                    serviceName: subService,
                    leadName: leadName 
                  });
                }
                // Add more service navigation logic here as needed
              }}
            >
              <Text style={styles.subServiceText}>{subService}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FBFBFB" />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={['rgba(243, 236, 254, 1)', 'rgba(246, 246, 254, 1)']}
        style={styles.backgroundGradient}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#1A1B20" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Calculator</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Lead Name Section */}
      {leadName && (
        <View style={styles.leadSection}>
          <Text style={styles.leadName}>{leadName}</Text>
        </View>
      )}

      {/* Service Selection */}
      <View style={styles.serviceSelectionContainer}>
        <TouchableOpacity 
          style={styles.serviceDropdown}
          onPress={() => setShowServiceDropdown(!showServiceDropdown)}
        >
          <Text style={styles.serviceDropdownText}>{selectedService}</Text>
          <Ionicons name="chevron-down" size={20} color="#1A1B20" />
        </TouchableOpacity>
      </View>

      {/* Insurance Services */}
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.servicesContainer}>
          {insuranceServices.map((service, index) => 
            renderInsuranceCard(service, index)
          )}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <View style={styles.navItem}>
          <Ionicons name="home" size={24} color="#8F31F9" />
          <Text style={[styles.navText, { color: '#8F31F9' }]}>Home</Text>
        </View>
        <View style={styles.navItem}>
          <Ionicons name="card" size={24} color="#7D7D7D" />
          <Text style={styles.navText}>Credits</Text>
        </View>
        <View style={styles.navItem}>
          <View style={styles.plusButton}>
            <Ionicons name="add" size={24} color="#FBFBFB" />
          </View>
        </View>
        <View style={styles.navItem}>
          <Ionicons name="people" size={24} color="#7D7D7D" />
          <Text style={styles.navText}>My Referral</Text>
        </View>
        <View style={styles.navItem}>
          <Ionicons name="person" size={24} color="#7D7D7D" />
          <Text style={styles.navText}>Profile</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFBFB',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
    paddingTop: 44,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1A1B20',
    fontFamily: 'Rubik',
  },
  headerSpacer: {
    width: 32,
  },
  leadSection: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  leadName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1B20',
    fontFamily: 'Rubik',
  },
  serviceSelectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  serviceDropdown: {
    backgroundColor: '#FBFBFB',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#8F31F9',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  serviceDropdownText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    fontFamily: 'Rubik',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  servicesContainer: {
    gap: 7,
  },
  insuranceCard: {
    backgroundColor: '#FBFBFB',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#8F31F9',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1B20',
    fontFamily: 'Rubik',
  },
  arrowButton: {
    padding: 4,
  },
  subServicesContainer: {
    paddingHorizontal: 7,
    paddingBottom: 10,
  },
  subServicesList: {
    backgroundColor: 'rgba(150, 61, 251, 0.05)',
    borderRadius: 10,
    paddingVertical: 6,
  },
  subServiceItem: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  subServiceText: {
    fontSize: 12.6,
    fontWeight: '500',
    color: '#000000',
    fontFamily: 'Rubik',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FBFBFB',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    shadowColor: '#8F31F9',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  navItem: {
    alignItems: 'center',
    gap: 6,
  },
  navText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#7D7D7D',
    fontFamily: 'Rubik',
  },
  plusButton: {
    backgroundColor: '#8F31F9',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8F31F9',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
});

export default CalculatorScreen;
