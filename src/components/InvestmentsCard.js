// InvestmentsCard.js
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors, spacing, radii, type } from '../theme/tokens';
import SectionShape from './SectionShape';

const items = [
  { title: 'Trading', img: require('../../assets/Icons/Stocks.png') },
  { title: 'NPS', img: require('../../assets/Icons/National Pension Scheme.png') },
  { title: 'LAS', img: require('../../assets/Icons/Loan against Security.png') },
  { title: 'Gold', img: require('../../assets/Icons/Digital Gold.png') },
  { title: 'BOND', img: require('../../assets/Icons/Fixed Deposit.png') },
  { title: 'Fixed', img: require('../../assets/Icons/Fixed Deposit.png') },
  { title: 'Mutual Fund', img: require('../../assets/Icons/Mutual Fund.png') },
];

const InvestmentsCard = () => {
  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Investments</Text>
          <Text style={styles.sub}>Explore top investment options and share them to earn with every new join.</Text>
        </View>
        <View style={styles.round}><View style={styles.arrow} /></View>
      </View>

      <View style={styles.grid}>
        {items.map((it) => (
          <View key={it.title} style={styles.tile}>
            <Text style={styles.tileText}>{it.title}</Text>
            <Image source={it.img} style={styles.tileImg} />
          </View>
        ))}
      </View>

      <SectionShape color={colors.peachBg} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.peachBg,
    borderRadius: radii.xxl,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 16,
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  title: { ...type.h2, color: colors.text },
  sub: { ...type.body, color: colors.textMuted, marginTop: spacing.xs, maxWidth: '85%' },
  round: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFD570',
    alignItems: 'center', justifyContent: 'center',
  },
  arrow: { width: 14, height: 14, borderRightWidth: 2, borderBottomWidth: 2, borderColor: '#C78800', transform: [{ rotate: '-45deg' }] },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  tile: {
    width: '31%',
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1, borderColor: colors.border,
    shadowColor: colors.shadow, shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 2,
  },
  tileText: { ...type.caption, color: colors.text, marginBottom: spacing.sm },
  tileImg: { width: 54, height: 54, resizeMode: 'contain' },
});

export default InvestmentsCard;
