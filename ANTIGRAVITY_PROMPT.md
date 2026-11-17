# ANTIGRAVITY BUILD PROMPT — CargoSync

You are building **CargoSync**, a production-quality mobile-first logistics application.

Read these files first:
- PRD.md
- DESIGN.md
- TECHNICAL_SPEC.md

## Your task
Build the application incrementally from the specifications.

Do NOT create a generic logistics template. The product must clearly communicate its unique concept:

> CargoSync continuously re-optimizes the remaining freight journey as capacity, shipments, routes and real-world conditions change.

## First milestone
Implement the following before expanding the feature set:

1. Project setup
2. Theme system
3. Splash screen
4. Login screen
5. Sign-up screen
6. Role selection
7. Role-based navigation
8. Role-specific home dashboards
9. Reusable design system/components
10. Mock data layer that is structured to be replaced by APIs

## Roles
- Shipper
- Driver
- Fleet / Operations

Do not show Admin as a normal role.

## Design requirements
- Default theme is LIGHT.
- Provide Light / Dark / System in Settings.
- Premium minimal logistics design.
- Use subtle glass/layered surfaces only where useful.
- Do not make the entire app glassmorphic.
- No neon AI aesthetic.
- No excessive gradients.
- No clutter.
- Use deep navy/charcoal, off-white/light gray surfaces and restrained orange/amber accents.
- Strong typography and spacing.
- Make it look human-designed and production-ready.

## Login
Create a polished login screen with:
- CargoSync branding
- email/phone
- password
- login
- forgot password
- sign up
- clean logistics-oriented visual element

## Role selection
After successful login, show three polished role cards:
1. Shipper
2. Driver
3. Fleet / Operations

Selecting a role routes to its dashboard.

## Dashboards

### Shipper
Show:
- active shipments
- in-transit count
- delivered count
- live shipment map
- current shipment
- ETA
- consolidation opportunity
- quick actions

### Driver
Show:
- today's trip
- next pickup
- next delivery
- current load
- remaining capacity
- route
- alerts
- quick status actions

### Fleet / Operations
Show:
- active trucks
- active shipments
- utilization
- delayed trips
- live map
- optimization opportunities
- alerts
- re-optimization action

## Signature feature
Create a strong “Optimization Opportunity” component.

Example:
TRK-27
2.4T available
3 compatible shipments nearby
Potential saving ₹1,250
Utilization 76% → 91%

Button:
**Review Consolidation**

## Signature re-optimization flow
Create a prototype flow where:
- a disruption is detected;
- affected shipments are shown;
- the old plan and new plan are compared;
- new ETA/cost/distance/utilization are displayed;
- user can review/apply the new plan.

This should visually demonstrate the project's USP.

## Important implementation rules
- Do not fake functionality by putting everything into one screen.
- Use proper navigation.
- Use reusable components.
- Use typed models.
- Keep data separate from UI.
- Create realistic mock data.
- Handle loading, empty and error states.
- Do not put API keys in the client.
- Keep optimization logic in a separate service/module.
- Keep the architecture ready for PostgreSQL/PostGIS and a Node.js backend.
- Do not implement an LLM chatbot as the core intelligence.
- AI is a later service for ETA/delay prediction.

## Build order
1. Foundation + theme
2. Authentication UI
3. Role selection
4. Navigation
5. Shipper dashboard
6. Driver dashboard
7. Fleet/Operations dashboard
8. Shipment screens
9. Fleet screens
10. Map/tracking
11. Consolidation
12. Optimization
13. Re-optimization/disruption flow
14. Analytics
15. AI ETA service integration
16. Optional assistants
17. Testing and polish

## Quality bar
The final result should look like a real logistics product that could be shown to a company or used as a serious college project.

Before considering a screen complete, check:
- Is hierarchy clear?
- Is the main action obvious?
- Is the UI readable in both themes?
- Does the screen communicate a real logistics workflow?
- Is there unnecessary decoration?
- Does it feel consistent with the CargoSync design system?

Do not stop at placeholder boxes. Build polished screens and realistic interactions.
