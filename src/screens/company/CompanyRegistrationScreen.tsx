import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { Colors, FontFamily, Spacing, Radius, Typography, Shadows } from '../../theme/tokens';
import { AppHeader } from '../../components/common/Headers';
import { PrimaryButton } from '../../components/common/AppButton';
import { FormInput } from '../../components/forms/FormInput';
import { useLanguage } from '../../context/LanguageContext';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'CompanyRegistration'>;
};

const BUSINESS_TYPES = ['Private Limited', 'Proprietorship', 'Partnership', 'LLP', 'Public Limited'];

export const CompanyRegistrationScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useLanguage();

  const [legalName, setLegalName] = useState('Apex Multimodal Logistics Pvt Ltd');
  const [businessType, setBusinessType] = useState('Private Limited');
  const [gstin, setGstin] = useState('07AABCA1234F1Z8');
  const [address, setAddress] = useState('402 Cyber City, Phase III, Gurugram, Haryana 122002');
  const [fleetSize, setFleetSize] = useState('18');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!legalName.trim()) errs.legalName = 'Company name is required';
    if (!gstin.trim() || gstin.length < 15) errs.gstin = 'Valid 15-character GSTIN is required';
    if (!address.trim()) errs.address = 'Registered address is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;
    navigation.navigate('CompanyDocuments', {
      companyName: legalName,
      gstin: gstin.toUpperCase(),
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader title={t.companyRegistration} onBack={() => navigation.goBack()} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.banner}>
            <View style={styles.iconCircle}>
              <MaterialIcons name="business" size={32} color={Colors.primaryAmber} />
            </View>
            <Text style={styles.title}>{t.companyRegistration}</Text>
            <Text style={styles.subtitle}>{t.companyRegistrationSubtitle}</Text>
          </View>

          <View style={styles.formCard}>
            <FormInput
              label={t.companyLegalName}
              placeholder={t.companyLegalNamePlaceholder}
              value={legalName}
              onChangeText={(v) => {
                setLegalName(v);
                setErrors((e) => ({ ...e, legalName: '' }));
              }}
              leftIcon="apartment"
              error={errors.legalName}
              required
            />

            {/* Business Entity Type Chips */}
            <View style={styles.typeSection}>
              <Text style={styles.typeLabel}>{t.businessType} *</Text>
              <View style={styles.typeGrid}>
                {BUSINESS_TYPES.map((type) => {
                  const active = businessType === type;
                  return (
                    <TouchableOpacity
                      key={type}
                      onPress={() => setBusinessType(type)}
                      style={[styles.typeChip, active && styles.typeChipActive]}
                    >
                      <Text style={[styles.typeChipText, active && styles.typeChipTextActive]}>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <FormInput
              label={t.gstin}
              placeholder={t.gstinPlaceholder}
              autoCapitalize="characters"
              maxLength={15}
              value={gstin}
              onChangeText={(v) => {
                setGstin(v.toUpperCase());
                setErrors((e) => ({ ...e, gstin: '' }));
              }}
              leftIcon="receipt"
              hint="15-character Goods and Services Tax Identification Number."
              error={errors.gstin}
              required
            />

            <FormInput
              label={t.companyAddress}
              placeholder={t.companyAddressPlaceholder}
              multiline
              numberOfLines={2}
              value={address}
              onChangeText={(v) => {
                setAddress(v);
                setErrors((e) => ({ ...e, address: '' }));
              }}
              leftIcon="place"
              error={errors.address}
              required
            />

            <FormInput
              label={t.fleetSize}
              placeholder={t.fleetSizePlaceholder}
              keyboardType="numeric"
              value={fleetSize}
              onChangeText={setFleetSize}
              leftIcon="local-shipping"
              hint="Enter total active trucks owned or leased under your operations."
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.bottomBar}>
        <PrimaryButton
          label={t.continue}
          onPress={handleNext}
          rightIcon={<MaterialIcons name="arrow-forward" size={18} color={Colors.white} />}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  banner: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  title: {
    ...Typography.headlineLg,
    color: Colors.onSurface,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    ...Typography.bodyMd,
    color: Colors.muted,
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.sm,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.tier1,
  },
  typeSection: {
    marginBottom: Spacing.lg,
  },
  typeLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: Colors.onSurface,
    marginBottom: 8,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.xs,
    backgroundColor: Colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  typeChipActive: {
    backgroundColor: '#FFF7ED',
    borderColor: Colors.primaryAmber,
  },
  typeChipText: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: Colors.onSurface,
  },
  typeChipTextActive: {
    fontFamily: FontFamily.semiBold,
    color: Colors.primaryAmber,
  },
  bottomBar: {
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    ...Shadows.tier2,
  },
});

