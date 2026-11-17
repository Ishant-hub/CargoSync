/**
 * FleetOptimizeScreen — Stitch source of truth: "Combine Shipments Planner" (06a355568f964aaa8ecdf5c310762608)
 * Design language: Fleet Ops Hub (767cfeb807404e75b80d6978223a2ba4)
 * Preserves: consolidationEngine, whatIfSimulator, reoptimizeTrip logic
 */
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
import { Colors, FontFamily, Spacing, Radius, Shadows } from '../../theme/tokens';
import { useLanguage } from '../../context/LanguageContext';
import { mockTrucks, mockShipments, mockTrips, mockOptimizations } from '../../data/mockData';
import { generateOptimizationOpportunities, reoptimizeTrip } from '../../services/consolidationEngine';
import { runWhatIfSimulation, SimulationScenario } from '../../services/whatIfSimulator';
import { OptimizationOpportunity, Trip, Truck } from '../../types';

type ActiveTab = 'consolidation' | 'reoptimization' | 'what-if';

export default function FleetOptimizeScreen() {
  const navigation = useNavigation<any>();
  const { language, setLanguage } = useLanguage();

  const [activeTab, setActiveTab] = useState<ActiveTab>('consolidation');
  const [opportunities, setOpportunities] = useState<OptimizationOpportunity[]>(mockOptimizations);
  const [whatIfScenario, setWhatIfScenario] = useState<SimulationScenario>('truck_breakdown');
  const [refreshing, setRefreshing] = useState(false);

  const consolidationOpps = opportunities.filter(o => o.compatibleShipments.length > 0);
  const totalPotentialSavings = consolidationOpps.reduce((s, o) => s + o.totalPotentialSaving, 0);
  const trucksWithSpare = mockTrucks.filter(t => t.status === 'on_trip' && t.availableCapacity > 1).length;
  const delayedTrips = mockTrips.filter(
    t => t.status === 'delayed' || (t.actualEta && new Date(t.actualEta) > new Date(t.plannedEta))
  ).length;

  const handleRefresh = () => {
    setRefreshing(true);
    const fresh = generateOptimizationOpportunities(mockTrucks, mockShipments, mockTrips);
    setTimeout(() => {
      setOpportunities(fresh);
      setRefreshing(false);
    }, 900);
  };

  const handleRunWhatIf = () => {
    const result = runWhatIfSimulation(whatIfScenario);
    Alert.alert(
      result.scenarioTitle,
      `${result.summaryBadge}\n\n${result.scenarioDescription}\n\n` +
        result.recommendedSteps
          .map(s => `${s.stepNumber}. ${s.action}: ${s.detail}`)
          .join('\n\n'),
      [
        {
          text: 'Apply Recovery Plan',
          onPress: () =>
            Alert.alert('Plan Applied', 'Re-optimisation executed. All stakeholders notified.'),
        },
        { text: 'Close' },
      ]
    );
  };

  const TABS: { key: ActiveTab; label: string; icon: keyof typeof MaterialIcons.glyphMap; count: number | null }[] = [
    { key: 'consolidation', label: 'Consolidation', icon: 'merge-type', count: consolidationOpps.length },
    { key: 'reoptimization', label: 'Re-Optimise', icon: 'sync', count: delayedTrips || null },
    { key: 'what-if', label: 'What-If Sim', icon: 'science', count: null },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ── Stitch Header ─────────────────────────────────────────────────── */}
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
              onPress={() => Alert.alert('Workspace', 'Fleet Ops · Load Optimizer')}
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

      {/* ── Subtitle & Live Strip ─────────────────────────────────────────── */}
      <View style={styles.topSection}>
        <Text style={styles.subtitleText}>
          Match loads, fill empty trucks, and cut deadhead miles.
        </Text>
        <View style={styles.liveStrip}>
          <View style={styles.liveStripLeft}>
            <View style={styles.pulseDot} />
            <Text style={styles.liveStripTitle}>LIVE AI OPTIMISATION</Text>
          </View>
          <TouchableOpacity onPress={handleRefresh} disabled={refreshing}>
            <Text style={styles.liveStripTime}>{refreshing ? 'Refreshing…' : 'Updated 2m ago'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── KPI Row ─────────────────────────────────────────────────────── */}
      <View style={styles.kpiRow}>
        <View style={styles.kpiTile}>
          <Text style={styles.kpiValue}>₹{(totalPotentialSavings / 1000).toFixed(0)}K</Text>
          <Text style={styles.kpiLabel}>Potential Savings</Text>
        </View>
        <View style={[styles.kpiTile, styles.kpiTileDark]}>
          <Text style={[styles.kpiValue, { color: '#85FAA9' }]}>{trucksWithSpare}</Text>
          <Text style={[styles.kpiLabel, { color: 'rgba(255,255,255,0.7)' }]}>Trucks Optimisable</Text>
        </View>
        <View style={styles.kpiTile}>
          <Text style={[styles.kpiValue, delayedTrips > 0 ? { color: '#BA1A1A' } : { color: '#109752' }]}>
            {delayedTrips}
          </Text>
          <Text style={styles.kpiLabel}>Delayed Trips</Text>
        </View>
      </View>

      {/* ── Tab Selector ─────────────────────────────────────────────────── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabTrack}
      >
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabPill, activeTab === tab.key && styles.tabPillActive]}
            onPress={() => setActiveTab(tab.key)}
            activeOpacity={0.8}
          >
            <MaterialIcons
              name={tab.icon}
              size={15}
              color={activeTab === tab.key ? '#FFFFFF' : '#5D5F5F'}
            />
            <Text style={[styles.tabPillText, activeTab === tab.key && styles.tabPillTextActive]}>
              {tab.label}
            </Text>
            {tab.count !== null && tab.count > 0 && (
              <View style={[styles.tabBadge, activeTab === tab.key && { backgroundColor: 'rgba(255,255,255,0.3)' }]}>
                <Text style={styles.tabBadgeText}>{tab.count}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── Tab Content ──────────────────────────────────────────────────── */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'consolidation' && (
          <ConsolidationTab
            opportunities={consolidationOpps}
            navigation={navigation}
          />
        )}
        {activeTab === 'reoptimization' && (
          <ReoptimisationTab
            trips={mockTrips}
            trucks={mockTrucks}
            shipments={mockShipments}
            delayedTrips={delayedTrips}
          />
        )}
        {activeTab === 'what-if' && (
          <WhatIfTab
            whatIfScenario={whatIfScenario}
            setWhatIfScenario={setWhatIfScenario}
            onRun={handleRunWhatIf}
          />
        )}

        {/* ── Bottom KPI Card (Black) ─────────────────────────────────── */}
        <View style={styles.bottomKpiCard}>
          <View style={styles.bottomKpiHeader}>
            <Text style={styles.bottomKpiTitle}>Fleet Efficiency Impact</Text>
            <View style={styles.monthlyTag}>
              <Text style={styles.monthlyTagText}>THIS MONTH</Text>
            </View>
          </View>
          <View style={styles.bottomKpiGrid}>
            <View style={styles.bottomKpiTile}>
              <Text style={styles.bottomKpiLabel}>Empty KM Saved</Text>
              <Text style={styles.bottomKpiValue}>1,240</Text>
              <Text style={styles.bottomKpiGreen}>↓ 34% deadhead</Text>
            </View>
            <View style={styles.bottomKpiTile}>
              <Text style={styles.bottomKpiLabel}>Revenue Added</Text>
              <Text style={styles.bottomKpiValue}>₹2.1L</Text>
              <Text style={styles.bottomKpiGreen}>+18% vs last month</Text>
            </View>
            <View style={styles.bottomKpiTile}>
              <Text style={styles.bottomKpiLabel}>CO₂ Avoided</Text>
              <Text style={styles.bottomKpiValue}>890kg</Text>
              <Text style={styles.bottomKpiGreen}>Fleet sustainability</Text>
            </View>
          </View>
          <View style={styles.bottomKpiFooter}>
            <Text style={styles.bottomKpiFooterText}>
              ⚡ Based on consolidated shipments this month. Prototype data.
            </Text>
            <TouchableOpacity onPress={() => Alert.alert('Report', 'Report export coming soon.')}>
              <Text style={styles.downloadReportText}>Export Report</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── CONSOLIDATION TAB ────────────────────────────────────────────────────────

function ConsolidationTab({
  opportunities,
  navigation,
}: {
  opportunities: OptimizationOpportunity[];
  navigation: any;
}) {
  const [merged, setMerged] = useState<Record<string, boolean>>({});

  if (opportunities.length === 0) {
    return (
      <View style={styles.emptyCard}>
        <MaterialIcons name="merge-type" size={40} color="#CCCCCC" />
        <Text style={styles.emptyTitle}>No Consolidation Opportunities</Text>
        <Text style={styles.emptySub}>
          All active trucks are at optimal utilisation or no compatible pending shipments.
        </Text>
      </View>
    );
  }

  return (
    <>
      {opportunities.slice(0, 3).map(opp => {
        const isMerged = merged[opp.id] ?? false;
        return (
          <View key={opp.id} style={styles.oppCard}>
            {/* Badge Row */}
            <View style={styles.oppTopRow}>
              <View style={styles.recBadge}>
                <MaterialIcons name="auto-awesome" size={13} color="#109752" />
                <Text style={styles.recBadgeText}>
                  RECOMMENDED · +₹{opp.totalPotentialSaving.toLocaleString('en-IN')} REVENUE
                </Text>
              </View>
              <Text style={styles.highMatchText}>
                {opp.potentialUtilization > 80 ? 'HIGH MATCH' : 'TOP-UP'}
              </Text>
            </View>

            {/* Route Header */}
            <View style={styles.routeHeaderCol}>
              <Text style={styles.oppTitle}>
                {opp.truckRegistration} — Spare {opp.availableCapacity}T
              </Text>
              <View style={styles.truckMetaRow}>
                <MaterialIcons name="local-shipping" size={15} color="#5D5F5F" />
                <Text style={styles.truckMetaText}>
                  {opp.truckRegistration} · {opp.truckType}
                </Text>
              </View>
            </View>

            {/* Capacity Bar */}
            <View style={styles.capacityBox}>
              <View style={styles.capacityHeaderRow}>
                <Text style={styles.capacityTitle}>Capacity Utilisation</Text>
                <Text style={styles.capacityPercentJump}>
                  {opp.currentUtilization}% → {opp.potentialUtilization}%
                </Text>
              </View>
              <View style={styles.capacityTrack}>
                <View style={[styles.capacityFill, { width: `${opp.potentialUtilization}%` }]} />
              </View>
              <View style={styles.capacityFooterRow}>
                <Text style={styles.capacitySub}>{opp.availableCapacity}T available</Text>
                <Text style={styles.payloadGainText}>
                  +{(opp.potentialUtilization - opp.currentUtilization).toFixed(0)}% Utilisation
                </Text>
              </View>
            </View>

            {/* Compatible shipments */}
            {opp.compatibleShipments.slice(0, 2).map((s, i) => (
              <View key={i} style={styles.consignmentItem}>
                <View style={styles.flexRowCenter}>
                  <View style={styles.blackDot} />
                  <Text style={styles.consignmentName}>{s.id}: {s.weight}T cargo</Text>
                </View>
                <Text style={styles.consignmentCity}>{s.delivery.city}</Text>
              </View>
            ))}

            {/* Metrics Grid */}
            <View style={styles.threeMetricsGrid}>
              <View style={styles.metricTile}>
                <Text style={styles.tileLabel}>Saving</Text>
                <Text style={styles.tileVal}>₹{(opp.totalPotentialSaving / 1000).toFixed(1)}K</Text>
                <Text style={styles.tileGreenSub}>Net margin</Text>
              </View>
              <View style={styles.metricTile}>
                <Text style={styles.tileLabel}>Util. Gain</Text>
                <Text style={styles.tileVal}>+{(opp.potentialUtilization - opp.currentUtilization).toFixed(0)}%</Text>
                <Text style={styles.tileSub}>Payload</Text>
              </View>
              <View style={styles.metricTile}>
                <Text style={styles.tileLabel}>Shipments</Text>
                <Text style={styles.tileVal}>{opp.compatibleShipments.length}</Text>
                <Text style={styles.tileSub}>Matched</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.cardActionsRow}>
              <TouchableOpacity
                style={[styles.primaryActionBtn, isMerged && { backgroundColor: '#262626' }]}
                onPress={() => {
                  setMerged(m => ({ ...m, [opp.id]: true }));
                  Alert.alert(
                    'Consolidation Applied ✓',
                    `Manifest consolidated on ${opp.truckRegistration}.\nAdditional revenue: +₹${opp.totalPotentialSaving.toLocaleString('en-IN')}.`,
                    [{ text: 'OK' }]
                  );
                }}
                activeOpacity={0.85}
              >
                <MaterialIcons name="merge-type" size={17} color="#FFFFFF" />
                <Text style={styles.primaryActionText}>
                  {isMerged ? 'Shipments Merged' : 'Merge Shipments Now'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryActionBtn}
                onPress={() => navigation.navigate('CombineShipments')}
                activeOpacity={0.85}
              >
                <MaterialIcons name="map" size={17} color="#000000" />
                <Text style={styles.secondaryActionText}>View Planner</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </>
  );
}

// ─── RE-OPTIMISATION TAB ─────────────────────────────────────────────────────

function ReoptimisationTab({
  trips,
  trucks,
  shipments,
  delayedTrips,
}: {
  trips: Trip[];
  trucks: Truck[];
  shipments: any[];
  delayedTrips: number;
}) {
  const disruptedTrips = trips.filter(
    t => t.status === 'delayed' || (t.actualEta && new Date(t.actualEta) > new Date(t.plannedEta))
  );

  if (disruptedTrips.length === 0) {
    return (
      <View style={[styles.emptyCard, { backgroundColor: '#F0FDF4', borderColor: '#109752', borderWidth: 1 }]}>
        <MaterialIcons name="verified" size={40} color="#109752" />
        <Text style={[styles.emptyTitle, { color: '#109752' }]}>All Trips On Track</Text>
        <Text style={styles.emptySub}>
          No disruptions detected. Fleet operating within planned parameters.
        </Text>
      </View>
    );
  }

  return (
    <>
      <View style={styles.sectionLabelRow}>
        <Text style={styles.sectionLabel}>ACTIVE DISRUPTIONS</Text>
        <View style={styles.alertBadge}>
          <Text style={styles.alertBadgeText}>{delayedTrips} need attention</Text>
        </View>
      </View>
      {disruptedTrips.map(trip => {
        const truck = trucks.find(t => t.id === trip.truckId);
        const reopt = reoptimizeTrip(
          trip,
          { type: 'route_blocked', description: 'Route congestion detected' },
          trucks,
          shipments
        );
        const delayMin = trip.actualEta
          ? Math.round((new Date(trip.actualEta).getTime() - new Date(trip.plannedEta).getTime()) / 60000)
          : 0;

        return (
          <View key={trip.id} style={styles.disruptionCard}>
            <View style={styles.disruptionTopRow}>
              <View style={styles.disruptionBadge}>
                <MaterialIcons name="warning" size={13} color="#BA1A1A" />
                <Text style={styles.disruptionBadgeText}>DELAYED {delayMin > 0 ? `· +${delayMin} MIN` : ''}</Text>
              </View>
              <Text style={styles.disruptionId}>{trip.id}</Text>
            </View>

            <Text style={styles.disruptionRoute}>
              {trip.origin?.city ?? '—'} → {trip.destination?.city ?? '—'}
            </Text>
            {truck && (
              <View style={styles.truckMetaRow}>
                <MaterialIcons name="local-shipping" size={14} color="#5D5F5F" />
                <Text style={styles.truckMetaText}>{truck.registrationNumber} · {truck.driverName}</Text>
              </View>
            )}

            {reopt.changes.length > 0 && (
              <View style={styles.reoptBox}>
                <Text style={styles.reoptTitle}>AI RECOVERY PLAN</Text>
                {reopt.changes.slice(0, 2).map((c, i) => (
                  <Text key={i} style={styles.reoptStep}>• {c}</Text>
                ))}
              </View>
            )}

            <View style={styles.cardActionsRow}>
              <TouchableOpacity
                style={styles.primaryActionBtn}
                onPress={() =>
                  Alert.alert(
                    'Re-Optimisation Applied',
                    reopt.changes.join('\n'),
                    [{ text: 'OK' }]
                  )
                }
                activeOpacity={0.85}
              >
                <MaterialIcons name="sync" size={17} color="#FFFFFF" />
                <Text style={styles.primaryActionText}>Apply Recovery Plan</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </>
  );
}

// ─── WHAT-IF TAB ──────────────────────────────────────────────────────────────

const WHAT_IF_SCENARIOS: {
  key: SimulationScenario;
  title: string;
  desc: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
}[] = [
  { key: 'truck_breakdown', title: 'Truck Breakdown', desc: 'Mechanical failure on active route', icon: 'build', color: '#BA1A1A' },
  { key: 'shipment_cancellation', title: 'Shipment Cancelled', desc: 'Customer cancels last-minute', icon: 'cancel', color: '#D97706' },
  { key: 'deadline_acceleration', title: 'Deadline Moved Up', desc: 'Consignee requests earlier delivery', icon: 'schedule', color: '#3B82F6' },
  { key: 'express_load_insertion', title: 'Express Load Insert', desc: 'Urgent cargo added to active truck', icon: 'bolt', color: '#109752' },
];

function WhatIfTab({
  whatIfScenario,
  setWhatIfScenario,
  onRun,
}: {
  whatIfScenario: SimulationScenario;
  setWhatIfScenario: (s: SimulationScenario) => void;
  onRun: () => void;
}) {
  const result = runWhatIfSimulation(whatIfScenario);

  return (
    <>
      <View style={styles.sectionLabelRow}>
        <Text style={styles.sectionLabel}>WHAT-IF SCENARIO SIMULATOR</Text>
      </View>
      <Text style={styles.whatIfDesc}>
        Select a disruption scenario to model impact on cost, ETA and utilisation. Results use prototype data — not live fleet.
      </Text>

      {/* Scenario Cards */}
      <View style={styles.scenarioGrid}>
        {WHAT_IF_SCENARIOS.map(sc => {
          const isSelected = sc.key === whatIfScenario;
          return (
            <TouchableOpacity
              key={sc.key}
              style={[
                styles.scenarioCard,
                isSelected && { borderColor: sc.color, borderWidth: 2 },
              ]}
              onPress={() => setWhatIfScenario(sc.key)}
              activeOpacity={0.8}
            >
              {isSelected && (
                <View style={[styles.scenarioCheck, { backgroundColor: sc.color }]}>
                  <MaterialIcons name="check" size={12} color="#FFFFFF" />
                </View>
              )}
              <View style={[styles.scenarioIcon, { backgroundColor: sc.color + '18' }]}>
                <MaterialIcons name={sc.icon} size={24} color={sc.color} />
              </View>
              <Text style={styles.scenarioTitle}>{sc.title}</Text>
              <Text style={styles.scenarioSubtitle}>{sc.desc}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Result Preview */}
      <View style={styles.resultCard}>
        <Text style={styles.resultTitle}>{result.scenarioTitle}</Text>
        <Text style={styles.resultSummary}>{result.summaryBadge}</Text>
        <View style={styles.resultMetrics}>
          <View style={styles.resultMetricTile}>
            <Text style={styles.resultMetricLabel}>Feasibility</Text>
            <Text style={styles.resultMetricValue}>{result.feasibilityScore}%</Text>
          </View>
          <View style={styles.resultMetricTile}>
            <Text style={styles.resultMetricLabel}>Cost Saved</Text>
            <Text style={styles.resultMetricValue}>₹{result.deltas.costSaved.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.resultMetricTile}>
            <Text style={styles.resultMetricLabel}>Util. Gain</Text>
            <Text style={styles.resultMetricValue}>+{result.deltas.utilizationGainPercent}%</Text>
          </View>
        </View>
        <Text style={styles.resultDisclaimer}>⚠ Prototype simulation data — not live fleet telemetry.</Text>
      </View>

      {/* Run Button */}
      <TouchableOpacity style={styles.runBtn} onPress={onRun} activeOpacity={0.85}>
        <MaterialIcons name="play-arrow" size={20} color="#FFFFFF" />
        <Text style={styles.runBtnText}>Run Simulation & See Recovery Plan</Text>
      </TouchableOpacity>
    </>
  );
}

// ─── STYLES ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F3F3',
  },

  // Header (Stitch CombineShipments style)
  headerBar: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    ...Shadows.tier1,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCircleText: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: '#FFFFFF',
  },
  headerTitleCol: { gap: 2 },
  headerTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 18,
    color: '#000000',
    letterSpacing: -0.3,
  },
  roleDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  roleDropdownText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 10,
    color: '#7E7576',
    letterSpacing: 0.5,
  },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  langToggleBox: {
    flexDirection: 'row',
    backgroundColor: '#F4F3F3',
    borderRadius: Radius.full,
    padding: 2,
    gap: 2,
  },
  langBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  langBtnActive: { backgroundColor: '#000000' },
  langBtnText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 11,
    color: '#5D5F5F',
  },
  langBtnTextActive: { color: '#FFFFFF' },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Top Section
  topSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: 10,
    paddingBottom: 10,
  },
  subtitleText: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: '#5D5F5F',
    marginBottom: 8,
  },
  liveStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F4F3F3',
    borderRadius: Radius.xs,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  liveStripLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#109752',
  },
  liveStripTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: '#000000',
    letterSpacing: 0.5,
  },
  liveStripTime: {
    fontFamily: FontFamily.regular,
    fontSize: 10,
    color: '#5D5F5F',
  },

  // KPI Row
  kpiRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: 12,
    gap: 8,
  },
  kpiTile: {
    flex: 1,
    backgroundColor: '#F4F3F3',
    borderRadius: Radius.xs,
    padding: 10,
    alignItems: 'center',
  },
  kpiTileDark: { backgroundColor: '#000000' },
  kpiValue: {
    fontFamily: FontFamily.bold,
    fontSize: 18,
    color: '#000000',
    fontWeight: '900',
  },
  kpiLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 10,
    color: '#5D5F5F',
    marginTop: 2,
    textAlign: 'center',
  },

  // Tab Selector
  tabTrack: {
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: 10,
    gap: 8,
    backgroundColor: '#FFFFFF',
  },
  tabPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#F4F3F3',
    borderRadius: Radius.full,
  },
  tabPillActive: { backgroundColor: '#000000' },
  tabPillText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
    color: '#5D5F5F',
  },
  tabPillTextActive: { color: '#FFFFFF' },
  tabBadge: {
    minWidth: 18,
    paddingHorizontal: 5,
    paddingVertical: 1,
    backgroundColor: '#BA1A1A',
    borderRadius: Radius.full,
    alignItems: 'center',
  },
  tabBadgeText: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: '#FFFFFF',
  },

  // Scroll Content
  scrollContent: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: 14,
    paddingBottom: 100,
    gap: 12,
  },

  // Section Label
  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  sectionLabel: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: '#5D5F5F',
    letterSpacing: 0.6,
  },
  alertBadge: {
    backgroundColor: '#FFDAD6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  alertBadgeText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 10,
    color: '#BA1A1A',
  },

  // Opportunity Card (Stitch "Combine Shipments" style)
  oppCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: 10,
    ...Shadows.tier1,
  },
  oppTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  recBadgeText: {
    fontFamily: FontFamily.bold,
    fontSize: 9,
    color: '#109752',
    letterSpacing: 0.3,
  },
  highMatchText: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: '#5D5F5F',
    letterSpacing: 0.5,
  },
  routeHeaderCol: { gap: 4 },
  oppTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: '#000000',
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
  capacityBox: { gap: 5 },
  capacityHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  capacityTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: 11,
    color: '#000000',
  },
  capacityPercentJump: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: '#109752',
  },
  capacityTrack: {
    height: 7,
    backgroundColor: '#EEEEEE',
    borderRadius: Radius.full,
    overflow: 'hidden',
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
    fontSize: 10,
    color: '#5D5F5F',
  },
  payloadGainText: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: '#109752',
  },
  consignmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F4F3F3',
    paddingHorizontal: 10,
    paddingVertical: 7,
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
    fontSize: 11,
    color: '#000000',
  },
  consignmentCity: {
    fontFamily: FontFamily.regular,
    fontSize: 10,
    color: '#5D5F5F',
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
    gap: 1,
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
  },
  tileSub: {
    fontFamily: FontFamily.regular,
    fontSize: 9,
    color: '#5D5F5F',
  },
  tileGreenSub: {
    fontFamily: FontFamily.semiBold,
    fontSize: 9,
    color: '#109752',
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
    borderRadius: Radius.xs,
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
    borderRadius: Radius.xs,
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

  // Empty State
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    padding: 32,
    alignItems: 'center',
    gap: 10,
    ...Shadows.tier1,
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
  },

  // Disruption Card
  disruptionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#BA1A1A',
    ...Shadows.tier1,
  },
  disruptionTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  disruptionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFDAD6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  disruptionBadgeText: {
    fontFamily: FontFamily.bold,
    fontSize: 9,
    color: '#BA1A1A',
    letterSpacing: 0.5,
  },
  disruptionId: {
    fontFamily: FontFamily.semiBold,
    fontSize: 11,
    color: '#5D5F5F',
  },
  disruptionRoute: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: '#000000',
  },
  reoptBox: {
    backgroundColor: '#F4F3F3',
    borderRadius: Radius.xs,
    padding: 10,
    gap: 4,
  },
  reoptTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 9,
    color: '#5D5F5F',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  reoptStep: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#000000',
    lineHeight: 16,
  },

  // What-If Tab
  whatIfDesc: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: '#5D5F5F',
    marginBottom: 10,
  },
  scenarioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  scenarioCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    padding: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    position: 'relative',
    ...Shadows.tier1,
  },
  scenarioCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scenarioIcon: {
    width: 42,
    height: 42,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scenarioTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
    color: '#000000',
  },
  scenarioSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 10,
    color: '#5D5F5F',
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: 8,
    marginBottom: 10,
    ...Shadows.tier1,
  },
  resultTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: '#000000',
  },
  resultSummary: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: '#5D5F5F',
  },
  resultMetrics: {
    flexDirection: 'row',
    gap: 8,
  },
  resultMetricTile: {
    flex: 1,
    backgroundColor: '#F4F3F3',
    borderRadius: Radius.xs,
    padding: 8,
    alignItems: 'center',
  },
  resultMetricLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 9,
    color: '#5D5F5F',
    letterSpacing: 0.3,
  },
  resultMetricValue: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: '#000000',
    marginTop: 2,
  },
  resultDisclaimer: {
    fontFamily: FontFamily.regular,
    fontSize: 10,
    color: '#D97706',
    backgroundColor: '#FFFBEB',
    padding: 6,
    borderRadius: Radius.xs,
  },
  runBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    backgroundColor: '#000000',
    borderRadius: Radius.xs,
    marginBottom: 4,
  },
  runBtnText: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: '#FFFFFF',
  },

  // Bottom KPI Card
  bottomKpiCard: {
    backgroundColor: '#000000',
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: 12,
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
  },
  monthlyTag: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  monthlyTagText: {
    fontFamily: FontFamily.medium,
    fontSize: 10,
    color: '#FFFFFF',
  },
  bottomKpiGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  bottomKpiTile: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    padding: 10,
    borderRadius: Radius.xs,
    gap: 2,
  },
  bottomKpiLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 10,
    color: 'rgba(255,255,255,0.65)',
  },
  bottomKpiValue: {
    fontFamily: FontFamily.bold,
    fontSize: 18,
    color: '#FFFFFF',
  },
  bottomKpiGreen: {
    fontFamily: FontFamily.semiBold,
    fontSize: 9,
    color: '#85FAA9',
  },
  bottomKpiFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
    gap: 8,
  },
  bottomKpiFooterText: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
  },
  downloadReportText: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },
});
