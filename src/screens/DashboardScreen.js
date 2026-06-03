/**
 * DashboardScreen (Home)
 *
 * Main landing screen after login. Provides:
 *   - Personalised greeting with dynamic user avatar and date info
 *   - Clean capsule progress tracker with completion metrics
 *   - Status stats tiles (Total, Active, Done, Overdue)
 *   - Quick view of upcoming tasks
 *   - Modern Floating Action Button (FAB) to add a new task
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, StatusBar, Platform, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import StatCard from '../components/StatCard';
import TaskCard from '../components/TaskCard';
import EmptyState from '../components/EmptyState';
import SearchBar from '../components/SearchBar';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../theme/theme';

const { width } = Dimensions.get('window');

const DashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { tasks, stats, toggleTaskComplete } = useTasks();

  const [filterPriority, setFilterPriority] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [dashboardSearchQuery, setDashboardSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Filter tasks dynamically for Dashboard upcoming tasks list
  const filteredUpcomingTasks = tasks
    .filter((task) => {
      // 1. Completion filter (only show incomplete tasks)
      if (task.completed) return false;

      // 2. Name / Title Search Filter
      if (dashboardSearchQuery.trim()) {
        const queryStr = dashboardSearchQuery.toLowerCase();
        const matchesName = task.title.toLowerCase().includes(queryStr);
        if (!matchesName) return false;
      }

      // 3. Priority Filter
      if (filterPriority !== 'all') {
        if (task.priority !== filterPriority) return false;
      }

      // 4. Date Filter
      if (filterDate !== 'all') {
        const todayStr = new Date().toISOString().split('T')[0];
        const taskDateStr = task.dueDate; // YYYY-MM-DD
        
        if (filterDate === 'today') {
          if (taskDateStr !== todayStr) return false;
        } else if (filterDate === 'overdue') {
          if (taskDateStr >= todayStr) return false;
        } else if (filterDate === 'week') {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const endOfWeek = new Date(today);
          endOfWeek.setDate(today.getDate() + 7);
          
          const taskDate = new Date(taskDateStr);
          taskDate.setHours(0, 0, 0, 0);
          
          if (taskDate < today || taskDate > endOfWeek) return false;
        }
      }

      return true;
    })
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 10);

  // Get current date string formatted nicely (e.g. "Wednesday, 3 June")
  const getFormattedDate = () => {
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    return new Date().toLocaleDateString('en-GB', options);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      {/* Background Soft Decoration */}
      <View style={styles.backgroundWave} />

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        {/* Greeting Header */}
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.dateLabel}>{getFormattedDate()}</Text>
            <Text style={styles.userName}>Hello, {user?.name || 'Student'} 👋</Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Profile')}
            style={[styles.avatarCircle, SHADOWS.card]}
          >
            <Text style={styles.avatarText}>
              {(user?.name || 'S').charAt(0).toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Progress Overview Card */}
        <View style={[styles.progressCard, styles.elevationCard]}>
          <View style={styles.progressHeader}>
            <View>
              <Text style={styles.progressTitle}>Your Academic Progress</Text>
              <Text style={styles.progressSubtitle}>
                {stats.completed} of {stats.total} tasks completed
              </Text>
            </View>
            <View style={styles.percentBadge}>
              <Text style={styles.percentText}>{stats.completionRate}%</Text>
            </View>
          </View>

          {/* Segmented capsule progress bar */}
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: `${stats.completionRate}%` }]} />
          </View>

          {/* Status chips inside card */}
          <View style={styles.chipsRow}>
            {stats.overdue > 0 && (
              <View style={styles.overdueChip}>
                <Ionicons name="warning-outline" size={14} color={COLORS.danger} />
                <Text style={styles.overdueText}>{stats.overdue} Overdue</Text>
              </View>
            )}
            {stats.dueToday > 0 && (
              <View style={[styles.overdueChip, styles.warningChip]}>
                <Ionicons name="time-outline" size={14} color="#D47A2A" />
                <Text style={[styles.overdueText, styles.warningText]}>{stats.dueToday} Due Today</Text>
              </View>
            )}
            {stats.overdue === 0 && stats.dueToday === 0 && (
              <View style={[styles.overdueChip, styles.successChip]}>
                <Ionicons name="checkmark-done" size={14} color="#10B981" />
                <Text style={[styles.overdueText, styles.successText]}>All Caught Up</Text>
              </View>
            )}
          </View>
        </View>

        {/* Stat Tiles Grid */}
        <View style={styles.statsRow}>
          <StatCard icon="list" label="Total" value={stats.total} color="#0A60FF" bgColor="#EBF1FC" />
          <StatCard icon="flash-outline" label="Active" value={stats.active} color="#8B5CF6" bgColor="#F5F2FF" />
          <StatCard icon="checkmark-done" label="Completed" value={stats.completed} color="#10B981" bgColor="#EAFDF4" />
          <StatCard icon="alert-circle-outline" label="Overdue" value={stats.overdue} color="#EF4444" bgColor="#FDF2F2" />
        </View>

        {/* Upcoming Tasks Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Deadlines</Text>
          
          <View style={styles.headerRightActions}>
            <TouchableOpacity 
              onPress={() => setShowFilterModal(true)} 
              style={[
                styles.filterBtn, 
                (filterPriority !== 'all' || filterDate !== 'all' || dashboardSearchQuery.trim() !== '') && styles.filterBtnActive
              ]}
              activeOpacity={0.7}
            >
              <Ionicons 
                name="funnel-outline" 
                size={16} 
                color={(filterPriority !== 'all' || filterDate !== 'all' || dashboardSearchQuery.trim() !== '') ? '#FFFFFF' : '#0A60FF'} 
              />
              {(filterPriority !== 'all' || filterDate !== 'all' || dashboardSearchQuery.trim() !== '') && (
                <View style={styles.activeFilterIndicator} />
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Tasks')} activeOpacity={0.7}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tasks List */}
        {filteredUpcomingTasks.length > 0 ? (
          filteredUpcomingTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onPress={() => navigation.navigate('Tasks', {
                screen: 'TaskDetail',
                params: { taskId: task.id },
              })}
              onToggleComplete={() => toggleTaskComplete(task.id)}
            />
          ))
        ) : (
          <EmptyState
            icon={(filterPriority !== 'all' || filterDate !== 'all' || dashboardSearchQuery.trim() !== '') ? 'search-outline' : 'rocket-outline'}
            title={(filterPriority !== 'all' || filterDate !== 'all' || dashboardSearchQuery.trim() !== '') ? 'No Matches' : 'All Done!'}
            message={(filterPriority !== 'all' || filterDate !== 'all' || dashboardSearchQuery.trim() !== '') ? 'No upcoming tasks match your filter criteria.' : "No upcoming deadlines. Tap '+' below to add a new task."}
            buttonTitle={(filterPriority !== 'all' || filterDate !== 'all' || dashboardSearchQuery.trim() !== '') ? 'Reset Filters' : 'Add Task'}
            onButtonPress={(filterPriority !== 'all' || filterDate !== 'all' || dashboardSearchQuery.trim() !== '') 
              ? () => { setFilterPriority('all'); setFilterDate('all'); setDashboardSearchQuery(''); } 
              : () => navigation.navigate('Tasks', { screen: 'AddTask' })}
          />
        )}
      </ScrollView>

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowFilterModal(false)}
        >
          <View style={[styles.filterModal, SHADOWS.elevated]} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>Filter Upcoming Tasks</Text>
            </View>

            {/* Filter by Name (Search) */}
            <Text style={styles.filterGroupTitle}>Filter by Name</Text>
            <View style={styles.searchContainer}>
              <SearchBar
                value={dashboardSearchQuery}
                onChangeText={setDashboardSearchQuery}
                placeholder="Search task title..."
              />
            </View>

            {/* Filter by Date */}
            <Text style={styles.filterGroupTitle}>Filter by Due Date</Text>
            <View style={styles.pillContainer}>
              {[
                { key: 'all', label: 'All Dates' },
                { key: 'today', label: 'Today' },
                { key: 'week', label: 'This Week' },
                { key: 'overdue', label: 'Overdue' },
              ].map((opt) => {
                const isSel = filterDate === opt.key;
                return (
                  <TouchableOpacity
                    key={opt.key}
                    onPress={() => setFilterDate(opt.key)}
                    style={[styles.pill, isSel && styles.pillActive]}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.pillText, isSel && styles.pillTextActive]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Filter by Priority */}
            <Text style={styles.filterGroupTitle}>Filter by Priority</Text>
            <View style={styles.pillContainer}>
              {[
                { key: 'all', label: 'All Priorities' },
                { key: 'high', label: 'High' },
                { key: 'medium', label: 'Medium' },
                { key: 'low', label: 'Low' },
              ].map((opt) => {
                const isSel = filterPriority === opt.key;
                return (
                  <TouchableOpacity
                    key={opt.key}
                    onPress={() => setFilterPriority(opt.key)}
                    style={[styles.pill, isSel && styles.pillActive]}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.pillText, isSel && styles.pillTextActive]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Action Buttons */}
            <View style={styles.modalActionsRow}>
              <TouchableOpacity
                onPress={() => {
                  setFilterPriority('all');
                  setFilterDate('all');
                  setDashboardSearchQuery('');
                  setShowFilterModal(false);
                }}
                style={styles.clearFiltersBtn}
                activeOpacity={0.7}
              >
                <Text style={styles.clearFiltersText}>Reset All</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowFilterModal(false)}
                style={styles.applyFiltersBtn}
                activeOpacity={0.7}
              >
                <Text style={styles.applyFiltersText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modern Floating Action Button (FAB) */}
      <TouchableOpacity
        style={[styles.fab, styles.fabShadow]}
        onPress={() => navigation.navigate('Tasks', { screen: 'AddTask' })}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
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
    height: width * 1.0,
    borderRadius: width * 0.75,
    backgroundColor: '#EAEFFF',
    zIndex: -1,
  },
  scrollContent: { 
    paddingHorizontal: SPACING.xl, 
    paddingTop: Platform.OS === 'ios' ? SPACING.xl : SPACING.xxl + 10, 
    paddingBottom: 110 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: SPACING.xl 
  },
  headerTextContainer: {
    flex: 1,
  },
  dateLabel: { 
    fontSize: 12, 
    fontWeight: '700', 
    color: '#64748B', 
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  userName: { 
    fontSize: FONT_SIZES.xxl - 2, 
    fontWeight: '800', 
    color: '#1E293B', 
    marginTop: 4 
  },
  avatarCircle: { 
    width: 48, 
    height: 48, 
    borderRadius: 16, 
    backgroundColor: '#FFFFFF', 
    alignItems: 'center', 
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  avatarText: { 
    fontSize: FONT_SIZES.xl, 
    fontWeight: '800', 
    color: '#0A60FF' 
  },
  progressCard: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 24, 
    padding: SPACING.xl, 
    marginBottom: SPACING.xl 
  },
  elevationCard: {
    shadowColor: '#0A60FF',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.06,
    shadowRadius: 28,
    elevation: 6,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  progressTitle: { 
    fontSize: FONT_SIZES.md, 
    fontWeight: '800', 
    color: '#1E293B' 
  },
  progressSubtitle: { 
    fontSize: FONT_SIZES.sm, 
    color: '#64748B', 
    marginTop: 2,
    fontWeight: '500'
  },
  percentBadge: {
    backgroundColor: '#EBF1FC',
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  percentText: {
    fontSize: FONT_SIZES.lg - 1,
    fontWeight: '800',
    color: '#0A60FF',
  },
  progressBarTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#F1F5F9',
    overflow: 'hidden',
    marginBottom: SPACING.md,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
    backgroundColor: '#0A60FF',
  },
  chipsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    flexWrap: 'wrap',
  },
  overdueChip: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FDF2F2', 
    paddingHorizontal: SPACING.md, 
    paddingVertical: 5, 
    borderRadius: BORDER_RADIUS.full, 
  },
  overdueText: { 
    fontSize: FONT_SIZES.xs, 
    color: '#EF4444', 
    marginLeft: 4, 
    fontWeight: '700' 
  },
  warningChip: {
    backgroundColor: '#FFF8E6',
  },
  warningText: {
    color: '#D47A2A',
  },
  successChip: {
    backgroundColor: '#EAFDF4',
  },
  successText: {
    color: '#10B981',
  },
  statsRow: { 
    flexDirection: 'row', 
    marginBottom: SPACING.xxl, 
    justifyContent: 'space-between' 
  },
  sectionHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: SPACING.md 
  },
  sectionTitle: { 
    fontSize: FONT_SIZES.lg, 
    fontWeight: '800', 
    color: '#1E293B' 
  },
  seeAll: { 
    fontSize: FONT_SIZES.sm, 
    fontWeight: '700', 
    color: '#0A60FF' 
  },
  fab: { 
    position: 'absolute', 
    bottom: 24, 
    right: 24, 
    width: 56, 
    height: 56, 
    borderRadius: 28, 
    backgroundColor: '#0A60FF', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  fabShadow: {
    shadowColor: '#0A60FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  filterBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    position: 'relative',
  },
  filterBtnActive: {
    backgroundColor: '#0A60FF',
    borderColor: '#0A60FF',
  },
  activeFilterIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(15, 23, 42, 0.4)', 
    justifyContent: 'flex-end' 
  },
  filterModal: { 
    backgroundColor: '#FFFFFF', 
    borderTopLeftRadius: 28, 
    borderTopRightRadius: 28, 
    paddingTop: SPACING.md,
    paddingHorizontal: SPACING.xl, 
    paddingBottom: Platform.OS === 'ios' ? 40 : 30,
    width: '100%'
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  modalHandle: {
    width: 36,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#E2E8F0',
    marginBottom: SPACING.sm,
  },
  modalTitle: { 
    fontSize: FONT_SIZES.lg, 
    fontWeight: '800', 
    color: '#1E293B' 
  },
  filterGroupTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  searchContainer: {
    marginBottom: SPACING.xs,
  },
  pillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  pill: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm - 2,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  pillActive: {
    backgroundColor: '#0A60FF',
    borderColor: '#0A60FF',
  },
  pillText: {
    fontSize: FONT_SIZES.sm - 1,
    fontWeight: '700',
    color: '#64748B',
  },
  pillTextActive: {
    color: '#FFFFFF',
  },
  modalActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.md,
    marginTop: SPACING.xl,
    marginBottom: SPACING.sm,
  },
  clearFiltersBtn: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  clearFiltersText: {
    fontSize: FONT_SIZES.md - 1,
    fontWeight: '700',
    color: '#64748B',
  },
  applyFiltersBtn: {
    flex: 2,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0A60FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0A60FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  applyFiltersText: {
    fontSize: FONT_SIZES.md - 1,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default DashboardScreen;
