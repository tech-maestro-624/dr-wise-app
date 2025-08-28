import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  Alert,
  Platform,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const scale = Math.min(screenWidth / 375, screenHeight / 812);

// Reusable component for the policy list items
const PolicyItem = ({ iconSource, text }) => (
  <View style={styles.policyItem}>
    <View style={styles.policyIconContainer}>
      <Image 
        source={iconSource}
        style={styles.policyIcon}
        resizeMode="contain"
      />
    </View>
    <Text style={styles.policyText}>{text}</Text>
    <Ionicons name="chevron-forward" size={20 * scale} color="#1A1B20" />
  </View>
);

const ProfileScreen = () => {
  const navigation = useNavigation();

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", style: "destructive", onPress: () => {
          // Navigate back to login screen
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        }}
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8638EE" />
      <LinearGradient
        colors={['#F3ECFE', '#F6F6FE']}
        locations={[0, 0.4917]}
        style={styles.background}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          
          {/* --- Header Section --- */}
          <LinearGradient
            colors={['#8638EE', '#9553F5', '#8D30FC']}
            locations={[-0.0382, 0.1464, 0.6594]}
            style={styles.header}
          >
            <View style={styles.headerNav}>
              <Text style={styles.headerTitle}>Profile</Text>
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => navigation.navigate('EditProfile')}
              >
                <Image 
                  source={require('../../assets/Icons/edit.png')}
                  style={styles.editIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            
            <View style={styles.avatarContainer}>
              <View style={styles.avatarBackground}>
                <Image 
                  source={require('../../assets/Icons/profile-avatar.png')}
                  style={styles.avatarImage} 
                />
              </View>
              <TouchableOpacity style={styles.cameraButton}>
                <Image 
                  source={require('../../assets/Icons/tabler_edit.png')}
                  style={styles.cameraIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.userName}>Punith</Text>

            <View style={styles.contactInfoCard}>
              <View style={styles.contactRow}>
                <Ionicons name="call-outline" size={24 * scale} color="#FBFBFB" />
                <Text style={styles.contactText}>9739993341</Text>
              </View>
              <View style={styles.contactRow}>
                <Ionicons name="mail-outline" size={24 * scale} color="#FBFBFB" />
                <Text style={styles.contactText}>punithpuni7892@gmail.com</Text>
              </View>
            </View>
          </LinearGradient>

          {/* --- Content Section --- */}
          <View style={styles.content}>
            {/* Subscription Status Card */}
            <TouchableOpacity style={styles.card}>
              <View style={styles.policyIconContainer}>
                <Image 
                  source={require('../../assets/Icons/subs.png')}
                  style={styles.policyIcon}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.policyText}>Subscription Status</Text>
              <Ionicons name="chevron-forward" size={20 * scale} color="#1A1B20" />
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>Policies</Text>
            <View style={styles.policiesCard}>
              <TouchableOpacity 
                style={styles.policyItem}
                onPress={() => navigation.navigate('PrivacyPolicy')}
              >
                <View style={styles.policyIconContainer}>
                  <Image 
                    source={require('../../assets/Icons/pp.png')}
                    style={styles.policyIcon}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.policyText}>Privacy Policy</Text>
                <Ionicons name="chevron-forward" size={20 * scale} color="#1A1B20" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.policyItem}
                onPress={() => navigation.navigate('TermsConditions')}
              >
                <View style={styles.policyIconContainer}>
                  <Image 
                    source={require('../../assets/Icons/termsConditions.png')}
                    style={styles.policyIcon}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.policyText}>Terms & Conditions</Text>
                <Ionicons name="chevron-forward" size={20 * scale} color="#1A1B20" />
              </TouchableOpacity>
              <PolicyItem 
                iconSource={require('../../assets/Icons/faqs.png')}
                text="FAQ's" 
              />
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 120 * scale, // Space for the bottom nav bar
  },
  header: {
    backgroundColor: '#8D30FC', // Fallback color
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 * scale : 10 * scale,
    paddingBottom: 20 * scale,
    paddingHorizontal: 20 * scale,
    borderBottomLeftRadius: 20 * scale,
    borderBottomRightRadius: 20 * scale,
    alignItems: 'center',
    height: 360 * scale,
  },
  headerNav: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10 * scale,
    height: 28 * scale,
  },
  headerTitle: {
    fontFamily: 'Rubik',
    fontSize: 24 * scale,
    fontWeight: '600',
    color: '#FBFBFB',
    lineHeight: 28 * scale,
    textAlign: 'center',
  },
  editButton: {
    position: 'absolute',
    right: 0,
    //backgroundColor: 'rgba(251, 251, 251, 0.2)',
    padding: 4 * scale,
    borderRadius: 4 * scale,
  },
  editIcon: {
    width: 26 * scale,
    height: 26 * scale,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12 * scale,
    width: 100 * scale,
    height: 98.57 * scale,
  },
  avatarBackground: {
    width: 100 * scale,
    height: 98.57 * scale,
    borderRadius: 50 * scale,
    backgroundColor: '#FBFBFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 100 * scale,
    height: 98.57 * scale,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 5 * scale,
    right: 5 * scale,
    width: 24 * scale,
    height: 24 * scale,
    borderRadius: 12 * scale,
    backgroundColor: '#FBFBFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    width: 24 * scale,
    height: 24 * scale,
  },
  userName: {
    fontFamily: 'Rubik',
    fontSize: 24 * scale,
    fontWeight: '600',
    color: '#FBFBFB',
    lineHeight: 28 * scale,
    textAlign: 'center',
    marginBottom: 20 * scale,
  },
  contactInfoCard: {
    width: '100%',
    backgroundColor: 'rgba(251, 251, 251, 0.2)',
    borderRadius: 10 * scale,
    padding: 20 * scale,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8 * scale,
  },
  contactText: {
    fontFamily: 'Rubik',
    fontSize: 14 * scale,
    fontWeight: '500',
    color: '#FBFBFB',
    marginLeft: 16 * scale,
    lineHeight: 17 * scale,
    letterSpacing: 0.2,
  },
  content: {
    paddingHorizontal: 20 * scale,
    paddingTop: 24 * scale,
  },
  card: {
    backgroundColor: '#FBFBFB',
    borderRadius: 10 * scale,
    padding: 16 * scale,
    marginBottom: 24 * scale,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    shadowColor: 'rgba(143, 49, 249, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: 'Rubik',
    fontSize: 24 * scale,
    fontWeight: '600',
    color: '#1A1B20',
    lineHeight: 28 * scale,
    marginBottom: 16 * scale,
  },
  policiesCard: {
    backgroundColor: '#FBFBFB',
    borderRadius: 10 * scale,
    padding: 7 * scale,
    marginBottom: 24 * scale,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    shadowColor: 'rgba(143, 49, 249, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 3,
  },
  policyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10 * scale,
    paddingHorizontal: 9 * scale,
  },
  policyIconContainer: {
    width: 24 * scale,
    height: 24 * scale,
    borderRadius: 4 * scale,
    backgroundColor: 'rgba(143, 49, 249, 0.0)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16 * scale,
  },
  policyIcon: {
    width: 24 * scale,
    height: 24 * scale,
  },
  policyText: {
    fontFamily: 'Rubik',
    fontSize: 14 * scale,
    fontWeight: '400',
    color: '#1A1B20',
    lineHeight: 17 * scale,
    flex: 1,
  },
  logoutButton: {
    backgroundColor: 'rgba(215, 16, 16, 0.05)',
    borderRadius: 8 * scale,
    paddingVertical: 14 * scale,
    paddingHorizontal: 16 * scale,
    alignItems: 'center',
    marginBottom: 110 * scale,
  },
  logoutButtonText: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 16 * scale,
    color: '#D71010',
    lineHeight: 19 * scale,
    letterSpacing: 0.2,
    style:'BOLD'
    
  },
});

export default ProfileScreen;