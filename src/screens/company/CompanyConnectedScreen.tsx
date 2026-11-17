import React from 'react';
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
import { PrimaryButton, SecondaryButton } from '../../components/common/AppButton';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

type Props = NativeStackScreenProps<AuthStackParamList, 'CompanyConnected'>;

const TERMINAL_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAzoMmnojq2xi-dTY1vVrA--p8u-R5NriAGq5pALxLh-r_lXHHA-xqW-TP_ueNibzYTlfhcLh6MWSdwrfdQlGhJklOZaFwjX2UzeEYMUSTXKC3C73gywdFer4LJzTi3-k_V7rTBzVNs1t-XAb-cfEtmn7wPGmmc9px8OjdRVKt3ilid1wb_6oyMQn1_gkQ4u0X8HAqVR1rGBrjkvu14s0QqnxHa2Rzwi84rfuL58BM';

export const CompanyConnectedScreen: React.FC<Props> = ({ navigation, route }) => {
  const { language, toggleLanguage } = useLanguage();
  const { switchRole } = useAuth();
  const { companyName, position } = route.params;

  const handleStartWork = async () => {
    await switchRole('driver');
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
          <Text style={styles.headerTitle}>Join Company</Text>
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
        {/* Success Celebration Banner */}
        <View style={styles.celebrationCard}>
          <View style={styles.checkCircle}>
            <MaterialIcons name="check-circle" size={36} color="#000000" />
          </View>

          <Text style={styles.celebrationTitle}>You're Connected!</Text>
          <Text style={styles.celebrationSubhead}>
            You've successfully joined your company fleet network on CargoSync.
          </Text>

          <View style={styles.workspacePill}>
            <View style={styles.liveDot} />
            <Text style={styles.workspacePillText}>WORKSPACE SYNC LIVE</Text>
          </View>
        </View>

        {/* Organization Card */}
        <View style={styles.card}>
          <View style={styles.orgHeader}>
            <View style={styles.orgHeaderLeft}>
              <View style={styles.orgIconBox}>
                <MaterialIcons name="local-shipping" size={22} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.orgMetaLabel}>COMPANY</Text>
                <Text style={styles.orgName}>{companyName || 'Apex Logistics Pvt Ltd'}</Text>
              </View>
            </View>
            <View style={styles.verifiedBadge}>
              <MaterialIcons name="shield" size={14} color="#1A1C1C" />
              <Text style={styles.verifiedBadgeText}>Verified</Text>
            </View>
          </View>

          {/* Terminal Image */}
          <View style={styles.terminalFrame}>
            <Image
              source={{ uri: TERMINAL_IMG }}
              style={styles.terminalImg}
              resizeMode="cover"
            />
            <View style={styles.terminalOverlay}>
              <MaterialIcons name="corporate-fare" size={14} color="#FFFFFF" />
              <Text style={styles.terminalOverlayText}>
                North Terminal Operations • Hub #04
              </Text>
            </View>
          </View>

          {/* Details Grid */}
          <View style={styles.gridRow}>
            <View style={styles.gridCell}>
              <View style={styles.gridCellHeader}>
                <MaterialIcons name="badge" size={15} color="#5D5F5F" />
                <Text style={styles.gridCellLabel}>ASSIGNED ROLE</Text>
              </View>
              <Text style={styles.gridCellVal}>{position || 'Commercial Driver'}</Text>
            </View>
            <View style={styles.gridCell}>
              <View style={styles.gridCellHeader}>
                <MaterialIcons name="tag" size={15} color="#5D5F5F" />
                <Text style={styles.gridCellLabel}>ORGANIZATION ID</Text>
              </View>
              <Text style={styles.gridCellValMono}>CS-ORG-49201</Text>
            </View>
          </View>

          <View style={styles.adminRow}>
            <View style={styles.adminLeft}>
              <View style={styles.adminIconBox}>
                <MaterialIcons name="admin-panel-settings" size={18} color="#1A1C1C" />
              </View>
              <View>
                <Text style={styles.gridCellLabel}>INVITING ADMIN</Text>
                <Text style={styles.adminName}>Vikram Malhotra (Fleet Admin)</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.chatBtn}>
              <MaterialIcons name="chat" size={16} color="#1A1C1C" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Access & Onboarding Status Module */}
        <View style={styles.card}>
          <View style={styles.statusHeaderRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <MaterialIcons name="task-alt" size={18} color="#1A1C1C" />
              <Text style={styles.statusSectionTitle}>Access &amp; Onboarding Status</Text>
            </View>
            <Text style={styles.stepCountText}>Step 1 of 2</Text>
          </View>

          <View style={styles.checkItemRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={[styles.checkCircleSmall, { backgroundColor: '#85FAA9' }]}>
                <MaterialIcons name="done" size={14} color="#00210D" />
              </View>
              <View>
                <Text style={styles.checkItemTitle}>Company Association</Text>
                <Text style={styles.checkItemSub}>Authorized roster member</Text>
              </View>
            </View>
            <View style={styles.activePill}>
              <Text style={styles.activePillText}>Active</Text>
            </View>
          </View>

          <View style={styles.checkItemRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={[styles.checkCircleSmall, { backgroundColor: '#EEEEEE' }]}>
                <MaterialIcons name="schedule" size={14} color="#5D5F5F" />
              </View>
              <View>
                <Text style={styles.checkItemTitle}>Personal Identity Verification</Text>
                <Text style={styles.checkItemSub}>DL &amp; Badge check pending</Text>
              </View>
            </View>
            <View style={styles.reviewPill}>
              <Text style={styles.reviewPillText}>In Review</Text>
            </View>
          </View>

          <View style={styles.infoCallout}>
            <MaterialIcons name="info" size={16} color="#5D5F5F" style={{ marginTop: 2 }} />
            <Text style={styles.infoCalloutText}>
              You can browse assigned equipment and company guidelines now. Trip assignments will activate upon document clearance.
            </Text>
          </View>
        </View>

        {/* Action CTAs */}
        <View style={styles.actionsWrap}>
          <PrimaryButton
            label="Continue to Driver Dashboard"
            onPress={handleStartWork}
            size="lg"
            rightIcon={<MaterialIcons name="arrow-forward" size={18} color="#FFFFFF" />}
            style={styles.ctaButton}
          />

          <SecondaryButton
            label="View Company Guidelines"
            onPress={() => {}}
            size="md"
            leftIcon={<MaterialIcons name="menu-book" size={16} color="#1A1C1C" />}
            style={styles.guidelinesBtn}
          />
        </View>

        {/* Footer Support */}
        <View style={styles.footerSupport}>
          <View style={styles.helplineBtn}>
            <MaterialIcons name="call" size={15} color="#5D5F5F" />
            <Text style={styles.helplineBtnText}>Support Helpline: 111111</Text>
          </View>
          <Text style={styles.helplineSub}>
            Available 24/7 • Apex Carrier Operations Desk
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
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },
  celebrationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    alignItems: 'center',
    gap: 8,
  },
  checkCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#85FAA9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  celebrationTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 22,
    color: '#1A1C1C',
    letterSpacing: -0.3,
  },
  celebrationSubhead: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: '#5D5F5F',
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 18,
  },
  workspacePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EEEEEE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    marginTop: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#109752',
  },
  workspacePillText: {
    fontFamily: FontFamily.bold,
    fontSize: 9,
    color: '#4C4546',
    letterSpacing: 0.8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    gap: 12,
  },
  orgHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orgHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  orgIconBox: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orgMetaLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: 10,
    color: '#5D5F5F',
    letterSpacing: 0.8,
  },
  orgName: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: '#1A1C1C',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EEEEEE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  verifiedBadgeText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 11,
    color: '#1A1C1C',
  },
  terminalFrame: {
    height: 110,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#EEEEEE',
  },
  terminalImg: {
    width: '100%',
    height: '100%',
  },
  terminalOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  terminalOverlayText: {
    fontFamily: FontFamily.medium,
    fontSize: 11,
    color: '#FFFFFF',
  },
  gridRow: {
    flexDirection: 'row',
    gap: 8,
  },
  gridCell: {
    flex: 1,
    backgroundColor: '#F4F3F3',
    padding: 10,
    borderRadius: 8,
    gap: 4,
  },
  gridCellHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  gridCellLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: 9,
    color: '#5D5F5F',
    letterSpacing: 0.6,
  },
  gridCellVal: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: '#1A1C1C',
  },
  gridCellValMono: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: '#1A1C1C',
  },
  adminRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F4F3F3',
    padding: 10,
    borderRadius: 8,
  },
  adminLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  adminIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminName: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
    color: '#1A1C1C',
  },
  chatBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusSectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: '#1A1C1C',
  },
  stepCountText: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#5D5F5F',
  },
  checkItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F4F3F3',
    padding: 10,
    borderRadius: 8,
  },
  checkCircleSmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkItemTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: '#1A1C1C',
  },
  checkItemSub: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#5D5F5F',
  },
  activePill: {
    backgroundColor: '#85FAA9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  activePillText: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: '#00210D',
  },
  reviewPill: {
    backgroundColor: '#EEEEEE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  reviewPillText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 10,
    color: '#5D5F5F',
  },
  infoCallout: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#EEEEEE',
    padding: 10,
    borderRadius: 8,
  },
  infoCalloutText: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#4C4546',
    lineHeight: 16,
  },
  actionsWrap: {
    gap: 10,
    marginTop: 4,
  },
  ctaButton: {
    backgroundColor: '#000000',
    borderRadius: Radius.xs,
  },
  guidelinesBtn: {
    backgroundColor: '#EEEEEE',
    borderColor: '#EEEEEE',
    borderRadius: Radius.xs,
  },
  footerSupport: {
    alignItems: 'center',
    gap: 4,
  },
  helplineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  helplineBtnText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 11,
    color: '#1A1C1C',
  },
  helplineSub: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#5D5F5F',
  },
});
