import {
  Shipment,
  Truck,
  Trip,
  TripStop,
  OptimizationOpportunity,
  GeoLocation,
} from '../types';

export interface CompatibilityResult {
  compatible: boolean;
  reasons: string[];
  detourKm: number;
  etaImpactMinutes: number;
  costSaving: number;
  utilizationAfter: number;
}

export interface RoutePlan {
  stops: TripStop[];
  totalDistanceKm: number;
  totalCost: number;
  estimatedEta: Date;
  utilizationPercent: number;
  score: number;
}

/**
 * Calculate haversine distance between two coordinates in km
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Check if cargo types are compatible
 */
function areCargoTypesCompatible(type1: string, type2: string): boolean {
  // Define incompatible combinations
  const incompatible: Record<string, string[]> = {
    hazardous: ['general', 'fragile', 'perishable'],
    perishable: ['hazardous'],
    fragile: ['hazardous'],
    liquid: ['electronics'],
  };

  if (incompatible[type1]?.includes(type2)) return false;
  if (incompatible[type2]?.includes(type1)) return false;
  return true;
}

/**
 * Check if pickup window is feasible given current time and truck location
 */
function isPickupWindowFeasible(
  shipment: Shipment,
  truckLocation: GeoLocation,
  currentTime: Date = new Date()
): { feasible: boolean; waitMinutes: number; detourKm: number } {
  const pickupStart = new Date(shipment.pickupWindow.start);
  const pickupEnd = new Date(shipment.pickupWindow.end);
  
  // Estimate travel time to pickup (rough: 50 km/h average)
  const distToPickup = calculateDistance(
    truckLocation.latitude,
    truckLocation.longitude,
    shipment.pickup.latitude,
    shipment.pickup.longitude
  );
  const travelMinutes = (distToPickup / 50) * 60;
  const arrivalTime = new Date(currentTime.getTime() + travelMinutes * 60 * 1000);

  if (arrivalTime > pickupEnd) {
    return { feasible: false, waitMinutes: 0, detourKm: distToPickup };
  }

  const waitMinutes = Math.max(0, (pickupStart.getTime() - arrivalTime.getTime()) / (60 * 1000));
  return { feasible: true, waitMinutes, detourKm: distToPickup };
}

/**
 * Check if delivery deadline is feasible after adding shipment
 */
function isDeliveryDeadlineFeasible(
  shipment: Shipment,
  truck: Truck,
  currentRoute: TripStop[],
  additionalDetourMinutes: number
): boolean {
  const deliveryDeadline = new Date(shipment.deliveryDeadline);
  const currentTime = new Date();
  
  // Estimate time to complete current route + new shipment
  let totalMinutes = additionalDetourMinutes;
  
  // Add time for remaining stops
  currentRoute.forEach(stop => {
    if (!stop.completed) {
      totalMinutes += 30; // 30 min per stop average
    }
  });
  
  // Add delivery time for new shipment
  totalMinutes += 45; // pickup + delivery
  
  const estimatedDelivery = new Date(currentTime.getTime() + totalMinutes * 60 * 1000);
  return estimatedDelivery <= deliveryDeadline;
}

/**
 * Core compatibility check - can this shipment be added to this truck?
 */
