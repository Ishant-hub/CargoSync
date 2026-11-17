import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { mockFleetStats } from '../data/mockData';

interface AnalyticsModalProps {
  visible: boolean;
  onClose: () => void;
  role?: 'shipper' | 'driver' | 'fleet_ops';
}

export default function AnalyticsModal({
  visible,
  onClose,
  role = 'fleet_ops',
}: AnalyticsModalProps) {
  const { theme } = useTheme();
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | 'quarter'>('30d');

  // Multiplier for timeframe
  const factor = timeframe === '7d' ? 0.25 : timeframe === 'quarter' ? 3.0 : 1.0;

  const costSaved = Math.round(184500 * factor);
  const shipmentsConsolidated = Math.round(148 * factor);
  const emptyTripsAvoided = Math.round(38 * factor);
  const distanceSavedKm = Math.round(14200 * factor);
  const co2SavedKg = Math.round(distanceSavedKm * 0.85);
  const fleetUtilization = 84.6;
  const onTimeDeliveryRate = 96.4;
  const avgDelayMins = 14;
  const returnLoadUtilization = 72.8;

  const corridorData = [
    { corridor: 'Delhi → Jaipur (NH48)', savings: Math.round(62000 * factor), pooled: Math.round(52 * factor), util: '88%' },
    { corridor: 'Delhi → Chandigarh (NH44)', savings: Math.round(48500 * factor), pooled: Math.round(38 * factor), util: '85%' },
    { corridor: 'Mumbai → Pune Expressway', savings: Math.round(44000 * factor), pooled: Math.round(34 * factor), util: '82%' },
    { corridor: 'Bangalore → Chennai Corridor', savings: Math.round(30000 * factor), pooled: Math.round(24 * factor), util: '79%' },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[styles.card, { backgroundColor: theme.colors.cardBackground }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.headerLeft}>
              <View style={[styles.iconBox, { backgroundColor: theme.colors.primaryLight }]}>
                <Ionicons name="bar-chart-outline" size={20} color={theme.colors.primary} />
              </View>
              <View>
                <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
                  Logistics & Yield Analytics
                </Text>
                <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                  Network consolidation impact & cost savings
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Timeframe Selector Chips */}
          <View style={[styles.timeframeRow, { borderBottomColor: theme.colors.border }]}>
            {(['7d', '30d', 'quarter'] as const).map((t) => {
              const isSelected = timeframe === t;
              const label = t === '7d' ? 'Last 7 Days' : t === '30d' ? 'Last 30 Days' : 'This Quarter';
              return (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.timeChip,
                    {
                      backgroundColor: isSelected ? theme.colors.primary : theme.colors.background,
                      borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                    },
                  ]}
                  onPress={() => setTimeframe(t)}
                >
                  <Text style={[styles.timeChipText, { color: isSelected ? '#FFFFFF' : theme.colors.textPrimary }]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <ScrollView style={styles.body} contentContainerStyle={{ padding: 16 }}>
            {/* Top Highlight Banner */}
            <View style={[styles.banner, { backgroundColor: theme.colors.successLight, borderColor: theme.colors.success }]}>
              <View style={styles.bannerRow}>
                <Ionicons name="wallet-outline" size={28} color={theme.colors.success} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.bannerLabel, { color: theme.colors.success }]}>TOTAL CONSOLIDATION SAVINGS</Text>
                  <Text style={[styles.bannerVal, { color: theme.colors.success }]}>
                    ₹{costSaved.toLocaleString('en-IN')}
                  </Text>
                </View>
                <View style={[styles.growthChip, { backgroundColor: theme.colors.cardBackground }]}>
                  <Text style={[styles.growthText, { color: theme.colors.success }]}>+24.8% YoY</Text>
                </View>
              </View>
            </View>

            {/* Core Metrics Grid */}
            <Text style={[styles.sectionHeading, { color: theme.colors.textPrimary }]}>
              Network Efficiency KPIs
            </Text>
            <View style={styles.metricsGrid}>
              <View style={[styles.metricCard, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
                <View style={styles.metricCardHeader}>
                  <Ionicons name="speedometer-outline" size={16} color={theme.colors.primary} />
                  <Text style={[styles.metricTitle, { color: theme.colors.textSecondary }]}>Fleet Utilization</Text>
                </View>
                <Text style={[styles.metricValue, { color: theme.colors.textPrimary }]}>{fleetUtilization}%</Text>
                <Text style={[styles.metricSub, { color: theme.colors.success }]}>+14.2% vs baseline</Text>
              </View>

              <View style={[styles.metricCard, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
                <View style={styles.metricCardHeader}>
                  <Ionicons name="cube-outline" size={16} color={theme.colors.accent} />
                  <Text style={[styles.metricTitle, { color: theme.colors.textSecondary }]}>Consolidated</Text>
                </View>
                <Text style={[styles.metricValue, { color: theme.colors.textPrimary }]}>{shipmentsConsolidated}</Text>
                <Text style={[styles.metricSub, { color: theme.colors.textSecondary }]}>Shipments pooled</Text>
              </View>

              <View style={[styles.metricCard, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
                <View style={styles.metricCardHeader}>
                  <Ionicons name="arrow-undo-outline" size={16} color={theme.colors.success} />
                  <Text style={[styles.metricTitle, { color: theme.colors.textSecondary }]}>Empty Trips Avoided</Text>
                </View>
                <Text style={[styles.metricValue, { color: theme.colors.textPrimary }]}>{emptyTripsAvoided}</Text>
                <Text style={[styles.metricSub, { color: theme.colors.success }]}>Deadheads eliminated</Text>
              </View>

              <View style={[styles.metricCard, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
                <View style={styles.metricCardHeader}>
                  <Ionicons name="checkmark-done-circle-outline" size={16} color={theme.colors.info} />
                  <Text style={[styles.metricTitle, { color: theme.colors.textSecondary }]}>On-Time Rate</Text>
                </View>
                <Text style={[styles.metricValue, { color: theme.colors.textPrimary }]}>{onTimeDeliveryRate}%</Text>
                <Text style={[styles.metricSub, { color: theme.colors.textSecondary }]}>Avg delay: {avgDelayMins}m</Text>
              </View>

              <View style={[styles.metricCard, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
                <View style={styles.metricCardHeader}>
                  <Ionicons name="trail-sign-outline" size={16} color={theme.colors.primary} />
                  <Text style={[styles.metricTitle, { color: theme.colors.textSecondary }]}>Distance Saved</Text>
                </View>
                <Text style={[styles.metricValue, { color: theme.colors.textPrimary }]}>
                  {distanceSavedKm.toLocaleString('en-IN')} km
                </Text>
                <Text style={[styles.metricSub, { color: theme.colors.success }]}>{co2SavedKg.toLocaleString('en-IN')} kg CO₂ saved</Text>
              </View>

              <View style={[styles.metricCard, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
                <View style={styles.metricCardHeader}>
                  <Ionicons name="repeat-outline" size={16} color={theme.colors.warning} />
                  <Text style={[styles.metricTitle, { color: theme.colors.textSecondary }]}>Return-Load Match</Text>
                </View>
                <Text style={[styles.metricValue, { color: theme.colors.textPrimary }]}>{returnLoadUtilization}%</Text>
                <Text style={[styles.metricSub, { color: theme.colors.textSecondary }]}>Backhaul capture</Text>
              </View>
            </View>

            {/* Corridor Breakdown Table */}
            <Text style={[styles.sectionHeading, { color: theme.colors.textPrimary, marginTop: 18 }]}>
              High-Yield Freight Corridors
            </Text>
            <View style={[styles.corridorTable, { borderColor: theme.colors.border }]}>
              {corridorData.map((item, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.corridorRow,
                    {
                      borderTopColor: theme.colors.border,
                      borderTopWidth: idx > 0 ? 1 : 0,
                    },
                  ]}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.corridorName, { color: theme.colors.textPrimary }]}>
                      {item.corridor}
                    </Text>
                    <Text style={[styles.corridorDetail, { color: theme.colors.textSecondary }]}>
                      {item.pooled} loads pooled • {item.util} avg utilization
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[styles.corridorSaving, { color: theme.colors.success }]}>
                      ₹{item.savings.toLocaleString('en-IN')}
                    </Text>
                    <Text style={[styles.corridorSub, { color: theme.colors.textTertiary }]}>saved</Text>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>
            <TouchableOpacity
              style={[styles.doneBtn, { backgroundColor: theme.colors.primary }]}
              onPress={onClose}
            >
              <Text style={styles.doneBtnText}>Close Analytics</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
  },
  card: {
    width: '100%',
    maxHeight: '90%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  timeframeRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: 1,
  },
  timeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  timeChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  body: {
    flex: 1,
  },
  banner: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bannerLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  bannerVal: {
    fontSize: 22,
    fontWeight: '900',
    marginTop: 2,
  },
  growthChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  growthText: {
    fontSize: 11,
    fontWeight: '800',
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metricCard: {
    width: '48.5%',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  metricCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  metricTitle: {
    fontSize: 11,
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 17,
    fontWeight: '800',
  },
  metricSub: {
    fontSize: 10,
    marginTop: 2,
    fontWeight: '500',
  },
  corridorTable: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  corridorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  corridorName: {
    fontSize: 13,
    fontWeight: '700',
  },
  corridorDetail: {
    fontSize: 11,
    marginTop: 2,
  },
  corridorSaving: {
    fontSize: 14,
    fontWeight: '800',
  },
  corridorSub: {
    fontSize: 10,
  },
  footer: {
    padding: 14,
    borderTopWidth: 1,
  },
  doneBtn: {
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
