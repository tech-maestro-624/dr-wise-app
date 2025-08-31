import React, { useState, useEffect, useCallback } from 'react';
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
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { useAuth } from '../context/AuthContext';
// import { authService, userService, affiliateService } from '../services/apiService';
import { getUserData } from '../api/auth';
import { updateUser } from '../api/user';
import { getAffiliates } from '../api/affiliate';
import { customerLogout } from '../api/auth';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const scale = Math.min(screenWidth / 375, screenHeight / 812);

// Reusable component for the policy list items
const PolicyItem = ({ iconSource, text, onPress }) => (
  <TouchableOpacity style={styles.policyItem} onPress={onPress}>
    <View style={styles.policyIconContainer}>
      <Image 
        source={iconSource}
        style={styles.policyIcon}
        resizeMode="contain"
      />
    </View>
    <Text style={styles.policyText}>{text}</Text>
    <Ionicons name="chevron-forward" size={20 * scale} color="#1A1B20" />
  </TouchableOpacity>
);

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { user: authUser, logout } = useAuth();

  // State for user data
  const [user, setUser] = useState(null);
  const [referredUsers, setReferredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePickerModalVisible, setImagePickerModalVisible] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  // Fetch user data from backend
  const fetchUserData = async () => {
    setLoading(true);
    try {
      const response = await getUserData();

      if (response && response.data && response.data.user) {
        const userData = response.data.user;
        setUser(userData);

        // Handle profile image
        if (userData.image && !userData.image.startsWith('data:')) {
          const imageUri = `data:image/jpeg;base64,${userData.image}`;
          setProfileImage(imageUri);
        } else {
          setProfileImage(userData.image);
        }

        // Fetch referred users if user has ID
        if (userData && userData._id) {
          try {
            const affiliatesResponse = await getAffiliates({
              referredBy: userData._id
            });

            if (affiliatesResponse && affiliatesResponse.data) {
              setReferredUsers(affiliatesResponse.data || []);
            }
          } catch (affiliateError) {
            console.error('Error fetching affiliates:', affiliateError);
            // Don't fail the whole function if affiliate fetch fails
          }
        }

        console.log('User data fetched:', userData);
      } else {
        console.error('Invalid response format for user data');
        Alert.alert('Error', 'Failed to load user data. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      const errorMessage = error?.response?.data?.message || error.message || 'Failed to load user data';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Request permissions when component mounts
  useEffect(() => {
    const requestInitialPermissions = async () => {
      // Request camera permission if not already granted
      if (permission && !permission.granted) {
        await requestPermission();
      }
      
      // Pre-request gallery permission for smoother experience
      try {
        await ImagePicker.getMediaLibraryPermissionsAsync();
      } catch (error) {
        console.log('Gallery permission check failed:', error);
      }
    };

    requestInitialPermissions();
  }, [permission]);

  // Initial fetch
  useEffect(() => {
    fetchUserData();
  }, []);

  // Re-fetch on focus
  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [])
  );

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", style: "destructive", onPress: async () => {
          try {
            setLoading(true);
            const logoutResponse = await customerLogout();
            if (logoutResponse && logoutResponse.status === 200) {
              console.log('Server logout successful');
            }
            await logout();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          } catch (error) {
            console.error('Logout error:', error);
            const errorMessage = error?.response?.data?.message || error.message || 'Logout failed, but proceeding with local logout';
            console.warn(errorMessage);
            // Still logout locally even if API call fails
            await logout();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          } finally {
            setLoading(false);
          }
        }}
      ]
    );
  };

  // Show modal for image picker options
  const showImagePickerModal = () => {
    setImagePickerModalVisible(true);
  };

  // Handle picking from camera or gallery
  const handleImagePicker = async (source) => {
    try {
      let result;
      
      if (source === 'camera') {
        // Request Camera Permission
        if (!permission) {
          const { granted } = await requestPermission();
          if (!granted) {
            Alert.alert('Camera Permission Required', 'Camera access is needed to take a photo.');
            return;
          }
        }

        if (!permission.granted) {
          const { granted } = await requestPermission();
          if (!granted) {
            Alert.alert('Camera Permission Required', 'Camera access is needed to take a photo.');
            return;
          }
        }

        // Open camera
        result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [1, 1], // Square aspect ratio for profile
          quality: 0.8,
          base64: true,
        });
      } else if (source === 'gallery') {
        // Request Media Library Permission
        let { status } = await ImagePicker.getMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
          const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (permission.status !== 'granted') {
            Alert.alert(
              'Gallery Permission Required',
              'Gallery access is needed to select photos from your device.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Try Again',
                  onPress: () => handleImagePicker('gallery')
                }
              ]
            );
            return;
          }
          status = permission.status;
        }

        // Open image library
        result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: [1, 1], // Square aspect ratio for profile
          quality: 0.8,
          base64: true,
        });
      }

      // If user cancels
      if (result.canceled) {
        setImagePickerModalVisible(false);
        return;
      }

      // Check that we have an array of assets and the first one has base64
      if (result.assets && result.assets.length > 0 && result.assets[0].base64) {
        await updateProfileImage(result.assets[0].base64);
      } else {
        throw new Error('Image selection failed. Please try again.');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Image selection failed. Please try again.');
    } finally {
      setImagePickerModalVisible(false);
    }
  };

  // Update Profile Image
  const updateProfileImage = async (base64Image) => {
    try {
      setImageLoading(true);

      // Update user profile with new image
      const response = await updateUser(user._id, { image: base64Image });

      if (response && response.status === 200) {
        // Update local state
        const updatedImage = `data:image/jpeg;base64,${base64Image}`;
        setProfileImage(updatedImage);

        // Update user state
        setUser(prevUser => ({
          ...prevUser,
          image: base64Image
        }));

        Alert.alert('Success', 'Profile image updated successfully!');

        // Refresh user data
        await fetchUserData();
      } else {
        const errorMessage = response?.data?.message || 'Failed to update profile image.';
        Alert.alert('Error', errorMessage);
      }
    } catch (error) {
      console.error('Error updating profile image:', error);
      const errorMessage = error?.response?.data?.message || error.message || 'Failed to update profile image. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setImageLoading(false);
    }
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
                onPress={() => navigation.navigate('EditProfile', { userData: user || authUser })}
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
                {loading ? (
                  <ActivityIndicator size="large" color="#8F31F9" />
                ) : profileImage ? (
                  <Image 
                    source={{ uri: profileImage }}
                    style={styles.avatarImage}
                    resizeMode="cover"
                  />
                ) : (
                  <Image 
                    source={require('../../assets/Icons/profile-avatar.png')}
                    style={styles.avatarImage} 
                  />
                )}
              </View>
              <TouchableOpacity 
                style={styles.cameraButton}
                onPress={showImagePickerModal}
                disabled={imageLoading}
              >
                {imageLoading ? (
                  <ActivityIndicator size="small" color="#8F31F9" />
                ) : (
                  <Image 
                    source={require('../../assets/Icons/tabler_edit.png')}
                    style={styles.cameraIcon}
                    resizeMode="contain"
                  />
                )}
              </TouchableOpacity>
            </View>

            <Text style={styles.userName}>
              {loading ? 'Loading...' : (user?.name || authUser?.name || 'User')}
            </Text>

            <View style={styles.contactInfoCard}>
              <View style={styles.contactRow}>
                <Ionicons name="call-outline" size={24 * scale} color="#FBFBFB" />
                <Text style={styles.contactText}>
                  {user?.phoneNumber || authUser?.phoneNumber || 'No phone'}
                </Text>
              </View>
              <View style={styles.contactRow}>
                <Ionicons name="mail-outline" size={24 * scale} color="#FBFBFB" />
                <Text style={styles.contactText}>
                  {user?.email || authUser?.email || 'No email'}
                </Text>
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
                onPress={() => navigation.navigate('FAQ')}
              />
            </View>

            <TouchableOpacity 
              style={[styles.logoutButton, loading && styles.logoutButtonDisabled]} 
              onPress={handleLogout}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.logoutButtonText}>Logout</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>

      {/* Image Picker Modal */}
      <Modal
        visible={imagePickerModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setImagePickerModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Update Profile Photo</Text>
              <TouchableOpacity 
                onPress={() => setImagePickerModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#1A1B20" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalOptions}>
              <TouchableOpacity 
                style={styles.modalOption}
                onPress={() => handleImagePicker('camera')}
              >
                <Ionicons name="camera" size={32} color="#8F31F9" />
                <Text style={styles.modalOptionText}>Take Photo</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalOption}
                onPress={() => handleImagePicker('gallery')}
              >
                <Ionicons name="images" size={32} color="#8F31F9" />
                <Text style={styles.modalOptionText}>Choose from Gallery</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  logoutButtonDisabled: {
    backgroundColor: 'rgba(215, 16, 16, 0.02)',
  },
  logoutButtonText: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 16 * scale,
    color: '#D71010',
    lineHeight: 19 * scale,
    letterSpacing: 0.2,
    fontWeight: '600',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20 * scale,
    borderTopRightRadius: 20 * scale,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20 * scale,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20 * scale,
    paddingVertical: 16 * scale,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 18 * scale,
    fontWeight: '600',
    color: '#1A1B20',
    fontFamily: 'Rubik-SemiBold',
  },
  closeButton: {
    padding: 4 * scale,
  },
  modalOptions: {
    paddingHorizontal: 20 * scale,
    paddingTop: 20 * scale,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16 * scale,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalOptionText: {
    fontSize: 16 * scale,
    color: '#1A1B20',
    marginLeft: 16 * scale,
    fontFamily: 'Rubik-Medium',
  },
});

export default ProfileScreen;