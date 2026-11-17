# CargoSync — Product Requirements Document (PRD)

## 1. Product
**CargoSync** is a mobile-first logistics platform for dynamic freight consolidation and continuous trip re-optimization.

The core idea is not just to match a shipment with a truck. CargoSync continuously manages available truck capacity, compatible shipments, routes, deadlines and disruptions, then proposes a better plan when conditions change.

## 2. Problem
Freight trucks often travel with unused capacity or return empty. A plan created before departure can also become inefficient when shipments are cancelled, new shipments appear, delivery deadlines change, pickups are delayed, or a truck becomes unavailable.

CargoSync solves this by:
- consolidating compatible partial loads;
- using available truck capacity;
- optimizing pickup/delivery order;
- finding return loads;
- re-optimizing when conditions change;
- predicting ETA/delay risk;
- showing the result through a clear operational mobile app.

## 3. Target Users

### Shipper
- Create and manage shipments
- Track shipments
- View ETA and delivery status
- Check whether extra cargo can be added
- See consolidation opportunities
- Check cost and feasibility

### Driver
- View assigned trip
- See next pickup/delivery
- View current load and remaining capacity
- Follow optimized route
- Update pickup/delivery status
- Report disruptions
- View return-load opportunities

### Fleet / Operations Manager
- Monitor fleet and shipments
- See truck utilization
- Run optimization
- Review consolidation opportunities
- Re-plan after disruptions
- Manage return loads
- View analytics and what-if scenarios

## 4. Core Product Flow

Splash → Login/Sign Up → Role Selection → Role-specific Dashboard

After login, the app should feel like one consistent product while showing different tools based on the role.

## 5. Core Features

### A. Authentication
- Login
- Sign up
- Forgot password
- Secure session
- Role selection after authentication

### B. Role Selection
Three primary roles:
1. Shipper
2. Driver
3. Fleet / Operations

Do not expose Admin as a normal customer role in the main flow.

### C. Shipment Management
Shipment fields:
- Shipment ID
- Pickup
- Destination
- Weight
- Volume
- Cargo type
- Pickup window
- Delivery deadline
- Priority
- Status

### D. Fleet Management
Truck fields:
- Truck ID
- Truck type
- Maximum capacity
- Current load
- Available capacity
- Driver
- Current location
- Availability
- Current trip

### E. Smart Load Consolidation
Find compatible shipments based on:
- weight
- volume
- route overlap
- pickup proximity
- destination compatibility
- pickup windows
- delivery deadlines
- cargo constraints

### F. Dynamic Re-Optimization
When something changes:
1. Detect change
2. Identify affected shipments/trucks
3. Recalculate feasible options
4. Compare cost, distance, ETA and utilization
5. Produce a new recommended plan
6. Let the operator review/apply it

### G. Route Optimization
Optimize:
- pickup sequence
- delivery sequence
- distance
- cost
- waiting
- deadline compliance
- detour

### H. Return Load Optimization
After delivery, search for compatible shipments near the return route to reduce empty kilometres.

### I. Ship Now vs Wait
Compare immediate dispatch with waiting for a compatible consolidation opportunity.

Show:
- estimated cost
- expected ETA
- waiting time
- utilization
- deadline risk
- recommendation

### J. Disruption Recovery
Handle:
- truck breakdown
- shipment cancellation
- pickup delay
- delivery delay
- truck becoming unavailable
- changed deadline

### K. Real-time Tracking
Show:
- truck location
- route
- current stop
- shipment status
- ETA
- delay indicator

### L. AI/ML Component
Primary AI feature:
**ETA and Delay Prediction**

Inputs can include:
- historical travel time
- route
- time/day
- number of stops
- loading/pickup delays
- historical delay patterns

Output:
- predicted ETA
- delay probability

AI supports the optimization engine; it must not replace deterministic logistics rules.

### M. Assistants (optional / phase 2)
Driver:
- “What’s my next pickup?”
- “How much capacity is left?”
- “Mark shipment 184 delivered.”

Shipper:
- “When will my shipment arrive?”
- “Can I add 200 kg?”
- “Can this reach by Thursday?”

The assistant must call backend APIs and return real system data. It must never invent logistics facts.

### N. Analytics
Show:
- fleet utilization
- shipments consolidated
- empty trips avoided
- estimated cost saved
- on-time delivery rate
- average delay
- distance saved
- return-load utilization

### O. What-if Simulation (advanced)
Examples:
- What if truck X breaks down?
- What if shipment Y is cancelled?
- What if a deadline moves earlier?
- What if 20 new shipments arrive?

Compare current vs alternative plan.

## 6. Main Mobile Navigation

### Shipper
Home | Shipments | Map | Optimize | Profile

### Driver
Home | Route | Shipments | Map | Profile

### Fleet/Operations
Overview | Fleet | Optimize | Map | More

## 7. Home Dashboard Direction

The home screen should immediately communicate logistics status.

Example:
- Greeting
- Active shipments
- Trucks on road
- Fleet utilization
- Live map
- Active shipment/trip card
- Optimization opportunity card
- Alerts
- Quick actions

A key CargoSync card:
> **2.4T capacity available on TRK-27**
> 3 compatible shipments nearby
> Potential saving: ₹1,250
> [Review Consolidation]

## 8. Design Direction

### Overall style
**Premium minimal logistics UI with subtle glass/layered elements.**

Do NOT make the entire interface glassmorphic.

Use:
- clean light background by default
- deep navy/charcoal typography
- restrained orange/amber accent
- white cards
- subtle borders
- soft shadows
- medium/large rounded corners
- clear spacing
- strong information hierarchy
- real map-focused layouts
- compact but readable operational cards

### Theme
Default: **Light theme**

Also provide:
- Light
- Dark
- System

Theme selector can live under Profile/Settings.

Dark mode should be a genuine redesign of the same components, not a simple color inversion.

### Visual personality
CargoSync should feel:
- reliable
- operational
- modern
- premium
- calm
- human-designed

Avoid:
- neon AI aesthetics
- excessive gradients
- excessive glass
- giant decorative text
- cluttered dashboards
- generic “AI startup” visuals

## 9. UX Principles
1. One important action per screen should be obvious.
2. Critical logistics status should be visible without deep navigation.
3. Maps should support decisions, not dominate every screen.
4. Use bottom sheets for map details.
5. Confirm destructive actions.
6. Show why an optimization recommendation was made.
7. Never hide capacity, ETA, deadline or cost.
8. Use realistic logistics data in the UI.

## 10. MVP Priority

### Must build
- Authentication
- Role selection
- Role dashboards
- Shipment CRUD
- Truck/fleet CRUD
- Capacity calculation
- Compatibility engine
- Basic consolidation
- Route optimization
- Tracking
- Dynamic re-optimization
- Return-load logic
- Analytics
- Light/dark theme

### Phase 2
- AI ETA/delay model
- Driver assistant
- Shipper assistant
- What-if simulator
- Advanced notifications

## 11. Success Criteria
A user should be able to:
1. Log in.
2. Select/use a role.
3. Create a shipment or manage a truck.
4. See current capacity and route.
5. Find compatible partial loads.
6. Generate an optimized plan.
7. Simulate a disruption.
8. Re-optimize the affected trip.
9. Track the result.
10. Understand the cost/ETA/utilization impact.

## 12. Product USP
> CargoSync continuously re-optimizes the remaining freight journey as capacity, shipments, routes and real-world conditions change.
