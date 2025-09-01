import React, { useState, useRef } from 'react';
import { View, PanResponder, Text, Image } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

const CircularSlider = ({ 
  size = 226, 
  strokeWidth = 20,
  minValue = 0, 
  maxValue = 1200, 
  initialValue = 0,
  onValueChange,
  step = 10
}) => {
  const [currentValue, setCurrentValue] = useState(initialValue);
  
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = (size - strokeWidth) / 2;
  
  // Convert value to angle (0-360 degrees)
  const valueToAngle = (value) => {
    // Ensure we get exactly 360 degrees when value equals maxValue
    if (value >= maxValue) {
      return 360;
    }
    return (value / maxValue) * 360;
  };
  
  // Convert angle to value
  const angleToValue = (angle) => {
    const value = (angle / 360) * maxValue;
    return Math.round(value / step) * step;
  };
  
  // Get angle from touch point
  const getAngleFromPoint = (x, y) => {
    const deltaX = x - centerX;
    const deltaY = y - centerY;
    let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    // Convert to 0-360 starting from top
    angle = (angle + 90 + 360) % 360;
    return angle;
  };
  
  const lastAngle = useRef(null);
  const isDragging = useRef(false);
  
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      const touchAngle = getAngleFromPoint(locationX, locationY);
      lastAngle.current = touchAngle;
      isDragging.current = true;
    },
    onPanResponderMove: (evt) => {
      if (!isDragging.current || !lastAngle.current) return;
      
      const { locationX, locationY } = evt.nativeEvent;
      const currentTouchAngle = getAngleFromPoint(locationX, locationY);
      const previousAngle = lastAngle.current;
      
      // Calculate the difference in angle
      let angleDiff = currentTouchAngle - previousAngle;
      
      // Handle wrap-around (going from 359° to 1° or vice versa)
      if (angleDiff > 180) {
        angleDiff -= 360;
      } else if (angleDiff < -180) {
        angleDiff += 360;
      }
      
      // Convert current value to angle, add the difference, then convert back to value
      const currentAngleFromValue = valueToAngle(currentValue);
      let newAngle = currentAngleFromValue + angleDiff;
      
      // Clamp the angle to 0-360
      newAngle = Math.max(0, Math.min(360, newAngle));
      
      // Convert back to value
      const newValue = angleToValue(newAngle);
      
      if (newValue !== currentValue && newValue >= minValue && newValue <= maxValue) {
        setCurrentValue(newValue);
        if (onValueChange) {
          onValueChange(newValue);
        }
      }
      
      // Update last angle for next iteration
      lastAngle.current = currentTouchAngle;
    },
    onPanResponderRelease: () => {
      isDragging.current = false;
      lastAngle.current = null;
    }
  });
  
  // Current angle from value
  const currentAngle = valueToAngle(currentValue);
  
  // Calculate arc path
  const startAngle = -90; // Start from top (12 o'clock)
  const endAngle = startAngle + currentAngle;
  
  const startAngleRad = (startAngle * Math.PI) / 180;
  const endAngleRad = (endAngle * Math.PI) / 180;
  
  const x1 = centerX + radius * Math.cos(startAngleRad);
  const y1 = centerY + radius * Math.sin(startAngleRad);
  const x2 = centerX + radius * Math.cos(endAngleRad);
  const y2 = centerY + radius * Math.sin(endAngleRad);
  
  const largeArcFlag = currentAngle > 180 ? 1 : 0;
  
  const pathData = currentAngle > 0 
    ? currentAngle >= 360
      ? // When angle is 360 degrees, create a complete circle using two arcs
        `M ${centerX} ${centerY - radius} A ${radius} ${radius} 0 1 1 ${centerX} ${centerY + radius} A ${radius} ${radius} 0 1 1 ${centerX} ${centerY - radius}`
      : // Normal arc path
        `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`
    : '';

  // Calculate knob position
  const knobAngleRad = (endAngle * Math.PI) / 180;
  const knobX = centerX + radius * Math.cos(knobAngleRad);
  const knobY = centerY + radius * Math.sin(knobAngleRad);

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <View {...panResponder.panHandlers} style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          <Defs>
            <LinearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#A855F7" stopOpacity="1" />
              <Stop offset="100%" stopColor="#8F31F9" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          
          {/* Background circle */}
          <Circle
            cx={centerX}
            cy={centerY}
            r={radius}
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />
          
          {/* Progress arc */}
          {pathData && (
            <Path
              d={pathData}
              stroke="url(#progressGradient)"
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
            />
          )}
        </Svg>
        
        {/* Draggable knob using PNG image */}
        <Image
          source={require('../../assets/Icons/sliderMovable.png')}
          style={{
            position: 'absolute',
            left: knobX - 20, // Center the knob (94px image scaled to 40px)
            top: knobY - 20,  // Center the knob
            width: 40,
            height: 40,
          }}
          resizeMode="contain"
        />
      </View>
      
      {/* Center content */}
      <View style={{
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        width: size * 0.6,
        height: size * 0.6,
        backgroundColor: '#FFFFFF',
        borderRadius: (size * 0.6) / 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
      }}>
        {/* Rupee icon using PNG */}
        <Image
          source={require('../../assets/Icons/rupeeIconSlider.png')}
          style={{
            width: 32,
            height: 32,
            marginBottom: 8,
          }}
          resizeMode="contain"
        />
        
        {/* Value display */}
        <Text style={{
          fontFamily: 'Rubik-SemiBold',
          fontSize: size > 200 ? 28 : 24,
          color: '#1A1B20',
          marginBottom: 4,
        }}>
          ₹{currentValue.toLocaleString()}
        </Text>
        
        {/* Label */}
        <Text style={{
          fontFamily: 'Rubik-Regular',
          fontSize: size > 200 ? 14 : 12,
          color: '#7D7D7D',
        }}>
          Your Money
        </Text>
      </View>
    </View>
  );
};

export default CircularSlider;
