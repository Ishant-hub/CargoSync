import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { Disruption } from '../types';

interface AlertCardProps {
  disruption: Disruption;
  onResolve?: () => void;
  onPress?: () => void;
}

export default function AlertCard({ disruption, onResolve, onPress }: AlertCardProps) {
  const { theme } = useTheme();

  const getSeverityStyle = (severity: Disruption['severity']) => {
    switch (severity) {
      case 'critical':
        return {
          icon: 'alert-circle' as const,
          color: theme.colors.error,
          bg: theme.colors.errorLight,
          label: 'CRITICAL',
        };
      case 'high':
        return {
          icon: 'warning' as const,
          color: theme.colors.warning,
          bg: theme.colors.warningLight,
          label: 'HIGH ALERT',
        };
      case 'medium':
        return {
          icon: 'information-circle' as const,
          color: theme.colors.info,
          bg: theme.colors.infoLight,
          label: 'ATTENTION',
        };
      case 'low':
      default:
        return {
          icon: 'notifications' as const,
          color: theme.colors.textSecondary,
          bg: theme.colors.surfacePressed,
          label: 'NOTICE',
        };
    }
  };

  const styleConfig = getSeverityStyle(disruption.severity);
  const timeDate = new Date(disruption.createdAt || disruption.timestamp || Date.now());

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.cardBackground,
          borderColor: theme.colors.cardBorder,
          ...theme.shadows.sm,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.badgeRow}>
          <View style={[styles.severityBadge, { backgroundColor: styleConfig.bg }]}>
            <Ionicons name={styleConfig.icon} size={14} color={styleConfig.color} />
            <Text style={[styles.severityText, { color: styleConfig.color }]}>
              {styleConfig.label}
            </Text>
          </View>
          <Text style={[styles.typeText, { color: theme.colors.textTertiary }]}>
            {disruption.type.replace('_', ' ')}
          </Text>
        </View>

        <Text style={[styles.timeText, { color: theme.colors.textTertiary }]}>
          {timeDate.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>

      <Text style={[styles.description, { color: theme.colors.textPrimary }]}>
        {disruption.description}
      </Text>

      {/* Impact & Re-optimization resolution banner */}
      <View
        style={[
          styles.resolutionBox,
          {
            backgroundColor: disruption.reoptimizationTriggered
              ? theme.colors.accentSurface
              : theme.colors.surfacePressed,
            borderColor: disruption.reoptimizationTriggered
              ? theme.colors.accentLight
              : theme.colors.borderLight,
          },
        ]}
      >
        <Ionicons
          name={disruption.reoptimizationTriggered ? 'sync' : 'construct-outline'}
          size={16}
          color={disruption.reoptimizationTriggered ? theme.colors.accent : theme.colors.textSecondary}
        />
        <View style={styles.resolutionContent}>
          <Text
            style={[
              styles.resolutionTitle,
              {
                color: disruption.reoptimizationTriggered
                  ? theme.colors.accent
                  : theme.colors.textPrimary,
              },
            ]}
          >
            {disruption.reoptimizationTriggered
              ? 'Auto Re-optimization Active'
              : 'Action Required'}
          </Text>
          <Text style={[styles.resolutionDetail, { color: theme.colors.textSecondary }]}>
            {disruption.impact || 'Corridor delay detected. Alternative paths ready.'}
          </Text>
        </View>
        {onResolve && !disruption.resolved && (
          <TouchableOpacity
            style={[styles.resolveButton, { backgroundColor: theme.colors.accent }]}
            onPress={onResolve}
          >
            <Text style={styles.resolveButtonText}>Re-route</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  severityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  severityText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  timeText: {
    fontSize: 11,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    marginBottom: 12,
  },
  resolutionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  resolutionContent: {
    flex: 1,
  },
  resolutionTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  resolutionDetail: {
    fontSize: 11,
    marginTop: 2,
  },
  resolveButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  resolveButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
