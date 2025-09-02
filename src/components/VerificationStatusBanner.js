import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/tokens';

const VerificationStatusBanner = ({ onPress }) => {
  const { verificationStatus, user, isAuthenticated } = useAuth();

  // Don't show banner if user is already verified or not logged in
  if (verificationStatus === 'approved' || !user || !isAuthenticated) {
    return null;
  }

  const getStatusConfig = () => {
    switch (verificationStatus) {
      case 'pending':
        return {
          icon: 'time-outline',
          color: '#F59E0B', // amber
          backgroundColor: '#FEF3C7', // light amber
          title: 'Verification Pending',
          message: 'Your documents are being reviewed. You can use the app with limited features.',
          showArrow: false, // Can't take action while pending
        };
      case 'rejected':
        return {
          icon: 'close-circle-outline',
          color: '#EF4444', // red
          backgroundColor: '#FEE2E2', // light red
          title: 'Verification Rejected',
          message: 'Please contact support for assistance.',
          showArrow: false, // Can't resubmit from here
        };
      default:
        return {
          icon: 'document-outline',
          color: '#6B7280', // gray
          backgroundColor: '#F3F4F6', // light gray
          title: 'Verification Required',
          message: 'Complete verification to access all features.',
          showArrow: true, // Can navigate to complete verification
        };
    }
  };

  const config = getStatusConfig();

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: config.backgroundColor }]}
      onPress={config.showArrow ? onPress : undefined}
      activeOpacity={config.showArrow ? 0.8 : 1}
      disabled={!config.showArrow}
    >
      <View style={styles.content}>
        <Ionicons name={config.icon} size={24} color={config.color} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: config.color }]}>
            {config.title}
          </Text>
          <Text style={styles.message}>
            {config.message}
          </Text>
        </View>
        {config.showArrow && (
          <Ionicons name="chevron-forward" size={20} color={config.color} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 18,
  },
});

export default VerificationStatusBanner;
