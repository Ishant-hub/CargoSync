/**
 * CargoSync — Mock Data Layer
 * 
 * Realistic logistics mock data for development.
 * Structured to be replaced by backend API calls.
 */

import {
  User,
  Truck,
  Shipment,
  Trip,
  TripStop,
  OptimizationOpportunity,
  Disruption,
  ShipperStats,
  DriverStats,
  FleetStats,
  TrackingEvent,
} from '../types';

// ─── Users ──────────────────────────────────────────────

export const mockUsersRecord: Record<string, User> = {
  shipper: {
    id: 'USR-001',
    name: 'Rajesh Sharma',
    email: 'rajesh@logisticscorp.in',
    phone: '+91 98765 43210',
    role: 'shipper',
    companyName: 'Apex Logistics Ltd.',
    rating: 4.9,
    createdAt: '2025-08-15T09:00:00Z',
  },
  driver: {
    id: 'USR-002',
    name: 'Gurpreet Singh',
    email: 'gurpreet.singh@cargosync.in',
    phone: '+91 87654 32109',
    role: 'driver',
    companyName: 'BlueDart Freight Logistics',
    rating: 4.9,
    createdAt: '2025-06-20T09:00:00Z',
  },
  fleet_ops: {
    id: 'USR-003',
    name: 'Vikram Mehta',
    email: 'vikram.mehta@bluedartfleet.com',
    phone: '+91 76543 21098',
    role: 'fleet_ops',
    companyName: 'BlueDart Fleet Solutions',
    rating: 5.0,
    createdAt: '2025-05-10T09:00:00Z',
  },
};

export const mockUsers: User[] = Object.values(mockUsersRecord);

// ─── Trucks ─────────────────────────────────────────────

export const mockTrucks: Truck[] = [
  {
    id: 'TRK-27',
    registrationNumber: 'DL-01-AX-2745',
    type: '10T Container',
    maxCapacity: 10,
    currentLoad: 7.6,
    availableCapacity: 2.4,
    status: 'on_trip',
    driverId: 'USR-002',
    driverName: 'Gurpreet Singh',
    currentLocation: {
      latitude: 28.7041,
      longitude: 77.1025,
      address: 'NH-44, near Panipat',
      city: 'Panipat',
      state: 'Haryana',
    },
    currentTripId: 'TRIP-101',
  },
  {
    id: 'TRK-14',
    registrationNumber: 'HR-26-BC-1488',
    type: '16T Flatbed',
    maxCapacity: 16,
    currentLoad: 11.2,
    availableCapacity: 4.8,
    status: 'on_trip',
    driverId: 'USR-010',
    driverName: 'Vikram Yadav',
    currentLocation: {
      latitude: 26.8467,
      longitude: 80.9462,
      address: 'NH-27, near Lucknow',
      city: 'Lucknow',
      state: 'Uttar Pradesh',
    },
    currentTripId: 'TRIP-102',
  },
  {
    id: 'TRK-09',
    registrationNumber: 'MH-12-DE-0921',
    type: '7T Mini Truck',
    maxCapacity: 7,
    currentLoad: 0,
    availableCapacity: 7,
    status: 'available',
    driverId: 'USR-011',
    driverName: 'Suresh Patil',
    currentLocation: {
      latitude: 18.5204,
      longitude: 73.8567,
      address: 'Pune Transport Hub',
      city: 'Pune',
      state: 'Maharashtra',
    },
  },
  {
    id: 'TRK-33',
    registrationNumber: 'RJ-14-FG-3301',
    type: '20T Container',
    maxCapacity: 20,
    currentLoad: 14.5,
    availableCapacity: 5.5,
    status: 'on_trip',
    driverId: 'USR-012',
    driverName: 'Harish Meena',
    currentLocation: {
      latitude: 26.9124,
      longitude: 75.7873,
      address: 'NH-48, near Jaipur',
      city: 'Jaipur',
      state: 'Rajasthan',
    },
    currentTripId: 'TRIP-103',
  },
  {
    id: 'TRK-41',
    registrationNumber: 'KA-01-HI-4122',
    type: '12T Container',
    maxCapacity: 12,
    currentLoad: 8.3,
    availableCapacity: 3.7,
    status: 'on_trip',
    driverId: 'USR-013',
    driverName: 'Rajan Kumar',
    currentLocation: {
      latitude: 12.9716,
      longitude: 77.5946,
      address: 'Peenya Industrial Area',
      city: 'Bangalore',
      state: 'Karnataka',
    },
    currentTripId: 'TRIP-104',
  },
];

