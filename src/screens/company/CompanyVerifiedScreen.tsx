import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { Colors, FontFamily, Spacing, Radius, Typography, Shadows } from '../../theme/tokens';
import { PrimaryButton, SecondaryButton } from '../../components/common/AppButton';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

type Props = NativeStackScreenProps<AuthStackParamList, 'CompanyVerified'>;

export const CompanyVerifiedScreen: React.FC<Props> = ({ navigation, route }) => {
  const { t } = useLanguage();
  const { switchRole } = useAuth();
  const companyName = route.params?.companyName || 'Apex Multimodal Logistics';

  const handleLaunchAdmin = async () => {
    await switchRole('company_admin');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Success Icon */}
        <View style={styles.successIconCircle}>
          <MaterialIcons name="verified" size={54} color={Colors.success} />
        </View>

        <Text style={styles.title}>{t.companyVerified}</Text>
        <Text style={styles.subtitle}>
          {companyName} has been fully approved by CargoSync Compliance.
        </Text>

        {/* Credentials Card */}
        <View style={styles.summaryCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderText}>CORPORATE PROFILE</Text>
            <StatusBadge label="VERIFIED" variant="success" size="sm" />
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Legal Name</Text>
            <Text style={styles.value}>{companyName}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>Your Role</Text>
            <Text style={[styles.value, { color: Colors.primaryAmber }]}>Company Admin</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>Billing</Text>
            <Text style={styles.value}>Monthly GST Invoicing</Text>
          </View>
        </View>

        {/* Admin Permissions Callout */}
        <View style={styles.permissionsCard}>
          <Text style={styles.permissionsTitle}>ADMIN CAPABILITIES UNLOCKED</Text>

          <View style={styles.permItem}>
            <MaterialIcons name="group-add" size={18} color={Colors.primaryAmber} />
            <Text style={styles.permText}>
              Generate role-specific invitation codes for dispatchers, fleet managers, and drivers.
            </Text>
          </View>

          <View style={styles.permItem}>
            <MaterialIcons name="local-shipping" size={18} color={Colors.primaryAmber} />
            <Text style={styles.permText}>
              Consolidate shipments across multiple company trucks in real time.
            </Text>
          </View>

          <View style={styles.permItem}>
            <MaterialIcons name="receipt-long" size={18} color={Colors.primaryAmber} />
            <Text style={styles.permText}>
              Direct Pan-India GST e-invoices and settlement statements.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <PrimaryButton
          label="Go to Admin Dashboard"
          onPress={handleLaunchAdmin}
          size="lg"
          rightIcon={<MaterialIcons name="admin-panel-settings" size={18} color={Colors.white} />}
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
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xxl,
    alignItems: 'center',
  },
  successIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.successBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    borderWidth: 2,
    borderColor: '#A7F3D0',
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
    marginBottom: Spacing.xl,
    maxWidth: 300,
  },
  summaryCard: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: Radius.sm,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
    ...Shadows.tier1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  cardHeaderText: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    letterSpacing: 0.5,
    color: Colors.muted,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  label: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: Colors.muted,
  },
  value: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    color: Colors.onSurface,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.surfaceContainerLow,
    marginVertical: 4,
  },
  permissionsCard: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: Radius.sm,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
    ...Shadows.tier1,
  },
  permissionsTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    letterSpacing: 0.5,
    color: Colors.muted,
  },
  permItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  permText: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: Colors.onSurface,
    lineHeight: 18,
    flex: 1,
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

