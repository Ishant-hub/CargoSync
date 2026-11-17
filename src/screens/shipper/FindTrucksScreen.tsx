import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors, FontFamily, Spacing, Radius, Typography, Shadows } from '../../theme/tokens';
import { AppHeader } from '../../components/common/Headers';
import { PrimaryButton } from '../../components/common/AppButton';

interface TruckOption {
  id: number;
  name: string;
  badge: string;
  badgeType: 'recommended' | 'fastest' | 'economy';
  price: number;
  originalPrice?: number;
  rating: number;
  driverName: string;
  truckId: string;
  type: string;
  scheduleTime: string;
  scheduleTag: string;
  spacePercent?: number;
  spaceReservedText?: string;
  highlightText: string;
  details: string[];
}

const TRUCK_OPTIONS: TruckOption[] = [
  {
    id: 1,
    name: 'Tata Prima 28T',
    badge: 'Recommended · Save ₹4,600',
    badgeType: 'recommended',
    price: 10200,
    originalPrice: 14800,
    rating: 4.9,
    driverName: 'Rajesh Kumar',
    truckId: 'TRK-27',
    type: 'Shared Co-load',
    scheduleTime: 'Tomorrow, 11:30 AM',
    scheduleTag: 'Standard Drop',
    spacePercent: 86,
    spaceReservedText: '14% reserved for you',
    highlightText: 'Shared load along NH 44 corridor',
    details: [
      'Stops at Sonipat hub to merge dry cargo (45 min buffer)',
      'GPS Live Tracking · FastTag Verified Driver',
    ],
  },
  {
    id: 2,
    name: 'Ashok Leyland 32ft MX',
    badge: 'Fastest · Direct Run',
    badgeType: 'fastest',
    price: 14800,
    rating: 4.8,
    driverName: 'Vikram Singh',
    truckId: 'TRK-14',
    type: 'Single Shipper Dedicated',
    scheduleTime: 'Tomorrow, 9:00 AM',
    scheduleTag: '2.5 hrs faster',
    highlightText: 'Direct non-stop transit · Zero touch transshipment',
    details: [
      'Tamper-evident seal locked at pickup',
      'Exclusive container volume dedicated strictly to your load',
    ],
  },
  {
    id: 3,
    name: 'Flexible Corridor Hold',
    badge: 'Economy · Best Price',
    badgeType: 'economy',
    price: 9400,
    rating: 4.7,
    driverName: 'GT Road Corridor Fleet',
    truckId: 'FLT-09',
    type: 'Save ₹5,400 overall',
    scheduleTime: 'Tomorrow evening',
    scheduleTag: 'Flexible Window',
    highlightText: 'Departs once linehaul completes corridor filling',
    details: [
      'Price guaranteed with free hold until 4:00 PM today',
      'Dedicated freight dispatcher assigned upon allocation',
    ],
  },
];

