import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const scale = Math.min(screenWidth / 375, screenHeight / 812);

const CategoryModal = ({ visible, onClose, category }) => {
  const navigation = useNavigation();
  
  if (!category) return null;

  const handleViewCategories = () => {
    onClose();
    navigation.navigate('Categories', { category });
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <TouchableOpacity 
        style={styles.modalOverlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <TouchableOpacity 
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Icon Section */}
          <View style={styles.iconContainer}>
            <Image 
              source={require('../../assets/Icons/viewCateg.png')} 
              style={styles.categoryIcon}
              resizeMode="contain"
            />
          </View>

          {/* Content Section */}
          <View style={styles.contentSection}>
            {/* Title */}
            <Text style={styles.categoryTitle}>{category}</Text>

            {/* Description */}
            <Text style={styles.categoryDescription}>
              Share services you trust and get paid for every referralShare services you trust and get paid for every referralShare services you trust and get paid for every referral
            </Text>
          </View>

          {/* Button */}
          <TouchableOpacity style={styles.viewCategoriesButton} onPress={handleViewCategories}>
            <Text style={styles.buttonText}>View Categories</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20 * scale,
    zIndex: 9999,
  },
  modalContainer: {
    width: 324 * scale,
    height: 638 * scale,
    backgroundColor: '#FBFBFB',
    borderRadius: 20 * scale,
    alignItems: 'center',
    paddingTop: 67 * scale,
    paddingBottom: 40 * scale,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    width: 129.29 * scale,
    height: 145.56 * scale,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 115 * scale,
  },
  categoryIcon: {
    width: '100%',
    height: '100%',
  },
  categoryTitle: {
    fontFamily: 'Rubik',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 32 * scale,
    lineHeight: 38 * scale,
    textAlign: 'center',
    color: '#1A1B20',
    marginBottom: 20 * scale,
  },
  contentSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20 * scale,
  },
  categoryDescription: {
    width: 280 * scale,
    fontFamily: 'Rubik',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14 * scale,
    lineHeight: 20 * scale,
    textAlign: 'center',
    letterSpacing: 0.2 * scale,
    color: '#7D7D7D',
    marginTop: 20 * scale,
  },
  viewCategoriesButton: {
    width: 261 * scale,
    height: 47 * scale,
    backgroundColor: '#8F31F9',
    borderRadius: 8 * scale,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14 * scale,
    paddingHorizontal: 16 * scale,
  },
  buttonText: {
    fontFamily: 'Rubik',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 16 * scale,
    lineHeight: 19 * scale,
    letterSpacing: 0.2 * scale,
    color: '#FBFBFC',
  },
});

export default CategoryModal;
