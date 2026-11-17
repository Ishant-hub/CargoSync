import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors, FontFamily, Spacing, Radius, Typography, Shadows } from '../../theme/tokens';
import { AppHeader } from '../../components/common/Headers';

interface CategoryOption {
  id: string;
  title: string;
  desc: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  badge?: string;
}

const CATEGORIES: CategoryOption[] = [
  {
    id: 'truck',
    title: 'Truck Problem',
    desc: 'Engine issue, tire puncture, mechanical failure',
    icon: 'build',
  },
  {
    id: 'traffic',
    title: 'Heavy Traffic / Road Closed',
    desc: 'Highway blockage, weather delay, toll plaza congestion',
    icon: 'traffic',
    badge: '+45m',
  },
  {
    id: 'dock',
    title: 'Warehouse / Dock Delay',
    desc: 'Gate closed, long queue, unable to offload or scan BOL',
    icon: 'warehouse',
  },
  {
    id: 'cargo',
    title: 'Wrong or Damaged Cargo',
    desc: 'Pallet seal broken, count mismatch, water leak or tilt',
    icon: 'inventory-2',
  },
  {
    id: 'other',
    title: 'Other Issue',
    desc: 'Personal medical emergency or permit document missing',
    icon: 'help-outline',
  },
];

export const ReportProblemScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { tripId = 'CS-7720' } = route.params || {};

  const [selectedCat, setSelectedCat] = useState('truck');
  const [notes, setNotes] = useState('Near Karnal Toll Mile 128, right rear tire blowout. Safe on shoulder but need roadside tire tech.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Report Sent · Help Dispatched',
        'Ticket dispatched to carrier desk. A freight operations dispatcher has been notified.',
        [
          {
            text: 'Return to Trip',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    }, 900);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        title="Report A Problem"
        subtitle="Live Incident Notification"
        onBack={() => navigation.goBack()}
        rightElement={
          <View style={styles.langPill}>
            <Text style={styles.langPillText}>EN | हिंदी</Text>
          </View>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Active Trip Context Pill */}
        <View style={styles.contextPill}>
          <View style={styles.contextLeft}>
            <View style={styles.truckIconCircle}>
              <MaterialIcons name="local-shipping" size={16} color={Colors.white} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.contextEyebrow}>ACTIVE FREIGHT LOAD</Text>
              <Text style={styles.contextTitle} numberOfLines={1}>
                #{tripId} · Delhi → Jaipur · TRK-27
              </Text>
            </View>
          </View>
          <View style={styles.liveGpsBadge}>
            <Text style={styles.liveGpsText}>Live GPS</Text>
          </View>
        </View>

        {/* Guidance Header */}
        <View style={styles.guidanceHeader}>
          <Text style={styles.headerTitle}>Report a Problem</Text>
          <Text style={styles.headerSubtitle}>
            Tell dispatch what happened. We will reroute, notify the receiver, and help right away.
          </Text>
        </View>

        {/* Issue Categories */}
        <View style={styles.categoriesList}>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCat === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoryCard, isSelected && styles.categoryCardSelected]}
                onPress={() => setSelectedCat(cat.id)}
                activeOpacity={0.85}
              >
                <View style={[styles.catIconCircle, isSelected && styles.catIconCircleSelected]}>
                  <MaterialIcons
                    name={cat.icon}
                    size={22}
                    color={isSelected ? Colors.white : Colors.black}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <View style={styles.catTitleRow}>
                    <View style={styles.catLabelRow}>
                      <Text style={styles.catTitle}>{cat.title}</Text>
                      {cat.badge && (
                        <View style={styles.catBadge}>
                          <Text style={styles.catBadgeText}>{cat.badge}</Text>
                        </View>
                      )}
                    </View>
                    <View style={[styles.catRadio, isSelected && styles.catRadioSelected]}>
                      {isSelected && <MaterialIcons name="check" size={14} color={Colors.white} />}
                    </View>
                  </View>
                  <Text style={styles.catDesc}>{cat.desc}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Photo Attachment Card */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.photoHeaderLeft}>
              <MaterialIcons name="photo-camera" size={18} color={Colors.black} />
              <Text style={styles.cardHeaderTitle}>Add Photo Proof</Text>
            </View>
            <Text style={styles.optionalText}>Optional (Max 3)</Text>
          </View>

          <View style={styles.photoRow}>
            <TouchableOpacity
              style={styles.takePhotoBtn}
              onPress={() => Alert.alert('Camera', 'Photo proof captured.')}
            >
              <MaterialIcons name="add-a-photo" size={26} color={Colors.black} />
              <Text style={styles.takePhotoText}>Take Photo</Text>
            </TouchableOpacity>

            <View style={styles.photoThumbnailBox}>
              <Image
                source={{
                  uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2HLXhpOZ7dZITe72q1tkiCjPhQkuudOtAgLEBjCLKD_r29RULAQbc12UWz3lyrFXgWVRpkT_ZWeFlNpBtPoKpCkp-cKnN6Q_26j-d07E_UAaodj37JOqWrP0g5l5fp3saVH1Dyl17xAcCLxRINo4oJliYyVbTXFz0bw_Tqhj0lZuona_69JOBqcS7FWGRlaPgtMQW1DovfIKrCJGtMpgxbgGvWOCQBkanM5NwIxo',
                }}
                style={styles.thumbnailImg}
              />
              <View style={styles.doneCircle}>
                <MaterialIcons name="done" size={12} color={Colors.white} />
              </View>
            </View>
          </View>
          <Text style={styles.photoHint}>
            A quick photo helps dispatch verify damage or send mechanic services rapidly.
          </Text>
        </View>

        {/* Detailed Notes Input */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardHeaderTitle}>Write Details</Text>
            <Text style={styles.optionalText}>Voice or Text</Text>
          </View>

          <View style={styles.textareaWrapper}>
            <TextInput
              style={styles.textarea}
              placeholder="e.g. Near Karnal Toll Mile 128, right rear tire blowout. Safe on shoulder but need roadside tire tech."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
              value={notes}
              onChangeText={setNotes}
            />
            <TouchableOpacity
              style={styles.micBtn}
              onPress={() => Alert.alert('Voice Input', 'Listening for incident notes...')}
            >
              <MaterialIcons name="mic" size={18} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Emergency Hotline Banner */}
        <View style={styles.hotlineBanner}>
          <View style={styles.supportCircle}>
            <MaterialIcons name="support-agent" size={20} color={Colors.black} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.hotlineTitle}>Immediate Dispatch Emergency?</Text>
            <Text style={styles.hotlineSub}>Toll-free 24/7 helpline available in Hindi and English.</Text>
            <TouchableOpacity
              style={styles.callHotlineRow}
              onPress={() => Alert.alert('Dialing', 'Calling +91 1800 200 4400...')}
            >
              <MaterialIcons name="call" size={15} color={Colors.black} />
              <Text style={styles.hotlinePhone}>+91 1800 200 4400</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Operational CTAs */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.sendReportBtn}
          onPress={handleSubmit}
          activeOpacity={0.85}
        >
          <Text style={styles.sendReportBtnText}>
            {isSubmitting ? 'Dispatching Ticket...' : 'Send Problem Report'}
          </Text>
          <View style={styles.arrowCircle}>
            <MaterialIcons name="arrow-forward" size={16} color={Colors.black} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.callDirectBtn}
          onPress={() => Alert.alert('Dispatcher', 'Connecting directly to Fleet Dispatcher...')}
          activeOpacity={0.85}
        >
          <MaterialIcons name="call" size={17} color={Colors.black} />
          <Text style={styles.callDirectBtnText}>Call Dispatcher Directly</Text>
        </TouchableOpacity>
      </View>
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
    paddingBottom: Spacing.xxl + 100,
    gap: 12,
  },
  langPill: {
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
  contextPill: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F4F3F3',
    padding: Spacing.sm,
    borderRadius: Radius.xs,
  },
  contextLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  truckIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contextEyebrow: {
    fontSize: 8,
    fontFamily: FontFamily.mono,
    color: '#6B7280',
    letterSpacing: 0.5,
  },
  contextTitle: {
    fontSize: 11,
    fontFamily: FontFamily.bold,
    color: Colors.black,
  },
  liveGpsBadge: {
    backgroundColor: '#EEEEEE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.xs,
  },
  liveGpsText: {
    fontSize: 10,
    fontFamily: FontFamily.bold,
    color: Colors.black,
  },
  guidanceHeader: {
    gap: 2,
    paddingHorizontal: 2,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: FontFamily.bold,
    color: Colors.black,
  },
  headerSubtitle: {
    fontSize: 13,
    fontFamily: FontFamily.regular,
    color: '#5D5F5F',
    lineHeight: 18,
  },
  categoriesList: {
    gap: 8,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: Radius.xs,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    ...Shadows.tier1,
  },
  categoryCardSelected: {
    backgroundColor: '#DCDDDD',
    borderColor: Colors.black,
  },
  catIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  catIconCircleSelected: {
    backgroundColor: Colors.black,
  },
  catTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  catLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  catTitle: {
    fontSize: 14,
    fontFamily: FontFamily.bold,
    color: Colors.black,
  },
  catBadge: {
    backgroundColor: '#E8E8E8',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.xs,
  },
  catBadgeText: {
    fontSize: 9,
    fontFamily: FontFamily.bold,
    color: Colors.black,
  },
  catRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  catRadioSelected: {
    backgroundColor: Colors.black,
  },
  catDesc: {
    fontSize: 11,
    fontFamily: FontFamily.regular,
    color: '#5D5F5F',
    marginTop: 2,
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
    marginBottom: Spacing.xs,
  },
  photoHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardHeaderTitle: {
    fontSize: 13,
    fontFamily: FontFamily.bold,
    color: Colors.black,
  },
  optionalText: {
    fontSize: 11,
    fontFamily: FontFamily.regular,
    color: '#6B7280',
  },
  photoRow: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 6,
  },
  takePhotoBtn: {
    flex: 1,
    height: 84,
    borderRadius: Radius.xs,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  takePhotoText: {
    fontSize: 11,
    fontFamily: FontFamily.bold,
    color: Colors.black,
  },
  photoThumbnailBox: {
    width: 84,
    height: 84,
    borderRadius: Radius.xs,
    overflow: 'hidden',
    position: 'relative',
  },
  thumbnailImg: {
    width: '100%',
    height: '100%',
  },
  doneCircle: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoHint: {
    fontSize: 11,
    fontFamily: FontFamily.regular,
    color: '#6B7280',
    marginTop: 2,
  },
  textareaWrapper: {
    position: 'relative',
    marginTop: 4,
  },
  textarea: {
    backgroundColor: '#F4F3F3',
    borderRadius: Radius.xs,
    padding: Spacing.sm,
    paddingRight: 44,
    fontSize: 12,
    fontFamily: FontFamily.regular,
    color: Colors.black,
    minHeight: 74,
    textAlignVertical: 'top',
  },
  micBtn: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hotlineBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#F4F3F3',
    padding: Spacing.md,
    borderRadius: Radius.xs,
  },
  supportCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#E2E2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hotlineTitle: {
    fontSize: 12,
    fontFamily: FontFamily.bold,
    color: Colors.black,
  },
  hotlineSub: {
    fontSize: 11,
    fontFamily: FontFamily.regular,
    color: '#5D5F5F',
    marginTop: 1,
  },
  callHotlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  hotlinePhone: {
    fontSize: 12,
    fontFamily: FontFamily.bold,
    color: Colors.black,
    textDecorationLine: 'underline',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    gap: 6,
    ...Shadows.tier3,
  },
  sendReportBtn: {
    height: 48,
    backgroundColor: Colors.black,
    borderRadius: Radius.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
  },
  sendReportBtnText: {
    fontSize: 14,
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
  callDirectBtn: {
    height: 40,
    backgroundColor: '#EEEEEE',
    borderRadius: Radius.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  callDirectBtnText: {
    fontSize: 12,
    fontFamily: FontFamily.bold,
    color: Colors.black,
  },
});