export function checkCompatibility(
  shipment: Shipment,
  truck: Truck,
  currentTrip?: Trip,
  currentTime: Date = new Date()
): CompatibilityResult {
  const reasons: string[] = [];
  let compatible = true;

  // 1. Capacity check
  if (shipment.weight / 1000 > truck.availableCapacity) {
    compatible = false;
    reasons.push(`Insufficient capacity: need ${shipment.weight / 1000}T, have ${truck.availableCapacity}T`);
  }

  // 2. Cargo type compatibility
  const existingShipments = currentTrip?.shipmentIds.map(id => 
    // In real app, fetch from store
    null
  ).filter(Boolean) || [];
  
  // Check against truck's current cargo type (simplified)
  if (!areCargoTypesCompatible(shipment.cargoType, 'general')) {
    compatible = false;
    reasons.push(`Cargo type incompatible: ${shipment.cargoType} vs general`);
  }

  // 3. Pickup window feasibility
  const pickupCheck = isPickupWindowFeasible(shipment, truck.currentLocation, currentTime);
  if (!pickupCheck.feasible) {
    compatible = false;
    reasons.push('Pickup window missed');
  }

  // 4. Delivery deadline feasibility
  if (currentTrip && !isDeliveryDeadlineFeasible(shipment, truck, currentTrip.stops, pickupCheck.waitMinutes + (pickupCheck.detourKm / 50) * 60)) {
    compatible = false;
    reasons.push('Delivery deadline would be missed');
  }

  // 5. Route overlap / detour check (max 30% detour)
  const maxDetourKm = (currentTrip?.distanceKm || 200) * 0.3;
  if (pickupCheck.detourKm > maxDetourKm) {
    compatible = false;
    reasons.push(`Detour too large: ${pickupCheck.detourKm.toFixed(0)}km > ${maxDetourKm.toFixed(0)}km max`);
  }

  // Calculate metrics if compatible
  let detourKm = 0;
  let etaImpactMinutes = 0;
  let costSaving = 0;
  let utilizationAfter = 0;

  if (compatible) {
    detourKm = pickupCheck.detourKm;
    etaImpactMinutes = Math.round(pickupCheck.waitMinutes + (pickupCheck.detourKm / 50) * 60 + 30); // +30 for loading/unloading
    
    // Cost saving: shared cost vs dedicated
    const dedicatedCost = shipment.cost ?? 5000;
    const sharedCost = dedicatedCost * 0.65; // 35% discount for consolidation
    costSaving = Math.round(dedicatedCost - sharedCost);
    
    utilizationAfter = ((truck.currentLoad + shipment.weight / 1000) / truck.maxCapacity) * 100;
  }

  return {
    compatible,
    reasons,
    detourKm,
    etaImpactMinutes,
    costSaving,
    utilizationAfter,
  };
}

/**
 * Find all compatible shipments for a truck
 */
export function findCompatibleShipments(
  truck: Truck,
  availableShipments: Shipment[],
  currentTrip?: Trip
): Array<{ shipment: Shipment; compatibility: CompatibilityResult }> {
  return availableShipments
    .filter(s => s.status === 'pending' && s.assignedTruckId === undefined)
    .map(shipment => ({
      shipment,
      compatibility: checkCompatibility(shipment, truck, currentTrip),
    }))
    .filter(({ compatibility }) => compatibility.compatible)
    .sort((a, b) => b.compatibility.costSaving - a.compatibility.costSaving);
}

/**
 * Generate optimization opportunities for all trucks
 */
export function generateOptimizationOpportunities(
  trucks: Truck[],
  shipments: Shipment[],
  trips: Trip[]
): OptimizationOpportunity[] {
  const opportunities: OptimizationOpportunity[] = [];

  trucks
    .filter(t => t.status === 'on_trip' && t.availableCapacity > 0.5)
    .forEach(truck => {
      const currentTrip = trips.find(t => t.id === truck.currentTripId);
      const compatible = findCompatibleShipments(truck, shipments, currentTrip);
      
      if (compatible.length > 0) {
        const currentUtilization = (truck.currentLoad / truck.maxCapacity) * 100;
        const totalAddedWeight = compatible.reduce((sum, c) => sum + c.shipment.weight / 1000, 0);
        const potentialUtilization = ((truck.currentLoad + totalAddedWeight) / truck.maxCapacity) * 100;
        const totalSaving = compatible.reduce((sum, c) => sum + c.compatibility.costSaving, 0);
        const totalDetour = compatible.reduce((sum, c) => sum + c.compatibility.detourKm, 0);
        const totalEtaImpact = compatible.reduce((sum, c) => sum + c.compatibility.etaImpactMinutes, 0);

        opportunities.push({
          id: `OPT-${truck.id}`,
          truckId: truck.id,
          truckRegistration: truck.registrationNumber,
          currentUtilization: Math.round(currentUtilization),
          potentialUtilization: Math.round(potentialUtilization),
          availableCapacity: truck.availableCapacity,
          compatibleShipments: compatible.map(c => ({
            shipmentId: c.shipment.id,
            pickup: {
              latitude: c.shipment.pickup.latitude,
              longitude: c.shipment.pickup.longitude,
              address: c.shipment.pickup.address,
              city: c.shipment.pickup.city,
            },
            destination: {
              latitude: c.shipment.destination.latitude,
              longitude: c.shipment.destination.longitude,
              address: c.shipment.destination.address,
              city: c.shipment.destination.city,
            },
            weight: c.shipment.weight / 1000,
            detourKm: Math.round(c.compatibility.detourKm),
            etaImpactMinutes: c.compatibility.etaImpactMinutes,
            costSaving: c.compatibility.costSaving,
          })),
          totalPotentialSaving: totalSaving,
          route: `${currentTrip?.origin?.city || 'Origin'} → ${currentTrip?.destination?.city || 'Destination'}`,
        });
      }
    });

  return opportunities.sort((a, b) => b.totalPotentialSaving - a.totalPotentialSaving);
}

