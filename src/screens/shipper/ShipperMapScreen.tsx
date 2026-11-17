import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Polyline, Callout, PROVIDER_GOOGLE } from '../../maps';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';
import { mockShipments, mockTrucks, mockTrips, mockTrackingEvents } from '../../data/mockData';
import { Shipment, Truck, Trip } from '../../types';
import AiEtaModal from '../../components/AiEtaModal';

const INITIAL_REGION = {
  latitude: 28.6139,
  longitude: 77.2090,
  latitudeDelta: 5,
  longitudeDelta: 5,
};

export default function ShipperMapScreen() {
  const { theme } = useTheme();
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState(INITIAL_REGION);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [showTrucks, setShowTrucks] = useState(true);
  const [showShipments, setShowShipments] = useState(true);
  const [mapStyle, setMapStyle] = useState<'standard' | 'satellite'>('standard');
  const [isAiEtaOpen, setIsAiEtaOpen] = useState(false);
  const [etaShipment, setEtaShipment] = useState<Shipment | null>(null);

  const shipmentsOnMap = mockShipments.filter(s => s.status !== 'delivered');
  const trucksOnMap = mockTrucks.filter(t => t.status === 'on_trip');
  const activeTrip = mockTrips[0];

  const handleMarkerPress = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: shipment.pickup.latitude,
        longitude: shipment.pickup.longitude,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      });
    }
  };

  const handleTruckPress = (truck: Truck) => {
    Alert.alert(
      `Truck ${truck.registrationNumber}`,
      `Driver: ${truck.driverName}\nLoad: ${truck.currentLoad}T / ${truck.maxCapacity}T\nStatus: ${truck.status}\nLocation: ${truck.currentLocation.city}`,
      [{ text: 'OK' }]
    );
  };

  const renderRoutePolyline = () => {
    if (!activeTrip || !activeTrip.route.length) return null;
    
    return (
      <Polyline
        coordinates={activeTrip.route.map(r => ({ latitude: r.latitude, longitude: r.longitude }))}
        strokeColor={theme.colors.accent}
        strokeWidth={4}
        geodesic={true}
      />
    );
  };

  const renderPickupMarkers = () => {
    if (!showShipments) return null;
    
    return shipmentsOnMap.map(shipment => (
      <Marker
        key={`pickup-${shipment.id}`}
        coordinate={{ latitude: shipment.pickup.latitude, longitude: shipment.pickup.longitude }}
        title={shipment.pickup.name || shipment.pickup.city}
        description={`Pickup: ${shipment.id}`}
        pinColor={theme.colors.accent}
        onPress={() => handleMarkerPress(shipment)}
      >
        <Callout
          onPress={() => handleMarkerPress(shipment)}
          style={styles.callout}
        >
          <View style={styles.calloutContent}>
            <Text style={[styles.calloutTitle, { color: theme.colors.textPrimary }]}>
              {shipment.pickup.name || shipment.pickup.city}
            </Text>
            <Text style={[styles.calloutSub, { color: theme.colors.textSecondary }]}>
              {shipment.id} • {shipment.weight / 1000}T
            </Text>
            <View style={styles.calloutActions}>
              <TouchableOpacity
                style={[styles.calloutBtn, { backgroundColor: theme.colors.primary }]}
                onPress={() => handleMarkerPress(shipment)}
              >
                <Text style={styles.calloutBtnText}>Track</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Callout>
      </Marker>
    ));
  };

  const renderDeliveryMarkers = () => {
    if (!showShipments) return null;
    
    return shipmentsOnMap.map(shipment => (
      <Marker
        key={`delivery-${shipment.id}`}
        coordinate={{ latitude: shipment.destination.latitude, longitude: shipment.destination.longitude }}
        title={shipment.destination.name || shipment.destination.city}
        description={`Delivery: ${shipment.id}`}
        pinColor={theme.colors.success}
        onPress={() => handleMarkerPress(shipment)}
      >
        <Callout
          onPress={() => handleMarkerPress(shipment)}
          style={styles.callout}
        >
          <View style={styles.calloutContent}>
            <Text style={[styles.calloutTitle, { color: theme.colors.textPrimary }]}>
              {shipment.destination.name || shipment.destination.city}
            </Text>
            <Text style={[styles.calloutSub, { color: theme.colors.textSecondary }]}>
              {shipment.id} • Deadline: {new Date(shipment.deliveryDeadline).toLocaleTimeString()}
            </Text>
          </View>
        </Callout>
      </Marker>
    ));
  };

  const renderTruckMarkers = () => {
    if (!showTrucks) return null;
    
    return trucksOnMap.map(truck => (
      <Marker
        key={`truck-${truck.id}`}
        coordinate={{ latitude: truck.currentLocation.latitude, longitude: truck.currentLocation.longitude }}
        title={truck.registrationNumber}
        description={`Driver: ${truck.driverName}`}
      >
        <View style={styles.truckMarker}>
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: theme.colors.accent,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 2,
              borderColor: '#FFFFFF',
            }}
          >
            <Ionicons name="bus-outline" size={18} color="#FFFFFF" />
          </View>
        </View>
      </Marker>
    ));
  };

  return (
    <>
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={INITIAL_REGION}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation={false}
        showsCompass={true}
        showsScale={true}
        mapType={mapStyle}
        loadingEnabled
      >
        {renderRoutePolyline()}
        {renderPickupMarkers()}
        {renderDeliveryMarkers()}
        {renderTruckMarkers()}
      </MapView>

      {/* Bottom Sheet - Selected Shipment Details */}
      {selectedShipment && (
        <View style={[styles.bottomSheet, { backgroundColor: theme.colors.cardBackground }]}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetContent}>
            <View style={styles.sheetHeader}>
              <View>
                <Text style={[styles.sheetTitle, { color: theme.colors.textPrimary }]}>
                  {selectedShipment.id}
                </Text>
                <Text style={[styles.sheetSubtitle, { color: theme.colors.textSecondary }]}>
                  {selectedShipment.trackingNumber}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setSelectedShipment(null)}
              >
                <Ionicons name="close-outline" size={24} color={theme.colors.textTertiary} />
              </TouchableOpacity>
            </View>

            <View style={styles.routeInfo}>
              <View style={styles.routePoint}>
                <View style={[styles.routeDot, { backgroundColor: theme.colors.accent }]} />
                <Text style={[styles.routeLabel, { color: theme.colors.textPrimary }]}>
                  Pickup: {selectedShipment.pickup.city}
                </Text>
              </View>
              <View style={styles.routeLine} />
              <View style={styles.routePoint}>
                <View style={[styles.routeDot, { backgroundColor: theme.colors.success }]} />
                <Text style={[styles.routeLabel, { color: theme.colors.textPrimary }]}>
                  Delivery: {selectedShipment.destination.city}
                </Text>
              </View>
            </View>

            <View style={styles.detailGrid}>
              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, { color: theme.colors.textTertiary }]}>Status</Text>
                <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
                  {selectedShipment.status.replace('_', ' ').toUpperCase()}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, { color: theme.colors.textTertiary }]}>Weight</Text>
                <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
                  {selectedShipment.weight / 1000}T
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, { color: theme.colors.textTertiary }]}>Priority</Text>
                <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
                  {selectedShipment.priority.toUpperCase()}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, { color: theme.colors.textTertiary }]}>Cost</Text>
                <Text style={[styles.detailValue, { color: theme.colors.accent }]}>
                  ₹{(selectedShipment.cost ?? 0).toLocaleString('en-IN')}
                </Text>
              </View>
            </View>

            <View style={styles.deadlineRow}>
              <Ionicons name="time-outline" size={16} color={theme.colors.warning} />
              <Text style={[styles.deadlineText, { color: theme.colors.textSecondary }]}>
                Deadline: {new Date(selectedShipment.deliveryDeadline).toLocaleString()}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: theme.colors.primary }]}
              onPress={() => {
                setEtaShipment(selectedShipment);
                setIsAiEtaOpen(true);
              }}
            >
              <Ionicons name="sparkles-outline" size={18} color="#FFFFFF" />
              <Text style={styles.actionBtnText}>View AI ETA Prediction</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Top Controls */}
      <View style={styles.topControls}>
        <View style={[styles.controlCard, { backgroundColor: theme.colors.cardBackground }]}>
          <TouchableOpacity
            style={[styles.controlBtn, { backgroundColor: showTrucks ? theme.colors.primary : theme.colors.background }]}
            onPress={() => setShowTrucks(!showTrucks)}
          >
            <Ionicons name="bus-outline" size={20} color={showTrucks ? '#FFFFFF' : theme.colors.textPrimary} />
            <Text style={[styles.controlBtnText, { color: showTrucks ? '#FFFFFF' : theme.colors.textPrimary }]}>
              Trucks
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.controlBtn, { backgroundColor: showShipments ? theme.colors.accent : theme.colors.background }]}
            onPress={() => setShowShipments(!showShipments)}
          >
            <Ionicons name="cube-outline" size={20} color={showShipments ? '#FFFFFF' : theme.colors.textPrimary} />
            <Text style={[styles.controlBtnText, { color: showShipments ? '#FFFFFF' : theme.colors.textPrimary }]}>
              Shipments
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.controlBtn, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, borderWidth: 1 }]}
            onPress={() => setMapStyle(mapStyle === 'standard' ? 'satellite' : 'standard')}
          >
            <Ionicons name={mapStyle === 'standard' ? 'map-outline' : 'layers-outline'} size={20} color={theme.colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Bar */}
      <View style={[styles.statsBar, { bottom: selectedShipment ? 280 : 100 }]}>
        <View style={[styles.statItem, { backgroundColor: theme.colors.cardBackground }]}>
          <Text style={[styles.statVal, { color: theme.colors.accent }]}>{shipmentsOnMap.length}</Text>
          <Text style={[styles.statLbl, { color: theme.colors.textSecondary }]}>Active Shipments</Text>
        </View>
        <View style={[styles.statItem, { backgroundColor: theme.colors.cardBackground }]}>
          <Text style={[styles.statVal, { color: theme.colors.primary }]}>{trucksOnMap.length}</Text>
          <Text style={[styles.statLbl, { color: theme.colors.textSecondary }]}>Trucks on Road</Text>
        </View>
        <View style={[styles.statItem, { backgroundColor: theme.colors.cardBackground }]}>
          <Text style={[styles.statVal, { color: theme.colors.success }]}>
            {Math.round(shipmentsOnMap.filter(s => s.status === 'in_transit').length / Math.max(1, shipmentsOnMap.length) * 100)}%
          </Text>
          <Text style={[styles.statLbl, { color: theme.colors.textSecondary }]}>In Transit</Text>
        </View>
      </View>
    </SafeAreaView>

    {/* AI ETA Modal — outside SafeAreaView so it overlays the full screen */}
    {isAiEtaOpen && etaShipment && (
      <AiEtaModal
        visible={isAiEtaOpen}
        shipment={etaShipment}
        onClose={() => {
          setIsAiEtaOpen(false);
          setEtaShipment(null);
        }}
      />
    )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  topControls: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    zIndex: 10,
  },
  controlCard: {
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
      android: { elevation: 4 },
    }),
  },
  controlBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  controlBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statsBar: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  statItem: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
      android: { elevation: 4 },
    }),
  },
  statVal: {
    fontSize: 18,
    fontWeight: '800',
  },
  statLbl: {
    fontSize: 10,
    marginTop: 2,
    textAlign: 'center',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 30,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.15, shadowRadius: 16 },
      android: { elevation: 12 },
    }),
  },
  sheetHandle: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#CCCCCC',
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  sheetContent: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  sheetSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  routeInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingLeft: 14,
    borderLeftWidth: 2,
    borderLeftColor: '#E5E7EB',
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  routeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  routeLine: {
    width: 2,
    height: 24,
    backgroundColor: '#E5E7EB',
    marginLeft: 5,
  },
  routeLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  detailItem: {
    flex: 1,
    minWidth: '45%',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#F8F9FA',
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  deadlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#FFF8E1',
    marginBottom: 16,
  },
  deadlineText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  callout: {
    width: 200,
  },
  calloutContent: {
    padding: 8,
  },
  calloutTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  calloutSub: {
    fontSize: 11,
    marginBottom: 8,
  },
  calloutActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  calloutBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  calloutBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  truckMarker: {
    // Custom marker view
  },
});