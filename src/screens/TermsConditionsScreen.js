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
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const scale = Math.min(screenWidth / 375, screenHeight / 812);

const TermsConditionsScreen = () => {
  const navigation = useNavigation();

  // Handlers for clickable email and phone
  const handleEmailPress = () => {
    Linking.openURL('mailto:karma.consulting@gmail.com');
  };

  const handlePhonePress = () => {
    Linking.openURL('tel:8431174477');
  };

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
              <Ionicons name="chevron-back" size={24} color="#1A1B20" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Terms & Conditions</Text>
            <View style={styles.headerSpacer} />
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
              
              <View style={styles.section}>
                <Text style={styles.sectionHeading}>1. Introduction</Text>
                <Text style={styles.bulletPoint}>• The Dr WISE App and website are operated by Krama Consulting ("we," "us," or "our").</Text>
                <Text style={styles.bulletPoint}>• These Terms govern your use of the app, website, and any services provided therein.</Text>
                <Text style={styles.bulletPoint}>• The Terms are governed by Indian laws, including but not limited to the Information Technology Act, 2000.</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionHeading}>2. Eligibility</Text>
                <Text style={styles.bulletPoint}>• By using the Dr WISE App or website, you confirm that you are at least 18 years old and legally capable of entering into a binding agreement.</Text>
                <Text style={styles.bulletPoint}>• You agree to provide accurate and complete information when creating an account or availing of our services.</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionHeading}>3. Services Offered</Text>
                <Text style={styles.sectionText}>Dr WISE provides advisory and consulting services in the areas of:</Text>
                <Text style={styles.bulletPoint}>• Insurance</Text>
                <Text style={styles.bulletPoint}>• Investments</Text>
                <Text style={styles.bulletPoint}>• Loans</Text>
                <Text style={styles.bulletPoint}>• Business Consulting</Text>
                <Text style={styles.sectionText}>These services are subject to the availability of information, tools, and regulatory guidelines.</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionHeading}>4. User Responsibilities</Text>
                <Text style={styles.bulletPoint}>• You agree to use the app and website only for lawful purposes and in compliance with these Terms.</Text>
                <Text style={styles.bulletPoint}>• You are responsible for maintaining the confidentiality of your account credentials.</Text>
                <Text style={styles.bulletPoint}>• Any activity conducted through your account is considered authorized by you.</Text>
                <Text style={styles.subHeading}>You agree not to:</Text>
                <Text style={styles.bulletPoint}>• Misuse the app or website for fraudulent or malicious purposes.</Text>
                <Text style={styles.bulletPoint}>• Attempt to hack, disrupt, or reverse-engineer our systems.</Text>
                <Text style={styles.bulletPoint}>• Share, distribute, or resell any of the services or content provided by Dr WISE without prior written consent.</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionHeading}>5. Intellectual Property</Text>
                <Text style={styles.bulletPoint}>• All content, logos, trademarks, and intellectual property associated with Dr WISE are owned by us or licensed to us.</Text>
                <Text style={styles.bulletPoint}>• You are granted a limited, non-exclusive, non-transferable license to use the app and website solely for personal purposes.</Text>
                <Text style={styles.bulletPoint}>• Unauthorized reproduction, distribution, or commercial use of our content is strictly prohibited.</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionHeading}>6. Third-Party Services</Text>
                <Text style={styles.bulletPoint}>• The app and website may include links or integrations with third-party services.</Text>
                <Text style={styles.bulletPoint}>• We are not responsible for the content, privacy policies, or practices of third-party entities.</Text>
                <Text style={styles.bulletPoint}>• Your interactions with third-party services are governed by their respective terms.</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionHeading}>7. Payment and Refunds</Text>
                <Text style={styles.bulletPoint}>• Certain services on the Dr WISE platform may be chargeable.</Text>
                <Text style={styles.bulletPoint}>• Payments must be made through the provided secure methods.</Text>
                <Text style={styles.bulletPoint}>• Refunds, if applicable, will be processed as per our Refund Policy, available <Text style={styles.linkText} onPress={() => Linking.openURL('[Insert Refund Policy Link Here]')}>here</Text>.</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionHeading}>8. Disclaimer of Warranties</Text>
                <Text style={styles.bulletPoint}>• The services are provided "as is" and "as available" without any guarantees or warranties, express or implied.</Text>
                <Text style={styles.bulletPoint}>• We do not warrant the accuracy, reliability, or completeness of any advice or content on the platform.</Text>
                <Text style={styles.bulletPoint}>• Your reliance on the services is at your sole discretion and risk.</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionHeading}>9. Limitation of Liability</Text>
                <Text style={styles.bulletPoint}>• To the maximum extent permitted by law, Dr WISE is not liable for:</Text>
                <Text style={styles.bulletPoint}>• Any direct, indirect, incidental, or consequential damages arising from your use of the app or website.</Text>
                <Text style={styles.bulletPoint}>• Loss of data, unauthorized access, or service interruptions.</Text>
                <Text style={styles.bulletPoint}>• Our liability, if any, will not exceed the amount paid by you for our services.</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionHeading}>10. Termination</Text>
                <Text style={styles.bulletPoint}>• We reserve the right to suspend or terminate your access to the app and website at our sole discretion, with or without notice, for:</Text>
                <Text style={styles.bulletPoint}>• Breach of these Terms.</Text>
                <Text style={styles.bulletPoint}>• Non-payment of applicable fees.</Text>
                <Text style={styles.bulletPoint}>• Any activity deemed unlawful or harmful to Dr WISE or its users.</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionHeading}>11. Privacy Policy</Text>
                <Text style={styles.bulletPoint}>• Your use of the Dr WISE App and website is also governed by our Privacy Policy, which can be accessed <Text style={styles.linkText} onPress={() => Linking.openURL('[Insert Privacy Policy Link Here]')}>here</Text>.</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionHeading}>12. Governing Law and Dispute Resolution</Text>
                <Text style={styles.bulletPoint}>• These Terms are governed by the laws of India.</Text>
                <Text style={styles.bulletPoint}>• Any disputes arising from the use of the app or website will be subject to the exclusive jurisdiction of the courts in Bengaluru, Karnataka.</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionHeading}>13. Changes to Terms</Text>
                <Text style={styles.bulletPoint}>• We reserve the right to update or modify these Terms at any time.</Text>
                <Text style={styles.bulletPoint}>• Continued use of the app or website after changes constitute acceptance of the revised Terms.</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionHeading}>14. Contact Us</Text>
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
                By using the Dr WISE App or website, you agree to these Terms and Conditions in their entirety. Thank you for choosing Dr WISE for your advisory needs!
              </Text>
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
  section: {
    marginBottom: 20 * scale,
  },
  sectionHeading: {
    fontFamily: 'Rubik-Regular',
    fontSize: 18 * scale,
    color: '#1A1B20',
    lineHeight: 22 * scale,
    letterSpacing: 0.2,
    marginBottom: 10 * scale,
  },
  subHeading: {
    fontFamily: 'Rubik-Regular',
    fontSize: 16 * scale,
    color: '#1A1B20',
    lineHeight: 22 * scale,
    letterSpacing: 0.2,
    marginBottom: 5 * scale,
    marginTop: 10 * scale,
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
  linkText: {
    color: '#1E90FF',
    textDecorationLine: 'underline',
  },
  footerText: {
    fontFamily: 'Rubik',
    fontSize: 12 * scale,
    color: '#555555',
    textAlign: 'center',
    marginTop: 20 * scale,
    marginBottom: 30 * scale,
    lineHeight: 18 * scale,
  },
});

export default TermsConditionsScreen;
