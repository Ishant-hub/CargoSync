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
import { TabHeader } from '../../components/common/Headers';

interface JobCardData {
  id: string;
  corridor: string;
  tag: string;
  tagType: 'guaranteed' | 'combined' | 'return';
  payout: number;
  ratePerKm: number;
  origin: string;
  originMeta: string;
  destination: string;
  destMeta: string;
  distanceKm: number;
  weightTonnes: number;
  commodity: string;
}

const JOBS_DATA: JobCardData[] = [
  {
    id: 'CS-7720',
    corridor: 'NH-48 Corridor',
    tag: 'Guaranteed Payout',
    tagType: 'guaranteed',
    payout: 18500,
    ratePerKm: 71.1,
    origin: 'Delhi (Okhla Phase III)',
    originMeta: 'Pickup Today, 2:00 PM • Yard Gate 4',
    destination: 'Jaipur (Sitapura Ind. Area)',
    destMeta: 'Est. Delivery Today, 8:30 PM',
    distanceKm: 260,
    weightTonnes: 3.2,
    commodity: 'Auto Parts',
  },
  {
    id: 'CS-6540',
    corridor: 'NH-44 Express',
    tag: 'Combine Load Available (+₹4,500)',
    tagType: 'combined',
    payout: 21200,
    ratePerKm: 73.1,
    origin: 'Gurgaon (Manesar Hub)',
    originMeta: 'Pickup Tomorrow, 08:00 AM • Bay 12',
    destination: 'Chandigarh (Industrial Area 1)',
    destMeta: 'Est. Delivery Tomorrow, 03:30 PM',
    distanceKm: 290,
    weightTonnes: 4.0,
    commodity: 'Industrial Goods',
  },
  {
    id: 'CS-8812',
    corridor: 'NH-44 Northbound',
    tag: 'Return Load Ready',
    tagType: 'return',
    payout: 14000,
    ratePerKm: 77.7,
    origin: 'Panipat (Textile Market Gate 2)',
    originMeta: 'Pickup Today, 6:00 PM • Ready to Load',
    destination: 'Ludhiana (Transport Nagar)',
    destMeta: 'Est. Delivery Tonight, 11:30 PM',
    distanceKm: 180,
    weightTonnes: 2.8,
    commodity: 'Textiles',
  },
];

