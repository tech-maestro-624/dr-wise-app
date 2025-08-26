import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii } from '../theme/tokens';

const BottomBar = () => {
  return (
    <>
      {/* iPhone Home Indicator */}
      {/* <View style={styles.homeIndicatorContainer}>
        <View style={styles.homeIndicator} />
      </View> */}
      
      <View style={styles.bar}>
        {/* Home Tab */}
        {/* <TouchableOpacity style={styles.tab} activeOpacity={0.8}>
          <Ionicons name="home" size={24} color="#1A1B20" />
          <Text style={[styles.tabText, { color: '#1A1B20' }]}>Home</Text>
        </TouchableOpacity> */}

        {/* Credits Tab */}
        <TouchableOpacity style={styles.tab} activeOpacity={0.8}>
          <Ionicons name="card-outline" size={24} color="#7D7D7D" />
          <Text style={styles.tabText}>Credits</Text>
        </TouchableOpacity>

        {/* Center Plus Button */}
        <View style={styles.centerButtonContainer}>
          <TouchableOpacity style={styles.centerButton} activeOpacity={0.8}>
            <Ionicons name="add" size={24} color="#FBFBFB" />
          </TouchableOpacity>
        </View>

        {/* My Referral Tab */}
        <TouchableOpacity style={styles.tab} activeOpacity={0.8}>
          <View style={styles.referralIconContainer}>
            <View style={styles.profileIcon}>
              <Ionicons name="person-outline" size={16} color="#7D7D7D" />
            </View>
            <View style={styles.checkmarkContainer}>
              <Ionicons name="checkmark" size={8} color="#7D7D7D" />
            </View>
          </View>
          <Text style={styles.tabText}>My Referral</Text>
        </TouchableOpacity>

        {/* Profile Tab */}
        <TouchableOpacity style={styles.tab} activeOpacity={0.8}>
          <Ionicons name="person-outline" size={24} color="#7D7D7D" />
          <Text style={styles.tabText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  homeIndicatorContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 30,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 17,
    paddingBottom: 8,
  },
  homeIndicator: {
    width: 135,
    height: 5,
    borderRadius: 100,
    backgroundColor: '#1A1B20',
  },
  bar: {
    position: 'absolute',
    width: 393,
    height: 90,
    left: '50%',
    marginLeft: -196.5, // -393/2 to center
    bottom: 0,
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingTop: 8,
    shadowColor: '#8F31F9',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 6,
    gap: 6,
  },
  tabText: {
    fontSize: 12,
    color: '#7D7D7D',
    fontWeight: '400',
  },
  centerButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  centerButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#8F31F9',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8F31F9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  referralIconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  profileIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#7D7D7D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkContainer: {
    position: 'absolute',
    bottom: -2,
    right: 2,
    width: 12,
    height: 8,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#7D7D7D',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
});

export default BottomBar;
