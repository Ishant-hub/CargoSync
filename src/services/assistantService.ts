import { UserRole } from '../types';

export interface AssistantMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actionButton?: {
    label: string;
    actionType: 'navigate' | 'trigger_simulation' | 'update_status' | 'view_details';
    payload?: any;
  };
}

export function getQuickSuggestionsForRole(role: UserRole): string[] {
  switch (role) {
    case 'driver':
      return [
        "What's my next pickup stop?",
        "How much payload capacity is left?",
        "Mark consignment CS-882 delivered",
        "Check return load opportunities",
      ];
    case 'shipper':
      return [
        "When will consignment CS-104 arrive?",
        "Can I add 300kg cargo to TRK-12?",
        "Show consolidation cost savings",
        "Create express consignment request",
      ];
    case 'fleet_ops':
    default:
      return [
        "Show high delay risk trucks today",
        "Simulate TRK-27 breakdown recovery",
        "What is total fleet capacity utilization?",
        "Consolidate partial loads on Delhi corridor",
      ];
  }
}

export function queryAssistant(role: UserRole, userQuery: string): AssistantMessage {
  const queryLower = userQuery.toLowerCase();
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const id = 'msg_' + Date.now();

  // DRIVER RESPONSES
  if (role === 'driver') {
    if (queryLower.includes('pickup') || queryLower.includes('next stop')) {
      return {
        id,
        sender: 'assistant',
        text: '📍 **Next Pickup Stop**: Hub Alpha (Sanjay Gandhi Transport Nagar, Delhi).\n\n• **Consignment**: CS-882 (2.4 Tonnes - Industrial Auto Parts)\n• **Scheduled Arrival**: 11:30 AM (In 22 mins)\n• **Dock Number**: Dock #4\n• **Contact**: Gate Manager +91 98765 43210',
        timestamp,
        actionButton: {
          label: 'Navigate to Hub Alpha',
          actionType: 'navigate',
          payload: { screen: 'DriverRoute' },
        },
      };
    }

    if (queryLower.includes('capacity') || queryLower.includes('payload') || queryLower.includes('remaining')) {
      return {
        id,
        sender: 'assistant',
        text: '⚖️ **Vehicle Load Status (TRK-27)**:\n\n• **Max Capacity**: 10.0 Tonnes\n• **Current Load**: 7.6 Tonnes (76% full)\n• **Remaining Capacity**: **2.4 Tonnes available**\n\n💡 *Tip: 2 compatible LTL packages detected along your return route back from Chandigarh.*',
        timestamp,
        actionButton: {
          label: 'View Cargo Manifest',
          actionType: 'navigate',
          payload: { screen: 'DriverShipments' },
        },
      };
    }

    if (queryLower.includes('delivered') || queryLower.includes('mark') || queryLower.includes('cs-882')) {
      return {
        id,
        sender: 'assistant',
        text: '✅ **Status Updated!**\nConsignment **CS-882** has been marked as **DELIVERED**.\n\n• **Timestamp**: ' + timestamp + '\n• **Digital Signature**: Captured\n• **Updated Vehicle Load**: 5.2 Tonnes remaining on board.\n• **Next Action**: Proceed to Drop #2 (Jaipur Industrial Area).',
        timestamp,
        actionButton: {
          label: 'Next Stop Details',
          actionType: 'navigate',
          payload: { screen: 'DriverRoute' },
        },
      };
    }

    if (queryLower.includes('return') || queryLower.includes('opportunity')) {
      return {
        id,
        sender: 'assistant',
        text: '🔄 **Return-Load Match Found!**\n\n• **Origin**: Jaipur Freight Depot\n• **Destination**: Gurgaon Logistics Park (En-route)\n• **Weight**: 1.8 Tonnes (Compatible)\n• **Estimated Revenue**: ₹4,200 (+32% trip margin)\n• **Detour**: Only 4.2 km off your primary highway.',
        timestamp,
        actionButton: {
          label: 'Accept Return Load',
          actionType: 'update_status',
          payload: { action: 'accept_return_load' },
        },
      };
    }
  }

  // SHIPPER RESPONSES
  if (role === 'shipper') {
    if (queryLower.includes('when') || queryLower.includes('arrive') || queryLower.includes('cs-104') || queryLower.includes('eta')) {
      return {
        id,
        sender: 'assistant',
        text: '🚛 **Consignment CS-104 Live Tracking**:\n\n• **Assigned Vehicle**: TRK-12 (Tata Signa 2823)\n• **Current Location**: Highway KM 184 (Near Kotputli)\n• **Predicted ETA**: Today at **14:45 PM**\n• **Delay Risk**: Low (12% probability)\n• **Weather/Traffic**: Clear highway corridor.',
        timestamp,
        actionButton: {
          label: 'View Live Map & ETA',
          actionType: 'navigate',
          payload: { screen: 'ShipperMap' },
        },
      };
    }

    if (queryLower.includes('add') || queryLower.includes('300kg') || queryLower.includes('capacity')) {
      return {
        id,
        sender: 'assistant',
        text: '✅ **Capacity Inspection Success!**\n\nYes, **TRK-12** currently has **2.4 Tonnes** of remaining available capacity.\n\nAdding **300 kg** of cargo will raise vehicle utilization from 76% to 79%. No delay impact on existing delivery deadlines.',
        timestamp,
        actionButton: {
          label: 'Add Cargo to Consignment',
          actionType: 'navigate',
          payload: { screen: 'ShipperShipments' },
        },
      };
    }

    if (queryLower.includes('saving') || queryLower.includes('consolidation') || queryLower.includes('cost')) {
      return {
        id,
        sender: 'assistant',
        text: '💰 **CargoSync Consolidation Savings Summary**:\n\n• **Consignments Bundled**: 3 partial shipments\n• **Standalone Direct Cost**: ₹18,500\n• **Consolidated Shared Cost**: ₹14,250\n• **Net Saving**: **₹4,250 (23% discount)**\n• **CO2 Reduction**: 42 kg carbon emissions saved',
        timestamp,
        actionButton: {
          label: 'Review Consolidation Details',
          actionType: 'navigate',
          payload: { screen: 'ShipperOptimize' },
        },
      };
    }
  }

  // FLEET / OPS RESPONSES
  if (queryLower.includes('breakdown') || queryLower.includes('trk-27') || queryLower.includes('simulate')) {
    return {
      id,
      sender: 'assistant',
      text: '⚠️ **Simulating TRK-27 Breakdown Protocol**:\n\n• **Location**: Delhi-Jaipur Highway KM 142\n• **Affected Cargo**: Consignment CS-882 (2.4T)\n• **Auto-Re-Route Recommendation**: Re-assign cargo to TRK-14 (Eicher 3019 - 3.2T free).\n• **Estimated Time Saved**: 40 mins vs waiting for roadside repair.\n• **Net Cost Delta**: -₹2,800',
      timestamp,
      actionButton: {
        label: 'Run What-If Simulation',
        actionType: 'trigger_simulation',
        payload: { scenario: 'truck_breakdown' },
      },
    };
  }

  if (queryLower.includes('delay') || queryLower.includes('risk') || queryLower.includes('high')) {
    return {
      id,
      sender: 'assistant',
      text: '📊 **High Risk Vehicles (AI Predictive Model)**:\n\n1. **TRK-08** (Delhi → Mumbai) — 78% Delay Probability (+45 min toll bottleneck)\n2. **TRK-22** (Pune → Goa) — 55% Delay Probability (Heavy rainfall)\n\n💡 *Action*: Re-route TRK-08 via Western Express Corridor to maintain 98% on-time performance.',
      timestamp,
      actionButton: {
        label: 'Execute Re-Route Plan',
        actionType: 'trigger_simulation',
        payload: { scenario: 'deadline_acceleration' },
      },
    };
  }

  if (queryLower.includes('fleet') || queryLower.includes('utilization')) {
    return {
      id,
      sender: 'assistant',
      text: '📈 **Fleet Real-Time Operations Summary**:\n\n• **Active Trucks on Highway**: 18 / 28 vehicles\n• **Average Capacity Utilization**: **78.4%** (+14% vs un-optimized baseline)\n• **Active Consignments**: 42 orders in transit\n• **On-Time Delivery Rate**: 96.2%',
      timestamp,
      actionButton: {
        label: 'View Telematics Board',
        actionType: 'navigate',
        payload: { screen: 'FleetTrucks' },
      },
    };
  }

  // Default fallback answer
  return {
    id,
    sender: 'assistant',
    text: `⚡ **CargoSync AI Assistant**:\nI parsed your request regarding "${userQuery}".\n\nOur dynamic logistics optimization engine continuously balances truck payload capacity, delivery timelines, traffic telemetry, and cost efficiency.\n\nSelect a quick action below or ask about specific trucks, consignments, or routing options.`,
    timestamp,
    actionButton: {
      label: 'Open Optimizer Hub',
      actionType: 'navigate',
      payload: { screen: 'FleetOptimize' },
    },
  };
}