export const FindTrucksScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { pickup = 'Delhi', destination = 'Chandigarh', weight = 3.2 } = route.params || {};

  const [selectedId, setSelectedId] = useState<number>(1);
  const [expandedId, setExpandedId] = useState<number | null>(1);
  const [isReserving, setIsReserving] = useState<boolean>(false);

  const selectedOption = TRUCK_OPTIONS.find((o) => o.id === selectedId) || TRUCK_OPTIONS[0];

  const handleBook = () => {
    setIsReserving(true);
    setTimeout(() => {
      setIsReserving(false);
      Alert.alert(
        'Booking Confirmed',
        `Your booking with ${selectedOption.name} for ₹${selectedOption.price.toLocaleString('en-IN')} has been reserved.`,
        [
          {
            text: 'View Shipments',
            onPress: () => navigation.navigate('ShipperShipments'),
          },
        ]
      );
    }, 900);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        title="Find Trucks"
        subtitle="Compare verified options"
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Route Summary Header Card */}
        <View style={styles.routeSummaryCard}>
          <View style={styles.routeSummaryHeader}>
            <View style={styles.routeTitleRow}>
              <Text style={styles.routeTitle}>
                {pickup.includes('Delhi') ? 'Delhi' : pickup} ➔ {destination.includes('Mohali') || destination.includes('Chandigarh') ? 'Chandigarh' : destination}
              </Text>
              <View style={styles.optionsCountBadge}>
                <Text style={styles.optionsCountText}>3 options</Text>
              </View>
            </View>
          </View>

          <View style={styles.routeMetaRow}>
            <View style={styles.metaItem}>
              <MaterialIcons name="navigation" size={14} color={Colors.textDark} />
              <Text style={styles.metaText}>248 km · ~5.5 hrs drive</Text>
            </View>
            <Text style={styles.metaDot}>•</Text>
            <View style={styles.metaItem}>
              <MaterialIcons name="inventory-2" size={14} color={Colors.textDark} />
              <Text style={styles.metaText}>{weight} T Payload · 4 Crates</Text>
            </View>
          </View>
        </View>

        {/* Truck Options Cards */}
        <View style={styles.cardsContainer}>
          {TRUCK_OPTIONS.map((opt) => {
            const isSelected = selectedId === opt.id;
            const isExpanded = expandedId === opt.id;

            return (
              <TouchableOpacity
                key={opt.id}
                style={[styles.truckCard, isSelected && styles.truckCardSelected]}
                onPress={() => setSelectedId(opt.id)}
                activeOpacity={0.9}
              >
                {/* Left Selection Accent Bar */}
                {isSelected && <View style={styles.accentBar} />}

                <View style={styles.cardInner}>
                  {/* Badge & Radio Row */}
                  <View style={styles.badgeRow}>
                    <View
                      style={[
                        styles.categoryBadge,
                        opt.badgeType === 'recommended' && styles.categoryBadgeRecommended,
                        opt.badgeType === 'fastest' && styles.categoryBadgeFastest,
                        opt.badgeType === 'economy' && styles.categoryBadgeEconomy,
                      ]}
                    >
                      <MaterialIcons
                        name={
                          opt.badgeType === 'recommended'
                            ? 'auto-awesome'
                            : opt.badgeType === 'fastest'
                            ? 'bolt'
                            : 'savings'
                        }
                        size={13}
                        color={opt.badgeType === 'recommended' ? '#92400E' : Colors.textDark}
                      />
                      <Text
                        style={[
                          styles.categoryBadgeText,
                          opt.badgeType === 'recommended' && styles.categoryBadgeTextRecommended,
                        ]}
                      >
                        {opt.badge}
                      </Text>
                    </View>

                    <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                      {isSelected && <View style={styles.radioInner} />}
                    </View>
                  </View>

                  {/* Title & Price Row */}
                  <View style={styles.titlePriceRow}>
                    <Text style={styles.truckName}>{opt.name}</Text>
                    <View style={styles.priceContainer}>
                      {opt.originalPrice && (
                        <Text style={styles.originalPrice}>₹{opt.originalPrice.toLocaleString()}</Text>
                      )}
                      <Text style={styles.priceText}>₹{opt.price.toLocaleString()}</Text>
                    </View>
                  </View>

                  {/* Rating & Driver Subline */}
                  <View style={styles.driverSubline}>
                    <View style={styles.ratingGroup}>
                      <MaterialIcons name="star" size={14} color={Colors.primaryAmber} />
                      <Text style={styles.ratingText}>{opt.rating}</Text>
                      <Text style={styles.driverText}>
                        · {opt.driverName} {opt.truckId ? `(${opt.truckId})` : ''}
                      </Text>
                    </View>
                    <Text style={styles.typeTag}>{opt.type}</Text>
                  </View>

                  {/* Schedule & Operational Details Box */}
                  <View style={styles.detailsBox}>
                    <View style={styles.scheduleRow}>
                      <View style={styles.scheduleItem}>
                        <MaterialIcons name="schedule" size={15} color={Colors.textMuted} />
                        <Text style={styles.scheduleTime}>{opt.scheduleTime}</Text>
                      </View>
                      <Text style={styles.scheduleTag}>{opt.scheduleTag}</Text>
                    </View>

                    {/* Progress Bar for Co-load */}
                    {opt.spacePercent !== undefined && (
                      <View style={styles.spaceSection}>
                        <View style={styles.spaceLabels}>
                          <Text style={styles.spaceMuted}>Space: {opt.spacePercent}% full</Text>
                          <Text style={styles.spaceBold}>{opt.spaceReservedText}</Text>
                        </View>
                        <View style={styles.progressBarBg}>
                          <View
                            style={[styles.progressBarFill, { width: `${opt.spacePercent}%` }]}
                          />
                        </View>
                      </View>
                    )}

                    {/* Direct non-stop highlight */}
                    {opt.highlightText && !opt.spacePercent && (
                      <View style={styles.highlightRow}>
                        <MaterialIcons name="lock" size={14} color={Colors.textMuted} />
                        <Text style={styles.highlightText}>{opt.highlightText}</Text>
                      </View>
                    )}
                  </View>

                  {/* Expandable Accordion for Details */}
                  <TouchableOpacity
                    style={styles.accordionHeader}
                    onPress={() => setExpandedId(isExpanded ? null : opt.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.accordionTitle}>View trip details & verification</Text>
                    <MaterialIcons
                      name={isExpanded ? 'expand-less' : 'expand-more'}
                      size={18}
                      color={Colors.textDark}
                    />
                  </TouchableOpacity>

                  {isExpanded && (
                    <View style={styles.accordionBody}>
                      {opt.details.map((detail, idx) => (
                        <View key={idx} style={styles.detailRow}>
                          <MaterialIcons
                            name={idx === 0 ? 'alt-route' : 'verified-user'}
                            size={14}
                            color={Colors.textMuted}
                          />
                          <Text style={styles.detailText}>{detail}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* SLA & Trust Card */}
        <View style={styles.trustCard}>
          <View style={styles.trustItem}>
            <MaterialIcons name="verified" size={18} color={Colors.textDark} />
            <View>
              <Text style={styles.trustTitle}>₹50L</Text>
              <Text style={styles.trustSubtitle}>Cargo Cover</Text>
            </View>
          </View>
          <View style={styles.trustDivider} />
          <View style={styles.trustItem}>
            <MaterialIcons name="timer" size={18} color={Colors.textDark} />
            <View>
              <Text style={styles.trustTitle}>±15 min</Text>
              <Text style={styles.trustSubtitle}>Slot Guarantee</Text>
            </View>
          </View>
          <View style={styles.trustDivider} />
          <View style={styles.trustItem}>
            <MaterialIcons name="support-agent" size={18} color={Colors.textDark} />
            <View>
              <Text style={styles.trustTitle}>24x7</Text>
              <Text style={styles.trustSubtitle}>Live Support</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Action Bar */}
      <View style={styles.stickyBottomBar}>
        <View style={styles.bottomSummary}>
          <View style={styles.indicatorRow}>
            <View style={styles.activeDot} />
            <Text style={styles.bottomTypeLabel} numberOfLines={1}>
              {selectedOption.type.toUpperCase()}
            </Text>
          </View>
          <View style={styles.bottomPriceRow}>
            <Text style={styles.bottomPrice}>₹{selectedOption.price.toLocaleString()}</Text>
            <Text style={styles.gstText}>+ GST</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <PrimaryButton
            label={isReserving ? 'Reserving...' : 'Book This Truck'}
            onPress={handleBook}
            size="lg"
            rightIcon={<MaterialIcons name="arrow-forward" size={18} color={Colors.white} />}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  scrollContent: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl + 80,
  },
  routeSummaryCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xs,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: Spacing.md,
    ...Shadows.tier1,
  },
  routeSummaryHeader: {
    marginBottom: Spacing.xs,
  },
  routeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  routeTitle: {
    fontSize: 16,
    fontFamily: FontFamily.bold,
    color: Colors.textDark,
  },
  optionsCountBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.xs,
  },
  optionsCountText: {
    fontSize: 11,
    fontFamily: FontFamily.bold,
    color: Colors.textDark,
  },
  routeMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontFamily: FontFamily.regular,
    color: Colors.textMuted,
  },
  metaDot: {
    color: '#D1D5DB',
  },
  cardsContainer: {
    gap: 12,
    marginBottom: Spacing.lg,
  },
  truckCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xs,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    position: 'relative',
    overflow: 'hidden',
    ...Shadows.tier1,
  },
  truckCardSelected: {
    borderColor: Colors.black,
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: Colors.black,
    zIndex: 1,
  },
  cardInner: {
    padding: Spacing.md,
    paddingLeft: Spacing.md + 2,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.xs,
    backgroundColor: '#F3F4F6',
  },
  categoryBadgeRecommended: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  categoryBadgeFastest: {
    backgroundColor: '#F3F4F6',
  },
  categoryBadgeEconomy: {
    backgroundColor: '#F3F4F6',
  },
  categoryBadgeText: {
    fontSize: 11,
    fontFamily: FontFamily.bold,
    color: Colors.textDark,
  },
  categoryBadgeTextRecommended: {
    color: '#92400E',
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: Colors.black,
    backgroundColor: Colors.black,
  },
  radioInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.white,
  },
  titlePriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: 2,
  },
  truckName: {
    fontSize: 16,
    fontFamily: FontFamily.bold,
    color: Colors.textDark,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  originalPrice: {
    fontSize: 12,
    fontFamily: FontFamily.mono,
    color: Colors.muted,
    textDecorationLine: 'line-through',
  },
  priceText: {
    fontSize: 18,
    fontFamily: FontFamily.bold,
    color: Colors.textDark,
  },
  driverSubline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: Spacing.sm,
  },
  ratingGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontSize: 12,
    fontFamily: FontFamily.bold,
    color: Colors.textDark,
  },
  driverText: {
    fontSize: 12,
    fontFamily: FontFamily.regular,
    color: Colors.textMuted,
  },
  typeTag: {
    fontSize: 11,
    fontFamily: FontFamily.medium,
    color: Colors.textMuted,
  },
  detailsBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: Radius.xs,
    padding: Spacing.sm,
    gap: 6,
  },
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scheduleTime: {
    fontSize: 12,
    fontFamily: FontFamily.bold,
    color: Colors.textDark,
  },
  scheduleTag: {
    fontSize: 11,
    fontFamily: FontFamily.medium,
    color: Colors.textMuted,
  },
  spaceSection: {
    gap: 4,
  },
  spaceLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spaceMuted: {
    fontSize: 10,
    fontFamily: FontFamily.regular,
    color: Colors.textMuted,
  },
  spaceBold: {
    fontSize: 10,
    fontFamily: FontFamily.bold,
    color: Colors.textDark,
  },
  progressBarBg: {
    height: 5,
    backgroundColor: '#E5E7EB',
    borderRadius: 2.5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.black,
    borderRadius: 2.5,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  highlightText: {
    fontSize: 11,
    fontFamily: FontFamily.regular,
    color: Colors.textMuted,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  accordionTitle: {
    fontSize: 11,
    fontFamily: FontFamily.bold,
    color: Colors.textDark,
  },
  accordionBody: {
    marginTop: 6,
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 11,
    fontFamily: FontFamily.regular,
    color: Colors.textMuted,
  },
  trustCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xs,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Shadows.tier1,
  },
  trustItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  trustTitle: {
    fontSize: 11,
    fontFamily: FontFamily.bold,
    color: Colors.textDark,
    lineHeight: 14,
  },
  trustSubtitle: {
    fontSize: 10,
    fontFamily: FontFamily.regular,
    color: Colors.textMuted,
    lineHeight: 12,
  },
  trustDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E5E7EB',
  },
  stickyBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Shadows.tier3,
  },
  bottomSummary: {
    flex: 1,
  },
  indicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.black,
  },
  bottomTypeLabel: {
    fontSize: 10,
    fontFamily: FontFamily.mono,
    color: Colors.muted,
    letterSpacing: 0.5,
  },
  bottomPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginTop: 2,
  },
  bottomPrice: {
    fontSize: 20,
    fontFamily: FontFamily.bold,
    color: Colors.textDark,
  },
  gstText: {
    fontSize: 11,
    fontFamily: FontFamily.regular,
    color: Colors.textMuted,
  },
  buttonContainer: {
    flex: 1,
    maxWidth: 180,
  },
});
