# ConstructFlow System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Layer                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐              ┌──────────────────┐         │
│  │  Mobile Web App  │              │  Desktop Web App │         │
│  │  (React/Next.js) │              │  (React/Next.js) │         │
│  └────────┬─────────┘              └────────┬─────────┘         │
│           │                                  │                   │
└───────────┼──────────────────────────────────┼───────────────────┘
            │                                  │
            │            HTTPS / REST          │
            │                                  │
┌───────────▼──────────────────────────────────▼───────────────────┐
│                      API Gateway / Load Balancer                 │
└───────────┬──────────────────────────────────┬───────────────────┘
            │                                  │
    ┌───────▼────────┐              ┌─────────▼─────────┐
    │   Auth Service │              │  Domain Services  │
    │                │              │                   │
    │ - JWT Tokens   │              │ ┌───────────────┐ │
    │ - RBAC         │              │ │   Finance     │ │
    │ - Multi-tenant │              │ │   Service     │ │
    │   Context      │              │ └───────────────┘ │
    └────────┬───────┘              │                   │
             │                      │ ┌───────────────┐ │
             │                      │ │  Execution    │ │
             │                      │ │   Service     │ │
             │                      │ └───────────────┘ │
             │                      └─────────┬─────────┘
             │                                │
             │         ┌──────────────────────┘
             │         │
    ┌────────▼─────────▼────────┐
    │   PostgreSQL Database     │
    │                           │
    │  - Multi-tenant schema    │
    │  - Financial data         │
    │  - Audit logs             │
    │  - Replication enabled    │
    └────────┬──────────────────┘
             │
    ┌────────▼──────────┐
    │   Job Queue       │
    │  (Redis/RabbitMQ) │
    └────────┬──────────┘
             │
    ┌────────▼──────────────────┐
    │    Worker Services        │
    ├───────────────────────────┤
    │ - SMS Worker              │
    │ - Export Worker           │
    │ - Retry Worker            │
    └───────────────────────────┘
```

## Data Flow

### 1. Field Execution to Office Sync

```
Field Worker (Mobile)
    ↓ (Updates task progress)
Execution API
    ↓ (State machine validation)
PostgreSQL (Write)
    ↓ (Trigger)
Event Queue
    ↓ (Process)
Workers (Notifications, Exports)
    ↓ (Update)
Office Staff (Desktop)
```

### 2. Financial Transaction Flow

```
User Request (Invoice Creation)
    ↓
Finance API
    ↓ (Validation)
State Machine (Draft → Sent → Paid)
    ↓
PostgreSQL (Transaction)
    ↓ (Audit)
Audit Log
    ↓ (Async)
Job Queue (Email/SMS notification)
```

## Security Architecture

### Multi-Tenant Isolation

1. **Row-Level Security**: All tables include `tenant_id`
2. **Query Filtering**: Automatic tenant context injection
3. **API Gateway**: Tenant extraction from JWT token
4. **Database Constraints**: Foreign key enforcement

### Authentication Flow

```
User Login
    ↓
Auth Service
    ↓ (Validate credentials)
Database Lookup
    ↓ (Generate JWT with tenant_id)
Return Token
    ↓
Client Stores Token
    ↓ (Include in headers)
Subsequent Requests
    ↓ (Validate & extract tenant)
Domain Services
```

## Deployment Architecture

### Production Environment

```
┌─────────────────────────────────────────────────────┐
│                   Cloud Provider (AWS/GCP)          │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────────┐      ┌───────────────────┐  │
│  │   CloudFront/CDN │      │  Application LB   │  │
│  │   (Static Assets)│      │                   │  │
│  └──────────────────┘      └─────────┬─────────┘  │
│                                      │             │
│                          ┌───────────▼──────────┐  │
│                          │  ECS/Kubernetes      │  │
│                          │  (API Containers)    │  │
│                          │  - Auto-scaling      │  │
│                          │  - Health checks     │  │
│                          └───────────┬──────────┘  │
│                                      │             │
│  ┌───────────────────────────────────▼──────────┐  │
│  │         RDS PostgreSQL (Multi-AZ)            │  │
│  │         - Read replicas                      │  │
│  │         - Automated backups                  │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
│  ┌──────────────────┐      ┌───────────────────┐  │
│  │  ElastiCache     │      │  S3 Storage       │  │
│  │  (Redis Queue)   │      │  (Exports/Docs)   │  │
│  └──────────────────┘      └───────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## State Machine Design

### Task Status Transitions

```
[Pending] ──────────────────> [In Progress]
                                    │
                                    ├──> [Completed]
                                    │
                                    └──> [Blocked]
                                            │
                                            └──> [In Progress]

Monotonic Rule: Cannot move backward in primary flow
```

### Invoice Status Transitions

```
[Draft] ──> [Sent] ──> [Paid]
   │          │
   │          └──> [Overdue] ──> [Paid]
   │
   └──> [Cancelled]

Financial Integrity: State changes create audit log entries
```

## Scalability Considerations

1. **Horizontal Scaling**: Stateless API services behind load balancer
2. **Database Scaling**: Read replicas for reporting queries
3. **Caching**: Redis for session data and frequently accessed resources
4. **Async Processing**: Queue-based workers for long-running tasks
5. **CDN**: Static asset delivery for global performance

## Monitoring & Observability

- Application Performance Monitoring (APM)
- Structured logging with tenant context
- Database query performance tracking
- Worker job success/failure metrics
- Financial transaction audit trails
