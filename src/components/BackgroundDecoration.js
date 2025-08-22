import React from 'react';
import { View, Image, StyleSheet, useWindowDimensions } from 'react-native';

/**
 * BackgroundDecoration
 * - Renders the common background image at a consistent, screen-relative position
 * - Defaults are tuned to match the Figma design with centered logo
 *
 * Props:
 * - topPercent: number (0..1) relative to screen height
 * - sizePercent: number -> size relative to the smaller screen dimension
 * - opacity: number (0..1)
 * - style: ViewStyle override for the wrapper
 */
const BackgroundDecoration = ({
  topPercent = 0.25,
  sizePercent = 0.75,
  opacity = 0.9,
  style,
}) => {
  const { width, height } = useWindowDimensions();
  const base = Math.min(width, height);
  const size = base * sizePercent;
  const top = height * topPercent;
  
  // Center horizontally by calculating left position
  const left = (width - size) / 2;

  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, style]}>
      <Image
        source={require('../../assets/background_image.png')}
        style={{ 
          position: 'absolute', 
          width: size, 
          height: size, 
          top, 
          left, 
          opacity 
        }}
        resizeMode="contain"
      />
    </View>
  );
};

export default BackgroundDecoration;


