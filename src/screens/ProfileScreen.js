import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  Alert,
  Platform,
  Dimensions,
  ActivityIndicator,
  Modal,
  RefreshControl,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { useAuth } from '../context/AuthContext';
// import { authService, userService, affiliateService } from '../services/apiService';
import { getUserData } from '../api/auth';
import { updateUser } from '../api/user';
import { getAffiliates } from '../api/affiliate';
import { customerLogout } from '../api/auth';
import { getUserSubscriptions } from '../api/subscription';
import { createRenewalOrder, processPayment } from '../api/payment';
import VerificationStatusBanner from '../components/VerificationStatusBanner';
import RazorpayCheckout from 'react-native-razorpay';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const scale = Math.min(screenWidth / 375, screenHeight / 812);

// Reusable component for the policy list items
const PolicyItem = ({ iconSource, text, onPress }) => (
  <TouchableOpacity style={styles.policyItem} onPress={onPress}>
    <View style={styles.policyIconContainer}>
      <Image 
        source={iconSource}
        style={styles.policyIcon}
        resizeMode="contain"
      />
    </View>
    <Text style={styles.policyText}>{text}</Text>
    <Ionicons name="chevron-forward" size={20 * scale} color="#1A1B20" />
  </TouchableOpacity>
);

// Purchase Modal Component for New Users
const PurchaseModal = ({ visible, onPurchase, loading = false }) => (
  <Modal
    visible={visible}
    transparent={true}
    animationType="slide"
    onRequestClose={() => {}} // No close on back press
  >
    <View style={styles.purchaseModalOverlay}>
      <View style={styles.purchaseModalContent}>
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/Icons/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
            onError={(error) => console.log('Logo load error:', error)}
          />
        </View>

        {/* Welcome Text */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.purchaseModalTitle}>Welcome to Dr. Wise!</Text>
          <Text style={styles.purchaseModalText}>
            Start your journey with our affiliate program and earn rewards.
          </Text>
        </View>

        {/* Price Section */}
        <View style={styles.priceSection}>
          <View style={styles.priceContainer}>
            <Text style={styles.mainPrice}>₹499</Text>
            <View style={styles.priceDetails}>
              <Text style={styles.pricePeriod}>per year</Text>
            </View>
          </View>
        </View>

        {/* CTA Button */}
        <TouchableOpacity
          style={[styles.purchaseButton, loading && styles.purchaseButtonDisabled]}
          onPress={onPurchase}
          disabled={loading}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={loading ? ['#CCCCCC', '#AAAAAA'] : ['#8F31F9', '#B75CFF', '#8F31F9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.buttonGradient}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#FFFFFF" size="small" />
                <Text style={styles.loadingText}>Processing...</Text>
              </View>
            ) : (
              <View style={styles.buttonContent}>
                <Ionicons name="card-outline" size={20} color="#FFFFFF" />
                <Text style={styles.purchaseButtonText}>Start My Subscription</Text>
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Footer Note */}
        <Text style={styles.footerNote}>
          Secure payment powered by Razorpay
        </Text>
      </View>
    </View>
  </Modal>
);

// Renewal Modal Component
const RenewalModal = ({ visible, onRenew, loading = false }) => (
  <Modal
    visible={visible}
    transparent={true}
    animationType="fade"
    onRequestClose={() => {}} // No close on back press
  >
    <View style={styles.renewalModalOverlay}>
      <View style={styles.renewalModalContent}>
        <View style={styles.iconContainer}>
          <Ionicons name="alert-circle-outline" size={120} color="#F44336" />
          <LinearGradient
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.08)', 'rgba(0,0,0,0)']}
            start={{ x: 0.1, y: 0.5 }}
            end={{ x: 0.9, y: 0.5 }}
            style={styles.iconShadow}
          />
        </View>
        <View style={styles.modalBottomContent}>
          <View style={styles.modalTextContainer}>
            <Text style={styles.renewalModalTitle}>Subscription Expired</Text>
            <Text style={styles.renewalModalText}>
              Your subscription has expired. Please renew to continue using the application.
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.renewButton, loading && styles.renewButtonDisabled]}
            onPress={onRenew}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.renewButtonText}>Renew Subscription</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { user: authUser, logout } = useAuth();

  // State for user data
  const [user, setUser] = useState(null);
  const [referredUsers, setReferredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePickerModalVisible, setImagePickerModalVisible] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  // State for subscription data
  const [subscription, setSubscription] = useState(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [subscriptionChecked, setSubscriptionChecked] = useState(false);
  const [hasFetchedSubscription, setHasFetchedSubscription] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Fetch user data from backend
  const fetchUserData = async () => {
    setLoading(true);
    try {
      const response = await getUserData();

      if (response && response.data && response.data.user) {
        const userData = response.data.user;
        setUser(userData);

        // Handle profile image
        if (userData.image && !userData.image.startsWith('data:')) {
          const imageUri = `data:image/jpeg;base64,${userData.image}`;
          setProfileImage(imageUri);
        } else {
          setProfileImage(userData.image);
        }

        // Fetch referred users if user has ID
        if (userData && userData._id) {
          try {
            const affiliatesResponse = await getAffiliates({
              referredBy: userData._id
            });

            if (affiliatesResponse && affiliatesResponse.data) {
              setReferredUsers(affiliatesResponse.data || []);
            }
          } catch (affiliateError) {
            console.error('Error fetching affiliates:', affiliateError);
            // Don't fail the whole function if affiliate fetch fails
          }
        }

        // Fetch subscription data immediately with the user ID
        fetchSubscriptionData(userData._id);
      } else {
        Alert.alert('Error', 'Failed to load user data. Please try again.');
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error.message || 'Failed to load user data';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Fetch subscription data
  const fetchSubscriptionData = async (userId = null) => {
    // Use provided userId or fallback to state
    const currentUserId = userId || user?._id;
    if (!currentUserId) return;

    // Prevent infinite fetching - only fetch once per user
    if (hasFetchedSubscription) {
      return;
    }

    setSubscriptionLoading(true);
    setSubscriptionChecked(false);
    setHasFetchedSubscription(true);

    try {
      console.log('ProfileScreen - Fetching subscription for userId:', currentUserId, 'hasFetched:', hasFetchedSubscription);
      const response = await getUserSubscriptions(currentUserId);

      console.log('ProfileScreen - Subscription API response:', {
        status: response.status,
        success: response.data?.success,
        data: response.data?.data,
        fullResponse: response.data
      });

      if (response && response.data && response.data.success && response.data.data) {
        // Handle subscription status response
        const statusData = response.data.data;

        console.log('ProfileScreen - Processing status data:', statusData);
        console.log('ProfileScreen - Subscription found:', statusData.hasSubscription, statusData.subscription);

        if (statusData.hasSubscription && statusData.subscription) {
          console.log('ProfileScreen - Found active subscription:', statusData.subscription);
          setSubscription(statusData.subscription);
          // Check if active subscription is expired
          if (new Date(statusData.subscription.endDate) < new Date()) {
            // User had active subscription but it's expired - show renewal modal
            setShowRenewalModal(true);
            setShowPurchaseModal(false);
          } else {
            // User has active subscription - no modals
            setShowRenewalModal(false);
            setShowPurchaseModal(false);
          }
        } else {
          // No active subscription found
          console.log('ProfileScreen - No active subscription found, status:', statusData.status);
          if (statusData.status === 'expired') {
            // User had subscriptions before but they're expired - show renewal modal
            setSubscription(null);
            setShowRenewalModal(true);
            setShowPurchaseModal(false);
          } else {
            // New user with no subscriptions ever - show purchase modal
            setSubscription(null);
            setShowRenewalModal(false);
            setShowPurchaseModal(true);
          }
        }
      } else {
        // API returned empty data - treat as new user
        setSubscription(null);
        setShowRenewalModal(false);
        setShowPurchaseModal(true);
      }
    } catch (error) {
      // On error, treat as new user and show purchase modal
      setSubscription(null);
      setShowRenewalModal(false);
      setShowPurchaseModal(true);
    } finally {
      setSubscriptionLoading(false);
    }
  };

  // Handle Razorpay payment for new subscription purchase
  const handlePurchasePayment = async () => {
    if (!user) {
      Alert.alert('Error', 'User data not available');
      return;
    }

    setPaymentLoading(true);
    try {
      // Determine subscription type based on user role
      const isAmbassador = user.roles?.some(role =>
        role.name?.toLowerCase() === 'ambassador' ||
        role._id === '673998264fcfab01f5dd61d6'
      );

      const subscriptionType = isAmbassador ? 'ambassador' : 'affiliate';

      // Prepare order data for new subscription
      const orderData = {
        userId: user._id,
        affiliateId: isAmbassador ? user.ambassadorId : null,
        subscriptionType: subscriptionType
      };

      // Create Razorpay order
      const orderResponse = await createRenewalOrder(orderData);

      if (!orderResponse.data.success) {
        throw new Error(orderResponse.data.message || 'Failed to create payment order');
      }

      const orderDetails = orderResponse.data.data;

      // Configure Razorpay options
      const options = {
        key: orderDetails.key,
        amount: orderDetails.amount * 100, // Razorpay expects amount in paisa
        currency: orderDetails.currency,
        name: 'Dr. Wise',
        description: `${subscriptionType.charAt(0).toUpperCase() + subscriptionType.slice(1)} Subscription`,
        order_id: orderDetails.orderId,
        prefill: {
          email: user.email,
          contact: user.phoneNumber,
          name: user.name
        },
        theme: {
          color: '#8F31F9'
        }
      };

      // Open Razorpay checkout
      const paymentResult = await RazorpayCheckout.open(options);

      // Process the successful payment
      const paymentData = {
        razorpay_payment_id: paymentResult.razorpay_payment_id,
        razorpay_order_id: paymentResult.razorpay_order_id,
        razorpay_signature: paymentResult.razorpay_signature,
        userId: user._id,
        affiliateId: isAmbassador ? user.ambassadorId : null
      };

      const processResponse = await processPayment(paymentData);

                    if (processResponse.data.success) {
                Alert.alert(
                  'Payment Successful',
                  'Welcome to Dr. Wise! Your subscription is now active.',
                  [
                    {
                      text: 'Get Started',
                      onPress: async () => {
                        console.log('ProfileScreen - Starting subscription refresh after purchase payment');
                        setShowPurchaseModal(false);
                        // Reset fetch flag to allow re-fetching subscription data
                        setHasFetchedSubscription(false);
                        // Refresh subscription data
                        await fetchSubscriptionData(user._id);
                        console.log('ProfileScreen - Subscription refresh completed after purchase payment');
                      }
                    }
                  ]
                );
              } else {
                throw new Error(processResponse.data.message || 'Payment processing failed');
              }

    } catch (error) {
      // Handle different types of errors
      if (error.code === 'PAYMENT_CANCELLED') {
        Alert.alert('Payment Cancelled', 'You cancelled the payment. Please try again when ready.');
      } else if (error.code === 'NETWORK_ERROR') {
        Alert.alert('Network Error', 'Please check your internet connection and try again.');
      } else {
        Alert.alert('Payment Failed', error.message || 'An error occurred during payment. Please try again.');
      }
    } finally {
      setPaymentLoading(false);
    }
  };

  // Handle Razorpay payment for subscription renewal
  const handleRenewalPayment = async () => {
    if (!user || !subscription) {
      Alert.alert('Error', 'User or subscription data not available');
      return;
    }

    setPaymentLoading(true);
    try {
      // Determine subscription type based on user role
      const isAmbassador = user.roles?.some(role =>
        role.name?.toLowerCase() === 'ambassador' ||
        role._id === '673998264fcfab01f5dd61d6'
      );

      const subscriptionType = isAmbassador ? 'ambassador' : 'affiliate';

      // Prepare order data
      const orderData = {
        userId: user._id,
        affiliateId: isAmbassador ? user.ambassadorId : null,
        subscriptionType: subscriptionType
      };

      // Create Razorpay order
      const orderResponse = await createRenewalOrder(orderData);

      if (!orderResponse.data.success) {
        throw new Error(orderResponse.data.message || 'Failed to create payment order');
      }

      const orderDetails = orderResponse.data.data;

      // Configure Razorpay options
      const options = {
        key: orderDetails.key,
        amount: orderDetails.amount * 100, // Razorpay expects amount in paisa
        currency: orderDetails.currency,
        name: 'Dr. Wise',
        description: `${subscriptionType.charAt(0).toUpperCase() + subscriptionType.slice(1)} Subscription Renewal`,
        order_id: orderDetails.orderId,
        prefill: {
          email: user.email,
          contact: user.phoneNumber,
          name: user.name
        },
        theme: {
          color: '#8F31F9'
        }
      };

      // Open Razorpay checkout
      const paymentResult = await RazorpayCheckout.open(options);

      // Process the successful payment
      const paymentData = {
        razorpay_payment_id: paymentResult.razorpay_payment_id,
        razorpay_order_id: paymentResult.razorpay_order_id,
        razorpay_signature: paymentResult.razorpay_signature,
        userId: user._id,
        affiliateId: isAmbassador ? user.ambassadorId : null
      };

      const processResponse = await processPayment(paymentData);

      if (processResponse.data.success) {
        Alert.alert(
          'Payment Successful',
          'Your subscription has been renewed successfully!',
          [
            {
              text: 'OK',
              onPress: async () => {
                console.log('ProfileScreen - Starting subscription refresh after renewal payment');
                setShowRenewalModal(false);
                // Reset fetch flag to allow re-fetching subscription data
                setHasFetchedSubscription(false);
                // Refresh subscription data
                await fetchSubscriptionData(user._id);
                console.log('ProfileScreen - Subscription refresh completed after renewal payment');
              }
            }
          ]
        );
      } else {
        throw new Error(processResponse.data.message || 'Payment processing failed');
      }

    } catch (error) {

      // Handle different types of errors
      if (error.code === 'PAYMENT_CANCELLED') {
        Alert.alert('Payment Cancelled', 'You cancelled the payment. Please try again when ready.');
      } else if (error.code === 'NETWORK_ERROR') {
        Alert.alert('Network Error', 'Please check your internet connection and try again.');
      } else {
        Alert.alert('Payment Failed', error.message || 'An error occurred during payment. Please try again.');
      }
    } finally {
      setPaymentLoading(false);
    }
  };

  // Request permissions when component mounts
  useEffect(() => {
    const requestInitialPermissions = async () => {
      // Request camera permission if not already granted
      if (permission && !permission.granted) {
        await requestPermission();
      }
      
      // Pre-request gallery permission for smoother experience
      try {
        await ImagePicker.getMediaLibraryPermissionsAsync();
      } catch (error) {
        console.log('Gallery permission check failed:', error);
      }
    };

    requestInitialPermissions();
  }, [permission]);

  // Initial fetch
  useEffect(() => {
    fetchUserData();
  }, []);

  // Fetch subscription data when user state changes (only once per user)
  useEffect(() => {
    if (user?._id && !hasFetchedSubscription && !subscriptionLoading) {
      fetchSubscriptionData(user._id);
    }
  }, [user?._id, hasFetchedSubscription, subscriptionLoading]);

  // Reset fetch state when user changes
  useEffect(() => {
    if (user?._id) {
      setHasFetchedSubscription(false);
      setSubscriptionChecked(false);
      setShowRenewalModal(false);
      setShowPurchaseModal(false);
    }
  }, [user?._id]);

  // Re-fetch on focus (only user data, not subscription to prevent infinite loop)
  useFocusEffect(
    useCallback(() => {
      fetchUserData();
      // Don't refetch subscription data on focus to prevent infinite requests
      // The subscription data is already fetched once and cached
    }, [])
  );

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", style: "destructive", onPress: async () => {
          try {
            setLoading(true);
            const logoutResponse = await customerLogout();
            if (logoutResponse && logoutResponse.status === 200) {
              console.log('Server logout successful');
            }
            await logout();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          } catch (error) {
            console.error('Logout error:', error);
            const errorMessage = error?.response?.data?.message || error.message || 'Logout failed, but proceeding with local logout';
            console.warn(errorMessage);
            // Still logout locally even if API call fails
            await logout();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          } finally {
            setLoading(false);
          }
        }}
      ]
    );
  };

  // Show modal for image picker options
  const showImagePickerModal = () => {
    setImagePickerModalVisible(true);
  };

  // Handle picking from camera or gallery
  const handleImagePicker = async (source) => {
    try {
      let result;
      
      if (source === 'camera') {
        // Request Camera Permission
        if (!permission) {
          const { granted } = await requestPermission();
          if (!granted) {
            Alert.alert('Camera Permission Required', 'Camera access is needed to take a photo.');
            return;
          }
        }

        if (!permission.granted) {
          const { granted } = await requestPermission();
          if (!granted) {
            Alert.alert('Camera Permission Required', 'Camera access is needed to take a photo.');
            return;
          }
        }

        // Open camera
        result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [1, 1], // Square aspect ratio for profile
          quality: 0.8,
          base64: true,
        });
      } else if (source === 'gallery') {
        // Request Media Library Permission
        let { status } = await ImagePicker.getMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
          const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (permission.status !== 'granted') {
            Alert.alert(
              'Gallery Permission Required',
              'Gallery access is needed to select photos from your device.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Try Again',
                  onPress: () => handleImagePicker('gallery')
                }
              ]
            );
            return;
          }
          status = permission.status;
        }

        // Open image library
        result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: [1, 1], // Square aspect ratio for profile
          quality: 0.8,
          base64: true,
        });
      }

      // If user cancels
      if (result.canceled) {
        setImagePickerModalVisible(false);
        return;
      }

      // Check that we have an array of assets and the first one has base64
      if (result.assets && result.assets.length > 0 && result.assets[0].base64) {
        await updateProfileImage(result.assets[0].base64);
      } else {
        throw new Error('Image selection failed. Please try again.');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Image selection failed. Please try again.');
    } finally {
      setImagePickerModalVisible(false);
    }
  };

  // Update Profile Image
  const updateProfileImage = async (base64Image) => {
    try {
      setImageLoading(true);

      // Update user profile with new image
      const response = await updateUser(user._id, { image: base64Image });

      if (response && response.status === 200) {
        // Update local state
        const updatedImage = `data:image/jpeg;base64,${base64Image}`;
        setProfileImage(updatedImage);

        // Update user state
        setUser(prevUser => ({
          ...prevUser,
          image: base64Image
        }));

        Alert.alert('Success', 'Profile image updated successfully!');

        // Refresh user data
        await fetchUserData();
      } else {
        const errorMessage = response?.data?.message || 'Failed to update profile image.';
        Alert.alert('Error', errorMessage);
      }
    } catch (error) {
      console.error('Error updating profile image:', error);
      const errorMessage = error?.response?.data?.message || error.message || 'Failed to update profile image. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setImageLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8638EE" />
      <LinearGradient
        colors={['#F3ECFE', '#F6F6FE']}
        locations={[0, 0.4917]}
        style={styles.background}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading || subscriptionLoading}
              onRefresh={() => {
                fetchUserData();
                // Also fetch subscription data if user exists
                if (user?._id) {
                  fetchSubscriptionData(user._id);
                }
              }}
              colors={['#8F31F9']}
              tintColor="#8F31F9"
            />
          }
        >
          
          {/* --- Header Section --- */}
          <LinearGradient
            colors={['#8638EE', '#9553F5', '#8D30FC']}
            locations={[-0.0382, 0.1464, 0.6594]}
            style={styles.header}
          >
            <View style={styles.headerNav}>
              <Text style={styles.headerTitle}>Profile</Text>
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => navigation.navigate('EditProfile', { userData: user || authUser })}
              >
                <Image 
                  source={require('../../assets/Icons/edit.png')}
                  style={styles.editIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            
            <View style={styles.avatarContainer}>
              <View style={styles.avatarBackground}>
                {loading ? (
                  <ActivityIndicator size="large" color="#8F31F9" />
                ) : profileImage ? (
                  <Image 
                    source={{ uri: profileImage }}
                    style={styles.avatarImage}
                    resizeMode="cover"
                  />
                ) : (
                  <Image 
                    source={require('../../assets/Icons/profile-avatar.png')}
                    style={styles.avatarImage} 
                  />
                )}
              </View>
              <TouchableOpacity 
                style={styles.cameraButton}
                onPress={showImagePickerModal}
                disabled={imageLoading}
              >
                {imageLoading ? (
                  <ActivityIndicator size="small" color="#8F31F9" />
                ) : (
                  <Image 
                    source={require('../../assets/Icons/tabler_edit.png')}
                    style={styles.cameraIcon}
                    resizeMode="contain"
                  />
                )}
              </TouchableOpacity>
            </View>

            <Text style={styles.userName}>
              {loading ? 'Loading...' : (user?.name || authUser?.name || 'User')}
            </Text>

            <View style={styles.contactInfoCard}>
              <View style={styles.contactRow}>
                <Ionicons name="call-outline" size={24 * scale} color="#FBFBFB" />
                <Text style={styles.contactText}>
                  {user?.phoneNumber || authUser?.phoneNumber || 'No phone'}
                </Text>
              </View>
              <View style={styles.contactRow}>
                <Ionicons name="mail-outline" size={24 * scale} color="#FBFBFB" />
                <Text style={styles.contactText}>
                  {user?.email || authUser?.email || 'No email'}
                </Text>
              </View>
            </View>
          </LinearGradient>

          {/* --- Verification Status Banner --- */}
          <VerificationStatusBanner
            onPress={() => {
              // Only navigate if verification is required (not pending/rejected)
              const { verificationStatus } = user || {};
              if (verificationStatus === 'required' || !verificationStatus) {
                navigation.navigate('Verification');
              }
              // For pending/rejected status, banner is not clickable
            }}
          />

          {/* --- Content Section --- */}
          <View style={styles.content}>
            {/* Subscription Status Card */}
            <TouchableOpacity style={styles.card}>
              <View style={styles.policyIconContainer}>
                <Image
                  source={require('../../assets/Icons/subs.png')}
                  style={styles.policyIcon}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.subscriptionContent}>
                <Text style={styles.policyText}>Subscription Status</Text>
                {subscriptionLoading ? (
                  <ActivityIndicator size="small" color="#8F31F9" />
                ) : subscription ? (
                  <View style={styles.subscriptionDetails}>
                    <Text style={styles.subscriptionType}>
                      {subscription.subscriptionType === 'ambassador' ? 'Ambassador' : 'Affiliate'}
                    </Text>
                    <View style={styles.statusContainer}>
                      <Text style={[
                        styles.subscriptionStatus,
                        (subscription.status === 'active' && new Date(subscription.endDate) >= new Date()) && styles.activeStatus,
                        (subscription.status === 'expired' || new Date(subscription.endDate) < new Date()) && styles.expiredStatus,
                        subscription.status === 'pending' && styles.pendingStatus,
                        subscription.status === 'cancelled' && styles.cancelledStatus
                      ]}>
                        {new Date(subscription.endDate) < new Date() ? 'Inactive' : (subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1))}
                      </Text>
                      <View style={[
                        styles.statusIndicator,
                        (subscription.status === 'active' && new Date(subscription.endDate) >= new Date()) && styles.activeIndicator,
                        (subscription.status === 'expired' || new Date(subscription.endDate) < new Date()) && styles.expiredIndicator,
                        subscription.status === 'pending' && styles.pendingIndicator,
                        subscription.status === 'cancelled' && styles.cancelledIndicator
                      ]} />
                    </View>
                    {subscription.endDate && (
                      <Text style={[
                        styles.subscriptionExpiry,
                        new Date(subscription.endDate) < new Date() && styles.expiredText
                      ]}>
                        {new Date(subscription.endDate) < new Date()
                          ? `Expired: ${new Date(subscription.endDate).toLocaleDateString('en-GB')}`
                          : `Expires: ${new Date(subscription.endDate).toLocaleDateString('en-GB')}`
                        }
                      </Text>
                    )}
                    {subscription.planDetails?.name && (
                      <Text style={styles.planName}>
                        Plan: {subscription.planDetails.name}
                      </Text>
                    )}
                  </View>
                ) : (
                  <Text style={styles.noSubscriptionText}>No active subscription</Text>
                )}
              </View>
              <Ionicons name="chevron-forward" size={20 * scale} color="#1A1B20" />
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>Policies</Text>
            <View style={styles.policiesCard}>
              <TouchableOpacity 
                style={styles.policyItem}
                onPress={() => navigation.navigate('PrivacyPolicy')}
              >
                <View style={styles.policyIconContainer}>
                  <Image 
                    source={require('../../assets/Icons/pp.png')}
                    style={styles.policyIcon}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.policyText}>Privacy Policy</Text>
                <Ionicons name="chevron-forward" size={20 * scale} color="#1A1B20" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.policyItem}
                onPress={() => navigation.navigate('TermsConditions')}
              >
                <View style={styles.policyIconContainer}>
                  <Image 
                    source={require('../../assets/Icons/termsConditions.png')}
                    style={styles.policyIcon}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.policyText}>Terms & Conditions</Text>
                <Ionicons name="chevron-forward" size={20 * scale} color="#1A1B20" />
              </TouchableOpacity>
              <PolicyItem 
                iconSource={require('../../assets/Icons/faqs.png')}
                text="FAQ's"
                onPress={() => navigation.navigate('FAQ')}
              />
            </View>

            <TouchableOpacity 
              style={[styles.logoutButton, loading && styles.logoutButtonDisabled]} 
              onPress={handleLogout}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.logoutButtonText}>Logout</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>

      {/* Image Picker Modal */}
      <Modal
        visible={imagePickerModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setImagePickerModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Update Profile Photo</Text>
              <TouchableOpacity 
                onPress={() => setImagePickerModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#1A1B20" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalOptions}>
              <TouchableOpacity 
                style={styles.modalOption}
                onPress={() => handleImagePicker('camera')}
              >
                <Ionicons name="camera" size={32} color="#8F31F9" />
                <Text style={styles.modalOptionText}>Take Photo</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalOption}
                onPress={() => handleImagePicker('gallery')}
              >
                <Ionicons name="images" size={32} color="#8F31F9" />
                <Text style={styles.modalOptionText}>Choose from Gallery</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Purchase Modal for New Users */}
      <PurchaseModal
        visible={showPurchaseModal}
        loading={paymentLoading}
        onPurchase={handlePurchasePayment}
      />

      {/* Renewal Modal for Expired Subscriptions */}
      <RenewalModal
        visible={showRenewalModal}
        loading={paymentLoading}
        onRenew={handleRenewalPayment}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3ECFE',
  },
  background: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 120 * scale, // Space for the bottom nav bar
  },
  header: {
    backgroundColor: '#8D30FC', // Fallback color
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 * scale : 10 * scale,
    paddingBottom: 20 * scale,
    paddingHorizontal: 20 * scale,
    borderBottomLeftRadius: 20 * scale,
    borderBottomRightRadius: 20 * scale,
    alignItems: 'center',
    height: 360 * scale,
  },
  headerNav: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10 * scale,
    height: 28 * scale,
  },
  headerTitle: {
    fontFamily: 'Rubik',
    fontSize: 24 * scale,
    fontWeight: '600',
    color: '#FBFBFB',
    lineHeight: 28 * scale,
    textAlign: 'center',
  },
  editButton: {
    position: 'absolute',
    right: 0,
    //backgroundColor: 'rgba(251, 251, 251, 0.2)',
    padding: 4 * scale,
    borderRadius: 4 * scale,
  },
  editIcon: {
    width: 26 * scale,
    height: 26 * scale,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12 * scale,
    width: 100 * scale,
    height: 98.57 * scale,
  },
  avatarBackground: {
    width: 100 * scale,
    height: 98.57 * scale,
    borderRadius: 50 * scale,
    backgroundColor: '#FBFBFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 100 * scale,
    height: 98.57 * scale,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 5 * scale,
    right: 5 * scale,
    width: 24 * scale,
    height: 24 * scale,
    borderRadius: 12 * scale,
    backgroundColor: '#FBFBFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    width: 24 * scale,
    height: 24 * scale,
  },
  userName: {
    fontFamily: 'Rubik',
    fontSize: 24 * scale,
    fontWeight: '600',
    color: '#FBFBFB',
    lineHeight: 28 * scale,
    textAlign: 'center',
    marginBottom: 20 * scale,
  },
  contactInfoCard: {
    width: '100%',
    backgroundColor: 'rgba(251, 251, 251, 0.2)',
    borderRadius: 10 * scale,
    padding: 20 * scale,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8 * scale,
  },
  contactText: {
    fontFamily: 'Rubik',
    fontSize: 14 * scale,
    fontWeight: '500',
    color: '#FBFBFB',
    marginLeft: 16 * scale,
    lineHeight: 17 * scale,
    letterSpacing: 0.2,
  },
  content: {
    paddingHorizontal: 20 * scale,
    paddingTop: 24 * scale,
  },
  card: {
    backgroundColor: '#FBFBFB',
    borderRadius: 10 * scale,
    padding: 16 * scale,
    marginBottom: 24 * scale,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    shadowColor: 'rgba(143, 49, 249, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  subscriptionContent: {
    flex: 1,
    marginLeft: 16 * scale,
  },
  subscriptionDetails: {
    marginTop: 4 * scale,
  },
  subscriptionType: {
    fontFamily: 'Rubik',
    fontSize: 12 * scale,
    fontWeight: '500',
    color: '#8F31F9',
    lineHeight: 14 * scale,
    textTransform: 'capitalize',
  },
  subscriptionStatus: {
    fontFamily: 'Rubik',
    fontSize: 14 * scale,
    fontWeight: '600',
    color: '#1A1B20',
    lineHeight: 17 * scale,
    marginTop: 2 * scale,
  },
  subscriptionExpiry: {
    fontFamily: 'Rubik',
    fontSize: 12 * scale,
    fontWeight: '400',
    color: '#666666',
    lineHeight: 14 * scale,
    marginTop: 2 * scale,
  },
  expiredText: {
    color: '#F44336',
    fontWeight: '500',
  },
  planName: {
    fontFamily: 'Rubik',
    fontSize: 12 * scale,
    fontWeight: '500',
    color: '#8F31F9',
    lineHeight: 14 * scale,
    marginTop: 2 * scale,
  },
  noSubscriptionText: {
    fontFamily: 'Rubik',
    fontSize: 12 * scale,
    fontWeight: '400',
    color: '#666666',
    lineHeight: 14 * scale,
    marginTop: 4 * scale,
    fontStyle: 'italic',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2 * scale,
  },
  statusIndicator: {
    width: 8 * scale,
    height: 8 * scale,
    borderRadius: 4 * scale,
    marginLeft: 8 * scale,
  },
  // Status text colors
  activeStatus: {
    color: '#4CAF50',
  },
  expiredStatus: {
    color: '#F44336',
  },
  pendingStatus: {
    color: '#FF9800',
  },
  cancelledStatus: {
    color: '#9E9E9E',
  },
  // Status indicator colors
  activeIndicator: {
    backgroundColor: '#4CAF50',
  },
  expiredIndicator: {
    backgroundColor: '#F44336',
  },
  pendingIndicator: {
    backgroundColor: '#FF9800',
  },
  cancelledIndicator: {
    backgroundColor: '#9E9E9E',
  },
  sectionTitle: {
    fontFamily: 'Rubik',
    fontSize: 24 * scale,
    fontWeight: '600',
    color: '#1A1B20',
    lineHeight: 28 * scale,
    marginBottom: 16 * scale,
  },
  policiesCard: {
    backgroundColor: '#FBFBFB',
    borderRadius: 10 * scale,
    padding: 7 * scale,
    marginBottom: 24 * scale,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    shadowColor: 'rgba(143, 49, 249, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 3,
  },
  policyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10 * scale,
    paddingHorizontal: 9 * scale,
  },
  policyIconContainer: {
    width: 24 * scale,
    height: 24 * scale,
    borderRadius: 4 * scale,
    backgroundColor: 'rgba(143, 49, 249, 0.0)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16 * scale,
  },
  policyIcon: {
    width: 24 * scale,
    height: 24 * scale,
  },
  policyText: {
    fontFamily: 'Rubik',
    fontSize: 14 * scale,
    fontWeight: '400',
    color: '#1A1B20',
    lineHeight: 17 * scale,
    flex: 1,
  },
  logoutButton: {
    backgroundColor: 'rgba(215, 16, 16, 0.05)',
    borderRadius: 8 * scale,
    paddingVertical: 14 * scale,
    paddingHorizontal: 16 * scale,
    alignItems: 'center',
    marginBottom: 110 * scale,
  },
  logoutButtonDisabled: {
    backgroundColor: 'rgba(215, 16, 16, 0.02)',
  },
  logoutButtonText: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 16 * scale,
    color: '#D71010',
    lineHeight: 19 * scale,
    letterSpacing: 0.2,
    fontWeight: '600',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20 * scale,
    borderTopRightRadius: 20 * scale,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20 * scale,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20 * scale,
    paddingVertical: 16 * scale,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 18 * scale,
    fontWeight: '600',
    color: '#1A1B20',
    fontFamily: 'Rubik-SemiBold',
  },
  closeButton: {
    padding: 4 * scale,
  },
  modalOptions: {
    paddingHorizontal: 20 * scale,
    paddingTop: 20 * scale,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16 * scale,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalOptionText: {
    fontSize: 16 * scale,
    color: '#1A1B20',
    marginLeft: 16 * scale,
    fontFamily: 'Rubik-Medium',
  },
  // Renewal Modal Styles
  renewalModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  renewalModalContent: {
    width: 324,
    height: 673,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 60,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconShadow: {
    height: 10,
    width: 100,
    borderRadius: 5,
    marginTop: 15,
  },
  modalBottomContent: {
    alignItems: 'center',
    width: '100%',
  },
  modalTextContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  renewalModalTitle: {
    fontSize: 22 * scale,
    fontWeight: '700',
    color: '#1A1B20',
    fontFamily: 'Rubik-Bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  renewalModalText: {
    fontSize: 16 * scale,
    color: '#666666',
    fontFamily: 'Rubik-Regular',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  renewButton: {
    backgroundColor: '#8F31F9',
    borderRadius: 8,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
  },
  renewButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  renewButtonText: {
    fontSize: 16 * scale,
    color: '#FFFFFF',
    fontFamily: 'Rubik-SemiBold',
  },
  // Purchase Modal Styles
  purchaseModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  purchaseModalContent: {
    width: screenWidth * 0.85,
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25 * scale,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 15 * scale,
    padding: 10 * scale,
    backgroundColor: '#7a2ed6',
    borderRadius: 25 * scale,
  },
  logoImage: {
    width: 100 * scale,
    height: 100 * scale,
    borderRadius: 20 * scale,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 20 * scale,
  },
  purchaseModalTitle: {
    fontSize: 20 * scale,
    fontWeight: '700',
    color: '#1A1B20',
    fontFamily: 'Rubik-Bold',
    marginBottom: 8 * scale,
    textAlign: 'center',
  },
  purchaseModalText: {
    fontSize: 14 * scale,
    color: '#666666',
    fontFamily: 'Rubik-Regular',
    textAlign: 'center',
    lineHeight: 18 * scale,
  },
  priceSection: {
    alignItems: 'center',
    marginBottom: 20 * scale,
  },
  priceContainer: {
    alignItems: 'center',
  },
  mainPrice: {
    fontSize: 32 * scale,
    fontWeight: '700',
    color: '#1A1B20',
    fontFamily: 'Rubik-Bold',
    marginBottom: 4 * scale,
  },
  priceDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pricePeriod: {
    fontSize: 14 * scale,
    color: '#666666',
    fontFamily: 'Rubik-Regular',
    marginRight: 8 * scale,
  },
  priceSavings: {
    fontSize: 12 * scale,
    color: '#4CAF50',
    fontFamily: 'Rubik-Medium',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8 * scale,
    paddingVertical: 2 * scale,
    borderRadius: 8 * scale,
  },
  purchaseButton: {
    width: '100%',
    borderRadius: 12 * scale,
    overflow: 'hidden',
    marginBottom: 12 * scale,
  },
  buttonGradient: {
    paddingVertical: 14 * scale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  purchaseButtonText: {
    fontSize: 16 * scale,
    color: '#FFFFFF',
    fontFamily: 'Rubik-SemiBold',
    marginLeft: 8 * scale,
  },
  purchaseButtonDisabled: {
    opacity: 0.6,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16 * scale,
    color: '#FFFFFF',
    fontFamily: 'Rubik-SemiBold',
    marginLeft: 8 * scale,
  },
  footerNote: {
    fontSize: 12 * scale,
    color: '#999999',
    fontFamily: 'Rubik-Regular',
    textAlign: 'center',
  },
});

export default ProfileScreen;