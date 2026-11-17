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

export const DriverCompleteDeliveryScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { tripId = 'CS-7720' } = route.params || {};

  const [signatureCleared, setSignatureCleared] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  const handleComplete = () => {
    setIsFinishing(true);
    setTimeout(() => {
      setIsFinishing(false);
      Alert.alert(
        'Delivery Completed! 🎉',
        `Load #${tripId} signoff recorded. Payout of ₹19,300 scheduled for bank settlement.`,
        [
          {
            text: 'Return to Dashboard',
            onPress: () => navigation.navigate('DriverHome'),
          },
        ]
      );
    }, 800);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        title="Proof Of Delivery"
        subtitle="Unload & Signoff Clearance"
        onBack={() => navigation.goBack()}
        rightElement={
          <View style={styles.langPill}>
            <MaterialIcons name="language" size={13} color={Colors.textDark} />
            <Text style={styles.langPillText}>EN | हिंदी</Text>
          </View>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Context & Live Progress Badge */}
        <View style={styles.topContextRow}>
          <View style={styles.stopPill}>
            <View style={styles.greenPulseDot} />
            <Text style={styles.stopPillText}>FINAL STOP • 4 OF 4</Text>
          </View>
          <View style={styles.loadIdPill}>
            <Text style={styles.loadIdText}>LOAD #{tripId}</Text>
          </View>
        </View>

        {/* Stop Location Bento Summary */}
        <View style={styles.card}>
          <View style={styles.locationRow}>
            <View style={styles.warehouseIconCircle}>
              <MaterialIcons name="warehouse" size={20} color={Colors.white} />
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={styles.eyebrow}>FINAL DESTINATION STOP</Text>
              <Text style={styles.locationTitle} numberOfLines={1}>
                Apex Logistics Warehouse Gate 3
              </Text>
              <View style={styles.locationSubRow}>
                <MaterialIcons name="location-on" size={14} color="#6B7280" />
                <Text style={styles.locationSubText} numberOfLines={1}>
                  Jaipur Industrial Area, Rajasthan
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Payout Status Flash Card */}
        <View style={styles.payoutCard}>
          <View style={styles.payoutCircle}>
            <MaterialIcons name="payments" size={24} color="#00210D" />
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.payoutAmountRow}>
              <Text style={styles.payoutAmount}>₹19,300</Text>
              <View style={styles.guaranteedBadge}>
                <Text style={styles.guaranteedText}>SETTLEMENT</Text>
              </View>
            </View>
            <Text style={styles.payoutDesc}>
              Credited to your linked bank account upon verification signoff
            </Text>
          </View>
        </View>

        {/* Proof of Delivery Tasks Header */}
        <View style={styles.tasksHeaderRow}>
          <Text style={styles.tasksHeaderTitle}>Proof of Delivery Tasks</Text>
          <View style={styles.readyBadge}>
            <MaterialIcons name="check-circle" size={14} color="#109752" />
            <Text style={styles.readyBadgeText}>4 / 4 Ready</Text>
          </View>
        </View>

        {/* Task 1: Unload Cargo Photo */}
        <View style={styles.card}>
          <View style={styles.taskHeader}>
            <View style={styles.taskTitleGroup}>
              <View style={styles.taskNumberCircle}>
                <Text style={styles.taskNumber}>1</Text>
              </View>
              <Text style={styles.taskTitle}>Unload Cargo Photo</Text>
            </View>
            <View style={styles.attachedBadge}>
              <MaterialIcons name="check" size={13} color="#109752" />
              <Text style={styles.attachedBadgeText}>Photo Attached</Text>
            </View>
          </View>

          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8SbS2WlAoD0IxbPNPfbUxDPuaLECbLRfn87uTMMQUSKFo806zKC7pVSAKPCNmsF4Av_fi_hyUUhwgI1G8R5nPEe2wnw8DUDRdoM9BV68eKe92b0ziiMfBTL4_7nhaiHo4aAfXLFrIECdetXRWbivJnuf2OVE_KoJQ_6ApEP7h-8p36kRJa3Uya53eKza2RIU46gA_oUPW8Nw2QfIG74isWFtJmzGMtab_8wnC_sk',
              }}
              style={styles.cargoImage}
            />
            <View style={styles.imageOverlay}>
              <View>
                <Text style={styles.imageBayText}>Apex Bay #04 • Dock 3</Text>
                <Text style={styles.imageGeoText}>Geotagged • 26.9124° N, 75.7873° E</Text>
              </View>
              <TouchableOpacity
                style={styles.refreshBtn}
                onPress={() => Alert.alert('Camera', 'Photo refreshed with latest timestamp.')}
              >
                <MaterialIcons name="refresh" size={18} color={Colors.black} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Task 2: Cargo Quality Check */}
        <View style={styles.card}>
          <View style={styles.taskHeader}>
            <View style={styles.taskTitleGroup}>
              <View style={styles.taskNumberCircle}>
                <Text style={styles.taskNumber}>2</Text>
              </View>
              <Text style={styles.taskTitle}>Cargo Quality Check</Text>
            </View>
            <Text style={styles.taskMeta}>4 Pallets Total</Text>
          </View>

          <View style={styles.qualityBox}>
            <View style={styles.qualityLeft}>
              <View style={styles.qualityIconCircle}>
                <MaterialIcons name="verified" size={17} color="#00210D" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.qualityTitle}>All 4 Pallets Received Intact</Text>
                <Text style={styles.qualitySub}>Seals unbroken • Zero pallet damage</Text>
              </View>
            </View>
            <View style={styles.checkedCircle}>
              <MaterialIcons name="check" size={14} color={Colors.white} />
            </View>
          </View>
        </View>

        {/* Task 3: Receiver Signoff */}
        <View style={styles.card}>
          <View style={styles.taskHeader}>
            <View style={styles.taskTitleGroup}>
              <View style={styles.taskNumberCircle}>
                <Text style={styles.taskNumber}>3</Text>
              </View>
              <Text style={styles.taskTitle}>Receiver Signoff</Text>
            </View>
            <TouchableOpacity onPress={() => setSignatureCleared(!signatureCleared)}>
              <Text style={styles.clearBtnText}>{signatureCleared ? 'Restore' : 'Clear'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sigPadBox}>
            <View style={styles.sigDrawArea}>
              {!signatureCleared ? (
                <View style={styles.simulatedSignature}>
                  <Text style={styles.sigCurveText}>R. Sharma</Text>
                  <View style={styles.sigLine} />
                </View>
              ) : (
                <View style={styles.clearedArea}>
                  <Text style={styles.signHerePrompt}>Sign inside using stylus or touch</Text>
                </View>
              )}
            </View>
            <View style={styles.sigFooter}>
              <View style={styles.sigOfficerRow}>
                <MaterialIcons name="edit" size={13} color="#6B7280" />
                <Text style={styles.sigOfficerText}>
                  Receiver Signature (Mr. Rakesh Sharma, Dock Incharge)
                </Text>
              </View>
              <Text style={styles.signedStatusText}>
                {signatureCleared ? 'Pending' : 'Signed'}
              </Text>
            </View>
          </View>
        </View>

        {/* Task 4: Receiver OTP Verification */}
        <View style={styles.card}>
          <View style={styles.taskHeader}>
            <View style={styles.taskTitleGroup}>
              <View style={styles.taskNumberCircle}>
                <Text style={styles.taskNumber}>4</Text>
              </View>
              <Text style={styles.taskTitle}>Receiver OTP Verification</Text>
            </View>
            <View style={styles.attachedBadge}>
              <MaterialIcons name="done-all" size={13} color="#109752" />
              <Text style={styles.attachedBadgeText}>OTP Verified</Text>
            </View>
          </View>

          <View style={styles.otpBoxRow}>
            <View style={styles.otpPhoneLeft}>
              <View style={styles.phoneIconCircle}>
                <MaterialIcons name="smartphone" size={17} color="#5D5F5F" />
              </View>
              <View>
                <Text style={styles.phoneMasked}>+91 98*** 21093</Text>
                <Text style={styles.phoneSub}>OTP verified at 14:38 PM via SMS token</Text>
              </View>
            </View>
            <MaterialIcons name="lock" size={18} color="#109752" />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.bottomButtons}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={handleComplete}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>
              {isFinishing ? 'Processing Signoff...' : 'Complete Delivery & Collect Payout'}
            </Text>
            <MaterialIcons name="arrow-forward" size={18} color={Colors.white} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => navigation.navigate('ReportProblem', { tripId })}
            activeOpacity={0.85}
          >
            <MaterialIcons name="report-problem" size={17} color="#DC2626" />
            <Text style={styles.secondaryBtnText}>Report Partial Delivery or Damage</Text>
          </TouchableOpacity>
        </View>

        {/* 24/7 Helpline Footer */}
        <View style={styles.helpFooter}>
          <Text style={styles.helpText}>
            Need assistance? <Text style={styles.helpLink}>Call Freight Dispatcher Support (24/7)</Text>
          </Text>
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
  topContextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stopPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EEEEEE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.xs,
  },
  greenPulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#109752',
  },
  stopPillText: {
    fontSize: 10,
    fontFamily: FontFamily.bold,
    color: Colors.black,
    letterSpacing: 0.5,
  },
  loadIdPill: {
    backgroundColor: '#E2E2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.xs,
  },
  loadIdText: {
    fontSize: 11,
    fontFamily: FontFamily.bold,
    color: '#4C4546',
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xs,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    ...Shadows.tier1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  warehouseIconCircle: {
    width: 38,
    height: 38,
    borderRadius: Radius.xs,
    backgroundColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyebrow: {
    fontSize: 9,
    fontFamily: FontFamily.mono,
    color: '#6B7280',
    letterSpacing: 0.5,
  },
  locationTitle: {
    fontSize: 15,
    fontFamily: FontFamily.bold,
    color: Colors.black,
    marginTop: 2,
  },
  locationSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  locationSubText: {
    fontSize: 11,
    fontFamily: FontFamily.regular,
    color: '#6B7280',
  },
  payoutCard: {
    backgroundColor: '#00210D',
    borderRadius: Radius.xs,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...Shadows.tier2,
  },
  payoutCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#85FAA9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  payoutAmountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  payoutAmount: {
    fontSize: 22,
    fontFamily: FontFamily.bold,
    color: '#85FAA9',
  },
  guaranteedBadge: {
    backgroundColor: 'rgba(133, 250, 169, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.xs,
  },
  guaranteedText: {
    fontSize: 9,
    fontFamily: FontFamily.bold,
    color: '#85FAA9',
  },
  payoutDesc: {
    fontSize: 11,
    fontFamily: FontFamily.regular,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  tasksHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 2,
    marginTop: 4,
  },
  tasksHeaderTitle: {
    fontSize: 14,
    fontFamily: FontFamily.bold,
    color: Colors.black,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  readyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  readyBadgeText: {
    fontSize: 11,
    fontFamily: FontFamily.bold,
    color: '#109752',
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  taskTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  taskNumberCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskNumber: {
    fontSize: 11,
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },
  taskTitle: {
    fontSize: 14,
    fontFamily: FontFamily.bold,
    color: Colors.black,
  },
  taskMeta: {
    fontSize: 11,
    fontFamily: FontFamily.medium,
    color: '#6B7280',
  },
  attachedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.xs,
  },
  attachedBadgeText: {
    fontSize: 10,
    fontFamily: FontFamily.bold,
    color: '#15803D',
  },
  imageContainer: {
    height: 160,
    borderRadius: Radius.xs,
    overflow: 'hidden',
    position: 'relative',
  },
  cargoImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageBayText: {
    fontSize: 12,
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },
  imageGeoText: {
    fontSize: 10,
    fontFamily: FontFamily.regular,
    color: '#D1D5DB',
  },
  refreshBtn: {
    width: 32,
    height: 32,
    borderRadius: Radius.xs,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qualityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F4F3F3',
    padding: Spacing.sm,
    borderRadius: Radius.xs,
  },
  qualityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  qualityIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#85FAA9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qualityTitle: {
    fontSize: 13,
    fontFamily: FontFamily.bold,
    color: Colors.black,
  },
  qualitySub: {
    fontSize: 11,
    fontFamily: FontFamily.regular,
    color: '#6B7280',
    marginTop: 1,
  },
  checkedCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearBtnText: {
    fontSize: 11,
    fontFamily: FontFamily.bold,
    color: '#6B7280',
    textDecorationLine: 'underline',
  },
  sigPadBox: {
    backgroundColor: '#F4F3F3',
    padding: 6,
    borderRadius: Radius.xs,
  },
  sigDrawArea: {
    backgroundColor: Colors.white,
    height: 90,
    borderRadius: Radius.xs,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  simulatedSignature: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sigCurveText: {
    fontSize: 28,
    fontFamily: FontFamily.semiBold,
    fontStyle: 'italic',
    color: Colors.black,
    letterSpacing: 2,
  },
  sigLine: {
    width: 180,
    height: 1,
    backgroundColor: '#9CA3AF',
    marginTop: -4,
  },
  clearedArea: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  signHerePrompt: {
    fontSize: 12,
    fontFamily: FontFamily.regular,
    color: '#9CA3AF',
  },
  sigFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 6,
    paddingHorizontal: 4,
  },
  sigOfficerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  sigOfficerText: {
    fontSize: 10,
    fontFamily: FontFamily.medium,
    color: '#5D5F5F',
  },
  signedStatusText: {
    fontSize: 10,
    fontFamily: FontFamily.bold,
    color: '#109752',
  },
  otpBoxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F4F3F3',
    padding: Spacing.sm,
    borderRadius: Radius.xs,
  },
  otpPhoneLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  phoneIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneMasked: {
    fontSize: 13,
    fontFamily: FontFamily.bold,
    color: Colors.black,
  },
  phoneSub: {
    fontSize: 10,
    fontFamily: FontFamily.regular,
    color: '#6B7280',
    marginTop: 1,
  },
  bottomButtons: {
    gap: 8,
    marginTop: Spacing.xs,
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
    backgroundColor: '#EEEEEE',
    borderRadius: Radius.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  secondaryBtnText: {
    fontSize: 12,
    fontFamily: FontFamily.bold,
    color: '#DC2626',
  },
  helpFooter: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  helpText: {
    fontSize: 11,
    fontFamily: FontFamily.regular,
    color: '#6B7280',
  },
  helpLink: {
    fontFamily: FontFamily.bold,
    color: Colors.black,
    textDecorationLine: 'underline',
  },
});
