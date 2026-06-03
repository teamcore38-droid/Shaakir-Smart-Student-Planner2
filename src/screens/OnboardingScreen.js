/**
 * OnboardingScreen
 *
 * Implements a premium sliding introduction flow for first-time users.
 * Features:
 *   - Paging horizontal slider with animated pagination indicator dots
 *   - Clean, modern layout using theme guidelines (Apple HIG-inspired)
 *   - "Skip" option and responsive button transitions
 *   - AsyncStorage persistence via StorageService to bypass after completion
 */

import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, Dimensions, ScrollView,
  TouchableOpacity, SafeAreaView, Platform, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StorageService from '../services/StorageService';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../theme/theme';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: 1,
    icon: 'calendar-outline',
    title: 'Academic Organization',
    description: 'Effortlessly manage your class schedule, homework assignments, exams, and projects all in one modern workspace.',
    accent: COLORS.primary,
  },
  {
    id: 2,
    icon: 'stats-chart-outline',
    title: 'Progress Tracking',
    description: 'Categorize tasks by university modules, view your completion rates, and stay motivated as you watch your tasks decrease.',
    accent: COLORS.secondary,
  },
  {
    id: 3,
    icon: 'notifications-outline',
    title: 'Stay Notified',
    description: 'Never miss a deadline. Set priorities and reminders to ensure you always submit your coursework on time.',
    accent: COLORS.danger,
  },
];

const OnboardingScreen = ({ navigation }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef(null);

  const handleScroll = (event) => {
    const scrollOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollOffset / width);
    setActiveIndex(index);
  };

  const handleComplete = async () => {
    // Set the flag in Storage to ensure onboarding is not shown again
    await StorageService.save('@ssp_has_launched', true);
    navigation.replace('Landing');
  };

  const handleNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      scrollViewRef.current?.scrollTo({
        x: (activeIndex + 1) * width,
        animated: true,
      });
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top action row */}
      <View style={styles.topRow}>
        {activeIndex < SLIDES.length - 1 ? (
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.skipPlaceholder} />
        )}
      </View>

      {/* Slide ScrollView */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollContainer}
      >
        {SLIDES.map((slide) => (
          <View key={slide.id} style={styles.slide}>
            <View style={[styles.iconContainer, { backgroundColor: slide.accent + '15' }]}>
              <Ionicons name={slide.icon} size={64} color={slide.accent} />
            </View>
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.description}>{slide.description}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Bottom control row */}
      <View style={styles.bottomRow}>
        {/* Pagination Dots */}
        <View style={styles.paginationContainer}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === activeIndex && styles.activeDot,
                index === activeIndex && { backgroundColor: SLIDES[activeIndex].accent },
              ]}
            />
          ))}
        </View>

        {/* Primary Action Button */}
        <TouchableOpacity
          onPress={handleNext}
          style={[
            styles.primaryButton,
            { backgroundColor: SLIDES[activeIndex].accent },
            SHADOWS.button,
          ]}
        >
          <Text style={styles.buttonText}>
            {activeIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <Ionicons
            name={activeIndex === SLIDES.length - 1 ? 'arrow-forward' : 'chevron-forward'}
            size={18}
            color={COLORS.white}
            style={styles.buttonIcon}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topRow: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: SPACING.xxl,
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  skipButton: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
  },
  skipText: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.textSecondary,
  },
  skipPlaceholder: {
    width: 40,
    height: 20,
  },
  scrollContainer: {
    flex: 1,
  },
  slide: {
    width: width,
    paddingHorizontal: SPACING.xxxl,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: height * 0.1,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xxxl,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  description: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomRow: {
    paddingHorizontal: SPACING.xxxl,
    paddingBottom: SPACING.xxxl,
    alignItems: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.xs,
  },
  activeDot: {
    width: 24,
    borderRadius: 4,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xxxl,
    borderRadius: BORDER_RADIUS.lg,
    width: '100%',
    minHeight: 52,
  },
  buttonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.white,
  },
  buttonIcon: {
    marginLeft: SPACING.xs,
  },
});

export default OnboardingScreen;
