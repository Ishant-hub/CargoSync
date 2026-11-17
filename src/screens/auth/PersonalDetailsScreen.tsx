import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { Colors, FontFamily, Spacing, Radius } from '../../theme/tokens';
import { PrimaryButton } from '../../components/common/AppButton';
import { useLanguage } from '../../context/LanguageContext';

type Props = NativeStackScreenProps<AuthStackParamList, 'PersonalDetails'>;

export const PersonalDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { language, toggleLanguage } = useLanguage();
  const { role } = route.params;

  const [fullName, setFullName] = useState('Rajesh Kumar');
  const [phone] = useState('98765 43210');
  const [email, setEmail] = useState('rajesh.kumar@freightmail.in');
  const [dlNumber, setDlNumber] = useState('DL-1420210089241');
  const [ownership, setOwnership] = useState<'owner' | 'company'>('owner');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!fullName.trim()) errs.fullName = 'Full legal name is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;
    navigation.navigate('IdentityVerification', {
      role: role as string,
      name: fullName,
    });
  };

  const getRoleLabel = () => {
    if (role === 'shipper') return 'Shipper Details';
    if (role === 'fleet') return 'Fleet Manager Details';
    return 'Driver Details';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Utility Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Go back"
        >
          <MaterialIcons name="arrow-back" size={20} color="#1A1C1C" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTag}>CARGOSYNC</Text>
          <Text style={styles.headerTitle}>Profile Setup</Text>
        </View>

        <TouchableOpacity
          style={styles.langPill}
          onPress={toggleLanguage}
          accessibilityLabel="Change Language"
        >
          <Text style={styles.langPillText}>
            {language === 'en' ? 'EN' : 'हिंदी'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Progress Meta */}
      <View style={styles.progressContainer}>
        <View style={styles.progressRow}>
          <Text style={styles.stepMetaText}>STEP 2 OF 3</Text>
          <Text style={styles.stepTitleText}>{getRoleLabel()}</Text>
        </View>
        <View style={styles.stepSegmentsRow}>
          <View style={[styles.stepSegment, styles.stepSegmentActive]} />
          <View style={[styles.stepSegment, styles.stepSegmentActive]} />
          <View style={[styles.stepSegment, styles.stepSegmentInactive]} />
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
          {/* Header Intro */}
          <View style={styles.introSection}>
            <Text style={styles.introTitle}>Let's set up your profile</Text>
            <Text style={styles.introSubtitle}>
              Enter your basic details to start receiving load offers and trip assignments.
            </Text>
          </View>

          {/* Form Cards Stack */}
          <View style={styles.formStack}>
            {/* Full Legal Name */}
            <View style={styles.formCard}>
              <Text style={styles.fieldLabel}>Full Legal Name</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Name as per Aadhaar / Driving Licence"
                  placeholderTextColor="#7E7576"
                  value={fullName}
                  onChangeText={(val) => {
                    setFullName(val);
                    setErrors((e) => ({ ...e, fullName: '' }));
                  }}
                />
                <MaterialIcons name="badge" size={20} color="#5D5F5F" />
              </View>
              {errors.fullName ? (
                <Text style={styles.errorText}>{errors.fullName}</Text>
              ) : (
                <Text style={styles.helperText}>As shown on your ID</Text>
              )}
            </View>

            {/* Mobile Number */}
            <View style={styles.formCard}>
              <View style={styles.labelWithBadgeRow}>
                <Text style={styles.fieldLabel}>Mobile Number</Text>
                <View style={styles.verifiedBadge}>
                  <MaterialIcons name="check-circle" size={14} color="#05944F" />
                  <Text style={styles.verifiedBadgeText}>Verified via SMS</Text>
                </View>
              </View>
              <View style={styles.phoneInputRow}>
                <View style={styles.flagBox}>
                  <Text style={styles.flagText}>🇮🇳 +91</Text>
                </View>
                <View style={[styles.inputRow, { flex: 1, backgroundColor: '#F4F3F3' }]}>
                  <TextInput
                    style={[styles.textInput, { color: '#1A1C1C' }]}
                    value={phone}
                    editable={false}
                  />
                </View>
              </View>
            </View>

            {/* Email Address */}
            <View style={styles.formCard}>
              <View style={styles.labelWithBadgeRow}>
                <Text style={styles.fieldLabel}>Email Address</Text>
                <Text style={styles.optionalText}>Optional</Text>
              </View>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. driver@domain.com"
                  placeholderTextColor="#7E7576"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
                <MaterialIcons name="mail" size={20} color="#5D5F5F" />
              </View>
            </View>

            {/* Commercial Driving Licence (for Drivers & Fleets) */}
            {role !== 'shipper' && (
              <View style={styles.formCard}>
                <Text style={styles.fieldLabel}>Commercial Driving Licence Number</Text>
                <View style={styles.dlRow}>
                  <View style={[styles.inputRow, { flex: 1 }]}>
                    <TextInput
                      style={[styles.textInput, { textTransform: 'uppercase' }]}
                      placeholder="DL-XXYYYYYYYYYYY"
                      placeholderTextColor="#7E7576"
                      value={dlNumber}
                      onChangeText={setDlNumber}
                    />
                  </View>
                  <View style={styles.validityBox}>
                    <Text style={styles.validityText}>Valid: 12/2029</Text>
                  </View>
                </View>
                <Text style={styles.helperText}>Verified with official transport records.</Text>
              </View>
            )}

            {/* Vehicle Ownership Category (for Drivers) */}
            {role === 'driver' && (
              <View style={styles.formCard}>
                <Text style={styles.fieldLabel}>Vehicle Ownership Category</Text>

                <TouchableOpacity
                  style={[
                    styles.ownershipOption,
                    ownership === 'owner' && styles.ownershipOptionSelected,
                  ]}
                  onPress={() => setOwnership('owner')}
                  activeOpacity={0.8}
                >
                  <View style={styles.radioDotCircle}>
                    {ownership === 'owner' && <View style={styles.radioDotInner} />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.ownershipTitle}>I own this truck</Text>
                    <Text style={styles.ownershipDesc}>I manage my own vehicle.</Text>
                  </View>
                  <MaterialIcons name="local-shipping" size={22} color="#000000" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.ownershipOption,
                    ownership === 'company' && styles.ownershipOptionSelected,
                  ]}
                  onPress={() => setOwnership('company')}
                  activeOpacity={0.8}
                >
                  <View style={styles.radioDotCircle}>
                    {ownership === 'company' && <View style={styles.radioDotInner} />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.ownershipTitle}>I drive for a company</Text>
                    <Text style={styles.ownershipDesc}>My company manages the vehicle.</Text>
                  </View>
                  <MaterialIcons name="business" size={22} color="#5D5F5F" />
                </TouchableOpacity>
              </View>
            )}

            {/* Security Banner */}
            <View style={styles.securityBanner}>
              <MaterialIcons name="lock" size={18} color="#000000" />
              <Text style={styles.securityText}>
                Your data is protected by 256-bit logistics encryption and verified against Sarathi / Vahan databases.
              </Text>
            </View>

            {/* Profile Verification Card */}
            <View style={styles.trustCard}>
              <View style={styles.trustIconBox}>
                <MaterialIcons name="verified" size={22} color="#000000" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.trustTitle}>Profile Verification</Text>
                <Text style={styles.trustDesc}>Verification will be completed in the next step.</Text>
              </View>
              <MaterialIcons name="shield" size={28} color="#CFC4C5" />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Sticky Bottom Bar */}
      <View style={styles.bottomBar}>
        <PrimaryButton
          label="Continue to Verification"
          onPress={handleNext}
          size="lg"
          rightIcon={<MaterialIcons name="arrow-forward" size={18} color="#FFFFFF" />}
          style={styles.ctaButton}
        />
      </View>
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
    backgroundColor: '#F9F9F9',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTag: {
    fontFamily: FontFamily.semiBold,
    fontSize: 9,
    letterSpacing: 1.2,
    color: '#4C4546',
  },
  headerTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: '#1A1C1C',
  },
  langPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Radius.full,
    backgroundColor: '#000000',
  },
  langPillText: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: '#FFFFFF',
  },
  progressContainer: {
    paddingHorizontal: Spacing.margin,
    paddingTop: 10,
    paddingBottom: 6,
    backgroundColor: '#F9F9F9',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  stepMetaText: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: '#4C4546',
    letterSpacing: 0.8,
  },
  stepTitleText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
    color: '#1A1C1C',
  },
  stepSegmentsRow: {
    flexDirection: 'row',
    gap: 4,
    height: 5,
  },
  stepSegment: {
    flex: 1,
    borderRadius: 2.5,
  },
  stepSegmentActive: {
    backgroundColor: '#000000',
  },
  stepSegmentInactive: {
    backgroundColor: '#E2E2E2',
  },
  scrollContent: {
    paddingHorizontal: Spacing.margin,
    paddingTop: Spacing.sm,
    paddingBottom: 110,
    gap: Spacing.md,
  },
  introSection: {
    marginVertical: 4,
  },
  introTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 22,
    color: '#1A1C1C',
    letterSpacing: -0.3,
  },
  introSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: '#5D5F5F',
    marginTop: 4,
    lineHeight: 18,
  },
  formStack: {
    gap: 12,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    gap: 8,
  },
  fieldLabel: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: '#1A1C1C',
  },
  labelWithBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E6F5ED',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  verifiedBadgeText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 10,
    color: '#05944F',
  },
  optionalText: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#5D5F5F',
  },
  inputRow: {
    height: 48,
    borderRadius: 8,
    backgroundColor: '#F4F3F3',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: '#1A1C1C',
  },
  helperText: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#5D5F5F',
  },
  errorText: {
    fontFamily: FontFamily.medium,
    fontSize: 11,
    color: '#BA1A1A',
  },
  phoneInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  flagBox: {
    height: 48,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F4F3F3',
    justifyContent: 'center',
  },
  flagText: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: '#1A1C1C',
  },
  dlRow: {
    flexDirection: 'row',
    gap: 8,
  },
  validityBox: {
    height: 48,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#F4F3F3',
    justifyContent: 'center',
  },
  validityText: {
    fontFamily: FontFamily.medium,
    fontSize: 11,
    color: '#5D5F5F',
  },
  ownershipOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#F4F3F3',
    borderWidth: 1.5,
    borderColor: 'transparent',
    marginTop: 4,
  },
  ownershipOptionSelected: {
    backgroundColor: '#EEEEEE',
    borderColor: '#000000',
  },
  radioDotCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  ownershipTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: '#1A1C1C',
  },
  ownershipDesc: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#5D5F5F',
  },
  securityBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#E8E8E8',
    padding: 12,
    borderRadius: 8,
  },
  securityText: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#4C4546',
    lineHeight: 16,
  },
  trustCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F4F3F3',
    padding: 12,
    borderRadius: 8,
  },
  trustIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E2E2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trustTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: '#1A1C1C',
  },
  trustDesc: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#5D5F5F',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.margin,
    paddingTop: 12,
    paddingBottom: 24,
    backgroundColor: 'rgba(249, 249, 249, 0.95)',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  ctaButton: {
    backgroundColor: '#000000',
    borderRadius: Radius.xs,
  },
});
