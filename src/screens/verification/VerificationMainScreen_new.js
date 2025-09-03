import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/tokens';

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
  const [steps, setSteps] = useState({
    governmentId: false,
    selfiePhoto: false,
    bankDetails: false,
  });

  // Listen for completion from route params
  useEffect(() => {
    if (route?.params?.completedStep) {
      console.log('Completing step:', route.params.completedStep);
      setSteps(prev => {
        const newSteps = {
          ...prev,
          [route.params.completedStep]: true
        };
        console.log('Updated steps:', newSteps);
        return newSteps;
      });
      
      // Clear the param to avoid re-triggering
      navigation.setParams({ completedStep: undefined });
    }
  }, [route?.params?.completedStep, navigation]);

  const handleStepPress = (stepKey) => {
    console.log('Navigating to step:', stepKey);
    
    if (stepKey === 'governmentId') {
      navigation.navigate('GovernmentIDScreen');
    } else if (stepKey === 'selfiePhoto') {
      navigation.navigate('SelfiePhotoScreen');
    } else if (stepKey === 'bankDetails') {
      navigation.navigate('BankDetailsScreen');
    }
  };

  const allComplete = Object.values(steps).every(Boolean);
  console.log('All steps complete:', allComplete, steps);

  const handleVerifyIdentity = () => {
    if (allComplete) {
      console.log('All verification steps completed!');
      // Navigate to next screen or handle verification completion
      // navigation.navigate('NextScreen');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back-outline" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Verify identity</Text>
        <View style={styles.placeholder} />
      </View>

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
            allComplete ? styles.verifyButtonEnabled : styles.verifyButtonDisabled
          ]}
          onPress={handleVerifyIdentity}
          disabled={!allComplete}
        >
          <Text style={[
            styles.verifyButtonText,
            allComplete ? styles.verifyButtonTextEnabled : styles.verifyButtonTextDisabled
          ]}>
            Verify my identity
          </Text>
        </TouchableOpacity>
      </View>
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
    color: colors.text,
  },
  placeholder: {
    width: 40,
  },
  stepsContainer: {
    flex: 1,
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
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 16,
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
  },
  verifyButtonTextEnabled: {
    color: '#FFFFFF',
  },
  verifyButtonTextDisabled: {
    color: '#9CA3AF',
  },
});
