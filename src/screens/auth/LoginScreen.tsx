import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { Colors, FontFamily, Spacing, Radius } from '../../theme/tokens';
import { PrimaryButton, SecondaryButton } from '../../components/common/AppButton';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { OtpInput } from '../../components/forms/FormInput';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
};

const HERO_IMAGE_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC_-xO-zX2cVS4iLtHyq0x0GUGAUGcwcCHqGfh_nXqqPcp86Pk9KxcOqKpqBYK52ucyk1gDEkWfS11sAbox9wt1oAYkdsfdVVcuVvM2qMXmkle2gxOEsDzX5FnEeueUULVk2U4HQcIklKn6E5JcJ9HQRrvWIbGlWmPhLOL8PzveZWh6oKOyIol4iNssbeloJwMfs-LI36HHzA_8kSaq_iuT6nJH6GitBmB_sf6Km0Q';

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { language, toggleLanguage } = useLanguage();
  const { login } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [useEmail, setUseEmail] = useState(false);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otpMode, setOtpMode] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleContinue = async () => {
    if (useEmail) {
      if (!email || !email.includes('@')) {
        setError('Please enter a valid work email address');
        return;
      }
    } else {
      if (!phone || phone.length < 10) {
        setError('Please enter a valid 10-digit mobile number');
        return;
      }
    }

    if (!otpMode && !password) {
      setError('Please enter your password');
      return;
    }

    if (otpMode && otpCode.length < 6) {
      setError('Please enter the 6-digit verification code');
      return;
    }

    setError('');
    setLoading(true);
    try {
      // Default to shipper or existing account role
      await login(useEmail ? email : phone, 'shipper');
    } catch {
      setError('Failed to authenticate. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerOtp = () => {
    if (!phone || phone.length < 10) {
      setError('Please enter your mobile number first');
      return;
    }
    setError('');
    setOtpMode(true);
    setOtpCode('123456'); // Pre-fill mock OTP for frictionless verification
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              if (otpMode) {
                setOtpMode(false);
              } else {
                navigation.goBack();
              }
            }}
            accessibilityLabel="Go Back"
          >
            <MaterialIcons name="arrow-back" size={22} color="#1A1C1C" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Auth</Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.langPill}
            onPress={toggleLanguage}
            accessibilityLabel="Change Language"
          >
            <MaterialIcons name="language" size={16} color="#1A1C1C" />
            <Text style={styles.langPillText}>
              {language === 'en' ? 'EN | हिंदी' : 'हिंदी | EN'}
            </Text>
          </TouchableOpacity>

          <View style={styles.avatarCircle}>
            <MaterialIcons name="person" size={18} color="#FFFFFF" />
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Banner with Image and Overlay */}
          <View style={styles.heroContainer}>
            <Image
              source={{ uri: HERO_IMAGE_URI }}
              style={styles.heroImage}
              resizeMode="cover"
            />
            <View style={styles.heroGradientRight} />
            <View style={styles.heroGradientBottom} />
            <View style={styles.heroOverlayContent}>
              <View style={styles.heroTagRow}>
                <MaterialIcons name="cell-tower" size={18} color="#FFFFFF" />
                <Text style={styles.heroBrandText}>CargoSync</Text>
              </View>
              <Text style={styles.heroHeadline}>Move Goods.{"\n"}Simply.</Text>
              <Text style={styles.heroSubhead}>
                Book trucks, manage loads and keep shipments moving.
              </Text>
            </View>
          </View>

          {/* Mode Selector: Log In vs Sign Up */}
          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[styles.tabButton, mode === 'login' && styles.tabButtonActive]}
              onPress={() => {
                setMode('login');
                setError('');
              }}
              activeOpacity={0.8}
            >
              <Text
                style={[styles.tabButtonText, mode === 'login' && styles.tabButtonTextActive]}
              >
                Log In
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabButton, mode === 'signup' && styles.tabButtonActive]}
              onPress={() => {
                setMode('signup');
                setError('');
              }}
              activeOpacity={0.8}
            >
              <Text
                style={[styles.tabButtonText, mode === 'signup' && styles.tabButtonTextActive]}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form Content */}
          <View style={styles.formContainer}>
            {/* Input Method Switcher */}
            <View style={styles.labelRow}>
              <Text style={styles.inputLabel}>
                {useEmail ? 'Work Email Address' : 'Mobile Number'}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setUseEmail(!useEmail);
                  setError('');
                }}
              >
                <Text style={styles.toggleMethodText}>
                  {useEmail ? 'Use Mobile Number' : 'Use Email Instead'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Phone or Email Input */}
            {!useEmail ? (
              <View style={styles.phoneInputRow}>
                <View style={styles.countryCodeBox}>
                  <Text style={styles.countryCodeText}>🇮🇳 +91</Text>
                  <MaterialIcons name="keyboard-arrow-down" size={18} color="#7E7576" />
                </View>
                <View style={styles.phoneFieldBox}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="98765 43210"
                    placeholderTextColor="#7E7576"
                    keyboardType="phone-pad"
                    maxLength={10}
                    value={phone}
                    onChangeText={(val) => {
                      setPhone(val);
                      setError('');
                    }}
                  />
                </View>
              </View>
            ) : (
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.textInput}
                  placeholder="dispatcher@cargosync.com"
                  placeholderTextColor="#7E7576"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={(val) => {
                    setEmail(val);
                    setError('');
                  }}
                />
              </View>
            )}

            {/* OTP Mode vs Password Mode */}
            {otpMode ? (
              <View style={styles.otpSection}>
                <Text style={styles.otpPrompt}>
                  Enter the 6-digit verification code sent to +91 {phone}
                </Text>
                <OtpInput value={otpCode} onChange={setOtpCode} length={6} />
              </View>
            ) : (
              <View style={styles.fieldBlock}>
                <View style={styles.labelRow}>
                  <Text style={styles.inputLabel}>Password</Text>
                  <TouchableOpacity onPress={() => {}}>
                    <Text style={styles.forgotLink}>Forgot?</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.passwordInputBox}>
                  <TextInput
                    style={[styles.textInput, { flex: 1 }]}
                    placeholder="Enter secure key"
                    placeholderTextColor="#7E7576"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={(val) => {
                      setPassword(val);
                      setError('');
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                  >
                    <MaterialIcons
                      name={showPassword ? 'visibility-off' : 'visibility'}
                      size={20}
                      color="#5D5F5F"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Sign Up Extra Fields */}
            {mode === 'signup' && (
              <View style={styles.signupExtra}>
                <Text style={styles.inputLabel}>Fleet / Transporter Name</Text>
                <View style={styles.inputBox}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. BlueDart Lines Ltd"
                    placeholderTextColor="#7E7576"
                    value={businessName}
                    onChangeText={setBusinessName}
                  />
                </View>

                <View style={styles.kycTipBox}>
                  <MaterialIcons name="verified-user" size={20} color="#109752" />
                  <Text style={styles.kycTipText}>
                    Fast KYC approval with GST or Motor Carrier (MC) ID.
                  </Text>
                </View>
              </View>
            )}

            {/* Error or Validation Hint */}
            {error ? (
              <View style={styles.errorBox}>
                <MaterialIcons name="error-outline" size={16} color="#BA1A1A" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : (
              <View style={styles.validationHintRow}>
                <MaterialIcons name="check-circle" size={16} color="#68DD8F" />
                <Text style={styles.validationHintText}>
                  {mode === 'login' ? 'Secure Login' : 'Free fleet registration • Instant onboarding'}
                </Text>
              </View>
            )}

            {/* Primary Action Button */}
            <PrimaryButton
              label={mode === 'login' ? 'Continue' : 'Register Carrier'}
              onPress={handleContinue}
              loading={loading}
              size="lg"
              rightIcon={<MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />}
              style={styles.submitBtn}
            />
          </View>

          {/* Operational Splitter */}
          <View style={styles.splitterRow}>
            <View style={styles.splitterLine} />
            <Text style={styles.splitterText}>OR</Text>
            <View style={styles.splitterLine} />
          </View>

          {/* Secondary Methods */}
          <View style={styles.secondaryMethods}>
            {!otpMode && (
              <TouchableOpacity
                style={styles.otpButton}
                onPress={handleTriggerOtp}
                activeOpacity={0.8}
              >
                <MaterialIcons name="sms" size={20} color="#1A1C1C" />
                <Text style={styles.otpButtonText}>Login with Instant OTP</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleContinue}
              activeOpacity={0.8}
            >
              <MaterialIcons name="g-mobiledata" size={24} color="#4285F4" />
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </TouchableOpacity>
          </View>

          {/* Regulatory Terms Footer */}
          <View style={styles.termsFooter}>
            <Text style={styles.termsFooterText}>
              By proceeding, you acknowledge agreement to the{' '}
              <Text style={styles.termsFooterLink}>Terms of Carriage</Text> &{' '}
              <Text style={styles.termsFooterLink}>Carrier Privacy Charter</Text>.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    height: 56,
    paddingHorizontal: Spacing.margin,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(249, 249, 249, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: 18,
    color: '#1A1C1C',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: '#EEEEEE',
  },
  langPillText: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: '#1A1C1C',
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  heroContainer: {
    width: '100%',
    height: 240,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#1B1B1B',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradientRight: {
    ...StyleSheet.absoluteFill as any,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  heroGradientBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
    backgroundColor: 'rgba(249, 249, 249, 0.25)',
  },
  heroOverlayContent: {
    position: 'absolute',
    left: Spacing.margin,
    right: Spacing.margin,
    bottom: Spacing.md,
  },
  heroTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  heroBrandText: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: '#FFFFFF',
  },
  heroHeadline: {
    fontFamily: FontFamily.bold,
    fontSize: 26,
    color: '#FFFFFF',
    lineHeight: 30,
    letterSpacing: -0.5,
  },
  heroSubhead: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  tabBar: {
    marginHorizontal: Spacing.margin,
    marginTop: Spacing.md,
    backgroundColor: '#EEEEEE',
    borderRadius: Radius.full,
    padding: 3,
    flexDirection: 'row',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: Radius.full,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#000000',
  },
  tabButtonText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    color: '#5D5F5F',
  },
  tabButtonTextActive: {
    color: '#FFFFFF',
  },
  formContainer: {
    paddingHorizontal: Spacing.margin,
    paddingTop: Spacing.md,
    gap: Spacing.sm,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    marginTop: 4,
  },
  inputLabel: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: '#1A1C1C',
  },
  toggleMethodText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
    color: '#1A1C1C',
    textDecorationLine: 'underline',
  },
  phoneInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  countryCodeBox: {
    height: 52,
    paddingHorizontal: 12,
    borderRadius: Radius.xs,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E2E2',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  countryCodeText: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: '#1A1C1C',
  },
  phoneFieldBox: {
    flex: 1,
    height: 52,
    paddingHorizontal: 14,
    borderRadius: Radius.xs,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E2E2',
    justifyContent: 'center',
  },
  inputBox: {
    height: 52,
    paddingHorizontal: 14,
    borderRadius: Radius.xs,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E2E2',
    justifyContent: 'center',
  },
  textInput: {
    fontFamily: FontFamily.medium,
    fontSize: 15,
    color: '#1A1C1C',
  },
  fieldBlock: {
    gap: 4,
  },
  forgotLink: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: '#5D5F5F',
  },
  passwordInputBox: {
    height: 52,
    paddingHorizontal: 14,
    borderRadius: Radius.xs,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E2E2',
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeButton: {
    padding: 6,
  },
  signupExtra: {
    gap: 8,
    marginTop: 4,
  },
  kycTipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F4F3F3',
    padding: 10,
    borderRadius: Radius.xs,
  },
  kycTipText: {
    fontFamily: FontFamily.medium,
    fontSize: 11,
    color: '#4C4546',
    flex: 1,
  },
  otpSection: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  otpPrompt: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
    color: '#5D5F5F',
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFDAD6',
    padding: 10,
    borderRadius: Radius.xs,
  },
  errorText: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: '#BA1A1A',
    flex: 1,
  },
  validationHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 2,
  },
  validationHintText: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: '#5D5F5F',
  },
  submitBtn: {
    marginTop: 6,
    backgroundColor: '#000000',
    borderRadius: Radius.xs,
  },
  splitterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.margin,
    marginVertical: Spacing.md,
  },
  splitterLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E2E2',
  },
  splitterText: {
    marginHorizontal: 12,
    fontFamily: FontFamily.semiBold,
    fontSize: 11,
    color: '#5D5F5F',
    letterSpacing: 1,
  },
  secondaryMethods: {
    paddingHorizontal: Spacing.margin,
    gap: 10,
  },
  otpButton: {
    height: 50,
    borderRadius: Radius.xs,
    backgroundColor: '#EEEEEE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  otpButtonText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    color: '#1A1C1C',
  },
  googleButton: {
    height: 50,
    borderRadius: Radius.xs,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E2E2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  googleButtonText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    color: '#1A1C1C',
  },
  termsFooter: {
    paddingHorizontal: Spacing.margin,
    paddingTop: Spacing.lg,
    alignItems: 'center',
  },
  termsFooterText: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#5D5F5F',
    textAlign: 'center',
    lineHeight: 16,
  },
  termsFooterLink: {
    textDecorationLine: 'underline',
    fontFamily: FontFamily.semiBold,
    color: '#1A1C1C',
  },
});
