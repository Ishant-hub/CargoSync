import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { Colors, FontFamily, Spacing, Radius } from '../../theme/tokens';
import { PrimaryButton } from '../../components/common/AppButton';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

type Props = NativeStackScreenProps<AuthStackParamList, 'CompanyDocuments'>;

export const CompanyDocumentsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { language, toggleLanguage } = useLanguage();
  const { registerCompany } = useAuth();
  const { companyName, gstin } = route.params;

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await registerCompany({
        legalName: companyName || 'Apex Logistics Pvt Ltd',
        businessType: 'Private Limited',
        gstin: gstin || '27AACCA1209Q1ZM',
        registeredAddress: 'BKC, Mumbai, Maharashtra 400051',
      });

      navigation.navigate('CompanyReviewStatus', {
        companyName: companyName || 'Apex Logistics Pvt Ltd',
      });
    } finally {
      setLoading(false);
    }
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
          <Text style={styles.headerTitle}>Company Verification</Text>
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
        {/* Progress & Header */}
        <View style={styles.progressContainer}>
          <View style={styles.stepBadge}>
            <View style={styles.stepDot} />
            <Text style={styles.stepBadgeText}>STEP 2 OF 3 · BUSINESS PROOFS</Text>
          </View>
          <View style={styles.stepTrack}>
            <View style={[styles.stepFill, { width: '66.6%' }]} />
          </View>
          <Text style={styles.pageTitle}>Company Verification</Text>
          <Text style={styles.pageSubhead}>
            Submit your business details and supporting documents for manual review.
          </Text>
        </View>

        {/* Active Company Context Card */}
        <View style={styles.companyCard}>
          <View style={styles.companyIconBox}>
            <MaterialIcons name="domain" size={22} color="#000000" />
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={styles.companyName}>
                {companyName || 'Apex Logistics Pvt Ltd'}
              </Text>
              <MaterialIcons name="verified" size={16} color="#000000" />
            </View>
            <View style={styles.gstRow}>
              <Text style={styles.gstLabel}>GSTIN</Text>
              <Text style={styles.gstValue}>{gstin || '27AACCA1209Q1ZM'}</Text>
            </View>
          </View>
        </View>

        {/* Documents Section */}
        <View style={styles.docsSection}>
          <View style={styles.docsHeader}>
            <Text style={styles.docsSectionTitle}>Required Records (3)</Text>
            <Text style={styles.docsSectionMeta}>PDF, JPG up to 10MB</Text>
          </View>

          {/* Doc Card 1: GST */}
          <View style={styles.docCard}>
            <View style={styles.docCardTop}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.docTitle}>GST Registration Certificate</Text>
                  <View style={styles.mandatoryBadge}>
                    <Text style={styles.mandatoryBadgeText}>Mandatory</Text>
                  </View>
                </View>
                <Text style={styles.docSubtitle}>Form REG-06 showing principal place of business</Text>
              </View>
              <View style={styles.processBadge}>
                <MaterialIcons name="hourglass-top" size={12} color="#5D5F5F" />
                <Text style={styles.processBadgeText}>Under Process</Text>
              </View>
            </View>

            <View style={styles.fileRow}>
              <View style={styles.fileIconBox}>
                <MaterialIcons name="picture-as-pdf" size={20} color="#000000" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.fileName}>GST_Certificate_Form_REG06.pdf</Text>
                <Text style={styles.fileMeta}>1.4 MB · Uploaded 12m ago</Text>
              </View>
              <TouchableOpacity style={styles.eyeBtn}>
                <MaterialIcons name="visibility" size={16} color="#5D5F5F" />
              </TouchableOpacity>
            </View>

            <View style={styles.actionButtonsRow}>
              <TouchableOpacity style={styles.subActionBtn}>
                <MaterialIcons name="visibility" size={16} color="#1A1C1C" />
                <Text style={styles.subActionBtnText}>View Document</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.subActionBtn}>
                <MaterialIcons name="swap-horiz" size={16} color="#1A1C1C" />
                <Text style={styles.subActionBtnText}>Replace</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Doc Card 2: COI */}
          <View style={styles.docCard}>
            <View style={styles.docCardTop}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.docTitle}>Certificate of Incorporation</Text>
                  <View style={styles.mandatoryBadge}>
                    <Text style={styles.mandatoryBadgeText}>Mandatory</Text>
                  </View>
                </View>
                <Text style={styles.docSubtitle}>Ministry of Corporate Affairs incorporation deed</Text>
              </View>
              <View style={styles.processBadge}>
                <MaterialIcons name="hourglass-top" size={12} color="#5D5F5F" />
                <Text style={styles.processBadgeText}>Under Process</Text>
              </View>
            </View>

            <View style={styles.fileRow}>
              <View style={styles.fileIconBox}>
                <MaterialIcons name="description" size={20} color="#000000" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.fileName}>Apex_Logistics_COI_2021.pdf</Text>
                <Text style={styles.fileMeta}>2.1 MB · Uploaded 8m ago</Text>
              </View>
              <TouchableOpacity style={styles.eyeBtn}>
                <MaterialIcons name="visibility" size={16} color="#5D5F5F" />
              </TouchableOpacity>
            </View>

            <View style={styles.actionButtonsRow}>
              <TouchableOpacity style={styles.subActionBtn}>
                <MaterialIcons name="visibility" size={16} color="#1A1C1C" />
                <Text style={styles.subActionBtnText}>View Document</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.subActionBtn}>
                <MaterialIcons name="swap-horiz" size={16} color="#1A1C1C" />
                <Text style={styles.subActionBtnText}>Replace</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Doc Card 3: PAN */}
          <View style={styles.docCard}>
            <View style={styles.docCardTop}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.docTitle}>Company PAN Card</Text>
                  <View style={styles.addedBadge}>
                    <Text style={styles.addedBadgeText}>Added</Text>
                  </View>
                </View>
                <Text style={styles.docSubtitle}>Registered entity tax permanent account card</Text>
              </View>
              <View style={styles.processBadge}>
                <MaterialIcons name="hourglass-top" size={12} color="#5D5F5F" />
                <Text style={styles.processBadgeText}>Under Process</Text>
              </View>
            </View>

            <View style={styles.fileRow}>
              <View style={styles.fileIconBox}>
                <MaterialIcons name="badge" size={20} color="#000000" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.fileName}>pan_card_doc.pdf</Text>
                <Text style={styles.fileMeta}>800 KB · Uploaded 3m ago</Text>
              </View>
              <TouchableOpacity style={styles.eyeBtn}>
                <MaterialIcons name="visibility" size={16} color="#5D5F5F" />
              </TouchableOpacity>
            </View>

            <View style={styles.actionButtonsRow}>
              <TouchableOpacity style={styles.subActionBtn}>
                <MaterialIcons name="visibility" size={16} color="#1A1C1C" />
                <Text style={styles.subActionBtnText}>View Document</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.subActionBtn}>
                <MaterialIcons name="swap-horiz" size={16} color="#1A1C1C" />
                <Text style={styles.subActionBtnText}>Replace</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Manual Compliance Escrow Notice */}
        <View style={styles.escrowNotice}>
          <MaterialIcons name="verified-user" size={20} color="#000000" style={{ marginTop: 2 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.escrowTitle}>Manual Compliance Escrow</Text>
            <Text style={styles.escrowBody}>
              All company credentials are held in secure compliance escrow and manually verified by the CargoSync verification desk. Approvals typically complete within 2–4 operational hours.
            </Text>
          </View>
        </View>

        {/* Live Support Banner */}
        <View style={styles.supportBanner}>
          <View style={styles.supportLeft}>
            <View style={styles.supportIconBox}>
              <MaterialIcons name="support-agent" size={20} color="#1A1C1C" />
            </View>
            <View>
              <Text style={styles.supportTitle}>Verification Desk Live</Text>
              <Text style={styles.supportSubtitle}>Toll-Free Support: 111111</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.callDeskBtn}>
            <MaterialIcons name="call" size={14} color="#1A1C1C" />
            <Text style={styles.callDeskBtnText}>Call Desk</Text>
          </TouchableOpacity>
        </View>

        {/* Sticky CTA */}
        <View style={styles.bottomBlock}>
          <PrimaryButton
            label="Submit for Company Verification"
            onPress={handleSubmit}
            loading={loading}
            size="lg"
            rightIcon={<MaterialIcons name="arrow-forward" size={18} color="#FFFFFF" />}
            style={styles.ctaButton}
          />
          <View style={styles.secureTransferRow}>
            <MaterialIcons name="lock" size={14} color="#5D5F5F" />
            <Text style={styles.secureTransferText}>256-bit encrypted enterprise transfer</Text>
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
  progressContainer: {
    gap: 6,
  },
  stepBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E8E8E8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  stepDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#000000',
  },
  stepBadgeText: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: '#1A1C1C',
    letterSpacing: 0.6,
  },
  stepTrack: {
    height: 5,
    backgroundColor: '#EEEEEE',
    borderRadius: 2.5,
    overflow: 'hidden',
    marginTop: 2,
  },
  stepFill: {
    height: '100%',
    backgroundColor: '#000000',
  },
  pageTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 22,
    color: '#1A1C1C',
    letterSpacing: -0.3,
    marginTop: 4,
  },
  pageSubhead: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: '#5D5F5F',
    lineHeight: 18,
  },
  companyCard: {
    backgroundColor: '#F4F3F3',
    borderRadius: 12,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  companyIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  companyName: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: '#1A1C1C',
  },
  gstRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  gstLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: 10,
    color: '#5D5F5F',
    letterSpacing: 0.6,
  },
  gstValue: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: '#1A1C1C',
  },
  docsSection: {
    gap: 12,
  },
  docsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  docsSectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: '#1A1C1C',
  },
  docsSectionMeta: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#5D5F5F',
  },
  docCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    gap: 10,
  },
  docCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  docTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: '#1A1C1C',
  },
  mandatoryBadge: {
    backgroundColor: '#FFDAD6',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: Radius.full,
  },
  mandatoryBadgeText: {
    fontFamily: FontFamily.bold,
    fontSize: 9,
    color: '#93000A',
  },
  addedBadge: {
    backgroundColor: '#EEEEEE',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: Radius.full,
  },
  addedBadgeText: {
    fontFamily: FontFamily.medium,
    fontSize: 9,
    color: '#5D5F5F',
  },
  docSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#5D5F5F',
    marginTop: 2,
  },
  processBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EEEEEE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  processBadgeText: {
    fontFamily: FontFamily.medium,
    fontSize: 10,
    color: '#5D5F5F',
  },
  fileRow: {
    backgroundColor: '#F4F3F3',
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  fileIconBox: {
    width: 34,
    height: 34,
    borderRadius: 6,
    backgroundColor: '#E2E2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileName: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
    color: '#1A1C1C',
  },
  fileMeta: {
    fontFamily: FontFamily.regular,
    fontSize: 10,
    color: '#5D5F5F',
    marginTop: 1,
  },
  eyeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  subActionBtn: {
    flex: 1,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: '#EEEEEE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  subActionBtnText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
    color: '#1A1C1C',
  },
  escrowNotice: {
    backgroundColor: '#E8E8E8',
    borderRadius: 12,
    padding: Spacing.md,
    flexDirection: 'row',
    gap: 10,
  },
  escrowTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: '#1A1C1C',
  },
  escrowBody: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#5D5F5F',
    marginTop: 2,
    lineHeight: 16,
  },
  supportBanner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  supportLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  supportIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  supportTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: '#1A1C1C',
  },
  supportSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#5D5F5F',
  },
  callDeskBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EEEEEE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  callDeskBtnText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 11,
    color: '#1A1C1C',
  },
  bottomBlock: {
    gap: 8,
    marginTop: 4,
  },
  ctaButton: {
    backgroundColor: '#000000',
    borderRadius: Radius.xs,
  },
  secureTransferRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  secureTransferText: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#5D5F5F',
  },
});
