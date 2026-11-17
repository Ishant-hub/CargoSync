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
  navigation: NativeStackNavigationProp<AuthStackParamList, 'AccountSelection'>;
};

const INDIVIDUAL_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAuaiQYggQiKNHoNVsc3HGX7OkhYa0WK599akPSjUw2FW96ODNHJpbigY6EOpmeVouxzwrRlO_oaazBiS89KYg5krgiPL-jD_xHs0L8pgfb9lq9p_2PKte2Qs_7L5ugFv12iWSDPVZiCQyyIiYZ3AO2LtUr27g5PDha9YWF8kTypKz5cvu5xPiNZez48G4TCmvyhSt7EhSLRf9lKEqiYM3ptzUEh9tpsfiZW_ExHB4';

const COMPANY_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBK8gX0fW0u9kHUdgCKLVILCCksya8MG7taWBH34xgD050lQHlolm4K1POR6Bxu1Xf654ZdQH5gwwjGiRfb0TM3_pdizsgTYebKb6YLQbX20bCYOv3BkX1WC7lHSIErK1zPRp951wy4sTJLrrAbKSWocHcpb31CKdnflvX-gBCG8T57zgqYUgAOxwb-4HekfmIl-yNSehjbL-lbsIBl3ZViQsS-iysas-EPkkPV9k0';

