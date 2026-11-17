/**
 * CargoSync — Map library entry point (native).
 *
 * On iOS/Android Metro resolves this file and re-exports react-native-maps.
 * On web Metro resolves index.web.tsx instead, because react-native-maps
 * relies on native codegen and has no web implementation.
 *
 * NOTE: This file must stay .tsx (not .ts) — Metro tries platform variants
 * per extension (web.ts → ts → web.tsx → tsx), so a generic index.ts would
 * shadow index.web.tsx on the web platform.
 */
export { default, Marker, Polyline, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