// ─── Shipments ──────────────────────────────────────────

export const mockShipments: Shipment[] = [
  {
    id: 'SHP-1847',
    trackingNumber: 'WAY-DL-1847',
    shipperId: 'USR-001',
    pickup: {
      latitude: 28.6139,
      longitude: 77.2090,
      name: 'Okhla Depot #4',
      address: 'Okhla Industrial Area, Phase-II',
      city: 'Delhi',
      state: 'Delhi',
    },
    origin: {
      latitude: 28.6139,
      longitude: 77.2090,
      name: 'Okhla Depot #4',
      address: 'Okhla Industrial Area, Phase-II',
      city: 'Delhi',
      state: 'Delhi',
    },
    destination: {
      latitude: 30.7333,
      longitude: 76.7794,
      name: 'Chandigarh Logistics Hub',
      address: 'Industrial Area, Phase-I',
      city: 'Chandigarh',
      state: 'Chandigarh',
    },
    weight: 3200,
    volume: 8.5,
    cargoType: 'general',
    pickupWindow: {
      start: '2026-10-06T08:00:00Z',
      end: '2026-10-06T12:00:00Z',
    },
    deliveryDeadline: '2026-10-06T20:00:00Z',
    priority: 'high',
    status: 'in_transit',
    assignedTruckId: 'TRK-27',
    estimatedEta: '2026-10-06T18:35:00+05:30',
    cost: 8500,
    createdAt: '2026-10-05T14:00:00Z',
  },
  {
    id: 'SHP-1852',
    trackingNumber: 'WAY-GG-1852',
    shipperId: 'USR-001',
    pickup: {
      latitude: 28.4595,
      longitude: 77.0266,
      name: 'Manesar Warehouse B',
      address: 'IMT Manesar, Sector-8',
      city: 'Gurugram',
      state: 'Haryana',
    },
    origin: {
      latitude: 28.4595,
      longitude: 77.0266,
      name: 'Manesar Warehouse B',
      address: 'IMT Manesar, Sector-8',
      city: 'Gurugram',
      state: 'Haryana',
    },
    destination: {
      latitude: 30.9010,
      longitude: 75.8573,
      name: 'Ludhiana Central Terminal',
      address: 'Focal Point, Phase-V',
      city: 'Ludhiana',
      state: 'Punjab',
    },
    weight: 1800,
    volume: 4.2,
    cargoType: 'general',
    pickupWindow: {
      start: '2026-10-06T10:00:00Z',
      end: '2026-10-06T14:00:00Z',
    },
    deliveryDeadline: '2026-10-07T08:00:00Z',
    priority: 'medium',
    status: 'pending',
    cost: 5200,
    createdAt: '2026-10-06T06:00:00Z',
  },
  {
    id: 'SHP-1839',
    trackingNumber: 'WAY-DL-1839',
    shipperId: 'USR-001',
    pickup: {
      latitude: 28.6508,
      longitude: 77.2219,
      name: 'Sarai Kale Khan Terminal',
      address: 'Sarai Kale Khan',
      city: 'Delhi',
      state: 'Delhi',
    },
    origin: {
      latitude: 28.6508,
      longitude: 77.2219,
      name: 'Sarai Kale Khan Terminal',
      address: 'Sarai Kale Khan',
      city: 'Delhi',
      state: 'Delhi',
    },
    destination: {
      latitude: 29.9457,
      longitude: 78.1642,
      name: 'Haridwar SIDCUL Station',
      address: 'SIDCUL Industrial Park',
      city: 'Haridwar',
      state: 'Uttarakhand',
    },
    weight: 2100,
    volume: 5.0,
    cargoType: 'fragile',
    pickupWindow: {
      start: '2026-10-06T06:00:00Z',
      end: '2026-10-06T10:00:00Z',
    },
    deliveryDeadline: '2026-10-06T22:00:00Z',
    priority: 'high',
    status: 'in_transit',
    assignedTruckId: 'TRK-27',
    estimatedEta: '2026-10-06T16:15:00+05:30',
    cost: 6200,
    createdAt: '2026-10-05T10:00:00Z',
  },
  {
    id: 'SHP-1860',
    trackingNumber: 'WAY-NO-1860',
    shipperId: 'USR-001',
    pickup: {
      latitude: 28.5355,
      longitude: 77.3910,
      name: 'Noida Sector-62 Hub',
      address: 'Noida Sector-62',
      city: 'Noida',
      state: 'Uttar Pradesh',
    },
    origin: {
      latitude: 28.5355,
      longitude: 77.3910,
      name: 'Noida Sector-62 Hub',
      address: 'Noida Sector-62',
      city: 'Noida',
      state: 'Uttar Pradesh',
    },
    destination: {
      latitude: 30.3165,
      longitude: 78.0322,
      name: 'Dehradun Hub',
      address: 'Dehradun Logistics Hub',
      city: 'Dehradun',
      state: 'Uttarakhand',
    },
    weight: 800,
    volume: 2.0,
    cargoType: 'general',
    pickupWindow: {
      start: '2026-10-06T09:00:00Z',
      end: '2026-10-06T13:00:00Z',
    },
    deliveryDeadline: '2026-10-07T06:00:00Z',
    priority: 'low',
    status: 'pending',
    cost: 3800,
    createdAt: '2026-10-06T07:30:00Z',
  },
  {
    id: 'SHP-1825',
    trackingNumber: 'WAY-DL-1825',
    shipperId: 'USR-001',
    pickup: {
      latitude: 28.6139,
      longitude: 77.2090,
      name: 'Mayapuri Center',
      address: 'Mayapuri Industrial Area',
      city: 'Delhi',
      state: 'Delhi',
    },
    origin: {
      latitude: 28.6139,
      longitude: 77.2090,
      name: 'Mayapuri Center',
      address: 'Mayapuri Industrial Area',
      city: 'Delhi',
      state: 'Delhi',
    },
    destination: {
      latitude: 26.9124,
      longitude: 75.7873,
      name: 'Sitapura Industrial Zone',
      address: 'Sitapura Industrial Area',
      city: 'Jaipur',
      state: 'Rajasthan',
    },
    weight: 4500,
    volume: 12.0,
    cargoType: 'general',
    pickupWindow: {
      start: '2026-10-05T06:00:00Z',
      end: '2026-10-05T10:00:00Z',
    },
    deliveryDeadline: '2026-10-05T22:00:00Z',
    priority: 'medium',
    status: 'delivered',
    assignedTruckId: 'TRK-33',
    cost: 12000,
    createdAt: '2026-10-04T15:00:00Z',
  },
];

