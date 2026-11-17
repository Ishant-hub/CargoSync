/**
 * StatCard — Dashboard stat card with icon, value, and label.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';

interface StatCardProps {
  label?: string;
  title?: string;
  value: string | number;
  icon: keyof typeof Ionicons.glyphMap;
  color?: string;
  subtitle?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | string;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  title,
  value,
  icon,
  color,
  subtitle,
  change,
  changeType = 'positive',
}) => {
  const { theme } = useTheme();
  const { colors, radii, spacing, typography: typo, shadows: shadowTokens } = theme;

  const displayText = label || title || '';
  const accentColor = color || colors.accent;

  return (
    <View
      style={[
        styles.card,
        shadowTokens.sm,
        {
          backgroundColor: colors.cardBackground,
          borderRadius: radii.lg,
          padding: spacing.lg,
          borderWidth: 1,
          borderColor: colors.cardBorder,
        },
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: accentColor + '18',
            borderRadius: radii.sm,
            width: 36,
            height: 36,
          },
        ]}
      >
        <Ionicons name={icon} size={18} color={accentColor} />
      </View>
      <Text
        style={[
          styles.value,
          {
            color: colors.textPrimary,
            fontSize: typo.size.xl,
            fontWeight: typo.weight.bold,
            marginTop: spacing.md,
          },
        ]}
      >
        {value}
      </Text>
      <Text
        style={[
          styles.label,
          {
            color: colors.textSecondary,
            fontSize: typo.size.xs,
            fontWeight: typo.weight.medium,
            marginTop: spacing.xs,
          },
        ]}
      >
        {displayText}
      </Text>
      {subtitle && (
        <Text
          style={{
            color: colors.textTertiary,
            fontSize: typo.size.xs,
            marginTop: spacing.xs,
          }}
        >
          {subtitle}
        </Text>
      )}
      {change && (
        <Text
          style={{
            color: changeType === 'negative' ? colors.error : colors.success,
            fontSize: 10,
            fontWeight: '600',
            marginTop: spacing.xs,
          }}
        >
          {change}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 100,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    letterSpacing: -0.5,
  },
  label: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default StatCard;
