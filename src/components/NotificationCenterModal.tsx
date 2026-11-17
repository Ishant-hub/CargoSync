import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'alert' | 'consolidation' | 'success' | 'info';
  read: boolean;
}

interface NotificationCenterModalProps {
  visible: boolean;
  onClose: () => void;
  onNavigateToItem?: (item: NotificationItem) => void;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Disruption Detected on NH-48',
    message: 'Bridge maintenance causing 45m delay near Surat. AI re-routing recommended.',
    timestamp: '10 mins ago',
    type: 'alert',
    read: false,
  },
  {
    id: 'notif-2',
    title: 'Consolidation Match Found!',
    message: 'Matched 320kg Pune parcel with Truck TRK-002. ₹3,400 cost savings unlocked.',
    timestamp: '25 mins ago',
    type: 'consolidation',
    read: false,
  },
  {
    id: 'notif-3',
    title: 'Cargo Delivered Successfully',
    message: 'Shipment SHP-1002 marked as delivered at Delhi Hub with digital POD.',
    timestamp: '1 hour ago',
    type: 'success',
    read: true,
  },
  {
    id: 'notif-4',
    title: 'Fleet Capacity Alert',
    message: 'Western Corridor average truck utilization reached 88.4%.',
    timestamp: '3 hours ago',
    type: 'info',
    read: true,
  },
];

export default function NotificationCenterModal({
  visible,
  onClose,
  onNavigateToItem,
}: NotificationCenterModalProps) {
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markSingleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'alert':
        return { name: 'warning-outline' as const, color: theme.colors.warning };
      case 'consolidation':
        return { name: 'git-merge-outline' as const, color: theme.colors.primary };
      case 'success':
        return { name: 'checkmark-circle-outline' as const, color: theme.colors.success };
      default:
        return { name: 'information-circle-outline' as const, color: theme.colors.textSecondary };
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContent,
            {
              backgroundColor: theme.colors.cardBackground,
              borderColor: theme.colors.border,
            },
          ]}
        >
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.titleRow}>
              <View style={[styles.iconWrap, { backgroundColor: theme.colors.primary + '15' }]}>
                <Ionicons name="notifications" size={20} color={theme.colors.primary} />
              </View>
              <View>
                <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Notifications</Text>
                <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                  {unreadCount > 0 ? `${unreadCount} unread alerts` : 'All caught up!'}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeBtn, { backgroundColor: theme.colors.background }]}
            >
              <Ionicons name="close" size={20} color={theme.colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Action Bar */}
          <View style={styles.actionBar}>
            <View style={styles.filterRow}>
              <TouchableOpacity
                onPress={() => setFilter('all')}
                style={[
                  styles.filterBtn,
                  filter === 'all' && { backgroundColor: theme.colors.primary },
                  filter !== 'all' && { backgroundColor: theme.colors.background },
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    { color: filter === 'all' ? '#FFF' : theme.colors.textSecondary },
                  ]}
                >
                  All ({notifications.length})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setFilter('unread')}
                style={[
                  styles.filterBtn,
                  filter === 'unread' && { backgroundColor: theme.colors.primary },
                  filter !== 'unread' && { backgroundColor: theme.colors.background },
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    { color: filter === 'unread' ? '#FFF' : theme.colors.textSecondary },
                  ]}
                >
                  Unread ({unreadCount})
                </Text>
              </TouchableOpacity>
            </View>

            {unreadCount > 0 && (
              <TouchableOpacity onPress={markAllRead}>
                <Text style={[styles.markReadText, { color: theme.colors.primary }]}>
                  Mark all read
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Notifications List */}
          <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
            {filtered.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons
                  name="checkmark-done-circle-outline"
                  size={48}
                  color={theme.colors.success}
                />
                <Text style={[styles.emptyTitle, { color: theme.colors.textPrimary }]}>
                  No notifications to show
                </Text>
                <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
                  You're fully up to date with route updates and disruptions.
                </Text>
              </View>
            ) : (
              filtered.map((item) => {
                const icon = getIcon(item.type);
                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => {
                      markSingleRead(item.id);
                      if (onNavigateToItem) onNavigateToItem(item);
                    }}
                    style={[
                      styles.card,
                      {
                        backgroundColor: item.read
                          ? theme.colors.background
                          : theme.colors.primary + '08',
                        borderColor: item.read ? theme.colors.border : theme.colors.primary + '30',
                      },
                    ]}
                  >
                    <View style={[styles.typeIcon, { backgroundColor: icon.color + '18' }]}>
                      <Ionicons name={icon.name} size={18} color={icon.color} />
                    </View>
                    <View style={styles.cardContent}>
                      <View style={styles.cardHeader}>
                        <Text
                          style={[
                            styles.cardTitle,
                            { color: theme.colors.textPrimary, fontWeight: item.read ? '600' : '700' },
                          ]}
                        >
                          {item.title}
                        </Text>
                        {!item.read && (
                          <View
                            style={[
                              styles.unreadDot,
                              { backgroundColor: theme.colors.primary },
                            ]}
                          />
                        )}
                      </View>
                      <Text style={[styles.cardMessage, { color: theme.colors.textSecondary }]}>
                        {item.message}
                      </Text>
                      <Text style={[styles.cardTime, { color: theme.colors.textTertiary || theme.colors.textSecondary }]}>
                        {item.timestamp}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
    ...(Platform.OS === 'web' ? { alignItems: 'center', justifyContent: 'center' } : {}),
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    width: '100%',
    paddingBottom: 24,
    ...(Platform.OS === 'web'
      ? { maxWidth: 540, borderRadius: 24, borderWidth: 1, maxHeight: 600 }
      : {}),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
  },
  markReadText: {
    fontSize: 12,
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: 20,
  },
  listContent: {
    gap: 10,
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  typeIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 14,
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 6,
  },
  cardMessage: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
  cardTime: {
    fontSize: 11,
    marginTop: 6,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