// ─── Trips ──────────────────────────────────────────────

export const mockTrips: Trip[] = [
  {
    id: 'TRIP-101',
    truckId: 'TRK-27',
    shipmentIds: ['SHP-1847', 'SHP-1839'],
    origin: {
      latitude: 28.6139,
      longitude: 77.2090,
      city: 'Delhi',
      state: 'Delhi',
    },
    destination: {
      latitude: 30.7333,
      longitude: 76.7794,
      city: 'Chandigarh',
      state: 'Punjab',
    },
    stops: [
      {
        id: 'STOP-1',
        type: 'pickup',
        location: {
          latitude: 28.6508,
          longitude: 77.2219,
          name: 'Sarai Kale Khan',
          address: 'Sarai Kale Khan Depot',
          city: 'Delhi',
          state: 'Delhi',
        },
        shipmentId: 'SHP-1839',
        scheduledTime: '2026-10-06T08:00:00+05:30',
        actualTime: '2026-10-06T08:22:00+05:30',
        completed: true,
      },
      {
        id: 'STOP-2',
        type: 'pickup',
        location: {
          latitude: 28.6139,
          longitude: 77.2090,
          name: 'Okhla Hub',
          address: 'Okhla Industrial Area, Phase-II',
          city: 'Delhi',
          state: 'Delhi',
        },
        shipmentId: 'SHP-1847',
        scheduledTime: '2026-10-06T09:00:00+05:30',
        actualTime: '2026-10-06T09:15:00+05:30',
        completed: true,
      },
      {
        id: 'STOP-3',
        type: 'delivery',
        location: {
          latitude: 29.9457,
          longitude: 78.1642,
          name: 'Haridwar SIDCUL',
          address: 'SIDCUL Industrial Park',
          city: 'Haridwar',
          state: 'Uttarakhand',
        },
        shipmentId: 'SHP-1839',
        scheduledTime: '2026-10-06T16:00:00+05:30',
        completed: false,
      },
      {
        id: 'STOP-4',
        type: 'delivery',
        location: {
          latitude: 30.7333,
          longitude: 76.7794,
          name: 'Chandigarh Terminal',
          address: 'Industrial Area, Phase-I',
          city: 'Chandigarh',
          state: 'Chandigarh',
        },
        shipmentId: 'SHP-1847',
        scheduledTime: '2026-10-06T18:30:00+05:30',
        completed: false,
      },
    ],
    route: [
      { latitude: 28.6139, longitude: 77.2090, city: 'Delhi' },
      { latitude: 29.0588, longitude: 76.0856, city: 'Panipat' },
      { latitude: 29.9457, longitude: 78.1642, city: 'Haridwar' },
      { latitude: 30.7333, longitude: 76.7794, city: 'Chandigarh' },
    ],
    plannedEta: '2026-10-06T18:30:00+05:30',
    actualEta: '2026-10-06T18:35:00+05:30',
    status: 'in_progress',
    distanceKm: 482,
    startedAt: '2026-10-06T08:22:00+05:30',
  },
];

