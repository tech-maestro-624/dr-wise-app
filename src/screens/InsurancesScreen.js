import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, StatusBar, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius, CommonStyles, Shadows } from '../constants/designSystem';

const insurances = [
  { name: 'Travel' },
  { name: 'Health' },
  { name: 'Life' },
  { name: 'Motor' },
  { name: 'General' },
];

const InsurancesScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={CommonStyles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryPurple} />
      
      {/* Purple Header Section */}
      <LinearGradient
        colors={Colors.primaryGradient}
        style={[CommonStyles.headerSection, styles.headerSection]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={CommonStyles.headerTitle}>Insurance Plans</Text>
          <Text style={CommonStyles.headerSubtitle}>
            Protect yourself and your loved ones
          </Text>
        </View>

        {/* Referral Promotion Card */}
        <View style={styles.promoCard}>
          <View style={styles.promoContent}>
            <View style={styles.popularBadge}>
              <Text style={styles.popularText}>Popular</Text>
            </View>
            <Text style={styles.promoTitle}>Earn While You Refer</Text>
            <Text style={styles.promoSubtitle}>
              Share insurance plans you trust and get paid for every referral
            </Text>
            <TouchableOpacity style={styles.referButton}>
              <Text style={styles.referButtonText}>Start Referring</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.promoIcon}>
            <Ionicons name="people" size={60} color="rgba(255, 255, 255, 0.8)" />
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={CommonStyles.contentSection} showsVerticalScrollIndicator={false}>
        <View style={styles.contentSection}>
          <Text style={styles.contentTitle}>Choose Your Protection</Text>
          <Text style={styles.contentSubtitle}>
            Select from our comprehensive range of insurance products
          </Text>
          
          <View style={styles.gridContainer}>
            {insurances.map((item, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.card}
                onPress={() => navigation.navigate('Detail', { categoryName: item.name })}
              >
                <View style={styles.cardIconContainer}>
                  <Ionicons 
                    name={getInsuranceIcon(item.name)} 
                    size={32} 
                    color={Colors.primaryPurple} 
                  />
                </View>
                <Text style={styles.cardText}>{item.name}</Text>
                <Text style={styles.cardSubtext}>Insurance</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Helper function to get appropriate icons for insurance types
const getInsuranceIcon = (insuranceType) => {
  const iconMap = {
    'Travel': 'airplane',
    'Health': 'medical',
    'Life': 'heart',
    'Motor': 'car',
    'General': 'shield-checkmark',
  };
  return iconMap[insuranceType] || 'shield-checkmark';
};

const styles = StyleSheet.create({
  headerSection: {
    paddingBottom: 60,
  },
  headerContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: Spacing.lg,
    top: Spacing.lg,
    padding: Spacing.sm,
  },
  promoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: BorderRadius.base,
    padding: Spacing.lg,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  promoContent: {
    flex: 1,
  },
  popularBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
    marginBottom: Spacing.sm,
  },
  popularText: {
    color: Colors.textWhite,
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
  },
  promoTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textWhite,
    marginBottom: Spacing.xs,
  },
  promoSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: Spacing.base,
    lineHeight: Typography.lineHeight.tight,
  },
  referButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    alignSelf: 'flex-start',
  },
  referButtonText: {
    color: Colors.textWhite,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
  },
  promoIcon: {
    marginLeft: Spacing.base,
    opacity: 0.7,
  },
  contentSection: {
    paddingHorizontal: Spacing.base,
  },
  contentTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  contentSubtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
    lineHeight: Typography.lineHeight.normal,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.base,
    padding: Spacing.base,
    width: '48%',
    alignItems: 'center',
    marginBottom: Spacing.base,
    ...Shadows.card,
  },
  cardIconContainer: {
    width: 60,
    height: 60,
    backgroundColor: Colors.iconBgPurple,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  cardText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  cardSubtext: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
});

export default InsurancesScreen;
