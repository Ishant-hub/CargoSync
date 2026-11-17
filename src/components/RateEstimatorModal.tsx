import React, { useState, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';

interface RateEstimatorModalProps {
  visible: boolean;
  onClose: () => void;
  onBookConsolidated?: (estimate: {
    origin: string;
    destination: string;
    weight: number;
    consolidatedCost: number;
    savings: number;
  }) => void;
}

const HUBS = ['Mumbai Hub', 'Pune Logistics Park', 'Delhi Inland Depot', 'Bengaluru South Hub', 'Ahmedabad Depot'];

const DISTANCE_MATRIX: Record<string, Record<string, number>> = {
  'Mumbai Hub': { 'Pune Logistics Park': 150, 'Delhi Inland Depot': 1420, 'Bengaluru South Hub': 980, 'Ahmedabad Depot': 525 },
  'Pune Logistics Park': { 'Mumbai Hub': 150, 'Delhi Inland Depot': 1450, 'Bengaluru South Hub': 840, 'Ahmedabad Depot': 660 },
  'Delhi Inland Depot': { 'Mumbai Hub': 1420, 'Pune Logistics Park': 1450, 'Bengaluru South Hub': 2150, 'Ahmedabad Depot': 940 },
  'Bengaluru South Hub': { 'Mumbai Hub': 980, 'Pune Logistics Park': 840, 'Delhi Inland Depot': 2150, 'Ahmedabad Depot': 1490 },
  'Ahmedabad Depot': { 'Mumbai Hub': 525, 'Pune Logistics Park': 660, 'Delhi Inland Depot': 940, 'Bengaluru South Hub': 1490 },
};

export default function RateEstimatorModal({
  visible,
  onClose,
  onBookConsolidated,
}: RateEstimatorModalProps) {
  const { theme } = useTheme();
  const [origin, setOrigin] = useState<string>('Mumbai Hub');
  const [destination, setDestination] = useState<string>('Delhi Inland Depot');
  const [weightKg, setWeightKg] = useState<string>('450');
  const [cargoType, setCargoType] = useState<'General' | 'Fragile' | 'Perishable'>('General');
  const [showSuccess, setShowSuccess] = useState(false);

  // Calculate pricing
  const calculation = useMemo(() => {
    const weight = parseFloat(weightKg) || 100;
    const dist = (DISTANCE_MATRIX[origin] && DISTANCE_MATRIX[origin][destination]) || 800;

    const baseRatePerTonKm = 4.2; // ₹ per ton per km
    const weightTon = Math.max(weight, 50) / 1000;

    let multiplier = 1.0;
    if (cargoType === 'Fragile') multiplier = 1.25;
    if (cargoType === 'Perishable') multiplier = 1.4;

    // Dedicated FTL flat rate minimum
    const dedicatedCost = Math.round(Math.max(12000, dist * 22 * multiplier));

    // Consolidated shared rate (charged strictly on weight proportion + shared lane efficiency)
    const baseConsolidated = Math.round(dist * weightTon * baseRatePerTonKm * multiplier * 2.8 + 1500);
    const consolidatedCost = Math.min(baseConsolidated, Math.round(dedicatedCost * 0.65));

    const savings = Math.max(0, dedicatedCost - consolidatedCost);
    const savingsPercent = Math.round((savings / dedicatedCost) * 100);
    const transitHours = Math.round(dist / 45) + 4; // average speed + handling

    return {
      distance: dist,
      dedicatedCost,
      consolidatedCost,
      savings,
      savingsPercent,
      transitHours,
      weight,
    };
  }, [origin, destination, weightKg, cargoType]);

  const handleBook = () => {
    if (onBookConsolidated) {
      onBookConsolidated({
        origin,
        destination,
        weight: calculation.weight,
        consolidatedCost: calculation.consolidatedCost,
        savings: calculation.savings,
      });
    }
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContent,
            {
              backgroundColor: theme.colors.cardBackground,
              borderColor: theme.colors.border,
            },
          ]}
        >
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.titleRow}>
              <View style={[styles.iconWrap, { backgroundColor: theme.colors.primary + '15' }]}>
                <Ionicons name="calculator-outline" size={20} color={theme.colors.primary} />
              </View>
              <View>
                <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
                  Freight Rate Estimator
                </Text>
                <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                  Compare dedicated FTL vs. CargoSync Shared LTL
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeBtn, { backgroundColor: theme.colors.background }]}
            >
              <Ionicons name="close" size={20} color={theme.colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
            {/* Origin & Destination Selector */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Origin Hub</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
                {HUBS.map((hub) => (
                  <TouchableOpacity
                    key={`orig-${hub}`}
                    onPress={() => {
                      if (hub === destination) {
                        setDestination(origin);
                      }
                      setOrigin(hub);
                    }}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: origin === hub ? theme.colors.primary : theme.colors.background,
                        borderColor: origin === hub ? theme.colors.primary : theme.colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        { color: origin === hub ? '#FFF' : theme.colors.textPrimary },
                      ]}
                    >
                      {hub.replace(' Logistics Park', '').replace(' Inland Depot', '').replace(' South Hub', '')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.section}>
              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Destination Hub</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
                {HUBS.filter((h) => h !== origin).map((hub) => (
                  <TouchableOpacity
                    key={`dest-${hub}`}
                    onPress={() => setDestination(hub)}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: destination === hub ? theme.colors.primary : theme.colors.background,
                        borderColor: destination === hub ? theme.colors.primary : theme.colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        { color: destination === hub ? '#FFF' : theme.colors.textPrimary },
                      ]}
                    >
                      {hub.replace(' Logistics Park', '').replace(' Inland Depot', '').replace(' South Hub', '')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Weight Input */}
            <View style={styles.inputRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Cargo Weight (kg)</Text>
                <View
                  style={[
                    styles.inputWrap,
                    {
                      backgroundColor: theme.colors.background,
                      borderColor: theme.colors.border,
                    },
                  ]}
                >
                  <Ionicons name="barbell-outline" size={18} color={theme.colors.textSecondary} />
                  <TextInput
                    style={[styles.input, { color: theme.colors.textPrimary }]}
                    keyboardType="numeric"
                    value={weightKg}
                    onChangeText={setWeightKg}
                    placeholder="e.g. 450"
                    placeholderTextColor={theme.colors.textSecondary}
                  />
                  <Text style={[styles.unitText, { color: theme.colors.textSecondary }]}>kg</Text>
                </View>
              </View>

              {/* Quick weight chips */}
              <View style={styles.weightQuickRow}>
                {['150', '500', '1200'].map((w) => (
                  <TouchableOpacity
                    key={w}
                    onPress={() => setWeightKg(w)}
                    style={[
                      styles.quickWeightBtn,
                      weightKg === w && { backgroundColor: theme.colors.primary + '20' },
                      { borderColor: theme.colors.border },
                    ]}
                  >
                    <Text
                      style={[
                        styles.quickWeightText,
                        { color: weightKg === w ? theme.colors.primary : theme.colors.textSecondary },
                      ]}
                    >
                      {w}kg
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Cargo Type */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Cargo Category</Text>
              <View style={styles.typeRow}>
                {(['General', 'Fragile', 'Perishable'] as const).map((type) => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => setCargoType(type)}
                    style={[
                      styles.typeBtn,
                      {
                        backgroundColor:
                          cargoType === type ? theme.colors.primary + '18' : theme.colors.background,
                        borderColor: cargoType === type ? theme.colors.primary : theme.colors.border,
                      },
                    ]}
                  >
                    <Ionicons
                      name={
                        type === 'General'
                          ? 'cube-outline'
                          : type === 'Fragile'
                          ? 'shield-checkmark-outline'
                          : 'snow-outline'
                      }
                      size={16}
                      color={cargoType === type ? theme.colors.primary : theme.colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.typeText,
                        {
                          color: cargoType === type ? theme.colors.primary : theme.colors.textPrimary,
                          fontWeight: cargoType === type ? '700' : '500',
                        },
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Comparison Cards */}
            <View style={styles.comparisonGrid}>
              {/* Dedicated */}
              <View
                style={[
                  styles.compareCard,
                  {
                    backgroundColor: theme.colors.background,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <Text style={[styles.compareLabel, { color: theme.colors.textSecondary }]}>
                  Dedicated Truck (FTL)
                </Text>
                <Text style={[styles.strikethroughPrice, { color: theme.colors.textSecondary }]}>
                  ₹{calculation.dedicatedCost.toLocaleString('en-IN')}
                </Text>
                <Text style={[styles.compareNote, { color: theme.colors.textSecondary }]}>
                  Full vehicle booked regardless of volume
                </Text>
              </View>

              {/* Consolidated */}
              <View
                style={[
                  styles.compareCard,
                  styles.consolidatedHighlight,
                  {
                    backgroundColor: theme.colors.primary + '12',
                    borderColor: theme.colors.primary,
                  },
                ]}
              >
                <View style={styles.badgeRow}>
                  <Text style={[styles.compareLabel, { color: theme.colors.primary, fontWeight: '700' }]}>
                    Shared Consolidation
                  </Text>
                  <View style={[styles.savingsBadge, { backgroundColor: theme.colors.success }]}>
                    <Text style={styles.savingsBadgeText}>{calculation.savingsPercent}% OFF</Text>
                  </View>
                </View>
                <Text style={[styles.consolidatedPrice, { color: theme.colors.primary }]}>
                  ₹{calculation.consolidatedCost.toLocaleString('en-IN')}
                </Text>
                <Text style={[styles.compareNote, { color: theme.colors.textPrimary }]}>
                  Pay only for your weight on shared corridor
                </Text>
              </View>
            </View>

            {/* Trip Stats */}
            <View
              style={[
                styles.statsRow,
                {
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <View style={styles.statCol}>
                <Ionicons name="git-network-outline" size={16} color={theme.colors.primary} />
                <Text style={[styles.statValue, { color: theme.colors.textPrimary }]}>
                  {calculation.distance} km
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Distance</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statCol}>
                <Ionicons name="time-outline" size={16} color={theme.colors.accent} />
                <Text style={[styles.statValue, { color: theme.colors.textPrimary }]}>
                  ~{calculation.transitHours} hrs
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Transit Time</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statCol}>
                <Ionicons name="wallet-outline" size={16} color={theme.colors.success} />
                <Text style={[styles.statValue, { color: theme.colors.success }]}>
                  ₹{calculation.savings.toLocaleString('en-IN')}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Savings</Text>
              </View>
            </View>

            {/* Success toast if booked */}
            {showSuccess && (
              <View style={[styles.successBanner, { backgroundColor: theme.colors.success + '20' }]}>
                <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
                <Text style={[styles.successText, { color: theme.colors.success }]}>
                  Rate locked & Quote applied to drafts!
                </Text>
              </View>
            )}

            {/* Action CTA */}
            <TouchableOpacity
              onPress={handleBook}
              style={[styles.bookBtn, { backgroundColor: theme.colors.primary }]}
            >
              <Text style={styles.bookBtnText}>
                Book Shared Space (Save ₹{calculation.savings.toLocaleString('en-IN')})
              </Text>
              <Ionicons name="arrow-forward" size={18} color="#FFF" />
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
    ...(Platform.OS === 'web' ? { alignItems: 'center', justifyContent: 'center' } : {}),
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    width: '100%',
    ...(Platform.OS === 'web'
      ? { maxWidth: 560, borderRadius: 24, borderWidth: 1, maxHeight: 660 }
      : {}),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingVertical: 16,
    gap: 14,
  },
  section: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chipRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 8,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    marginTop: 4,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    padding: 0,
  },
  unitText: {
    fontSize: 13,
    fontWeight: '600',
  },
  weightQuickRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 4,
  },
  quickWeightBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  quickWeightText: {
    fontSize: 11,
    fontWeight: '600',
  },
  typeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  typeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  typeText: {
    fontSize: 12,
  },
  comparisonGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  compareCard: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  consolidatedHighlight: {
    borderWidth: 1.5,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  savingsBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  savingsBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  compareLabel: {
    fontSize: 11,
    marginBottom: 4,
  },
  strikethroughPrice: {
    fontSize: 18,
    fontWeight: '700',
    textDecorationLine: 'line-through',
    marginBottom: 4,
  },
  consolidatedPrice: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  compareNote: {
    fontSize: 10,
    lineHeight: 14,
  },
  statsRow: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statCol: {
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  statLabel: {
    fontSize: 10,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(128, 128, 128, 0.2)',
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  successText: {
    fontSize: 13,
    fontWeight: '600',
  },
  bookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
    marginTop: 6,
  },
  bookBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
