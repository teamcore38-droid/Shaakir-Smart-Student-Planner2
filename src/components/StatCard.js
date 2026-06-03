/**
 * StatCard Component
 *
 * Dashboard statistic tile showing a numeric value with label and icon.
 * Features:
 *   - Balanced modern sizing
 *   - Soft color-coded icon background matching specific status types
 *   - Elevated surface card with subtle accent borders
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../theme/theme';

const StatCard = ({ icon, label, value, color = COLORS.primary, bgColor = COLORS.primaryLight }) => {
  return (
    <View style={[styles.card, { borderTopColor: color, borderTopWidth: 3 }, SHADOWS.card]}>
      <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs + 2,
  },
  value: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '800',
    color: '#1E293B',
  },
  label: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default StatCard;
