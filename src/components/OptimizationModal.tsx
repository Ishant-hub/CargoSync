import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { OptimizationOpportunity } from '../types';
import { PrimaryButton, SecondaryButton, CapacityBar } from '../components';

interface OptimizationModalProps {
  opportunity: OptimizationOpportunity;
  onClose: () => void;
  onApply: (id: string) => void;
}

export default function OptimizationModal({ opportunity, onClose, onApply }: OptimizationModalProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.modal, { backgroundColor: theme.colors.cardBackground }]}>
      <View style={styles.modalHandle} />
      <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
        <View style={styles.modalHeader}>
          <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>Consolidation Details</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close-outline" size={24} color={theme.colors.textTertiary} />
          </TouchableOpacity>
        </View>

        <View style={styles.modalTruck}>
          <View style={styles.modalTruckHeader}>
            <View style={[styles.truckBadge, { backgroundColor: theme.colors.primaryLight }]}>
              <Ionicons name="bus-outline" size={20} color={theme.colors.primary} />
            </View>
            <View>
              <Text style={[styles.modalTruckReg, { color: theme.colors.textPrimary }]}>{opportunity.truckRegistration}</Text>
              <Text style={[styles.modalTruckRoute, { color: theme.colors.textSecondary }]}>{opportunity.route}</Text>
            </View>
            <View style={[
              styles.utilizationBadge,
              { backgroundColor: opportunity.potentialUtilization > 85 ? theme.colors.successLight : theme.colors.warningLight }
            ]}>
              <Text style={[
                styles.utilizationBadgeText,
                { color: opportunity.potentialUtilization > 85 ? theme.colors.success : theme.colors.warning }
              ]}>
                {opportunity.currentUtilization}% → {opportunity.potentialUtilization}%
              </Text>
            </View>
          </View>
          <CapacityBar
            current={10 - opportunity.availableCapacity}
            max={10}
            unit="T"
            label="PAYLOAD UTILIZATION"
          />
        </View>

        <Text style={[styles.modalSectionTitle, { color: theme.colors.textPrimary }]}>Compatible Shipments ({opportunity.compatibleShipments.length})</Text>

        {opportunity.compatibleShipments.map((shipment, i) => (
          <View key={shipment.shipmentId} style={[styles.modalShipment, { backgroundColor: '#F8F9FA', borderColor: '#E5E7EB' }]}>
            <View style={styles.modalShipmentHeader}>
              <View style={styles.shipmentInfo}>
                <Text style={[styles.shipmentId, { color: theme.colors.textPrimary }]}>{shipment.shipmentId}</Text>
                <Text style={[styles.shipmentRoute, { color: theme.colors.textSecondary }]}>
                  {shipment.pickup.city} → {shipment.destination.city}
                </Text>
              </View>
              <View style={styles.shipmentMetrics}>
                <View style={styles.metric}>
                  <Text style={[styles.metricVal, { color: theme.colors.textPrimary }]}>{shipment.weight}T</Text>
                  <Text style={[styles.metricLbl, { color: theme.colors.textTertiary }]}>Weight</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={[styles.metricVal, { color: theme.colors.accent }]}>+{shipment.etaImpactMinutes}min</Text>
                  <Text style={[styles.metricLbl, { color: theme.colors.textTertiary }]}>ETA Impact</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={[styles.metricVal, { color: theme.colors.success }]}>₹{shipment.costSaving.toLocaleString('en-IN')}</Text>
                  <Text style={[styles.metricLbl, { color: theme.colors.textTertiary }]}>Saving</Text>
                </View>
              </View>
            </View>
            <View style={styles.detourInfo}>
              <Ionicons name="map-outline" size={14} color={theme.colors.textTertiary} />
              <Text style={[styles.detourText, { color: theme.colors.textSecondary }]}>
                {shipment.detourKm} km detour • Pickup: {shipment.pickup.address}
              </Text>
            </View>
          </View>
        ))}

        <View style={[styles.modalSummary, { backgroundColor: '#FFF8E1', borderColor: '#F0820D' }]}>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>Total Added Weight</Text>
            <Text style={[styles.summaryVal, { color: theme.colors.textPrimary }]}>{opportunity.compatibleShipments.reduce((s, sh) => s + sh.weight, 0).toFixed(1)}T</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>Total Detour</Text>
            <Text style={[styles.summaryVal, { color: theme.colors.textPrimary }]}>{opportunity.compatibleShipments.reduce((s, sh) => s + sh.detourKm, 0)} km</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>Total ETA Impact</Text>
            <Text style={[styles.summaryVal, { color: theme.colors.textPrimary }]}>{opportunity.compatibleShipments.reduce((s, sh) => s + sh.etaImpactMinutes, 0)} min</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>Net Cost Saving</Text>
            <Text style={[styles.summaryVal, { color: theme.colors.success, fontWeight: '800', fontSize: 16 }]}>₹{opportunity.totalPotentialSaving.toLocaleString('en-IN')}</Text>
          </View>
        </View>

        <View style={styles.modalActions}>
          <SecondaryButton
            title="Dismiss"
            onPress={onClose}
          />
          <PrimaryButton
            title="Apply Consolidation"
            icon="checkmark-done-outline"
            onPress={() => onApply(opportunity.id)}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
  },
  modalHandle: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#CCCCCC',
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  modalTruck: {
    marginBottom: 16,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
  },
  modalTruckHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  truckBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTruckReg: {
    fontSize: 16,
    fontWeight: '800',
  },
  modalTruckRoute: {
    fontSize: 12,
    marginTop: 1,
  },
  utilizationBadge: {
    flex: 1,
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  utilizationBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  modalSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
    marginTop: 8,
  },
  modalShipment: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
  },
  modalShipmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  shipmentInfo: {
    flex: 1,
  },
  shipmentId: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  shipmentRoute: {
    fontSize: 12,
  },
  shipmentMetrics: {
    flexDirection: 'row',
    gap: 16,
  },
  metric: {
    alignItems: 'center',
  },
  metricVal: {
    fontSize: 14,
    fontWeight: '800',
  },
  metricLbl: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  detourInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(150,150,150,0.2)',
  },
  detourText: {
    fontSize: 11,
  },
  modalSummary: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    gap: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  summaryVal: {
    fontSize: 12,
    fontWeight: '700',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
  },
});