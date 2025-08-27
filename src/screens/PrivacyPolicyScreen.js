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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// --- Privacy Policy Content ---
// This structure makes the text easy to manage and style
const policySections = [
  {
    title: '1. Information We Collect',
    content: [
      'We may collect:',
      '• Personal details (name, email, phone number)',
      '• Location data (with your permission)',
      '• Device information and app usage data',
    ],
  },
  {
    title: '2. How We Use Your Data',
    content: [
      'Your data helps us:',
      '• Improve app performance and features',
      '• Provide personalized experiences',
      '• Communicate updates or offers',
    ],
  },
  {
    title: '3. Data Sharing',
    content: ['We do not sell your data. We only share with trusted partners when needed for app functionality, under strict confidentiality.'],
  },
  {
    title: '4. Data Security',
    content: ['We use encryption and secure servers to protect your data. Your privacy is a top priority.'],
  },
  {
    title: '5. User Control',
    content: ['You can update, delete, or request access to your data anytime from your profile settings.'],
  },
  {
    title: '6. Permissions',
    content: ['We only request permissions required to enhance app usage, like location for map features or access to storage for uploads.'],
  },
  {
    title: '7. Policy Updates',
    content: ['We may update this policy. You’ll be notified of major changes within the app.'],
  },
  {
    title: 'Contact Us',
    content: ['If you have questions, reach us at: [support@example.com]'],
  },
];

const PrivacyPolicyScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={['#F3ECFE', '#F6F6FE']}
        locations={[0, 0.49]}
        style={styles.background}
      >
        {/* --- Custom Header --- */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#1A1B20" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Privacy Policy</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.mainTitle}>Privacy Policy</Text>
          <Text style={styles.paragraph}>
            We value your privacy. This policy explains how we collect, use, and protect your personal information when you use our app.
          </Text>
          
          {policySections.map((section, index) => (
            <View key={index} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              {section.content.map((point, pointIndex) => (
                <Text 
                  key={pointIndex} 
                  style={point.startsWith('•') ? styles.bulletPoint : styles.paragraph}
                >
                  {point}
                </Text>
              ))}
            </View>
          ))}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
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
    paddingHorizontal: 20,
    height: 80,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  backButton: {
    backgroundColor: 'rgba(150, 61, 251, 0.05)',
    width: 26,
    height: 26,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 24,
    color: '#1A1B20',
  },
  headerSpacer: {
    width: 26, // To balance the back button for centering the title
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  mainTitle: {
    fontFamily: 'Rubik-Medium',
    fontSize: 24,
    color: '#1A1B20',
    marginBottom: 12,
  },
  paragraph: {
    fontFamily: 'Rubik-Regular',
    fontSize: 14,
    color: '#7D7D7D',
    lineHeight: 22, // Improved line spacing for readability
    letterSpacing: 0.2,
    marginBottom: 4,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontFamily: 'Rubik-Medium', // Using Medium weight for section titles as per design
    fontSize: 14,
    color: '#7D7D7D',
    lineHeight: 22,
    letterSpacing: 0.2,
    marginBottom: 8,
  },
  bulletPoint: {
    fontFamily: 'Rubik-Regular',
    fontSize: 14,
    color: '#7D7D7D',
    lineHeight: 22,
    letterSpacing: 0.2,
    marginBottom: 4,
    // No need for marginLeft as the bullet is part of the string
  },
});

export default PrivacyPolicyScreen;