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
import { reoptimizeTrip } from '../services/consolidationEngine';
import { mockTrips, mockTrucks, mockShipments } from '../data/mockData';

export interface ActiveDisruptionEvent {
  id: string;
  type: string;
  title: string;
  description: string;
  truckId: string;
  truckReg: string;
  severity: 'critical' | 'high' | 'medium';
  impactText: string;
  reoptimizedPlan: {
    rescueEntity: string;
    costDelta: number;
    timeDeltaMins: number;
    actionSteps: string[];
  };
}

interface DisruptionSimulatorModalProps {
  visible: boolean;
  onClose: () => void;
  onTriggerDisruption: (event: ActiveDisruptionEvent) => void;
}

export default function DisruptionSimulatorModal({
  visible,
  onClose,
  onTriggerDisruption,
}: DisruptionSimulatorModalProps) {
  const { theme } = useTheme();
  const [selectedType, setSelectedType] = useState<string>('truck_breakdown');

  const disruptionScenarios = [
    {
      id: 'truck_breakdown',
      title: 'Truck Mechanical Breakdown',
      icon: 'construct-outline',
      severity: 'critical' as const,
      truckId: 'TRK-27',
      truckReg: 'DL-01-AX-2745',
      corridor: 'NH-44 Panipat KM 142',
      impact: '2.4T cargo stranded • Direct delay risk +90 mins',
      solutionSummary: 'Auto-cross-dock payload to nearby carrier TRK-14 (Eicher 3019)',
      savings: 2800,
      timeSaved: 40,
      steps: [
        'Divert nearby available vehicle TRK-14 to highway breakdown site',
        'Cross-dock 2.4T industrial pallet manifest in 18 minutes',
        'Re-calculate delivery ETA with zero consignee penalty',
      ],
    },
    {
      id: 'route_blocked',
      title: 'Toll Corridor Heavy Bottleneck',
      icon: 'alert-circle-outline',
      severity: 'high' as const,
      truckId: 'TRK-33',
      truckReg: 'RJ-14-FG-3301',
      corridor: 'NH-48 Jaipur Highway Toll Plaza',
      impact: '4-km traffic queue • Projected +55 mins delay',
      solutionSummary: 'Dynamic reroute via Western Bypass Expressway',
      savings: 2200,
      timeSaved: 45,
      steps: [
        'Reroute GPS turn-by-turn navigation via Bypass Exit 14',
        'Shave 45 minutes off highway bottleneck queue',
        'Maintain 98% on-time delivery SLA',
      ],
    },
    {
      id: 'shipment_cancellation',
      title: 'Mid-Transit Consignment Cancelled',
      icon: 'close-circle-outline',
      severity: 'medium' as const,
      truckId: 'TRK-14',
      truckReg: 'HR-26-BC-1488',
      corridor: 'NH-27 Lucknow Corridor',
      impact: '1.5T capacity suddenly unassigned • Risk of empty backhaul',
      solutionSummary: 'Instant match with return-load consignment CS-409',
      savings: 4500,
      timeSaved: 20,
      steps: [
        'Release 1.5T locked capacity in CargoSync cloud ledger',
        'Auto-bind pending backhaul load CS-409 at Neemrana Hub',
        'Eliminate deadhead miles; boost trip margin by +24%',
      ],
    },
    {
      id: 'deadline_acceleration',
      title: 'Perishable Deadline Expedited',
      icon: 'flash-outline',
      severity: 'high' as const,
      truckId: 'TRK-41',
      truckReg: 'KA-01-HI-4122',
      corridor: 'Peenya Industrial Corridor Bangalore',
      impact: 'Consignee advanced required arrival by 2 hours',
      solutionSummary: 'Re-sequence multi-stop itinerary to prioritize drop #1',
      savings: 1500,
      timeSaved: 65,
      steps: [
        'Move Stop #3 (Cold-chain pharma) to immediate next drop',
        'Push updated drop manifest to driver GPS console',
        'Prevent perishable temperature loss compliance penalty',
      ],
    },
  ];

  const handleSelectAndTrigger = (sc: typeof disruptionScenarios[0]) => {
    // Run consolidation engine reoptimization
    const trip = mockTrips[0];
    const reopt = reoptimizeTrip(trip, sc.id, mockTrucks, mockShipments);

    const event: ActiveDisruptionEvent = {
      id: 'DISR-' + Date.now().toString().slice(-4),
      type: sc.id,
      title: sc.title,
      description: `${sc.truckReg} disrupted along ${sc.corridor}. ${sc.impact}`,
      truckId: sc.truckId,
      truckReg: sc.truckReg,
      severity: sc.severity,
      impactText: sc.impact,
      reoptimizedPlan: {
        rescueEntity: sc.solutionSummary,
        costDelta: sc.savings,
        timeDeltaMins: sc.timeSaved,
        actionSteps: sc.steps,
      },
    };

    onClose();
    onTriggerDisruption(event);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[styles.card, { backgroundColor: theme.colors.cardBackground }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.headerLeft}>
              <View style={[styles.iconBox, { backgroundColor: theme.colors.errorLight }]}>
                <Ionicons name="warning" size={20} color={theme.colors.error} />
              </View>
              <View>
                <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
                  Live Disruption Simulator
                </Text>
                <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                  Inject highway events to evaluate real-time re-optimization
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} contentContainerStyle={{ padding: 16 }}>
            <Text style={[styles.introText, { color: theme.colors.textSecondary }]}>
              Select an operational disruption below to test CargoSync's core USP: continuous real-time journey re-optimization.
            </Text>

            {disruptionScenarios.map((sc) => {
              const severityColor =
                sc.severity === 'critical'
                  ? theme.colors.error
                  : sc.severity === 'high'
                  ? theme.colors.warning
                  : theme.colors.primary;

              return (
                <TouchableOpacity
                  key={sc.id}
                  style={[
                    styles.scenarioCard,
                    {
                      backgroundColor: theme.colors.background,
                      borderColor: theme.colors.border,
                    },
                  ]}
                  onPress={() => handleSelectAndTrigger(sc)}
                  activeOpacity={0.8}
                >
                  <View style={styles.scHeader}>
                    <View style={[styles.scIcon, { backgroundColor: severityColor + '18' }]}>
                      <Ionicons name={sc.icon as any} size={20} color={severityColor} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={styles.badgeRow}>
                        <Text style={[styles.scTitle, { color: theme.colors.textPrimary }]}>
                          {sc.title}
                        </Text>
                        <View style={[styles.sevBadge, { backgroundColor: severityColor + '20' }]}>
                          <Text style={[styles.sevText, { color: severityColor }]}>
                            {sc.severity.toUpperCase()}
                          </Text>
                        </View>
                      </View>
                      <Text style={[styles.scVehicle, { color: theme.colors.textSecondary }]}>
                        Vehicle: {sc.truckReg} • {sc.corridor}
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.impactBox, { borderLeftColor: severityColor }]}>
                    <Text style={[styles.impactText, { color: theme.colors.textPrimary }]}>
                      ⚠️ {sc.impact}
                    </Text>
                  </View>

                  <View style={styles.solutionRow}>
                    <Ionicons name="sparkles" size={14} color={theme.colors.success} />
                    <Text style={[styles.solutionText, { color: theme.colors.success }]}>
                      AI Solution: {sc.solutionSummary}
                    </Text>
                  </View>

                  <View style={[styles.triggerBtn, { backgroundColor: severityColor }]}>
                    <Ionicons name="play-outline" size={16} color="#FFFFFF" />
                    <Text style={styles.triggerBtnText}>Simulate & Re-Optimize Now</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
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
  body: {
    flex: 1,
  },
  introText: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 14,
  },
  scenarioCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
  },
  scHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  scIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scTitle: {
    fontSize: 14,
    fontWeight: '800',
    flex: 1,
  },
  sevBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  sevText: {
    fontSize: 9,
    fontWeight: '800',
  },
  scVehicle: {
    fontSize: 11,
    marginTop: 2,
  },
  impactBox: {
    borderLeftWidth: 3,
    paddingLeft: 8,
    paddingVertical: 4,
    marginTop: 10,
  },
  impactText: {
    fontSize: 11,
    fontWeight: '600',
  },
  solutionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  solutionText: {
    fontSize: 11,
    fontWeight: '700',
    flex: 1,
  },
  triggerBtn: {
    height: 38,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
  },
  triggerBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
