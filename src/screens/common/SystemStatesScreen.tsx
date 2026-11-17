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
import { useNavigation } from '@react-navigation/native';
import { Colors, FontFamily, Spacing, Radius, Typography, Shadows } from '../../theme/tokens';
import { useLanguage } from '../../context/LanguageContext';

export const SystemStatesScreen: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const navigation = useNavigation<any>();

  const [activeState, setActiveState] = useState<'empty' | 'offline' | 'loading'>('empty');
  const [syncing, setSyncing] = useState(false);

  const handleForceResync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      Alert.alert('Re-synchronized', 'Telemetry link restored with North Spine corridor gateway.');
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Stitch Fixed Header */}
      <View style={styles.headerBar}>
        <View style={styles.headerLeft}>
          {navigation.canGoBack() && (
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <MaterialIcons name="arrow-back" size={22} color="#000000" />
            </TouchableOpacity>
          )}
          <Text style={styles.headerTitle}>System States</Text>
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

          <View style={styles.avatarCircleSmall}>
            <MaterialIcons name="person" size={18} color="#FFFFFF" />
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Interactive State Switcher Segmented Control */}
        <View style={styles.segmentedGroup}>
          <TouchableOpacity
            style={[styles.segmentBtn, activeState === 'empty' && styles.segmentBtnActive]}
            onPress={() => setActiveState('empty')}
            activeOpacity={0.8}
          >
            <Text style={[styles.segmentText, activeState === 'empty' && styles.segmentTextActive]}>
              No Shipments
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.segmentBtn, activeState === 'offline' && styles.segmentBtnActive]}
            onPress={() => setActiveState('offline')}
            activeOpacity={0.8}
          >
            <Text style={[styles.segmentText, activeState === 'offline' && styles.segmentTextActive]}>
              Offline / No Signal
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.segmentBtn, activeState === 'loading' && styles.segmentBtnActive]}
            onPress={() => setActiveState('loading')}
            activeOpacity={0.8}
          >
            <Text style={[styles.segmentText, activeState === 'loading' && styles.segmentTextActive]}>
              Finding Trucks
            </Text>
          </TouchableOpacity>
        </View>

        {/* Dynamic State Viewport */}
        {activeState === 'empty' && (
          <View style={styles.viewportCard}>
            <View style={styles.illustrationCircle}>
              <MaterialIcons name="inventory-2" size={44} color="#000000" />
              <View style={styles.zeroPill}>
                <Text style={styles.zeroPillText}>0</Text>
              </View>
            </View>

            <View style={styles.fleetIdleBadge}>
              <Text style={styles.fleetIdleBadgeText}>FLEET IDLE</Text>
            </View>

            <Text style={styles.viewportTitle}>No active shipments found</Text>
            <Text style={styles.viewportSub}>
              You have no active trips right now. Create a shipment or find an available truck.
            </Text>

            <View style={styles.viewportBtnCol}>
              <TouchableOpacity
                style={styles.btnPrimary}
                onPress={() => navigation.navigate('CreateShipment')}
                activeOpacity={0.85}
              >
                <MaterialIcons name="add" size={18} color="#FFFFFF" />
                <Text style={styles.btnPrimaryText}>Create Shipment</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnSecondary}
                onPress={() => navigation.navigate('FindTrucks')}
                activeOpacity={0.85}
              >
                <MaterialIcons name="local-shipping" size={18} color="#000000" />
                <Text style={styles.btnSecondaryText}>Find Trucks</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {activeState === 'offline' && (
          <View style={styles.viewportCard}>
            <View style={[styles.illustrationCircle, { backgroundColor: '#FFDAD6' }]}>
              <MaterialIcons name="signal-cellular-off" size={44} color="#BA1A1A" />
              <View style={styles.pingDot} />
            </View>

            <View style={[styles.fleetIdleBadge, { backgroundColor: '#FFDAD6' }]}>
              <Text style={[styles.fleetIdleBadgeText, { color: '#BA1A1A' }]}>
                TELEMETRY INTERRUPTED
              </Text>
            </View>

            <Text style={styles.viewportTitle}>Highway Connection Lost</Text>
            <Text style={styles.viewportSub}>
              Device is operating in offline mode. Telematics and trip logs are being cached locally and will auto-sync upon link restoration.
            </Text>

            <TouchableOpacity
              style={styles.btnPrimary}
              onPress={handleForceResync}
              activeOpacity={0.85}
            >
              <MaterialIcons
                name="sync"
                size={18}
                color="#FFFFFF"
                style={syncing ? { transform: [{ rotate: '45deg' }] } : undefined}
              />
              <Text style={styles.btnPrimaryText}>
                {syncing ? 'Connecting...' : 'Force Re-sync'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {activeState === 'loading' && (
          <View style={styles.viewportCard}>
            <View style={styles.illustrationCircle}>
              <MaterialIcons name="sync" size={44} color="#000000" />
            </View>

            <View style={styles.fleetIdleBadge}>
              <Text style={styles.fleetIdleBadgeText}>CONSOLIDATION ENGINE</Text>
            </View>

            <Text style={styles.viewportTitle}>Finding Matching Fleets</Text>
            <Text style={styles.viewportSub}>
              Optimizing deadhead miles across regional hubs. Real-time rates updating...
            </Text>

            <View style={styles.progressSection}>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: '70%' }]} />
              </View>
              <View style={styles.progressLabels}>
                <Text style={styles.progressLabelLeft}>Scanning NH-44</Text>
                <Text style={styles.progressLabelRight}>70%</Text>
              </View>
            </View>
          </View>
        )}

        {/* Operational Previews Section */}
        <View style={styles.previewHeader}>
          <Text style={styles.previewTitle}>SYSTEM STATUS</Text>
          <Text style={styles.previewSub}>Live Updates</Text>
        </View>

        {/* Connection Lost Banner Preview Card */}
        <View style={styles.darkBannerCard}>
          <View style={styles.darkBannerLeft}>
            <View style={styles.darkWarningCircle}>
              <MaterialIcons name="warning" size={18} color="#000000" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.darkBannerTitleRow}>
                <Text style={styles.darkBannerTitle}>Connection Lost</Text>
                <Text style={styles.darkBannerTag}>Local Cache</Text>
              </View>
              <Text style={styles.darkBannerSub}>
                No network connection. Your changes are saved and will sync when you're back online.
              </Text>
              <View style={{ alignItems: 'flex-end', marginTop: 8 }}>
                <TouchableOpacity
                  style={styles.darkRetryBtn}
                  onPress={handleForceResync}
                >
                  <MaterialIcons name="refresh" size={15} color="#000000" />
                  <Text style={styles.darkRetryBtnText}>Try Again</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Loading / Calculating State Preview Card */}
        <View style={styles.scanCard}>
          <View style={styles.scanTopRow}>
            <View style={styles.flexRowCenter}>
              <View style={styles.scanHubCircle}>
                <MaterialIcons name="hub" size={16} color="#000000" />
              </View>
              <Text style={styles.scanTitle}>Load Matching</Text>
            </View>
            <View style={styles.activeScanBadge}>
              <Text style={styles.activeScanBadgeText}>Active Scan</Text>
            </View>
          </View>

          <Text style={styles.scanHeading}>Finding the Best Load Matches...</Text>
          <Text style={styles.scanSub}>Scanning 28 trucks along NH-44 & NH-48 corridors</Text>

          <View style={styles.progressSection}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: '70%' }]} />
            </View>
            <View style={styles.progressLabels}>
              <View style={styles.flexRowCenter}>
                <View style={styles.pulseDotSmall} />
                <Text style={styles.progressLabelLeft}>Comparing truck prices</Text>
              </View>
              <Text style={styles.progressLabelRight}>70%</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SystemStatesScreen;

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
  avatarCircleSmall: {
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
    gap: 14,
  },
  segmentedGroup: {
    flexDirection: 'row',
    backgroundColor: '#EEEEEE',
    borderRadius: Radius.full,
    padding: 3,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentBtnActive: {
    backgroundColor: '#000000',
  },
  segmentText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 11,
    color: '#5D5F5F',
  },
  segmentTextActive: {
    color: '#FFFFFF',
  },
  viewportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    ...Shadows.sm,
  },
  illustrationCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F4F3F3',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 12,
  },
  zeroPill: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  zeroPillText: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: '#FFFFFF',
  },
  pingDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#BA1A1A',
  },
  fleetIdleBadge: {
    backgroundColor: '#EEEEEE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    marginBottom: 8,
  },
  fleetIdleBadgeText: {
    fontFamily: FontFamily.bold,
    fontSize: 9,
    color: '#4C4546',
    letterSpacing: 0.6,
  },
  viewportTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 18,
    color: '#000000',
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 6,
  },
  viewportSub: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: '#5D5F5F',
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 280,
    marginBottom: 16,
  },
  viewportBtnCol: {
    width: '100%',
    gap: 8,
  },
  btnPrimary: {
    width: '100%',
    height: 46,
    backgroundColor: '#000000',
    borderRadius: Radius.xs, // 4px exact Stitch requirement
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    ...Shadows.sm,
  },
  btnPrimaryText: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: '#FFFFFF',
  },
  btnSecondary: {
    width: '100%',
    height: 46,
    backgroundColor: '#EEEEEE',
    borderRadius: Radius.xs, // 4px exact Stitch requirement
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  btnSecondaryText: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: '#000000',
  },
  progressSection: {
    width: '100%',
    gap: 6,
    marginTop: 4,
  },
  progressTrack: {
    width: '100%',
    height: 8,
    backgroundColor: '#EEEEEE',
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#000000',
    borderRadius: Radius.full,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabelLeft: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#5D5F5F',
  },
  progressLabelRight: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: '#000000',
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingTop: 4,
  },
  previewTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: '#7E7576',
    letterSpacing: 0.8,
  },
  previewSub: {
    fontFamily: FontFamily.regular,
    fontSize: 10,
    color: '#7E7576',
  },
  darkBannerCard: {
    backgroundColor: '#2F3131',
    borderRadius: Radius.md,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  darkBannerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  darkWarningCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E2E2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  darkBannerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  darkBannerTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: '#F1F1F1',
  },
  darkBannerTag: {
    fontFamily: FontFamily.regular,
    fontSize: 10,
    color: '#E8E8E8',
  },
  darkBannerSub: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#E8E8E8',
    marginTop: 4,
    lineHeight: 16,
  },
  darkRetryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    height: 32,
    borderRadius: Radius.xs, // 4px exact Stitch requirement
  },
  darkRetryBtnText: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: '#000000',
  },
  scanCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    gap: 8,
    ...Shadows.sm,
  },
  scanTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scanHubCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
    color: '#000000',
  },
  activeScanBadge: {
    backgroundColor: '#EEEEEE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  activeScanBadgeText: {
    fontFamily: FontFamily.regular,
    fontSize: 10,
    color: '#5D5F5F',
  },
  scanHeading: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: '#000000',
  },
  scanSub: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#5D5F5F',
  },
  pulseDotSmall: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#000000',
  },
  flexRowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});

