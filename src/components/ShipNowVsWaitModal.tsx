import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { Shipment, Truck } from '../types';
import { mockTrucks } from '../data/mockData';

interface ShipNowVsWaitModalProps {
  visible: boolean;
  onClose: () => void;
  shipment: Shipment | null;
  onSelectOption?: (choice: 'ship_now' | 'wait_consolidate') => void;
}

export default function ShipNowVsWaitModal({
  visible,
  onClose,
  shipment,
  onSelectOption,
}: ShipNowVsWaitModalProps) {
  const { theme } = useTheme();

  if (!shipment) return null;

  // Real logistics calculations based on the shipment
  const weightKg = shipment.weight >= 1000 ? shipment.weight : shipment.weight * 1000;
  const weightTonnes = (weightKg / 1000);
  
  // Dedicated immediate dispatch values
  const dedicatedCost = Math.round(shipment.cost || 7500);
  const now = new Date();
  const immediateDispatchEta = new Date(now.getTime() + 5.5 * 3600 * 1000);
  const deadlineDate = new Date(shipment.deliveryDeadline || now.getTime() + 12 * 3600 * 1000);

  // Consolidated option values (Wait for compatible passing truck)
  const waitHours = 2.5; // average wait time for next consolidated truck
  const consolidatedCost = Math.round(dedicatedCost * 0.68); // 32% saving
  const costSavings = dedicatedCost - consolidatedCost;
  const consolidatedEta = new Date(now.getTime() + (5.5 + waitHours) * 3600 * 1000);

  // Check deadline risk
  const isCloseToDeadline = consolidatedEta.getTime() > (deadlineDate.getTime() - 1.5 * 3600 * 1000);
  const deadlineRisk: 'Low' | 'Medium' | 'High' = isCloseToDeadline ? 'High' : (waitHours > 4 ? 'Medium' : 'Low');

  // AI Recommendation logic based on priority and deadline
  const recommendWait = shipment.priority !== 'urgent' && deadlineRisk !== 'High';

  const formatTime = (d: Date) => {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleChoose = (choice: 'ship_now' | 'wait_consolidate') => {
    onClose();
    if (onSelectOption) {
      onSelectOption(choice);
    } else {
      if (choice === 'wait_consolidate') {
        Alert.alert(
          'Consolidation Window Reserved ✓',
          `Your ${weightTonnes.toFixed(1)}T shipment has been queued for TRK-27 arriving in ~2.5 hrs.\nSaved ₹${costSavings.toLocaleString('en-IN')} on freight cost!`
        );
      } else {
        Alert.alert(
          'Dedicated Truck Dispatched 🚛',
          `Direct dispatch initiated. Pickup truck arriving within 30 minutes for urgent direct transit.`
        );
      }
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[styles.card, { backgroundColor: theme.colors.cardBackground }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.headerLeft}>
              <View style={[styles.iconBox, { backgroundColor: theme.colors.primaryLight }]}>
                <Ionicons name="git-compare-outline" size={20} color={theme.colors.primary} />
              </View>
              <View>
                <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
                  Ship Now vs. Wait Optimizer
                </Text>
                <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                  Waybill #{shipment.trackingNumber || shipment.id} • {weightTonnes.toFixed(1)}T
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} contentContainerStyle={{ padding: 18 }}>
            {/* AI Recommendation Banner */}
            <View
              style={[
                styles.recBanner,
                {
                  backgroundColor: recommendWait ? theme.colors.successLight : theme.colors.warningLight,
                  borderColor: recommendWait ? theme.colors.success : theme.colors.warning,
                },
              ]}
            >
              <Ionicons
                name={recommendWait ? 'sparkles' : 'flash-outline'}
                size={20}
                color={recommendWait ? theme.colors.success : theme.colors.warning}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.recBannerTitle,
                    { color: recommendWait ? theme.colors.success : theme.colors.warning },
                  ]}
                >
                  {recommendWait
                    ? `RECOMMENDATION: WAIT & CONSOLIDATE (Save ₹${costSavings.toLocaleString('en-IN')})`
                    : 'RECOMMENDATION: SHIP NOW (Tight Delivery Deadline)'}
                </Text>
                <Text style={[styles.recBannerDesc, { color: theme.colors.textPrimary }]}>
                  {recommendWait
                    ? `Waiting 2.5 hrs for passing vehicle TRK-27 saves 32% with safe buffer before ${formatTime(deadlineDate)} deadline.`
                    : `Immediate dedicated dispatch guarantees arrival by ${formatTime(immediateDispatchEta)} with zero risk of penalty.`}
                </Text>
              </View>
            </View>

            {/* Side-by-Side Comparison Cards */}
            <View style={styles.comparisonGrid}>
              {/* Option A: Ship Now (Dedicated) */}
              <View
                style={[
                  styles.optionBox,
                  {
                    backgroundColor: theme.colors.background,
                    borderColor: !recommendWait ? theme.colors.primary : theme.colors.border,
                    borderWidth: !recommendWait ? 2 : 1,
                  },
                ]}
              >
                <View style={styles.optionHeader}>
                  <Text style={[styles.optionTag, { color: theme.colors.textSecondary }]}>OPTION A</Text>
                  <Text style={[styles.optionTitle, { color: theme.colors.textPrimary }]}>Ship Now</Text>
                  <Text style={[styles.optionSub, { color: theme.colors.textTertiary }]}>Dedicated Mini-Truck</Text>
                </View>

                <View style={styles.metricItem}>
                  <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>Freight Cost</Text>
                  <Text style={[styles.metricVal, { color: theme.colors.textPrimary }]}>
                    ₹{dedicatedCost.toLocaleString('en-IN')}
                  </Text>
                </View>

                <View style={styles.metricItem}>
                  <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>Expected ETA</Text>
                  <Text style={[styles.metricVal, { color: theme.colors.textPrimary }]}>
                    {formatTime(immediateDispatchEta)}
                  </Text>
                </View>

                <View style={styles.metricItem}>
                  <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>Wait Time</Text>
                  <Text style={[styles.metricVal, { color: theme.colors.success }]}>
                    0 min (Immediate)
                  </Text>
                </View>

                <View style={styles.metricItem}>
                  <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>Truck Utilization</Text>
                  <Text style={[styles.metricVal, { color: theme.colors.warning }]}>
                    32% (Low)
                  </Text>
                </View>

                <View style={styles.metricItem}>
                  <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>Deadline Risk</Text>
                  <Text style={[styles.metricVal, { color: theme.colors.success }]}>
                    Very Low
                  </Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.chooseBtn,
                    {
                      backgroundColor: !recommendWait ? theme.colors.primary : theme.colors.surfacePressed,
                      borderColor: theme.colors.border,
                      borderWidth: !recommendWait ? 0 : 1,
                    },
                  ]}
                  onPress={() => handleChoose('ship_now')}
                >
                  <Text
                    style={[
                      styles.chooseBtnText,
                      { color: !recommendWait ? '#FFFFFF' : theme.colors.textPrimary },
                    ]}
                  >
                    Select Ship Now
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Option B: Wait & Consolidate */}
              <View
                style={[
                  styles.optionBox,
                  {
                    backgroundColor: theme.colors.background,
                    borderColor: recommendWait ? theme.colors.success : theme.colors.border,
                    borderWidth: recommendWait ? 2 : 1,
                  },
                ]}
              >
                <View style={styles.optionHeader}>
                  <View style={[styles.badgeSaved, { backgroundColor: theme.colors.successLight }]}>
                    <Text style={[styles.badgeSavedText, { color: theme.colors.success }]}>
                      Save ₹{costSavings.toLocaleString('en-IN')}
                    </Text>
                  </View>
                  <Text style={[styles.optionTitle, { color: theme.colors.textPrimary }]}>Wait & Pool</Text>
                  <Text style={[styles.optionSub, { color: theme.colors.textTertiary }]}>TRK-27 (Passing NH48)</Text>
                </View>

                <View style={styles.metricItem}>
                  <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>Freight Cost</Text>
                  <Text style={[styles.metricVal, { color: theme.colors.success, fontWeight: '800' }]}>
                    ₹{consolidatedCost.toLocaleString('en-IN')}
                  </Text>
                </View>

                <View style={styles.metricItem}>
                  <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>Expected ETA</Text>
                  <Text style={[styles.metricVal, { color: theme.colors.textPrimary }]}>
                    {formatTime(consolidatedEta)}
                  </Text>
                </View>

                <View style={styles.metricItem}>
                  <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>Wait Time</Text>
                  <Text style={[styles.metricVal, { color: theme.colors.accent }]}>
                    ~2.5 hrs
                  </Text>
                </View>

                <View style={styles.metricItem}>
                  <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>Truck Utilization</Text>
                  <Text style={[styles.metricVal, { color: theme.colors.success }]}>
                    88% (High)
                  </Text>
                </View>

                <View style={styles.metricItem}>
                  <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>Deadline Risk</Text>
                  <Text
                    style={[
                      styles.metricVal,
                      {
                        color:
                          deadlineRisk === 'Low'
                            ? theme.colors.success
                            : deadlineRisk === 'Medium'
                            ? theme.colors.warning
                            : theme.colors.error,
                      },
                    ]}
                  >
                    {deadlineRisk} Risk
                  </Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.chooseBtn,
                    {
                      backgroundColor: recommendWait ? theme.colors.success : theme.colors.surfacePressed,
                      borderColor: theme.colors.border,
                      borderWidth: recommendWait ? 0 : 1,
                    },
                  ]}
                  onPress={() => handleChoose('wait_consolidate')}
                >
                  <Text
                    style={[
                      styles.chooseBtnText,
                      { color: recommendWait ? '#FFFFFF' : theme.colors.textPrimary },
                    ]}
                  >
                    Select Consolidate
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Environmental Impact Note */}
            <View style={[styles.ecoNote, { backgroundColor: theme.colors.primaryLight }]}>
              <Ionicons name="leaf-outline" size={18} color={theme.colors.primary} />
              <Text style={[styles.ecoText, { color: theme.colors.textPrimary }]}>
                Choosing <Text style={{ fontWeight: '700' }}>Wait & Pool</Text> eliminates an empty return trip, reducing transport carbon emissions by ~38 kg CO₂.
              </Text>
            </View>
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
  recBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  recBannerTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  recBannerDesc: {
    fontSize: 11,
    marginTop: 3,
    lineHeight: 16,
  },
  comparisonGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  optionBox: {
    flex: 1,
    borderRadius: 14,
    padding: 12,
  },
  optionHeader: {
    marginBottom: 12,
  },
  optionTag: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginTop: 2,
  },
  optionSub: {
    fontSize: 10,
    marginTop: 1,
  },
  badgeSaved: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 4,
  },
  badgeSavedText: {
    fontSize: 10,
    fontWeight: '800',
  },
  metricItem: {
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
  metricVal: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 1,
  },
  chooseBtn: {
    height: 38,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  chooseBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  ecoNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 10,
    marginTop: 16,
  },
  ecoText: {
    fontSize: 11,
    flex: 1,
    lineHeight: 16,
  },
});
