/**
 * PriorityBadge Component
 *
 * Compact coloured pill that displays task priority level.
 * Colour-coded: red (high), amber (medium), green (low) for quick visual scanning.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS } from '../theme/theme';

const PriorityBadge = ({ priority, size = 'sm' }) => {
  const config = {
    high: { label: 'High', bg: COLORS.dangerLight, color: COLORS.danger, icon: 'flame' },
    medium: { label: 'Medium', bg: COLORS.warningLight, color: '#D4A017', icon: 'alert-circle' },
    low: { label: 'Low', bg: COLORS.successLight, color: COLORS.success, icon: 'leaf' },
  };

  const { label, bg, color, icon } = config[priority] || config.low;
  const isSmall = size === 'sm';

  return (
    <View style={[styles.badge, { backgroundColor: bg, paddingVertical: isSmall ? 3 : 5, paddingHorizontal: isSmall ? 8 : 12 }]}>
      <Ionicons name={icon} size={isSmall ? 10 : 13} color={color} style={styles.icon} />
      <Text style={[styles.text, { color, fontSize: isSmall ? FONT_SIZES.xs : FONT_SIZES.sm }]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.full,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 4,
  },
  text: {
    fontWeight: FONT_WEIGHTS.semibold,
  },
});

export default PriorityBadge;
