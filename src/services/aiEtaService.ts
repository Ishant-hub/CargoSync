import { Shipment, Trip, Truck } from '../types';

export interface EtaPrediction {
  shipmentId: string;
  tripId?: string;
  originalEta: string;
  predictedEta: string;
  delayMinutes: number;
  delayProbability: number; // 0-100%
  confidenceScore: number; // 0-100%
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  contributingFactors: {
    factor: string;
    impactMinutes: number;
    description: string;
    icon: string;
  }[];
  mitigationRecommendation: string;
  confidenceInterval: {
    earliest: string;
    latest: string;
  };
}

/**
 * AI ML Model Simulation for ETA & Delay Risk Prediction
 * Evaluates real-time parameters: vehicle speed, route congestion, weather, stop density & historical hub delays.
 */
export function predictShipmentEta(shipment: Shipment, truck?: Truck): EtaPrediction {
  const isDelayed = shipment.status === 'in_transit' && Math.random() > 0.4;
  const baseMinutes = 180; // default 3 hours
  const addedDelayMinutes = isDelayed ? Math.floor(25 + Math.random() * 45) : Math.floor(5 + Math.random() * 15);
  
  const originalDate = new Date(shipment.deliveryDeadline || Date.now() + 3600 * 1000 * 4);
  const predictedDate = new Date(originalDate.getTime() + addedDelayMinutes * 60 * 1000);
  const earliestDate = new Date(predictedDate.getTime() - 15 * 60 * 1000);
  const latestDate = new Date(predictedDate.getTime() + 25 * 60 * 1000);

  const delayProb = isDelayed ? Math.min(94, 65 + addedDelayMinutes) : Math.floor(12 + Math.random() * 18);
  const risk: 'low' | 'medium' | 'high' | 'critical' = 
    delayProb > 75 ? 'critical' : delayProb > 50 ? 'high' : delayProb > 25 ? 'medium' : 'low';

  const factors = [
    {
      factor: 'Corridor Traffic Bottleneck',
      impactMinutes: isDelayed ? Math.floor(addedDelayMinutes * 0.55) : 5,
      description: 'Highway congestion near toll plaza (+12 km/h reduction)',
      icon: 'car-sport-outline',
    },
    {
      factor: 'Loading Dock Turnaround Time',
      impactMinutes: isDelayed ? Math.floor(addedDelayMinutes * 0.3) : 3,
      description: 'Historical wait time at intermediate hub B',
      icon: 'time-outline',
    },
    {
      factor: 'Weather Conditions',
      impactMinutes: isDelayed ? Math.floor(addedDelayMinutes * 0.15) : 2,
      description: 'Light rain along highway corridor',
      icon: 'cloud-rain-outline',
    },
  ];

  let recommendation = 'On schedule. Maintain current route speed.';
  if (risk === 'critical' || risk === 'high') {
    recommendation = 'Suggest triggering dynamic re-route via Express Bypass Corridor to avoid 40-minute toll congestion.';
  } else if (risk === 'medium') {
    recommendation = 'Pre-notify receiver dock manager for flexible 30-minute unloading window.';
  }

  return {
    shipmentId: shipment.id,
    originalEta: originalDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    predictedEta: predictedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    delayMinutes: addedDelayMinutes,
    delayProbability: delayProb,
    confidenceScore: 92,
    riskLevel: risk,
    contributingFactors: factors,
    mitigationRecommendation: recommendation,
    confidenceInterval: {
      earliest: earliestDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      latest: latestDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  };
}

/**
 * Predict overall trip delay risk for fleet manager dashboard
 */
export function predictTripDelayRisk(trip: Trip): {
  tripId: string;
  delayRiskScore: number;
  estimatedDelayMins: number;
  primaryRiskReason: string;
  status: 'on_track' | 'at_risk' | 'delayed';
} {
  const isHighRisk = trip.status === 'delayed' || trip.distanceKm > 300;
  const score = isHighRisk ? Math.floor(65 + Math.random() * 25) : Math.floor(10 + Math.random() * 25);
  
  return {
    tripId: trip.id,
    delayRiskScore: score,
    estimatedDelayMins: isHighRisk ? Math.floor(35 + Math.random() * 30) : 5,
    primaryRiskReason: isHighRisk ? 'Heavy freight corridor slowdown near Hub 3' : 'Normal traffic flow',
    status: score > 60 ? 'delayed' : score > 35 ? 'at_risk' : 'on_track',
  };
}
