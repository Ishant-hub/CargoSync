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
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { Colors, FontFamily, Spacing, Radius } from '../../theme/tokens';
import { PrimaryButton } from '../../components/common/AppButton';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

type Props = NativeStackScreenProps<AuthStackParamList, 'IdentityVerification'>;

const DL_THUMBNAIL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDgdPXjLj6wWOC1oudAr3vR4Ef0WvpjgAghMv1u0ZM_UaCH5pytt3At1upkfOA3oF5os961JjFLJFJK1G1-vaSKS3_ltl9fJZyTMePkDQOraSTGHexnPTh4-QazcxG_tAFYac_KDeENgCVCjrb1ZhUmUPd0oEpJTNjBwkXu4LQvMx9Am2fisneslOXqgBrp7r-5EARNEiDZoaYlS9EhkMeQZcyUFlaygvqcRLwEC7w';

const SELFIE_THUMBNAIL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAjMXnw0Z9nR4eIAuj3ZTRFoYCCLjp5Qnz4-YfJ2HjKI4yBitoTxjgBONTsJo42Cl8_Es2lUvqr7x7BVEkR-MhUHi-Kxteol2OWNhcdw_oeIlr-Upa3hg_b3-YR0RIO_nQJNjPpuYfvxNFj0YEgS0dU7Yt-TMUvB7-7QZhY_l8406SF0ap-51TAnEEUp1EaVBA33pE2F9wKFFnVw1NwWGIRiIH9TUY0dS3i7ogDmS8';

