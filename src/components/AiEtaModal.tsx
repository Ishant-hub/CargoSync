import React from 'react';
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
import { Shipment, Truck } from '../types';
import { predictShipmentEta, EtaPrediction } from '../services/aiEtaService';

interface AiEtaModalProps {
  visible: boolean;
  onClose: () => void;
  shipment: Shipment | null;
  truck?: Truck;
}

export default function AiEtaModal({
  visible,
  onClose,
  shipment,
  truck,
}: AiEtaModalProps) {
  const { theme } = useTheme();

  if (!shipment) return null;

  const prediction: EtaPrediction = predictShipmentEta(shipment, truck);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical':
        return theme.colors.error;
      case 'high':
        return theme.colors.warning;
      case 'medium':
        return theme.colors.primary;
      case 'low':
      default:
        return theme.colors.success;
    }
  };

  const riskColor = getRiskColor(prediction.riskLevel);

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[styles.card, { backgroundColor: theme.colors.cardBackground }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.headerLeft}>
              <View style={[styles.iconBox, { backgroundColor: theme.colors.primaryLight }]}>
                <Ionicons name="time-outline" size={20} color={theme.colors.primary} />
              </View>
              <View>
                <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
                  AI ETA & Delay Analytics
                </Text>
                <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                  Consignment #{shipment.id}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} contentContainerStyle={{ padding: 20 }}>
            {/* Risk Banner */}
            <View style={[styles.riskBanner, { backgroundColor: riskColor + '15', borderColor: riskColor }]}>
              <Ionicons name="alert-circle-outline" size={24} color={riskColor} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.riskTitle, { color: riskColor }]}>
                  {prediction.riskLevel.toUpperCase()} DELAY RISK — {prediction.delayProbability}% Probability
                </Text>
                <Text style={[styles.riskDesc, { color: theme.colors.textPrimary }]}>
                  Predicted delay of approx. +{prediction.delayMinutes} minutes on scheduled delivery window.
                </Text>
              </View>
            </View>

            {/* Time Comparison */}
            <View style={[styles.timeRow, { backgroundColor: theme.colors.background }]}>
              <View style={styles.timeItem}>
                <Text style={[styles.timeLabel, { color: theme.colors.textSecondary }]}>Scheduled ETA</Text>
                <Text style={[styles.timeValue, { color: theme.colors.textPrimary }]}>{prediction.originalEta}</Text>
              </View>
              <Ionicons name="arrow-forward-outline" size={20} color={theme.colors.textTertiary} />
              <View style={styles.timeItem}>
                <Text style={[styles.timeLabel, { color: theme.colors.textSecondary }]}>Predicted ETA</Text>
                <Text style={[styles.timeValue, { color: riskColor }]}>{prediction.predictedEta}</Text>
              </View>
            </View>

            {/* Confidence Interval */}
            <Text style={[styles.confidenceText, { color: theme.colors.textTertiary }]}>
              Confidence: {prediction.confidenceScore}% (Estimated Arrival Window: {prediction.confidenceInterval.earliest} – {prediction.confidenceInterval.latest})
            </Text>

            {/* Delay Risk Factors */}
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              Predicted Delay Factors
            </Text>
            {prediction.contributingFactors.map((factor, idx) => (
              <View key={idx} style={[styles.factorRow, { borderColor: theme.colors.border }]}>
                <View style={[styles.factorIcon, { backgroundColor: theme.colors.background }]}>
                  <Ionicons name={factor.icon as any} size={18} color={theme.colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.factorName, { color: theme.colors.textPrimary }]}>
                    {factor.factor}
                  </Text>
                  <Text style={[styles.factorDesc, { color: theme.colors.textSecondary }]}>
                    {factor.description}
                  </Text>
                </View>
                <Text style={[styles.factorImpact, { color: theme.colors.warning }]}>
                  +{factor.impactMinutes} m
                </Text>
              </View>
            ))}

            {/* AI Recommendation */}
            <View style={[styles.recBox, { backgroundColor: theme.colors.primaryLight }]}>
              <Ionicons name="bulb-outline" size={20} color={theme.colors.primary} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.recTitle, { color: theme.colors.primary }]}>AI Mitigation Strategy</Text>
                <Text style={[styles.recText, { color: theme.colors.textPrimary }]}>
                  {prediction.mitigationRecommendation}
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Close button */}
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
    padding: 16,
  },
  card: {
    width: '100%',
    maxHeight: '88%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
  },
  closeBtn: {
    padding: 4,
  },
  body: {
    flex: 1,
  },
  riskBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  riskTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  riskDesc: {
    fontSize: 12,
    marginTop: 4,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
  },
  timeItem: {
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  timeValue: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2,
  },
  confidenceText: {
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
  },
  factorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  factorIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  factorName: {
    fontSize: 13,
    fontWeight: '600',
  },
  factorDesc: {
    fontSize: 11,
    marginTop: 2,
  },
  factorImpact: {
    fontSize: 13,
    fontWeight: '700',
  },
  recBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    borderRadius: 12,
    marginTop: 16,
  },
  recTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  recText: {
    fontSize: 12,
    marginTop: 2,
    lineHeight: 18,
  },
  footer: {
    padding: 16,
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
    fontWeight: '600',
  },
});
