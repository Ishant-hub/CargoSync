/**
 * StatusBadge — Colored badge for shipment/trip statuses.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

const statusConfig: Record<string, { label: string; colorKey: 'success' | 'warning' | 'error' | 'info' | 'accent' }> = {
  pending: { label: 'Pending', colorKey: 'warning' },
  assigned: { label: 'Assigned', colorKey: 'info' },
  picked_up: { label: 'Picked Up', colorKey: 'info' },
  in_transit: { label: 'In Transit', colorKey: 'accent' },
  out_for_delivery: { label: 'Out for Delivery', colorKey: 'accent' },
  delivered: { label: 'Delivered', colorKey: 'success' },
  cancelled: { label: 'Cancelled', colorKey: 'error' },
  available: { label: 'Available', colorKey: 'success' },
  on_trip: { label: 'On Trip', colorKey: 'accent' },
  loading: { label: 'Loading', colorKey: 'warning' },
  returning: { label: 'Returning', colorKey: 'info' },
  maintenance: { label: 'Maintenance', colorKey: 'warning' },
  offline: { label: 'Offline', colorKey: 'error' },
  planned: { label: 'Planned', colorKey: 'info' },
  in_progress: { label: 'In Progress', colorKey: 'accent' },
  completed: { label: 'Completed', colorKey: 'success' },
  delayed: { label: 'Delayed', colorKey: 'error' },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const { theme } = useTheme();
  const { colors, radii, spacing, typography: typo } = theme;

  const config = statusConfig[status] || { label: status, colorKey: 'info' as const };
  const bgKey = `${config.colorKey}Light` as keyof typeof colors;
  const bgColor = (colors[bgKey] as string) || colors.infoLight;
  const textColor = colors[config.colorKey] || colors.info;

  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: bgColor,
          borderRadius: radii.full,
          paddingHorizontal: isSmall ? spacing.sm : spacing.md,
          paddingVertical: isSmall ? spacing.xs : spacing.xs,
        },
      ]}
    >
      <View
        style={[
          styles.dot,
          {
            backgroundColor: textColor as string,
            width: isSmall ? 5 : 6,
            height: isSmall ? 5 : 6,
            borderRadius: radii.full,
            marginRight: spacing.xs,
          },
        ]}
      />
      <Text
        style={{
          color: textColor as string,
          fontSize: isSmall ? typo.size.xs : typo.size.sm,
          fontWeight: typo.weight.semibold,
          letterSpacing: 0.2,
        }}
      >
        {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  dot: {},
});

export default StatusBadge;
