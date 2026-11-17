import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, FontFamily, Radius, Spacing } from '../../theme/tokens';

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'amber';

interface StatusBadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  showDot?: boolean;
  showIcon?: boolean;
  style?: ViewStyle;
}

const VARIANT_CONFIG: Record<BadgeVariant, {
  bg: string; text: string; border: string; iconName: keyof typeof MaterialIcons.glyphMap;
}> = {
  success: { bg: Colors.successBg, text: Colors.successText, border: '#A7F3D0', iconName: 'check-circle' },
  warning: { bg: Colors.warningBg, text: Colors.warningText, border: '#FDE68A', iconName: 'warning' },
  error:   { bg: Colors.errorBg,   text: Colors.errorText,   border: '#FECACA', iconName: 'error' },
  info:    { bg: Colors.infoBg,    text: Colors.infoText,    border: '#BFDBFE', iconName: 'info' },
  neutral: { bg: Colors.surfaceContainerLow, text: Colors.muted, border: Colors.border, iconName: 'circle' },
  amber:   { bg: '#FFF7ED', text: '#92400E', border: '#FED7AA', iconName: 'local-shipping' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  label,
  variant = 'neutral',
  size = 'md',
  showDot = true,
  showIcon = false,
  style,
}) => {
  const cfg = VARIANT_CONFIG[variant];
  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        isSmall && styles.badgeSm,
        { backgroundColor: cfg.bg, borderColor: cfg.border },
        style,
      ]}
    >
      {showIcon ? (
        <MaterialIcons name={cfg.iconName} size={isSmall ? 10 : 12} color={cfg.text} />
      ) : showDot ? (
        <View style={[styles.dot, { backgroundColor: cfg.text }]} />
      ) : null}
      <Text style={[styles.text, isSmall && styles.textSm, { color: cfg.text }]}>
        {label}
      </Text>
    </View>
  );
};

/** Uppercase telemetry badge — LABEL SM style with status dot */
interface TelemetryBadgeProps {
  label: string;
  status?: 'live' | 'offline' | 'idle';
  style?: ViewStyle;
}

export const TelemetryBadge: React.FC<TelemetryBadgeProps> = ({
  label,
  status = 'live',
  style,
}) => {
  const dotColor = status === 'live' ? Colors.success : status === 'idle' ? Colors.warning : Colors.muted;
  return (
    <View style={[styles.telemetry, style]}>
      <View style={[styles.liveIndicator, { backgroundColor: dotColor }]} />
      <Text style={styles.telemetryText}>{label.toUpperCase()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.xs,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  badgeSm: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
    letterSpacing: 0.1,
  },
  textSm: {
    fontSize: 10,
  },

  telemetry: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  liveIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  telemetryText: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    letterSpacing: 0.5,
    color: Colors.muted,
  },
});

