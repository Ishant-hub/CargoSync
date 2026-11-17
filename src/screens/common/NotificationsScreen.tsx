import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors, FontFamily, Spacing, Radius, Typography, Shadows } from '../../theme/tokens';
import { useLanguage } from '../../context/LanguageContext';

interface NotifCardData {
  id: string;
  category: 'alerts' | 'trips' | 'payouts';
  title: string;
  badge: string;
  badgeBg: string;
  badgeColor: string;
  body: string;
  time: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  iconBg: string;
  iconColor: string;
  footerLeftIcon: keyof typeof MaterialIcons.glyphMap;
  footerLeftText: string;
  actionText?: string;
  actionIcon?: keyof typeof MaterialIcons.glyphMap;
  actionDest?: string;
  statusTag?: string;
  borderColor?: string;
}

const NOTIFICATIONS: NotifCardData[] = [
  {
    id: 'notif-1',
    category: 'alerts',
    title: 'Delivery Delay Risk: TRK-14',
    badge: 'High Priority',
    badgeBg: '#BA1A1A',
    badgeColor: '#FFFFFF',
    body: 'Refrigerated shipment on NH-44 delayed. Cross-dock option ready.',
    time: '5m ago',
    icon: 'warning',
    iconBg: '#FFDAD6',
    iconColor: '#93000A',
    footerLeftIcon: 'thermostat',
    footerLeftText: '-18°C Stable',
    actionText: 'View Solution',
    actionIcon: 'arrow-forward',
    actionDest: 'DisruptionRecovery',
    borderColor: '#FECACA',
  },
  {
    id: 'notif-2',
    category: 'payouts',
    title: '₹19,300 Deposited',
    badge: 'Settled',
    badgeBg: '#EEEEEE',
    badgeColor: '#000000',
    body: 'Trip #CS-7720 completed and signed off. Transferred to linked HDFC Bank account.',
    time: '32m ago',
    icon: 'payments',
    iconBg: '#85FAA9',
    iconColor: '#00210D',
    footerLeftIcon: 'account-balance',
    footerLeftText: 'A/C **4012',
    actionText: 'View Receipt',
    actionIcon: 'receipt-long',
  },
  {
    id: 'notif-3',
    category: 'trips',
    title: 'More Loads Available',
    badge: '+₹8,400',
    badgeBg: '#85FAA9',
    badgeColor: '#00210D',
    body: 'Jaipur to Delhi corridor has 2 compatible dry cargo consignments.',
    time: '1h ago',
    icon: 'merge-type',
    iconBg: '#000000',
    iconColor: '#FFFFFF',
    footerLeftIcon: 'local-shipping',
    footerLeftText: '32 ft Multi-Axle',
    actionText: 'Review Opportunity',
    actionIcon: 'open-in-new',
    actionDest: 'CombineShipments',
  },
  {
    id: 'notif-4',
    category: 'trips',
    title: 'Pickup Complete',
    badge: 'Gate 4',
    badgeBg: '#EEEEEE',
    badgeColor: '#000000',
    body: 'Driver Rajesh Kumar confirmed loading at Delhi Logistics Hub.',
    time: '2h ago',
    icon: 'warehouse',
    iconBg: '#E2E2E2',
    iconColor: '#1A1C1C',
    footerLeftIcon: 'verified',
    footerLeftText: 'Seal: #IN-88319',
    actionText: 'Track Truck',
    actionIcon: 'near-me',
    actionDest: 'TruckDetails',
  },
  {
    id: 'notif-5',
    category: 'trips',
    title: 'GST Verified',
    badge: 'E-Way Bill',
    badgeBg: '#EEEEEE',
    badgeColor: '#000000',
    body: 'Consignment note CS-8942 passed automatic verification at Kundli Toll Plaza.',
    time: '3h ago',
    icon: 'task-alt',
    iconBg: '#EEEEEE',
    iconColor: '#000000',
    footerLeftIcon: 'pin-drop',
    footerLeftText: 'Kundli Toll (Delhi Border)',
    statusTag: 'Auto-cleared',
  },
];