export default function DriverHomeScreen() {
  const navigation = useNavigation<any>();

  const [activeFilter, setActiveFilter] = useState<'all' | 'high-payout' | 'combined' | 'quick'>('all');
  const [acceptedJobId, setAcceptedJobId] = useState<string | null>(null);

  const handleQuickAccept = (job: JobCardData) => {
    setAcceptedJobId(job.id);
    setTimeout(() => {
      Alert.alert(
        'Load Accepted ✓',
        `Assigned to #${job.id} (${job.origin} → ${job.destination}). Proceed to pickup gate.`,
        [
          {
            text: 'View Job Details',
            onPress: () => navigation.navigate('JobDetailsAccept', { jobId: job.id }),
          },
        ]
      );
    }, 400);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TabHeader
        roleBadge="Driver Pilot"
        notificationCount={3}
        onNotifications={() => navigation.navigate('Notifications')}
        onProfile={() => navigation.navigate('DriverProfile')}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Active Corridors Status Banner */}
        <View style={styles.corridorBanner}>
          <View style={styles.bannerLeft}>
            <View style={styles.radarCircle}>
              <MaterialIcons name="radar" size={22} color="#85FAA9" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.activeCorridorRow}>
                <Text style={styles.bannerEyebrow}>ACTIVE CORRIDORS</Text>
                <View style={styles.radarDot} />
              </View>
              <Text style={styles.bannerTitle}>34 Available Jobs</Text>
              <Text style={styles.bannerSub}>Direct freight on NH-48 & NH-44</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.tuneBtn}
            onPress={() => Alert.alert('Filters', 'Corridor filter settings')}
          >
            <MaterialIcons name="tune" size={18} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* Filter Scroller */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterPillsRow}
        >
          <TouchableOpacity
            style={[styles.filterPill, activeFilter === 'all' && styles.filterPillActive]}
            onPress={() => setActiveFilter('all')}
          >
            <Text style={[styles.filterPillText, activeFilter === 'all' && styles.filterPillTextActive]}>
              All Jobs
            </Text>
            <View style={styles.filterCountBadge}>
              <Text style={styles.filterCountText}>34</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterPill, activeFilter === 'high-payout' && styles.filterPillActive]}
            onPress={() => setActiveFilter('high-payout')}
          >
            <MaterialIcons
              name="trending-up"
              size={15}
              color={activeFilter === 'high-payout' ? Colors.white : Colors.textDark}
            />
            <Text style={[styles.filterPillText, activeFilter === 'high-payout' && styles.filterPillTextActive]}>
              High Payout
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterPill, activeFilter === 'combined' && styles.filterPillActive]}
            onPress={() => setActiveFilter('combined')}
          >
            <MaterialIcons
              name="call-split"
              size={15}
              color={activeFilter === 'combined' ? Colors.white : Colors.textDark}
            />
            <Text style={[styles.filterPillText, activeFilter === 'combined' && styles.filterPillTextActive]}>
              Combined Load
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterPill, activeFilter === 'quick' && styles.filterPillActive]}
            onPress={() => setActiveFilter('quick')}
          >
            <MaterialIcons
              name="bolt"
              size={15}
              color={activeFilter === 'quick' ? Colors.white : Colors.textDark}
            />
            <Text style={[styles.filterPillText, activeFilter === 'quick' && styles.filterPillTextActive]}>
              Quick Turnaround
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Job Cards Stream */}
        <View style={styles.cardsContainer}>
          {JOBS_DATA.map((job) => {
            const isAccepted = acceptedJobId === job.id;

            return (
              <View key={job.id} style={styles.jobCard}>
                {/* Header: ID, Badges, Price */}
                <View style={styles.jobCardHeader}>
                  <View>
                    <View style={styles.jobIdRow}>
                      <Text style={styles.jobIdText}>JOB #{job.id}</Text>
                      <View style={styles.sepDot} />
                      <Text style={styles.corridorText}>{job.corridor}</Text>
                    </View>
                    <View style={styles.tagRow}>
                      <View
                        style={[
                          styles.tagPill,
                          job.tagType === 'guaranteed'
                            ? styles.tagGuaranteed
                            : job.tagType === 'combined'
                            ? styles.tagCombined
                            : styles.tagReturn,
                        ]}
                      >
                        <MaterialIcons
                          name={
                            job.tagType === 'guaranteed'
                              ? 'verified'
                              : job.tagType === 'combined'
                              ? 'layers'
                              : 'sync-alt'
                          }
                          size={13}
                          color={
                            job.tagType === 'guaranteed'
                              ? '#85FAA9'
                              : job.tagType === 'combined'
                              ? '#5F6161'
                              : Colors.textDark
                          }
                        />
                        <Text
                          style={[
                            styles.tagText,
                            job.tagType === 'guaranteed'
                              ? styles.tagTextGuaranteed
                              : job.tagType === 'combined'
                              ? styles.tagTextCombined
                              : styles.tagTextReturn,
                          ]}
                        >
                          {job.tag}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.jobPrice}>₹{job.payout.toLocaleString()}</Text>
                    <Text style={styles.rateText}>₹{job.ratePerKm} / km net</Text>
                  </View>
                </View>

                {/* Route Diagram & Stations */}
                <View style={styles.routeBox}>
                  <View style={styles.routeTrack}>
                    <View style={styles.originCircle}>
                      <View style={styles.originInner} />
                    </View>
                    <View style={styles.routeTrackLine} />
                    <View style={styles.destSquare} />
                  </View>

                  <View style={styles.routeInfoCol}>
                    <View style={styles.stopBlock}>
                      <Text style={styles.stopCity}>{job.origin}</Text>
                      <Text style={styles.stopMeta}>{job.originMeta}</Text>
                    </View>
                    <View style={[styles.stopBlock, { marginTop: 10 }]}>
                      <Text style={styles.stopCity}>{job.destination}</Text>
                      <Text style={styles.stopMeta}>{job.destMeta}</Text>
                    </View>
                  </View>
                </View>

                {/* Cargo Metrics Chips */}
                <View style={styles.metricsGrid}>
                  <View style={styles.metricChip}>
                    <Text style={styles.metricChipLabel}>DISTANCE</Text>
                    <Text style={styles.metricChipVal}>{job.distanceKm} km</Text>
                  </View>
                  <View style={styles.metricChip}>
                    <Text style={styles.metricChipLabel}>WEIGHT</Text>
                    <Text style={styles.metricChipVal}>{job.weightTonnes} T</Text>
                  </View>
                  <View style={styles.metricChip}>
                    <Text style={styles.metricChipLabel}>COMMODITY</Text>
                    <Text style={styles.metricChipVal} numberOfLines={1}>{job.commodity}</Text>
                  </View>
                </View>

                {/* Card Action Footer */}
                <View style={styles.cardActionsRow}>
                  <TouchableOpacity
                    style={[styles.quickAcceptBtn, isAccepted && styles.quickAcceptBtnActive]}
                    onPress={() => handleQuickAccept(job)}
                    activeOpacity={0.85}
                  >
                    <MaterialIcons
                      name={isAccepted ? 'check-circle' : 'bolt'}
                      size={17}
                      color={isAccepted ? '#85FAA9' : Colors.white}
                    />
                    <Text style={styles.quickAcceptBtnText}>
                      {isAccepted ? 'Load Accepted' : 'Quick Accept'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.detailsBtn}
                    onPress={() => navigation.navigate('JobDetailsAccept', { jobId: job.id })}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.detailsBtnText}>View Details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        {/* Find More Jobs Button */}
        <View style={styles.findMoreBox}>
          <TouchableOpacity
            style={styles.findMoreBtn}
            onPress={() => Alert.alert('Corridor Radar', 'Searching additional consignments within 50 km...')}
          >
            <MaterialIcons name="cached" size={17} color="#5D5F5F" />
            <Text style={styles.findMoreText}>Find More Jobs on Route</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  scrollContent: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.xxl + 40,
    gap: 12,
  },
  corridorBanner: {
    backgroundColor: Colors.black,
    borderRadius: Radius.xs,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Shadows.tier2,
  },
  bannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  radarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeCorridorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bannerEyebrow: {
    fontSize: 9,
    fontFamily: FontFamily.mono,
    color: '#D1D5DB',
    letterSpacing: 0.5,
  },
  radarDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#85FAA9',
  },
  bannerTitle: {
    fontSize: 16,
    fontFamily: FontFamily.bold,
    color: Colors.white,
    marginTop: 1,
  },
  bannerSub: {
    fontSize: 11,
    fontFamily: FontFamily.regular,
    color: '#9CA3AF',
    marginTop: 1,
  },
  tuneBtn: {
    width: 34,
    height: 34,
    borderRadius: Radius.xs,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterPillsRow: {
    gap: 8,
    paddingVertical: 2,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EEEEEE',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.xs,
  },
  filterPillActive: {
    backgroundColor: Colors.black,
  },
  filterPillText: {
    fontSize: 12,
    fontFamily: FontFamily.medium,
    color: Colors.textDark,
  },
  filterPillTextActive: {
    color: Colors.white,
    fontFamily: FontFamily.bold,
  },
  filterCountBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: Radius.xs,
  },
  filterCountText: {
    fontSize: 10,
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },
  cardsContainer: {
    gap: 12,
  },
  jobCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xs,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    ...Shadows.tier1,
  },
  jobCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  jobIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  jobIdText: {
    fontSize: 11,
    fontFamily: FontFamily.bold,
    color: '#5D5F5F',
    letterSpacing: 0.5,
  },
  sepDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#DCDDDD',
  },
  corridorText: {
    fontSize: 11,
    fontFamily: FontFamily.regular,
    color: '#5D5F5F',
  },
  tagRow: {
    marginTop: 4,
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.xs,
    alignSelf: 'flex-start',
  },
  tagGuaranteed: {
    backgroundColor: '#00210D',
  },
  tagCombined: {
    backgroundColor: '#DCDDDD',
  },
  tagReturn: {
    backgroundColor: '#EEEEEE',
  },
  tagText: {
    fontSize: 10,
    fontFamily: FontFamily.bold,
  },
  tagTextGuaranteed: {
    color: '#85FAA9',
  },
  tagTextCombined: {
    color: '#5F6161',
  },
  tagTextReturn: {
    color: Colors.black,
  },
  jobPrice: {
    fontSize: 18,
    fontFamily: FontFamily.bold,
    color: Colors.black,
  },
  rateText: {
    fontSize: 11,
    fontFamily: FontFamily.regular,
    color: '#5D5F5F',
    marginTop: 1,
  },
  routeBox: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: Spacing.sm,
  },
  routeTrack: {
    alignItems: 'center',
    paddingVertical: 2,
    width: 14,
  },
  originCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  originInner: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.white,
  },
  routeTrackLine: {
    width: 2,
    height: 28,
    backgroundColor: '#E2E2E2',
    marginVertical: 2,
  },
  destSquare: {
    width: 10,
    height: 10,
    backgroundColor: Colors.black,
  },
  routeInfoCol: {
    flex: 1,
  },
  stopBlock: {},
  stopCity: {
    fontSize: 13,
    fontFamily: FontFamily.bold,
    color: Colors.black,
  },
  stopMeta: {
    fontSize: 11,
    fontFamily: FontFamily.regular,
    color: '#5D5F5F',
    marginTop: 1,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 6,
    marginVertical: Spacing.xs,
  },
  metricChip: {
    flex: 1,
    backgroundColor: '#F4F3F3',
    padding: 6,
    borderRadius: Radius.xs,
    alignItems: 'center',
  },
  metricChipLabel: {
    fontSize: 8,
    fontFamily: FontFamily.mono,
    color: '#5D5F5F',
  },
  metricChipVal: {
    fontSize: 12,
    fontFamily: FontFamily.bold,
    color: Colors.black,
    marginTop: 2,
  },
  cardActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: Spacing.xs,
  },
  quickAcceptBtn: {
    flex: 1,
    height: 42,
    backgroundColor: Colors.black,
    borderRadius: Radius.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  quickAcceptBtnActive: {
    backgroundColor: '#00210D',
  },
  quickAcceptBtnText: {
    fontSize: 13,
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },
  detailsBtn: {
    height: 42,
    paddingHorizontal: 16,
    backgroundColor: '#EEEEEE',
    borderRadius: Radius.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsBtnText: {
    fontSize: 13,
    fontFamily: FontFamily.semiBold,
    color: Colors.black,
  },
  findMoreBox: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  findMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E8E8E8',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Radius.xs,
  },
  findMoreText: {
    fontSize: 12,
    fontFamily: FontFamily.bold,
    color: Colors.black,
  },
});
