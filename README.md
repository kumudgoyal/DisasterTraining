# 🛡️ Real-Time Disaster Management & Emergency Coordination Platform (DMECS)

A production-quality **web-based and mobile-responsive Disaster Management and Emergency Coordination Platform** designed for State Disaster Management Authorities (SDMA), District Administrations (DDMA), Emergency Operations Centres (EOC), NDRF/SDRF response battalions, humanitarian NGOs, volunteers, and citizens.

The platform operationalizes the complete disaster lifecycle:
$$\text{Preparedness} \longrightarrow \text{Training} \longrightarrow \text{Early Warning} \longrightarrow \text{Incident Reporting} \longrightarrow \text{Response} \longrightarrow \text{Resource Coordination} \longrightarrow \text{Damage Assessment} \longrightarrow \text{Recovery} \longrightarrow \text{Analytics}$$

---

## 🎯 Intermediate Project Objective

> **Develop a robust, user-friendly digital platform (web-based + mobile interface) that:**
> - • **Enables real-time data entry and access** for SDMAs, ATIs, and NGOs etc.
> - • **Integrates GIS mapping** to visualize the spread of trainings.
> - • **Offers analytics dashboards** for impact tracking, thematic coverage, and alerts.
> - • **Includes report generation**, user access control, and notifications.
> - • **Can be integrated** with existing NDMA and state-level systems.

---

## 👥 Core Project Team Members

| Member Name | University Roll No | Architectural Role | Core Contributions |
|---|---|---|---|
| **Kumud Goyal** | `23BDA70133` | **Lead Full-Stack Architect & System Coordinator** | Platform architecture, API pipeline design, database modeling, multi-agency data workflows, Vercel/Render deployment |
| **Hardik Manchanda** | `23BIS70002` | **GIS Systems, Real-Time Synchronization & EOC Analytics** | Leaflet GIS interactive map, training spread visualization, Recharts analytics, Socket.IO live sync, State SITREP generator |
| **Nitin Verma** | `23IBD70002` | **Mobile Interface, UI/UX & Responsive Engineering** | Apple SF Pro design system, mobile field data entry interface, GPS capture & offline caching, tactical KPI dashboards |
| **Sahil Kumar** | `23BIS70067` | **RBAC Security, Systems Integration & Audit Engine** | 8-tier RBAC access control, immutable security audit logs, NDMA/SDMA integration schemas, in-browser mock engine parity |

---

## 🌐 Live Services