export const NotificationsScreen: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const navigation = useNavigation<any>();

  const [filter, setFilter] = useState<'all' | 'alerts' | 'trips' | 'payouts'>('all');
  const [allRead, setAllRead] = useState(false);

  const filtered = NOTIFICATIONS.filter((item) => {
    if (filter === 'all') return true;
    return item.category === filter;
  });

  const handleAction = (item: NotifCardData) => {
    if (item.actionDest === 'DisruptionRecovery') {
      navigation.navigate('DisruptionRecovery', { incidentId: 'INC-8942' });
    } else if (item.actionDest === 'CombineShipments') {
      navigation.navigate('CombineShipments');
    } else if (item.actionDest === 'TruckDetails') {
      navigation.navigate('TruckDetails', { truckId: 'trk-27' });
    } else {
      Alert.alert(item.title, item.body);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Stitch Fixed Header */}
      <View style={styles.headerBar}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <MaterialIcons name="arrow-back" size={22} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
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

          <TouchableOpacity
            style={styles.avatarCircle}
            onPress={() => navigation.navigate('FleetProfile')}
            activeOpacity={0.8}
          >
            <MaterialIcons name="person" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Interactive Sticky Rail */}
        <View style={styles.stickyRail}>
          <View style={styles.inboxStatusRow}>
            <View style={styles.flexRowCenter}>
              <Text style={styles.inboxLabel}>Inbox</Text>
              {!allRead && <View style={styles.criticalRedDot} />}
              <Text style={styles.criticalCountText}>
                {allRead ? 'All caught up' : '3 critical'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setAllRead(true)}
              activeOpacity={0.7}
            >
              <Text style={[styles.markAllReadText, allRead && { color: '#109752' }]}>
                {allRead ? 'All cleared ✓' : 'Mark all read'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Filter Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterPillsTrack}
          >
            {[
              { id: 'all', label: 'All (12)' },
              { id: 'alerts', label: 'Alerts (3)' },
              { id: 'trips', label: 'Trips (6)' },
              { id: 'payouts', label: 'Payouts (3)' },
            ].map((f) => {
              const active = filter === f.id;
              return (
                <TouchableOpacity
                  key={f.id}
                  style={[styles.filterChip, active ? styles.filterChipActive : styles.filterChipInactive]}
                  onPress={() => setFilter(f.id as any)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.filterChipText, active ? styles.filterChipTextActive : styles.filterChipTextInactive]}>
                    {f.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Feed List */}
        <View style={styles.feedList}>
          {filtered.length === 0 ? (
            <View style={styles.emptyCard}>
              <View style={styles.emptyIconCircle}>
                <MaterialIcons name="mark-email-read" size={26} color="#5D5F5F" />
              </View>
              <Text style={styles.emptyTitle}>You're all caught up</Text>
              <Text style={styles.emptySub}>
                No new alerts matching this category. All cargo operations running smoothly.
              </Text>
            </View>
          ) : (
            filtered.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.notifCard,
                  item.borderColor ? { borderColor: item.borderColor } : null,
                  allRead && { opacity: 0.85 },
                ]}
              >
                <View style={styles.cardMain}>
                  <View style={styles.cardHeader}>
                    <View style={styles.flexRowTop}>
                      <View style={[styles.iconBox, { backgroundColor: item.iconBg }]}>
                        <MaterialIcons name={item.icon} size={20} color={item.iconColor} />
                      </View>
                      <View style={{ flex: 1, minWidth: 0 }}>
                        <View style={styles.cardTitleRow}>
                          <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                          <View style={[styles.priorityBadge, { backgroundColor: item.badgeBg }]}>
                            <Text style={[styles.priorityBadgeText, { color: item.badgeColor }]}>
                              {item.badge}
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.cardBody}>{item.body}</Text>
                      </View>
                    </View>
                    <Text style={styles.timeText}>{item.time}</Text>
                  </View>
                </View>

                {/* Card Footer Bar */}
                <View style={styles.cardFooter}>
                  <View style={styles.flexRowCenter}>
                    <MaterialIcons name={item.footerLeftIcon} size={15} color="#5D5F5F" />
                    <Text style={styles.footerLeftText}>{item.footerLeftText}</Text>
                  </View>

                  {item.actionText && (
                    <TouchableOpacity
                      style={[
                        styles.actionBtn,
                        item.actionDest === 'DisruptionRecovery' || item.actionDest === 'CombineShipments'
                          ? styles.actionBtnBlack
                          : styles.actionBtnGrey,
                      ]}
                      onPress={() => handleAction(item)}
                      activeOpacity={0.85}
                    >
                      <Text
                        style={[
                          styles.actionBtnText,
                          item.actionDest === 'DisruptionRecovery' || item.actionDest === 'CombineShipments'
                            ? styles.actionBtnTextWhite
                            : styles.actionBtnTextBlack,
                        ]}
                      >
                        {item.actionText}
                      </Text>
                      {item.actionIcon && (
                        <MaterialIcons
                          name={item.actionIcon}
                          size={15}
                          color={
                            item.actionDest === 'DisruptionRecovery' || item.actionDest === 'CombineShipments'
                              ? '#FFFFFF'
                              : '#000000'
                          }
                        />
                      )}
                    </TouchableOpacity>
                  )}

                  {item.statusTag && (
                    <View style={styles.flexRowCenter}>
                      <MaterialIcons name="check-circle" size={14} color="#109752" />
                      <Text style={styles.statusTagText}>{item.statusTag}</Text>
                    </View>
                  )}
                </View>
              </View>
            ))
          )}
        </View>

        {/* Visual Fleet Snapshot Bento Section */}
        <View style={styles.bentoCard}>
          <View style={styles.bentoHeader}>
            <Text style={styles.bentoTitle}>Route Activity</Text>
            <Text style={styles.bentoSub}>Live Telematics</Text>
          </View>
          <View style={styles.bentoGrid}>
            <View style={styles.bentoTile}>
              <Text style={styles.bentoTileLabel}>Delhi ➔ Jaipur</Text>
              <View style={styles.bentoValRow}>
                <Text style={styles.bentoVal}>98.2%</Text>
                <Text style={styles.bentoValGreen}>On-Time</Text>
              </View>
            </View>
            <View style={styles.bentoTile}>
              <Text style={styles.bentoTileLabel}>Fastag Auto-Debits</Text>
              <View style={styles.bentoValRow}>
                <Text style={styles.bentoVal}>₹4,220</Text>
                <Text style={styles.bentoValMuted}>Today</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationsScreen;

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
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: Spacing.xxl + 20,
  },
  stickyRail: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
    paddingBottom: 4,
    backgroundColor: '#F9F9F9',
  },
  inboxStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 6,
  },
  flexRowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  flexRowTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    flex: 1,
  },
  inboxLabel: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: '#1A1C1C',
  },
  criticalRedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#BA1A1A',
  },
  criticalCountText: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: '#5D5F5F',
  },
  markAllReadText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
    color: '#5D5F5F',
  },
  filterPillsTrack: {
    paddingVertical: 6,
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
  feedList: {
    paddingHorizontal: Spacing.base,
    marginTop: 8,
    gap: 10,
  },
  notifCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    overflow: 'hidden',
    ...Shadows.sm,
  },
  cardMain: {
    padding: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  cardTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: '#000000',
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  priorityBadgeText: {
    fontFamily: FontFamily.bold,
    fontSize: 9,
    letterSpacing: 0.4,
  },
  cardBody: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: '#5D5F5F',
    marginTop: 3,
    lineHeight: 16,
  },
  timeText: {
    fontFamily: FontFamily.regular,
    fontSize: 10,
    color: '#7E7576',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F4F3F3',
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  footerLeftText: {
    fontFamily: FontFamily.medium,
    fontSize: 11,
    color: '#5D5F5F',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    height: 32,
    borderRadius: Radius.xs, // 4px exact Stitch requirement
  },
  actionBtnBlack: {
    backgroundColor: '#000000',
  },
  actionBtnGrey: {
    backgroundColor: '#EEEEEE',
  },
  actionBtnText: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
  },
  actionBtnTextWhite: {
    color: '#FFFFFF',
  },
  actionBtnTextBlack: {
    color: '#000000',
  },
  statusTagText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 11,
    color: '#109752',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  emptyIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emptyTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: '#000000',
  },
  emptySub: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: '#5D5F5F',
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 240,
  },
  bentoCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: Spacing.base,
    marginTop: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    padding: Spacing.md,
    gap: 10,
    ...Shadows.sm,
  },
  bentoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bentoTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: '#000000',
  },
  bentoSub: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#5D5F5F',
  },
  bentoGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  bentoTile: {
    flex: 1,
    backgroundColor: '#F4F3F3',
    padding: 10,
    borderRadius: Radius.xs,
  },
  bentoTileLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#5D5F5F',
  },
  bentoValRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginTop: 4,
  },
  bentoVal: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: '#000000',
    fontWeight: '800',
  },
  bentoValGreen: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: '#109752',
  },
  bentoValMuted: {
    fontFamily: FontFamily.regular,
    fontSize: 10,
    color: '#5D5F5F',
  },
});