// ─── Optimization Opportunities ─────────────────────────

export const mockOptimizations: OptimizationOpportunity[] = [
  {
    id: 'OPT-001',
    truckId: 'TRK-27',
    truckRegistration: 'DL-01-AX-2745',
    currentUtilization: 76,
    potentialUtilization: 91,
    availableCapacity: 2.4,
    compatibleShipments: [
      {
        shipmentId: 'SHP-1852',
        pickup: {
          latitude: 28.4595,
          longitude: 77.0266,
          address: 'IMT Manesar',
          city: 'Gurugram',
        },
        destination: {
          latitude: 30.9010,
          longitude: 75.8573,
          address: 'Focal Point',
          city: 'Ludhiana',
        },
        weight: 1.8,
        detourKm: 18,
        etaImpactMinutes: 12,
        costSaving: 850,
      },
      {
        shipmentId: 'SHP-1860',
        pickup: {
          latitude: 28.5355,
          longitude: 77.3910,
          address: 'Noida Sector-62',
          city: 'Noida',
        },
        destination: {
          latitude: 30.3165,
          longitude: 78.0322,
          address: 'Dehradun Logistics Hub',
          city: 'Dehradun',
        },
        weight: 0.8,
        detourKm: 25,
        etaImpactMinutes: 22,
        costSaving: 400,
      },
    ],
    totalPotentialSaving: 1250,
    route: 'Delhi → Chandigarh',
  },
  {
    id: 'OPT-002',
    truckId: 'TRK-14',
    truckRegistration: 'HR-26-BC-1488',
    currentUtilization: 70,
    potentialUtilization: 85,
    availableCapacity: 4.8,
    compatibleShipments: [
      {
        shipmentId: 'SHP-2001',
        pickup: {
          latitude: 28.6139,
          longitude: 77.2090,
          city: 'Delhi',
        },
        destination: {
          latitude: 26.8467,
          longitude: 80.9462,
          city: 'Lucknow',
        },
        weight: 2.4,
        detourKm: 12,
        etaImpactMinutes: 15,
        costSaving: 720,
      },
    ],
    totalPotentialSaving: 720,
    route: 'Delhi → Lucknow',
  },
];

export const mockOptimizationOpportunities = mockOptimizations;

// ─── Disruptions ────────────────────────────────────────

