/**
 * SecondaryButton — Outlined/subtle button for secondary actions.
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';

interface SecondaryButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  /** Ionicons name (string) or a custom React node */
  icon?: keyof typeof Ionicons.glyphMap | React.ReactNode;
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  title,
  onPress,
  disabled = false,
  style,
  textStyle,
  icon,
}) => {
  const { theme } = useTheme();
  const { colors, radii, spacing, typography: typo } = theme;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          borderColor: disabled ? colors.disabled : colors.border,
          borderRadius: radii.md,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.xl,
          backgroundColor: 'transparent',
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {icon && (
        <>
          {typeof icon === 'string' ? (
            <Ionicons
              name={icon as keyof typeof Ionicons.glyphMap}
              size={16}
              color={disabled ? colors.disabled : colors.textPrimary}
            />
          ) : (
            icon
          )}
        </>
      )}
      <Text
        style={[
          styles.text,
          {
            color: disabled ? colors.disabled : colors.textPrimary,
            fontSize: typo.size.sm,
            fontWeight: typo.weight.medium,
            marginLeft: icon ? spacing.sm : 0,
          },
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    minHeight: 44,
  },
  text: {
    letterSpacing: 0.2,
  },
});

export default SecondaryButton;
