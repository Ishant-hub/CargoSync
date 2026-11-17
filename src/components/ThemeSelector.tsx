import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';

export default function ThemeSelector() {
  const { theme, isDark, setScheme } = useTheme();

  const options: { mode: 'light' | 'dark' | 'system'; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { mode: 'light', label: 'Light', icon: 'sunny-outline' },
    { mode: 'dark', label: 'Dark', icon: 'moon-outline' },
    { mode: 'system', label: 'System', icon: 'phone-portrait-outline' },
  ];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surfacePressed,
          borderColor: theme.colors.borderLight,
        },
      ]}
    >
      {options.map((option) => {
        const isSelected = isDark === true && option.mode === 'dark' || isDark === false && option.mode === 'light' || option.mode === 'system';
        return (
          <TouchableOpacity
            key={option.mode}
            activeOpacity={0.8}
            onPress={() => setScheme?.(option.mode)}
            style={[
              styles.optionButton,
              isSelected && {
                backgroundColor: theme.colors.cardBackground,
                ...theme.shadows.sm,
              },
            ]}
          >
            <Ionicons
              name={option.icon}
              size={16}
              color={isSelected ? theme.colors.accent : theme.colors.textSecondary}
            />
            <Text
              style={[
                styles.optionLabel,
                {
                  color: isSelected ? theme.colors.textPrimary : theme.colors.textSecondary,
                  fontWeight: isSelected ? '700' : '500',
                },
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  optionLabel: {
    fontSize: 13,
  },
});
