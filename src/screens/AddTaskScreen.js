/**
 * AddTaskScreen
 *
 * Form for creating a new task.
 * Features:
 *   - Curved background branding decoration
 *   - Validated text inputs with active focus feedback
 *   - Priority selectors with modern colored chips
 *   - Module pickers inside clean custom slide-up sheet modals
 *   - Character counter metrics
 */

import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity,
  KeyboardAvoidingView, Platform, Alert, Modal, FlatList, Dimensions, StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTasks } from '../context/TaskContext';
import CustomButton from '../components/CustomButton';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../theme/theme';
import { VALIDATION } from '../utils/constants';

const { width } = Dimensions.get('window');

const priorityOptions = [
  { key: 'high', label: 'High', color: '#EF4444', icon: 'flame-outline' },
  { key: 'medium', label: 'Medium', color: '#F59E0B', icon: 'alert-circle-outline' },
  { key: 'low', label: 'Low', color: '#10B981', icon: 'leaf-outline' },
];

const AddTaskScreen = ({ navigation }) => {
  const { addTask, allModules } = useTasks();

  const [title, setTitle] = useState('');
  const [module, setModule] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [showModulePicker, setShowModulePicker] = useState(false);

  // Active focus states
  const [titleFocused, setTitleFocused] = useState(false);
  const [dateFocused, setDateFocused] = useState(false);
  const [notesFocused, setNotesFocused] = useState(false);

  const handleSubmit = async () => {
    setFieldErrors({});
    setLoading(true);

    const result = await addTask({ title, module, dueDate, priority, notes });

    if (result.success) {
      Alert.alert('Success', 'Task created successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } else {
      setFieldErrors(result.errors);
    }
    setLoading(false);
  };

  const handleDateChange = (text) => {
    let cleaned = text.replace(/[^0-9-]/g, '');
    if (cleaned.length === 4 && !cleaned.includes('-')) cleaned += '-';
    if (cleaned.length === 7 && cleaned.split('-').length === 2) cleaned += '-';
    if (cleaned.length <= 10) {
      setDueDate(cleaned);
      setFieldErrors((e) => ({ ...e, dueDate: null }));
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      {/* Background decoration */}
      <View style={styles.backgroundWave} />

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        keyboardShouldPersistTaps="handled" 
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Task Title <Text style={styles.required}>*</Text></Text>
          <View style={[
            styles.inputContainer, 
            fieldErrors.title && styles.inputError,
            titleFocused && styles.inputFocused
          ]}>
            <Ionicons 
              name="create-outline" 
              size={18} 
              color={titleFocused ? '#0A60FF' : COLORS.textTertiary} 
              style={styles.inputIcon} 
            />
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={(t) => { setTitle(t); setFieldErrors((e) => ({ ...e, title: null })); }}
              onFocus={() => setTitleFocused(true)}
              onBlur={() => setTitleFocused(false)}
              placeholder="e.g. Complete Lab Report"
              placeholderTextColor={COLORS.textTertiary}
              maxLength={VALIDATION.TITLE_MAX}
            />
          </View>
          {fieldErrors.title && <Text style={styles.fieldError}>{fieldErrors.title}</Text>}
          <Text style={styles.charCount}>{title.length}/{VALIDATION.TITLE_MAX}</Text>
        </View>

        {/* Module Picker */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Module <Text style={styles.required}>*</Text></Text>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.inputContainer, fieldErrors.module && styles.inputError]}
            onPress={() => setShowModulePicker(true)}
          >
            <Ionicons name="school-outline" size={18} color={COLORS.textTertiary} style={styles.inputIcon} />
            <Text style={[styles.pickerText, !module && { color: COLORS.textTertiary }]}>
              {module || 'Select a module'}
            </Text>
            <Ionicons name="chevron-down" size={18} color={COLORS.textTertiary} />
          </TouchableOpacity>
          {fieldErrors.module && <Text style={styles.fieldError}>{fieldErrors.module}</Text>}
        </View>

        {/* Due Date */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Due Date <Text style={styles.required}>*</Text></Text>
          <View style={[
            styles.inputContainer, 
            fieldErrors.dueDate && styles.inputError,
            dateFocused && styles.inputFocused
          ]}>
            <Ionicons 
              name="calendar-outline" 
              size={18} 
              color={dateFocused ? '#0A60FF' : COLORS.textTertiary} 
              style={styles.inputIcon} 
            />
            <TextInput
              style={styles.input}
              value={dueDate}
              onChangeText={handleDateChange}
              onFocus={() => setDateFocused(true)}
              onBlur={() => setDateFocused(false)}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={COLORS.textTertiary}
              keyboardType="numeric"
              maxLength={10}
            />
          </View>
          {fieldErrors.dueDate && <Text style={styles.fieldError}>{fieldErrors.dueDate}</Text>}
        </View>

        {/* Priority Selector */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Priority <Text style={styles.required}>*</Text></Text>
          <View style={styles.priorityRow}>
            {priorityOptions.map((opt) => {
              const isSelected = priority === opt.key;
              return (
                <TouchableOpacity
                  key={opt.key}
                  activeOpacity={0.8}
                  onPress={() => { setPriority(opt.key); setFieldErrors((e) => ({ ...e, priority: null })); }}
                  style={[
                    styles.priorityChip,
                    { borderColor: opt.color },
                    isSelected && { backgroundColor: opt.color, borderColor: opt.color },
                  ]}
                >
                  <Ionicons
                    name={opt.icon}
                    size={15}
                    color={isSelected ? '#FFFFFF' : opt.color}
                  />
                  <Text style={[styles.priorityLabel, { color: isSelected ? '#FFFFFF' : opt.color }]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {fieldErrors.priority && <Text style={styles.fieldError}>{fieldErrors.priority}</Text>}
        </View>

        {/* Notes */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Notes</Text>
          <View style={[
            styles.inputContainer, 
            styles.textareaContainer,
            notesFocused && styles.inputFocused
          ]}>
            <TextInput
              style={[styles.input, styles.textarea]}
              value={notes}
              onChangeText={setNotes}
              onFocus={() => setNotesFocused(true)}
              onBlur={() => setNotesFocused(false)}
              placeholder="Additional details or instructions..."
              placeholderTextColor={COLORS.textTertiary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              maxLength={VALIDATION.NOTES_MAX}
            />
          </View>
          {fieldErrors.notes && <Text style={styles.fieldError}>{fieldErrors.notes}</Text>}
          <Text style={styles.charCount}>{notes.length}/{VALIDATION.NOTES_MAX}</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <CustomButton
            title="Create Task"
            onPress={handleSubmit}
            loading={loading}
            icon="checkmark-circle-outline"
            style={styles.submitBtn}
            size="lg"
          />

          <CustomButton
            title="Cancel"
            onPress={() => navigation.goBack()}
            variant="ghost"
            style={styles.cancelBtn}
            size="lg"
          />
        </View>
      </ScrollView>

      {/* Module picker bottom sheet modal */}
      <Modal 
        visible={showModulePicker} 
        transparent 
        animationType="slide" 
        onRequestClose={() => setShowModulePicker(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setShowModulePicker(false)}
        >
          <View style={[styles.pickerModal, SHADOWS.elevated]}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHandle} />
              <Text style={styles.pickerTitle}>Select Academic Module</Text>
            </View>
            <FlatList
              data={allModules}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.pickerItem, module === item && styles.pickerItemActive]}
                  onPress={() => { setModule(item); setShowModulePicker(false); setFieldErrors((e) => ({ ...e, module: null })); }}
                >
                  <Text style={[styles.pickerItemText, module === item && styles.pickerItemTextActive]}>{item}</Text>
                  {module === item && <Ionicons name="checkmark-circle" size={20} color="#0A60FF" />}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
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
    paddingTop: Platform.OS === 'ios' ? SPACING.md : SPACING.lg, 
    paddingBottom: SPACING.xxxl 
  },
  inputGroup: { 
    marginBottom: SPACING.lg 
  },
  label: { 
    fontSize: FONT_SIZES.sm, 
    fontWeight: '700', 
    color: '#1E293B', 
    marginBottom: SPACING.xs + 2 
  },
  required: { 
    color: COLORS.danger 
  },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1.5, 
    borderColor: COLORS.border, 
    borderRadius: 14, 
    paddingHorizontal: SPACING.md, 
    paddingVertical: Platform.OS === 'ios' ? SPACING.md : SPACING.sm + 2, 
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  inputFocused: {
    borderColor: '#0A60FF',
  },
  inputError: { 
    borderColor: COLORS.danger,
    backgroundColor: '#FFFDFD'
  },
  inputIcon: { 
    marginRight: SPACING.sm 
  },
  input: { 
    flex: 1, 
    fontSize: FONT_SIZES.md, 
    color: '#1E293B', 
    padding: 0,
    fontWeight: '500'
  },
  fieldError: { 
    color: COLORS.danger, 
    fontSize: FONT_SIZES.xs, 
    marginTop: SPACING.xs, 
    marginLeft: SPACING.xs,
    fontWeight: '600'
  },
  charCount: { 
    fontSize: 11, 
    color: COLORS.textTertiary, 
    textAlign: 'right', 
    marginTop: SPACING.xs,
    fontWeight: '600'
  },
  pickerText: { 
    flex: 1, 
    fontSize: FONT_SIZES.md, 
    color: '#1E293B',
    fontWeight: '500'
  },
  textareaContainer: { 
    alignItems: 'flex-start', 
    minHeight: 110,
    paddingVertical: SPACING.md 
  },
  textarea: { 
    height: 80, 
    textAlignVertical: 'top' 
  },
  priorityRow: { 
    flexDirection: 'row', 
    gap: SPACING.sm 
  },
  priorityChip: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: SPACING.lg, 
    paddingVertical: SPACING.sm + 1, 
    borderRadius: BORDER_RADIUS.full, 
    borderWidth: 1.5, 
    gap: 6,
    backgroundColor: '#FFFFFF',
  },
  priorityLabel: { 
    fontSize: FONT_SIZES.sm, 
    fontWeight: '700' 
  },
  buttonContainer: {
    marginTop: SPACING.md,
  },
  submitBtn: {
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
  cancelBtn: {
    marginTop: SPACING.xs,
    height: 50,
    paddingVertical: 0,
  },
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(15, 23, 42, 0.4)', 
    justifyContent: 'flex-end' 
  },
  pickerModal: { 
    backgroundColor: '#FFFFFF', 
    borderTopLeftRadius: 28, 
    borderTopRightRadius: 28, 
    paddingTop: SPACING.md,
    paddingHorizontal: SPACING.xl, 
    paddingBottom: 40,
    maxHeight: '60%' 
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
  pickerTitle: { 
    fontSize: FONT_SIZES.lg, 
    fontWeight: '800', 
    color: '#1E293B' 
  },
  pickerItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: SPACING.md - 2, 
    paddingHorizontal: SPACING.md, 
    borderRadius: 14, 
    marginBottom: SPACING.xs,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  pickerItemActive: { 
    backgroundColor: '#EBF1FC',
    borderColor: '#EBF1FC',
  },
  pickerItemText: { 
    fontSize: FONT_SIZES.md, 
    color: '#475569',
    fontWeight: '600',
  },
  pickerItemTextActive: { 
    color: '#0A60FF', 
    fontWeight: '700' 
  },
});

export default AddTaskScreen;
