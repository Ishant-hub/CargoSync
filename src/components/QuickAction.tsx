import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';

interface QuickActionProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline';
}

export default function QuickAction({
  title,
  icon,
  onPress,
  variant = 'secondary',
}: QuickActionProps) {
  const { theme } = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          bg: theme.colors.textPrimary,
          iconColor: theme.colors.surface,
          textColor: theme.colors.surface,
          border: 'transparent',
        };
      case 'accent':
        return {
          bg: theme.colors.accent,
          iconColor: '#FFFFFF',
          textColor: '#FFFFFF',
          border: 'transparent',
        };
      case 'outline':
        return {
          bg: 'transparent',
          iconColor: theme.colors.textPrimary,
          textColor: theme.colors.textPrimary,
          border: theme.colors.border,
        };
      case 'secondary':
      default:
        return {
          bg: theme.colors.surfacePressed,
          iconColor: theme.colors.accent,
          textColor: theme.colors.textPrimary,
          border: theme.colors.borderLight,
        };
    }
  };

  const styleConfig = getVariantStyles();

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: styleConfig.bg,
          borderColor: styleConfig.border,
        },
      ]}
    >
      <Ionicons name={icon} size={18} color={styleConfig.iconColor} />
      <Text style={[styles.title, { color: styleConfig.textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
  },
});
