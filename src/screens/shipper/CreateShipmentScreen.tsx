import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors, FontFamily, Spacing, Radius, Typography, Shadows } from '../../theme/tokens';
import { AppHeader } from '../../components/common/Headers';
import { PrimaryButton } from '../../components/common/AppButton';

const CARGO_CATEGORIES = [
  { id: 'machine_parts', label: 'Machine Parts', icon: 'settings' },
  { id: 'textiles', label: 'Textiles', icon: 'checkroom' },
  { id: 'consumer_goods', label: 'Consumer Goods', icon: 'inventory-2' },
  { id: 'pharma', label: 'Pharma', icon: 'medical-services' },
];

const ENCLOSURES = [
  { id: 'container_32', label: '32ft Container', sub: 'Weatherproof & High Security' },
  { id: 'open_body', label: 'Open Body', sub: 'Easy Top-Crane Loading' },
];

export const CreateShipmentScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const [origin, setOrigin] = useState('Okhla Phase III, New Delhi');
  const [destination, setDestination] = useState('Phase 8 Ind. Area, Mohali');
  const [selectedCategory, setSelectedCategory] = useState('machine_parts');
  const [weight, setWeight] = useState(3.2);
  const [selectedEnclosure, setSelectedEnclosure] = useState('container_32');
  const [allowCombining, setAllowCombining] = useState(true);

  const baselineCost = 14800;
  const combinedCost = Math.round(baselineCost * 0.7); // 30% savings ~ 10,360
  const savings = baselineCost - combinedCost;

  const handleWeightAdjust = (delta: number) => {
    setWeight((prev) => Math.max(0.5, parseFloat((prev + delta).toFixed(1))));
  };

  const handleContinue = () => {
    navigation.navigate('FindTrucks', {
      pickup: origin,
      destination: destination,
      weight: weight,
      category: selectedCategory,
      enclosure: selectedEnclosure,
      allowCombining,
      baselineCost,
      combinedCost,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        title="New Shipment Request"
        subtitle="Step 1 of 3 · Cargo & Route"
        onBack={() => navigation.goBack()}
      />

      {/* Progress Line */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: '33.3%' }]} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Corridor & Route Plan Card */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View>
                <Text style={styles.cardEyebrow}>TRANSIT CORRIDOR</Text>
                <Text style={styles.cardTitle}>NH 44 Express Route</Text>
              </View>
              <View style={styles.distanceBadge}>
                <MaterialIcons name="navigation" size={12} color={Colors.primaryAmber} />
                <Text style={styles.distanceText}>254 km · ~5.5 hrs</Text>
              </View>
            </View>

            {/* Route Timeline Graphic */}
            <View style={styles.routeTimeline}>
              <View style={styles.timelineItem}>
                <View style={[styles.timelineNode, { borderColor: Colors.primaryAmber }]}>
                  <View style={[styles.nodeDot, { backgroundColor: Colors.primaryAmber }]} />
                </View>
                <View style={styles.timelineContent}>
                  <Text style={styles.locationType}>PICKUP POINT (ORIGIN)</Text>
                  <TextInput
                    style={styles.locationInput}
                    value={origin}
                    onChangeText={setOrigin}
                    placeholder="Enter pickup location"
                    placeholderTextColor={Colors.muted}
                  />
                  <Text style={styles.timeTag}>Pickup Schedule: Today, 4:00 PM</Text>
                </View>
              </View>

              <View style={styles.timelineDivider} />

              <View style={styles.timelineItem}>
                <View style={[styles.timelineNode, { borderColor: Colors.black }]}>
                  <View style={[styles.nodeDot, { backgroundColor: Colors.black }]} />
                </View>
                <View style={styles.timelineContent}>
                  <Text style={styles.locationType}>DELIVERY DESTINATION</Text>
                  <TextInput
                    style={styles.locationInput}
                    value={destination}
                    onChangeText={setDestination}
                    placeholder="Enter destination"
                    placeholderTextColor={Colors.muted}
                  />
                  <Text style={styles.timeTag}>Expected Arrival: Tomorrow, 12:00 PM</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Cargo Classification */}
          <View style={styles.card}>
            <Text style={styles.cardEyebrow}>FREIGHT DETAILS</Text>
            <Text style={styles.cardTitle}>Cargo Category</Text>

            <View style={styles.categoryGrid}>
              {CARGO_CATEGORIES.map((cat) => {
                const active = selectedCategory === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.categoryPill, active && styles.categoryPillActive]}
                    onPress={() => setSelectedCategory(cat.id)}
                    activeOpacity={0.8}
                  >
                    <MaterialIcons
                      name={cat.icon as any}
                      size={18}
                      color={active ? Colors.primaryAmber : Colors.textMuted}
                    />
                    <Text style={[styles.categoryLabel, active && styles.categoryLabelActive]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Weight Section */}
            <View style={styles.weightSection}>
              <View style={styles.weightLabelRow}>
                <Text style={styles.inputSubLabel}>Net Cargo Weight</Text>
                <Text style={styles.weightDisplay}>{weight} Tonnes</Text>
              </View>
              <View style={styles.weightStepperRow}>
                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={() => handleWeightAdjust(-0.5)}
                  activeOpacity={0.7}
                >
                  <MaterialIcons name="remove" size={20} color={Colors.textDark} />
                </TouchableOpacity>

                <View style={styles.weightValueBox}>
                  <Text style={styles.weightValueLarge}>{weight}</Text>
                  <Text style={styles.weightUnit}>TONS</Text>
                </View>

                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={() => handleWeightAdjust(0.5)}
                  activeOpacity={0.7}
                >
                  <MaterialIcons name="add" size={20} color={Colors.textDark} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.quickAddPill}
                  onPress={() => handleWeightAdjust(1.0)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.quickAddText}>+1.0 T</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Enclosure / Vehicle Type */}
          <View style={styles.card}>
            <Text style={styles.cardEyebrow}>BODY CONFIGURATION</Text>
            <Text style={styles.cardTitle}>Truck Enclosure</Text>

            <View style={styles.enclosureList}>
              {ENCLOSURES.map((enc) => {
                const active = selectedEnclosure === enc.id;
                return (
                  <TouchableOpacity
                    key={enc.id}
                    style={[styles.enclosureCard, active && styles.enclosureCardActive]}
                    onPress={() => setSelectedEnclosure(enc.id)}
                    activeOpacity={0.85}
                  >
                    <MaterialIcons
                      name={active ? 'radio-button-checked' : 'radio-button-unchecked'}
                      size={20}
                      color={active ? Colors.primaryAmber : Colors.borderDark}
                    />
                    <View style={styles.enclosureInfo}>
                      <Text style={[styles.enclosureTitle, active && styles.enclosureTitleActive]}>
                        {enc.label}
                      </Text>
                      <Text style={styles.enclosureSub}>{enc.sub}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Smart Combining Feature */}
            <TouchableOpacity
              style={[styles.combiningCard, allowCombining && styles.combiningCardActive]}
              onPress={() => setAllowCombining(!allowCombining)}
              activeOpacity={0.85}
            >
              <View style={styles.combiningHeader}>
                <MaterialIcons
                  name={allowCombining ? 'check-box' : 'check-box-outline-blank'}
                  size={22}
                  color={allowCombining ? Colors.primaryAmber : Colors.muted}
                />
                <View style={styles.combiningTitleGroup}>
                  <View style={styles.combiningTitleRow}>
                    <Text style={styles.combiningTitle}>Allow Load Combining</Text>
                    <View style={styles.recommendedBadge}>
                      <Text style={styles.recommendedText}>RECOMMENDED</Text>
                    </View>
                  </View>
                  <Text style={styles.combiningDesc}>
                    Save up to 30% by sharing truck space with verified shipments on NH 44 corridor without route deviation.
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Sticky Bottom Pricing & Action Bar */}
      <View style={styles.stickyBottomBar}>
        <View style={styles.priceContainer}>
          <View>
            <Text style={styles.priceLabel}>ESTIMATED FREIGHT</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceValue}>
                ₹{allowCombining ? combinedCost.toLocaleString() : baselineCost.toLocaleString()}
              </Text>
              {allowCombining && (
                <Text style={styles.strikethroughPrice}>₹{baselineCost.toLocaleString()}</Text>
              )}
            </View>
          </View>
          {allowCombining && (
            <View style={styles.savingTag}>
              <MaterialIcons name="eco" size={12} color={Colors.badgeSuccessText} />
              <Text style={styles.savingTagText}>Save ₹{savings.toLocaleString()}</Text>
            </View>
          )}
        </View>

        <PrimaryButton
          label="Continue to Find Trucks"
          onPress={handleContinue}
          size="lg"
          rightIcon={<MaterialIcons name="arrow-forward" size={18} color={Colors.white} />}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  progressContainer: {
    height: 3,
    backgroundColor: '#E5E7EB',
    width: '100%',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primaryAmber,
  },
  scrollContent: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl + 80,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xs,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: Spacing.lg,
    ...Shadows.tier1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  cardEyebrow: {
    fontSize: 10,
    fontFamily: FontFamily.mono,
    color: Colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  cardTitle: {
    fontSize: Typography.body.fontSize,
    fontFamily: FontFamily.bold,
    color: Colors.textDark,
    marginTop: 2,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.xs,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  distanceText: {
    fontSize: 11,
    fontFamily: FontFamily.bold,
    color: '#92400E',
  },
  routeTimeline: {
    marginTop: Spacing.xs,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  timelineNode: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  nodeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  timelineDivider: {
    width: 2,
    height: 24,
    backgroundColor: '#E5E7EB',
    marginLeft: 8,
    marginVertical: 2,
  },
  timelineContent: {
    flex: 1,
  },
  locationType: {
    fontSize: 9,
    fontFamily: FontFamily.mono,
    color: Colors.muted,
    letterSpacing: 0.5,
  },
  locationInput: {
    fontSize: 14,
    fontFamily: FontFamily.bold,
    color: Colors.textDark,
    paddingVertical: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  timeTag: {
    fontSize: 11,
    fontFamily: FontFamily.medium,
    color: Colors.textMuted,
    marginTop: 2,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: Radius.xs,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryPillActive: {
    backgroundColor: '#FFFBEB',
    borderColor: Colors.primaryAmber,
  },
  categoryLabel: {
    fontSize: 13,
    fontFamily: FontFamily.medium,
    color: Colors.textDark,
  },
  categoryLabelActive: {
    fontFamily: FontFamily.bold,
    color: '#92400E',
  },
  weightSection: {
    marginTop: Spacing.xs,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  weightLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  inputSubLabel: {
    fontSize: 12,
    fontFamily: FontFamily.semiBold,
    color: Colors.textMuted,
  },
  weightDisplay: {
    fontSize: 12,
    fontFamily: FontFamily.mono,
    color: Colors.textDark,
  },
  weightStepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepperBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.xs,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weightValueBox: {
    flex: 1,
    height: 44,
    borderRadius: Radius.xs,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: 4,
  },
  weightValueLarge: {
    fontSize: 20,
    fontFamily: FontFamily.bold,
    color: Colors.textDark,
    lineHeight: 44,
  },
  weightUnit: {
    fontSize: 11,
    fontFamily: FontFamily.mono,
    color: Colors.muted,
  },
  quickAddPill: {
    paddingHorizontal: 12,
    height: 44,
    borderRadius: Radius.xs,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickAddText: {
    fontSize: 12,
    fontFamily: FontFamily.bold,
    color: Colors.textDark,
  },
  enclosureList: {
    gap: 10,
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  enclosureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: Spacing.md,
    borderRadius: Radius.xs,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: Colors.white,
  },
  enclosureCardActive: {
    borderColor: Colors.primaryAmber,
    backgroundColor: '#FFFBEB',
  },
  enclosureInfo: {
    flex: 1,
  },
  enclosureTitle: {
    fontSize: 13,
    fontFamily: FontFamily.bold,
    color: Colors.textDark,
  },
  enclosureTitleActive: {
    color: '#92400E',
  },
  enclosureSub: {
    fontSize: 11,
    fontFamily: FontFamily.regular,
    color: Colors.textMuted,
    marginTop: 2,
  },
  combiningCard: {
    padding: Spacing.md,
    borderRadius: Radius.xs,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  combiningCardActive: {
    backgroundColor: '#F0FDF4',
    borderColor: '#86EFAC',
  },
  combiningHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  combiningTitleGroup: {
    flex: 1,
  },
  combiningTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  combiningTitle: {
    fontSize: 13,
    fontFamily: FontFamily.bold,
    color: Colors.textDark,
  },
  recommendedBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.xs,
  },
  recommendedText: {
    fontSize: 9,
    fontFamily: FontFamily.bold,
    color: '#15803D',
  },
  combiningDesc: {
    fontSize: 11,
    fontFamily: FontFamily.regular,
    color: Colors.textMuted,
    marginTop: 4,
    lineHeight: 16,
  },
  stickyBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    ...Shadows.tier3,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  priceLabel: {
    fontSize: 10,
    fontFamily: FontFamily.mono,
    color: Colors.muted,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  priceValue: {
    fontSize: 22,
    fontFamily: FontFamily.bold,
    color: Colors.textDark,
  },
  strikethroughPrice: {
    fontSize: 14,
    fontFamily: FontFamily.medium,
    color: Colors.muted,
    textDecorationLine: 'line-through',
  },
  savingTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.xs,
  },
  savingTagText: {
    fontSize: 11,
    fontFamily: FontFamily.bold,
    color: '#15803D',
  },
});
