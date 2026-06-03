/**
 * SettingsScreen
 *
 * Application settings with toggle switches and selection options.
 * Features:
 *   - Curved background branding decoration
 *   - Balanced modern switches with colored tracks
 *   - Setting toggle items inside rounded card cards
 *   - Action indicators for default sort options
 *   - Clear All Data button with warning design
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert, Dimensions, StatusBar, Platform, TextInput, FlatList, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import StorageService from '../services/StorageService';
import CustomButton from '../components/CustomButton';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../theme/theme';
import { SORT_OPTIONS } from '../utils/constants';

const { width } = Dimensions.get('window');

const SettingsScreen = () => {
  const { logout } = useAuth();
  const { setSortBy, sortBy, seedSampleTasks, customModules, addCustomModule, deleteCustomModule } = useTasks();

  const [notifications, setNotifications] = useState(true);
  const [showCompleted, setShowCompleted] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(true);
  const [showModuleManager, setShowModuleManager] = useState(false);
  const [newModuleName, setNewModuleName] = useState('');

  // Load saved settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const settings = await StorageService.getSettings();
    if (settings) {
      setNotifications(settings.notifications ?? true);
      setShowCompleted(settings.showCompleted ?? true);
      setConfirmDelete(settings.confirmDelete ?? true);
    }
  };

  // Save on any change
  const updateSetting = async (key, value) => {
    const current = await StorageService.getSettings();
    await StorageService.saveSettings({ ...current, [key]: value });
  };

  // Toggle with persist
  const handleToggle = (key, setter, currentValue) => {
    const newValue = !currentValue;
    setter(newValue);
    updateSetting(key, newValue);
  };

  // Setting row component
  const SettingToggle = ({ icon, title, subtitle, value, onToggle, iconColor = '#0A60FF' }) => (
    <View style={styles.settingRow}>
      <View style={[styles.settingIcon, { backgroundColor: iconColor + '10' }]}>
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#E2E8F0', true: '#EBF1FC' }}
        thumbColor={value ? '#0A60FF' : '#94A3B8'}
        ios_backgroundColor="#E2E8F0"
      />
    </View>
  );

  const sortLabels = {
    [SORT_OPTIONS.DUE_DATE]: { label: 'Due Date', icon: 'calendar-outline', color: '#0A60FF' },
    [SORT_OPTIONS.PRIORITY]: { label: 'Priority', icon: 'flag-outline', color: '#EF4444' },
    [SORT_OPTIONS.TITLE]: { label: 'Title', icon: 'text-outline', color: '#8B5CF6' },
    [SORT_OPTIONS.CREATED]: { label: 'Created Date', icon: 'time-outline', color: '#10B981' },
  };

  const handleSeedData = () => {
    Alert.alert(
      'Seed Sample Tasks',
      'This will insert sample academic tasks with realistic data for all modules into your account. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Seed Data',
          onPress: async () => {
            try {
              const res = await seedSampleTasks();
              if (res.success) {
                Alert.alert('Success', 'Sample tasks successfully added for all modules!');
              } else {
                Alert.alert('Error', res.error || 'Failed to seed data.');
              }
            } catch (err) {
              Alert.alert('Error', 'An unexpected error occurred.');
            }
          },
        },
      ]
    );
  };

  const handleAddModule = async () => {
    if (!newModuleName.trim()) {
      Alert.alert('Validation Error', 'Please enter a module name.');
      return;
    }
    const res = await addCustomModule(newModuleName);
    if (res.success) {
      setNewModuleName('');
    } else {
      Alert.alert('Error', res.error || 'Failed to add module.');
    }
  };

  const handleDeleteModule = (id, name) => {
    Alert.alert(
      'Delete Module',
      `Are you sure you want to delete the module "${name}"? This will not affect existing tasks under this module name.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const res = await deleteCustomModule(id);
            if (!res.success) {
              Alert.alert('Error', res.error || 'Failed to delete module.');
            }
          },
        },
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will remove all tasks and settings. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Data',
          style: 'destructive',
          onPress: async () => {
            await StorageService.clearAll();
            logout();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      {/* Background decoration */}
      <View style={styles.backgroundWave} />

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Settings</Text>

        {/* Preferences Section */}
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={[styles.card, styles.cardShadow]}>
          <SettingToggle
            icon="notifications-outline"
            title="Notifications"
            subtitle="Enable task reminders"
            value={notifications}
            onToggle={() => handleToggle('notifications', setNotifications, notifications)}
            iconColor="#0A60FF"
          />
          <View style={styles.separator} />
          
          <SettingToggle
            icon="eye-outline"
            title="Show Completed"
            subtitle="Display completed tasks in list"
            value={showCompleted}
            onToggle={() => handleToggle('showCompleted', setShowCompleted, showCompleted)}
            iconColor="#8B5CF6"
          />
          <View style={styles.separator} />
          
          <SettingToggle
            icon="alert-circle-outline"
            title="Confirm Delete"
            subtitle="Ask before deleting tasks"
            value={confirmDelete}
            onToggle={() => handleToggle('confirmDelete', setConfirmDelete, confirmDelete)}
            iconColor="#F59E0B"
          />
        </View>

        {/* Default Sort */}
        <Text style={styles.sectionTitle}>Default Sort Order</Text>
        <View style={[styles.card, styles.cardShadow]}>
          {Object.entries(sortLabels).map(([key, item], index) => {
            const isSelected = sortBy === key;
            return (
              <React.Fragment key={key}>
                {index > 0 && <View style={styles.separator} />}
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.sortRow}
                  onPress={() => { setSortBy(key); updateSetting('sortBy', key); }}
                >
                  <View style={styles.sortLabelGroup}>
                    <View style={[styles.sortIconBox, { backgroundColor: item.color + '10' }]}>
                      <Ionicons name={item.icon} size={18} color={item.color} />
                    </View>
                    <Text style={[styles.sortLabel, isSelected && styles.sortLabelActive]}>{item.label}</Text>
                  </View>
                  {isSelected && <Ionicons name="checkmark-circle" size={22} color="#0A60FF" />}
                </TouchableOpacity>
              </React.Fragment>
            );
          })}
        </View>

        {/* Demo Tools */}
        <Text style={styles.sectionTitle}>Demo Tools</Text>
        <View style={[styles.card, styles.cardShadow]}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.sortRow}
            onPress={handleSeedData}
          >
            <View style={styles.sortLabelGroup}>
              <View style={[styles.sortIconBox, { backgroundColor: '#0A60FF10' }]}>
                <Ionicons name="cloud-upload-outline" size={18} color="#0A60FF" />
              </View>
              <Text style={styles.sortLabel}>Seed Sample Tasks</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={18} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* Course Settings */}
        <Text style={styles.sectionTitle}>Course Settings</Text>
        <View style={[styles.card, styles.cardShadow]}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.sortRow}
            onPress={() => setShowModuleManager(true)}
          >
            <View style={styles.sortLabelGroup}>
              <View style={[styles.sortIconBox, { backgroundColor: '#8B5CF610' }]}>
                <Ionicons name="folder-open-outline" size={18} color="#8B5CF6" />
              </View>
              <Text style={styles.sortLabel}>Manage Custom Modules</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={18} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <Text style={styles.sectionTitle}>About Planner</Text>
        <View style={[styles.card, styles.cardShadow]}>
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>App Version</Text>
            <Text style={styles.aboutValue}>1.0.0</Text>
          </View>
          
          <View style={styles.separator} />
          
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>Framework</Text>
            <Text style={styles.aboutValue}>React Native (Expo)</Text>
          </View>
          
          <View style={styles.separator} />
          
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>Database Storage</Text>
            <Text style={styles.aboutValue}>Firebase Cloud Sync</Text>
          </View>
        </View>

        {/* Danger Zone */}
        <Text style={[styles.sectionTitle, { color: '#EF4444' }]}>Danger Zone</Text>
        <CustomButton
          title="Clear All Data"
          onPress={handleClearData}
          variant="danger"
          icon="trash-outline"
          style={styles.clearBtn}
          size="lg"
        />
      </ScrollView>

      {/* Module Manager Modal */}
      <Modal
        visible={showModuleManager}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModuleManager(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowModuleManager(false)}
        >
          <View style={[styles.managerModal, SHADOWS.elevated]} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>Manage Custom Modules</Text>
            </View>

            {/* List of Custom Modules */}
            <Text style={styles.filterGroupTitle}>Your Custom Modules ({customModules.length})</Text>
            <View style={styles.moduleListContainer}>
              {customModules.length > 0 ? (
                <FlatList
                  data={customModules}
                  keyExtractor={(item) => item.id}
                  style={styles.moduleList}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <View style={styles.moduleItemRow}>
                      <View style={styles.moduleItemLabelBox}>
                        <Ionicons name="bookmark-outline" size={16} color="#8B5CF6" />
                        <Text style={styles.moduleItemText}>{item.name}</Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => handleDeleteModule(item.id, item.name)}
                        style={styles.deleteModuleBtn}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="trash-outline" size={18} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  )}
                />
              ) : (
                <View style={styles.emptyModulesBox}>
                  <Ionicons name="folder-outline" size={32} color="#94A3B8" />
                  <Text style={styles.emptyModulesText}>No custom modules added yet.</Text>
                </View>
              )}
            </View>

            {/* Add Custom Module Input */}
            <Text style={styles.filterGroupTitle}>Create New Module</Text>
            <View style={styles.addModuleInputRow}>
              <TextInput
                style={styles.moduleInput}
                value={newModuleName}
                onChangeText={setNewModuleName}
                placeholder="e.g. Data Science"
                placeholderTextColor="#94A3B8"
                maxLength={40}
              />
              <TouchableOpacity
                onPress={handleAddModule}
                style={styles.addModuleBtn}
                activeOpacity={0.7}
              >
                <Ionicons name="add" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
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
  scrollContent: { 
    paddingHorizontal: SPACING.xl, 
    paddingTop: Platform.OS === 'ios' ? SPACING.xl : SPACING.xxl + 10, 
    paddingBottom: SPACING.xxxl 
  },
  pageTitle: { 
    fontSize: FONT_SIZES.xxl - 2, 
    fontWeight: '850', 
    color: '#1E293B', 
    marginBottom: SPACING.lg 
  },
  sectionTitle: { 
    fontSize: 11, 
    fontWeight: '700', 
    color: '#94A3B8', 
    textTransform: 'uppercase', 
    letterSpacing: 0.8, 
    marginBottom: SPACING.sm, 
    marginTop: SPACING.lg 
  },
  card: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 20, 
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg, 
    marginBottom: SPACING.md 
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
  settingRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: SPACING.md - 2 
  },
  settingIcon: { 
    width: 36, 
    height: 36, 
    borderRadius: 10, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: SPACING.md 
  },
  settingContent: { 
    flex: 1 
  },
  settingTitle: { 
    fontSize: FONT_SIZES.md - 1, 
    fontWeight: '700', 
    color: '#1E293B' 
  },
  settingSubtitle: { 
    fontSize: FONT_SIZES.sm - 1, 
    color: '#64748B', 
    marginTop: 2,
    fontWeight: '500' 
  },
  separator: { 
    height: 1, 
    backgroundColor: '#F1F5F9', 
  },
  sortRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: SPACING.md - 2 
  },
  sortLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm + 2,
  },
  sortLabel: { 
    fontSize: FONT_SIZES.md - 1, 
    color: '#475569',
    fontWeight: '600',
  },
  sortLabelActive: { 
    color: '#0A60FF', 
    fontWeight: '700' 
  },
  aboutRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: SPACING.md - 2 
  },
  aboutLabel: { 
    fontSize: FONT_SIZES.md - 1, 
    color: '#64748B',
    fontWeight: '600' 
  },
  aboutValue: { 
    fontSize: FONT_SIZES.md - 1, 
    fontWeight: '700', 
    color: '#1E293B' 
  },
  clearBtn: {
    backgroundColor: '#EF4444',
    borderRadius: 26,
    height: 52,
    paddingVertical: 0,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 4,
    marginTop: SPACING.xs,
  },
  managerModal: { 
    backgroundColor: '#FFFFFF', 
    borderTopLeftRadius: 28, 
    borderTopRightRadius: 28, 
    paddingTop: SPACING.md,
    paddingHorizontal: SPACING.xl, 
    paddingBottom: Platform.OS === 'ios' ? 40 : 30,
    width: '100%',
    maxHeight: '75%' 
  },
  moduleListContainer: {
    maxHeight: 180,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    borderRadius: 16,
    padding: SPACING.sm,
    backgroundColor: '#F8FAFC',
    marginVertical: SPACING.xs,
  },
  moduleList: {
    width: '100%',
  },
  moduleItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  moduleItemLabelBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flex: 1,
  },
  moduleItemText: {
    fontSize: FONT_SIZES.md - 1,
    color: '#334155',
    fontWeight: '600',
  },
  deleteModuleBtn: {
    padding: 4,
  },
  emptyModulesBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
  },
  emptyModulesText: {
    fontSize: FONT_SIZES.sm,
    color: '#94A3B8',
    marginTop: 6,
    fontWeight: '500',
  },
  addModuleInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.xs,
  },
  moduleInput: {
    flex: 1,
    height: 48,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: SPACING.md,
    backgroundColor: '#FFFFFF',
    fontSize: FONT_SIZES.md - 1,
    color: '#334155',
    fontWeight: '500',
  },
  addModuleBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#0A60FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0A60FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(15, 23, 42, 0.4)', 
    justifyContent: 'flex-end' 
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
});

export default SettingsScreen;
