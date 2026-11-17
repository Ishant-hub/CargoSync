import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, FontFamily, Spacing, Radius, Typography, Shadows } from '../../theme/tokens';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

interface MemberItem {
  id: string;
  name: string;
  role: string;
  roleType: 'driver' | 'fleet' | 'admin';
  meta: string;
  statusText: string;
  statusSub?: string;
  isSuspended?: boolean;
  avatarIcon: keyof typeof MaterialIcons.glyphMap;
}

const INITIAL_MEMBERS: MemberItem[] = [
  {
    id: 'm-1',
    name: 'Rajesh Kumar',
    role: 'Driver',
    roleType: 'driver',
    meta: 'HR-55-AJ-9082',
    statusText: 'En route to Chandigarh',
    statusSub: 'Speed: 62 km/h',
    avatarIcon: 'person',
  },
  {
    id: 'm-2',
    name: 'Harpreet Singh',
    role: 'Fleet Manager',
    roleType: 'fleet',
    meta: 'North Zone',
    statusText: 'Active Dispatch',
    statusSub: 'Managing 6 Trucks',
    avatarIcon: 'supervisor-account',
  },
  {
    id: 'm-3',
    name: 'Amit Verma',
    role: 'Driver',
    roleType: 'driver',
    meta: 'DL-01-EA-3120',
    statusText: 'Off-duty Rest Cycle',
    statusSub: 'Next trip tomorrow',
    avatarIcon: 'person',
  },
  {
    id: 'm-4',
    name: 'Suresh Patil',
    role: 'Driver',
    roleType: 'driver',
    meta: 'Unassigned Truck',
    statusText: 'Access Suspended',
    isSuspended: true,
    avatarIcon: 'no-accounts',
  },
];

