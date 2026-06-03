/**
 * TaskCard Component
 *
 * Core UI element displaying a single task as an elevated card.
 * Shows title, module, due date, priority badge, and completion toggle.
 * Implements MarkTaskComplete / MarkTaskIncomplete via the checkbox.
 *
 * Design: clean white card with subtle shadow, rounded corners,
 * and a left-edge accent strip colour-coded by priority.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PriorityBadge from './PriorityBadge';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../theme/theme';
import { formatDate, getDaysRemaining } from '../utils/helpers';

const TaskCard = ({ task, onPress, onToggleComplete }) => {
  const { title, module, dueDate, priority, completed } = task;
  const daysInfo = getDaysRemaining(dueDate);

  // Priority accent for left border strip
  const accentColors = { high: COLORS.priorityHigh, medium: COLORS.priorityMedium, low: COLORS.priorityLow };
  const accent = accentColors[priority] || COLORS.primary;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.card, SHADOWS.card]}
    >
      {/* Left accent strip */}
      <View style={[styles.accent, { backgroundColor: accent }]} />

      <View style={styles.body}>
        {/* Top row: checkbox + title + priority */}
        <View style={styles.topRow}>
          <TouchableOpacity
            onPress={onToggleComplete}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.checkbox}
          >
            <Ionicons
              name={completed ? 'checkmark-circle' : 'ellipse-outline'}
              size={24}
              color={completed ? COLORS.success : COLORS.textTertiary}
            />
          </TouchableOpacity>

          <View style={styles.titleArea}>
            <Text
              style={[styles.title, completed && styles.completedTitle]}
              numberOfLines={2}
            >
              {title}
            </Text>
            {module ? (
              <Text style={styles.module} numberOfLines={1}>
                {module}
              </Text>
            ) : null}
          </View>

          <PriorityBadge priority={priority} />
        </View>

        {/* Bottom row: due date info */}
        <View style={styles.bottomRow}>
          <Ionicons name="calendar-outline" size={14} color={COLORS.textTertiary} />
          <Text style={[styles.date, daysInfo.isOverdue && styles.overdue, daysInfo.isToday && styles.dueToday]}>
            {formatDate(dueDate)}
          </Text>
          <View style={styles.divider} />
          <Text style={[styles.remaining, daysInfo.isOverdue && styles.overdue, daysInfo.isToday && styles.dueToday]}>
            {daysInfo.text}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  accent: {
    width: 4,
  },
  body: {
    flex: 1,
    padding: SPACING.lg,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    marginRight: SPACING.md,
    marginTop: 2,
  },
  titleArea: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: COLORS.textTertiary,
  },
  module: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.md,
    paddingLeft: 36, // align with title (checkbox width + margin)
  },
  date: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textTertiary,
    marginLeft: 4,
  },
  divider: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: COLORS.textTertiary,
    marginHorizontal: SPACING.sm,
  },
  remaining: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textTertiary,
    fontWeight: FONT_WEIGHTS.medium,
  },
  overdue: {
    color: COLORS.danger,
  },
  dueToday: {
    color: COLORS.warning,
  },
});

export default TaskCard;
