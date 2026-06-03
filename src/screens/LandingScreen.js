/**
 * LandingScreen
 *
 * Welcome/Introductory screen matching the 3D claymorphic UI mockup design.
 * Features:
 *   - Gradient background effect with curved design
 *   - Custom 3D claymorphic illustrations for header & footer
 *   - High-fidelity lists of core app features with custom colored boxes & chevrons
 *   - Large premium styled buttons for Auth stack traversal
 *   - Privacy indicator at the footer
 */

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, ScrollView, Dimensions, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../components/CustomButton';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS } from '../theme/theme';

const { width } = Dimensions.get('window');

const LandingScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      {/* Curved background decoration */}
      <View style={styles.backgroundWave} />

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header 3D Illustration */}
        <View style={styles.artContainer}>
          <Image 
            source={require('../../assets/welcome_header_art.png')} 
            style={styles.headerArt} 
            resizeMode="contain" 
          />
        </View>

        {/* App Branding */}
        <View style={styles.headerTextGroup}>
          <Text style={styles.appNameDark}>
            Smart Student <Text style={styles.appNameBlue}>Planner</Text>
          </Text>
          
          {/* Wave Divider Shape */}
          <View style={styles.waveDividerContainer}>
            <View style={styles.waveBar} />
          </View>
          
          <Text style={styles.subtitle}>Organise your academic life 🎓</Text>
        </View>

        {/* Rounded Features Card */}
        <View style={styles.featuresCard}>
          {/* Feature 1 */}
          <View style={styles.featureRow}>
            <View style={[styles.iconContainer, styles.greenTint]}>
              <Ionicons name="checkbox" size={22} color="#10B981" />
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Track tasks, homework, and exams</Text>
              <Text style={styles.featureSubtitle}>Stay on top of everything that matters.</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#10B981" style={styles.chevron} />
          </View>

          <View style={styles.rowDivider} />

          {/* Feature 2 */}
          <View style={styles.featureRow}>
            <View style={[styles.iconContainer, styles.purpleTint]}>
              <Ionicons name="book" size={22} color="#8B5CF6" />
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Organise by university modules</Text>
              <Text style={styles.featureSubtitle}>Keep your subjects and deadlines organised.</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#8B5CF6" style={styles.chevron} />
          </View>

          <View style={styles.rowDivider} />

          {/* Feature 3 */}
          <View style={styles.featureRow}>
            <View style={[styles.iconContainer, styles.orangeTint]}>
              <Ionicons name="notifications" size={22} color="#F59E0B" />
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Never miss a deadline</Text>
              <Text style={styles.featureSubtitle}>Smart notifications keep you ahead.</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#F59E0B" style={styles.chevron} />
          </View>
        </View>

        {/* Interactive Auth Action Buttons */}
        <View style={styles.actions}>
          <CustomButton
            title="Sign In"
            onPress={() => navigation.navigate('Login')}
            icon="log-in-outline"
            style={styles.signInButton}
            size="lg"
          />

          <CustomButton
            title="Create Account"
            onPress={() => navigation.navigate('Register')}
            icon="person-add-outline"
            variant="outline"
            style={styles.registerButton}
            size="lg"
          />

          {/* Security & Privacy Badge */}
          <View style={styles.privacyContainer}>
            <Ionicons name="shield-checkmark" size={16} color="#0A60FF" />
            <Text style={styles.privacyText}>Your data is secure and private</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F6FD',
  },
  backgroundWave: {
    position: 'absolute',
    top: -width * 0.5,
    left: -width * 0.25,
    width: width * 1.5,
    height: width * 1.4,
    borderRadius: width * 0.75,
    backgroundColor: '#E4EDFF',
    zIndex: -1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xxl,
  },
  artContainer: {
    alignItems: 'center',
    marginTop: Platform.OS === 'android' ? 20 : 10,
    justifyContent: 'center',
  },
  headerArt: {
    width: width * 0.9,
    height: width * 0.75,
  },
  headerTextGroup: {
    alignItems: 'center',
    marginTop: -SPACING.sm,
    marginBottom: SPACING.lg,
  },
  appNameDark: {
    fontSize: FONT_SIZES.xxl + 4,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  appNameBlue: {
    color: '#0A60FF',
  },
  waveDividerContainer: {
    marginVertical: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waveBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#0A60FF',
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: '#475569',
    fontWeight: '600',
    textAlign: 'center',
  },
  featuresCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.md + 4,
    shadowColor: '#0A60FF',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.08,
    shadowRadius: 30,
    elevation: 8,
    marginBottom: SPACING.xl,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  greenTint: {
    backgroundColor: '#EAFDF4',
  },
  purpleTint: {
    backgroundColor: '#F5F2FF',
  },
  orangeTint: {
    backgroundColor: '#FFF8E6',
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: FONT_SIZES.md - 1,
    fontWeight: '700',
    color: '#1E293B',
  },
  featureSubtitle: {
    fontSize: FONT_SIZES.sm - 1,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  chevron: {
    marginLeft: SPACING.xs,
  },
  rowDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 60,
  },
  actions: {
    width: '100%',
  },
  signInButton: {
    backgroundColor: '#0A60FF',
    borderRadius: 26,
    height: 52,
    paddingVertical: 0,
    shadowColor: '#0A60FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  registerButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#0A60FF',
    borderRadius: 26,
    height: 52,
    paddingVertical: 0,
    marginTop: SPACING.md,
  },
  privacyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.lg,
  },
  privacyText: {
    fontSize: FONT_SIZES.xs + 1,
    color: '#64748B',
    marginLeft: SPACING.xs,
    fontWeight: '600',
  },
});

export default LandingScreen;
