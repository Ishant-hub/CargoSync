import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Polyline, Callout, PROVIDER_GOOGLE } from '../../maps';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';
import { mockTrips, mockTrucks, mockTrackingEvents } from '../../data/mockData';
import { Trip, TripStop, Truck } from '../../types';

const INITIAL_REGION = {
  latitude: 28.6139,
  longitude: 77.2090,
  latitudeDelta: 3,
  longitudeDelta: 3,
};

export default function DriverMapScreen() {
  const { theme } = useTheme();
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState(INITIAL_REGION);
  const [trip] = useState(mockTrips[0]);
  const [selectedStop, setSelectedStop] = useState<TripStop | null>(null);
  const [followMode, setFollowMode] = useState(true);
  const [mapStyle, setMapStyle] = useState<'standard' | 'satellite'>('standard');

  const truck = mockTrucks.find(t => t.id === trip.truckId);
  const nextStop = trip.stops.find(s => !s.completed);
  const completedStops = trip.stops.filter(s => s.completed);

  const handleStopPress = (stop: TripStop) => {
    setSelectedStop(stop);
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: stop.location.latitude,
        longitude: stop.location.longitude,
        latitudeDelta: 0.3,
        longitudeDelta: 0.3,
      });
    }
  };

  const renderRoutePolyline = () => {
    if (!trip.route.length) return null;
    
    // Split route into completed and remaining segments
    const completedCoords = trip.route.slice(0, Math.ceil(trip.route.length * (completedStops.length / trip.stops.length)));
    const remainingCoords = trip.route.slice(Math.ceil(trip.route.length * (completedStops.length / trip.stops.length)));
    
    return (
      <>
        {/* Completed portion - green */}
        <Polyline
          coordinates={completedCoords.map(r => ({ latitude: r.latitude, longitude: r.longitude }))}
          strokeColor={theme.colors.success}
          strokeWidth={5}
          geodesic={true}
        />
        {/* Remaining portion - accent */}
        <Polyline
          coordinates={remainingCoords.map(r => ({ latitude: r.latitude, longitude: r.longitude }))}
          strokeColor={theme.colors.accent}
          strokeWidth={5}
          geodesic={true}
        />
      </>
    );
  };

  const renderStopMarkers = () => {
    return trip.stops.map((stop, index) => (
      <Marker
        key={stop.id}
        coordinate={{ latitude: stop.location.latitude, longitude: stop.location.longitude }}
        title={stop.location.name || stop.location.city}
        description={`${stop.type.toUpperCase()} • Stop ${index + 1}`}
        pinColor={stop.completed ? theme.colors.success : (nextStop?.id === stop.id ? theme.colors.accent : theme.colors.warning)}
        onPress={() => handleStopPress(stop)}
      >
        <Callout
          onPress={() => handleStopPress(stop)}
          style={styles.callout}
        >
          <View style={styles.calloutContent}>
            <View style={styles.calloutHeader}>
              <View style={[
                styles.stopTypeBadge,
                { backgroundColor: stop.type === 'pickup' ? theme.colors.primaryLight : theme.colors.successLight }
              ]}>
                <Text style={[
                  styles.stopTypeBadgeText,
                  { color: stop.type === 'pickup' ? theme.colors.primary : theme.colors.success }
                ]}>
                  {stop.type.toUpperCase()}
                </Text>
              </View>
              <Text style={[styles.stopNumber, { color: theme.colors.textTertiary }]}>
                Stop {index + 1} of {trip.stops.length}
              </Text>
            </View>
            <Text style={[styles.calloutTitle, { color: theme.colors.textPrimary }]}>
              {stop.location.name || stop.location.city}
            </Text>
            <Text style={[styles.calloutSub, { color: theme.colors.textSecondary }]}>
              {stop.location.address}
            </Text>
            <View style={styles.calloutMeta}>
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={14} color={theme.colors.textTertiary} />
                <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
                  {new Date(stop.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
              {stop.shipmentId && (
                <View style={styles.metaItem}>
                  <Ionicons name="cube-outline" size={14} color={theme.colors.accent} />
                  <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
                    {stop.shipmentId}
                  </Text>
                </View>
              )}
            </View>
            {!stop.completed && (
              <TouchableOpacity
                style={[styles.calloutBtn, { backgroundColor: theme.colors.accent }]}
                onPress={() => Alert.alert('Navigate', `Start turn-by-turn to ${stop.location.name}`)}
              >
                <Text style={styles.calloutBtnText}>Start Navigation</Text>
              </TouchableOpacity>
            )}
            {stop.completed && (
              <View style={styles.completedBadge}>
                <Ionicons name="checkmark-circle" size={14} color={theme.colors.success} />
                <Text style={[styles.completedText, { color: theme.colors.success }]}>Completed</Text>
              </View>
            )}
          </View>
        </Callout>
      </Marker>
    ));
  };

  const renderTruckMarker = () => {
    if (!truck) return null;
    
    return (
      <Marker
        coordinate={{ latitude: truck.currentLocation.latitude, longitude: truck.currentLocation.longitude }}
        title={truck.registrationNumber}
        description={`Driver: ${truck.driverName} • ${truck.currentLoad}T/${truck.maxCapacity}T`}
        anchor={{ x: 0.5, y: 0.5 }}
      >
        <View style={styles.truckMarkerContainer}>
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: theme.colors.accent,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 3,
              borderColor: '#FFFFFF',
              ...Platform.select({
                ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 6 },
                android: { elevation: 6 },
              }),
            }}
          >
            <Ionicons name="navigate-outline" size={24} color="#FFFFFF" />
          </View>
          {followMode && (
            <View style={styles.pulseRing} />
          )}
        </View>
      </Marker>
    );
  };

  // Simulate truck movement (in real app, this would come from WebSocket/location updates)
  useEffect(() => {
    if (!followMode || !truck) return;
    
    const interval = setInterval(() => {
      // In real app: fetch live location from tracking service
      // For demo, we just keep the region centered
    }, 5000);
    
    return () => clearInterval(interval);
  }, [followMode, truck]);

  return (
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
        rotateEnabled={false}
      >
        {renderRoutePolyline()}
        {renderStopMarkers()}
        {renderTruckMarker()}
      </MapView>

      {/* Bottom Sheet - Next Stop / Selected Stop */}
      <View style={[styles.bottomSheet, { backgroundColor: theme.colors.cardBackground }]}>
        <View style={styles.sheetHandle} />
        <View style={styles.sheetContent}>
          {selectedStop ? (
            // Selected stop details
            <>
              <View style={styles.sheetHeader}>
                <View>
                  <View style={[
                    styles.stopTypeBadge,
                    { backgroundColor: selectedStop.type === 'pickup' ? theme.colors.primaryLight : theme.colors.successLight }
                  ]}>
                    <Text style={[
                      styles.stopTypeBadgeText,
                      { color: selectedStop.type === 'pickup' ? theme.colors.primary : theme.colors.success }
                    ]}>
                      {selectedStop.type.toUpperCase()}
                    </Text>
                  </View>
                  <Text style={[styles.sheetTitle, { color: theme.colors.textPrimary }]}>
                    {selectedStop.location.name || selectedStop.location.city}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={() => setSelectedStop(null)}
                >
                  <Ionicons name="close-outline" size={24} color={theme.colors.textTertiary} />
                </TouchableOpacity>
              </View>

              <Text style={[styles.calloutSub, { color: theme.colors.textSecondary }]}>
                {selectedStop.location.address}
              </Text>

              <View style={styles.stopDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="time-outline" size={18} color={theme.colors.accent} />
                  <View>
                    <Text style={[styles.detailLabel, { color: theme.colors.textTertiary }]}>Scheduled</Text>
                    <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
                      {new Date(selectedStop.scheduledTime).toLocaleString()}
                    </Text>
                  </View>
                </View>
                {selectedStop.shipmentId && (
                  <View style={styles.detailRow}>
                    <Ionicons name="cube-outline" size={18} color={theme.colors.accent} />
                    <View>
                      <Text style={[styles.detailLabel, { color: theme.colors.textTertiary }]}>Consignment</Text>
                      <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
                        {selectedStop.shipmentId}
                      </Text>
                    </View>
                  </View>
                )}
                {selectedStop.actualTime && (
                  <View style={styles.detailRow}>
                    <Ionicons name="checkmark-circle-outline" size={18} color={theme.colors.success} />
                    <View>
                      <Text style={[styles.detailLabel, { color: theme.colors.textTertiary }]}>Completed</Text>
                      <Text style={[styles.detailValue, { color: theme.colors.success }]}>
                        {new Date(selectedStop.actualTime).toLocaleString()}
                      </Text>
                    </View>
                  </View>
                )}
              </View>

              {!selectedStop.completed && (
                <TouchableOpacity
                  style={[styles.primaryActionBtn, { backgroundColor: theme.colors.accent }]}
                  onPress={() => Alert.alert('Navigation Started', `Turn-by-turn guidance to ${selectedStop.location.name} activated.`)}
                >
                  <Ionicons name="navigate-outline" size={20} color="#FFFFFF" />
                  <Text style={styles.primaryActionBtnText}>Start Turn-by-Turn Navigation</Text>
                </TouchableOpacity>
              )}

              {selectedStop.type === 'pickup' && !selectedStop.completed && (
                <TouchableOpacity
                  style={[styles.secondaryActionBtn, { borderColor: theme.colors.primary }]}
                  onPress={() => Alert.alert('Cargo Verified', 'Pickup confirmed. Load updated.')}
                >
                  <Ionicons name="checkmark-circle-outline" size={20} color={theme.colors.primary} />
                  <Text style={styles.secondaryActionBtnText}>Confirm Cargo Loaded</Text>
                </TouchableOpacity>
              )}

              {selectedStop.type === 'delivery' && !selectedStop.completed && (
                <TouchableOpacity
                  style={[styles.primaryActionBtn, { backgroundColor: theme.colors.success }]}
                  onPress={() => Alert.alert('Delivered', 'Consignment marked as delivered. Digital signature captured.')}
                >
                  <Ionicons name="checkmark-done-outline" size={20} color="#FFFFFF" />
                  <Text style={styles.primaryActionBtnText}>Mark as Delivered</Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            // Next stop summary
            <>
              <View style={styles.nextStopHeader}>
                <View style={[
                  styles.nextBadge,
                  { backgroundColor: nextStop?.type === 'pickup' ? theme.colors.primary : theme.colors.success }
                ]}>
                  <Text style={styles.nextBadgeText}>NEXT STOP</Text>
                </View>
                <Text style={[styles.stopNumber, { color: theme.colors.textTertiary }]}>
                  Stop {trip.stops.findIndex(s => s.id === nextStop?.id) + 1} of {trip.stops.length}
                </Text>
              </View>

              <Text style={[styles.sheetTitle, { color: theme.colors.textPrimary }]}>
                {nextStop?.location.name || nextStop?.location.city}
              </Text>
              <Text style={[styles.calloutSub, { color: theme.colors.textSecondary }]}>
                {nextStop?.location.address}
              </Text>

              <View style={styles.stopDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="time-outline" size={18} color={theme.colors.accent} />
                  <View>
                    <Text style={[styles.detailLabel, { color: theme.colors.textTertiary }]}>Scheduled</Text>
                    <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
                      {nextStop ? new Date(nextStop.scheduledTime).toLocaleString() : '—'}
                    </Text>
                  </View>
                </View>
                {nextStop?.shipmentId && (
                  <View style={styles.detailRow}>
                    <Ionicons name="cube-outline" size={18} color={theme.colors.accent} />
                    <View>
                      <Text style={[styles.detailLabel, { color: theme.colors.textTertiary }]}>Consignment</Text>
                      <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
                        {nextStop.shipmentId}
                      </Text>
                    </View>
                  </View>
                )}
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={[styles.primaryActionBtn, { backgroundColor: theme.colors.accent }]}
                  onPress={() => Alert.alert('Navigation Started', `Turn-by-turn guidance to ${nextStop?.location.name} activated.`)}
                >
                  <Ionicons name="navigate-outline" size={20} color="#FFFFFF" />
                  <Text style={styles.primaryActionBtnText}>Navigate</Text>
                </TouchableOpacity>
                {nextStop?.type === 'pickup' && (
                  <TouchableOpacity
                    style={[styles.secondaryActionBtn, { borderColor: theme.colors.primary }]}
                    onPress={() => Alert.alert('Cargo Verified', 'Pickup confirmed. Load updated.')}
                  >
                    <Ionicons name="checkmark-circle-outline" size={20} color={theme.colors.primary} />
                    <Text style={styles.secondaryActionBtnText}>Confirm Load</Text>
                  </TouchableOpacity>
                )}
                {nextStop?.type === 'delivery' && (
                  <TouchableOpacity
                    style={[styles.primaryActionBtn, { backgroundColor: theme.colors.success }]}
                    onPress={() => Alert.alert('Delivered', 'Consignment marked as delivered.')}
                  >
                    <Ionicons name="checkmark-done-outline" size={20} color="#FFFFFF" />
                    <Text style={styles.primaryActionBtnText}>Deliver</Text>
                  </TouchableOpacity>
                )}
              </View>
            </>
          )}
        </View>
      </View>

      {/* Top Controls */}
      <View style={styles.topControls}>
        <View style={[styles.controlCard, { backgroundColor: theme.colors.cardBackground }]}>
          <TouchableOpacity
            style={[styles.controlBtn, { backgroundColor: followMode ? theme.colors.primary : theme.colors.background }]}
            onPress={() => setFollowMode(!followMode)}
          >
            <Ionicons name={followMode ? 'location' : 'location-outline'} size={20} color={followMode ? '#FFFFFF' : theme.colors.textPrimary} />
            <Text style={[styles.controlBtnText, { color: followMode ? '#FFFFFF' : theme.colors.textPrimary }]}>
              Follow
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.controlBtn, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, borderWidth: 1 }]}
            onPress={() => {
              if (mapRef.current && truck) {
                mapRef.current.animateToRegion({
                  latitude: truck.currentLocation.latitude,
                  longitude: truck.currentLocation.longitude,
                  latitudeDelta: 0.3,
                  longitudeDelta: 0.3,
                });
              }
            }}
          >
            <Ionicons name='navigate-outline' size={20} color={theme.colors.textPrimary} />
            <Text style={[styles.controlBtnText, { color: theme.colors.textPrimary }]}>Recenter</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.controlBtn, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, borderWidth: 1 }]}
            onPress={() => setMapStyle(mapStyle === 'standard' ? 'satellite' : 'standard')}
          >
            <Ionicons name={mapStyle === 'standard' ? 'map-outline' : 'layers-outline'} size={20} color={theme.colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Trip Progress Bar */}
      <View style={[styles.progressBar, { bottom: selectedStop ? 280 : 0 }]}>
        <View style={[styles.progressTrack, { backgroundColor: theme.colors.surfacePressed }]}>
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: theme.colors.accent,
                width: `${(completedStops.length / trip.stops.length) * 100}%`,
              },
            ]}
          />
        </View>
        <View style={styles.progressLabels}>
          <Text style={[styles.progressLabel, { color: theme.colors.textSecondary }]}>
            Start: {trip.origin?.city}
          </Text>
          <Text style={[styles.progressLabel, { color: theme.colors.accent, fontWeight: '700' }]}>
            {completedStops.length}/{trip.stops.length} Stops
          </Text>
          <Text style={[styles.progressLabel, { color: theme.colors.textSecondary, textAlign: 'right' }]}>
            End: {trip.destination?.city}
          </Text>
        </View>
      </View>
    </SafeAreaView>
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
  closeBtn: {
    padding: 4,
  },
  nextStopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  nextBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  nextBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  stopTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 4,
    alignSelf: 'flex-start',
  },
  stopTypeBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  stopNumber: {
    fontSize: 11,
    fontWeight: '600',
  },
  callout: {
    width: 240,
  },
  calloutContent: {
    padding: 8,
  },
  calloutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
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
  calloutMeta: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(150,150,150,0.3)',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
  },
  calloutBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  calloutBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  completedText: {
    fontSize: 12,
    fontWeight: '600',
  },
  truckMarkerContainer: {
    // Custom marker
  },
  pulseRing: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#F0820D', // accent color fallback
    // Animation would be added with Animated API
  },
  stopDetails: {
    marginVertical: 16,
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#F8F9FA', // surfacePressed fallback
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  primaryActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  primaryActionBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  secondaryActionBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  progressBar: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    zIndex: 10,
    paddingHorizontal: 4,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    paddingHorizontal: 4,
  },
  progressLabel: {
    fontSize: 11,
  },
});