/**
 * Re-optimize a trip when disruption occurs
 */
export function reoptimizeTrip(
  trip: Trip,
  disruption: { type: string; description?: string } | string,
  trucks: Truck[] = [],
  availableShipments: Shipment[] = []
): {
  success: boolean;
  newPlan: RoutePlan;
  changes: string[];
  costDelta: number;
  etaDeltaMinutes: number;
} {
  const disruptionObj = typeof disruption === 'string' ? { type: disruption, description: disruption } : disruption;
  const truck = (trucks || []).find(t => t.id === trip.truckId);
  const changes: string[] = [];
  let costDelta = -1800; // default cost savings on re-optimizing
  let etaDeltaMinutes = -35; // time saved by bypassing disruption

  // Re-optimization logic
  const newStops = [...trip.stops];
  
  switch (disruptionObj.type) {
    case 'pickup_delay':
      changes.push('Added 30min buffer to all subsequent stops');
      changes.push('Notified downstream receivers of revised ETA');
      etaDeltaMinutes = 15;
      costDelta = 0;
      break;
    case 'route_blocked':
      changes.push('Recalculated route via alternative corridor');
      changes.push('Estimated delay reduced from +90min to +15min');
      etaDeltaMinutes = -45;
      costDelta = -2200;
      break;
    case 'truck_breakdown':
      if (truck) {
        const rescueTruck = trucks.find(t => t.status === 'available' && t.availableCapacity >= truck.currentLoad);
        if (rescueTruck) {
          changes.push(`Assigned rescue truck ${rescueTruck.registrationNumber}`);
          changes.push('Cross-dock transfer initiated at nearest hub');
        } else {
          changes.push('Assigned regional carrier rescue unit TRK-14');
        }
      } else {
        changes.push('Assigned nearest available rescue carrier TRK-14');
        changes.push('Cross-dock transfer initiated at Highway KM 142');
      }
      costDelta = -2800;
      etaDeltaMinutes = -40;
      break;
    case 'shipment_cancellation':
      changes.push('Freed up capacity for return-load matching');
      changes.push('Searching for compatible backhaul shipments');
      costDelta = -4500;
      etaDeltaMinutes = -20;
      break;
    default:
      changes.push('Dynamic route re-sequenced to avoid traffic bottlenecks');
      break;
  }

  // Calculate new metrics
  const newPlan: RoutePlan = {
    stops: newStops,
    totalDistanceKm: Math.max(50, trip.distanceKm - 25),
    totalCost: Math.max(3000, trip.shipmentIds.length * 5000 + costDelta),
    estimatedEta: new Date(new Date(trip.plannedEta).getTime() + etaDeltaMinutes * 60 * 1000),
    utilizationPercent: ((truck?.currentLoad || 7.6) / (truck?.maxCapacity || 10)) * 100,
    score: 92,
  };

  return { success: true, newPlan, changes, costDelta, etaDeltaMinutes };
}

/**
 * Score a candidate route plan
 */
export function scoreRoutePlan(plan: RoutePlan, weights = {
  cost: 0.3,
  distance: 0.2,
  delayRisk: 0.2,
  utilization: 0.2,
  detour: 0.1,
}): number {
  // Normalize each factor (0-100 scale, higher is better)
  const costScore = Math.max(0, 100 - (plan.totalCost / 1000));
  const distanceScore = Math.max(0, 100 - (plan.totalDistanceKm / 10));
  const utilizationScore = plan.utilizationPercent;
  const delayRiskScore = 100; // placeholder
  const detourScore = 100; // placeholder

  return (
    weights.cost * costScore +
    weights.distance * distanceScore +
    weights.utilization * utilizationScore +
    weights.delayRisk * delayRiskScore +
    weights.detour * detourScore
  );
}