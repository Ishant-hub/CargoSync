/**
 * ShipperOptimizeScreen — Stitch source of truth: "Combine Shipments Planner" (06a355568f964aaa8ecdf5c310762608)
 * Design language: Fleet Ops Hub / Shipper Home Stitch screens
 * Preserves: generateOptimizationOpportunities, checkCompatibility, OptimizationModal, RateEstimatorModal logic
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
  TouchableWithoutFeedback,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors, FontFamily, Spacing, Radius, Shadows } from '../../theme/tokens';
import { useLanguage } from '../../context/LanguageContext';
import { mockTrucks, mockShipments, mockTrips, mockOptimizations } from '../../data/mockData';
import { generateOptimizationOpportunities } from '../../services/consolidationEngine';
import { OptimizationOpportunity } from '../../types';
import { OptimizationModal, RateEstimatorModal } from '../../components';

export default function ShipperOptimizeScreen() {
  const navigation = useNavigation<any>();
  const { language, setLanguage } = useLanguage();

  const [opportunities, setOpportunities] = useState<OptimizationOpportunity[]>(mockOptimizations);
  const [selectedOpportunity, setSelectedOpportunity] = useState<OptimizationOpportunity | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isRateEstimatorOpen, setIsRateEstimatorOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [mergedIds, setMergedIds] = useState<Record<string, boolean>>({});

  const totalSavings = opportunities.reduce((s, o) => s + o.totalPotentialSaving, 0);

  const handleRefresh = () => {
    setRefreshing(true);
    const fresh = generateOptimizationOpportunities(mockTrucks, mockShipments, mockTrips);
    setTimeout(() => {
      setOpportunities(fresh);
      setRefreshing(false);
    }, 900);
  };

  const handleApply = (opp: OptimizationOpportunity) => {
    setMergedIds(m => ({ ...m, [opp.id]: true }));
    Alert.alert(
      'Consolidation Applied ✓',
      `${opp.compatibleShipments.length} shipment(s) matched with ${opp.truckRegistration}.\nPotential saving: ₹${opp.totalPotentialSaving.toLocaleString('en-IN')}\nUtilisation: ${opp.currentUtilization}% → ${opp.potentialUtilization}%`,
      [
        { text: 'View Updated Trip', onPress: () => Alert.alert('Trip Updated', 'Driver notified. New manifest sent.') },
        { text: 'OK' },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ── Stitch Header ───────────────────────────────────────────────── */}
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
              onPress={() => Alert.alert('Workspace', 'Shipper · Load Consolidation Engine')}
            >
              <Text style={styles.roleDropdownText}>SHIPPER</Text>
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
            onPress={() => navigation.navigate('ShipperProfile')}
            activeOpacity={0.8}
          >
            <MaterialIcons name="person" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Subtitle & Live Strip ─────────────────────────────────────── */}
      <View style={styles.topSection}>
        <Text style={styles.subtitleText}>
          Consolidate part-loads, reduce shipping costs and book trucks faster.
        </Text>
        <View style={styles.liveStrip}>
          <View style={styles.liveStripLeft}>
            <View style={styles.pulseDot} />
            <Text style={styles.liveStripTitle}>LIVE AI MATCHING</Text>
          </View>
          <TouchableOpacity onPress={handleRefresh} disabled={refreshing}>
            <Text style={styles.liveStripTime}>{refreshing ? 'Refreshing…' : 'Updated 2m ago'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── KPI Row ─────────────────────────────────────────────────────── */}
      <View style={styles.kpiRow}>
        <View style={styles.kpiTile}>
          <Text style={styles.kpiValue}>{opportunities.length}</Text>
          <Text style={styles.kpiLabel}>Open Matches</Text>
        </View>
        <View style={[styles.kpiTile, styles.kpiTileDark]}>
          <Text style={[styles.kpiValue, { color: '#85FAA9' }]}>
            ₹{(totalSavings / 1000).toFixed(0)}K
          </Text>
          <Text style={[styles.kpiLabel, { color: 'rgba(255,255,255,0.7)' }]}>Potential Savings</Text>
        </View>
        <View style={styles.kpiTile}>
          <TouchableOpacity onPress={() => setIsRateEstimatorOpen(true)}>
            <MaterialIcons name="calculate" size={24} color="#000000" />
            <Text style={[styles.kpiLabel, { marginTop: 2 }]}>Rate Estimator</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Opportunities ─────────────────────────────────────────────── */}
        {opportunities.length === 0 ? (
          <View style={styles.emptyCard}>
            <MaterialIcons name="merge-type" size={40} color="#CCCCCC" />
            <Text style={styles.emptyTitle}>No Consolidation Opportunities</Text>
            <Text style={styles.emptySub}>
              All trucks are at optimal capacity or no compatible pending shipments found.
            </Text>
            <TouchableOpacity style={styles.refreshBtn} onPress={handleRefresh}>
              <MaterialIcons name="refresh" size={16} color="#FFFFFF" />
              <Text style={styles.refreshBtnText}>Refresh Matches</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.sectionLabelRow}>
              <Text style={styles.sectionLabel}>DYNAMIC LOAD MATCHES</Text>
              <Text style={styles.sectionSub}>{opportunities.length} trucks on your corridors</Text>
            </View>

            {opportunities.slice(0, 4).map(opp => {
              const isMerged = mergedIds[opp.id] ?? false;
              return (
                <View key={opp.id} style={styles.oppCard}>
                  {/* Badge Row */}
                  <View style={styles.oppTopRow}>
                    <View style={styles.recBadge}>
                      <MaterialIcons name="auto-awesome" size={13} color="#109752" />
                      <Text style={styles.recBadgeText}>
                        COST SAVING · ₹{opp.totalPotentialSaving.toLocaleString('en-IN')}
                      </Text>
                    </View>
                    <Text style={styles.highMatchText}>
                      {opp.potentialUtilization > 80 ? 'HIGH MATCH' : 'TOP-UP'}
                    </Text>
                  </View>

                  {/* Route */}
                  <View style={styles.routeHeaderCol}>
                    <Text style={styles.oppTitle}>{opp.truckRegistration} — {opp.availableCapacity}T Available</Text>
                    <View style={styles.truckMetaRow}>
                      <MaterialIcons name="local-shipping" size={14} color="#5D5F5F" />
                      <Text style={styles.truckMetaText}>
                        {opp.truckType} · {opp.availableCapacity}T spare · Match your {opp.compatibleShipments.length} shipment(s)
                      </Text>
                    </View>
                  </View>

                  {/* Capacity Bar */}
                  <View style={styles.capacityBox}>
                    <View style={styles.capacityHeaderRow}>
                      <Text style={styles.capacityTitle}>Utilisation</Text>
                      <Text style={styles.capacityPercentJump}>
                        {opp.currentUtilization}% → {opp.potentialUtilization}%
                      </Text>
                    </View>
                    <View style={styles.capacityTrack}>
                      <View style={[styles.capacityFill, { width: `${opp.potentialUtilization}%` }]} />
                    </View>
                  </View>

                  {/* Metrics Grid */}
                  <View style={styles.threeMetricsGrid}>
                    <View style={styles.metricTile}>
                      <Text style={styles.tileLabel}>You Save</Text>
                      <Text style={styles.tileVal}>₹{(opp.totalPotentialSaving / 1000).toFixed(1)}K</Text>
                      <Text style={styles.tileGreenSub}>vs full truck</Text>
                    </View>
                    <View style={styles.metricTile}>
                      <Text style={styles.tileLabel}>Spare Capacity</Text>
                      <Text style={styles.tileVal}>{opp.availableCapacity}T</Text>
                      <Text style={styles.tileSub}>Available</Text>
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
                      onPress={() => handleApply(opp)}
                      activeOpacity={0.85}
                    >
                      <MaterialIcons name="merge-type" size={17} color="#FFFFFF" />
                      <Text style={styles.primaryActionText}>
                        {isMerged ? 'Booked ✓' : 'Book Space Now'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.secondaryActionBtn}
                      onPress={() => { setSelectedOpportunity(opp); setShowDetails(true); }}
                      activeOpacity={0.85}
                    >
                      <MaterialIcons name="info-outline" size={17} color="#000000" />
                      <Text style={styles.secondaryActionText}>Details</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </>
        )}

        {/* ── Manual Space Finder ──────────────────────────────────────── */}
        <View style={styles.sectionLabelRow}>
          <Text style={styles.sectionLabel}>MANUAL SPACE FINDER</Text>
        </View>

        <View style={styles.finderCard}>
          <Text style={styles.finderCardTitle}>Search specific corridors</Text>
          <Text style={styles.finderCardSub}>
            Find trucks with available capacity on your route.
          </Text>
          <View style={styles.finderRow}>
            <View style={styles.finderField}>
              <Text style={styles.finderLabel}>ORIGIN</Text>
              <TouchableOpacity
                style={styles.finderInput}
                onPress={() => Alert.alert('Origin', 'City selector coming soon.')}
              >
                <MaterialIcons name="place" size={15} color="#5D5F5F" />
                <Text style={styles.finderInputText}>Delhi NCR</Text>
                <MaterialIcons name="expand-more" size={15} color="#5D5F5F" />
              </TouchableOpacity>
            </View>
            <MaterialIcons name="arrow-forward" size={20} color="#000000" />
            <View style={styles.finderField}>
              <Text style={styles.finderLabel}>DESTINATION</Text>
              <TouchableOpacity
                style={styles.finderInput}
                onPress={() => Alert.alert('Destination', 'City selector coming soon.')}
              >
                <MaterialIcons name="place" size={15} color="#5D5F5F" />
                <Text style={styles.finderInputText}>Chandigarh</Text>
                <MaterialIcons name="expand-more" size={15} color="#5D5F5F" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.finderRowSingle}>
            <View style={styles.finderField}>
              <Text style={styles.finderLabel}>WEIGHT (TONNES)</Text>
              <TouchableOpacity
                style={styles.finderInput}
                onPress={() => Alert.alert('Weight', 'Weight selector coming soon.')}
              >
                <Text style={styles.finderInputText}>2.5 T</Text>
                <MaterialIcons name="expand-more" size={15} color="#5D5F5F" />
              </TouchableOpacity>
            </View>
            <View style={styles.finderField}>
              <Text style={styles.finderLabel}>CARGO TYPE</Text>
              <TouchableOpacity
                style={styles.finderInput}
                onPress={() => Alert.alert('Cargo Type', 'Type selector coming soon.')}
              >
                <Text style={styles.finderInputText}>General</Text>
                <MaterialIcons name="expand-more" size={15} color="#5D5F5F" />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={styles.searchBtn}
            onPress={() => Alert.alert(
              'Search Results',
              'Found 3 trucks with 2.5T+ capacity on Delhi–Chandigarh corridor:\n• TRK-004 (4.8T free)\n• TRK-011 (3.2T free)\n• TRK-019 (2.6T free)\nAll cleared for general cargo.',
              [{ text: 'OK' }]
            )}
            activeOpacity={0.85}
          >
            <MaterialIcons name="search" size={18} color="#FFFFFF" />
            <Text style={styles.searchBtnText}>Find Available Trucks</Text>
          </TouchableOpacity>
        </View>

        {/* ── Info: How it Works ───────────────────────────────────────── */}
        <View style={styles.howItWorksCard}>
          <Text style={styles.howItWorksTitle}>HOW CONSOLIDATION WORKS</Text>
          {[
            { icon: 'radar' as const, step: '1', title: 'Continuous Scanning', desc: 'CargoSync monitors all truck capacity on active corridors.' },
            { icon: 'merge-type' as const, step: '2', title: 'Smart Matching', desc: 'AI evaluates route overlap, weight, cargo type and delivery windows.' },
            { icon: 'trending-up' as const, step: '3', title: 'Cost Optimisation', desc: 'Calculates savings, ETA impact, and utilisation gain for each match.' },
            { icon: 'check-circle' as const, step: '4', title: 'One-Tap Booking', desc: 'You confirm; driver gets updated manifest instantly.' },
          ].map((item, i) => (
            <View key={i} style={styles.howStep}>
              <View style={styles.howStepLeft}>
                <View style={styles.stepNumCircle}>
                  <Text style={styles.stepNumText}>{item.step}</Text>
                </View>
                {i < 3 && <View style={styles.stepLine} />}
              </View>
              <View style={styles.howStepContent}>
                <Text style={styles.howStepTitle}>{item.title}</Text>
                <Text style={styles.howStepDesc}>{item.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Details Modal */}
      {showDetails && selectedOpportunity && (
        <TouchableWithoutFeedback
          onPress={() => { setShowDetails(false); setSelectedOpportunity(null); }}
        >
          <OptimizationModal
            opportunity={selectedOpportunity}
            onClose={() => { setShowDetails(false); setSelectedOpportunity(null); }}
            onApply={(id: string) => {
              const opp = opportunities.find(o => o.id === id);
              if (opp) handleApply(opp);
            }}
          />
        </TouchableWithoutFeedback>
      )}

      {/* Rate Estimator Modal */}
      <RateEstimatorModal
        visible={isRateEstimatorOpen}
        onClose={() => setIsRateEstimatorOpen(false)}
      />
    </SafeAreaView>
  );
}

// ─── STYLES ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F3F3',
  },
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
  roleDropdown: { flexDirection: 'row', alignItems: 'center', gap: 2 },
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
  langBtnText: { fontFamily: FontFamily.semiBold, fontSize: 11, color: '#5D5F5F' },
  langBtnTextActive: { color: '#FFFFFF' },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },

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
  pulseDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#109752' },
  liveStripTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: '#000000',
    letterSpacing: 0.5,
  },
  liveStripTime: { fontFamily: FontFamily.regular, fontSize: 10, color: '#5D5F5F' },

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

  scrollContent: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: 14,
    paddingBottom: 100,
    gap: 12,
  },

  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionLabel: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: '#5D5F5F',
    letterSpacing: 0.6,
  },
  sectionSub: {
    fontFamily: FontFamily.regular,
    fontSize: 10,
    color: '#5D5F5F',
  },

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
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#000000',
    borderRadius: Radius.xs,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 4,
  },
  refreshBtnText: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
    color: '#FFFFFF',
  },

  // Opportunity Card
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
  truckMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  truckMetaText: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#5D5F5F',
    flex: 1,
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
  threeMetricsGrid: { flexDirection: 'row', gap: 6 },
  metricTile: {
    flex: 1,
    backgroundColor: '#F4F3F3',
    padding: 8,
    borderRadius: Radius.xs,
    gap: 1,
  },
  tileLabel: { fontFamily: FontFamily.regular, fontSize: 10, color: '#5D5F5F' },
  tileVal: { fontFamily: FontFamily.bold, fontSize: 14, color: '#000000' },
  tileSub: { fontFamily: FontFamily.regular, fontSize: 9, color: '#5D5F5F' },
  tileGreenSub: { fontFamily: FontFamily.semiBold, fontSize: 9, color: '#109752' },
  cardActionsRow: { flexDirection: 'row', gap: 8, marginTop: 2 },
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

  // Manual Space Finder
  finderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: 10,
    ...Shadows.tier1,
  },
  finderCardTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: '#000000',
  },
  finderCardSub: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: '#5D5F5F',
    marginBottom: 2,
  },
  finderRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  finderRowSingle: {
    flexDirection: 'row',
    gap: 10,
  },
  finderField: { flex: 1, gap: 4 },
  finderLabel: {
    fontFamily: FontFamily.bold,
    fontSize: 9,
    color: '#5D5F5F',
    letterSpacing: 0.5,
  },
  finderInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F4F3F3',
    borderRadius: Radius.xs,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  finderInputText: {
    flex: 1,
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: '#000000',
  },
  searchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 44,
    backgroundColor: '#000000',
    borderRadius: Radius.xs,
    marginTop: 4,
  },
  searchBtnText: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: '#FFFFFF',
  },

  // How it Works
  howItWorksCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: 0,
    ...Shadows.tier1,
    marginBottom: 4,
  },
  howItWorksTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: '#5D5F5F',
    letterSpacing: 0.6,
    marginBottom: 14,
  },
  howStep: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 2,
  },
  howStepLeft: {
    alignItems: 'center',
    width: 24,
  },
  stepNumCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: '#FFFFFF',
  },
  stepLine: {
    flex: 1,
    width: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 4,
    minHeight: 24,
  },
  howStepContent: {
    flex: 1,
    paddingBottom: 16,
  },
  howStepTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: '#000000',
    marginBottom: 2,
  },
  howStepDesc: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#5D5F5F',
    lineHeight: 16,
  },
});
