// SectionShape.js
import React from 'react';
import { View, StyleSheet } from 'react-native';

const SectionShape = ({ color = '#DEF2EE' }) => {
  return <View style={[styles.shapeBase, { backgroundColor: color }]} />;
};

const styles = StyleSheet.create({
  shapeBase: {
    alignSelf: 'center',
    width: 30,
    height: 18,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    marginTop: 8,
  },
});

export default SectionShape;
