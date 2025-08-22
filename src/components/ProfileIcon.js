import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop, Path } from 'react-native-svg';

const ProfileIcon = () => {
  return (
    <View style={{ width: 100, height: 100, alignItems: 'center', justifyContent: 'center' }}>
      <Svg height="100" width="100" viewBox="0 0 100 100">
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#C391F6" stopOpacity="1" />
            <Stop offset="100%" stopColor="#9333EA" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Circle cx="50" cy="50" r="50" fill="white" />
        <Circle cx="50" cy="38" r="12" fill="url(#grad)" />
        <Path
          d="M50 55 C 35 55, 30 70, 30 70 L 70 70 C 70 70, 65 55, 50 55 Z"
          fill="url(#grad)"
        />
      </Svg>
    </View>
  );
};

export default ProfileIcon;
