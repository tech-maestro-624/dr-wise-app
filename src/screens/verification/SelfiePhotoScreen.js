import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar,
  Image,
  ActivityIndicator,
  Animated,
  Alert,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { colors } from '../../theme/tokens';
import { storeSelfieFile } from '../../api/verification';

export default function SelfiePhotoScreen({ navigation, route }) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const fadeAnim = useState(new Animated.Value(0))[0];

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

  const takePicture = async () => {
    try {
      setIsCapturing(true);

      // Request camera permission if needed
      if (!permission) {
        const { granted } = await requestPermission();
        if (!granted) {
          Alert.alert('Camera Permission Required', 'Camera access is needed to take your selfie photo.');
          setIsCapturing(false);
          return;
        }
      }

      if (!permission.granted) {
        const { granted } = await requestPermission();
        if (!granted) {
          Alert.alert('Camera Permission Required', 'Camera access is needed to take your selfie photo.');
          setIsCapturing(false);
          return;
        }
      }

      // Use Expo's built-in camera with cropping enabled - FRONT CAMERA for selfies
      console.log('Opening camera for selfie...');

      // Check if front camera is available
      try {
        const result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [1, 1], // Square aspect ratio for selfies
          quality: 0.8,
          base64: false,
          exif: false,
          // Try multiple ways to specify front camera
          cameraType: ImagePicker.CameraType?.FRONT || 'front',
        });
        console.log('Camera result:', result);

        if (!result.canceled && result.assets[0]) {
          console.log('Selfie captured and cropped:', result.assets[0].uri);
          setCapturedImage(result.assets[0].uri);
          setIsCapturing(false);

          // Start fade in animation
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }).start();
        } else {
          setIsCapturing(false);
        }
      } catch (error) {
        console.error('Camera error:', error);
        // Fallback: Try without specifying camera type
        console.log('Trying fallback camera...');
        try {
          const fallbackResult = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
            base64: false,
            exif: false,
          });

          if (!fallbackResult.canceled && fallbackResult.assets[0]) {
            console.log('Fallback selfie captured:', fallbackResult.assets[0].uri);
            setCapturedImage(fallbackResult.assets[0].uri);
          }
          setIsCapturing(false);
        } catch (fallbackError) {
          console.error('Fallback camera also failed:', fallbackError);
          Alert.alert('Camera Error', 'Unable to open camera. Please check permissions.');
          setIsCapturing(false);
        }
      }
    } catch (error) {
      console.error('Error taking selfie:', error);
      Alert.alert('Error', 'Failed to take selfie. Please try again.');
      setIsCapturing(false);
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleUpload = async () => {
    try {
      // Request media library permission first
      let { status } = await ImagePicker.getMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permission.status !== 'granted') {
          Alert.alert(
            'Gallery Permission Required',
            'Gallery access is needed to select photos from your device. Please go to Settings > Privacy & Security > Photos and enable access for this app.',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Try Again',
                onPress: () => handleUpload()
              }
            ]
          );
          return;
        }
        status = permission.status;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1], // Square aspect ratio for selfie
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setIsLoading(true);
        // For gallery images, they're already cropped by the picker
        // Just process and display
        await processGalleryImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const processGalleryImage = async (imageUri) => {
    try {
      // For gallery images (already cropped), just resize and compress
      const processedImage = await ImageManipulator.manipulateAsync(
        imageUri,
        [
          { resize: { width: 400, height: 400 } }
        ],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );

      setCapturedImage(processedImage.uri);
      setIsLoading(false);
    } catch (error) {
      console.error('Error processing gallery image:', error);
      Alert.alert('Error', 'Failed to process image. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Clean Capture Interface */}
      <View style={styles.captureScreenContainer}>
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Selfie Photo</Text>
          <View style={styles.headerSpacer} />
        </View>
        
        {/* Camera View or Captured Image */}
        {capturedImage ? (
          <View style={styles.capturedImageContainer}>
            <Animated.Image
              source={{ uri: capturedImage }}
              style={[
                styles.capturedImage,
                { opacity: imageLoaded ? fadeAnim : 0 }
              ]}
              onLoad={handleImageLoad}
              resizeMode="contain"
            />

            {/* Action buttons for captured image */}
            <View style={styles.capturedImageActions}>
              <TouchableOpacity
                style={styles.retakeButton}
                onPress={() => setCapturedImage(null)}
              >
                <Ionicons name="camera" size={24} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Retake</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => {
                  // Store the selfie file data for later use in registration
                  if (capturedImage) {
                    const fileData = {
                      uri: capturedImage,
                      type: 'image/jpeg',
                      fileName: 'selfie.jpg'
                    };
                    storeSelfieFile(fileData);
                  }

                  // Get existing completed steps and add current one
                  const existingCompleted = route.params?.completedSteps || [];
                  const updatedCompleted = [...existingCompleted];
                  if (!updatedCompleted.includes('selfiePhoto')) {
                    updatedCompleted.push('selfiePhoto');
                  }

                  // Navigate back with updated completion status
                  navigation.navigate('Verification', { completedSteps: updatedCompleted });
                }}
              >
                <Ionicons name="checkmark" size={24} color="#FFFFFF" />
                <Text style={styles.submitButtonText}>Use Photo</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.captureScreenContainer}>
            {!permission ? (
              <View style={styles.permissionContainer}>
                <ActivityIndicator size="large" color="#8B5CF6" />
                <Text style={styles.permissionText}>Requesting camera permission...</Text>
              </View>
            ) : !permission.granted ? (
              <View style={styles.permissionContainer}>
                <Ionicons name="camera-off" size={64} color="#7D7D7D" />
                <Text style={styles.permissionTitle}>Camera Access Required</Text>
                <Text style={styles.permissionText}>
                  We need access to your camera to take your selfie photo. This is required for identity verification.
                </Text>
                <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
                  <Ionicons name="camera" size={20} color="#FFFFFF" style={styles.permissionButtonIcon} />
                  <Text style={styles.permissionButtonText}>Allow Camera Access</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.captureInterface}>
                {/* Instructions */}
                <View style={styles.instructionsContainer}>
                  <Ionicons name="camera" size={64} color="#8B5CF6" />
                  <Text style={styles.instructionsTitle}>Take Your Selfie</Text>
                  <Text style={styles.instructionsText}>
                    Make sure your face is clearly visible and well-lit for identity verification
                  </Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.captureActions}>
                  <TouchableOpacity
                    style={styles.uploadButton}
                    onPress={handleUpload}
                  >
                    <Ionicons name="images" size={24} color="#8B5CF6" />
                    <Text style={styles.uploadButtonText}>Upload from Gallery</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.cameraCaptureButton, isCapturing && styles.disabledCaptureButton]}
                    onPress={takePicture}
                    disabled={isCapturing}
                  >
                    {isCapturing ? (
                      <ActivityIndicator size="large" color="#FFFFFF" />
                    ) : (
                      <>
                        <Ionicons name="camera" size={32} color="#FFFFFF" />
                        <Text style={styles.cameraCaptureText}>Take Selfie</Text>
                        <Text style={styles.cameraCaptureSubtext}>Front Camera (Auto)</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  captureScreenContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  headerSpacer: {
    width: 40,
  },
  captureInterface: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  instructionsContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  instructionsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  instructionsText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
  captureActions: {
    width: '100%',
    alignItems: 'center',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B5CF6',
    marginLeft: 12,
  },
  cameraCaptureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 32,
    paddingVertical: 20,
    borderRadius: 16,
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  cameraCaptureText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  cameraCaptureSubtext: {
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 12,
  },
  capturedImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  capturedImage: {
    width: '90%',
    height: '70%',
    borderRadius: 12,
  },
  capturedImageActions: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#8B5CF6',
    borderRadius: 25,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  fullScreenCameraContainer: {
    flex: 1,
  },
  cameraHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 1000,
  },
  closeButton: {
    padding: 8,
  },
  cameraTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  flashButton: {
    padding: 8,
  },
  cameraViewContainer: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingBottom: 40,
  },
  instructionTextContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  selfieFrame: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 40,
    marginVertical: 40,
  },
  overlayBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '30%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlayBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlayMiddle: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '40%',
    width: '100%',
  },
  overlayLeft: {
    flex: 1,
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlayRight: {
    flex: 1,
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  selfieCircle: {
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 3,
    borderColor: '#8B5CF6',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  selfieCircleInner: {
    width: 270,
    height: 270,
    borderRadius: 135,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    backgroundColor: 'transparent',
  },
  frameText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  frameSubText: {
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: 20,
  },
  cameraControls: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  cameraActionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 60,
    width: '100%',
  },
  galleryButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  disabledCaptureButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
  },
  cameraSwitchButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    paddingHorizontal: 30,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    color: '#CCCCCC',
    marginTop: 12,
    textAlign: 'center',
    lineHeight: 22,
  },
  permissionButton: {
    marginTop: 30,
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: '#8B5CF6',
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
  },
  permissionButtonIcon: {
    marginRight: 8,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  capturedImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  circularImageContainer: {
    width: 320,
    height: 320,
    borderRadius: 160,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: '#8B5CF6',
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 15,
  },
  capturedCircularImage: {
    width: '100%',
    height: '100%',
  },
  capturedImage: {
    width: '90%',
    height: '70%',
    borderRadius: 12,
  },
  capturedImageActions: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  submitButton: {
    paddingHorizontal: 40,
    paddingVertical: 15,
    backgroundColor: '#8B5CF6',
    borderRadius: 25,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
