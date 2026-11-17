import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors, FontFamily, Spacing, Radius, Typography, Shadows } from '../../theme/tokens';
import { TabHeader } from '../../components/common/Headers';

interface ShipmentItem {
  id: string;
  priority: string;
  status: 'IN TRANSIT' | 'PICKUP PENDING' | 'DELIVERED';
  category: 'in-transit' | 'pickup-pending' | 'delivered';
  origin: string;
  originSub: string;
  destination: string;
  destSub: string;
  cargo: string;
  enclosure: string;
  locationInfo?: {
    label: string;
    value: string;
  };
  driverInfo?: {
    code: string;
    name: string;
  };
  appointmentInfo?: {
    label: string;
    value: string;
    tag: string;
  };
  deliveryInfo?: {
    label: string;
    value: string;
  };
}

const SHIPMENTS_DATA: ShipmentItem[] = [
  {
    id: 'CS-8942',
    priority: 'High Priority',
    status: 'IN TRANSIT',
    category: 'in-transit',
    origin: 'Delhi Hub (NCR)',
    originSub: 'Departed 09:30',
    destination: 'Chandigarh Terminal',
    destSub: 'ETA Today 18:45',
    cargo: '3.2 T Machine Parts',
    enclosure: '32ft MX Container',
    locationInfo: {
      label: 'Current Location',
      value: 'Near Karnal Toll Plaza · Speed 54 km/h',
    },
    driverInfo: {
      code: 'TRK-27',
      name: 'Rajesh Kumar',
    },
  },
  {
    id: 'CS-8939',
    priority: 'Standard',
    status: 'PICKUP PENDING',
    category: 'pickup-pending',
    origin: 'Delhi Warehouse South',
    originSub: 'Slot Booked',
    destination: 'Jaipur Industrial Area',
    destSub: 'Tomorrow Morning',
    cargo: '1.8 T Auto Components',
    enclosure: '20ft Closed Body',
    appointmentInfo: {
      label: 'Dock Appointment',
      value: 'Pickup today at 16:30 (Bay 4)',
      tag: 'Confirmed',
    },
  },
  {
    id: 'CS-8812',
    priority: 'Completed',
    status: 'DELIVERED',
    category: 'delivered',
    origin: 'Delhi North CFS',
    originSub: 'Yesterday',
    destination: 'Ludhiana Freight Station',
    destSub: 'POD Signed',
    cargo: '4.5 T Industrial Raw Materials',
    enclosure: '24ft Container',
    deliveryInfo: {
      label: 'Consignee Sign-off',
      value: 'Delivered today at 11:20 AM · M. Singh',
    },
  },
];

