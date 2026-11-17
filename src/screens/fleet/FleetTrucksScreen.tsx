import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors, FontFamily, Spacing, Radius, Typography, Shadows } from '../../theme/tokens';
import { useLanguage } from '../../context/LanguageContext';

interface TruckItem {
  id: string;
  code: string;
  model: string;
  driver: string;
  rating: string;
  status: 'ontrip' | 'delayed' | 'available' | 'maintenance';
  statusLabel: string;
  statusColor: string;
  statusBg: string;
  origin?: string;
  destination?: string;
  telemetry: string;
  payloadText: string;
  payloadPercent: number;
  incidentAlert?: string;
  highRiskNotice?: string;
  primaryAction: string;
  primaryIcon: keyof typeof MaterialIcons.glyphMap;
  secondaryAction: string;
}

const mockTruckList: TruckItem[] = [
  {
    id: 'trk-27',
    code: 'TRK-27',
    model: 'Tata Prima 28T (32ft MX)',
    driver: 'Rajesh Kumar',
    rating: '⭐ 4.9',
    status: 'ontrip',
    statusLabel: 'ON TRIP · 86% FULL',
    statusColor: '#109752',
    statusBg: '#E8F5E9',
    origin: 'Delhi Hub',
    destination: 'Chandigarh Terminal',
    telemetry: 'Near Karnal Toll Plaza · Speed 54 km/h (2m ago)',
    payloadText: '5.3 T / 6.0 T loaded (86%)',
    payloadPercent: 86,
    primaryAction: 'Track Live',
    primaryIcon: 'navigation',
    secondaryAction: 'Truck Details',
  },
  {
    id: 'trk-14',
    code: 'TRK-14',
    model: 'Ashok Leyland 32ft',
    driver: 'Harpreet Singh',
    rating: '⭐ 4.7',
    status: 'delayed',
    statusLabel: 'DELAYED · BREAKDOWN',
    statusColor: '#BA1A1A',
    statusBg: '#FFDAD6',
    origin: 'Panipat',
    destination: 'Ludhiana Hub',
    telemetry: 'Stranded on NH-44 km 86 · Alternator failure',
    payloadText: '4.8 T Loaded (80%)',
    payloadPercent: 80,
    incidentAlert: 'Stranded on NH-44 km 86 · Alternator failure',
    highRiskNotice: 'Pharmaceuticals · High Risk',
    primaryAction: 'Resolve Disruption',
    primaryIcon: 'build',
    secondaryAction: 'View Details',
  },
  {
    id: 'trk-09',
    code: 'TRK-09',
    model: 'Eicher Pro 3019',
    driver: 'Vikas Sharma',
    rating: '⭐ 4.8',
    status: 'available',
    statusLabel: 'AVAILABLE',
    statusColor: '#000000',
    statusBg: '#E2E2E2',
    origin: 'Karnal Staging Yard',
    telemetry: '7.5 T Free · Ready for dispatch immediately',
    payloadText: '100% Free Capacity',
    payloadPercent: 0,
    primaryAction: 'Assign Load',
    primaryIcon: 'add-box',
    secondaryAction: 'View Details',
  },
  {
    id: 'trk-19',
    code: 'TRK-19',
    model: 'BharatBenz 2823R',
    driver: 'Manjit Singh',
    rating: '⭐ 4.9',
    status: 'ontrip',
    statusLabel: 'ON TRIP · EMPTY RETURN',
    statusColor: '#5D5F5F',
    statusBg: '#EEEEEE',
    origin: 'Jaipur',
    destination: 'Delhi Corridor',
    telemetry: '3.6 T Free (Zero Deadhead Match Ready)',
    payloadText: '2.4 T / 6.0 T (40%)',
    payloadPercent: 40,
    primaryAction: 'Combine Load',
    primaryIcon: 'merge-type',
    secondaryAction: 'View Details',
  },
];

