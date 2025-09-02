import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Image,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Controller, useForm } from 'react-hook-form';
import { sendOtp, verifyOtp } from '../api/auth';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import Loader from '../loader/loader';
import toastConfig from '../toast/toastConfig';

const LoginScreen = ({ navigation }) => {
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationModalVisible, setVerificationModalVisible] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState({});
  const { login } = useAuth();

  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    defaultValues: {
      phoneNumber: '',
      otp: '',
    },
  });

  const onSubmitPhone = async (data) => {
    setLoading(true);
    try {
      const response = await sendOtp({ phoneNumber: data.phoneNumber });
      const receivedOtp = response.data.otp;

      setValue('otp', receivedOtp, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });

      Toast.show({
        type: 'success',
        text1: 'OTP has been sent to your mobile number',
        position: 'bottom',
      });

      setPhoneNumber(data.phoneNumber);
      setOtpSent(true);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error.response?.data?.message || 'Unexpected Error, Try again',
        position: 'bottom',
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmitOtp = async (data) => {
    setLoading(true);
    try {
      const otpData = {
        phoneNumber,
        otp: data.otp,
      };
      const response = await verifyOtp(otpData);
      const userData = response.data.user || response.data;
      const token = response.data.token;

      await login(userData, token);
      // Navigation will be handled automatically by AuthNavigator
    } catch (error) {
      console.log('Login error:', error.response?.data);

      // Handle different error types
      if (error.response?.status === 400) {
        // User doesn't exist or invalid OTP
        const errorMessage = error.response.data.message;
        if (errorMessage.includes('does not exist') || errorMessage.includes('Incorrect phone number')) {
          setVerificationMessage({
            title: 'User Not Found',
            subtitle: 'Account doesn\'t exist',
            message: 'No account found with this phone number. Please sign up first.',
          });
          setVerificationModalVisible(true);
        } else if (errorMessage.includes('Invalid') || errorMessage.includes('expired')) {
          setVerificationMessage({
            title: 'Invalid OTP',
            subtitle: 'Verification failed',
            message: 'The OTP you entered is incorrect or has expired. Please try again.',
          });
          setVerificationModalVisible(true);
        } else {
          // Other 400 errors
          Toast.show({
            type: 'error',
            text1: errorMessage,
            position: 'bottom',
          });
        }
      } else if (error.response?.status === 403) {
        // Verification status issues
        const verificationStatus = error.response.data.verificationStatus;

        if (verificationStatus === 'pending') {
          setVerificationMessage({
            title: 'Account Verification Pending',
            subtitle: 'Your documents are under review',
            message: 'We are currently reviewing your submitted documents.',
          });
          setVerificationModalVisible(true);
        } else if (verificationStatus === 'rejected') {
          setVerificationMessage({
            title: 'Account Verification Rejected',
            subtitle: 'Verification was not approved',
            message: 'Your submitted documents were not approved. Please contact our support team for assistance.',
          });
          setVerificationModalVisible(true);
        } else if (verificationStatus === 'required') {
          setVerificationMessage({
            title: 'Verification Required',
            subtitle: 'Complete your account setup',
            message: 'You need to complete the verification process to access your account.',
          });
          setVerificationModalVisible(true);
        }
      } else {
        // Handle other errors (server errors, network issues, etc.)
        Toast.show({
          type: 'error',
          text1: error.response?.data?.message || 'Login failed',
          text2: 'Please try again later.',
          position: 'bottom',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLoginClicked = () => {
    setOtpSent(false);
    reset();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F0FF" />
      
      {/* Vector Image at absolute top right of screen */}
      <View style={styles.vectorContainer}>
        <Image 
          source={require('../../assets/Icons/vectorLogin.png')} 
          style={styles.vectorImage}
          resizeMode="contain"
        />
      </View>
      
      {/* Background with gradient */}
      <View style={styles.backgroundContainer}>
        <LinearGradient
          colors={['#F3F0FF', '#FAF9FC', '#FFFFFF']}
          style={styles.gradientBackground}
        />
      </View>

      <ScrollView style={styles.contentSection} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Login with Phone</Text>
          <Text style={styles.subtitle}>Enter your phone number to get OTP</Text>

          {/* Phone Number Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <View style={styles.inputWrapper}>
              <Controller
                control={control}
                rules={{
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[6-9]\d{9}$/,
                    message: 'Enter valid Phone number',
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter your phone number"
                    placeholderTextColor="#9CA3AF"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    keyboardType="phone-pad"
                    maxLength={10}
                  />
                )}
                name="phoneNumber"
              />
            </View>
            {errors.phoneNumber && (
              <Text style={styles.errorText}>{errors.phoneNumber.message}</Text>
            )}
          </View>

          {/* OTP Input - Show only after OTP is sent */}
          {otpSent && (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>OTP</Text>
              <View style={styles.inputWrapper}>
                <Controller
                  control={control}
                  rules={{
                    required: 'OTP is required',
                    pattern: {
                      value: /^\d{6}$/,
                      message: 'Enter a valid 6-digit OTP',
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter 6-digit OTP"
                      placeholderTextColor="#9CA3AF"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      keyboardType="numeric"
                      maxLength={6}
                    />
                  )}
                  name="otp"
                />
              </View>
              {errors.otp && (
                <Text style={styles.errorText}>{errors.otp.message}</Text>
              )}
            </View>
          )}

          {/* Forgot Password */}
          <TouchableOpacity style={styles.forgotPasswordContainer}>
            <Text style={styles.forgotPasswordText}>Forgot Password</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>Or continue with</Text>
            <View style={styles.divider} />
          </View>

          {/* Social Login Buttons */}
          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.googleText}>G</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-apple" size={20} color="#000000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.facebookText}>f</Text>
            </TouchableOpacity>
          </View>

          {/* Promo Code */}
          <View style={styles.promoContainer}>
            <Text style={styles.promoText}>Have a Promo code? </Text>
            <TouchableOpacity>
              <Text style={styles.promoLink}>Click Here</Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={otpSent ? handleSubmit(onSubmitOtp) : handleSubmit(onSubmitPhone)}
          >
            <Text style={styles.loginButtonText}>
              {otpSent ? 'Verify OTP' : 'Send OTP'}
            </Text>
          </TouchableOpacity>

          {/* Back to Login Button - Show only after OTP is sent */}
          {otpSent && (
            <TouchableOpacity
              onPress={handleLoginClicked}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>
                Back to Login
              </Text>
            </TouchableOpacity>
          )}

          {/* Sign Up Link */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Do you have any account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.signupLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <Loader loading={loading} />
      <Toast config={toastConfig} />

      {/* Verification Status Modal */}
      <Modal
        visible={verificationModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setVerificationModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <TouchableOpacity
            onPress={() => setVerificationModalVisible(false)}
            activeOpacity={1}
            style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }}
          />
          <View
            style={{
              backgroundColor: '#FFF',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 20,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: '#6B21A8',
                marginBottom: 10,
              }}
            >
              {verificationMessage.title}
            </Text>
            <Text style={{ fontSize: 14, color: '#333', marginBottom: 10 }}>
              {verificationMessage.subtitle}
            </Text>
            <Text style={{ fontSize: 14, color: '#333' }}>
              {verificationMessage.message}
            </Text>

            <TouchableOpacity
              onPress={() => setVerificationModalVisible(false)}
              style={{ marginTop: 15, alignSelf: 'center' }}
            >
              <Text style={{ color: 'red', fontSize: 16 }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F0FF',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradientBackground: {
    flex: 1,
  },
  vectorContainer: {
    position: 'absolute',
    top: -50, // Negative value to go above SafeArea
    right: 0,
    zIndex: 10, // Higher z-index to be on top
  },
  vectorImage: {
    width: 300,
    height: 300,
    transform: [{ scale: 1.7 }], // Scale it up even more
  },
  contentSection: {
    flex: 1,
    paddingTop: 80,
  },
  formContainer: {
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'Rubik-Bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Rubik-Regular',
    color: '#6B7280',
    marginBottom: 48,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Rubik-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Rubik-Regular',
    color: '#1F2937',
  },
  eyeIcon: {
    padding: 4,
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Rubik-Regular',
    color: '#EF4444',
    marginTop: 4,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 32,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontFamily: 'Rubik-Regular',
    color: '#1F2937',
    textDecorationLine: 'underline',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#D1D5DB',
  },
  dividerText: {
    fontSize: 14,
    fontFamily: 'Rubik-Regular',
    color: '#6B7280',
    paddingHorizontal: 16,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 32,
  },
  socialButton: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  googleText: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Rubik-Bold',
    color: '#EA4335',
  },
  facebookText: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'Rubik-Bold',
    color: '#1877F2',
  },
  promoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  promoText: {
    fontSize: 14,
    fontFamily: 'Rubik-Regular',
    color: '#6B7280',
  },
  promoLink: {
    fontSize: 14,
    fontFamily: 'Rubik-Regular',
    color: '#1F2937',
    textDecorationLine: 'underline',
  },
  loginButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonDisabled: {
    backgroundColor: '#D1D5DB',
    shadowOpacity: 0,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Rubik-SemiBold',
    color: '#FFFFFF',
  },
  secondaryButton: {
    marginTop: 10,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#8B5CF6',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Rubik-SemiBold',
    color: '#8B5CF6',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 40,
  },
  signupText: {
    fontSize: 14,
    fontFamily: 'Rubik-Regular',
    color: '#6B7280',
    marginRight: 4,
  },
  signupLink: {
    fontSize: 14,
    fontFamily: 'Rubik-SemiBold',
    color: '#8B5CF6',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },

});

export default LoginScreen;
