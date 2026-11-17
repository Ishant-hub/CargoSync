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
import { UserRole } from '../../types';

type Props = NativeStackScreenProps<AuthStackParamList, 'ChooseRole'>;

export const ChooseRoleScreen: React.FC<Props> = ({ navigation, route }) => {
  const { language, toggleLanguage } = useLanguage();
  const { accountType } = route.params;

  const [selectedRole, setSelectedRole] = useState<UserRole>('driver');

  const handleContinue = () => {
    navigation.navigate('PersonalDetails', {
      role: selectedRole,
      accountType,
    });
  };

  const getRoleCta = () => {
    if (selectedRole === 'shipper') return 'Continue as Shipper';
    if (selectedRole === 'fleet') return 'Continue as Fleet Manager';
    return 'Continue as Driver';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
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
          <Text style={styles.headerTitle}>Carrier Onboarding Intro</Text>
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
          <View style={styles.stepBadgeRow}>
            <View style={styles.stepNumBadge}>
              <Text style={styles.stepNumText}>1</Text>
            </View>
            <Text style={styles.stepMetaText}>STEP 1 OF 3 • CHOOSE YOUR ROLE</Text>
          </View>
          <Text style={styles.stepPercentText}>33% completed</Text>
        </View>
        <View style={styles.stepTrack}>
          <View style={[styles.stepFill, { width: '33.33%' }]} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.titleText}>What is your primary role?</Text>
          <Text style={styles.subtitleText}>
            Select how you want to work on CargoSync. You will get dedicated tools tailored to your daily tasks.
          </Text>
        </View>

        {/* Roles List */}
        <View style={styles.rolesStack}>
          {/* 1. Shipper */}
          <TouchableOpacity
            style={[
              styles.roleCard,
              selectedRole === 'shipper' && styles.roleCardSelected,
            ]}
            onPress={() => setSelectedRole('shipper')}
            activeOpacity={0.9}
          >
            <View style={styles.roleCardTop}>
              <View style={styles.roleIconBox}>
                <MaterialIcons name="inventory-2" size={24} color="#1A1C1C" />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.roleTitleRow}>
                  <Text style={styles.roleTitle}>Shipper</Text>
                  <Text style={styles.roleParenthesis}>(Cargo Owner)</Text>
                </View>
                <View style={styles.roleTag}>
                  <Text style={styles.roleTagText}>Post &amp; Book Loads</Text>
                </View>
              </View>
              <View
                style={[
                  styles.radioCircle,
                  selectedRole === 'shipper' && styles.radioCircleActive,
                ]}
              >
                {selectedRole === 'shipper' && (
                  <MaterialIcons name="check" size={16} color="#FFFFFF" />
                )}
              </View>
            </View>

            <Text style={styles.roleDesc}>
              Book full or part trucks, track shipments in real time, and get instant digital proof of delivery.
            </Text>

            <View style={styles.roleFooterNote}>
              <MaterialIcons name="verified" size={16} color="#000000" />
              <Text style={styles.roleFooterNoteText}>
                Direct access to 48,000+ verified trucks at zero booking fees.
              </Text>
            </View>
          </TouchableOpacity>

          {/* 2. Driver */}
          <TouchableOpacity
            style={[
              styles.roleCard,
              selectedRole === 'driver' && styles.roleCardSelected,
            ]}
            onPress={() => setSelectedRole('driver')}
            activeOpacity={0.9}
          >
            <View style={styles.roleCardTop}>
              <View style={[styles.roleIconBox, selectedRole === 'driver' && styles.roleIconBoxActive]}>
                <MaterialIcons
                  name="local-shipping"
                  size={24}
                  color={selectedRole === 'driver' ? '#109752' : '#1A1C1C'}
                />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.roleTitleRow}>
                  <Text style={styles.roleTitle}>Driver</Text>
                  <Text style={styles.roleParenthesis}>(Commercial Pilot)</Text>
                </View>
                <View style={[styles.roleTag, selectedRole === 'driver' && styles.roleTagActive]}>
                  <Text style={[styles.roleTagText, selectedRole === 'driver' && styles.roleTagTextActive]}>
                    Accept Trips &amp; Earn
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.radioCircle,
                  selectedRole === 'driver' && styles.radioCircleActive,
                ]}
              >
                {selectedRole === 'driver' && (
                  <MaterialIcons name="check" size={16} color="#FFFFFF" />
                )}
              </View>
            </View>

            <Text style={styles.roleDesc}>
              Find high-paying nearby loads, get step-by-step corridor navigation, and receive instant T+0 fuel &amp; trip payouts.
            </Text>

            <View style={styles.roleFooterNote}>
              <MaterialIcons name="payments" size={16} color="#68DD8F" />
              <Text style={styles.roleFooterNoteText}>
                Instant settlements to your bank account after delivery.
              </Text>
            </View>
          </TouchableOpacity>

          {/* 3. Fleet Manager */}
          <TouchableOpacity
            style={[
              styles.roleCard,
              selectedRole === 'fleet' && styles.roleCardSelected,
            ]}
            onPress={() => setSelectedRole('fleet')}
            activeOpacity={0.9}
          >
            <View style={styles.roleCardTop}>
              <View style={styles.roleIconBox}>
                <MaterialIcons name="hub" size={24} color="#1A1C1C" />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.roleTitleRow}>
                  <Text style={styles.roleTitle}>Fleet Manager</Text>
                  <Text style={styles.roleParenthesis}>(Owner-Operator)</Text>
                </View>
                <View style={styles.roleTag}>
                  <Text style={styles.roleTagText}>Manage 1-5 Trucks</Text>
                </View>
              </View>
              <View
                style={[
                  styles.radioCircle,
                  selectedRole === 'fleet' && styles.radioCircleActive,
                ]}
              >
                {selectedRole === 'fleet' && (
                  <MaterialIcons name="check" size={16} color="#FFFFFF" />
                )}
              </View>
            </View>

            <Text style={styles.roleDesc}>
              Manage your owned vehicles, assign loads to your drivers, and maximize load consolidation on return journeys.
            </Text>

            <View style={styles.roleFooterNote}>
              <MaterialIcons name="toll" size={16} color="#000000" />
              <Text style={styles.roleFooterNoteText}>
                Real-time FASTag balance tracking and deadhead recovery.
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Note banner */}
        <View style={styles.noteBanner}>
          <MaterialIcons name="info" size={18} color="#5D5F5F" />
          <Text style={styles.noteBannerText}>
            <Text style={{ fontFamily: FontFamily.bold, color: '#1A1C1C' }}>Note: </Text>
            Independent roles can be operated without company registration.
          </Text>
        </View>
      </ScrollView>

      {/* Sticky Bottom Area */}
      <View style={styles.bottomBar}>
        <PrimaryButton
          label={getRoleCta()}
          onPress={handleContinue}
          size="lg"
          rightIcon={<MaterialIcons name="arrow-forward" size={18} color="#FFFFFF" />}
          style={styles.ctaButton}
        />
        <Text style={styles.subtextNotice}>
          You can add or link business entities later from Settings.
        </Text>
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
  stepBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stepNumBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: '#FFFFFF',
  },
  stepMetaText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 11,
    color: '#4C4546',
    letterSpacing: 0.5,
  },
  stepPercentText: {
    fontFamily: FontFamily.medium,
    fontSize: 11,
    color: '#5D5F5F',
  },
  stepTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E8E8E8',
    overflow: 'hidden',
  },
  stepFill: {
    height: '100%',
    backgroundColor: '#000000',
  },
  scrollContent: {
    paddingHorizontal: Spacing.margin,
    paddingTop: Spacing.sm,
    paddingBottom: 110,
    gap: Spacing.md,
  },
  titleSection: {
    marginVertical: 4,
  },
  titleText: {
    fontFamily: FontFamily.bold,
    fontSize: 22,
    color: '#1A1C1C',
    letterSpacing: -0.3,
  },
  subtitleText: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: '#5D5F5F',
    marginTop: 4,
    lineHeight: 18,
  },
  rolesStack: {
    gap: 12,
  },
  roleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: '#E2E2E2',
    gap: 10,
  },
  roleCardSelected: {
    borderColor: '#68DD8F',
    borderWidth: 2,
  },
  roleCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  roleIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleIconBoxActive: {
    backgroundColor: '#00210D',
  },
  roleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  roleTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 17,
    color: '#1A1C1C',
  },
  roleParenthesis: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: '#5D5F5F',
  },
  roleTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEEEEE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
    marginTop: 4,
  },
  roleTagActive: {
    backgroundColor: '#00210D',
  },
  roleTagText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 11,
    color: '#1A1C1C',
  },
  roleTagTextActive: {
    color: '#109752',
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    backgroundColor: '#000000',
  },
  roleDesc: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: '#5D5F5F',
    lineHeight: 18,
  },
  roleFooterNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F4F3F3',
    padding: 8,
    borderRadius: 6,
  },
  roleFooterNoteText: {
    fontFamily: FontFamily.medium,
    fontSize: 11,
    color: '#1A1C1C',
    flex: 1,
  },
  noteBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EEEEEE',
    padding: 10,
    borderRadius: 8,
  },
  noteBannerText: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: '#5D5F5F',
    flex: 1,
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
    gap: 6,
  },
  ctaButton: {
    backgroundColor: '#000000',
    borderRadius: Radius.xs,
  },
  subtextNotice: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#5D5F5F',
    textAlign: 'center',
  },
});
