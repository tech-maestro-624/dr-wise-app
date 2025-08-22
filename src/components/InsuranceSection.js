import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, LayoutAnimation, UIManager, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';
import { Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

if (
  Platform.OS === 'android' &&
  UIManager.getConstants().LayoutAnimation
) {
  UIManager.setLayoutAnimationEnabled(true);
}

const InsuranceSection = () => {
  const navigation = useNavigation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const cardWidth = 100 + 10; // card width + margin
    const index = Math.round(scrollPosition / cardWidth);
    setActiveIndex(index);
  };

  const insurances = [
    { name: 'Travel', image: require('../../assets/Icons/Cancer.png') },
    { name: 'Health', image: require('../../assets/Icons/Cancer.png') },
    { name: 'Life', image: require('../../assets/Icons/Cancer.png') },
    { name: 'Motor', image: require('../../assets/Icons/Cancer.png') },
    { name: 'General', image: require('../../assets/Icons/Cancer.png') },
  ];

  const insurancesRow1 = insurances.slice(0, 3);
  const insurancesRow2 = insurances.slice(3, 5);

  return (
    <View style={styles.container}>
      <View style={styles.backgroundShape}>
        <Svg height="100%" width="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <Path
            d="M 0 10 C 0 5, 5 0, 10 0 L 90 0 C 95 0, 100 5, 100 10 L 100 80 C 100 85, 95 90, 90 90 L 60 90 L 50 100 L 40 90 L 10 90 C 5 90, 0 85, 0 80 Z"
            fill="#E0F2F1"
          />
        </Svg>
      </View>

      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Insurances</Text>
          <Text style={styles.subtitle}>Explore insurance plans tailored to your needs.</Text>
        </View>
        <TouchableOpacity style={styles.arrowButton} onPress={() => navigation.navigate('Insurances')}>
          <Ionicons name="arrow-redo-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={[styles.contentContainer, isExpanded && styles.contentContainerExpanded]}>
        {isExpanded ? (
          <View style={styles.gridContainer}>
            <View style={styles.row}>
              {insurancesRow1.map((insurance, index) => (
                <TouchableOpacity key={index} style={styles.gridItem}>
                  <Text style={styles.cardText}>{insurance.name}</Text>
                  <Image source={insurance.image} style={styles.cardIcon} />
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.row}>
              {insurancesRow2.map((insurance, index) => (
                <TouchableOpacity key={index} style={styles.gridItem}>
                  <Text style={styles.cardText}>{insurance.name}</Text>
                  <Image source={insurance.image} style={styles.cardIcon} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              snapToInterval={110}
              decelerationRate="fast"
              contentContainerStyle={styles.scrollViewContent}
            >
              {insurances.map((insurance, index) => (
                <TouchableOpacity key={index} style={styles.card}>
                  <Text style={styles.cardText}>{insurance.name}</Text>
                  <Image source={insurance.image} style={styles.cardIcon} />
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.pagination}>
              {insurances.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationIndicator,
                    index === activeIndex
                      ? styles.paginationIndicatorActive
                      : styles.paginationIndicatorInactive,
                  ]}
                />
              ))}
            </View>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.downArrowContainer} onPress={toggleExpand}>
        <Ionicons name={isExpanded ? 'chevron-up-outline' : 'chevron-down-outline'} size={24} color="#4DB6AC" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    marginTop: 20,
    marginBottom: 10,
    position: 'relative',
  },
  backgroundShape: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#004D40',
  },
  subtitle: {
    fontSize: 14,
    color: '#004D40',
    marginTop: 4,
  },
  arrowButton: {
    backgroundColor: '#4DB6AC',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    height: 150,
  },
  contentContainerExpanded: {
    height: 250,
  },
  gridContainer: {
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  gridItem: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  scrollViewContent: {
    paddingHorizontal: 15,
    paddingTop: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10, // Space between text and icon
  },
  downArrowContainer: {
    position: 'absolute',
    bottom: -15,
    left: '50%',
    marginLeft: -15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  paginationIndicator: {
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
  },
  cardIcon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  paginationIndicatorActive: {
    width: 12, // Shorter, thicker bar
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
  },
  paginationIndicatorInactive: {
    width: 4, // Smaller dot
    height: 4,
    backgroundColor: '#BDBDBD',
    borderRadius: 2,
  },
});

export default InsuranceSection;
