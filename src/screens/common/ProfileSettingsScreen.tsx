import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors, FontFamily, Spacing, Radius, Typography, Shadows } from '../../theme/tokens';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export const ProfileSettingsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { language, setLanguage } = useLanguage();
  const { user, role, switchRole, logout } = useAuth();

  const [activeRole, setActiveRole] = useState<'shipper' | 'driver' | 'fleet'>(
    role === 'driver' ? 'driver' : (role === 'fleet' || role === 'fleet_ops') ? 'fleet' : 'shipper'
  );
  const [notifEnabled, setNotifEnabled] = useState(true);

  const handleRoleChange = (newRole: 'shipper' | 'driver' | 'fleet') => {
    setActiveRole(newRole);
    const target: UserRole = newRole === 'driver' ? 'driver' : newRole === 'fleet' ? 'fleet' : 'shipper';
    switchRole(target);
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out of CargoSync?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Stitch Fixed Header */}
      <View style={styles.headerBar}>
        <View style={styles.headerLeft}>
          {navigation.canGoBack() && (
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <MaterialIcons name="arrow-back" size={22} color="#000000" />
            </TouchableOpacity>
          )}
          <Text style={styles.headerTitle}>Profile Settings</Text>
        </View>

        <View style={styles.headerRight}>
          <View style={styles.langToggleBox}>
            <TouchableOpacity
              style={[styles.langBtn, language === 'en' && styles.langBtnActive]}
              onPress={() => setLanguage('en')}
            >
              <Text style={[styles.langBtnText, language === 'en' && styles.langBtnTextActive]}>EN</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.langBtn, language === 'hi' && styles.langBtnActive]}
              onPress={() => setLanguage('hi')}
            >
              <Text style={[styles.langBtnText, language === 'hi' && styles.langBtnTextActive]}>हिंदी</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.avatarCircleSmall}>
            <MaterialIcons name="person" size={18} color="#FFFFFF" />
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Floating Language & Quick Region Ribbon */}
        <View style={styles.languageRibbon}>
          <View style={styles.flexRowCenter}>
            <MaterialIcons name="translate" size={18} color="#5D5F5F" />
            <Text style={styles.languageRibbonText}>Current Language</Text>
          </View>
          <View style={styles.langButtonGroup}>
            <TouchableOpacity
              style={[styles.langPillItem, language === 'en' && styles.langPillItemActive]}
              onPress={() => setLanguage('en')}
            >
              <Text style={[styles.langPillText, language === 'en' && styles.langPillTextActive]}>EN</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.langPillItem, language === 'hi' && styles.langPillItemActive]}
              onPress={() => setLanguage('hi')}
            >
              <Text style={[styles.langPillText, language === 'hi' && styles.langPillTextActive]}>हिंदी</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.langPillItem}
              onPress={() => Alert.alert('ਪੰਜਾਬੀ Selected', 'Language switched to Punjabi.')}
            >
              <Text style={styles.langPillText}>ਪੰਜਾਬੀ</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* User Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileTopRow}>
            {/* Avatar with Live Indicator */}
            <View style={styles.avatarContainer}>
              <View style={styles.avatarMain}>
                <MaterialIcons name="person" size={32} color="#FFFFFF" />
              </View>
              <View style={styles.onlineBadge}>
                <View style={styles.onlineDot} />
              </View>
            </View>

            {/* Info Meta */}
            <View style={{ flex: 1, minWidth: 0 }}>
              <View style={styles.nameHeaderRow}>
                <Text style={styles.userName} numberOfLines={1}>
                  {user?.name || 'Vikram Malhotra'}
                </Text>
                <TouchableOpacity onPress={() => Alert.alert('Edit Profile', 'Edit profile details')}>
                  <MaterialIcons name="edit" size={18} color="#5D5F5F" />
                </TouchableOpacity>
              </View>

              <View style={styles.verifiedRow}>
                <MaterialIcons name="verified" size={14} color="#109752" />
                <Text style={styles.verifiedText}>Fleet Operator & Shipper · Verified ID</Text>
              </View>

              <View style={styles.phoneRow}>
                <MaterialIcons name="phone" size={13} color="#5D5F5F" />
                <Text style={styles.phoneText}>{user?.phone || '+91 98765 43210'}</Text>
              </View>
            </View>
          </View>

          {/* Rating & Milestone Strip */}
          <View style={styles.milestoneStrip}>
            <View style={styles.ratingPill}>
              <MaterialIcons name="star" size={14} color="#000000" />
              <Text style={styles.ratingVal}>4.9</Text>
              <Text style={styles.tripsCount}>(1,240 trips)</Text>
            </View>

            <View style={styles.tierBadge}>
              <Text style={styles.tierBadgeText}>Tier 1 Carrier</Text>
            </View>
          </View>
        </View>

        {/* Preferences & Mode */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>PREFERENCES & MODE</Text>
            <View style={styles.flexRowCenter}>
              <View style={styles.syncedDot} />
              <Text style={styles.syncedText}>Synced</Text>
            </View>
          </View>

          <View style={styles.whiteBox}>
            {/* Operational Role Switcher */}
            <View style={{ gap: 6 }}>
              <View style={styles.flexBetween}>
                <Text style={styles.inputLabel}>Operating Mode</Text>
                <Text style={styles.inputSub}>
                  {activeRole === 'shipper'
                    ? 'Shipper Mode Active'
                    : activeRole === 'driver'
                    ? 'Driver trip HUD active'
                    : 'Multi-vehicle telemetry on'}
                </Text>
              </View>

              <View style={styles.roleSegmentGroup}>
                <TouchableOpacity
                  style={[styles.roleSegmentBtn, activeRole === 'shipper' && styles.roleSegmentBtnActive]}
                  onPress={() => handleRoleChange('shipper')}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.roleSegmentText, activeRole === 'shipper' && styles.roleSegmentTextActive]}>
                    Shipper
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.roleSegmentBtn, activeRole === 'driver' && styles.roleSegmentBtnActive]}
                  onPress={() => handleRoleChange('driver')}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.roleSegmentText, activeRole === 'driver' && styles.roleSegmentTextActive]}>
                    Driver
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.roleSegmentBtn, activeRole === 'fleet' && styles.roleSegmentBtnActive]}
                  onPress={() => handleRoleChange('fleet')}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.roleSegmentText, activeRole === 'fleet' && styles.roleSegmentTextActive]}>
                    Fleet Mgr
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Language & Region Dialects */}
            <View style={{ gap: 6 }}>
              <Text style={styles.inputLabel}>Language & Region</Text>
              <View style={styles.dialectsWrap}>
                <TouchableOpacity
                  style={[styles.dialectPill, language === 'en' && styles.dialectPillActive]}
                  onPress={() => setLanguage('en')}
                >
                  {language === 'en' && <MaterialIcons name="check" size={13} color="#FFFFFF" />}
                  <Text style={[styles.dialectPillText, language === 'en' && styles.dialectPillTextActive]}>
                    English (India)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.dialectPill, language === 'hi' && styles.dialectPillActive]}
                  onPress={() => setLanguage('hi')}
                >
                  {language === 'hi' && <MaterialIcons name="check" size={13} color="#FFFFFF" />}
                  <Text style={[styles.dialectPillText, language === 'hi' && styles.dialectPillTextActive]}>
                    हिंदी (National)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.dialectPill}
                  onPress={() => Alert.alert('ਪੰਜਾਬੀ Selected', 'Language switched to Punjabi.')}
                >
                  <Text style={styles.dialectPillText}>ਪੰਜਾਬੀ (North Transit)</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Real-time Alerts Toggle */}
            <View style={styles.flexBetween}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <View style={styles.flexRowCenter}>
                  <MaterialIcons name="notifications-active" size={16} color="#000000" />
                  <Text style={styles.inputLabel}>Notifications</Text>
                </View>
                <Text style={styles.notifSubText}>
                  Instant dispatch updates via SMS, WhatsApp & push
                </Text>
              </View>

              <Switch
                value={notifEnabled}
                onValueChange={setNotifEnabled}
                trackColor={{ false: '#EEEEEE', true: '#000000' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        {/* Business & Verification */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>BUSINESS & VERIFICATION</Text>
          </View>

          <View style={styles.whiteBoxList}>
            {/* GST & Profile */}
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => Alert.alert('GST Verified', 'Apex Logistics Pvt Ltd · 27AACCA1209Q1ZM')}
              activeOpacity={0.7}
            >
              <View style={styles.flexRowCenter}>
                <View style={styles.listIconBox}>
                  <MaterialIcons name="domain" size={18} color="#000000" />
                </View>
                <View>
                  <Text style={styles.listTitle}>GST & Company Profile</Text>
                  <Text style={styles.listSub}>Apex Logistics Pvt Ltd · 27AACCA1209Q1ZM</Text>
                </View>
              </View>
              <View style={styles.flexRowCenter}>
                <View style={styles.verifiedPill}>
                  <MaterialIcons name="verified" size={12} color="#109752" />
                  <Text style={styles.verifiedPillText}>Verified</Text>
                </View>
                <MaterialIcons name="chevron-right" size={18} color="#5D5F5F" />
              </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Bank & Payouts */}
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => Alert.alert('Bank Account', 'HDFC Bank ending in •••• 4102')}
              activeOpacity={0.7}
            >
              <View style={styles.flexRowCenter}>
                <View style={styles.listIconBox}>
                  <MaterialIcons name="account-balance" size={18} color="#000000" />
                </View>
                <View>
                  <Text style={styles.listTitle}>Bank & Payments</Text>
                  <Text style={styles.listSub}>HDFC Bank ending in •••• 4102</Text>
                </View>
              </View>
              <View style={styles.flexRowCenter}>
                <View style={styles.instantPayoutPill}>
                  <Text style={styles.instantPayoutText}>Instant Payout</Text>
                </View>
                <MaterialIcons name="chevron-right" size={18} color="#5D5F5F" />
              </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* FASTag & Fleet Tolls */}
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => Alert.alert('FASTag Fleet', '28 Commercial Vehicles Linked · Balance ₹14,200')}
              activeOpacity={0.7}
            >
              <View style={styles.flexRowCenter}>
                <View style={styles.listIconBox}>
                  <MaterialIcons name="toll" size={18} color="#000000" />
                </View>
                <View>
                  <View style={styles.flexRowCenter}>
                    <Text style={styles.listTitle}>FASTag & Toll Accounts</Text>
                    <View style={styles.smallGreenDot} />
                  </View>
                  <Text style={styles.listSub}>28 Commercial Vehicles Linked</Text>
                </View>
              </View>
              <View style={styles.flexRowCenter}>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.balanceVal}>₹14,200</Text>
                  <Text style={styles.balanceLabel}>Balance</Text>
                </View>
                <MaterialIcons name="chevron-right" size={18} color="#5D5F5F" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Support, Safety & Legal */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>HELP & SUPPORT</Text>
          </View>

          <View style={styles.whiteBoxList}>
            {/* 24/7 Priority Freight Support */}
            <View style={styles.listItem}>
              <View style={styles.flexRowCenter}>
                <View style={styles.listIconBox}>
                  <MaterialIcons name="support-agent" size={18} color="#000000" />
                </View>
                <View>
                  <Text style={styles.listTitle}>24/7 Priority Freight Support</Text>
                  <Text style={styles.listSub}>Dedicated Fleet Desk Hotline</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.callSupportBtn}
                onPress={() => Linking.openURL('tel:+9118002004400')}
              >
                <MaterialIcons name="call" size={16} color="#000000" />
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            {/* Cargo Transit Insurance */}
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => Alert.alert('Transit Policy', 'Comprehensive insurance up to ₹50 Lakh per load with ICICI Lombard.')}
              activeOpacity={0.7}
            >
              <View style={styles.flexRowCenter}>
                <View style={styles.listIconBox}>
                  <MaterialIcons name="shield" size={18} color="#000000" />
                </View>
                <View>
                  <Text style={styles.listTitle}>Transit Policy & Terms</Text>
                  <Text style={styles.listSub}>Up to ₹50 Lakh comprehensive per load</Text>
                </View>
              </View>
              <MaterialIcons name="open-in-new" size={16} color="#5D5F5F" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button (Radius.xs = 4px) */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={handleLogout}
            activeOpacity={0.85}
          >
            <MaterialIcons name="logout" size={17} color="#BA1A1A" />
            <Text style={styles.logoutBtnText}>Log Out of CargoSync</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileSettingsScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  headerBar: {
    backgroundColor: 'rgba(249, 249, 249, 0.95)',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 17,
    color: '#000000',
    letterSpacing: -0.3,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  langToggleBox: {
    flexDirection: 'row',
    backgroundColor: '#EEEEEE',
    borderRadius: Radius.full,
    padding: 2,
  },
  langBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  langBtnActive: {
    backgroundColor: '#000000',
  },
  langBtnText: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: '#5D5F5F',
  },
  langBtnTextActive: {
    color: '#FFFFFF',
  },
  avatarCircleSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: Spacing.base,
    paddingBottom: Spacing.xxl + 20,
    gap: 12,
  },
  languageRibbon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F4F3F3',
    padding: 10,
    borderRadius: Radius.xs,
    ...Shadows.sm,
  },
  languageRibbonText: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: '#000000',
  },
  langButtonGroup: {
    flexDirection: 'row',
    backgroundColor: '#E8E8E8',
    borderRadius: Radius.full,
    padding: 2,
  },
  langPillItem: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  langPillItemActive: {
    backgroundColor: '#000000',
  },
  langPillText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 11,
    color: '#5D5F5F',
  },
  langPillTextActive: {
    color: '#FFFFFF',
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    gap: 12,
    ...Shadows.sm,
  },
  profileTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarMain: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#68DD8F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#005229',
  },
  nameHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userName: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: '#000000',
    fontWeight: '800',
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  verifiedText: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#5D5F5F',
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  phoneText: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: '#5D5F5F',
  },
  milestoneStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F4F3F3',
    padding: 8,
    borderRadius: Radius.xs,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  ratingVal: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
    color: '#000000',
  },
  tripsCount: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#5D5F5F',
  },
  tierBadge: {
    backgroundColor: '#E2E2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  tierBadgeText: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: '#1A1C1C',
  },
  sectionContainer: {
    gap: 6,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: '#7E7576',
    letterSpacing: 0.8,
  },
  syncedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#109752',
  },
  syncedText: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: '#109752',
  },
  whiteBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    gap: 12,
    ...Shadows.sm,
  },
  whiteBoxList: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    overflow: 'hidden',
    ...Shadows.sm,
  },
  inputLabel: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
    color: '#000000',
  },
  inputSub: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#5D5F5F',
  },
  roleSegmentGroup: {
    flexDirection: 'row',
    backgroundColor: '#EEEEEE',
    borderRadius: Radius.full,
    padding: 3,
  },
  roleSegmentBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: Radius.full,
    alignItems: 'center',
  },
  roleSegmentBtnActive: {
    backgroundColor: '#000000',
  },
  roleSegmentText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
    color: '#5D5F5F',
  },
  roleSegmentTextActive: {
    color: '#FFFFFF',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
  },
  dialectsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  dialectPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: '#EEEEEE',
  },
  dialectPillActive: {
    backgroundColor: '#000000',
  },
  dialectPillText: {
    fontFamily: FontFamily.medium,
    fontSize: 11,
    color: '#000000',
  },
  dialectPillTextActive: {
    color: '#FFFFFF',
  },
  notifSubText: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#5D5F5F',
    marginTop: 2,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
  },
  listIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
    color: '#000000',
  },
  listSub: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#5D5F5F',
    marginTop: 1,
  },
  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#E8E8E8',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: Radius.full,
    marginRight: 4,
  },
  verifiedPillText: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: '#005229',
  },
  instantPayoutPill: {
    backgroundColor: '#E8E8E8',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: Radius.full,
    marginRight: 4,
  },
  instantPayoutText: {
    fontFamily: FontFamily.medium,
    fontSize: 10,
    color: '#000000',
  },
  smallGreenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#68DD8F',
    marginLeft: 4,
  },
  balanceVal: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: '#000000',
  },
  balanceLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 9,
    color: '#5D5F5F',
  },
  callSupportBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutContainer: {
    paddingTop: 6,
    paddingBottom: Spacing.md,
  },
  logoutBtn: {
    height: 44,
    backgroundColor: '#F4F3F3',
    borderRadius: Radius.xs, // 4px exact Stitch requirement
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  logoutBtnText: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: '#BA1A1A',
  },
  flexRowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  flexBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
