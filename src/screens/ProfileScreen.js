import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Using colors from the Figma design for precision
const Colors = {
  primaryPurple: '#8F31F9',
  background: '#F7F2FE',
  cardBackground: '#FFFFFF',
  textDark: '#1A1B20',
  textGray: '#7D7D7D',
  logoutRed: '#D94747',
  white: '#FFFFFF',
  iconBackground: '#F3E8FF',
  contactCardBackground: 'rgba(255, 255, 255, 0.1)',
};

// A reusable component for policy items
const PolicyItem = ({ iconName, text, onPress }) => (
  <TouchableOpacity style={styles.policyItem} onPress={onPress}>
    <View style={styles.policyIconContainer}>
      <Ionicons name={iconName} size={20} color={Colors.primaryPurple} />
    </View>
    <Text style={styles.policyText}>{text}</Text>
    <Ionicons name="chevron-forward" size={20} color={Colors.textGray} />
  </TouchableOpacity>
);

const ProfileScreen = () => {
  const handlePolicyPress = (policyType) => {
    Alert.alert('Policy', `${policyType} will be implemented soon.`);
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => console.log('User logged out') },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Purple Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.headerTopBar}>
            <Text style={styles.headerTitle}>Profile</Text>
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="create-outline" size={24} color={Colors.white} />
            </TouchableOpacity>
          </View>

          {/* Corrected Avatar and Camera Icon */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={48} color={Colors.primaryPurple} />
            </View>
            <TouchableOpacity style={styles.cameraIconContainer}>
              <Ionicons name="camera" size={16} color={Colors.primaryPurple} />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>Punith</Text>

          <View style={styles.contactCard}>
            <View style={styles.contactRow}>
              <Ionicons name="call" size={20} color={Colors.white} />
              <Text style={styles.contactText}>9739993341</Text>
            </View>
            <View style={styles.contactRow}>
              <Ionicons name="mail" size={20} color={Colors.white} />
              <Text style={styles.contactText}>punithpuni7892@gmail.com</Text>
            </View>
          </View>
        </View>

        {/* Policies Section */}
        <View style={styles.policiesCard}>
          <Text style={styles.sectionTitle}>Policies</Text>
          {/* Corrected Policy Icons to be filled */}
          <PolicyItem
            iconName="shield-checkmark"
            text="Privacy Policy"
            onPress={() => handlePolicyPress('Privacy Policy')}
          />
          <PolicyItem
            iconName="document-text"
            text="Terms & Conditions"
            onPress={() => handlePolicyPress('Terms & Conditions')}
          />
          <PolicyItem
            iconName="help-circle"
            text="FAQ's"
            onPress={() => handlePolicyPress("FAQ's")}
          />
        </View>

        {/* Corrected Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  headerSection: {
    backgroundColor: Colors.primaryPurple,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
  },
  headerTopBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.white,
  },
  editButton: {
    position: 'absolute',
    right: 0,
    padding: 4,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 20,
  },
  contactCard: {
    width: '100%',
    backgroundColor: Colors.contactCardBackground,
    borderRadius: 16,
    padding: 20,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  contactText: {
    fontSize: 16,
    color: Colors.white,
    marginLeft: 16,
  },
  policiesCard: {
    backgroundColor: Colors.cardBackground,
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: 10,
  },
  policyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  policyIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: Colors.iconBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  policyText: {
    fontSize: 16,
    color: Colors.textDark,
    fontWeight: '500',
    flex: 1,
  },
  // Corrected Logout Button Styles
  logoutButton: {
    marginTop: 32,
    alignItems: 'center',
    padding: 10,
  },
  logoutText: {
    fontSize: 16,
    color: Colors.logoutRed,
    fontWeight: '600',
  },
});

export default ProfileScreen;