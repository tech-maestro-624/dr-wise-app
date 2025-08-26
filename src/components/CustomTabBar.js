import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CustomTabBar = ({ route, focused }) => {
  const getTabBarIcon = () => {
    let iconName;
    let iconColor = focused ? '#000000' : '#9CA3AF';

    if (route.name === 'Home') {
      iconName = 'home';
    } else if (route.name === 'Credits') {
      iconName = 'card-outline';
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
      iconName = 'person-outline';
    } else if (route.name === 'Profile') {
      iconName = 'person-outline';
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
});

export default CustomTabBar;
