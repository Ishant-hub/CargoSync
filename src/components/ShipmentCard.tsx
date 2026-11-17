import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import StatusBadge from './StatusBadge';
import { Shipment } from '../types';

interface ShipmentCardProps {
  shipment: Shipment;
  onPress?: () => void;
}

export default function ShipmentCard({ shipment, onPress }: ShipmentCardProps) {
  const { theme } = useTheme();
  const originLoc = shipment.origin || shipment.pickup;
  const destLoc = shipment.destination;
  const trackingNo = shipment.trackingNumber || shipment.id;
  const costVal = shipment.cost ?? 0;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.cardBackground,
          borderColor: theme.colors.cardBorder,
          ...theme.shadows.sm,
        },
      ]}
    >
      {/* Header: Tracking Number + Status */}
      <View style={styles.header}>
        <View style={styles.trackingInfo}>
          <Text style={[styles.trackingLabel, { color: theme.colors.textTertiary }]}>
            WAYBILL
          </Text>
          <Text style={[styles.trackingNumber, { color: theme.colors.textPrimary }]}>
            {trackingNo}
          </Text>
        </View>
        <StatusBadge status={shipment.status} />
      </View>

      {/* Route: Origin -> Destination */}
      <View style={styles.routeContainer}>
        <View style={styles.routeTimeline}>
          <View style={[styles.dot, { backgroundColor: theme.colors.accent }]} />
          <View style={[styles.line, { backgroundColor: theme.colors.border }]} />
          <View style={[styles.dot, { backgroundColor: theme.colors.success }]} />
        </View>

        <View style={styles.routeDetails}>
          <View style={styles.stopInfo}>
            <Text style={[styles.cityText, { color: theme.colors.textPrimary }]}>
              {originLoc.city || 'Origin City'}
            </Text>
            <Text style={[styles.addressText, { color: theme.colors.textSecondary }]}>
              {originLoc.name || originLoc.address || 'Pickup Point'}
            </Text>
          </View>
          <View style={[styles.stopInfo, { marginTop: 12 }]}>
            <Text style={[styles.cityText, { color: theme.colors.textPrimary }]}>
              {destLoc.city || 'Destination City'}
            </Text>
            <Text style={[styles.addressText, { color: theme.colors.textSecondary }]}>
              {destLoc.name || destLoc.address || 'Delivery Hub'}
            </Text>
          </View>
        </View>
      </View>

      {/* Cargo Meta: Weight, Volume, Cost */}
      <View style={[styles.footer, { borderTopColor: theme.colors.divider }]}>
        <View style={styles.metaItem}>
          <Ionicons name="scale-outline" size={14} color={theme.colors.textTertiary} />
          <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
            {shipment.weight >= 1000
              ? `${(shipment.weight / 1000).toFixed(1)}T (${shipment.weight} kg)`
              : `${shipment.weight} kg`}
          </Text>
        </View>

        <View style={styles.metaItem}>
          <Ionicons name="cube-outline" size={14} color={theme.colors.textTertiary} />
          <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
            {shipment.volume || 1.0} m³
          </Text>
        </View>

        <View style={styles.metaItem}>
          <Ionicons name="pricetag-outline" size={14} color={theme.colors.textTertiary} />
          <Text style={[styles.metaTextBold, { color: theme.colors.textPrimary }]}>
            ₹{costVal.toLocaleString('en-IN')}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  trackingInfo: {
    flexDirection: 'column',
  },
  trackingLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  trackingNumber: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 2,
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  routeTimeline: {
    alignItems: 'center',
    width: 20,
    marginRight: 10,
    paddingTop: 4,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  line: {
    width: 2,
    height: 28,
    marginVertical: 3,
  },
  routeDetails: {
    flex: 1,
  },
  stopInfo: {
    justifyContent: 'center',
  },
  cityText: {
    fontSize: 14,
    fontWeight: '600',
  },
  addressText: {
    fontSize: 12,
    marginTop: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '500',
  },
  metaTextBold: {
    fontSize: 13,
    fontWeight: '700',
  },
});
