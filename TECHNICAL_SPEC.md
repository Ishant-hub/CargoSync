# CargoSync — Technical Specification

## Recommended Stack

### Mobile App
Preferred:
- React Native
- Expo
- TypeScript

Alternative if the team chooses Flutter:
- Flutter
- Dart

Use one framework consistently; do not mix.

### Backend
- Node.js
- Express
- TypeScript

### Database
- PostgreSQL
- PostGIS for geographic queries

### Real-time
- WebSockets / Socket.IO

### Maps
- Mapbox or Google Maps
- Use one provider consistently

### AI/ML
- Python
- FastAPI
- scikit-learn / XGBoost depending on model performance

### Deployment
- Mobile build: Expo EAS / native app stores
- Backend: Render/Railway initially
- Database: Supabase/Neon/Railway PostgreSQL
- AI service: Render/Railway
- Source control: GitHub

## Architecture

Mobile App
  ↓
REST API / WebSocket
  ↓
Node.js Backend
  ├── Auth
  ├── Users/Roles
  ├── Shipments
  ├── Trucks
  ├── Tracking
  ├── Optimization
  ├── Notifications
  └── Analytics
       ↓
PostgreSQL + PostGIS

Optimization Service
  ├── Compatibility
  ├── Capacity
  ├── Consolidation
  ├── Route planning
  ├── Re-optimization
  └── Return-load search

AI Service
  └── ETA / Delay prediction

## Core API Groups
- /auth
- /users
- /shipments
- /trucks
- /drivers
- /routes
- /tracking
- /optimization
- /consolidation
- /disruptions
- /analytics
- /notifications

## Important Data Models

User:
id, name, email, role, phone

Truck:
id, registrationNumber, type, maxCapacity, currentLoad, status, driverId, currentLocation

Shipment:
id, shipperId, pickup, destination, weight, volume, cargoType, pickupWindow, deliveryDeadline, priority, status

Trip:
id, truckId, shipmentIds, route, plannedEta, actualEta, status

TrackingEvent:
id, truckId/shipmentId, latitude, longitude, timestamp, eventType

OptimizationRun:
id, tripId, inputSnapshot, recommendation, cost, distance, eta, utilization, createdAt

Disruption:
id, type, affectedTripId, severity, timestamp, status

## Core Logic

### Compatibility
A shipment can be consolidated only if:
- capacity remains sufficient
- cargo constraints are compatible
- route overlap is acceptable
- pickup timing is feasible
- delivery deadline remains feasible
- detour remains within configured limit

### Re-optimization
When a disruption/event arrives:
1. Update state.
2. Find affected trips.
3. Recalculate remaining capacity.
4. Search compatible shipments.
5. recalculate feasible routes.
6. score candidate plans.
7. return best feasible plan.
8. show before/after.
9. require user confirmation for consequential changes.

### Scoring
Candidate plan score can consider:
- cost
- distance
- delay risk
- waiting
- detour
- capacity utilization

Make weights configurable.

## Security
- Password hashing
- JWT or secure session cookies
- Role-based authorization
- Input validation
- API rate limiting
- Secrets in environment variables
- Never expose database credentials to mobile app

## Data for MVP
Use synthetic but realistic logistics data for development/demo.
Use real routing/map data from a maps API.
Store all completed trips so they can become historical training data later.

## Engineering Rules
- Keep optimization logic separate from controllers.
- Keep UI components reusable.
- Validate all API inputs.
- Use typed API contracts.
- Handle loading, error and empty states.
- Write unit tests for compatibility/capacity/re-optimization rules.
- Do not hard-code demo data into UI components.
