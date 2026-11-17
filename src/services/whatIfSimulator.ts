import { Truck, Shipment, Trip } from '../types';

export type SimulationScenario =
  | 'truck_breakdown'
  | 'shipment_cancellation'
  | 'deadline_acceleration'
  | 'express_load_insertion';

export interface PlanMetrics {
  totalDistanceKm: number;
  totalCostRupees: number;
  avgEtaMinutes: number;
  fleetUtilizationPercent: number;
  onTimeDeliveryRate: number;
}

export interface SimulationResult {
  scenario: SimulationScenario;
  scenarioTitle: string;
  scenarioDescription: string;
  affectedTruckId?: string;
  affectedShipmentId?: string;
  beforePlan: PlanMetrics;
  afterPlan: PlanMetrics;
  deltas: {
    costSaved: number;
    distanceSavedKm: number;
    utilizationGainPercent: number;
    timeSavedMins: number;
  };
  recommendedSteps: {
    stepNumber: number;
    action: string;
    targetEntity: string;
    detail: string;
  }[];
  feasibilityScore: number; // 0 - 100%
  summaryBadge: string;
}

export function runWhatIfSimulation(
  scenario: SimulationScenario,
  params?: { truckId?: string; shipmentId?: string; deadlineHours?: number }
): SimulationResult {
  switch (scenario) {
    case 'truck_breakdown':
      return {
        scenario: 'truck_breakdown',
        scenarioTitle: 'Truck Breakdown & Emergency Load Offload',
        scenarioDescription: 'Simulates mechanical failure on TRK-27 (Delhi-Jaipur corridor) and auto-assigns 2.4T cargo to nearest compatible vehicle TRK-14.',
        affectedTruckId: params?.truckId || 'TRK-27',
        beforePlan: {
          totalDistanceKm: 340,
          totalCostRupees: 18500,
          avgEtaMinutes: 280,
          fleetUtilizationPercent: 54,
          onTimeDeliveryRate: 68,
        },
        afterPlan: {
          totalDistanceKm: 310,
          totalCostRupees: 15700,
          avgEtaMinutes: 245,
          fleetUtilizationPercent: 88,
          onTimeDeliveryRate: 96,
        },
        deltas: {
          costSaved: 2800,
          distanceSavedKm: 30,
          utilizationGainPercent: 34,
          timeSavedMins: 35,
        },
        recommendedSteps: [
          {
            stepNumber: 1,
            action: 'Dispatch Rescue Carrier',
            targetEntity: 'TRK-14 (Eicher Pro 3019)',
            detail: 'Divert TRK-14 to breakdown location at Highway KM 142 within 18 minutes.',
          },
          {
            stepNumber: 2,
            action: 'Transfer Payload',
            targetEntity: 'Consignment CS-882 (2.4T)',
            detail: 'Cross-dock pallets directly; load capacity utilization increases from 54% to 88%.',
          },
          {
            stepNumber: 3,
            action: 'Notify Consignee',
            targetEntity: 'Shipper Apex Logistics',
            detail: 'Push updated real-time ETA with zero delivery deadline penalty.',
          },
        ],
        feasibilityScore: 95,
        summaryBadge: 'High Feasibility — Saved ₹2,800',
      };

    case 'shipment_cancellation':
      return {
        scenario: 'shipment_cancellation',
        scenarioTitle: 'Consignment Cancellation & Return-Load Rebalance',
        scenarioDescription: 'Simulates cancellation of CS-304 (1.5T) and dynamically consolidates nearby pending load CS-409 to eliminate deadhead empty return.',
        affectedShipmentId: params?.shipmentId || 'CS-304',
        beforePlan: {
          totalDistanceKm: 420,
          totalCostRupees: 22000,
          avgEtaMinutes: 360,
          fleetUtilizationPercent: 48,
          onTimeDeliveryRate: 85,
        },
        afterPlan: {
          totalDistanceKm: 380,
          totalCostRupees: 17500,
          avgEtaMinutes: 320,
          fleetUtilizationPercent: 82,
          onTimeDeliveryRate: 98,
        },
        deltas: {
          costSaved: 4500,
          distanceSavedKm: 40,
          utilizationGainPercent: 34,
          timeSavedMins: 40,
        },
        recommendedSteps: [
          {
            stepNumber: 1,
            action: 'Release Truck Space',
            targetEntity: 'TRK-09 (Tata Signa)',
            detail: 'Remove cancelled shipment CS-304 from manifest; free up 1.5T capacity.',
          },
          {
            stepNumber: 2,
            action: 'Auto-Match Return Cargo',
            targetEntity: 'Shipment CS-409 (1.8T)',
            detail: 'Pickup nearby shipment at Neemrana Hub with 8 km detour offset.',
          },
          {
            stepNumber: 3,
            action: 'Recalculate Route Margin',
            targetEntity: 'Trip TRP-902',
            detail: 'Net trip margin improves by +24% with minimal delay.',
          },
        ],
        feasibilityScore: 92,
        summaryBadge: 'Optimized — Saved ₹4,500',
      };

    case 'deadline_acceleration':
      return {
        scenario: 'deadline_acceleration',
        scenarioTitle: 'Urgent Delivery Acceleration (Expedited)',
        scenarioDescription: 'Simulates 2-hour deadline advancement for perishable consignment CS-104 by re-sequencing delivery stops.',
        beforePlan: {
          totalDistanceKm: 260,
          totalCostRupees: 14200,
          avgEtaMinutes: 210,
          fleetUtilizationPercent: 70,
          onTimeDeliveryRate: 75,
        },
        afterPlan: {
          totalDistanceKm: 275,
          totalCostRupees: 13900,
          avgEtaMinutes: 145,
          fleetUtilizationPercent: 78,
          onTimeDeliveryRate: 100,
        },
        deltas: {
          costSaved: 300,
          distanceSavedKm: -15,
          utilizationGainPercent: 8,
          timeSavedMins: 65,
        },
        recommendedSteps: [
          {
            stepNumber: 1,
            action: 'Reorder Drop Sequence',
            targetEntity: 'Stop #3 → Move to Stop #1',
            detail: 'Prioritize drop-off at Hub Alpha before general freight drops.',
          },
          {
            stepNumber: 2,
            action: 'Bypass Traffic Hotspot',
            targetEntity: 'TRK-04 GPS Navigation',
            detail: 'Reroute via Outer Ring Express Expressway to shave off 40 minutes.',
          },
        ],
        feasibilityScore: 88,
        summaryBadge: 'Feasible — 65 Mins Accelerated',
      };

    case 'express_load_insertion':
    default:
      return {
        scenario: 'express_load_insertion',
        scenarioTitle: 'Real-Time Express Cargo Insertion',
        scenarioDescription: 'Matches a new high-priority 1.8T consignment onto an active truck with 3.5T available capacity along the Mumbai-Pune corridor.',
        beforePlan: {
          totalDistanceKm: 180,
          totalCostRupees: 9800,
          avgEtaMinutes: 150,
          fleetUtilizationPercent: 60,
          onTimeDeliveryRate: 90,
        },
        afterPlan: {
          totalDistanceKm: 192,
          totalCostRupees: 6400,
          avgEtaMinutes: 168,
          fleetUtilizationPercent: 92,
          onTimeDeliveryRate: 96,
        },
        deltas: {
          costSaved: 3400,
          distanceSavedKm: -12,
          utilizationGainPercent: 32,
          timeSavedMins: -18,
        },
        recommendedSteps: [
          {
            stepNumber: 1,
            action: 'Reserve Capacity',
            targetEntity: 'TRK-18 (BharatBenz 1617)',
            detail: 'Lock 1.8T deadweight capacity for incoming partial shipment.',
          },
          {
            stepNumber: 2,
            action: 'Waybill Consolidation',
            targetEntity: 'Consignment CS-910',
            detail: 'Combine shipping documentation under unified multi-drop manifest.',
          },
        ],
        feasibilityScore: 96,
        summaryBadge: 'High Profit Margin — Saved ₹3,400',
      };
  }
}
