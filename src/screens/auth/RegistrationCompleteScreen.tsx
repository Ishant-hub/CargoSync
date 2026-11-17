import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { Colors, FontFamily, Spacing, Radius } from '../../theme/tokens';
import { PrimaryButton, SecondaryButton } from '../../components/common/AppButton';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

type Props = NativeStackScreenProps<AuthStackParamList, 'RegistrationComplete'>;

const CORRIDOR_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAlhVlq3EUMzvEALQH6j0KOA2OGB5jk-JR2MyByxHWesTmuRctq1xOG5Ww7NvO1aIwCsaVdc-75oMHYry9-53rzb8I4VvxYqeLY-J9CeUeQzo3EniuXI46m9p_5B4cy9RYrO8qNUQ187ASGac1aviBu8b_KKxrDgdjCVqtlfi3_O2cYA5yIUjaB311gLDglM7xfXjvnaM4kZ5M2DKsTb5TgAt0xJ_jfufwzf__s_dk';

export const RegistrationCompleteScreen: React.FC<Props> = ({ navigation, route }) => {
  const { language, toggleLanguage } = useLanguage();
  const { selectRole } = useAuth();
  const { role, accountId, name } = route.params;

  const handleLaunchDashboard = async () => {
    await selectRole(role as UserRole);
  };

  const getDashboardLabel = () => {
    if (role === 'shipper') return 'Open Shipper Dashboard';
    if (role === 'fleet') return 'Open Fleet Ops Hub';
    return 'Open Driver Dashboard';
  };

  const getRoleDisplay = () => {
    if (role === 'shipper') return 'Independent Shipper (Cargo Owner)';
    if (role === 'fleet') return 'Fleet Manager (Owner-Operator)';
    return 'Independent Commercial Driver';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
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
          <Text style={styles.headerTitle}>Verification Complete</Text>
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

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Celebratory Hero Header */}
        <View style={styles.heroSection}>
          <View style={styles.badgeRingWrap}>
            <View style={styles.badgeOuterCircle}>
              <MaterialIcons name="check-circle" size={42} color="#85FAA9" />
            </View>
            <View style={styles.badgeSmallPill}>
              <MaterialIcons name="verified" size={16} color="#109752" />
            </View>
          </View>

          <View style={styles.activeStatusPill}>
            <View style={styles.activeDot} />
            <Text style={styles.activeStatusText}>• PROFILE ACTIVE</Text>
          </View>

          <Text style={styles.heroTitle}>Account Verified &amp; Ready!</Text>
          <Text style={styles.heroSubhead}>
            Welcome to CargoSync,{' '}
            <Text style={{ fontFamily: FontFamily.bold, color: '#1A1C1C' }}>
              {name || 'Rajesh Kumar'}
            </Text>
            ! Your individual driver profile is fully active and verified.
          </Text>
        </View>

        {/* Account Summary Dossier Card */}
        <View style={styles.dossierCard}>
          <View style={styles.dossierHeader}>
            <View style={styles.dossierProfileRow}>
              <View style={styles.avatarCircle}>
                <MaterialIcons name="badge" size={22} color="#1A1C1C" />
              </View>
              <View>
                <Text style={styles.dossierLabel}>ACCOUNT PROFILE</Text>
                <Text style={styles.dossierName}>{name || 'Rajesh Kumar'}</Text>
              </View>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.dossierLabel}>ID</Text>
              <Text style={styles.dossierId}>{accountId || 'CS-IND-88412'}</Text>
            </View>
          </View>

          <View style={styles.dossierRows}>
            <View style={styles.dossierRow}>
              <View style={styles.dossierRowLeft}>
                <MaterialIcons name="local-shipping" size={18} color="#5D5F5F" />
                <Text style={styles.dossierRowLabel}>Role</Text>
              </View>
              <Text style={styles.dossierRowVal}>{getRoleDisplay()}</Text>
            </View>

            <View style={styles.dossierRow}>
              <View style={styles.dossierRowLeft}>
                <MaterialIcons name="payments" size={18} color="#5D5F5F" />
                <Text style={styles.dossierRowLabel}>Payout Tier</Text>
              </View>
              <View style={styles.payoutBadge}>
                <MaterialIcons name="bolt" size={16} color="#109752" />
                <Text style={styles.payoutBadgeText}>T+0 Instant Payouts</Text>
              </View>
            </View>

            <View style={styles.verifiedDocsBox}>
              <View style={styles.dossierRowLeft}>
                <MaterialIcons name="folder-shared" size={18} color="#5D5F5F" />
                <Text style={styles.dossierLabel}>VERIFIED DOCUMENTS</Text>
              </View>
              <View style={styles.docsChipsRow}>
                <View style={styles.docChip}>
                  <MaterialIcons name="check" size={14} color="#109752" />
                  <Text style={styles.docChipText}>Aadhaar</Text>
                </View>
                <View style={styles.docChip}>
                  <MaterialIcons name="check" size={14} color="#109752" />
                  <Text style={styles.docChipText}>CDL (HCV)</Text>
                </View>
                <View style={styles.docChip}>
                  <MaterialIcons name="check" size={14} color="#109752" />
                  <Text style={styles.docChipText}>RC: HR-55-AJ-9082</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Nearby Load Availability Card */}
        <View style={styles.corridorCard}>
          <View style={styles.corridorHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <MaterialIcons name="explore" size={20} color="#5D5F5F" />
              <Text style={styles.corridorTitle}>Nearby Load Availability</Text>
            </View>
            <Text style={styles.corridorCount}>Nearby: 140+ Loads</Text>
          </View>

          <ImageBackground
            source={{ uri: CORRIDOR_IMG }}
            style={styles.corridorBanner}
            imageStyle={{ borderRadius: 8 }}
          >
            <View style={styles.corridorOverlay} />
            <View style={styles.corridorContentRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View style={styles.corridorDot} />
                <Text style={styles.corridorBannerText}>
                  Live Area: Nearby Hubs &amp; Freight Corridors
                </Text>
              </View>
              <View style={styles.distPill}>
                <Text style={styles.distPillText}>244 km</Text>
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* Quick-start Launch Checklist */}
        <View style={styles.checklistCard}>
          <View style={styles.checklistHeader}>
            <Text style={styles.checklistTitle}>Onboarding Checklist</Text>
            <View style={styles.checklistCountBadge}>
              <Text style={styles.checklistCountText}>3 of 3 Ready</Text>
            </View>
          </View>

          <View style={styles.checkItem}>
            <View style={styles.checkIconBox}>
              <MaterialIcons name="check" size={18} color="#109752" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.checkItemTitle}>Profile &amp; Credentials Verified</Text>
              <Text style={styles.checkItemSubtitle}>
                Aadhaar, CDL and HCV certified by system
              </Text>
            </View>
            <MaterialIcons name="verified-user" size={18} color="#5D5F5F" />
          </View>

          <View style={styles.checkItem}>
            <View style={[styles.checkIconBox, { backgroundColor: '#E2E2E2' }]}>
              <MaterialIcons name="notifications-active" size={18} color="#1A1C1C" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.checkItemTitle}>Live Load Alerts Enabled</Text>
              <Text style={styles.checkItemSubtitle}>
                High-payout freight pings activated via SMS &amp; App
              </Text>
            </View>
            <View style={[styles.activeDot, { width: 10, height: 10 }]} />
          </View>
        </View>

        {/* Bottom Actions */}
        <View style={styles.actionsWrap}>
          <PrimaryButton
            label={getDashboardLabel()}
            onPress={handleLaunchDashboard}
            size="lg"
            rightIcon={<MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />}
            style={styles.ctaButton}
          />

          <SecondaryButton
            label="Add Bank Details for Payouts"
            onPress={() => {}}
            size="md"
            leftIcon={<MaterialIcons name="account-balance" size={18} color="#5D5F5F" />}
            style={styles.secButton}
          />

          <Text style={styles.helplineText}>
            Need dispatch support? Call 24/7 Helpline:{' '}
            <Text style={{ fontFamily: FontFamily.bold, color: '#1A1C1C' }}>
              1800-419-SYNC
            </Text>
          </Text>
        </View>
      </ScrollView>
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
  scrollContent: {
    paddingHorizontal: Spacing.margin,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },
  heroSection: {
    alignItems: 'center',
    textAlign: 'center',
    marginVertical: Spacing.sm,
  },
  badgeRingWrap: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  badgeOuterCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeSmallPill: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 3,
  },
  activeStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(133, 250, 169, 0.25)',
    marginBottom: Spacing.sm,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#109752',
  },
  activeStatusText: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: '#005229',
    letterSpacing: 0.8,
  },
  heroTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 22,
    color: '#1A1C1C',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  heroSubhead: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: '#5D5F5F',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
    maxWidth: 320,
  },
  dossierCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    gap: 12,
  },
  dossierHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  dossierProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dossierLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: 10,
    color: '#5D5F5F',
    letterSpacing: 0.6,
  },
  dossierName: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: '#1A1C1C',
  },
  dossierId: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: '#1A1C1C',
  },
  dossierRows: {
    gap: 8,
  },
  dossierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F4F3F3',
    padding: 10,
    borderRadius: 6,
  },
  dossierRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dossierRowLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: '#5D5F5F',
  },
  dossierRowVal: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
    color: '#1A1C1C',
  },
  payoutBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  payoutBadgeText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
    color: '#109752',
  },
  verifiedDocsBox: {
    backgroundColor: '#F4F3F3',
    padding: 10,
    borderRadius: 6,
    gap: 6,
  },
  docsChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  docChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  docChipText: {
    fontFamily: FontFamily.medium,
    fontSize: 11,
    color: '#1A1C1C',
  },
  corridorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    gap: 10,
  },
  corridorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  corridorTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: '#1A1C1C',
  },
  corridorCount: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#5D5F5F',
  },
  corridorBanner: {
    height: 120,
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    padding: 10,
  },
  corridorOverlay: {
    ...StyleSheet.absoluteFill as any,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 8,
  },
  corridorContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  corridorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#85FAA9',
  },
  corridorBannerText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 11,
    color: '#FFFFFF',
  },
  distPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  distPillText: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: '#FFFFFF',
  },
  checklistCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    gap: 10,
  },
  checklistHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checklistTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: '#1A1C1C',
  },
  checklistCountBadge: {
    backgroundColor: '#EEEEEE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  checklistCountText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 11,
    color: '#1A1C1C',
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F4F3F3',
    padding: 10,
    borderRadius: 8,
  },
  checkIconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(133, 250, 169, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkItemTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: '#1A1C1C',
  },
  checkItemSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#5D5F5F',
  },
  actionsWrap: {
    gap: 10,
    marginTop: 4,
  },
  ctaButton: {
    backgroundColor: '#000000',
    borderRadius: Radius.xs,
  },
  secButton: {
    backgroundColor: '#EEEEEE',
    borderColor: '#EEEEEE',
    borderRadius: Radius.xs,
  },
  helplineText: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#5D5F5F',
    textAlign: 'center',
    marginTop: 4,
  },
});
