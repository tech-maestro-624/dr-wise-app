import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar,
  ScrollView,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/tokens';
import { completeRegistrationWithVerification, getVerificationData } from '../../api/verification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../context/AuthContext';
import Toast from 'react-native-toast-message';

const stepsList = [
  { 
    key: 'governmentId', 
    label: 'Government ID', 
    desc: 'Helps verify your personal and address details.',
  },
  { 
    key: 'selfiePhoto', 
    label: 'Selfie photo', 
    desc: 'Used to confirm your identity for secure access.',
  },
  { 
    key: 'bankDetails', 
    label: 'Bank details', 
    desc: 'Needed to transfer your earnings safely and directly.',
  },
];

export default function VerificationMainScreen({ navigation, route }) {
  // Modal state for verification completion
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  
  // Initialize state from route params if available
  const [steps, setSteps] = useState(() => {
    const initialState = {
      governmentId: false,
      selfiePhoto: false,
      bankDetails: false,
    };
    
    // If we have completion data in route params, use it
    if (route?.params?.completedSteps && Array.isArray(route.params.completedSteps)) {
      const completedSteps = route.params.completedSteps;
      completedSteps.forEach(step => {
        if (initialState.hasOwnProperty(step)) {
          initialState[step] = true;
        }
      });
    }
    
    return initialState;
  });

  // Listen for completion from route params
  useEffect(() => {
    if (route?.params?.completedSteps && Array.isArray(route.params.completedSteps)) {
      console.log('Updating completed steps:', route.params.completedSteps);
      setSteps(prev => {
        const newSteps = {
          governmentId: false,
          selfiePhoto: false,
          bankDetails: false,
        };
        
        // Set completed steps to true
        route.params.completedSteps.forEach(step => {
          if (newSteps.hasOwnProperty(step)) {
            newSteps[step] = true;
          }
        });
        
        console.log('Updated steps:', newSteps);
        return newSteps;
      });
    }
  }, [route?.params?.completedSteps]);

  // Focus listener to restore state when returning to screen
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Restore completed steps if available
      if (route?.params?.completedSteps && Array.isArray(route.params.completedSteps)) {
        console.log('Restoring completed steps:', route.params.completedSteps);
        const restoredSteps = {
          governmentId: false,
          selfiePhoto: false,
          bankDetails: false,
        };
        
        route.params.completedSteps.forEach(step => {
          if (restoredSteps.hasOwnProperty(step)) {
            restoredSteps[step] = true;
          }
        });
        
        setSteps(restoredSteps);
      }
    });

    return unsubscribe;
  }, [navigation, route?.params?.completedSteps]);

  const handleStepPress = (stepKey) => {
    console.log('Navigating to step:', stepKey);
    
    // Pass current completed steps to the step screen
    const completedStepsArray = Object.keys(steps).filter(key => steps[key]);
    const navigationParams = { 
      completedSteps: completedStepsArray 
    };
    
    if (stepKey === 'governmentId') {
      navigation.navigate('GovernmentIDScreen', navigationParams);
    } else if (stepKey === 'selfiePhoto') {
      navigation.navigate('SelfiePhotoScreen', navigationParams);
    } else if (stepKey === 'bankDetails') {
      navigation.navigate('BankDetailsScreen', navigationParams);
    }
  };

  const allComplete = Object.values(steps).every(Boolean);
  console.log('All steps complete:', allComplete, steps);

  const handleVerifyIdentity = async () => {
    if (allComplete) {
      setIsSubmitting(true);
      try {
        // Get stored verification data
        const verificationData = getVerificationData();

        // Get user data from AsyncStorage (stored during initial registration)
        const userDataString = await AsyncStorage.getItem('tempUserData');
        let userData = {};

        if (userDataString) {
          userData = JSON.parse(userDataString);
        }

        // Combine user data with verification data
        const completeRegistrationData = {
          ...userData,
          otp: '123456', // Using default OTP for development
          verified: true
        };

        console.log('Submitting complete registration data...');

        // Submit complete registration with files and bank details
        const response = await completeRegistrationWithVerification(completeRegistrationData);

        if (response.data) {
          Toast.show({
            type: 'success',
            text1: 'Registration Completed!',
            text2: 'Account registered successfully. Please wait for verification approval.',
            position: 'bottom',
          });

          // Clear temp data
          await AsyncStorage.removeItem('tempUserData');

          // Navigate to login screen (don't login user immediately)
          navigation.navigate('Login');
        }
      } catch (error) {
        console.error('Registration completion error:', error);
        Toast.show({
          type: 'error',
          text1: 'Registration failed',
          text2: error?.response?.data?.message || error.message,
          position: 'bottom',
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    // Navigate to login screen
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Verify identity</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Verification Steps */}
        <View style={styles.stepsContainer}>
          {stepsList.map((step, index) => (
            <View key={step.key} style={styles.stepCard}>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>{step.label}</Text>
                <Text style={styles.stepDescription}>{step.desc}</Text>
                
                {steps[step.key] ? (
                  <View style={styles.completedContainer}>
                    <Ionicons name="checkmark-circle" size={48} color="#10B981" />
                    <Text style={styles.completedText}>Completed</Text>
                  </View>
                ) : (
                  <TouchableOpacity 
                    style={styles.selectButton}
                    onPress={() => handleStepPress(step.key)}
                  >
                    <Ionicons name="add" size={24} color="#8B5CF6" />
                    <Text style={styles.selectButtonText}>Select</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Bottom Button */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[
              styles.verifyButton,
              allComplete && !isSubmitting ? styles.verifyButtonEnabled : styles.verifyButtonDisabled
            ]}
            onPress={handleVerifyIdentity}
            disabled={!allComplete || isSubmitting}
          >
            <Text style={[
              styles.verifyButtonText,
              allComplete && !isSubmitting ? styles.verifyButtonTextEnabled : styles.verifyButtonTextDisabled
            ]}>
              {isSubmitting ? 'Completing Registration...' : 'Finish Registration'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Success Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIcon}>
              <Ionicons name="checkmark-circle" size={80} color="#10B981" />
            </View>
            
            <Text style={styles.modalTitle}>Verification Complete!</Text>
            <Text style={styles.modalMessage}>
              Your identity has been successfully verified. You can now access all features.
            </Text>
            
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={handleModalClose}
            >
              <Text style={styles.modalButtonText}>Continue to Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'Rubik-Bold',
    color: colors.text,
  },
  placeholder: {
    width: 40,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  stepsContainer: {
    paddingHorizontal: 20,
  },
  stepCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  stepContent: {
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Rubik-Bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 16,
    fontFamily: 'Rubik-Regular',
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  completedContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  completedText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Rubik-SemiBold',
    color: '#10B981',
    marginTop: 8,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    minWidth: 120,
  },
  selectButtonText: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Rubik-SemiBold',
    color: '#8B5CF6',
    marginLeft: 8,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
  },
  verifyButton: {
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyButtonEnabled: {
    backgroundColor: '#8B5CF6',
  },
  verifyButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  verifyButtonText: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Rubik-SemiBold',
  },
  verifyButtonTextEnabled: {
    color: '#FFFFFF',
  },
  verifyButtonTextDisabled: {
    color: '#9CA3AF',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 32,
    margin: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  modalIcon: {
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Rubik-Bold',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    fontFamily: 'Rubik-Regular',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  modalButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    minWidth: 200,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Rubik-SemiBold',
    color: '#FFFFFF',
  },
});
