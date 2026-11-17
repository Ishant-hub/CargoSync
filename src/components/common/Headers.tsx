import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, FontFamily, Spacing, TouchTargets, Shadows, Typography } from '../../theme/tokens';
import { useLanguage } from '../../context/LanguageContext';

// ─── STACK HEADER (mobile_stack shell — with back button) ─────────────────────

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  showBack?: boolean;
  rightElement?: React.ReactNode;
  showLanguageToggle?: boolean;
  style?: ViewStyle;
  dark?: boolean; // Uber-style black background
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  onBack,
  showBack = true,
  rightElement,
  showLanguageToggle = true,
  style,
  dark = false,
}) => {
  const insets = useSafeAreaInsets();
  const { language, toggleLanguage } = useLanguage();

  const bg = dark ? Colors.primaryBlack : Colors.white;
  const textColor = dark ? Colors.white : Colors.onSurface;
  const iconColor = dark ? Colors.white : Colors.onSurface;

  return (
    <View
      style={[
        styles.headerWrap,
        { paddingTop: insets.top + Spacing.sm, backgroundColor: bg },
        !dark && Shadows.tier1,
        style,
      ]}
    >
      <View style={styles.headerRow}>
        {/* Left — back button */}
        <View style={styles.headerSide}>
          {showBack && onBack && (
            <TouchableOpacity
              onPress={onBack}
              style={styles.iconBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel="Go back"
            >
              <MaterialIcons name="arrow-back" size={24} color={iconColor} />
            </TouchableOpacity>
          )}
        </View>

        {/* Centre — title */}
        {title && (
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={[styles.headerTitle, { color: textColor }]} numberOfLines={1}>
              {title}
            </Text>
            {subtitle ? (
              <Text style={{ fontSize: 11, fontFamily: FontFamily.regular, color: dark ? '#A0A0A0' : Colors.onSurfaceVariant }} numberOfLines={1}>
                {subtitle}
              </Text>
            ) : null}
          </View>
        )}

        {/* Right */}
        <View style={[styles.headerSide, styles.headerRight]}>
          {showLanguageToggle && (
            <TouchableOpacity
              onPress={toggleLanguage}
              style={[styles.langPill, dark && styles.langPillDark]}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel="Toggle language"
            >
              <Text style={[styles.langPillText, dark && { color: Colors.white }]}>
                {language === 'en' ? 'हिं' : 'EN'}
              </Text>
            </TouchableOpacity>
          )}
          {rightElement}
        </View>
      </View>
    </View>
  );
};

// ─── TAB BAR HEADER (mobile_tab shell — logo + notifications + avatar) ────────

interface TabHeaderProps {
  roleBadge?: string; // e.g. "Shipper" | "Driver" | "Fleet"
  onNotifications?: () => void;
  onProfile?: () => void;
  notificationCount?: number;
  dark?: boolean;
}

export const TabHeader: React.FC<TabHeaderProps> = ({
  roleBadge,
  onNotifications,
  onProfile,
  notificationCount = 0,
  dark = false,
}) => {
  const insets = useSafeAreaInsets();
  const { language, toggleLanguage } = useLanguage();

  const bg = dark ? Colors.primaryBlack : Colors.white;
  const textColor = dark ? Colors.white : Colors.onSurface;
  const iconColor = dark ? Colors.white : Colors.onSurface;

  return (
    <View
      style={[
        styles.tabHeaderWrap,
        { paddingTop: insets.top + Spacing.sm, backgroundColor: bg },
        !dark && Shadows.tier1,
      ]}
    >
      <View style={styles.headerRow}>
        {/* Logo + role badge */}
        <View style={styles.logoRow}>
          <Text style={[styles.logoText, { color: dark ? Colors.white : Colors.onSurface }]}>
            Cargo<Text style={{ color: Colors.primaryAmber }}>Sync</Text>
          </Text>
          {roleBadge && (
            <View style={[styles.roleBadge, dark && styles.roleBadgeDark]}>
              <Text style={[styles.roleBadgeText, dark && { color: Colors.white }]}>
                {roleBadge}
              </Text>
            </View>
          )}
        </View>

        {/* Right controls */}
        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={toggleLanguage}
            style={[styles.langPill, dark && styles.langPillDark]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={[styles.langPillText, dark && { color: Colors.white }]}>
              {language === 'en' ? 'हिं' : 'EN'}
            </Text>
          </TouchableOpacity>

          {onNotifications && (
            <TouchableOpacity
              onPress={onNotifications}
              style={styles.iconBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <MaterialIcons name="notifications-none" size={24} color={iconColor} />
              {notificationCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}

          {onProfile && (
            <TouchableOpacity
              onPress={onProfile}
              style={styles.avatarBtn}
              hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
            >
              <MaterialIcons name="account-circle" size={32} color={iconColor} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

// ─── SECTION HEADER ──────────────────────────────────────────────────────────

interface SectionHeaderProps {
  title: string;
  onViewAll?: () => void;
  viewAllLabel?: string;
  style?: ViewStyle;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  onViewAll,
  viewAllLabel = 'View All',
  style,
}) => {
  const { t } = useLanguage();
  return (
    <View style={[styles.sectionHeaderRow, style]}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {onViewAll && (
        <TouchableOpacity onPress={onViewAll} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.viewAllText}>{viewAllLabel || t.viewAll}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// ─── STYLES ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  headerWrap: {
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: Spacing.md,
  },
  tabHeaderWrap: {
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: Spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: TouchTargets.headerHeight - Spacing.md,
  },
  headerSide: {
    width: 80,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    justifyContent: 'flex-end',
  },
  headerTitle: {
    ...Typography.headlineSm,
    flex: 1,
    textAlign: 'center',
  },

  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  logoText: {
    fontFamily: FontFamily.bold,
    fontSize: 20,
    letterSpacing: -0.4,
  },
  roleBadge: {
    backgroundColor: Colors.surfaceContainerLow,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  roleBadgeDark: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: 'rgba(255,255,255,0.2)',
  },
  roleBadgeText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 11,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: Colors.muted,
  },

  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: Colors.error,
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  badgeText: {
    fontFamily: FontFamily.bold,
    fontSize: 9,
    color: Colors.white,
  },

  langPill: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  langPillDark: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderColor: 'rgba(255,255,255,0.2)',
  },
  langPillText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
    color: Colors.onSurface,
  },

  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: Colors.muted,
  },
  viewAllText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: Colors.primaryAmber,
  },
});

