/**
 * OptimizationCard — The signature CargoSync feature card.
 * Displays consolidation opportunity with capacity, compatible shipments, and savings.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { OptimizationOpportunity } from '../types';

interface OptimizationCardProps {
  opportunity: OptimizationOpportunity;
  onReview?: () => void;
  onApply?: (id: string) => void;
  compact?: boolean;
  index?: number;
}

const OptimizationCard: React.FC<OptimizationCardProps> = ({
  opportunity,
  onReview,
  onApply,
  compact = false,
}) => {
  const { theme } = useTheme();
  const { colors, radii, spacing, typography: typo, shadows: shadowTokens } = theme;

  const handleAction = () => {
    if (onApply) {
      onApply(opportunity.id);
    } else if (onReview) {
      onReview();
    }
  };

  return (
    <View
      style={[
        styles.card,
        shadowTokens.md,
        {
          backgroundColor: colors.cardBackground,
          borderRadius: radii.xl,
          borderWidth: 1,
          borderColor: colors.accent + '30',
          overflow: 'hidden',
          marginBottom: 16,
        },
      ]}
    >
      {/* Accent top bar */}
      <View style={[styles.accentBar, { backgroundColor: colors.accent }]} />

      <View style={{ padding: spacing.xl }}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <View
              style={[
                styles.iconBadge,
                {
                  backgroundColor: colors.accentSurface,
                  borderRadius: radii.sm,
                  padding: spacing.sm,
                },
              ]}
            >
              <Ionicons name="flash" size={16} color={colors.accent} />
            </View>
            <View style={{ marginLeft: spacing.md }}>
              <Text
                style={{
                  color: colors.accent,
                  fontSize: typo.size.xs,
                  fontWeight: typo.weight.bold,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                }}
              >
                Smart Consolidation
              </Text>
              <Text
                style={{
                  color: colors.textPrimary,
                  fontSize: typo.size.md,
                  fontWeight: typo.weight.semibold,
                  marginTop: spacing.xs,
                }}
              >
                {opportunity.truckId} · {opportunity.route}
              </Text>
            </View>
          </View>
        </View>

        {/* Stats Row */}
        <View style={[styles.statsRow, { marginTop: spacing.lg }]}>
          <View style={styles.statItem}>
            <Text
              style={{
                color: colors.textTertiary,
                fontSize: typo.size.xs,
              }}
            >
              Available
            </Text>
            <Text
              style={{
                color: colors.textPrimary,
                fontSize: typo.size.lg,
                fontWeight: typo.weight.bold,
              }}
            >
              {opportunity.availableCapacity}T
            </Text>
          </View>

          <View style={[styles.statDivider, { backgroundColor: colors.divider }]} />

          <View style={styles.statItem}>
            <Text style={{ color: colors.textTertiary, fontSize: typo.size.xs }}>
              Compatible
            </Text>
            <Text
              style={{
                color: colors.textPrimary,
                fontSize: typo.size.lg,
                fontWeight: typo.weight.bold,
              }}
            >
              {opportunity.compatibleShipments.length}
            </Text>
          </View>

          <View style={[styles.statDivider, { backgroundColor: colors.divider }]} />

          <View style={styles.statItem}>
            <Text style={{ color: colors.textTertiary, fontSize: typo.size.xs }}>
              Saving
            </Text>
            <Text
              style={{
                color: colors.success,
                fontSize: typo.size.lg,
                fontWeight: typo.weight.bold,
              }}
            >
              ₹{opportunity.totalPotentialSaving.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Utilization comparison */}
        {!compact && (
          <View
            style={[
              styles.utilizationRow,
              {
                backgroundColor: colors.accentSurface,
                borderRadius: radii.md,
                padding: spacing.md,
                marginTop: spacing.lg,
              },
            ]}
          >
            <View style={styles.utilizationItem}>
              <Text style={{ color: colors.textSecondary, fontSize: typo.size.xs }}>
                Current
              </Text>
              <Text
                style={{
                  color: colors.textPrimary,
                  fontSize: typo.size.md,
                  fontWeight: typo.weight.bold,
                }}
              >
                {opportunity.currentUtilization}%
              </Text>
            </View>
            <Ionicons
              name="arrow-forward"
              size={16}
              color={colors.accent}
              style={{ marginHorizontal: spacing.md }}
            />
            <View style={styles.utilizationItem}>
              <Text style={{ color: colors.textSecondary, fontSize: typo.size.xs }}>
                After
              </Text>
              <Text
                style={{
                  color: colors.success,
                  fontSize: typo.size.md,
                  fontWeight: typo.weight.bold,
                }}
              >
                {opportunity.potentialUtilization}%
              </Text>
            </View>
          </View>
        )}

        {/* CTA */}
        {(onReview || onApply) && (
          <TouchableOpacity
            style={[
              styles.ctaButton,
              {
                backgroundColor: colors.accent,
                borderRadius: radii.md,
                paddingVertical: spacing.md,
                marginTop: spacing.lg,
              },
            ]}
            onPress={handleAction}
            activeOpacity={0.85}
          >
            <Ionicons name="git-compare-outline" size={18} color={colors.white} />
            <Text
              style={{
                color: colors.white,
                fontSize: typo.size.sm,
                fontWeight: typo.weight.semibold,
                marginLeft: spacing.sm,
              }}
            >
              Review Consolidation
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {},
  accentBar: {
    height: 3,
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBadge: {},
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 32,
  },
  utilizationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  utilizationItem: {
    alignItems: 'center',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default OptimizationCard;
