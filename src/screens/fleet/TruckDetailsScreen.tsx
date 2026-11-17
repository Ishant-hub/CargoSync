import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors, FontFamily, Spacing, Radius, Typography, Shadows } from '../../theme/tokens';
import { useLanguage } from '../../context/LanguageContext';

export const TruckDetailsScreen: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { truckId = 'trk-27' } = route.params || {};

  const handleCall = () => {
    Linking.openURL('tel:+919876543210').catch(() => {
      Alert.alert('Calling Driver', '+91 98765 43210 (Rajesh Kumar)');
    });
  };

  const handleSms = () => {
    Linking.openURL('sms:+919876543210').catch(() => {
      Alert.alert('Messaging Driver', '+91 98765 43210 (Rajesh Kumar)');
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Stitch Fixed Header */}
      <View style={styles.headerBar}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <MaterialIcons name="arrow-back" size={22} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Truck Details</Text>
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
        {/* Overview Header Card */}
        <View style={styles.overviewCard}>
          <View style={styles.overviewTop}>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={styles.truckTitle} numberOfLines={1}>TRK-27 · Tata Prima 28T</Text>
              <Text style={styles.truckSub}>DL-1AA-9082 · 32ft Container</Text>
            </View>
            <View style={styles.statusPill}>
              <View style={styles.statusPillDot} />
              <Text style={styles.statusPillText}>ON TRIP · 86% LOADED</Text>
            </View>
          </View>

          {/* Telematics Live Snapshot Strip */}
          <View style={styles.telematicsStrip}>
            <View style={styles.telemetryItem}>
              <MaterialIcons name="speed" size={20} color="#000000" />
              <View>
                <Text style={styles.telemetryLabel}>SPEED</Text>
                <Text style={styles.telemetryValue}>54 km/h</Text>
              </View>
            </View>

            <View style={styles.telemetryItem}>
              <MaterialIcons name="local-gas-station" size={20} color="#000000" />
              <View>
                <Text style={styles.telemetryLabel}>FUEL LEVEL</Text>
                <Text style={styles.telemetryValue}>78% · 420 km</Text>
              </View>
            </View>
          </View>

          {/* Assigned Driver Card */}
          <View style={styles.driverBox}>
            <View style={styles.driverLeft}>
              <View style={styles.driverAvatar}>
                <MaterialIcons name="person" size={22} color="#FFFFFF" />
              </View>
              <View style={{ minWidth: 0 }}>
                <Text style={styles.driverName}>Rajesh Kumar</Text>
                <View style={styles.driverMetaRow}>
                  <MaterialIcons name="star" size={13} color="#000000" />
                  <Text style={styles.driverRatingText}>4.9</Text>
                  <Text style={styles.driverTripsText}>· 340 trips</Text>
                </View>
              </View>
            </View>

            <View style={styles.driverActionButtons}>
              <TouchableOpacity
                style={styles.driverCallBtn}
                onPress={handleCall}
                activeOpacity={0.8}
              >
                <MaterialIcons name="call" size={18} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.driverSmsBtn}
                onPress={handleSms}
                activeOpacity={0.8}
              >
                <MaterialIcons name="chat" size={18} color="#000000" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Specifications & Capacity Section */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardHeaderTitle}>Truck & Load Capacity</Text>
            <View style={styles.badgeRemaining}>
              <Text style={styles.badgeRemainingText}>2,200 kg Left</Text>
            </View>
          </View>

          {/* Visual Horizontal Progress Bar */}
          <View style={styles.capacityProgressCol}>
            <View style={styles.capacityLabelsRow}>
              <Text style={styles.capacityLoadedText}>Loaded: 5,300 kg (86%)</Text>
              <Text style={styles.capacityMaxText}>Max: 7,500 kg</Text>
            </View>
            <View style={styles.capacityTrack}>
              <View style={[styles.capacityFill, { width: '86%' }]} />
            </View>
            <View style={styles.capacityFooterRow}>
              <Text style={styles.cargoTypeText}>Auto Parts & General Cargo</Text>
              <Text style={styles.shareAvailableText}>Space Available to Share</Text>
            </View>
          </View>

          {/* Tabular Breakdown */}
          <View style={styles.tabularRow}>
            <View style={styles.tabCell}>
              <Text style={styles.tabCellLabel}>MAX</Text>
              <Text style={styles.tabCellValue}>7.5 T</Text>
              <Text style={styles.tabCellSub}>7,500 kg</Text>
            </View>
            <View style={styles.tabCell}>
              <Text style={styles.tabCellLabel}>CURRENT</Text>
              <Text style={styles.tabCellValue}>5.3 T</Text>
              <Text style={styles.tabCellSub}>5,300 kg</Text>
            </View>
            <View style={[styles.tabCell, styles.tabCellAvailable]}>
              <Text style={[styles.tabCellLabel, { color: '#000000' }]}>AVAILABLE</Text>
              <Text style={[styles.tabCellValue, { color: '#000000' }]}>2.2 T</Text>
              <Text style={styles.tabCellSub}>2,200 kg</Text>
            </View>
          </View>

          {/* Manifest Summary Item */}
          <View style={styles.manifestBox}>
            <MaterialIcons name="inventory-2" size={18} color="#000000" style={{ marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.manifestTitle}>Cargo Details</Text>
              <Text style={styles.manifestSub}>Auto Parts (4 Pallets) + General Goods (2 Pallets)</Text>
            </View>
          </View>
        </View>

        {/* Live Route & Telematics Tracking Card */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardHeaderTitle}>Active Trip</Text>
            <View style={styles.corridorTag}>
              <Text style={styles.corridorTagText}>NH-44 Corridor</Text>
            </View>
          </View>

          {/* Itinerary Nodes */}
          <View style={styles.timelineContainer}>
            <View style={styles.timelineLine} />

            {/* Origin */}
            <View style={styles.timelineNode}>
              <View style={styles.nodeCircleHollow} />
              <View style={styles.nodeContent}>
                <Text style={styles.nodeBadge}>PICKUP · DEPARTED TODAY 09:30 AM</Text>
                <Text style={styles.nodeTitle}>Delhi Logistics Hub (Okhla)</Text>
              </View>
            </View>

            {/* Active Position */}
            <View style={[styles.timelineNode, styles.activeNodeBox]}>
              <View style={styles.nodeCirclePulse} />
              <View style={styles.nodeContent}>
                <View style={styles.flexRowCenter}>
                  <MaterialIcons name="my-location" size={13} color="#5D5F5F" />
                  <Text style={styles.nodeBadge}>LIVE LOCATION (NH-44 MILE 128)</Text>
                </View>
                <Text style={styles.nodeTitle}>Near Karnal · Next: Karnal Rest Area</Text>
                <Text style={styles.nodeSub}>Waypoint ETA: 14:45 PM (In 42 mins)</Text>
              </View>
            </View>

            {/* Destination */}
            <View style={styles.timelineNode}>
              <View style={styles.nodeCircleFilled} />
              <View style={styles.nodeContent}>
                <Text style={styles.nodeBadge}>DELIVERY · ETA TODAY 18:45 PM</Text>
                <Text style={styles.nodeTitle}>Chandigarh Industrial Terminal</Text>
                <Text style={styles.onTimeText}>On Time · 186 km Left</Text>
              </View>
            </View>
          </View>

          {/* Map Preview Banner */}
          <View style={styles.mapBanner}>
            <View style={styles.mapBadgePill}>
              <MaterialIcons name="navigation" size={15} color="#000000" />
              <Text style={styles.mapBadgeText}>NH-44 Northbound Lane 2</Text>
            </View>
          </View>

          {/* FASTag Telemetry */}
          <View style={styles.fastagBox}>
            <View style={styles.flexRowCenter}>
              <MaterialIcons name="toll" size={20} color="#000000" />
              <View>
                <Text style={styles.fastagTitle}>FASTag Status</Text>
                <Text style={styles.fastagSub}>Kundli Plaza · -₹340 debited</Text>
              </View>
            </View>
            <View style={styles.activePill}>
              <Text style={styles.activePillText}>Active</Text>
            </View>
          </View>
        </View>

        {/* Primary Operations Actions (Radius.xs = 4px) */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionBtnBlack}
            onPress={() => Alert.alert('Live Map', 'Real-time GPS tracking stream active for TRK-27')}
            activeOpacity={0.85}
          >
            <MaterialIcons name="map" size={18} color="#FFFFFF" />
            <Text style={styles.actionBtnBlackText}>Track on Live Map</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtnGreyHigh}
            onPress={() => navigation.navigate('CombineShipments')}
            activeOpacity={0.85}
          >
            <MaterialIcons name="add-box" size={18} color="#000000" />
            <Text style={styles.actionBtnGreyHighText}>Add Another Load (+2.2 T)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtnGrey}
            onPress={() => Alert.alert('Driver Reassignment', 'Choose an alternate verified driver stationed in Karnal Hub.')}
            activeOpacity={0.85}
          >
            <MaterialIcons name="chevron-left" size={18} color="#000000" />
            <Text style={styles.actionBtnGreyText}>Reassign or Replace Driver</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtnRed}
            onPress={() => navigation.navigate('ReportProblem')}
            activeOpacity={0.85}
          >
            <MaterialIcons name="report-problem" size={18} color="#93000A" />
            <Text style={styles.actionBtnRedText}>Report Issue / Call Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TruckDetailsScreen;

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
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 17,
    color: '#000000',
    letterSpacing: -0.3,
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
    padding: Spacing.base,
    paddingBottom: Spacing.xxl + 20,
    gap: 12,
  },
  overviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    gap: 12,
    ...Shadows.sm,
  },
  overviewTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  truckTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: '#000000',
    fontWeight: '800',
  },
  truckSub: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: '#5D5F5F',
    marginTop: 2,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#EEEEEE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  statusPillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#109752',
  },
  statusPillText: {
    fontFamily: FontFamily.bold,
    fontSize: 9,
    color: '#000000',
    letterSpacing: 0.5,
  },
  telematicsStrip: {
    flexDirection: 'row',
    backgroundColor: '#F4F3F3',
    borderRadius: Radius.xs,
    padding: 10,
    gap: 16,
  },
  telemetryItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  telemetryLabel: {
    fontFamily: FontFamily.bold,
    fontSize: 9,
    color: '#7E7576',
    letterSpacing: 0.5,
  },
  telemetryValue: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: '#000000',
  },
  driverBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EEEEEE',
    borderRadius: Radius.xs,
    padding: 10,
  },
  driverLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  driverAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverName: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: '#000000',
  },
  driverMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 1,
  },
  driverRatingText: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: '#000000',
  },
  driverTripsText: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#5D5F5F',
  },
  driverActionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  driverCallBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverSmsBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E2E2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    gap: 12,
    ...Shadows.sm,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardHeaderTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: '#000000',
    fontWeight: '800',
  },
  badgeRemaining: {
    backgroundColor: '#DCDDDD',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  badgeRemainingText: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: '#5F6161',
  },
  capacityProgressCol: {
    gap: 6,
  },
  capacityLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  capacityLoadedText: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#5D5F5F',
  },
  capacityMaxText: {
    fontFamily: FontFamily.medium,
    fontSize: 11,
    color: '#5D5F5F',
  },
  capacityTrack: {
    height: 8,
    backgroundColor: '#EEEEEE',
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  capacityFill: {
    height: '100%',
    backgroundColor: '#000000',
    borderRadius: Radius.full,
  },
  capacityFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cargoTypeText: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#7E7576',
  },
  shareAvailableText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 11,
    color: '#109752',
  },
  tabularRow: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 4,
  },
  tabCell: {
    flex: 1,
    backgroundColor: '#F4F3F3',
    padding: 8,
    borderRadius: Radius.xs,
    alignItems: 'center',
  },
  tabCellAvailable: {
    backgroundColor: '#EEEEEE',
  },
  tabCellLabel: {
    fontFamily: FontFamily.bold,
    fontSize: 9,
    color: '#7E7576',
    letterSpacing: 0.5,
  },
  tabCellValue: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: '#000000',
    fontWeight: '800',
    marginTop: 2,
  },
  tabCellSub: {
    fontFamily: FontFamily.regular,
    fontSize: 10,
    color: '#7E7576',
    marginTop: 1,
  },
  manifestBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#F4F3F3',
    padding: 10,
    borderRadius: Radius.xs,
  },
  manifestTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
    color: '#000000',
  },
  manifestSub: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#5D5F5F',
    marginTop: 1,
  },
  corridorTag: {
    backgroundColor: '#EEEEEE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  corridorTagText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 10,
    color: '#000000',
  },
  timelineContainer: {
    position: 'relative',
    paddingLeft: 20,
    gap: 16,
    marginVertical: 4,
  },
  timelineLine: {
    position: 'absolute',
    left: 6,
    top: 8,
    bottom: 8,
    width: 2,
    backgroundColor: '#1A1C1C',
  },
  timelineNode: {
    position: 'relative',
  },
  nodeCircleHollow: {
    position: 'absolute',
    left: -20,
    top: 3,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#000000',
  },
  nodeCirclePulse: {
    position: 'absolute',
    left: -18,
    top: 5,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#000000',
  },
  nodeCircleFilled: {
    position: 'absolute',
    left: -19,
    top: 4,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#000000',
  },
  activeNodeBox: {
    backgroundColor: '#F4F3F3',
    padding: 8,
    borderRadius: Radius.xs,
    marginLeft: -4,
  },
  nodeContent: {
    gap: 2,
  },
  nodeBadge: {
    fontFamily: FontFamily.bold,
    fontSize: 9,
    color: '#7E7576',
    letterSpacing: 0.6,
  },
  nodeTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: '#000000',
  },
  nodeSub: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#5D5F5F',
  },
  onTimeText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 11,
    color: '#109752',
  },
  flexRowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  mapBanner: {
    height: 100,
    backgroundColor: '#E2E2E2',
    borderRadius: Radius.xs,
    justifyContent: 'flex-end',
    padding: 8,
  },
  mapBadgePill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  mapBadgeText: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: '#000000',
  },
  fastagBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F4F3F3',
    padding: 10,
    borderRadius: Radius.xs,
  },
  fastagTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
    color: '#000000',
  },
  fastagSub: {
    fontFamily: FontFamily.regular,
    fontSize: 10,
    color: '#5D5F5F',
  },
  activePill: {
    backgroundColor: '#E2E2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  activePillText: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: '#000000',
  },
  actionsContainer: {
    gap: 8,
    paddingTop: 4,
  },
  actionBtnBlack: {
    height: 44,
    backgroundColor: '#000000',
    borderRadius: Radius.xs, // 4px exact Stitch requirement
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    ...Shadows.sm,
  },
  actionBtnBlackText: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: '#FFFFFF',
  },
  actionBtnGreyHigh: {
    height: 44,
    backgroundColor: '#E8E8E8',
    borderRadius: Radius.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  actionBtnGreyHighText: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: '#000000',
  },
  actionBtnGrey: {
    height: 44,
    backgroundColor: '#EEEEEE',
    borderRadius: Radius.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  actionBtnGreyText: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: '#000000',
  },
  actionBtnRed: {
    height: 44,
    backgroundColor: '#FFDAD6',
    borderRadius: Radius.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  actionBtnRedText: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: '#93000A',
  },
});
