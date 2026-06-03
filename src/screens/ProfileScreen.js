/**
 * ProfileScreen
 *
 * Displays user profile information with statistics summary.
 * Features:
 *   - Curved background branding decoration
 *   - Massive custom border avatarLarge block with edit actions
 *   - Live interactive statistic grid tiles
 *   - Info rows with icons and metadata layout
 */

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert, Dimensions, StatusBar, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import CustomButton from '../components/CustomButton';
import StatCard from '../components/StatCard';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../theme/theme';
import { formatDate } from '../utils/helpers';

const { width } = Dimensions.get('window');

const ProfileScreen = ({ navigation }) => {
  const { user, updateProfile, logout } = useAuth();
  const { stats } = useTasks();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');

  const handleSave = async () => {
    if (editName.trim().length < 2) {
      Alert.alert('Invalid Name', 'Name must be at least 2 characters.');
      return;
    }
    await updateProfile({ name: editName.trim() });
    setIsEditing(false);
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out of your account?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: logout },
    ]);
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
        {/* Avatar Header Block */}
        <View style={styles.profileHeader}>
          <View style={[styles.avatarLarge, SHADOWS.elevated]}>
            <Text style={styles.avatarText}>{(user?.name || 'S').charAt(0).toUpperCase()}</Text>
          </View>

          {isEditing ? (
            <View style={styles.editNameRow}>
              <TextInput
                style={styles.nameInput}
                value={editName}
                onChangeText={setEditName}
                autoFocus
                selectTextOnFocus
              />
              <TouchableOpacity onPress={handleSave} style={styles.saveIcon}>
                <Ionicons name="checkmark-circle" size={28} color="#10B981" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setIsEditing(false); setEditName(user?.name || ''); }}>
                <Ionicons name="close-circle" size={28} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              activeOpacity={0.7}
              onPress={() => setIsEditing(true)} 
              style={styles.nameRow}
            >
              <Text style={styles.name}>{user?.name}</Text>
              <Ionicons name="pencil" size={16} color="#0A60FF" style={styles.pencilIcon} />
            </TouchableOpacity>
          )}

          <Text style={styles.email}>{user?.email}</Text>
          <Text style={styles.memberSince}>Member since {formatDate(user?.createdAt)}</Text>
        </View>

        {/* Task Statistics */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Academic Statistics</Text>
          <View style={styles.statsRow}>
            <StatCard icon="list" label="Total" value={stats.total} color="#0A60FF" bgColor="#EBF1FC" />
            <StatCard icon="checkmark-done" label="Completed" value={stats.completed} color="#10B981" bgColor="#EAFDF4" />
            <StatCard icon="trending-up" label="Success Rate" value={`${stats.completionRate}%`} color="#8B5CF6" bgColor="#F5F2FF" />
          </View>
        </View>

        {/* Account Details Info Card */}
        <View style={[styles.infoCard, styles.cardShadow]}>
          <View style={styles.infoRow}>
            <View style={[styles.infoIconBox, { backgroundColor: '#EBF1FC' }]}>
              <Ionicons name="mail" size={18} color="#0A60FF" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Primary Email</Text>
              <Text style={styles.infoValue}>{user?.email}</Text>
            </View>
          </View>
          
          <View style={styles.separator} />
          
          <View style={styles.infoRow}>
            <View style={[styles.infoIconBox, { backgroundColor: '#EAFDF4' }]}>
              <Ionicons name="calendar" size={18} color="#10B981" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Account Created</Text>
              <Text style={styles.infoValue}>{formatDate(user?.createdAt)}</Text>
            </View>
          </View>
        </View>

        {/* Action Controls */}
        <CustomButton
          title="Log Out"
          onPress={handleLogout}
          variant="danger"
          icon="log-out-outline"
          style={styles.logoutBtn}
          size="lg"
        />
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
  profileHeader: { 
    alignItems: 'center', 
    marginBottom: SPACING.xxl 
  },
  avatarLarge: { 
    width: 96, 
    height: 96, 
    borderRadius: 32, 
    backgroundColor: '#FFFFFF', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: SPACING.lg,
    borderWidth: 2.5,
    borderColor: '#E2E8F0',
  },
  avatarText: { 
    fontSize: FONT_SIZES.xxxl + 4, 
    fontWeight: '800', 
    color: '#0A60FF' 
  },
  nameRow: { 
    flexDirection: 'row', 
    alignItems: 'center',
    paddingVertical: 4,
  },
  name: { 
    fontSize: FONT_SIZES.xxl - 2, 
    fontWeight: '850', 
    color: '#1E293B' 
  },
  pencilIcon: {
    marginLeft: SPACING.xs + 2,
  },
  email: { 
    fontSize: FONT_SIZES.md, 
    color: '#64748B', 
    marginTop: 2,
    fontWeight: '600' 
  },
  memberSince: { 
    fontSize: FONT_SIZES.sm, 
    color: '#94A3B8', 
    marginTop: SPACING.xs,
    fontWeight: '500' 
  },
  editNameRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: SPACING.sm 
  },
  nameInput: { 
    fontSize: FONT_SIZES.xl, 
    fontWeight: '800', 
    color: '#1E293B', 
    borderBottomWidth: 2, 
    borderBottomColor: '#0A60FF', 
    paddingVertical: SPACING.xs, 
    minWidth: 150, 
    textAlign: 'center' 
  },
  saveIcon: { 
    marginLeft: SPACING.xs 
  },
  statsSection: { 
    marginBottom: SPACING.xl 
  },
  sectionTitle: { 
    fontSize: FONT_SIZES.lg, 
    fontWeight: '800', 
    color: '#1E293B', 
    marginBottom: SPACING.md 
  },
  statsRow: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoCard: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 20, 
    padding: SPACING.lg 
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
  infoRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: SPACING.sm 
  },
  infoIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContent: { 
    marginLeft: SPACING.md 
  },
  infoLabel: { 
    fontSize: 11, 
    color: '#94A3B8',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  infoValue: { 
    fontSize: FONT_SIZES.md - 1, 
    fontWeight: '700', 
    color: '#1E293B', 
    marginTop: 2 
  },
  separator: { 
    height: 1, 
    backgroundColor: '#F1F5F9', 
    marginVertical: SPACING.xs 
  },
  logoutBtn: {
    backgroundColor: '#EF4444',
    borderRadius: 26,
    height: 52,
    paddingVertical: 0,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 4,
    marginTop: SPACING.xl,
  },
});

export default ProfileScreen;