export default function ShipperShipmentsScreen() {
  const navigation = useNavigation<any>();

  const [activeFilter, setActiveFilter] = useState<'all' | 'in-transit' | 'pickup-pending' | 'delivered'>('in-transit');
  const [searchQuery, setSearchQuery] = useState('');
  const [trackingModalVisible, setTrackingModalVisible] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<ShipmentItem | null>(null);

  const filteredShipments = SHIPMENTS_DATA.filter((item) => {
    if (activeFilter !== 'all' && item.category !== activeFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.id.toLowerCase().includes(q) ||
        item.origin.toLowerCase().includes(q) ||
        item.destination.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenTrack = (item: ShipmentItem) => {
    setSelectedShipment(item);
    setTrackingModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TabHeader
        roleBadge="Shipper"
        notificationCount={2}
        onNotifications={() => navigation.navigate('Notifications')}
        onProfile={() => navigation.navigate('ShipperProfile')}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchBarContainer}>
          <MaterialIcons name="search" size={20} color={Colors.muted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by ID (e.g. CS-8942) or city"
            placeholderTextColor={Colors.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialIcons name="cancel" size={18} color={Colors.muted} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Filter Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterPillsRow}>
          {[
            { id: 'all', label: 'All (8)' },
            { id: 'in-transit', label: 'In Transit (3)' },
            { id: 'pickup-pending', label: 'Pickup Pending (2)' },
            { id: 'delivered', label: 'Delivered (3)' },
          ].map((tab) => {
            const active = activeFilter === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.filterPill, active && styles.filterPillActive]}
                onPress={() => setActiveFilter(tab.id as any)}
                activeOpacity={0.8}
              >
                <Text style={[styles.filterPillText, active && styles.filterPillTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Operational Stats Peek Banner */}
        <View style={styles.syncBanner}>
          <View style={styles.syncLeft}>
            <MaterialIcons name="verified" size={18} color={Colors.badgeSuccessText} />
            <Text style={styles.syncText}>Fleet Sync: All GPS signals active</Text>
          </View>
          <Text style={styles.syncTime}>Updated 2m ago</Text>
        </View>

        {/* Shipment Cards List */}
        <View style={styles.cardList}>
          {filteredShipments.map((item) => (
            <View key={item.id} style={styles.shipmentCard}>
              {/* Card Top: ID and Status Pill */}
              <View style={styles.cardHeader}>
                <View style={styles.cardIdGroup}>
                  <Text style={styles.shipmentId}>{item.id}</Text>
                  <Text style={styles.priorityText}>· {item.priority}</Text>
                </View>
                <View
                  style={[
                    styles.statusPill,
                    item.status === 'IN TRANSIT'
                      ? styles.statusPillGreen
                      : item.status === 'PICKUP PENDING'
                      ? styles.statusPillGray
                      : styles.statusPillDelivered,
                  ]}
                >
                  <View
                    style={[
                      styles.statusDot,
                      item.status === 'IN TRANSIT'
                        ? styles.statusDotGreen
                        : item.status === 'PICKUP PENDING'
                        ? styles.statusDotGray
                        : styles.statusDotDelivered,
                    ]}
                  />
                  <Text
                    style={[
                      styles.statusPillText,
                      item.status === 'IN TRANSIT'
                        ? styles.statusTextGreen
                        : item.status === 'PICKUP PENDING'
                        ? styles.statusTextGray
                        : styles.statusTextDelivered,
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
              </View>

              {/* Route Timeline */}
              <View style={styles.routeBox}>
                <View style={styles.routeGraphic}>
                  <View style={styles.originDot} />
                  <View style={styles.routeLine} />
                  <View style={styles.destSquare} />
                </View>
                <View style={styles.routeTextCol}>
                  <View style={styles.routeStopRow}>
                    <Text style={styles.stopName}>{item.origin}</Text>
                    <Text style={styles.stopSub}>{item.originSub}</Text>
                  </View>
                  <View style={styles.routeStopRow}>
                    <Text style={[styles.stopName, { fontFamily: FontFamily.bold }]}>{item.destination}</Text>
                    <Text
                      style={[
                        styles.stopSub,
                        item.status === 'IN TRANSIT' && { color: Colors.badgeSuccessText, fontFamily: FontFamily.bold },
                      ]}
                    >
                      {item.destSub}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Cargo & Spec Metadata Chips */}
              <View style={styles.cargoChipsRow}>
                <View style={styles.cargoChip}>
                  <MaterialIcons name="category" size={13} color={Colors.textDark} />
                  <Text style={styles.cargoChipText}>{item.cargo}</Text>
                </View>
                <View style={styles.cargoChip}>
                  <MaterialIcons name="local-shipping" size={13} color={Colors.textDark} />
                  <Text style={styles.cargoChipText}>{item.enclosure}</Text>
                </View>
              </View>

              {/* In Transit Telemetry Checkpoint */}
              {item.locationInfo && (
                <View style={styles.checkpointBox}>
                  <MaterialIcons name="location-on" size={18} color={Colors.textDark} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.checkpointLabel}>{item.locationInfo.label}</Text>
                    <Text style={styles.checkpointValue}>{item.locationInfo.value}</Text>
                  </View>
                  <MaterialIcons name="signal-cellular-alt" size={15} color={Colors.muted} />
                </View>
              )}

              {/* Pickup Appointment Strip */}
              {item.appointmentInfo && (
                <View style={styles.checkpointBox}>
                  <MaterialIcons name="schedule" size={18} color={Colors.muted} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.checkpointLabel}>{item.appointmentInfo.label}</Text>
                    <Text style={styles.checkpointValue}>{item.appointmentInfo.value}</Text>
                  </View>
                  <Text style={styles.confirmedTag}>{item.appointmentInfo.tag}</Text>
                </View>
              )}

              {/* Delivered Confirmation Banner */}
              {item.deliveryInfo && (
                <View style={styles.checkpointBox}>
                  <MaterialIcons name="task-alt" size={18} color={Colors.badgeSuccessText} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.checkpointLabel}>{item.deliveryInfo.label}</Text>
                    <Text style={styles.checkpointValue}>{item.deliveryInfo.value}</Text>
                  </View>
                </View>
              )}

              {/* Truck & Driver Info */}
              {item.driverInfo && (
                <View style={styles.driverRow}>
                  <View style={styles.driverBadge}>
                    <MaterialIcons name="badge" size={14} color={Colors.textDark} />
                    <Text style={styles.driverName}>
                      {item.driverInfo.code} · {item.driverInfo.name}
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.callIconBtn}>
                    <MaterialIcons name="call" size={15} color={Colors.textDark} />
                  </TouchableOpacity>
                </View>
              )}

              {/* Action Footer */}
              <View style={styles.cardActionsRow}>
                {item.status === 'IN TRANSIT' ? (
                  <>
                    <TouchableOpacity
                      style={styles.trackLiveBtn}
                      onPress={() => handleOpenTrack(item)}
                      activeOpacity={0.85}
                    >
                      <MaterialIcons name="satellite-alt" size={16} color={Colors.white} />
                      <Text style={styles.trackLiveBtnText}>Track Live</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.detailsBtn}
                      onPress={() => navigation.navigate('ShipmentDetails', { shipmentId: item.id })}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.detailsBtnText}>View Details</Text>
                    </TouchableOpacity>
                  </>
                ) : item.status === 'PICKUP PENDING' ? (
                  <TouchableOpacity
                    style={styles.detailsBtnFull}
                    onPress={() => navigation.navigate('ShipmentDetails', { shipmentId: item.id })}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.detailsBtnText}>View Details & Dispatch Manifest</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.detailsBtnFull}
                    onPress={() => navigation.navigate('ShipmentDetails', { shipmentId: item.id })}
                    activeOpacity={0.85}
                  >
                    <MaterialIcons name="receipt-long" size={16} color={Colors.textDark} />
                    <Text style={styles.detailsBtnText}>Download Receipt & Proof of Delivery</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('CreateShipment')}
          activeOpacity={0.9}
        >
          <MaterialIcons name="add" size={20} color={Colors.white} />
          <Text style={styles.fabText}>New Shipment</Text>
        </TouchableOpacity>
      </View>

      {/* Live Tracking Modal Sheet */}
      <Modal visible={trackingModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalDragHandle} />

            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>{selectedShipment?.id} Live Status</Text>
                <Text style={styles.modalSub}>Route Telemetry: NH 44 Grand Trunk Road</Text>
              </View>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setTrackingModalVisible(false)}
              >
                <MaterialIcons name="close" size={20} color={Colors.textDark} />
              </TouchableOpacity>
            </View>

            {/* Real Map Image */}
            <View style={styles.mapContainer}>
              <Image
                source={{
                  uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBljFW3PQhosPcrX9dKCE1jSRuKKlQ-YGuiud7GXexPBaD0n7Rpz65oHWFoNOSZowwgUwEYPkz-2PwFufeNYLHqMPlXwtk9R8dcsVeeI88g4KowFDDhjk9mloWwiBBKZNMh7Xhy1u_b8COXxWMMCU2qq5OGLJhGx6vOKVZSz2EV7EHYlAU7lAWsHw0LUXWOdil4WRZl09IV88EVitGQ65k8kOOZeRPf57utW33Lhtw',
                }}
                style={styles.mapImage}
                resizeMode="cover"
              />
              <View style={styles.gpsPingPill}>
                <View style={styles.pingDot} />
                <Text style={styles.pingText}>LIVE GPS PING</Text>
              </View>
            </View>

            {/* Driver & ETA Cards */}
            <View style={styles.telemetryCards}>
              <View style={styles.telemetryCard}>
                <View>
                  <Text style={styles.telemetrySub}>Driver on Duty</Text>
                  <Text style={styles.telemetryTitle}>
                    {selectedShipment?.driverInfo?.name} ({selectedShipment?.driverInfo?.code})
                  </Text>
                </View>
                <TouchableOpacity style={styles.callSmallBtn}>
                  <Text style={styles.callSmallText}>Call Driver</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.telemetryCard}>
                <View>
                  <Text style={styles.telemetrySub}>Est. Delivery Window</Text>
                  <Text style={styles.telemetryTitle}>18:30 – 19:15 Today</Text>
                </View>
                <Text style={styles.onScheduleText}>On Schedule</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.shareBtn}
              onPress={() => setTrackingModalVisible(false)}
              activeOpacity={0.85}
            >
              <Text style={styles.shareBtnText}>Share Tracking Link</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  scrollContent: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.xxl + 80,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.white,
    borderRadius: Radius.xs,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: Spacing.sm,
    ...Shadows.tier1,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontFamily: FontFamily.regular,
    color: Colors.textDark,
  },
  filterPillsRow: {
    gap: 8,
    paddingVertical: 4,
    marginBottom: Spacing.sm,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: Radius.xs,
    backgroundColor: '#EEEEEE',
  },
  filterPillActive: {
    backgroundColor: Colors.black,
  },
  filterPillText: {
    fontSize: 12,
    fontFamily: FontFamily.medium,
    color: '#5D5F5F',
  },
  filterPillTextActive: {
    color: Colors.white,
    fontFamily: FontFamily.bold,
  },
  syncBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F4F3F3',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.xs,
    marginBottom: Spacing.md,
  },
  syncLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  syncText: {
    fontSize: 11,
    fontFamily: FontFamily.medium,
    color: '#4C4546',
  },
  syncTime: {
    fontSize: 10,
    fontFamily: FontFamily.regular,
    color: '#7E7576',
  },
  cardList: {
    gap: 14,
  },
  shipmentCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xs,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...Shadows.tier1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  cardIdGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  shipmentId: {
    fontSize: 16,
    fontFamily: FontFamily.bold,
    color: Colors.textDark,
  },
  priorityText: {
    fontSize: 11,
    fontFamily: FontFamily.regular,
    color: '#7E7576',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.xs,
  },
  statusPillGreen: {
    backgroundColor: '#85FAA9' + '40',
  },
  statusPillGray: {
    backgroundColor: '#DCDDDD',
  },
  statusPillDelivered: {
    backgroundColor: '#E8E8E8',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusDotGreen: {
    backgroundColor: '#109752',
  },
  statusDotGray: {
    backgroundColor: '#7E7576',
  },
  statusDotDelivered: {
    backgroundColor: '#5D5F5F',
  },
  statusPillText: {
    fontSize: 10,
    fontFamily: FontFamily.bold,
    letterSpacing: 0.5,
  },
  statusTextGreen: {
    color: '#005229',
  },
  statusTextGray: {
    color: '#454747',
  },
  statusTextDelivered: {
    color: '#1A1C1C',
  },
  routeBox: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: Spacing.xs,
  },
  routeGraphic: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  originDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.black,
  },
  routeLine: {
    width: 2,
    height: 22,
    backgroundColor: '#E2E2E2',
    marginVertical: 2,
  },
  destSquare: {
    width: 8,
    height: 8,
    backgroundColor: Colors.black,
    transform: [{ rotate: '45deg' }],
  },
  routeTextCol: {
    flex: 1,
    justifyContent: 'space-between',
  },
  routeStopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stopName: {
    fontSize: 13,
    fontFamily: FontFamily.medium,
    color: Colors.textDark,
  },
  stopSub: {
    fontSize: 11,
    fontFamily: FontFamily.regular,
    color: '#5D5F5F',
  },
  cargoChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  cargoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.xs,
    backgroundColor: '#EEEEEE',
  },
  cargoChipText: {
    fontSize: 11,
    fontFamily: FontFamily.medium,
    color: Colors.textDark,
  },
  checkpointBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    backgroundColor: '#F4F3F3',
    borderRadius: Radius.xs,
    marginTop: 6,
  },
  checkpointLabel: {
    fontSize: 10,
    fontFamily: FontFamily.regular,
    color: '#5D5F5F',
  },
  checkpointValue: {
    fontSize: 12,
    fontFamily: FontFamily.bold,
    color: Colors.textDark,
  },
  confirmedTag: {
    fontSize: 11,
    fontFamily: FontFamily.bold,
    color: '#109752',
  },
  driverRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  driverBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  driverName: {
    fontSize: 12,
    fontFamily: FontFamily.semiBold,
    color: Colors.textDark,
  },
  callIconBtn: {
    width: 28,
    height: 28,
    borderRadius: Radius.xs,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: Spacing.sm,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  trackLiveBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.black,
    paddingVertical: 9,
    borderRadius: Radius.xs,
  },
  trackLiveBtnText: {
    fontSize: 12,
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },
  detailsBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEEEEE',
    paddingVertical: 9,
    borderRadius: Radius.xs,
  },
  detailsBtnFull: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#EEEEEE',
    paddingVertical: 9,
    borderRadius: Radius.xs,
  },
  detailsBtnText: {
    fontSize: 12,
    fontFamily: FontFamily.bold,
    color: Colors.textDark,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 20,
    right: 16,
    zIndex: 40,
  },
  fab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.black,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: Radius.xs,
    ...Shadows.tier3,
  },
  fabText: {
    fontSize: 13,
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: Spacing.lg,
    maxHeight: '80%',
  },
  modalDragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E2E2',
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  modalTitle: {
    fontSize: 17,
    fontFamily: FontFamily.bold,
    color: Colors.textDark,
  },
  modalSub: {
    fontSize: 12,
    fontFamily: FontFamily.regular,
    color: '#5D5F5F',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapContainer: {
    height: 160,
    borderRadius: Radius.xs,
    overflow: 'hidden',
    position: 'relative',
    marginVertical: Spacing.sm,
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  gpsPingPill: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.xs,
  },
  pingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#109752',
  },
  pingText: {
    fontSize: 10,
    fontFamily: FontFamily.bold,
    color: Colors.textDark,
    letterSpacing: 0.5,
  },
  telemetryCards: {
    gap: 8,
    marginVertical: Spacing.sm,
  },
  telemetryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F4F3F3',
    padding: Spacing.sm,
    borderRadius: Radius.xs,
  },
  telemetrySub: {
    fontSize: 10,
    fontFamily: FontFamily.regular,
    color: '#5D5F5F',
  },
  telemetryTitle: {
    fontSize: 12,
    fontFamily: FontFamily.bold,
    color: Colors.textDark,
    marginTop: 2,
  },
  callSmallBtn: {
    backgroundColor: '#E2E2E2',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.xs,
  },
  callSmallText: {
    fontSize: 11,
    fontFamily: FontFamily.bold,
    color: Colors.textDark,
  },
  onScheduleText: {
    fontSize: 11,
    fontFamily: FontFamily.bold,
    color: '#109752',
  },
  shareBtn: {
    backgroundColor: Colors.black,
    paddingVertical: 12,
    borderRadius: Radius.xs,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  shareBtnText: {
    fontSize: 13,
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },
});
