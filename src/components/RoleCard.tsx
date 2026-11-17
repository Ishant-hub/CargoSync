import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { UserRole } from '../types';

interface RoleCardProps {
  role: UserRole;
  title: string;
  subtitle: string;
  iconName: keyof typeof Ionicons.glyphMap;
  badgeText: string;
  selected?: boolean;
  onPress: () => void;
}

export default function RoleCard({
  title,
  subtitle,
  iconName,
  badgeText,
  selected = false,
  onPress,
}: RoleCardProps) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: selected ? theme.colors.accentSurface : theme.colors.cardBackground,
          borderColor: selected ? theme.colors.accent : theme.colors.cardBorder,
          ...theme.shadows.md,
        },
      ]}
    >
      <View style={styles.topRow}>
        <View
          style={[
            styles.iconWrapper,
            {
              backgroundColor: selected ? theme.colors.accent : theme.colors.surfacePressed,
            },
          ]}
        >
          <Ionicons
            name={iconName}
            size={24}
            color={selected ? '#FFFFFF' : theme.colors.accent}
          />
        </View>

        <View
          style={[
            styles.badge,
            {
              backgroundColor: selected ? theme.colors.accent : theme.colors.surfacePressed,
            },
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              {
                color: selected ? '#FFFFFF' : theme.colors.textSecondary,
              },
            ]}
          >
            {badgeText}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{title}</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          {subtitle}
        </Text>
      </View>

      <View style={styles.footer}>
        <Text
          style={[
            styles.actionText,
            { color: selected ? theme.colors.accent : theme.colors.textTertiary },
          ]}
        >
          {selected ? 'Active Role Selected' : 'Continue as ' + title}
        </Text>
        <Ionicons
          name={selected ? 'checkmark-circle' : 'arrow-forward'}
          size={18}
          color={selected ? theme.colors.accent : theme.colors.textTertiary}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 20,
    marginBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  content: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(150, 150, 150, 0.15)',
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
