import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, FontFamily, Radius, Spacing, Shadows } from '../../theme/tokens';

interface RadioOptionCardProps {
  title: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
  iconName?: keyof typeof MaterialIcons.glyphMap;
  badge?: string;
  style?: ViewStyle;
  disabled?: boolean;
  children?: React.ReactNode;
}

export const RadioOptionCard: React.FC<RadioOptionCardProps> = ({
  title,
  description,
  selected,
  onPress,
  iconName,
  badge,
  style,
  disabled,
  children,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      style={[
        styles.card,
        selected && styles.cardSelected,
        disabled && styles.cardDisabled,
        style,
      ]}
    >
      {/* Radio indicator */}
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected && <View style={styles.radioDot} />}
      </View>

      {/* Icon */}
      {iconName && (
        <View style={[styles.iconWrap, selected && styles.iconWrapSelected]}>
          <MaterialIcons
            name={iconName}
            size={24}
            color={selected ? Colors.primaryAmber : Colors.muted}
          />
        </View>
      )}

      {/* Text */}
      <View style={styles.textWrap}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, selected && styles.titleSelected]}>{title}</Text>
          {badge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          )}
        </View>
        {description && (
          <Text style={styles.description}>{description}</Text>
        )}
        {children}
      </View>
    </TouchableOpacity>
  );
};

/** Expandable sub-option (e.g. Create Company / Join Company under Company card) */
interface SubOptionCardProps {
  title: string;
  description?: string;
  iconName?: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
  style?: ViewStyle;
}

export const SubOptionCard: React.FC<SubOptionCardProps> = ({
  title, description, iconName, onPress, style,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.subCard, style]}
    >
      {iconName && (
        <View style={styles.subIconWrap}>
          <MaterialIcons name={iconName} size={20} color={Colors.primaryAmber} />
        </View>
      )}
      <View style={styles.textWrap}>
        <Text style={styles.subTitle}>{title}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>
      <MaterialIcons name="chevron-right" size={20} color={Colors.muted} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    padding: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: Radius.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    ...Shadows.tier1,
  },
  cardSelected: {
    borderColor: Colors.primaryAmber,
    backgroundColor: '#FFF7ED',
  },
  cardDisabled: {
    opacity: 0.4,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    flexShrink: 0,
  },
  radioSelected: {
    borderColor: Colors.primaryAmber,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primaryAmber,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  iconWrapSelected: {
    backgroundColor: '#FED7AA',
  },
  textWrap: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: 4,
  },
  title: {
    fontFamily: FontFamily.semiBold,
    fontSize: 15,
    color: Colors.onSurface,
  },
  titleSelected: {
    color: Colors.primaryAmber,
  },
  badge: {
    backgroundColor: Colors.primaryAmber,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: Colors.white,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  description: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: Colors.muted,
    lineHeight: 18,
  },

  // Sub-option
  subCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
  },
  subIconWrap: {
    width: 36,
    height: 36,
    borderRadius: Radius.xs,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    color: Colors.onSurface,
  },
});

