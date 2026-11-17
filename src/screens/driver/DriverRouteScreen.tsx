import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';
import { useAuth } from '../../context/AuthContext';
import { mockTrips, mockTrackingEvents } from '../../data/mockData';
import { Trip, TripStop } from '../../types';
import {
  StatusBadge,
  CapacityBar,
  SectionHeader,
  PrimaryButton,
  SecondaryButton,
  AlertCard,
} from '../../components';
import { formatTime, formatDate } from '../../data/mockData';

export default function DriverRouteScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [trip] = useState(mockTrips[0]);
  const [expandedStops, setExpandedStops] = useState<string[]>([]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const toggleStop = (stopId: string) => {
    setExpandedStops(prev => prev.includes(stopId)
      ? prev.filter(id => id !== stopId)
      : [...prev, stopId]
    );
  };

  const handleAction = (stop: TripStop, action: 'navigate' | 'pickup' | 'deliver') => {
    const messages = {
      navigate: `Turn-by-turn navigation to ${stop.location.name} started. ETA: 22 min.`,
      pickup: `Cargo verified at ${stop.location.name}. Load updated: +${stop.shipmentId ? '2.1T' : '0T'}.`,
      deliver: `Delivery confirmed at ${stop.location.name}. Digital signature captured.`,
    };
    Alert.alert(
      action === 'navigate' ? 'Navigation' : action === 'pickup' ? 'Pickup Confirmed' : 'Delivered',
      messages[action],
      [{ text: 'OK' }]
    );
  };

  const nextStop = trip.stops.find(s => !s.completed);
  const completedCount = trip.stops.filter(s => s.completed).length;
  const progress = (completedCount / trip.stops.length) * 100;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.cardBackground, borderBottomColor: theme.colors.border }]}>
        <View>
          <Text style={[styles.tripTag, { color: theme.colors.textTertiary }]}>CURRENT MANIFEST</Text>
          <Text style={[styles.tripId, { color: theme.colors.textPrimary }]}>{trip.id}</Text>
        </View>
        <StatusBadge status={trip.status} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.accent}
          />
        }
      >
        {/* Route Overview */}
        <View style={[styles.routeCard, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.cardBorder }]}>
          <View style={styles.routeHeader}>
            <View style={styles.routePoint}>
              <View style={[styles.routeDot, { backgroundColor: theme.colors.accent }]} />
              <Text style={[styles.routeLabel, { color: theme.colors.textTertiary }]}>ORIGIN</Text>
              <Text style={[styles.routeCity, { color: theme.colors.textPrimary }]}>{trip.origin?.city}</Text>
            </View>
            <View style={styles.routeLineContainer}>
              <View style={[styles.routeLine, { backgroundColor: theme.colors.accent }]} />
            </View>
            <View style={styles.routePoint}>
              <View style={[styles.routeDot, { backgroundColor: theme.colors.success }]} />
              <Text style={[styles.routeLabel, { color: theme.colors.textTertiary }]}>DESTINATION</Text>
              <Text style={[styles.routeCity, { color: theme.colors.textPrimary }]}>{trip.destination?.city}</Text>
            </View>
          </View>

          <View style={styles.routeMeta}>
            <View style={styles.metaItem}>
              <Text style={[styles.metaLabel, { color: theme.colors.textTertiary }]}>DISTANCE</Text>
              <Text style={[styles.metaValue, { color: theme.colors.textPrimary }]}>{trip.distanceKm} km</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={[styles.metaLabel, { color: theme.colors.textTertiary }]}>PLANNED ETA</Text>
              <Text style={[styles.metaValue, { color: theme.colors.textPrimary }]}>{formatTime(trip.plannedEta)}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={[styles.metaLabel, { color: theme.colors.textTertiary }]}>STOPS</Text>
              <Text style={[styles.metaValue, { color: theme.colors.textPrimary }]}>{completedCount}/{trip.stops.length} Completed</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressLabels}>
              <Text style={[styles.progressLabel, { color: theme.colors.textSecondary }]}>Start</Text>
              <Text style={[styles.progressLabel, { color: theme.colors.accent, fontWeight: '700' }]}>{Math.round(progress)}%</Text>
              <Text style={[styles.progressLabel, { color: theme.colors.textSecondary, textAlign: 'right' }]}>Finish</Text>
            </View>
            <View style={[styles.progressTrack, { backgroundColor: theme.colors.surfacePressed }]}>
              <View
                style={[
                  styles.progressFill,
                  { backgroundColor: theme.colors.accent, width: `${progress}%` },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Stops List */}
        <SectionHeader
          title="Trip Stops"
          subtitle={`Stop ${trip.stops.findIndex(s => s.id === nextStop?.id) + 1} of ${trip.stops.length} is next`}
        />

        {trip.stops.map((stop, index) => {
          const isNext = !stop.completed && stop === nextStop;
          const isExpanded = expandedStops.includes(stop.id);

          return (
            <View key={stop.id} style={{ marginBottom: 12 }}>
              <TouchableOpacity
                style={[styles.stopCard, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.cardBorder }]}
                onPress={() => toggleStop(stop.id)}
                activeOpacity={0.9}
              >
                {/* Stop Header */}
                <View style={[
                  styles.stopHeader,
                  isNext && { borderLeftWidth: 4, borderLeftColor: theme.colors.accent }
                ]}>
                  <View style={styles.stopNumberContainer}>
                    <View style={[
                      styles.stopNumber,
                      { backgroundColor: stop.completed ? theme.colors.success : isNext ? theme.colors.accent : theme.colors.surfacePressed }
                    ]}>
                      <Text style={[
                        styles.stopNumberText,
                        { color: stop.completed || isNext ? '#FFFFFF' : theme.colors.textSecondary }
                      ]}>
                        {index + 1}
                      </Text>
                    </View>
                    {stop.completed && (
                      <View style={styles.checkOverlay}>
                        <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                      </View>
                    )}
                  </View>

                  <View style={[styles.stopInfo, { flex: 1 }]}>
                    <View style={styles.stopTypeRow}>
                      <View style={[
                        styles.stopTypeBadge,
                        { backgroundColor: stop.type === 'pickup' ? theme.colors.primaryLight : theme.colors.successLight }
                      ]}>
                        <Text style={[
                          styles.stopTypeText,
                          { color: stop.type === 'pickup' ? theme.colors.primary : theme.colors.success }
                        ]}>
                          {stop.type.toUpperCase()}
                        </Text>
                      </View>
                      {isNext && (
                        <View style={[styles.nextBadge, { backgroundColor: theme.colors.accent }]}>
                          <Text style={styles.nextBadgeText}>NEXT</Text>
                        </View>
                      )}
                    </View>
                    <Text style={[styles.stopName, { color: theme.colors.textPrimary }]}>
                      {stop.location.name}
                    </Text>
                    <Text style={[styles.stopAddress, { color: theme.colors.textSecondary }]}>
                      {stop.location.address}, {stop.location.city}
                    </Text>
                  </View>

                  <View style={styles.stopTime}>
                    <Text style={[styles.stopTimeText, { color: theme.colors.textPrimary }]}>
                      {formatTime(stop.scheduledTime)}
                    </Text>
                    <Text style={[styles.stopDateText, { color: theme.colors.textTertiary }]}>
                      {formatDate(stop.scheduledTime)}
                    </Text>
                  </View>

                  <Ionicons
                    name={isExpanded ? 'chevron-up-outline' : 'chevron-down-outline'}
                    size={20}
                    color={theme.colors.textTertiary}
                  />
                </View>

                {/* Expanded Details */}
                {isExpanded && (
                  <View style={styles.stopDetails}>
                    <View style={styles.detailRow}>
                      <Ionicons name="time-outline" size={18} color={theme.colors.accent} />
                      <View>
                        <Text style={[styles.detailLabel, { color: theme.colors.textTertiary }]}>Scheduled</Text>
                        <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
                          {formatTime(stop.scheduledTime)}, {formatDate(stop.scheduledTime)}
                        </Text>
                      </View>
                    </View>
                    {stop.actualTime && (
                      <View style={styles.detailRow}>
                        <Ionicons name="checkmark-circle-outline" size={18} color={theme.colors.success} />
                        <View>
                          <Text style={[styles.detailLabel, { color: theme.colors.textTertiary }]}>Completed</Text>
                          <Text style={[styles.detailValue, { color: theme.colors.success }]}>
                            {formatTime(stop.actualTime)}, {formatDate(stop.actualTime)}
                          </Text>
                        </View>
                      </View>
                    )}
                    {stop.shipmentId && (
                      <View style={styles.detailRow}>
                        <Ionicons name="cube-outline" size={18} color={theme.colors.accent} />
                        <View>
                          <Text style={[styles.detailLabel, { color: theme.colors.textTertiary }]}>Consignment</Text>
                          <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>{stop.shipmentId}</Text>
                        </View>
                      </View>
                    )}

                    {/* Action Buttons */}
                    {!stop.completed && (
                      <View style={styles.stopActions}>
                        <SecondaryButton
                          title={stop.type === 'pickup' ? 'Confirm Pickup' : 'Mark Delivered'}
                          icon={stop.type === 'pickup' ? 'checkmark-circle-outline' : 'checkmark-done-outline'}
                          onPress={() => handleAction(stop, stop.type === 'pickup' ? 'pickup' : 'deliver')}
                          style={styles.actionBtn}
                        />
                        <PrimaryButton
                          title="Navigate"
                          icon="navigate-outline"
                          onPress={() => handleAction(stop, 'navigate')}
                          style={styles.actionBtn}
                        />
                      </View>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            </View>
          );
        })}

        {/* Quick Actions */}
        <SectionHeader title="Quick Actions" />
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.quickActionBtn, { backgroundColor: theme.colors.primary }]}
            onPress={() => Alert.alert('Route Optimized', 'AI found 12 min faster route via Express Bypass.')}
          >
            <Ionicons name="git-merge-outline" size={22} color="#FFFFFF" />
            <Text style={styles.quickActionText}>Re-Optimize Route</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickActionBtn, { backgroundColor: theme.colors.warning }]}
            onPress={() => Alert.alert('Delay Reported', 'AI calculating alternative corridors...')}
          >
            <Ionicons name="warning-outline" size={22} color="#FFFFFF" />
            <Text style={styles.quickActionText}>Report Delay</Text>
          </TouchableOpacity>
        </View>
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
  tripTag: { fontSize: 10, fontWeight: '700', letterSpacing: 0.8 },
  tripId: { fontSize: 20, fontWeight: '800', letterSpacing: -0.3, marginTop: 2 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 36 },
  routeCard: { padding: 18, borderRadius: 16, borderWidth: 1, marginBottom: 16 },
  routeHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  routePoint: { alignItems: 'center', flex: 1 },
  routeDot: { width: 12, height: 12, borderRadius: 6, marginBottom: 6 },
  routeLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5, marginBottom: 2 },
  routeCity: { fontSize: 14, fontWeight: '700' },
  routeLineContainer: { flex: 1, height: 2, marginHorizontal: 12 },
  routeLine: { height: '100%', borderRadius: 1 },
  routeMeta: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(150,150,150,0.2)' },
  metaItem: { alignItems: 'center' },
  metaLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5, marginBottom: 2 },
  metaValue: { fontSize: 13, fontWeight: '700' },
  progressContainer: { marginTop: 16, gap: 6 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  progressLabel: { fontSize: 11, flex: 1 },
  progressTrack: { height: 6, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  stopCard: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  stopHeader: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  stopNumberContainer: { position: 'relative' },
  stopNumber: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  stopNumberText: { fontSize: 14, fontWeight: '800' },
  checkOverlay: { position: 'absolute', top: -2, right: -2, width: 18, height: 18, borderRadius: 9, backgroundColor: '#10B981', alignItems: 'center', justifyContent: 'center' },
  stopInfo: { flex: 1 },
  stopTypeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  stopTypeBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  stopTypeText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  nextBadge: { paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4 },
  nextBadgeText: { color: '#FFFFFF', fontSize: 8, fontWeight: '800' },
  stopName: { fontSize: 15, fontWeight: '700', marginBottom: 1 },
  stopAddress: { fontSize: 12 },
  stopTime: { alignItems: 'flex-end', minWidth: 70 },
  stopTimeText: { fontSize: 14, fontWeight: '700' },
  stopDateText: { fontSize: 10 },
  stopDetails: { padding: 16, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#E5E7EB', backgroundColor: '#F8F9FA' },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  detailLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5, marginBottom: 2 },
  detailValue: { fontSize: 13, fontWeight: '600' },
  stopActions: { flexDirection: 'row', gap: 10, marginTop: 8 },
  actionBtn: { flex: 1 },
  quickActions: { flexDirection: 'row', gap: 10 },
  quickActionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 12 },
  quickActionText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
});