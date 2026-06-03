/**
 * TaskListScreen
 *
 * Full task list with search, filter tabs, and sort controls.
 * Features:
 *   - Clean list layout with card drop shadows
 *   - Customizable search integration
 *   - Pill-based filter tabs (All | Active | Completed)
 *   - Interactive Sort selector bottom-sheet styled modal
 */

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, StatusBar, Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTasks } from '../context/TaskContext';
import TaskCard from '../components/TaskCard';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../theme/theme';
import { FILTER_OPTIONS, SORT_OPTIONS } from '../utils/constants';

const { width } = Dimensions.get('window');

const filterTabs = [
  { key: FILTER_OPTIONS.ALL, label: 'All' },
  { key: FILTER_OPTIONS.ACTIVE, label: 'Active' },
  { key: FILTER_OPTIONS.COMPLETED, label: 'Completed' },
];

const sortOptions = [
  { key: SORT_OPTIONS.DUE_DATE, label: 'Due Date', icon: 'calendar-outline' },
  { key: SORT_OPTIONS.PRIORITY, label: 'Priority', icon: 'flag-outline' },
  { key: SORT_OPTIONS.TITLE, label: 'Title', icon: 'text-outline' },
  { key: SORT_OPTIONS.CREATED, label: 'Created Date', icon: 'time-outline' },
];

const TaskListScreen = ({ navigation }) => {
  const {
    searchQuery, setSearchQuery, activeFilter, setActiveFilter,
    sortBy, setSortBy, getFilteredTasks, toggleTaskComplete,
  } = useTasks();

  const [showSortModal, setShowSortModal] = useState(false);
  const filteredTasks = getFilteredTasks();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      {/* Background decoration */}
      <View style={styles.backgroundWave} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Tasks</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            onPress={() => setShowSortModal(true)} 
            style={[styles.sortBtn, SHADOWS.card]}
          >
            <Ionicons name="swap-vertical" size={20} color="#0A60FF" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('AddTask')}
            style={[styles.addBtn, styles.addBtnShadow]}
          >
            <Ionicons name="add" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchArea}>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {filterTabs.map((tab) => {
          const isActive = activeFilter === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveFilter(tab.key)}
              style={[styles.filterTab, isActive && styles.filterTabActive]}
            >
              <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Task List */}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onPress={() => navigation.navigate('TaskDetail', { taskId: item.id })}
            onToggleComplete={() => toggleTaskComplete(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon={searchQuery ? 'search-outline' : 'clipboard-outline'}
            title={searchQuery ? 'No Results' : 'No Tasks Yet'}
            message={searchQuery ? `No tasks match "${searchQuery}".` : 'Create your first task to get started!'}
            buttonTitle={searchQuery ? undefined : 'Add Task'}
            onButtonPress={searchQuery ? undefined : () => navigation.navigate('AddTask')}
          />
        }
      />

      {/* Sort selection Modal (Bottom Sheet style) */}
      <Modal 
        visible={showSortModal} 
        transparent 
        animationType="slide" 
        onRequestClose={() => setShowSortModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setShowSortModal(false)}
        >
          <View style={[styles.sortModal, SHADOWS.elevated]}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHandle} />
              <Text style={styles.sortModalTitle}>Sort Tasks By</Text>
            </View>

            {sortOptions.map((option) => {
              const isSelected = sortBy === option.key;
              return (
                <TouchableOpacity
                  key={option.key}
                  style={[styles.sortOption, isSelected && styles.sortOptionActive]}
                  onPress={() => { setSortBy(option.key); setShowSortModal(false); }}
                >
                  <Ionicons 
                    name={option.icon} 
                    size={20} 
                    color={isSelected ? '#0A60FF' : '#64748B'} 
                  />
                  <Text style={[styles.sortOptionText, isSelected && styles.sortOptionTextActive]}>
                    {option.label}
                  </Text>
                  {isSelected && <Ionicons name="checkmark-circle" size={20} color="#0A60FF" />}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>
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
    height: width * 0.8,
    borderRadius: width * 0.75,
    backgroundColor: '#EAEFFF',
    zIndex: -1,
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: SPACING.xl, 
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 20 : 60, 
    paddingBottom: SPACING.md 
  },
  title: { 
    fontSize: FONT_SIZES.xxl - 2, 
    fontWeight: '850', 
    color: '#1E293B' 
  },
  headerActions: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: SPACING.md 
  },
  sortBtn: { 
    width: 42, 
    height: 42, 
    borderRadius: 14, 
    backgroundColor: '#FFFFFF', 
    alignItems: 'center', 
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  addBtn: { 
    width: 42, 
    height: 42, 
    borderRadius: 14, 
    backgroundColor: '#0A60FF', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  addBtnShadow: {
    shadowColor: '#0A60FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  searchArea: { 
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.sm,
  },
  filterRow: { 
    flexDirection: 'row', 
    paddingHorizontal: SPACING.xl, 
    marginVertical: SPACING.md, 
    gap: SPACING.sm 
  },
  filterTab: { 
    paddingHorizontal: SPACING.lg, 
    paddingVertical: SPACING.sm - 2, 
    borderRadius: 20, 
    backgroundColor: '#FFFFFF', 
    borderWidth: 1.5, 
    borderColor: '#E2E8F0' 
  },
  filterTabActive: { 
    backgroundColor: '#0A60FF', 
    borderColor: '#0A60FF' 
  },
  filterText: { 
    fontSize: FONT_SIZES.sm, 
    fontWeight: '700', 
    color: '#64748B' 
  },
  filterTextActive: { 
    color: '#FFFFFF' 
  },
  listContent: { 
    paddingHorizontal: SPACING.xl, 
    paddingBottom: SPACING.xxxl 
  },
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(15, 23, 42, 0.4)', 
    justifyContent: 'flex-end' 
  },
  sortModal: { 
    backgroundColor: '#FFFFFF', 
    borderTopLeftRadius: 28, 
    borderTopRightRadius: 28, 
    paddingTop: SPACING.md,
    paddingHorizontal: SPACING.xl, 
    paddingBottom: 40,
    width: '100%'
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  modalHandle: {
    width: 36,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#E2E8F0',
    marginBottom: SPACING.md,
  },
  sortModalTitle: { 
    fontSize: FONT_SIZES.lg, 
    fontWeight: '800', 
    color: '#1E293B' 
  },
  sortOption: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: SPACING.md - 2, 
    paddingHorizontal: SPACING.md, 
    borderRadius: 14, 
    marginBottom: SPACING.xs,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  sortOptionActive: { 
    backgroundColor: '#EBF1FC',
    borderColor: '#EBF1FC',
  },
  sortOptionText: { 
    flex: 1, 
    marginLeft: SPACING.md, 
    fontSize: FONT_SIZES.md, 
    color: '#475569',
    fontWeight: '600',
  },
  sortOptionTextActive: { 
    color: '#0A60FF', 
    fontWeight: '700' 
  },
});

export default TaskListScreen;