export const TeamManagementScreen: React.FC<{ navigation?: any; onBack?: () => void }> = ({
  navigation,
  onBack,
}) => {
  const { language, setLanguage } = useLanguage();
  const { company, inviteEmployee } = useAuth();

  const [members, setMembers] = useState<MemberItem[]>(INITIAL_MEMBERS);
  const [filter, setFilter] = useState<'all' | 'driver' | 'fleet' | 'admin'>('all');
  const [search, setSearch] = useState('');
  const [activeSheetId, setActiveSheetId] = useState<string | null>(null);

  // Invite modal
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteMobile, setInviteMobile] = useState('');
  const [inviteRole, setInviteRole] = useState<'driver' | 'fleet' | 'admin'>('driver');
  const [codeCopied, setCodeCopied] = useState(false);

  const filtered = members
    .filter((m) => {
      if (filter === 'all') return true;
      return m.roleType === filter;
    })
    .filter((m) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return m.name.toLowerCase().includes(q) || m.meta.toLowerCase().includes(q);
    });

  const handleCopyCode = () => {
    setCodeCopied(true);
    Alert.alert('Code Copied', 'Invite code APX-742 copied to clipboard!');
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const handleShareLink = () => {
    Alert.alert('Share Link', 'Unique single-use invite link created for dispatch distribution.');
  };

  const handleReactivate = (id: string) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, isSuspended: false, statusText: 'Reactivated · Ready for dispatch' }
          : m
      )
    );
  };

  const handleSendInvite = () => {
    if (!inviteMobile.trim()) {
      Alert.alert('Required', 'Please enter a valid mobile number.');
      return;
    }
    Alert.alert('Invite Dispatched', `Secure credentials sent to ${inviteMobile} via SMS.`);
    setShowInviteModal(false);
    setInviteMobile('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Stitch Fixed Header */}
      <View style={styles.headerBar}>
        <View style={styles.headerLeft}>
          <View style={styles.logoCircle}>
            <MaterialIcons name="local-shipping" size={18} color="#FFFFFF" />
          </View>
          <View style={styles.headerTitleCol}>
            <Text style={styles.headerSub}>CargoSync Admin</Text>
            <Text style={styles.headerTitle}>Team</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.notifBtn}
            onPress={() => navigation?.navigate?.('Notifications')}
            activeOpacity={0.7}
          >
            <MaterialIcons name="notifications" size={22} color="#000000" />
          </TouchableOpacity>

          <View style={styles.avatarCircleSmall}>
            <MaterialIcons name="person" size={18} color="#FFFFFF" />
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Action Header & Primary Add Button */}
        <View style={styles.actionHeaderRow}>
          <View>
            <Text style={styles.directoryLabel}>PERSONNEL DIRECTORY</Text>
            <Text style={styles.teamCountTitle}>Team Members (14)</Text>
          </View>
          <TouchableOpacity
            style={styles.inviteBtn}
            onPress={() => setShowInviteModal(true)}
            activeOpacity={0.85}
          >
            <MaterialIcons name="person-add" size={17} color="#FFFFFF" />
            <Text style={styles.inviteBtnText}>+ Invite Employee</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBarContainer}>
          <MaterialIcons name="search" size={20} color="#5D5F5F" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, phone, or role..."
            placeholderTextColor="#7E7576"
            value={search}
            onChangeText={setSearch}
          />
          <TouchableOpacity
            style={styles.tuneBtn}
            onPress={() => Alert.alert('Filter Options', 'Filter by Active status, Verification or Zone')}
          >
            <MaterialIcons name="tune" size={16} color="#5D5F5F" />
          </TouchableOpacity>
        </View>

        {/* Filter Chips Ribbon */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterTrack}
        >
          {[
            { id: 'all', label: 'All (14)' },
            { id: 'driver', label: 'Drivers (11)' },
            { id: 'fleet', label: 'Fleet Managers (2)' },
            { id: 'admin', label: 'Admins (1)' },
          ].map((item) => {
            const active = filter === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.filterChip, active ? styles.filterChipActive : styles.filterChipInactive]}
                onPress={() => setFilter(item.id as any)}
                activeOpacity={0.8}
              >
                <Text style={[styles.filterChipText, active ? styles.filterChipTextActive : styles.filterChipTextInactive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Active Invitation Banner (Tactile Card) */}
        <View style={styles.invitePassCard}>
          <View style={styles.invitePassTop}>
            <View style={styles.flexRowCenter}>
              <View style={styles.keyCircle}>
                <MaterialIcons name="key" size={18} color="#FFFFFF" />
              </View>
              <View>
                <View style={styles.flexRowCenter}>
                  <Text style={styles.passSub}>FAST-ONBOARDING PASS</Text>
                  <View style={styles.roleTag}>
                    <Text style={styles.roleTagText}>Driver</Text>
                  </View>
                </View>
                <Text style={styles.codeText}>Code: APX-742</Text>
              </View>
            </View>
            <View style={styles.expiryBadge}>
              <MaterialIcons name="schedule" size={13} color="#5D5F5F" />
              <Text style={styles.expiryBadgeText}>48h left</Text>
            </View>
          </View>

          <View style={styles.invitePassActions}>
            <TouchableOpacity
              style={styles.passCopyBtn}
              onPress={handleCopyCode}
              activeOpacity={0.8}
            >
              <MaterialIcons name="content-copy" size={16} color="#000000" />
              <Text style={styles.passCopyBtnText}>
                {codeCopied ? 'Copied ✓' : 'Copy Code'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.passShareBtn}
              onPress={handleShareLink}
              activeOpacity={0.8}
            >
              <MaterialIcons name="share" size={16} color="#FFFFFF" />
              <Text style={styles.passShareBtnText}>Share Link</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Team Member List Cards */}
        <View style={styles.memberList}>
          {filtered.map((item) => {
            const isSheetOpen = activeSheetId === item.id;
            return (
              <View key={item.id} style={styles.memberCard}>
                <View style={styles.memberCardTop}>
                  <View style={styles.flexRowCenter}>
                    <View style={styles.memberAvatarWrapper}>
                      <View
                        style={[
                          styles.memberAvatar,
                          item.isSuspended && { backgroundColor: '#FFDAD6' },
                        ]}
                      >
                        <MaterialIcons
                          name={item.avatarIcon}
                          size={24}
                          color={item.isSuspended ? '#93000A' : '#5D5F5F'}
                        />
                      </View>
                      {!item.isSuspended && <View style={styles.activeDot} />}
                    </View>
                    <View>
                      <Text style={styles.memberName}>{item.name}</Text>
                      <Text style={styles.memberRoleLine}>
                        {item.role} · <Text style={{ fontWeight: 'bold' }}>{item.meta}</Text>
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.dotsBtn}
                    onPress={() => setActiveSheetId(isSheetOpen ? null : item.id)}
                  >
                    <MaterialIcons name="more-vert" size={20} color="#5D5F5F" />
                  </TouchableOpacity>
                </View>

                {/* Status Bar */}
                {item.isSuspended ? (
                  <View style={styles.suspendedRow}>
                    <View style={styles.suspendedBadge}>
                      <MaterialIcons name="lock" size={13} color="#93000A" />
                      <Text style={styles.suspendedBadgeText}>Access Suspended</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.reactivateBtn}
                      onPress={() => handleReactivate(item.id)}
                    >
                      <Text style={styles.reactivateBtnText}>Reactivate</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.statusBar}>
                    <View style={styles.flexRowCenter}>
                      <View style={styles.greenLiveDot} />
                      <Text style={styles.statusText}>{item.statusText}</Text>
                    </View>
                    {item.statusSub && <Text style={styles.statusSubText}>{item.statusSub}</Text>}
                  </View>
                )}

                {/* Micro Action Dropdown */}
                {isSheetOpen && (
                  <View style={styles.actionSheetBox}>
                    <TouchableOpacity
                      style={styles.sheetActionRow}
                      onPress={() => {
                        setActiveSheetId(null);
                        Alert.alert(item.name, 'Manage system access & credentials');
                      }}
                    >
                      <MaterialIcons name="verified-user" size={16} color="#000000" />
                      <Text style={styles.sheetActionText}>Manage Access</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.sheetActionRow}
                      onPress={() => {
                        setActiveSheetId(null);
                        Alert.alert(item.name, 'Assign alternate corridor or vehicle');
                      }}
                    >
                      <MaterialIcons name="rv-hookup" size={16} color="#000000" />
                      <Text style={styles.sheetActionText}>Reassign Vehicle</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.sheetActionRow}
                      onPress={() => {
                        setActiveSheetId(null);
                        setMembers((prev) =>
                          prev.map((m) =>
                            m.id === item.id ? { ...m, isSuspended: true } : m
                          )
                        );
                      }}
                    >
                      <MaterialIcons name="block" size={16} color="#BA1A1A" />
                      <Text style={[styles.sheetActionText, { color: '#BA1A1A' }]}>
                        Suspend Driver
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Bottom Operational Quick Stats Banner */}
        <View style={styles.quickStatsBanner}>
          <View style={styles.flexRowCenter}>
            <MaterialIcons name="verified" size={17} color="#109752" />
            <Text style={styles.quickStatsText}>11/11 Drivers Verified</Text>
          </View>
          <View style={styles.greyDot} />
          <View style={styles.flexRowCenter}>
            <MaterialIcons name="security" size={17} color="#5D5F5F" />
            <Text style={styles.quickStatsText}>2 Managers Active</Text>
          </View>
        </View>
      </ScrollView>

      {/* Invite Modal */}
      <Modal
        visible={showInviteModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowInviteModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalTop}>
              <Text style={styles.modalTitle}>+ Invite Employee</Text>
              <TouchableOpacity onPress={() => setShowInviteModal(false)}>
                <MaterialIcons name="close" size={20} color="#000000" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSub}>
              Send an instant single-use onboarding pass via SMS.
            </Text>

            <Text style={styles.inputModalLabel}>Mobile Number</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="+91 98765 43210"
              placeholderTextColor="#7E7576"
              keyboardType="phone-pad"
              value={inviteMobile}
              onChangeText={setInviteMobile}
            />

            <Text style={styles.inputModalLabel}>Role Assignment</Text>
            <View style={styles.modalRoleGroup}>
              {[
                { id: 'driver', label: 'Driver' },
                { id: 'fleet', label: 'Fleet Mgr' },
                { id: 'admin', label: 'Admin' },
              ].map((r) => (
                <TouchableOpacity
                  key={r.id}
                  style={[
                    styles.modalRoleBtn,
                    inviteRole === r.id && styles.modalRoleBtnActive,
                  ]}
                  onPress={() => setInviteRole(r.id as any)}
                >
                  <Text
                    style={[
                      styles.modalRoleBtnText,
                      inviteRole === r.id && styles.modalRoleBtnTextActive,
                    ]}
                  >
                    {r.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.sendInviteBtn}
              onPress={handleSendInvite}
              activeOpacity={0.85}
            >
              <Text style={styles.sendInviteBtnText}>Send Instant Invite Pass</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default TeamManagementScreen;

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
  logoCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleCol: {
    justifyContent: 'center',
  },
  headerSub: {
    fontFamily: FontFamily.bold,
    fontSize: 9,
    color: '#7E7576',
    letterSpacing: 0.6,
  },
  headerTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: '#000000',
    fontWeight: '800',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notifBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
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
  actionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  directoryLabel: {
    fontFamily: FontFamily.bold,
    fontSize: 9,
    color: '#7E7576',
    letterSpacing: 0.6,
  },
  teamCountTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: '#000000',
    fontWeight: '800',
    marginTop: 1,
  },
  inviteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#000000',
    paddingHorizontal: 14,
    height: 38,
    borderRadius: Radius.full,
    ...Shadows.sm,
  },
  inviteBtnText: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
    color: '#FFFFFF',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.full,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    ...Shadows.sm,
  },
  searchInput: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: '#000000',
    marginLeft: 6,
  },
  tuneBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterTrack: {
    paddingVertical: 2,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    height: 34,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterChipActive: {
    backgroundColor: '#000000',
  },
  filterChipInactive: {
    backgroundColor: '#EEEEEE',
  },
  filterChipText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  filterChipTextInactive: {
    color: '#1A1C1C',
  },
  invitePassCard: {
    backgroundColor: '#E8E8E8',
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: 10,
    ...Shadows.sm,
  },
  invitePassTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  keyCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  passSub: {
    fontFamily: FontFamily.bold,
    fontSize: 9,
    color: '#5D5F5F',
    letterSpacing: 0.6,
  },
  roleTag: {
    backgroundColor: '#E2E2E2',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: Radius.full,
  },
  roleTagText: {
    fontFamily: FontFamily.bold,
    fontSize: 9,
    color: '#000000',
  },
  codeText: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: '#000000',
    fontWeight: '800',
    marginTop: 1,
  },
  expiryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#EEEEEE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  expiryBadgeText: {
    fontFamily: FontFamily.medium,
    fontSize: 10,
    color: '#5D5F5F',
  },
  invitePassActions: {
    flexDirection: 'row',
    gap: 8,
  },
  passCopyBtn: {
    flex: 1,
    height: 38,
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    ...Shadows.sm,
  },
  passCopyBtnText: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
    color: '#000000',
  },
  passShareBtn: {
    flex: 1,
    height: 38,
    backgroundColor: '#000000',
    borderRadius: Radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    ...Shadows.sm,
  },
  passShareBtnText: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
    color: '#FFFFFF',
  },
  memberList: {
    gap: 10,
  },
  memberCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    gap: 8,
    ...Shadows.sm,
  },
  memberCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  memberAvatarWrapper: {
    position: 'relative',
  },
  memberAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#109752',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  memberName: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: '#000000',
  },
  memberRoleLine: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#5D5F5F',
    marginTop: 1,
  },
  dotsBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F4F3F3',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  greenLiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#109752',
  },
  statusText: {
    fontFamily: FontFamily.medium,
    fontSize: 11,
    color: '#005229',
  },
  statusSubText: {
    fontFamily: FontFamily.regular,
    fontSize: 10,
    color: '#5D5F5F',
  },
  suspendedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 2,
  },
  suspendedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFDAD6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  suspendedBadgeText: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: '#93000A',
  },
  reactivateBtn: {
    backgroundColor: '#000000',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Radius.xs, // 4px exact Stitch requirement
  },
  reactivateBtnText: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: '#FFFFFF',
  },
  actionSheetBox: {
    backgroundColor: '#EEEEEE',
    borderRadius: Radius.xs,
    padding: 6,
    gap: 4,
    marginTop: 4,
  },
  sheetActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: Radius.xs,
  },
  sheetActionText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
    color: '#000000',
  },
  quickStatsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#E8E8E8',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: Radius.full,
    marginTop: 6,
  },
  quickStatsText: {
    fontFamily: FontFamily.medium,
    fontSize: 11,
    color: '#000000',
  },
  greyDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#7E7576',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    padding: Spacing.base,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    padding: Spacing.lg,
    gap: 10,
    ...Shadows.lg,
  },
  modalTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: '#000000',
    fontWeight: '800',
  },
  modalSub: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: '#5D5F5F',
  },
  inputModalLabel: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: '#000000',
    marginTop: 4,
  },
  modalInput: {
    backgroundColor: '#F4F3F3',
    borderRadius: Radius.xs,
    paddingHorizontal: 10,
    height: 42,
    fontFamily: FontFamily.medium,
    fontSize: 13,
    color: '#000000',
  },
  modalRoleGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  modalRoleBtn: {
    flex: 1,
    height: 38,
    borderRadius: Radius.xs,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalRoleBtnActive: {
    backgroundColor: '#000000',
  },
  modalRoleBtnText: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: '#5D5F5F',
  },
  modalRoleBtnTextActive: {
    color: '#FFFFFF',
  },
  sendInviteBtn: {
    height: 44,
    backgroundColor: '#000000',
    borderRadius: Radius.xs, // 4px exact Stitch requirement
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  sendInviteBtnText: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: '#FFFFFF',
  },
  flexRowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});
