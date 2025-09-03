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
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Controller, useForm } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import {
  register,
  sendOtp,
  verifyOtp,
  checkUserExists,
  getUserByPhoneNumber,
} from '../api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import Loader from '../loader/loader';
import toastConfig from '../toast/toastConfig';

const SignupScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isUserExists, setIsUserExists] = useState(false);
  const { login } = useAuth();

  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      referralCode: '',
    },
  });

  const onSubmit = async (data) => {
    if (!agreeToTerms) {
      Toast.show({
        type: 'error',
        text1: 'Please agree to terms and conditions',
        position: 'bottom',
      });
      return;
    }

    setLoading(true);
    try {
      // Store user data temporarily for later use during verification
      await AsyncStorage.setItem('tempUserData', JSON.stringify(data));

      Toast.show({
        type: 'success',
        text1: 'Basic registration successful! Please complete verification.',
        position: 'bottom',
      });

      // Navigate to verification screens
      navigation.navigate('Verification');
      reset();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error?.response?.data?.message || error.message || 'Registration failed',
        position: 'bottom',
      });
    } finally {
      setLoading(false);
    }
  };

  const checkUser = async (phoneNumber) => {
    try {
      const response = await getUserByPhoneNumber(phoneNumber);
      if (response.data.user) {
        setIsUserExists(true);
      } else {
        setIsUserExists(false);
      }
    } catch (error) {
      // Handle errors, e.g., user not found might be a 404
      setIsUserExists(false);
    }
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
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Fill in your details to get started</Text>

          {/* Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <View style={styles.inputWrapper}>
              <Controller
                control={control}
                rules={{
                  required: 'Name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters',
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter your full name"
                    placeholderTextColor="#9CA3AF"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="words"
                  />
                )}
                name="name"
              />
            </View>
            {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputWrapper}>
              <Controller
                control={control}
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Please enter a valid email address',
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter your email"
                    placeholderTextColor="#9CA3AF"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                )}
                name="email"
              />
            </View>
            {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
          </View>

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
                    message: 'Please enter a valid 10-digit phone number',
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter your phone number"
                    placeholderTextColor="#9CA3AF"
                    onBlur={onBlur}
                    onChangeText={(text) => {
                      onChange(text);
                      if (text.length === 10) {
                        checkUser(text);
                      }
                    }}
                    value={value}
                    keyboardType="phone-pad"
                    maxLength={10}
                  />
                )}
                name="phoneNumber"
              />
            </View>
            {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber.message}</Text>}
            {isUserExists && <Text style={styles.errorText}>User already exists with this phone number</Text>}
          </View>

          {/* Referral Code Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Referral Code (Optional)</Text>
            <View style={styles.inputWrapper}>
              <Controller
                control={control}
                rules={{
                  minLength: {
                    value: 9,
                    message: 'Invalid Referral Code',
                  },
                  maxLength: {
                    value: 9,
                    message: 'Invalid Referral Code',
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter referral code"
                    placeholderTextColor="#9CA3AF"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    maxLength={9}
                    autoCapitalize="characters"
                  />
                )}
                name="referralCode"
              />
            </View>
            {errors.referralCode && <Text style={styles.errorText}>{errors.referralCode.message}</Text>}
          </View>

          {/* Terms and Conditions */}
          <View style={styles.termsContainer}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setAgreeToTerms(!agreeToTerms)}
            >
              <View style={[styles.checkbox, agreeToTerms && styles.checkboxChecked]}>
                {agreeToTerms && (
                  <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                )}
              </View>
              <Text style={styles.termsText}>
                I agree to the{' '}
                <Text style={styles.termsLink}>Terms and Conditions</Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* Signup Button */}
          <TouchableOpacity
            style={[styles.signupButton, isUserExists && styles.signupButtonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={isUserExists}
          >
            <Text style={styles.signupButtonText}>
              Sign Up
            </Text>
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <Loader loading={loading} />
      <Toast config={toastConfig} />
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
    paddingBottom: 20, // Reduced from 40 to bring content up
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
    marginBottom: 24, // Reduced from 48 to save space
  },
  inputContainer: {
    marginBottom: 16, // Reduced from 24 to save space
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
  errorText: {
    fontSize: 12,
    fontFamily: 'Rubik-Regular',
    color: '#EF4444',
    marginTop: 4,
  },
  termsContainer: {
    marginBottom: 16, // Reduced from 24 to save space
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  termsText: {
    fontSize: 14,
    fontFamily: 'Rubik-Regular',
    color: '#6B7280',
    flex: 1,
  },
  termsLink: {
    fontFamily: 'Rubik-Regular',
    color: '#8B5CF6',
    textDecorationLine: 'underline',
  },
  signupButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 8, // Reduced from 16 to bring login link closer
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  signupButtonDisabled: {
    backgroundColor: '#D1D5DB',
    shadowOpacity: 0,
  },
  signupButtonText: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Rubik-SemiBold',
    color: '#FFFFFF',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 5, // Minimal padding at bottom
    marginTop: 4, // Minimal gap from signup button
  },
  loginText: {
    fontSize: 16, // Increased font size
    fontFamily: 'Rubik-Regular',
    color: '#6B7280',
    marginRight: 4,
  },
  loginLink: {
    fontSize: 16, // Increased font size
    fontFamily: 'Rubik-SemiBold',
    color: '#8B5CF6',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default SignupScreen;
