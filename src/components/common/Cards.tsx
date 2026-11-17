import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, StyleProp } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, FontFamily, Radius, Spacing, Shadows } from '../../theme/tokens';

// ─── SURFACE CARD ─────────────────────────────────────────────────────────────

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  elevated?: boolean;
  dark?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, style, onPress, elevated, dark }) => {
  const cardStyle = [
    styles.card,
    elevated ? Shadows.tier2 : Shadows.tier1,
    dark && styles.cardDark,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity style={cardStyle} onPress={onPress} activeOpacity={0.85}>
        {children}
      </TouchableOpacity>
    );
  }
  return <View style={cardStyle}>{children}</View>;
};

// ─── KPI / STAT CARD ──────────────────────────────────────────────────────────

interface KpiCardProps {
  label: string;
  value: string;
  unit?: string;
  trend?: { value: string; positive: boolean };
  iconName?: keyof typeof MaterialIcons.glyphMap;
  style?: StyleProp<ViewStyle>;
  dark?: boolean;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label, value, unit, trend, iconName, style, dark,
}) => {
  return (
    <Card style={[styles.kpiCard, style]} elevated dark={dark}>
      <View style={styles.kpiTop}>
        <Text style={[styles.kpiLabel, dark && styles.textOnDark]}>{label}</Text>
        {iconName && (
          <MaterialIcons
            name={iconName}
            size={16}
            color={dark ? 'rgba(255,255,255,0.5)' : Colors.muted}
          />
        )}
      </View>
      <View style={styles.kpiBottom}>
        <Text style={[styles.kpiValue, dark && styles.textOnDark]}>{value}</Text>
        {unit && <Text style={[styles.kpiUnit, dark && styles.mutedOnDark]}>{unit}</Text>}
      </View>
      {trend && (
        <View style={styles.trendRow}>
          <MaterialIcons
            name={trend.positive ? 'trending-up' : 'trending-down'}
            size={12}
            color={trend.positive ? Colors.success : Colors.error}
          />
          <Text style={[
            styles.trendText,
            { color: trend.positive ? Colors.success : Colors.error },
          ]}>
            {trend.value}
          </Text>
        </View>
      )}
    </Card>
  );
};

// ─── HORIZONTAL SCROLL CARDS ──────────────────────────────────────────────────

export const HScrollCard: React.FC<{ children: React.ReactNode; style?: StyleProp<ViewStyle> }> = ({
  children, style,
}) => <Card style={[styles.hScrollCard, style]}>{children}</Card>;

// ─── ALERT / NOTICE CARD ──────────────────────────────────────────────────────

interface AlertCardProps {
  title: string;
  message: string;
  variant?: 'info' | 'success' | 'warning' | 'error';
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
}

const ALERT_CFG = {
  info:    { bg: Colors.infoBg,    border: Colors.info,    icon: 'info' as const,         text: Colors.infoText },
  success: { bg: Colors.successBg, border: Colors.success, icon: 'check-circle' as const, text: Colors.successText },
  warning: { bg: Colors.warningBg, border: Colors.warning, icon: 'warning' as const,       text: Colors.warningText },
  error:   { bg: Colors.errorBg,   border: Colors.error,   icon: 'error' as const,         text: Colors.errorText },
};

export const AlertCard: React.FC<AlertCardProps> = ({
  title, message, variant = 'info', actionLabel, onAction, onDismiss,
}) => {
  const cfg = ALERT_CFG[variant];
  return (
    <View style={[styles.alertCard, { backgroundColor: cfg.bg, borderColor: cfg.border }]}>
      <MaterialIcons name={cfg.icon} size={18} color={cfg.border} style={{ flexShrink: 0, marginTop: 1 }} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.alertTitle, { color: cfg.text }]}>{title}</Text>
        <Text style={styles.alertMsg}>{message}</Text>
        {actionLabel && onAction && (
          <TouchableOpacity onPress={onAction} style={{ marginTop: 6 }}>
            <Text style={[styles.alertAction, { color: cfg.border }]}>{actionLabel}</Text>
          </TouchableOpacity>
        )}
      </View>
      {onDismiss && (
        <TouchableOpacity onPress={onDismiss} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <MaterialIcons name="close" size={16} color={Colors.muted} />
        </TouchableOpacity>
      )}
    </View>
  );
};

// ─── DIVIDER ──────────────────────────────────────────────────────────────────

export const Divider: React.FC<{ style?: ViewStyle }> = ({ style }) => (
  <View style={[styles.divider, style]} />
);

// ─── STYLES ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.sm,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardDark: {
    backgroundColor: Colors.primaryBlack,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  // KPI
  kpiCard: {
    flex: 1,
    padding: Spacing.md,
  },
  kpiTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  kpiLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: 11,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: Colors.muted,
  },
  kpiBottom: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  kpiValue: {
    fontFamily: FontFamily.bold,
    fontSize: 20,
    letterSpacing: 0,
    fontVariant: ['tabular-nums'],
    color: Colors.onSurface,
  },
  kpiUnit: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.muted,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 4,
  },
  trendText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 11,
  },

  textOnDark: { color: Colors.white },
  mutedOnDark: { color: 'rgba(255,255,255,0.5)' },

  hScrollCard: {
    padding: Spacing.md,
    marginRight: Spacing.sm,
    minWidth: 160,
  },

  // Alert
  alertCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radius.sm,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  alertTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    marginBottom: 2,
  },
  alertMsg: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: Colors.muted,
    lineHeight: 18,
  },
  alertAction: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
  },

  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.md,
  },
});

