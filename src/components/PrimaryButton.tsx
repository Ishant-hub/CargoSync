/**
 * PrimaryButton — Main CTA button with brand accent color.
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  /** Ionicons name (string) or a custom React node */
  icon?: keyof typeof Ionicons.glyphMap | React.ReactNode;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}) => {
  const { theme } = useTheme();
  const { colors, radii, spacing, typography: typo } = theme;

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: isDisabled ? colors.disabled : colors.accent,
          borderRadius: radii.md,
          paddingVertical: spacing.lg,
          paddingHorizontal: spacing.xxl,
        },
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} size="small" />
      ) : (
        <>
          {icon && (
            <>
              {typeof icon === 'string' ? (
                <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={18} color={colors.white} />
              ) : (
                icon
              )}
            </>
          )}
          <Text
            style={[
              styles.text,
              {
                color: isDisabled ? colors.disabled : colors.white,
                fontSize: typo.size.md,
                fontWeight: typo.weight.semibold,
                marginLeft: icon ? spacing.sm : 0,
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  text: {
    letterSpacing: 0.3,
  },
});

export default PrimaryButton;
