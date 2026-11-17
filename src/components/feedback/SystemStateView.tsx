import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, FontFamily, Spacing, Radius, Shadows } from '../../theme/tokens';
import { useLanguage } from '../../context/LanguageContext';

export type SystemStateType = 'empty' | 'loading' | 'error' | 'offline' | 'success';

interface SystemStateViewProps {
  type: SystemStateType;
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
  compact?: boolean;
}

const STATE_CONFIG: Record<SystemStateType, {
  icon: keyof typeof MaterialIcons.glyphMap;
  iconColor: string;
  iconBg: string;
  defaultTitle: string;
  defaultMessage: string;
}> = {
  empty: {
    icon: 'inbox',
    iconColor: Colors.muted,
    iconBg: Colors.surfaceContainerLow,
    defaultTitle: 'Nothing Here Yet',
    defaultMessage: 'Your data will appear here once available.',
  },
  loading: {
    icon: 'sync',
    iconColor: Colors.primaryAmber,
    iconBg: '#FFF7ED',
    defaultTitle: 'Loading',
    defaultMessage: 'Please wait a moment...',
  },
  error: {
    icon: 'error-outline',
    iconColor: Colors.error,
    iconBg: Colors.errorBg,
    defaultTitle: 'Something Went Wrong',
    defaultMessage: 'An error occurred. Please try again.',
  },
  offline: {
    icon: 'wifi-off',
    iconColor: Colors.muted,
    iconBg: Colors.surfaceContainerLow,
    defaultTitle: "You're Offline",
    defaultMessage: 'Check your internet connection and try again.',
  },
  success: {
    icon: 'check-circle',
    iconColor: Colors.success,
    iconBg: Colors.successBg,
    defaultTitle: 'Success!',
    defaultMessage: 'The action was completed successfully.',
  },
};

export const SystemStateView: React.FC<SystemStateViewProps> = ({
  type,
  title,
  message,
  actionLabel,
  onAction,
  style,
  compact = false,
}) => {
  const { t } = useLanguage();
  const cfg = STATE_CONFIG[type];

  // Map to bilingual defaults
  const defaultTitle = type === 'empty'    ? t.noDataTitle
    : type === 'offline'  ? t.offline
    : type === 'error'    ? t.error
    : type === 'loading'  ? t.loading
    : t.successTitle;

  const defaultMsg = type === 'empty'   ? t.noDataMessage
    : type === 'offline' ? t.offlineMessage
    : type === 'error'   ? ''
    : '';

  return (
    <View style={[styles.container, compact && styles.containerCompact, style]}>
      <View style={[styles.iconWrap, { backgroundColor: cfg.iconBg }, compact && styles.iconWrapCompact]}>
        <MaterialIcons
          name={cfg.icon}
          size={compact ? 24 : 40}
          color={cfg.iconColor}
        />
      </View>

      <Text style={[styles.title, compact && styles.titleCompact]}>
        {title ?? defaultTitle}
      </Text>

      <Text style={[styles.message, compact && styles.messageCompact]}>
        {message ?? defaultMsg}
      </Text>

      {actionLabel && onAction && (
        <TouchableOpacity
          onPress={onAction}
          style={[styles.actionBtn, compact && styles.actionBtnCompact]}
          activeOpacity={0.8}
        >
          <Text style={styles.actionText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// ─── SKELETON SHIMMER (simple, no animation lib needed) ──────────────────────

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 16,
  borderRadius = Radius.xs,
  style,
}) => (
  <View
    style={[
      {
        width: width as any,
        height,
        borderRadius,
        backgroundColor: Colors.surfaceContainerHigh,
      },
      style,
    ]}
  />
);

export const CardSkeleton: React.FC<{ style?: ViewStyle }> = ({ style }) => (
  <View style={[skeletonStyles.card, style]}>
    <View style={skeletonStyles.row}>
      <Skeleton width={40} height={40} borderRadius={8} />
      <View style={{ flex: 1, gap: 6 }}>
        <Skeleton width="60%" height={14} />
        <Skeleton width="40%" height={12} />
      </View>
    </View>
    <Skeleton width="100%" height={12} style={{ marginTop: 12 }} />
    <Skeleton width="80%" height={12} style={{ marginTop: 6 }} />
  </View>
);

const skeletonStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.sm,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
    ...Shadows.tier1,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxxl,
    gap: Spacing.md,
  },
  containerCompact: {
    padding: Spacing.xl,
    gap: Spacing.sm,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  iconWrapCompact: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 4,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: 18,
    color: Colors.onSurface,
    textAlign: 'center',
  },
  titleCompact: {
    fontSize: 15,
  },
  message: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    color: Colors.muted,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
  messageCompact: {
    fontSize: 13,
  },
  actionBtn: {
    marginTop: Spacing.md,
    backgroundColor: Colors.primaryAmber,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.xl,
    paddingVertical: 12,
  },
  actionBtnCompact: {
    marginTop: Spacing.sm,
    paddingVertical: 8,
  },
  actionText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    color: Colors.white,
  },
});

