import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/tokens';
import { storeBankDetails } from '../../api/verification';


export default function BankDetailsScreen({ navigation, route }) {
  const [formData, setFormData] = useState({
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    accountHolderName: '',
    branchName: ''
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required';
    } else if (formData.accountNumber.length < 9 || formData.accountNumber.length > 18) {
      newErrors.accountNumber = 'Account number should be 9-18 digits';
    }

    if (!formData.ifscCode.trim()) {
      newErrors.ifscCode = 'IFSC code is required';
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode)) {
      newErrors.ifscCode = 'Invalid IFSC code format';
    }

    if (!formData.bankName.trim()) {
      newErrors.bankName = 'Bank name is required';
    }

    if (!formData.accountHolderName.trim()) {
      newErrors.accountHolderName = 'Account holder name is required';
    }

    if (!formData.branchName.trim()) {
      newErrors.branchName = 'Branch name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Store the bank details for later use in registration
      storeBankDetails(formData);

      // Navigate back without showing success modal
      const existingCompleted = route.params?.completedSteps || [];
      const updatedCompleted = [...existingCompleted];
      if (!updatedCompleted.includes('bankDetails')) {
        updatedCompleted.push('bankDetails');
      }

      // Navigate back with updated completion status
      navigation.navigate('Verification', { completedSteps: updatedCompleted });

      Alert.alert(
        'Success',
        'Bank details saved successfully!',
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert('Validation Error', 'Please fill all required fields correctly');
    }
  };


  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
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
        <Text style={styles.title}>Bank Details</Text>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Account Number */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Account Number</Text>
            <TextInput
              style={[styles.input, errors.accountNumber && styles.inputError]}
              placeholder="Enter Number"
              placeholderTextColor="#9CA3AF"
              value={formData.accountNumber}
              onChangeText={(text) => updateField('accountNumber', text)}
              keyboardType="numeric"
              maxLength={18}
            />
            {errors.accountNumber && (
              <Text style={styles.errorText}>{errors.accountNumber}</Text>
            )}
          </View>

          {/* IFSC Code */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>IFSC Code</Text>
            <TextInput
              style={[styles.input, errors.ifscCode && styles.inputError]}
              placeholder="Enter Code"
              placeholderTextColor="#9CA3AF"
              value={formData.ifscCode}
              onChangeText={(text) => updateField('ifscCode', text.toUpperCase())}
              autoCapitalize="characters"
              maxLength={11}
            />
            {errors.ifscCode && (
              <Text style={styles.errorText}>{errors.ifscCode}</Text>
            )}
          </View>

          {/* Bank Name */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Bank Name</Text>
            <TextInput
              style={[styles.input, errors.bankName && styles.inputError]}
              placeholder="Enter Name"
              placeholderTextColor="#9CA3AF"
              value={formData.bankName}
              onChangeText={(text) => updateField('bankName', text)}
              autoCapitalize="words"
            />
            {errors.bankName && (
              <Text style={styles.errorText}>{errors.bankName}</Text>
            )}
          </View>

          {/* Bank Account Registered Name */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Bank Account Registered Name</Text>
            <TextInput
              style={[styles.input, errors.accountHolderName && styles.inputError]}
              placeholder="Enter Name"
              placeholderTextColor="#9CA3AF"
              value={formData.accountHolderName}
              onChangeText={(text) => updateField('accountHolderName', text)}
              autoCapitalize="words"
            />
            {errors.accountHolderName && (
              <Text style={styles.errorText}>{errors.accountHolderName}</Text>
            )}
          </View>

          {/* Branch Name */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Branch Name</Text>
            <TextInput
              style={[styles.input, errors.branchName && styles.inputError]}
              placeholder="Enter Name"
              placeholderTextColor="#9CA3AF"
              value={formData.branchName}
              onChangeText={(text) => updateField('branchName', text)}
              autoCapitalize="words"
            />
            {errors.branchName && (
              <Text style={styles.errorText}>{errors.branchName}</Text>
            )}
          </View>

          {/* UPI Section */}
          {/* <View style={styles.upiSection}>
            <View style={styles.upiIconContainer}>
              <View style={styles.upiIcon}>
                <Ionicons name="arrow-up" size={24} color="#8B5CF6" />
              </View>
            </View>
            <View style={styles.upiTextContainer}>
              <Text style={styles.upiTitle}>UPI</Text>
              <Text style={styles.upiSubtitle}>Share services you trust and</Text>
            </View>
            <TouchableOpacity style={styles.upiArrow}>
              <Ionicons name="chevron-forward" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View> */}
        </ScrollView>

        {/* Submit Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F8F9FA',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#111827',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: 4,
  },
  upiSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  upiIconContainer: {
    marginRight: 16,
  },
  upiIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  upiTextContainer: {
    flex: 1,
  },
  upiTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  upiSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  upiArrow: {
    padding: 4,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  submitButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
