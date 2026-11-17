/**
 * CargoSync — Core Type Definitions
 * Structured to mirror future backend API contracts.
 */

// ─── Enums ──────────────────────────────────────────────

export type UserRole = 'shipper' | 'driver' | 'fleet_ops' | 'fleet' | 'company_admin';

export type AccountType = 'individual' | 'company';

export type VerificationStatus = 'pending' | 'verified' | 'correction_required' | 'rejected';

export type EmployeeRole = 'admin' | 'dispatcher' | 'fleet_manager' | 'driver' | 'member';

export interface Company {
  id: string;
  legalName: string;
  businessType: string;
  gstin: string;
  registeredAddress: string;
  fleetSize?: number;
  adminId: string;
  verificationStatus: VerificationStatus;
  createdAt: string;
}

export interface CompanyEmployee {
  id: string;
  companyId: string;
  name: string;
  email: string;
  phone: string;
  role: EmployeeRole;
  status: 'active' | 'pending' | 'suspended';
  invitedAt: string;
  joinedAt?: string;
}

export interface CompanyInvite {
  code: string;
  companyId: string;
  companyName: string;
  role: EmployeeRole;
  expiresAt: string;
  used: boolean;
}

export interface DocumentSubmission {
  id: string;
  userId: string;
  documentType: 'aadhaar' | 'driving_licence' | 'pan' | 'rc' | 'gst_certificate' | 'incorporation' | 'bank_statement';
  fileUri: string;
  fileName: string;
  status: VerificationStatus;
  submittedAt: string;
  correctionNotes?: string;
}

export type ShipmentStatus =
  | 'pending'
  | 'assigned'
  | 'picked_up'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type TruckStatus =
  | 'available'
  | 'on_trip'
  | 'loading'
  | 'returning'
  | 'maintenance'
  | 'offline';

export type TripStatus =
  | 'planned'
  | 'in_progress'
  | 'completed'
  | 'delayed'
  | 'cancelled';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type CargoType =
  | 'general'
  | 'fragile'
  | 'perishable'
  | 'hazardous'
  | 'oversized'
  | 'liquid';

export type DisruptionType =
  | 'breakdown'
  | 'cancellation'
  | 'pickup_delay'
  | 'delivery_delay'
  | 'truck_unavailable'
  | 'deadline_change'
  | 'route_blocked';

export type DisruptionSeverity = 'low' | 'medium' | 'high' | 'critical';

export type TrackingEventType =
  | 'departed'
  | 'arrived'
  | 'pickup_complete'
  | 'delivery_complete'
  | 'delay'
  | 'route_deviation'
  | 'checkpoint';

// ─── Geo ────────────────────────────────────────────────

export interface GeoLocation {
  latitude: number;
  longitude: number;
  name?: string;
  address?: string;
  city?: string;
  state?: string;
}

// ─── User ───────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  accountType?: AccountType;
  avatarUrl?: string;
  companyId?: string;
  companyName?: string;
  companyRole?: EmployeeRole;
  verificationStatus?: VerificationStatus;
  rating?: number;
  cityHub?: string;
  createdAt?: string;
}

// ─── Truck ──────────────────────────────────────────────

export interface Truck {
  id: string;
  registrationNumber: string;
  type: string;
  maxCapacity: number; // tonnes
  currentLoad: number; // tonnes
  availableCapacity: number; // tonnes
  status: TruckStatus;
  driverId: string;
  driverName: string;
  currentLocation: GeoLocation;
  currentTripId?: string;
}

// ─── Shipment ───────────────────────────────────────────

export interface Shipment {
  id: string;
  trackingNumber?: string;
  shipperId: string;
  pickup: GeoLocation;
  origin?: GeoLocation;
  destination: GeoLocation;
  weight: number; // tonnes or kg
  volume?: number; // cubic metres
  cargoType: CargoType;
  pickupWindow: {
    start: string; // ISO date
    end: string;
  };
  deliveryDeadline: string; // ISO date
  priority: Priority;
  status: ShipmentStatus;
  assignedTruckId?: string;
  estimatedEta?: string; // ISO date
  cost?: number; // ₹
  createdAt: string;
}

// ─── Trip ───────────────────────────────────────────────

export interface TripStop {
  id: string;
  type: 'pickup' | 'delivery' | string;
  location: GeoLocation;
  shipmentId: string;
  scheduledTime: string;
  actualTime?: string;
  completed: boolean;
  status?: string;
}

export interface Trip {
  id: string;
  truckId: string;
  shipmentIds: string[];
  stops: TripStop[];
  origin?: GeoLocation;
  destination?: GeoLocation;
  route: GeoLocation[];
  plannedEta: string;
  actualEta?: string;
  status: TripStatus;
  distanceKm: number;
  startedAt?: string;
  completedAt?: string;
}

// ─── Tracking Event ─────────────────────────────────────

export interface TrackingEvent {
  id: string;
  entityId: string; // truck or shipment id
  entityType: 'truck' | 'shipment';
  location: GeoLocation;
  timestamp: string;
  eventType: TrackingEventType;
  description?: string;
}

// ─── Optimization ───────────────────────────────────────

export interface CompatibleShipment {
  shipmentId: string;
  pickup: GeoLocation;
  destination: GeoLocation;
  weight: number;
  detourKm: number;
  etaImpactMinutes: number;
  costSaving: number;
}

export interface OptimizationOpportunity {
  id: string;
  truckId: string;
  truckRegistration: string;
  currentUtilization: number; // percentage
  potentialUtilization: number; // percentage
  availableCapacity: number; // tonnes
  compatibleShipments: CompatibleShipment[];
  totalPotentialSaving: number; // ₹
  route: string; // e.g. "Delhi → Chandigarh"
}

// ─── Disruption ─────────────────────────────────────────

export interface Disruption {
  id: string;
  type: DisruptionType;
  affectedTripId: string;
  affectedTruckId: string;
  severity: DisruptionSeverity;
  description: string;
  timestamp: string;
  createdAt?: string;
  resolved: boolean;
  reoptimizationTriggered?: boolean;
  impact?: string;
}

// ─── Dashboard Stats ────────────────────────────────────

export interface ShipperStats {
  activeShipments: number;
  inTransit: number;
  delivered: number;
  pendingPickup: number;
  totalWeightInTransit?: number;
  savedCost?: number;
  avgDeliveryTime?: string;
}

export interface DriverStats {
  currentLoad: number;
  maxCapacity: number;
  availableCapacity: number;
  nextPickup?: TripStop;
  nextDelivery?: TripStop;
  stopsCompleted: number;
  totalStops: number;
  hoursOnDuty?: string;
  todayPayload?: string;
  onTimeRate?: number;
}

export interface FleetStats {
  activeTrucks: number;
  totalTrucks: number;
  activeShipments: number;
  inTransitShipments?: number;
  fleetUtilization: number; // percentage
  avgCapacityUtilization?: number;
  delayedTrips: number;
  onTimeDeliveryRate: number; // percentage
}

// ─── Auth ───────────────────────────────────────────────

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  name: string;
  email: string;
  phone: string;
  password: string;
}
