import React, { useState } from 'react';
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

const FAQScreen = () => {
  const navigation = useNavigation();
  const [expandedItems, setExpandedItems] = useState([]);

  const faqs = [
    {
      question: '1. What is the Dr WISE App?',
      answer:
        'The Dr WISE App is a comprehensive advisory platform offering services in insurance, investments, loans, and business consulting. It is designed to help users make informed financial and business decisions.',
    },
    {
      question: '2. Who can use the Dr WISE App?',
      answer:
        'The app is intended for individuals aged 18 and above who are seeking financial, insurance, or business advisory services.',
    },
    {
      question: '3. How do I register on the Dr WISE App?',
      answer:
        'To register:\n1. Download the app from [Google Play Store/App Store].\n2. Sign up using your email address or phone number.\n3. Complete the profile setup by providing basic personal and financial details.',
    },
    {
      question: '4. What services does Dr WISE offer?',
      answer:
        'Dr WISE provides advisory and consulting services in the following areas:\n• Insurance: Tailored advice on health, life, vehicle, and general insurance.\n• Investments: Guidance on mutual funds, SIPs, stocks, and other investment options.\n• Loans: Assistance in selecting the best loan products (personal, home, or business).\n• Business Consulting: Strategies for growth, funding, and operational efficiency.',
    },
    {
      question: '5. Is my personal data safe on the Dr WISE App?',
      answer:
        'Yes, your data is secure. We use advanced encryption technologies and comply with Indian data protection laws to ensure your information is safeguarded. For more details, please refer to our Privacy Policy [here] (Insert Link).',
    },
    {
      question: '6. Are there any charges for using the Dr WISE App?',
      answer:
        '• The app is free to download and register.\n• Certain premium services, such as personalized consultations or detailed financial plans, may be chargeable.',
    },
    {
      question: '7. How do I make a payment on the Dr WISE App?',
      answer:
        'Payments can be made securely through various modes, including:\n• UPI\n• Debit/Credit Cards\n• Net Banking\n• Digital Wallets',
    },
    {
      question: '8. Can I cancel a service after booking it?',
      answer:
        'Yes, cancellations are allowed for specific services before they are initiated. However, cancellation policies may vary. Please refer to the Refund Policy [here] (Insert Link) for details.',
    },
    {
      question: '9. How do I get in touch with a consultant?',
      answer:
        'You can book a consultation through the app. Our advisors will connect with you via chat, call, or video as per your selected preference.',
    },
    {
      question: '10. What should I do if I encounter technical issues?',
      answer:
        'For technical assistance, you can:\n• Use the Help Center in the app.\n• Email us at [Insert Support Email].\n• Call our support team at [Insert Support Number].',
    },
    {
      question: '11. Can I update my profile details?',
      answer:
        'Yes, you can edit your profile information, including contact details, preferences, and financial data, through the Profile Settings section in the app.',
    },
    {
      question: '12. How do I track the progress of my advisory services?',
      answer:
        'You can view the status of your services under the My Services or Dashboard section of the app. Notifications will also be sent for updates.',
    },
    {
      question: '13. Can I refer Dr WISE to others?',
      answer:
        'Absolutely! You can refer the app to your friends and family using the Refer and Earn feature. Earn rewards for successful referrals.',
    },
    {
      question: '14. Is there a way to provide feedback?',
      answer:
        'Yes, your feedback is valuable to us! You can:\n• Use the Feedback option in the app.\n• Email your suggestions to [Insert Feedback Email].',
    },
    {
      question: '15. How do I delete my account?',
      answer:
        'To delete your account:\n1. Go to Profile Settings > Account Management > Delete Account.\n2. Follow the on-screen instructions.\nPlease note that certain data may be retained to comply with legal obligations.',
    },
    {
      question: '16. Is Dr WISE available in languages other than English?',
      answer:
        'Currently, the app supports English. We plan to include other regional languages in future updates.',
    },
    {
      question: '17. What should I do if I forget my password?',
      answer:
        'You can reset your password by clicking Forgot Password on the login screen. A reset link will be sent to your registered email or phone number.',
    },
    {
      question: '18. Does Dr WISE guarantee financial outcomes?',
      answer:
        'While our advisors provide expert guidance, we cannot guarantee specific financial outcomes as market conditions and other external factors play a significant role.',
    },
  ];

  const toggleItem = (index) => {
    if (expandedItems.includes(index)) {
      setExpandedItems(expandedItems.filter((item) => item !== index));
    } else {
      setExpandedItems([...expandedItems, index]);
    }
  };

  // Handler for clickable email
  const handleEmailPress = () => {
    Linking.openURL('mailto:karma.consulting@gmail.com');
  };

  // Handler for clickable phone
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
            <Text style={styles.headerTitle}>FAQ's</Text>
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
              <Text style={styles.contentTitle}>Frequently Asked Questions</Text>
              
              {faqs.map((faq, index) => (
                <View
                  key={index}
                  style={styles.faqItem}
                >
                  <TouchableOpacity onPress={() => toggleItem(index)} style={styles.questionContainer}>
                    <View style={styles.questionRow}>
                      <Text style={styles.questionText}>
                        {faq.question}
                      </Text>
                      <Ionicons
                        name={
                          expandedItems.includes(index)
                            ? 'chevron-down'
                            : 'chevron-forward'
                        }
                        size={20 * scale}
                        color="#6e5eae"
                      />
                    </View>
                  </TouchableOpacity>
                  {expandedItems.includes(index) && (
                    <View style={styles.answerContainer}>
                      <Text style={styles.answerText}>
                        {faq.answer.split('\n').map((line, i) => (
                          <React.Fragment key={i}>
                            {line.startsWith('•') ? (
                              <Text key={i} style={styles.answerText}>
                                {line} {'\n'}
                              </Text>
                            ) : (
                              <Text key={i} style={styles.answerText}>
                                {line} {'\n'}
                              </Text>
                            )}
                          </React.Fragment>
                        ))}
                      </Text>
                    </View>
                  )}
                </View>
              ))}

              {/* Contact Information */}
              <View style={styles.contactSection}>
                <Text style={styles.contactTitle}>
                  For further queries, feel free to contact us at:
                </Text>
                <TouchableOpacity onPress={handleEmailPress}>
                  <Text style={styles.linkText}>
                    Email: karma.consulting@gmail.com
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handlePhonePress}>
                  <Text style={styles.linkText}>
                    Phone: 84311 74477
                  </Text>
                </TouchableOpacity>
                <Text style={styles.addressText}>
                  Address: Raj Arcade, 2nd Flr, Outer Ring Rd, 1st Block, 2nd Stage,
                  Naagarabhaavi, Bengaluru, Karnataka 560091
                </Text>
              </View>
              
              <Text style={styles.footerText}>
                We're here to assist you on your journey with Dr WISE!
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
    marginBottom: 20 * scale,
  },
  faqItem: {
    marginBottom: 15 * scale,
    borderBottomWidth: 1,
    borderBottomColor: '#e6e1fc',
    paddingBottom: 10 * scale,
  },
  questionContainer: {
    width: '100%',
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  questionText: {
    fontFamily: 'Rubik',
    fontSize: 16 * scale,
    color: '#1A1B20',
    flex: 1,
    lineHeight: 20 * scale,
  },
  answerContainer: {
    marginTop: 10 * scale,
    marginLeft: 10 * scale,
  },
  answerText: {
    fontFamily: 'Rubik',
    fontSize: 14 * scale,
    color: '#333333',
    lineHeight: 18 * scale,
  },
  contactSection: {
    marginTop: 20 * scale,
  },
  contactTitle: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 18 * scale,
    fontWeight: 'bold',
    color: '#1A1B20',
    marginBottom: 10 * scale,
  },
  linkText: {
    fontFamily: 'Rubik',
    fontSize: 16 * scale,
    color: '#1E90FF',
    marginBottom: 5 * scale,
  },
  addressText: {
    fontFamily: 'Rubik',
    fontSize: 16 * scale,
    color: '#333333',
    marginBottom: 10 * scale,
  },
  footerText: {
    fontFamily: 'Rubik',
    fontSize: 12 * scale,
    color: '#555555',
    textAlign: 'center',
    marginTop: 20 * scale,
    marginBottom: 40 * scale,
    lineHeight: 18 * scale,
  },
});

export default FAQScreen;
