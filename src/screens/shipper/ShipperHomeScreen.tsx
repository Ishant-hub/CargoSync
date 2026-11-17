import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
  RefreshControl,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors, FontFamily, Spacing, Radius } from '../../theme/tokens';
import { useLanguage } from '../../context/LanguageContext';
import RateEstimatorModal from '../../components/RateEstimatorModal';
import AssistantModal from '../../components/AssistantModal';

const CORRIDOR_MAP_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuChsUOMHxlkf4N9Mu8oXNhiyLcoUFDkxN9yzeolazVdD7ibzdIJqRZQE1ynE7p0QVswaoCP-iBhQAcYlOsawr9YIDKP1oUJTrdzxYPg0iXhVLJYMM-C7VoiILmUtggLNH289PMXwElHORygcU8qPghvNDPGOcuSN386f2DwvPEJNPIDpAaMbw_TLBX2M7sjpAwl15N-_nI8H3gaNPU8RX66YdDagEDs5KawowX_xDc';

export default function ShipperHomeScreen() {
  const { language, toggleLanguage } = useLanguage();
  const navigation = useNavigation<any>();

  const [refreshing, setRefreshing] = useState(false);
  const [isRateEstimatorOpen, setIsRateEstimatorOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header: Uber-style clean black & white with language switcher */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.brandTitle}>
            Cargo<Text style={styles.brandTitleThin}>Sync</Text>
          </Text>
          <View style={styles.roleTag}>
            <Text style={styles.roleTagText}>SHIPPER</Text>
            <MaterialIcons name="expand-more" size={14} color="#5D5F5F" />
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.langPill}
            onPress={toggleLanguage}
            accessibilityLabel="Language Switcher"
          >
            <MaterialIcons name="language" size={14} color="#1A1C1C" />
            <Text style={styles.langPillText}>
              {language === 'en' ? 'EN | हिंदी' : 'हिंदी | EN'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconCircleBtn}
            onPress={() => navigation.navigate('Notifications')}
            accessibilityLabel="Notifications"
          >
            <MaterialIcons name="notifications" size={18} color="#1A1C1C" />
            <View style={styles.notifDot} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.avatarCircle}
            onPress={() => navigation.navigate('ShipperProfile')}
            accessibilityLabel="Account Profile"
          >
            <MaterialIcons name="person" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#000000']} />
        }
      >
        {/* Context Sub-bar & Primary New Shipment Action */}
        <View style={styles.subBar}>
          <View style={styles.subBarLeft}>
            <View style={styles.pillBox}>
              <MaterialIcons name="location-on" size={14} color="#5D5F5F" />
              <Text style={styles.pillText}>Delhi Hub</Text>
            </View>
            <View style={styles.pillBox}>
              <View style={styles.greenDot} />
              <Text style={styles.pillTextMuted}>3 Active</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.newShipmentBtn}
            onPress={() => navigation.navigate('CreateShipment')}
            activeOpacity={0.85}
          >
            <MaterialIcons name="add" size={18} color="#FFFFFF" />
            <Text style={styles.newShipmentText}>New Shipment</Text>
          </TouchableOpacity>
        </View>

        {/* Operational Metrics Tiles */}
        <View style={styles.metricsRow}>
          {/* Tile 1: In Transit */}
          <View style={styles.metricTile}>
            <View style={styles.metricTop}>
              <Text style={styles.metricLabel}>IN TRANSIT</Text>
              <MaterialIcons name="local-shipping" size={16} color="#1A1C1C" />
            </View>
            <View style={styles.metricValRow}>
              <Text style={styles.metricVal}>3</Text>
              <Text style={styles.metricValSub}>loads</Text>
            </View>
            <Text style={styles.metricStatusGreen}>98% on-track</Text>
          </View>

          {/* Tile 2: Pickup */}
          <View style={styles.metricTile}>
            <View style={styles.metricTop}>
              <Text style={styles.metricLabel}>PICKUP</Text>
              <MaterialIcons name="schedule" size={16} color="#5D5F5F" />
            </View>
            <View style={styles.metricValRow}>
              <Text style={styles.metricVal}>2</Text>
              <Text style={styles.metricValSub}>docked</Text>
            </View>
            <Text style={styles.metricStatusMuted}>Avg 22m wait</Text>
          </View>

          {/* Tile 3: Delivered */}
          <View style={styles.metricTile}>
            <View style={styles.metricTop}>
              <Text style={styles.metricLabel}>DELIVERED</Text>
              <MaterialIcons name="check-circle" size={16} color="#5D5F5F" />
            </View>
            <View style={styles.metricValRow}>
              <Text style={styles.metricVal}>8</Text>
              <Text style={styles.metricValSub}>today</Text>
            </View>
            <Text style={styles.metricStatusDark}>₹42.8k billable</Text>
          </View>
        </View>

        {/* Smart Consolidation Opportunity Card */}
        <View style={styles.card}>
          <View style={styles.oppHeader}>
            <View style={styles.oppBadge}>
              <MaterialIcons name="bolt" size={13} color="#FDE047" />
              <Text style={styles.oppBadgeText}>OPTIMIZATION OPPORTUNITY</Text>
            </View>
            <View style={styles.aiTag}>
              <Text style={styles.aiTagText}>AI Corridor Lock</Text>
            </View>
          </View>

          <View style={styles.routeHeader}>
            <View style={styles.truckTag}>
              <Text style={styles.truckTagText}>TRK-27</Text>
            </View>
            <Text style={styles.routeText}>Delhi (Okhla) → Chandigarh (Ind. Area)</Text>
          </View>
          <Text style={styles.corridorSubText}>NH-44 Freight Corridor · Departing 16:30 hrs</Text>

          {/* Payload Progress Bar */}
          <View style={styles.payloadBox}>
            <View style={styles.payloadHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <MaterialIcons name="fitness-center" size={15} color="#1A1C1C" />
                <Text style={styles.payloadTitle}>Payload: 5.1 T / 7.5 T</Text>
              </View>
              <View style={styles.availPill}>
                <Text style={styles.availPillText}>2.4 T available</Text>
              </View>
            </View>

            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: '68%' }]} />
              <View style={[styles.progressEmpty, { width: '32%' }]} />
            </View>

            <View style={styles.progressLabels}>
              <Text style={styles.utilText}>68% Utilized</Text>
              <Text style={styles.freeSpaceText}>32% Free Space Ready</Text>
            </View>
          </View>

          {/* Insights Badges */}
          <View style={styles.insightsRow}>
            <View style={styles.insightBox}>
              <View style={styles.insightIconBox}>
                <MaterialIcons name="join-inner" size={16} color="#1A1C1C" />
              </View>
              <View>
                <Text style={styles.insightMeta}>MATCHES</Text>
                <Text style={styles.insightVal}>3 shipments nearby</Text>
              </View>
            </View>

            <View style={styles.insightBox}>
              <View style={styles.insightIconBox}>
                <MaterialIcons name="savings" size={16} color="#1A1C1C" />
              </View>
              <View>
                <Text style={styles.insightMeta}>EST. SAVING</Text>
                <Text style={styles.insightVal}>₹1,250 est</Text>
              </View>
            </View>
          </View>

          {/* Action Triggers */}
          <View style={styles.oppActionsRow}>
            <TouchableOpacity
              style={styles.reviewLoadsBtn}
              onPress={() => navigation.navigate('FindTrucks')}
            >
              <MaterialIcons name="verified" size={16} color="#FFFFFF" />
              <Text style={styles.reviewLoadsText}>Review loads</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.routeBtn}
              onPress={() => navigation.navigate('CorridorMap')}
            >
              <MaterialIcons name="alt-route" size={16} color="#1A1C1C" />
              <Text style={styles.routeBtnText}>Route</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Live Transit Tracking Card */}
        <View style={styles.card}>
          <View style={styles.liveTrackingHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <MaterialIcons name="navigation" size={16} color="#1A1C1C" />
              <Text style={styles.cardTitle}>Live Transit Tracking</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('ShipmentsTab')}>
              <Text style={styles.viewAllLink}>View All (3)</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.shipmentItemHeader}>
            <Text style={styles.shipmentId}>CS-8942</Text>
            <Text style={styles.shipmentRoute}>Delhi → Ludhiana</Text>
            <View style={styles.inTransitPill}>
              <View style={styles.greenDot} />
              <Text style={styles.inTransitText}>In Transit</Text>
            </View>
          </View>

          <View style={styles.checkpointInfo}>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              <MaterialIcons name="trip-origin" size={16} color="#000000" style={{ marginTop: 2 }} />
              <View>
                <Text style={styles.checkpointLabel}>NEXT CHECKPOINT</Text>
                <Text style={styles.checkpointTitle}>Karnal Toll Plaza · ETA 14:45</Text>
                <Text style={styles.checkpointSub}>Pacing 64 km/h · Green Corridor Clear</Text>
              </View>
            </View>
            <View style={styles.truckInfoRow}>
              <MaterialIcons name="local-shipping" size={15} color="#5D5F5F" />
              <Text style={styles.truckInfoText}>HR-38-AF-9021 · Tata Prima 28T (Air Suspension)</Text>
            </View>
          </View>

          {/* Photo Banner with Telemetry */}
          <ImageBackground
            source={{ uri: CORRIDOR_MAP_IMG }}
            style={styles.mapBanner}
            imageStyle={{ borderRadius: 8 }}
          >
            <View style={styles.mapBannerOverlay} />
            <View style={styles.mapBannerContent}>
              <View style={styles.mileTag}>
                <Text style={styles.mileTagText}>NH-44 Mile 128</Text>
              </View>
              <View style={styles.telemetryTag}>
                <MaterialIcons name="sensors" size={13} color="#85FAA9" />
                <Text style={styles.telemetryTagText}>Telemetry Synced</Text>
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* Recent Freight Bookings */}
        <View style={styles.recentSection}>
          <View style={styles.recentSectionHeader}>
            <Text style={styles.cardTitle}>Recent Freight Bookings</Text>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
              <Text style={styles.filterText}>Filter</Text>
              <MaterialIcons name="tune" size={14} color="#5D5F5F" />
            </TouchableOpacity>
          </View>

          {/* Consignment 1 */}
          <View style={styles.consignmentCard}>
            <View style={styles.consignmentLeft}>
              <View style={styles.packageIconBox}>
                <MaterialIcons name="inventory-2" size={18} color="#1A1C1C" />
              </View>
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.consignmentId}>CS-8939</Text>
                  <View style={styles.cityPill}>
                    <Text style={styles.cityPillText}>Jaipur South</Text>
                  </View>
                </View>
                <Text style={styles.consignmentDesc}>Auto Components · Standard Dry Bed</Text>
              </View>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.consignmentWeight}>1.8 T</Text>
              <Text style={styles.consignmentStatusAmber}>Awaiting Pickup</Text>
            </View>
          </View>

          {/* Consignment 2 */}
          <View style={styles.consignmentCard}>
            <View style={styles.consignmentLeft}>
              <View style={styles.packageIconBox}>
                <MaterialIcons name="pallet" size={18} color="#1A1C1C" />
              </View>
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.consignmentId}>CS-8924</Text>
                  <View style={styles.cityPill}>
                    <Text style={styles.cityPillText}>Panipat Hub</Text>
                  </View>
                </View>
                <Text style={styles.consignmentDesc}>Textile Yarn Bobbins · Moisture Protected</Text>
              </View>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.consignmentWeight}>4.2 T</Text>
              <Text style={styles.consignmentStatusMuted}>Delivered 11:20</Text>
            </View>
          </View>
        </View>

        {/* CargoSync AI Assistant Prompt Box */}
        <View style={styles.aiBox}>
          <View style={styles.aiHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <MaterialIcons name="smart-toy" size={16} color="#FFFFFF" />
              <Text style={styles.aiTitle}>CargoSync AI Assistant</Text>
            </View>
            <Text style={styles.aiMeta}>Instant Dispatch Query</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.aiChipsRow}>
            <TouchableOpacity
              style={styles.aiChip}
              onPress={() => setIsAssistantOpen(true)}
            >
              <MaterialIcons name="search" size={14} color="#000000" />
              <Text style={styles.aiChipText}>Track my shipment</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.aiChip}
              onPress={() => setIsAssistantOpen(true)}
            >
              <MaterialIcons name="call-merge" size={14} color="#000000" />
              <Text style={styles.aiChipText}>Can this load be consolidated?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.aiChip}
              onPress={() => setIsAssistantOpen(true)}
            >
              <MaterialIcons name="receipt-long" size={14} color="#000000" />
              <Text style={styles.aiChipText}>Export E-Way bill</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </ScrollView>

      {/* Rate Estimator Modal */}
      <RateEstimatorModal
        visible={isRateEstimatorOpen}
        onClose={() => setIsRateEstimatorOpen(false)}
      />

      {/* Assistant Modal */}
      <AssistantModal
        visible={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        role="shipper"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  header: {
    height: 56,
    paddingHorizontal: Spacing.margin,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 20,
    color: '#000000',
    letterSpacing: -0.5,
  },
  brandTitleThin: {
    fontFamily: FontFamily.regular,
    color: '#333333',
  },
  roleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#F3F3F3',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  roleTagText: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: '#4C4546',
    letterSpacing: 0.6,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    backgroundColor: '#F3F3F3',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  langPillText: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: '#000000',
  },
  iconCircleBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F3F3',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#000000',
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
    paddingHorizontal: Spacing.margin,
    paddingTop: Spacing.sm,
    paddingBottom: 90,
    gap: 12,
  },
  subBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  subBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pillBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  pillText: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
    color: '#000000',
  },
  pillTextMuted: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: '#5D5F5F',
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#05944F',
  },
  newShipmentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#000000',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.full,
  },
  newShipmentText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: '#FFFFFF',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  metricTile: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    gap: 4,
  },
  metricTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metricLabel: {
    fontFamily: FontFamily.bold,
    fontSize: 9,
    color: '#5D5F5F',
    letterSpacing: 0.6,
  },
  metricValRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  metricVal: {
    fontFamily: FontFamily.bold,
    fontSize: 22,
    color: '#000000',
  },
  metricValSub: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#5D5F5F',
  },
  metricStatusGreen: {
    fontFamily: FontFamily.semiBold,
    fontSize: 10,
    color: '#05944F',
  },
  metricStatusMuted: {
    fontFamily: FontFamily.regular,
    fontSize: 10,
    color: '#5D5F5F',
  },
  metricStatusDark: {
    fontFamily: FontFamily.semiBold,
    fontSize: 10,
    color: '#000000',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    gap: 10,
  },
  oppHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  oppBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#000000',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  oppBadgeText: {
    fontFamily: FontFamily.bold,
    fontSize: 9,
    color: '#FFFFFF',
    letterSpacing: 0.6,
  },
  aiTag: {
    backgroundColor: '#F3F3F3',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  aiTagText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 10,
    color: '#5D5F5F',
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  truckTag: {
    backgroundColor: '#F3F3F3',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  truckTagText: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: '#000000',
  },
  routeText: {
    flex: 1,
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: '#000000',
  },
  corridorSubText: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: '#5D5F5F',
  },
  payloadBox: {
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    gap: 6,
  },
  payloadHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  payloadTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
    color: '#000000',
  },
  availPill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  availPillText: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: '#000000',
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E8E8E8',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#000000',
  },
  progressEmpty: {
    height: '100%',
    backgroundColor: '#CFC4C5',
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  utilText: {
    fontFamily: FontFamily.medium,
    fontSize: 10,
    color: '#5D5F5F',
  },
  freeSpaceText: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: '#000000',
  },
  insightsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  insightBox: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  insightIconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightMeta: {
    fontFamily: FontFamily.semiBold,
    fontSize: 9,
    color: '#5D5F5F',
    letterSpacing: 0.6,
  },
  insightVal: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
    color: '#000000',
  },
  oppActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },
  reviewLoadsBtn: {
    flex: 1,
    height: 42,
    borderRadius: Radius.xs,
    backgroundColor: '#000000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  reviewLoadsText: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: '#FFFFFF',
  },
  routeBtn: {
    height: 42,
    paddingHorizontal: 18,
    borderRadius: Radius.xs,
    backgroundColor: '#F3F3F3',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  routeBtnText: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: '#000000',
  },
  liveTrackingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: '#000000',
  },
  viewAllLink: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
    color: '#000000',
    textDecorationLine: 'underline',
  },
  shipmentItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F3F3',
  },
  shipmentId: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: '#000000',
  },
  shipmentRoute: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: '#5D5F5F',
  },
  inTransitPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F3F3F3',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  inTransitText: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: '#000000',
  },
  checkpointInfo: {
    gap: 6,
  },
  checkpointLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: 9,
    color: '#5D5F5F',
    letterSpacing: 0.6,
  },
  checkpointTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: '#000000',
  },
  checkpointSub: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#5D5F5F',
  },
  truckInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  truckInfoText: {
    fontFamily: FontFamily.medium,
    fontSize: 11,
    color: '#4C4546',
  },
  mapBanner: {
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    padding: 8,
  },
  mapBannerOverlay: {
    ...StyleSheet.absoluteFill as any,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 8,
  },
  mapBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mileTag: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  mileTagText: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: '#FFFFFF',
  },
  telemetryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  telemetryTagText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 10,
    color: '#FFFFFF',
  },
  recentSection: {
    gap: 8,
  },
  recentSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  filterText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
    color: '#5D5F5F',
  },
  consignmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  consignmentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  packageIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#F3F3F3',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  consignmentId: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: '#000000',
  },
  cityPill: {
    backgroundColor: '#F3F3F3',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  cityPillText: {
    fontFamily: FontFamily.medium,
    fontSize: 10,
    color: '#5D5F5F',
  },
  consignmentDesc: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#5D5F5F',
    marginTop: 2,
  },
  consignmentWeight: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: '#000000',
  },
  consignmentStatusAmber: {
    fontFamily: FontFamily.semiBold,
    fontSize: 10,
    color: '#B45309',
  },
  consignmentStatusMuted: {
    fontFamily: FontFamily.regular,
    fontSize: 10,
    color: '#5D5F5F',
  },
  aiBox: {
    backgroundColor: '#171717',
    borderRadius: 14,
    padding: Spacing.md,
    gap: 10,
    marginBottom: 10,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  aiTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: '#FFFFFF',
  },
  aiMeta: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#A3A3A3',
  },
  aiChipsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  aiChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.full,
  },
  aiChipText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 11,
    color: '#000000',
  },
});
