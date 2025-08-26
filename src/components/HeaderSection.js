import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Dimensions,
  Animated,
  StyleSheet
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { filters, sliderCards } from '../constants/homeData';
import ReferralSliderCard from './ReferralSliderCard';

const { width: W } = Dimensions.get('window');

const HeaderSection = ({ active, setActive, scrollY }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);

  const onSliderViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentSlide(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  return (
    <LinearGradient
      colors={['#8638EE', '#9553F5', '#8D30FC']}
      style={styles.headerSection}
    >
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={22} color="#1A1B20" />
        <TextInput 
          placeholder="Search.." 
          placeholderTextColor="#7D7D7D" 
          style={styles.searchInput} 
        />
      </View>

      {/* Filter Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterTab,
              filter.active ? styles.filterTabActive : styles.filterTabInactive
            ]}
            onPress={() => setActive(filter.id)}
          >
            <Ionicons 
              name={filter.icon} 
              size={15} 
              color={filter.active ? '#8F31F9' : '#F6F6FE'} 
            />
            <Text style={[
              styles.filterText,
              { color: filter.active ? '#8F31F9' : '#F6F6FE' }
            ]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Hero Referral Cards Slider */}
      <View style={styles.heroSliderContainer}>
        <FlatList
          ref={sliderRef}
          data={sliderCards}
          renderItem={({ item, index }) => (
            <ReferralSliderCard item={item} index={index} />
          )}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          pagingEnabled={false}
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onSliderViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          contentContainerStyle={styles.sliderContent}
          snapToInterval={W - 20}
          snapToAlignment="start"
          decelerationRate="fast"
          scrollEventThrottle={16}
          bounces={false}
        />
      </View>

      {/* Page Dots */}
      <View style={styles.pageDots}>
        {sliderCards.map((_, index) => (
          <View
            key={index}
            style={[
              styles.pageDot,
              { opacity: currentSlide === index ? 1 : 0.3 }
            ]}
          />
        ))}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  headerSection: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1A1B20',
    marginLeft: 12,
  },
  filterContainer: {
    marginBottom: 20,
  },
  filterContent: {
    paddingRight: 20,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  filterTabActive: {
    backgroundColor: '#FFFFFF',
  },
  filterTabInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  heroSliderContainer: {
    marginBottom: 20,
  },
  sliderContent: {
    paddingRight: 20,
  },
  pageDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  pageDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 4,
  },
});

export default HeaderSection;
