import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors, FontFamily, Spacing, Radius, Typography, Shadows } from '../../theme/tokens';
import { AppHeader } from '../../components/common/Headers';
import { PrimaryButton } from '../../components/common/AppButton';

export const ShipmentDetailsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { shipmentId = 'CS-8942' } = route.params || {};

  const [selectedPlan, setSelectedPlan] = useState<'direct' | 'consolidated'>('consolidated');

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        title="Shipment Details"
        subtitle={`CARGOSYNC FREIGHT · ${shipmentId}`}
        onBack={() => navigation.goBack()}
        rightElement={
          <TouchableOpacity
            style={styles.langSwitchPill}
            onPress={() => Alert.alert('Language', 'Switched language.')}
          >
            <MaterialIcons name="language" size={14} color={Colors.textDark} />
            <Text style={styles.langSwitchText}>EN | हिंदी</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Shipment Status & Route Hero Card */}
        <View style={styles.card}>
          <View style={styles.heroTopRow}>
            <View style={styles.heroLeft}>
              <View style={styles.statusBadgeBlack}>
                <Text style={styles.statusBadgeText}>IN TRANSIT</Text>
              </View>
              <Text style={styles.heroId}>{shipmentId}</Text>
            </View>
            <View style={styles.speedPill}>
              <MaterialIcons name="speed" size={13} color={Colors.textDark} />
              <Text style={styles.speedText}>58 km/h</Text>
            </View>
          </View>

          {/* Route Origin -> Destination */}
          <View style={styles.routeRow}>
            <View style={styles.routeCol}>
              <Text style={styles.routeLabel}>ORIGIN</Text>
              <Text style={styles.routeCity}>Delhi (Okhla III)</Text>
            </View>
            <View style={styles.routeArrowBox}>
              <MaterialIcons name="arrow-forward" size={18} color="#9CA3AF" />
            </View>
            <View style={[styles.routeCol, { alignItems: 'flex-end' }]}>
              <Text style={styles.routeLabel}>DESTINATION</Text>
              <Text style={styles.routeCity}>Chandigarh (Ph 8)</Text>
            </View>
          </View>

          {/* Route Stats Ribbon */}
          <View style={styles.statsRibbon}>
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>TOTAL DIST</Text>
              <Text style={styles.statVal}>254 km</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>ELAPSED</Text>
              <Text style={styles.statVal}>3h 15m</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>BASELINE ETA</Text>
              <Text style={styles.statVal}>16:30</Text>
            </View>
          </View>
        </View>

        {/* Corridor Optimization Matrix Section Header */}
        <View style={styles.matrixSectionHeader}>
          <View style={styles.matrixHeaderLeft}>
            <MaterialIcons name="tune" size={18} color={Colors.black} />
            <Text style={styles.matrixHeaderTitle}>Dispatch Decision Matrix</Text>
          </View>
          <View style={styles.liveTelemetryTag}>
            <View style={styles.greenDot} />
            <Text style={styles.liveTelemetryText}>Live Telemetry</Text>
          </View>
        </View>

        {/* Uber Ride-Tier Style Decision Cards */}
        <View style={styles.plansContainer}>
          {/* Option 1: Direct Dedicated Dispatch */}
          <TouchableOpacity
            style={[styles.planCard, selectedPlan === 'direct' && styles.planCardActive]}
            onPress={() => setSelectedPlan('direct')}
            activeOpacity={0.9}
          >
            <View style={styles.planTopRow}>
              <View style={styles.planInfoGroup}>
                <View style={styles.planIconBox}>
                  <MaterialIcons name="local-shipping" size={20} color={Colors.black} />
                </View>
                <View>
                  <Text style={styles.planTitle}>Direct Dedicated Dispatch</Text>
                  <Text style={styles.planSub}>Immediate departure · Non-stop corridor</Text>
                </View>
              </View>
              <View style={[styles.planRadio, selectedPlan === 'direct' && styles.planRadioActive]}>
                {selectedPlan === 'direct' && <View style={styles.planRadioDot} />}
              </View>
            </View>

            <View style={styles.planBottomRow}>
              <View>
                <Text style={styles.subCaption}>DOCK ARRIVAL</Text>
                <Text style={styles.boldArrival}>
                  16:30 <Text style={styles.regularSub}>· Fast single drop</Text>
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.subCaption}>CORRIDOR COST</Text>
                <Text style={styles.boldCost}>₹14,800</Text>
              </View>
            </View>

            <View style={styles.planMetaRow}>
              <View style={styles.metaChip}>
                <View style={[styles.colorDot, { backgroundColor: '#F59E0B' }]} />
                <Text style={styles.metaChipText}>Payload: <Text style={styles.metaChipBold}>48%</Text></Text>
              </View>
              <View style={styles.metaChip}>
                <View style={[styles.colorDot, { backgroundColor: '#10B981' }]} />
                <Text style={styles.metaChipText}>Delay Risk: <Text style={styles.metaChipBold}>0%</Text></Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Option 2: Smart Consolidation Hold (Recommended) */}
          <TouchableOpacity
            style={[styles.planCard, selectedPlan === 'consolidated' && styles.planCardActive]}
            onPress={() => setSelectedPlan('consolidated')}
            activeOpacity={0.9}
          >
            <View style={styles.badgeRow}>
              <View style={styles.badgeGroup}>
                <View style={styles.blackPill}>
                  <Text style={styles.blackPillText}>RECOMMENDED</Text>
                </View>
                <View style={styles.greenPill}>
                  <Text style={styles.greenPillText}>SAVE 31%</Text>
                </View>
              </View>
              <View style={[styles.planRadio, selectedPlan === 'consolidated' && styles.planRadioActive]}>
                {selectedPlan === 'consolidated' && <View style={styles.planRadioDot} />}
              </View>
            </View>

            <View style={styles.planTopRow}>
              <View style={styles.planInfoGroup}>
                <View style={[styles.planIconBox, { backgroundColor: Colors.black }]}>
                  <MaterialIcons name="merge-type" size={20} color={Colors.white} />
                </View>
                <View>
                  <Text style={styles.planTitle}>Smart Consolidation Hold</Text>
                  <Text style={styles.planSub}>En-route matching at Sonipat Cross-Dock</Text>
                </View>
              </View>
            </View>

            {/* Pricing & Time Compare Box */}
            <View style={styles.pricingCompareBox}>
              <View>
                <Text style={styles.subCaption}>OPTIMIZED COST</Text>
                <View style={styles.priceWithOriginal}>
                  <Text style={styles.boldCost}>₹10,200</Text>
                  <Text style={styles.strikePrice}>₹14.8k</Text>
                </View>
                <Text style={styles.savingGreen}>₹4,600 Cash Savings</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.subCaption}>REVISED ETA</Text>
                <Text style={styles.boldCost}>18:45</Text>
                <Text style={styles.bufferText}>+1h 45m buffer</Text>
              </View>
            </View>

            {/* Vehicle Utilization Gauge */}
            <View style={styles.utilizationRow}>
              <View style={styles.utilizationLeft}>
                <MaterialIcons name="analytics" size={17} color={Colors.black} />
                <View>
                  <Text style={styles.utilizationTitle}>Vehicle Utilization: 86%</Text>
                  <Text style={styles.utilizationSub}>Near-full payload achieved</Text>
                </View>
              </View>
              <View style={styles.capacityBadge}>
                <Text style={styles.capacityBadgeText}>5.3 / 6.0 T</Text>
              </View>
            </View>

            {/* Matching Match Note */}
            <View style={styles.matchNote}>
              <MaterialIcons name="handshake" size={16} color="#0E8345" />
              <Text style={styles.matchNoteText}>
                <Text style={{ fontFamily: FontFamily.bold }}>Matching Match:</Text> 2.1T compatible dry-pharma cargo ready at Sonipat aligns with route & temp specs.
              </Text>
            </View>

            {/* Uber Black Button */}
            <TouchableOpacity
              style={styles.confirmConsolidationBtn}
              onPress={() => Alert.alert('Consolidation Confirmed', 'Saved ₹4,600! Cross-dock rendezvous updated.')}
              activeOpacity={0.85}
            >
              <MaterialIcons name="bolt" size={18} color={Colors.white} />
              <Text style={styles.confirmConsolidationBtnText}>
                Confirm Consolidation (Save ₹4,600)
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>

        {/* Freight Manifest & Security Card */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardSectionTitle}>Freight Manifest & Security</Text>
            <View style={styles.verifiedTag}>
              <Text style={styles.verifiedTagText}>VERIFIED</Text>
            </View>
          </View>

          <View style={styles.manifestGrid}>
            <View style={styles.manifestBox}>
              <View style={styles.manifestIcon}>
                <MaterialIcons name="inventory-2" size={17} color={Colors.black} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.manifestLabel}>CARGO TYPE</Text>
                <Text style={styles.manifestVal} numberOfLines={1}>3.2T Mach. Parts</Text>
              </View>
            </View>

            <View style={styles.manifestBox}>
              <View style={styles.manifestIcon}>
                <MaterialIcons name="local-shipping" size={17} color={Colors.black} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.manifestLabel}>TRUCK SPEC</Text>
                <Text style={styles.manifestVal} numberOfLines={1}>32ft MX Dry Van</Text>
              </View>
            </View>
          </View>

          <View style={styles.eLockRow}>
            <View style={styles.eLockLeft}>
              <MaterialIcons name="verified-user" size={18} color={Colors.black} />
              <Text style={styles.eLockText}>
                Digital E-Lock: <Text style={{ fontFamily: FontFamily.bold }}>#8812-B</Text>
              </Text>
            </View>
            <View style={styles.tamperBadge}>
              <Text style={styles.tamperBadgeText}>TAMPER INTACT</Text>
            </View>
          </View>
        </View>

        {/* Corridor Milestones (Uber Timeline) */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardSectionTitle}>Corridor Milestones</Text>
            <Text style={styles.highwaySub}>NH-44 Expressway</Text>
          </View>

          <View style={styles.timeline}>
            {/* Milestone 1: Passed */}
            <View style={styles.timelineItem}>
              <View style={styles.timelineTrack}>
                <View style={styles.passedDot}>
                  <MaterialIcons name="check" size={12} color={Colors.white} />
                </View>
                <View style={styles.trackLineSolid} />
              </View>
              <View style={styles.timelineBody}>
                <View style={styles.timelineHeadingRow}>
                  <Text style={styles.timelinePoint}>Delhi Logistics Hub (Okhla)</Text>
                  <Text style={styles.timelineTime}>08:30</Text>
                </View>
                <Text style={styles.timelineDesc}>Gate out inspection complete · E-Way Bill synced</Text>
              </View>
            </View>

            {/* Milestone 2: Passed */}
            <View style={styles.timelineItem}>
              <View style={styles.timelineTrack}>
                <View style={styles.passedDot}>
                  <MaterialIcons name="check" size={12} color={Colors.white} />
                </View>
                <View style={styles.trackLineSolid} />
              </View>
              <View style={styles.timelineBody}>
                <View style={styles.timelineHeadingRow}>
                  <Text style={styles.timelinePoint}>Kundli Border Bypass Toll</Text>
                  <Text style={styles.timelineTime}>11:15</Text>
                </View>
                <Text style={styles.timelineDesc}>FASTag auto-debited ₹340 · Clear expressway exit</Text>
              </View>
            </View>

            {/* Milestone 3: Active */}
            <View style={styles.timelineItem}>
              <View style={styles.timelineTrack}>
                <View style={styles.activeDotSurround}>
                  <View style={styles.activeDotInner} />
                </View>
                <View style={styles.trackLineDotted} />
              </View>
              <View style={styles.timelineBody}>
                <View style={styles.timelineHeadingRow}>
                  <Text style={styles.timelinePoint}>Panipat Rest & Checkpost</Text>
                  <View style={styles.activePill}>
                    <Text style={styles.activePillText}>ACTIVE 14:10</Text>
                  </View>
                </View>
                <Text style={[styles.timelineDesc, { color: Colors.textDark, fontFamily: FontFamily.medium }]}>
                  Holding pattern available · Consolidator 4 km away
                </Text>
              </View>
            </View>

            {/* Milestone 4: Pending */}
            <View style={styles.timelineItem}>
              <View style={styles.timelineTrack}>
                <View style={styles.pendingDot}>
                  <MaterialIcons name="flag" size={12} color="#9CA3AF" />
                </View>
              </View>
              <View style={styles.timelineBody}>
                <View style={styles.timelineHeadingRow}>
                  <Text style={[styles.timelinePoint, { color: '#6B7280' }]}>Chandigarh Unloading Dock</Text>
                  <Text style={styles.timelineTime}>16:30 / 18:45</Text>
                </View>
                <Text style={[styles.timelineDesc, { color: '#9CA3AF' }]}>
                  Phase 8 Industrial Terminal · Ramp 04 reserved
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Assigned Driver Card */}
        <View style={styles.card}>
          <View style={styles.driverCardInner}>
            <View style={styles.driverLeft}>
              <Image
                source={{
                  uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBshjiRm3NennbgLY4D5VOgQ80RKIA8AwXeBsKTUch12eh8HqiwKFGsYWE93Sy3PqecjIHvtW51p6jombrTNcJzESLvVgXElBHpY0BoIfQoW3TAfBLrQq7D6Gid8IMb8z0e61YbcBxS-fetWOj21MXPxaFDnf3JiKrRD3VDXKom-njr1LXr-70wCxQMVAkoEGuCHyKEjZdrL9Rsivm_oiJgDMKtI7FMQwT75l5IsMY',
                }}
                style={styles.driverAvatar}
              />
              <View style={styles.driverDetails}>
                <View style={styles.driverNameRow}>
                  <Text style={styles.driverName}>Rajesh Kumar</Text>
                  <View style={styles.ratingBadge}>
                    <MaterialIcons name="star" size={12} color="#F59E0B" />
                    <Text style={styles.ratingVal}>4.9</Text>
                  </View>
                </View>
                <Text style={styles.driverTruck}>DL-1AA-9082 · 340 Corridor Runs</Text>
              </View>
            </View>

            <View style={styles.driverActions}>
              <TouchableOpacity
                style={styles.actionCircleBtn}
                onPress={() => Alert.alert('Call', 'Dialing +91 98765 43210...')}
              >
                <MaterialIcons name="call" size={18} color={Colors.black} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionCircleBtn}
                onPress={() => Alert.alert('Chat', 'Opening driver dispatch chat...')}
              >
                <MaterialIcons name="chat" size={18} color={Colors.black} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Corridor Quick Location Banner */}
        <View style={styles.locationBanner}>
          <View style={styles.bannerLeft}>
            <MaterialIcons name="pin-drop" size={18} color="#9CA3AF" />
            <Text style={styles.bannerText}>Panipat Corridor Gateway (NH-44)</Text>
          </View>
          <View style={styles.kmBadge}>
            <Text style={styles.kmBadgeText}>KM 88.4 MARKER</Text>
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
  scrollContent: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.xxl + 20,
    gap: 12,
  },
  langSwitchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.xs,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  langSwitchText: {
    fontSize: 11,
    fontFamily: FontFamily.bold,
    color: Colors.textDark,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xs,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    ...Shadows.tier1,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  heroLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadgeBlack: {
    backgroundColor: Colors.black,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.xs,
  },
  statusBadgeText: {
    fontSize: 10,
    fontFamily: FontFamily.bold,
    color: Colors.white,
    letterSpacing: 0.5,
  },
  heroId: {
    fontSize: 14,
    fontFamily: FontFamily.bold,
    color: Colors.textDark,
  },
  speedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.xs,
  },
  speedText: {
    fontSize: 11,
    fontFamily: FontFamily.bold,
    color: Colors.textDark,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  routeCol: {
    flex: 1,
  },
  routeLabel: {
    fontSize: 10,
    fontFamily: FontFamily.mono,
    color: '#6B7280',
    letterSpacing: 0.5,
  },
  routeCity: {
    fontSize: 15,
    fontFamily: FontFamily.bold,
    color: Colors.textDark,
    marginTop: 2,
  },
  routeArrowBox: {
    paddingHorizontal: 12,
  },
  statsRibbon: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: Radius.xs,
    paddingVertical: 8,
    marginTop: Spacing.sm,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 9,
    fontFamily: FontFamily.mono,
    color: '#6B7280',
  },
  statVal: {
    fontSize: 13,
    fontFamily: FontFamily.bold,
    color: Colors.textDark,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: '#E5E7EB',
    alignSelf: 'center',
  },
  matrixSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 2,
    marginTop: 4,
  },
  matrixHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  matrixHeaderTitle: {
    fontSize: 15,
    fontFamily: FontFamily.bold,
    color: Colors.black,
  },
  liveTelemetryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.xs,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#059669',
  },
  liveTelemetryText: {
    fontSize: 10,
    fontFamily: FontFamily.semiBold,
    color: '#4B5563',
  },
  plansContainer: {
    gap: 10,
  },
  planCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xs,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    ...Shadows.tier1,
  },
  planCardActive: {
    borderWidth: 2,
    borderColor: Colors.black,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  badgeGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  blackPill: {
    backgroundColor: Colors.black,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: Radius.xs,
  },
  blackPillText: {
    fontSize: 9,
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },
  greenPill: {
    backgroundColor: '#0E8345',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: Radius.xs,
  },
  greenPillText: {
    fontSize: 9,
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },
  planRadio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  planRadioActive: {
    borderColor: Colors.black,
  },
  planRadioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.black,
  },
  planTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  planInfoGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  planIconBox: {
    width: 36,
    height: 36,
    borderRadius: Radius.xs,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  planTitle: {
    fontSize: 14,
    fontFamily: FontFamily.bold,
    color: Colors.black,
  },
  planSub: {
    fontSize: 11,
    fontFamily: FontFamily.regular,
    color: '#6B7280',
    marginTop: 1,
  },
  planBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: Spacing.sm,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  subCaption: {
    fontSize: 9,
    fontFamily: FontFamily.mono,
    color: '#9CA3AF',
  },
  boldArrival: {
    fontSize: 13,
    fontFamily: FontFamily.bold,
    color: Colors.black,
  },
  regularSub: {
    fontSize: 11,
    fontFamily: FontFamily.regular,
    color: '#6B7280',
  },
  boldCost: {
    fontSize: 16,
    fontFamily: FontFamily.bold,
    color: Colors.black,
  },
  planMetaRow: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F9FAFB',
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  colorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  metaChipText: {
    fontSize: 11,
    fontFamily: FontFamily.regular,
    color: '#6B7280',
  },
  metaChipBold: {
    fontFamily: FontFamily.bold,
    color: Colors.black,
  },
  pricingCompareBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    padding: Spacing.sm,
    borderRadius: Radius.xs,
    marginTop: Spacing.xs,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  priceWithOriginal: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginTop: 2,
  },
  strikePrice: {
    fontSize: 12,
    fontFamily: FontFamily.mono,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  savingGreen: {
    fontSize: 11,
    fontFamily: FontFamily.bold,
    color: '#0E8345',
    marginTop: 2,
  },
  bufferText: {
    fontSize: 11,
    fontFamily: FontFamily.regular,
    color: '#6B7280',
    marginTop: 2,
  },
  utilizationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: Radius.xs,
    marginTop: 8,
  },
  utilizationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  utilizationTitle: {
    fontSize: 11,
    fontFamily: FontFamily.bold,
    color: Colors.black,
  },
  utilizationSub: {
    fontSize: 10,
    fontFamily: FontFamily.regular,
    color: '#6B7280',
  },
  capacityBadge: {
    backgroundColor: Colors.white,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.xs,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  capacityBadgeText: {
    fontSize: 11,
    fontFamily: FontFamily.bold,
    color: Colors.black,
  },
  matchNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: '#F0FDF4',
    padding: 8,
    borderRadius: Radius.xs,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  matchNoteText: {
    flex: 1,
    fontSize: 11,
    fontFamily: FontFamily.regular,
    color: '#166534',
    lineHeight: 16,
  },
  confirmConsolidationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.black,
    paddingVertical: 11,
    borderRadius: Radius.xs,
    marginTop: 10,
  },
  confirmConsolidationBtnText: {
    fontSize: 13,
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  cardSectionTitle: {
    fontSize: 14,
    fontFamily: FontFamily.bold,
    color: Colors.black,
  },
  verifiedTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.xs,
  },
  verifiedTagText: {
    fontSize: 9,
    fontFamily: FontFamily.bold,
    color: '#4B5563',
  },
  manifestGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  manifestBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F9FAFB',
    padding: 8,
    borderRadius: Radius.xs,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  manifestIcon: {
    width: 28,
    height: 28,
    borderRadius: Radius.xs,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  manifestLabel: {
    fontSize: 9,
    fontFamily: FontFamily.mono,
    color: '#6B7280',
  },
  manifestVal: {
    fontSize: 12,
    fontFamily: FontFamily.bold,
    color: Colors.black,
  },
  eLockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: Radius.xs,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  eLockLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  eLockText: {
    fontSize: 11,
    fontFamily: FontFamily.regular,
    color: Colors.textDark,
  },
  tamperBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.xs,
  },
  tamperBadgeText: {
    fontSize: 9,
    fontFamily: FontFamily.bold,
    color: '#15803D',
  },
  highwaySub: {
    fontSize: 11,
    fontFamily: FontFamily.regular,
    color: '#6B7280',
  },
  timeline: {
    paddingLeft: 4,
    paddingTop: 4,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 10,
    paddingBottom: 16,
  },
  timelineTrack: {
    alignItems: 'center',
    width: 18,
  },
  passedDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  trackLineSolid: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.black,
    marginVertical: 2,
  },
  activeDotSurround: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.black,
    borderWidth: 3,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  activeDotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.white,
  },
  trackLineDotted: {
    width: 2,
    flex: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 2,
  },
  pendingDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  timelineBody: {
    flex: 1,
  },
  timelineHeadingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timelinePoint: {
    fontSize: 12,
    fontFamily: FontFamily.bold,
    color: Colors.black,
  },
  timelineTime: {
    fontSize: 11,
    fontFamily: FontFamily.regular,
    color: '#9CA3AF',
  },
  activePill: {
    backgroundColor: Colors.black,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.xs,
  },
  activePillText: {
    fontSize: 9,
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },
  timelineDesc: {
    fontSize: 11,
    fontFamily: FontFamily.regular,
    color: '#6B7280',
    marginTop: 2,
  },
  driverCardInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  driverLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  driverAvatar: {
    width: 44,
    height: 44,
    borderRadius: Radius.xs,
    backgroundColor: '#E5E7EB',
  },
  driverDetails: {
    flex: 1,
  },
  driverNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  driverName: {
    fontSize: 14,
    fontFamily: FontFamily.bold,
    color: Colors.black,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: Radius.xs,
  },
  ratingVal: {
    fontSize: 10,
    fontFamily: FontFamily.bold,
    color: Colors.black,
  },
  driverTruck: {
    fontSize: 11,
    fontFamily: FontFamily.regular,
    color: '#6B7280',
    marginTop: 2,
  },
  driverActions: {
    flexDirection: 'row',
    gap: 6,
  },
  actionCircleBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.xs,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  locationBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.black,
    borderRadius: Radius.xs,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  bannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bannerText: {
    fontSize: 12,
    fontFamily: FontFamily.medium,
    color: Colors.white,
  },
  kmBadge: {
    backgroundColor: '#262626',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.xs,
  },
  kmBadgeText: {
    fontSize: 9,
    fontFamily: FontFamily.bold,
    color: '#D1D5DB',
  },
});
