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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const validatePhoneNumber = (number) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(number);
  };

  const handlePhoneChange = (text) => {
    setPhoneNumber(text);
    if (text.length > 0) {
      if (validatePhoneNumber(text)) {
        setPhoneError('');
        setIsPhoneValid(true);
      } else {
        setPhoneError('Please enter a valid 10-digit phone number');
        setIsPhoneValid(false);
      }
    } else {
      setPhoneError('');
      setIsPhoneValid(false);
    }
  };

  const handleSendOtp = () => {
    if (isPhoneValid) {
      console.log('OTP Sent to', phoneNumber);
      setOtpSent(true);
    }
  };

  const handleLogin = () => {
    // Mock OTP validation
    if (isPhoneValid && otp === '1234') {
      // Check if it's the affiliate phone number
      if (phoneNumber === '9986914266') {
        navigation.navigate('AffiliateHome');
      } else {
        navigation.navigate('Main');
      }
    } else {
      alert('Invalid OTP');
    }
  };

  const PatternBackground = () => (
    <View style={styles.patternContainer}>
      {/* Create a pattern of small triangles */}
      {Array.from({ length: 50 }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.triangle,
            {
              left: `${(index * 23) % 100}%`,
              top: `${Math.floor(index / 4) * 15}%`,
              opacity: 0.1 + (index % 3) * 0.05,
            },
          ]}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F0FF" />
      
      {/* Background Pattern */}
      <View style={styles.backgroundContainer}>
        <LinearGradient
          colors={['#F3F0FF', '#FAF9FC', '#FFFFFF']}
          style={styles.gradientBackground}
        />
        <PatternBackground />
        
        {/* Vector Image at top right */}
        <View style={styles.vectorContainer}>
          <Image 
            source={require('../../assets/Icons/vectorLogin.png')} 
            style={styles.vectorImage}
            resizeMode="contain"
          />
        </View>
      </View>

      <ScrollView style={styles.contentSection} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Login with Email</Text>
          <Text style={styles.subtitle}>Login with one of the following</Text>

          {/* Phone Number Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                value={phoneNumber}
                onChangeText={handlePhoneChange}
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>
            {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
          </View>

          {/* OTP Input - Show only after OTP is sent */}
          {otpSent && (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your password"
                  placeholderTextColor="#9CA3AF"
                  value={otp}
                  onChangeText={setOtp}
                  secureTextEntry={!showOtp}
                  keyboardType="number-pad"
                  maxLength={4}
                />
                <TouchableOpacity
                  onPress={() => setShowOtp(!showOtp)}
                  style={styles.eyeIcon}
                >
                  <Ionicons 
                    name={showOtp ? "eye-off" : "eye"} 
                    size={20} 
                    color="#9CA3AF" 
                  />
                </TouchableOpacity>
              </View>
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
            onPress={otpSent ? handleLogin : handleSendOtp}
            disabled={!isPhoneValid}
          >
            <Text style={styles.loginButtonText}>
              {otpSent ? 'Login' : 'Login'}
            </Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Do you have any account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.signupLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
  patternContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  triangle: {
    position: 'absolute',
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 14,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#8B5CF6',
  },
  vectorContainer: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 1,
  },
  vectorImage: {
    width: 80,
    height: 80,
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
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 48,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
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
    color: '#1F2937',
  },
  eyeIcon: {
    padding: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 32,
  },
  forgotPasswordText: {
    fontSize: 14,
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
    color: '#EA4335',
  },
  facebookText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1877F2',
  },
  promoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  promoText: {
    fontSize: 14,
    color: '#6B7280',
  },
  promoLink: {
    fontSize: 14,
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
  loginButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 40,
  },
  signupText: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 4,
  },
  signupLink: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
