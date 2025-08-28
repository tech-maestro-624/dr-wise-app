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
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const scale = Math.min(screenWidth / 375, screenHeight / 812);

const CalculatorScreen = ({ navigation, route }) => {
  const { leadName } = route.params || {};
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showSubCategory, setShowSubCategory] = useState(null);

  const mainCategories = [
    'INSURANCE',
    'TAX', 
    'INVESTMENTS',
    'TRAVEL',
    'LOAN'
  ];

  const subCategories = {
    'INSURANCE': ['Travel', 'Health', 'Life', 'Motor', 'General'],
    'TAX': ['Income Tax', 'GST', 'TDS', 'Property Tax'],
    'INVESTMENTS': ['Mutual Funds', 'Stocks', 'Bonds', 'Real Estate'],
    'TRAVEL': ['International', 'Domestic', 'Business', 'Leisure'],
    'LOAN': ['Home Loan', 'Personal Loan', 'Business Loan', 'Education Loan']
  };

  const insurancePlans = [
    'Term Insurance',
    'ULIPs',
    'Children Plan',
    'Retirement Plan',
    'Savings Plan',
    'Investment Plan',
    'Endowment / Guranteed Plan',
    'Income / Money back Plan',
    'Whole Life Plan'
  ];

  const handleCategorySelect = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
      setShowSubCategory(null);
    } else {
      setSelectedCategory(category);
      setShowSubCategory(null);
    }
  };

  const handleSubCategorySelect = (subCategory) => {
    if (showSubCategory === subCategory) {
      setShowSubCategory(null);
    } else {
      setShowSubCategory(subCategory);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={['#F3ECFE', '#F6F6FE']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.5 }}
      />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calculator</Text>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.mainContainer} showsVerticalScrollIndicator={false}>
        {/* Service Selection Dropdown */}
        <View style={styles.serviceSelectionContainer}>
          <TouchableOpacity 
            style={styles.serviceDropdown}
            onPress={() => setShowServiceDropdown(!showServiceDropdown)}
          >
            <Text style={styles.serviceDropdownText}>Select Your Service</Text>
            <View style={styles.chevronIcon}>
              <Ionicons 
                name={showServiceDropdown ? "chevron-up" : "chevron-down"} 
                size={20} 
                color="#1A1B20" 
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* Main Categories - Only show when service dropdown is clicked */}
        {showServiceDropdown && (
          <View style={styles.categoriesContainer}>
            {mainCategories.map((category, index) => (
              <View key={index} style={styles.categoryCard}>
                <TouchableOpacity 
                  style={[
                    styles.categoryHeader,
                    selectedCategory === category && styles.selectedCategoryHeader
                  ]}
                  onPress={() => handleCategorySelect(category)}
                >
                  <Text style={[
                    styles.categoryTitle,
                    selectedCategory === category && styles.selectedCategoryTitle
                  ]}>
                    {category}
                  </Text>
                  <View style={styles.chevronIcon}>
                    <Ionicons 
                      name={selectedCategory === category ? "chevron-up" : "chevron-down"} 
                      size={20} 
                      color={selectedCategory === category ? "#FBFBFB" : "#1A1B20"} 
                    />
                  </View>
                </TouchableOpacity>

                {/* Sub Categories - Only show when category is selected */}
                {selectedCategory === category && (
                  <View style={styles.subCategoriesContainer}>
                    {subCategories[category].map((subCategory, subIndex) => (
                      <View key={subIndex} style={styles.subCategoryCard}>
                        <TouchableOpacity 
                          style={[
                            styles.subCategoryHeader,
                            showSubCategory === subCategory && styles.selectedSubCategoryHeader
                          ]}
                          onPress={() => handleSubCategorySelect(subCategory)}
                        >
                          <Text style={[
                            styles.subCategoryTitle,
                            showSubCategory === subCategory && styles.selectedSubCategoryTitle
                          ]}>
                            {subCategory}
                          </Text>
                          <View style={styles.chevronIcon}>
                            <Ionicons 
                              name={showSubCategory === subCategory ? "chevron-up" : "chevron-down"} 
                              size={20} 
                              color={showSubCategory === subCategory ? "#1A1B20" : "#1A1B20"} 
                            />
                          </View>
                        </TouchableOpacity>

                        {/* Insurance Plans - Only show when Travel subcategory is selected under INSURANCE */}
                        {category === 'INSURANCE' && subCategory === 'Travel' && showSubCategory === subCategory && (
                          <View style={styles.plansContainer}>
                            {insurancePlans.map((plan, planIndex) => (
                              <TouchableOpacity 
                                key={planIndex} 
                                style={styles.planItem}
                                                                 onPress={() => {
                                   navigation.navigate('TermInsuranceCalculator', { 
                                     serviceName: plan,
                                     leadName: leadName 
                                   });
                                 }}
                              >
                                <Text style={styles.planText}>{plan}</Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        )}
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}


      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3ECFE',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    height: 80 * scale,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 44 : 0,
  },
  headerTitle: {
    fontSize: 24 * scale,
    fontWeight: '700',
    color: '#1A1B20',
    fontFamily: 'Rubik',
    lineHeight: 28 * scale,
    textAlign: 'center',
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: 20 * scale,
    paddingTop: 12 * scale,
  },
  serviceSelectionContainer: {
    marginBottom: 20 * scale,
  },
  serviceDropdown: {
    backgroundColor: '#FBFBFB',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 10 * scale,
    paddingHorizontal: 16 * scale,
    paddingVertical: 15 * scale,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#8F31F9',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10 * scale,
    elevation: 5,
  },
  serviceDropdownText: {
    fontSize: 14 * scale,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Rubik',
    lineHeight: 17 * scale,
    letterSpacing: 0.2 * scale,
  },
  chevronIcon: {
    transform: [{ rotate: '0deg' }],
  },
  categoriesContainer: {
    marginBottom: 20 * scale,
  },
  categoryCard: {
    backgroundColor: '#FBFBFB',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 10 * scale,
    marginBottom: 7 * scale,
    shadowColor: '#8F31F9',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10 * scale,
    elevation: 5,
    overflow: 'hidden',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12 * scale,
    paddingVertical: 8 * scale,
    height: 45 * scale,
    borderTopLeftRadius: 10 * scale,
    borderTopRightRadius: 10 * scale,
  },
  selectedCategoryHeader: {
    backgroundColor: '#8F31F9',
  },
  categoryTitle: {
    fontSize: 14 * scale,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Rubik',
    lineHeight: 17 * scale,
    letterSpacing: 0.195 * scale,
  },
  selectedCategoryTitle: {
    color: '#FBFBFB',
  },
  subCategoriesContainer: {
    backgroundColor: '#FBFBFB',
    paddingVertical: 6 * scale,
  },
  subCategoryCard: {
    backgroundColor: '#FBFBFB',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 10 * scale,
    marginBottom: 7 * scale,
    marginHorizontal: 7 * scale,
    shadowColor: '#8F31F9',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10 * scale,
    elevation: 5,
  },
  subCategoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12 * scale,
    paddingVertical: 8 * scale,
    height: 40 * scale,
  },
  selectedSubCategoryHeader: {
    backgroundColor: '#FBFBFB',
    borderRadius: 5 * scale,
    marginHorizontal: 7 * scale,
  },
  subCategoryTitle: {
    fontSize: 12.63 * scale,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Rubik',
    lineHeight: 15 * scale,
    letterSpacing: 0.176 * scale,
  },
  selectedSubCategoryTitle: {
    fontWeight: '600',
  },
  plansContainer: {
    backgroundColor: 'rgba(150, 61, 251, 0.05)',
    borderRadius: 10 * scale,
    marginHorizontal: 7 * scale,
    marginBottom: 6 * scale,
  },
  planItem: {
    paddingHorizontal: 10 * scale,
    paddingVertical: 6 * scale,
  },
  planText: {
    fontSize: 12.63 * scale,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Rubik',
    lineHeight: 15 * scale,
    letterSpacing: 0.176 * scale,
  },

});

export default CalculatorScreen;
