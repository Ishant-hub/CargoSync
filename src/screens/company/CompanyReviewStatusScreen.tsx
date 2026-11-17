import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { Colors, FontFamily, Spacing, Radius } from '../../theme/tokens';
import { PrimaryButton, SecondaryButton } from '../../components/common/AppButton';
import { useLanguage } from '../../context/LanguageContext';

type Props = NativeStackScreenProps<AuthStackParamList, 'CompanyReviewStatus'>;

export const CompanyReviewStatusScreen: React.FC<Props> = ({ navigation, route }) => {
  const { language, toggleLanguage } = useLanguage();
  const companyName = route.params?.companyName || 'Apex Logistics Pvt Ltd';

  const [refreshing, setRefreshing] = useState(false);
  const [statusText, setStatusText] = useState('Refresh Verification Status');

  const handleRefresh = () => {
    setRefreshing(true);
    setStatusText('Checking Status...');
    setTimeout(() => {
      setRefreshing(false);
      setStatusText('Status is Up to Date');
      setTimeout(() => {
        setStatusText('Refresh Verification Status');
      }, 1500);
    }, 1000);
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
          <Text style={styles.headerTitle}>Review Status</Text>
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
        {/* Status Feedback Banner */}
        <View style={styles.heroSection}>
          <View style={styles.radarCircle}>
            <MaterialIcons name="schedule" size={32} color="#000000" />
          </View>

          <View style={styles.reviewPill}>
            <View style={styles.pulseDot} />
            <Text style={styles.reviewPillText}>UNDER MANUAL REVIEW</Text>
          </View>

          <Text style={styles.heroTitle}>Company Details Submitted</Text>
          <Text style={styles.heroSubhead}>
            CargoSync will review your company information and documents. We will notify you once verified.
          </Text>
        </View>

        {/* Verification Progress Track Gauge */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardHeaderMeta}>VERIFICATION PROGRESS</Text>
            <Text style={styles.cardHeaderVal}>1 of 3 Steps Cleared</Text>
          </View>
          <View style={styles.gaugeTrack}>
            <View style={styles.gaugeFillDone} />
            <View style={styles.gaugeFillReview} />
            <View style={styles.gaugeFillPending} />
          </View>
        </View>

        {/* Company Summary Card */}
        <View style={styles.card}>
          <View style={styles.companySummaryTop}>
            <View style={styles.companyIconBox}>
              <MaterialIcons name="domain" size={20} color="#000000" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardHeaderMeta}>REGISTERED ENTITY</Text>
              <Text style={styles.entityName}>{companyName || 'Apex Logistics Pvt Ltd'}</Text>
            </View>
            <View style={styles.carrierTag}>
              <Text style={styles.carrierTagText}>Fleet Carrier</Text>
            </View>
          </View>

          <View style={styles.refInfoBox}>
            <View style={{ flex: 1 }}>
              <Text style={styles.refLabel}>Submitted On</Text>
              <Text style={styles.refVal}>24 Oct 2024 · 14:30 IST</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.refLabel}>Reference ID</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text style={styles.refValMono}>CS-ORG-49201</Text>
                <MaterialIcons name="content-copy" size={14} color="#5D5F5F" />
              </View>
            </View>
          </View>
        </View>

        {/* Audit Milestones */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.milestonesTitle}>AUDIT MILESTONES</Text>
            <Text style={styles.cardHeaderMeta}>Updated real-time</Text>
          </View>

          {/* Step 1 */}
          <View style={styles.milestoneItem}>
            <View style={[styles.milestoneIconBox, { backgroundColor: '#109752' }]}>
              <MaterialIcons name="check" size={16} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.milestoneTitleRow}>
                <Text style={styles.milestoneTitle}>Company Details</Text>
                <View style={styles.milestoneBadge}>
                  <Text style={styles.milestoneBadgeText}>Submitted</Text>
                </View>
              </View>
              <Text style={styles.milestoneDesc}>
                Entity names, legal address, contact persons recorded.
              </Text>
            </View>
          </View>

          {/* Step 2 */}
          <View style={styles.milestoneItem}>
            <View style={[styles.milestoneIconBox, { backgroundColor: '#EEEEEE' }]}>
              <MaterialIcons name="sync" size={16} color="#000000" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.milestoneTitleRow}>
                <Text style={styles.milestoneTitle}>Business Documents</Text>
                <View style={[styles.milestoneBadge, { backgroundColor: '#DCEDDD' }]}>
                  <Text style={styles.milestoneBadgeText}>Under Review</Text>
                </View>
              </View>
              <Text style={styles.milestoneDesc}>
                Validating GSTIN, Certificate of Incorporation &amp; PAN records.
              </Text>
            </View>
          </View>

          {/* Step 3 */}
          <View style={styles.milestoneItem}>
            <View style={[styles.milestoneIconBox, { backgroundColor: '#E2E2E2' }]}>
              <MaterialIcons name="hourglass-empty" size={16} color="#5D5F5F" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.milestoneTitleRow}>
                <Text style={styles.milestoneTitle}>Company Account Verification</Text>
                <View style={styles.milestoneBadge}>
                  <Text style={styles.milestoneBadgeText}>Pending</Text>
                </View>
              </View>
              <Text style={styles.milestoneDesc}>
                Dispatch console, driver onboarding, and load bidding unlocked post-approval.
              </Text>
            </View>
          </View>
        </View>

        {/* Turnaround Notice Banner */}
        <View style={styles.turnaroundBox}>
          <MaterialIcons name="info" size={18} color="#000000" style={{ marginTop: 2 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.turnaroundTitle}>Review turnaround: 24–48 business hours</Text>
            <Text style={styles.turnaroundDesc}>
              You will receive an email notification upon approval.
            </Text>
          </View>
        </View>

        {/* Action Controls */}
        <View style={styles.actionsWrap}>
          <PrimaryButton
            label={statusText}
            onPress={handleRefresh}
            loading={refreshing}
            size="lg"
            leftIcon={<MaterialIcons name="sync" size={18} color="#FFFFFF" />}
            style={styles.refreshBtn}
          />

          <SecondaryButton
            label="Edit Company Information"
            onPress={() => navigation.goBack()}
            size="md"
            leftIcon={<MaterialIcons name="edit-document" size={16} color="#1A1C1C" />}
            style={styles.editBtn}
          />
        </View>

        {/* Toll-Free Helpline */}
        <View style={styles.supportBox}>
          <Text style={styles.supportSubhead}>Need help with registration?</Text>
          <View style={styles.helplineRow}>
            <MaterialIcons name="call" size={16} color="#1A1C1C" />
            <Text style={styles.helplineText}>Toll-Free Support: 111111</Text>
          </View>
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
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },
  heroSection: {
    alignItems: 'center',
    textAlign: 'center',
    gap: 8,
  },
  radarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E8E8E8',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#5D5F5F',
  },
  reviewPillText: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: '#1A1C1C',
    letterSpacing: 0.8,
  },
  heroTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 22,
    color: '#1A1C1C',
    letterSpacing: -0.3,
  },
  heroSubhead: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: '#5D5F5F',
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 320,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    gap: 10,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardHeaderMeta: {
    fontFamily: FontFamily.semiBold,
    fontSize: 10,
    color: '#5D5F5F',
    letterSpacing: 0.6,
  },
  cardHeaderVal: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
    color: '#1A1C1C',
  },
  gaugeTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EEEEEE',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  gaugeFillDone: {
    width: '33.3%',
    backgroundColor: '#000000',
  },
  gaugeFillReview: {
    width: '33.3%',
    backgroundColor: '#A7F3D0',
  },
  gaugeFillPending: {
    width: '33.3%',
    backgroundColor: '#EEEEEE',
  },
  companySummaryTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  companyIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  entityName: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: '#1A1C1C',
  },
  carrierTag: {
    backgroundColor: '#E8E8E8',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  carrierTagText: {
    fontFamily: FontFamily.medium,
    fontSize: 11,
    color: '#5D5F5F',
  },
  refInfoBox: {
    backgroundColor: '#F4F3F3',
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
  },
  refLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 10,
    color: '#5D5F5F',
  },
  refVal: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
    color: '#1A1C1C',
    marginTop: 2,
  },
  refValMono: {
    fontSize: 13,
    color: '#1A1C1C',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginTop: 2,
  },
  milestonesTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: '#1A1C1C',
    letterSpacing: 0.6,
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#F4F3F3',
    padding: 10,
    borderRadius: 8,
  },
  milestoneIconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  milestoneTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  milestoneTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: '#1A1C1C',
  },
  milestoneBadge: {
    backgroundColor: '#EEEEEE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  milestoneBadgeText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 10,
    color: '#1A1C1C',
  },
  milestoneDesc: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#5D5F5F',
    marginTop: 2,
  },
  turnaroundBox: {
    backgroundColor: '#EEEEEE',
    borderRadius: 12,
    padding: Spacing.md,
    flexDirection: 'row',
    gap: 10,
  },
  turnaroundTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
    color: '#1A1C1C',
  },
  turnaroundDesc: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#5D5F5F',
    marginTop: 2,
  },
  actionsWrap: {
    gap: 10,
    marginTop: 4,
  },
  refreshBtn: {
    backgroundColor: '#000000',
    borderRadius: Radius.xs,
  },
  editBtn: {
    backgroundColor: '#E8E8E8',
    borderColor: '#E8E8E8',
    borderRadius: Radius.xs,
  },
  supportBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    alignItems: 'center',
    gap: 4,
  },
  supportSubhead: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: '#5D5F5F',
  },
  helplineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  helplineText: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
    color: '#1A1C1C',
  },
});
