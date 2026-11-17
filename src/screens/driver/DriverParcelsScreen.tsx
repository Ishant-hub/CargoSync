import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';
import { mockShipments } from '../../data/mockData';
import { Shipment } from '../../types';
import { ShipmentCard } from '../../components';
import { formatTime, formatDate } from '../../data/mockData';

export default function DriverParcelsScreen() {
  const { theme } = useTheme();
  const [shipments] = useState<Shipment[]>(mockShipments.filter(s => s.assignedTruckId === 'TRK-27'));
  const [activeTab, setActiveTab] = useState<'onboard' | 'delivered' | 'all'>('onboard');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredShipments = shipments.filter((shp) => {
    if (activeTab === 'onboard' && shp.status !== 'in_transit') return false;
    if (activeTab === 'delivered' && shp.status !== 'delivered') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return shp.id.toLowerCase().includes(q) ||
        shp.destination?.city?.toLowerCase().includes(q) ||
        (shp.trackingNumber || '').toLowerCase().includes(q);
    }
    return true;
  });

  const onboardCount = shipments.filter(s => s.status === 'in_transit').length;
  const deliveredCount = shipments.filter(s => s.status === 'delivered').length;
  const totalWeight = shipments.filter(s => s.status === 'in_transit').reduce((s, shp) => s + shp.weight / 1000, 0);

  const handleScanQR = () => Alert.alert('QR Scanner', 'Opening camera to scan parcel barcode...');
  const handlePOD = (shipment: Shipment) => Alert.alert('Proof of Delivery', `Capture signature for ${shipment.id}`);
  const handleDetails = (shipment: Shipment) => Alert.alert('Parcel Details', `Consignment: ${shipment.id}\nWeight: ${shipment.weight/1000}T\nDestination: ${shipment.destination.city}\nDeadline: ${formatTime(shipment.deliveryDeadline)}`);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.cardBackground, borderBottomColor: theme.colors.border }]}>
        <View>
          <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>Cargo Manifest</Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
            {shipments.length} parcels assigned to this truck
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.scanBtn, { backgroundColor: theme.colors.primary }]}
          onPress={handleScanQR}
          activeOpacity={0.8}
        >
          <Ionicons name="qr-code-outline" size={20} color="#FFFFFF" />
          <Text style={styles.scanBtnText}>Scan</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <View style={[styles.statItem, { backgroundColor: theme.colors.cardBackground }]}>
          <Text style={[styles.statVal, { color: theme.colors.accent }]}>{onboardCount}</Text>
          <Text style={[styles.statLbl, { color: theme.colors.textSecondary }]}>On Board</Text>
        </View>
        <View style={[styles.statItem, { backgroundColor: theme.colors.cardBackground }]}>
          <Text style={[styles.statVal, { color: theme.colors.success }]}>{deliveredCount}</Text>
          <Text style={[styles.statLbl, { color: theme.colors.textSecondary }]}>Delivered</Text>
        </View>
        <View style={[styles.statItem, { backgroundColor: theme.colors.cardBackground }]}>
          <Text style={[styles.statVal, { color: theme.colors.warning }]}>{totalWeight.toFixed(1)}T</Text>
          <Text style={[styles.statLbl, { color: theme.colors.textSecondary }]}>Total Weight</Text>
        </View>
      </View>

      {/* Search */}
      <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
        <View style={[styles.searchBox, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border }]}>
          <Ionicons name="search-outline" size={18} color={theme.colors.textTertiary} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.textPrimary }]}
            placeholder="Search by ID, destination, tracking #..."
            placeholderTextColor={theme.colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={theme.colors.textTertiary} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabsRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
          {[
            { key: 'onboard', label: `On Board (${onboardCount})` },
            { key: 'delivered', label: `Delivered (${deliveredCount})` },
            { key: 'all', label: 'All' },
          ].map((tab) => {
            const isSelected = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.tabChip,
                  {
                    backgroundColor: isSelected ? theme.colors.primary : theme.colors.cardBackground,
                    borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                  },
                ]}
                onPress={() => setActiveTab(tab.key as any)}
              >
                <Text style={[styles.tabChipText, { color: isSelected ? '#FFFFFF' : theme.colors.textPrimary }]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Shipments List */}
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24, paddingTop: 10 }}>
        {filteredShipments.length === 0 ? (
          <View style={[styles.emptyBox, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border }]}>
            <Ionicons name="cube-outline" size={48} color={theme.colors.textTertiary} />
            <Text style={[styles.emptyTitle, { color: theme.colors.textPrimary }]}>No Parcels Found</Text>
            <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
              Try adjusting your search or filter.
            </Text>
          </View>
        ) : (
          filteredShipments.map((shipment) => (
            <View key={shipment.id} style={{ marginBottom: 12 }}>
              <View
                style={[
                  styles.parcelCard,
                  { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.cardBorder },
                ]}
              >
                {/* Main Info */}
                <View style={styles.parcelMain}>
                  <View style={styles.parcelLeft}>
                    <View style={[
                      styles.statusIndicator,
                      { backgroundColor: 
                        shipment.status === 'in_transit' ? theme.colors.accent :
                        shipment.status === 'delivered' ? theme.colors.success :
                        theme.colors.warning
                      }
                    ]} />
                    <View style={styles.parcelInfo}>
                      <Text style={[styles.parcelId, { color: theme.colors.textPrimary }]}>{shipment.id}</Text>
                      <Text style={[styles.parcelRoute, { color: theme.colors.textSecondary }]}>
                        {shipment.pickup?.city || shipment.origin?.city} → {shipment.destination.city}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.parcelRight}>
                    <View style={styles.parcelWeight}>
                      <Text style={[styles.weightVal, { color: theme.colors.textPrimary }]}>{shipment.weight / 1000}T</Text>
                      <Text style={[styles.weightLbl, { color: theme.colors.textTertiary }]}>WEIGHT</Text>
                    </View>
                    {shipment.status === 'delivered' && (
                      <View style={[styles.deliveredBadge, { backgroundColor: theme.colors.successLight }]}>
                        <Text style={[styles.deliveredText, { color: theme.colors.success }]}>DELIVERED</Text>
                      </View>
                    )}
                    {shipment.status === 'in_transit' && (
                      <View style={[styles.inTransitBadge, { backgroundColor: theme.colors.accentLight }]}>
                        <Text style={[styles.inTransitText, { color: theme.colors.accent }]}>ON BOARD</Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Details Row */}
                <View style={styles.parcelDetails}>
                  <View style={styles.detailItem}>
                    <Ionicons name="calendar-outline" size={14} color={theme.colors.textTertiary} />
                    <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
                      Due: {formatTime(shipment.deliveryDeadline)}, {formatDate(shipment.deliveryDeadline)}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="flag-outline" size={14} color={theme.colors.textTertiary} />
                    <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
                      Priority: {shipment.priority}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="card-outline" size={14} color={theme.colors.textTertiary} />
                    <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
                      {shipment.trackingNumber}
                    </Text>
                  </View>
                </View>

                {/* Actions */}
                {shipment.status === 'in_transit' && (
                  <View style={styles.parcelActions}>
                    <TouchableOpacity
                      style={[styles.actionBtn, { backgroundColor: theme.colors.accent }]}
                      onPress={() => handlePOD(shipment)}
                    >
                      <Ionicons name="create-outline" size={16} color="#FFFFFF" />
                      <Text style={styles.actionBtnText}>POD Signature</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionBtnOutline, { borderColor: theme.colors.primary }]}
                      onPress={() => handleDetails(shipment)}
                    >
                      <Ionicons name="information-circle-outline" size={16} color={theme.colors.primary} />
                      <Text style={styles.actionBtnOutlineText}>Details</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {shipment.status === 'delivered' && (
                  <View style={styles.parcelActions}>
                    <TouchableOpacity
                      style={[styles.actionBtnOutline, { borderColor: theme.colors.success }]}
                      onPress={() => Alert.alert('POD Record', `Digital signature & photo captured for ${shipment.id}`)}
                    >
                      <Ionicons name="document-text-outline" size={16} color={theme.colors.success} />
                      <Text style={styles.actionBtnOutlineText}>View POD</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 20, fontWeight: '800', letterSpacing: -0.3 },
  headerSubtitle: { fontSize: 12, marginTop: 2 },
  scanBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  scanBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
  },
  statItem: { alignItems: 'center', flex: 1, paddingHorizontal: 8 },
  statVal: { fontSize: 20, fontWeight: '800' },
  statLbl: { fontSize: 10, marginTop: 2, textAlign: 'center' },
  searchBox: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 14 },
  filterTabsRow: { paddingVertical: 12 },
  tabChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  tabChipText: { fontSize: 12, fontWeight: '600' },
  emptyBox: { padding: 32, borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  emptyTitle: { fontSize: 16, fontWeight: '700', marginTop: 12 },
  emptySubtitle: { fontSize: 13, textAlign: 'center', marginTop: 4 },
  parcelCard: { padding: 16, borderRadius: 16, borderWidth: 1 },
  parcelMain: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  parcelLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  statusIndicator: { width: 10, height: 10, borderRadius: 5 },
  parcelInfo: { gap: 2 },
  parcelId: { fontSize: 15, fontWeight: '700' },
  parcelRoute: { fontSize: 12 },
  parcelRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  parcelWeight: { alignItems: 'flex-end' },
  weightVal: { fontSize: 18, fontWeight: '800' },
  weightLbl: { fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },
  deliveredBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  deliveredText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  inTransitBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  inTransitText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  parcelDetails: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 12, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(150,150,150,0.2)' },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1, minWidth: '30%' },
  detailText: { fontSize: 11, flex: 1 },
  parcelActions: { flexDirection: 'row', gap: 10 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 10 },
  actionBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
  actionBtnOutline: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 10, borderWidth: 1 },
  actionBtnOutlineText: { fontSize: 12, fontWeight: '600' },
});