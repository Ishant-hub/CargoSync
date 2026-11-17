import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';
import {
  runWhatIfSimulation,
  SimulationScenario,
  SimulationResult,
} from '../../services/whatIfSimulator';
import OptimizationCard from '../../components/OptimizationCard';
import { mockOptimizationOpportunities } from '../../data/mockData';

export default function OptimizerScreen() {
  const { theme } = useTheme();
  const [selectedScenario, setSelectedScenario] = useState<SimulationScenario>('truck_breakdown');
  const [simulationResult, setSimulationResult] = useState<SimulationResult>(
    runWhatIfSimulation('truck_breakdown')
  );

  const handleSelectScenario = (scenario: SimulationScenario) => {
    setSelectedScenario(scenario);
    setSimulationResult(runWhatIfSimulation(scenario));
  };

  const handleApplyPlan = () => {
    Alert.alert(
      'Re-Optimized Plan Applied!',
      `Successfully dispatched updated routing protocol for ${simulationResult.scenarioTitle}.\n\n• Net Cost Savings: ₹${simulationResult.deltas.costSaved.toLocaleString()}\n• Fleet Utilization Gain: +${simulationResult.deltas.utilizationGainPercent}%\n• Driver & Dispatch notified.`,
      [{ text: 'OK' }]
    );
  };

  const scenarios: { key: SimulationScenario; label: string; icon: string }[] = [
    { key: 'truck_breakdown', label: 'Truck Breakdown', icon: 'construct-outline' },
    { key: 'shipment_cancellation', label: 'Cancellation', icon: 'close-circle-outline' },
    { key: 'deadline_acceleration', label: 'Deadline Acceleration', icon: 'flash-outline' },
    { key: 'express_load_insertion', label: 'Express Partial Load', icon: 'add-circle-outline' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.topHeader, { backgroundColor: theme.colors.cardBackground, borderBottomColor: theme.colors.border }]}>
        <View>
          <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>AI Re-Optimizer Hub</Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
            Continuous freight dynamic re-balancing & what-if simulator
          </Text>
        </View>

        <View style={[styles.sparkleBadge, { backgroundColor: theme.colors.primaryLight }]}>
          <Ionicons name="sparkles" size={18} color={theme.colors.primary} />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16 }}>
        {/* Scenario Selector Chips */}
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary, marginBottom: 8 }]}>
          Select What-If Scenario
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
          {scenarios.map((sc) => {
            const isSelected = selectedScenario === sc.key;
            return (
              <TouchableOpacity
                key={sc.key}
                style={[
                  styles.scenarioChip,
                  {
                    backgroundColor: isSelected ? theme.colors.primary : theme.colors.cardBackground,
                    borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                  },
                ]}
                onPress={() => handleSelectScenario(sc.key)}
              >
                <Ionicons
                  name={sc.icon as any}
                  size={16}
                  color={isSelected ? '#FFFFFF' : theme.colors.primary}
                />
                <Text style={[styles.scenarioChipText, { color: isSelected ? '#FFFFFF' : theme.colors.textPrimary }]}>
                  {sc.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Simulation Card */}
        <View style={[styles.simCard, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border }]}>
          {/* Header */}
          <View style={styles.simCardHeader}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.simTitle, { color: theme.colors.textPrimary }]}>
                {simulationResult.scenarioTitle}
              </Text>
              <Text style={[styles.simDesc, { color: theme.colors.textSecondary }]}>
                {simulationResult.scenarioDescription}
              </Text>
            </View>
            <View style={[styles.badge, { backgroundColor: theme.colors.successLight }]}>
              <Text style={[styles.badgeText, { color: theme.colors.success }]}>
                {simulationResult.summaryBadge}
              </Text>
            </View>
          </View>

          {/* Key Impact Deltas */}
          <View style={[styles.deltasGrid, { backgroundColor: theme.colors.background }]}>
            <View style={styles.deltaItem}>
              <Text style={[styles.deltaVal, { color: theme.colors.success }]}>
                ₹{simulationResult.deltas.costSaved.toLocaleString()}
              </Text>
              <Text style={[styles.deltaLbl, { color: theme.colors.textSecondary }]}>Cost Saved</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            <View style={styles.deltaItem}>
              <Text style={[styles.deltaVal, { color: theme.colors.primary }]}>
                +{simulationResult.deltas.utilizationGainPercent}%
              </Text>
              <Text style={[styles.deltaLbl, { color: theme.colors.textSecondary }]}>Capacity Gain</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            <View style={styles.deltaItem}>
              <Text style={[styles.deltaVal, { color: theme.colors.textPrimary }]}>
                {simulationResult.deltas.timeSavedMins} mins
              </Text>
              <Text style={[styles.deltaLbl, { color: theme.colors.textSecondary }]}>Time Saved</Text>
            </View>
          </View>

          {/* Before vs After Comparison */}
          <Text style={[styles.subHeading, { color: theme.colors.textPrimary }]}>Plan Comparison</Text>
          <View style={[styles.compTable, { borderColor: theme.colors.border }]}>
            <View style={[styles.compHeaderRow, { backgroundColor: theme.colors.background }]}>
              <Text style={[styles.compColLabel, { color: theme.colors.textSecondary }]}>Metric</Text>
              <Text style={[styles.compColLabel, { color: theme.colors.textSecondary }]}>Original Plan</Text>
              <Text style={[styles.compColLabel, { color: theme.colors.primary }]}>Re-Optimized</Text>
            </View>

            <View style={styles.compRow}>
              <Text style={[styles.compCellMetric, { color: theme.colors.textPrimary }]}>Distance</Text>
              <Text style={[styles.compCellVal, { color: theme.colors.textSecondary }]}>
                {simulationResult.beforePlan.totalDistanceKm} km
              </Text>
              <Text style={[styles.compCellVal, { color: theme.colors.success, fontWeight: '700' }]}>
                {simulationResult.afterPlan.totalDistanceKm} km
              </Text>
            </View>

            <View style={styles.compRow}>
              <Text style={[styles.compCellMetric, { color: theme.colors.textPrimary }]}>Trip Cost</Text>
              <Text style={[styles.compCellVal, { color: theme.colors.textSecondary }]}>
                ₹{simulationResult.beforePlan.totalCostRupees.toLocaleString()}
              </Text>
              <Text style={[styles.compCellVal, { color: theme.colors.success, fontWeight: '700' }]}>
                ₹{simulationResult.afterPlan.totalCostRupees.toLocaleString()}
              </Text>
            </View>

            <View style={styles.compRow}>
              <Text style={[styles.compCellMetric, { color: theme.colors.textPrimary }]}>Utilization</Text>
              <Text style={[styles.compCellVal, { color: theme.colors.textSecondary }]}>
                {simulationResult.beforePlan.fleetUtilizationPercent}%
              </Text>
              <Text style={[styles.compCellVal, { color: theme.colors.primary, fontWeight: '700' }]}>
                {simulationResult.afterPlan.fleetUtilizationPercent}%
              </Text>
            </View>

            <View style={styles.compRow}>
              <Text style={[styles.compCellMetric, { color: theme.colors.textPrimary }]}>On-Time Score</Text>
              <Text style={[styles.compCellVal, { color: theme.colors.textSecondary }]}>
                {simulationResult.beforePlan.onTimeDeliveryRate}%
              </Text>
              <Text style={[styles.compCellVal, { color: theme.colors.success, fontWeight: '700' }]}>
                {simulationResult.afterPlan.onTimeDeliveryRate}%
              </Text>
            </View>
          </View>

          {/* Recommended Steps */}
          <Text style={[styles.subHeading, { color: theme.colors.textPrimary, marginTop: 16 }]}>
            Automated Protocol Steps
          </Text>
          {simulationResult.recommendedSteps.map((step) => (
            <View key={step.stepNumber} style={styles.stepRow}>
              <View style={[styles.stepNum, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.stepNumText}>{step.stepNumber}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.stepAction, { color: theme.colors.textPrimary }]}>
                  {step.action} — <Text style={{ color: theme.colors.primary }}>{step.targetEntity}</Text>
                </Text>
                <Text style={[styles.stepDetail, { color: theme.colors.textSecondary }]}>
                  {step.detail}
                </Text>
              </View>
            </View>
          ))}

          {/* Execute Button */}
          <TouchableOpacity
            style={[styles.applyBtn, { backgroundColor: theme.colors.primary }]}
            onPress={handleApplyPlan}
            activeOpacity={0.85}
          >
            <Ionicons name="checkmark-done-circle-outline" size={20} color="#FFFFFF" />
            <Text style={styles.applyBtnText}>Apply & Dispatch Re-Optimized Plan</Text>
          </TouchableOpacity>
        </View>

        {/* Live Network Opportunities Section */}
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary, marginTop: 24, marginBottom: 12 }]}>
          Live Network Consolidation Opportunities
        </Text>
        {mockOptimizationOpportunities.map((opp) => (
          <OptimizationCard
            key={opp.id}
            opportunity={opp}
            onReview={() =>
              Alert.alert(
                'Consolidation Match',
                `Consolidating ${opp.compatibleShipments.length} packages on ${opp.truckRegistration} will save ₹${opp.totalPotentialSaving.toLocaleString()}!`
              )
            }
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  sparkleBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  scenarioChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  scenarioChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  simCard: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
  },
  simCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 14,
  },
  simTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  simDesc: {
    fontSize: 12,
    marginTop: 4,
    lineHeight: 18,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  deltasGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  deltaItem: {
    alignItems: 'center',
  },
  deltaVal: {
    fontSize: 16,
    fontWeight: '800',
  },
  deltaLbl: {
    fontSize: 11,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 24,
  },
  subHeading: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
  },
  compTable: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  compHeaderRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  compColLabel: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
  },
  compRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  compCellMetric: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
  },
  compCellVal: {
    flex: 1,
    fontSize: 12,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  stepNum: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepNumText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  stepAction: {
    fontSize: 13,
    fontWeight: '700',
  },
  stepDetail: {
    fontSize: 11,
    marginTop: 2,
  },
  applyBtn: {
    height: 48,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
