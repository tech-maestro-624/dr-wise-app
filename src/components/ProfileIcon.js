// ProfileIcon.js
import React from 'react';
import Svg, { Defs, LinearGradient, Stop, Circle, Path } from 'react-native-svg';

const ProfileIcon = () => {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#C7CCD6" />
          <Stop offset="1" stopColor="#9AA3B2" />
        </LinearGradient>
      </Defs>
      <Circle cx="12" cy="8" r="4" stroke="url(#g)" strokeWidth="2" />
      <Path d="M4 20c1.8-3.5 5-5 8-5s6.2 1.5 8 5" stroke="url(#g)" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
};

export default ProfileIcon;
