// InsurancesCard.js
import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions, Image } from 'react-native';
import { colors, spacing, radii, type } from '../theme/tokens';
import SectionShape from './SectionShape';

const W = Dimensions.get('window').width;
const PAD = 20;

const InsurancesCard = () => {
  const [expanded, setExpanded] = useState(false);
  const x = useRef(new Animated.Value(0)).current;

  const items = [
    { title: 'Life', img: require('../../assets/Icons/Whole Life.png') },
    { title: 'Health', img: require('../../assets/Icons/Group Health.png') },
    { title: 'Motor', img: require('../../assets/Icons/Motor.png') },
    { title: 'General', img: require('../../assets/Icons/Commercial.png') },
    { title: 'Travel', img: require('../../assets/Icons/Travel.png') },
  ];

  const page = x.interpolate({
    inputRange: [0, 112, 224],
    outputRange: [0, 1, 2],
  });

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Insurences</Text>
          <Text style={styles.sub}>Explore insurance plans tailored to your needs.</Text>
        </View>
        <TouchableOpacity activeOpacity={0.9} style={styles.round}>
          <View style={styles.arrow} />
        </TouchableOpacity>
      </View>

      {expanded ? (
        <View style={styles.grid}>
          <View style={styles.row}>
            {items.slice(0, 3).map((it) => (
              <Tile key={it.title} title={it.title} img={it.img} />
            ))}
          </View>
          <View style={styles.row}>
            {items.slice(3).map((it) => (
              <Tile key={it.title} title={it.title} img={it.img} />
            ))}
          </View>
        </View>
      ) : (
        <>
          <Animated.ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hList}
            snapToInterval={112}
            decelerationRate="fast"
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { x } } }], { useNativeDriver: false })}
            scrollEventThrottle={16}
          >
            {items.map((it) => (
              <Tile key={it.title} title={it.title} img={it.img} />
            ))}
          </Animated.ScrollView>

          <View style={styles.dots}>
            {[0, 1, 2].map((i) => {
              const w = page.interpolate({
                inputRange: [i - 0.5, i, i + 0.5],
                outputRange: [4, 16, 4],
                extrapolate: 'clamp',
              });
              return <Animated.View key={i} style={[styles.dot, { width: w }]} />;
            })}
          </View>
        </>
      )}

      <TouchableOpacity onPress={() => setExpanded((v) => !v)} activeOpacity={0.9} style={styles.handle}>
        <View style={styles.chev} />
      </TouchableOpacity>

      <SectionShape color={colors.mintBg} />
    </View>
  );
};

const Tile = ({ title, img }) => {
  return (
    <View style={styles.tile}>
      <Text style={styles.tileText}>{title}</Text>
      <Image source={img} style={styles.tileImg} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.mintBg,
    borderRadius: radii.xxl,
    padding: PAD,
    marginHorizontal: 20,
    marginTop: 16,
    shadowColor: colors.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  title: { ...type.h2, color: colors.text },
  sub: { ...type.body, color: colors.textMuted, marginTop: spacing.xs },
  round: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.white,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.shadow, shadowOpacity: 0.12, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 3,
  },
  arrow: {
    width: 14, height: 14, borderRightWidth: 2, borderBottomWidth: 2, borderColor: colors.mintAccent,
    transform: [{ rotate: '-45deg' }],
  },
  hList: { paddingHorizontal: 2 },
  tile: {
    width: 100, height: 100, marginRight: 12,
    backgroundColor: colors.white, borderRadius: radii.lg, padding: spacing.md,
    borderWidth: 1, borderColor: colors.border,
    shadowColor: colors.shadow, shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 2,
  },
  tileText: { ...type.caption, color: colors.text, marginBottom: spacing.sm },
  tileImg: { width: 54, height: 54, resizeMode: 'contain' },
  dots: { flexDirection: 'row', alignSelf: 'center', marginTop: spacing.md, gap: 6 },
  dot: { height: 4, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 2, marginHorizontal: 3 },
  handle: { alignSelf: 'center', marginTop: spacing.md, width: 26, height: 26, alignItems: 'center', justifyContent: 'center' },
  chev: { width: 16, height: 16, borderLeftWidth: 2, borderBottomWidth: 2, borderColor: 'rgba(0,0,0,0.25)', transform: [{ rotate: '-45deg' }] },
  grid: { paddingHorizontal: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
});

export default InsurancesCard;
