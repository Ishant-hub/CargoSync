/**
 * CapacityBar — Visual truck capacity indicator.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

interface CapacityBarProps {
  current?: number;
  max?: number;
  usedCapacity?: number;
  totalCapacity?: number;
  unit?: string;
  showLabel?: boolean;
  height?: number;
  label?: string;
}

const CapacityBar: React.FC<CapacityBarProps> = ({
  current,
  max,
  usedCapacity,
  totalCapacity,
  unit = 'T',
  showLabel = true,
  height = 8,
  label,
}) => {
  const { theme } = useTheme();
  const { colors, radii, spacing, typography: typo } = theme;

  const actualCurrent = current !== undefined ? current : usedCapacity !== undefined ? usedCapacity : 0;
  const actualMax = max !== undefined ? max : totalCapacity !== undefined ? totalCapacity : 10;

  const percentage = Math.min((actualCurrent / actualMax) * 100, 100);
  const available = actualMax - actualCurrent;

  const barColor =
    percentage >= 90
      ? colors.error
      : percentage >= 70
      ? colors.accent
      : colors.success;

  return (
    <View style={styles.container}>
      {label && (
        <Text
          style={{
            color: colors.textTertiary,
            fontSize: 10,
            fontWeight: '700',
            letterSpacing: 0.6,
            marginBottom: spacing.xs,
          }}
        >
          {label}
        </Text>
      )}
      {showLabel && (
        <View style={[styles.labelRow, { marginBottom: spacing.sm }]}>
          <Text
            style={{
              color: colors.textPrimary,
              fontSize: typo.size.sm,
              fontWeight: typo.weight.semibold,
            }}
          >
            {actualCurrent}{unit} / {actualMax}{unit}
          </Text>
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: typo.size.xs,
            }}
          >
            {available.toFixed(1)}{unit} available
          </Text>
        </View>
      )}
      <View
        style={[
          styles.trackOuter,
          {
            height,
            backgroundColor: colors.border,
            borderRadius: radii.full,
          },
        ]}
      >
        <View
          style={[
            styles.trackFill,
            {
              width: `${percentage}%`,
              height,
              backgroundColor: barColor,
              borderRadius: radii.full,
            },
          ]}
        />
      </View>
      {showLabel && (
        <Text
          style={{
            color: colors.textTertiary,
            fontSize: typo.size.xs,
            marginTop: spacing.xs,
            textAlign: 'right',
          }}
        >
          {percentage.toFixed(0)}% utilized
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trackOuter: {
    width: '100%',
    overflow: 'hidden',
  },
  trackFill: {},
});

export default CapacityBar;
