import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors, FontFamily, Spacing, Radius, Typography, Shadows } from '../../theme/tokens';

export const DriverNavigationScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { tripId = 'trp_del_jpr' } = route.params || {};

  const [speed] = useState(58);
  const [isMuted, setIsMuted] = useState(false);
  const [arrived, setArrived] = useState(false);
  const [delayModalVisible, setDelayModalVisible] = useState(false);

  const handleArrival = () => {
    setArrived(true);
    Alert.alert(
      'Gate Arrival Confirmed',
      'Arrival registered at Apex Logistics Gate 3. Proceed to confirm cargo pickup / offload.',
      [
        {
          text: 'Proceed to Confirmation',
          onPress: () => navigation.navigate('DriverConfirmPickup', { tripId }),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Navigation Header (Uber Driver Style) */}
      <View style={styles.topHeader}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            accessibilityLabel="Go Back"
          >
            <MaterialIcons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>
          <View>
            <View style={styles.routeHeaderRow}>
              <Text style={styles.headerRouteTitle}>Jaipur Route</Text>
              <View style={styles.liveGreenDot} />
            </View>
            <Text style={styles.headerVehicleSub}>HR-55-E-4412 · 72% Loaded</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.langPill}
            onPress={() => Alert.alert('Language', 'Switched to Hindi / English.')}
          >
            <MaterialIcons name="language" size={14} color="#9CA3AF" />
            <Text style={styles.langPillText}>EN | हिंदी</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.sosBtn}
            onPress={() => Alert.alert('Emergency Assistance', 'Connecting to 24x7 Highway Patrol & Dispatch Desk...')}
          >
            <MaterialIcons name="sos" size={18} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Turn-by-Turn Guidance Banner */}
      <View style={styles.guidanceBanner}>
        <View style={styles.guidanceLeft}>
          <View style={styles.turnIconBox}>
            <MaterialIcons name="turn-slight-right" size={32} color={Colors.black} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.turnDistRow}>
              <Text style={styles.turnDistText}>In 1.4 km</Text>
              <View style={styles.highwayPill}>
                <Text style={styles.highwayPillText}>NH48</Text>
              </View>
            </View>
            <Text style={styles.turnSubText} numberOfLines={1}>
              Exit toward Shahpura bypass
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.rerouteBtn}
          onPress={() => Alert.alert('Reroute', 'Recalculating alternative expressway route...')}
        >
          <MaterialIcons name="alt-route" size={20} color="#D1D5DB" />
        </TouchableOpacity>
      </View>

      {/* Full-Bleed Map Viewport */}
      <View style={styles.mapContainer}>
        <Image
          source={{
            uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9RiP7vrpP9_xsrXl-NSnePkfB8SKEG6NBV9Y3C6cnQJ1VaH3hFau6cxjWiQjPSAbFoDrUMsabn3lx8PL34RHXEKnR_zyw5MAMRmszHsOrg5WPGh8QthzoppK5kCcNF2dhybM7BshqT1oSFUphhJ9Vc8Ld7HQYcjFL2D01eYM8knMNAe8FdD5zQACpyK6ZVEiZVIYTAcVQlUXyt9TO68vvfjd83dgy3NubJ6WYhaY',
          }}
          style={styles.mapImage}
          resizeMode="cover"
        />

        {/* Top Map Overlays: Live GPS & Speedometer */}
        <View style={styles.topMapOverlay}>
          <View style={styles.gpsLivePill}>
            <View style={styles.pingRing} />
            <Text style={styles.gpsLiveText}>GPS LIVE · 3M</Text>
          </View>

          <View style={styles.speedometerBadge}>
            <View style={styles.speedRow}>
              <Text style={styles.speedNumber}>{speed}</Text>
              <Text style={styles.speedUnit}>km/h</Text>
            </View>
            <View style={styles.speedDivider} />
            <View style={styles.speedLimitCircle}>
              <Text style={styles.speedLimitText}>65</Text>
            </View>
          </View>
        </View>

        {/* Bottom-Left Floating FASTag Banner */}
        <View style={styles.fastTagBanner}>
          <MaterialIcons name="toll" size={17} color="#D97706" />
          <View>
            <Text style={styles.fastTagEyebrow}>FASTAG ACTIVE</Text>
            <Text style={styles.fastTagValue}>Kotputli Toll · 8.2 km</Text>
          </View>
        </View>

        {/* Floating Recenter & Audio Controls */}
        <View style={styles.floatingControls}>
          <TouchableOpacity
            style={styles.controlBtn}
            onPress={() => Alert.alert('Recenter', 'Map centered to truck HR-55-E-4412')}
          >
            <MaterialIcons name="navigation" size={22} color={Colors.black} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.controlBtn}
            onPress={() => setIsMuted(!isMuted)}
          >
            <MaterialIcons
              name={isMuted ? 'volume-off' : 'volume-up'}
              size={22}
              color={Colors.black}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Driver Bottom Sheet (Next Stop Panel) */}
      <View style={styles.bottomSheet}>
        <View style={styles.sheetHandle} />

        {/* Next Stop Header Bar */}
        <View style={styles.stopHeaderBar}>
          <View style={styles.stopHeaderLeft}>
            <View style={styles.stopNumberBadge}>
              <Text style={styles.stopNumberText}>STOP 2 OF 4</Text>
            </View>
            <Text style={styles.stopZoneText} numberOfLines={1}>
              Jaipur Sitapura Ind. Zone
            </Text>
          </View>
          <View style={styles.etaGroup}>
            <MaterialIcons name="schedule" size={15} color="#6B7280" />
            <Text style={styles.etaText}>15:20 ETA</Text>
          </View>
        </View>

        {/* Warehouse Destination Details */}
        <View style={styles.destDetailRow}>
          <View style={{ flex: 1 }}>
            <View style={styles.manifestMeta}>
              <Text style={styles.manifestCode}>MANIFEST CS-7719</Text>
              <Text style={styles.dotSeparator}>•</Text>
              <Text style={styles.dockCode}>DELIVERY DOCK 2</Text>
            </View>
            <Text style={styles.destTitle} numberOfLines={1}>
              Apex Logistics Warehouse Gate 3
            </Text>
            <Text style={styles.destAddress} numberOfLines={1}>
              Plot 44-B, Epip Zone, Sitapura, Jaipur
            </Text>
          </View>

          <TouchableOpacity
            style={styles.phoneBtn}
            onPress={() => Alert.alert('Call', 'Dialing Apex Logistics Gate 3 (+91 141 277 0981)...')}
          >
            <MaterialIcons name="phone" size={20} color={Colors.black} />
          </TouchableOpacity>
        </View>

        {/* Quick Metrics Strip */}
        <View style={styles.metricsStrip}>
          <View style={styles.metricCell}>
            <Text style={styles.metricLabel}>PALLET COUNT</Text>
            <Text style={styles.metricVal}>4 Pallets</Text>
            <Text style={styles.metricSub}>Auto Parts</Text>
          </View>
          <View style={styles.metricCell}>
            <Text style={styles.metricLabel}>STOP WEIGHT</Text>
            <Text style={styles.metricVal}>1,240 kg</Text>
            <Text style={styles.metricSub}>Offload Dock</Text>
          </View>
          <View style={styles.metricCell}>
            <Text style={styles.metricLabel}>REMAINING</Text>
            <Text style={styles.metricVal}>42 km</Text>
            <Text style={styles.metricSub}>~48 mins</Text>
          </View>
        </View>

        {/* Highway Advisory Badge */}
        <View style={styles.advisoryBadge}>
          <MaterialIcons name="warning" size={16} color="#B45309" />
          <Text style={styles.advisoryText}>
            <Text style={{ fontFamily: FontFamily.bold }}>Highway Work:</Text> Kotputli Diversion (+12 min calculated into arrival time).
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.primaryActionBtn, arrived && styles.primaryActionBtnArrived]}
            onPress={handleArrival}
            activeOpacity={0.85}
          >
            <MaterialIcons
              name={arrived ? 'verified' : 'task-alt'}
              size={22}
              color={Colors.white}
            />
            <Text style={styles.primaryActionBtnText}>
              {arrived ? 'Arrived & Docket Queued' : 'Mark Arrived at Gate 3'}
            </Text>
          </TouchableOpacity>

          <View style={styles.secondaryActionsRow}>
            <TouchableOpacity
              style={styles.secondaryActionBtn}
              onPress={() => setDelayModalVisible(true)}
              activeOpacity={0.85}
            >
              <MaterialIcons name="report-problem" size={17} color="#DC2626" />
              <Text style={styles.secondaryActionText}>Report Issue</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryActionBtn}
              onPress={() => Alert.alert('Fleet Dispatch', 'Connecting to 24/7 supervisor on duty...')}
              activeOpacity={0.85}
            >
              <MaterialIcons name="support-agent" size={17} color={Colors.textDark} />
              <Text style={styles.secondaryActionText}>Fleet Dispatch</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Delay / Problem Drawer Modal */}
      <Modal visible={delayModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleGroup}>
                <MaterialIcons name="fmd-bad" size={22} color="#DC2626" />
                <Text style={styles.modalTitle}>Report Corridor Issue</Text>
              </View>
              <TouchableOpacity onPress={() => setDelayModalVisible(false)}>
                <MaterialIcons name="close" size={20} color={Colors.textDark} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalDesc}>
              Select road condition to notify dispatch desk & revise customer ETA.
            </Text>

            <View style={styles.issueOptionsList}>
              {[
                { icon: 'traffic', label: 'Heavy Traffic Congestion', eta: '+25m ETA' },
                { icon: 'car-repair', label: 'Mechanical Check / Tyre', eta: 'Halt' },
                { icon: 'warehouse', label: 'Gate Entry Queue at Dock', eta: 'At Gate' },
              ].map((opt, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.issueOption}
                  onPress={() => {
                    setDelayModalVisible(false);
                    Alert.alert('Issue Reported', `Broadcasted ${opt.label} to fleet ops.`);
                  }}
                  activeOpacity={0.8}
                >
                  <View style={styles.issueLeft}>
                    <MaterialIcons name={opt.icon as any} size={18} color="#4B5563" />
                    <Text style={styles.issueLabel}>{opt.label}</Text>
                  </View>
                  <Text style={styles.issueEta}>{opt.eta}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.submitModalBtn}
              onPress={() => {
                setDelayModalVisible(false);
                Alert.alert('Report Submitted', 'Exception reported to Fleet Dispatch Desk');
              }}
            >
              <Text style={styles.submitModalBtnText}>Submit to Dispatch Desk</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.black,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerRouteTitle: {
    fontSize: 15,
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },
  liveGreenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
  },
  headerVehicleSub: {
    fontSize: 11,
    fontFamily: FontFamily.regular,
    color: '#9CA3AF',
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
    backgroundColor: '#262626',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: Radius.xs,
    borderWidth: 1,
    borderColor: '#404040',
  },
  langPillText: {
    fontSize: 11,
    fontFamily: FontFamily.bold,
    color: '#E5E7EB',
  },
  sosBtn: {
    width: 34,
    height: 34,
    borderRadius: Radius.xs,
    backgroundColor: '#262626',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#404040',
  },
  guidanceBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.black,
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#262626',
  },
  guidanceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  turnIconBox: {
    width: 44,
    height: 44,
    borderRadius: Radius.xs,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  turnDistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  turnDistText: {
    fontSize: 18,
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },
  highwayPill: {
    backgroundColor: '#262626',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.xs,
    borderWidth: 1,
    borderColor: '#059669',
  },
  highwayPillText: {
    fontSize: 10,
    fontFamily: FontFamily.bold,
    color: '#34D399',
  },
  turnSubText: {
    fontSize: 13,
    fontFamily: FontFamily.regular,
    color: '#D1D5DB',
    marginTop: 2,
  },
  rerouteBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.xs,
    backgroundColor: '#262626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapContainer: {
    height: 240,
    position: 'relative',
    backgroundColor: '#1E293B',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  topMapOverlay: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gpsLivePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.xs,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  pingRing: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  gpsLiveText: {
    fontSize: 10,
    fontFamily: FontFamily.bold,
    color: Colors.white,
    letterSpacing: 0.5,
  },
  speedometerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0,0,0,0.9)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.xs,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  speedRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  speedNumber: {
    fontSize: 18,
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },
  speedUnit: {
    fontSize: 10,
    fontFamily: FontFamily.bold,
    color: '#9CA3AF',
  },
  speedDivider: {
    width: 1,
    height: 14,
    backgroundColor: '#4B5563',
  },
  speedLimitCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#EF4444',
    backgroundColor: 'rgba(127,29,29,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  speedLimitText: {
    fontSize: 9,
    fontFamily: FontFamily.bold,
    color: '#FCA5A5',
  },
  fastTagBanner: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.xs,
    ...Shadows.tier2,
  },
  fastTagEyebrow: {
    fontSize: 9,
    fontFamily: FontFamily.mono,
    color: '#6B7280',
  },
  fastTagValue: {
    fontSize: 11,
    fontFamily: FontFamily.bold,
    color: Colors.black,
  },
  floatingControls: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    gap: 8,
  },
  controlBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.xs,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.tier2,
  },
  bottomSheet: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: 10,
    paddingBottom: Spacing.lg,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    alignSelf: 'center',
    marginBottom: 8,
  },
  stopHeaderBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  stopHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  stopNumberBadge: {
    backgroundColor: Colors.black,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.xs,
  },
  stopNumberText: {
    fontSize: 9,
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },
  stopZoneText: {
    fontSize: 13,
    fontFamily: FontFamily.bold,
    color: Colors.textDark,
  },
  etaGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  etaText: {
    fontSize: 12,
    fontFamily: FontFamily.bold,
    color: Colors.textDark,
  },
  destDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  manifestMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  manifestCode: {
    fontSize: 9,
    fontFamily: FontFamily.mono,
    color: '#6B7280',
  },
  dotSeparator: {
    color: '#9CA3AF',
  },
  dockCode: {
    fontSize: 9,
    fontFamily: FontFamily.bold,
    color: '#2563EB',
  },
  destTitle: {
    fontSize: 15,
    fontFamily: FontFamily.bold,
    color: Colors.black,
    marginTop: 2,
  },
  destAddress: {
    fontSize: 11,
    fontFamily: FontFamily.regular,
    color: '#6B7280',
    marginTop: 1,
  },
  phoneBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.xs,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  metricsStrip: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 6,
  },
  metricCell: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: Radius.xs,
    padding: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  metricLabel: {
    fontSize: 8,
    fontFamily: FontFamily.mono,
    color: '#6B7280',
  },
  metricVal: {
    fontSize: 13,
    fontFamily: FontFamily.bold,
    color: Colors.black,
    marginTop: 2,
  },
  metricSub: {
    fontSize: 10,
    fontFamily: FontFamily.regular,
    color: '#9CA3AF',
  },
  advisoryBadge: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: '#FFFBEB',
    padding: 8,
    borderRadius: Radius.xs,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    marginVertical: 6,
  },
  advisoryText: {
    flex: 1,
    fontSize: 11,
    fontFamily: FontFamily.regular,
    color: '#92400E',
    lineHeight: 15,
  },
  actionsContainer: {
    gap: 8,
    marginTop: 6,
  },
  primaryActionBtn: {
    height: 48,
    backgroundColor: Colors.black,
    borderRadius: Radius.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...Shadows.tier2,
  },
  primaryActionBtnArrived: {
    backgroundColor: '#059669',
  },
  primaryActionBtnText: {
    fontSize: 14,
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },
  secondaryActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  secondaryActionBtn: {
    flex: 1,
    height: 40,
    backgroundColor: '#F3F4F6',
    borderRadius: Radius.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  secondaryActionText: {
    fontSize: 12,
    fontFamily: FontFamily.semiBold,
    color: Colors.textDark,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
    padding: 12,
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xs,
    padding: Spacing.md,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  modalTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  modalTitle: {
    fontSize: 15,
    fontFamily: FontFamily.bold,
    color: Colors.textDark,
  },
  modalDesc: {
    fontSize: 12,
    fontFamily: FontFamily.regular,
    color: '#6B7280',
    marginBottom: 10,
  },
  issueOptionsList: {
    gap: 8,
    marginBottom: 12,
  },
  issueOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#F9FAFB',
    borderRadius: Radius.xs,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  issueLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  issueLabel: {
    fontSize: 12,
    fontFamily: FontFamily.medium,
    color: Colors.textDark,
  },
  issueEta: {
    fontSize: 11,
    fontFamily: FontFamily.bold,
    color: '#6B7280',
  },
  submitModalBtn: {
    height: 44,
    backgroundColor: Colors.black,
    borderRadius: Radius.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitModalBtnText: {
    fontSize: 13,
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },
});
