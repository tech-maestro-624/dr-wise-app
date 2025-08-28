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
import * as MediaLibrary from 'expo-media-library';

import { colors } from '../../theme/tokens';

export default function GovernmentIDScreen({ navigation, route }) {
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
          Alert.alert('Camera Permission Required', 'Camera access is needed to capture your government ID.');
          setIsCapturing(false);
          return;
        }
      }

      if (!permission.granted) {
        const { granted } = await requestPermission();
        if (!granted) {
          Alert.alert('Camera Permission Required', 'Camera access is needed to capture your government ID.');
          setIsCapturing(false);
          return;
        }
      }

      // Use Expo's built-in camera with cropping enabled
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        console.log('Photo captured and cropped:', result.assets[0].uri);
        // Camera view not used anymore
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
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to capture photo. Please try again.');
      setIsCapturing(false);
    }
  };

  const cropAndProcessImage = async (imageUri, isFromCamera = false) => {
    try {
      setIsLoading(true);

      // First resize to manage large images
      const resizedImage = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width: 1200 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );

      if (isFromCamera && !imageUri.includes('edited')) {
        // For camera images that haven't been edited, apply smart cropping for document aspect ratio
        const { width, height } = await getImageDimensions(resizedImage.uri);
        const targetAspectRatio = 4 / 3; // Standard document aspect ratio
        let cropWidth = width;
        let cropHeight = height;

        if (width / height > targetAspectRatio) {
          // Image is wider than target ratio, crop width
          cropWidth = height * targetAspectRatio;
        } else {
          // Image is taller than target ratio, crop height
          cropHeight = width / targetAspectRatio;
        }

        const cropX = (width - cropWidth) / 2;
        const cropY = (height - cropHeight) / 2;

        const croppedImage = await ImageManipulator.manipulateAsync(
          resizedImage.uri,
          [
            {
              crop: {
                originX: cropX,
                originY: cropY,
                width: cropWidth,
                height: cropHeight,
              },
            },
          ],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        );

        setCapturedImage(croppedImage.uri);
      } else {
        // For gallery images or edited camera images, just resize and compress
        const finalImage = await ImageManipulator.manipulateAsync(
          resizedImage.uri,
          [],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        );

        setCapturedImage(finalImage.uri);
      }

      setIsCapturing(false);
      setIsLoading(false);

      // Start fade in animation when image is processed
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

    } catch (error) {
      console.error('Error processing image:', error);
      Alert.alert('Error', 'Failed to process image. Please try again.');
      setIsCapturing(false);
      setIsLoading(false);
    }
  };

  const getImageDimensions = (uri) => {
    return new Promise((resolve) => {
      Image.getSize(uri, (width, height) => {
        resolve({ width, height });
      }, () => {
        resolve({ width: 800, height: 600 }); // fallback
      });
    });
  };

  const handleSubmit = () => {
    // Get current completed steps from route params and add this step
    const currentSteps = route?.params?.currentCompletedSteps || {
      governmentId: false,
      selfiePhoto: false,
      bankDetails: false,
    };
    
    const updatedSteps = {
      ...currentSteps,
      governmentId: true
    };
    
    // Navigate back with completion status and all completed steps
    navigation.navigate('Verification', { 
      completedStep: 'governmentId',
      completedSteps: updatedSteps
    });
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setImageLoaded(false);
    fadeAnim.setValue(0); // Reset animation
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
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setIsLoading(true);
        await cropAndProcessImage(result.assets[0].uri, false); // false indicates it's from gallery
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      
      {/* Full Screen Camera View */}
      <View style={styles.captureScreenContainer}>
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Government ID</Text>
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
                  // Image is already cropped from launchCameraAsync, proceed directly
                  const existingCompleted = route.params?.completedSteps || [];
                  const updatedCompleted = [...existingCompleted];
                  if (!updatedCompleted.includes('governmentId')) {
                    updatedCompleted.push('governmentId');
                  }
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
                  We need access to your camera to capture your government ID. This is required for identity verification.
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
                  <Text style={styles.instructionsTitle}>Take Government ID Photo</Text>
                  <Text style={styles.instructionsText}>
                    Make sure all 4 corners of your ID card are visible and the text is clear
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
                        <Text style={styles.cameraCaptureText}>Take Photo</Text>
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
  captureScreenContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
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
    paddingHorizontal: 15,
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#8B5CF6',
    borderRadius: 25,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },


});
