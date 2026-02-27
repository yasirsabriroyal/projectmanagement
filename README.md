# ConstructFlow

A production-grade ERP system designed to synchronize construction field execution with office accounting.

## Overview

ConstructFlow is a comprehensive Enterprise Resource Planning (ERP) solution built specifically for the construction industry. It bridges the gap between field operations and office accounting, ensuring seamless data flow and financial integrity across the organization.

## Architecture

This repository employs a **multi-tenant architecture** with a strong focus on:
- **Financial Integrity**: Robust validation and audit trails for all financial transactions
- **Monotonic State Machines**: Reliable state transitions for projects and tasks
- **Domain-Driven Design**: Clean separation of business domains

## Repository Structure

```
/api      # Domain Services (Finance, Execution, Auth) — Express.js
/web      # Mobile-first React/Next.js Frontend
/workers  # Async jobs (SMS, Exports, Retries)
/infra    # DB Migrations (Postgres) and Terraform
/docs     # OpenAPI specs and ER diagrams
```

## 🚀 Getting Started

### Option 1 — Docker Compose (Recommended)

Requires: [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)

```bash
docker compose up --build
```

- **Web UI** → http://localhost:3000
- **API**    → http://localhost:3001

---

### Option 2 — Run Locally (without Docker)

Requires: [Node.js 20+](https://nodejs.org/)

**1. Start the API server**

```bash
cd api
npm install
npm start
# API running at http://localhost:3001
```

**2. Start the web frontend** (in a new terminal)

```bash
cd web
npm install
npm run dev
# UI running at http://localhost:3000
```

**3. Open your browser**

Navigate to **http://localhost:3000** to see the ConstructFlow ERP dashboard.

---

### Default Credentials (demo)

| Email | Password | Role |
|-------|----------|------|
| `admin@constructflow.com` | `password` | Admin |
| `manager@constructflow.com` | `password` | Manager |

---

## Technology Stack

- **Frontend**: React, Next.js 14, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL *(migrations in `/infra/migrations`)*
- **Infrastructure**: Terraform *(configs in `/infra/terraform`)*
- **Containerization**: Docker / Docker Compose

## Key Features

- ✅ Multi-tenant architecture with complete data isolation
- ✅ Real-time synchronization between field and office
- ✅ Mobile-optimized interface for field workers
- ✅ Comprehensive financial management (invoices, payments)
- ✅ Project and task tracking with monotonic state machines
- ✅ Audit trails for compliance
- ✅ RESTful APIs matching OpenAPI specifications in `/docs/openapi`

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/v1/auth/login` | Authenticate user |
| `GET`  | `/v1/projects` | List projects |
| `POST` | `/v1/projects` | Create project |
| `GET`  | `/v1/projects/:id/tasks` | List tasks |
| `PUT`  | `/v1/tasks/:id/progress` | Update task progress |
| `GET`  | `/v1/invoices` | List invoices |
| `POST` | `/v1/invoices` | Create invoice |
| `GET`  | `/v1/payments` | List payments |
| `POST` | `/v1/payments` | Record payment |
| `GET`  | `/health` | Health check |

## Component Documentation

- [API Documentation →](./api/README.md)
- [Web Frontend Documentation →](./web/README.md)
- [Infrastructure Documentation →](./infra/README.md)

## Contributing

[Contributing guidelines to be added]

## License

[License information to be added]
