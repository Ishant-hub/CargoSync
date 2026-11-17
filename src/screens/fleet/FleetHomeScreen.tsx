import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors, FontFamily, Spacing, Radius, Typography, Shadows } from '../../theme/tokens';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

export default function FleetHomeScreen() {
  const { language, setLanguage, t } = useLanguage();
  const { user } = useAuth();
  const navigation = useNavigation<any>();

  const [refreshing, setRefreshing] = useState(false);
  const [planApplied, setPlanApplied] = useState(false);
  const [planRejected, setPlanRejected] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  };

  const handleApplyRecovery = () => {
    setPlanApplied(true);
    Alert.alert(
      'Recovery Plan Dispatched',
      'TRK-09 cross-dock bypass approved at Karnal staging. SLA secured with zero violation penalty.',
      [
        {
          text: 'View Disruption Details',
          onPress: () => navigation.navigate('DisruptionRecovery', { incidentId: 'INC-8942' }),
        },
        { text: 'Done', style: 'cancel' },
      ]
    );
  };

  const handleKeepBaseline = () => {
    setPlanRejected(true);
    Alert.alert(
      'Baseline Retained',
      'TRK-14 will remain on current repair timeline at Panipat staging.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Stitch Black Header Bar */}
      <View style={styles.headerBar}>
        <View style={styles.headerLeft}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>CS</Text>
          </View>
          <View style={styles.headerTitleCol}>
            <View style={styles.titleDropdownRow}>
              <Text style={styles.headerTitle}>Fleet Ops</Text>
              <TouchableOpacity
                style={styles.hqBadge}
                activeOpacity={0.7}
                onPress={() => Alert.alert('Hub Selector', 'North HQ (Active Corridor Trunk DL-HR-RJ-PB)')}
              >
                <Text style={styles.hqBadgeText}>NORTH HQ</Text>
                <MaterialIcons name="expand-more" size={14} color="#D4D4D4" />
              </TouchableOpacity>
            </View>
            <Text style={styles.headerSub}>CargoSync Freight Network</Text>
          </View>
        </View>

        {/* Controls: Language, Notifications, Profile */}
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.langPill}
            onPress={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            activeOpacity={0.8}
          >
            <MaterialIcons name="language" size={14} color="#D4D4D4" />
            <Text style={styles.langText}>{language === 'en' ? 'EN | हिंदी' : 'हिंदी | EN'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconCircle}
            onPress={() => navigation.navigate('Notifications')}
            activeOpacity={0.8}
          >
            <MaterialIcons name="notifications" size={18} color="#E5E5E5" />
            <View style={styles.notifDot} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.avatarCircle}
            onPress={() => navigation.navigate('FleetProfile')}
            activeOpacity={0.8}
          >
            <MaterialIcons name="person" size={17} color="#000000" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primaryBlack]}
            tintColor={Colors.primaryBlack}
          />
        }
      >
        {/* High-Contrast Live Operations Status Strip */}
        <View style={styles.liveStrip}>
          <View style={styles.liveStripLeft}>
            <View style={styles.pulseContainer}>
              <View style={styles.pulseDot} />
            </View>
            <View style={styles.liveStripTextCol}>
              <Text style={styles.corridorLabel}>CORRIDOR LIVE HUB</Text>
              <Text style={styles.corridorName}>Northern Trunk · DL-HR-RJ-PB</Text>
            </View>
          </View>
          <View style={styles.liveMonitorBadge}>
            <MaterialIcons name="radar" size={14} color="#34D399" />
            <Text style={styles.liveMonitorText}>LIVE MONITOR</Text>
          </View>
        </View>

        {/* 4 KPI Metric Ribbon */}
        <View style={styles.kpiRibbon}>
          {/* Active Fleet */}
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>Active Fleet</Text>
            <View style={styles.kpiValRow}>
              <Text style={styles.kpiNumber}>24</Text>
              <Text style={styles.kpiTotal}>/28</Text>
            </View>
            <View style={styles.kpiTagNeutral}>
              <Text style={styles.kpiTagNeutralText}>85% Online</Text>
            </View>
          </View>

          {/* Shipments */}
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>Shipments</Text>
            <View style={styles.kpiValRow}>
              <Text style={styles.kpiNumber}>62</Text>
            </View>
            <Text style={styles.kpiSubNeutral}>In Transit</Text>
          </View>

          {/* Delayed (High Contrast Stark Black Card) */}
          <View style={styles.kpiCardBlack}>
            <View style={styles.kpiBlackTop}>
              <Text style={styles.kpiLabelRed}>Delayed</Text>
              <MaterialIcons name="warning" size={13} color="#EF4444" />
            </View>
            <View style={styles.kpiValRow}>
              <Text style={styles.kpiNumberWhite}>02</Text>
            </View>
            <View style={styles.kpiTagRed}>
              <Text style={styles.kpiTagRedText}>Critical SLA</Text>
            </View>
          </View>

          {/* Utilization */}
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>Utilization</Text>
            <View style={styles.kpiValRow}>
              <Text style={styles.kpiNumber}>84.6%</Text>
            </View>
            <Text style={styles.kpiGreenTrend}>+4.2% wk</Text>
          </View>
        </View>

        {/* Section 1: Critical Disruption Recovery Card */}
        <View style={[styles.sectionCard, planRejected && { opacity: 0.6 }]}>
          <View style={styles.disruptionHeaderBanner}>
            <View style={styles.disruptionHeaderLeft}>
              <View style={styles.redAlertDot} />
              <View>
                <Text style={styles.disruptionAlertCode}>INCIDENT ALERT #INC-8942</Text>
                <Text style={styles.disruptionTruckTitle}>TRK-14 (Panipat) · Alternator Breakdown</Text>
              </View>
            </View>
            <View style={styles.criticalPill}>
              <Text style={styles.criticalPillText}>CRITICAL</Text>
            </View>
          </View>

          <View style={styles.disruptionBody}>
            {/* Diagnosis Callout */}
            <View style={styles.diagnosisCallout}>
              <MaterialIcons name="crisis-alert" size={17} color="#171717" style={{ marginTop: 1 }} />
              <Text style={styles.diagnosisText}>
                Vehicle stranded on <Text style={styles.boldText}>NH-44 km 86</Text>. Two temperature-sensitive consignments at risk of hard SLA breach within 45 mins.
              </Text>
            </View>

            {/* Comparison Matrix: Baseline vs AI Recommended Recovery */}
            <View style={styles.matrixContainer}>
              {/* CURRENT PATH (STRANDED) */}
              <View style={styles.baselineCard}>
                <View style={styles.matrixCardTop}>
                  <Text style={styles.baselineTag}>CURRENT PATH (STRANDED)</Text>
                  <View style={styles.breachBadge}>
                    <Text style={styles.breachBadgeText}>+3.5h BREACH</Text>
                  </View>
                </View>
                <View style={styles.matrixRowCenter}>
                  <View style={styles.flexRowCenter}>
                    <MaterialIcons name="local-shipping" size={16} color="#737373" />
                    <Text style={styles.matrixTitle}>TRK-14 · Panipat Staging</Text>
                  </View>
                  <Text style={styles.etaRed}>ETA 19:30</Text>
                </View>
                <View style={styles.matrixFooterRow}>
                  <Text style={styles.matrixSub}>Dest: Ludhiana Hub</Text>
                  <Text style={styles.sunkCost}>Sunk Cost: ₹9,400</Text>
                </View>
              </View>

              {/* AI RECOMMENDED RECOVERY */}
              <View style={styles.aiRecoveryCard}>
                <View style={styles.matrixCardTop}>
                  <View style={styles.flexRowCenter}>
                    <MaterialIcons name="auto-mode" size={15} color="#000000" />
                    <Text style={styles.aiRecoveryTag}>AI RECOMMENDED RECOVERY</Text>
                  </View>
                  <View style={styles.slaSecuredBadge}>
                    <Text style={styles.slaSecuredText}>SLA SECURED</Text>
                  </View>
                </View>

                {/* Plan Details Box */}
                <View style={styles.planDetailsBox}>
                  <View style={styles.matrixRowCenter}>
                    <View style={styles.flexRowCenter}>
                      <View style={styles.swapIconBox}>
                        <MaterialIcons name="swap-horiz" size={16} color="#FFFFFF" />
                      </View>
                      <View>
                        <Text style={styles.planTitle}>Cross-dock via TRK-09</Text>
                        <Text style={styles.planSub}>Karnal staging bypass (14 km away)</Text>
                      </View>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.planEta}>17:15</Text>
                      <Text style={styles.onTimeTag}>ON-TIME</Text>
                    </View>
                  </View>
                  <View style={styles.benefitRow}>
                    <View style={styles.flexRowCenter}>
                      <MaterialIcons name="verified" size={14} color="#000000" />
                      <Text style={styles.benefitText}>₹4,200 SLA penalty avoided</Text>
                    </View>
                    <Text style={styles.redispatchCost}>+₹850 re-dispatch</Text>
                  </View>
                </View>

                {/* Incident Action Buttons (Radius.xs = 4px) */}
                <View style={styles.recoveryBtnRow}>
                  <TouchableOpacity
                    style={[styles.applyPlanBtn, planApplied && { backgroundColor: '#262626' }]}
                    onPress={handleApplyRecovery}
                    activeOpacity={0.85}
                  >
                    <MaterialIcons name={planApplied ? "check" : "check-circle"} size={16} color="#FFFFFF" />
                    <Text style={styles.applyPlanBtnText}>
                      {planApplied ? 'Dispatched TRK-09' : 'Apply Recovery Plan'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.keepBaselineBtn}
                    onPress={handleKeepBaseline}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.keepBaselineBtnText}>Keep Baseline</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Section 2: Return-Load Opportunity */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.flexRowCenter}>
              <View style={styles.blackSquareDot} />
              <Text style={styles.sectionTitle}>Return-Load Match</Text>
            </View>
            <View style={styles.zeroDeadheadBadge}>
              <Text style={styles.zeroDeadheadText}>ZERO DEADHEAD</Text>
            </View>
          </View>

          <View style={styles.returnCorridorBox}>
            <View style={styles.returnTopRow}>
              <View style={styles.flexRowCenter}>
                <View style={styles.truckIconSquare}>
                  <MaterialIcons name="local-shipping" size={20} color="#FFFFFF" />
                </View>
                <View>
                  <Text style={styles.returnTruckTitle}>TRK-19 · Empty Leg</Text>
                  <Text style={styles.returnTruckSub}>Jaipur → Delhi Corridor</Text>
                </View>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.returnRevenue}>+₹8,400</Text>
                <Text style={styles.returnRevenueSub}>NET REVENUE</Text>
              </View>
            </View>

            {/* 3 Capabilities Tiles */}
            <View style={styles.threeTilesGrid}>
              <View style={styles.capabilityCol}>
                <Text style={styles.capabilityLabel}>AVAILABLE SPACE</Text>
                <Text style={styles.capabilityVal}>3.6 T Free</Text>
              </View>
              <View style={[styles.capabilityCol, styles.colBorder]}>
                <Text style={styles.capabilityLabel}>DETOUR RUN</Text>
                <Text style={styles.capabilityVal}>+12 km</Text>
              </View>
              <View style={styles.capabilityCol}>
                <Text style={styles.capabilityLabel}>BUFFER MARGIN</Text>
                <Text style={styles.capabilityVal}>2h 10m</Text>
              </View>
            </View>

            <View style={styles.shippersNoticeRow}>
              <MaterialIcons name="check-circle" size={15} color="#000000" />
              <Text style={styles.shippersNoticeText}>
                2 Verified Shippers staged at Shahpura industrial dock
              </Text>
            </View>

            <TouchableOpacity
              style={styles.fullWidthActionBtn}
              onPress={() => navigation.navigate('CombineShipments')}
              activeOpacity={0.85}
            >
              <MaterialIcons name="alt-route" size={17} color="#FFFFFF" />
              <Text style={styles.fullWidthActionBtnText}>Review & Lock Consolidation</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section 3: Lane Consolidation Radar */}
        <View style={[styles.sectionCard, { marginBottom: Spacing.xl }]}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.flexRowCenter}>
              <View style={styles.greySquareDot} />
              <Text style={styles.sectionTitle}>Lane Consolidation Radar</Text>
            </View>
            <Text style={styles.spineText}>Northern Spine</Text>
          </View>

          <View style={styles.radarCard}>
            <View style={styles.returnTopRow}>
              <View style={styles.flexRowCenter}>
                <View style={styles.hubIconSquare}>
                  <MaterialIcons name="hub" size={18} color="#000000" />
                </View>
                <View>
                  <Text style={styles.radarLaneTitle}>Delhi ↔ Chandigarh Trunk</Text>
                  <Text style={styles.radarLaneSub}>4 Trucks Active · 8 Fragmented Loads</Text>
                </View>
              </View>
              <View style={styles.yieldBadge}>
                <Text style={styles.yieldBadgeText}>+18% Yield</Text>
              </View>
            </View>

            {/* Density Progress Bar */}
            <View style={styles.densitySection}>
              <View style={styles.densityLabelRow}>
                <Text style={styles.densityLabel}>Capacity Fill Opportunity</Text>
                <Text style={styles.densityOptimal}>68% → 86% Optimal</Text>
              </View>
              <View style={styles.progressBarTrack}>
                <View style={[styles.progressBarFillBase, { width: '68%' }]} />
                <View style={[styles.progressBarFillBonus, { width: '18%' }]} />
              </View>
            </View>

            <View style={styles.radarFooterRow}>
              <Text style={styles.co2Text}>
                Potential CO² saved: <Text style={styles.boldText}>140 kg</Text>
              </Text>
              <TouchableOpacity
                style={styles.optimizeLaneBtn}
                onPress={() => navigation.navigate('CombineShipments')}
                activeOpacity={0.7}
              >
                <Text style={styles.optimizeLaneBtnText}>Optimize Lane</Text>
                <MaterialIcons name="chevron-right" size={16} color="#000000" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  headerBar: {
    backgroundColor: '#000000',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  logoBadge: {
    width: 32,
    height: 32,
    borderRadius: Radius.xs,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBadgeText: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: '#000000',
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  headerTitleCol: {
    justifyContent: 'center',
    flex: 1,
  },
  titleDropdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  hqBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#262626',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.xs,
  },
  hqBadgeText: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: '#D4D4D4',
    letterSpacing: 0.5,
    fontWeight: '700',
  },
  headerSub: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#A3A3A3',
    marginTop: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#171717',
    borderWidth: 1,
    borderColor: '#404040',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  langText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 11,
    color: '#F5F5F5',
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#171717',
    borderWidth: 1,
    borderColor: '#262626',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifDot: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#000000',
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: Spacing.xxl,
  },
  liveStrip: {
    backgroundColor: '#171717',
    paddingHorizontal: Spacing.base,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#262626',
  },
  liveStripLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  pulseContainer: {
    width: 10,
    height: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  liveStripTextCol: {
    flex: 1,
  },
  corridorLabel: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: '#A3A3A3',
    letterSpacing: 0.8,
  },
  corridorName: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: '#FFFFFF',
    marginTop: 1,
  },
  liveMonitorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: '#262626',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.xs,
  },
  liveMonitorText: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: '#FFFFFF',
    letterSpacing: 0.6,
  },
  kpiRibbon: {
    flexDirection: 'row',
    padding: Spacing.sm,
    gap: 6,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    justifyContent: 'space-between',
  },
  kpiCardBlack: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 8,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: '#171717',
    justifyContent: 'space-between',
  },
  kpiLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 10,
    color: '#737373',
  },
  kpiBlackTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  kpiLabelRed: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: '#F87171',
  },
  kpiValRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 3,
  },
  kpiNumber: {
    fontFamily: FontFamily.bold,
    fontSize: 17,
    fontWeight: '900',
    color: '#000000',
  },
  kpiNumberWhite: {
    fontFamily: FontFamily.bold,
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  kpiTotal: {
    fontFamily: FontFamily.semiBold,
    fontSize: 10,
    color: '#A3A3A3',
    marginLeft: 1,
  },
  kpiTagNeutral: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: Radius.xs,
    marginTop: 4,
    alignItems: 'center',
  },
  kpiTagNeutralText: {
    fontFamily: FontFamily.bold,
    fontSize: 9,
    color: '#000000',
  },
  kpiSubNeutral: {
    fontFamily: FontFamily.medium,
    fontSize: 9,
    color: '#737373',
    marginTop: 4,
  },
  kpiTagRed: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: Radius.xs,
    marginTop: 4,
    alignItems: 'center',
  },
  kpiTagRedText: {
    fontFamily: FontFamily.bold,
    fontSize: 9,
    color: '#FFFFFF',
  },
  kpiGreenTrend: {
    fontFamily: FontFamily.bold,
    fontSize: 9,
    color: '#047857',
    marginTop: 4,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: Spacing.sm,
    marginTop: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    overflow: 'hidden',
    ...Shadows.sm,
  },
  disruptionHeaderBanner: {
    backgroundColor: '#000000',
    paddingHorizontal: Spacing.base,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#262626',
  },
  disruptionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  redAlertDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  disruptionAlertCode: {
    fontFamily: FontFamily.bold,
    fontSize: 9,
    color: '#F87171',
    letterSpacing: 0.8,
  },
  disruptionTruckTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
    color: '#FFFFFF',
    marginTop: 1,
  },
  criticalPill: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: Radius.xs,
  },
  criticalPillText: {
    fontFamily: FontFamily.bold,
    fontSize: 9,
    color: '#FFFFFF',
    letterSpacing: 0.6,
  },
  disruptionBody: {
    padding: Spacing.md,
  },
  diagnosisCallout: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: Radius.sm,
    marginBottom: Spacing.md,
  },
  diagnosisText: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: '#404040',
    lineHeight: 17,
    flex: 1,
  },
  boldText: {
    fontFamily: FontFamily.bold,
    color: '#000000',
  },
  matrixContainer: {
    gap: 10,
  },
  baselineCard: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: Radius.sm,
    padding: 10,
    gap: 6,
  },
  matrixCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  baselineTag: {
    fontFamily: FontFamily.bold,
    fontSize: 9,
    color: '#737373',
    letterSpacing: 0.6,
  },
  breachBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.xs,
  },
  breachBadgeText: {
    fontFamily: FontFamily.bold,
    fontSize: 9,
    color: '#B91C1C',
  },
  matrixRowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flexRowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  matrixTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: '#000000',
  },
  etaRed: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: '#DC2626',
    fontWeight: '800',
  },
  matrixFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  matrixSub: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#737373',
  },
  sunkCost: {
    fontFamily: FontFamily.semiBold,
    fontSize: 11,
    color: '#404040',
  },
  aiRecoveryCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: Radius.sm,
    padding: 10,
    gap: 8,
  },
  aiRecoveryTag: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: '#000000',
    letterSpacing: 0.6,
    fontWeight: '800',
  },
  slaSecuredBadge: {
    backgroundColor: '#000000',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.xs,
  },
  slaSecuredText: {
    fontFamily: FontFamily.bold,
    fontSize: 9,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  planDetailsBox: {
    backgroundColor: '#F5F5F5',
    borderRadius: Radius.xs,
    padding: 9,
    gap: 8,
  },
  swapIconBox: {
    width: 26,
    height: 26,
    borderRadius: Radius.xs,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  planTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
    color: '#000000',
  },
  planSub: {
    fontFamily: FontFamily.regular,
    fontSize: 10,
    color: '#525252',
  },
  planEta: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: '#000000',
    fontWeight: '900',
  },
  onTimeTag: {
    fontFamily: FontFamily.bold,
    fontSize: 8,
    color: '#737373',
    letterSpacing: 0.5,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  benefitText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 11,
    color: '#000000',
  },
  redispatchCost: {
    fontFamily: FontFamily.medium,
    fontSize: 10,
    color: '#737373',
  },
  recoveryBtnRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },
  applyPlanBtn: {
    flex: 3,
    height: 42,
    backgroundColor: '#000000',
    borderRadius: Radius.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  applyPlanBtnText: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
    color: '#FFFFFF',
  },
  keepBaselineBtn: {
    flex: 2,
    height: 42,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D4D4D4',
    borderRadius: Radius.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keepBaselineBtnText: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
    color: '#000000',
  },
  sectionHeaderRow: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  blackSquareDot: {
    width: 8,
    height: 8,
    backgroundColor: '#000000',
    borderRadius: 2,
  },
  greySquareDot: {
    width: 8,
    height: 8,
    backgroundColor: '#A3A3A3',
    borderRadius: 2,
  },
  sectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: '#000000',
    letterSpacing: -0.2,
  },
  zeroDeadheadBadge: {
    backgroundColor: '#000000',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  zeroDeadheadText: {
    fontFamily: FontFamily.bold,
    fontSize: 9,
    color: '#FFFFFF',
    letterSpacing: 0.6,
  },
  returnCorridorBox: {
    backgroundColor: '#FAFAFA',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    padding: Spacing.md,
    gap: 10,
  },
  returnTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  truckIconSquare: {
    width: 34,
    height: 34,
    borderRadius: Radius.xs,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  returnTruckTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: '#000000',
  },
  returnTruckSub: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#737373',
  },
  returnRevenue: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    fontWeight: '900',
    color: '#000000',
  },
  returnRevenueSub: {
    fontFamily: FontFamily.bold,
    fontSize: 9,
    color: '#737373',
    letterSpacing: 0.5,
  },
  threeTilesGrid: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: Radius.xs,
    paddingVertical: 8,
  },
  capabilityCol: {
    flex: 1,
    alignItems: 'center',
  },
  colBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#F0F0F0',
  },
  capabilityLabel: {
    fontFamily: FontFamily.bold,
    fontSize: 9,
    color: '#A3A3A3',
    letterSpacing: 0.5,
  },
  capabilityVal: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    fontWeight: '800',
    color: '#000000',
    marginTop: 2,
  },
  shippersNoticeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 2,
  },
  shippersNoticeText: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#525252',
    flex: 1,
  },
  fullWidthActionBtn: {
    height: 44,
    backgroundColor: '#000000',
    borderRadius: Radius.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 2,
  },
  fullWidthActionBtnText: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
    color: '#FFFFFF',
  },
  spineText: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: '#737373',
  },
  radarCard: {
    backgroundColor: '#FAFAFA',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    padding: Spacing.md,
    gap: 10,
  },
  hubIconSquare: {
    width: 32,
    height: 32,
    borderRadius: Radius.xs,
    backgroundColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarLaneTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: '#000000',
  },
  radarLaneSub: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#737373',
  },
  yieldBadge: {
    backgroundColor: '#000000',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.xs,
  },
  yieldBadgeText: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  densitySection: {
    gap: 5,
    marginTop: 2,
  },
  densityLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  densityLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 11,
    color: '#525252',
  },
  densityOptimal: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: '#000000',
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: '#E5E5E5',
    borderRadius: Radius.full,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  progressBarFillBase: {
    height: '100%',
    backgroundColor: '#404040',
  },
  progressBarFillBonus: {
    height: '100%',
    backgroundColor: '#000000',
  },
  radarFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  co2Text: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#737373',
  },
  optimizeLaneBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  optimizeLaneBtnText: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
    color: '#000000',
  },
});
