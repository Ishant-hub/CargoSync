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
import { useAuth } from '../../context/AuthContext';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'JoinCompany'>;
};

export const JoinCompanyScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useLanguage();
  const { joinCompanyByCode } = useAuth();

  const [inviteCode, setInviteCode] = useState('APEX26');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleJoin = async () => {
    if (!inviteCode.trim() || inviteCode.trim().length !== 6) {
      setError('Please enter a valid 6-character invitation code');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const result = await joinCompanyByCode(inviteCode);
      if (result.success) {
        navigation.navigate('CompanyConnected', {
          companyName: result.companyName || 'Apex Multimodal Logistics',
          position: 'Fleet Member',
        });
      } else {
        setError('Invalid or expired code. Please request a new code from your admin.');
      }
    } catch (err) {
      setError('Failed to connect to company. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader title={t.joinCompany} onBack={() => navigation.goBack()} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.banner}>
            <View style={styles.iconCircle}>
              <MaterialIcons name="group-add" size={32} color={Colors.primaryAmber} />
            </View>
            <Text style={styles.title}>{t.joinCompanyTitle}</Text>
            <Text style={styles.subtitle}>{t.joinCompanySubtitle}</Text>
          </View>

          <View style={styles.formCard}>
            <FormInput
              label={t.inviteCode}
              placeholder="e.g. APEX26"
              autoCapitalize="characters"
              maxLength={6}
              value={inviteCode}
              onChangeText={(v) => {
                setInviteCode(v.toUpperCase());
                setError('');
              }}
              leftIcon="key"
              hint={t.inviteCodeHint}
              error={error}
              required
            />

            {/* Preview Company matching current sample code */}
            {inviteCode.length === 6 && (
              <View style={styles.previewBox}>
                <View style={styles.previewIconBox}>
                  <MaterialIcons name="business" size={24} color={Colors.primaryAmber} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.previewTitle}>Apex Multimodal Logistics</Text>
                  <Text style={styles.previewMeta}>GST: 07AABCA1234F1Z8 • Gurugram Hub</Text>
                  <Text style={styles.previewRole}>Role: Fleet Operations & Driver</Text>
                </View>
              </View>
            )}

            <PrimaryButton
              label={t.joinNow}
              onPress={handleJoin}
              loading={loading}
              style={{ marginTop: Spacing.md }}
              rightIcon={<MaterialIcons name="arrow-forward" size={18} color={Colors.white} />}
            />
          </View>

          <View style={styles.helpSection}>
            <Text style={styles.helpText}>{t.codeNotWorking} </Text>
            <TouchableOpacity onPress={() => alert('Please ask your Company Admin to issue a fresh invite from their Team Management screen.')}>
              <Text style={styles.helpLink}>{t.contactAdmin}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  previewBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: Radius.xs,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  previewIconBox: {
    width: 40,
    height: 40,
    borderRadius: Radius.xs,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    color: Colors.onSurface,
  },
  previewMeta: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: Colors.muted,
    marginTop: 2,
  },
  previewRole: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
    color: Colors.primaryAmber,
    marginTop: 2,
  },
  helpSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  helpText: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: Colors.muted,
  },
  helpLink: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: Colors.primaryAmber,
  },
});

