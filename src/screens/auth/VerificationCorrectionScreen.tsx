import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { Colors, FontFamily, Spacing, Radius } from '../../theme/tokens';
import { PrimaryButton } from '../../components/common/AppButton';
import { useLanguage } from '../../context/LanguageContext';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'VerificationCorrection'>;
};

const DL_CARD_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAgOlJo2k3ai9xL6EaIQVhpsszOuD_HuYixZBoegBUmkeXrIDk8cflLIGwXSDXGbmJPXtCJH5itGMPVqdLj-nPSP0A7YRTNNDmGaaet3RTHIVPBgrsRa5LFKjS1UD5w50kW0PYM3lelWc94kdSPx_uoWMApUdGkK9rOaF2PcDL4aebpGL9qELdWiEmsJktzwzqOkkf0USTD8jFt_MfOmiUBDKhnQWmZlvIwuHl-1F8';

export const VerificationCorrectionScreen: React.FC<Props> = ({ navigation }) => {
  const { language, toggleLanguage } = useLanguage();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleResubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        navigation.navigate('Welcome');
      }, 1200);
    }, 900);
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
          <Text style={styles.headerTitle}>Verification Status</Text>
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
        {/* Action Required Banner */}
        <View style={styles.alertHeader}>
          <View style={styles.alertPill}>
            <MaterialIcons name="warning" size={14} color="#93000A" />
            <Text style={styles.alertPillText}>ACTION REQUIRED</Text>
          </View>
          <Text style={styles.alertTitle}>Action Required</Text>
          <Text style={styles.alertSubhead}>
            Some information needs to be corrected before we can approve your account and activate your fleet access.
          </Text>
        </View>

        {/* Affected Document Card */}
        <View style={styles.docCard}>
          <View style={styles.docHeader}>
            <View style={styles.docIconBox}>
              <MaterialIcons name="error" size={20} color="#1A1C1C" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.docMetaRow}>
                <Text style={styles.docMetaLabel}>AFFECTED DOCUMENT</Text>
                <Text style={styles.docDate}>24 Oct 2024</Text>
              </View>
              <Text style={styles.docName}>Commercial Driving Licence (DL)</Text>
            </View>
          </View>

          <View style={styles.reviewerNoteBox}>
            <View style={styles.reviewerNoteHeader}>
              <MaterialIcons name="info" size={16} color="#BA1A1A" />
              <Text style={styles.reviewerNoteTitle}>Reviewer Note</Text>
            </View>
            <Text style={styles.reviewerNoteBody}>
              Uploaded scan is blurry and the license expiry date is not clearly legible. Please upload a clear photo of the original physical card in good lighting.
            </Text>
          </View>

          <View style={styles.docFooterRow}>
            <View style={styles.uidRow}>
              <MaterialIcons name="verified-user" size={16} color="#5D5F5F" />
              <Text style={styles.uidText}>Document UID: DL-8842-MH</Text>
            </View>
            <View style={styles.attemptBadge}>
              <Text style={styles.attemptBadgeText}>Attempt 1/3</Text>
            </View>
          </View>
        </View>

        {/* Replacement Upload Section */}
        <View style={styles.uploadSection}>
          <Text style={styles.sectionTitle}>Replacement Upload</Text>

          <View style={styles.previewBox}>
            <Image
              source={{ uri: DL_CARD_IMG }}
              style={styles.previewImage}
              resizeMode="cover"
            />
            <View style={styles.previewOverlay}>
              <TouchableOpacity style={styles.retakeButton}>
                <MaterialIcons name="photo-camera" size={18} color="#1A1C1C" />
                <Text style={styles.retakeButtonText}>Retake Photo</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.fileStatusBox}>
            <View style={styles.fileStatusLeft}>
              <View style={styles.fileIconBox}>
                <MaterialIcons name="description" size={20} color="#1A1C1C" />
              </View>
              <View>
                <Text style={styles.fileName}>DL_scan_front_retake.jpg</Text>
                <Text style={styles.fileMeta}>3.4 MB • High Clarity</Text>
              </View>
            </View>
            <View style={styles.readyBadge}>
              <MaterialIcons name="check-circle" size={16} color="#109752" />
              <Text style={styles.readyBadgeText}>Ready</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.browseButton}>
            <MaterialIcons name="upload-file" size={18} color="#1A1C1C" />
            <Text style={styles.browseButtonText}>Browse Device Storage</Text>
          </TouchableOpacity>
        </View>

        {/* Action Button & Support */}
        <View style={styles.actionWrap}>
          <PrimaryButton
            label={submitted ? 'Submitted!' : 'Resubmit for Review'}
            onPress={handleResubmit}
            loading={submitting}
            size="lg"
            rightIcon={<MaterialIcons name="arrow-forward" size={18} color="#FFFFFF" />}
            style={styles.submitBtn}
          />

          <View style={styles.supportBox}>
            <Text style={styles.supportSubhead}>
              Need help? We're available 24/7 for driver support.
            </Text>
            <View style={styles.helplineRow}>
              <MaterialIcons name="call" size={16} color="#1A1C1C" />
              <Text style={styles.helplineText}>Toll-Free Support: 111111</Text>
            </View>
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
  alertHeader: {
    gap: 6,
  },
  alertPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFDAD6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  alertPillText: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: '#93000A',
    letterSpacing: 0.5,
  },
  alertTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 22,
    color: '#1A1C1C',
    letterSpacing: -0.3,
  },
  alertSubhead: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: '#5D5F5F',
    lineHeight: 18,
  },
  docCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    gap: 12,
  },
  docHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  docIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#DCEDDD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  docMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  docMetaLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: 10,
    color: '#5D5F5F',
    letterSpacing: 0.6,
  },
  docDate: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#5D5F5F',
  },
  docName: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: '#1A1C1C',
    marginTop: 2,
  },
  reviewerNoteBox: {
    backgroundColor: '#F4F3F3',
    padding: 10,
    borderRadius: 8,
    gap: 4,
  },
  reviewerNoteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reviewerNoteTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
    color: '#1A1C1C',
  },
  reviewerNoteBody: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: '#4C4546',
    lineHeight: 16,
  },
  docFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  uidRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  uidText: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: '#5D5F5F',
  },
  attemptBadge: {
    backgroundColor: '#EEEEEE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  attemptBadgeText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 11,
    color: '#1A1C1C',
  },
  uploadSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    gap: 10,
  },
  sectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: '#1A1C1C',
  },
  previewBox: {
    height: 140,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#EEEEEE',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewOverlay: {
    ...StyleSheet.absoluteFill as any,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.full,
  },
  retakeButtonText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: '#1A1C1C',
  },
  fileStatusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F4F3F3',
    padding: 10,
    borderRadius: 8,
  },
  fileStatusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fileIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileName: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: '#1A1C1C',
  },
  fileMeta: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#5D5F5F',
  },
  readyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  readyBadgeText: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: '#109752',
  },
  browseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#DCEDDD',
    paddingVertical: 10,
    borderRadius: Radius.full,
  },
  browseButtonText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: '#1A1C1C',
  },
  actionWrap: {
    gap: 12,
    marginTop: 4,
  },
  submitBtn: {
    backgroundColor: '#000000',
    borderRadius: Radius.xs,
  },
  supportBox: {
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
