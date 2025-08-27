import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, SafeAreaView, Dimensions, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const scale = Math.min(screenWidth / 375, screenHeight / 812);

const CategoriesScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { category } = route.params || { category: 'General' };

  // Define star colors for different categories
  const getStarColor = (category) => {
    switch (category) {
      case 'Life':
      case 'Health':
      case 'Motor':
      case 'General':
        return '#4CAF50'; // Green for Insurance
      case 'Mutual Fund':
      case 'Fixed':
      case 'BOND':
      case 'Gold':
      case 'LAS':
      case 'NPS':
      case 'Trading':
        return '#F6AC11'; // Yellow/Orange for Investments
      case 'Home Loan':
      case 'Personal Loans':
      case 'Mortgage Loan':
      case 'Business Loan':
        return '#C75B7A'; // Red for Loans
      case 'Tax':
        return '#8F31F9'; // Purple for Tax
      case 'Domestic Travel':
      case 'International Travel':
        return '#8F31F9'; // Purple for Travel
      default:
        return '#4CAF50'; // Default green
    }
  };

  // Generate list items based on category
  const getListItems = (category) => {
    const insuranceItems = [
      'Individual Plan',
      'Family Plan',
      'Senior Citizen Plan',
      'Women Plan',
      'Children Plan',
      'Critical Illness Plan',
      'Term Life Plan'
    ];

    const investmentItems = [
      'Mutual Fund Plan',
      'Fixed Deposit Plan',
      'Bond Investment Plan',
      'Gold Investment Plan',
      'Loan Against Securities',
      'National Pension Scheme',
      'Trading Plan'
    ];

    const loanItems = [
      'Home Loan Plan',
      'Personal Loan Plan',
      'Mortgage Loan Plan',
      'Business Loan Plan',
      'Property Loan Plan',
      'Vehicle Loan Plan',
      'Education Loan Plan'
    ];

    const taxItems = [
      'Tax Planning',
      'Tax Planning',
      'Tax Planning'
    ];

    const travelItems = [
      'Travel Plan',
      'Travel Plan',
      'Travel Plan',
      'Travel Plan',
      'Travel Plan'
    ];

    switch (category) {
      case 'Mutual Fund':
      case 'Fixed':
      case 'BOND':
      case 'Gold':
      case 'LAS':
      case 'NPS':
      case 'Trading':
        return investmentItems; // 7 items for Investments
      case 'Home Loan':
      case 'Personal Loans':
      case 'Mortgage Loan':
      case 'Business Loan':
        return loanItems; // 7 items for Loans
      case 'Tax':
        return taxItems; // 3 items for Tax
      case 'Domestic Travel':
      case 'International Travel':
        return travelItems; // 5 items for Travel
      default:
        return insuranceItems; // 7 items for Insurance
    }
  };

  const listItems = getListItems(category);
  const starColor = getStarColor(category);

  return (
    <LinearGradient
      colors={['#F3ECFE', '#F6F6FE']}
      locations={[0, 0.49]}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />
      <SafeAreaView style={styles.safeArea}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back-outline" size={24} color="#1A1B20" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Categories</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Content */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.contentContainer}>
            {listItems.map((item, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.listItem} 
                activeOpacity={0.7}
                onPress={() => navigation.navigate('CategoryDetail', { 
                  category: category, 
                  planName: item 
                })}
              >
                <View style={styles.itemContent}>
                  <View style={styles.leftSection}>
                    <View style={[styles.starIcon, { 
                      backgroundColor: starColor === '#F6AC11' ? '#FEE9CF' : 
                                   starColor === '#C75B7A' ? '#F6DCDD' : 
                                   starColor === '#8F31F9' ? 'rgba(143, 49, 249, 0.2)' : '#C9EBE9' 
                    }]}>
                      <Image 
                        source={
                          starColor === '#F6AC11' ? require('../../assets/Icons/3d-star-symbol-illustration-vector-gold-star-icon-symbol-medel 1 (3).png') :
                          starColor === '#C75B7A' ? require('../../assets/Icons/3d-star-symbol-illustration-vector-gold-star-icon-symbol-medel 2.png') :
                          starColor === '#8F31F9' ? require('../../assets/Icons/3d-star-symbol-illustration-vector-gold-star-icon-symbol-medel 1 (4).png') :
                          require('../../assets/Icons/3d-star-symbol-illustration-vector-gold-star-icon-symbol-medel 1 (2).png')
                        }
                        style={[styles.starImage, { 
                          width: starColor === '#C75B7A' ? 52 * scale : 
                                 starColor === '#8F31F9' ? 60 * scale : 50 * scale,
                          height: starColor === '#C75B7A' ? 52 * scale : 
                                  starColor === '#8F31F9' ? 60 * scale : 50 * scale
                        }]}
                      />
                    </View>
                    <View style={styles.textSection}>
                      <Text style={styles.itemTitle}>{item}</Text>
                      <Text style={styles.itemSubtitle}>Share services you trust and</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#1A1B20" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    height: 80,
  },
  backButton: {
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(150, 61, 251, 0.05)',
    borderRadius: 4,
  },
  headerTitle: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 24 * scale,
    lineHeight: 28 * scale,
    textAlign: 'center',
    color: '#1A1B20',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  listItem: {
    width: Math.min(335 * scale, screenWidth - 40), // Responsive width with max 335px
    height: 72 * scale,
    backgroundColor: '#FBFBFB',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    shadowColor: 'rgba(143, 49, 249, 0.1)',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 3,
    borderRadius: 10 * scale,
    marginBottom: 14 * scale,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6 * scale,
    paddingVertical: 6 * scale,
    height: '100%',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  starIcon: {
    width: 60 * scale,
    height: 60 * scale,
    backgroundColor: '#C9EBE9',
    borderRadius: 8 * scale,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20 * scale,
  },
  textSection: {
    flex: 1,
  },
  itemTitle: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 18 * scale,
    lineHeight: 21 * scale,
    color: '#1A1B20',
    marginBottom: 4 * scale,
  },
  itemSubtitle: {
    fontFamily: 'Rubik-Regular',
    fontSize: 12 * scale,
    lineHeight: 14 * scale,
    letterSpacing: 0.2 * scale,
    color: '#7D7D7D',
  },
  starImage: {
    width: 50 * scale,
    height: 50 * scale,
    resizeMode: 'contain',
  },
});

export default CategoriesScreen;
