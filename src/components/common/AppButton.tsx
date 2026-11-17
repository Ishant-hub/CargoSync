import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Animated,
} from 'react-native';
import { Colors, FontFamily, Radius, TouchTargets, Spacing } from '../../theme/tokens';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const AppButton: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = true,
  style,
  textStyle,
  leftIcon,
  rightIcon,
}) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 50,
      bounciness: 0,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 0,
    }).start();
  };

  const containerStyle: ViewStyle[] = [
    styles.base,
    styles[variant],
    styles[`size_${size}`],
    fullWidth ? styles.fullWidth : null,
    disabled ? styles.disabled : null,
    style,
  ].filter(Boolean) as ViewStyle[];

  const resolvedLabelStyle: TextStyle[] = [
    styles.label,
    styles[`label_${variant}`],
    styles[`labelSize_${size}`],
    disabled ? styles.labelDisabled : null,
    textStyle,
  ].filter(Boolean) as TextStyle[];

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }], width: fullWidth ? '100%' : undefined }}>
      <TouchableOpacity
        style={containerStyle}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.9}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        {loading ? (
          <ActivityIndicator
            color={variant === 'primary' ? Colors.white : Colors.primaryAmber}
            size="small"
          />
        ) : (
          <>
            {leftIcon}
            <Text style={resolvedLabelStyle}>{label}</Text>
            {rightIcon}
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderRadius: Radius.xs,
    minHeight: TouchTargets.buttonHeight,
    paddingHorizontal: Spacing.xl,
  },
  fullWidth: { width: '100%' },

  // Variants
  primary: {
    backgroundColor: Colors.primaryAmber,
  },
  secondary: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  destructive: {
    backgroundColor: Colors.errorBg,
    borderWidth: 1.5,
    borderColor: Colors.error,
  },
  ghost: {
    backgroundColor: Colors.transparent,
  },
  outline: {
    backgroundColor: Colors.transparent,
    borderWidth: 1.5,
    borderColor: Colors.primaryAmber,
  },

  // Disabled
  disabled: { opacity: 0.4 },

  // Sizes
  size_sm: { minHeight: 36, paddingHorizontal: Spacing.lg },
  size_md: { minHeight: TouchTargets.buttonHeight, paddingHorizontal: Spacing.xl },
  size_lg: { minHeight: 56, paddingHorizontal: 28 },

  // Labels
  label: {
    fontFamily: FontFamily.semiBold,
    fontSize: 15,
    letterSpacing: 0.1,
  },
  label_primary: { color: Colors.white },
  label_secondary: { color: Colors.onSurface },
  label_destructive: { color: Colors.errorText },
  label_ghost: { color: Colors.onSurface },
  label_outline: { color: Colors.primaryAmber },
  labelDisabled: { opacity: 0.6 },

  labelSize_sm: { fontSize: 13 },
  labelSize_md: { fontSize: 15 },
  labelSize_lg: { fontSize: 16 },
});

// Convenience exports matching Stitch naming
export const PrimaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <AppButton {...props} variant="primary" />
);
export const SecondaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <AppButton {...props} variant="secondary" />
);
export const DestructiveButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <AppButton {...props} variant="destructive" />
);
export const GhostButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <AppButton {...props} variant="ghost" />
);
export const OutlineButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <AppButton {...props} variant="outline" />
);

