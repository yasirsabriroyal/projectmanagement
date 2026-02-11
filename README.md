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
/api      # Domain Services (Finance, Execution, Auth)
/web      # Mobile-first React/Next.js Frontend
/workers  # Async jobs (SMS, Exports, Retries)
/infra    # DB Migrations (Postgres) and Terraform
/docs     # OpenAPI specs and ER diagrams
```

### 📁 /api - Domain Services

Backend services organized by domain:
- **finance/** - Financial management, invoicing, payments
- **execution/** - Project and task execution tracking
- **auth/** - Authentication and authorization

[View API Documentation →](./api/README.md)

### 📱 /web - Mobile-First Frontend

React/Next.js frontend optimized for mobile devices and field workers.

[View Web Documentation →](./web/README.md)

### ⚙️ /workers - Async Job Processing

Background job workers for:
- SMS notifications
- Data exports
- Retry mechanisms

[View Workers Documentation →](./workers/README.md)

### 🏗️ /infra - Infrastructure

Infrastructure as code and database management:
- **migrations/** - PostgreSQL schema migrations
- **terraform/** - Cloud infrastructure provisioning

[View Infrastructure Documentation →](./infra/README.md)

### 📚 /docs - Documentation

Technical documentation and specifications:
- **openapi/** - API specifications for all services
- **diagrams/** - ER diagrams and architecture documentation

[View Documentation →](./docs/README.md)

## Key Features

- ✅ Multi-tenant architecture with complete data isolation
- ✅ Real-time synchronization between field and office
- ✅ Mobile-optimized interface for field workers
- ✅ Comprehensive financial management
- ✅ Project and task tracking with state machines
- ✅ Audit trails for compliance
- ✅ RESTful APIs with OpenAPI documentation

## Getting Started

Detailed setup instructions are available in each component's README:

1. [API Setup](./api/README.md)
2. [Web Frontend Setup](./web/README.md)
3. [Infrastructure Setup](./infra/README.md)

## Technology Stack

- **Backend**: [To be defined - Node.js/Python/Go]
- **Frontend**: React, Next.js
- **Database**: PostgreSQL
- **Infrastructure**: Terraform
- **Queue System**: [To be defined]

## Contributing

[Contributing guidelines to be added]

## License

[License information to be added] 
