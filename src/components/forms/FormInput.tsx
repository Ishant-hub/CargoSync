import React, { useRef, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  TextInputProps, ViewStyle, Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, FontFamily, Radius, Spacing, Shadows } from '../../theme/tokens';

interface FormInputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: keyof typeof MaterialIcons.glyphMap;
  rightIcon?: keyof typeof MaterialIcons.glyphMap;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  required?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  required,
  ...inputProps
}) => {
  const [focused, setFocused] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setFocused(true);
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: false,
    }).start();
    inputProps.onFocus?.({} as any);
  };

  const handleBlur = () => {
    setFocused(false);
    Animated.timing(borderAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
    inputProps.onBlur?.({} as any);
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [error ? Colors.error : Colors.border, error ? Colors.error : Colors.focusRing],
  });

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          {required && <Text style={styles.required}> *</Text>}
        </View>
      )}

      <Animated.View
        style={[
          styles.inputWrap,
          { borderColor },
          focused && Shadows.tier1,
        ]}
      >
        {leftIcon && (
          <MaterialIcons
            name={leftIcon}
            size={18}
            color={focused ? Colors.primaryAmber : Colors.placeholder}
            style={styles.leftIcon}
          />
        )}

        <TextInput
          {...inputProps}
          style={[styles.input, leftIcon && styles.inputWithLeftIcon, inputProps.style]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={Colors.placeholder}
          selectionColor={Colors.primaryAmber}
        />

        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={styles.rightIconBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <MaterialIcons
              name={rightIcon}
              size={18}
              color={Colors.muted}
            />
          </TouchableOpacity>
        )}
      </Animated.View>

      {error ? (
        <View style={styles.errorRow}>
          <MaterialIcons name="error-outline" size={12} color={Colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : hint ? (
        <Text style={styles.hintText}>{hint}</Text>
      ) : null}
    </View>
  );
};

// ─── OTP INPUT ───────────────────────────────────────────────────────────────

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (val: string) => void;
}

export const OtpInput: React.FC<OtpInputProps> = ({ length = 6, value, onChange }) => {
  const inputRefs = useRef<TextInput[]>([]);
  const digits = value.split('').concat(Array(length).fill('')).slice(0, length);

  const handleChange = (text: string, idx: number) => {
    const newDigits = [...digits];
    newDigits[idx] = text.slice(-1);
    const newValue = newDigits.join('');
    onChange(newValue);
    if (text && idx < length - 1) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, idx: number) => {
    if (key === 'Backspace' && !digits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  return (
    <View style={otpStyles.row}>
      {digits.map((d, i) => (
        <TextInput
          key={i}
          ref={ref => { if (ref) inputRefs.current[i] = ref; }}
          style={[otpStyles.box, d ? otpStyles.boxFilled : null]}
          value={d}
          onChangeText={text => handleChange(text, i)}
          onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
          keyboardType="numeric"
          maxLength={1}
          selectionColor={Colors.primaryAmber}
          textAlign="center"
          accessibilityLabel={`OTP digit ${i + 1}`}
        />
      ))}
    </View>
  );
};

const otpStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
    justifyContent: 'center',
  },
  box: {
    width: 48,
    height: 56,
    borderRadius: Radius.xs,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    fontFamily: FontFamily.bold,
    fontSize: 22,
    color: Colors.onSurface,
    textAlign: 'center',
  },
  boxFilled: {
    borderColor: Colors.primaryAmber,
    backgroundColor: '#FFF7ED',
  },
});

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  labelRow: {
    flexDirection: 'row',
    marginBottom: Spacing.xs,
  },
  label: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: Colors.onSurface,
    letterSpacing: 0.1,
  },
  required: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: Colors.error,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderRadius: Radius.xs,
    minHeight: 48,
    overflow: 'hidden',
  },
  leftIcon: {
    marginLeft: Spacing.md,
    marginRight: Spacing.xs,
  },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: Spacing.md,
    fontFamily: FontFamily.regular,
    fontSize: 15,
    color: Colors.onSurface,
  },
  inputWithLeftIcon: {
    paddingLeft: 0,
  },
  rightIconBtn: {
    padding: Spacing.md,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  errorText: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.error,
  },
  hintText: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.muted,
    marginTop: 4,
  },
});

