/**
 * FormField — Reusable input with label, validation, and error display.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';

interface FormFieldProps extends Omit<TextInputProps, 'style'> {
  label: string;
  error?: string;
  isPassword?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  leftIcon?: keyof typeof Ionicons.glyphMap;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  isPassword = false,
  icon,
  leftIcon,
  ...inputProps
}) => {
  const { theme } = useTheme();
  const { colors, radii, spacing, typography: typo } = theme;
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const displayIcon = leftIcon || icon;

  const borderColor = error
    ? colors.error
    : isFocused
    ? colors.inputBorderFocused
    : colors.inputBorder;

  return (
    <View style={[styles.container, { marginBottom: spacing.lg }]}>
      <Text
        style={[
          styles.label,
          {
            color: error ? colors.error : colors.textSecondary,
            fontSize: typo.size.sm,
            fontWeight: typo.weight.medium,
            marginBottom: spacing.sm,
          },
        ]}
      >
        {label}
      </Text>
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.background,
            borderColor,
            borderRadius: radii.md,
            paddingHorizontal: spacing.lg,
          },
        ]}
      >
        {displayIcon && (
          <Ionicons
            name={displayIcon}
            size={18}
            color={isFocused ? colors.accent : colors.placeholder}
            style={{ marginRight: spacing.sm }}
          />
        )}
        <TextInput
          style={[
            styles.input,
            {
              color: colors.onSurface,
              fontSize: typo.size.md,
            },
          ]}
          placeholderTextColor={colors.placeholder}
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...inputProps}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            hitSlop={{ top: 12, right: 12, bottom: 12, left: 12 }}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.placeholder}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text
          style={[
            styles.error,
            {
              color: colors.error,
              fontSize: typo.size.xs,
              marginTop: spacing.xs,
            },
          ]}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  label: {
    letterSpacing: 0.2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    minHeight: 52,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
  },
  error: {},
});

export default FormField;
