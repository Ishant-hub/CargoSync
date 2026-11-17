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
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors, FontFamily, Spacing, Radius, Typography, Shadows } from '../../theme/tokens';
import { useLanguage } from '../../context/LanguageContext';

export const CombineShipmentsScreen: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const navigation = useNavigation<any>();

  const [activeCorridor, setActiveCorridor] = useState<'nh44' | 'all'>('nh44');
  const [mergedCard1, setMergedCard1] = useState(false);
  const [mergedCard2, setMergedCard2] = useState(false);

  const handleMergeCard1 = () => {
    setMergedCard1(true);
    Alert.alert(
      'Consolidation Approved ✓',
      'Manifest combined on TRK-19 (BharatBenz 2823R). Additional revenue: +₹8,400. Detour: +14 km. Driver Manjit Singh dispatched via Shahpura industrial dock.',
      [
        {
          text: 'Return to Operations Hub',
          onPress: () => navigation.navigate('FleetTabs'),
        },
        { text: 'Done', style: 'cancel' },
      ]
    );
  };

  const handleMergeCard2 = () => {
    setMergedCard2(true);
    Alert.alert(
      'Co-Load Added ✓',
      '2.1 T Textile Yarn assigned to TRK-27 at Sonipat Cross-Dock Bay 04. Payout +₹4,600 secured.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Stitch Fixed Header */}
      <View style={styles.headerBar}>
        <View style={styles.headerLeft}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoCircleText}>C</Text>
          </View>
          <View style={styles.headerTitleCol}>
            <Text style={styles.headerTitle}>Optimize</Text>
            <TouchableOpacity
              style={styles.roleDropdown}
              activeOpacity={0.7}
              onPress={() => Alert.alert('Workspace', 'Fleet Ops (Load Optimizer)')}
            >
              <Text style={styles.roleDropdownText}>FLEET OPS</Text>
              <MaterialIcons name="expand-more" size={14} color="#7E7576" />
            </TouchableOpacity>
          </View>
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
        {/* Subtitle & Quick Metric Banner */}
        <View style={styles.topSection}>
          <Text style={styles.subtitleText}>
            Match loads, fill empty trucks, and cut deadhead miles.
          </Text>

          {/* Micro Live Status Strip */}
          <View style={styles.liveStrip}>
            <View style={styles.liveStripLeft}>
              <View style={styles.pulseDot} />
              <Text style={styles.liveStripTitle}>LIVE AI OPTIMIZATION</Text>
            </View>
            <Text style={styles.liveStripTime}>Updated 2m ago</Text>
          </View>
        </View>

        {/* Filter & Corridor Selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterTrack}
        >
          <TouchableOpacity
            style={[styles.corridorPill, activeCorridor === 'nh44' ? styles.corridorPillActive : styles.corridorPillInactive]}
            onPress={() => setActiveCorridor('nh44')}
            activeOpacity={0.8}
          >
            <MaterialIcons
              name="alt-route"
              size={17}
              color={activeCorridor === 'nh44' ? '#FFFFFF' : '#5D5F5F'}
            />
            <Text style={[styles.corridorPillText, activeCorridor === 'nh44' && styles.corridorPillTextActive]}>
              Northern Corridor (NH-44)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.corridorPill, activeCorridor === 'all' ? styles.corridorPillActive : styles.corridorPillInactive]}
            onPress={() => setActiveCorridor('all')}
            activeOpacity={0.8}
          >
            <MaterialIcons
              name="tune"
              size={17}
              color={activeCorridor === 'all' ? '#FFFFFF' : '#5D5F5F'}
            />
            <Text style={[styles.corridorPillText, activeCorridor === 'all' && styles.corridorPillTextActive]}>
              All Opportunities (3)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sortBtn}
            onPress={() => Alert.alert('Sort', 'Sorted by Maximum Yield Net Revenue')}
            activeOpacity={0.8}
          >
            <MaterialIcons name="swap-vert" size={18} color="#5D5F5F" />
          </TouchableOpacity>
        </ScrollView>

        {/* Opportunity Card 1 (Hero recommendation) */}
        <View style={styles.oppCard}>
          {/* Card Badge & Status */}
          <View style={styles.oppTopRow}>
            <View style={styles.recBadge}>
              <MaterialIcons name="auto-awesome" size={14} color="#109752" />
              <Text style={styles.recBadgeText}>RECOMMENDED · +₹8,400 REVENUE</Text>
            </View>
            <Text style={styles.highMatchText}>HIGH MATCH</Text>
          </View>

          {/* Route Header */}
          <View style={styles.routeHeaderCol}>
            <Text style={styles.oppTitle}>Combine Jaipur ➔ Delhi Return Leg</Text>
            <View style={styles.truckMetaRow}>
              <MaterialIcons name="local-shipping" size={16} color="#5D5F5F" />
              <Text style={styles.truckMetaText}>TRK-19 · BharatBenz 2823R (Driver: Manjit Singh)</Text>
            </View>
          </View>

          {/* Trip State Banner */}
          <View style={styles.tripStateBanner}>
            <View style={styles.warningCircle}>
              <MaterialIcons name="warning" size={17} color="#BA1A1A" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.tripStateTitle}>Empty return trip scheduled</Text>
              <Text style={styles.tripStateSub}>Departing Jaipur 17:00 · 248 km Deadhead</Text>
            </View>
          </View>

          {/* Capacity Progress Bar */}
          <View style={styles.capacityBox}>
            <View style={styles.capacityHeaderRow}>
              <Text style={styles.capacityTitle}>Capacity Utilization</Text>
              <Text style={styles.capacityPercentJump}>0% ➔ 82%</Text>
            </View>
            <View style={styles.capacityTrack}>
              <View style={[styles.capacityFill, { width: '82%' }]} />
            </View>
            <View style={styles.capacityFooterRow}>
              <Text style={styles.capacitySub}>3.2 T loaded of 4.0 T max</Text>
              <Text style={styles.payloadGainText}>+3.2 T Payload</Text>
            </View>
          </View>

          {/* Matched Consignments Sub-box */}
          <View style={styles.consignmentsSection}>
            <View style={styles.consignmentsHeaderRow}>
              <Text style={styles.consignmentsTitle}>2 Verified Consignments ready at Shahpura</Text>
              <Text style={styles.corridorSubTag}>Via NH-48</Text>
            </View>
            <View style={styles.consignmentItem}>
              <View style={styles.flexRowCenter}>
                <View style={styles.blackDot} />
                <Text style={styles.consignmentName}>Load A: 1.8 T Industrial Tools</Text>
              </View>
              <Text style={styles.consignmentCity}>Delhi Okhla</Text>
            </View>
            <View style={styles.consignmentItem}>
              <View style={styles.flexRowCenter}>
                <View style={styles.blackDot} />
                <Text style={styles.consignmentName}>Load B: 1.4 T Packaging Material</Text>
              </View>
              <Text style={styles.consignmentCity}>Gurgaon Udyog Vihar</Text>
            </View>
          </View>

          {/* Quick Metrics Grid */}
          <View style={styles.threeMetricsGrid}>
            <View style={styles.metricTile}>
              <Text style={styles.tileLabel}>Detour</Text>
              <Text style={styles.tileVal}>+14 km</Text>
              <Text style={styles.tileSub}>Highway loop</Text>
            </View>
            <View style={styles.metricTile}>
              <Text style={styles.tileLabel}>Extra Profit</Text>
              <Text style={styles.tileVal}>₹8,400</Text>
              <Text style={styles.tileGreenSub}>Net margin</Text>
            </View>
            <View style={styles.metricTile}>
              <Text style={styles.tileLabel}>CO2 Cut</Text>
              <Text style={styles.tileVal}>180 kg</Text>
              <Text style={styles.tileSub}>Avoided</Text>
            </View>
          </View>

          {/* Action Buttons (Radius.xs = 4px) */}
          <View style={styles.cardActionsRow}>
            <TouchableOpacity
              style={[styles.primaryActionBtn, mergedCard1 && { backgroundColor: '#262626' }]}
              onPress={handleMergeCard1}
              activeOpacity={0.85}
            >
              <MaterialIcons name="merge-type" size={18} color="#FFFFFF" />
              <Text style={styles.primaryActionText}>
                {mergedCard1 ? 'Shipments Merged' : 'Merge Shipments Now'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryActionBtn}
              onPress={() => Alert.alert('Route Preview', 'NH-48 via Shahpura Industrial Exit (14 km loop detour, 28 mins buffer)')}
              activeOpacity={0.85}
            >
              <MaterialIcons name="map" size={18} color="#000000" />
              <Text style={styles.secondaryActionText}>View Route</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Opportunity Card 2 */}
        <View style={styles.oppCard}>
          <View style={styles.oppTopRow}>
            <View style={styles.recBadge}>
              <MaterialIcons name="sync-alt" size={14} color="#000000" />
              <Text style={styles.recBadgeText}>CROSS-DOCK CO-LOAD · SAVE ₹4,600</Text>
            </View>
            <Text style={styles.highMatchText}>TOP-UP</Text>
          </View>

          <View style={styles.routeHeaderCol}>
            <Text style={styles.oppTitle}>Delhi ➔ Chandigarh Trunk Top-Up</Text>
            <View style={styles.truckMetaRow}>
              <MaterialIcons name="local-shipping" size={16} color="#5D5F5F" />
              <Text style={styles.truckMetaText}>TRK-27 · Eicher Pro 6028 (Driver: Rajesh Kumar)</Text>
            </View>
          </View>

          <View style={styles.tripStateBanner}>
            <View style={styles.storeCircle}>
              <MaterialIcons name="store" size={17} color="#000000" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.tripStateTitle}>Sonipat Cross-Dock (15 min highway stop)</Text>
              <Text style={styles.tripStateSub}>Ready from 19:30 · Bay 04 loading</Text>
            </View>
          </View>

          <View style={styles.consignmentItem}>
            <View>
              <Text style={styles.consignmentName}>2.1 T Textile Yarn</Text>
              <Text style={styles.consignmentCity}>Destination: Ludhiana Hub delivery</Text>
            </View>
            <View style={styles.coLoadTag}>
              <Text style={styles.coLoadTagText}>Co-load match</Text>
            </View>
          </View>

          <View style={styles.capacityBox}>
            <View style={styles.capacityHeaderRow}>
              <Text style={styles.capacityTitle}>Capacity Fill Optimization</Text>
              <Text style={styles.capacityPercentJump}>70% ➔ 98%</Text>
            </View>
            <View style={styles.capacityTrack}>
              <View style={{ width: '70%', height: '100%', backgroundColor: '#5D5F5F' }} />
              <View style={{ width: '28%', height: '100%', backgroundColor: '#000000' }} />
            </View>
            <View style={styles.capacityFooterRow}>
              <Text style={styles.capacitySub}>Currently: 5.3 T / 7.5 T (2.2 T free space)</Text>
              <Text style={styles.payloadGainText}>Optimal payload</Text>
            </View>
          </View>

          <View style={styles.cardActionsRow}>
            <TouchableOpacity
              style={[styles.primaryActionBtn, mergedCard2 && { backgroundColor: '#262626' }]}
              onPress={handleMergeCard2}
              activeOpacity={0.85}
            >
              <MaterialIcons name="add-circle" size={18} color="#FFFFFF" />
              <Text style={styles.primaryActionText}>
                {mergedCard2 ? 'Load Added to TRK-27' : 'Add Load to TRK-27'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryActionBtn}
              onPress={() => Alert.alert('Cargo Manifest', '2.1 T Textile Yarn · 4 Spools · Clean dry enclosure required')}
              activeOpacity={0.85}
            >
              <MaterialIcons name="inventory-2" size={18} color="#000000" />
              <Text style={styles.secondaryActionText}>Inspect Cargo</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Opportunity Card 3 (Minimal preview) */}
        <View style={styles.oppCardMinimal}>
          <View style={styles.oppTopRow}>
            <View style={styles.backhaulBadge}>
              <Text style={styles.backhaulBadgeText}>BACKHAUL · SAVE ₹6,100</Text>
            </View>
            <Text style={styles.departTimeText}>Departing 22:00</Text>
          </View>
          <View style={styles.oppMinimalRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.oppMinimalTitle}>Agra ➔ Noida Parcel Staging</Text>
              <Text style={styles.oppMinimalSub}>TRK-09 · 1.6 T capacity match at Mathura Bypass</Text>
            </View>
            <TouchableOpacity
              style={styles.chevronCircle}
              onPress={() => Alert.alert('Agra ➔ Noida Backhaul', 'TRK-09 available for 1.6 T parcel top-up at Mathura Bypass')}
            >
              <MaterialIcons name="chevron-right" size={20} color="#000000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Fleet Corridor KPI / Summary Card */}
        <View style={styles.bottomKpiCard}>
          <View style={styles.bottomKpiHeader}>
            <View style={styles.flexRowCenter}>
              <MaterialIcons name="trending-up" size={20} color="#FFFFFF" />
              <Text style={styles.bottomKpiTitle}>Corridor Efficiency</Text>
            </View>
            <View style={styles.monthlyImpactTag}>
              <Text style={styles.monthlyImpactText}>Monthly Impact</Text>
            </View>
          </View>

          <View style={styles.bottomKpiGrid}>
            <View style={styles.bottomKpiTile}>
              <Text style={styles.bottomKpiLabel}>Fill Rate</Text>
              <Text style={styles.bottomKpiValue}>86.4%</Text>
              <Text style={styles.bottomKpiGreenTag}>+14% vs last week</Text>
            </View>

            <View style={styles.bottomKpiTile}>
              <Text style={styles.bottomKpiLabel}>Empty km Reduced</Text>
              <Text style={styles.bottomKpiValue}>1,420 km</Text>
              <Text style={styles.bottomKpiSubText}>This billing month</Text>
            </View>
          </View>

          <View style={styles.bottomKpiFooter}>
            <Text style={styles.bottomKpiFooterText}>Calculated across 42 active trucks in North Sector</Text>
            <TouchableOpacity onPress={() => Alert.alert('Report', 'Consolidation audit PDF exported')}>
              <Text style={styles.downloadReportText}>Download Report</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CombineShipmentsScreen;

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
  logoCircleText: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  headerTitleCol: {
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 17,
    color: '#000000',
    letterSpacing: -0.3,
    lineHeight: 18,
  },
  roleDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#DCDDDD',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: Radius.full,
    marginTop: 2,
  },
  roleDropdownText: {
    fontFamily: FontFamily.bold,
    fontSize: 9,
    color: '#1A1C1C',
    letterSpacing: 0.5,
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
  topSection: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    gap: 6,
  },
  subtitleText: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: '#5D5F5F',
    lineHeight: 18,
  },
  liveStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EEEEEE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    marginTop: 4,
  },
  liveStripLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#109752',
  },
  liveStripTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: '#1A1C1C',
    letterSpacing: 0.6,
  },
  liveStripTime: {
    fontFamily: FontFamily.regular,
    fontSize: 10,
    color: '#5D5F5F',
  },
  filterTrack: {
    paddingHorizontal: Spacing.base,
    paddingVertical: 8,
    gap: 8,
  },
  corridorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    height: 38,
    borderRadius: Radius.full,
  },
  corridorPillActive: {
    backgroundColor: '#000000',
  },
  corridorPillInactive: {
    backgroundColor: '#EEEEEE',
  },
  corridorPillText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
    color: '#1A1C1C',
  },
  corridorPillTextActive: {
    color: '#FFFFFF',
  },
  sortBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  oppCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: Spacing.base,
    marginTop: 10,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    gap: 12,
    ...Shadows.sm,
  },
  oppTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#EEEEEE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  recBadgeText: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: '#1A1C1C',
    letterSpacing: 0.3,
  },
  highMatchText: {
    fontFamily: FontFamily.bold,
    fontSize: 9,
    color: '#5D5F5F',
    letterSpacing: 0.8,
  },
  routeHeaderCol: {
    gap: 4,
  },
  oppTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: '#000000',
    fontWeight: '800',
  },
  truckMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  truckMetaText: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: '#5D5F5F',
  },
  tripStateBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F4F3F3',
    padding: 10,
    borderRadius: Radius.xs,
  },
  warningCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tripStateTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
    color: '#000000',
  },
  tripStateSub: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#5D5F5F',
  },
  capacityBox: {
    backgroundColor: '#F4F3F3',
    padding: 10,
    borderRadius: Radius.xs,
    gap: 6,
  },
  capacityHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  capacityTitle: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: '#000000',
  },
  capacityPercentJump: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
    color: '#000000',
  },
  capacityTrack: {
    height: 8,
    backgroundColor: '#EEEEEE',
    borderRadius: Radius.full,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  capacityFill: {
    height: '100%',
    backgroundColor: '#000000',
    borderRadius: Radius.full,
  },
  capacityFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  capacitySub: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#5D5F5F',
  },
  payloadGainText: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: '#109752',
  },
  consignmentsSection: {
    gap: 6,
  },
  consignmentsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  consignmentsTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
    color: '#000000',
  },
  corridorSubTag: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#5D5F5F',
  },
  consignmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F4F3F3',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: Radius.xs,
  },
  flexRowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  blackDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#000000',
  },
  consignmentName: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: '#000000',
  },
  consignmentCity: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#5D5F5F',
  },
  coLoadTag: {
    backgroundColor: '#EEEEEE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  coLoadTagText: {
    fontFamily: FontFamily.medium,
    fontSize: 10,
    color: '#000000',
  },
  threeMetricsGrid: {
    flexDirection: 'row',
    gap: 6,
  },
  metricTile: {
    flex: 1,
    backgroundColor: '#F4F3F3',
    padding: 8,
    borderRadius: Radius.xs,
  },
  tileLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 10,
    color: '#5D5F5F',
  },
  tileVal: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: '#000000',
    fontWeight: '800',
    marginTop: 2,
  },
  tileSub: {
    fontFamily: FontFamily.regular,
    fontSize: 9,
    color: '#5D5F5F',
    marginTop: 1,
  },
  tileGreenSub: {
    fontFamily: FontFamily.semiBold,
    fontSize: 9,
    color: '#109752',
    marginTop: 1,
  },
  cardActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },
  primaryActionBtn: {
    flex: 1,
    height: 44,
    backgroundColor: '#000000',
    borderRadius: Radius.xs, // 4px exact Stitch requirement
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  primaryActionText: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
    color: '#FFFFFF',
  },
  secondaryActionBtn: {
    paddingHorizontal: 16,
    height: 44,
    backgroundColor: '#EEEEEE',
    borderRadius: Radius.xs, // 4px exact Stitch requirement
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  secondaryActionText: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
    color: '#000000',
  },
  oppCardMinimal: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: Spacing.base,
    marginTop: 10,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    gap: 8,
    ...Shadows.sm,
  },
  backhaulBadge: {
    backgroundColor: '#EEEEEE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  backhaulBadgeText: {
    fontFamily: FontFamily.bold,
    fontSize: 9,
    color: '#000000',
    letterSpacing: 0.5,
  },
  departTimeText: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#5D5F5F',
  },
  oppMinimalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  oppMinimalTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: '#000000',
  },
  oppMinimalSub: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#5D5F5F',
    marginTop: 2,
  },
  chevronCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomKpiCard: {
    backgroundColor: '#000000',
    marginHorizontal: Spacing.base,
    marginTop: 14,
    marginBottom: Spacing.lg,
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: 12,
    ...Shadows.md,
  },
  bottomKpiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomKpiTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  monthlyImpactTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  monthlyImpactText: {
    fontFamily: FontFamily.medium,
    fontSize: 10,
    color: '#FFFFFF',
  },
  bottomKpiGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  bottomKpiTile: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 10,
    borderRadius: Radius.xs,
  },
  bottomKpiLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  bottomKpiValue: {
    fontFamily: FontFamily.bold,
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '900',
    marginTop: 4,
  },
  bottomKpiGreenTag: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: '#85FAA9',
    marginTop: 4,
  },
  bottomKpiSubText: {
    fontFamily: FontFamily.regular,
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  bottomKpiFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
  },
  bottomKpiFooterText: {
    fontFamily: FontFamily.regular,
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    flex: 1,
  },
  downloadReportText: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },
});
