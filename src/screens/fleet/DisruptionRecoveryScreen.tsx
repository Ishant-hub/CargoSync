import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Linking,
  Modal,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors, FontFamily, Spacing, Radius, Typography, Shadows } from '../../theme/tokens';
import { useLanguage } from '../../context/LanguageContext';

export const DisruptionRecoveryScreen: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const [selectedSolution, setSelectedSolution] = useState<'A' | 'B'>('B');
  const [showModal, setShowModal] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(43 * 60 + 13);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleConfirmDispatch = () => {
    setShowModal(true);
  };

  const handleSelectMechanic = () => {
    Alert.alert(
      'Baseline Repair Chosen',
      'Are you sure you want to proceed with baseline repair? Cargo cold-chain SLA breach is projected at 19:30 PM with ₹12,000 SLA penalty.',
      [
        {
          text: 'Dispatch Mechanic',
          onPress: () => Alert.alert('Mechanic Dispatched', 'Mechanic dispatched from Panipat depot. ETA 3h 30m.'),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleCallDriver = () => {
    Linking.openURL('tel:+919876543210').catch(() => {
      Alert.alert('Calling Driver', '+91 98765 43210 (Harpreet Singh)');
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
          <Text style={styles.headerTitle}>Resolve Problem</Text>
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
        {/* Incident Critical Alert Banner (Black Card) */}
        <View style={styles.criticalCard}>
          <View style={styles.criticalTopRow}>
            <View style={styles.flexRowCenter}>
              <View style={styles.redPulseDot} />
              <Text style={styles.incidentCode}>#INC-8942 · HIGH SEVERITY</Text>
            </View>
            <View style={styles.riskBadge}>
              <Text style={styles.riskBadgeText}>DELIVERY DEADLINE AT RISK</Text>
            </View>
          </View>

          <View style={{ gap: 4 }}>
            <Text style={styles.criticalTitle}>Truck Stopped · Delivery Deadline at Risk</Text>
            <Text style={styles.criticalSub}>
              Temperature-controlled medicine needs urgent attention to prevent spoilage.
            </Text>
          </View>

          {/* Live Temp Countdown Meter */}
          <View style={styles.tempMeterBox}>
            <View style={styles.flexRowCenter}>
              <MaterialIcons name="thermostat" size={20} color="#FFDAD6" />
              <View>
                <Text style={styles.tempMeterLabel}>SAFE TEMPERATURE LIMIT</Text>
                <Text style={styles.tempMeterValue}>
                  Current: 4.2°C <Text style={styles.tempMeterSub}>(Safe Up To: 6.0°C)</Text>
                </Text>
              </View>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.timeLeftLabel}>TIME LEFT</Text>
              <Text style={styles.timeLeftVal}>{formatCountdown(secondsLeft)}</Text>
            </View>
          </View>
        </View>

        {/* Telematics & Route Visualizer Box */}
        <View style={styles.visualizerBox}>
          <View style={styles.kmBadge}>
            <MaterialIcons name="location-on" size={14} color="#BA1A1A" />
            <Text style={styles.kmBadgeText}>NH-44 km 86</Text>
          </View>

          <View style={styles.telemetryOverlayCard}>
            <View style={styles.flexRowCenter}>
              <View style={styles.warningCircleSmall}>
                <MaterialIcons name="warning" size={16} color="#93000A" />
              </View>
              <View>
                <Text style={styles.vehStatusLabel}>Vehicle Status</Text>
                <Text style={styles.vehStatusValue}>0 km/h · Battery & Alternator Issue</Text>
              </View>
            </View>
            <View style={styles.engineOffTag}>
              <Text style={styles.engineOffTagText}>Engine Off: 22 mins</Text>
            </View>
          </View>
        </View>

        {/* Stranded Truck Incident Briefing Card */}
        <View style={styles.briefingCard}>
          <View style={styles.briefingTop}>
            <View style={styles.flexRowCenter}>
              <MaterialIcons name="local-shipping" size={18} color="#000000" />
              <Text style={styles.briefingHeaderTitle}>Truck & Driver Details</Text>
            </View>
            <View style={styles.trkBadge}>
              <Text style={styles.trkBadgeText}>TRK-14</Text>
            </View>
          </View>

          <View style={styles.twoColGrid}>
            <View>
              <Text style={styles.colLabel}>Truck ID</Text>
              <Text style={styles.colVal}>Ashok Leyland 32ft</Text>
              <Text style={styles.colSub}>DL-01-AX-9942</Text>
            </View>
            <View>
              <Text style={styles.colLabel}>Assigned Driver</Text>
              <Text style={styles.colVal}>Harpreet Singh</Text>
              <TouchableOpacity onPress={handleCallDriver} style={styles.flexRowCenter}>
                <Text style={styles.callLinkText}>+91 98765 43210</Text>
                <MaterialIcons name="call" size={13} color="#000000" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Broken Alternator Box */}
          <View style={styles.breakdownDetailBox}>
            <View style={styles.breakdownTop}>
              <MaterialIcons name="report-problem" size={17} color="#BA1A1A" style={{ marginTop: 1 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.breakdownTitle}>Broken Alternator · Truck Cannot Move</Text>
                <Text style={styles.breakdownSub}>Location: NH-44 km 86 (Near Samalkha, Panipat)</Text>
              </View>
            </View>

            {/* Cargo Payload Row */}
            <View style={styles.cargoRow}>
              <View style={styles.flexRowCenter}>
                <MaterialIcons name="inventory-2" size={17} color="#5D5F5F" />
                <View>
                  <Text style={styles.cargoLabel}>Cargo Payload</Text>
                  <Text style={styles.cargoValue}>4.8 T Pharma Vials (4 Pallets)</Text>
                </View>
              </View>
              <View style={styles.keepColdBadge}>
                <Text style={styles.keepColdText}>Keep Cold</Text>
              </View>
            </View>

            {/* Destination SLA */}
            <View style={styles.destinationSlaRow}>
              <MaterialIcons name="navigation" size={15} color="#5D5F5F" />
              <Text style={styles.destinationSlaText}>
                Destination: Ludhiana Central Hospital (Must Arrive By: 5:30 PM)
              </Text>
            </View>
          </View>
        </View>

        {/* Compare Solutions Header */}
        <View style={styles.compareHeader}>
          <View>
            <Text style={styles.compareTitle}>Compare Solutions</Text>
            <Text style={styles.compareSub}>Compare recovery options to protect delivery time</Text>
          </View>
          <MaterialIcons name="tune" size={18} color="#5D5F5F" />
        </View>

        {/* Option A: Original Plan (NOT RECOMMENDED) */}
        <TouchableOpacity
          style={[styles.solutionCard, selectedSolution === 'A' && styles.solutionCardSelected]}
          onPress={() => setSelectedSolution('A')}
          activeOpacity={0.9}
        >
          <View style={styles.solutionTopRow}>
            <View style={styles.flexRowCenter}>
              <View style={styles.circleLetterGrey}>
                <Text style={styles.circleLetterTextGrey}>A</Text>
              </View>
              <Text style={styles.solutionTypeGrey}>ORIGINAL PLAN</Text>
            </View>
            <View style={styles.notRecBadge}>
              <Text style={styles.notRecBadgeText}>NOT RECOMMENDED</Text>
            </View>
          </View>

          <Text style={styles.solutionName}>Wait for Roadside Repair Mechanic</Text>
          <Text style={styles.solutionDesc}>Send mechanic team from Panipat repair centre.</Text>

          <View style={styles.optionDetailsGrid}>
            <View style={{ flex: 1 }}>
              <Text style={styles.detailLabel}>Mechanic Arrival & Repair</Text>
              <Text style={styles.detailValRed}>+3 hrs 30 mins delay</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.detailLabel}>New Arrival Time</Text>
              <Text style={styles.detailValRed}>7:30 PM</Text>
            </View>
          </View>

          <View style={styles.penaltyAlertRow}>
            <MaterialIcons name="gavel" size={16} color="#BA1A1A" />
            <Text style={styles.penaltyAlertText}>
              -₹12,000 late penalty + risk of spoiled medicine
            </Text>
          </View>
        </TouchableOpacity>

        {/* Option B: Best Solution (RECOMMENDED) */}
        <TouchableOpacity
          style={[styles.solutionCardBest, selectedSolution === 'B' && styles.solutionCardBestActive]}
          onPress={() => setSelectedSolution('B')}
          activeOpacity={0.9}
        >
          <View style={styles.solutionTopRow}>
            <View style={styles.flexRowCenter}>
              <View style={styles.circleLetterBlack}>
                <Text style={styles.circleLetterTextBlack}>B</Text>
              </View>
              <Text style={styles.solutionTypeBlack}>BEST SOLUTION</Text>
            </View>
            <View style={styles.onTimeBadge}>
              <MaterialIcons name="check-circle" size={13} color="#109752" />
              <Text style={styles.onTimeBadgeText}>ON TIME ARRIVAL</Text>
            </View>
          </View>

          <Text style={styles.solutionName}>Transfer Cargo to Another Truck</Text>
          <Text style={styles.solutionDesc}>
            Send an available nearby truck to quickly move the cargo and continue delivery.
          </Text>

          {/* Nearby Replacement Truck Box */}
          <View style={styles.replacementTruckBox}>
            <View style={styles.flexRowCenter}>
              <View style={styles.truckIconCircle}>
                <MaterialIcons name="local-shipping" size={18} color="#FFFFFF" />
              </View>
              <View>
                <View style={styles.flexRowCenter}>
                  <Text style={styles.replacementTruckCode}>TRK-09</Text>
                  <Text style={styles.replacementTruckDriver}>(Vikas Sharma)</Text>
                </View>
                <Text style={styles.replacementTruckDistance}>14 km away · Karnal Parking Yard</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.replacementCallBtn}
              onPress={() => Linking.openURL('tel:+919811223344')}
            >
              <MaterialIcons name="call" size={16} color="#000000" />
            </TouchableOpacity>
          </View>

          {/* Transfer Metrics */}
          <View style={styles.transferMetricsBox}>
            <View style={styles.metricRow}>
              <View style={styles.flexRowCenter}>
                <MaterialIcons name="forklift" size={15} color="#5D5F5F" />
                <Text style={styles.metricName}>Transfer Process</Text>
              </View>
              <Text style={styles.metricValBold}>25 mins to move 4 pallets</Text>
            </View>

            <View style={styles.metricRow}>
              <View style={styles.flexRowCenter}>
                <MaterialIcons name="schedule" size={15} color="#5D5F5F" />
                <Text style={styles.metricName}>New Arrival Time</Text>
              </View>
              <Text style={styles.metricValGreen}>5:15 PM (15 mins before deadline)</Text>
            </View>

            <View style={styles.metricRow}>
              <View style={styles.flexRowCenter}>
                <MaterialIcons name="payments" size={15} color="#5D5F5F" />
                <Text style={styles.metricName}>Extra Cost</Text>
              </View>
              <Text style={styles.metricValBold}>+₹850 (Saves ₹12,000 penalty)</Text>
            </View>
          </View>

          {/* Timeline Nodes */}
          <View style={styles.solutionTimeline}>
            <View style={styles.timelineStep}>
              <View style={styles.stepDotBlack} />
              <Text style={styles.stepTime}>14:20</Text>
              <Text style={styles.stepSub}>Truck Departs</Text>
            </View>
            <View style={styles.stepLine} />
            <View style={styles.timelineStep}>
              <View style={styles.stepDotBlack} />
              <Text style={styles.stepTime}>14:45</Text>
              <Text style={styles.stepSub}>Move Cargo</Text>
            </View>
            <View style={styles.stepLine} />
            <View style={styles.timelineStep}>
              <View style={styles.stepDotGreen} />
              <Text style={styles.stepTimeGreen}>17:15</Text>
              <Text style={styles.stepSubGreen}>Arrive Dest.</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Actions Area (Radius.xs = 4px) */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.primaryDispatchBtn}
            onPress={handleConfirmDispatch}
            activeOpacity={0.85}
          >
            <MaterialIcons name="electric-bolt" size={18} color="#FFFFFF" />
            <Text style={styles.primaryDispatchBtnText}>
              Confirm Replacement Truck (TRK-09) →
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.outlineMechanicBtn}
            onPress={handleSelectMechanic}
            activeOpacity={0.85}
          >
            <MaterialIcons name="build" size={16} color="#5D5F5F" />
            <Text style={styles.outlineMechanicBtnText}>Keep Original Plan & Send Mechanic</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.greyCallDriverBtn}
            onPress={handleCallDriver}
            activeOpacity={0.85}
          >
            <MaterialIcons name="phone-in-talk" size={16} color="#000000" />
            <Text style={styles.greyCallDriverBtnText}>Call Stranded Driver (Harpreet S.)</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Confirmation Modal Sheet */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <View style={styles.verifiedIconCircle}>
                <MaterialIcons name="verified" size={24} color="#109752" />
              </View>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setShowModal(false)}
              >
                <MaterialIcons name="close" size={18} color="#000000" />
              </TouchableOpacity>
            </View>

            <View style={{ gap: 4 }}>
              <Text style={styles.modalTitle}>Dispatch Authorization</Text>
              <Text style={styles.modalSub}>
                Cross-dock order broadcasted to <Text style={{ fontWeight: 'bold' }}>TRK-09 (Vikas Sharma)</Text> via Fleet Telematics. Stranded driver Harpreet notified.
              </Text>
            </View>

            <View style={styles.modalEtaBox}>
              <Text style={styles.modalEtaLabel}>Assigned Staging ETA:</Text>
              <Text style={styles.modalEtaValue}>14:42 PM @ KM 86</Text>
            </View>

            <TouchableOpacity
              style={styles.modalConfirmBtn}
              onPress={() => {
                setShowModal(false);
                navigation.navigate('FleetTabs');
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.modalConfirmBtnText}>Monitor Live Telematics</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default DisruptionRecoveryScreen;

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
  criticalCard: {
    backgroundColor: '#000000',
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: 10,
    ...Shadows.md,
  },
  criticalTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flexRowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  redPulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#BA1A1A',
  },
  incidentCode: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: '#C6C6C6',
    letterSpacing: 0.6,
  },
  riskBadge: {
    backgroundColor: '#FFDAD6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  riskBadgeText: {
    fontFamily: FontFamily.bold,
    fontSize: 9,
    color: '#93000A',
    letterSpacing: 0.5,
  },
  criticalTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  criticalSub: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#C6C6C6',
    lineHeight: 16,
  },
  tempMeterBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 10,
    borderRadius: Radius.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  tempMeterLabel: {
    fontFamily: FontFamily.bold,
    fontSize: 9,
    color: '#C6C6C6',
    letterSpacing: 0.5,
  },
  tempMeterValue: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: '#FFFFFF',
  },
  tempMeterSub: {
    fontFamily: FontFamily.regular,
    fontSize: 10,
    color: '#DADADA',
  },
  timeLeftLabel: {
    fontFamily: FontFamily.bold,
    fontSize: 9,
    color: '#FFDAD6',
    letterSpacing: 0.5,
  },
  timeLeftVal: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '900',
  },
  visualizerBox: {
    height: 140,
    backgroundColor: '#E2E2E2',
    borderRadius: Radius.md,
    justifyContent: 'space-between',
    padding: 10,
  },
  kmBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  kmBadgeText: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: '#000000',
  },
  telemetryOverlayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: Radius.xs,
    padding: 8,
  },
  warningCircleSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFDAD6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehStatusLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 10,
    color: '#5D5F5F',
  },
  vehStatusValue: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: '#000000',
  },
  engineOffTag: {
    backgroundColor: '#EEEEEE',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  engineOffTagText: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: '#000000',
  },
  briefingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    gap: 10,
    ...Shadows.sm,
  },
  briefingTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  briefingHeaderTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: '#000000',
  },
  trkBadge: {
    backgroundColor: '#EEEEEE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  trkBadgeText: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: '#000000',
  },
  twoColGrid: {
    flexDirection: 'row',
    paddingVertical: 4,
  },
  colLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 10,
    color: '#5D5F5F',
  },
  colVal: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
    color: '#000000',
    marginTop: 1,
  },
  colSub: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#5D5F5F',
  },
  callLinkText: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: '#000000',
  },
  breakdownDetailBox: {
    backgroundColor: '#F4F3F3',
    borderRadius: Radius.xs,
    padding: 10,
    gap: 8,
  },
  breakdownTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  breakdownTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
    color: '#000000',
  },
  breakdownSub: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#5D5F5F',
    marginTop: 1,
  },
  cargoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: Radius.xs,
  },
  cargoLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 10,
    color: '#5D5F5F',
  },
  cargoValue: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: '#000000',
  },
  keepColdBadge: {
    backgroundColor: '#FFDAD6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  keepColdText: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: '#93000A',
  },
  destinationSlaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingTop: 2,
  },
  destinationSlaText: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#5D5F5F',
    flex: 1,
  },
  compareHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  compareTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: '#000000',
    fontWeight: '800',
  },
  compareSub: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#5D5F5F',
  },
  solutionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    gap: 8,
    opacity: 0.85,
    ...Shadows.sm,
  },
  solutionCardSelected: {
    borderColor: '#000000',
    opacity: 1,
  },
  solutionTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  circleLetterGrey: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleLetterTextGrey: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: '#000000',
  },
  solutionTypeGrey: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: '#5D5F5F',
    letterSpacing: 0.5,
  },
  notRecBadge: {
    backgroundColor: '#EEEEEE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  notRecBadgeText: {
    fontFamily: FontFamily.bold,
    fontSize: 9,
    color: '#5D5F5F',
  },
  solutionName: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: '#000000',
  },
  solutionDesc: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#5D5F5F',
  },
  optionDetailsGrid: {
    flexDirection: 'row',
    backgroundColor: '#F4F3F3',
    padding: 8,
    borderRadius: Radius.xs,
  },
  detailLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 10,
    color: '#5D5F5F',
  },
  detailValRed: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
    color: '#BA1A1A',
    marginTop: 2,
  },
  penaltyAlertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFDAD6',
    padding: 8,
    borderRadius: Radius.xs,
  },
  penaltyAlertText: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: '#93000A',
    flex: 1,
  },
  solutionCardBest: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: '#000000',
    gap: 8,
    ...Shadows.md,
  },
  solutionCardBestActive: {
    borderColor: '#000000',
  },
  circleLetterBlack: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleLetterTextBlack: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: '#FFFFFF',
  },
  solutionTypeBlack: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: '#000000',
    letterSpacing: 0.5,
  },
  onTimeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#00210D',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  onTimeBadgeText: {
    fontFamily: FontFamily.bold,
    fontSize: 9,
    color: '#85FAA9',
    letterSpacing: 0.5,
  },
  replacementTruckBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EEEEEE',
    padding: 10,
    borderRadius: Radius.xs,
  },
  truckIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  replacementTruckCode: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
    color: '#000000',
  },
  replacementTruckDriver: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#5D5F5F',
  },
  replacementTruckDistance: {
    fontFamily: FontFamily.semiBold,
    fontSize: 10,
    color: '#109752',
  },
  replacementCallBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  transferMetricsBox: {
    backgroundColor: '#F4F3F3',
    padding: 10,
    borderRadius: Radius.xs,
    gap: 6,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metricName: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#5D5F5F',
  },
  metricValBold: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: '#000000',
  },
  metricValGreen: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: '#109752',
  },
  solutionTimeline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  timelineStep: {
    alignItems: 'center',
  },
  stepDotBlack: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#000000',
    marginBottom: 2,
  },
  stepDotGreen: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#109752',
    marginBottom: 2,
  },
  stepTime: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: '#000000',
  },
  stepTimeGreen: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: '#109752',
  },
  stepSub: {
    fontFamily: FontFamily.regular,
    fontSize: 10,
    color: '#5D5F5F',
  },
  stepSubGreen: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: '#109752',
  },
  stepLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#DCDDDD',
    marginHorizontal: 4,
    marginBottom: 12,
  },
  actionsContainer: {
    gap: 8,
    paddingTop: 4,
  },
  primaryDispatchBtn: {
    height: 48,
    backgroundColor: '#000000',
    borderRadius: Radius.xs, // 4px exact Stitch requirement
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    ...Shadows.sm,
  },
  primaryDispatchBtnText: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: '#FFFFFF',
  },
  outlineMechanicBtn: {
    height: 44,
    backgroundColor: '#F4F3F3',
    borderWidth: 1,
    borderColor: '#D4D4D4',
    borderRadius: Radius.xs, // 4px exact Stitch requirement
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  outlineMechanicBtnText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
    color: '#1A1C1C',
  },
  greyCallDriverBtn: {
    height: 44,
    backgroundColor: '#EEEEEE',
    borderRadius: Radius.xs, // 4px exact Stitch requirement
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  greyCallDriverBtnText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
    color: '#1A1C1C',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    padding: Spacing.base,
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    padding: Spacing.lg,
    gap: 12,
    ...Shadows.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  verifiedIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00210D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: '#000000',
    fontWeight: '800',
  },
  modalSub: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: '#5D5F5F',
    lineHeight: 18,
  },
  modalEtaBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F4F3F3',
    padding: 10,
    borderRadius: Radius.xs,
  },
  modalEtaLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: '#5D5F5F',
  },
  modalEtaValue: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
    color: '#000000',
  },
  modalConfirmBtn: {
    height: 46,
    backgroundColor: '#000000',
    borderRadius: Radius.xs,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  modalConfirmBtnText: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: '#FFFFFF',
  },
});