export const mockDisruptions: Disruption[] = [
  {
    id: 'DSR-001',
    type: 'pickup_delay',
    affectedTripId: 'TRIP-102',
    affectedTruckId: 'TRK-14',
    severity: 'medium',
    description: 'Pickup delayed by 2 hours at Delhi warehouse due to loading bay congestion.',
    timestamp: '2026-10-06T11:30:00Z',
    createdAt: '2026-10-06T11:30:00Z',
    resolved: false,
    reoptimizationTriggered: true,
    impact: 'Alternative corridor scheduled. Saves 45 min delay.',
  },
  {
    id: 'DSR-002',
    type: 'route_blocked',
    affectedTripId: 'TRIP-103',
    affectedTruckId: 'TRK-33',
    severity: 'high',
    description: 'NH-48 blocked near Neemrana due to road construction accident.',
    timestamp: '2026-10-06T13:15:00Z',
    createdAt: '2026-10-06T13:15:00Z',
    resolved: false,
    reoptimizationTriggered: false,
    impact: 'Traffic delay +90 min. Bypass recommended.',
  },
];

// ─── Dashboard Stats ────────────────────────────────────

export const mockShipperStats: ShipperStats = {
  activeShipments: 4,
  inTransit: 2,
  delivered: 1,
  pendingPickup: 2,
  totalWeightInTransit: 5300,
  savedCost: 14250,
  avgDeliveryTime: '1.4 Days',
};

export const mockDriverStats: DriverStats = {
  currentLoad: 7.6,
  maxCapacity: 10,
  availableCapacity: 2.4,
  nextPickup: undefined,
  nextDelivery: {
    id: 'STOP-3',
    type: 'delivery',
    location: {
      latitude: 29.9457,
      longitude: 78.1642,
      address: 'SIDCUL Industrial Park',
      city: 'Haridwar',
      state: 'Uttarakhand',
    },
    shipmentId: 'SHP-1839',
    scheduledTime: '2026-10-06T16:00:00+05:30',
    completed: false,
  },
  stopsCompleted: 2,
  totalStops: 4,
  hoursOnDuty: '5.5 hrs',
  todayPayload: '7.6 Tonnes',
  onTimeRate: 98,
};

export const mockFleetStats: FleetStats = {
  activeTrucks: 24,
  totalTrucks: 28,
  activeShipments: 42,
  inTransitShipments: 42,
  fleetUtilization: 82.5,
  avgCapacityUtilization: 82.5,
  delayedTrips: 2,
  onTimeDeliveryRate: 94.2,
};

// ─── Tracking Events ────────────────────────────────────

export const mockTrackingEvents: TrackingEvent[] = [
  {
    id: 'EVT-001',
    entityId: 'TRK-27',
    entityType: 'truck',
    location: {
      latitude: 28.6508,
      longitude: 77.2219,
      city: 'Delhi',
    },
    timestamp: '2026-10-06T08:22:00+05:30',
    eventType: 'departed',
    description: 'Departed from Sarai Kale Khan',
  },
  {
    id: 'EVT-002',
    entityId: 'SHP-1839',
    entityType: 'shipment',
    location: {
      latitude: 28.6508,
      longitude: 77.2219,
      city: 'Delhi',
    },
    timestamp: '2026-10-06T08:22:00+05:30',
    eventType: 'pickup_complete',
    description: 'Picked up from Sarai Kale Khan depot',
  },
  {
    id: 'EVT-003',
    entityId: 'TRK-27',
    entityType: 'truck',
    location: {
      latitude: 28.6139,
      longitude: 77.2090,
      city: 'Delhi',
    },
    timestamp: '2026-10-06T09:15:00+05:30',
    eventType: 'pickup_complete',
    description: 'Picked up from Okhla Industrial Area',
  },
  {
    id: 'EVT-004',
    entityId: 'TRK-27',
    entityType: 'truck',
    location: {
      latitude: 29.0588,
      longitude: 76.0856,
      city: 'Panipat',
    },
    timestamp: '2026-10-06T12:45:00+05:30',
    eventType: 'checkpoint',
    description: 'Crossed Panipat checkpoint on NH-44',
  },
];

// ─── Utility ────────────────────────────────────────────

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });
}
