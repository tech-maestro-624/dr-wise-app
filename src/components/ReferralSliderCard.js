import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: W } = Dimensions.get('window');

const ReferralSliderCard = ({ item, index }) => {
  return (
    <View style={styles.heroCard}>
      <LinearGradient
        colors={item.backgroundColor}
        style={styles.heroGradient}
      >
        <Image 
          source={require('../../assets/Icons/vectorForHero.png')}
          style={styles.heroBackgroundVector}
        />
        <View style={styles.heroContent}>
          <View style={styles.popularBadge}>
            <Text style={styles.popularText}>{item.badge}</Text>
          </View>
          <Text style={styles.heroTitle}>{item.title}</Text>
          <Text style={styles.heroSubtitle}>{item.subtitle}</Text>
          <TouchableOpacity style={styles.startButton}>
            <Text style={styles.startButtonText}>{item.buttonText}</Text>
          </TouchableOpacity>
        </View>
        <Image 
          source={{ uri: item.image }}
          style={styles.heroImage}
        />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  heroCard: {
    width: W - 40,
    height: 180,
    marginRight: 15,
    borderRadius: 16,
    overflow: 'hidden',
  },
  heroGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    position: 'relative',
  },
  heroBackgroundVector: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 120,
    height: '100%',
    opacity: 0.3,
  },
  heroContent: {
    flex: 1,
    zIndex: 2,
  },
  popularBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  popularText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 16,
    lineHeight: 20,
  },
  startButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  startButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  heroImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    zIndex: 2,
  },
});

export default ReferralSliderCard;
