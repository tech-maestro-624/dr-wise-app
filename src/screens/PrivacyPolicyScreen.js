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
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const PrivacyPolicyScreen = () => {
  const navigation = useNavigation();

  // Handler for clickable email
  const handleEmailPress = () => {
    Linking.openURL('mailto:karma.consulting@gmail.com');
  };

  // Handler for clickable phone
  const handlePhonePress = () => {
    Linking.openURL('tel:8431174477');
  };

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
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Information We Collect</Text>
            <Text style={styles.subTitle}>a. Personal Information:</Text>
            <Text style={styles.bulletPoint}>• Name, email address, phone number, date of birth, gender, and residential address.</Text>
            <Text style={styles.bulletPoint}>• Financial details, including income, assets, liabilities, and insurance details, as provided by you.</Text>
            <Text style={styles.bulletPoint}>• Identity verification details such as PAN, Aadhaar, or other KYC documents.</Text>
            
            <Text style={styles.subTitle}>b. Usage Data:</Text>
            <Text style={styles.bulletPoint}>• Information about your interactions with the app, such as features accessed and time spent on the app.</Text>
            <Text style={styles.bulletPoint}>• Device information, including device type, operating system, and IP address.</Text>
            
            <Text style={styles.subTitle}>c. Transactional Information:</Text>
            <Text style={styles.bulletPoint}>• Details of services availed through the app, including investments, loans, or advisory sessions.</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
            <Text style={styles.paragraph}>The information we collect is used for:</Text>
            <Text style={styles.bulletPoint}>• Delivering personalized advisory services.</Text>
            <Text style={styles.bulletPoint}>• Processing transactions and facilitating your requests.</Text>
            <Text style={styles.bulletPoint}>• Improving the app's functionality, features, and user experience.</Text>
            <Text style={styles.bulletPoint}>• Communicating updates, offers, and notifications relevant to your preferences.</Text>
            <Text style={styles.bulletPoint}>• Complying with legal and regulatory obligations.</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Sharing Your Information</Text>
            <Text style={styles.paragraph}>We do not sell or rent your personal data to third parties. However, we may share your information with:</Text>
            <Text style={styles.bulletPoint}>• Service Providers: Third-party entities that assist in providing advisory services, payment processing, or data analytics.</Text>
            <Text style={styles.bulletPoint}>• Regulatory Authorities: When required to comply with applicable laws or enforce legal rights.</Text>
            <Text style={styles.bulletPoint}>• Affiliates and Partners: For delivering integrated services like investment platforms, loan providers, or insurance partners, subject to your consent.</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Data Storage and Security</Text>
            <Text style={styles.paragraph}>We implement robust security measures to protect your data against unauthorized access, alteration, disclosure, or destruction, including:</Text>
            <Text style={styles.bulletPoint}>• Encryption of sensitive data during transmission and storage.</Text>
            <Text style={styles.bulletPoint}>• Restricted access to personal data to authorized personnel only.</Text>
            <Text style={styles.bulletPoint}>• Regular security audits and updates to our systems.</Text>
            <Text style={styles.paragraph}>Your data is stored on secure servers located within India, in compliance with the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Your Rights</Text>
            <Text style={styles.paragraph}>You have the following rights concerning your personal data:</Text>
            <Text style={styles.bulletPoint}>• Access and Rectification: Review and update your information through the app.</Text>
            <Text style={styles.bulletPoint}>• Data Portability: Request a copy of your data in a machine-readable format.</Text>
            <Text style={styles.bulletPoint}>• Withdraw Consent: Opt out of non-essential services or communications.</Text>
            <Text style={styles.bulletPoint}>• Deletion: Request the deletion of your data, subject to legal and contractual obligations.</Text>
            <Text style={styles.paragraph}>To exercise these rights, contact us at{' '}
              <Text style={styles.linkText} onPress={handleEmailPress}>
                karma.consulting@gmail.com
              </Text>.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Third-Party Links</Text>
            <Text style={styles.paragraph}>The Dr WISE App may contain links to third-party websites or services. We are not responsible for the privacy practices of these entities and recommend reviewing their policies separately.</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>7. Children's Privacy</Text>
            <Text style={styles.paragraph}>The Dr WISE App is not intended for users under the age of 18. We do not knowingly collect data from minors without parental consent.</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>8. Changes to this Privacy Policy</Text>
            <Text style={styles.paragraph}>We reserve the right to update this Privacy Policy periodically. Significant changes will be communicated through the app or other appropriate means.</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>9. Contact Us</Text>
            <Text style={styles.paragraph}>If you have any questions or concerns about this Privacy Policy or your data, please contact us at:</Text>
            <Text style={styles.bulletPoint}>• Email:{' '}
              <Text style={styles.linkText} onPress={handleEmailPress}>
                karma.consulting@gmail.com
              </Text>
            </Text>
            <Text style={styles.bulletPoint}>• Phone:{' '}
              <Text style={styles.linkText} onPress={handlePhonePress}>
                84311 74477
              </Text>
            </Text>
            <Text style={styles.bulletPoint}>• Address: Raj Arcade, 2nd Flr, Outer Ring Rd, 1st Block, 2nd Stage, Naagarabhaavi, Bengaluru, Karnataka 560091</Text>
          </View>

          <Text style={styles.footerText}>
            This Privacy Policy complies with the provisions of the Information Technology Act, 2000 and applicable data protection laws in India.
          </Text>
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
    lineHeight: 22,
    letterSpacing: 0.2,
    marginBottom: 8,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontFamily: 'Rubik-Regular',
    fontSize: 18,
    color: '#1A1B20',
    lineHeight: 22,
    letterSpacing: 0.2,
    marginBottom: 10,
  },
  subTitle: {
    fontFamily: 'Rubik-Regular',
    fontSize: 16,
    color: '#1A1B20',
    lineHeight: 22,
    letterSpacing: 0.2,
    marginBottom: 5,
  },
  bulletPoint: {
    fontFamily: 'Rubik-Regular',
    fontSize: 14,
    color: '#7D7D7D',
    lineHeight: 22,
    letterSpacing: 0.2,
    marginBottom: 4,
    marginLeft: 10,
  },
  linkText: {
    color: '#1E90FF',
    textDecorationLine: 'underline',
  },
  footerText: {
    fontFamily: 'Rubik-Regular',
    fontSize: 12,
    color: '#555555',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 40,
    lineHeight: 18,
  },
});

export default PrivacyPolicyScreen;