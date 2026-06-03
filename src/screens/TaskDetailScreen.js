/**
 * TaskDetailScreen
 *
 * Detailed view for a single task.
 * Features:
 *   - Curved branding background decoration
 *   - Soft status and priority badge displays
 *   - Redesigned, detailed data rows with outlines and spacing
 *   - Polished notes card and primary/secondary button containers
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Dimensions, StatusBar, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTasks } from '../context/TaskContext';
import PriorityBadge from '../components/PriorityBadge';
import CustomButton from '../components/CustomButton';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../theme/theme';
import { formatDate, getDaysRemaining } from '../utils/helpers';

const { width } = Dimensions.get('window');

const TaskDetailScreen = ({ route, navigation }) => {
  const { taskId } = route.params;
  const { getTaskById, deleteTask, toggleTaskComplete } = useTasks();

  const task = getTaskById(taskId);

  if (!task) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={54} color={COLORS.danger} />
        <Text style={styles.errorText}>Task not found</Text>
        <CustomButton title="Go Back" onPress={() => navigation.goBack()} variant="secondary" fullWidth={false} />
      </View>
    );
  }

  const daysInfo = getDaysRemaining(task.dueDate);

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      `Are you sure you want to delete "${task.title}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteTask(taskId);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleToggle = async () => {
    await toggleTaskComplete(taskId);
  };

  // Redesigned Detail Row
  const DetailRow = ({ icon, label, value, valueColor, iconColor = '#0A60FF' }) => (
    <View style={styles.detailRow}>
      <View style={styles.detailLabel}>
        <View style={[styles.detailIconContainer, { backgroundColor: iconColor + '10' }]}>
          <Ionicons name={icon} size={18} color={iconColor} />
        </View>
        <Text style={styles.detailLabelText}>{label}</Text>
      </View>
      <Text style={[styles.detailValue, valueColor && { color: valueColor }]}>{value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      {/* Background decoration */}
      <View style={styles.backgroundWave} />

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* Status + Priority Header Badges */}
        <View style={styles.statusRow}>
          <View style={[styles.statusBadge, { backgroundColor: task.completed ? '#EAFDF4' : '#EBF1FC' }]}>
            <Ionicons
              name={task.completed ? 'checkmark-circle' : 'time'}
              size={16}
              color={task.completed ? '#10B981' : '#0A60FF'}
            />
            <Text style={[styles.statusText, { color: task.completed ? '#10B981' : '#0A60FF' }]}>
              {task.completed ? 'Completed' : 'In Progress'}
            </Text>
          </View>
          <PriorityBadge priority={task.priority} size="md" />
        </View>

        {/* Task Title */}
        <Text style={[styles.title, task.completed && styles.completedTitle]}>{task.title}</Text>

        {/* Redesigned Card List */}
        <View style={[styles.detailCard, styles.cardShadow]}>
          <DetailRow icon="school-outline" label="Module" value={task.module} iconColor="#8B5CF6" />
          <View style={styles.separator} />
          
          <DetailRow
            icon="calendar-outline"
            label="Due Date"
            value={formatDate(task.dueDate)}
            valueColor={daysInfo.isOverdue ? COLORS.danger : '#1E293B'}
            iconColor="#0A60FF"
          />
          <View style={styles.separator} />
          
          <DetailRow
            icon="hourglass-outline"
            label="Time Left"
            value={daysInfo.text}
            valueColor={daysInfo.isOverdue ? COLORS.danger : daysInfo.isToday ? COLORS.warning : '#475569'}
            iconColor={daysInfo.isOverdue ? COLORS.danger : '#10B981'}
          />
          <View style={styles.separator} />
          
          <DetailRow icon="time-outline" label="Created" value={formatDate(task.createdAt)} iconColor="#64748B" />
          {task.updatedAt !== task.createdAt && (
            <>
              <View style={styles.separator} />
              <DetailRow icon="refresh-outline" label="Updated" value={formatDate(task.updatedAt)} iconColor="#64748B" />
            </>
          )}
        </View>

        {/* Notes Container */}
        {task.notes ? (
          <View style={[styles.notesCard, styles.cardShadow]}>
            <View style={styles.notesHeader}>
              <Ionicons name="document-text-outline" size={18} color="#0A60FF" />
              <Text style={styles.notesTitle}>Notes</Text>
            </View>
            <Text style={styles.notesText}>{task.notes}</Text>
          </View>
        ) : null}

        {/* Action Controls */}
        <View style={styles.actions}>
          <CustomButton
            title={task.completed ? 'Mark Incomplete' : 'Mark Complete'}
            onPress={handleToggle}
            variant={task.completed ? 'outline' : 'primary'}
            icon={task.completed ? 'close-circle-outline' : 'checkmark-circle-outline'}
            style={task.completed ? styles.completeToggleOutline : styles.completeToggleBtn}
            size="lg"
          />
          
          <View style={styles.actionRow}>
            <CustomButton
              title="Edit"
              onPress={() => navigation.navigate('EditTask', { taskId })}
              variant="secondary"
              icon="pencil-outline"
              style={[styles.actionBtn, { marginRight: SPACING.xs }]}
              size="lg"
            />
            <CustomButton
              title="Delete"
              onPress={handleDelete}
              variant="danger"
              icon="trash-outline"
              style={[styles.actionBtn, { marginLeft: SPACING.xs }]}
              size="lg"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8FAFC' 
  },
  backgroundWave: {
    position: 'absolute',
    top: -width * 0.4,
    left: -width * 0.25,
    width: width * 1.5,
    height: width * 0.75,
    borderRadius: width * 0.75,
    backgroundColor: '#EAEFFF',
    zIndex: -1,
  },
  scrollContent: { 
    paddingHorizontal: SPACING.xl, 
    paddingTop: Platform.OS === 'ios' ? SPACING.md : SPACING.lg, 
    paddingBottom: SPACING.xxxl 
  },
  errorContainer: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: SPACING.xxl 
  },
  errorText: { 
    fontSize: FONT_SIZES.lg, 
    color: COLORS.danger, 
    marginVertical: SPACING.lg,
    fontWeight: '700' 
  },
  statusRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: SPACING.lg 
  },
  statusBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: SPACING.md, 
    paddingVertical: SPACING.xs + 1, 
    borderRadius: BORDER_RADIUS.full 
  },
  statusText: { 
    fontSize: FONT_SIZES.sm, 
    fontWeight: '700', 
    marginLeft: SPACING.xs 
  },
  title: { 
    fontSize: FONT_SIZES.xxl - 2, 
    fontWeight: '800', 
    color: '#1E293B', 
    marginBottom: SPACING.xl, 
    lineHeight: 32 
  },
  completedTitle: { 
    textDecorationLine: 'line-through', 
    color: COLORS.textTertiary 
  },
  detailCard: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 20, 
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg, 
    marginBottom: SPACING.xl 
  },
  cardShadow: {
    shadowColor: '#0A60FF',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.04,
    shadowRadius: 24,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  detailRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: SPACING.md - 2 
  },
  detailLabel: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  detailIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm + 2,
  },
  detailLabelText: { 
    fontSize: FONT_SIZES.md - 1, 
    color: '#64748B', 
    fontWeight: '600' 
  },
  detailValue: { 
    fontSize: FONT_SIZES.md - 1, 
    fontWeight: '700', 
    color: '#1E293B' 
  },
  separator: { 
    height: 1, 
    backgroundColor: '#F1F5F9', 
  },
  notesCard: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 20, 
    padding: SPACING.lg, 
    marginBottom: SPACING.xl 
  },
  notesHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: SPACING.md 
  },
  notesTitle: { 
    fontSize: FONT_SIZES.md - 1, 
    fontWeight: '700', 
    color: '#1E293B', 
    marginLeft: SPACING.sm 
  },
  notesText: { 
    fontSize: FONT_SIZES.md - 1, 
    color: '#475569', 
    lineHeight: 22,
    fontWeight: '500' 
  },
  actions: { 
    marginTop: SPACING.sm 
  },
  completeToggleBtn: {
    backgroundColor: '#0A60FF',
    borderRadius: 26,
    height: 52,
    paddingVertical: 0,
    shadowColor: '#0A60FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 4,
  },
  completeToggleOutline: {
    borderRadius: 26,
    height: 52,
    paddingVertical: 0,
    borderWidth: 1.5,
    borderColor: '#0A60FF',
  },
  actionRow: { 
    flexDirection: 'row', 
    marginTop: SPACING.md 
  },
  actionBtn: {
    flex: 1,
    height: 50,
    paddingVertical: 0,
    borderRadius: 25,
  },
});

export default TaskDetailScreen;