export const IdentityVerificationScreen: React.FC<Props> = ({ navigation, route }) => {
  const { language, toggleLanguage } = useLanguage();
  const { onboardIndividual } = useAuth();
  const { role, name } = route.params;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const registeredUser = await onboardIndividual({
        name,
        email: `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        phone: '+91 98765 43210',
        role: role as UserRole,
      });

      navigation.navigate('RegistrationComplete', {
        role,
        name,
        accountId: registeredUser.id,
      });
    } catch {
      setError('Registration submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
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
          <Text style={styles.headerTitle}>Document Upload</Text>
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

      {/* Step Tracker Strip */}
      <View style={styles.stepTrackStrip}>
        <View style={styles.stepPill}>
          <View style={styles.stepDot} />
          <Text style={styles.stepPillText}>STEP 3 OF 3</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Verification Cards Stack */}
        <View style={styles.cardsStack}>
          {/* Card 1: Aadhaar Card */}
          <View style={styles.docCard}>
            <View style={styles.docCardHeader}>
              <View style={styles.docIconTitleRow}>
                <View style={styles.docIconBox}>
                  <MaterialIcons name="badge" size={20} color="#1A1C1C" />
                </View>
                <View>
                  <Text style={styles.docTitle}>Aadhaar Card</Text>
                  <Text style={styles.docSubtitle}>Identity Proof</Text>
                </View>
              </View>
              <View style={styles.processBadge}>
                <MaterialIcons name="schedule" size={14} color="#5D5F5F" />
                <Text style={styles.processBadgeText}>Under Process</Text>
              </View>
            </View>

            <View style={styles.docDetailBox}>
              <View>
                <Text style={styles.detailLabel}>MASKED UIDAI</Text>
                <Text style={styles.detailValue}>XXXX-XXXX-4912</Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.actionLinkText}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Card 2: Commercial Driving Licence */}
          <View style={styles.docCard}>
            <View style={styles.docCardHeader}>
              <View style={styles.docIconTitleRow}>
                <View style={styles.docIconBox}>
                  <MaterialIcons name="credit-card" size={20} color="#1A1C1C" />
                </View>
                <View>
                  <Text style={styles.docTitle}>Commercial DL</Text>
                  <Text style={styles.docSubtitle}>Front &amp; Back Scans</Text>
                </View>
              </View>
              <View style={styles.processBadge}>
                <MaterialIcons name="schedule" size={14} color="#5D5F5F" />
                <Text style={styles.processBadgeText}>Under Process</Text>
              </View>
            </View>

            <View style={[styles.docDetailBox, { gap: 12 }]}>
              <View style={styles.dlThumbnailBox}>
                <Image
                  source={{ uri: DL_THUMBNAIL }}
                  style={styles.thumbnailImg}
                  resizeMode="cover"
                />
                <View style={styles.eyeOverlay}>
                  <MaterialIcons name="visibility" size={16} color="#FFFFFF" />
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.detailValue}>DL-1420210089241</Text>
                <Text style={styles.detailSubValue}>HCV (Heavy Commercial Vehicle)</Text>
              </View>
            </View>

            <View style={styles.docFooterRow}>
              <View style={styles.metaWithIcon}>
                <MaterialIcons name="event-available" size={15} color="#5D5F5F" />
                <Text style={styles.metaText}>Valid thru Nov 2031</Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.actionLinkText}>Re-upload</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Card 3: Vehicle RC */}
          <View style={styles.docCard}>
            <View style={styles.docCardHeader}>
              <View style={styles.docIconTitleRow}>
                <View style={styles.docIconBox}>
                  <MaterialIcons name="local-shipping" size={20} color="#1A1C1C" />
                </View>
                <View>
                  <Text style={styles.docTitle}>Vehicle RC</Text>
                  <Text style={styles.docSubtitle}>Registration Certificate</Text>
                </View>
              </View>
              <View style={styles.processBadge}>
                <MaterialIcons name="schedule" size={14} color="#5D5F5F" />
                <Text style={styles.processBadgeText}>Under Process</Text>
              </View>
            </View>

            <View style={styles.docDetailBox}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.detailValue}>HR-55-AJ-9082</Text>
                  <View style={styles.tagBadge}>
                    <Text style={styles.tagBadgeText}>BS-VI</Text>
                  </View>
                </View>
                <Text style={styles.detailSubValue}>16-Wheeler Multi-Axle Freight</Text>
              </View>
              <View style={styles.rcIconCircle}>
                <MaterialIcons name="description" size={20} color="#1A1C1C" />
              </View>
            </View>

            <View style={styles.docFooterRow}>
              <View style={styles.metaWithIcon}>
                <MaterialIcons name="pin-drop" size={15} color="#5D5F5F" />
                <Text style={styles.metaText}>Gurgaon North RTO</Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.actionLinkText}>Replace Doc</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Card 4: Driver Selfie / Liveness Check */}
          <View style={styles.docCard}>
            <View style={styles.docCardHeader}>
              <View style={styles.docIconTitleRow}>
                <View style={styles.selfieCircle}>
                  <Image
                    source={{ uri: SELFIE_THUMBNAIL }}
                    style={styles.thumbnailImg}
                    resizeMode="cover"
                  />
                </View>
                <View>
                  <Text style={styles.docTitle}>Live Liveness Check</Text>
                  <Text style={styles.docSubtitle}>Facial biometric</Text>
                </View>
              </View>
              <View style={styles.processBadge}>
                <MaterialIcons name="schedule" size={14} color="#5D5F5F" />
                <Text style={styles.processBadgeText}>Under Process</Text>
              </View>
            </View>

            <View style={styles.docDetailBox}>
              <View style={styles.metaWithIcon}>
                <MaterialIcons name="photo-camera" size={16} color="#5D5F5F" />
                <Text style={styles.metaText}>Photo captured</Text>
              </View>
              <TouchableOpacity>
                <Text style={[styles.actionLinkText, { textDecorationLine: 'underline' }]}>
                  Retake Photo
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <MaterialIcons name="error-outline" size={16} color="#BA1A1A" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}
      </ScrollView>

      {/* Sticky Bottom Submission Area */}
      <View style={styles.bottomBar}>
        <PrimaryButton
          label="Submit & Complete Registration"
          onPress={handleSubmit}
          loading={loading}
          size="lg"
          rightIcon={<MaterialIcons name="arrow-forward" size={18} color="#FFFFFF" />}
          style={styles.ctaButton}
        />
        <Text style={styles.supportText}>Toll-Free Support: 111111</Text>
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
  stepTrackStrip: {
    paddingHorizontal: Spacing.margin,
    paddingVertical: 10,
  },
  stepPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EEEEEE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  stepDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#5D5F5F',
  },
  stepPillText: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: '#1A1C1C',
    letterSpacing: 0.8,
  },
  scrollContent: {
    paddingHorizontal: Spacing.margin,
    paddingTop: Spacing.xs,
    paddingBottom: 110,
    gap: Spacing.md,
  },
  cardsStack: {
    gap: 12,
  },
  docCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    gap: 10,
  },
  docCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  docIconTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  docIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selfieCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#EEEEEE',
  },
  docTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: '#1A1C1C',
  },
  docSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: '#5D5F5F',
    marginTop: 1,
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
    fontFamily: FontFamily.semiBold,
    fontSize: 11,
    color: '#5D5F5F',
  },
  docDetailBox: {
    backgroundColor: '#F4F3F3',
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: 10,
    color: '#5D5F5F',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: '#1A1C1C',
    marginTop: 2,
  },
  detailSubValue: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: '#5D5F5F',
    marginTop: 2,
  },
  actionLinkText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
    color: '#5D5F5F',
  },
  dlThumbnailBox: {
    width: 60,
    height: 44,
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#E2E2E2',
  },
  thumbnailImg: {
    width: '100%',
    height: '100%',
  },
  eyeOverlay: {
    ...StyleSheet.absoluteFill as any,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  docFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  metaWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: '#5D5F5F',
  },
  tagBadge: {
    backgroundColor: '#E2E2E2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagBadgeText: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: '#1A1C1C',
  },
  rcIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFDAD6',
    padding: 10,
    borderRadius: 8,
  },
  errorText: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: '#BA1A1A',
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
    alignItems: 'center',
    gap: 8,
  },
  ctaButton: {
    backgroundColor: '#000000',
    borderRadius: Radius.xs,
  },
  supportText: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: '#5D5F5F',
  },
});