- **Frontend Application (Vite + React + Tailwind):** [http://localhost:5173](http://localhost:5173)
- **Backend API & Real-Time Engine (Express + Socket.IO):** [http://localhost:3001](http://localhost:3001)
- **API Health Check:** [http://localhost:3001/api/health](http://localhost:3001/api/health)
- **Citizen Public Portal:** [http://localhost:5173/public](http://localhost:5173/public)
- **Public Emergency Reporting:** [http://localhost:5173/public/report](http://localhost:5173/public/report)

---

## 🔑 Demo Login Credentials (With One-Click Sign-In)

The login screen features an **Instant Demo Sign-in** selector that logs in immediately with any role:

| Role | Email | Password | Organization | Responsibilities |
|---|---|---|---|---|
| **Super Admin** | `admin@dmp.gov.in` | `admin123` | Haryana SDMA | State-wide control, full authority, system administration |
| **EOC Operator** | `eoc@dmp.gov.in` | `eoc123` | Haryana SDMA | Real-time incident verification, team dispatch, resource allocation |
| **District Admin** | `district@dmp.gov.in` | `district123` | DDMA Rohtak | District-level disaster coordination, shelter governance, alerts |
| **Field Officer** | `field@dmp.gov.in` | `field123` | NDRF 5th Battalion | Mobile field reporting, GPS incident logging, situation updates |
| **NGO Admin** | `ngo@relief.org` | `ngo123` | Red Cross Haryana | Humanitarian relief, supply distribution, volunteer logistics |
| **Volunteer** | `volunteer@dmp.gov.in` | `volunteer123` | Goonj Relief | Local surveys, community evacuations, shelter headcount |
| **Public Citizen** | `citizen@example.com` | `citizen123` | Citizen | Viewing public alerts, locating shelters, filing distress reports |

---

## 🚀 Key Modules Built & Operational

### 1. Emergency Operations Centre (EOC) Command Dashboard (`/`)
- Real-time aggregated KPIs: Active Disasters, Critical Hazards, Population Affected, Evacuations, Casualties, Injured, Missing Persons, Deployed Strike Teams, and Available Resources.
- Live EOC Activity Feed stream synced over WebSockets / Socket.IO.
- Emergency alerts banner with top-level broadcasts.

### 2. High-Precision GIS Disaster Operations Map (`/map`)
- Built with **Leaflet + OpenStreetMap + CartoDB Dark Matter**.
- Multi-layer interactive toggles:
  - 🔴 **Disaster Incidents:** Visualized by severity with pulsating critical rings, click-to-view popup with affected stats and quick console link.
  - 🏠 **Safe Shelters:** Color-coded by occupancy percentage (Green `<70%`, Orange `70-89%`, Red `≥90%`), live progress bar, food/water/medical indicators.
  - 🛡️ **Response Forces:** NDRF, SDRF, Fire, and Police strike team positions.
  - 📦 **Resource Depots:** Rescue boats, ambulances, generators, and rations.
  - ⚠️ **Alert Warning Zones:** Geospatial circles displaying broadcast radius.
  - 🎓 **Preparedness Footprints:** Disaster mock drill sites.
- Filter by severity, disaster type, and location search with automated fly-to coordinates.

### 3. Multi-Hazard Incident Management (`/incidents`, `/incidents/new`, `/incidents/:id`)
- Supports Flood, Earthquake, Cyclone, Landslide, Fire, Heatwave, Cloudburst, Industrial Accident, Building Collapse, Epidemics, and Road Emergencies.
- **Incident Detail Console (`/incidents/:id`):**
  - Real-time situation chronology & operational log (`POST /api/incidents/:id/updates`).
  - Response team deployment console (`PUT /api/incidents/:id/assign-team`).
  - Logistical asset allocation modal (`POST /api/resources/requests`).
  - Linked damage assessments and mobile field reports.
  - Verification workflow (`Submitted` $\rightarrow$ `Under Verification` $\rightarrow$ `Verified` $\rightarrow$ `Responding` $\rightarrow$ `Contained` $\rightarrow$ `Resolved`).

### 4. Mobile-Optimized Field Reporting with Offline Queue (`/field-report`)
- Designed specifically for smartphone-using field officers and volunteers in low-connectivity areas.
- Automated device GPS coordinate capture (`navigator.geolocation`).
- Offline-first caching: Queues reports in `localStorage` when offline and displays `Online` or `Offline — X reports waiting to sync` pill with one-click synchronization.

### 5. Shelter & Relief Center Management (`/shelters`)
- Facility capacity tracking: Displays **Capacity: 500 | Occupied: 370 | Available: 130** with dynamic color bars.
- Live occupancy counter updater with instant EOC notification when occupancy exceeds 85%.
- Facilities inventory checklist: Food kitchen, potable water, medical post, and power generator.

### 6. Centralized Resource & Asset Allocation (`/resources`)
- Tracks rescue boats, ambulances, emergency food packs, water tankers, heavy cutting equipment, and power generators.
- Real-time allocation workflow: Field requests for boats $\rightarrow$ EOC operator reviews $\rightarrow$ Allocates available boats from depot $\rightarrow$ Updates stock and notifies incident timeline.

### 7. Early Warning & Emergency Broadcasts (`/alerts`)
- Issues targeted alerts with broadcast radius in km (Flood warning, Evacuation order, Highway closure, Cyclone alert).
- Active alerts banner displayed across the top of all console pages.

### 8. Post-Disaster Damage & Needs Assessment (`/damage-assessment`)
- Infrastructure tracking: Roads, bridges, schools, hospitals, power grid, and water mains.
- Financial impact estimation in ₹ Lakhs & Crores with status progression (`Reported` $\rightarrow$ `Verified` $\rightarrow$ `Assigned` $\rightarrow$ `In Progress` $\rightarrow$ `Resolved`).

### 9. Disaster Preparedness, Mock Drills & Community Training (`/training`)
- Tracks disaster mock drills, flood rescue courses, first aid workshops, and volunteer orientations.
- Preparedness analytics: Districts covered, citizen reach, and agency participation.

### 10. Disaster Intelligence & Situation Report (SITREP) (`/analytics`)
- Visual analytics built with **Recharts**:
  - Disaster Frequency by Hazard Type (Bar chart)
  - Severity Breakdown (Pie chart)
  - Infrastructure Economic Loss by Sector (Bar chart)
  - Response Force Deployment Readiness (Donut chart)
- **One-click Official SITREP Generator:** Formats an executive State Emergency Operations Bulletin for print or PDF export.

### 11. Role-Based Access Control (RBAC) & Audit Trail (`/admin/users`, `/admin/audit-log`)
- Granular permissions for 8 distinct roles.
- Immutable security audit log tracking user ID, IP address, timestamp, and transactional payload.

### 12. Citizen Public Emergency Portal (`/public`, `/public/report`)
- Clean public interface without exposing sensitive operational details.
- Public alerts, emergency helpline numbers (112, 1070, 1077, 108, 101), shelter finder, and citizen distress reporting.

---

## 🎬 Complete Demonstration Scenario (Requirement 32)

To test the complete lifecycle:

1. **Sign in as Field Officer:** Click **Instant Demo Sign-in** $\rightarrow$ **Field Officer**.
2. **Submit Incident:** Navigate to **Report Incident** (`/incidents/new`). Click **Auto-Capture Device GPS**, select **Flood**, severity **Critical**, and click **Submit Emergency Incident**.
3. **Switch to EOC Operator:** Open the Role Switcher in the top bar $\rightarrow$ select **EOC Operator**.
4. **Review & Verify:** Open the newly logged incident in the Registry (`/incidents`). Click **Verify Incident** to validate.
5. **Dispatch Rescue Force:** Open the **Deployed Strike Teams** tab, click **Deploy Additional Team**, and assign **NDRF Alpha Team**.
6. **Request & Allocate Boats:** Under **Resource Allocation**, file a request for **3x Rescue Boats**. Switch to the **Resources** page (`/resources`) $\rightarrow$ **Pending Requests** tab $\rightarrow$ click **Allocate Asset** to deploy boats from depot.
7. **Broadcast Emergency Alert:** Navigate to **Alerts & Warnings** (`/alerts`) $\rightarrow$ **Issue Emergency Alert** $\rightarrow$ Broadcast evacuation advisory for lowlands.
8. **Update Shelter Occupancy:** Navigate to **Shelters** (`/shelters`), locate **Government School Shelter**, click **Update Count**, and change occupancy to **460**. Note the occupancy bar turns red.
9. **Inspect GIS Operations Map:** Open **Live GIS Map** (`/map`). Toggle layers on/off, observe critical incident pulses, inspect the alert circle radius, and zoom into shelters.
10. **Export Situation Report:** Navigate to **Analytics & SITREP** (`/analytics`) $\rightarrow$ click **Export State SITREP** to print the formal bulletin.

---

## 💻 Tech Stack Summary

- **Frontend:** React 18, Vite 6, Tailwind CSS, React Router v6, Leaflet & React-Leaflet, Recharts, Lucide React, Socket.IO Client.
- **Backend:** Node.js, Express.js, Knex.js, SQLite (`better-sqlite3`), Socket.IO, JWT, bcryptjs, Helmet, Morgan, Multer.
- **Data Layer:** 16 normalized relational tables with full foreign key cascades and seed data contextualized to Indian geography (Haryana, Rohtak, Karnal, Panipat, Hisar).
