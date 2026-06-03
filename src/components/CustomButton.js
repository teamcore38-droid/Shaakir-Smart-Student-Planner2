/**
 * CustomButton Component
 *
 * A reusable, themed button with multiple variants (primary, secondary, outline, danger).
 * Supports loading state, disabled state, and icon placement.
 * Used across login, task forms, and settings screens.
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../theme/theme';

const CustomButton = ({
  title,
  onPress,
  variant = 'primary',   // 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
  size = 'md',            // 'sm' | 'md' | 'lg'
  icon,                   // Ionicons name (optional)
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = true,
  style,
}) => {
  // Determine background and text colour based on variant
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return { bg: COLORS.primaryLight, text: COLORS.primary, border: 'transparent' };
      case 'outline':
        return { bg: 'transparent', text: COLORS.primary, border: COLORS.primary };
      case 'danger':
        return { bg: COLORS.danger, text: COLORS.textInverse, border: 'transparent' };
      case 'ghost':
        return { bg: 'transparent', text: COLORS.primary, border: 'transparent' };
      default:
        return { bg: COLORS.primary, text: COLORS.textInverse, border: 'transparent' };
    }
  };

  // Size presets
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { paddingV: SPACING.sm, paddingH: SPACING.lg, fontSize: FONT_SIZES.sm };
      case 'lg':
        return { paddingV: SPACING.lg + 2, paddingH: SPACING.xxl, fontSize: FONT_SIZES.lg };
      default:
        return { paddingV: SPACING.md + 2, paddingH: SPACING.xl, fontSize: FONT_SIZES.md };
    }
  };

  const variantStyle = getVariantStyles();
  const sizeStyle = getSizeStyles();
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.75}
      style={[
        styles.button,
        {
          backgroundColor: variantStyle.bg,
          borderColor: variantStyle.border,
          borderWidth: variant === 'outline' ? 1.5 : 0,
          paddingVertical: sizeStyle.paddingV,
          paddingHorizontal: sizeStyle.paddingH,
          width: fullWidth ? '100%' : undefined,
          opacity: isDisabled ? 0.55 : 1,
        },
        variant === 'primary' && SHADOWS.button,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variantStyle.text} />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === 'left' && (
            <Ionicons name={icon} size={sizeStyle.fontSize + 2} color={variantStyle.text} style={styles.iconLeft} />
          )}
          <Text style={[styles.text, { color: variantStyle.text, fontSize: sizeStyle.fontSize }]}>
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <Ionicons name={icon} size={sizeStyle.fontSize + 2} color={variantStyle.text} style={styles.iconRight} />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: FONT_WEIGHTS.semibold,
    letterSpacing: 0.3,
  },
  iconLeft: {
    marginRight: SPACING.sm,
  },
  iconRight: {
    marginLeft: SPACING.sm,
  },
});

export default CustomButton;
