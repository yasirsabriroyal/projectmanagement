# ConstructFlow Development Guide

## Prerequisites

- **Node.js** v20+
- **Docker** and **Docker Compose** v2+
- **npm** v10+

## Quick Start (Docker)

The fastest way to get a running system:

```bash
# 1. Clone the repository
git clone https://github.com/yasirsabriroyal/projectmanagement.git
cd projectmanagement

# 2. Copy env files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 3. Start everything (seed runs automatically on first start)
docker-compose up --build

# 4. Visit http://localhost:3000
# Login: admin@constructflow.com / Admin123!
```

> **Seeding**: The database seed is controlled by the `RUN_SEED` environment variable (default: `true`).
> The seed is idempotent — re-running it is safe. To disable seeding in production, set `RUN_SEED=false`
> in your environment or in the `backend` service environment block of `docker-compose.yml`.

## Running Locally (without Docker)

### Backend

```bash
cd backend
npm install

# Set up your local .env
cp .env.example .env
# Edit .env: set DATABASE_URL to your local Postgres

# Run migrations
npm run migrate:dev

# Seed the database (creates admin user + roles/permissions)
npm run seed

# Start dev server
npm run dev
```

### Frontend

```bash
cd frontend
npm install

cp .env.example .env
# Edit .env if needed (default API URL is http://localhost:4000)

npm run dev
```

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `development` |
| `PORT` | HTTP port | `4000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://constructflow:constructflow@localhost:5432/constructflow` |
| `JWT_SECRET` | JWT signing secret (change in prod!) | — |
| `JWT_REFRESH_SECRET` | Refresh token secret | — |
| `JWT_EXPIRES_IN` | Access token TTL | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token TTL | `7d` |
| `FRONTEND_URL` | CORS allowed origin | `http://localhost:3000` |
| `LOG_LEVEL` | Winston log level | `info` |
| `BOOTSTRAP_MODE` | Allow unauthenticated registration | `false` |
| `RUN_SEED` | Run database seed on container startup | `true` |

### Frontend (`frontend/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:4000` |

## Database Migrations

```bash
cd backend

# Create a new migration (dev only)
npm run migrate:dev -- --name describe_your_change

# Apply existing migrations (production)
npm run migrate
```

## Seeding

The seed runs automatically on `docker compose up --build` when `RUN_SEED=true` (the default).
To run seed manually:

```bash
cd backend
npm run seed
```

To disable automatic seeding (e.g. in production), set `RUN_SEED=false` in the backend environment:

```bash
# docker-compose.yml backend environment, or your deployment env
RUN_SEED=false docker compose up
```

This creates:
- Default roles: `Admin`, `PM`, `Accountant`, `Ops`
- Permissions: `projects.read/write/delete`, `users.read/write/delete`, `organizations.read/write`, `memberships.read/write`
- Default organization: `Default Organization`
- Admin user: `admin@constructflow.com` / `Admin123!`

## Creating the First Admin (Manual)

If you need to create an admin without running seed, use the dedicated bootstrap endpoint.
It allows creation when either:
- No users exist yet (fresh database), OR
- The `X-Bootstrap-Admin-Secret` header matches `BOOTSTRAP_ADMIN_SECRET` in your env

```bash
# Works on a fresh DB (no users) without any secret header:
curl -X POST http://localhost:4000/api/v1/auth/bootstrap-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "SecurePass123!",
    "firstName": "Admin",
    "lastName": "User"
  }'

# Or supply the BOOTSTRAP_ADMIN_SECRET header (works even when users already exist):
curl -X POST http://localhost:4000/api/v1/auth/bootstrap-admin \
  -H "Content-Type: application/json" \
  -H "X-Bootstrap-Admin-Secret: your-bootstrap-secret" \
  -d '{
    "email": "admin2@example.com",
    "password": "SecurePass123!",
    "firstName": "Admin2",
    "lastName": "User"
  }'
```

The response includes `accessToken`, `refreshToken`, and the created `user` object, so you can
immediately authenticate as the new admin.

## Running Tests

```bash
cd backend

# Requires a running Postgres with DATABASE_URL set
npm test
```

Tests use the same database as development. Make sure migrations are applied first.

## API Endpoints

All endpoints are prefixed with `/api/v1`.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/health` | None | Health check |
| POST | `/auth/bootstrap-admin` | None/Secret | Create first admin user |
| POST | `/auth/register` | Bootstrap/Admin | Register user |
| POST | `/auth/login` | None | Login |
| POST | `/auth/refresh` | None | Refresh tokens |
| POST | `/auth/logout` | Auth | Logout |
| GET | `/me` | Auth | Current user profile |
| GET/POST | `/organizations` | Admin | List/create orgs |
| GET/PUT/DELETE | `/organizations/:id` | Admin | Get/update/delete org |
| GET/POST | `/users` | Admin | List/create users |
| GET/PUT/DELETE | `/users/:id` | Admin | Get/update/delete user |
| GET/POST | `/projects` | Auth+Permission | List/create projects |
| GET/PUT/DELETE | `/projects/:id` | Auth+Permission | Get/update/delete project |
| GET/POST | `/projects/:id/memberships` | Auth+Permission | Manage members |
| DELETE | `/projects/:id/memberships/:userId` | Auth+PM | Remove member |

## Idempotency

For `POST` endpoints that create resources, include an `Idempotency-Key` header:

```bash
curl -X POST http://localhost:4000/api/v1/projects \
  -H "Authorization: Bearer <token>" \
  -H "Idempotency-Key: my-unique-key-123" \
  -H "Content-Type: application/json" \
  -d '{"name": "My Project", "organizationId": "<org-id>"}'
```

Repeated requests with the same key return the original response (idempotent).

## RBAC Permissions

| Role | Permissions |
|------|-------------|
| Admin | All permissions |
| PM | projects.read/write, memberships.read/write, users.read |
| Accountant | projects.read, users.read |
| Ops | projects.read, memberships.read |

## Security Notes

- JWT tokens stored in `localStorage` (frontend). For production, consider httpOnly cookies via a Next.js API proxy.
- Always use strong `JWT_SECRET` and `JWT_REFRESH_SECRET` in production.
- Rate limiting is enabled (200 req/15min per IP).
- Helmet sets secure HTTP headers.
