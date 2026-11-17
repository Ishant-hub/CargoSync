/**
 * CargoSync Design Tokens
 * Source of truth: Google Stitch "CargoSync Mobile App Redesign"
 * Do NOT modify without updating the corresponding Stitch design system.
 */

// ─── COLOUR PALETTE ───────────────────────────────────────────────────────────

export const Colors = {
  // Brand
  primaryAmber: '#F0820D',          // CTA, active states, focus rings
  primaryContainer: '#F0820D',      // primary-container token
  primaryDark: '#924c00',           // official primary token (Stitch)
  primaryBlack: '#000000',          // Uber-style dark variant (high-contrast screens)
  secondaryNavy: '#172033',         // fleet navy, typography
  accentOrange: '#FF6B00',          // accent alt

  // Surface & Background
  background: '#F8F9FB',            // default app background
  surface: '#FFFFFF',               // cards, elevated modules
  surfaceContainerLowest: '#FFFFFF',
  surfaceContainerLow: '#F2F4F6',
  surfaceContainer: '#EDEEF0',
  surfaceContainerHigh: '#E7E8EA',
  surfaceContainerHighest: '#E1E2E4',

  // Typography
  onSurface: '#191C1E',             // primary text
  onSurfaceVariant: '#545454',      // secondary text / metadata
  muted: '#667085',                 // tertiary / helper text
  placeholder: '#9CA3AF',           // input placeholders
  disabled: '#D1D5DB',

  // Border & Outline
  border: '#E5E7EB',                // 1px separator
  outline: '#897363',               // Stitch outline token
  outlineVariant: '#DDC1AF',        // Stitch outline-variant token
  focusRing: '#F0820D',             // focused input ring

  // Status — Success
  success: '#10B981',
  successBg: '#ECFDF5',
  successText: '#065F46',

  // Status — Warning
  warning: '#F59E0B',
  warningBg: '#FFFBEB',
  warningText: '#92400E',

  // Status — Error
  error: '#EF4444',
  errorBg: '#FEF2F2',
  errorText: '#991B1B',

  // Status — Info
  info: '#3B82F6',
  infoBg: '#EFF6FF',
  infoText: '#1E40AF',

  // Neutrals
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',

  // Transparent & Overlay
  transparent: 'transparent',
  overlay: 'rgba(0,0,0,0.5)',
  overlayLight: 'rgba(0,0,0,0.3)',
  shimmer: 'rgba(255,255,255,0.6)',

  // Compatibility aliases for legacy prototype views during rebuild transition
  textDark: '#1A1C1C',
  borderDark: '#2C2D2E',
  badgeSuccessText: '#065F46',
  primary: '#F0820D',
  primaryLight: '#FFF7ED',
  accent: '#F0820D',
  accentLight: '#FFF7ED',
  accentSurface: '#FFF7ED',
  textPrimary: '#191C1E',
  textSecondary: '#545454',
  textTertiary: '#667085',
  textMuted: '#9CA3AF',
  cardBackground: '#FFFFFF',
  cardBorder: '#E5E7EB',
  borderLight: '#F3F4F6',
  surfacePressed: '#F2F4F6',
  surfaceSelected: '#FFF7ED',
  errorLight: '#FEF2F2',
  successLight: '#ECFDF5',
  warningLight: '#FFFBEB',
  infoLight: '#EFF6FF',
  divider: '#E5E7EB',
  inputBorder: '#E5E7EB',
  inputBorderFocused: '#F0820D',
} as const;

export type ColorKey = keyof typeof Colors;

// ─── TYPOGRAPHY ───────────────────────────────────────────────────────────────

export const FontFamily = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extraBold: 'Inter_800ExtraBold',
  mono: 'Courier',
} as const;

/** All 11 type styles extracted from Stitch HTML */
export const Typography = {
  displayLg: {
    fontFamily: FontFamily.bold,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.64,  // −0.02em × 32
  },
  headlineLg: {
    fontFamily: FontFamily.bold,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.36,  // −0.015em × 24
  },
  headlineMd: {
    fontFamily: FontFamily.semiBold,
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: -0.2,   // −0.01em × 20
  },
  headlineSm: {
    fontFamily: FontFamily.semiBold,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: -0.09,  // −0.005em × 18
  },
  bodyLg: {
    fontFamily: FontFamily.regular,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
  },
  bodyMd: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
  },
  bodySm: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.065,  // +0.005em × 13
  },
  tabularLg: {
    fontFamily: FontFamily.bold,
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: 0,
    fontVariant: ['tabular-nums'] as const,
  },
  tabularMd: {
    fontFamily: FontFamily.semiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 0,
    fontVariant: ['tabular-nums'] as const,
  },
  labelMd: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.13,   // +0.01em × 13
  },
  labelSm: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.44,   // +0.04em × 11
    textTransform: 'uppercase' as const,
  },
  body: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
  },
} as const;

export type TypographyKey = keyof typeof Typography;

// ─── SPACING ──────────────────────────────────────────────────────────────────

/** 4px base module */
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  margin: 16,
  base: 16,
  gutterMobile: 12,
  gutterLg: 16,
  screenPadding: 16,
  sectionGap: 24,
} as const;

// ─── BORDER RADIUS ────────────────────────────────────────────────────────────

export const Radius = {
  xs: 4,    // inputs, badges
  sm: 8,    // cards
  md: 12,   // modals top corners, sheet corners
  lg: 16,   // large cards
  xl: 20,
  full: 9999, // pills, circular buttons
} as const;

// ─── SHADOWS ──────────────────────────────────────────────────────────────────

export const Shadows = {
  tier1: {
    shadowColor: '#172033',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tier2: {
    shadowColor: '#172033',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  tier3: {
    shadowColor: '#172033',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 8,
  },
  // Legacy aliases
  sm: {
    shadowColor: '#172033',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#172033',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: '#172033',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

// ─── TOUCH TARGETS ────────────────────────────────────────────────────────────

export const TouchTargets = {
  buttonHeight: 48,
  minTouchable: 44,
  tabBarHeight: 56,
  headerHeight: 56,
} as const;

// ─── ANIMATION ────────────────────────────────────────────────────────────────

export const Animation = {
  fast: 150,
  normal: 250,
  slow: 400,
  spring: { damping: 15, stiffness: 200 },
} as const;

// ─── ICON SIZES ───────────────────────────────────────────────────────────────

export const IconSize = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// ─── CONSOLIDATED THEME ───────────────────────────────────────────────────────

export const Theme = {
  colors: Colors,
  typography: {
    ...Typography,
    size: {
      xs: 11,
      sm: 13,
      md: 14,
      lg: 16,
      xl: 18,
      xxl: 24,
      display: 32,
    },
    weight: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  fontFamily: FontFamily,
  spacing: Spacing,
  radius: Radius,
  radii: Radius,
  shadows: Shadows,
  touchTargets: TouchTargets,
  animation: Animation,
  iconSize: IconSize,
} as const;

export type Theme = typeof Theme;

