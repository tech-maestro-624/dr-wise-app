import React from 'react';
import { TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const CameraIcon = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={{
      position: 'absolute',
      bottom: 5,
      right: 5,
    }}>
      <LinearGradient
        colors={['#C391F6', '#9333EA']}
        style={{
          width: 30,
          height: 30,
          borderRadius: 15,
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 2,
          borderColor: 'white',
        }}
      >
        <Ionicons name="camera" size={16} color="white" />
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default CameraIcon;
