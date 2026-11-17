/**
 * CargoSync — Map library entry point (web fallback).
 *
 * react-native-maps requires native codegen and crashes on react-native-web,
 * so Metro resolves this file for the web platform. It implements the small
 * slice of the MapView / Marker / Polyline / Callout API that CargoSync uses:
 *
 *   - region projection (equirectangular, region bounds mapped to the canvas)
 *   - marker placement with press handling + callout bubbles
 *   - route polylines with rounded casing
 *   - animated region changes via ref.animateToRegion(region, duration)
 *   - drag-to-pan on the empty map surface
 */

import React, {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StyleProp,
  ViewStyle,
  LayoutChangeEvent,
  GestureResponderEvent,
} from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

export const PROVIDER_GOOGLE = 'google';

export interface LatLng {
  latitude: number;
  longitude: number;
}

export interface Region extends LatLng {
  latitudeDelta: number;
  longitudeDelta: number;
}

interface MapContextValue {
  region: Region;
  size: { width: number; height: number };
  project: (coord: LatLng) => { x: number; y: number };
}

const MapContext = React.createContext<MapContextValue | null>(null);

const DEFAULT_REGION: Region = {
  latitude: 28.6139,
  longitude: 77.209,
  latitudeDelta: 5,
  longitudeDelta: 5,
};

const CELL = 64;

// ─── Callout ─────────────────────────────────────────────────────────────

export interface CalloutProps {
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export const Callout: React.FC<CalloutProps> = ({ onPress, style, children }) => {
  if (onPress) {
    return (
      <Pressable onPress={onPress} style={style}>
        {children}
      </Pressable>
    );
  }
  return <View style={style}>{children}</View>;
};

// ─── Polyline ────────────────────────────────────────────────────────────

export interface PolylineProps {
  coordinates: LatLng[];
  strokeColor?: string;
  strokeWidth?: number;
}

export const Polyline: React.FC<PolylineProps> = ({
  coordinates,
  strokeColor = '#F0820D',
  strokeWidth = 3,
}) => {
  const ctx = useContext(MapContext);
  if (!ctx || ctx.size.width === 0 || coordinates.length < 2) return null;

  const points = coordinates.map(c => ctx.project(c));

  const renderPass = (width: number, color: string, keyPrefix: string) =>
    points.slice(0, -1).map((p, i) => {
      const q = points[i + 1];
      const dx = q.x - p.x;
      const dy = q.y - p.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      if (length < 0.5) return null;
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      return (
        <View
          key={`${keyPrefix}-${i}`}
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: (p.x + q.x) / 2 - length / 2,
            top: (p.y + q.y) / 2 - width / 2,
            width: length,
            height: width,
            borderRadius: width,
            backgroundColor: color,
            transform: [{ rotate: `${angle}deg` }],
          }}
        />
      );
    });

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {renderPass(strokeWidth + 3, 'rgba(255,255,255,0.75)', 'casing')}
      {renderPass(strokeWidth, strokeColor, 'line')}
    </View>
  );
};

// ─── Marker ──────────────────────────────────────────────────────────────

export interface MarkerProps {
  coordinate: LatLng;
  title?: string;
  description?: string;
  pinColor?: string;
  onPress?: () => void;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  [key: string]: any;
}

export const Marker: React.FC<MarkerProps> = ({
  coordinate,
  title,
  description,
  pinColor = '#E5484D',
  onPress,
  children,
}) => {
  const { theme } = useTheme();
  const ctx = useContext(MapContext);
  const [showCallout, setShowCallout] = useState(false);

  if (!ctx || ctx.size.width === 0) return null;

  const pos = ctx.project(coordinate);
  const margin = 140;
  if (
    pos.x < -margin ||
    pos.x > ctx.size.width + margin ||
    pos.y < -margin ||
    pos.y > ctx.size.height + margin
  ) {
    return null; // off-screen — skip rendering
  }

  // Split the Callout child out from the visual marker content
  const calloutElements: React.ReactElement<any>[] = [];
  const markerContent: React.ReactNode[] = [];
  React.Children.forEach(children, child => {
    if (React.isValidElement(child) && (child.type as any) === Callout) {
      calloutElements.push(child as React.ReactElement<any>);
    } else {
      markerContent.push(child);
    }
  });
  const calloutElement = calloutElements[0];

  const handlePress = () => {
    setShowCallout(v => !v);
    onPress?.();
  };

  const handleCalloutPress = () => {
    const original = calloutElement?.props?.onPress;
    if (typeof original === 'function') original();
    setShowCallout(false);
  };

  return (
    <View
      pointerEvents="box-none"
      style={[styles.markerWrap, { left: pos.x - 22, top: pos.y - 22, zIndex: showCallout ? 500 : 1 }]}
    >
      <Pressable onPress={handlePress} hitSlop={6} style={styles.markerAnchor}>
        {markerContent.length > 0 ? (
          markerContent
        ) : (
          <View style={[styles.pin, { backgroundColor: pinColor, borderColor: theme.colors.cardBackground }]}>
            <View style={styles.pinInner} />
          </View>
        )}
      </Pressable>

      {showCallout && (
        <View pointerEvents="box-none" style={styles.calloutAnchor}>
          <View
            style={[
              styles.calloutBubble,
              { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border },
            ]}
          >
            {calloutElement ? (
              React.cloneElement(calloutElement, { onPress: handleCalloutPress } as any)
            ) : (
              <View>
                {!!title && (
                  <Text style={[styles.calloutTitle, { color: theme.colors.textPrimary }]} numberOfLines={2}>
                    {title}
                  </Text>
                )}
                {!!description && (
                  <Text style={[styles.calloutDesc, { color: theme.colors.textSecondary }]} numberOfLines={3}>
                    {description}
                  </Text>
                )}
              </View>
            )}
          </View>
          <View
            style={[
              styles.calloutArrow,
              { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border },
            ]}
          />
        </View>
      )}
    </View>
  );
};

