/**
 * Theme Configuration - Smart Student Planner
 *
 * Centralised design tokens following Apple HIG-inspired light & clean aesthetic.
 * All colours, spacing, typography, and shadow definitions live here to ensure
 * visual consistency across every screen and component.
 */

export const COLORS = {
  // Primary palette
  primary: '#4A90D9',        // Calm blue — main accent
  primaryLight: '#E8F1FB',   // Tinted background for cards/highlights
  primaryDark: '#2E6DB4',    // Pressed/active state

  // Secondary palette
  secondary: '#6C5CE7',      // Purple — secondary accent
  secondaryLight: '#F0EDFC',

  // Semantic colours
  success: '#00B894',        // Task complete / positive feedback
  successLight: '#E6F9F3',
  warning: '#FDCB6E',        // Medium priority
  warningLight: '#FFF8E7',
  danger: '#E17055',         // High priority / destructive actions
  dangerLight: '#FDEEEA',
  info: '#74B9FF',           // Informational badges

  // Neutrals
  white: '#FFFFFF',
  background: '#F8F9FD',    // App background — soft off-white
  surface: '#FFFFFF',        // Card / elevated surface
  border: '#E8ECF4',        // Subtle dividers
  borderLight: '#F0F2F8',

  // Text hierarchy
  textPrimary: '#1A1D26',   // Headings / primary content
  textSecondary: '#6B7280', // Subtitles / secondary info
  textTertiary: '#9CA3AF',  // Hints / placeholders
  textInverse: '#FFFFFF',   // Text on dark/coloured backgrounds

  // Priority colours
  priorityHigh: '#E17055',
  priorityMedium: '#FDCB6E',
  priorityLow: '#00B894',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const FONT_SIZES = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  display: 40,
};

export const FONT_WEIGHTS = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  heavy: '800',
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const SHADOWS = {
  // Soft elevation for cards
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  // Slightly more prominent for modals / floating elements
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  // Subtle shadow for buttons
  button: {
    shadowColor: '#4A90D9',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
};

export default {
  COLORS,
  SPACING,
  FONT_SIZES,
  FONT_WEIGHTS,
  BORDER_RADIUS,
  SHADOWS,
};
