import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors, FontFamily, Spacing, Radius, Typography, Shadows } from '../../theme/tokens';
import { AppHeader } from '../../components/common/Headers';

export const DriverConfirmPickupScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { tripId = 'CS-7720' } = route.params || {};

  const [cargoChecked, setCargoChecked] = useState(true);
  const [weightChecked, setWeightChecked] = useState(true);
  const [sealChecked, setSealChecked] = useState(true);
  const [ewayChecked, setEwayChecked] = useState(true);
  const [otpChecked, setOtpChecked] = useState(true);

  const handleConfirmAndStart = () => {
    Alert.alert(
      'Pickup Verified ✓',
      `Trip ${tripId} is now active. Launching live turn-by-turn route navigation.`,
      [
        {
          text: 'Launch Route Guidance',
          onPress: () => navigation.navigate('DriverNavigation', { tripId }),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        title="Confirm Pickup"
        subtitle="Verification & Gate Clearance"
        onBack={() => navigation.goBack()}
        rightElement={
          <View style={styles.langPill}>
            <MaterialIcons name="language" size={13} color={Colors.textDark} />
            <Text style={styles.langPillText}>EN | हिंदी</Text>
          </View>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Status & Transit Banner */}
        <View style={styles.transitHeader}>
          <View style={styles.stopPill}>
            <View style={styles.activePulseDot} />
            <Text style={styles.stopPillText}>STOP 1 OF 2</Text>
          </View>
          <Text style={styles.tripIdText}>
            ID: <Text style={{ fontFamily: FontFamily.bold, color: Colors.textDark }}>{tripId}</Text>
          </Text>
        </View>

        {/* Location & Stepper Card */}
        <View style={styles.card}>
          <View style={styles.locationHeaderRow}>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <Text style={styles.eyebrow}>CURRENT LOCATION</Text>
              <Text style={styles.locationTitle}>Delhi Logistics Hub</Text>
              <View style={styles.pinRow}>
                <MaterialIcons name="pin-drop" size={14} color="#6B7280" />
                <Text style={styles.pinText}>Okhla Industrial Area Phase III, Gate 4</Text>
              </View>
            </View>
            <View style={styles.warehouseIconCircle}>
              <MaterialIcons name="warehouse" size={20} color={Colors.black} />
            </View>
          </View>

          {/* Stepper Indicator */}
          <View style={styles.stepperContainer}>
            <View style={styles.stepItem}>
              <View style={styles.stepCircleActive}>
                <Text style={styles.stepNumberActive}>1</Text>
              </View>
              <Text style={styles.stepTextActive}>Pickup Check</Text>
            </View>
            <View style={styles.stepLine} />
            <View style={[styles.stepItem, { opacity: 0.5 }]}>
              <View style={styles.stepCircleInactive}>
                <Text style={styles.stepNumberInactive}>2</Text>
              </View>
              <Text style={styles.stepTextInactive}>Destination</Text>
            </View>
          </View>
        </View>

        {/* Main Verification Checklist */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Verification Checklist</Text>
          <Text style={styles.sectionSub}>5/5 Requisite Steps</Text>
        </View>

        <View style={styles.checklistGroup}>
          {/* Step 1: Cargo Verified */}
          <View style={styles.checkCard}>
            <View style={styles.checkCardInner}>
              <TouchableOpacity
                style={[styles.checkbox, cargoChecked && styles.checkboxActive]}
                onPress={() => setCargoChecked(!cargoChecked)}
              >
                {cargoChecked && <MaterialIcons name="check" size={16} color={Colors.white} />}
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                <View style={styles.checkItemHeader}>
                  <Text style={styles.checkTitle}>Cargo Verified</Text>
                  <View style={styles.grayTag}>
                    <Text style={styles.grayTagText}>Secured</Text>
                  </View>
                </View>
                <Text style={styles.checkDesc}>4 Pallets Auto Parts (Tier-1 Transmission Gears)</Text>
                <View style={styles.greenTagRow}>
                  <MaterialIcons name="inventory-2" size={13} color="#059669" />
                  <Text style={styles.greenTagText}>Package Tags: AP-0481 through AP-0484</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Step 2: Net Weight Checked */}
          <View style={styles.checkCard}>
            <View style={styles.checkCardInner}>
              <View style={styles.stepCircleBlack}>
                <MaterialIcons name="scale" size={15} color={Colors.white} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.checkItemHeader}>
                  <Text style={styles.checkTitle}>Net Weight Checked</Text>
                  <View style={styles.checkPillGray}>
                    <MaterialIcons name="check-circle" size={13} color={Colors.black} />
                    <Text style={styles.checkPillGrayText}>WB Slip #992</Text>
                  </View>
                </View>
                <View style={styles.weightBox}>
                  <Text style={styles.weightNum}>3,200</Text>
                  <Text style={styles.weightUnit}>KG</Text>
                  <Text style={styles.scaleInfo}>Weighbridge Scale 02</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Step 3: Container Seal & Photo */}
          <View style={styles.checkCard}>
            <View style={styles.checkCardInner}>
              <View style={styles.stepCircleBlack}>
                <MaterialIcons name="lock" size={15} color={Colors.white} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.checkItemHeader}>
                  <Text style={styles.checkTitle}>Container Seal</Text>
                  <View style={styles.greenTagRow}>
                    <MaterialIcons name="verified" size={13} color="#059669" />
                    <Text style={styles.greenTagText}>Seal Intact</Text>
                  </View>
                </View>
                <Text style={styles.sealNumber}>SL-98234-A</Text>

                {/* Photo Card */}
                <View style={styles.photoContainer}>
                  <Image
                    source={{
                      uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDo4gXBS0WrETtk6lBPeIfJ6sdYNfZfy65O_zOB3MlGcRaUip73wB-EH9j02S4-ndQBFqqmrvTVfcXIRNYQMUSGtTNTEq7LJWXtxHRN0lzzGOr9E1HKI8B4s-5wiiOLyLrc60aO4TxsumzgjTHbDlvArI2H-HnzA2Loivz358aAaQyTZ72e1N1EOiYuDrH0wjRRkXgwxuqZw0mU3a1-tGnkei3kJxzxcSzYOyNN_bA',
                    }}
                    style={styles.sealImage}
                  />
                  <View style={styles.photoInfo}>
                    <Text style={styles.photoTitle}>Timestamped Photo</Text>
                    <Text style={styles.photoTime}>Today, 09:42 AM</Text>
                    <TouchableOpacity
                      style={styles.retakeBtn}
                      onPress={() => Alert.alert('Camera', 'Photo updated with latest timestamp.')}
                    >
                      <MaterialIcons name="photo-camera" size={13} color={Colors.black} />
                      <Text style={styles.retakeText}>Retake Photo</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Step 4: Gate Out Pass / E-Way Bill */}
          <View style={styles.checkCard}>
            <View style={styles.checkCardInner}>
              <View style={styles.stepCircleGray}>
                <MaterialIcons name="receipt-long" size={15} color={Colors.black} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.checkItemHeader}>
                  <Text style={styles.checkTitle}>Gate Out Pass / E-Way</Text>
                  <View style={styles.greenTagRow}>
                    <MaterialIcons name="cloud-done" size={13} color="#059669" />
                    <Text style={styles.greenTagText}>Synced</Text>
                  </View>
                </View>
                <Text style={styles.checkDesc}>E-Way Bill: 2819-4820-1194</Text>
                <View style={styles.subtextWithIcon}>
                  <MaterialIcons name="verified-user" size={13} color="#6B7280" />
                  <Text style={styles.subtextMuted}>Government GST Portal Validated</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Step 5: Supervisor Sign-off / OTP */}
          <View style={styles.checkCard}>
            <View style={styles.checkCardInner}>
              <View style={styles.stepCircleBlack}>
                <MaterialIcons name="key" size={15} color={Colors.white} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.checkItemHeader}>
                  <Text style={styles.checkTitle}>Supervisor Sign-off</Text>
                  <Text style={styles.supervisorName}>R. Sharma (Gate 4)</Text>
                </View>
                <Text style={styles.checkDesc}>Enter 4-Digit Warehouse OTP provided by manager</Text>
                <View style={styles.otpGrid}>
                  {['4', '8', '2', '1'].map((digit, i) => (
                    <View key={i} style={styles.otpBox}>
                      <Text style={styles.otpDigit}>{digit}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>

          {/* Driver Remarks */}
          <View style={styles.remarksCard}>
            <View style={styles.remarksHeader}>
              <MaterialIcons name="edit-note" size={18} color="#6B7280" />
              <Text style={styles.remarksLabel}>DRIVER REMARKS / NOTES</Text>
            </View>
            <View style={styles.remarksBox}>
              <Text style={styles.remarksText}>
                No damages observed on pallets. Stored in dry condition and strapped firmly.
              </Text>
            </View>
          </View>
        </View>

        {/* Bottom Execution Buttons */}
        <View style={styles.bottomButtons}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={handleConfirmAndStart}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>Confirm Pickup & Start Trip</Text>
            <MaterialIcons name="arrow-forward" size={20} color={Colors.white} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => navigation.navigate('ReportProblem', { tripId })}
            activeOpacity={0.85}
          >
            <MaterialIcons name="report-problem" size={18} color="#DC2626" />
            <Text style={styles.secondaryBtnText}>Report a Problem at Pickup</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  scrollContent: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xxl + 20,
    gap: 12,
  },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EEEEEE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.xs,
  },
  langPillText: {
    fontSize: 11,
    fontFamily: FontFamily.bold,
    color: Colors.textDark,
  },
  transitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  stopPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#DCDDDD',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.xs,
  },
  activePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.black,
  },
  stopPillText: {
    fontSize: 10,
    fontFamily: FontFamily.bold,
    color: '#1A1C1C',
    letterSpacing: 0.5,
  },
  tripIdText: {
    fontSize: 13,
    fontFamily: FontFamily.medium,
    color: '#5D5F5F',
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xs,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    ...Shadows.tier1,
  },
  locationHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  eyebrow: {
    fontSize: 9,
    fontFamily: FontFamily.mono,
    color: '#5D5F5F',
    letterSpacing: 0.5,
  },
  locationTitle: {
    fontSize: 16,
    fontFamily: FontFamily.bold,
    color: Colors.black,
    marginTop: 2,
  },
  pinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  pinText: {
    fontSize: 11,
    fontFamily: FontFamily.regular,
    color: '#5D5F5F',
  },
  warehouseIconCircle: {
    width: 38,
    height: 38,
    borderRadius: Radius.xs,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F4F3F3',
    padding: Spacing.sm,
    borderRadius: Radius.xs,
    marginTop: Spacing.md,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stepCircleActive: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberActive: {
    fontSize: 11,
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },
  stepTextActive: {
    fontSize: 12,
    fontFamily: FontFamily.bold,
    color: Colors.black,
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#DCDDDD',
    marginHorizontal: 12,
  },
  stepCircleInactive: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#E2E2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberInactive: {
    fontSize: 11,
    fontFamily: FontFamily.medium,
    color: '#5D5F5F',
  },
  stepTextInactive: {
    fontSize: 12,
    fontFamily: FontFamily.medium,
    color: '#5D5F5F',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: FontFamily.bold,
    color: Colors.black,
  },
  sectionSub: {
    fontSize: 11,
    fontFamily: FontFamily.regular,
    color: '#5D5F5F',
  },
  checklistGroup: {
    gap: 10,
  },
  checkCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xs,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    ...Shadows.tier1,
  },
  checkCardInner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: Radius.xs,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxActive: {
    backgroundColor: Colors.black,
  },
  checkItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkTitle: {
    fontSize: 14,
    fontFamily: FontFamily.bold,
    color: Colors.black,
  },
  grayTag: {
    backgroundColor: '#EEEEEE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.xs,
  },
  grayTagText: {
    fontSize: 10,
    fontFamily: FontFamily.medium,
    color: '#5D5F5F',
  },
  checkDesc: {
    fontSize: 12,
    fontFamily: FontFamily.regular,
    color: '#5D5F5F',
    marginTop: 2,
  },
  greenTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F4F3F3',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.xs,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  greenTagText: {
    fontSize: 11,
    fontFamily: FontFamily.bold,
    color: '#109752',
  },
  stepCircleBlack: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepCircleGray: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E2E2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkPillGray: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E8E8E8',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.xs,
  },
  checkPillGrayText: {
    fontSize: 11,
    fontFamily: FontFamily.medium,
    color: Colors.black,
  },
  weightBox: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    backgroundColor: '#F4F3F3',
    padding: Spacing.sm,
    borderRadius: Radius.xs,
    marginTop: 6,
  },
  weightNum: {
    fontSize: 22,
    fontFamily: FontFamily.bold,
    color: Colors.black,
  },
  weightUnit: {
    fontSize: 12,
    fontFamily: FontFamily.mono,
    color: '#5D5F5F',
  },
  scaleInfo: {
    marginLeft: 'auto',
    fontSize: 11,
    fontFamily: FontFamily.regular,
    color: '#5D5F5F',
  },
  sealNumber: {
    fontSize: 16,
    fontFamily: FontFamily.bold,
    color: Colors.black,
    marginTop: 4,
    letterSpacing: 0.5,
  },
  photoContainer: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#F4F3F3',
    padding: 6,
    borderRadius: Radius.xs,
    marginTop: 8,
  },
  sealImage: {
    width: 72,
    height: 72,
    borderRadius: Radius.xs,
  },
  photoInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  photoTitle: {
    fontSize: 11,
    fontFamily: FontFamily.bold,
    color: Colors.black,
  },
  photoTime: {
    fontSize: 11,
    fontFamily: FontFamily.regular,
    color: '#5D5F5F',
    marginTop: 1,
  },
  retakeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E2E2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.xs,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  retakeText: {
    fontSize: 10,
    fontFamily: FontFamily.bold,
    color: Colors.black,
  },
  subtextWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  subtextMuted: {
    fontSize: 11,
    fontFamily: FontFamily.regular,
    color: '#5D5F5F',
  },
  supervisorName: {
    fontSize: 11,
    fontFamily: FontFamily.medium,
    color: '#5D5F5F',
  },
  otpGrid: {
    flexDirection: 'row',
    gap: 8,
    maxWidth: 240,
    marginTop: 8,
  },
  otpBox: {
    flex: 1,
    height: 44,
    borderRadius: Radius.xs,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpDigit: {
    fontSize: 20,
    fontFamily: FontFamily.bold,
    color: Colors.black,
  },
  remarksCard: {
    backgroundColor: '#F4F3F3',
    borderRadius: Radius.xs,
    padding: Spacing.md,
  },
  remarksHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  remarksLabel: {
    fontSize: 10,
    fontFamily: FontFamily.mono,
    color: '#5D5F5F',
    letterSpacing: 0.5,
  },
  remarksBox: {
    backgroundColor: Colors.white,
    padding: Spacing.sm,
    borderRadius: Radius.xs,
    ...Shadows.tier1,
  },
  remarksText: {
    fontSize: 12,
    fontFamily: FontFamily.regular,
    color: Colors.black,
    lineHeight: 18,
  },
  bottomButtons: {
    gap: 8,
    marginTop: Spacing.sm,
  },
  primaryBtn: {
    height: 50,
    backgroundColor: Colors.black,
    borderRadius: Radius.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...Shadows.tier2,
  },
  primaryBtnText: {
    fontSize: 14,
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },
  secondaryBtn: {
    height: 44,
    backgroundColor: '#E8E8E8',
    borderRadius: Radius.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  secondaryBtnText: {
    fontSize: 13,
    fontFamily: FontFamily.bold,
    color: Colors.black,
  },
});
