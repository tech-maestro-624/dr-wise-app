import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CustomTabBar = ({ route, focused }) => {
  const getTabBarIcon = () => {
    let iconName;
    let iconColor = focused ? '#1A1B20' : '#7D7D7D';

    if (route.name === 'Home') {
      iconName = 'home';
    } else if (route.name === 'Credits') {
      iconName = focused ? 'card' : 'card-outline'; // Filled when active, outline when inactive
    } else if (route.name === 'Referral') {
      // Center plus button
      return (
        <View style={styles.centerButtonContainer}>
          <View style={styles.centerButton}>
            <Ionicons name="add" size={28} color="#FFFFFF" />
          </View>
        </View>
      );
    } else if (route.name === 'My Referral') {
      // Special handling for My Referral tab - no circular background
      return (
        <View style={styles.iconContainer}>
          <Image 
            source={focused 
              ? require('../../assets/Icons/myReferralfiled.png') 
              : require('../../assets/Icons/myReferral.png')
            } 
            style={styles.customIcon}
            resizeMode="contain"
          />
        </View>
      );
    } else if (route.name === 'Profile') {
      // Special handling for Profile tab - no circular background
      return (
        <View style={styles.iconContainer}>
          <Image 
            source={focused 
              ? require('../../assets/Icons/profileFilled.png') 
              : require('../../assets/Icons/profile.png')
            } 
            style={styles.customIcon}
            resizeMode="contain"
          />
        </View>
      );
    }

    return <Ionicons name={iconName} size={24} color={iconColor} />;
  };

  return getTabBarIcon();
};

const styles = StyleSheet.create({
  centerButtonContainer: {
    top: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBackground: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  iconBackgroundActive: {
    backgroundColor: '#F6F6FE', // Light grey circular background
    borderWidth: 1,
    borderColor: '#E0E0E0', // Light grey border
  },
  customIcon: {
    width: 20,
    height: 20,
  },
  customIconActive: {
    tintColor: '#1A1B20', // Black for active state
  },
});

export default CustomTabBar;
