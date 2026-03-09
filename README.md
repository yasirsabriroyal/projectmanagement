# ConstructFlow

A production-grade ERP system designed to synchronize construction field execution with office accounting.

## Quick Start

```bash
# 1. Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 2. Start all services (Postgres + Backend + Frontend)
docker-compose up --build

# 3. The seed runs automatically (RUN_SEED=true by default) and creates:
#    - Admin user: admin@constructflow.com / Admin123!
#    - Default roles, permissions, and organization
#    Set RUN_SEED=false to disable seeding (e.g. in production).

# 4. Visit http://localhost:3000
# Login: admin@constructflow.com / Admin123!
```

### Bootstrapping a fresh admin (alternative to seed)

If you prefer to skip seeding and create the first admin manually:

```bash
# On a fresh DB (no users), no secret header needed:
curl -X POST http://localhost:4000/api/v1/auth/bootstrap-admin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin123!","firstName":"Admin","lastName":"User"}'
```

See [docs/DEVELOPMENT.md](./docs/DEVELOPMENT.md) for full details.

## Overview

ConstructFlow is a comprehensive Enterprise Resource Planning (ERP) solution built specifically for the construction industry. It bridges the gap between field operations and office accounting, ensuring seamless data flow and financial integrity across the organization.

## Architecture

This repository employs a **multi-tenant architecture** with a strong focus on:
- **Financial Integrity**: Robust validation and audit trails for all financial transactions
- **Monotonic State Machines**: Reliable state transitions for projects and tasks
- **Domain-Driven Design**: Clean separation of business domains

## Repository Structure

```
/backend  # Node.js + TypeScript + Express + Prisma API
/frontend # Next.js + TypeScript Frontend
/docs     # OpenAPI specs, ER diagrams, development guide
/api      # Domain service READMEs (Finance, Execution, Auth)
/infra    # DB Migrations (Postgres) and Terraform
/workers  # Async jobs (SMS, Exports, Retries)
```

## Technology Stack

- **Backend**: Node.js, TypeScript, Express, Prisma ORM
- **Frontend**: Next.js 14, TypeScript, React
- **Database**: PostgreSQL 16
- **Authentication**: JWT (access + refresh tokens), bcrypt
- **Validation**: Zod
- **Logging**: Winston (structured JSON in production)
- **Infrastructure**: Docker Compose, Terraform

## Key Features

- ✅ Multi-tenant architecture with organization scoping
- ✅ JWT authentication with refresh token rotation
- ✅ Role-Based Access Control (RBAC) — Admin, PM, Accountant, Ops
- ✅ Idempotency key support for safe POST retries
- ✅ Audit logging for all sensitive operations
- ✅ Project management (CRUD + memberships)
- ✅ Structured logging with Winston
- ✅ Docker Compose for one-command local setup

## Documentation

- [Development Guide](./docs/DEVELOPMENT.md) — Setup, env vars, migrations, seeding, RBAC
- [API Documentation](./api/README.md)
- [Infrastructure](./infra/README.md)

## Default Credentials (after seed)

| Field | Value |
|-------|-------|
| Email | `admin@constructflow.com` |
| Password | `Admin123!` |

## API Health Check

```bash
curl http://localhost:4000/api/v1/health
# {"status":"ok","db":"connected","timestamp":"..."}
```

## Contributing

See [docs/DEVELOPMENT.md](./docs/DEVELOPMENT.md) for development setup instructions.

## License

[License information to be added]
