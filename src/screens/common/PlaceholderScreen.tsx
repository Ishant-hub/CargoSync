import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';

interface PlaceholderScreenProps {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  phaseTag: string;
  features: string[];
}

export default function PlaceholderScreen({
  title,
  subtitle,
  icon,
  phaseTag,
  features,
}: PlaceholderScreenProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.colors.cardBackground,
            borderBottomColor: theme.colors.borderLight,
          },
        ]}
      >
        <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>
          {title}
        </Text>
      </View>

      <View style={styles.content}>
        <View
          style={[
            styles.iconWrapper,
            {
              backgroundColor: theme.colors.accentSurface,
              borderColor: theme.colors.accentLight,
            },
          ]}
        >
          <Ionicons name={icon} size={48} color={theme.colors.accent} />
        </View>

        <View
          style={[
            styles.phaseBadge,
            { backgroundColor: theme.colors.surfacePressed },
          ]}
        >
          <Text style={[styles.phaseText, { color: theme.colors.accent }]}>
            {phaseTag}
          </Text>
        </View>

        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{title}</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          {subtitle}
        </Text>

        {/* Feature Preview List */}
        <View
          style={[
            styles.featureCard,
            {
              backgroundColor: theme.colors.cardBackground,
              borderColor: theme.colors.cardBorder,
              ...theme.shadows.sm,
            },
          ]}
        >
          <Text style={[styles.featureHeader, { color: theme.colors.textTertiary }]}>
            PLANNED CAPABILITIES
          </Text>
          {features.map((feat, index) => (
            <View key={index} style={styles.featureItem}>
              <Ionicons
                name="checkmark-circle"
                size={16}
                color={theme.colors.success}
              />
              <Text style={[styles.featureText, { color: theme.colors.textPrimary }]}>
                {feat}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    width: 96,
    height: 96,
    borderRadius: 30,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  phaseBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 12,
  },
  phaseText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    maxWidth: 280,
    marginBottom: 24,
  },
  featureCard: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  featureHeader: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureText: {
    fontSize: 13,
    fontWeight: '500',
  },
});
