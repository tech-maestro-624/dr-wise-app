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
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { colors } from '../../theme/tokens';

export default function SelfiePhotoScreen({ navigation, route }) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState('front'); // Start with front camera for selfie
  const [flash, setFlash] = useState('off');
  const cameraRef = useRef(null);
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

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlash(current => (current === 'off' ? 'on' : 'off'));
  };

  const handleCapturePhoto = async () => {
    if (!permission) {
      // Request permission for the first time
      const { granted } = await requestPermission();
      if (!granted) {
        Alert.alert(
          'Camera Permission Required',
          'Camera access is needed to take your selfie photo. Please allow camera permission to continue.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Allow Permission', 
              onPress: () => requestPermission()
            }
          ]
        );
        return;
      }
    }

    if (!permission.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        Alert.alert(
          'Camera Permission Required',
          'Camera access is needed to take your selfie photo. Please go to Settings > Privacy & Security > Camera and enable access for this app.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Try Again', 
              onPress: () => requestPermission()
            }
          ]
        );
        return;
      }
    }

    setIsCapturing(true);
  };

  const takePicture = async () => {
    if (!cameraRef.current || isCapturing) return;

    try {
      setIsCapturing(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        skipProcessing: false,
      });

      if (photo) {
        await cropAndProcessImage(photo.uri);
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to capture photo. Please try again.');
      setIsCapturing(false);
    }
  };

  const cropAndProcessImage = async (imageUri) => {
    try {
      setIsLoading(true);
      
      // For selfie, we want a square crop focused on the center
      const manipResult = await ImageManipulator.manipulateAsync(
        imageUri,
        [
          { resize: { width: 800, height: 800 } }, // Square format for selfie
        ],
        { 
          compress: 0.8, 
          format: ImageManipulator.SaveFormat.JPEG 
        }
      );
      
      setCapturedImage(manipResult.uri);
      setIsLoading(false);
      setIsCapturing(false);
    } catch (error) {
      console.error('Error processing image:', error);
      Alert.alert('Error', 'Failed to process image. Please try again.');
      setIsLoading(false);
      setIsCapturing(false);
    }
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
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Square aspect ratio for selfie
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setIsLoading(true);
        await cropAndProcessImage(result.assets[0].uri);
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
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Full Screen Camera View */}
      <View style={styles.fullScreenCameraContainer}>
        <View style={styles.cameraHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.cameraTitle}>Selfie Photo</Text>
          <TouchableOpacity onPress={toggleFlash} style={styles.flashButton}>
            <Ionicons 
              name={flash === 'on' ? "flash" : "flash-off"} 
              size={24} 
              color="#FFFFFF" 
            />
          </TouchableOpacity>
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
                <Text style={styles.submitButtonText}>Use Photo</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.cameraViewContainer}>
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
              <CameraView
                ref={cameraRef}
                style={styles.camera}
                facing={facing}
                flash={flash}
              >
                <View style={styles.cameraOverlay}>
                  {/* Text above the camera frame */}
                  <View style={styles.instructionTextContainer}>
                    <Text style={styles.frameText}>Take your selfie</Text>
                    <Text style={styles.frameSubText}>Position your face clearly in the circle</Text>
                  </View>
                  
                  {/* Selfie frame with circle */}
                  <View style={styles.selfieFrame}>
                    <View style={styles.selfieCircle} />
                  </View>
                  
                  <View style={styles.cameraControls}>
                    <View style={styles.cameraActionButtons}>
                      <TouchableOpacity onPress={handleUpload} style={styles.galleryButton}>
                        <Ionicons name="images" size={28} color="#FFFFFF" />
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={[styles.captureButton, isCapturing && styles.disabledCaptureButton]}
                        onPress={takePicture}
                        disabled={isCapturing}
                      >
                        {isCapturing ? (
                          <ActivityIndicator size="large" color="#8B5CF6" />
                        ) : (
                          <View style={styles.captureButtonInner} />
                        )}
                      </TouchableOpacity>
                      
                      <TouchableOpacity onPress={toggleCameraFacing} style={styles.cameraSwitchButton}>
                        <Ionicons name="camera-reverse" size={28} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </CameraView>
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
    backgroundColor: '#000000',
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
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
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
  selfieCircle: {
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 4,
    borderColor: '#8B5CF6',
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
