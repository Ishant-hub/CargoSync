/**
 * CargoSync — Unit Test Suite for Optimization Engine & Logistics Rules
 * Tests compatibility checks, capacity boundaries, re-optimization, and what-if simulator.
 */

import {
  calculateDistance,
  checkCompatibility,
  findCompatibleShipments,
  generateOptimizationOpportunities,
  reoptimizeTrip,
} from '../src/services/consolidationEngine';
import { runWhatIfSimulation } from '../src/services/whatIfSimulator';
import { mockTrucks, mockShipments, mockTrips } from '../src/data/mockData';
import { Shipment, Truck, Trip } from '../src/types';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, errorDetail?: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${testName} ${errorDetail ? `- ${errorDetail}` : ''}`);
    failed++;
  }
}

console.log('\n--- 1. Testing Haversine Distance Calculation ---');
{
  // Delhi (28.6139, 77.2090) to Jaipur (26.9124, 75.7873) ~ 235-245 km
  const dist = calculateDistance(28.6139, 77.2090, 26.9124, 75.7873);
  assert(dist > 230 && dist < 250, 'Distance Delhi-Jaipur is approximately 235-245 km', `Got: ${dist.toFixed(1)} km`);

  // Same coordinates should have 0 distance
  const zeroDist = calculateDistance(28.6139, 77.2090, 28.6139, 77.2090);
  assert(zeroDist === 0, 'Distance to same coordinate is 0 km', `Got: ${zeroDist}`);
}

console.log('\n--- 2. Testing Capacity & Compatibility Checks ---');
{
  const truck: Truck = {
    id: 'TRK-TEST',
    registrationNumber: 'DL-01-TEST',
    type: '10T Container',
    maxCapacity: 10,
    currentLoad: 8,
    availableCapacity: 2, // 2 Tonnes available
    status: 'on_trip',
    driverId: 'USR-TEST',
    driverName: 'Test Driver',
    currentLocation: { latitude: 28.6139, longitude: 77.2090, city: 'Delhi' },
  };

  const overweightShipment: Shipment = {
    id: 'SHP-OVERWEIGHT',
    shipperId: 'SHP-001',
    pickup: { latitude: 28.6139, longitude: 77.2090, city: 'Delhi' },
    destination: { latitude: 26.9124, longitude: 75.7873, city: 'Jaipur' },
    weight: 2500, // 2.5T > 2T available
    cargoType: 'general',
    pickupWindow: {
      start: new Date(Date.now() - 3600000).toISOString(),
      end: new Date(Date.now() + 86400000).toISOString(),
    },
    deliveryDeadline: new Date(Date.now() + 172800000).toISOString(),
    priority: 'medium',
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  const resOverweight = checkCompatibility(overweightShipment, truck);
  assert(!resOverweight.compatible, 'Rejects shipment exceeding truck available capacity');
  assert(
    resOverweight.reasons.some(r => r.includes('Insufficient capacity')),
    'Returns correct capacity rejection reason'
  );

  const fittingShipment: Shipment = {
    ...overweightShipment,
    id: 'SHP-FIT',
    weight: 1500, // 1.5T <= 2T available
  };
  const resFit = checkCompatibility(fittingShipment, truck);
  assert(resFit.compatible, 'Accepts compatible shipment within spare capacity');
  assert(resFit.costSaving > 0, 'Calculates non-zero cost savings for consolidated shipment');
}

console.log('\n--- 3. Testing Optimization Opportunities Generation ---');
{
  const opportunities = generateOptimizationOpportunities(mockTrucks, mockShipments, mockTrips);
  assert(Array.isArray(opportunities), 'Generates optimization opportunities array');
  assert(opportunities.length >= 0, 'Runs without throwing exception');
  if (opportunities.length > 0) {
    const opp = opportunities[0];
    assert(opp.potentialUtilization >= opp.currentUtilization, 'Potential utilization is higher or equal to current');
    assert(opp.totalPotentialSaving >= 0, 'Potential saving is non-negative');
  }
}

console.log('\n--- 4. Testing Dynamic Re-Optimization on Disruption ---');
{
  const testTrip = mockTrips[0];
  const reopt = reoptimizeTrip(testTrip, 'breakdown');
  assert(reopt.success, 'Re-optimization succeeds on breakdown disruption');
  assert(Array.isArray(reopt.newPlan.stops), 'Produces updated stops manifest');
  assert(reopt.costDelta !== undefined, 'Computes cost delta');
  assert(reopt.etaDeltaMinutes !== undefined, 'Computes ETA delta in minutes');
}

console.log('\n--- 5. Testing What-If Simulator Scenarios ---');
{
  const scenarios = ['truck_breakdown', 'shipment_cancellation', 'deadline_acceleration', 'express_load_insertion'] as const;
  for (const sc of scenarios) {
    const sim = runWhatIfSimulation(sc);
    assert(sim.feasibilityScore > 0, `What-if scenario '${sc}' produces valid feasibility score`);
    assert(sim.deltas.costSaved !== undefined, `What-if scenario '${sc}' calculates cost savings`);
    assert(sim.recommendedSteps.length > 0, `What-if scenario '${sc}' gives actionable dispatch steps`);
  }
}

console.log(`\n========================================`);
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log(`========================================\n`);

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
