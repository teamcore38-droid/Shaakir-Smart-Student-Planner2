/**
 * LoginScreen
 *
 * Entry point of the application for unauthenticated users.
 * Features:
 *   - Curved branding background decoration
 *   - Email + password input with real-time validation and active focus feedback
 *   - Custom styled inputs, floating cards, and premium primary buttons
 *   - Navigation to RegisterScreen and Landing welcome page
 */

import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, KeyboardAvoidingView,
  Platform, ScrollView, TouchableOpacity, Alert, Dimensions, StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import CustomButton from '../components/CustomButton';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../theme/theme';

const { width } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const { login, error, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  // Active focus states for styling
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleLogin = async () => {
    clearError();
    setFieldErrors({});
    setLoading(true);

    const result = await login(email, password);

    if (!result.success) {
      setFieldErrors(result.errors);
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#F3F6FD" />
      {/* Brand Curve Decoration */}
      <View style={styles.backgroundWave} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Branding header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('Landing')} style={styles.logoCircle}>
            <Ionicons name="book" size={40} color="#0A60FF" />
          </TouchableOpacity>
          <Text style={styles.appName}>Smart Student <Text style={styles.appNameBlue}>Planner</Text></Text>
          <Text style={styles.subtitle}>Organise your academic life 🎓</Text>
        </View>

        {/* Form card */}
        <View style={[styles.formCard, styles.elevationCard]}>
          <Text style={styles.formTitle}>Welcome Back</Text>
          <Text style={styles.formSubtitle}>Sign in to continue</Text>

          {/* General error banner */}
          {fieldErrors.general && (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={18} color={COLORS.danger} />
              <Text style={styles.errorBannerText}>{fieldErrors.general}</Text>
            </View>
          )}

          {/* Email input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={[
              styles.inputContainer, 
              fieldErrors.email && styles.inputError,
              emailFocused && styles.inputFocused
            ]}>
              <Ionicons 
                name="mail-outline" 
                size={18} 
                color={emailFocused ? '#0A60FF' : COLORS.textTertiary} 
                style={styles.inputIcon} 
              />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={(text) => { setEmail(text); setFieldErrors((e) => ({ ...e, email: null })); }}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                placeholder="you@university.ac.uk"
                placeholderTextColor={COLORS.textTertiary}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            {fieldErrors.email && <Text style={styles.fieldError}>{fieldErrors.email}</Text>}
          </View>

          {/* Password input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={[
              styles.inputContainer, 
              fieldErrors.password && styles.inputError,
              passwordFocused && styles.inputFocused
            ]}>
              <Ionicons 
                name="lock-closed-outline" 
                size={18} 
                color={passwordFocused ? '#0A60FF' : COLORS.textTertiary} 
                style={styles.inputIcon} 
              />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={(text) => { setPassword(text); setFieldErrors((e) => ({ ...e, password: null })); }}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                placeholder="Enter your password"
                placeholderTextColor={COLORS.textTertiary}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={COLORS.textTertiary}
                />
              </TouchableOpacity>
            </View>
            {fieldErrors.password && <Text style={styles.fieldError}>{fieldErrors.password}</Text>}
          </View>

          {/* Sign in button */}
          <CustomButton
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            disabled={!email || !password}
            icon="log-in-outline"
            style={styles.signInBtn}
            size="lg"
          />

          {/* Register link */}
          <View style={styles.registerRow}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F6FD',
  },
  backgroundWave: {
    position: 'absolute',
    top: -width * 0.55,
    left: -width * 0.3,
    width: width * 1.35,
    height: width * 1.35,
    borderRadius: width * 0.675,
    backgroundColor: '#E4EDFF',
    zIndex: -1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    shadowColor: '#0A60FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  appName: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '800',
    color: '#1E293B',
  },
  appNameBlue: {
    color: '#0A60FF',
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: '#475569',
    marginTop: SPACING.xs,
    fontWeight: '600',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.xl,
  },
  elevationCard: {
    shadowColor: '#0A60FF',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.06,
    shadowRadius: 28,
    elevation: 6,
  },
  formTitle: {
    fontSize: FONT_SIZES.xl + 2,
    fontWeight: '800',
    color: '#1E293B',
  },
  formSubtitle: {
    fontSize: FONT_SIZES.md,
    color: '#64748B',
    marginTop: SPACING.xs,
    marginBottom: SPACING.xl,
    fontWeight: '500',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.dangerLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  errorBannerText: {
    color: COLORS.danger,
    fontSize: FONT_SIZES.sm,
    marginLeft: SPACING.sm,
    flex: 1,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: SPACING.xs + 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: SPACING.md,
    paddingVertical: Platform.OS === 'ios' ? SPACING.md : SPACING.sm + 2,
    backgroundColor: '#F8FAFC',
  },
  inputFocused: {
    borderColor: '#0A60FF',
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: COLORS.danger,
    backgroundColor: '#FFFDFD',
  },
  inputIcon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: '#1E293B',
    padding: 0,
    fontWeight: '500',
  },
  fieldError: {
    color: COLORS.danger,
    fontSize: FONT_SIZES.xs,
    marginTop: SPACING.xs,
    marginLeft: SPACING.xs,
    fontWeight: '600',
  },
  signInBtn: {
    backgroundColor: '#0A60FF',
    borderRadius: 26,
    height: 52,
    paddingVertical: 0,
    shadowColor: '#0A60FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
    marginTop: SPACING.lg,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.xl,
  },
  registerText: {
    fontSize: FONT_SIZES.md,
    color: '#64748B',
    fontWeight: '500',
  },
  registerLink: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: '#0A60FF',
  },
});

export default LoginScreen;
