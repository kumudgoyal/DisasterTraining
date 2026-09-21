# Real-Time Monitoring System for Disaster Management Trainings

A comprehensive platform for monitoring, managing, and analyzing disaster management training programs across India. Supports SDMAs, ATIs, NGOs, training organizers, reviewers, and NDMA/state-level administrators.

## Architecture

```
├── apps/
│   └── web/              # Next.js 16 frontend (App Router, React 19)
├── services/
│   └── api/              # Express.js backend (TypeScript, Prisma ORM)
├── packages/
│   ├── types/            # Shared TypeScript types (@disaster/types)
│   ├── validation/       # Shared Zod schemas (@disaster/validation)
│   └── config/           # Shared constants & permissions (@disaster/config)
├── database/
│   └── scripts/          # PostGIS initialization SQL
└── docker-compose.yml    # PostgreSQL + PostGIS + pgAdmin
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, Tailwind CSS v4, shadcn/ui, TanStack Query, Recharts, React Leaflet |
| Backend | Express.js, TypeScript, Socket.IO, node-cron |
| Database | PostgreSQL 15 + PostGIS 3.4 |
| ORM | Prisma 5 |
| Auth | JWT (access + refresh tokens), Argon2 password hashing |
| Reports | PDFKit, ExcelJS |
| Maps | OpenStreetMap tiles, Leaflet, MarkerCluster |
| Monorepo | Turborepo, pnpm workspaces |

## Prerequisites

- **Node.js** >= 20
- **pnpm** >= 9
- **Docker** & Docker Compose (for PostgreSQL + PostGIS)

## Quick Start

### 1. Clone & Install

```bash
git clone <repository-url>
cd DisasterTraining
pnpm install
```

### 2. Environment Variables

```bash
# Copy the example env file
cp .env.example .env

# IMPORTANT: Generate secure JWT secrets
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# Copy the output to JWT_SECRET and JWT_REFRESH_SECRET in .env

# Create frontend env file
cp .env.example apps/web/.env.local
# Keep only the NEXT_PUBLIC_* variables in apps/web/.env.local
```

### 3. Start Database

```bash
docker-compose up -d postgres

# Optional: Start pgAdmin for database inspection
docker-compose --profile tools up -d pgadmin
# Access pgAdmin at http://localhost:5050 (admin@example.com / admin)
```

### 4. Run Database Migrations

```bash
# Generate Prisma client
pnpm --filter api npx prisma generate

# Run migrations
pnpm --filter api npx prisma migrate dev
```

### 5. Seed Database (Optional)

```bash
pnpm db:seed
```

**Seed credentials:**
| Email | Password | Role |
|-------|----------|------|
| admin@disaster-training.gov.in | Password123! | SUPER_ADMIN |
| ndma@disaster-training.gov.in | Password123! | NDMA_ADMIN |
| sdma.mh@gov.in | Password123! | SDMA |
| reviewer@disaster-training.gov.in | Password123! | REVIEWER |
| viewer@disaster-training.gov.in | Password123! | NDMA_VIEWER |

### 6. Start Development

```bash
pnpm dev
```

- **Frontend**: http://localhost:3000
- **API**: http://localhost:4000/api/v1
- **Health check**: http://localhost:4000/health

## Roles & Permissions

| Role | Description | Key Permissions |
|------|-------------|----------------|
| SUPER_ADMIN | System administrator | All permissions |
| NDMA_ADMIN | NDMA administrator | Manage users, organizations, approve trainings |
| SDMA | SDMA administrator | Manage org trainings, submit for review |
| ATI | ATI administrator | Manage org trainings, submit for review |
| NGO | NGO administrator | Manage org trainings, submit for review |
| TRAINER | Training facilitator | View trainings, manage attendance, submit assessments |
| REVIEWER | Training reviewer | View all trainings, approve/reject submissions |
| DATA_ENTRY_OPERATOR | Data entry staff | Manage trainings, participants, attendance |
| NDMA_VIEWER | Read-only NDMA access | View all trainings, analytics, reports |

## Training Lifecycle

```
DRAFT → SUBMITTED → UNDER_REVIEW → APPROVED → SCHEDULED → IN_PROGRESS → COMPLETED
                  ↘ REJECTED → DRAFT (resubmit)
Any active status → CANCELLED → DRAFT (restart)
```

## API Documentation

Base URL: `http://localhost:4000/api/v1`

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/login | Login with email/password |
| POST | /auth/register | Register user (admin only) |
| POST | /auth/refresh | Refresh access token |
| GET | /auth/me | Get current user profile |
| POST | /auth/change-password | Change password |

### Trainings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /trainings | List trainings (paginated, filterable) |
| POST | /trainings | Create training |
| GET | /trainings/:id | Get training details |
| PUT | /trainings/:id | Update training |
| POST | /trainings/:id/submit | Submit for review |
| POST | /trainings/:id/review | Approve/reject |
| POST | /trainings/:id/complete | Mark completed |

### Analytics & GIS
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /analytics/dashboard | Dashboard statistics |
| GET | /analytics/trends | Monthly training trends |
| GET | /analytics/coverage/states | State-wise coverage |
| GET | /gis/trainings | Training map markers |
| GET | /gis/nearby | Nearby trainings (PostGIS) |
| GET | /gis/heatmap | Training density heatmap |

### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /reports/generate | Generate PDF/Excel/CSV report |
| GET | /reports | List generated reports |
| GET | /reports/:id/download | Download report file |

### Reference Data
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /reference/states | List states |
| GET | /reference/states/:id/districts | List districts |
| GET | /reference/training-types | List training types |
| GET | /reference/training-themes | List training themes |

## GIS / PostGIS

Training locations are stored as PostGIS `geography(Point, 4326)` types. District centroids use `geometry(Point, 4326)`.

Spatial queries supported:
- Trainings within a radius (`ST_DWithin`)
- Trainings within a bounding box
- Geographic coverage by state/district
- Training density heatmap

## Integration Architecture

The platform provides a REST API integration layer for connecting with NDMA and state-level systems.

**Status**: Integration adapters are built but require external API credentials/endpoints to be configured.

To configure an integration:
1. Go to Admin → Integrations
2. Add integration source (name, API URL)
3. Add credentials
4. Trigger sync

Environment variables for pre-configured integrations:
```
NDMA_API_URL=      # NDMA system endpoint
NDMA_API_KEY=      # API key for NDMA
STATE_API_URL=     # State system endpoint  
STATE_API_KEY=     # API key for state system
```

## Production Build

```bash
pnpm build

# Start production
pnpm start
```

## Project Structure (API)

```
services/api/src/
├── config/           # Environment, database, CORS
├── middleware/        # Auth, RBAC, validation, audit, error handling
├── routes/           # Express route handlers (18 route files)
├── services/         # Business logic (9 service files)
├── utils/            # Logger, errors, pagination, Socket.IO
└── server.ts         # Entry point
```