export default function FleetTrucksScreen() {
  const { language, setLanguage } = useLanguage();
  const navigation = useNavigation<any>();

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'available' | 'ontrip' | 'delayed' | 'maintenance'>('all');

  const filtered = mockTruckList.filter((item) => {
    if (filter !== 'all' && item.status !== filter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      item.code.toLowerCase().includes(q) ||
      item.driver.toLowerCase().includes(q) ||
      item.model.toLowerCase().includes(q)
    );
  });

  const handlePrimaryAction = (truck: TruckItem) => {
    if (truck.status === 'delayed') {
      navigation.navigate('DisruptionRecovery', { incidentId: 'INC-8942' });
    } else if (truck.id === 'trk-19') {
      navigation.navigate('CombineShipments');
    } else {
      navigation.navigate('TruckDetails', { truckId: truck.id });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Stitch Fixed Header */}
      <View style={styles.headerBar}>
        <View style={styles.headerLeft}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoCircleText}>C</Text>
          </View>
          <View style={styles.headerTitleCol}>
            <Text style={styles.headerTitle}>Fleet</Text>
            <TouchableOpacity
              style={styles.roleDropdown}
              activeOpacity={0.7}
              onPress={() => Alert.alert('Workspace', 'Fleet Ops (All Units)')}
            >
              <Text style={styles.roleDropdownText}>FLEET OPS</Text>
              <MaterialIcons name="expand-more" size={14} color="#7E7576" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.headerRight}>
          <View style={styles.langToggleBox}>
            <TouchableOpacity
              style={[styles.langBtn, language === 'en' && styles.langBtnActive]}
              onPress={() => setLanguage('en')}
            >
              <Text style={[styles.langBtnText, language === 'en' && styles.langBtnTextActive]}>EN</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.langBtn, language === 'hi' && styles.langBtnActive]}
              onPress={() => setLanguage('hi')}
            >
              <Text style={[styles.langBtnText, language === 'hi' && styles.langBtnTextActive]}>हिंदी</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.avatarCircle}
            onPress={() => navigation.navigate('FleetProfile')}
            activeOpacity={0.8}
          >
            <MaterialIcons name="person" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar with Tactile Elevation */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <MaterialIcons name="search" size={20} color="#5D5F5F" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search truck ID or driver (e.g. TRK-27)"
              placeholderTextColor="#7E7576"
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <MaterialIcons name="close" size={18} color="#5D5F5F" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Horizontal Filter Pills Track */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterPillsTrack}
        >
          {[
            { id: 'all', label: 'All (28)' },
            { id: 'available', label: 'Available (6)' },
            { id: 'ontrip', label: 'On Trip (18)' },
            { id: 'delayed', label: 'Delayed (2)' },
            { id: 'maintenance', label: 'Maintenance (2)' },
          ].map((item) => {
            const active = filter === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.filterChip, active ? styles.filterChipActive : styles.filterChipInactive]}
                onPress={() => setFilter(item.id as any)}
                activeOpacity={0.8}
              >
                <Text style={[styles.filterChipText, active ? styles.filterChipTextActive : styles.filterChipTextInactive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Fleet Summary Bar & Capacity Spark */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryTop}>
            <View style={styles.summaryTitleRow}>
              <Text style={styles.summaryActiveText}>24/28 Active</Text>
              <Text style={styles.summaryUtilText}> · 85.7% Network Utilization</Text>
            </View>
            <View style={styles.liveOpsBadge}>
              <View style={styles.liveOpsDot} />
              <Text style={styles.liveOpsText}>Live Ops</Text>
            </View>
          </View>

          {/* Segmented Capacity Fill Meter */}
          <View style={styles.segmentedTrack}>
            <View style={[styles.segment, { width: '72%', backgroundColor: '#000000', borderTopLeftRadius: 4, borderBottomLeftRadius: 4 }]} />
            <View style={[styles.segment, { width: '7%', backgroundColor: '#BA1A1A' }]} />
            <View style={[styles.segment, { width: '7%', backgroundColor: '#5D5F5F' }]} />
            <View style={[styles.segment, { width: '14%', backgroundColor: '#E2E2E2', borderTopRightRadius: 4, borderBottomRightRadius: 4 }]} />
          </View>

          <View style={styles.segmentedLegend}>
            <Text style={styles.legendItem}>18 Moving</Text>
            <Text style={styles.legendItem}>2 Delayed</Text>
            <Text style={styles.legendItem}>4 Staged</Text>
            <Text style={styles.legendItem}>4 Standby</Text>
          </View>
        </View>

        {/* Freight Vehicle Cards Stream */}
        <View style={styles.cardStream}>
          {filtered.length === 0 ? (
            <View style={styles.noResultsBox}>
              <View style={styles.noResultsIconCircle}>
                <MaterialIcons name="local-shipping" size={24} color="#7E7576" />
              </View>
              <Text style={styles.noResultsTitle}>No trucks found</Text>
              <Text style={styles.noResultsSub}>
                No active units matched your query. Try searching by vehicle ID, terminal, or driver name.
              </Text>
              <TouchableOpacity
                style={styles.resetSearchBtn}
                onPress={() => {
                  setSearch('');
                  setFilter('all');
                }}
              >
                <Text style={styles.resetSearchBtnText}>Reset Search</Text>
              </TouchableOpacity>
            </View>
          ) : (
            filtered.map((item) => (
              <View key={item.id} style={styles.truckCard}>
                {/* Card Top: Code, Model, Driver, Status Badge */}
                <View style={styles.cardTopRow}>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <View style={styles.truckCodeRow}>
                      <Text style={styles.truckCode}>{item.code}</Text>
                      <Text style={styles.truckModel} numberOfLines={1}> · {item.model}</Text>
                    </View>
                    <View style={styles.driverInfoRow}>
                      <MaterialIcons name="person" size={15} color="#5D5F5F" />
                      <Text style={styles.driverName}>{item.driver}</Text>
                      <View style={styles.ratingBadge}>
                        <Text style={styles.ratingText}>{item.rating}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={[styles.statusBadge, { backgroundColor: item.statusBg }]}>
                    <View style={[styles.statusDot, { backgroundColor: item.statusColor }]} />
                    <Text style={[styles.statusBadgeText, { color: item.statusColor }]}>
                      {item.statusLabel}
                    </Text>
                  </View>
                </View>

                {/* Route Progression / Staging Itinerary Box */}
                <View style={styles.itineraryBox}>
                  {item.destination ? (
                    <View style={styles.routeRow}>
                      <View style={styles.routePoint}>
                        <View style={styles.circleDot} />
                        <Text style={styles.routeCity}>{item.origin}</Text>
                      </View>
                      <MaterialIcons name="arrow-forward" size={16} color="#7E7576" />
                      <View style={styles.routePoint}>
                        <View style={styles.squareDot} />
                        <Text style={styles.routeCity}>{item.destination}</Text>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.stagingRow}>
                      <View style={styles.flexRowCenter}>
                        <MaterialIcons name="warehouse" size={16} color="#5D5F5F" />
                        <Text style={styles.stagingYardText}>{item.origin}</Text>
                      </View>
                      <Text style={styles.idleText}>Idle 45m</Text>
                    </View>
                  )}

                  {/* Incident Alert if delayed */}
                  {item.incidentAlert && (
                    <View style={styles.incidentRow}>
                      <MaterialIcons name="warning" size={15} color="#BA1A1A" />
                      <Text style={styles.incidentText} numberOfLines={1}>{item.incidentAlert}</Text>
                    </View>
                  )}

                  {/* Telemetry info row */}
                  {!item.incidentAlert && (
                    <View style={styles.telemetryRow}>
                      <MaterialIcons
                        name={item.status === 'available' ? 'check-circle' : 'near-me'}
                        size={14}
                        color={item.status === 'available' ? '#109752' : '#5D5F5F'}
                      />
                      <Text style={styles.telemetryText} numberOfLines={1}>{item.telemetry}</Text>
                    </View>
                  )}
                </View>

                {/* Payload Progress Bar */}
                <View style={styles.payloadSection}>
                  <View style={styles.payloadHeader}>
                    {item.highRiskNotice ? (
                      <View style={styles.highRiskRow}>
                        <MaterialIcons name="local-pharmacy" size={13} color="#BA1A1A" />
                        <Text style={styles.highRiskText}>{item.highRiskNotice}</Text>
                      </View>
                    ) : (
                      <Text style={styles.payloadLabel}>
                        {item.status === 'available' ? 'Space Available' : 'Payload Capacity'}
                      </Text>
                    )}
                    <Text style={styles.payloadValue}>{item.payloadText}</Text>
                  </View>
                  <View style={styles.payloadTrack}>
                    <View
                      style={[
                        styles.payloadFill,
                        {
                          width: `${item.payloadPercent}%`,
                          backgroundColor: item.status === 'delayed' ? '#BA1A1A' : '#000000',
                        },
                      ]}
                    />
                  </View>
                </View>

                {/* Action Buttons (Radius.xs = 4px) */}
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.primaryActionBtn}
                    onPress={() => handlePrimaryAction(item)}
                    activeOpacity={0.85}
                  >
                    <MaterialIcons name={item.primaryIcon} size={16} color="#FFFFFF" />
                    <Text style={styles.primaryActionText}>{item.primaryAction}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.secondaryActionBtn}
                    onPress={() => navigation.navigate('TruckDetails', { truckId: item.id })}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.secondaryActionText}>{item.secondaryAction}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Floating Filter & Sort Button */}
        <View style={styles.filterFloatingContainer}>
          <TouchableOpacity
            style={styles.floatingFilterBtn}
            onPress={() => Alert.alert('Filter & Sort', 'Sort by: Payload Utilization, Route Proximity, ETA or Status')}
            activeOpacity={0.9}
          >
            <MaterialIcons name="tune" size={17} color="#FFFFFF" />
            <Text style={styles.floatingFilterText}>Filter & Sort</Text>
            <View style={styles.activeFilterDot} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  headerBar: {
    backgroundColor: 'rgba(249, 249, 249, 0.95)',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCircleText: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  headerTitleCol: {
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 17,
    color: '#000000',
    letterSpacing: -0.3,
    lineHeight: 18,
  },
  roleDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#DCDDDD',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: Radius.full,
    marginTop: 2,
  },
  roleDropdownText: {
    fontFamily: FontFamily.bold,
    fontSize: 9,
    color: '#1A1C1C',
    letterSpacing: 0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  langToggleBox: {
    flexDirection: 'row',
    backgroundColor: '#EEEEEE',
    borderRadius: Radius.full,
    padding: 2,
  },
  langBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  langBtnActive: {
    backgroundColor: '#000000',
  },
  langBtnText: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: '#5D5F5F',
  },
  langBtnTextActive: {
    color: '#FFFFFF',
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: Spacing.xxl + 20,
  },
  searchContainer: {
    paddingHorizontal: Spacing.base,
    marginTop: Spacing.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    height: 46,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    ...Shadows.sm,
  },
  searchInput: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: '#1A1C1C',
    marginLeft: 6,
  },
  filterPillsTrack: {
    paddingHorizontal: Spacing.base,
    paddingVertical: 10,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    height: 36,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterChipActive: {
    backgroundColor: '#000000',
  },
  filterChipInactive: {
    backgroundColor: '#EEEEEE',
  },
  filterChipText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  filterChipTextInactive: {
    color: '#1A1C1C',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: Spacing.base,
    marginTop: 2,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    ...Shadows.sm,
  },
  summaryTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryTitleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  summaryActiveText: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: '#000000',
    fontWeight: '800',
  },
  summaryUtilText: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: '#5D5F5F',
  },
  liveOpsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EEEEEE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  liveOpsDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#68DD8F',
  },
  liveOpsText: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: '#000000',
  },
  segmentedTrack: {
    height: 8,
    backgroundColor: '#EEEEEE',
    borderRadius: Radius.full,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  segment: {
    height: '100%',
  },
  segmentedLegend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  legendItem: {
    fontFamily: FontFamily.medium,
    fontSize: 10,
    color: '#7E7576',
  },
  cardStream: {
    paddingHorizontal: Spacing.base,
    marginTop: Spacing.md,
    gap: 12,
  },
  truckCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    ...Shadows.sm,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  truckCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  truckCode: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: '#000000',
    fontWeight: '800',
  },
  truckModel: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: '#5D5F5F',
  },
  driverInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  driverName: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
    color: '#1A1C1C',
  },
  ratingBadge: {
    backgroundColor: '#EEEEEE',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: Radius.full,
    marginLeft: 4,
  },
  ratingText: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: '#5D5F5F',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusBadgeText: {
    fontFamily: FontFamily.bold,
    fontSize: 9,
    letterSpacing: 0.5,
  },
  itineraryBox: {
    backgroundColor: '#F4F3F3',
    borderRadius: Radius.sm,
    padding: 10,
    marginTop: 10,
    gap: 6,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  circleDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#000000',
  },
  squareDot: {
    width: 7,
    height: 7,
    borderRadius: 1,
    backgroundColor: '#000000',
  },
  routeCity: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
    color: '#000000',
  },
  stagingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flexRowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  stagingYardText: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
    color: '#000000',
  },
  idleText: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#7E7576',
  },
  incidentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 218, 214, 0.6)',
    padding: 6,
    borderRadius: Radius.xs,
  },
  incidentText: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: '#BA1A1A',
    flex: 1,
  },
  telemetryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  telemetryText: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#5D5F5F',
    flex: 1,
  },
  payloadSection: {
    marginTop: 8,
    gap: 4,
  },
  payloadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  highRiskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  highRiskText: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: '#BA1A1A',
  },
  payloadLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#7E7576',
  },
  payloadValue: {
    fontFamily: FontFamily.semiBold,
    fontSize: 11,
    color: '#000000',
  },
  payloadTrack: {
    height: 6,
    backgroundColor: '#EEEEEE',
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  payloadFill: {
    height: '100%',
    borderRadius: Radius.full,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  primaryActionBtn: {
    flex: 1,
    height: 42,
    backgroundColor: '#000000',
    borderRadius: Radius.xs, // 4px exact Stitch requirement
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  primaryActionText: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
    color: '#FFFFFF',
  },
  secondaryActionBtn: {
    paddingHorizontal: 16,
    height: 42,
    backgroundColor: '#EEEEEE',
    borderRadius: Radius.xs, // 4px exact Stitch requirement
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryActionText: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
    color: '#1A1C1C',
  },
  noResultsBox: {
    backgroundColor: '#FFFFFF',
    padding: Spacing.xl,
    borderRadius: Radius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  noResultsIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  noResultsTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: '#000000',
  },
  noResultsSub: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: '#7E7576',
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 240,
  },
  resetSearchBtn: {
    marginTop: 14,
    paddingHorizontal: 20,
    height: 38,
    backgroundColor: '#000000',
    borderRadius: Radius.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetSearchBtnText: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
    color: '#FFFFFF',
  },
  filterFloatingContainer: {
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  floatingFilterBtn: {
    height: 44,
    paddingHorizontal: 20,
    backgroundColor: '#000000',
    borderRadius: Radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    ...Shadows.md,
  },
  floatingFilterText: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: '#FFFFFF',
  },
  activeFilterDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#85FAA9',
    marginLeft: 2,
  },
});
