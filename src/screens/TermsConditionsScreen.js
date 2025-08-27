import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const scale = Math.min(screenWidth / 375, screenHeight / 812);

const TermsConditionsScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3ECFE" />
      <LinearGradient
        colors={['#F3ECFE', '#F6F6FE']}
        locations={[0, 0.4917]}
        style={styles.background}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <View style={styles.backButtonBackground}>
                <Ionicons name="chevron-back-outline" size={15 * scale} color="#1A1B20" />
              </View>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Terms & Conditions</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={true}
            bounces={true}
            alwaysBounceVertical={true}
          >
            {/* Content */}
            <View style={styles.contentContainer}>
              <Text style={styles.contentTitle}>Terms & Conditions</Text>
              
              <Text style={styles.introText}>
                By using this app, you agree to the terms below. Please read them carefully.
              </Text>

              <View style={styles.section}>
                <Text style={styles.sectionHeading}>1. Acceptance of Terms</Text>
                <Text style={styles.sectionText}>
                  Using this app means you accept these terms. If you don't agree, please do not use the app.
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionHeading}>2. User Responsibilities</Text>
                <Text style={styles.bulletPoint}>• Provide accurate information</Text>
                <Text style={styles.bulletPoint}>• Do not misuse or attempt to hack the app</Text>
                <Text style={styles.bulletPoint}>• Respect community guidelines and other users</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionHeading}>3. App Usage</Text>
                <Text style={styles.bulletPoint}>• Features may change or be updated anytime</Text>
                <Text style={styles.bulletPoint}>• We may restrict access if terms are violated</Text>
                <Text style={styles.bulletPoint}>• Usage should be legal and as intended</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionHeading}>4. Intellectual Property</Text>
                <Text style={styles.sectionText}>
                  All content, logos, and visuals are owned by the app team. You may not copy or reuse them without permission.
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionHeading}>5. Data & Privacy</Text>
                <Text style={styles.sectionText}>
                  We respect your privacy. Read our Privacy Policy to understand how we handle your data.
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionHeading}>6. Account Suspension</Text>
                <Text style={styles.sectionText}>
                  Accounts may be suspended or deleted for violating terms, misuse, or illegal activity.
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionHeading}>7. Changes to Terms</Text>
                <Text style={styles.sectionText}>
                  We may update these terms from time to time. Continued use means you accept the latest version.
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionHeading}>8. Contact Us</Text>
                <Text style={styles.sectionText}>
                  For questions or support, reach out at [support@example.com]
                </Text>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
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
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20 * scale,
    paddingVertical: 12 * scale,
    height: 80 * scale,
  },
  backButton: {
    width: 26 * scale,
    height: 26 * scale,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonBackground: {
    width: 26 * scale,
    height: 26 * scale,
    borderRadius: 4 * scale,
    backgroundColor: 'rgba(150, 61, 251, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 24 * scale,
    fontWeight: '600',
    color: '#1A1B20',
    lineHeight: 28 * scale,
    textAlign: 'center',
  },
  placeholder: {
    width: 26 * scale,
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 20 * scale,
    paddingBottom: 120 * scale,
  },
  contentContainer: {
    width: '100%',
  },
  contentTitle: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 24 * scale,
    fontWeight: '600',
    color: '#1A1B20',
    lineHeight: 28 * scale,
    marginBottom: 12 * scale,
  },
  introText: {
    fontFamily: 'Rubik',
    fontSize: 14 * scale,
    fontWeight: '400',
    color: '#1A1B20',
    lineHeight: 17 * scale,
    letterSpacing: 0.2,
    marginBottom: 20 * scale,
  },
  section: {
    marginBottom: 20 * scale,
  },
  sectionHeading: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 14 * scale,
    fontWeight: '600',
    color: '#1A1B20',
    lineHeight: 17 * scale,
    letterSpacing: 0.2,
    marginBottom: 8 * scale,
  },
  sectionText: {
    fontFamily: 'Rubik',
    fontSize: 14 * scale,
    fontWeight: '400',
    color: '#1A1B20',
    lineHeight: 17 * scale,
    letterSpacing: 0.2,
    marginBottom: 8 * scale,
  },
  bulletPoint: {
    fontFamily: 'Rubik',
    fontSize: 14 * scale,
    fontWeight: '400',
    color: '#1A1B20',
    lineHeight: 17 * scale,
    letterSpacing: 0.2,
    marginLeft: 16 * scale,
    marginBottom: 4 * scale,
  },
});

export default TermsConditionsScreen;