// ─── MapView ─────────────────────────────────────────────────────────────

export interface MapViewProps {
  style?: StyleProp<ViewStyle>;
  region?: Region;
  initialRegion?: Region;
  onRegionChangeComplete?: (region: Region) => void;
  mapType?: 'standard' | 'satellite' | string;
  showsUserLocation?: boolean;
  showsCompass?: boolean;
  showsScale?: boolean;
  loadingEnabled?: boolean;
  provider?: any;
  children?: React.ReactNode;
  [key: string]: any;
}

interface MapViewHandle {
  animateToRegion: (region: Region, duration?: number) => void;
}

const MapView = forwardRef<MapViewHandle, MapViewProps>(function MapView(props, ref) {
  const { style, region, initialRegion, onRegionChangeComplete, mapType = 'standard', children } = props;

  const [size, setSize] = useState({ width: 0, height: 0 });
  const [currentRegion, setCurrentRegion] = useState<Region>(
    region ?? initialRegion ?? DEFAULT_REGION,
  );

  const regionRef = useRef<Region>(currentRegion);
  const animationRef = useRef<number | null>(null);
  const callbackRef = useRef(onRegionChangeComplete);
  callbackRef.current = onRegionChangeComplete;
  const dragRef = useRef<{ x: number; y: number; region: Region } | null>(null);

  const applyRegion = useCallback((r: Region) => {
    regionRef.current = r;
    setCurrentRegion(r);
  }, []);

  const stopAnimation = useCallback(() => {
    if (animationRef.current != null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  // Keep the map in sync when the parent screen updates its region state.
  useEffect(() => {
    if (!region) return;
    stopAnimation();
    applyRegion(region);
  }, [region, stopAnimation, applyRegion]);

  useEffect(() => stopAnimation, [stopAnimation]);

  useImperativeHandle(
    ref,
    () => ({
      animateToRegion: (target: Region, duration: number = 500) => {
        stopAnimation();
        const start = { ...regionRef.current };
        if (duration <= 0) {
          applyRegion(target);
          callbackRef.current?.(target);
          return;
        }
        const startTime = Date.now();
        const tick = () => {
          const p = Math.min(1, (Date.now() - startTime) / duration);
          const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
          applyRegion({
            latitude: start.latitude + (target.latitude - start.latitude) * eased,
            longitude: start.longitude + (target.longitude - start.longitude) * eased,
            latitudeDelta:
              start.latitudeDelta + (target.latitudeDelta - start.latitudeDelta) * eased,
            longitudeDelta:
              start.longitudeDelta + (target.longitudeDelta - start.longitudeDelta) * eased,
          });
          if (p < 1) {
            animationRef.current = requestAnimationFrame(tick);
          } else {
            animationRef.current = null;
            callbackRef.current?.(target);
          }
        };
        animationRef.current = requestAnimationFrame(tick);
      },
    }),
    [stopAnimation, applyRegion],
  );

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize(prev =>
      prev.width === width && prev.height === height ? prev : { width, height },
    );
  };

  // ── Drag to pan ──────────────────────────────────────────────────────
  const handleGrant = (e: GestureResponderEvent) => {
    stopAnimation();
    dragRef.current = {
      x: e.nativeEvent.pageX,
      y: e.nativeEvent.pageY,
      region: { ...regionRef.current },
    };
  };

  const handleMove = (e: GestureResponderEvent) => {
    const drag = dragRef.current;
    if (!drag || size.width === 0 || size.height === 0) return;
    const dx = e.nativeEvent.pageX - drag.x;
    const dy = e.nativeEvent.pageY - drag.y;
    applyRegion({
      ...drag.region,
      longitude: drag.region.longitude - (dx / size.width) * drag.region.longitudeDelta,
      latitude: drag.region.latitude + (dy / size.height) * drag.region.latitudeDelta,
    });
  };

  const handleRelease = () => {
    if (dragRef.current) {
      dragRef.current = null;
      callbackRef.current?.(regionRef.current);
    }
  };

  // ── Projection ───────────────────────────────────────────────────────
  const ctx = useMemo<MapContextValue>(() => {
    const dLat = currentRegion.latitudeDelta || 1e-6;
    const dLng = currentRegion.longitudeDelta || 1e-6;
    const west = currentRegion.longitude - dLng / 2;
    const north = currentRegion.latitude + dLat / 2;
    return {
      region: currentRegion,
      size,
      project: (c: LatLng) => ({
        x: ((c.longitude - west) / dLng) * size.width,
        y: ((north - c.latitude) / dLat) * size.height,
      }),
    };
  }, [currentRegion, size]);

  // ── Split children ───────────────────────────────────────────────────
  const polylineNodes: React.ReactNode[] = [];
  const markerNodes: React.ReactNode[] = [];
  const otherNodes: React.ReactNode[] = [];
  React.Children.forEach(children, child => {
    if (React.isValidElement(child)) {
      if ((child.type as any) === Polyline) {
        polylineNodes.push(child);
      } else if ((child.type as any) === Marker) {
        markerNodes.push(child);
      } else {
        otherNodes.push(child);
      }
    } else if (child != null && child !== false) {
      otherNodes.push(child);
    }
  });

  // ── Map surface decoration ───────────────────────────────────────────
  const satellite = mapType === 'satellite';
  const baseColor = satellite ? '#1E2A20' : '#EDF1E8';
  const gridColor = satellite ? 'rgba(255,255,255,0.05)' : 'rgba(96,118,96,0.14)';
  const roadColor = satellite ? 'rgba(236,224,180,0.16)' : 'rgba(255,255,255,0.95)';

  const verticals: number[] = [];
  const horizontals: number[] = [];
  for (let x = CELL; x < size.width; x += CELL) verticals.push(x);
  for (let y = CELL; y < size.height; y += CELL) horizontals.push(y);

  return (
    <View style={[styles.container, style]} onLayout={onLayout}>
      {/* Base surface — also handles drag-to-pan */}
      <View
        style={[StyleSheet.absoluteFill, { backgroundColor: baseColor }]}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => false}
        onResponderGrant={handleGrant}
        onResponderMove={handleMove}
        onResponderRelease={handleRelease}
        onResponderTerminate={handleRelease}
      >
        {verticals.map(x => (
          <View
            key={`v-${x}`}
            style={{ position: 'absolute', left: x, top: 0, bottom: 0, width: 1, backgroundColor: gridColor }}
          />
        ))}
        {horizontals.map(y => (
          <View
            key={`h-${y}`}
            style={{ position: 'absolute', top: y, left: 0, right: 0, height: 1, backgroundColor: gridColor }}
          />
        ))}
        {verticals
          .filter(x => x % (CELL * 4) === 0)
          .map(x => (
            <View
              key={`vr-${x}`}
              style={{ position: 'absolute', left: x - 2, top: 0, bottom: 0, width: 5, backgroundColor: roadColor }}
            />
          ))}
        {horizontals
          .filter(y => y % (CELL * 4) === 0)
          .map(y => (
            <View
              key={`hr-${y}`}
              style={{ position: 'absolute', top: y - 2, left: 0, right: 0, height: 5, backgroundColor: roadColor }}
            />
          ))}
      </View>

      {/* Geographic overlay */}
      <MapContext.Provider value={ctx}>
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          {polylineNodes}
        </View>
        {otherNodes}
        {markerNodes}
      </MapContext.Provider>
    </View>
  );
});

export default MapView;

// ─── Styles ──────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#EDF1E8',
  },
  markerWrap: {
    position: 'absolute',
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerAnchor: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pin: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
  },
  pinInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  calloutAnchor: {
    position: 'absolute',
    bottom: 50,
    left: 22,
    marginLeft: -100,
    width: 200,
    alignItems: 'center',
  },
  calloutBubble: {
    width: 200,
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 6,
  },
  calloutArrow: {
    position: 'absolute',
    bottom: -5,
    width: 11,
    height: 11,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    transform: [{ rotate: '45deg' }],
  },
  calloutTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  calloutDesc: {
    fontSize: 11,
    lineHeight: 15,
  },
});
