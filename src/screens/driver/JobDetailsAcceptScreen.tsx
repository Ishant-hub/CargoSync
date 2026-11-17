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

export const JobDetailsAcceptScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { jobId = 'CS-7720' } = route.params || {};

  const [isAccepting, setIsAccepting] = useState(false);

  const handleAccept = () => {
    setIsAccepting(true);
    setTimeout(() => {
      setIsAccepting(false);
      Alert.alert(
        'Load Booked Successfully ✓',
        'Route locked. Please proceed to Okhla Logistics Bay #12 for pickup inspection.',
        [
          {
            text: 'Proceed to Pickup',
            onPress: () => {
              navigation.navigate('DriverConfirmPickup', { tripId: jobId });
            },
          },
        ]
      );
    }, 750);
  };

  const handleDecline = () => {
    Alert.alert('Job Passed', 'This load has been removed from your active recommendations.', [
      {
        text: 'OK',
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        title="Load Details"
        subtitle={`Corridor Run · #${jobId}`}
        onBack={() => navigation.goBack()}
        rightElement={
          <View style={styles.langPill}>
            <MaterialIcons name="language" size={13} color={Colors.textDark} />
            <Text style={styles.langPillText}>EN | हिंदी</Text>
          </View>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Urgency & Status Floating Banner */}
        <View style={styles.statusBanner}>
          <View style={styles.statusBannerLeft}>
            <View style={styles.truckIconCircle}>
              <MaterialIcons name="local-shipping" size={20} color={Colors.white} />
            </View>
            <View>
              <View style={styles.loadIdRow}>
                <Text style={styles.loadIdLabel}>LOAD ID</Text>
                <Text style={styles.loadIdValue}>#{jobId}</Text>
              </View>
              <Text style={styles.routeHeadline}>Delhi to Jaipur</Text>
            </View>
          </View>

          <View style={styles.matchPill}>
            <View style={styles.matchDot} />
            <Text style={styles.matchText}>High Match</Text>
          </View>
        </View>

        {/* Highway Corridor Banner */}
        <View style={styles.highwayBanner}>
          <View>
            <Text style={styles.highwayEyebrow}>TRANSIT HIGHWAY</Text>
            <View style={styles.highwayTitleRow}>
              <MaterialIcons name="alt-route" size={16} color={Colors.white} />
              <Text style={styles.highwayTitle}>NH-48 Express Corridor</Text>
            </View>
          </View>
          <View style={styles.distanceBadge}>
            <Text style={styles.distanceText}>260 km total</Text>
          </View>
        </View>

        {/* Detailed Route Itinerary Card */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardEyebrow}>ITINERARY SCHEDULE</Text>
            <View style={styles.driveTimeTag}>
              <MaterialIcons name="schedule" size={14} color="#6B7280" />
              <Text style={styles.driveTimeText}>Approx 5h 45m drive</Text>
            </View>
          </View>

          {/* Stop 1: Pickup */}
          <View style={styles.itineraryItem}>
            <View style={styles.trackCol}>
              <View style={styles.pickupCircle}>
                <MaterialIcons name="north-east" size={14} color={Colors.white} />
              </View>
              <View style={styles.trackLine} />
            </View>
            <View style={styles.itineraryContent}>
              <View style={styles.timeTagRow}>
                <Text style={styles.timeTagLabel}>PICKUP · TODAY</Text>
                <View style={styles.timeTag}>
                  <Text style={styles.timeTagText}>2:00 PM</Text>
                </View>
              </View>
              <Text style={styles.stopName}>Delhi Hub</Text>
              <Text style={styles.stopAddress}>Okhla Phase III Logistics Hub, Gate 4</Text>
              <View style={styles.bayNotice}>
                <MaterialIcons name="warehouse" size={14} color="#6B7280" />
                <Text style={styles.bayNoticeText}>Loading Bay #12 Assigned</Text>
              </View>
            </View>
          </View>

          {/* Stop 2: Dropoff */}
          <View style={styles.itineraryItem}>
            <View style={styles.trackCol}>
              <View style={styles.dropoffCircle}>
                <MaterialIcons name="south-east" size={14} color={Colors.black} />
              </View>
            </View>
            <View style={styles.itineraryContent}>
              <View style={styles.timeTagRow}>
                <Text style={styles.timeTagLabel}>DROPOFF · TOMORROW</Text>
                <View style={styles.timeTag}>
                  <Text style={styles.timeTagText}>10:00 AM</Text>
                </View>
              </View>
              <Text style={styles.stopName}>Jaipur Industrial</Text>
              <Text style={styles.stopAddress}>Sitapura Industrial Zone, Complex Gate 3</Text>
              <View style={styles.bayNotice}>
                <MaterialIcons name="timer" size={14} color="#6B7280" />
                <Text style={styles.bayNoticeText}>Priority Unload Window</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Cargo Specifications & Truck Compatibility */}
        <View style={styles.specsGrid}>
          <View style={styles.specBox}>
            <View style={styles.specIconRow}>
              <MaterialIcons name="inventory-2" size={16} color="#6B7280" />
              <Text style={styles.specEyebrow}>PAYLOAD</Text>
            </View>
            <View>
              <Text style={styles.specTitle}>3.2 Tonnes</Text>
              <Text style={styles.specSub}>Auto Transmission Parts</Text>
            </View>
            <View style={styles.specPill}>
              <Text style={styles.specPillText}>4 Heavy Pallets</Text>
            </View>
          </View>

          <View style={styles.specBox}>
            <View style={styles.specIconRow}>
              <MaterialIcons name="rv-hookup" size={16} color="#6B7280" />
              <Text style={styles.specEyebrow}>TRUCK MATCH</Text>
            </View>
            <View>
              <Text style={styles.specTitle}>32ft MX Box</Text>
              <Text style={styles.specSub}>or 28T Multi-Axle</Text>
            </View>
            <View style={styles.matchPillGreen}>
              <MaterialIcons name="check-circle" size={12} color="#109752" />
              <Text style={styles.matchPillGreenText}>Fit Confirmed</Text>
            </View>
          </View>
        </View>

        {/* Real Cargo Snapshot Micro-Gallery */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cameraRow}>
              <MaterialIcons name="photo-camera" size={16} color="#6B7280" />
              <Text style={styles.cameraTitle}>Shipper Staging Photos</Text>
            </View>
            <Text style={styles.photoCountText}>2 Images</Text>
          </View>

          <View style={styles.galleryGrid}>
            <View style={styles.galleryItem}>
              <Image
                source={{
                  uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCs5tzsS8HfHyM2KkpYCAdbz3WiN__r0cNVPOT931z1-yCPDHXZ9dlTUwNbOHxEauNs0W9UJrwk7wPzKOBgIfiPxSygIITkH9uIIew2pejBFAVencSkumIJyZ_mg_VDTZHmoSBFImDdkhJp4XmCU2SZxsuWERbLc2F17fjb5_yFlW_wWRDBn_bMfXHvGZneH9uXVwvDCzpiMGLDYTwM5nqBAFzSSwnTViDFJOLp4lU',
                }}
                style={styles.galleryImg}
              />
              <View style={styles.galleryTag}>
                <Text style={styles.galleryTagText}>Pallet 1-2</Text>
              </View>
            </View>

            <View style={styles.galleryItem}>
              <Image
                source={{
                  uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlCofPdI1Rf7cGFDZaiM_2KKzbJoNEaBDdafLVKgKJj3XVh0FdUo3nZt51qcsfyF4ExsHARuTc3NDbEvY8eggJRgV55gE6Z0ZqPZeYzbw_aaZTnWagpLv4Yf2x_tFGr3NvWMhBBg1x1q-moA9_WB1omC4nEIVHnF5ZWObY-wsKlPNx5MfSZNwBEeaU39BnhAiJQzD_VtDULrXQvWNzUddIyS0xJDlI9ohgwTUesKg',
                }}
                style={styles.galleryImg}
              />
              <View style={styles.galleryTag}>
                <Text style={styles.galleryTagText}>Loading Bay</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Transparent Payout Breakdown Bento */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.walletRow}>
              <MaterialIcons name="account-balance-wallet" size={18} color={Colors.black} />
              <Text style={styles.walletTitle}>Guaranteed Payout</Text>
            </View>
            <View style={styles.netPill}>
              <Text style={styles.netPillText}>Net Earnings</Text>
            </View>
          </View>

          <View style={styles.payoutHeroBox}>
            <View>
              <Text style={styles.payoutHeroAmount}>₹19,300</Text>
              <View style={styles.instantReleaseRow}>
                <MaterialIcons name="bolt" size={14} color="#109752" />
                <Text style={styles.instantReleaseText}>Instant Release (2 hrs of POD)</Text>
              </View>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.effectiveRateLabel}>Effective Rate</Text>
              <Text style={styles.effectiveRateValue}>
                ₹74.2<Text style={styles.effectiveRateSub}>/km</Text>
              </Text>
            </View>
          </View>

          <View style={styles.lineItemsList}>
            <View style={styles.lineItem}>
              <View style={styles.lineItemLeft}>
                <MaterialIcons name="toll" size={15} color="#6B7280" />
                <Text style={styles.lineItemLabel}>Trip Base Payout</Text>
              </View>
              <Text style={styles.lineItemVal}>₹18,500</Text>
            </View>

            <View style={styles.lineItem}>
              <View style={styles.lineItemLeft}>
                <MaterialIcons name="local-gas-station" size={15} color="#6B7280" />
                <Text style={styles.lineItemLabel}>Fuel Surcharge Adjustment</Text>
              </View>
              <Text style={[styles.lineItemVal, { color: '#109752' }]}>+₹800</Text>
            </View>

            <View style={styles.lineItem}>
              <View style={styles.lineItemLeft}>
                <MaterialIcons name="credit-card" size={15} color="#6B7280" />
                <Text style={styles.lineItemLabel}>Toll & FASTag Allowance</Text>
              </View>
              <View style={styles.includedTag}>
                <Text style={styles.includedTagText}>Included</Text>
              </View>
            </View>

            <View style={styles.lineItem}>
              <View style={styles.lineItemLeft}>
                <MaterialIcons name="hourglass-top" size={15} color="#6B7280" />
                <Text style={styles.lineItemLabel}>Loading & Staging Buffer</Text>
              </View>
              <Text style={styles.lineItemVal}>1 Hour Free</Text>
            </View>
          </View>
        </View>

        {/* Carrier Compliance */}
        <View style={styles.complianceCard}>
          <View style={styles.complianceHeader}>
            <MaterialIcons name="assignment-late" size={18} color={Colors.black} />
            <Text style={styles.complianceTitle}>CARRIER COMPLIANCE</Text>
          </View>

          <View style={styles.complianceItem}>
            <MaterialIcons name="cleaning-services" size={16} color={Colors.black} />
            <View style={{ flex: 1 }}>
              <Text style={styles.complianceItemTitle}>Clean Container Required</Text>
              <Text style={styles.complianceItemDesc}>
                Interior deck must be dry, swept, and free of oil spills prior to dispatch dock entry.
              </Text>
            </View>
          </View>

          <View style={styles.complianceItem}>
            <MaterialIcons name="phonelink-lock" size={16} color={Colors.black} />
            <View style={{ flex: 1 }}>
              <Text style={styles.complianceItemTitle}>E-Way Bill Auto-Synced</Text>
              <Text style={styles.complianceItemDesc}>
                Digital GST E-Way consignment pass will push to your app immediately upon confirmation.
              </Text>
            </View>
          </View>
        </View>

        {/* Shipper Trust Snippet */}
        <View style={styles.card}>
          <View style={styles.shipperRow}>
            <View style={styles.shipperAvatar}>
              <Text style={styles.shipperAvatarText}>AP</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.shipperNameRow}>
                <Text style={styles.shipperName}>Apex Precision Logistics</Text>
                <MaterialIcons name="verified" size={14} color={Colors.black} />
              </View>
              <Text style={styles.shipperStats}>★ 4.9 · 1,240+ verified runs</Text>
            </View>
            <TouchableOpacity
              style={styles.callDispatcherBtn}
              onPress={() => Alert.alert('Dispatcher', 'Connecting to Apex Logistics Desk...')}
            >
              <MaterialIcons name="call" size={18} color={Colors.black} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Primary Action Stack */}
        <View style={styles.actionStack}>
          <TouchableOpacity
            style={styles.acceptBigBtn}
            onPress={handleAccept}
            activeOpacity={0.85}
          >
            <View style={styles.acceptLeft}>
              <MaterialIcons name="check-circle" size={20} color={Colors.white} />
              <Text style={styles.acceptBigText}>
                {isAccepting ? 'Locking Route...' : 'Accept Job Now'}
              </Text>
            </View>
            <View style={styles.acceptRight}>
              <Text style={styles.acceptPriceText}>₹19,300</Text>
              <View style={styles.arrowCircle}>
                <MaterialIcons name="arrow-forward" size={16} color={Colors.black} />
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.declineBtn}
            onPress={handleDecline}
            activeOpacity={0.85}
          >
            <MaterialIcons name="close" size={18} color="#6B7280" />
            <Text style={styles.declineText}>Pass / Decline</Text>
          </TouchableOpacity>

          <Text style={styles.cancellationNotice}>
            Free cancellation within 15 minutes of acceptance before truck arrival.
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
  statusBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#EEEEEE',
    padding: Spacing.sm,
    borderRadius: Radius.xs,
  },
  statusBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  truckIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  loadIdLabel: {
    fontSize: 9,
    fontFamily: FontFamily.mono,
    color: '#6B7280',
  },
  loadIdValue: {
    fontSize: 11,
    fontFamily: FontFamily.bold,
    color: Colors.black,
  },
  routeHeadline: {
    fontSize: 14,
    fontFamily: FontFamily.bold,
    color: Colors.black,
    marginTop: 1,
  },
  matchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#85FAA9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.xs,
  },
  matchDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00210D',
  },
  matchText: {
    fontSize: 10,
    fontFamily: FontFamily.bold,
    color: '#00210D',
  },
  highwayBanner: {
    backgroundColor: Colors.black,
    borderRadius: Radius.xs,
    padding: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  highwayEyebrow: {
    fontSize: 9,
    fontFamily: FontFamily.mono,
    color: '#9CA3AF',
    letterSpacing: 0.5,
  },
  highwayTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  highwayTitle: {
    fontSize: 13,
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },
  distanceBadge: {
    backgroundColor: '#262626',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.xs,
  },
  distanceText: {
    fontSize: 11,
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xs,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    ...Shadows.tier1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  cardEyebrow: {
    fontSize: 10,
    fontFamily: FontFamily.mono,
    color: '#6B7280',
    letterSpacing: 0.5,
  },
  driveTimeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  driveTimeText: {
    fontSize: 11,
    fontFamily: FontFamily.medium,
    color: '#6B7280',
  },
  itineraryItem: {
    flexDirection: 'row',
    gap: 12,
  },
  trackCol: {
    alignItems: 'center',
    width: 26,
  },
  pickupCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E2E2E2',
    marginVertical: 4,
    minHeight: 36,
  },
  dropoffCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itineraryContent: {
    flex: 1,
    paddingBottom: Spacing.sm,
  },
  timeTagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeTagLabel: {
    fontSize: 9,
    fontFamily: FontFamily.mono,
    color: '#6B7280',
  },
  timeTag: {
    backgroundColor: '#EEEEEE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.xs,
  },
  timeTagText: {
    fontSize: 10,
    fontFamily: FontFamily.bold,
    color: Colors.black,
  },
  stopName: {
    fontSize: 14,
    fontFamily: FontFamily.bold,
    color: Colors.black,
    marginTop: 2,
  },
  stopAddress: {
    fontSize: 11,
    fontFamily: FontFamily.regular,
    color: '#6B7280',
    marginTop: 1,
  },
  bayNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  bayNoticeText: {
    fontSize: 11,
    fontFamily: FontFamily.regular,
    color: '#6B7280',
  },
  specsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  specBox: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Radius.xs,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    justifyContent: 'space-between',
    minHeight: 110,
    ...Shadows.tier1,
  },
  specIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  specEyebrow: {
    fontSize: 9,
    fontFamily: FontFamily.mono,
    color: '#6B7280',
  },
  specTitle: {
    fontSize: 14,
    fontFamily: FontFamily.bold,
    color: Colors.black,
    marginTop: 4,
  },
  specSub: {
    fontSize: 10,
    fontFamily: FontFamily.regular,
    color: '#6B7280',
  },
  specPill: {
    backgroundColor: '#EEEEEE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.xs,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  specPillText: {
    fontSize: 10,
    fontFamily: FontFamily.medium,
    color: Colors.black,
  },
  matchPillGreen: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.xs,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  matchPillGreenText: {
    fontSize: 10,
    fontFamily: FontFamily.bold,
    color: '#15803D',
  },
  cameraRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cameraTitle: {
    fontSize: 13,
    fontFamily: FontFamily.bold,
    color: Colors.black,
  },
  photoCountText: {
    fontSize: 11,
    fontFamily: FontFamily.regular,
    color: '#6B7280',
  },
  galleryGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  galleryItem: {
    flex: 1,
    height: 84,
    borderRadius: Radius.xs,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#EEEEEE',
  },
  galleryImg: {
    width: '100%',
    height: '100%',
  },
  galleryTag: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.xs,
  },
  galleryTagText: {
    fontSize: 9,
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },
  walletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  walletTitle: {
    fontSize: 14,
    fontFamily: FontFamily.bold,
    color: Colors.black,
  },
  netPill: {
    backgroundColor: '#EEEEEE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.xs,
  },
  netPillText: {
    fontSize: 10,
    fontFamily: FontFamily.medium,
    color: '#6B7280',
  },
  payoutHeroBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    backgroundColor: '#F4F3F3',
    padding: Spacing.sm,
    borderRadius: Radius.xs,
    marginBottom: Spacing.sm,
  },
  payoutHeroAmount: {
    fontSize: 24,
    fontFamily: FontFamily.bold,
    color: Colors.black,
  },
  instantReleaseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  instantReleaseText: {
    fontSize: 11,
    fontFamily: FontFamily.bold,
    color: '#109752',
  },
  effectiveRateLabel: {
    fontSize: 10,
    fontFamily: FontFamily.regular,
    color: '#6B7280',
  },
  effectiveRateValue: {
    fontSize: 14,
    fontFamily: FontFamily.bold,
    color: Colors.black,
  },
  effectiveRateSub: {
    fontSize: 10,
    color: '#6B7280',
  },
  lineItemsList: {
    gap: 6,
  },
  lineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  lineItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  lineItemLabel: {
    fontSize: 12,
    fontFamily: FontFamily.regular,
    color: Colors.black,
  },
  lineItemVal: {
    fontSize: 13,
    fontFamily: FontFamily.bold,
    color: Colors.black,
  },
  includedTag: {
    backgroundColor: '#EEEEEE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.xs,
  },
  includedTagText: {
    fontSize: 10,
    fontFamily: FontFamily.medium,
    color: '#6B7280',
  },
  complianceCard: {
    backgroundColor: '#E8E8E8',
    borderRadius: Radius.xs,
    padding: Spacing.md,
    gap: 8,
  },
  complianceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  complianceTitle: {
    fontSize: 11,
    fontFamily: FontFamily.bold,
    color: Colors.black,
    letterSpacing: 0.5,
  },
  complianceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: Colors.white,
    padding: Spacing.sm,
    borderRadius: Radius.xs,
  },
  complianceItemTitle: {
    fontSize: 11,
    fontFamily: FontFamily.bold,
    color: Colors.black,
  },
  complianceItemDesc: {
    fontSize: 10,
    fontFamily: FontFamily.regular,
    color: '#4B5563',
    marginTop: 2,
    lineHeight: 14,
  },
  shipperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  shipperAvatar: {
    width: 38,
    height: 38,
    borderRadius: Radius.xs,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shipperAvatarText: {
    fontSize: 13,
    fontFamily: FontFamily.bold,
    color: Colors.black,
  },
  shipperNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  shipperName: {
    fontSize: 13,
    fontFamily: FontFamily.bold,
    color: Colors.black,
  },
  shipperStats: {
    fontSize: 11,
    fontFamily: FontFamily.regular,
    color: '#6B7280',
    marginTop: 1,
  },
  callDispatcherBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.xs,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionStack: {
    gap: 8,
    marginTop: Spacing.xs,
  },
  acceptBigBtn: {
    height: 52,
    backgroundColor: Colors.black,
    borderRadius: Radius.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    ...Shadows.tier2,
  },
  acceptLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  acceptBigText: {
    fontSize: 15,
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },
  acceptRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  acceptPriceText: {
    fontSize: 15,
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },
  arrowCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  declineBtn: {
    height: 44,
    backgroundColor: '#EEEEEE',
    borderRadius: Radius.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  declineText: {
    fontSize: 13,
    fontFamily: FontFamily.semiBold,
    color: Colors.black,
  },
  cancellationNotice: {
    textAlign: 'center',
    fontSize: 11,
    fontFamily: FontFamily.regular,
    color: '#6B7280',
  },
});
