import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getProductById } from '../api/product';
import Toast from 'react-native-toast-message';
import { Colors, Typography, Spacing, BorderRadius, CommonStyles, Shadows } from '../constants/designSystem';

const DetailScreen = ({ route, navigation }) => {
  const { product } = route.params || {};
  const [productDetails, setProductDetails] = useState(product || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const displayTitle = productDetails?.name || product?.name || 'Product Details';

  // Fetch product details if we only have the ID
  const fetchProductDetails = async () => {
    if (!product || !product._id || productDetails) return;

    try {
      setLoading(true);
      setError(null);
      console.log('Fetching product details for:', product._id);

      const response = await getProductById(product._id);
      console.log('Product details response:', response.data);

      if (response.data) {
        setProductDetails(response.data);
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
      setError('Failed to load product details');
      Toast.show({
        type: 'error',
        text1: 'Failed to load product details',
        text2: error?.response?.data?.message || 'Please try again',
        position: 'bottom',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [product]);

  // Get product content from API data
  const getDetailContent = () => {
    if (!productDetails) return null;

    // Use actual product data from API
    return {
      description: productDetails.description || 'Product description not available',
      features: productDetails.benefits || productDetails.features || [],
      benefits: productDetails.benefits || [],
      category: productDetails.categoryId?.name || 'General',
    };
  };

  // Fallback content for static display
  const getFallbackContent = () => {
    const content = {
      'Mutual Fund': {
        description: 'Invest in professionally managed mutual funds to diversify your portfolio and achieve long-term financial goals.',
        features: [
          'Professional fund management',
          'Diversified portfolio',
          'SIP investment options',
          'Tax-saving benefits',
          'High liquidity'
        ],
        benefits: [
          'Potential for higher returns',
          'Risk diversification',
          'Easy to start with small amounts',
          'Professional expertise',
          'Regulatory oversight'
        ]
      },
      'Health': {
        description: 'Comprehensive health insurance plans to protect you and your family from medical emergencies and rising healthcare costs.',
        features: [
          'Cashless hospitalization',
          'Pre and post hospitalization coverage',
          'Day care procedures',
          'Ambulance coverage',
          'Health check-ups'
        ],
        benefits: [
          'Financial protection',
          'Quality healthcare access',
          'Tax benefits under 80D',
          'Peace of mind',
          'Family coverage options'
        ]
      },
      'Personal Loans': {
        description: 'Quick and easy personal loans for your immediate financial needs with competitive interest rates.',
        features: [
          'Quick approval process',
          'Minimal documentation',
          'Flexible repayment terms',
          'No collateral required',
          'Online application'
        ],
        benefits: [
          'Immediate fund access',
          'Multiple use cases',
          'Competitive rates',
          'Easy EMI options',
          'Transparent processing'
        ]
      }
    };

    return content[displayTitle] || {
      description: `Learn more about ${displayTitle} and how it can benefit your financial planning.`,
      features: [
        'Professional service',
        'Expert guidance',
        'Competitive rates',
        'Customer support',
        'Easy process'
      ],
      benefits: [
        'Financial growth',
        'Risk management',
        'Professional advice',
        'Peace of mind',
        'Long-term benefits'
      ]
    };
  };

  const detailContent = getDetailContent();

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={[CommonStyles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#8F31F9" />
        <Text style={{ marginTop: 16, fontSize: 16, color: '#7D7D7D' }}>Loading product details...</Text>
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView style={[CommonStyles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontSize: 16, color: '#7D7D7D', textAlign: 'center', marginBottom: 20 }}>{error}</Text>
        <TouchableOpacity
          style={{ backgroundColor: '#8F31F9', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 }}
          onPress={fetchProductDetails}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 16 }}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // No content available
  if (!detailContent) {
    return (
      <SafeAreaView style={[CommonStyles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontSize: 16, color: '#7D7D7D', textAlign: 'center' }}>Product details not available</Text>
      </SafeAreaView>
    );
  }

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
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={CommonStyles.headerTitle}>{displayTitle}</Text>
          <Text style={CommonStyles.headerSubtitle}>
            Detailed information and benefits
          </Text>
        </View>
      </LinearGradient>

      <ScrollView style={CommonStyles.contentSection} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Description Card */}
          <View style={[CommonStyles.card, styles.descriptionCard]}>
            <Text style={styles.descriptionTitle}>About {displayTitle}</Text>
            <Text style={styles.description}>{detailContent.description}</Text>
          </View>

          {/* Features Section */}
          <View style={[CommonStyles.card, styles.featuresCard]}>
            <Text style={styles.sectionTitle}>Key Features</Text>
            {detailContent.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
                </View>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          {/* Benefits Section */}
          <View style={[CommonStyles.card, styles.benefitsCard]}>
            <Text style={styles.sectionTitle}>Benefits</Text>
            {detailContent.benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <View style={styles.benefitIcon}>
                  <Ionicons name="star" size={18} color={Colors.warning} />
                </View>
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.primaryActionButton}>
              <LinearGradient
                colors={Colors.primaryGradient}
                style={CommonStyles.primaryButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={CommonStyles.primaryButtonText}>Get Started</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryActionButton}>
              <Text style={styles.secondaryActionText}>Share & Earn</Text>
            </TouchableOpacity>
          </View>

          {/* Contact Support */}
          <View style={[CommonStyles.card, styles.supportCard]}>
            <Ionicons name="headset" size={24} color={Colors.primaryPurple} />
            <View style={styles.supportContent}>
              <Text style={styles.supportTitle}>Need Help?</Text>
              <Text style={styles.supportDescription}>
                Our experts are here to guide you. Get personalized advice for your financial needs.
              </Text>
            </View>
            <TouchableOpacity style={styles.contactButton}>
              <Ionicons name="call" size={20} color={Colors.primaryPurple} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerSection: {
    paddingBottom: 30,
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
  content: {
    paddingHorizontal: Spacing.base,
  },
  descriptionCard: {
    marginBottom: Spacing.base,
  },
  descriptionTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.base,
  },
  description: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    lineHeight: Typography.lineHeight.normal,
  },
  featuresCard: {
    marginBottom: Spacing.base,
  },
  benefitsCard: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.base,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  featureIcon: {
    marginRight: Spacing.sm,
  },
  featureText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textPrimary,
    flex: 1,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  benefitIcon: {
    marginRight: Spacing.sm,
  },
  benefitText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textPrimary,
    flex: 1,
  },
  actionContainer: {
    marginBottom: Spacing.lg,
  },
  primaryActionButton: {
    marginBottom: Spacing.base,
    ...Shadows.button,
    borderRadius: BorderRadius.base,
  },
  secondaryActionButton: {
    backgroundColor: Colors.cardBackground,
    borderWidth: 2,
    borderColor: Colors.primaryPurple,
    borderRadius: BorderRadius.base,
    paddingVertical: Spacing.base,
    alignItems: 'center',
    ...Shadows.small,
  },
  secondaryActionText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.primaryPurple,
  },
  supportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
  },
  supportContent: {
    flex: 1,
    marginLeft: Spacing.base,
  },
  supportTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  supportDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    lineHeight: Typography.lineHeight.tight,
  },
  contactButton: {
    width: 40,
    height: 40,
    backgroundColor: Colors.iconBgPurple,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.base,
  },
});

export default DetailScreen;
