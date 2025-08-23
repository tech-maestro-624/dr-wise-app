// CategoryTile.js
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors, radii, spacing, type } from '../theme/tokens';

const CategoryTile = ({ title, source }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Image source={source} style={styles.img} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 100,
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    marginBottom: spacing.md,
    marginHorizontal: spacing.xs,
  },
  title: { ...type.caption, color: colors.text, marginBottom: spacing.sm },
  img: { width: 54, height: 54, resizeMode: 'contain' },
});

export default CategoryTile;
