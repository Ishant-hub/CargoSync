/**
 * FleetMapScreen — Live Fleet Map
 * Stitch source of truth: "Fleet Ops Hub — Uber Style" (767cfeb807404e75b80d6978223a2ba4)
 * Design language: DriverNavigationScreen (63db5323f1154a22857e105bf7ecb895)
 *
 * ⚠ PROTOTYPE DATA — real GPS not yet implemented.
 * All truck positions and routes use mock data from mockData.ts.
 */
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from '../../maps';
import { Colors, FontFamily, Spacing, Radius, Shadows } from '../../theme/tokens';
import { useLanguage } from '../../context/LanguageContext';
import { mockTrucks, mockTrips, mockShipments } from '../../data/mockData';
import { Truck, Trip } from '../../types';

const INITIAL_REGION = {
  latitude: 28.6139,
  longitude: 77.209,
  latitudeDelta: 7,
  longitudeDelta: 7,
};

type FilterStatus = 'all' | 'on_trip' | 'available';

export default function FleetMapScreen() {
  const navigation = useNavigation<any>();
  const { language, setLanguage } = useLanguage();
  const mapRef = useRef<any>(null);

  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [selectedTruck, setSelectedTruck] = useState<Truck | null>(null);
  const [showTrips, setShowTrips] = useState(true);

  const trucksOnMap = mockTrucks.filter(t =>
    filterStatus === 'all' ? true : t.status === filterStatus
  );
  const activeTrips = mockTrips.filter(t => t.status === 'in_progress');

  const onTruckPress = (truck: Truck) => {
    setSelectedTruck(truck);
    mapRef.current?.animateToRegion({
      latitude: truck.currentLocation.latitude,
      longitude: truck.currentLocation.longitude,
      latitudeDelta: 0.6,
      longitudeDelta: 0.6,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_trip': return '#F0820D';
      case 'available': return '#109752';
      case 'loading': return '#D97706';
      default: return '#6B7280';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'on_trip': return 'ON HIGHWAY';
      case 'available': return 'AT HUB';
      case 'loading': return 'LOADING';
      default: return status.toUpperCase();
    }
  };

  const fleetCount = mockTrucks.length;
  const onTripCount = mockTrucks.filter(t => t.status === 'on_trip').length;
  const availableCount = mockTrucks.filter(t => t.status === 'available').length;
  const avgUtilisation = Math.round(
    mockTrucks.reduce((s, t) => s + t.currentLoad / t.maxCapacity, 0) / mockTrucks.length * 100
  );

  const selectedTrip = selectedTruck?.currentTripId
    ? mockTrips.find(t => t.id === selectedTruck.currentTripId)
    : undefined;

  return (
    <SafeAreaView style={styles.safeArea} edges={[]}>
      {/* ── Full-Bleed Map ─────────────────────────────────────────────── */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={INITIAL_REGION}
        showsUserLocation={false}
        showsCompass
        loadingEnabled
      >
        {/* Route Polylines */}
        {showTrips && activeTrips.map(trip =>
          trip.route.length > 1 ? (
            <Polyline
              key={trip.id}
              coordinates={trip.route.map(r => ({ latitude: r.latitude, longitude: r.longitude }))}
              strokeColor="#F0820D"
              strokeWidth={3}
            />
          ) : null
        )}

        {/* Truck Markers */}
        {trucksOnMap.map(truck => (
          <Marker
            key={truck.id}
            coordinate={{
              latitude: truck.currentLocation.latitude,
              longitude: truck.currentLocation.longitude,
            }}
            onPress={() => onTruckPress(truck)}
          >
            <View
              style={[
                styles.truckMarker,
                { backgroundColor: getStatusColor(truck.status) },
              ]}
            >
              <MaterialIcons name="local-shipping" size={16} color="#FFFFFF" />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* ── Dark Top Header ───────────────────────────────────────────── */}
      <View style={styles.topHeader}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <View style={styles.headerTitleRow}>
              <Text style={styles.headerTitle}>Fleet Live Map</Text>
              <View style={styles.demoBadge}>
                <Text style={styles.demoBadgeText}>PROTOTYPE DATA</Text>
              </View>
            </View>
            <Text style={styles.headerSub}>{fleetCount} trucks tracked · Mock positions</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.langPill}>
            <TouchableOpacity
              onPress={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            >
              <Text style={styles.langPillText}>EN | हिंदी</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ── Filter + Toggle Controls ──────────────────────────────────── */}
      <View style={styles.controlsBar}>
        <View style={styles.controlCard}>
          {(['all', 'on_trip', 'available'] as FilterStatus[]).map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.filterBtn, filterStatus === f && styles.filterBtnActive]}
              onPress={() => setFilterStatus(f)}
            >
              <Text style={[styles.filterBtnText, filterStatus === f && styles.filterBtnTextActive]}>
                {f === 'all' ? 'All' : f === 'on_trip' ? 'On Trip' : 'Available'}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[styles.toggleIconBtn, showTrips && styles.toggleIconBtnActive]}
            onPress={() => setShowTrips(!showTrips)}
          >
            <MaterialIcons
              name="alt-route"
              size={17}
              color={showTrips ? '#FFFFFF' : '#5D5F5F'}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Stats Strip ──────────────────────────────────────────────── */}
      <View style={styles.statsStrip}>
        {[
          { label: 'Total Fleet', value: `${fleetCount}`, color: '#000000' },
          { label: 'On Highway', value: `${onTripCount}`, color: '#F0820D' },
          { label: 'Available', value: `${availableCount}`, color: '#109752' },
          { label: 'Avg Util.', value: `${avgUtilisation}%`, color: '#3B82F6' },
        ].map(item => (
          <View key={item.label} style={styles.statItem}>
            <Text style={[styles.statValue, { color: item.color }]}>{item.value}</Text>
            <Text style={styles.statLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      {/* ── Disclaimer Banner ────────────────────────────────────────── */}
      <View style={styles.disclaimerBanner}>
        <MaterialIcons name="info-outline" size={14} color="#D97706" />
        <Text style={styles.disclaimerText}>
          Prototype data only — real-time GPS tracking requires backend integration.
        </Text>
      </View>

      {/* ── Bottom Sheet (Selected Truck) ─────────────────────────── */}
      {selectedTruck && (
        <View style={styles.bottomSheet}>
          <View style={styles.sheetHandle} />
          <ScrollView contentContainerStyle={styles.sheetContent} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.sheetHeader}>
              <View>
                <Text style={styles.sheetTitle}>{selectedTruck.registrationNumber}</Text>
                <Text style={styles.sheetSubtitle}>{selectedTruck.type} · {selectedTruck.driverName}</Text>
              </View>
              <TouchableOpacity style={styles.sheetCloseBtn} onPress={() => setSelectedTruck(null)}>
                <MaterialIcons name="close" size={22} color="#5D5F5F" />
              </TouchableOpacity>
            </View>

            {/* Status Badge */}
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: getStatusColor(selectedTruck.status) + '20',
                  borderColor: getStatusColor(selectedTruck.status),
                },
              ]}
            >
              <Text style={[styles.statusBadgeText, { color: getStatusColor(selectedTruck.status) }]}>
                {getStatusLabel(selectedTruck.status)}
              </Text>
            </View>

            {/* Capacity Bar */}
            <View style={styles.capacitySection}>
              <Text style={styles.sheetSectionTitle}>PAYLOAD CAPACITY</Text>
              <View style={styles.capacityTrack}>
                <View
                  style={[
                    styles.capacityFill,
                    {
                      width: `${(selectedTruck.currentLoad / selectedTruck.maxCapacity) * 100}%`,
                    },
                  ]}
                />
              </View>
              <View style={styles.capacityLabels}>
                <Text style={styles.capacityLabelLeft}>
                  {selectedTruck.currentLoad}T / {selectedTruck.maxCapacity}T
                </Text>
                <Text style={styles.capacityLabelRight}>
                  {selectedTruck.availableCapacity}T Available
                </Text>
              </View>
            </View>

            {/* Active Trip Info */}
            {selectedTrip && (
              <View style={styles.tripInfoBox}>
                <Text style={styles.sheetSectionTitle}>ACTIVE TRIP</Text>
                <View style={styles.tripRouteRow}>
                  <View style={[styles.routeDot, { backgroundColor: '#F0820D' }]} />
                  <Text style={styles.routeCity}>{selectedTrip.origin?.city ?? '—'}</Text>
                  <MaterialIcons name="arrow-forward" size={15} color="#5D5F5F" />
                  <Text style={styles.routeCity}>{selectedTrip.destination?.city ?? '—'}</Text>
                  <View style={[styles.routeDot, { backgroundColor: '#109752' }]} />
                </View>
                <View style={styles.tripMetaRow}>
                  <View style={styles.tripMetaItem}>
                    <Text style={styles.tripMetaLabel}>SHIPMENTS</Text>
                    <Text style={styles.tripMetaValue}>{selectedTrip.shipmentIds.length}</Text>
                  </View>
                  <View style={styles.tripMetaItem}>
                    <Text style={styles.tripMetaLabel}>STOPS</Text>
                    <Text style={styles.tripMetaValue}>
                      {selectedTrip.stops.filter(s => s.completed).length}/{selectedTrip.stops.length}
                    </Text>
                  </View>
                  <View style={styles.tripMetaItem}>
                    <Text style={styles.tripMetaLabel}>DISTANCE</Text>
                    <Text style={styles.tripMetaValue}>{selectedTrip.distanceKm} km</Text>
                  </View>
                  <View style={styles.tripMetaItem}>
                    <Text style={styles.tripMetaLabel}>ETA</Text>
                    <Text style={styles.tripMetaValue}>
                      {new Date(selectedTrip.plannedEta).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Location */}
            <View style={styles.locationRow}>
              <MaterialIcons name="place" size={18} color="#F0820D" />
              <View style={{ flex: 1 }}>
                <Text style={styles.locationCity}>
                  {selectedTruck.currentLocation.city}, {selectedTruck.currentLocation.state}
                </Text>
                <Text style={styles.locationAddress}>{selectedTruck.currentLocation.address}</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={styles.primaryActionBtn}
                onPress={() =>
                  Alert.alert(
                    'Re-Optimise',
                    `Running re-optimisation for ${selectedTruck.registrationNumber}…\n\nThis will re-evaluate load consolidation opportunities and update the driver's manifest.`
                  )
                }
                activeOpacity={0.85}
              >
                <MaterialIcons name="sync" size={18} color="#FFFFFF" />
                <Text style={styles.primaryActionText}>Re-Optimise Load</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryActionBtn}
                onPress={() =>
                  Alert.alert(
                    'Truck Details',
                    `${selectedTruck.registrationNumber}\n\nReal diagnostics require backend integration.\nThis is prototype data.`
                  )
                }
                activeOpacity={0.85}
              >
                <MaterialIcons name="info-outline" size={18} color="#000000" />
                <Text style={styles.secondaryActionText}>Details</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },

  // Dark Top Header
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingTop: Platform.OS === 'ios' ? 54 : 36,
    paddingBottom: 10,
    backgroundColor: 'rgba(0,0,0,0.75)',
    gap: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  demoBadge: {
    backgroundColor: '#D97706',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  demoBadgeText: {
    fontFamily: FontFamily.bold,
    fontSize: 8,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  headerSub: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 1,
  },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  langPill: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
  },
  langPillText: {
    fontFamily: FontFamily.medium,
    fontSize: 11,
    color: '#FFFFFF',
  },

  // Filter Controls
  controlsBar: {
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  controlCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: Radius.sm,
    padding: 4,
    gap: 4,
    ...Shadows.tier2,
  },
  filterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.xs,
  },
  filterBtnActive: { backgroundColor: '#000000' },
  filterBtnText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
    color: '#5D5F5F',
  },
  filterBtnTextActive: { color: '#FFFFFF' },
  toggleIconBtn: {
    width: 34,
    height: 34,
    borderRadius: Radius.xs,
    backgroundColor: '#F4F3F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
  },
  toggleIconBtnActive: { backgroundColor: '#000000' },

  // Stats Strip
  statsStrip: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    gap: 8,
  },
  statItem: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: Radius.xs,
    paddingVertical: 8,
    alignItems: 'center',
    ...Shadows.tier1,
  },
  statValue: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
  },
  statLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 9,
    color: '#5D5F5F',
    marginTop: 2,
    textAlign: 'center',
  },

  // Disclaimer
  disclaimerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginHorizontal: 14,
    marginTop: 6,
    backgroundColor: 'rgba(255,251,235,0.95)',
    borderRadius: Radius.xs,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  disclaimerText: {
    fontFamily: FontFamily.regular,
    fontSize: 10,
    color: '#92400E',
    flex: 1,
  },

  // Truck Marker
  truckMarker: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4 },
      android: { elevation: 4 },
    }),
  },

  // Bottom Sheet
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '62%',
    ...Shadows.tier3,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CCCCCC',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
  sheetContent: {
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: 24,
    gap: 12,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 4,
  },
  sheetTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 18,
    color: '#000000',
  },
  sheetSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: '#5D5F5F',
    marginTop: 2,
  },
  sheetCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F4F3F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.xs,
    borderWidth: 1,
  },
  statusBadgeText: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    letterSpacing: 0.5,
  },

  // Capacity
  capacitySection: { gap: 5 },
  sheetSectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 9,
    color: '#5D5F5F',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  capacityTrack: {
    height: 7,
    backgroundColor: '#EEEEEE',
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  capacityFill: {
    height: '100%',
    backgroundColor: '#000000',
    borderRadius: Radius.full,
  },
  capacityLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  capacityLabelLeft: {
    fontFamily: FontFamily.regular,
    fontSize: 10,
    color: '#5D5F5F',
  },
  capacityLabelRight: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: '#F0820D',
  },

  // Trip Info
  tripInfoBox: {
    backgroundColor: '#F4F3F3',
    borderRadius: Radius.xs,
    padding: 10,
    gap: 8,
  },
  tripRouteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  routeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  routeCity: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: '#000000',
    flex: 1,
  },
  tripMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tripMetaItem: { alignItems: 'center' },
  tripMetaLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 9,
    color: '#5D5F5F',
    letterSpacing: 0.5,
  },
  tripMetaValue: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: '#000000',
    marginTop: 2,
  },

  // Location
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#F4F3F3',
    borderRadius: Radius.xs,
    padding: 10,
  },
  locationCity: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: '#000000',
  },
  locationAddress: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#5D5F5F',
    marginTop: 2,
  },

  // Actions
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  primaryActionBtn: {
    flex: 1,
    height: 44,
    backgroundColor: '#000000',
    borderRadius: Radius.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  primaryActionText: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: '#FFFFFF',
  },
  secondaryActionBtn: {
    paddingHorizontal: 16,
    height: 44,
    backgroundColor: '#EEEEEE',
    borderRadius: Radius.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  secondaryActionText: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: '#000000',
  },
});