export const AccountSelectionScreen: React.FC<Props> = ({ navigation }) => {
  const { language, toggleLanguage } = useLanguage();
  const [selectedType, setSelectedType] = useState<'individual' | 'company'>('individual');
  const [selectedPathway, setSelectedPathway] = useState<'create' | 'join'>('create');

  const handleContinue = () => {
    if (selectedType === 'individual') {
      navigation.navigate('ChooseRole', { accountType: 'individual' });
    } else {
      if (selectedPathway === 'create') {
        navigation.navigate('CompanyRegistration');
      } else {
        navigation.navigate('JoinCompany');
      }
    }
  };

  const getCtaLabel = () => {
    if (selectedType === 'individual') return 'Continue as Individual';
    return selectedPathway === 'create'
      ? 'Continue to Create Company'
      : 'Continue to Join Company';
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

        <Text style={styles.headerBrand}>CargoSync</Text>

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
        {/* Title and Subtitle */}
        <View style={styles.titleSection}>
          <Text style={styles.titleText}>How would you like to use CargoSync?</Text>
          <Text style={styles.subtitleText}>Choose an account type to get started.</Text>
        </View>

        {/* Option 1: Individual */}
        <TouchableOpacity
          style={[
            styles.accountCard,
            selectedType === 'individual' && styles.accountCardSelected,
          ]}
          onPress={() => setSelectedType('individual')}
          activeOpacity={0.9}
        >
          <View style={styles.cardHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Individual</Text>
              <Text style={styles.cardSubtitle}>
                For independent shippers, drivers and truck owners.
              </Text>
            </View>
            <View
              style={[
                styles.radioCircle,
                selectedType === 'individual' && styles.radioCircleActive,
              ]}
            >
              {selectedType === 'individual' && (
                <MaterialIcons name="check" size={16} color="#FFFFFF" />
              )}
            </View>
          </View>

          <View style={styles.imageFrame}>
            <Image
              source={{ uri: INDIVIDUAL_IMG }}
              style={styles.cardImage}
              resizeMode="cover"
            />
          </View>
        </TouchableOpacity>

        {/* Option 2: Company */}
        <TouchableOpacity
          style={[
            styles.accountCard,
            selectedType === 'company' && styles.accountCardSelected,
          ]}
          onPress={() => setSelectedType('company')}
          activeOpacity={0.9}
        >
          <View style={styles.cardHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Company</Text>
              <Text style={styles.cardSubtitle}>
                For businesses managing teams, trucks and shipments.
              </Text>
            </View>
            <View
              style={[
                styles.radioCircle,
                selectedType === 'company' && styles.radioCircleActive,
              ]}
            >
              {selectedType === 'company' && (
                <MaterialIcons name="check" size={16} color="#FFFFFF" />
              )}
            </View>
          </View>

          <View style={styles.imageFrame}>
            <Image
              source={{ uri: COMPANY_IMG }}
              style={styles.cardImage}
              resizeMode="cover"
            />
          </View>

          {/* Sub Pathways for Company */}
          {selectedType === 'company' && (
            <View style={styles.companyPathways}>
              <Text style={styles.pathwayHeading}>SELECT COMPANY PATHWAY</Text>

              {/* Pathway 1: Create */}
              <TouchableOpacity
                style={[
                  styles.pathwayRow,
                  selectedPathway === 'create' && styles.pathwayRowSelected,
                ]}
                onPress={() => setSelectedPathway('create')}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.pathwayIconBox,
                    selectedPathway === 'create' && styles.pathwayIconBoxSelected,
                  ]}
                >
                  <MaterialIcons
                    name="add-business"
                    size={16}
                    color={selectedPathway === 'create' ? '#FFFFFF' : '#1A1C1C'}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.pathwayTitle}>Create a Company</Text>
                  <Text style={styles.pathwayDesc}>
                    Register business &amp; onboard team
                  </Text>
                </View>
                <MaterialIcons
                  name={
                    selectedPathway === 'create'
                      ? 'radio-button-checked'
                      : 'radio-button-unchecked'
                  }
                  size={18}
                  color={selectedPathway === 'create' ? '#000000' : '#5D5F5F'}
                />
              </TouchableOpacity>

              {/* Pathway 2: Join */}
              <TouchableOpacity
                style={[
                  styles.pathwayRow,
                  selectedPathway === 'join' && styles.pathwayRowSelected,
                ]}
                onPress={() => setSelectedPathway('join')}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.pathwayIconBox,
                    selectedPathway === 'join' && styles.pathwayIconBoxSelected,
                  ]}
                >
                  <MaterialIcons
                    name="group-add"
                    size={16}
                    color={selectedPathway === 'join' ? '#FFFFFF' : '#1A1C1C'}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.pathwayTitle}>Join a Company</Text>
                  <Text style={styles.pathwayDesc}>
                    Enter invite code from employer
                  </Text>
                </View>
                <MaterialIcons
                  name={
                    selectedPathway === 'join'
                      ? 'radio-button-checked'
                      : 'radio-button-unchecked'
                  }
                  size={18}
                  color={selectedPathway === 'join' ? '#000000' : '#5D5F5F'}
                />
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Fixed Bottom Bar */}
      <View style={styles.bottomBar}>
        <PrimaryButton
          label={getCtaLabel()}
          onPress={handleContinue}
          size="lg"
          rightIcon={<MaterialIcons name="arrow-forward" size={18} color="#FFFFFF" />}
          style={styles.ctaButton}
        />
        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={styles.loginLinkRow}
        >
          <Text style={styles.loginLinkText}>
            Already have an account?{' '}
            <Text style={styles.loginLinkBold}>Log In</Text>
          </Text>
        </TouchableOpacity>
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
  headerBrand: {
    fontFamily: FontFamily.bold,
    fontSize: 18,
    color: '#1A1C1C',
    letterSpacing: -0.3,
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
    paddingBottom: 110,
    gap: Spacing.md,
  },
  titleSection: {
    marginBottom: 4,
  },
  titleText: {
    fontFamily: FontFamily.bold,
    fontSize: 22,
    color: '#1A1C1C',
    letterSpacing: -0.3,
    lineHeight: 28,
  },
  subtitleText: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: '#5D5F5F',
    marginTop: 4,
  },
  accountCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: '#E2E2E2',
    gap: Spacing.sm,
  },
  accountCardSelected: {
    borderColor: '#000000',
    borderWidth: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  cardTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 18,
    color: '#1A1C1C',
  },
  cardSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: '#5D5F5F',
    marginTop: 2,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    backgroundColor: '#000000',
  },
  imageFrame: {
    height: 110,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#EEEEEE',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  companyPathways: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    gap: 8,
  },
  pathwayHeading: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: '#5D5F5F',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  pathwayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#F4F3F3',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  pathwayRowSelected: {
    backgroundColor: '#EEEEEE',
    borderColor: '#000000',
  },
  pathwayIconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E2E2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pathwayIconBoxSelected: {
    backgroundColor: '#000000',
  },
  pathwayTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: '#1A1C1C',
  },
  pathwayDesc: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#5D5F5F',
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
  loginLinkRow: {
    paddingVertical: 4,
  },
  loginLinkText: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: '#5D5F5F',
  },
  loginLinkBold: {
    fontFamily: FontFamily.bold,
    color: '#1A1C1C',
    textDecorationLine: 'underline',
  },
});
