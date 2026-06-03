/**
 * RegisterScreen
 *
 * Account creation screen with full form validation and interactive state feedback.
 * Features:
 *   - Curved branding background decoration
 *   - Fields: Full Name, Email, Password, Confirm Password
 *   - Active focus status styling on all inputs
 *   - Rounded card layout, custom buttons, and smooth inputs
 */

import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, KeyboardAvoidingView,
  Platform, ScrollView, TouchableOpacity, Dimensions, StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import CustomButton from '../components/CustomButton';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS } from '../theme/theme';

const { width } = Dimensions.get('window');

const RegisterScreen = ({ navigation }) => {
  const { register, clearError } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  // Active focus states for inputs
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);

  const handleRegister = async () => {
    clearError();
    setFieldErrors({});
    setLoading(true);

    const result = await register(name, email, password, confirmPassword);
    if (!result.success) {
      setFieldErrors(result.errors);
    }
    setLoading(false);
  };

  // Custom rendered input with active focus and styling states
  const renderInput = (label, value, setter, placeholder, icon, focusedState, setFocusedState, options = {}) => {
    const { secure, keyboardType, errorKey, autoCapitalize } = options;
    const isError = !!fieldErrors[errorKey];

    return (
      <View style={styles.inputGroup}>
        <Text style={styles.label}>{label}</Text>
        <View style={[
          styles.inputContainer, 
          isError && styles.inputError,
          focusedState && styles.inputFocused
        ]}>
          <Ionicons 
            name={icon} 
            size={18} 
            color={focusedState ? '#0A60FF' : COLORS.textTertiary} 
            style={styles.inputIcon} 
          />
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={(text) => { setter(text); setFieldErrors((e) => ({ ...e, [errorKey]: null })); }}
            onFocus={() => setFocusedState(true)}
            onBlur={() => setFocusedState(false)}
            placeholder={placeholder}
            placeholderTextColor={COLORS.textTertiary}
            secureTextEntry={secure && !showPassword}
            keyboardType={keyboardType || 'default'}
            autoCapitalize={autoCapitalize || 'none'}
            autoCorrect={false}
          />
          {secure && (
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons 
                name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                size={20} 
                color={COLORS.textTertiary} 
              />
            </TouchableOpacity>
          )}
        </View>
        {isError && <Text style={styles.fieldError}>{fieldErrors[errorKey]}</Text>}
      </View>
    );
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
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('Landing')} style={styles.logoCircle}>
            <Ionicons name="person-add" size={36} color="#0A60FF" />
          </TouchableOpacity>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join Smart Student Planner 🎓</Text>
        </View>

        {/* Form */}
        <View style={[styles.formCard, styles.elevationCard]}>
          {fieldErrors.general && (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={18} color={COLORS.danger} />
              <Text style={styles.errorBannerText}>{fieldErrors.general}</Text>
            </View>
          )}

          {renderInput('Full Name', name, setName, 'John Doe', 'person-outline', nameFocused, setNameFocused, { errorKey: 'name', autoCapitalize: 'words' })}
          {renderInput('Email', email, setEmail, 'you@university.ac.uk', 'mail-outline', emailFocused, setEmailFocused, { keyboardType: 'email-address', errorKey: 'email' })}
          {renderInput('Password', password, setPassword, 'Min. 6 characters', 'lock-closed-outline', passwordFocused, setPasswordFocused, { secure: true, errorKey: 'password' })}
          {renderInput('Confirm Password', confirmPassword, setConfirmPassword, 'Re-enter password', 'lock-closed-outline', confirmFocused, setConfirmFocused, { secure: true, errorKey: 'confirmPassword' })}

          <CustomButton
            title="Create Account"
            onPress={handleRegister}
            loading={loading}
            disabled={!name || !email || !password || !confirmPassword}
            icon="checkmark-circle-outline"
            style={styles.createBtn}
            size="lg"
          />

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Sign In</Text>
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
    backgroundColor: '#F3F6FD' 
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
    paddingVertical: SPACING.xxxl 
  },
  header: { 
    alignItems: 'center', 
    marginBottom: SPACING.xl 
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
  title: { 
    fontSize: FONT_SIZES.xxl, 
    fontWeight: '800', 
    color: '#1E293B' 
  },
  subtitle: { 
    fontSize: FONT_SIZES.md, 
    color: '#475569', 
    marginTop: SPACING.xs,
    fontWeight: '600'
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
    fontWeight: '600'
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
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1.5, 
    borderColor: COLORS.border, 
    borderRadius: 14, 
    paddingHorizontal: SPACING.md, 
    paddingVertical: Platform.OS === 'ios' ? SPACING.md : SPACING.sm + 2, 
    backgroundColor: '#F8FAFC' 
  },
  inputFocused: {
    borderColor: '#0A60FF',
    backgroundColor: '#FFFFFF',
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
  createBtn: {
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
  loginRow: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginTop: SPACING.xl 
  },
  loginText: { 
    fontSize: FONT_SIZES.md, 
    color: '#64748B',
    fontWeight: '500'
  },
  loginLink: { 
    fontSize: FONT_SIZES.md, 
    fontWeight: '700', 
    color: '#0A60FF' 
  },
});

export default RegisterScreen;
