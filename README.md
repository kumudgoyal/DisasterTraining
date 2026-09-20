# Real-Time Monitoring System for Disaster Management Trainings

**Subtitle**: A Web and Mobile Platform for Real-Time Data Entry, GIS Visualization, and Analytics-Driven Impact Tracking.

> **Note**: This is an academic prototype. Full production integration with NDMA/state government systems is out of scope. However, the architecture and APIs are designed to be integration-ready.

## Overview
The project addresses a fragmented disaster-management training reporting process involving State Disaster Management Authorities (SDMAs), Administrative Training Institutes (ATIs), NGOs, Reviewers / NDMA-level stakeholders, and Administrators.

## Architecture
The system follows a five-layer, monorepo architecture:
- Layer 1: Presentation (Next.js, Expo)
- Layer 2: Application / API (Express.js)
- Layer 3: Intelligence (PostGIS, Analytics, Alerts)
- Layer 4: Data (PostgreSQL, Audit Logs)
- Layer 5: Integration (Integration API Gateway)

## Tech Stack
- Frontend: Next.js (App Router), Tailwind CSS, shadcn/ui, TanStack Query, Recharts, React Leaflet.
- Mobile: React Native (Expo).
- Backend: Express.js, TypeScript, Socket.IO, Prisma ORM.
- Database: PostgreSQL with PostGIS.

## Development Setup
Copy `.env.example` to `.env` in the root directory and configure as needed.

```bash
# 1. Install dependencies
pnpm install

# 2. Start PostgreSQL + PostGIS via Docker
docker-compose up -d postgres

# 3. Enable PostGIS extension
psql $DATABASE_URL -c "CREATE EXTENSION IF NOT EXISTS postgis;"

# 4. Run database migrations
pnpm db:migrate

# 5. Seed database with demo data
pnpm db:seed

# 6. Start all services
pnpm dev
```
